# SPDX-License-Identifier: MIT

FROM node:24-trixie-slim@sha256:0820eaa85e07d0490446dd01d14707e17e6108a36988cf374899cd057eb3812d AS builder

WORKDIR /app

COPY ./package-lock.json ./package.json ./.npmrc /app/
COPY ./api /app/api

RUN npm ci --no-audit && \
  npm run build -w api && \
  rm ./api/dist/tsconfig.build.tsbuildinfo

FROM node:24-trixie-slim@sha256:0820eaa85e07d0490446dd01d14707e17e6108a36988cf374899cd057eb3812d AS dependencies

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

FROM node:24-trixie-slim@sha256:0820eaa85e07d0490446dd01d14707e17e6108a36988cf374899cd057eb3812d AS app

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api/dist ./dist

ENV NODE_ENV=production \
  DATA_PATH=/data \
  MAX_FILE_SIZE=104857600 \
  PORT=3001
VOLUME [ "/data" ]

USER node

CMD [ "node", "./dist/main.js" ]
