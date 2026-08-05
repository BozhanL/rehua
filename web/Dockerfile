FROM node:24-trixie-slim@sha256:b622a0bf896a85c5b13b7973eaf3f06e909cf539576551a67724323a21da2b17 AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
