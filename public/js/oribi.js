const oribi = () => {
  if (window.ORIBI) return;
  window.ORIBI = {
    scriptToken: 'XzEyMzY3MDg2ODg',
    callsQueue: [],
    api: (args) => {
      window.ORIBI.callsQueue.push(args);
    },
  };
  const script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.oribi.io/XzEyMzY3MDg2ODg/oribi.js');
  script.setAttribute('async', 'true');
  document.head.appendChild(script);
};

setTimeout(() => {
  if (window.location.hostname === 'studio.harperdb.io') {
    oribi();
  }
}, 1000);
