# AMS IT Services website: React client + Node.js/Express API + SQLite, served from one container.
# Build:  docker build -t ams-it-services .
# Run:    docker run -p 5000:5000 -v ams-data:/app/data --env-file .env ams-it-services

# 1) Build the React client
FROM node:22-bookworm-slim AS client
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2) Install server production dependencies (build tools only needed if better-sqlite3 has no prebuilt binary)
FROM node:22-bookworm-slim AS server-deps
WORKDIR /app/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# 3) Runtime image
FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    PORT=5000 \
    DB_PATH=/app/data/app.db
WORKDIR /app
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=client /app/client/dist ./client/dist
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
EXPOSE 5000
# The SQLite database (users, messages, CMS content) lives here — mount a persistent volume.
VOLUME ["/app/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000) + '/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

WORKDIR /app/server
CMD ["node", "index.js"]
