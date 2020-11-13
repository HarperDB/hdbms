const userGuide = (u, s, e, r, g) => {
  u[r] = u[r] || [];
  u[r].push({
    'ug.start': new Date().getTime(),
    event: 'embed.js',
  });
  const f = s.getElementsByTagName(e)[0];
  const j = s.createElement(e);
  j.async = true;
  j.src = `https://static.userguiding.com/media/user-guiding-${g}-embedded.js`;
  f.parentNode.insertBefore(j, f);
};

setTimeout(() => {
  if (window.location.hostname === 'studio.harperdb.io') {
    userGuide(window, document, 'script', 'userGuidingLayer', '08963898ID');
  }
}, 1000);
