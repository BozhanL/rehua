# SPDX-License-Identifier: MIT

FROM node:26-trixie-slim@sha256:e4db4c914bf8ad241bd24804fc25d272d89bad97e68cdc8a1414862790a02c39 AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
