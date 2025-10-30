// Razorpay TypeScript Examples - Advanced Payment Processing for Indian Market
// This file demonstrates comprehensive TypeScript usage with Razorpay payment platform

import Razorpay from 'razorpay';

// ===== BASIC TYPES =====

// Enhanced payment interface
interface Payment {
  id: string;
  entity: 'payment';
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id?: string;
  invoice_id?: string;
  international: boolean;
  method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi' | 'cardless_emi';
  amount_refunded: number;
  refund_status?: 'partial' | 'full' | 'none';
  captured: boolean;
  description?: string;
  notes: Record<string, string>;
  email?: string;
  contact?: string;
  customer_id?: string;
  token_id?: string;
  bank: string;
  wallet: string;
  vpa: string;
  email: string;
  contact: string;
  fee: number;
  tax: number;
  error_code?: string;
  error_description?: string;
  acquirer_data: AcquirerData;
  created_at: number;
}

interface AcquirerData {
  bank_transaction_id?: string;
  auth_code?: string;
  rrn?: string;
  upi_transaction_id?: string;
}

// Enhanced order interface
interface Order {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
  payments?: Payment[];
}

// Enhanced customer interface
interface Customer {
  id: string;
  entity: 'customer';
  name?: string;
  email?: string;
  contact?: string;
  gstin?: string;
  notes: Record<string, string>;
  created_at: number;
}

// Enhanced refund interface
interface Refund {
  id: string;
  entity: 'refund';
  amount: number;
  receipt?: string;
  status: 'processed' | 'pending' | 'failed';
  speed: 'normal' | 'optimum';
  notes: Record<string, string>;
  order_id?: string;
  payment_id: string;
  created_at: number;
  batch_id?: string;
}

// Enhanced subscription interface
interface Subscription {
  id: string;
  entity: 'subscription';
  plan_id: string;
  customer_id: string;
  status: 'created' | 'authenticated' | 'active' | 'paused' | 'cancelled' | 'completed' | 'expired';
  current_start: number;
  current_end: number;
  ended_at?: number;
  start_at: number;
  end_at?: number;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  created_at: number;
  offer_id?: string;
  has_scheduled_changes: boolean;
  change_scheduled_at?: number;
  source: 'api' | 'subscription_link' | 'customer_portal';
  payment_method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  remaining_count: number;
  customer_notify: boolean;
  expire_by?: number;
  short_url?: string;
  by_month_count?: number;
  tax?: number;
  tax_percent?: number;
  amount?: number;
}

// Enhanced plan interface
interface Plan {
  id: string;
  entity: 'plan';
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period: number;
  item: PlanItem;
  notes: Record<string, string>;
  created_at: number;
}

interface PlanItem {
  id: string;
  active: boolean;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  type: 'addon' | 'plan';
  unit?: string;
  hsn_code?: string;
  sac_code?: string;
  tax_rate?: number;
  tax_id?: string;
  tax_group?: string;
}

// Enhanced virtual account interface
interface VirtualAccount {
  id: string;
  entity: 'virtual_account';
  name: string;
  description?: string;
  customer_id?: string;
  receivers: Receiver[];
  scheduled_at?: number;
  description?: string;
  notes: Record<string, string>;
  status: 'active' | 'closed';
  allowed_payers?: string[];
  close_by?: number;
  created_at: number;
}

interface Receiver {
  type: 'bank_account' | 'vpa';
  id?: string;
  ifsc?: string;
  bank_account_number?: string;
  name?: string;
  vpa?: string;
}

// Enhanced payment link interface
interface PaymentLink {
  id: string;
  entity: 'payment_link';
  title: string;
  description?: string;
  url: string;
  currency: string;
  amount: number;
  status: 'created' | 'active' | 'closed' | 'expired';
  paid_amount?: number;
  customer_id?: string;
  customer?: Customer;
  notify: {
    sms: boolean;
    email: boolean;
  };
  notes: Record<string, string>;
  callback_url?: string;
  callback_method?: 'get' | 'post';
  reference_id?: string;
  accept_partial: boolean;
  first_min_partial_amount?: number;
  expire_by?: number;
  short_url: string;
  payment_link_expire_by?: number;
  created_at: number;
}

// Enhanced webhook event interface
interface WebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: Payment;
    };
    order?: {
      entity: Order;
    };
    subscription?: {
      entity: Subscription;
    };
    refund?: {
      entity: Refund;
    };
    customer?: {
      entity: Customer;
    };
    virtual_account?: {
      entity: VirtualAccount;
    };
    payment_link?: {
      entity: PaymentLink;
    };
  };
  created_at: number;
}

// ===== RAZORPAY PAYMENT PROCESSOR =====

class RazorpayProcessor {
  private razorpay: Razorpay;

  constructor(options: {
    key_id: string;
    key_secret: string;
  }) {
    this.razorpay = new Razorpay({
      key_id: options.key_id,
      key_secret: options.key_secret,
    });
  }

  // ===== PAYMENT OPERATIONS =====

  // Create order
  async createOrder(params: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
    partial_payment?: boolean;
    first_payment_min_amount?: number;
    customer_id?: string;
    token?: string;
    callback_url?: string;
    callback_method?: 'get' | 'post';
    redirect?: boolean;
    reference_id?: string;
    expire_by?: number;
    payment_capture?: boolean;
    offers?: string[];
    send_sms?: boolean;
    send_email?: boolean;
    allow_partial?: boolean;
    reminder_enable?: boolean;
    schedule?: {
      start_at?: number;
      end_at?: number;
      interval?: number;
      interval_type?: 'by_month' | 'by_day' | 'by_week' | 'by_year';
      count?: number;
    };
  }): Promise<Order> {
    try {
      const order = await this.razorpay.orders.create({
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes || {},
        partial_payment: params.partial_payment || false,
        first_payment_min_amount: params.first_payment_min_amount,
        customer_id: params.customer_id,
        token: params.token,
        callback_url: params.callback_url,
        callback_method: params.callback_method,
        redirect: params.redirect,
        reference_id: params.reference_id,
        expire_by: params.expire_by,
        payment_capture: params.payment_capture !== false,
        offers: params.offers,
        send_sms: params.send_sms,
        send_email: params.send_email,
        allow_partial: params.allow_partial,
        reminder_enable: params.reminder_enable,
        schedule: params.schedule,
      });

      return order as Order;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get order
  async getOrder(orderId: string): Promise<Order> {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return order as Order;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get order payments
  async getOrderPayments(orderId: string): Promise<Payment[]> {
    try {
      const payments = await this.razorpay.orders.fetchPayments(orderId);
      return payments.items as Payment[];
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List orders
  async listOrders(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    authorized?: boolean;
    receipt?: string;
    status?: 'created' | 'attempted' | 'paid';
  }): Promise<{ items: Order[]; count: number }> {
    try {
      const orders = await this.razorpay.orders.all(params);
      return {
        items: orders.items as Order[],
        count: orders.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Capture payment
  async capturePayment(paymentId: string, amount?: number): Promise<Payment> {
    try {
      const payment = await this.razorpay.payments.capture(paymentId, amount);
      return payment as Payment;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get payment
  async getPayment(paymentId: string): Promise<Payment> {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment as Payment;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List payments
  async listPayments(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    order_id?: string;
    customer_id?: string;
    status?: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
    method?: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi' | 'cardless_emi';
    email?: string;
    contact?: string;
    notes?: Record<string, string>;
  }): Promise<{ items: Payment[]; count: number }> {
    try {
      const payments = await this.razorpay.payments.all(params);
      return {
        items: payments.items as Payment[],
        count: payments.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== CUSTOMER OPERATIONS =====

  // Create customer
  async createCustomer(params: {
    name?: string;
    email?: string;
    contact?: string;
    gstin?: string;
    notes?: Record<string, string>;
    fail_existing?: boolean;
  }): Promise<Customer> {
    try {
      const customer = await this.razorpay.customers.create({
        name: params.name,
        email: params.email,
        contact: params.contact,
        gstin: params.gstin,
        notes: params.notes || {},
        fail_existing: params.fail_existing || false,
      });

      return customer as Customer;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get customer
  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const customer = await this.razorpay.customers.fetch(customerId);
      return customer as Customer;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Update customer
  async updateCustomer(customerId: string, params: {
    name?: string;
    email?: string;
    contact?: string;
    gstin?: string;
    notes?: Record<string, string>;
  }): Promise<Customer> {
    try {
      const customer = await this.razorpay.customers.edit(customerId, params);
      return customer as Customer;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Delete customer
  async deleteCustomer(customerId: string): Promise<{ deleted: boolean }> {
    try {
      await this.razorpay.customers.delete(customerId);
      return { deleted: true };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List customers
  async listCustomers(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    email?: string;
    contact?: number;
    gstin?: string;
    notes?: Record<string, string>;
  }): Promise<{ items: Customer[]; count: number }> {
    try {
      const customers = await this.razorpay.customers.all(params);
      return {
        items: customers.items as Customer[],
        count: customers.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== SUBSCRIPTION OPERATIONS =====

  // Create subscription
  async createSubscription(params: {
    plan_id: string;
    customer_id: string;
    total_count?: number;
    start_at?: number;
    expire_by?: number;
    quantity?: number;
    offer_id?: string;
    notes?: Record<string, string>;
    customer_notify?: boolean;
    payment_method?: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
    coupon_id?: string;
    addons?: Array<{
      item: {
        id: string;
        quantity?: number;
      };
    }>;
  }): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: params.plan_id,
        customer_id: params.customer_id,
        total_count: params.total_count,
        start_at: params.start_at,
        expire_by: params.expire_by,
        quantity: params.quantity || 1,
        offer_id: params.offer_id,
        notes: params.notes || {},
        customer_notify: params.customer_notify !== false,
        payment_method: params.payment_method,
        coupon_id: params.coupon_id,
        addons: params.addons,
      });

      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.fetch(subscriptionId);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, params: {
    plan_id?: string;
    quantity?: number;
    offer_id?: string;
    schedule_change_at?: 'now' | 'cycle_end';
    customer_notify?: boolean;
    change_scheduled_at?: number;
    start_at?: number;
    expire_by?: number;
    payment_method?: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
    coupon_id?: string;
    addons?: Array<{
      item: {
        id: string;
        quantity?: number;
      };
    }>;
  }): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.edit(subscriptionId, params);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, params?: {
    cancel_at_cycle_end?: boolean;
  }): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.cancel(subscriptionId, params);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Pause subscription
  async pauseSubscription(subscriptionId: string, params?: {
    pause_at?: 'now' | 'cycle_end';
  }): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.pause(subscriptionId, params);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Resume subscription
  async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await this.razorpay.subscriptions.resume(subscriptionId);
      return subscription as Subscription;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List subscriptions
  async listSubscriptions(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    customer_id?: string;
    status?: 'created' | 'authenticated' | 'active' | 'paused' | 'cancelled' | 'completed' | 'expired';
    plan_id?: string;
    total_count?: number;
  }): Promise<{ items: Subscription[]; count: number }> {
    try {
      const subscriptions = await this.razorpay.subscriptions.all(params);
      return {
        items: subscriptions.items as Subscription[],
        count: subscriptions.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== PLAN OPERATIONS =====

  // Create plan
  async createPlan(params: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    item: {
      name: string;
      description?: string;
      amount: number;
      currency?: string;
      type?: 'addon' | 'plan';
      unit?: string;
      hsn_code?: string;
      sac_code?: string;
      tax_rate?: number;
      tax_id?: string;
      tax_group?: string;
    };
    notes?: Record<string, string>;
  }): Promise<Plan> {
    try {
      const plan = await this.razorpay.plans.create({
        period: params.period,
        interval: params.interval,
        item: {
          ...params.item,
          currency: params.item.currency || 'INR',
          type: params.item.type || 'plan',
        },
        notes: params.notes || {},
      });

      return plan as Plan;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get plan
  async getPlan(planId: string): Promise<Plan> {
    try {
      const plan = await this.razorpay.plans.fetch(planId);
      return plan as Plan;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List plans
  async listPlans(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    status?: 'active' | 'inactive';
    product_id?: string;
  }): Promise<{ items: Plan[]; count: number }> {
    try {
      const plans = await this.razorpay.plans.all(params);
      return {
        items: plans.items as Plan[],
        count: plans.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== REFUND OPERATIONS =====

  // Create refund
  async createRefund(params: {
    payment_id: string;
    amount?: number;
    notes?: Record<string, string>;
    receipt?: string;
    speed?: 'normal' | 'optimum';
  }): Promise<Refund> {
    try {
      const refund = await this.razorpay.payments.refund(params.payment_id, {
        amount: params.amount,
        notes: params.notes || {},
        receipt: params.receipt,
        speed: params.speed || 'normal',
      });

      return refund as Refund;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get refund
  async getRefund(refundId: string): Promise<Refund> {
    try {
      const refund = await this.razorpay.refunds.fetch(refundId);
      return refund as Refund;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List refunds
  async listRefunds(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    payment_id?: string;
    order_id?: string;
    status?: 'processed' | 'pending' | 'failed';
    speed?: 'normal' | 'optimum';
  }): Promise<{ items: Refund[]; count: number }> {
    try {
      const refunds = await this.razorpay.refunds.all(params);
      return {
        items: refunds.items as Refund[],
        count: refunds.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== PAYMENT LINK OPERATIONS =====

  // Create payment link
  async createPaymentLink(params: {
    amount: number;
    currency?: string;
    accept_partial?: boolean;
    first_min_partial_amount?: number;
    description?: string;
    customer_id?: string;
    customer?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    type?: 'link' | 'qr';
    view_less?: number;
    expire_by?: number;
    reference_id?: string;
    callback_url?: string;
    callback_method?: 'get' | 'post';
    notes?: Record<string, string>;
    send_sms?: boolean;
    send_email?: boolean;
    reminder_enable?: boolean;
    schedule?: {
      start_at?: number;
      end_at?: number;
      interval?: number;
      interval_type?: 'by_month' | 'by_day' | 'by_week' | 'by_year';
      count?: number;
    };
  }): Promise<PaymentLink> {
    try {
      const paymentLink = await this.razorpay.paymentLink.create({
        amount: params.amount,
        currency: params.currency || 'INR',
        accept_partial: params.accept_partial || false,
        first_min_partial_amount: params.first_min_partial_amount,
        description: params.description,
        customer_id: params.customer_id,
        customer: params.customer,
        type: params.type || 'link',
        view_less: params.view_less,
        expire_by: params.expire_by,
        reference_id: params.reference_id,
        callback_url: params.callback_url,
        callback_method: params.callback_method,
        notes: params.notes || {},
        send_sms: params.send_sms,
        send_email: params.send_email,
        reminder_enable: params.reminder_enable,
        schedule: params.schedule,
      });

      return paymentLink as PaymentLink;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get payment link
  async getPaymentLink(paymentLinkId: string): Promise<PaymentLink> {
    try {
      const paymentLink = await this.razorpay.paymentLink.fetch(paymentLinkId);
      return paymentLink as PaymentLink;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Cancel payment link
  async cancelPaymentLink(paymentLinkId: string): Promise<PaymentLink> {
    try {
      const paymentLink = await this.razorpay.paymentLink.cancel(paymentLinkId);
      return paymentLink as PaymentLink;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List payment links
  async listPaymentLinks(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    status?: 'created' | 'active' | 'closed' | 'expired';
    reference_id?: string;
  }): Promise<{ items: PaymentLink[]; count: number }> {
    try {
      const paymentLinks = await this.razorpay.paymentLink.all(params);
      return {
        items: paymentLinks.items as PaymentLink[],
        count: paymentLinks.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== VIRTUAL ACCOUNT OPERATIONS =====

  // Create virtual account
  async createVirtualAccount(params: {
    receivers: Receiver[];
    name: string;
    description?: string;
    customer_id?: string;
    scheduled_at?: number;
    notes?: Record<string, string>;
    allowed_payers?: string[];
    close_by?: number;
  }): Promise<VirtualAccount> {
    try {
      const virtualAccount = await this.razorpay.virtualAccount.create({
        receivers: params.receivers,
        name: params.name,
        description: params.description,
        customer_id: params.customer_id,
        scheduled_at: params.scheduled_at,
        notes: params.notes || {},
        allowed_payers: params.allowed_payers,
        close_by: params.close_by,
      });

      return virtualAccount as VirtualAccount;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Get virtual account
  async getVirtualAccount(virtualAccountId: string): Promise<VirtualAccount> {
    try {
      const virtualAccount = await this.razorpay.virtualAccount.fetch(virtualAccountId);
      return virtualAccount as VirtualAccount;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Close virtual account
  async closeVirtualAccount(virtualAccountId: string): Promise<VirtualAccount> {
    try {
      const virtualAccount = await this.razorpay.virtualAccount.close(virtualAccountId);
      return virtualAccount as VirtualAccount;
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // List virtual accounts
  async listVirtualAccounts(params?: {
    from?: number;
    to?: number;
    count?: number;
    skip?: number;
    customer_id?: string;
    status?: 'active' | 'closed';
  }): Promise<{ items: VirtualAccount[]; count: number }> {
    try {
      const virtualAccounts = await this.razorpay.virtualAccount.all(params);
      return {
        items: virtualAccounts.items as VirtualAccount[],
        count: virtualAccounts.count,
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // ===== WEBHOOK OPERATIONS =====

  // Verify webhook signature
  verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  // Handle webhook events
  async handleWebhook(event: WebhookEvent): Promise<void> {
    try {
      switch (event.event) {
        case 'payment.authorized':
          await this.handlePaymentAuthorized(event.payload.payment?.entity);
          break;
        case 'payment.captured':
          await this.handlePaymentCaptured(event.payload.payment?.entity);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event.payload.payment?.entity);
          break;
        case 'payment.refunded':
          await this.handlePaymentRefunded(event.payload.refund?.entity);
          break;
        case 'order.paid':
          await this.handleOrderPaid(event.payload.order?.entity);
          break;
        case 'subscription.authenticated':
          await this.handleSubscriptionAuthenticated(event.payload.subscription?.entity);
          break;
        case 'subscription.activated':
          await this.handleSubscriptionActivated(event.payload.subscription?.entity);
          break;
        case 'subscription.charged':
          await this.handleSubscriptionCharged(event.payload.subscription?.entity);
          break;
        case 'subscription.completed':
          await this.handleSubscriptionCompleted(event.payload.subscription?.entity);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(event.payload.subscription?.entity);
          break;
        case 'subscription.paused':
          await this.handleSubscriptionPaused(event.payload.subscription?.entity);
          break;
        case 'subscription.resumed':
          await this.handleSubscriptionResumed(event.payload.subscription?.entity);
          break;
        case 'subscription.expired':
          await this.handleSubscriptionExpired(event.payload.subscription?.entity);
          break;
        default:
          console.log(`Unhandled event type: ${event.event}`);
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.event}:`, error);
      throw error;
    }
  }

  // ===== WEBHOOK EVENT HANDLERS =====

  private async handlePaymentAuthorized(payment?: Payment): Promise<void> {
    if (!payment) return;
    
    console.log(`Payment ${payment.id} authorized:`, {
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
    });

    // Handle payment authorization
    // Example: await this.updateOrderStatus(payment.order_id, 'authorized');
  }

  private async handlePaymentCaptured(payment?: Payment): Promise<void> {
    if (!payment) return;
    
    console.log(`Payment ${payment.id} captured:`, {
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
    });

    // Handle payment capture
    // Example: await this.updateOrderStatus(payment.order_id, 'paid');
  }

  private async handlePaymentFailed(payment?: Payment): Promise<void> {
    if (!payment) return;
    
    console.log(`Payment ${payment.id} failed:`, {
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      error_code: payment.error_code,
      error_description: payment.error_description,
    });

    // Handle payment failure
    // Example: await this.notifyPaymentFailure(payment.order_id, payment.error_description);
  }

  private async handlePaymentRefunded(refund?: Refund): Promise<void> {
    if (!refund) return;
    
    console.log(`Refund ${refund.id} processed:`, {
      amount: refund.amount,
      payment_id: refund.payment_id,
      status: refund.status,
    });

    // Handle refund
    // Example: await this.updateOrderStatus(refund.payment_id, 'refunded');
  }

  private async handleOrderPaid(order?: Order): Promise<void> {
    if (!order) return;
    
    console.log(`Order ${order.id} paid:`, {
      amount: order.amount,
      currency: order.currency,
      attempts: order.attempts,
    });

    // Handle order payment
    // Example: await this.sendOrderConfirmation(order.id);
  }

  private async handleSubscriptionAuthenticated(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} authenticated:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription authentication
  }

  private async handleSubscriptionActivated(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} activated:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription activation
    // Example: await this.sendSubscriptionWelcome(subscription.customer_id, subscription.id);
  }

  private async handleSubscriptionCharged(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} charged:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription charge
  }

  private async handleSubscriptionCompleted(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} completed:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription completion
  }

  private async handleSubscriptionCancelled(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} cancelled:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription cancellation
    // Example: await this.sendCancellationSurvey(subscription.customer_id, subscription.id);
  }

  private async handleSubscriptionPaused(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} paused:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription pause
  }

  private async handleSubscriptionResumed(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} resumed:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription resume
  }

  private async handleSubscriptionExpired(subscription?: Subscription): Promise<void> {
    if (!subscription) return;
    
    console.log(`Subscription ${subscription.id} expired:`, {
      customer_id: subscription.customer_id,
      plan_id: subscription.plan_id,
    });

    // Handle subscription expiration
    // Example: await this.sendExpirationNotice(subscription.customer_id, subscription.id);
  }

  // ===== ERROR HANDLING =====

  private handleRazorpayError(error: any): Error {
    if (error.error) {
      // Razorpay API error
      const errorCode = error.error.code;
      const description = error.error.description;
      
      if (errorCode === 'BAD_REQUEST_ERROR') {
        return new Error(`Bad request: ${description}`);
      } else if (errorCode === 'SERVER_ERROR') {
        return new Error('Server error: Razorpay server error');
      } else if (errorCode === 'GATEWAY_ERROR') {
        return new Error('Gateway error: Payment gateway error');
      } else {
        return new Error(`Razorpay error: ${description}`);
      }
    } else if (error.statusCode) {
      // HTTP error
      if (error.statusCode === 401) {
        return new Error('Unauthorized: Invalid API key');
      } else if (error.statusCode === 403) {
        return new Error('Forbidden: Insufficient permissions');
      } else if (error.statusCode === 404) {
        return new Error('Not found: Resource does not exist');
      } else if (error.statusCode === 429) {
        return new Error('Rate limit exceeded: Too many requests');
      } else if (error.statusCode >= 500) {
        return new Error('Server error: Razorpay server error');
      } else {
        return new Error(`HTTP error: ${error.message}`);
      }
    } else {
      // Other error
      return new Error(`Unknown error: ${error.message}`);
    }
  }

  // ===== UTILITY METHODS =====

  // Format amount for display
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Generate payment link URL
  generatePaymentLinkUrl(paymentLinkId: string): string {
    return `https://rzp.io/l/${paymentLinkId}`;
  }

  // Calculate subscription proration
  async calculateProration(
    subscriptionId: string,
    newPlanId: string
  ): Promise<{ proration_amount: number; currency: string }> {
    try {
      const subscription = await this.getSubscription(subscriptionId);
      const newPlan = await this.getPlan(newPlanId);
      
      // Simple proration calculation (actual implementation would be more complex)
      const daysInMonth = 30;
      const daysRemaining = Math.max(0, 
        Math.ceil((subscription.current_end - Date.now()) / (1000 * 60 * 60 * 24))
      );
      
      const prorationAmount = (newPlan.item.amount / daysInMonth) * daysRemaining;
      
      return {
        proration_amount: Math.round(prorationAmount),
        currency: 'INR',
      };
    } catch (error) {
      throw this.handleRazorpayError(error);
    }
  }

  // Create UPI payment intent
  createUPIIntent(params: {
    vpa: string;
    amount: number;
    currency?: string;
    description?: string;
    notes?: Record<string, string>;
  }): { key: string; amount: number; currency: string; name: string; description: string; image?: string; prefill: { contact?: string; email?: string; name?: string }; notes: Record<string, string>; theme: { color: string }; modal: { backdropclose: boolean; escape: boolean; handleback: boolean }; retry: { enabled: boolean; max_count: number }; redirect: boolean } {
    return {
      key: this.razorpay.key_id,
      amount: params.amount,
      currency: params.currency || 'INR',
      name: 'Company Name',
      description: params.description || 'Payment',
      prefill: {
        contact: '',
        email: '',
        name: '',
      },
      notes: params.notes || {},
      theme: {
        color: '#3399cc'
      },
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true
      },
      retry: {
        enabled: true,
        max_count: 4
      },
      redirect: true
    };
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

EXERCISE 2: Build a UPI payment system that:
- Generates UPI payment intents
- Handles UPI app deep linking
- Provides real-time payment status
- Supports multiple UPI providers
- Is fully typed

EXERCISE 3: Create a webhook processing service that:
- Handles all Razorpay webhook events
- Provides event routing and processing
- Includes retry logic for failed events
- Logs all events for audit
- Is fully typed

EXERCISE 4: Build a payment form component that:
- Supports multiple payment methods (cards, UPI, netbanking)
- Handles 3D Secure authentication
- Provides real-time validation
- Supports EMI options
- Is fully typed

EXERCISE 5: Create a virtual account management system that:
- Creates and manages virtual accounts
- Handles multiple receiver types
- Provides account reconciliation
- Supports scheduled operations
- Is fully typed
*/

// Export the Razorpay processor
export { RazorpayProcessor };

// Export types
export type {
  Payment,
  Order,
  Customer,
  Refund,
  Subscription,
  Plan,
  PlanItem,
  VirtualAccount,
  Receiver,
  PaymentLink,
  WebhookEvent,
  AcquirerData,
};