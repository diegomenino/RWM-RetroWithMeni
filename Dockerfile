# Stage 1: Install dependencies (including native build for better-sqlite3)
FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
RUN apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public         ./public
COPY --from=builder /app/.next          ./.next
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/package.json   ./package.json
COPY --from=builder /app/server.js      ./server.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/lib            ./lib
COPY --from=builder /app/socket         ./socket

# Create data directory for SQLite
RUN mkdir -p /app/data

VOLUME ["/app/data"]
EXPOSE 3000

CMD ["node", "server.js"]
