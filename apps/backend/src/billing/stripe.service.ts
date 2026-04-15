import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InstituteBilling } from '../master-entities/institute-billing.entity';

interface StripeEvent {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: any;
    previous_attributes?: any;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
  type: string;
}

interface StripeCustomer {
  id: string;
  email: string;
  metadata?: Record<string, string>;
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  items?: {
    data: Array<{
      price: {
        id: string;
        product: string;
      };
    }>;
  };
  metadata?: Record<string, string>;
}

interface StripeInvoice {
  id: string;
  customer: string;
  subscription: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  paid: boolean;
  created: number;
  period_start: number;
  period_end: number;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @InjectRepository(InstituteBilling, 'master')
    private billingRepository: Repository<InstituteBilling>,
  ) {}

  /**
   * Handle Stripe webhook events
   * Webhook signature verification should be done in the controller
   */
  async handleWebhookEvent(event: StripeEvent): Promise<void> {
    this.logger.log(`Processing Stripe event: ${event.type} (ID: ${event.id})`);

    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(
            event.data.object,
            event.data.previous_attributes,
          );
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;

        case 'customer.updated':
          await this.handleCustomerUpdated(event.data.object);
          break;

        default:
          this.logger.warn(`Unhandled webhook event type: ${event.type}`);
      }

      this.logger.log(`Successfully processed event: ${event.type}`);
    } catch (error) {
      this.logger.error(`Error processing webhook event ${event.type}:`, error);
      throw error;
    }
  }

  /**
   * Handle subscription created event
   */
  private async handleSubscriptionCreated(
    subscription: StripeSubscription,
  ): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { stripeCustomerId: subscription.customer },
    });

    if (!billing) {
      this.logger.warn(
        `Billing record not found for customer: ${subscription.customer}`,
      );
      return;
    }

    billing.subscriptionId = subscription.id;
    billing.status = subscription.status;
    billing.currentPeriodStart = new Date(
      subscription.current_period_start * 1000,
    );
    billing.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    billing.nextBillingDate = new Date(subscription.current_period_end * 1000);

    await this.billingRepository.save(billing);
    this.logger.log(
      `Subscription created for billing ID: ${billing.id}, subscription: ${subscription.id}`,
    );
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(
    subscription: StripeSubscription,
    previousAttributes?: Record<string, any>,
  ): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { subscriptionId: subscription.id },
    });

    if (!billing) {
      this.logger.warn(
        `Billing record not found for subscription: ${subscription.id}`,
      );
      return;
    }

    // Update period information
    billing.currentPeriodStart = new Date(
      subscription.current_period_start * 1000,
    );
    billing.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    billing.nextBillingDate = new Date(subscription.current_period_end * 1000);

    // Check if status changed
    if (
      previousAttributes?.status &&
      previousAttributes.status !== subscription.status
    ) {
      billing.status = subscription.status;

      if (subscription.status === 'past_due') {
        this.logger.warn(
          `Subscription ${subscription.id} is past due for billing ID: ${billing.id}`,
        );
      } else if (subscription.status === 'canceled') {
        this.logger.log(
          `Subscription ${subscription.id} canceled for billing ID: ${billing.id}`,
        );
      }
    }

    await this.billingRepository.save(billing);
    this.logger.log(`Subscription updated for billing ID: ${billing.id}`);
  }

  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(
    subscription: StripeSubscription,
  ): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { subscriptionId: subscription.id },
    });

    if (!billing) {
      this.logger.warn(
        `Billing record not found for subscription: ${subscription.id}`,
      );
      return;
    }

    billing.status = 'canceled';
    billing.subscriptionId = undefined;
    billing.nextBillingDate = undefined;

    await this.billingRepository.save(billing);
    this.logger.log(`Subscription deleted for billing ID: ${billing.id}`);
  }

  /**
   * Handle invoice payment succeeded event
   */
  private async handleInvoicePaymentSucceeded(
    invoice: StripeInvoice,
  ): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { subscriptionId: invoice.subscription },
    });

    if (!billing) {
      this.logger.warn(
        `Billing record not found for subscription: ${invoice.subscription}`,
      );
      return;
    }

    // Update billing status to active if it was past_due
    if (billing.status === 'past_due') {
      billing.status = 'active';
    }

    billing.amountDue = 0;

    // Add invoice to history
    if (!billing.invoices) {
      billing.invoices = [];
    }

    billing.invoices.push({
      id: invoice.id,
      amount: invoice.amount_paid,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      status: 'paid',
      date: new Date(invoice.created * 1000).toISOString(),
      periodStart: new Date(invoice.period_start * 1000).toISOString(),
      periodEnd: new Date(invoice.period_end * 1000).toISOString(),
    });

    await this.billingRepository.save(billing);
    this.logger.log(
      `Invoice payment succeeded for billing ID: ${billing.id}, amount: ${invoice.amount_paid}`,
    );
  }

  /**
   * Handle invoice payment failed event
   */
  private async handleInvoicePaymentFailed(
    invoice: StripeInvoice,
  ): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { subscriptionId: invoice.subscription },
    });

    if (!billing) {
      this.logger.warn(
        `Billing record not found for subscription: ${invoice.subscription}`,
      );
      return;
    }

    billing.status = 'past_due';
    billing.amountDue = invoice.amount_due;

    // Add failed invoice to history
    if (!billing.invoices) {
      billing.invoices = [];
    }

    billing.invoices.push({
      id: invoice.id,
      amount: invoice.amount_paid,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      date: new Date(invoice.created * 1000).toISOString(),
      periodStart: new Date(invoice.period_start * 1000).toISOString(),
      periodEnd: new Date(invoice.period_end * 1000).toISOString(),
    });

    await this.billingRepository.save(billing);
    this.logger.warn(
      `Invoice payment failed for billing ID: ${billing.id}, amount due: ${invoice.amount_due}`,
    );
  }

  /**
   * Handle customer updated event
   */
  private async handleCustomerUpdated(customer: StripeCustomer): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { stripeCustomerId: customer.id },
    });

    if (!billing) {
      this.logger.warn(`Billing record not found for customer: ${customer.id}`);
      return;
    }

    // Update billing record if needed
    // Currently just logging, but can store additional customer info if needed

    this.logger.log(`Customer updated: ${customer.id}`);
  }

  /**
   * Retrieve customer from Stripe
   */
  async getStripeCustomer(customerId: string): Promise<StripeCustomer | null> {
    // This would call Stripe API in a real implementation
    // For now, just return null as we're not calling Stripe directly
    this.logger.log(`Getting customer: ${customerId}`);
    return null;
  }

  /**
   * Retrieve subscription from Stripe
   */
  async getStripeSubscription(
    subscriptionId: string,
  ): Promise<StripeSubscription | null> {
    // This would call Stripe API in a real implementation
    // For now, just return null as we're not calling Stripe directly
    this.logger.log(`Getting subscription: ${subscriptionId}`);
    return null;
  }

  /**
   * Update billing status
   */
  async updateBillingStatus(
    billingId: string,
    status: string,
  ): Promise<InstituteBilling> {
    const billing = await this.billingRepository.findOne({
      where: { id: billingId },
    });

    if (!billing) {
      throw new BadRequestException(`Billing record not found: ${billingId}`);
    }

    billing.status = status;
    return this.billingRepository.save(billing);
  }

  /**
   * Get billing record by institute
   */
  async getBillingByInstitute(
    instituteId: string,
  ): Promise<InstituteBilling | null> {
    return this.billingRepository.findOne({
      where: { instituteId },
      relations: ['institute'],
    });
  }

  /**
   * Create billing record for institute
   */
  async createBillingRecord(
    instituteId: string,
    stripeCustomerId: string,
  ): Promise<InstituteBilling> {
    const billing = this.billingRepository.create({
      instituteId,
      stripeCustomerId,
      status: 'active',
      currency: 'USD',
      invoices: [],
    });

    return this.billingRepository.save(billing);
  }

  /**
   * Retry failed payment
   */
  async retryFailedPayment(billingId: string): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { id: billingId },
    });

    if (!billing) {
      throw new BadRequestException(`Billing record not found: ${billingId}`);
    }

    if (billing.status !== 'past_due') {
      throw new BadRequestException(
        `Cannot retry payment: billing status is ${billing.status}`,
      );
    }

    // In a real implementation, this would trigger Stripe API call
    // For now, just log the action
    this.logger.log(`Retrying failed payment for billing ID: ${billingId}`);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(billingId: string): Promise<void> {
    const billing = await this.billingRepository.findOne({
      where: { id: billingId },
    });

    if (!billing) {
      throw new BadRequestException(`Billing record not found: ${billingId}`);
    }

    if (!billing.subscriptionId) {
      throw new BadRequestException(
        `No active subscription found for billing ID: ${billingId}`,
      );
    }

    // In a real implementation, this would trigger Stripe API call
    // For now, just log the action
    this.logger.log(
      `Canceling subscription ${billing.subscriptionId} for billing ID: ${billingId}`,
    );
  }
}
