FROM node:24-trixie-slim@sha256:996f094d0487f4f9cbc9227a4ebba56e011d3653679909b04a9fa6dc7ab54aa4 AS builder

WORKDIR /app

COPY ./package-lock.json ./package.json ./.npmrc /app/
COPY ./api /app/api

RUN npm ci --no-audit && \
  npm run build -w api && \
  rm ./api/dist/tsconfig.build.tsbuildinfo

FROM node:24-trixie-slim@sha256:996f094d0487f4f9cbc9227a4ebba56e011d3653679909b04a9fa6dc7ab54aa4 AS dependencies

WORKDIR /app

COPY ./package.json ./package-lock.json ./.npmrc ./
COPY ./api/package.json ./api/
RUN mkdir -p ./node_modules ./api/node_modules && \
  \
  npm ci \
  --omit=dev \
  --ignore-scripts \
  --no-audit \
  -w api \
  --include-workspace-root

FROM node:24-trixie-slim@sha256:996f094d0487f4f9cbc9227a4ebba56e011d3653679909b04a9fa6dc7ab54aa4 AS app

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api/dist ./dist

ENV NODE_ENV=production
USER node

CMD [ "node", "./dist/main.js" ]
