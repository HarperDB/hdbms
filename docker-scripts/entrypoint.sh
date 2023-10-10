#!/usr/bin/env bash

set -euo pipefail

# write config file
PACKAGE_VERSION=$(sed -nr 's/^\s*\"version": "([0-9]{1,}\.[0-9]{1,}.*)",$/\1/p' ./package.json); \
cat <<EOF > /home/node/app/src/config/index.js
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
cat <<EOF > /home/node/app/public/manifest.json
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

npm run docker