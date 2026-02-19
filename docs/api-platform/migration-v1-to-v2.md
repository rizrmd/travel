# API Migration Guide: v1 to v2

## Overview

This guide will help you migrate from API v1 to v2 when it becomes available. Currently, v1 is the only version, but this document serves as a template for future migrations.

## Important Dates

| Milestone | Date | Notes |
|-----------|------|-------|
| **v2 Release** | TBD | New version available |
| **v1 Deprecation Notice** | TBD | 6 months before EOL |
| **v1 End of Life (EOL)** | TBD | v1 will no longer work |

## Version Support Policy

- **Active Support**: Latest version receives new features and bug fixes
- **Security Support**: Previous version receives security updates only
- **Deprecation Period**: 12 months notice before version retirement
- **Migration Window**: Minimum 6 months to migrate

## Breaking Changes (Placeholder)

This section will be updated when v2 is released. Typical breaking changes include:

### 1. Authentication Changes
- OAuth 2.0 flow modifications
- API key format changes
- New required headers

### 2. Endpoint Changes
- URL path modifications
- Renamed or removed endpoints
- New required parameters

### 3. Response Format Changes
- Modified data structures
- Removed fields
- New required fields

### 4. Webhook Changes
- New event types
- Changed payload formats
- Modified signature algorithm

## Migration Checklist

- [ ] Review breaking changes documentation
- [ ] Update API base URL to v2
- [ ] Update authentication implementation
- [ ] Update request/response handling
- [ ] Update webhook handlers
- [ ] Test all endpoints in sandbox
- [ ] Update error handling for new error codes
- [ ] Monitor logs for deprecation warnings
- [ ] Update documentation and examples
- [ ] Deploy to production
- [ ] Monitor for issues

## Step-by-Step Migration

### Step 1: Assess Current Usage

Identify which v1 endpoints your application uses:

```bash
# Review API request logs
GET /api-platform/developers/dashboard

# Check popular endpoints
GET /api-platform/keys/:id/usage
```

### Step 2: Test in Sandbox

Always test v2 changes in sandbox first:

```javascript
const config = {
  // Switch to v2 sandbox
  baseURL: 'https://sandbox-api.travelumroh.com/public/v2',
  apiKey: process.env.SANDBOX_API_KEY,
};

// Test all critical endpoints
await testJamaahEndpoints(config);
await testPaymentEndpoints(config);
await testWebhooks(config);
```

### Step 3: Implement Gradual Migration

Use feature flags to gradually switch to v2:

```javascript
const API_VERSION = process.env.API_VERSION || 'v1';

const client = new TravelUmrohClient({
  baseURL: `https://api.travelumroh.com/public/${API_VERSION}`,
  apiKey: process.env.API_KEY,
});
```

### Step 4: Monitor and Rollback

Monitor error rates after deploying v2:

```javascript
// Track v2 API errors
const errorRate = await analytics.getErrorRate('api_v2');

if (errorRate > THRESHOLD) {
  console.error('High v2 error rate, rolling back to v1');
  await rollbackToV1();
}
```

## Backward Compatibility

### Running Both Versions

You can run v1 and v2 simultaneously during migration:

```javascript
class DualVersionClient {
  constructor() {
    this.v1Client = new TravelUmrohClient({
      baseURL: 'https://api.travelumroh.com/public/v1',
      apiKey: process.env.API_KEY,
    });

    this.v2Client = new TravelUmrohClient({
      baseURL: 'https://api.travelumroh.com/public/v2',
      apiKey: process.env.API_KEY,
    });
  }

  async getJamaah(id) {
    if (features.isEnabled('api_v2')) {
      return this.v2Client.getJamaah(id);
    }
    return this.v1Client.getJamaah(id);
  }
}
```

## Common Migration Patterns

### Pattern 1: Adapter Pattern

Create adapters to handle version differences:

```javascript
class JamaahAdapter {
  static toV2Format(v1Jamaah) {
    // Convert v1 format to v2
    return {
      id: v1Jamaah.id,
      fullName: v1Jamaah.name, // v2 uses fullName
      contact: {
        email: v1Jamaah.email,
        phone: v1Jamaah.phone,
      },
      // ... other transformations
    };
  }

  static fromV2Format(v2Jamaah) {
    // Convert v2 format back to v1 for legacy code
    return {
      id: v2Jamaah.id,
      name: v2Jamaah.fullName,
      email: v2Jamaah.contact.email,
      phone: v2Jamaah.contact.phone,
      // ... other transformations
    };
  }
}
```

### Pattern 2: Feature Flags

Use feature flags to control version usage:

```javascript
const features = {
  api_v2_jamaah: false,
  api_v2_payments: false,
  api_v2_webhooks: false,
};

async function getJamaah(id) {
  if (features.api_v2_jamaah) {
    return apiV2.getJamaah(id);
  }
  return apiV1.getJamaah(id);
}
```

## Testing Strategy

### Unit Tests

Update unit tests for v2:

```javascript
describe('Jamaah API v2', () => {
  it('should create jamaah with v2 format', async () => {
    const jamaah = await api.createJamaah({
      fullName: 'Ahmad Rizki',
      contact: {
        email: 'ahmad@example.com',
        phone: '081234567890',
      },
    });

    expect(jamaah.fullName).toBe('Ahmad Rizki');
    expect(jamaah.contact.email).toBe('ahmad@example.com');
  });
});
```

### Integration Tests

Test complete workflows with v2:

```javascript
describe('Payment Flow v2', () => {
  it('should complete payment workflow', async () => {
    // Create jamaah
    const jamaah = await api.v2.createJamaah({...});

    // Create payment
    const payment = await api.v2.createPayment({...});

    // Verify webhook delivered
    const webhooks = await api.v2.getWebhookDeliveries();
    expect(webhooks).toContainEvent('payment.confirmed');
  });
});
```

## Deprecation Warnings

Monitor v1 deprecation warnings:

```javascript
// v1 responses include deprecation headers
const response = await api.get('/public/v1/jamaah');

if (response.headers['x-api-deprecated']) {
  logger.warn('Using deprecated v1 API', {
    endpoint: '/public/v1/jamaah',
    deprecationDate: response.headers['x-api-deprecated-date'],
    sunsetDate: response.headers['x-api-sunset-date'],
  });
}
```

## Rollback Plan

Have a rollback plan ready:

```javascript
const ROLLBACK_PROCEDURE = {
  1: 'Set API_VERSION environment variable to v1',
  2: 'Restart application servers',
  3: 'Verify v1 endpoints working',
  4: 'Monitor error rates',
  5: 'Notify team of rollback',
};

async function rollbackToV1() {
  console.log('Initiating rollback to v1...');

  // Update configuration
  await updateConfig({ API_VERSION: 'v1' });

  // Restart services
  await restartServices();

  // Verify health
  const health = await checkV1Health();
  if (!health.ok) {
    throw new Error('Rollback failed: v1 unhealthy');
  }

  console.log('Successfully rolled back to v1');
}
```

## Support During Migration

### Migration Support Services

- **Email Support**: api-support@travelumroh.com
- **Dedicated Slack Channel**: #api-v2-migration
- **Office Hours**: Weekly Q&A sessions
- **Migration Assistance**: 1-on-1 support for enterprise customers

### Resources

- **Migration Documentation**: https://docs.travelumroh.com/v2/migration
- **API Changelog**: https://docs.travelumroh.com/changelog
- **Code Examples**: https://github.com/travelumroh/api-examples-v2
- **Video Tutorials**: https://youtube.com/travelumroh-api

## FAQ

### Q: Can I use v1 and v2 at the same time?
**A:** Yes, you can make requests to both versions simultaneously during migration.

### Q: Will my v1 API keys work with v2?
**A:** Yes, existing API keys work with both versions.

### Q: What happens to my webhooks during migration?
**A:** Webhooks continue working with v1. Update webhook subscriptions when ready for v2.

### Q: How long do I have to migrate?
**A:** You'll have a minimum of 12 months from v2 release to v1 EOL.

### Q: Will there be breaking changes in minor versions?
**A:** No, breaking changes only occur in major versions (v1 → v2).

## Checklist Before v2 Migration

- [ ] Read complete migration documentation
- [ ] Review breaking changes list
- [ ] Test all endpoints in v2 sandbox
- [ ] Update authentication code
- [ ] Update request/response handlers
- [ ] Update webhook implementations
- [ ] Update error handling
- [ ] Run integration test suite
- [ ] Implement rollback procedure
- [ ] Update monitoring and alerts
- [ ] Brief team on changes
- [ ] Schedule deployment
- [ ] Monitor after deployment

---

**Note:** This is a placeholder document. Actual migration instructions will be provided when v2 is released.

**Last Updated:** December 23, 2025
**Next Review:** When v2 is announced
