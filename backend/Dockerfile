# -----------------------------
# Stage 1: Build dependencies
# -----------------------------
FROM node:24-alpine AS builder

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src


# -----------------------------
# Stage 2: Runtime image
# -----------------------------
FROM node:24-alpine

RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

EXPOSE 5000

CMD ["node", "-r", "tsx/cjs", "src/server.js"]