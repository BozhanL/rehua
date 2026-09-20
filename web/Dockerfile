FROM node:24-trixie-slim@sha256:6950b66b4c0cb0151ce89fa75074673850763d096b044f422c6729b588dd4956 AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
