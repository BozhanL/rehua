FROM node:24-trixie-slim@sha256:0711b541c1c33a8a530ac4f0d391baa9a15b3d804695b1b24a47daa5fb60e74d AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
