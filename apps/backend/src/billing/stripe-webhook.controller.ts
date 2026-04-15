import { timingSafeEqual } from 'crypto';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

import { StripeService } from './stripe.service';

/**
 * Stripe webhook event structure
 */
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
  [key: string]: any;
}

@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private stripeService: StripeService) {}

  /**
   * Handle Stripe webhook events
   * POST /webhooks/stripe
   *
   * Receives webhook events from Stripe, verifies the signature,
   * and processes the event accordingly.
   *
   * Events handled:
   * - customer.subscription.created
   * - customer.subscription.updated
   * - customer.subscription.deleted
   * - invoice.payment_succeeded
   * - invoice.payment_failed
   * - customer.updated
   */
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      this.logger.error('Missing Stripe signature header');
      return { received: false };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error(
        'STRIPE_WEBHOOK_SECRET environment variable not configured',
      );
      return { received: false };
    }

    try {
      // Get raw body for signature verification
      const rawBody = req.rawBody || Buffer.from('');
      const body = typeof rawBody === 'string' ? rawBody : rawBody.toString();

      // Verify Stripe webhook signature
      const isValid = this.verifyStripeSignature(
        body,
        signature,
        webhookSecret,
      );
      if (!isValid) {
        this.logger.error('Invalid Stripe webhook signature - rejecting event');
        return { received: false };
      }

      // Parse event from body
      const event: StripeEvent = JSON.parse(body);

      this.logger.log(
        `Received Stripe webhook event: ${event.type} (ID: ${event.id})`,
      );

      // Delegate event handling to service
      await this.stripeService.handleWebhookEvent(event);

      this.logger.log(`Successfully processed Stripe event: ${event.type}`);
      return { received: true };
    } catch (error) {
      this.logger.error('Error processing Stripe webhook:', error);
      throw new InternalServerErrorException(
        'Failed to process Stripe webhook. Stripe will retry.',
      );
    }
  }

  /**
   * Verify Stripe webhook signature using HMAC-SHA256
   *
   * Stripe sends signatures in the format: t=timestamp,v1=signature1,v1=signature2...
   * We compute our own signature and compare using timing-safe comparison
   *
   * @param body - Raw request body (must be the exact bytes sent by Stripe)
   * @param signature - Stripe-Signature header value
   * @param secret - Webhook signing secret from Stripe dashboard
   * @returns true if signature is valid, false otherwise
   */
  private verifyStripeSignature(
    body: string,
    signature: string,
    secret: string,
  ): boolean {
    try {
      const crypto = require('crypto');

      // Parse signature header: t=timestamp,v1=sig1,v1=sig2
      const elements = signature.split(',');
      let timestamp: string | null = null;
      const signatures: string[] = [];

      for (const element of elements) {
        const [key, value] = element.split('=');
        if (key?.trim() === 't') {
          timestamp = value?.trim();
        } else if (key?.trim() === 'v1') {
          signatures.push(value?.trim());
        }
      }

      if (!timestamp) {
        this.logger.warn('Missing timestamp in Stripe signature header');
        return false;
      }

      // Validate timestamp is recent (within 5 minutes)
      // Prevents replay attacks
      const now = Math.floor(Date.now() / 1000);
      const eventTime = parseInt(timestamp, 10);
      const timeDiff = Math.abs(now - eventTime);

      if (timeDiff > 300) {
        this.logger.warn(
          `Stripe webhook timestamp too old: ${timeDiff} seconds ago`,
        );
        return false;
      }

      // Compute expected signature
      // Stripe signs: timestamp.body using HMAC-SHA256 with webhook secret
      const signedContent = `${timestamp}.${body}`;
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedContent)
        .digest('hex');

      // Check if computed signature matches any in the header (Stripe sends multiple for rotation)
      let isValid = false;
      for (const sig of signatures) {
        if (
          sig &&
          crypto.timingSafeEqual(
            Buffer.from(sig, 'hex'),
            Buffer.from(computedSignature, 'hex'),
          )
        ) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        this.logger.warn(
          'Stripe webhook signature verification failed - signature mismatch',
        );
      }

      return isValid;
    } catch (error) {
      this.logger.error('Error verifying Stripe webhook signature:', error);
      return false;
    }
  }
}
