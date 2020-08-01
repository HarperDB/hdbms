(function (u, s, e, r, g) {
  u[r] = u[r] || [];
  u[r].push({
    'ug.start': new Date().getTime(),
    event: 'embed.js',
  });
  var f = s.getElementsByTagName(e)[0],
    j = s.createElement(e);
  j.async = true;
  j.src = 'https://static.userguiding.com/media/user-guiding-' + g + '-embedded.js';
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'userGuidingLayer', '08963898ID');
