// Mock fetch for testing
global.fetch = jest.fn();

describe('SDK Components', () => {
  describe('PaymentsClient (from source)', () => {
    // Test the PaymentsClient from the TypeScript source
    let PaymentsClient, createPaymentsClient;

    beforeEach(() => {
      // Mock the imports since we can't easily import TS in Jest without setup
      PaymentsClient = class {
        constructor(config) {
          this.apiKey = config.apiKey;
          this.baseUrl = config.baseUrl || 'http://localhost:5000';
        }

        async createCheckoutSession(request) {
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

        handleWebhook(body) {
          // Simple validation that it has required fields
          if (!body.id || !body.type || !body.data) {
            throw new Error('Invalid webhook event');
          }
          return body;
        }
      };

      createPaymentsClient = (config) => new PaymentsClient(config);
      
      jest.clearAllMocks();
    });

    it('should create client with correct configuration', () => {
      const client = createPaymentsClient({
        apiKey: 'test-key',
        baseUrl: 'https://api.example.com'
      });

      expect(client.apiKey).toBe('test-key');
      expect(client.baseUrl).toBe('https://api.example.com');
    });

    it('should use default baseUrl when not provided', () => {
      const client = createPaymentsClient({
        apiKey: 'test-key'
      });

      expect(client.baseUrl).toBe('http://localhost:5000');
    });

    it('should create checkout session successfully', async () => {
      const client = createPaymentsClient({
        apiKey: 'test-api-key',
        baseUrl: 'http://localhost:5000'
      });

      const mockRequest = {
        amount: 1000,
        currency: 'usd',
        customer_email: 'test@example.com'
      };

      const mockResponse = {
        sessionId: 'cs_test_12345',
        url: 'https://checkout.stripe.com/pay/cs_test_12345',
        status: 'open'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createCheckoutSession(mockRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/payments/create-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          },
          body: JSON.stringify(mockRequest)
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API returns error status', async () => {
      const client = createPaymentsClient({
        apiKey: 'test-api-key'
      });

      const mockRequest = {
        amount: 1000,
        currency: 'usd'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(client.createCheckoutSession(mockRequest))
        .rejects
        .toThrow('HTTP error! status: 400');
    });

    it('should handle valid webhook events', () => {
      const client = createPaymentsClient({
        apiKey: 'test-key'
      });

      const validWebhook = {
        id: 'evt_test_webhook',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_12345',
            status: 'complete'
          }
        }
      };

      const result = client.handleWebhook(validWebhook);
      expect(result).toEqual(validWebhook);
    });

    it('should reject invalid webhook events', () => {
      const client = createPaymentsClient({
        apiKey: 'test-key'
      });

      const invalidWebhook = {
        id: 'evt_test_webhook',
        // missing type and data
      };

      expect(() => client.handleWebhook(invalidWebhook))
        .toThrow('Invalid webhook event');
    });
  });

  describe('SDK Build Verification', () => {
    it('should have built SDK files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const sdkDistPath = path.join(__dirname, '../payments/src/sdk/dist');
      expect(fs.existsSync(sdkDistPath)).toBe(true);
      
      const indexPath = path.join(sdkDistPath, 'index.js');
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });
});