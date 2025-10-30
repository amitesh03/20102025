# TypeScript Payment Integrations

This folder contains comprehensive TypeScript examples for popular payment processing platforms. Each integration demonstrates best practices, security considerations, and production-ready implementations.

## Supported Payment Providers

### 1. Stripe
**File**: [`stripe-examples.ts`](./stripe-examples.ts)

Stripe is a comprehensive payment platform supporting cards, ACH, and various payment methods. This example demonstrates:

- **Payment Intents API** for secure payment processing
- **Subscription management** with billing cycles
- **Webhook handling** with signature verification
- **Customer management** with payment methods
- **Dispute handling** and resolution
- **Connect platform** for marketplace payments
- **Radar fraud detection** integration

Key Features:
- Type-safe Stripe API integration
- Comprehensive error handling
- Webhook signature verification
- Subscription lifecycle management
- Multi-currency support
- PCI compliance patterns

### 2. Lemon Squeezy
**File**: [`lemonsqueezy-examples.ts`](./lemonsqueezy-examples.ts)

Lemon Squeezy is a merchant-friendly payment platform focused on digital products. This example demonstrates:

- **Checkout creation** with customizable options
- **Subscription management** with trials and discounts
- **License key generation** and validation
- **Webhook processing** with security
- **Customer portal** integration
- **Affiliate system** integration
- **Tax calculation** and compliance

Key Features:
- Type-safe Lemon Squeezy API
- License key management
- Subscription billing automation
- Tax handling for global sales
- Affiliate commission tracking
- Customer self-service portal

### 3. Razorpay
**File**: [`razorpay-examples.ts`](./razorpay-examples.ts)

Razorpay is a popular payment gateway in India and Southeast Asia. This example demonstrates:

- **Payment capture** with multiple methods
- **Subscription billing** with custom plans
- **Refund processing** and management
- **Webhook handling** with validation
- **Payment links** for invoicing
- **UPI integration** for Indian market
- **International payments** support

Key Features:
- Type-safe Razorpay SDK integration
- UPI and net banking support
- EMI and card processing
- International payment methods
- Automated refund handling
- Compliance with Indian regulations

## Common Patterns

### Payment Flow Architecture
```typescript
interface PaymentFlow {
  createPaymentIntent: (amount: number, currency: string) => Promise<PaymentIntent>;
  confirmPayment: (paymentIntentId: string, paymentMethod: string) => Promise<PaymentResult>;
  handleWebhook: (event: WebhookEvent) => Promise<void>;
  processRefund: (paymentId: string, amount?: number) => Promise<RefundResult>;
}
```

### Security Best Practices
- **PCI DSS Compliance**: Never handle raw card data
- **Webhook Verification**: Always verify webhook signatures
- **Idempotency**: Use idempotency keys for API calls
- **Error Handling**: Never expose sensitive error details
- **Logging**: Log payment events without sensitive data

### Error Handling
```typescript
interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error';
  decline_code?: string;
  payment_intent?: PaymentIntent;
}
```

## Installation

### Stripe
```bash
npm install stripe @types/stripe
```

### Lemon Squeezy
```bash
npm install lemonsqueezy.ts
```

### Razorpay
```bash
npm install razorpay @types/razorpay
```

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_STORE_ID=...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

## Usage Examples

### Basic Payment Processing
```typescript
import { StripePaymentProcessor } from './stripe-examples';
import { LemonSqueezyProcessor } from './lemonsqueezy-examples';
import { RazorpayProcessor } from './razorpay-examples';

// Initialize processors
const stripe = new StripePaymentProcessor(process.env.STRIPE_SECRET_KEY!);
const lemon = new LemonSqueezyProcessor(process.env.LEMONSQUEEZY_API_KEY!);
const razorpay = new RazorpayProcessor({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Process payment
const payment = await stripe.createPaymentIntent(1000, 'usd');
const result = await stripe.confirmPayment(payment.id, 'pm_card_visa');
```

### Subscription Management
```typescript
// Create subscription
const subscription = await stripe.createSubscription({
  customer: 'cus_...',
  price: 'price_...',
  trial_period_days: 14,
});

// Handle subscription lifecycle
await stripe.handleSubscriptionWebhook(event);
```

## Testing

### Test Cards (Stripe)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

### Test Modes
All providers support test mode with sandbox environments:
- Use test API keys during development
- Test various payment scenarios
- Verify webhook handling
- Test error conditions

## Compliance and Security

### PCI DSS
- Use payment forms from provider SDKs
- Never store card details on your servers
- Implement proper access controls
- Regular security audits

### Data Protection
- Encrypt sensitive configuration
- Use HTTPS for all API calls
- Implement proper logging
- Follow GDPR/CCPA requirements

### Fraud Prevention
- Implement Radar (Stripe) or equivalent
- Monitor suspicious transactions
- Set up alerts for unusual activity
- Use 3D Secure when required

## Monitoring and Analytics

### Key Metrics
- **Conversion Rate**: Payment success vs. attempts
- **Revenue Tracking**: Daily/monthly revenue
- **Churn Rate**: Subscription cancellations
- **Error Rates**: Failed payment reasons
- **Performance**: API response times

### Alerting
- Payment failures above threshold
- Revenue anomalies
- API rate limits
- Webhook delivery failures

## Multi-Provider Architecture

### Provider Abstraction
```typescript
interface PaymentProvider {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  confirmPayment(intentId: string, method: string): Promise<PaymentResult>;
  createSubscription(customerId: string, planId: string): Promise<Subscription>;
  processWebhook(event: any): Promise<void>;
}

class PaymentManager {
  constructor(private providers: PaymentProvider[]) {}
  
  async processPayment(amount: number, currency: string) {
    // Fallback logic between providers
  }
}
```

### Provider Selection
- Geographic availability
- Payment method support
- Fee structure
- Local compliance requirements
- Customer preference

## Troubleshooting

### Common Issues
1. **Payment Failures**: Check card details, 3D Secure, fraud rules
2. **Webhook Issues**: Verify signatures, check URL accessibility
3. **Subscription Problems**: Review billing cycles, payment methods
4. **API Errors**: Check rate limits, authentication, permissions

### Debugging Tools
- Provider dashboards and logs
- API request/response logging
- Webhook delivery monitoring
- Payment flow analytics

## Resources

### Documentation
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Lemon Squeezy API](https://docs.lemonsqueezy.com/api)
- [Razorpay Documentation](https://razorpay.com/docs)

### SDKs and Libraries
- [Stripe Node.js SDK](https://github.com/stripe/stripe-node)
- [Lemon Squeezy TypeScript](https://github.com/lmsqueezy/lemonsqueezy.ts)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)

### Best Practices
- [Stripe Best Practices](https://stripe.com/docs/best-practices)
- [Payment Security Guide](https://stripe.com/docs/security)
- [Subscription Management](https://stripe.com/docs/billing/subscriptions)

## License

These examples are provided for educational purposes. Please refer to individual provider licenses and terms of service for production usage.