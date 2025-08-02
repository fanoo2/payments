# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Copy package files for dependency installation
COPY package*.json ./
COPY payments/src/sdk/package*.json ./payments/src/sdk/

# Install dependencies
RUN npm ci --only=production

# Copy and build SDK first
COPY payments/src/sdk/src ./payments/src/sdk/src
COPY payments/src/sdk/tsconfig.json ./payments/src/sdk/
RUN cd payments/src/sdk && npm ci && npm run build

# Copy only the application code needed for runtime
COPY payments/index.js ./payments/
COPY index.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "run", "serve"]