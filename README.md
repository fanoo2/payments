# Fanno Payments Service

A microservice for handling payments with Stripe integration, built with Express.js and TypeScript SDK.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/fanoo2/payments.git
cd payments

# Install dependencies
npm install

# Build the SDK
npm run build

# Start the service
npm run serve
```

The service will be available at `http://localhost:5000`

### Health Check

```bash
curl http://localhost:5000/health
```

## 📋 Environment Variables

### Required
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)

### Optional
- `PORT` - Port to run the service on (default: 5000)
- `NODE_ENV` - Environment mode (development, production)
- `ORCHESTRATOR_URL` - URL for orchestrator service notifications

### Example .env file

```bash
NODE_ENV=development
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
ORCHESTRATOR_URL=https://orchestrator.example.com
```

## 🏗️ Architecture

This repository uses npm workspaces with the following structure:

```
.
├── payments/
│   ├── index.js              # Express service
│   └── src/sdk/              # TypeScript SDK package
├── tests/                    # Jest unit tests
├── helm/fanno-payments/      # Kubernetes Helm chart
└── .github/workflows/        # CI/CD workflows
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 📦 API Endpoints

### Health Check
- `GET /health` - Service health status

### Payments
- `POST /payments/create-session` - Create a checkout session
- `POST /payments/webhook` - Handle Stripe webhooks

### Example: Create Checkout Session

```bash
curl -X POST http://localhost:5000/payments/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "usd",
    "customer_email": "customer@example.com"
  }'
```

## 🔧 SDK Usage

The TypeScript SDK is available as `@fanno/payments-api-client`:

```typescript
import { createPaymentsClient } from '@fanno/payments-api-client';

const client = createPaymentsClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-api-endpoint.com'
});

const session = await client.createCheckoutSession({
  amount: 1000,
  currency: 'usd'
});
```

See [SDK Documentation](./payments/src/sdk/README.md) for detailed usage.

## 🐳 Docker

### Build and Run

```bash
# Build Docker image
docker build -t fanno/payments .

# Run container
docker run -p 5000:5000 \
  -e STRIPE_SECRET_KEY=sk_test_your_key \
  fanno/payments
```

### Docker Compose

```yaml
version: '3.8'
services:
  payments:
    build: .
    ports:
      - "5000:5000"
    environment:
      - STRIPE_SECRET_KEY=sk_test_your_key
      - NODE_ENV=production
```

## ☸️ Kubernetes Deployment

Deploy using the included Helm chart:

```bash
# Install with Helm
helm install fanno-payments ./helm/fanno-payments \
  --set config.stripe.secretKey="sk_test_your_stripe_key" \
  --set image.repository="your-registry/fanno-payments" \
  --set image.tag="latest"
```

### Kubernetes Secrets

For production, store secrets in Kubernetes:

```bash
# Create secret
kubectl create secret generic fanno-payments-secrets \
  --from-literal=stripe-secret-key=sk_live_your_stripe_key

# Deploy with existing secret
helm install fanno-payments ./helm/fanno-payments \
  --set config.stripe.existingSecret="fanno-payments-secrets"
```

## 🚦 CI/CD

The repository includes GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`) - Runs on PRs and pushes
  - Linting and code quality checks
  - Unit tests
  - Build verification
  - Health and smoke tests
  - Docker image building

- **Release** (`.github/workflows/ci-cd.yml`) - Runs on main branch
  - Everything from CI
  - SDK publishing to NPM
  - Docker image publishing to registry
  - Version management and releases
  - Frontend repository notifications

## 🔐 Security

### Stripe Webhooks

To verify webhook signatures (recommended for production):

1. Set `STRIPE_WEBHOOK_SECRET` environment variable
2. Update webhook handling in `payments/index.js`

### Docker Security

The Docker image:
- Runs as non-root user (nextjs:1001)
- Uses read-only root filesystem
- Drops all capabilities
- Excludes sensitive files (tests, docs, etc.)

## 🏷️ Versioning

This project uses [Semantic Versioning](https://semver.org/):

- **Patch**: Bug fixes
- **Minor**: New features (backward compatible)
- **Major**: Breaking changes

Releases are automated through GitHub Actions when pushing to main.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm test` and `npm run lint`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create a GitHub issue
- Check existing documentation
- Review logs and health endpoints

## 🔗 Related Projects

- [Frontend Application](https://github.com/fanoo2/frontend) - Consumes this payments service
- [Orchestrator Service](https://github.com/fanoo2/orchestrator) - Manages service coordination