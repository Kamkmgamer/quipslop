FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE ${PORT:-5109}

CMD ["bun", "server.ts"]
