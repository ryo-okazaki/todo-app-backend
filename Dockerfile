# --- Build Stage ---
FROM node:22.15.0-slim AS builder

WORKDIR /app

# OpenSSL is required for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Install dependencies including devDependencies (needed for build)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:22.15.0-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma in production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Use non-root user
USER node

# Start command
CMD ["node", "dist/server.js"]
