# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY payments/src/sdk/package*.json ./payments/src/sdk/

# Install curl for health check
RUN apk add --no-cache curl

# Install dependencies
RUN npm ci --only=production

# Build SDK (skip if pre-built)
COPY payments/src/sdk ./payments/src/sdk
RUN cd payments/src/sdk && npm ci && npm run build

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "run", "serve"]