FROM node:24-trixie-slim@sha256:85498d7fd8e2bc0b02abb1792ef27341559836236dd0b1af160fa66bb85148df AS builder


COPY --chown=node:node ./package-lock.json ./package.json ./.npmrc /app/
COPY --chown=node:node ./sdk /app/sdk
COPY --chown=node:node ./web /app/web

WORKDIR /app
USER node

CMD [ "sleep", "inf" ]
