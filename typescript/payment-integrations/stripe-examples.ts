// Stripe TypeScript Examples - Advanced Payment Processing Patterns
// This file demonstrates comprehensive TypeScript usage with Stripe payment platform

import Stripe from 'stripe';

// ===== BASIC TYPES =====

// Enhanced payment intent interface
interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  payment_method?: string;
  customer?: string;
  metadata: Record<string, string>;
  created: number;
  client_secret: string;
  next_action?: {
    type: 'use_stripe_sdk' | 'redirect_to_url' | 'verify_with_microdeposits';
    redirect_to_url?: {
      url: string;
      return_url: string;
    };
  };
}

// Enhanced subscription interface
interface Subscription {
  id: string;
  customer: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  current_period_start: number;
  current_period_end: number;
  items: SubscriptionItem[];
  default_payment_method?: string;
  metadata: Record<string, string>;
  trial_end?: number;
  cancel_at_period_end: boolean;
}

interface SubscriptionItem {
  id: string;
  price: Price;
  quantity: number;
}

interface Price {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days?: number;
  };
  metadata: Record<string, string>;
}

// Enhanced customer interface
interface Customer {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata: Record<string, string>;
  payment_methods?: PaymentMethod[];
  subscriptions?: Subscription[];
  created: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'sepa_debit' | 'ideal' | 'sofort' | 'giropay' | 'eps' | 'bancontact' | 'p24';
  card?: Card;
  sepa_debit?: SepaDebit;
  customer?: string;
  metadata: Record<string, string>;
  created: number;
}

interface Card {
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'unionpay' | 'diners' | 'unknown';
  last4: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
  country: string;
  three_d_secure_usage?: {
    supported: boolean;
  };
}

interface SepaDebit {
  last4: string;
  bank_code: string;
  fingerprint: string;
  country: string;
  mandate_reference: string;
}

// Enhanced webhook event interface
interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

// Enhanced refund interface
interface Refund {
  id: string;
  amount: number;
  currency: string;
  payment_intent: string;
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  metadata: Record<string, string>;
  created: number;
}

// Enhanced charge interface
interface Charge {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  customer: string;
  status: 'succeeded' | 'pending' | 'failed';
  outcome?: {
    network_status: 'approved_by_network' | 'declined_by_network' | 'not_sent_to_network' | 'reversed_after_approval';
    reason: string;
    risk_level: 'normal' | 'elevated' | 'highest';
    risk_score: number;
    seller_message: string;
    type: 'authorized' | 'manual_review' | 'issuer_declined' | 'blocked' | 'invalid';
  };
  fraud_details?: {
    stripe_report: string;
    user_report: string;
  };
  metadata: Record<string, string>;
  created: number;
}

// ===== STRIPE PAYMENT PROCESSOR =====

class StripePaymentProcessor {
  private stripe: Stripe;

  constructor(apiKey: string, options?: Stripe.StripeConfig) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      ...options,
    });
  }

  // ===== PAYMENT INTENTS =====

  // Create payment intent with enhanced options
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customer?: string;
    payment_method?: string;
    confirmation_method?: 'manual' | 'automatic';
    confirm?: boolean;
    return_url?: string;
    metadata?: Record<string, string>;
    setup_future_usage?: 'off_session' | 'on_session';
    payment_method_types?: string[];
    description?: string;
    statement_descriptor?: string;
    receipt_email?: string;
    shipping?: Stripe.ShippingDetails;
  }): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        customer: params.customer,
        payment_method: params.payment_method,
        confirmation_method: params.confirmation_method || 'automatic',
        confirm: params.confirm || false,
        return_url: params.return_url,
        metadata: params.metadata || {},
        setup_future_usage: params.setup_future_usage,
        payment_method_types: params.payment_method_types || ['card'],
        description: params.description,
        statement_descriptor: params.statement_descriptor,
        receipt_email: params.receipt_email,
        shipping: params.shipping,
      });

      return paymentIntent as PaymentIntent;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethod?: string,
    savePaymentMethod?: boolean
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethod,
        save_payment_method: savePaymentMethod,
      });

      return paymentIntent as PaymentIntent;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Retrieve payment intent
  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent as PaymentIntent;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Cancel payment intent
  async cancelPaymentIntent(paymentIntentId: string, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId, {
        cancellation_reason: reason,
      });

      return paymentIntent as PaymentIntent;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== CUSTOMERS =====

  // Create customer with enhanced options
  async createCustomer(params: {
    email?: string;
    name?: string;
    phone?: string;
    description?: string;
    metadata?: Record<string, string>;
    payment_method?: string;
    invoice_settings?: {
      default_payment_method?: string;
    };
    address?: Stripe.Address;
    shipping?: Stripe.ShippingDetails;
    balance?: number;
    coupon?: string;
    source?: string;
  }): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        phone: params.phone,
        description: params.description,
        metadata: params.metadata || {},
        payment_method: params.payment_method,
        invoice_settings: params.invoice_settings,
        address: params.address,
        shipping: params.shipping,
        balance: params.balance,
        coupon: params.coupon,
        source: params.source,
      });

      return customer as Customer;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Retrieve customer
  async retrieveCustomer(customerId: string): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Customer;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Update customer
  async updateCustomer(customerId: string, params: {
    email?: string;
    name?: string;
    phone?: string;
    description?: string;
    metadata?: Record<string, string>;
    invoice_settings?: {
      default_payment_method?: string;
    };
    address?: Stripe.Address;
    shipping?: Stripe.ShippingDetails;
  }): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.update(customerId, params);
      return customer as Customer;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Delete customer
  async deleteCustomer(customerId: string): Promise<{ deleted: boolean; id: string }> {
    try {
      const result = await this.stripe.customers.del(customerId);
      return result;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // List customers
  async listCustomers(params?: {
    email?: string;
    limit?: number;
    starting_after?: string;
  }): Promise<{ data: Customer[]; has_more: boolean }> {
    try {
      const customers = await this.stripe.customers.list(params);
      return {
        data: customers.data as Customer[],
        has_more: customers.has_more,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== PAYMENT METHODS =====

  // Create payment method
  async createPaymentMethod(params: {
    type: string;
    card?: Stripe.PaymentMethodCreateParams.Card;
    sepa_debit?: Stripe.PaymentMethodCreateParams.SepaDebit;
    billing_details?: Stripe.PaymentMethodCreateParams.BillingDetails;
    metadata?: Record<string, string>;
  }): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: params.type as Stripe.PaymentMethodCreateParams.Type,
        card: params.card,
        sepa_debit: params.sepa_debit,
        billing_details: params.billing_details,
        metadata: params.metadata || {},
      });

      return paymentMethod as PaymentMethod;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return paymentMethod as PaymentMethod;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Detach payment method from customer
  async detachPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);
      return paymentMethod as PaymentMethod;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // List payment methods for customer
  async listPaymentMethods(customerId: string, type?: string): Promise<PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: type as Stripe.PaymentMethodListParams.Type,
      });

      return paymentMethods.data as PaymentMethod[];
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== SUBSCRIPTIONS =====

  // Create subscription with enhanced options
  async createSubscription(params: {
    customer: string;
    items: Array<{
      price: string;
      quantity?: number;
    }>;
    trial_period_days?: number;
    coupon?: string;
    default_payment_method?: string;
    billing_cycle_anchor?: number;
    payment_behavior?: 'default_incomplete' | 'allow_incomplete';
    expand?: string[];
    metadata?: Record<string, string>;
    add_invoice_items?: Array<{
      price: string;
      quantity?: number;
    }>;
    backdate_start_date?: number;
    cancel_at_period_end?: boolean;
    collection_method?: 'charge_automatically' | 'send_invoice';
    days_until_due?: number;
    description?: string;
    discount?: string;
    invoice_settings?: {
      days_until_due?: number;
    };
    off_session?: boolean;
    payment_settings?: {
      payment_method_types?: string[];
      save_default_payment_method?: 'off' | 'on_subscription';
    };
    proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
    transfer_data?: {
      destination: string;
      amount_percent?: number;
    };
    trial_end?: number;
  }): Promise<Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: params.customer,
        items: params.items,
        trial_period_days: params.trial_period_days,
        coupon: params.coupon,
        default_payment_method: params.default_payment_method,
        billing_cycle_anchor: params.billing_cycle_anchor,
        payment_behavior: params.payment_behavior || 'default_incomplete',
        expand: params.expand || ['latest_invoice.payment_intent'],
        metadata: params.metadata || {},
        add_invoice_items: params.add_invoice_items,
        backdate_start_date: params.backdate_start_date,
        cancel_at_period_end: params.cancel_at_period_end,
        collection_method: params.collection_method,
        days_until_due: params.days_until_due,
        description: params.description,
        discount: params.discount,
        invoice_settings: params.invoice_settings,
        off_session: params.off_session,
        payment_settings: params.payment_settings,
        proration_behavior: params.proration_behavior || 'create_prorations',
        transfer_data: params.transfer_data,
        trial_end: params.trial_end,
      });

      return subscription as Subscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, params: {
    items?: Array<{
      id: string;
      price?: string;
      quantity?: number;
      deleted?: boolean;
    }>;
    proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
    cancel_at_period_end?: boolean;
    coupon?: string;
    default_payment_method?: string;
    metadata?: Record<string, string>;
    trial_end?: number;
    payment_behavior?: 'default_incomplete' | 'allow_incomplete';
    collection_method?: 'charge_automatically' | 'send_invoice';
    days_until_due?: number;
    description?: string;
    discount?: string;
    invoice_settings?: {
      days_until_due?: number;
    };
    payment_settings?: {
      payment_method_types?: string[];
      save_default_payment_method?: 'off' | 'on_subscription';
    };
    transfer_data?: {
      destination: string;
      amount_percent?: number;
    };
  }): Promise<Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, params);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, params?: {
    at_period_end?: boolean;
    prorate?: boolean;
    invoice_now?: boolean;
  }): Promise<Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId, params);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Retrieve subscription
  async retrieveSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // List subscriptions
  async listSubscriptions(params?: {
    customer?: string;
    status?: string;
    limit?: number;
    starting_after?: string;
  }): Promise<{ data: Subscription[]; has_more: boolean }> {
    try {
      const subscriptions = await this.stripe.subscriptions.list(params);
      return {
        data: subscriptions.data as Subscription[],
        has_more: subscriptions.has_more,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== PRICES =====

  // Create price
  async createPrice(params: {
    unit_amount: number;
    currency: string;
    product: string;
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count?: number;
      trial_period_days?: number;
    };
    metadata?: Record<string, string>;
    nickname?: string;
    billing_scheme?: 'per_unit' | 'tiered';
    tiers?: Array<{
      up_to?: number;
      flat_amount?: number;
      unit_amount?: number;
    }>;
    tiers_mode?: 'graduated' | 'volume';
    transform_quantity?: {
      divide_by: number;
      round: 'up' | 'down';
    };
  }): Promise<Price> {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: params.unit_amount,
        currency: params.currency,
        product: params.product,
        recurring: params.recurring,
        metadata: params.metadata || {},
        nickname: params.nickname,
        billing_scheme: params.billing_scheme,
        tiers: params.tiers,
        tiers_mode: params.tiers_mode,
        transform_quantity: params.transform_quantity,
      });

      return price as Price;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Retrieve price
  async retrievePrice(priceId: string): Promise<Price> {
    try {
      const price = await this.stripe.prices.retrieve(priceId);
      return price as Price;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // List prices
  async listPrices(params?: {
    product?: string;
    active?: boolean;
    limit?: number;
    starting_after?: string;
  }): Promise<{ data: Price[]; has_more: boolean }> {
    try {
      const prices = await this.stripe.prices.list(params);
      return {
        data: prices.data as Price[],
        has_more: prices.has_more,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== REFUNDS =====

  // Create refund
  async createRefund(params: {
    payment_intent: string;
    amount?: number;
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
    metadata?: Record<string, string>;
    reverse_transfer?: boolean;
    refund_application_fee?: boolean;
  }): Promise<Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.payment_intent,
        amount: params.amount,
        reason: params.reason,
        metadata: params.metadata || {},
        reverse_transfer: params.reverse_transfer,
        refund_application_fee: params.refund_application_fee,
      });

      return refund as Refund;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Retrieve refund
  async retrieveRefund(refundId: string): Promise<Refund> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);
      return refund as Refund;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // List refunds
  async listRefunds(params?: {
    payment_intent?: string;
    limit?: number;
    starting_after?: string;
  }): Promise<{ data: Refund[]; has_more: boolean }> {
    try {
      const refunds = await this.stripe.refunds.list(params);
      return {
        data: refunds.data as Refund[],
        has_more: refunds.has_more,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // ===== WEBHOOKS =====

  // Construct webhook event
  constructWebhookEvent(payload: string, signature: string, secret: string): WebhookEvent {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, secret) as WebhookEvent;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  }

  // Handle webhook events
  async handleWebhook(event: WebhookEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as PaymentIntent);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Subscription);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Subscription);
          break;
        case 'charge.succeeded':
          await this.handleChargeSucceeded(event.data.object as Charge);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(event.data.object as Charge);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.type}:`, error);
      throw error;
    }
  }

  // ===== WEBHOOK EVENT HANDLERS =====

  private async handlePaymentIntentSucceeded(paymentIntent: PaymentIntent): Promise<void> {
    console.log(`PaymentIntent ${paymentIntent.id} succeeded:`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
    });

    // Update database, send confirmation email, etc.
    // Example: await this.updateOrderStatus(paymentIntent.metadata.order_id, 'paid');
  }

  private async handlePaymentIntentFailed(paymentIntent: PaymentIntent): Promise<void> {
    console.log(`PaymentIntent ${paymentIntent.id} failed:`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      last_payment_error: paymentIntent.last_payment_error,
    });

    // Handle failed payment, notify customer, etc.
    // Example: await this.notifyPaymentFailure(paymentIntent.customer, paymentIntent.id);
  }

  private async handleInvoicePaymentSucceeded(invoice: any): Promise<void> {
    console.log(`Invoice ${invoice.id} payment succeeded:`, {
      amount: invoice.amount_paid,
      customer: invoice.customer,
      subscription: invoice.subscription,
    });

    // Handle successful invoice payment
  }

  private async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    console.log(`Invoice ${invoice.id} payment failed:`, {
      amount: invoice.amount_due,
      customer: invoice.customer,
      subscription: invoice.subscription,
    });

    // Handle failed invoice payment, send dunning emails, etc.
  }

  private async handleSubscriptionCreated(subscription: Subscription): Promise<void> {
    console.log(`Subscription ${subscription.id} created:`, {
      customer: subscription.customer,
      status: subscription.status,
      items: subscription.items,
    });

    // Handle new subscription
  }

  private async handleSubscriptionUpdated(subscription: Subscription): Promise<void> {
    console.log(`Subscription ${subscription.id} updated:`, {
      customer: subscription.customer,
      status: subscription.status,
      items: subscription.items,
    });

    // Handle subscription update
  }

  private async handleSubscriptionDeleted(subscription: Subscription): Promise<void> {
    console.log(`Subscription ${subscription.id} deleted:`, {
      customer: subscription.customer,
      status: subscription.status,
    });

    // Handle subscription cancellation
  }

  private async handleChargeSucceeded(charge: Charge): Promise<void> {
    console.log(`Charge ${charge.id} succeeded:`, {
      amount: charge.amount,
      currency: charge.currency,
      customer: charge.customer,
      outcome: charge.outcome,
    });

    // Handle successful charge
  }

  private async handleChargeFailed(charge: Charge): Promise<void> {
    console.log(`Charge ${charge.id} failed:`, {
      amount: charge.amount,
      currency: charge.currency,
      customer: charge.customer,
      outcome: charge.outcome,
      failure_code: charge.failure_code,
      failure_message: charge.failure_message,
    });

    // Handle failed charge
  }

  // ===== ERROR HANDLING =====

  private handleStripeError(error: any): Error {
    if (error.type === 'StripeCardError') {
      // Card declined or other card error
      return new Error(`Card error: ${error.message}`);
    } else if (error.type === 'StripeRateLimitError') {
      // Too many requests made to the API too quickly
      return new Error('Rate limit error: Too many requests');
    } else if (error.type === 'StripeInvalidRequestError') {
      // Invalid parameters were supplied to Stripe's API
      return new Error(`Invalid request: ${error.message}`);
    } else if (error.type === 'StripeAPIError') {
      // An error occurred internally with Stripe's API
      return new Error(`API error: ${error.message}`);
    } else if (error.type === 'StripeConnectionError') {
      // Some kind of error occurred during the HTTPS communication
      return new Error(`Connection error: ${error.message}`);
    } else if (error.type === 'StripeAuthenticationError') {
      // Authentication with Stripe's API failed
      return new Error(`Authentication error: ${error.message}`);
    } else {
      // Unknown error
      return new Error(`Unknown error: ${error.message}`);
    }
  }

  // ===== UTILITY METHODS =====

  // Format amount for display
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Calculate subscription proration
  async calculateProration(
    subscriptionId: string,
    newPriceId: string,
    quantity?: number
  ): Promise<{ proration_amount: number; currency: string }> {
    try {
      const subscription = await this.retrieveSubscription(subscriptionId);
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        customer: subscription.customer,
        subscription: subscriptionId,
        subscription_items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
          quantity: quantity || subscription.items.data[0].quantity,
        }],
      });

      return {
        proration_amount: invoice.amount_due,
        currency: invoice.currency,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Create setup intent for saving payment methods
  async createSetupIntent(customerId: string, paymentMethodTypes?: string[]): Promise<any> {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: paymentMethodTypes || ['card'],
        usage: 'off_session',
      });
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Get customer payment methods with default
  async getCustomerPaymentMethods(customerId: string): Promise<{
    paymentMethods: PaymentMethod[];
    defaultPaymentMethod?: PaymentMethod;
  }> {
    try {
      const customer = await this.retrieveCustomer(customerId);
      const paymentMethods = await this.listPaymentMethods(customerId);
      
      let defaultPaymentMethod: PaymentMethod | undefined;
      if (customer.invoice_settings?.default_payment_method) {
        defaultPaymentMethod = paymentMethods.find(
          pm => pm.id === customer.invoice_settings?.default_payment_method
        );
      }

      return {
        paymentMethods,
        defaultPaymentMethod,
      };
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a subscription management system that:
- Handles subscription lifecycle events
- Manages trial periods and cancellations
- Provides proration calculations
- Handles payment method updates
- Is fully typed

EXERCISE 2: Build a payment form component that:
- Collects payment information securely
- Handles 3D Secure authentication
- Provides real-time validation
- Supports multiple payment methods
- Is fully typed

EXERCISE 3: Create a webhook processing service that:
- Handles all Stripe webhook events
- Provides event routing and processing
- Includes retry logic for failed events
- Logs all events for audit
- Is fully typed

EXERCISE 4: Build a customer portal that:
- Allows customers to manage subscriptions
- Handles payment method updates
- Provides invoice history
- Supports self-service cancellation
- Is fully typed

EXERCISE 5: Create a payment analytics dashboard that:
- Tracks revenue and metrics
- Provides subscription analytics
- Shows payment failure rates
- Generates financial reports
- Is fully typed
*/

// Export the Stripe payment processor
export { StripePaymentProcessor };

// Export types
export type {
  PaymentIntent,
  Subscription,
  SubscriptionItem,
  Price,
  Customer,
  PaymentMethod,
  Card,
  SepaDebit,
  WebhookEvent,
  Refund,
  Charge,
};