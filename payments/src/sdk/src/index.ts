
import { z } from 'zod';
import { SessionRequest, SessionResponse, WebhookEvent } from './models';

export interface PaymentsConfig {
  apiKey: string;
  baseUrl?: string;
}

export class PaymentsClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: PaymentsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'http://localhost:5000';
  }

  async createCheckoutSession(request: SessionRequest): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/payments/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  handleWebhook(body: any): WebhookEvent {
    const parsed = WebhookEvent.parse(body);
    return parsed;
  }
}

export function createPaymentsClient(config: PaymentsConfig): PaymentsClient {
  return new PaymentsClient(config);
}

export * from './models';
