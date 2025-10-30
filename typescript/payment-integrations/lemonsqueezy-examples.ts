// Lemon Squeezy TypeScript Examples - Advanced Digital Product Payment Processing
// This file demonstrates comprehensive TypeScript usage with Lemon Squeezy payment platform

import { LemonSqueezy } from 'lemonsqueezy.ts';

// ===== BASIC TYPES =====

// Enhanced store interface
interface Store {
  id: string;
  name: string;
  slug: string;
  domain: string;
  url: string;
  avatar_url: string;
  plan: string;
  country: string;
  currency: string;
  total_sales: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

// Enhanced product interface
interface Product {
  id: string;
  store_id: number;
  name: string;
  slug: string;
  description: string;
  status: 'draft' | 'published';
  status_formatted: string;
  thumb_url: string;
  large_thumb_url: string;
  price: number;
  price_formatted: string;
  from_price: number;
  from_price_formatted: string;
  is_pay_what_you_want: boolean;
  buy_now_url: string;
  created_at: string;
  updated_at: string;
  variants: Variant[];
}

// Enhanced variant interface
interface Variant {
  id: string;
  product_id: number;
  name: string;
  slug: string;
  description: string;
  status: 'draft' | 'published';
  status_formatted: string;
  price: number;
  price_formatted: string;
  compare_at_price: number;
  compare_at_price_formatted: string;
  is_pay_what_you_want: boolean;
  sort: number;
  has_free_trial: boolean;
  trial_interval: 'day' | 'week' | 'month' | 'year';
  trial_interval_count: number;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  has_license_keys: boolean;
  license_keys_required: number;
  license_key_lifetime: number;
  created_at: string;
  updated_at: string;
}

// Enhanced checkout interface
interface Checkout {
  id: string;
  store_id: number;
  variant_id: number;
  product_id: number;
  name: string;
  email: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  status_formatted: string;
  currency: string;
  subtotal: number;
  subtotal_formatted: string;
  discount_total: number;
  discount_total_formatted: string;
  tax: number;
  tax_formatted: string;
  total: number;
  total_formatted: string;
  subtotal_usd: number;
  subtotal_usd_formatted: string;
  discount_total_usd: number;
  discount_total_usd_formatted: string;
  tax_usd: number;
  tax_usd_formatted: string;
  total_usd: number;
  total_usd_formatted: string;
  order_id: number;
  billing_address: BillingAddress;
  tax_rate: number;
  ip_address: string;
  country: string;
  zip: string;
  refunded_amount: number;
  refunded_amount_formatted: string;
  refunded_at: string;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
  url: string;
  custom_price?: number;
  discount_code?: DiscountCode;
  customer: Customer;
  order: Order;
  license_keys: LicenseKey[];
  subscription: Subscription;
}

interface BillingAddress {
  country: string;
  state: string;
  zip: string;
}

interface Customer {
  id: string;
  store_id: number;
  email: string;
  name: string;
  status: 'pending' | 'active' | 'disabled';
  status_formatted: string;
  created_at: string;
  updated_at: string;
  total_revenue: number;
  total_revenue_formatted: string;
  mrr: number;
  mrr_formatted: string;
  has_subscriptions: boolean;
  country: string;
  region: string;
  total_orders: number;
  total_subscriptions: number;
  avatar_url: string;
  url: string;
}

interface Order {
  id: string;
  store_id: number;
  customer_id: number;
  identifier: string;
  order_number: number;
  currency: string;
  subtotal: number;
  subtotal_formatted: string;
  discount_total: number;
  discount_total_formatted: string;
  tax: number;
  tax_formatted: string;
  total: number;
  total_formatted: string;
  subtotal_usd: number;
  subtotal_usd_formatted: string;
  discount_total_usd: number;
  discount_total_usd_formatted: string;
  tax_usd: number;
  tax_usd_formatted: string;
  total_usd: number;
  total_usd_formatted: string;
  status: 'pending' | 'fulfilled' | 'refunded';
  status_formatted: string;
  refunded_amount: number;
  refunded_amount_formatted: string;
  refunded_at: string;
  billing_address: BillingAddress;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
  first_order_item: OrderItem;
  order_items: OrderItem[];
  urls: {
    view: string;
  };
}

interface OrderItem {
  id: string;
  order_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  price: number;
  price_formatted: string;
  quantity: number;
  setup_fee: number;
  setup_fee_formatted: string;
  is_free_trial: boolean;
  trial_interval: 'day' | 'week' | 'month' | 'year';
  trial_interval_count: number;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  has_license_keys: boolean;
  license_keys: LicenseKey[];
  created_at: string;
  updated_at: string;
  test_mode: boolean;
  product: Product;
  variant: Variant;
}

interface LicenseKey {
  id: string;
  order_item_id: number;
  activation_limit: number;
  activation_usage: number;
  disabled_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  key: string;
  status: 'inactive' | 'active' | 'disabled' | 'expired';
  status_formatted: string;
  urls: {
    activate: string;
  };
}

interface Subscription {
  id: string;
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  status: 'on_trial' | 'active' | 'paused' | 'unpaid' | 'cancelled' | 'expired';
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  currency: string;
  subtotal: number;
  subtotal_formatted: string;
  discount_total: number;
  discount_total_formatted: string;
  tax: number;
  tax_formatted: string;
  total: number;
  total_formatted: string;
  subtotal_usd: number;
  subtotal_usd_formatted: string;
  discount_total_usd: number;
  discount_total_usd_formatted: string;
  tax_usd: number;
  tax_usd_formatted: string;
  total_usd: number;
  total_usd_formatted: string;
  trial_ends_at: string;
  renews_at: string;
  ends_at: string;
  cancelled_at: string;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
  urls: {
    update_payment_method: string;
    customer_portal: string;
  };
}

interface DiscountCode {
  id: string;
  store_id: number;
  code: string;
  amount: number;
  amount_type: 'percent' | 'fixed';
  is_limited: boolean;
  is_limited_to_products: boolean;
  is_limited_to_variants: boolean;
  max_uses: number;
  uses: number;
  minimum_amount: number;
  applies_to: 'all' | 'products' | 'variants';
  products: Product[];
  variants: Variant[];
  expires_at: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'expired';
  status_formatted: string;
}

// Enhanced webhook event interface
interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data: any;
  };
  data: {
    type: string;
    id: string;
    attributes: any;
  };
  signature: string;
}

// ===== LEMON SQUEEZY PAYMENT PROCESSOR =====

class LemonSqueezyProcessor {
  private lemon: LemonSqueezy;

  constructor(apiKey: string, options?: { apiKey?: string }) {
    this.lemon = new LemonSqueezy(apiKey, options);
  }

  // ===== STORE OPERATIONS =====

  // Get store information
  async getStore(storeId: string): Promise<Store> {
    try {
      const response = await this.lemon.getStore(storeId);
      return response.data as Store;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List all stores
  async listStores(): Promise<{ data: Store[]; meta: any }> {
    try {
      const response = await this.lemon.listStores();
      return {
        data: response.data as Store[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== PRODUCT OPERATIONS =====

  // Create product
  async createProduct(storeId: string, params: {
    name: string;
    description?: string;
    status?: 'draft' | 'published';
    slug?: string;
  }): Promise<Product> {
    try {
      const response = await this.lemon.createProduct(storeId, params);
      return response.data as Product;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Get product
  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await this.lemon.getProduct(productId);
      return response.data as Product;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update product
  async updateProduct(productId: string, params: {
    name?: string;
    description?: string;
    status?: 'draft' | 'published';
    slug?: string;
  }): Promise<Product> {
    try {
      const response = await this.lemon.updateProduct(productId, params);
      return response.data as Product;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<{ deleted: boolean }> {
    try {
      await this.lemon.deleteProduct(productId);
      return { deleted: true };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List products
  async listProducts(storeId: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ data: Product[]; meta: any }> {
    try {
      const response = await this.lemon.listProducts(storeId, params);
      return {
        data: response.data as Product[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== VARIANT OPERATIONS =====

  // Create variant
  async createVariant(productId: string, params: {
    name: string;
    price: number;
    description?: string;
    status?: 'draft' | 'published';
    slug?: string;
    pay_what_you_want?: boolean;
    min_price?: number;
    suggested_price?: number;
    has_free_trial?: boolean;
    trial_interval?: 'day' | 'week' | 'month' | 'year';
    trial_interval_count?: number;
    interval?: 'day' | 'week' | 'month' | 'year';
    interval_count?: number;
    has_license_keys?: boolean;
    license_keys_required?: number;
    license_key_lifetime?: number;
  }): Promise<Variant> {
    try {
      const response = await this.lemon.createVariant(productId, params);
      return response.data as Variant;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Get variant
  async getVariant(variantId: string): Promise<Variant> {
    try {
      const response = await this.lemon.getVariant(variantId);
      return response.data as Variant;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update variant
  async updateVariant(variantId: string, params: {
    name?: string;
    price?: number;
    description?: string;
    status?: 'draft' | 'published';
    slug?: string;
    pay_what_you_want?: boolean;
    min_price?: number;
    suggested_price?: number;
    has_free_trial?: boolean;
    trial_interval?: 'day' | 'week' | 'month' | 'year';
    trial_interval_count?: number;
    interval?: 'day' | 'week' | 'month' | 'year';
    interval_count?: number;
    has_license_keys?: boolean;
    license_keys_required?: number;
    license_key_lifetime?: number;
  }): Promise<Variant> {
    try {
      const response = await this.lemon.updateVariant(variantId, params);
      return response.data as Variant;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Delete variant
  async deleteVariant(variantId: string): Promise<{ deleted: boolean }> {
    try {
      await this.lemon.deleteVariant(variantId);
      return { deleted: true };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List variants
  async listVariants(productId: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ data: Variant[]; meta: any }> {
    try {
      const response = await this.lemon.listVariants(productId, params);
      return {
        data: response.data as Variant[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== CHECKOUT OPERATIONS =====

  // Create checkout
  async createCheckout(params: {
    store_id: number;
    variant_id: number;
    email?: string;
    name?: string;
    billing_address?: {
      country: string;
      state?: string;
      zip?: string;
    };
    tax_number?: string;
    discount_code?: string;
    custom_price?: number;
    product_options?: Record<string, any>;
    checkout_data?: {
      custom: {
        [key: string]: any;
      };
      embed: boolean;
      media: boolean;
      logo: boolean;
      desc: boolean;
      discount: boolean;
      dark: boolean;
      subscription_preview: boolean;
    };
    checkout_options?: {
      button_color: string;
      embed: boolean;
      media: boolean;
      logo: boolean;
      desc: boolean;
      discount: boolean;
      dark: boolean;
      subscription_preview: boolean;
    };
    preview?: boolean;
  }): Promise<Checkout> {
    try {
      const response = await this.lemon.createCheckout(params);
      return response.data as Checkout;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Get checkout
  async getCheckout(checkoutId: string): Promise<Checkout> {
    try {
      const response = await this.lemon.getCheckout(checkoutId);
      return response.data as Checkout;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List checkouts
  async listCheckouts(storeId: string, params?: {
    page?: number;
    per_page?: number;
    email?: string;
    status?: 'pending' | 'paid' | 'failed' | 'refunded';
    order_id?: number;
  }): Promise<{ data: Checkout[]; meta: any }> {
    try {
      const response = await this.lemon.listCheckouts(storeId, params);
      return {
        data: response.data as Checkout[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== CUSTOMER OPERATIONS =====

  // Get customer
  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await this.lemon.getCustomer(customerId);
      return response.data as Customer;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update customer
  async updateCustomer(customerId: string, params: {
    email?: string;
    name?: string;
    status?: 'pending' | 'active' | 'disabled';
  }): Promise<Customer> {
    try {
      const response = await this.lemon.updateCustomer(customerId, params);
      return response.data as Customer;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List customers
  async listCustomers(storeId: string, params?: {
    page?: number;
    per_page?: number;
    email?: string;
    status?: 'pending' | 'active' | 'disabled';
  }): Promise<{ data: Customer[]; meta: any }> {
    try {
      const response = await this.lemon.listCustomers(storeId, params);
      return {
        data: response.data as Customer[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== ORDER OPERATIONS =====

  // Get order
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await this.lemon.getOrder(orderId);
      return response.data as Order;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List orders
  async listOrders(storeId: string, params?: {
    page?: number;
    per_page?: number;
    email?: string;
    status?: 'pending' | 'fulfilled' | 'refunded';
  }): Promise<{ data: Order[]; meta: any }> {
    try {
      const response = await this.lemon.listOrders(storeId, params);
      return {
        data: response.data as Order[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== SUBSCRIPTION OPERATIONS =====

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.lemon.getSubscription(subscriptionId);
      return response.data as Subscription;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, params: {
    card_token?: string;
    product_id?: number;
    variant_id?: number;
    billing_anchor?: number;
    pause?: {
      mode: 'void' | 'free';
      resumes_at?: string;
    };
    cancelled?: boolean;
  }): Promise<Subscription> {
    try {
      const response = await this.lemon.updateSubscription(subscriptionId, params);
      return response.data as Subscription;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.lemon.updateSubscription(subscriptionId, { cancelled: true });
      return response.data as Subscription;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Pause subscription
  async pauseSubscription(subscriptionId: string, params: {
    mode: 'void' | 'free';
    resumes_at?: string;
  }): Promise<Subscription> {
    try {
      const response = await this.lemon.updateSubscription(subscriptionId, { pause: params });
      return response.data as Subscription;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Resume subscription
  async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.lemon.updateSubscription(subscriptionId, { pause: undefined });
      return response.data as Subscription;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List subscriptions
  async listSubscriptions(storeId: string, params?: {
    page?: number;
    per_page?: number;
    email?: string;
    status?: 'on_trial' | 'active' | 'paused' | 'unpaid' | 'cancelled' | 'expired';
  }): Promise<{ data: Subscription[]; meta: any }> {
    try {
      const response = await this.lemon.listSubscriptions(storeId, params);
      return {
        data: response.data as Subscription[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== LICENSE KEY OPERATIONS =====

  // Get license key
  async getLicenseKey(licenseKeyId: string): Promise<LicenseKey> {
    try {
      const response = await this.lemon.getLicenseKey(licenseKeyId);
      return response.data as LicenseKey;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update license key
  async updateLicenseKey(licenseKeyId: string, params: {
    activation_limit?: number;
    disabled?: boolean;
    expires_at?: string;
  }): Promise<LicenseKey> {
    try {
      const response = await this.lemon.updateLicenseKey(licenseKeyId, params);
      return response.data as LicenseKey;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List license keys
  async listLicenseKeys(orderItemId: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ data: LicenseKey[]; meta: any }> {
    try {
      const response = await this.lemon.listLicenseKeys(orderItemId, params);
      return {
        data: response.data as LicenseKey[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== DISCOUNT CODE OPERATIONS =====

  // Create discount code
  async createDiscountCode(storeId: string, params: {
    code: string;
    amount: number;
    amount_type: 'percent' | 'fixed';
    is_limited?: boolean;
    is_limited_to_products?: boolean;
    is_limited_to_variants?: boolean;
    max_uses?: number;
    minimum_amount?: number;
    applies_to?: 'all' | 'products' | 'variants';
    product_ids?: number[];
    variant_ids?: number[];
    expires_at?: string;
  }): Promise<DiscountCode> {
    try {
      const response = await this.lemon.createDiscountCode(storeId, params);
      return response.data as DiscountCode;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Get discount code
  async getDiscountCode(discountCodeId: string): Promise<DiscountCode> {
    try {
      const response = await this.lemon.getDiscountCode(discountCodeId);
      return response.data as DiscountCode;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Update discount code
  async updateDiscountCode(discountCodeId: string, params: {
    code?: string;
    amount?: number;
    amount_type?: 'percent' | 'fixed';
    is_limited?: boolean;
    is_limited_to_products?: boolean;
    is_limited_to_variants?: boolean;
    max_uses?: number;
    minimum_amount?: number;
    applies_to?: 'all' | 'products' | 'variants';
    product_ids?: number[];
    variant_ids?: number[];
    expires_at?: string;
  }): Promise<DiscountCode> {
    try {
      const response = await this.lemon.updateDiscountCode(discountCodeId, params);
      return response.data as DiscountCode;
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Delete discount code
  async deleteDiscountCode(discountCodeId: string): Promise<{ deleted: boolean }> {
    try {
      await this.lemon.deleteDiscountCode(discountCodeId);
      return { deleted: true };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // List discount codes
  async listDiscountCodes(storeId: string, params?: {
    page?: number;
    per_page?: number;
    status?: 'active' | 'expired';
  }): Promise<{ data: DiscountCode[]; meta: any }> {
    try {
      const response = await this.lemon.listDiscountCodes(storeId, params);
      return {
        data: response.data as DiscountCode[],
        meta: response.meta,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // ===== WEBHOOK OPERATIONS =====

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      return this.lemon.verifyWebhookSignature(payload, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  // Parse webhook event
  parseWebhookEvent(payload: string): WebhookEvent {
    try {
      return JSON.parse(payload) as WebhookEvent;
    } catch (error) {
      throw new Error(`Invalid webhook payload: ${error}`);
    }
  }

  // Handle webhook events
  async handleWebhook(event: WebhookEvent): Promise<void> {
    try {
      switch (event.meta.event_name) {
        case 'order_created':
          await this.handleOrderCreated(event.data.attributes);
          break;
        case 'order_refunded':
          await this.handleOrderRefunded(event.data.attributes);
          break;
        case 'subscription_created':
          await this.handleSubscriptionCreated(event.data.attributes);
          break;
        case 'subscription_updated':
          await this.handleSubscriptionUpdated(event.data.attributes);
          break;
        case 'subscription_cancelled':
          await this.handleSubscriptionCancelled(event.data.attributes);
          break;
        case 'subscription_resumed':
          await this.handleSubscriptionResumed(event.data.attributes);
          break;
        case 'subscription_expired':
          await this.handleSubscriptionExpired(event.data.attributes);
          break;
        case 'license_key_created':
          await this.handleLicenseKeyCreated(event.data.attributes);
          break;
        case 'license_key_updated':
          await this.handleLicenseKeyUpdated(event.data.attributes);
          break;
        default:
          console.log(`Unhandled event type: ${event.meta.event_name}`);
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.meta.event_name}:`, error);
      throw error;
    }
  }

  // ===== WEBHOOK EVENT HANDLERS =====

  private async handleOrderCreated(order: any): Promise<void> {
    console.log(`Order ${order.id} created:`, {
      customer_id: order.customer_id,
      total: order.total,
      currency: order.currency,
    });

    // Handle new order
    // Example: await this.sendOrderConfirmation(order.customer_id, order.id);
  }

  private async handleOrderRefunded(order: any): Promise<void> {
    console.log(`Order ${order.id} refunded:`, {
      customer_id: order.customer_id,
      refunded_amount: order.refunded_amount,
      currency: order.currency,
    });

    // Handle order refund
    // Example: await this.sendRefundNotification(order.customer_id, order.id);
  }

  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    console.log(`Subscription ${subscription.id} created:`, {
      customer_id: subscription.customer_id,
      product_id: subscription.product_id,
      status: subscription.status,
    });

    // Handle new subscription
    // Example: await this.sendSubscriptionWelcome(subscription.customer_id, subscription.id);
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    console.log(`Subscription ${subscription.id} updated:`, {
      customer_id: subscription.customer_id,
      status: subscription.status,
      renews_at: subscription.renews_at,
    });

    // Handle subscription update
  }

  private async handleSubscriptionCancelled(subscription: any): Promise<void> {
    console.log(`Subscription ${subscription.id} cancelled:`, {
      customer_id: subscription.customer_id,
      ends_at: subscription.ends_at,
    });

    // Handle subscription cancellation
    // Example: await this.sendCancellationSurvey(subscription.customer_id, subscription.id);
  }

  private async handleSubscriptionResumed(subscription: any): Promise<void> {
    console.log(`Subscription ${subscription.id} resumed:`, {
      customer_id: subscription.customer_id,
      renews_at: subscription.renews_at,
    });

    // Handle subscription resume
  }

  private async handleSubscriptionExpired(subscription: any): Promise<void> {
    console.log(`Subscription ${subscription.id} expired:`, {
      customer_id: subscription.customer_id,
      ended_at: subscription.ends_at,
    });

    // Handle subscription expiration
    // Example: await this.sendExpirationNotice(subscription.customer_id, subscription.id);
  }

  private async handleLicenseKeyCreated(licenseKey: any): Promise<void> {
    console.log(`License key ${licenseKey.id} created:`, {
      order_item_id: licenseKey.order_item_id,
      key: licenseKey.key,
    });

    // Handle license key creation
    // Example: await this.deliverLicenseKey(licenseKey.order_item_id, licenseKey.key);
  }

  private async handleLicenseKeyUpdated(licenseKey: any): Promise<void> {
    console.log(`License key ${licenseKey.id} updated:`, {
      order_item_id: licenseKey.order_item_id,
      status: licenseKey.status,
    });

    // Handle license key update
  }

  // ===== ERROR HANDLING =====

  private handleLemonSqueezyError(error: any): Error {
    if (error.response) {
      // Lemon Squeezy API error
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        return new Error(`Bad request: ${data.message || 'Invalid parameters'}`);
      } else if (status === 401) {
        return new Error('Unauthorized: Invalid API key');
      } else if (status === 403) {
        return new Error('Forbidden: Insufficient permissions');
      } else if (status === 404) {
        return new Error('Not found: Resource does not exist');
      } else if (status === 422) {
        return new Error(`Validation error: ${data.message || 'Invalid data'}`);
      } else if (status === 429) {
        return new Error('Rate limit exceeded: Too many requests');
      } else if (status >= 500) {
        return new Error('Server error: Lemon Squeezy server error');
      } else {
        return new Error(`API error: ${data.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to connect to Lemon Squeezy');
    } else {
      // Other error
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
    newVariantId: string
  ): Promise<{ proration_amount: number; currency: string }> {
    try {
      const subscription = await this.getSubscription(subscriptionId);
      const newVariant = await this.getVariant(newVariantId);
      
      // Simple proration calculation (actual implementation would be more complex)
      const daysInMonth = 30;
      const daysRemaining = Math.max(0, 
        Math.ceil((new Date(subscription.renews_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );
      
      const prorationAmount = (newVariant.price / daysInMonth) * daysRemaining;
      
      return {
        proration_amount: Math.round(prorationAmount),
        currency: subscription.currency,
      };
    } catch (error) {
      throw this.handleLemonSqueezyError(error);
    }
  }

  // Generate customer portal URL
  generateCustomerPortalUrl(customerId: string): string {
    return `https://app.lemonsqueezy.com/my-orders/${customerId}`;
  }

  // Generate checkout URL
  generateCheckoutUrl(variantId: string, options?: {
    embed?: boolean;
    dark?: boolean;
    media?: boolean;
    logo?: boolean;
    desc?: boolean;
    discount?: boolean;
    subscription_preview?: boolean;
  }): string {
    const baseUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}`;
    const params = new URLSearchParams();
    
    if (options?.embed) params.append('embed', 'true');
    if (options?.dark) params.append('dark', 'true');
    if (options?.media) params.append('media', 'true');
    if (options?.logo) params.append('logo', 'true');
    if (options?.desc) params.append('desc', 'true');
    if (options?.discount) params.append('discount', 'true');
    if (options?.subscription_preview) params.append('subscription_preview', 'true');
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
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

EXERCISE 2: Build a license key management system that:
- Generates and validates license keys
- Handles activation limits and usage
- Provides key expiration management
- Supports key revocation
- Is fully typed

EXERCISE 3: Create a webhook processing service that:
- Handles all Lemon Squeezy webhook events
- Provides event routing and processing
- Includes retry logic for failed events
- Logs all events for audit
- Is fully typed

EXERCISE 4: Build a customer portal that:
- Allows customers to manage subscriptions
- Handles payment method updates
- Provides order history
- Supports self-service cancellation
- Is fully typed

EXERCISE 5: Create a product catalog system that:
- Manages products and variants
- Handles pricing and discounts
- Provides inventory management
- Supports product options
- Is fully typed
*/

// Export the Lemon Squeezy processor
export { LemonSqueezyProcessor };

// Export types
export type {
  Store,
  Product,
  Variant,
  Checkout,
  Customer,
  Order,
  OrderItem,
  LicenseKey,
  Subscription,
  DiscountCode,
  WebhookEvent,
  BillingAddress,
};