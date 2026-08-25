FROM node:24-trixie-slim@sha256:0711b541c1c33a8a530ac4f0d391baa9a15b3d804695b1b24a47daa5fb60e74d AS builder

WORKDIR /app

COPY ./package-lock.json ./package.json ./.npmrc /app/
COPY ./api /app/api

RUN npm ci --no-audit && \
  npm run build -w api && \
  rm ./api/dist/tsconfig.build.tsbuildinfo

FROM node:24-trixie-slim@sha256:0711b541c1c33a8a530ac4f0d391baa9a15b3d804695b1b24a47daa5fb60e74d AS dependencies

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

FROM node:24-trixie-slim@sha256:0711b541c1c33a8a530ac4f0d391baa9a15b3d804695b1b24a47daa5fb60e74d AS app

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api/dist ./dist

ENV NODE_ENV=production
USER node

CMD [ "node", "./dist/main.js" ]
