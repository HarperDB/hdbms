FROM node:current AS builder

ARG ENVIRONMENT="dev"

# copy whole repo into docker image to start
COPY . .

# Replce index.example.js with corresponding .env file?
# RUN cp src/config/index.example.js src/config/index.js

# Build stuff, mostly copied from .github/workflows/publish-stage.yaml
#######################################################################
RUN yarn; yarn lint; yarn build:${ENVIRONMENT}

FROM node:current-slim

# copy only build files from builder stage
COPY --chown=node:node --from=builder build /home/node/app/public
COPY --chown=node:node --from=builder node_modules/ /home/node/app/node_modules
COPY --chown=node:node --from=builder /package.json /home/node/app/
COPY --chown=node:node --from=builder src /home/node/app/src
COPY --chown=node:node --from=builder .eslintrc /home/node/app/
COPY --chown=node:node --from=builder .eslintignore /home/node/app/
COPY --chown=node:node docker-scripts/entrypoint.sh /home/node/app/entrypoint.sh

USER node
WORKDIR /home/node/app

ENV STRIPE_PUBLIC_KEY="na"
ENV GOOGLE_ANALYTICS_CODE="na"
ENV YOUTUBE_API_KEY="na"
ENV ENVIRONMENT=$ENVIRONMENT
ENV URL="https://$ENVIRONMENT.studio.harperdb.io"

EXPOSE 3000

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
