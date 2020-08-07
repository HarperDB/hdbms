const oribi = function (b, o, n, g, s, r, c) {
  if (b[s]) return;
  b[s] = {};
  b[s].scriptToken = 'XzEyMzY3MDg2ODg';
  b[s].callsQueue = [];
  b[s].api = function () {
    b[s].callsQueue.push(arguments);
  };
  r = o.createElement(n);
  c = o.getElementsByTagName(n)[0];
  r.async = 1;
  r.src = g;
  r.id = s + n;
  c.parentNode.insertBefore(r, c);
};

setTimeout(() => {
  oribi(window, document, 'script', 'https://cdn.oribi.io/XzEyMzY3MDg2ODg/oribi.js', 'ORIBI');
}, 1000);
