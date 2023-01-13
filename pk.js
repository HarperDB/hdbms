{
  "name": "harperdb-studio",
  "version": "4.0.1",
  "description": "A UI for HarperDB",
  "deploymentUrl": "studio.harperdb.io",
  "private": true,
  "author": "harperdb",
  "license": "UNLICENSED",
  "scripts": {
    "test": "playwright test",
    "start": "HTTPS=true SSL_CRT_FILE=./.cert/cert.pem SSL_KEY_FILE=./.cert/key.pem react-scripts start",
    "build:dev": "PUBLIC_URL=https://d2uv4fa0aeja0t.cloudfront.net react-scripts build",
    "build:stage": "GENERATE_SOURCEMAP=false PUBLIC_URL=https://dbjxbnqel2bw9.cloudfront.net react-scripts build",
    "build:prod": "GENERATE_SOURCEMAP=false PUBLIC_URL=https://ds5zz9rfvzuta.cloudfront.net react-scripts build",
    "lint": "eslint --fix src && npx stylelint --fix \"src/**/*.scss\""
  },
  "dependencies": {
    "@monaco-editor/react": "^4.2.0",
    "@stripe/react-stripe-js": "^1.4.1",
    "@stripe/stripe-js": "^1.15.0",
    "apexcharts": "^3.27.1",
    "bootstrap-scss": "^5.0.1",
    "deepmerge": "^4.2.2",
    "lolight": "^1.4.0",
    "pullstate": "^1.22.1",
    "query-string": "^8.1.0",
    "react": "=17.0.2",
    "react-alert": "^7.0.3",
    "react-apexcharts": "^1.3.9",
    "react-card-flip": "^1.1.1",
    "react-country-region-selector": "^3.4.0",
    "react-dom": "=17.0.2",
    "react-dropzone": "^14.2.2",
    "react-error-boundary": "^3.1.3",
    "react-json-editor-ajrm": "^2.5.11",
    "react-router": "=5.2.1",
    "react-router-dom": "=5.3.0",
    "react-router-ga": "^1.2.3",
    "react-scripts": "^5.0.0",
    "react-select": "^5.0.0",
    "react-table": "^7.7.0",
    "react-toggle": "^4.1.2",
    "reactstrap": "^9.0.0",
    "use-async-effect": "^2.2.3",
    "use-interval": "^1.3.0",
    "use-persisted-state": "^0.3.3",
    "whatwg-fetch": "^3.6.2"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@playwright/test": "^1.29.2",
    "eslint": "^8.24.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-prettier": "^4.0.0",
    "postcss-custom-properties": "^13.0.0",
    "prettier": "^2.3.1",
    "sass": "^1.46.0",
    "stylelint": "^14.0.1",
    "stylelint-config-sass-guidelines": "^9.0.1",
    "stylelint-config-standard": "^29.0.0",
    "stylelint-order": "^6.0.1",
    "stylelint-scss": "^4.0.0"
  }
}
