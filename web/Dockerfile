FROM node:24-trixie-slim@sha256:9aa7037f0da5b7578ba0d9974d6970da91017e019929ec85eb4e7da22af83b1b AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
