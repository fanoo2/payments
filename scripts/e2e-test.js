const fetch = require('node-fetch');

(async () => {
  try {
    console.log('Running E2E Smoke Test...');

    // 1. Create a payment session
    console.log('1. POST /payments/create-session');
    let res = await fetch('http://localhost:5000/payments/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, currency: 'usd' })
    });
    if (!res.ok) throw new Error(`Create session failed: ${res.status}`);
    const { sessionId } = await res.json();
    console.log(`  → sessionId: ${sessionId}`);

    // 2. Simulate a Stripe webhook
    console.log('2. POST /payments/webhook');
    res = await fetch('http://localhost:5000/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'evt_test_webhook',
        type: 'checkout.session.completed',
        data: { object: { id: sessionId } }
      })
    });
    if (!res.ok) throw new Error(`Webhook failed: ${res.status}`);
    console.log('  → Webhook processed successfully');

    console.log('✅ E2E Smoke Test PASSED');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Smoke Test FAILED:', err.message);
    process.exit(1);
  }
})();