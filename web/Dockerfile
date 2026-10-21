# SPDX-License-Identifier: MIT

FROM node:24-trixie-slim@sha256:1375326a10579cc1fd089d5da149ad29ae76dc3ccee6c0b0746d3de09dc5d0a1 AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
