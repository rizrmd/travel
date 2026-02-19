# Panduan Metrics Adopsi Platform

## Ringkasan
Dashboard adoption metrics memberikan insight tentang penggunaan platform oleh tim Anda, membantu mengidentifikasi area yang perlu ditingkatkan dan user yang membutuhkan dukungan tambahan.

## Metrik Utama

### 1. Active Users Percentage
**Definisi:** Persentase user yang login dalam 7 hari terakhir

**Formula:**
```
Active Users % = (Users Login dalam 7 hari / Total Users) × 100
```

**Target:**
- Excellent: > 80%
- Good: 60-80%
- Need Improvement: 40-60%
- Critical: < 40%

**Cara Meningkatkan:**
- Kirim reminder email mingguan
- Gamification (badges, points)
- Mandatory daily check-in
- Push notifications untuk tasks penting

### 2. Training Completion Rate
**Definisi:** Persentase user yang menyelesaikan semua materi training wajib

**Formula:**
```
Training Completion % = (Users Completed Mandatory Training / Total Users) × 100
```

**Target:**
- Excellent: > 90%
- Good: 70-90%
- Need Improvement: 50-70%
- Critical: < 50%

**Cara Meningkatkan:**
- Set deadline untuk mandatory training
- Lock fitur tertentu sampai training selesai
- Reminder otomatis setiap hari
- Incentive untuk early completion

### 3. Average Session Duration
**Definisi:** Rata-rata durasi session user di platform

**Formula:**
```
Avg Session Duration = Total Session Time / Number of Sessions
```

**Target:**
- Productive: 15-30 menit
- Quick tasks: 5-15 menit
- Deep work: > 30 menit
- Too short: < 5 menit (mungkin ada issue)

**Interpretasi:**
- Terlalu pendek: User kesulitan menemukan fitur atau ada blocker
- Terlalu panjang: Workflow tidak efisien atau UI/UX perlu improvement
- Ideal: 15-30 menit untuk daily tasks

### 4. Feature Usage
**Definisi:** Fitur mana yang paling sering digunakan

**Top Features:**
- Jamaah Management
- Payment Processing
- Document Upload
- Reports/Analytics
- WhatsApp Integration

**Analisis:**
- Fitur jarang digunakan: Apakah tidak diperlukan atau sulit diakses?
- Fitur sering digunakan: Pastikan optimal dan bug-free

### 5. Inactive Users
**Definisi:** User yang tidak login dalam 14 hari terakhir

**Kategori:**
- Recently Inactive: 7-14 hari
- Moderately Inactive: 14-30 hari
- Highly Inactive: > 30 hari
- Dormant: > 60 hari

**Action Plan:**
- Recently Inactive: Email reminder + check if ada blocker
- Moderately Inactive: Personal call dari manager
- Highly Inactive: One-on-one training session
- Dormant: Account review + possible deactivation

## Dashboard Analytics

### Overview Section

**Tampilan:**
```
┌─────────────────────────────────────────┐
│ ADOPTION OVERVIEW (Last 7 Days)        │
├─────────────────────────────────────────┤
│ Total Users: 50                         │
│ Active Users: 42 (84%)                  │
│ Training Completion: 38 (76%)           │
│ Avg Session Duration: 18 minutes        │
└─────────────────────────────────────────┘
```

### Activity Breakdown

**By Type:**
- Login/Logout: 45%
- Jamaah Management: 25%
- Payment Processing: 15%
- Document Management: 10%
- Reports: 5%

**Interpretation:**
- Normal distribution menunjukkan platform digunakan untuk core activities
- Jika login/logout terlalu tinggi: User mungkin logout terlalu cepat (check UX)

### Daily Active Users Trend

**Chart:**
```
Users
 50 │              ●
    │         ●    │
    │    ●    │    │    ●
 40 │    │    │    │    │    ●
    │───┼────┼────┼────┼────┼───
      Mon Tue Wed Thu Fri Sat Sun
```

**Insight:**
- Weekday vs weekend usage
- Drop di hari tertentu bisa indicate masalah
- Tren naik: Good adoption
- Tren turun: Perlu investigation

## User Activity Logs

### Per-User Analysis

**Data yang Dicatat:**
- Login/Logout times
- Pages visited
- Features used
- Documents uploaded
- Transactions created
- Time spent per page

**Use Cases:**
1. **Performance Review:**
   - User A: 100 jamaah created, 50 payments processed
   - User B: 20 jamaah created, 10 payments processed

2. **Identifying Power Users:**
   - Users yang konsisten aktif
   - Bisa jadi champion/trainer untuk user lain

3. **Finding Struggling Users:**
   - Login tapi activity rendah
   - Perlu additional training atau support

## Strategi Meningkatkan Adoption

### 1. Onboarding Program

**Week 1: Foundation**
- Hari 1: Platform tour (mandatory)
- Hari 2: Create first jamaah (guided)
- Hari 3: Process first payment
- Hari 4: Upload documents
- Hari 5: Review & Q&A

**Week 2: Intermediate**
- Hari 1: Bulk operations
- Hari 2: Reports & analytics
- Hari 3: WhatsApp integration
- Hari 4: Advanced features
- Hari 5: Best practices

### 2. Continuous Engagement

**Daily:**
- Morning summary email (pending tasks)
- Real-time notifications (important updates)

**Weekly:**
- Performance summary
- Top performers leaderboard
- New feature announcements

**Monthly:**
- Adoption metrics review
- Training refreshers
- Feedback collection

### 3. Support Tiers

**Tier 1: Self-Service**
- FAQ & Knowledge Base
- Video tutorials
- In-app help

**Tier 2: Community**
- User forum
- Peer support
- Best practice sharing

**Tier 3: Direct Support**
- Email support
- WhatsApp support
- Video call sessions

### 4. Incentivization

**Individual Incentives:**
- Completion badges
- Certification
- Public recognition

**Team Incentives:**
- Team adoption rate goals
- Competition between branches
- Rewards for high adoption teams

## Metrics Dashboard Access

### For Admins/Owners

**Full Access:**
- All metrics
- User-level detail
- Export capabilities
- Historical data

**URL:**
```
/api/v1/onboarding/analytics/adoption
```

### For Managers

**Team-Level:**
- Team aggregate metrics
- Individual team member summary
- No detailed activity logs (privacy)

### For Agents

**Self-Only:**
- Personal progress
- Training completion
- Feature usage comparison with peers

## Alerts & Notifications

### Automated Alerts

**Critical Alerts (Sent to Admin):**
- Active users < 50%
- Training completion < 50%
- Multiple users inactive > 30 days

**Warning Alerts:**
- Active users 50-70%
- Training completion 50-70%
- Feature usage anomaly

### User Notifications

**Training Reminders:**
- "You have 3 mandatory trainings pending"
- "Complete training to unlock advanced features"

**Inactivity Reminders:**
- Day 7: "We miss you! Check your pending tasks"
- Day 14: "Your manager wants to check in"
- Day 30: "Account review scheduled"

## Best Practices

### 1. Regular Review
- Review metrics weekly
- Identify trends early
- Act on insights quickly

### 2. Data-Driven Decisions
- Use metrics to guide training focus
- Identify which features need improvement
- Allocate support resources effectively

### 3. Privacy & Ethics
- Respect user privacy
- Use data for support, not surveillance
- Transparent about what's tracked

### 4. Continuous Improvement
- Survey users about pain points
- A/B test new features
- Iterate based on feedback

## Reporting

### Weekly Report Template

```markdown
# Weekly Adoption Report - Week of [Date]

## Executive Summary
- Active Users: X% (↑/↓ Y% from last week)
- Training Completion: X% (↑/↓ Y% from last week)
- Avg Session Duration: X minutes

## Highlights
- [Positive achievement]
- [Area of concern]
- [Action items]

## Inactive Users
- [User 1]: Last login X days ago - Action: [Plan]
- [User 2]: Last login X days ago - Action: [Plan]

## Next Steps
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]
```

## Export & Integration

### CSV Export

**Included Data:**
- All metrics
- User-level breakdown
- Time-series data

**Use Cases:**
- Management reporting
- Data analysis in Excel
- Integration with other tools

### API Access

```bash
# Get adoption metrics
GET /api/v1/onboarding/analytics/adoption?days=30

# Get inactive users
GET /api/v1/onboarding/analytics/inactive-users?days=14

# Get user activity
GET /api/v1/onboarding/analytics/users/{id}/activity
```

## Troubleshooting

### Low Active User Rate

**Possible Causes:**
- Platform too complex
- Missing key features
- Performance issues
- Lack of training

**Investigation Steps:**
1. Survey inactive users
2. Review support tickets
3. Check error logs
4. Conduct user interviews

### Low Training Completion

**Possible Causes:**
- Training too long
- Not relevant to user role
- Technical issues accessing materials
- Lack of motivation

**Solutions:**
- Shorten training modules
- Role-specific training paths
- Fix technical barriers
- Add incentives

## Support

**Questions about metrics?**
- Email: analytics@travelumroh.com
- WhatsApp: 0812-3456-7890
- Documentation: https://docs.travelumroh.com/analytics
