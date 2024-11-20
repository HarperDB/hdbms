function setupInsightTagPartnerIds() {
  LinkedinPartnerId = "4710650";
  window.LinkedinDataPartnerIds = window.LinkedinDataPartnerIds || [];
  window.LinkedinDataPartnerIds.push(LinkedinPartnerId);
}
function installInsightTag() {
  (function (l) {
    if (!l) {
      window.lintrk = function (a, b) {
        window.lintrk.q.push([a, b]);
      };
      window.lintrk.q = [];
    }
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);
  })(window.lintrk);
}
setTimeout(() => {
  if (window.location.hostname === 'studio.harperdb.io') {
    setupInsightTagPartnerIds();
    installInsightTag();
  }
}, 1000);