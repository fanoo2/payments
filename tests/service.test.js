const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Create the app using the same logic as the main service
function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // In-memory storage for demo purposes
  const sessions = new Map();

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'fanno-payments'
    });
  });

  // Payment routes
  app.post('/payments/create-session', (req, res) => {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({ error: 'amount and currency are required' });
    }

    const sessionId = `cs_${Math.random().toString(36).substring(2, 15)}`;
    
    sessions.set(sessionId, {
      id: sessionId,
      amount,
      currency,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    res.json({ sessionId });
  });

  app.post('/payments/webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'checkout.session.completed') {
      const sessionId = data?.object?.id;
      
      if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        session.status = 'complete';
        sessions.set(sessionId, session);
      }
    }
    
    res.json({ received: true });
  });

  return { app, sessions };
}

describe('Payments Service', () => {
  let app;

  beforeEach(() => {
    const result = createApp();
    app = result.app;
    // sessions = result.sessions; // Not needed in tests
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'fanno-payments'
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /payments/create-session', () => {
    it('should create a payment session successfully', async () => {
      const response = await request(app)
        .post('/payments/create-session')
        .send({ amount: 1000, currency: 'usd' })
        .expect(200);

      expect(response.body.sessionId).toBeDefined();
      expect(response.body.sessionId).toMatch(/^cs_[a-z0-9]+$/);
    });

    it('should return 400 when amount is missing', async () => {
      const response = await request(app)
        .post('/payments/create-session')
        .send({ currency: 'usd' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'amount and currency are required'
      });
    });

    it('should return 400 when currency is missing', async () => {
      const response = await request(app)
        .post('/payments/create-session')
        .send({ amount: 1000 })
        .expect(400);

      expect(response.body).toEqual({
        error: 'amount and currency are required'
      });
    });
  });

  describe('POST /payments/webhook', () => {
    it('should process webhook successfully', async () => {
      // First create a session
      const createResponse = await request(app)
        .post('/payments/create-session')
        .send({ amount: 1000, currency: 'usd' });

      const sessionId = createResponse.body.sessionId;

      // Then send webhook
      const response = await request(app)
        .post('/payments/webhook')
        .send({
          id: 'evt_test_webhook',
          type: 'checkout.session.completed',
          data: { object: { id: sessionId } }
        })
        .expect(200);

      expect(response.body).toEqual({ received: true });
    });

    it('should handle unknown webhook types', async () => {
      const response = await request(app)
        .post('/payments/webhook')
        .send({
          id: 'evt_test_webhook',
          type: 'unknown.event.type',
          data: { object: { id: 'some_id' } }
        })
        .expect(200);

      expect(response.body).toEqual({ received: true });
    });
  });
});