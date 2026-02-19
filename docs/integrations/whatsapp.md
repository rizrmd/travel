# WhatsApp Business API Integration - Phase 2 Implementation Guide

**Status:** Planned for Phase 2
**Priority:** High  
**Estimated Effort:** 3-4 weeks
**Target Release:** Q2 2025

---

## Overview

WhatsApp Business API integration will enable:
- Bidirectional messaging between platform and jamaah
- Automated payment reminders via WhatsApp
- Broadcast messages to jamaah groups
- Template message approval workflow
- Integration with AI chatbot for automated responses
- Message sync with CRM (full conversation history)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         Travel Umroh Platform               │
│  ┌──────────────────────────────────────┐   │
│  │   WhatsApp Service (NestJS)          │   │
│  │   - Send messages                    │   │
│  │   - Handle webhooks                  │   │
│  │   - Sync conversations               │   │
│  └──────────────────────────────────────┘   │
│               │                              │
└───────────────│──────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│     WhatsApp Business API (Meta)            │
│  ┌──────────────────────────────────────┐   │
│  │   Cloud API / On-Premise API         │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│          Jamaah WhatsApp Clients            │
└─────────────────────────────────────────────┘
```

---

## Setup Guide

### 1. WhatsApp Business API Registration

**Option A: Meta Cloud API (Recommended)**
- Create Meta Business Account
- Add WhatsApp product
- Get phone number ID
- Generate access token
- Cost: Free tier available, then pay-per-message

**Option B: On-Premise API**
- Partner with WhatsApp BSP (Business Solution Provider)
- Deploy on-premise infrastructure
- Higher setup cost, but more control

### 2. Verify Business

Required documents:
- Business registration (SIUP, TDP, NPWP)
- Phone number proof of ownership
- Business profile (name, address, description)

Processing time: 1-3 business days

### 3. Configure Webhook

```typescript
// Webhook endpoint configuration
@Post('whatsapp/webhook')
async handleWebhook(@Body() payload: WhatsAppWebhookPayload) {
  // Verify webhook signature
  if (!this.verifySignature(payload)) {
    throw new UnauthorizedException('Invalid webhook signature');
  }

  // Handle different message types
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field === 'messages') {
        await this.handleIncomingMessage(change.value);
      }
    }
  }

  return { status: 'ok' };
}
```

Webhook URL: `https://api.travelumroh.com/api/v1/whatsapp/webhook`

---

## Template Message Approval

### Template Categories

1. **Account Updates** (Auto-approved)
   - Registration confirmation
   - Profile updates

2. **Payment Updates** (Auto-approved)
   - Payment confirmation
   - Receipt notification

3. **Shipping Updates** (Auto-approved)
   - Document ready
   - Visa status

4. **Alerts & Reminders** (Requires approval)
   - Payment reminders
   - Departure reminders

### Sample Templates

**Payment Confirmation:**
```
Assalamu'alaikum {{1}},

Terima kasih atas pembayaran Anda sebesar Rp {{2}} untuk paket {{3}}.

Sisa pembayaran: Rp {{4}}
Status: {{5}}

Untuk info lebih lanjut, hubungi kami.

Travel Umroh
```

**Payment Reminder:**
```
Assalamu'alaikum {{1}},

Pengingat cicilan paket {{2}}:
- Jatuh tempo: {{3}}
- Jumlah: Rp {{4}}

Mohon lakukan pembayaran sebelum tanggal jatuh tempo.

Jazakallah khairan,
{{5}} - {{6}}
```

### Template Submission Process

1. Create template in Meta Business Manager
2. Submit for approval
3. Processing time: 1-2 business days
4. Once approved, use template ID in API calls

---

## Message Types

### 1. Text Messages

```typescript
async sendTextMessage(to: string, message: string) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
}
```

### 2. Template Messages

```typescript
async sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components: Array<any>,
) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
}
```

### 3. Media Messages (Image, Document, PDF)

```typescript
async sendDocument(to: string, documentUrl: string, caption?: string) {
  return await axios.post(
    `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: {
        link: documentUrl,
        caption,
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
}
```

---

## Use Cases

### Use Case 1: Payment Reminder (Story 7.3)

```typescript
@Injectable()
export class PaymentReminderService {
  async sendWhatsAppReminder(reminder: PaymentReminder) {
    const jamaah = await this.jamaahRepository.findOne(reminder.jamaahId);
    const schedule = await this.scheduleRepository.findOne(reminder.scheduleId);

    // Send template message
    await this.whatsappService.sendTemplateMessage(
      jamaah.phone, // Must be in format: 62812XXXXXXXX
      'payment_reminder',
      'id',
      [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: jamaah.name },
            { type: 'text', text: schedule.package.name },
            { type: 'text', text: format(schedule.dueDate, 'dd MMM yyyy') },
            { type: 'text', text: formatCurrency(schedule.amount) },
            { type: 'text', text: jamaah.agent.name },
            { type: 'text', text: jamaah.agent.phone },
          ],
        },
      ],
    );

    // Update reminder status
    reminder.status = 'sent';
    reminder.sentAt = new Date();
    reminder.channel = 'whatsapp';
    await this.reminderRepository.save(reminder);
  }
}
```

### Use Case 2: Broadcast Message to Jamaah Group

```typescript
async broadcastDepartureReminder(packageId: string, departureDate: Date) {
  const jamaah = await this.jamaahRepository.find({
    where: { packageId, status: 'ready' },
  });

  // Send in batches to avoid rate limits
  const batches = chunk(jamaah, 20); // 20 messages per batch

  for (const batch of batches) {
    await Promise.all(
      batch.map(j =>
        this.whatsappService.sendTemplateMessage(
          j.phone,
          'departure_reminder',
          'id',
          [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: j.name },
                { type: 'text', text: format(departureDate, 'dd MMM yyyy') },
                { type: 'text', text: j.package.name },
              ],
            },
          ],
        ),
      ),
    );

    // Rate limiting: 80 messages per second (Cloud API tier 2)
    await sleep(1000);
  }
}
```

### Use Case 3: Bidirectional Conversation Sync

```typescript
@Post('webhook')
async handleWebhook(@Body() payload: WhatsAppWebhookPayload) {
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field === 'messages') {
        const message = change.value.messages[0];
        const from = message.from;

        // Find jamaah by phone number
        const jamaah = await this.jamaahRepository.findOne({
          where: { phone: from },
        });

        if (!jamaah) {
          // Unknown sender - log and skip
          this.logger.warn(`Message from unknown number: ${from}`);
          continue;
        }

        // Store message in database
        await this.conversationRepository.save({
          jamaahId: jamaah.id,
          tenantId: jamaah.tenantId,
          direction: 'inbound',
          platform: 'whatsapp',
          messageType: message.type,
          content: message.text?.body || message.caption,
          mediaUrl: message.image?.link || message.document?.link,
          timestamp: new Date(parseInt(message.timestamp) * 1000),
          whatsappMessageId: message.id,
        });

        // Emit WebSocket event to agent
        await this.websocketEmitter.emitNotification(
          jamaah.tenantId,
          {
            title: 'New WhatsApp Message',
            message: `${jamaah.name}: ${message.text?.body}`,
            type: 'info',
            actionUrl: `/jamaah/${jamaah.id}/conversations`,
          },
          jamaah.agentId,
        );

        // TODO: Integrate with chatbot for auto-reply
        // if (shouldAutoReply(message)) {
        //   const reply = await this.chatbotService.generateReply(message);
        //   await this.whatsappService.sendTextMessage(from, reply);
        // }
      }
    }
  }

  return { status: 'ok' };
}
```

---

## Rate Limits

### Cloud API Tiers

| Tier | Limit | Cost |
|------|-------|------|
| Tier 1 | 1,000 messages/day | Free |
| Tier 2 | 10,000 messages/day | ~$0.005/message |
| Tier 3 | 100,000 messages/day | ~$0.004/message |
| Tier 4 | Unlimited | ~$0.003/message |

Auto-upgrade based on usage.

### Rate Limiting Implementation

```typescript
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 80, // 80 requests
  duration: 1, // per 1 second
});

async sendMessage(to: string, message: any) {
  try {
    await rateLimiter.consume(this.phoneNumberId);
    return await this.whatsappApi.send(to, message);
  } catch (error) {
    if (error instanceof Error && error.message === 'RateLimiterRes') {
      // Add to queue for retry
      await this.queueService.addNotificationJob({
        tenantId: this.tenantId,
        type: 'send-whatsapp',
        to,
        message,
      });
      
      throw new TooManyRequestsException('Rate limit exceeded, message queued');
    }
    throw error;
  }
}
```

---

## Error Handling

### Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 131026 | Message undeliverable | Check phone number format |
| 131047 | Re-engagement required | User blocked business - remove from list |
| 131053 | Invalid template params | Check parameter count/types |
| 100 | Invalid access token | Refresh token |
| 33 | Rate limit exceeded | Implement backoff/queue |

```typescript
async sendWithRetry(to: string, message: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await this.sendMessage(to, message);
    } catch (error) {
      if (error.response?.data?.error?.code === 131047) {
        // User blocked - don't retry
        await this.markUserAsBlocked(to);
        throw error;
      }

      if (i === retries - 1) {
        // Final retry failed
        await this.logFailedMessage(to, message, error);
        throw error;
      }

      // Exponential backoff
      await sleep(2 ** i * 1000);
    }
  }
}
```

---

## Testing

### Test Phone Numbers

Meta provides test numbers for development:
- +1 555-0100 (Success)
- +1 555-0101 (Delivery failure)
- +1 555-0102 (Blocked user)

### Test Environment

```env
WHATSAPP_PHONE_NUMBER_ID=test_phone_number_id
WHATSAPP_ACCESS_TOKEN=test_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=test_verify_token
WHATSAPP_API_VERSION=v18.0
```

---

## Cost Estimation

### Message Costs (Indonesia)

- **Marketing messages:** ~$0.05 per message
- **Utility messages (payment, shipping):** ~$0.003 per message
- **Service messages (customer care):** ~$0.008 per message

### Estimated Monthly Cost

Assumptions:
- 500 jamaah per month
- 3 payment reminders per jamaah
- 1 departure reminder per jamaah
- 2 payment confirmations per jamaah

Total: 500 × (3 + 1 + 2) = **3,000 messages/month**
Cost: 3,000 × $0.003 = **~$9/month**

Very affordable!

---

## Security & Compliance

### Data Privacy

- End-to-end encryption (WhatsApp default)
- Message logs stored encrypted in database
- Retention policy: 90 days
- GDPR compliance: User can request data deletion

### Webhook Security

```typescript
function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`),
  );
}
```

---

## Monitoring & Analytics

### Metrics to Track

- Message delivery rate
- Message open rate (read receipts)
- Response rate
- Template rejection rate
- API error rate
- Average response time

### Dashboard

```typescript
async getWhatsAppMetrics(tenantId: string, period: string) {
  return {
    messagesSent: await this.countSent(tenantId, period),
    messagesDelivered: await this.countDelivered(tenantId, period),
    messagesRead: await this.countRead(tenantId, period),
    messagesReplied: await this.countReplied(tenantId, period),
    deliveryRate: deliveredCount / sentCount,
    readRate: readCount / deliveredCount,
    replyRate: repliedCount / deliveredCount,
  };
}
```

---

## Implementation Checklist

- [ ] Register WhatsApp Business API
- [ ] Verify business
- [ ] Configure webhook endpoint
- [ ] Create message templates
- [ ] Submit templates for approval
- [ ] Implement send message functionality
- [ ] Implement webhook handler
- [ ] Implement conversation sync
- [ ] Add rate limiting
- [ ] Add error handling & retries
- [ ] Integrate with payment reminder system
- [ ] Integrate with chatbot (Phase 2)
- [ ] Add analytics dashboard
- [ ] Load testing
- [ ] Production deployment

---

## References

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Meta Business Manager](https://business.facebook.com/)
- [WhatsApp Business Platform Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- [Template Message Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines)
