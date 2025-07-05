
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
  const { id, type, data } = req.body;
  
  if (type === 'checkout.session.completed') {
    const sessionId = data?.object?.id;
    
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      session.status = 'complete';
      sessions.set(sessionId, session);
      
      console.log(`Payment session ${sessionId} completed`);
    }
  }
  
  res.json({ received: true });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Payments service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
