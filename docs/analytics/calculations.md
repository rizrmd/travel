# Analytics Calculations Documentation

## Epic 11: Operational Intelligence Dashboard

This document explains all calculation algorithms and formulas used in the analytics system.

---

## 1. Revenue Metrics Calculations

### 1.1 Total Revenue
```typescript
totalRevenue = SUM(payments.amount WHERE status = 'confirmed' AND payment_date IN period)
```

### 1.2 Percentage Change
```typescript
percentageChange = ((currentPeriod - previousPeriod) / previousPeriod) * 100

// Special cases:
- If previousPeriod = 0 and currentPeriod > 0: return 100
- If previousPeriod = 0 and currentPeriod = 0: return 0
```

### 1.3 Trend Determination
```typescript
if (percentageChange > 5): trend = 'up'
else if (percentageChange < -5): trend = 'down'
else: trend = 'stable'
```

### 1.4 Revenue Breakdown by Package
```typescript
packageRevenue = SUM(payments.amount GROUP BY package_id)
packagePercentage = (packageRevenue / totalRevenue) * 100
```

### 1.5 Revenue Breakdown by Agent
```typescript
agentRevenue = SUM(payments.amount WHERE jamaah.agent_id = X)
agentPercentage = (agentRevenue / totalRevenue) * 100
```

---

## 2. Revenue Projection Algorithm

### 2.1 Base Projection Formula
```typescript
projection = (avgMonthlyRevenueLast3Months * 0.7) +
             (pendingInstallments * 0.9) +
             (pipelinePotential * 0.3)
```

**Components:**
- `avgMonthlyRevenueLast3Months`: Average monthly revenue from last 3 months
- `pendingInstallments`: Total remaining payments from partially paid jamaah
- `pipelinePotential`: Weighted potential from pipeline (leads + interested)

**Default Weights:**
- Historical weight: 0.7 (70%)
- Pending installments weight: 0.9 (90%)
- Pipeline potential weight: 0.3 (30%)

### 2.2 Pending Installments Calculation
```typescript
FOR EACH jamaah WHERE status IN ('deposit_paid', 'partially_paid'):
  totalPaid = SUM(payments.amount WHERE jamaah_id = jamaah.id)
  packagePrice = jamaah.package.retail_price
  remaining = packagePrice - totalPaid

pendingInstallments = SUM(remaining FOR ALL jamaah)
```

### 2.3 Confidence Interval
```typescript
// Base interval (85% - 115%)
lowerBound = projection * 0.85
upperBound = projection * 1.15

// Adjust for data quality
if (historicalMonths < 3):
  lowerBound = projection * 0.75  // Wider interval
  upperBound = projection * 1.25
```

### 2.4 Trend-Adjusted Projection
```typescript
// Calculate linear regression trend
n = number of months
sumX = SUM(month indices)
sumY = SUM(revenues)
sumXY = SUM(index * revenue)
sumX2 = SUM(index²)

slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX²)
avgRevenue = sumY / n
growthRate = slope / avgRevenue

// Apply compound growth
FOR month = 1 to N:
  adjustedProjection[month] = baseProjection * (1 + growthRate)^month
```

---

## 3. Pipeline Potential Calculations

### 3.1 Pipeline Status Weights
```typescript
WEIGHTS = {
  'lead': 0.1,          // 10% likelihood
  'interested': 0.2,    // 20% likelihood
  'deposit_paid': 0.7,  // 70% likelihood
  'partially_paid': 0.9 // 90% likelihood
}
```

### 3.2 Weighted Pipeline Potential
```typescript
weightedPotential = SUM(
  FOR EACH jamaah IN pipeline:
    jamaah.packagePrice * WEIGHTS[jamaah.status]
)
```

### 3.3 Total (Unweighted) Potential
```typescript
totalPotential = SUM(jamaah.packagePrice FOR ALL jamaah IN pipeline)
```

### 3.4 Pipeline Funnel Conversions
```typescript
leadToInterested = (interestedCount / leadCount) * 100
interestedToDeposit = (depositCount / interestedCount) * 100
depositToPartial = (partialCount / depositCount) * 100
partialToFull = (fullCount / partialCount) * 100

overallConversion = (fullCount / leadCount) * 100
```

---

## 4. Agent Performance Metrics

### 4.1 Conversion Rate
```typescript
conversionRate = (fullyPaidCount / totalJamaahCount) * 100

// Special case:
if (totalJamaahCount = 0): return 0
```

### 4.2 Average Deal Size
```typescript
averageDealSize = totalRevenue / fullyPaidCount

// Special case:
if (fullyPaidCount = 0): return 0
```

### 4.3 Revenue Generated
```typescript
revenueGenerated = SUM(
  payments.amount
  WHERE jamaah.agent_id = agentId
  AND payment.status = 'confirmed'
)
```

### 4.4 Performance Trend
```typescript
// Group by week
FOR EACH week IN period:
  weekJamaah = jamaah created in week
  weekFullyPaid = jamaah with status 'fully_paid' in week
  weekPayments = SUM(payments for week's jamaah)

  trend[week] = {
    conversionRate: (weekFullyPaid / weekJamaah) * 100,
    revenue: weekPayments,
    jamaahCount: weekJamaah
  }
```

---

## 5. Leaderboard Rankings

### 5.1 Ranking by Revenue
```typescript
FOR EACH agent:
  score = SUM(payments.amount WHERE jamaah.agent_id = agent.id)

SORT agents BY score DESC
ASSIGN rank = 1, 2, 3, ...
```

### 5.2 Ranking by Jamaah Count
```typescript
FOR EACH agent:
  score = COUNT(jamaah WHERE agent_id = agent.id)

SORT agents BY score DESC
```

### 5.3 Ranking by Conversion Rate
```typescript
FOR EACH agent:
  totalJamaah = COUNT(jamaah WHERE agent_id = agent.id)
  fullyPaid = COUNT(jamaah WHERE agent_id = agent.id AND status = 'fully_paid')
  score = (fullyPaid / totalJamaah) * 100

SORT agents BY score DESC
```

### 5.4 Badge Assignment
```typescript
if (rank = 1): badge = 'gold'
else if (rank = 2): badge = 'silver'
else if (rank = 3): badge = 'bronze'
else: badge = null
```

### 5.5 Rank Change Calculation
```typescript
rankChange = previousRank - currentRank

// Positive number means improvement (moved up)
// Negative number means decline (moved down)
// 0 means no change
```

---

## 6. Period Date Ranges

### 6.1 Today
```typescript
start = TODAY at 00:00:00
end = TODAY at 23:59:59
```

### 6.2 Week (Current Week)
```typescript
start = START_OF_WEEK (Sunday) at 00:00:00
end = CURRENT_DATETIME
```

### 6.3 Month (Current Month)
```typescript
start = FIRST_DAY_OF_MONTH at 00:00:00
end = CURRENT_DATETIME
```

### 6.4 Year (Current Year)
```typescript
start = JANUARY_1 at 00:00:00
end = CURRENT_DATETIME
```

### 6.5 Previous Period
```typescript
duration = end - start
previousEnd = start - 1 millisecond
previousStart = previousEnd - duration
```

### 6.6 Leaderboard Periods

**Monthly:**
```typescript
start = FIRST_DAY_OF_CURRENT_MONTH at 00:00:00
end = LAST_DAY_OF_CURRENT_MONTH at 23:59:59
```

**Quarterly:**
```typescript
quarter = FLOOR(currentMonth / 3)
start = FIRST_DAY_OF_QUARTER at 00:00:00
end = LAST_DAY_OF_QUARTER at 23:59:59
```

**Yearly:**
```typescript
start = JANUARY_1_OF_CURRENT_YEAR at 00:00:00
end = DECEMBER_31_OF_CURRENT_YEAR at 23:59:59
```

---

## 7. Caching Strategy

### 7.1 Cache Keys
```typescript
// Revenue metrics
`tenant:{tenantId}:analytics:revenue:{period}`
// TTL: 5 minutes (300,000 ms)

// Leaderboard
`tenant:{tenantId}:analytics:leaderboard:{metric}:{period}`
// TTL: 1 hour (3,600,000 ms)

// Pipeline
`tenant:{tenantId}:analytics:pipeline:{filters}`
// TTL: 15 minutes (900,000 ms)
```

### 7.2 Cache Invalidation Rules
```typescript
ON payment_confirmed:
  - Invalidate: revenue cache
  - Invalidate: leaderboard cache

ON jamaah_status_changed:
  - Invalidate: pipeline cache
  - Invalidate: leaderboard cache

ON hour_boundary:
  - Invalidate: leaderboard cache (via background job)
```

---

## 8. Daily Snapshot Aggregations

### 8.1 Total Revenue Snapshot
```typescript
totalRevenue = SUM(
  payments.amount
  WHERE date(payment_date) = snapshotDate
  AND status = 'confirmed'
)
```

### 8.2 Package Breakdown Snapshot
```typescript
FOR EACH package:
  packageBreakdown[packageId] = {
    packageName: package.name,
    revenue: SUM(payments.amount),
    count: COUNT(payments)
  }
```

### 8.3 Agent Breakdown Snapshot
```typescript
FOR EACH agent:
  uniqueJamaah = COUNT(DISTINCT jamaah_id)
  agentBreakdown[agentId] = {
    agentName: agent.name,
    revenue: SUM(payments.amount),
    jamaahCount: uniqueJamaah,
    paymentCount: COUNT(payments)
  }
```

### 8.4 Month-to-Date Revenue
```typescript
MTD = SUM(
  payments.amount
  WHERE payment_date >= FIRST_DAY_OF_MONTH
  AND payment_date <= snapshotDate
)
```

### 8.5 Year-to-Date Revenue
```typescript
YTD = SUM(
  payments.amount
  WHERE payment_date >= JANUARY_1
  AND payment_date <= snapshotDate
)
```

---

## 9. Timezone Considerations

**All timestamps use Asia/Jakarta timezone (UTC+7)**

### 9.1 Cron Jobs
```typescript
// Daily snapshot: runs at midnight Jakarta time
cron: '0 0 * * *'
timezone: 'Asia/Jakarta'

// Leaderboard update: runs every hour Jakarta time
cron: '0 * * * *'
timezone: 'Asia/Jakarta'
```

### 9.2 Date Comparisons
All date comparisons are inclusive:
```typescript
WHERE payment_date >= startDate AND payment_date <= endDate
```

---

## 10. Performance Optimizations

### 10.1 Database Indexes
```sql
-- Analytics events
CREATE INDEX ON analytics_events (tenant_id, event_type, created_at);
CREATE INDEX ON analytics_events (tenant_id, entity_type, entity_id);
CREATE INDEX ON analytics_events USING GIN (metadata);

-- Revenue snapshots
CREATE INDEX ON revenue_snapshots (tenant_id, snapshot_date);
CREATE INDEX ON revenue_snapshots USING GIN (package_breakdown);
CREATE INDEX ON revenue_snapshots USING GIN (agent_breakdown);

-- Filter presets
CREATE INDEX ON filter_presets (tenant_id, user_id, is_public);
CREATE INDEX ON filter_presets USING GIN (filters);
```

### 10.2 Query Optimization
- Use daily snapshots for historical data (avoid real-time aggregation)
- Cache frequently accessed metrics
- Pre-warm leaderboard cache every hour
- Use JSONB indexes for metadata queries

---

## 11. Accuracy & Precision

### 11.1 Currency Handling
- All currency values use DECIMAL(12,2)
- Maximum value: 9,999,999,999.99 (~ 10 billion)
- Precision: 2 decimal places (Rupiah cents)

### 11.2 Percentage Rounding
- Percentages calculated to 2 decimal places
- Example: 75.55%, 33.33%

### 11.3 Projection Confidence
- Confidence intervals widen with less historical data
- Minimum 3 months data recommended for accurate projections
- Trend adjustment applied using linear regression

---

## References

- Epic 11 Requirements: `/docs/epics.md`
- Domain Models: `/src/analytics/domain/`
- Service Implementations: `/src/analytics/services/`
- Background Jobs: `/src/analytics/jobs/`
