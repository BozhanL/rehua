FROM node:24-trixie-slim@sha256:996f094d0487f4f9cbc9227a4ebba56e011d3653679909b04a9fa6dc7ab54aa4 AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
