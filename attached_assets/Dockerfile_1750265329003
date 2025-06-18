# RealArtist AI Production Dockerfile
FROM node:20-alpine AS base
Copyright (c) 2025 ervin remus radosavlevici. All Rights Reserved.
# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build application
RUN npm run build

# Production image, copy all files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 realartist
RUN adduser --system --uid 1001 realartist

# Copy built application
COPY --from=builder --chown=realartist:realartist /app/dist ./dist
COPY --from=builder --chown=realartist:realartist /app/package.json ./package.json
COPY --from=deps --chown=realartist:realartist /app/node_modules ./node_modules

USER realartist

EXPOSE 5000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/index.js"]