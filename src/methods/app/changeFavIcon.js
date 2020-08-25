export default (theme) => {
  document.getElementById('dynamic-favicon').href = `/images/favicon_${theme}.png`;
};
