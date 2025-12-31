
FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install packages needed for build (openssl is required for Prisma)
RUN apt-get update && apt-get install -y openssl

# Install pnpm
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* ./

# Install dependencies (removing frozen-lockfile to be more forgiving on network glitches/platform diffs)
# Also using --prefer-offline if available helps, but let's stick to standard install
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Setup pnpm environment again for builder
RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start command
CMD ["node", "server.js"]
