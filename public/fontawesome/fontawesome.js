/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
!function () {
  "use strict";

  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  function i(t, e) {
    for (var n = 0; n < e.length; n++) {
      var a = e[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a);
    }
  }
  function $(r) {
    for (var t = 1; t < arguments.length; t++) {
      var i = null != arguments[t] ? arguments[t] : {},
        e = Object.keys(i);
      "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(i).filter(function (t) {
        return Object.getOwnPropertyDescriptor(i, t).enumerable;
      }))), e.forEach(function (t) {
        var e, n, a;
        e = r, a = i[n = t], n in e ? Object.defineProperty(e, n, {
          value: a,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[n] = a;
      });
    }
    return r;
  }
  function p(t, e) {
    return function (t) {
      if (Array.isArray(t)) return t;
    }(t) || function (t, e) {
      var n = [],
        a = !0,
        r = !1,
        i = void 0;
      try {
        for (var o, c = t[Symbol.iterator](); !(a = (o = c.next()).done) && (n.push(o.value), !e || n.length !== e); a = !0);
      } catch (t) {
        r = !0, i = t;
      } finally {
        try {
          a || null == c.return || c.return();
        } finally {
          if (r) throw i;
        }
      }
      return n;
    }(t, e) || function () {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }();
  }
  function d(t) {
    return function (t) {
      if (Array.isArray(t)) {
        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
      }
    }(t) || function (t) {
      if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t);
    }(t) || function () {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }();
  }
  var t = function () {},
    e = {},
    n = {},
    a = null,
    o = {
      mark: t,
      measure: t
    };
  try {
    "undefined" != typeof window && (e = window), "undefined" != typeof document && (n = document), "undefined" != typeof MutationObserver && (a = MutationObserver), "undefined" != typeof performance && (o = performance);
  } catch (t) {}
  var c = (e.navigator || {}).userAgent,
    s = void 0 === c ? "" : c,
    v = e,
    b = n,
    l = a,
    f = o,
    u = !!v.document,
    m = !!b.documentElement && !!b.head && "function" == typeof b.addEventListener && "function" == typeof b.createElement,
    k = ~s.indexOf("MSIE") || ~s.indexOf("Trident/"),
    h = "___FONT_AWESOME___",
    A = 16,
    g = "fa",
    y = "svg-inline--fa",
    tt = "data-fa-i2svg",
    w = "data-fa-pseudo-element",
    x = "data-fa-pseudo-element-pending",
    C = "data-prefix",
    O = "data-icon",
    P = "fontawesome-i2svg",
    S = "async",
    N = ["HTML", "HEAD", "STYLE", "SCRIPT"],
    M = function () {
      try {
        return !0;
      } catch (t) {
        return !1;
      }
    }(),
    z = {
      fas: "solid",
      far: "regular",
      fal: "light",
      fad: "duotone",
      fab: "brands",
      fak: "kit",
      fa: "solid"
    },
    E = {
      solid: "fas",
      regular: "far",
      light: "fal",
      duotone: "fad",
      brands: "fab",
      kit: "fak"
    },
    j = "fa-layers-text",
    L = /Font Awesome ([5 ]*)(Solid|Regular|Light|Duotone|Brands|Free|Pro|Kit).*/i,
    R = {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal"
    },
    I = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    _ = I.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
    T = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"],
    Y = {
      GROUP: "group",
      SWAP_OPACITY: "swap-opacity",
      PRIMARY: "primary",
      SECONDARY: "secondary"
    },
    H = ["xs", "sm", "lg", "fw", "ul", "li", "border", "pull-left", "pull-right", "spin", "pulse", "rotate-90", "rotate-180", "rotate-270", "flip-horizontal", "flip-vertical", "flip-both", "stack", "stack-1x", "stack-2x", "inverse", "layers", "layers-text", "layers-counter", Y.GROUP, Y.SWAP_OPACITY, Y.PRIMARY, Y.SECONDARY].concat(I.map(function (t) {
      return "".concat(t, "x");
    })).concat(_.map(function (t) {
      return "w-".concat(t);
    })),
    F = v.FontAwesomeConfig || {};
  if (b && "function" == typeof b.querySelector) {
    [["data-family-prefix", "familyPrefix"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]].forEach(function (t) {
      var e,
        n = p(t, 2),
        a = n[0],
        r = n[1],
        i = "" === (e = function (t) {
          var e = b.querySelector("script[" + t + "]");
          if (e) return e.getAttribute(t);
        }(a)) || "false" !== e && ("true" === e || e);
      null != i && (F[r] = i);
    });
  }
  var D = $({}, {
    familyPrefix: g,
    replacementClass: y,
    autoReplaceSvg: !0,
    autoAddCss: !0,
    autoA11y: !0,
    searchPseudoElements: !1,
    observeMutations: !0,
    mutateApproach: "async",
    keepOriginalSource: !0,
    measurePerformance: !1,
    showMissingIcons: !0
  }, F);
  D.autoReplaceSvg || (D.observeMutations = !1);
  var et = $({}, D);
  v.FontAwesomeConfig = et;
  var U = v || {};
  U[h] || (U[h] = {}), U[h].styles || (U[h].styles = {}), U[h].hooks || (U[h].hooks = {}), U[h].shims || (U[h].shims = []);
  var W = U[h],
    q = [],
    V = !1;
  function X(t) {
    m && (V ? setTimeout(t, 0) : q.push(t));
  }
  m && ((V = (b.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(b.readyState)) || b.addEventListener("DOMContentLoaded", function t() {
    b.removeEventListener("DOMContentLoaded", t), V = 1, q.map(function (t) {
      return t();
    });
  }));
  var B,
    G = "pending",
    K = "settled",
    J = "fulfilled",
    Q = "rejected",
    Z = function () {},
    nt = "undefined" != typeof global && void 0 !== global.process && "function" == typeof global.process.emit,
    at = "undefined" == typeof setImmediate ? setTimeout : setImmediate,
    rt = [];
  function it() {
    for (var t = 0; t < rt.length; t++) rt[t][0](rt[t][1]);
    B = !(rt = []);
  }
  function ot(t, e) {
    rt.push([t, e]), B || (B = !0, at(it, 0));
  }
  function ct(t) {
    var e = t.owner,
      n = e.State,
      a = e.Data,
      r = t[n],
      i = t.then;
    if ("function" == typeof r) {
      n = J;
      try {
        a = r(a);
      } catch (t) {
        ut(i, t);
      }
    }
    st(i, a) || (n === J && lt(i, a), n === Q && ut(i, a));
  }
  function st(e, n) {
    var a;
    try {
      if (e === n) throw new TypeError("A promises callback cannot return that same promise.");
      if (n && ("function" == typeof n || "object" === r(n))) {
        var t = n.then;
        if ("function" == typeof t) return t.call(n, function (t) {
          a || (a = !0, n === t ? ft(e, t) : lt(e, t));
        }, function (t) {
          a || (a = !0, ut(e, t));
        }), !0;
      }
    } catch (t) {
      return a || ut(e, t), !0;
    }
    return !1;
  }
  function lt(t, e) {
    t !== e && st(t, e) || ft(t, e);
  }
  function ft(t, e) {
    t.State === G && (t.State = K, t.Data = e, ot(mt, t));
  }
  function ut(t, e) {
    t.State === G && (t.State = K, t.Data = e, ot(pt, t));
  }
  function dt(t) {
    t.Then = t.Then.forEach(ct);
  }
  function mt(t) {
    t.State = J, dt(t);
  }
  function pt(t) {
    t.State = Q, dt(t), !t.Handled && nt && global.process.emit("unhandledRejection", t.Data, t);
  }
  function ht(t) {
    global.process.emit("rejectionHandled", t);
  }
  function gt(t) {
    if ("function" != typeof t) throw new TypeError("Promise resolver " + t + " is not a function");
    if (this instanceof gt == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    this.Then = [], function (t, e) {
      function n(t) {
        ut(e, t);
      }
      try {
        t(function (t) {
          lt(e, t);
        }, n);
      } catch (t) {
        n(t);
      }
    }(t, this);
  }
  gt.prototype = {
    constructor: gt,
    State: G,
    Then: null,
    Data: void 0,
    Handled: !1,
    then: function (t, e) {
      var n = {
        owner: this,
        then: new this.constructor(Z),
        fulfilled: t,
        rejected: e
      };
      return !e && !t || this.Handled || (this.Handled = !0, this.State === Q && nt && ot(ht, this)), this.State === J || this.State === Q ? ot(ct, n) : this.Then.push(n), n.then;
    },
    catch: function (t) {
      return this.then(null, t);
    }
  }, gt.all = function (c) {
    if (!Array.isArray(c)) throw new TypeError("You must pass an array to Promise.all().");
    return new gt(function (n, t) {
      var a = [],
        r = 0;
      function e(e) {
        return r++, function (t) {
          a[e] = t, --r || n(a);
        };
      }
      for (var i, o = 0; o < c.length; o++) (i = c[o]) && "function" == typeof i.then ? i.then(e(o), t) : a[o] = i;
      r || n(a);
    });
  }, gt.race = function (r) {
    if (!Array.isArray(r)) throw new TypeError("You must pass an array to Promise.race().");
    return new gt(function (t, e) {
      for (var n, a = 0; a < r.length; a++) (n = r[a]) && "function" == typeof n.then ? n.then(t, e) : t(n);
    });
  }, gt.resolve = function (e) {
    return e && "object" === r(e) && e.constructor === gt ? e : new gt(function (t) {
      t(e);
    });
  }, gt.reject = function (n) {
    return new gt(function (t, e) {
      e(n);
    });
  };
  var vt = "function" == typeof Promise ? Promise : gt,
    bt = A,
    yt = {
      size: 16,
      x: 0,
      y: 0,
      rotate: 0,
      flipX: !1,
      flipY: !1
    };
  function wt(t) {
    if (t && m) {
      var e = b.createElement("style");
      e.setAttribute("type", "text/css"), e.innerHTML = t;
      for (var n = b.head.childNodes, a = null, r = n.length - 1; -1 < r; r--) {
        var i = n[r],
          o = (i.tagName || "").toUpperCase();
        -1 < ["STYLE", "LINK"].indexOf(o) && (a = i);
      }
      return b.head.insertBefore(e, a), t;
    }
  }
  var xt = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function kt() {
    for (var t = 12, e = ""; 0 < t--;) e += xt[62 * Math.random() | 0];
    return e;
  }
  function At(t) {
    for (var e = [], n = (t || []).length >>> 0; n--;) e[n] = t[n];
    return e;
  }
  function Ct(t) {
    return t.classList ? At(t.classList) : (t.getAttribute("class") || "").split(" ").filter(function (t) {
      return t;
    });
  }
  function Ot(t, e) {
    var n,
      a = e.split("-"),
      r = a[0],
      i = a.slice(1).join("-");
    return r !== t || "" === i || (n = i, ~H.indexOf(n)) ? null : i;
  }
  function Pt(t) {
    return "".concat(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function St(n) {
    return Object.keys(n || {}).reduce(function (t, e) {
      return t + "".concat(e, ": ").concat(n[e], ";");
    }, "");
  }
  function Nt(t) {
    return t.size !== yt.size || t.x !== yt.x || t.y !== yt.y || t.rotate !== yt.rotate || t.flipX || t.flipY;
  }
  function Mt(t) {
    var e = t.transform,
      n = t.containerWidth,
      a = t.iconWidth,
      r = {
        transform: "translate(".concat(n / 2, " 256)")
      },
      i = "translate(".concat(32 * e.x, ", ").concat(32 * e.y, ") "),
      o = "scale(".concat(e.size / 16 * (e.flipX ? -1 : 1), ", ").concat(e.size / 16 * (e.flipY ? -1 : 1), ") "),
      c = "rotate(".concat(e.rotate, " 0 0)");
    return {
      outer: r,
      inner: {
        transform: "".concat(i, " ").concat(o, " ").concat(c)
      },
      path: {
        transform: "translate(".concat(a / 2 * -1, " -256)")
      }
    };
  }
  var zt = {
    x: 0,
    y: 0,
    width: "100%",
    height: "100%"
  };
  function Et(t) {
    var e = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
    return t.attributes && (t.attributes.fill || e) && (t.attributes.fill = "black"), t;
  }
  function jt(t) {
    var e = t.icons,
      n = e.main,
      a = e.mask,
      r = t.prefix,
      i = t.iconName,
      o = t.transform,
      c = t.symbol,
      s = t.title,
      l = t.maskId,
      f = t.titleId,
      u = t.extra,
      d = t.watchable,
      m = void 0 !== d && d,
      p = a.found ? a : n,
      h = p.width,
      g = p.height,
      v = "fak" === r,
      b = v ? "" : "fa-w-".concat(Math.ceil(h / g * 16)),
      y = [et.replacementClass, i ? "".concat(et.familyPrefix, "-").concat(i) : "", b].filter(function (t) {
        return -1 === u.classes.indexOf(t);
      }).filter(function (t) {
        return "" !== t || !!t;
      }).concat(u.classes).join(" "),
      w = {
        children: [],
        attributes: $({}, u.attributes, {
          "data-prefix": r,
          "data-icon": i,
          class: y,
          role: u.attributes.role || "img",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 ".concat(h, " ").concat(g)
        })
      },
      x = v && !~u.classes.indexOf("fa-fw") ? {
        width: "".concat(h / g * 16 * .0625, "em")
      } : {};
    m && (w.attributes[tt] = ""), s && w.children.push({
      tag: "title",
      attributes: {
        id: w.attributes["aria-labelledby"] || "title-".concat(f || kt())
      },
      children: [s]
    });
    var k,
      A,
      C,
      O,
      P,
      S,
      N,
      M,
      z,
      E,
      j,
      L,
      R,
      I,
      _,
      T,
      Y,
      H,
      F,
      D,
      U,
      W,
      q,
      V,
      X,
      B,
      G,
      K = $({}, w, {
        prefix: r,
        iconName: i,
        main: n,
        mask: a,
        maskId: l,
        transform: o,
        symbol: c,
        styles: $({}, x, u.styles)
      }),
      J = a.found && n.found ? (C = (k = K).children, O = k.attributes, P = k.main, S = k.mask, N = k.maskId, M = k.transform, z = P.width, E = P.icon, j = S.width, L = S.icon, R = Mt({
        transform: M,
        containerWidth: j,
        iconWidth: z
      }), I = {
        tag: "rect",
        attributes: $({}, zt, {
          fill: "white"
        })
      }, _ = E.children ? {
        children: E.children.map(Et)
      } : {}, T = {
        tag: "g",
        attributes: $({}, R.inner),
        children: [Et($({
          tag: E.tag,
          attributes: $({}, E.attributes, R.path)
        }, _))]
      }, Y = {
        tag: "g",
        attributes: $({}, R.outer),
        children: [T]
      }, H = "mask-".concat(N || kt()), F = "clip-".concat(N || kt()), D = {
        tag: "mask",
        attributes: $({}, zt, {
          id: H,
          maskUnits: "userSpaceOnUse",
          maskContentUnits: "userSpaceOnUse"
        }),
        children: [I, Y]
      }, U = {
        tag: "defs",
        children: [{
          tag: "clipPath",
          attributes: {
            id: F
          },
          children: (A = L, "g" === A.tag ? A.children : [A])
        }, D]
      }, C.push(U, {
        tag: "rect",
        attributes: $({
          fill: "currentColor",
          "clip-path": "url(#".concat(F, ")"),
          mask: "url(#".concat(H, ")")
        }, zt)
      }), {
        children: C,
        attributes: O
      }) : function (t) {
        var e = t.children,
          n = t.attributes,
          a = t.main,
          r = t.transform,
          i = St(t.styles);
        if (0 < i.length && (n.style = i), Nt(r)) {
          var o = Mt({
            transform: r,
            containerWidth: a.width,
            iconWidth: a.width
          });
          e.push({
            tag: "g",
            attributes: $({}, o.outer),
            children: [{
              tag: "g",
              attributes: $({}, o.inner),
              children: [{
                tag: a.icon.tag,
                children: a.icon.children,
                attributes: $({}, a.icon.attributes, o.path)
              }]
            }]
          });
        } else e.push(a.icon);
        return {
          children: e,
          attributes: n
        };
      }(K),
      Q = J.children,
      Z = J.attributes;
    return K.children = Q, K.attributes = Z, c ? (q = (W = K).prefix, V = W.iconName, X = W.children, B = W.attributes, G = W.symbol, [{
      tag: "svg",
      attributes: {
        style: "display: none;"
      },
      children: [{
        tag: "symbol",
        attributes: $({}, B, {
          id: !0 === G ? "".concat(q, "-").concat(et.familyPrefix, "-").concat(V) : G
        }),
        children: X
      }]
    }]) : function (t) {
      var e = t.children,
        n = t.main,
        a = t.mask,
        r = t.attributes,
        i = t.styles,
        o = t.transform;
      if (Nt(o) && n.found && !a.found) {
        var c = n.width / n.height / 2,
          s = .5;
        r.style = St($({}, i, {
          "transform-origin": "".concat(c + o.x / 16, "em ").concat(s + o.y / 16, "em")
        }));
      }
      return [{
        tag: "svg",
        attributes: r,
        children: e
      }];
    }(K);
  }
  function Lt(t) {
    var e = t.content,
      n = t.width,
      a = t.height,
      r = t.transform,
      i = t.title,
      o = t.extra,
      c = t.watchable,
      s = void 0 !== c && c,
      l = $({}, o.attributes, i ? {
        title: i
      } : {}, {
        class: o.classes.join(" ")
      });
    s && (l[tt] = "");
    var f,
      u,
      d,
      m,
      p,
      h,
      g,
      v,
      b,
      y = $({}, o.styles);
    Nt(r) && (y.transform = (u = (f = {
      transform: r,
      startCentered: !0,
      width: n,
      height: a
    }).transform, d = f.width, m = void 0 === d ? A : d, p = f.height, h = void 0 === p ? A : p, g = f.startCentered, b = "", b += (v = void 0 !== g && g) && k ? "translate(".concat(u.x / bt - m / 2, "em, ").concat(u.y / bt - h / 2, "em) ") : v ? "translate(calc(-50% + ".concat(u.x / bt, "em), calc(-50% + ").concat(u.y / bt, "em)) ") : "translate(".concat(u.x / bt, "em, ").concat(u.y / bt, "em) "), b += "scale(".concat(u.size / bt * (u.flipX ? -1 : 1), ", ").concat(u.size / bt * (u.flipY ? -1 : 1), ") "), b += "rotate(".concat(u.rotate, "deg) ")), y["-webkit-transform"] = y.transform);
    var w = St(y);
    0 < w.length && (l.style = w);
    var x = [];
    return x.push({
      tag: "span",
      attributes: l,
      children: [e]
    }), i && x.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [i]
    }), x;
  }
  var Rt = function () {},
    It = et.measurePerformance && f && f.mark && f.measure ? f : {
      mark: Rt,
      measure: Rt
    },
    T = 'FA "5.15.4"',
    Tt = function (t) {
      It.mark("".concat(T, " ").concat(t, " ends")), It.measure("".concat(T, " ").concat(t), "".concat(T, " ").concat(t, " begins"), "".concat(T, " ").concat(t, " ends"));
    },
    Yt = {
      begin: function (t) {
        return It.mark("".concat(T, " ").concat(t, " begins")), function () {
          return Tt(t);
        };
      },
      end: Tt
    },
    Ht = function (t, e, n, a) {
      var r,
        i,
        o,
        c,
        s,
        l = Object.keys(t),
        f = l.length,
        u = void 0 !== a ? (c = e, s = a, function (t, e, n, a) {
          return c.call(s, t, e, n, a);
        }) : e;
      for (o = void 0 === n ? (r = 1, t[l[0]]) : (r = 0, n); r < f; r++) o = u(o, t[i = l[r]], i, t);
      return o;
    };
  function Ft(t) {
    for (var e = "", n = 0; n < t.length; n++) {
      e += ("000" + t.charCodeAt(n).toString(16)).slice(-4);
    }
    return e;
  }
  var Dt = W.styles,
    Ut = W.shims,
    Wt = {},
    qt = {},
    Vt = {},
    Xt = function () {
      var t = function (a) {
        return Ht(Dt, function (t, e, n) {
          return t[n] = Ht(e, a, {}), t;
        }, {});
      };
      Wt = t(function (t, e, n) {
        return e[3] && (t[e[3]] = n), t;
      }), qt = t(function (e, t, n) {
        var a = t[2];
        return e[n] = n, a.forEach(function (t) {
          e[t] = n;
        }), e;
      });
      var i = "far" in Dt;
      Vt = Ht(Ut, function (t, e) {
        var n = e[0],
          a = e[1],
          r = e[2];
        return "far" !== a || i || (a = "fas"), t[n] = {
          prefix: a,
          iconName: r
        }, t;
      }, {});
    };
  function Bt(t, e) {
    return (Wt[t] || {})[e];
  }
  Xt();
  var Gt = W.styles,
    Kt = function () {
      return {
        prefix: null,
        iconName: null,
        rest: []
      };
    };
  function Jt(t) {
    return t.reduce(function (t, e) {
      var n = Ot(et.familyPrefix, e);
      if (Gt[e]) t.prefix = e;else if (et.autoFetchSvg && -1 < Object.keys(z).indexOf(e)) t.prefix = e;else if (n) {
        var a = "fa" === t.prefix ? Vt[n] || {
          prefix: null,
          iconName: null
        } : {};
        t.iconName = a.iconName || n, t.prefix = a.prefix || t.prefix;
      } else e !== et.replacementClass && 0 !== e.indexOf("fa-w-") && t.rest.push(e);
      return t;
    }, Kt());
  }
  function Qt(t, e, n) {
    if (t && t[e] && t[e][n]) return {
      prefix: e,
      iconName: n,
      icon: t[e][n]
    };
  }
  function Zt(t) {
    var n,
      e = t.tag,
      a = t.attributes,
      r = void 0 === a ? {} : a,
      i = t.children,
      o = void 0 === i ? [] : i;
    return "string" == typeof t ? Pt(t) : "<".concat(e, " ").concat((n = r, Object.keys(n || {}).reduce(function (t, e) {
      return t + "".concat(e, '="').concat(Pt(n[e]), '" ');
    }, "").trim()), ">").concat(o.map(Zt).join(""), "</").concat(e, ">");
  }
  var $t = function () {};
  function te(t) {
    return "string" == typeof (t.getAttribute ? t.getAttribute(tt) : null);
  }
  var ee = {
    replace: function (t) {
      var e = t[0],
        n = t[1].map(function (t) {
          return Zt(t);
        }).join("\n");
      if (e.parentNode && e.outerHTML) e.outerHTML = n + (et.keepOriginalSource && "svg" !== e.tagName.toLowerCase() ? "\x3c!-- ".concat(e.outerHTML, " Font Awesome fontawesome.com --\x3e") : "");else if (e.parentNode) {
        var a = document.createElement("span");
        e.parentNode.replaceChild(a, e), a.outerHTML = n;
      }
    },
    nest: function (t) {
      var e = t[0],
        n = t[1];
      if (~Ct(e).indexOf(et.replacementClass)) return ee.replace(t);
      var a = new RegExp("".concat(et.familyPrefix, "-.*"));
      delete n[0].attributes.style, delete n[0].attributes.id;
      var r = n[0].attributes.class.split(" ").reduce(function (t, e) {
        return e === et.replacementClass || e.match(a) ? t.toSvg.push(e) : t.toNode.push(e), t;
      }, {
        toNode: [],
        toSvg: []
      });
      n[0].attributes.class = r.toSvg.join(" ");
      var i = n.map(function (t) {
        return Zt(t);
      }).join("\n");
      e.setAttribute("class", r.toNode.join(" ")), e.setAttribute(tt, ""), e.innerHTML = i;
    }
  };
  function ne(t) {
    t();
  }
  function ae(n, t) {
    var a = "function" == typeof t ? t : $t;
    if (0 === n.length) a();else {
      var e = ne;
      et.mutateApproach === S && (e = v.requestAnimationFrame || ne), e(function () {
        var t = !0 === et.autoReplaceSvg ? ee.replace : ee[et.autoReplaceSvg] || ee.replace,
          e = Yt.begin("mutate");
        n.map(t), e(), a();
      });
    }
  }
  var re = !1;
  function ie() {
    re = !1;
  }
  var oe = null;
  function ce(t) {
    if (l && et.observeMutations) {
      var r = t.treeCallback,
        i = t.nodeCallback,
        o = t.pseudoElementsCallback,
        e = t.observeMutationsRoot,
        n = void 0 === e ? b : e;
      oe = new l(function (t) {
        re || At(t).forEach(function (t) {
          if ("childList" === t.type && 0 < t.addedNodes.length && !te(t.addedNodes[0]) && (et.searchPseudoElements && o(t.target), r(t.target)), "attributes" === t.type && t.target.parentNode && et.searchPseudoElements && o(t.target.parentNode), "attributes" === t.type && te(t.target) && ~T.indexOf(t.attributeName)) if ("class" === t.attributeName) {
            var e = Jt(Ct(t.target)),
              n = e.prefix,
              a = e.iconName;
            n && t.target.setAttribute("data-prefix", n), a && t.target.setAttribute("data-icon", a);
          } else i(t.target);
        });
      }), m && oe.observe(n, {
        childList: !0,
        attributes: !0,
        characterData: !0,
        subtree: !0
      });
    }
  }
  function se(t) {
    var e,
      n,
      a = t.getAttribute("data-prefix"),
      r = t.getAttribute("data-icon"),
      i = void 0 !== t.innerText ? t.innerText.trim() : "",
      o = Jt(Ct(t));
    return a && r && (o.prefix = a, o.iconName = r), o.prefix && 1 < i.length ? o.iconName = (e = o.prefix, n = t.innerText, (qt[e] || {})[n]) : o.prefix && 1 === i.length && (o.iconName = Bt(o.prefix, Ft(t.innerText))), o;
  }
  var le = function (t) {
    var e = {
      size: 16,
      x: 0,
      y: 0,
      flipX: !1,
      flipY: !1,
      rotate: 0
    };
    return t ? t.toLowerCase().split(" ").reduce(function (t, e) {
      var n = e.toLowerCase().split("-"),
        a = n[0],
        r = n.slice(1).join("-");
      if (a && "h" === r) return t.flipX = !0, t;
      if (a && "v" === r) return t.flipY = !0, t;
      if (r = parseFloat(r), isNaN(r)) return t;
      switch (a) {
        case "grow":
          t.size = t.size + r;
          break;
        case "shrink":
          t.size = t.size - r;
          break;
        case "left":
          t.x = t.x - r;
          break;
        case "right":
          t.x = t.x + r;
          break;
        case "up":
          t.y = t.y - r;
          break;
        case "down":
          t.y = t.y + r;
          break;
        case "rotate":
          t.rotate = t.rotate + r;
      }
      return t;
    }, e) : e;
  };
  function fe(t) {
    var e,
      n,
      a,
      r,
      i,
      o,
      c,
      s,
      l = se(t),
      f = l.iconName,
      u = l.prefix,
      d = l.rest,
      m = (e = t.getAttribute("style"), n = [], e && (n = e.split(";").reduce(function (t, e) {
        var n = e.split(":"),
          a = n[0],
          r = n.slice(1);
        return a && 0 < r.length && (t[a] = r.join(":").trim()), t;
      }, {})), n),
      p = le(t.getAttribute("data-fa-transform")),
      h = null !== (a = t.getAttribute("data-fa-symbol")) && ("" === a || a),
      g = (i = At((r = t).attributes).reduce(function (t, e) {
        return "class" !== t.name && "style" !== t.name && (t[e.name] = e.value), t;
      }, {}), o = r.getAttribute("title"), c = r.getAttribute("data-fa-title-id"), et.autoA11y && (o ? i["aria-labelledby"] = "".concat(et.replacementClass, "-title-").concat(c || kt()) : (i["aria-hidden"] = "true", i.focusable = "false")), i),
      v = (s = t.getAttribute("data-fa-mask")) ? Jt(s.split(" ").map(function (t) {
        return t.trim();
      })) : Kt();
    return {
      iconName: f,
      title: t.getAttribute("title"),
      titleId: t.getAttribute("data-fa-title-id"),
      prefix: u,
      transform: p,
      symbol: h,
      mask: v,
      maskId: t.getAttribute("data-fa-mask-id"),
      extra: {
        classes: d,
        styles: m,
        attributes: g
      }
    };
  }
  function ue(t) {
    this.name = "MissingIcon", this.message = t || "Icon unavailable", this.stack = new Error().stack;
  }
  (ue.prototype = Object.create(Error.prototype)).constructor = ue;
  var de = {
      fill: "currentColor"
    },
    me = {
      attributeType: "XML",
      repeatCount: "indefinite",
      dur: "2s"
    },
    pe = {
      tag: "path",
      attributes: $({}, de, {
        d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
      })
    },
    he = $({}, me, {
      attributeName: "opacity"
    }),
    ge = {
      tag: "g",
      children: [pe, {
        tag: "circle",
        attributes: $({}, de, {
          cx: "256",
          cy: "364",
          r: "28"
        }),
        children: [{
          tag: "animate",
          attributes: $({}, me, {
            attributeName: "r",
            values: "28;14;28;28;14;28;"
          })
        }, {
          tag: "animate",
          attributes: $({}, he, {
            values: "1;0;1;1;0;1;"
          })
        }]
      }, {
        tag: "path",
        attributes: $({}, de, {
          opacity: "1",
          d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
        }),
        children: [{
          tag: "animate",
          attributes: $({}, he, {
            values: "1;0;0;0;0;1;"
          })
        }]
      }, {
        tag: "path",
        attributes: $({}, de, {
          opacity: "0",
          d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
        }),
        children: [{
          tag: "animate",
          attributes: $({}, he, {
            values: "0;0;1;1;0;0;"
          })
        }]
      }]
    },
    ve = W.styles;
  function be(t) {
    var e = t[0],
      n = t[1],
      a = p(t.slice(4), 1)[0];
    return {
      found: !0,
      width: e,
      height: n,
      icon: Array.isArray(a) ? {
        tag: "g",
        attributes: {
          class: "".concat(et.familyPrefix, "-").concat(Y.GROUP)
        },
        children: [{
          tag: "path",
          attributes: {
            class: "".concat(et.familyPrefix, "-").concat(Y.SECONDARY),
            fill: "currentColor",
            d: a[0]
          }
        }, {
          tag: "path",
          attributes: {
            class: "".concat(et.familyPrefix, "-").concat(Y.PRIMARY),
            fill: "currentColor",
            d: a[1]
          }
        }]
      } : {
        tag: "path",
        attributes: {
          fill: "currentColor",
          d: a
        }
      }
    };
  }
  function ye(a, r) {
    return new vt(function (t, e) {
      var n = {
        found: !1,
        width: 512,
        height: 512,
        icon: ge
      };
      if (a && r && ve[r] && ve[r][a]) return t(be(ve[r][a]));
      a && r && !et.showMissingIcons ? e(new ue("Icon is missing for prefix ".concat(r, " with icon name ").concat(a))) : t(n);
    });
  }
  var we = W.styles;
  function xe(t) {
    var i,
      e,
      o,
      c,
      s,
      l,
      f,
      u,
      n,
      d,
      m,
      a = fe(t);
    return ~a.extra.classes.indexOf(j) ? function (t, e) {
      var n = e.title,
        a = e.transform,
        r = e.extra,
        i = null,
        o = null;
      if (k) {
        var c = parseInt(getComputedStyle(t).fontSize, 10),
          s = t.getBoundingClientRect();
        i = s.width / c, o = s.height / c;
      }
      return et.autoA11y && !n && (r.attributes["aria-hidden"] = "true"), vt.resolve([t, Lt({
        content: t.innerHTML,
        width: i,
        height: o,
        transform: a,
        title: n,
        extra: r,
        watchable: !0
      })]);
    }(t, a) : (i = t, o = (e = a).iconName, c = e.title, s = e.titleId, l = e.prefix, f = e.transform, u = e.symbol, n = e.mask, d = e.maskId, m = e.extra, new vt(function (r, t) {
      vt.all([ye(o, l), ye(n.iconName, n.prefix)]).then(function (t) {
        var e = p(t, 2),
          n = e[0],
          a = e[1];
        r([i, jt({
          icons: {
            main: n,
            mask: a
          },
          prefix: l,
          iconName: o,
          transform: f,
          symbol: u,
          mask: a,
          maskId: d,
          title: c,
          titleId: s,
          extra: m,
          watchable: !0
        })]);
      });
    }));
  }
  function ke(t) {
    var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
    if (m) {
      var e = b.documentElement.classList,
        a = function (t) {
          return e.add("".concat(P, "-").concat(t));
        },
        r = function (t) {
          return e.remove("".concat(P, "-").concat(t));
        },
        i = et.autoFetchSvg ? Object.keys(z) : Object.keys(we),
        o = [".".concat(j, ":not([").concat(tt, "])")].concat(i.map(function (t) {
          return ".".concat(t, ":not([").concat(tt, "])");
        })).join(", ");
      if (0 !== o.length) {
        var c = [];
        try {
          c = At(t.querySelectorAll(o));
        } catch (t) {}
        if (0 < c.length) {
          a("pending"), r("complete");
          var s = Yt.begin("onTree"),
            l = c.reduce(function (t, e) {
              try {
                var n = xe(e);
                n && t.push(n);
              } catch (t) {
                M || t instanceof ue && console.error(t);
              }
              return t;
            }, []);
          return new vt(function (e, t) {
            vt.all(l).then(function (t) {
              ae(t, function () {
                a("active"), a("complete"), r("pending"), "function" == typeof n && n(), s(), e();
              });
            }).catch(function () {
              s(), t();
            });
          });
        }
      }
    }
  }
  function Ae(t) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
    xe(t).then(function (t) {
      t && ae([t], e);
    });
  }
  function Ce(p, h) {
    var g = "".concat(x).concat(h.replace(":", "-"));
    return new vt(function (a, t) {
      if (null !== p.getAttribute(g)) return a();
      var e = At(p.children).filter(function (t) {
          return t.getAttribute(w) === h;
        })[0],
        n = v.getComputedStyle(p, h),
        r = n.getPropertyValue("font-family").match(L),
        i = n.getPropertyValue("font-weight"),
        o = n.getPropertyValue("content");
      if (e && !r) return p.removeChild(e), a();
      if (r && "none" !== o && "" !== o) {
        var c = n.getPropertyValue("content"),
          s = ~["Solid", "Regular", "Light", "Duotone", "Brands", "Kit"].indexOf(r[2]) ? E[r[2].toLowerCase()] : R[i],
          l = Ft(3 === c.length ? c.substr(1, 1) : c),
          f = Bt(s, l),
          u = f;
        if (!f || e && e.getAttribute(C) === s && e.getAttribute(O) === u) a();else {
          p.setAttribute(g, u), e && p.removeChild(e);
          var d = {
              iconName: null,
              title: null,
              titleId: null,
              prefix: null,
              transform: yt,
              symbol: !1,
              mask: null,
              maskId: null,
              extra: {
                classes: [],
                styles: {},
                attributes: {}
              }
            },
            m = d.extra;
          m.attributes[w] = h, ye(f, s).then(function (t) {
            var e = jt($({}, d, {
                icons: {
                  main: t,
                  mask: Kt()
                },
                prefix: s,
                iconName: u,
                extra: m,
                watchable: !0
              })),
              n = b.createElement("svg");
            ":before" === h ? p.insertBefore(n, p.firstChild) : p.appendChild(n), n.outerHTML = e.map(function (t) {
              return Zt(t);
            }).join("\n"), p.removeAttribute(g), a();
          }).catch(t);
        }
      } else a();
    });
  }
  function Oe(t) {
    return vt.all([Ce(t, ":before"), Ce(t, ":after")]);
  }
  function Pe(t) {
    return !(t.parentNode === document.head || ~N.indexOf(t.tagName.toUpperCase()) || t.getAttribute(w) || t.parentNode && "svg" === t.parentNode.tagName);
  }
  function Se(r) {
    if (m) return new vt(function (t, e) {
      var n = At(r.querySelectorAll("*")).filter(Pe).map(Oe),
        a = Yt.begin("searchPseudoElements");
      re = !0, vt.all(n).then(function () {
        a(), ie(), t();
      }).catch(function () {
        a(), ie(), e();
      });
    });
  }
  var Ne = "svg:not(:root).svg-inline--fa{overflow:visible}.svg-inline--fa{display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em}.svg-inline--fa.fa-lg{vertical-align:-.225em}.svg-inline--fa.fa-w-1{width:.0625em}.svg-inline--fa.fa-w-2{width:.125em}.svg-inline--fa.fa-w-3{width:.1875em}.svg-inline--fa.fa-w-4{width:.25em}.svg-inline--fa.fa-w-5{width:.3125em}.svg-inline--fa.fa-w-6{width:.375em}.svg-inline--fa.fa-w-7{width:.4375em}.svg-inline--fa.fa-w-8{width:.5em}.svg-inline--fa.fa-w-9{width:.5625em}.svg-inline--fa.fa-w-10{width:.625em}.svg-inline--fa.fa-w-11{width:.6875em}.svg-inline--fa.fa-w-12{width:.75em}.svg-inline--fa.fa-w-13{width:.8125em}.svg-inline--fa.fa-w-14{width:.875em}.svg-inline--fa.fa-w-15{width:.9375em}.svg-inline--fa.fa-w-16{width:1em}.svg-inline--fa.fa-w-17{width:1.0625em}.svg-inline--fa.fa-w-18{width:1.125em}.svg-inline--fa.fa-w-19{width:1.1875em}.svg-inline--fa.fa-w-20{width:1.25em}.svg-inline--fa.fa-pull-left{margin-right:.3em;width:auto}.svg-inline--fa.fa-pull-right{margin-left:.3em;width:auto}.svg-inline--fa.fa-border{height:1.5em}.svg-inline--fa.fa-li{width:2em}.svg-inline--fa.fa-fw{width:1.25em}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-.125em;width:1em}.fa-layers svg.svg-inline--fa{-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter,.fa-layers-text{display:inline-block;position:absolute;text-align:center}.fa-layers-text{left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter{background-color:#ff253a;border-radius:1em;-webkit-box-sizing:border-box;box-sizing:border-box;color:#fff;height:1.5em;line-height:1;max-width:5em;min-width:1.5em;overflow:hidden;padding:.25em;right:0;text-overflow:ellipsis;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-bottom-right{bottom:0;right:0;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom right;transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;left:0;right:auto;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom left;transform-origin:bottom left}.fa-layers-top-right{right:0;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-top-left{left:0;right:auto;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top left;transform-origin:top left}.fa-lg{font-size:1.3333333333em;line-height:.75em;vertical-align:-.0667em}.fa-xs{font-size:.75em}.fa-sm{font-size:.875em}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}.fa-border{border:solid .08em #eee;border-radius:.1em;padding:.2em .25em .15em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left,.fab.fa-pull-left,.fal.fa-pull-left,.far.fa-pull-left,.fas.fa-pull-left{margin-right:.3em}.fa.fa-pull-right,.fab.fa-pull-right,.fal.fa-pull-right,.far.fa-pull-right,.fas.fa-pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.fa-rotate-90{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-webkit-transform:scale(-1,1);transform:scale(-1,1)}.fa-flip-vertical{-webkit-transform:scale(1,-1);transform:scale(1,-1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{-webkit-transform:scale(-1,-1);transform:scale(-1,-1)}:root .fa-flip-both,:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-rotate-90{-webkit-filter:none;filter:none}.fa-stack{display:inline-block;height:2em;position:relative;width:2.5em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.svg-inline--fa.fa-stack-1x{height:1em;width:1.25em}.svg-inline--fa.fa-stack-2x{height:2em;width:2.5em}.fa-inverse{color:#fff}.sr-only{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.sr-only-focusable:active,.sr-only-focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}.svg-inline--fa .fa-primary{fill:var(--fa-primary-color,currentColor);opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa .fa-secondary{fill:var(--fa-secondary-color,currentColor);opacity:.4;opacity:var(--fa-secondary-opacity,.4)}.svg-inline--fa.fa-swap-opacity .fa-primary{opacity:.4;opacity:var(--fa-secondary-opacity,.4)}.svg-inline--fa.fa-swap-opacity .fa-secondary{opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary{fill:#000}.fad.fa-inverse{color:#fff}";
  function Me() {
    var t = g,
      e = y,
      n = et.familyPrefix,
      a = et.replacementClass,
      r = Ne;
    if (n !== t || a !== e) {
      var i = new RegExp("\\.".concat(t, "\\-"), "g"),
        o = new RegExp("\\--".concat(t, "\\-"), "g"),
        c = new RegExp("\\.".concat(e), "g");
      r = r.replace(i, ".".concat(n, "-")).replace(o, "--".concat(n, "-")).replace(c, ".".concat(a));
    }
    return r;
  }
  function ze() {
    et.autoAddCss && !Ie && (wt(Me()), Ie = !0);
  }
  function Ee(e, t) {
    return Object.defineProperty(e, "abstract", {
      get: t
    }), Object.defineProperty(e, "html", {
      get: function () {
        return e.abstract.map(function (t) {
          return Zt(t);
        });
      }
    }), Object.defineProperty(e, "node", {
      get: function () {
        if (m) {
          var t = b.createElement("div");
          return t.innerHTML = e.html, t.children;
        }
      }
    }), e;
  }
  function je(t) {
    var e = t.prefix,
      n = void 0 === e ? "fa" : e,
      a = t.iconName;
    if (a) return Qt(Re.definitions, n, a) || Qt(W.styles, n, a);
  }
  var Le,
    Re = new (function () {
      function t() {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, t), this.definitions = {};
      }
      var e, n, a;
      return e = t, (n = [{
        key: "add",
        value: function () {
          for (var e = this, t = arguments.length, n = new Array(t), a = 0; a < t; a++) n[a] = arguments[a];
          var r = n.reduce(this.PullDefinitions, {});
          Object.keys(r).forEach(function (t) {
            e.definitions[t] = $({}, e.definitions[t] || {}, r[t]), function t(e, a) {
              var n = (2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}).skipHooks,
                r = void 0 !== n && n,
                i = Object.keys(a).reduce(function (t, e) {
                  var n = a[e];
                  return n.icon ? t[n.iconName] = n.icon : t[e] = n, t;
                }, {});
              "function" != typeof W.hooks.addPack || r ? W.styles[e] = $({}, W.styles[e] || {}, i) : W.hooks.addPack(e, i), "fas" === e && t("fa", a);
            }(t, r[t]), Xt();
          });
        }
      }, {
        key: "reset",
        value: function () {
          this.definitions = {};
        }
      }, {
        key: "_pullDefinitions",
        value: function (i, t) {
          var o = t.prefix && t.iconName && t.icon ? {
            0: t
          } : t;
          return Object.keys(o).map(function (t) {
            var e = o[t],
              n = e.prefix,
              a = e.iconName,
              r = e.icon;
            i[n] || (i[n] = {}), i[n][a] = r;
          }), i;
        }
      }]) && i(e.prototype, n), a && i(e, a), t;
    }())(),
    Ie = !1,
    E = {
      i2svg: function () {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        if (m) {
          ze();
          var e = t.node,
            n = void 0 === e ? b : e,
            a = t.callback,
            r = void 0 === a ? function () {} : a;
          return et.searchPseudoElements && Se(n), ke(n, r);
        }
        return vt.reject("Operation requires a DOM of some kind.");
      },
      css: Me,
      insertCss: function () {
        Ie || (wt(Me()), Ie = !0);
      },
      watch: function () {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
          e = t.autoReplaceSvgRoot,
          n = t.observeMutationsRoot;
        !1 === et.autoReplaceSvg && (et.autoReplaceSvg = !0), et.observeMutations = !0, X(function () {
          He({
            autoReplaceSvgRoot: e
          }), ce({
            treeCallback: ke,
            nodeCallback: Ae,
            pseudoElementsCallback: Se,
            observeMutationsRoot: n
          });
        });
      }
    },
    Te = (Le = function (t) {
      var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
        n = e.transform,
        a = void 0 === n ? yt : n,
        r = e.symbol,
        i = void 0 !== r && r,
        o = e.mask,
        c = void 0 === o ? null : o,
        s = e.maskId,
        l = void 0 === s ? null : s,
        f = e.title,
        u = void 0 === f ? null : f,
        d = e.titleId,
        m = void 0 === d ? null : d,
        p = e.classes,
        h = void 0 === p ? [] : p,
        g = e.attributes,
        v = void 0 === g ? {} : g,
        b = e.styles,
        y = void 0 === b ? {} : b;
      if (t) {
        var w = t.prefix,
          x = t.iconName,
          k = t.icon;
        return Ee($({
          type: "icon"
        }, t), function () {
          return ze(), et.autoA11y && (u ? v["aria-labelledby"] = "".concat(et.replacementClass, "-title-").concat(m || kt()) : (v["aria-hidden"] = "true", v.focusable = "false")), jt({
            icons: {
              main: be(k),
              mask: c ? be(c.icon) : {
                found: !1,
                width: null,
                height: null,
                icon: {}
              }
            },
            prefix: w,
            iconName: x,
            transform: $({}, yt, a),
            symbol: i,
            title: u,
            maskId: l,
            titleId: m,
            extra: {
              attributes: v,
              styles: y,
              classes: h
            }
          });
        });
      }
    }, function (t) {
      var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
        n = (t || {}).icon ? t : je(t || {}),
        a = e.mask;
      return a && (a = (a || {}).icon ? a : je(a || {})), Le(n, $({}, e, {
        mask: a
      }));
    }),
    Ye = {
      noAuto: function () {
        et.autoReplaceSvg = !1, et.observeMutations = !1, oe && oe.disconnect();
      },
      config: et,
      dom: E,
      library: Re,
      parse: {
        transform: function (t) {
          return le(t);
        }
      },
      findIconDefinition: je,
      icon: Te,
      text: function (t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
          n = e.transform,
          a = void 0 === n ? yt : n,
          r = e.title,
          i = void 0 === r ? null : r,
          o = e.classes,
          c = void 0 === o ? [] : o,
          s = e.attributes,
          l = void 0 === s ? {} : s,
          f = e.styles,
          u = void 0 === f ? {} : f;
        return Ee({
          type: "text",
          content: t
        }, function () {
          return ze(), Lt({
            content: t,
            transform: $({}, yt, a),
            title: i,
            extra: {
              attributes: l,
              styles: u,
              classes: ["".concat(et.familyPrefix, "-layers-text")].concat(d(c))
            }
          });
        });
      },
      counter: function (t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
          n = e.title,
          a = void 0 === n ? null : n,
          r = e.classes,
          i = void 0 === r ? [] : r,
          o = e.attributes,
          c = void 0 === o ? {} : o,
          s = e.styles,
          l = void 0 === s ? {} : s;
        return Ee({
          type: "counter",
          content: t
        }, function () {
          return ze(), function (t) {
            var e = t.content,
              n = t.title,
              a = t.extra,
              r = $({}, a.attributes, n ? {
                title: n
              } : {}, {
                class: a.classes.join(" ")
              }),
              i = St(a.styles);
            0 < i.length && (r.style = i);
            var o = [];
            return o.push({
              tag: "span",
              attributes: r,
              children: [e]
            }), n && o.push({
              tag: "span",
              attributes: {
                class: "sr-only"
              },
              children: [n]
            }), o;
          }({
            content: t.toString(),
            title: a,
            extra: {
              attributes: c,
              styles: l,
              classes: ["".concat(et.familyPrefix, "-layers-counter")].concat(d(i))
            }
          });
        });
      },
      layer: function (t) {
        var e = (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}).classes,
          n = void 0 === e ? [] : e;
        return Ee({
          type: "layer"
        }, function () {
          ze();
          var e = [];
          return t(function (t) {
            Array.isArray(t) ? t.map(function (t) {
              e = e.concat(t.abstract);
            }) : e = e.concat(t.abstract);
          }), [{
            tag: "span",
            attributes: {
              class: ["".concat(et.familyPrefix, "-layers")].concat(d(n)).join(" ")
            },
            children: e
          }];
        });
      },
      toHtml: Zt
    },
    He = function () {
      var t = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).autoReplaceSvgRoot,
        e = void 0 === t ? b : t;
      (0 < Object.keys(W.styles).length || et.autoFetchSvg) && m && et.autoReplaceSvg && Ye.dom.i2svg({
        node: e
      });
    };
  !function (t) {
    try {
      t();
    } catch (t) {
      if (!M) throw t;
    }
  }(function () {
    u && (v.FontAwesome || (v.FontAwesome = Ye), X(function () {
      He(), ce({
        treeCallback: ke,
        nodeCallback: Ae,
        pseudoElementsCallback: Se
      });
    })), W.hooks = $({}, W.hooks, {
      addPack: function (t, e) {
        W.styles[t] = $({}, W.styles[t] || {}, e), Xt(), He();
      },
      addShims: function (t) {
        var e;
        (e = W.shims).push.apply(e, d(t)), Xt(), He();
      }
    });
  });
}();