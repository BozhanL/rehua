FROM node:24-trixie-slim@sha256:a4911b53f5ebfe54c71a84553b7f7e9f22babe83863886d3741c2aa1e2e1d47e AS builder

WORKDIR /app

COPY ./package-lock.json ./package.json ./.npmrc /app/
COPY ./api /app/api

RUN npm ci --no-audit && \
  npm run build -w api && \
  rm ./api/dist/tsconfig.build.tsbuildinfo

FROM node:24-trixie-slim@sha256:a4911b53f5ebfe54c71a84553b7f7e9f22babe83863886d3741c2aa1e2e1d47e AS dependencies

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

FROM node:24-trixie-slim@sha256:a4911b53f5ebfe54c71a84553b7f7e9f22babe83863886d3741c2aa1e2e1d47e AS app

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api/dist ./dist

ENV NODE_ENV=production
USER node

CMD [ "node", "./dist/main.js" ]
