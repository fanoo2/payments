
# @fanno/payments-sdk

TypeScript SDK for Fanno Payments API

## Installation

```bash
npm install @fanno/payments-sdk
```

## Usage

### Creating a Payments Client

```typescript
import { createPaymentsClient } from '@fanno/payments-sdk';

const client = createPaymentsClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-api-endpoint.com' // optional, defaults to localhost:5000
});
```

### Creating a Checkout Session

```typescript
const session = await client.createCheckoutSession({
  amount: 1000, // Amount in cents
  currency: 'usd',
  customer_email: 'customer@example.com',
  success_url: 'https://yourapp.com/success',
  cancel_url: 'https://yourapp.com/cancel'
});

console.log('Session ID:', session.sessionId);
```

### Handling Webhooks

```typescript
// In your webhook endpoint
app.post('/webhook', (req, res) => {
  try {
    const event = client.handleWebhook(req.body);
    
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Payment completed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Bad Request');
  }
});
```

## Building

To build the TypeScript sources:

```bash
npm install
npm run build
```

## API Reference

### SessionRequest

- `amount` (number): Payment amount in cents
- `currency` (string): 3-letter currency code (e.g., 'usd')
- `customer_email` (string, optional): Customer's email address
- `success_url` (string, optional): URL to redirect after successful payment
- `cancel_url` (string, optional): URL to redirect after cancelled payment
- `metadata` (object, optional): Additional metadata

### SessionResponse

- `sessionId` (string): Unique session identifier
- `url` (string, optional): Checkout URL
- `status` (string, optional): Session status

### WebhookEvent

- `id` (string): Event identifier
- `type` (string): Event type
- `data` (object): Event data payload
