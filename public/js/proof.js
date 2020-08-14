const proof = () => {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.proof-x.com/proofx.js?px_wid=-MEctSvMxYXkNxBLdbSi');
  script.setAttribute('async', 'true');
  document.head.appendChild(script);
};

setTimeout(() => {
  if (window.location.hostname === 'studio.harperdb.io') {
    proof();
  }
}, 1000);
