# Stage 1: Build stage
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install git required by vp config and development tooling
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

# Enable Corepack and prepare the required pnpm version
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate

# Copy workspace package manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/main/package.json ./apps/main/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project source code
COPY . .

# Build using Vite+ task runner command configured in vite.config.ts
RUN pnpm vp run build

# Stage 2: Production runner stage
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Copy application package definition (for ESM type) and built output
COPY --from=builder /app/apps/main/package.json ./package.json
COPY --from=builder /app/apps/main/build ./build

USER node

EXPOSE 3000

CMD ["node", "build/index.js"]
