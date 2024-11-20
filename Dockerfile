# Base on Node.js LTS (Long Term Support)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (with legacy peer deps)
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create database directory and set permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app/data

# Setup the database
RUN node -r ts-node/register scripts/setup-db.ts

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/data ./data

# Set correct permissions
RUN chown -R nextjs:nodejs .

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Environment variables must be redefined at runtime
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"] 