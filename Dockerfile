FROM node:current as builder

ARG STRIPE_PUBLIC_KEY="na"
ARG GOOGLE_ANALYTICS_CODE="na"
ARG GOOGLE_ANALYTICS_CODE="na"
ARG ENVIRONMENT="dev"
ARG URL="https://${ENVIRONMENT}.studio.harperdb.io"

# copy whole repo into docker image to start
COPY . .

# Build stuff, mostly copied from .github/workflows/publish-stage.yaml
#######################################################################

# write config file
RUN PACKAGE_VERSION=$(sed -nr 's/^\s*\"version": "([0-9]{1,}\.[0-9]{1,}.*)",$/\1/p' ./package.json); \
    cat <<EOF > ./src/config/index.js
export default {
  env: '${ENVIRONMENT}',
  stripe_public_key: '${STRIPE_PUBLIC_KEY}',
  lms_api_url: 'https://dev.harperdbcloudservices.com/',
  google_analytics_code: '${GOOGLE_ANALYTICS_CODE}',
  youtube_api_key: '${YOUTUBE_API_KEY}',
  postman_collection_url: 'https://www.postman.com/collections/7046690-5a70b340-8fe1-4487-88bd-ffac077c3df8',
  tc_version: '2020-01-01',
  check_version_interval: 300000,
  refresh_content_interval: 15000,
  total_cloud_instance_limit: 10,
  free_cloud_instance_limit: 1,
  total_local_instance_limit: false,
  free_local_instance_limit: false,
  max_file_upload_size: 10380902,
  studio_version:'${PACKAGE_VERSION}',
  user_guide_id: 16032,
  alarm_badge_threshold: 86400,
  maintenance: 0,
  errortest: 0
};
EOF

# write manifest file
RUN cat <<EOF > ./public/manifest.json
{
  "short_name": "HarperDB Studio",
  "name": "HarperDB Studio",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "16x16",
      "type": "image/x-icon"
    },
    {
      "src": "images/logo_vertical_white.png",
      "type": "image/png",
      "sizes": "536x672"
    }
  ],
  "start_url": "${URL}",
  "display": "standalone",
  "theme_color": "#480b8a",
  "background_color": "#ffffff"
}
EOF

RUN yarn; yarn lint; yarn build:${ENVIRONMENT}

FROM node:current-slim

# copy only build files from builder stage
COPY --chown=node:node --from=builder build /home/node/app/public
COPY --chown=node:node --from=builder node_modules/ /home/node/app/node_modules
COPY --chown=node:node --from=builder /package.json /home/node/app/
COPY --chown=node:node --from=builder src /home/node/app/src
COPY --chown=node:node --from=builder .eslintrc /home/node/app/
COPY --chown=node:node --from=builder .eslintignore /home/node/app/

USER node
WORKDIR /home/node/app

EXPOSE 3000

CMD npm run docker