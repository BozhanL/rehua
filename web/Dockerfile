FROM node:24-trixie-slim@sha256:a4911b53f5ebfe54c71a84553b7f7e9f22babe83863886d3741c2aa1e2e1d47e AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
