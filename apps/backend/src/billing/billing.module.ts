import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeysModule } from '../api-keys/api-keys.module';
import { InstituteBilling } from '../master-entities/institute-billing.entity';
import { Invoice } from '../master-entities/invoice.entity';
import { RateLimitingModule } from '../rate-limiting/rate-limiting.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeService } from './stripe.service';

/**
 * Billing Module
 *
 * Handles subscription management, payments, invoices, and billing records
 * Integrates with Stripe for payment processing and webhook handling
 *
 * Controllers:
 * - BillingController - API endpoints for billing and subscription operations
 * - InvoiceController - API endpoints for invoice management
 * - StripeWebhookController - Webhook endpoint for Stripe events
 *
 * Services:
 * - BillingService - CRUD operations for billing records
 * - InvoiceService - Invoice management and generation
 * - StripeService - Stripe integration and webhook event handling
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([InstituteBilling, Invoice], 'master'),
    ApiKeysModule,
    RateLimitingModule,
  ],
  controllers: [BillingController, InvoiceController, StripeWebhookController],
  providers: [BillingService, InvoiceService, StripeService],
  exports: [BillingService, InvoiceService, StripeService],
})
export class BillingModule {}
