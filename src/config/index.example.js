export default {
  studioVersion: 'x.x.xx',
  env: 'dev',
  stripePublicKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXX',
  lmsApiUrl: 'XXXXXXXXXXXXXXXXXXXXXXXX',
  googleAnalyticsCode: 'UA-XXXXXXXXXXXXX-3',
  tcVersion: '2020-01-01',
  checkVersionInterval: 300000,
  refreshContentInterval: 10000,
  freeCloudInstanceLimit: 1,
  maxFileUploadSize: 10380902,
  alarmBadgeThreshold: 86400,
  maintenance: 0,
  isLocalStudio: process.env.REACT_APP_LOCALSTUDIO,
  // this is injected at build-time and loads LocalApp.js instead of App.js
  localStudioDevUrl: 'http://localhost:9925' // this lets you dev the UI on port 3000 and talk to your local instance on 9925
};