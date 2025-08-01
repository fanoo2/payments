# Fanno Payments Service Deployment Guide

## Overview

This repository contains the Fanno Payments Service with automated SDK publishing, versioning, and Docker/Helm deployment capabilities.

## Features

- ✅ Automated semantic versioning with standard-version
- ✅ NPM SDK publishing pipeline
- ✅ Cross-repository dispatch notifications
- ✅ Docker containerization
- ✅ Helm chart for Kubernetes deployment
- ✅ Comprehensive CI/CD pipeline

## SDK Publishing

The SDK `@fanno/payments-api-client` is automatically published to NPM when changes are pushed to the main branch.

### Manual Publishing

```bash
# Build and publish SDK manually
npm run build
cd payments/src/sdk
npm publish
```

### Version Management

```bash
# Create a new patch release
npm run release

# Create a new minor release
npm run release:minor

# Create a new major release
npm run release:major
```

## Docker Deployment

### Building the Docker Image

```bash
docker build -t fanno-payments .
```

### Running the Container

```bash
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e STRIPE_SECRET_KEY=your_stripe_key \
  -e ORCHESTRATOR_URL=your_orchestrator_url \
  fanno-payments
```

### Environment Variables

- `NODE_ENV`: Runtime environment (production, development)
- `PORT`: Service port (default: 5000)
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `ORCHESTRATOR_URL`: URL for orchestrator notifications

## Helm Deployment

### Prerequisites

- Kubernetes cluster
- Helm 3.x installed
- kubectl configured

### Installation

```bash
# Install with default values
helm install fanno-payments helm/fanno-payments

# Install with custom values
helm install fanno-payments helm/fanno-payments \
  --set image.tag=v1.0.3 \
  --set config.stripe.secretKey=your_stripe_key \
  --set config.orchestrator.url=https://your-orchestrator.com
```

### Upgrading

```bash
helm upgrade fanno-payments helm/fanno-payments \
  --set image.tag=v1.0.4
```

### Configuration

Key configuration options in `values.yaml`:

```yaml
# Scaling
replicaCount: 2
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10

# Resources
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

# External services
config:
  stripe:
    secretKey: ""  # Set via --set or secrets
  orchestrator:
    url: ""
```

## CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Build & Test** - Builds SDK and runs E2E tests
2. **Version & Release** - Automated semantic versioning
3. **Publish SDK** - Publishes to NPM registry
4. **Docker Build** - Builds and pushes container image
5. **Cross-Repo Notification** - Notifies frontend of SDK updates

### Required Secrets

Configure these secrets in your GitHub repository:

- `NPM_TOKEN`: NPM authentication token for publishing
- `FRONTEND_REPO_TOKEN`: GitHub token for cross-repo dispatch
- `ORCHESTRATOR_URL`: URL for orchestrator notifications

### Cross-Repository Integration

When the SDK is published, a repository dispatch event is sent to the frontend repository with:

```json
{
  "sdk_version": "1.0.4",
  "service_version": "1.0.3",
  "package_name": "@fanno/payments-api-client",
  "registry": "https://registry.npmjs.org",
  "repository": "fanoo2/payments",
  "commit_sha": "abc123..."
}
```

## Health Monitoring

The service exposes a health endpoint:

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "fanno-payments"
}
```

## Development

### Local Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Start service
npm run serve

# Development with auto-rebuild
npm run dev:service
```

### API Endpoints

- `GET /health` - Health check
- `POST /payments/create-session` - Create payment session
- `POST /payments/webhook` - Payment webhook handler

## Support

For issues and questions:
- Repository: https://github.com/fanoo2/payments
- Issues: https://github.com/fanoo2/payments/issues