# Base on Node.js LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create database directory and set permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app/data

# Install TypeScript globally
RUN npm install -g typescript

# Transpile the TypeScript setup script to JavaScript
RUN npx tsc scripts/setup-db.ts --outDir dist

# Run the transpiled database setup script
RUN node dist/scripts/setup-db.js

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

# Expose the port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["node", "server.js"]
