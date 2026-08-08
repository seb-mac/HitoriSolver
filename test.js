editorWin = null;
var isIE =
    /msie/i.test(navigator.userAgent) &&
    !/opera/i.test(navigator.userAgent) &&
    !/chrome/i.test(navigator.userAgent),
  puzzleZoom = 1;
function openHTMLEditor(e) {
  (editorWin = window.open(
    "htmledit.php?field=" + e,
    "_new",
    "width=770, height=500, scrollbars=no, resizable=yes",
  )).focus();
}
function Set_Cookie(e, t, n, i, o, r) {
  var s = new Date(),
    s =
      (s.setTime(s.getTime()),
      (n = n && 1e3 * n * 60 * 60 * 24),
      new Date(s.getTime() + n));
  document.cookie =
    e +
    "=" +
    escape(t) +
    (n ? ";expires=" + s.toGMTString() : "") +
    (i ? ";path=" + i : ";path=/") +
    (o ? ";domain=" + o : "") +
    (r ? ";secure" : "");
}
function switchRules(e) {
  return (
    Set_Cookie("hideRules", 1 - e, 1e3),
    (document.getElementById("rules").style.display = e ? "block" : "none"),
    (document.getElementById("norules").style.display = e ? "none" : "block"),
    !1
  );
}
function switchSide(e) {
  return (
    Set_Cookie("hideSide", 1 - e, 1e3),
    e
      ? (document.body.classList.add("expanded"),
        document.body.classList.remove("collapsed"))
      : (document.body.classList.add("collapsed"),
        document.body.classList.remove("expanded")),
    decideAdSize(),
    !1
  );
}
function pad(e) {
  return +e < 10 ? "0" + e : e;
}
var startTime = 0,
  personalTime = 0;
function beautifyTime(e) {
  var t = 0,
    n = pad(e % 60),
    n = pad(Math.floor(e / 60) % 60) + ":" + n,
    e = Math.floor(e / 3600);
  return (
    0 < e &&
      (24 < e && ((t = Math.floor(e / 24)), (e = pad(e % 24))),
      (n = e + ":" + n)),
    (n = 0 < t ? t + "d " + n : n)
  );
}
var timerTimeout = null;
function timer() {
  startTime =
    startTime || new Date().getTime() - 1e3 * document.answerForm.jstimer.value;
  var e = new Date().getTime(),
    e = Math.floor((e - startTime) / 1e3);
  try {
    ((document.answerForm.jstimerShow.value = beautifyTime(e)),
      (document.answerForm.jstimerShowPersonal.value = beautifyTime(
        Math.floor((Game.getTimer() + 500) / 1e3),
      )));
  } catch (e) {}
  +document.answerForm.stopClock.value ||
    (timerTimeout = setTimeout("timer()", 500));
}
document.oncontextmenu = new Function("return false");
var RightClick = 1;
function Get_Cookie(e) {
  e = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );
  return e ? decodeURIComponent(e[1]) : void 0;
}
(navigator.userAgent.match(/Opera/gi) && (RightClick = 0),
  navigator.userAgent.match(/Safari/gi) && (RightClick = 0),
  navigator.userAgent.match(/MSIE/gi) ||
    navigator.userAgent.match(/Mozilla/gi) ||
    (RightClick = 0),
  navigator.userAgent.match(/Chrome/gi) && (RightClick = 1),
  (navigator.userAgent.match(/iPhone/gi) ||
    navigator.userAgent.match(/iPad/gi) ||
    navigator.userAgent.match(/Android/gi)) &&
    (RightClick = 0),
  "undefined" != typeof freestar &&
    setTimeout(function () {
      freestar.disableRefresh();
    }, 6e5));
var minZoom = 0.2,
  maxZoom = 5,
  AUTO_ZOOM_TARGET_WIDTH = 320,
  AUTO_ZOOM_MAX_FILL = 0.9,
  cookieZoom = Get_Cookie("zoom");
function getZoomSettingName() {
  return Game.length ? Game.getZoomSettingName() : "";
}
function getZoom() {
  return (
    ("undefined" != typeof Game &&
      (Settings.get(getZoomSettingName()) || puzzleZoom)) ||
    1
  );
}
function getInitialZoom() {
  var e,
    t,
    n = document.getElementById("game");
  return n &&
    ((n = n.getBoundingClientRect()), (e = getZoom() || 1), (n = n.width / e))
    ? ((e =
        Game.getSetting("defaultScale") ||
        (n * getDevicePixelRatio() < AUTO_ZOOM_TARGET_WIDTH
          ? AUTO_ZOOM_TARGET_WIDTH / n
          : getDevicePixelRatio())),
      (e /= getDevicePixelRatio()),
      (t =
        (((t = document.getElementById("puzzleContainerRalativeDiv"))
          ? t.clientWidth
          : window.innerWidth) *
          AUTO_ZOOM_MAX_FILL) /
        getDevicePixelRatio() /
        n),
      getDevicePixelRatio() * Math.min(e, t))
    : 1;
}
function setZoom(e, t) {
  var n,
    i,
    o,
    r,
    s,
    a,
    l = (e = +e),
    c = +Settings.get("default_zoom"),
    c = ((e += isNaN(c) ? 0 : c - 1), document.getElementById("game"));
  c &&
    ((n = c.clientWidth),
    (i = c.clientHeight),
    (s = r = o = 0),
    (a = "undefined" == typeof buttonsOffset ? 35 : buttonsOffset),
    $("#buttonsBottom:visible").length && (o = a),
    $("#buttonsRight:visible").length && (s = a),
    $("#buttonsLeft:visible").length && (r = a),
    n &&
      i &&
      ((c.style.transform = "scale(" + e + ")"),
      (c.style.marginLeft = Math.floor(1 + (n * e - n) / 2) + r * e + "px"),
      (c.style.marginRight = Math.floor(1 + (n * e - n) / 2) + s * e + "px"),
      (c.style.marginTop = Math.floor(1 + (i * e - i) / 2) + "px"),
      (c.style.marginBottom = Math.floor(1 + (i * e - i) / 2) + o * e + "px"),
      void 0 !== t && t && Settings.set(getZoomSettingName(), e),
      (puzzleZoom = e)),
    (a = document.getElementById("zoomIndicator")) &&
      (a.textContent = Math.round((l / getDevicePixelRatio()) * 100) + "%"),
    decideAdSize());
}
function zoomIn() {
  puzzleZoom < maxZoom && setZoom((puzzleZoom *= 1.1), !0);
}
function zoomOut() {
  minZoom < puzzleZoom && setZoom((puzzleZoom /= 1.1), !0);
}
function getDevicePixelRatio() {
  return window.devicePixelRatio
    ? window.devicePixelRatio /
        (Math.floor(window.devicePixelRatio)
          ? Math.floor(window.devicePixelRatio)
          : 1)
    : 1;
}
function resetZoom(e, t) {
  (Settings.remove(getZoomSettingName()),
    (e = e || getInitialZoom()),
    setZoom((document.getElementById("zoomslider").value = e), t));
}
function getDisplay(e) {
  return (e.currentStyle || getComputedStyle(e, null)).display;
}
function toggleZoomSlider(e) {
  var t = document.getElementById("zoomSlider"),
    n = getDisplay(t),
    i = "block",
    i =
      void 0 !== e
        ? "on" == e
          ? "block"
          : "none"
        : "none" == n
          ? "block"
          : "none";
  "block" == (t.style.display = i)
    ? window.setTimeout(function () {
        ($(window).on("click.zoomslider", function () {
          toggleZoomSlider("off");
        }),
          $("#zoomSlider").on("click.zoomslider", function (e) {
            e.stopPropagation();
          }));
      }, 500)
    : ($(window).off("click.zoomslider"),
      $("#zoomSlider").off("click.zoomslider"));
}
void 0 !== cookieZoom && (puzzleZoom = cookieZoom);
var states = [],
  stateIndex = -1;
function storeState(e) {
  (-1 != stateIndex && states[stateIndex] == e) ||
    ((states[++stateIndex] = e), states.splice(stateIndex + 1));
}
function undoMove() {
  stateIndex && (stateIndex--, setState(states[stateIndex]));
}
function redoMove() {
  states.length > stateIndex + 1 &&
    (stateIndex++, setState(states[stateIndex]));
}
function switchNightMode(e) {
  return (
    Set_Cookie("nightMode", +e, 1e3),
    Settings.set("puzzleSettings.global.night-mode", +e),
    (document.documentElement.className = e ? "nightmode" : ""),
    $("#night-mode").length && $("#night-mode").prop("checked", e),
    !1
  );
}
function switchASLMode(e) {
  return (Set_Cookie("aslMode", +e, 1e3), document.location.reload(), !1);
}
function contactUs(e) {
  return !(top.location.href = "/feedback.php");
}
function speedStats(e) {
  return !(top.location.href = "/stats.php");
}
function pinAds() {
  return (Set_Cookie("p", 1), document.body.classList.add("pinned"), !1);
}
function pcss(e, t) {
  return window
    .myGetComputedStyle927c49cf1b(document.getElementById(e))
    .getPropertyValue(t);
}
function showABLKMessage() {
  "freestar" != ad_manager &&
    $("#ajaxResponse").append(
      $(
        '<div class="err"><p><strong>It seems that you may be using an ad blоcking software.</strong></p>            <p>We rely on ads to keep this website alive. Ad blоckers also disrupt the normal layout and behavoir of the website.</p>            <p>Please allow the ads on the site or join our <a href="/patron.php">patron program</a>!</p>            <p><a href="/feedback.php">Contact us</a> if you have any questions. Thank you!</p></div>',
      ),
    );
}
function ab927c49cf1b(t) {
  try {
    if (
      (t && 3 != t) ||
      "none" == pcss("p927c49cf1b", "display") ||
      "hidden" == pcss("p927c49cf1b", "overflow") ||
      "auto" == pcss("p927c49cf1b", "overflow") ||
      "1" != pcss("p927c49cf1b", "opacity") ||
      "0px" != pcss("p927c49cf1b", "top") ||
      "0px" != pcss("p927c49cf1b", "left") ||
      "0px" != pcss("p927c49cf1b", "margin") ||
      "none" != pcss("p927c49cf1b", "clip-path") ||
      "auto" != pcss("p927c49cf1b", "clip") ||
      "none" != pcss("p927c49cf1b", "transform") ||
      "visible" != pcss("p927c49cf1b", "visibility") ||
      "5000" != pcss("p927c49cf1b", "z-index") ||
      "none" != pcss("p927c49cf1b", "filter") ||
      "absolute" == pcss("p927c49cf1b", "position") ||
      $("#p927c49cf1b").width() < 103 ||
      $("#p927c49cf1b").height() < 10 ||
      "none" == pcss("btIn927c49cf1b", "pointer-events") ||
      "none" == pcss("bannerTop", "display") ||
      "auto" == pcss("bannerTop", "overflow") ||
      "1" != pcss("bannerTop", "opacity") ||
      "0px" != pcss("bannerTop", "top") ||
      "0px" != pcss("bannerTop", "left") ||
      "0px" != pcss("bannerTop", "margin-top") ||
      "none" != pcss("bannerTop", "clip-path") ||
      "auto" != pcss("bannerTop", "clip") ||
      "none" != pcss("bannerTop", "transform") ||
      "visible" != pcss("bannerTop", "visibility") ||
      "auto" != pcss("bannerTop", "z-index") ||
      "none" != pcss("bannerTop", "filter") ||
      "none" == pcss("bannerTop", "pointer-events") ||
      $("#bannerTop").width() < 103 ||
      $("#bannerTop").height() < 10 ||
      window
        .getComputedStyle(document.getElementById("p927c49cf1b"))
        .getPropertyValue.name.startsWith("bound") ||
      !(
        "" +
        window.getComputedStyle(document.getElementById("p927c49cf1b"))
          .getPropertyValue
      ).includes("getPropertyValue")
    )
      return (
        3 != t &&
          (showABLKMessage(), window.gtag) &&
          gtag("event", "ad_blocker", {}),
        !0
      );
  } catch (t) {
    e = t;
  }
  return !1;
}
window.myGetComputedStyle927c49cf1b = window.getComputedStyle;
var initialSideAdSizeDecisionMade = !1,
  lastSideAdSizeDecision = !1;
function defaultSideAdLoaded() {
  return "sovrn" == ad_manager && "undefined" != typeof propertag
    ? "undefined" != typeof ProperMedia &&
        1 < ProperMedia.ad_project.getAdSlots().length &&
        -1 != ProperMedia.ad_project.getAdSlots()[1].indexOf("_monthly_")
    : (ad_manager, !0);
}
function displayAdWide() {
  ("sovrn" == ad_manager &&
    "undefined" != typeof propertag &&
    ($("#bannerSide").html('<div class="sovrn-side"></div>'),
    "undefined" != typeof ProperMedia) &&
    ProperMedia.ad_project.buildSlots(),
    "freestar" == ad_manager &&
      "undefined" != typeof freestar &&
      ($("#bannerSide").html(
        '<div align="center" data-freestar-ad="__300x250" class="side-rail-wide" id="' +
          base_domain.replace(".", "-") +
          '_medrec_right"></div><div align="center" data-freestar-ad="__300x600" class="side-rail-wide" id="' +
          base_domain.replace(".", "-") +
          '_siderail_right_300x600"></div>',
      ),
      "undefined" != typeof freestar) &&
      (freestar.config.enabled_slots.push({
        placementName: base_domain.replace(".", "-") + "_medrec_right",
        slotId: base_domain.replace(".", "-") + "_medrec_right",
      }),
      freestar.config.enabled_slots.push({
        placementName:
          base_domain.replace(".", "-") + "_siderail_right_300x600",
        slotId: base_domain.replace(".", "-") + "_siderail_right_300x600",
      })),
    "playwire" == ad_manager &&
      "undefined" != typeof ramp &&
      window.ramp &&
      window.ramp.destroyUnits &&
      window.ramp.destroyUnits("standard_iab_rght1").then(() => {
        (window.ramp
          .addUnits([
            {
              type: "standard_iab_rght2",
              selectorId: "plw-side-rail-wide",
            },
            {
              type: "standard_iab_rght3",
              selectorId: "plw-side-rail-wide2",
            },
          ])
          .then(() => ramp.displayUnits()),
          googletag
            .pubads()
            .getSlots()
            .forEach(function (e) {
              ["standard_iab_rght2", "standard_iab_rght3"].includes(
                e.getSlotElementId(),
              ) && googletag.pubads().refresh([e]);
            }));
      }),
    "snigel" == ad_manager &&
      document.dispatchEvent(
        new CustomEvent("siderailSizeChange", {
          detail: {
            newWidth: 300,
          },
        }),
      ));
}
function displayAdNormal() {
  ("sovrn" == ad_manager &&
    "undefined" != typeof propertag &&
    ($("#bannerSide").html('<div class="sovrn-side-monthly"></div>'),
    "undefined" != typeof ProperMedia) &&
    ProperMedia.ad_project.buildSlots(),
    "freestar" == ad_manager &&
      "undefined" != typeof freestar &&
      ($("#bannerSide").html(
        '<div align="center" data-freestar-ad="__160x600" class="side-rail" id="' +
          base_domain.replace(".", "-") +
          '_siderail_right_160x600">',
      ),
      "undefined" != typeof freestar) &&
      freestar.config.enabled_slots.push({
        placementName:
          base_domain.replace(".", "-") + "_siderail_right_160x600",
        slotId: base_domain.replace(".", "-") + "_siderail_right_160x600",
      }),
    "playwire" == ad_manager &&
      "undefined" != typeof ramp &&
      window.ramp &&
      window.ramp.destroyUnits &&
      (window.ramp.destroyUnits("standard_iab_rght3"),
      window.ramp.destroyUnits("standard_iab_rght2").then(() => {
        (window.ramp
          .addUnits({
            type: "standard_iab_rght1",
            selectorId: "plw-side-rail",
          })
          .then(() => ramp.displayUnits()),
          googletag
            .pubads()
            .getSlots()
            .forEach(function (e) {
              "standard_iab_rght1" == e.getSlotElementId() &&
                googletag.pubads().refresh([e]);
            }));
      })),
    "snigel" == ad_manager &&
      document.dispatchEvent(
        new CustomEvent("siderailSizeChange", {
          detail: {
            newWidth: 160,
          },
        }),
      ));
}
function decideAdSize() {
  var e, t;
  $("#puzzleContainer").length &&
    ((e = $("#pageContent").width() - $("#puzzleContainer").width()),
    (t = "no-decision"),
    1110 <= $("#pageContent").width() &&
      (150 <= e ? (t = "wide") : e < 10 && (t = "normal")),
    "no-decision" !=
      (t = e < 10 || $("#pageContent").width() < 970 ? "normal" : t) &&
      ("wide" == t &&
        (Set_Cookie("wss", 1, 1e3),
        ($("body").hasClass("wideSS") && !defaultSideAdLoaded()) ||
          ($("body").addClass("wideSS"),
          initialSideAdSizeDecisionMade &&
            "wide" != lastSideAdSizeDecision &&
            (displayAdWide(), (lastSideAdSizeDecision = "wide")))),
      "normal" == t) &&
      (Set_Cookie("wss", 0, 1e3), $("body").hasClass("wideSS")) &&
      ($("body").removeClass("wideSS"), initialSideAdSizeDecisionMade) &&
      "normal" != lastSideAdSizeDecision &&
      (displayAdNormal(), (lastSideAdSizeDecision = "normal")),
    (initialSideAdSizeDecisionMade = !0));
}
function reportAdsInfo() {
  var e, t, n;
  "undefined" != typeof googletag &&
    confirm(
      "Please, take a screenshot of the reported ad. Click OK if you already have a screenshot.",
    ) &&
    ((window.adSlotDebug = []),
    googletag
      .pubads()
      .getSlots()
      .forEach(function (e) {
        try {
          adSlotDebug.push({
            adUnitPath: e.getAdUnitPath(),
            slotElementId: e.getSlotElementId(),
            responseInfo: e.getResponseInformation(),
            contentUrl: e.getContentUrl(),
            adHtml: escape(e.getHtml()),
          });
        } catch (e) {}
      }),
    (e = JSON.stringify(window.adSlotDebug)),
    ((t = document.createElement("form")).method = "POST"),
    (t.action = "/feedback.php"),
    (t.style.display = "none"),
    ((n = document.createElement("input")).type = "hidden"),
    (n.name = "adSlotDebugData"),
    (n.value = e),
    t.appendChild(n),
    document.body.appendChild(t),
    t.submit());
}
("undefined" != typeof ad_manager &&
  "snigel" == ad_manager &&
  document.addEventListener(
    "siderailSizeChange",
    ({ detail: { newWidth: e } }) => {
      let n = 300 <= e ? "side_1" : "side_2";
      e = () => {
        let e = "side_1" == n ? "adngin-side_1-0" : "adngin-side_2-0";
        var t = googletag
          .pubads()
          .getSlots()
          .find((e) =>
            e
              .getSlotElementId()
              .startsWith(
                "side_1" == n ? "adngin-side_2-0" : "adngin-side_1-0",
              ),
          );
        (t && googletag.destroySlots([t]),
          $("#bannerSide").html(""),
          "side_1" == n
            ? ($("#bannerSide").append('<div id="adngin-side_top-0"></div>'),
              adngin.queue.push(() =>
                adngin.cmd.startAuction([
                  {
                    adUnit: "side_top",
                    placement: "adngin-side_top-0",
                  },
                ]),
              ))
            : (t = googletag
                .pubads()
                .getSlots()
                .find((e) =>
                  e.getSlotElementId().startsWith("adngin-side_top-0"),
                )) && googletag.destroySlots([t]),
          $("#bannerSide").append('<div id="' + e + '"></div>'),
          adngin.queue.push(() =>
            adngin.cmd.startAuction([
              {
                adUnit: n,
                placement: e,
              },
            ]),
          ));
      };
      window.adngin?.adnginLoaderReady
        ? e()
        : window.addEventListener("adnginLoaderReady", e);
    },
  ),
  ((e, t) => {
    "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = e.document
          ? t(e, !0)
          : function (e) {
              if (e.document) return t(e);
              throw new Error("jQuery requires a window with a document");
            })
      : t(e);
  })(void 0 !== window ? window : this, function (C, I) {
    function P(e, t) {
      return t.toUpperCase();
    }
    var e = [],
      z = C.document,
      u = e.slice,
      O = e.concat,
      H = e.push,
      o = e.indexOf,
      j = {},
      R = j.toString,
      f = j.hasOwnProperty,
      g = {},
      S = function (e, t) {
        return new S.fn.init(e, t);
      },
      B = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      U = /^-ms-/,
      F = /-([\da-z])/gi;
    function W(e) {
      var t = !!e && "length" in e && e.length,
        n = S.type(e);
      return (
        "function" !== n &&
        !S.isWindow(e) &&
        ("array" === n ||
          0 === t ||
          ("number" == typeof t && 0 < t && t - 1 in e))
      );
    }
    ((S.fn = S.prototype =
      {
        jquery: "2.2.4",
        constructor: S,
        selector: "",
        length: 0,
        toArray: function () {
          return u.call(this);
        },
        get: function (e) {
          return null != e
            ? e < 0
              ? this[e + this.length]
              : this[e]
            : u.call(this);
        },
        pushStack: function (e) {
          e = S.merge(this.constructor(), e);
          return ((e.prevObject = this), (e.context = this.context), e);
        },
        each: function (e) {
          return S.each(this, e);
        },
        map: function (n) {
          return this.pushStack(
            S.map(this, function (e, t) {
              return n.call(e, t, e);
            }),
          );
        },
        slice: function () {
          return this.pushStack(u.apply(this, arguments));
        },
        first: function () {
          return this.eq(0);
        },
        last: function () {
          return this.eq(-1);
        },
        eq: function (e) {
          var t = this.length,
            e = +e + (e < 0 ? t : 0);
          return this.pushStack(0 <= e && e < t ? [this[e]] : []);
        },
        end: function () {
          return this.prevObject || this.constructor();
        },
        push: H,
        sort: e.sort,
        splice: e.splice,
      }),
      (S.extend = S.fn.extend =
        function () {
          var e,
            t,
            n,
            i,
            o,
            r = arguments[0] || {},
            s = 1,
            a = arguments.length,
            l = !1;
          for (
            "boolean" == typeof r && ((l = r), (r = arguments[s] || {}), s++),
              "object" == typeof r || S.isFunction(r) || (r = {}),
              s === a && ((r = this), s--);
            s < a;
            s++
          )
            if (null != (e = arguments[s]))
              for (t in e)
                ((o = r[t]),
                  (n = e[t]),
                  r !== n &&
                    (l && n && (S.isPlainObject(n) || (i = S.isArray(n)))
                      ? ((o = i
                          ? ((i = !1), o && S.isArray(o) ? o : [])
                          : o && S.isPlainObject(o)
                            ? o
                            : {}),
                        (r[t] = S.extend(l, o, n)))
                      : void 0 !== n && (r[t] = n)));
          return r;
        }),
      S.extend({
        expando: "jQuery" + ("2.2.4" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
          throw new Error(e);
        },
        noop: function () {},
        isFunction: function (e) {
          return "function" === S.type(e);
        },
        isArray: Array.isArray,
        isWindow: function (e) {
          return null != e && e === e.window;
        },
        isNumeric: function (e) {
          var t = e && e.toString();
          return !S.isArray(e) && 0 <= t - parseFloat(t) + 1;
        },
        isPlainObject: function (e) {
          if ("object" !== S.type(e) || e.nodeType || S.isWindow(e)) return !1;
          if (
            e.constructor &&
            !f.call(e, "constructor") &&
            !f.call(e.constructor.prototype || {}, "isPrototypeOf")
          )
            return !1;
          for (var t in e);
          return void 0 === t || f.call(e, t);
        },
        isEmptyObject: function (e) {
          for (var t in e) return !1;
          return !0;
        },
        type: function (e) {
          return null == e
            ? e + ""
            : "object" == typeof e || "function" == typeof e
              ? j[R.call(e)] || "object"
              : typeof e;
        },
        globalEval: function (e) {
          var t,
            n = eval;
          (e = S.trim(e)) &&
            (1 === e.indexOf("use strict")
              ? (((t = z.createElement("script")).text = e),
                z.head.appendChild(t).parentNode.removeChild(t))
              : n(e));
        },
        camelCase: function (e) {
          return e.replace(U, "ms-").replace(F, P);
        },
        nodeName: function (e, t) {
          return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
        },
        each: function (e, t) {
          var n,
            i = 0;
          if (W(e))
            for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
          else for (i in e) if (!1 === t.call(e[i], i, e[i])) break;
          return e;
        },
        trim: function (e) {
          return null == e ? "" : (e + "").replace(B, "");
        },
        makeArray: function (e, t) {
          t = t || [];
          return (
            null != e &&
              (W(Object(e))
                ? S.merge(t, "string" == typeof e ? [e] : e)
                : H.call(t, e)),
            t
          );
        },
        inArray: function (e, t, n) {
          return null == t ? -1 : o.call(t, e, n);
        },
        merge: function (e, t) {
          for (var n = +t.length, i = 0, o = e.length; i < n; i++)
            e[o++] = t[i];
          return ((e.length = o), e);
        },
        grep: function (e, t, n) {
          for (var i = [], o = 0, r = e.length, s = !n; o < r; o++)
            !t(e[o], o) != s && i.push(e[o]);
          return i;
        },
        map: function (e, t, n) {
          var i,
            o,
            r = 0,
            s = [];
          if (W(e))
            for (i = e.length; r < i; r++)
              null != (o = t(e[r], r, n)) && s.push(o);
          else for (r in e) ((o = t(e[r], r, n)), null != o && s.push(o));
          return O.apply([], s);
        },
        guid: 1,
        proxy: function (e, t) {
          var n, i;
          return (
            "string" == typeof t && ((i = e[t]), (t = e), (e = i)),
            S.isFunction(e)
              ? ((n = u.call(arguments, 2)),
                ((i = function () {
                  return e.apply(t || this, n.concat(u.call(arguments)));
                }).guid = e.guid =
                  e.guid || S.guid++),
                i)
              : void 0
          );
        },
        now: Date.now,
        support: g,
      }),
      "function" == typeof Symbol &&
        (S.fn[Symbol.iterator] = e[Symbol.iterator]),
      S.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
          " ",
        ),
        function (e, t) {
          j["[object " + t + "]"] = t.toLowerCase();
        },
      ));
    function i(e, t, n) {
      for (var i = [], o = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
        if (1 === e.nodeType) {
          if (o && S(e).is(n)) break;
          i.push(e);
        }
      return i;
    }
    function Z(e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    }
    var e = ((I) => {
        function d(e, t, n) {
          var i = "0x" + t - 65536;
          return i != i || n
            ? t
            : i < 0
              ? String.fromCharCode(65536 + i)
              : String.fromCharCode((i >> 10) | 55296, (1023 & i) | 56320);
        }
        function P() {
          z();
        }
        var e,
          f,
          w,
          r,
          O,
          g,
          H,
          j,
          C,
          l,
          c,
          z,
          S,
          t,
          x,
          m,
          i,
          o,
          v,
          k = "sizzle" + +new Date(),
          y = I.document,
          _ = 0,
          R = 0,
          B = ce(),
          U = ce(),
          b = ce(),
          F = function (e, t) {
            return (e === t && (c = !0), 0);
          },
          W = {}.hasOwnProperty,
          n = [],
          Z = n.pop,
          G = n.push,
          $ = n.push,
          V = n.slice,
          M = function (e, t) {
            for (var n = 0, i = e.length; n < i; n++) if (e[n] === t) return n;
            return -1;
          },
          X =
            "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
          s = "[\\x20\\t\\r\\n\\f]",
          a = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
          Y =
            "\\[" +
            s +
            "*(" +
            a +
            ")(?:" +
            s +
            "*([*^$|!~]?=)" +
            s +
            "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
            a +
            "))|)" +
            s +
            "*\\]",
          J =
            ":(" +
            a +
            ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
            Y +
            ")*)|.*)\\)|)",
          K = new RegExp(s + "+", "g"),
          T = new RegExp(
            "^" + s + "+|((?:^|[^\\\\])(?:\\\\.)*)" + s + "+$",
            "g",
          ),
          Q = new RegExp("^" + s + "*," + s + "*"),
          ee = new RegExp("^" + s + "*([>+~]|" + s + ")" + s + "*"),
          te = new RegExp("=" + s + "*([^\\]'\"]*?)" + s + "*\\]", "g"),
          ne = new RegExp(J),
          ie = new RegExp("^" + a + "$"),
          h = {
            ID: new RegExp("^#(" + a + ")"),
            CLASS: new RegExp("^\\.(" + a + ")"),
            TAG: new RegExp("^(" + a + "|[*])"),
            ATTR: new RegExp("^" + Y),
            PSEUDO: new RegExp("^" + J),
            CHILD: new RegExp(
              "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                s +
                "*(even|odd|(([+-]|)(\\d*)n|)" +
                s +
                "*(?:([+-]|)" +
                s +
                "*(\\d+)|))" +
                s +
                "*\\)|)",
              "i",
            ),
            bool: new RegExp("^(?:" + X + ")$", "i"),
            needsContext: new RegExp(
              "^" +
                s +
                "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                s +
                "*((?:-\\d)?\\d*)" +
                s +
                "*\\)|)(?=[^-]|$)",
              "i",
            ),
          },
          isInputRegex = /^(?:input|select|textarea|button)$/i,
          re = /^h\d$/i,
          u = /^[^{]+\{\s*\[native \w/,
          se = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
          ae = /[+~]/,
          le = /'|\\/g,
          p = new RegExp("\\\\([\\da-f]{1,6}" + s + "?|(" + s + ")|.)", "ig");
        try {
          ($.apply((n = V.call(y.childNodes)), y.childNodes),
            n[y.childNodes.length].nodeType);
        } catch (exception) {
          $ = {
            apply: n.length
              ? function (e, t) {
                  G.apply(e, V.call(t));
                }
              : function (e, t) {
                  for (var n = e.length, i = 0; (e[n++] = t[i++]); );
                  e.length = n - 1;
                },
          };
        }
        function L(e, t, n, i) {
          var o,
            r,
            s,
            a,
            l,
            c,
            u,
            d,
            h = t && t.ownerDocument,
            p = t ? t.nodeType : 9;
          if (
            ((n = n || []),
            "string" != typeof e || !e || (1 !== p && 9 !== p && 11 !== p))
          )
            return n;
          if (
            !i &&
            ((t ? t.ownerDocument || t : y) !== S && z(t), (t = t || S), x)
          ) {
            if (11 !== p && (c = se.exec(e)))
              if ((o = c[1])) {
                if (9 === p) {
                  if (!(s = t.getElementById(o))) return n;
                  if (s.id === o) return (n.push(s), n);
                } else if (
                  h &&
                  (s = h.getElementById(o)) &&
                  v(t, s) &&
                  s.id === o
                )
                  return (n.push(s), n);
              } else {
                if (c[2]) return ($.apply(n, t.getElementsByTagName(e)), n);
                if (
                  (o = c[3]) &&
                  f.getElementsByClassName &&
                  t.getElementsByClassName
                )
                  return ($.apply(n, t.getElementsByClassName(o)), n);
              }
            if (f.qsa && !b[e + " "] && (!m || !m.test(e))) {
              if (1 !== p) ((h = t), (d = e));
              else if ("object" !== t.nodeName.toLowerCase()) {
                for (
                  (a = t.getAttribute("id"))
                    ? (a = a.replace(le, "\\$&"))
                    : t.setAttribute("id", (a = k)),
                    r = (u = g(e)).length,
                    l = ie.test(a) ? "#" + a : "[id='" + a + "']";
                  r--;
                )
                  u[r] = l + " " + D(u[r]);
                ((d = u.join(",")),
                  (h = (ae.test(e) && he(t.parentNode)) || t));
              }
              if (d)
                try {
                  return ($.apply(n, h.querySelectorAll(d)), n);
                } catch (e) {
                } finally {
                  a === k && t.removeAttribute("id");
                }
            }
          }
          return j(e.replace(T, "$1"), t, n, i);
        }
        function ce() {
          var n = [];
          function i(e, t) {
            return (
              n.push(e + " ") > w.cacheLength && delete i[n.shift()],
              (i[e + " "] = t)
            );
          }
          return i;
        }
        function E(e) {
          return ((e[k] = !0), e);
        }
        function A(e) {
          var t = S.createElement("div");
          try {
            return !!e(t);
          } catch (e) {
            return !1;
          } finally {
            t.parentNode && t.parentNode.removeChild(t);
          }
        }
        function ue(e, t) {
          for (var n = e.split("|"), i = n.length; i--; )
            w.attrHandle[n[i]] = t;
        }
        function de(e, t) {
          var n = t && e,
            i =
              n &&
              1 === e.nodeType &&
              1 === t.nodeType &&
              (~t.sourceIndex || 1 << 31) - (~e.sourceIndex || 1 << 31);
          if (i) return i;
          if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
          return e ? 1 : -1;
        }
        function q(s) {
          return E(function (r) {
            return (
              (r = +r),
              E(function (e, t) {
                for (var n, i = s([], e.length, r), o = i.length; o--; )
                  e[(n = i[o])] && (e[n] = !(t[n] = e[n]));
              })
            );
          });
        }
        function he(e) {
          return e && void 0 !== e.getElementsByTagName && e;
        }
        for (e in ((f = L.support = {}),
        (O = L.isXML =
          function (e) {
            e = e && (e.ownerDocument || e).documentElement;
            return !!e && "HTML" !== e.nodeName;
          }),
        (z = L.setDocument =
          function (e) {
            var e = e ? e.ownerDocument || e : y;
            return (
              e !== S &&
                9 === e.nodeType &&
                e.documentElement &&
                ((t = (S = e).documentElement),
                (x = !O(S)),
                (e = S.defaultView) &&
                  e.top !== e &&
                  (e.addEventListener
                    ? e.addEventListener("unload", P, !1)
                    : e.attachEvent && e.attachEvent("onunload", P)),
                (f.attributes = A(function (e) {
                  return ((e.className = "i"), !e.getAttribute("className"));
                })),
                (f.getElementsByTagName = A(function (e) {
                  return (
                    e.appendChild(S.createComment("")),
                    !e.getElementsByTagName("*").length
                  );
                })),
                (f.getElementsByClassName = u.test(S.getElementsByClassName)),
                (f.getById = A(function (e) {
                  return (
                    (t.appendChild(e).id = k),
                    !S.getElementsByName || !S.getElementsByName(k).length
                  );
                })),
                f.getById
                  ? ((w.find.ID = function (e, t) {
                      if (void 0 !== t.getElementById && x)
                        return (t = t.getElementById(e)) ? [t] : [];
                    }),
                    (w.filter.ID = function (e) {
                      var t = e.replace(p, d);
                      return function (e) {
                        return e.getAttribute("id") === t;
                      };
                    }))
                  : (delete w.find.ID,
                    (w.filter.ID = function (e) {
                      var t = e.replace(p, d);
                      return function (e) {
                        e =
                          void 0 !== e.getAttributeNode &&
                          e.getAttributeNode("id");
                        return e && e.value === t;
                      };
                    })),
                (w.find.TAG = f.getElementsByTagName
                  ? function (e, t) {
                      return void 0 !== t.getElementsByTagName
                        ? t.getElementsByTagName(e)
                        : f.qsa
                          ? t.querySelectorAll(e)
                          : void 0;
                    }
                  : function (e, t) {
                      var n,
                        i = [],
                        o = 0,
                        r = t.getElementsByTagName(e);
                      if ("*" !== e) return r;
                      for (; (n = r[o++]); ) 1 === n.nodeType && i.push(n);
                      return i;
                    }),
                (w.find.CLASS =
                  f.getElementsByClassName &&
                  function (e, t) {
                    return void 0 !== t.getElementsByClassName && x
                      ? t.getElementsByClassName(e)
                      : void 0;
                  }),
                (i = []),
                (m = []),
                (f.qsa = u.test(S.querySelectorAll)) &&
                  (A(function (e) {
                    ((t.appendChild(e).innerHTML =
                      "<a id='" +
                      k +
                      "'></a><select id='" +
                      k +
                      "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                      e.querySelectorAll("[msallowcapture^='']").length &&
                        m.push("[*^$]=" + s + "*(?:''|\"\")"),
                      e.querySelectorAll("[selected]").length ||
                        m.push("\\[" + s + "*(?:value|" + X + ")"),
                      e.querySelectorAll("[id~=" + k + "-]").length ||
                        m.push("~="),
                      e.querySelectorAll(":checked").length ||
                        m.push(":checked"),
                      e.querySelectorAll("a#" + k + "+*").length ||
                        m.push(".#.+[+~]"));
                  }),
                  A(function (e) {
                    var t = S.createElement("input");
                    (t.setAttribute("type", "hidden"),
                      e.appendChild(t).setAttribute("name", "D"),
                      e.querySelectorAll("[name=d]").length &&
                        m.push("name" + s + "*[*^$|!~]?="),
                      e.querySelectorAll(":enabled").length ||
                        m.push(":enabled", ":disabled"),
                      e.querySelectorAll("*,:x"),
                      m.push(",.*:"));
                  })),
                (f.matchesSelector = u.test(
                  (o =
                    t.matches ||
                    t.webkitMatchesSelector ||
                    t.mozMatchesSelector ||
                    t.oMatchesSelector ||
                    t.msMatchesSelector),
                )) &&
                  A(function (e) {
                    ((f.disconnectedMatch = o.call(e, "div")),
                      o.call(e, "[s!='']:x"),
                      i.push("!=", J));
                  }),
                (m = m.length && new RegExp(m.join("|"))),
                (i = i.length && new RegExp(i.join("|"))),
                (e = u.test(t.compareDocumentPosition)),
                (v =
                  e || u.test(t.contains)
                    ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                          t = t && t.parentNode;
                        return (
                          e === t ||
                          !(
                            !t ||
                            1 !== t.nodeType ||
                            !(n.contains
                              ? n.contains(t)
                              : e.compareDocumentPosition &&
                                16 & e.compareDocumentPosition(t))
                          )
                        );
                      }
                    : function (e, t) {
                        if (t)
                          for (; (t = t.parentNode); ) if (t === e) return !0;
                        return !1;
                      }),
                (F = e
                  ? function (e, t) {
                      var n;
                      return e === t
                        ? ((c = !0), 0)
                        : (n =
                            !e.compareDocumentPosition -
                            !t.compareDocumentPosition) ||
                            (1 &
                              (n =
                                (e.ownerDocument || e) ===
                                (t.ownerDocument || t)
                                  ? e.compareDocumentPosition(t)
                                  : 1) ||
                            (!f.sortDetached &&
                              t.compareDocumentPosition(e) === n)
                              ? e === S || (e.ownerDocument === y && v(y, e))
                                ? -1
                                : t === S || (t.ownerDocument === y && v(y, t))
                                  ? 1
                                  : l
                                    ? M(l, e) - M(l, t)
                                    : 0
                              : 4 & n
                                ? -1
                                : 1);
                    }
                  : function (e, t) {
                      if (e === t) return ((c = !0), 0);
                      var n,
                        i = 0,
                        o = e.parentNode,
                        r = t.parentNode,
                        s = [e],
                        a = [t];
                      if (!o || !r)
                        return e === S
                          ? -1
                          : t === S
                            ? 1
                            : o
                              ? -1
                              : r
                                ? 1
                                : l
                                  ? M(l, e) - M(l, t)
                                  : 0;
                      if (o === r) return de(e, t);
                      for (n = e; (n = n.parentNode); ) s.unshift(n);
                      for (n = t; (n = n.parentNode); ) a.unshift(n);
                      for (; s[i] === a[i]; ) i++;
                      return i
                        ? de(s[i], a[i])
                        : s[i] === y
                          ? -1
                          : a[i] === y
                            ? 1
                            : 0;
                    })),
              S
            );
          }),
        (L.matches = function (e, t) {
          return L(e, null, null, t);
        }),
        (L.matchesSelector = function (e, t) {
          if (
            ((e.ownerDocument || e) !== S && z(e),
            (t = t.replace(te, "='$1']")),
            f.matchesSelector &&
              x &&
              !b[t + " "] &&
              (!i || !i.test(t)) &&
              (!m || !m.test(t)))
          )
            try {
              var n = o.call(e, t);
              if (
                n ||
                f.disconnectedMatch ||
                (e.document && 11 !== e.document.nodeType)
              )
                return n;
            } catch (e) {}
          return 0 < L(t, S, null, [e]).length;
        }),
        (L.contains = function (e, t) {
          return ((e.ownerDocument || e) !== S && z(e), v(e, t));
        }),
        (L.attr = function (e, t) {
          (e.ownerDocument || e) !== S && z(e);
          var n = w.attrHandle[t.toLowerCase()],
            n =
              n && W.call(w.attrHandle, t.toLowerCase()) ? n(e, t, !x) : void 0;
          return void 0 !== n
            ? n
            : f.attributes || !x
              ? e.getAttribute(t)
              : (n = e.getAttributeNode(t)) && n.specified
                ? n.value
                : null;
        }),
        (L.error = function (e) {
          throw new Error("Syntax error, unrecognized expression: " + e);
        }),
        (L.uniqueSort = function (e) {
          var t,
            n = [],
            i = 0,
            o = 0;
          if (
            ((c = !f.detectDuplicates),
            (l = !f.sortStable && e.slice(0)),
            e.sort(F),
            c)
          ) {
            for (; (t = e[o++]); ) t === e[o] && (i = n.push(o));
            for (; i--; ) e.splice(n[i], 1);
          }
          return ((l = null), e);
        }),
        (r = L.getText =
          function (e) {
            var t,
              n = "",
              i = 0,
              o = e.nodeType;
            if (o) {
              if (1 === o || 9 === o || 11 === o) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) n += r(e);
              } else if (3 === o || 4 === o) return e.nodeValue;
            } else for (; (t = e[i++]); ) n += r(t);
            return n;
          }),
        ((w = L.selectors =
          {
            cacheLength: 50,
            createPseudo: E,
            match: h,
            attrHandle: {},
            find: {},
            relative: {
              ">": {
                dir: "parentNode",
                first: !0,
              },
              " ": {
                dir: "parentNode",
              },
              "+": {
                dir: "previousSibling",
                first: !0,
              },
              "~": {
                dir: "previousSibling",
              },
            },
            preFilter: {
              ATTR: function (e) {
                return (
                  (e[1] = e[1].replace(p, d)),
                  (e[3] = (e[3] || e[4] || e[5] || "").replace(p, d)),
                  "~=" === e[2] && (e[3] = " " + e[3] + " "),
                  e.slice(0, 4)
                );
              },
              CHILD: function (e) {
                return (
                  (e[1] = e[1].toLowerCase()),
                  "nth" === e[1].slice(0, 3)
                    ? (e[3] || L.error(e[0]),
                      (e[4] = +(e[4]
                        ? e[5] + (e[6] || 1)
                        : 2 * ("even" === e[3] || "odd" === e[3]))),
                      (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                    : e[3] && L.error(e[0]),
                  e
                );
              },
              PSEUDO: function (e) {
                var t,
                  n = !e[6] && e[2];
                return h.CHILD.test(e[0])
                  ? null
                  : (e[3]
                      ? (e[2] = e[4] || e[5] || "")
                      : n &&
                        ne.test(n) &&
                        (t =
                          (t = g(n, !0)) &&
                          n.indexOf(")", n.length - t) - n.length) &&
                        ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                    e.slice(0, 3));
              },
            },
            filter: {
              TAG: function (e) {
                var t = e.replace(p, d).toLowerCase();
                return "*" === e
                  ? function () {
                      return !0;
                    }
                  : function (e) {
                      return e.nodeName && e.nodeName.toLowerCase() === t;
                    };
              },
              CLASS: function (e) {
                var t = B[e + " "];
                return (
                  t ||
                  ((t = new RegExp("(^|" + s + ")" + e + "(" + s + "|$)")) &&
                    B(e, function (e) {
                      return t.test(
                        ("string" == typeof e.className && e.className) ||
                          (void 0 !== e.getAttribute &&
                            e.getAttribute("class")) ||
                          "",
                      );
                    }))
                );
              },
              ATTR: function (t, n, i) {
                return function (e) {
                  e = L.attr(e, t);
                  return null == e
                    ? "!=" === n
                    : !n ||
                        ((e += ""),
                        "=" === n
                          ? e === i
                          : "!=" === n
                            ? e !== i
                            : "^=" === n
                              ? i && 0 === e.indexOf(i)
                              : "*=" === n
                                ? i && -1 < e.indexOf(i)
                                : "$=" === n
                                  ? i && e.slice(-i.length) === i
                                  : "~=" === n
                                    ? -1 <
                                      (" " + e.replace(K, " ") + " ").indexOf(i)
                                    : "|=" === n &&
                                      (e === i ||
                                        e.slice(0, i.length + 1) === i + "-"));
                };
              },
              CHILD: function (f, e, t, g, m) {
                var v = "nth" !== f.slice(0, 3),
                  y = "last" !== f.slice(-4),
                  b = "of-type" === e;
                return 1 === g && 0 === m
                  ? function (e) {
                      return !!e.parentNode;
                    }
                  : function (e, t, n) {
                      var i,
                        o,
                        r,
                        s,
                        a,
                        l,
                        c = v != y ? "nextSibling" : "previousSibling",
                        u = e.parentNode,
                        d = b && e.nodeName.toLowerCase(),
                        h = !n && !b,
                        p = !1;
                      if (u) {
                        if (v) {
                          for (; c; ) {
                            for (s = e; (s = s[c]); )
                              if (
                                b
                                  ? s.nodeName.toLowerCase() === d
                                  : 1 === s.nodeType
                              )
                                return !1;
                            l = c = "only" === f && !l && "nextSibling";
                          }
                          return !0;
                        }
                        if (((l = [y ? u.firstChild : u.lastChild]), y && h)) {
                          for (
                            p =
                              (a =
                                (i =
                                  (o =
                                    (r = (s = u)[k] || (s[k] = {}))[
                                      s.uniqueID
                                    ] || (r[s.uniqueID] = {}))[f] || [])[0] ===
                                  _ && i[1]) && i[2],
                              s = a && u.childNodes[a];
                            (s = (++a && s && s[c]) || ((p = a = 0), l.pop()));
                          )
                            if (1 === s.nodeType && ++p && s === e) {
                              o[f] = [_, a, p];
                              break;
                            }
                        } else if (
                          !1 ===
                          (p = h
                            ? (a =
                                (i =
                                  (o =
                                    (r = (s = e)[k] || (s[k] = {}))[
                                      s.uniqueID
                                    ] || (r[s.uniqueID] = {}))[f] || [])[0] ===
                                  _ && i[1])
                            : p)
                        )
                          for (
                            ;
                            (s =
                              (++a && s && s[c]) || ((p = a = 0), l.pop())) &&
                            ((b
                              ? s.nodeName.toLowerCase() !== d
                              : 1 !== s.nodeType) ||
                              !++p ||
                              (h &&
                                ((o =
                                  (r = s[k] || (s[k] = {}))[s.uniqueID] ||
                                  (r[s.uniqueID] = {}))[f] = [_, p]),
                              s !== e));
                          );
                        return (p -= m) === g || (p % g == 0 && 0 <= p / g);
                      }
                    };
              },
              PSEUDO: function (e, r) {
                var t,
                  s =
                    w.pseudos[e] ||
                    w.setFilters[e.toLowerCase()] ||
                    L.error("unsupported pseudo: " + e);
                return s[k]
                  ? s(r)
                  : 1 < s.length
                    ? ((t = [e, e, "", r]),
                      w.setFilters.hasOwnProperty(e.toLowerCase())
                        ? E(function (e, t) {
                            for (var n, i = s(e, r), o = i.length; o--; )
                              e[(n = M(e, i[o]))] = !(t[n] = i[o]);
                          })
                        : function (e) {
                            return s(e, 0, t);
                          })
                    : s;
              },
            },
            pseudos: {
              not: E(function (e) {
                var i = [],
                  o = [],
                  a = H(e.replace(T, "$1"));
                return a[k]
                  ? E(function (e, t, n, i) {
                      for (var o, r = a(e, null, i, []), s = e.length; s--; )
                        (o = r[s]) && (e[s] = !(t[s] = o));
                    })
                  : function (e, t, n) {
                      return (
                        (i[0] = e),
                        a(i, null, n, o),
                        (i[0] = null),
                        !o.pop()
                      );
                    };
              }),
              has: E(function (t) {
                return function (e) {
                  return 0 < L(t, e).length;
                };
              }),
              contains: E(function (t) {
                return (
                  (t = t.replace(p, d)),
                  function (e) {
                    return (
                      -1 < (e.textContent || e.innerText || r(e)).indexOf(t)
                    );
                  }
                );
              }),
              lang: E(function (n) {
                return (
                  ie.test(n || "") || L.error("unsupported lang: " + n),
                  (n = n.replace(p, d).toLowerCase()),
                  function (e) {
                    var t;
                    do {
                      if (
                        (t = x
                          ? e.lang
                          : e.getAttribute("xml:lang") ||
                            e.getAttribute("lang"))
                      )
                        return (
                          (t = t.toLowerCase()) === n ||
                          0 === t.indexOf(n + "-")
                        );
                    } while ((e = e.parentNode) && 1 === e.nodeType);
                    return !1;
                  }
                );
              }),
              target: function (e) {
                var t = I.location && I.location.hash;
                return t && t.slice(1) === e.id;
              },
              root: function (e) {
                return e === t;
              },
              focus: function (e) {
                return (
                  e === S.activeElement &&
                  (!S.hasFocus || S.hasFocus()) &&
                  !!(e.type || e.href || ~e.tabIndex)
                );
              },
              enabled: function (e) {
                return !1 === e.disabled;
              },
              disabled: function (e) {
                return !0 === e.disabled;
              },
              checked: function (e) {
                var t = e.nodeName.toLowerCase();
                return (
                  ("input" === t && !!e.checked) ||
                  ("option" === t && !!e.selected)
                );
              },
              selected: function (e) {
                return (
                  e.parentNode && e.parentNode.selectedIndex,
                  !0 === e.selected
                );
              },
              empty: function (e) {
                for (e = e.firstChild; e; e = e.nextSibling)
                  if (e.nodeType < 6) return !1;
                return !0;
              },
              parent: function (e) {
                return !w.pseudos.empty(e);
              },
              header: function (e) {
                return re.test(e.nodeName);
              },
              input: function (e) {
                return isInputRegex.test(e.nodeName);
              },
              button: function (e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t && "button" === e.type) || "button" === t;
              },
              text: function (e) {
                return (
                  "input" === e.nodeName.toLowerCase() &&
                  "text" === e.type &&
                  (null == (e = e.getAttribute("type")) ||
                    "text" === e.toLowerCase())
                );
              },
              first: q(function () {
                return [0];
              }),
              last: q(function (e, t) {
                return [t - 1];
              }),
              eq: q(function (e, t, n) {
                return [n < 0 ? n + t : n];
              }),
              even: q(function (e, t) {
                for (var n = 0; n < t; n += 2) e.push(n);
                return e;
              }),
              odd: q(function (e, t) {
                for (var n = 1; n < t; n += 2) e.push(n);
                return e;
              }),
              lt: q(function (e, t, n) {
                for (var i = n < 0 ? n + t : n; 0 <= --i; ) e.push(i);
                return e;
              }),
              gt: q(function (e, t, n) {
                for (var i = n < 0 ? n + t : n; ++i < t; ) e.push(i);
                return e;
              }),
            },
          }).pseudos.nth = w.pseudos.eq),
        {
          radio: !0,
          checkbox: !0,
          file: !0,
          password: !0,
          image: !0,
        }))
          w.pseudos[e] = ((t) =>
            function (e) {
              return "input" === e.nodeName.toLowerCase() && e.type === t;
            })(e);
        for (e in {
          submit: !0,
          reset: !0,
        })
          w.pseudos[e] = ((n) =>
            function (e) {
              var t = e.nodeName.toLowerCase();
              return ("input" === t || "button" === t) && e.type === n;
            })(e);
        function pe() {}
        function D(e) {
          for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
          return i;
        }
        function fe(s, e, t) {
          var a = e.dir,
            l = t && "parentNode" === a,
            c = R++;
          return e.first
            ? function (e, t, n) {
                for (; (e = e[a]); )
                  if (1 === e.nodeType || l) return s(e, t, n);
              }
            : function (e, t, n) {
                var i,
                  o,
                  r = [_, c];
                if (n) {
                  for (; (e = e[a]); )
                    if ((1 === e.nodeType || l) && s(e, t, n)) return !0;
                } else
                  for (; (e = e[a]); )
                    if (1 === e.nodeType || l) {
                      if (
                        (i = (o =
                          (o = e[k] || (e[k] = {}))[e.uniqueID] ||
                          (o[e.uniqueID] = {}))[a]) &&
                        i[0] === _ &&
                        i[1] === c
                      )
                        return (r[2] = i[2]);
                      if (((o[a] = r)[2] = s(e, t, n))) return !0;
                    }
              };
        }
        function ge(o) {
          return 1 < o.length
            ? function (e, t, n) {
                for (var i = o.length; i--; ) if (!o[i](e, t, n)) return !1;
                return !0;
              }
            : o[0];
        }
        function N(e, t, n, i, o) {
          for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)
            !(r = e[a]) || (n && !n(r, i, o)) || (s.push(r), c && t.push(a));
          return s;
        }
        function me(p, f, g, m, v, e) {
          return (
            m && !m[k] && (m = me(m)),
            v && !v[k] && (v = me(v, e)),
            E(function (e, t, n, i) {
              var o,
                r,
                s,
                a = [],
                l = [],
                c = t.length,
                u =
                  e ||
                  ((e, t, n) => {
                    for (var i = 0, o = t.length; i < o; i++) L(e, t[i], n);
                    return n;
                  })(f || "*", n.nodeType ? [n] : n, []),
                d = !p || (!e && f) ? u : N(u, a, p, n, i),
                h = g ? (v || (e ? p : c || m) ? [] : t) : d;
              if ((g && g(d, h, n, i), m))
                for (o = N(h, l), m(o, [], n, i), r = o.length; r--; )
                  (s = o[r]) && (h[l[r]] = !(d[l[r]] = s));
              if (e) {
                if (v || p) {
                  if (v) {
                    for (o = [], r = h.length; r--; )
                      (s = h[r]) && o.push((d[r] = s));
                    v(null, (h = []), o, i);
                  }
                  for (r = h.length; r--; )
                    (s = h[r]) &&
                      -1 < (o = v ? M(e, s) : a[r]) &&
                      (e[o] = !(t[o] = s));
                }
              } else
                ((h = N(h === t ? h.splice(c, h.length) : h)),
                  v ? v(null, t, h, i) : $.apply(t, h));
            })
          );
        }
        function ve(m, v) {
          function e(e, t, n, i, o) {
            var r,
              s,
              a,
              l = 0,
              c = "0",
              u = e && [],
              d = [],
              h = C,
              p = e || (b && w.find.TAG("*", o)),
              f = (_ += null == h ? 1 : Math.random() || 0.1),
              g = p.length;
            for (
              o && (C = t === S || t || o);
              c !== g && null != (r = p[c]);
              c++
            ) {
              if (b && r) {
                for (
                  s = 0, t || r.ownerDocument === S || (z(r), (n = !x));
                  (a = m[s++]);
                )
                  if (a(r, t || S, n)) {
                    i.push(r);
                    break;
                  }
                o && (_ = f);
              }
              y && ((r = !a && r) && l--, e) && u.push(r);
            }
            if (((l += c), y && c !== l)) {
              for (s = 0; (a = v[s++]); ) a(u, d, t, n);
              if (e) {
                if (0 < l) for (; c--; ) u[c] || d[c] || (d[c] = Z.call(i));
                d = N(d);
              }
              ($.apply(i, d),
                o && !e && 0 < d.length && 1 < l + v.length && L.uniqueSort(i));
            }
            return (o && ((_ = f), (C = h)), u);
          }
          var y = 0 < v.length,
            b = 0 < m.length;
          return y ? E(e) : e;
        }
        return (
          (pe.prototype = w.filters = w.pseudos),
          (w.setFilters = new pe()),
          (g = L.tokenize =
            function (e, t) {
              var n,
                i,
                o,
                r,
                s,
                a,
                l,
                c = U[e + " "];
              if (c) return t ? 0 : c.slice(0);
              for (s = e, a = [], l = w.preFilter; s; ) {
                for (r in ((n && !(i = Q.exec(s))) ||
                  (i && (s = s.slice(i[0].length) || s), a.push((o = []))),
                (n = !1),
                (i = ee.exec(s)) &&
                  ((n = i.shift()),
                  o.push({
                    value: n,
                    type: i[0].replace(T, " "),
                  }),
                  (s = s.slice(n.length))),
                w.filter))
                  !(i = h[r].exec(s)) ||
                    (l[r] && !(i = l[r](i))) ||
                    ((n = i.shift()),
                    o.push({
                      value: n,
                      type: r,
                      matches: i,
                    }),
                    (s = s.slice(n.length)));
                if (!n) break;
              }
              return t ? s.length : s ? L.error(e) : U(e, a).slice(0);
            }),
          (H = L.compile =
            function (e, t) {
              var n,
                i = [],
                o = [],
                r = b[e + " "];
              if (!r) {
                for (n = (t = t || g(e)).length; n--; )
                  ((r = (function e(t) {
                    for (
                      var i,
                        n,
                        o,
                        r = t.length,
                        s = w.relative[t[0].type],
                        a = s || w.relative[" "],
                        l = s ? 1 : 0,
                        c = fe(
                          function (e) {
                            return e === i;
                          },
                          a,
                          !0,
                        ),
                        u = fe(
                          function (e) {
                            return -1 < M(i, e);
                          },
                          a,
                          !0,
                        ),
                        d = [
                          function (e, t, n) {
                            return (
                              (e =
                                (!s && (n || t !== C)) ||
                                ((i = t).nodeType ? c : u)(e, t, n)),
                              (i = null),
                              e
                            );
                          },
                        ];
                      l < r;
                      l++
                    )
                      if ((n = w.relative[t[l].type])) d = [fe(ge(d), n)];
                      else {
                        if (
                          (n = w.filter[t[l].type].apply(null, t[l].matches))[k]
                        ) {
                          for (o = ++l; o < r && !w.relative[t[o].type]; o++);
                          return me(
                            1 < l && ge(d),
                            1 < l &&
                              D(
                                t.slice(0, l - 1).concat({
                                  value: " " === t[l - 2].type ? "*" : "",
                                }),
                              ).replace(T, "$1"),
                            n,
                            l < o && e(t.slice(l, o)),
                            o < r && e((t = t.slice(o))),
                            o < r && D(t),
                          );
                        }
                        d.push(n);
                      }
                    return ge(d);
                  })(t[n]))[k]
                    ? i
                    : o
                  ).push(r);
                (r = b(e, ve(o, i))).selector = e;
              }
              return r;
            }),
          (j = L.select =
            function (e, t, n, i) {
              var o,
                r,
                s,
                a,
                l,
                c = "function" == typeof e && e,
                u = !i && g((e = c.selector || e));
              if (((n = n || []), 1 === u.length)) {
                if (
                  2 < (r = u[0] = u[0].slice(0)).length &&
                  "ID" === (s = r[0]).type &&
                  f.getById &&
                  9 === t.nodeType &&
                  x &&
                  w.relative[r[1].type]
                ) {
                  if (
                    !(t = (w.find.ID(s.matches[0].replace(p, d), t) || [])[0])
                  )
                    return n;
                  (c && (t = t.parentNode),
                    (e = e.slice(r.shift().value.length)));
                }
                for (
                  o = h.needsContext.test(e) ? 0 : r.length;
                  o-- && ((s = r[o]), !w.relative[(a = s.type)]);
                )
                  if (
                    (l = w.find[a]) &&
                    (i = l(
                      s.matches[0].replace(p, d),
                      (ae.test(r[0].type) && he(t.parentNode)) || t,
                    ))
                  ) {
                    if ((r.splice(o, 1), (e = i.length && D(r)))) break;
                    return ($.apply(n, i), n);
                  }
              }
              return (
                (c || H(e, u))(
                  i,
                  t,
                  !x,
                  n,
                  !t || (ae.test(e) && he(t.parentNode)) || t,
                ),
                n
              );
            }),
          (f.sortStable = k.split("").sort(F).join("") === k),
          (f.detectDuplicates = !!c),
          z(),
          (f.sortDetached = A(function (e) {
            return 1 & e.compareDocumentPosition(S.createElement("div"));
          })),
          A(function (e) {
            return (
              (e.innerHTML = "<a href='#'></a>"),
              "#" === e.firstChild.getAttribute("href")
            );
          }) ||
            ue("type|href|height|width", function (e, t, n) {
              return n
                ? void 0
                : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
            }),
          (f.attributes &&
            A(function (e) {
              return (
                (e.innerHTML = "<input/>"),
                e.firstChild.setAttribute("value", ""),
                "" === e.firstChild.getAttribute("value")
              );
            })) ||
            ue("value", function (e, t, n) {
              return n || "input" !== e.nodeName.toLowerCase()
                ? void 0
                : e.defaultValue;
            }),
          A(function (e) {
            return null == e.getAttribute("disabled");
          }) ||
            ue(X, function (e, t, n) {
              return n
                ? void 0
                : !0 === e[t]
                  ? t.toLowerCase()
                  : (n = e.getAttributeNode(t)) && n.specified
                    ? n.value
                    : null;
            }),
          L
        );
      })(C),
      G =
        ((S.find = e),
        (S.expr = e.selectors),
        (S.expr[":"] = S.expr.pseudos),
        (S.uniqueSort = S.unique = e.uniqueSort),
        (S.text = e.getText),
        (S.isXMLDoc = e.isXML),
        (S.contains = e.contains),
        S.expr.match.needsContext),
      V = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
      X = /^.[^:#\[\.,]*$/;
    function Y(e, n, i) {
      if (S.isFunction(n))
        return S.grep(e, function (e, t) {
          return !!n.call(e, t, e) !== i;
        });
      if (n.nodeType)
        return S.grep(e, function (e) {
          return (e === n) !== i;
        });
      if ("string" == typeof n) {
        if (X.test(n)) return S.filter(n, e, i);
        n = S.filter(n, e);
      }
      return S.grep(e, function (e) {
        return -1 < o.call(n, e) !== i;
      });
    }
    ((S.filter = function (e, t, n) {
      var i = t[0];
      return (
        n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === i.nodeType
          ? S.find.matchesSelector(i, e)
            ? [i]
            : []
          : S.find.matches(
              e,
              S.grep(t, function (e) {
                return 1 === e.nodeType;
              }),
            )
      );
    }),
      S.fn.extend({
        find: function (e) {
          var t,
            n = this.length,
            i = [],
            o = this;
          if ("string" != typeof e)
            return this.pushStack(
              S(e).filter(function () {
                for (t = 0; t < n; t++) if (S.contains(o[t], this)) return !0;
              }),
            );
          for (t = 0; t < n; t++) S.find(e, o[t], i);
          return (
            ((i = this.pushStack(1 < n ? S.unique(i) : i)).selector = this
              .selector
              ? this.selector + " " + e
              : e),
            i
          );
        },
        filter: function (e) {
          return this.pushStack(Y(this, e || [], !1));
        },
        not: function (e) {
          return this.pushStack(Y(this, e || [], !0));
        },
        is: function (e) {
          return !!Y(
            this,
            "string" == typeof e && G.test(e) ? S(e) : e || [],
            !1,
          ).length;
        },
      }));
    var J,
      K = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      Q =
        (((S.fn.init = function (e, t, n) {
          if (e) {
            if (((n = n || J), "string" != typeof e))
              return e.nodeType
                ? ((this.context = this[0] = e), (this.length = 1), this)
                : S.isFunction(e)
                  ? void 0 !== n.ready
                    ? n.ready(e)
                    : e(S)
                  : (void 0 !== e.selector &&
                      ((this.selector = e.selector),
                      (this.context = e.context)),
                    S.makeArray(e, this));
            if (
              !(i =
                "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length
                  ? [null, e, null]
                  : K.exec(e)) ||
              (!i[1] && t)
            )
              return (!t || t.jquery ? t || n : this.constructor(t)).find(e);
            if (i[1]) {
              if (
                ((t = t instanceof S ? t[0] : t),
                S.merge(
                  this,
                  S.parseHTML(
                    i[1],
                    t && t.nodeType ? t.ownerDocument || t : z,
                    !0,
                  ),
                ),
                V.test(i[1]) && S.isPlainObject(t))
              )
                for (var i in t)
                  S.isFunction(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
            } else
              ((n = z.getElementById(i[2])) &&
                n.parentNode &&
                ((this.length = 1), (this[0] = n)),
                (this.context = z),
                (this.selector = e));
          }
          return this;
        }).prototype = S.fn),
        (J = S(z)),
        /^(?:parents|prev(?:Until|All))/),
      ee = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0,
      };
    function te(e, t) {
      for (; (e = e[t]) && 1 !== e.nodeType; );
      return e;
    }
    (S.fn.extend({
      has: function (e) {
        var t = S(e, this),
          n = t.length;
        return this.filter(function () {
          for (var e = 0; e < n; e++) if (S.contains(this, t[e])) return !0;
        });
      },
      closest: function (e, t) {
        for (
          var n,
            i = 0,
            o = this.length,
            r = [],
            s = G.test(e) || "string" != typeof e ? S(e, t || this.context) : 0;
          i < o;
          i++
        )
          for (n = this[i]; n && n !== t; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (s
                ? -1 < s.index(n)
                : 1 === n.nodeType && S.find.matchesSelector(n, e))
            ) {
              r.push(n);
              break;
            }
        return this.pushStack(1 < r.length ? S.uniqueSort(r) : r);
      },
      index: function (e) {
        return e
          ? "string" == typeof e
            ? o.call(S(e), this[0])
            : o.call(this, e.jquery ? e[0] : e)
          : this[0] && this[0].parentNode
            ? this.first().prevAll().length
            : -1;
      },
      add: function (e, t) {
        return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
      },
      addBack: function (e) {
        return this.add(
          null == e ? this.prevObject : this.prevObject.filter(e),
        );
      },
    }),
      S.each(
        {
          parent: function (e) {
            e = e.parentNode;
            return e && 11 !== e.nodeType ? e : null;
          },
          parents: function (e) {
            return i(e, "parentNode");
          },
          parentsUntil: function (e, t, n) {
            return i(e, "parentNode", n);
          },
          next: function (e) {
            return te(e, "nextSibling");
          },
          prev: function (e) {
            return te(e, "previousSibling");
          },
          nextAll: function (e) {
            return i(e, "nextSibling");
          },
          prevAll: function (e) {
            return i(e, "previousSibling");
          },
          nextUntil: function (e, t, n) {
            return i(e, "nextSibling", n);
          },
          prevUntil: function (e, t, n) {
            return i(e, "previousSibling", n);
          },
          siblings: function (e) {
            return Z((e.parentNode || {}).firstChild, e);
          },
          children: function (e) {
            return Z(e.firstChild);
          },
          contents: function (e) {
            return e.contentDocument || S.merge([], e.childNodes);
          },
        },
        function (i, o) {
          S.fn[i] = function (e, t) {
            var n = S.map(this, o, e);
            return (
              (t = "Until" !== i.slice(-5) ? e : t) &&
                "string" == typeof t &&
                (n = S.filter(t, n)),
              1 < this.length &&
                (ee[i] || S.uniqueSort(n), Q.test(i)) &&
                n.reverse(),
              this.pushStack(n)
            );
          };
        },
      ));
    var ne,
      x = /\S+/g;
    function ie() {
      (z.removeEventListener("DOMContentLoaded", ie),
        C.removeEventListener("load", ie),
        S.ready());
    }
    ((S.Callbacks = function (i) {
      var e, n;
      i =
        "string" == typeof i
          ? ((e = i),
            (n = {}),
            S.each(e.match(x) || [], function (e, t) {
              n[t] = !0;
            }),
            n)
          : S.extend({}, i);
      function o() {
        for (a = i.once, s = r = !0; c.length; u = -1)
          for (t = c.shift(); ++u < l.length; )
            !1 === l[u].apply(t[0], t[1]) &&
              i.stopOnFalse &&
              ((u = l.length), (t = !1));
        (i.memory || (t = !1), (r = !1), a && (l = t ? [] : ""));
      }
      var r,
        t,
        s,
        a,
        l = [],
        c = [],
        u = -1,
        d = {
          add: function () {
            return (
              l &&
                (t && !r && ((u = l.length - 1), c.push(t)),
                (function n(e) {
                  S.each(e, function (e, t) {
                    S.isFunction(t)
                      ? (i.unique && d.has(t)) || l.push(t)
                      : t && t.length && "string" !== S.type(t) && n(t);
                  });
                })(arguments),
                t) &&
                !r &&
                o(),
              this
            );
          },
          remove: function () {
            return (
              S.each(arguments, function (e, t) {
                for (var n; -1 < (n = S.inArray(t, l, n)); )
                  (l.splice(n, 1), n <= u && u--);
              }),
              this
            );
          },
          has: function (e) {
            return e ? -1 < S.inArray(e, l) : 0 < l.length;
          },
          empty: function () {
            return ((l = l && []), this);
          },
          disable: function () {
            return ((a = c = []), (l = t = ""), this);
          },
          disabled: function () {
            return !l;
          },
          lock: function () {
            return ((a = c = []), t || (l = t = ""), this);
          },
          locked: function () {
            return !!a;
          },
          fireWith: function (e, t) {
            return (
              a ||
                ((t = [e, (t = t || []).slice ? t.slice() : t]),
                c.push(t),
                r) ||
                o(),
              this
            );
          },
          fire: function () {
            return (d.fireWith(this, arguments), this);
          },
          fired: function () {
            return !!s;
          },
        };
      return d;
    }),
      S.extend({
        Deferred: function (e) {
          var r = [
              ["resolve", "done", S.Callbacks("once memory"), "resolved"],
              ["reject", "fail", S.Callbacks("once memory"), "rejected"],
              ["notify", "progress", S.Callbacks("memory")],
            ],
            o = "pending",
            s = {
              state: function () {
                return o;
              },
              always: function () {
                return (a.done(arguments).fail(arguments), this);
              },
              then: function () {
                var o = arguments;
                return S.Deferred(function (i) {
                  (S.each(r, function (e, t) {
                    var n = S.isFunction(o[e]) && o[e];
                    a[t[1]](function () {
                      var e = n && n.apply(this, arguments);
                      e && S.isFunction(e.promise)
                        ? e
                            .promise()
                            .progress(i.notify)
                            .done(i.resolve)
                            .fail(i.reject)
                        : i[t[0] + "With"](
                            this === s ? i.promise() : this,
                            n ? [e] : arguments,
                          );
                    });
                  }),
                    (o = null));
                }).promise();
              },
              promise: function (e) {
                return null != e ? S.extend(e, s) : s;
              },
            },
            a = {};
          return (
            (s.pipe = s.then),
            S.each(r, function (e, t) {
              var n = t[2],
                i = t[3];
              ((s[t[1]] = n.add),
                i &&
                  n.add(
                    function () {
                      o = i;
                    },
                    r[1 ^ e][2].disable,
                    r[2][2].lock,
                  ),
                (a[t[0]] = function () {
                  return (
                    a[t[0] + "With"](this === a ? s : this, arguments),
                    this
                  );
                }),
                (a[t[0] + "With"] = n.fireWith));
            }),
            s.promise(a),
            e && e.call(a, a),
            a
          );
        },
        when: function (e) {
          function t(t, n, i) {
            return function (e) {
              ((n[t] = this),
                (i[t] = 1 < arguments.length ? u.call(arguments) : e),
                i === o ? c.notifyWith(n, i) : --l || c.resolveWith(n, i));
            };
          }
          var o,
            n,
            i,
            r = 0,
            s = u.call(arguments),
            a = s.length,
            l = 1 !== a || (e && S.isFunction(e.promise)) ? a : 0,
            c = 1 === l ? e : S.Deferred();
          if (1 < a)
            for (
              o = new Array(a), n = new Array(a), i = new Array(a);
              r < a;
              r++
            )
              s[r] && S.isFunction(s[r].promise)
                ? s[r]
                    .promise()
                    .progress(t(r, n, o))
                    .done(t(r, i, s))
                    .fail(c.reject)
                : --l;
          return (l || c.resolveWith(i, s), c.promise());
        },
      }),
      (S.fn.ready = function (e) {
        return (S.ready.promise().done(e), this);
      }),
      S.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function (e) {
          e ? S.readyWait++ : S.ready(!0);
        },
        ready: function (e) {
          (!0 === e ? --S.readyWait : S.isReady) ||
            ((S.isReady = !0) !== e && 0 < --S.readyWait) ||
            (ne.resolveWith(z, [S]),
            S.fn.triggerHandler &&
              (S(z).triggerHandler("ready"), S(z).off("ready")));
        },
      }),
      (S.ready.promise = function (e) {
        return (
          ne ||
            ((ne = S.Deferred()),
            "complete" === z.readyState ||
            ("loading" !== z.readyState && !z.documentElement.doScroll)
              ? C.setTimeout(S.ready)
              : (z.addEventListener("DOMContentLoaded", ie),
                C.addEventListener("load", ie))),
          ne.promise(e)
        );
      }),
      S.ready.promise());
    function d(e, t, n, i, o, r, s) {
      var a = 0,
        l = e.length,
        c = null == n;
      if ("object" === S.type(n))
        for (a in ((o = !0), n)) d(e, t, a, n[a], !0, r, s);
      else if (
        void 0 !== i &&
        ((o = !0),
        S.isFunction(i) || (s = !0),
        (t = c
          ? s
            ? (t.call(e, i), null)
            : ((c = t),
              function (e, t, n) {
                return c.call(S(e), n);
              })
          : t))
      )
        for (; a < l; a++) t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
      return o ? e : c ? t.call(e) : l ? t(e[0], n) : r;
    }
    function m(e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    }
    function t() {
      this.expando = S.expando + t.uid++;
    }
    ((t.uid = 1),
      (t.prototype = {
        register: function (e, t) {
          t = t || {};
          return (
            e.nodeType
              ? (e[this.expando] = t)
              : Object.defineProperty(e, this.expando, {
                  value: t,
                  writable: !0,
                  configurable: !0,
                }),
            e[this.expando]
          );
        },
        cache: function (e) {
          var t;
          return m(e)
            ? ((t = e[this.expando]) ||
                ((t = {}),
                m(e) &&
                  (e.nodeType
                    ? (e[this.expando] = t)
                    : Object.defineProperty(e, this.expando, {
                        value: t,
                        configurable: !0,
                      }))),
              t)
            : {};
        },
        set: function (e, t, n) {
          var i,
            o = this.cache(e);
          if ("string" == typeof t) o[t] = n;
          else for (i in t) o[i] = t[i];
          return o;
        },
        get: function (e, t) {
          return void 0 === t
            ? this.cache(e)
            : e[this.expando] && e[this.expando][t];
        },
        access: function (e, t, n) {
          var i;
          return void 0 === t || (t && "string" == typeof t && void 0 === n)
            ? void 0 !== (i = this.get(e, t))
              ? i
              : this.get(e, S.camelCase(t))
            : (this.set(e, t, n), void 0 !== n ? n : t);
        },
        remove: function (e, t) {
          var n,
            i,
            o,
            r = e[this.expando];
          if (void 0 !== r) {
            if (void 0 === t) this.register(e);
            else {
              n = (i = S.isArray(t)
                ? t.concat(t.map(S.camelCase))
                : ((o = S.camelCase(t)),
                  t in r ? [t, o] : (i = o) in r ? [i] : i.match(x) || []))
                .length;
              for (; n--; ) delete r[i[n]];
            }
            (void 0 !== t && !S.isEmptyObject(r)) ||
              (e.nodeType
                ? (e[this.expando] = void 0)
                : delete e[this.expando]);
          }
        },
        hasData: function (e) {
          e = e[this.expando];
          return void 0 !== e && !S.isEmptyObject(e);
        },
      }));
    var v = new t(),
      l = new t(),
      oe = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      re = /[A-Z]/g;
    function se(e, t, n) {
      var i;
      if (void 0 === n && 1 === e.nodeType)
        if (
          ((i = "data-" + t.replace(re, "-$&").toLowerCase()),
          "string" == typeof (n = e.getAttribute(i)))
        ) {
          try {
            n =
              "true" === n ||
              ("false" !== n &&
                ("null" === n
                  ? null
                  : +n + "" === n
                    ? +n
                    : oe.test(n)
                      ? S.parseJSON(n)
                      : n));
          } catch (e) {}
          l.set(e, t, n);
        } else n = void 0;
      return n;
    }
    (S.extend({
      hasData: function (e) {
        return l.hasData(e) || v.hasData(e);
      },
      data: function (e, t, n) {
        return l.access(e, t, n);
      },
      removeData: function (e, t) {
        l.remove(e, t);
      },
      _data: function (e, t, n) {
        return v.access(e, t, n);
      },
      _removeData: function (e, t) {
        v.remove(e, t);
      },
    }),
      S.fn.extend({
        data: function (i, e) {
          var t,
            n,
            o,
            r = this[0],
            s = r && r.attributes;
          if (void 0 !== i)
            return "object" == typeof i
              ? this.each(function () {
                  l.set(this, i);
                })
              : d(
                  this,
                  function (t) {
                    var e, n;
                    if (r && void 0 === t)
                      return void 0 !==
                        (e =
                          l.get(r, i) ||
                          l.get(r, i.replace(re, "-$&").toLowerCase())) ||
                        ((n = S.camelCase(i)), void 0 !== (e = l.get(r, n))) ||
                        void 0 !== (e = se(r, n, void 0))
                        ? e
                        : void 0;
                    ((n = S.camelCase(i)),
                      this.each(function () {
                        var e = l.get(this, n);
                        (l.set(this, n, t),
                          -1 < i.indexOf("-") &&
                            void 0 !== e &&
                            l.set(this, i, t));
                      }));
                  },
                  null,
                  e,
                  1 < arguments.length,
                  null,
                  !0,
                );
          if (
            this.length &&
            ((o = l.get(r)), 1 === r.nodeType) &&
            !v.get(r, "hasDataAttrs")
          ) {
            for (t = s.length; t--; )
              s[t] &&
                0 === (n = s[t].name).indexOf("data-") &&
                ((n = S.camelCase(n.slice(5))), se(r, n, o[n]));
            v.set(r, "hasDataAttrs", !0);
          }
          return o;
        },
        removeData: function (e) {
          return this.each(function () {
            l.remove(this, e);
          });
        },
      }),
      S.extend({
        queue: function (e, t, n) {
          var i;
          return e
            ? ((i = v.get(e, (t = (t || "fx") + "queue"))),
              n &&
                (!i || S.isArray(n)
                  ? (i = v.access(e, t, S.makeArray(n)))
                  : i.push(n)),
              i || [])
            : void 0;
        },
        dequeue: function (e, t) {
          t = t || "fx";
          var n = S.queue(e, t),
            i = n.length,
            o = n.shift(),
            r = S._queueHooks(e, t);
          ("inprogress" === o && ((o = n.shift()), i--),
            o &&
              ("fx" === t && n.unshift("inprogress"),
              delete r.stop,
              o.call(
                e,
                function () {
                  S.dequeue(e, t);
                },
                r,
              )),
            !i && r && r.empty.fire());
        },
        _queueHooks: function (e, t) {
          var n = t + "queueHooks";
          return (
            v.get(e, n) ||
            v.access(e, n, {
              empty: S.Callbacks("once memory").add(function () {
                v.remove(e, [t + "queue", n]);
              }),
            })
          );
        },
      }),
      S.fn.extend({
        queue: function (t, n) {
          var e = 2;
          return (
            "string" != typeof t && ((n = t), (t = "fx"), e--),
            arguments.length < e
              ? S.queue(this[0], t)
              : void 0 === n
                ? this
                : this.each(function () {
                    var e = S.queue(this, t, n);
                    (S._queueHooks(this, t),
                      "fx" === t &&
                        "inprogress" !== e[0] &&
                        S.dequeue(this, t));
                  })
          );
        },
        dequeue: function (e) {
          return this.each(function () {
            S.dequeue(this, e);
          });
        },
        clearQueue: function (e) {
          return this.queue(e || "fx", []);
        },
        promise: function (e, t) {
          function n() {
            --o || r.resolveWith(s, [s]);
          }
          var i,
            o = 1,
            r = S.Deferred(),
            s = this,
            a = this.length;
          for (
            "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
            a--;
          )
            (i = v.get(s[a], e + "queueHooks")) &&
              i.empty &&
              (o++, i.empty.add(n));
          return (n(), r.promise(t));
        },
      }));
    function y(e, t) {
      return (
        "none" === S.css((e = t || e), "display") ||
        !S.contains(e.ownerDocument, e)
      );
    }
    var e = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      h = new RegExp("^(?:([+-])=|)(" + e + ")([a-z%]*)$", "i"),
      a = ["Top", "Right", "Bottom", "Left"];
    function ae(e, t, n, i) {
      var o,
        r = 1,
        s = 20,
        a = i
          ? function () {
              return i.cur();
            }
          : function () {
              return S.css(e, t, "");
            },
        l = a(),
        c = (n && n[3]) || (S.cssNumber[t] ? "" : "px"),
        u = (S.cssNumber[t] || ("px" !== c && +l)) && h.exec(S.css(e, t));
      if (u && u[3] !== c)
        for (
          c = c || u[3], n = n || [], u = +l || 1;
          S.style(e, t, (u /= r = r || ".5") + c),
            r !== (r = a() / l) && 1 !== r && --s;
        );
      return (
        n &&
          ((u = +u || +l || 0),
          (o = n[1] ? u + (n[1] + 1) * n[2] : +n[2]),
          i) &&
          ((i.unit = c), (i.start = u), (i.end = o)),
        o
      );
    }
    var le = /^(?:checkbox|radio)$/i,
      ce = /<([\w:-]+)/,
      ue = /^$|\/(?:java|ecma)script/i,
      b = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""],
      };
    function w(e, t) {
      var n =
        void 0 !== e.getElementsByTagName
          ? e.getElementsByTagName(t || "*")
          : void 0 !== e.querySelectorAll
            ? e.querySelectorAll(t || "*")
            : [];
      return void 0 === t || (t && S.nodeName(e, t)) ? S.merge([e], n) : n;
    }
    function de(e, t) {
      for (var n = 0, i = e.length; n < i; n++)
        v.set(e[n], "globalEval", !t || v.get(t[n], "globalEval"));
    }
    ((b.optgroup = b.option),
      (b.tbody = b.tfoot = b.colgroup = b.caption = b.thead),
      (b.th = b.td));
    var he = /<|&#?\w+;/;
    function pe(e, t, n, i, o) {
      for (
        var r,
          s,
          a,
          l,
          c,
          u = t.createDocumentFragment(),
          d = [],
          h = 0,
          p = e.length;
        h < p;
        h++
      )
        if ((r = e[h]) || 0 === r)
          if ("object" === S.type(r)) S.merge(d, r.nodeType ? [r] : r);
          else if (he.test(r)) {
            for (
              s = s || u.appendChild(t.createElement("div")),
                a = (ce.exec(r) || ["", ""])[1].toLowerCase(),
                a = b[a] || b._default,
                s.innerHTML = a[1] + S.htmlPrefilter(r) + a[2],
                c = a[0];
              c--;
            )
              s = s.lastChild;
            (S.merge(d, s.childNodes), ((s = u.firstChild).textContent = ""));
          } else d.push(t.createTextNode(r));
      for (u.textContent = "", h = 0; (r = d[h++]); )
        if (i && -1 < S.inArray(r, i)) o && o.push(r);
        else if (
          ((l = S.contains(r.ownerDocument, r)),
          (s = w(u.appendChild(r), "script")),
          l && de(s),
          n)
        )
          for (c = 0; (r = s[c++]); ) ue.test(r.type || "") && n.push(r);
      return u;
    }
    ((L = z.createDocumentFragment().appendChild(z.createElement("div"))),
      (T = z.createElement("input")).setAttribute("type", "radio"),
      T.setAttribute("checked", "checked"),
      T.setAttribute("name", "t"),
      L.appendChild(T),
      (g.checkClone = L.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (L.innerHTML = "<textarea>x</textarea>"),
      (g.noCloneChecked = !!L.cloneNode(!0).lastChild.defaultValue));
    var fe = /^key/,
      ge = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      me = /^([^.]*)(?:\.(.+)|)/;
    function ve() {
      return !0;
    }
    function c() {
      return !1;
    }
    function ye() {
      try {
        return z.activeElement;
      } catch (e) {}
    }
    function be(e, t, n, i, o, r) {
      var s, a;
      if ("object" == typeof t) {
        for (a in ("string" != typeof n && ((i = i || n), (n = void 0)), t))
          be(e, a, n, i, t[a], r);
        return e;
      }
      if (
        (null == i && null == o
          ? ((o = n), (i = n = void 0))
          : null == o &&
            ("string" == typeof n
              ? ((o = i), (i = void 0))
              : ((o = i), (i = n), (n = void 0))),
        !1 === o)
      )
        o = c;
      else if (!o) return e;
      return (
        1 === r &&
          ((s = o),
          ((o = function (e) {
            return (S().off(e), s.apply(this, arguments));
          }).guid = s.guid || (s.guid = S.guid++))),
        e.each(function () {
          S.event.add(this, t, o, i, n);
        })
      );
    }
    ((S.event = {
      global: {},
      add: function (t, e, n, i, o) {
        var r,
          s,
          a,
          l,
          c,
          u,
          d,
          h,
          p,
          f = v.get(t);
        if (f)
          for (
            n.handler && ((n = (r = n).handler), (o = r.selector)),
              n.guid || (n.guid = S.guid++),
              a = (a = f.events) || (f.events = {}),
              s =
                (s = f.handle) ||
                (f.handle = function (e) {
                  return void 0 !== S && S.event.triggered !== e.type
                    ? S.event.dispatch.apply(t, arguments)
                    : void 0;
                }),
              l = (e = (e || "").match(x) || [""]).length;
            l--;
          )
            ((d = p = (h = me.exec(e[l]) || [])[1]),
              (h = (h[2] || "").split(".").sort()),
              d &&
                ((c = S.event.special[d] || {}),
                (d = (o ? c.delegateType : c.bindType) || d),
                (c = S.event.special[d] || {}),
                (p = S.extend(
                  {
                    type: d,
                    origType: p,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: o,
                    needsContext: o && S.expr.match.needsContext.test(o),
                    namespace: h.join("."),
                  },
                  r,
                )),
                (u = a[d]) ||
                  (((u = a[d] = []).delegateCount = 0),
                  c.setup && !1 !== c.setup.call(t, i, h, s)) ||
                  (t.addEventListener && t.addEventListener(d, s)),
                c.add &&
                  (c.add.call(t, p),
                  p.handler.guid || (p.handler.guid = n.guid)),
                o ? u.splice(u.delegateCount++, 0, p) : u.push(p),
                (S.event.global[d] = !0)));
      },
      remove: function (e, t, n, i, o) {
        var r,
          s,
          a,
          l,
          c,
          u,
          d,
          h,
          p,
          f,
          g,
          m = v.hasData(e) && v.get(e);
        if (m && (l = m.events)) {
          for (c = (t = (t || "").match(x) || [""]).length; c--; )
            if (
              ((p = g = (a = me.exec(t[c]) || [])[1]),
              (f = (a[2] || "").split(".").sort()),
              p)
            ) {
              for (
                d = S.event.special[p] || {},
                  h = l[(p = (i ? d.delegateType : d.bindType) || p)] || [],
                  a =
                    a[2] &&
                    new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                  s = r = h.length;
                r--;
              )
                ((u = h[r]),
                  (!o && g !== u.origType) ||
                    (n && n.guid !== u.guid) ||
                    (a && !a.test(u.namespace)) ||
                    (i && i !== u.selector && ("**" !== i || !u.selector)) ||
                    (h.splice(r, 1),
                    u.selector && h.delegateCount--,
                    d.remove && d.remove.call(e, u)));
              s &&
                !h.length &&
                ((d.teardown && !1 !== d.teardown.call(e, f, m.handle)) ||
                  S.removeEvent(e, p, m.handle),
                delete l[p]);
            } else for (p in l) S.event.remove(e, p + t[c], n, i, !0);
          S.isEmptyObject(l) && v.remove(e, "handle events");
        }
      },
      dispatch: function (e) {
        e = S.event.fix(e);
        var t,
          n,
          i,
          o,
          r,
          s = u.call(arguments),
          a = (v.get(this, "events") || {})[e.type] || [],
          l = S.event.special[e.type] || {};
        if (
          (((s[0] = e).delegateTarget = this),
          !l.preDispatch || !1 !== l.preDispatch.call(this, e))
        ) {
          for (
            r = S.event.handlers.call(this, e, a), t = 0;
            (i = r[t++]) && !e.isPropagationStopped();
          )
            for (
              e.currentTarget = i.elem, n = 0;
              (o = i.handlers[n++]) && !e.isImmediatePropagationStopped();
            )
              (e.rnamespace && !e.rnamespace.test(o.namespace)) ||
                ((e.handleObj = o),
                (e.data = o.data),
                void 0 !==
                  (o = (
                    (S.event.special[o.origType] || {}).handle || o.handler
                  ).apply(i.elem, s)) &&
                  !1 === (e.result = o) &&
                  (e.preventDefault(), e.stopPropagation()));
          return (l.postDispatch && l.postDispatch.call(this, e), e.result);
        }
      },
      handlers: function (e, t) {
        var n,
          i,
          o,
          r,
          s = [],
          a = t.delegateCount,
          l = e.target;
        if (
          a &&
          l.nodeType &&
          ("click" !== e.type || isNaN(e.button) || e.button < 1)
        )
          for (; l !== this; l = l.parentNode || this)
            if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
              for (i = [], n = 0; n < a; n++)
                (void 0 === i[(o = (r = t[n]).selector + " ")] &&
                  (i[o] = r.needsContext
                    ? -1 < S(o, this).index(l)
                    : S.find(o, this, null, [l]).length),
                  i[o] && i.push(r));
              i.length &&
                s.push({
                  elem: l,
                  handlers: i,
                });
            }
        return (
          a < t.length &&
            s.push({
              elem: this,
              handlers: t.slice(a),
            }),
          s
        );
      },
      props:
        "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
          " ",
        ),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function (e, t) {
          return (
            null == e.which &&
              (e.which = null != t.charCode ? t.charCode : t.keyCode),
            e
          );
        },
      },
      mouseHooks: {
        props:
          "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(
            " ",
          ),
        filter: function (e, t) {
          var n,
            i,
            o = t.button;
          return (
            null == e.pageX &&
              null != t.clientX &&
              ((n = (i = e.target.ownerDocument || z).documentElement),
              (i = i.body),
              (e.pageX =
                t.clientX +
                ((n && n.scrollLeft) || (i && i.scrollLeft) || 0) -
                ((n && n.clientLeft) || (i && i.clientLeft) || 0)),
              (e.pageY =
                t.clientY +
                ((n && n.scrollTop) || (i && i.scrollTop) || 0) -
                ((n && n.clientTop) || (i && i.clientTop) || 0))),
            e.which ||
              void 0 === o ||
              (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
            e
          );
        },
      },
      fix: function (e) {
        if (e[S.expando]) return e;
        var t,
          n,
          i,
          o = e.type,
          r = e,
          s = this.fixHooks[o];
        for (
          s ||
            (this.fixHooks[o] = s =
              ge.test(o) ? this.mouseHooks : fe.test(o) ? this.keyHooks : {}),
            i = s.props ? this.props.concat(s.props) : this.props,
            e = new S.Event(r),
            t = i.length;
          t--;
        )
          e[(n = i[t])] = r[n];
        return (
          e.target || (e.target = z),
          3 === e.target.nodeType && (e.target = e.target.parentNode),
          s.filter ? s.filter(e, r) : e
        );
      },
      special: {
        load: {
          noBubble: !0,
        },
        focus: {
          trigger: function () {
            return this !== ye() && this.focus ? (this.focus(), !1) : void 0;
          },
          delegateType: "focusin",
        },
        blur: {
          trigger: function () {
            return this === ye() && this.blur ? (this.blur(), !1) : void 0;
          },
          delegateType: "focusout",
        },
        click: {
          trigger: function () {
            return "checkbox" === this.type &&
              this.click &&
              S.nodeName(this, "input")
              ? (this.click(), !1)
              : void 0;
          },
          _default: function (e) {
            return S.nodeName(e.target, "a");
          },
        },
        beforeunload: {
          postDispatch: function (e) {
            void 0 !== e.result &&
              e.originalEvent &&
              (e.originalEvent.returnValue = e.result);
          },
        },
      },
    }),
      (S.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n);
      }),
      (S.Event = function (e, t) {
        return this instanceof S.Event
          ? (e && e.type
              ? ((this.originalEvent = e),
                (this.type = e.type),
                (this.isDefaultPrevented =
                  e.defaultPrevented ||
                  (void 0 === e.defaultPrevented && !1 === e.returnValue)
                    ? ve
                    : c))
              : (this.type = e),
            t && S.extend(this, t),
            (this.timeStamp = (e && e.timeStamp) || S.now()),
            void (this[S.expando] = !0))
          : new S.Event(e, t);
      }),
      (S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: c,
        isPropagationStopped: c,
        isImmediatePropagationStopped: c,
        isSimulated: !1,
        preventDefault: function () {
          var e = this.originalEvent;
          ((this.isDefaultPrevented = ve),
            e && !this.isSimulated && e.preventDefault());
        },
        stopPropagation: function () {
          var e = this.originalEvent;
          ((this.isPropagationStopped = ve),
            e && !this.isSimulated && e.stopPropagation());
        },
        stopImmediatePropagation: function () {
          var e = this.originalEvent;
          ((this.isImmediatePropagationStopped = ve),
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation());
        },
      }),
      S.each(
        {
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout",
        },
        function (e, o) {
          S.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function (e) {
              var t,
                n = e.relatedTarget,
                i = e.handleObj;
              return (
                (n && (n === this || S.contains(this, n))) ||
                  ((e.type = i.origType),
                  (t = i.handler.apply(this, arguments)),
                  (e.type = o)),
                t
              );
            },
          };
        },
      ),
      S.fn.extend({
        on: function (e, t, n, i) {
          return be(this, e, t, n, i);
        },
        one: function (e, t, n, i) {
          return be(this, e, t, n, i, 1);
        },
        off: function (e, t, n) {
          var i, o;
          if (e && e.preventDefault && e.handleObj)
            ((i = e.handleObj),
              S(e.delegateTarget).off(
                i.namespace ? i.origType + "." + i.namespace : i.origType,
                i.selector,
                i.handler,
              ));
          else {
            if ("object" != typeof e)
              return (
                (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
                !1 === n && (n = c),
                this.each(function () {
                  S.event.remove(this, e, n, t);
                })
              );
            for (o in e) this.off(o, t, e[o]);
          }
          return this;
        },
      }));
    var we =
        /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
      Ce = /<script|<style|<link/i,
      ze = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Se = /^true\/(.*)/,
      xe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function ke(e, t) {
      return S.nodeName(e, "table") &&
        S.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr")
        ? e.getElementsByTagName("tbody")[0] ||
            e.appendChild(e.ownerDocument.createElement("tbody"))
        : e;
    }
    function _e(e) {
      return ((e.type = (null !== e.getAttribute("type")) + "/" + e.type), e);
    }
    function $e(e) {
      var t = Se.exec(e.type);
      return (t ? (e.type = t[1]) : e.removeAttribute("type"), e);
    }
    function Me(e, t) {
      var n, i, o, r, s, a;
      if (1 === t.nodeType) {
        if (
          v.hasData(e) &&
          ((r = v.access(e)), (s = v.set(t, r)), (a = r.events))
        )
          for (o in (delete s.handle, (s.events = {}), a))
            for (n = 0, i = a[o].length; n < i; n++) S.event.add(t, o, a[o][n]);
        l.hasData(e) && ((r = l.access(e)), (s = S.extend({}, r)), l.set(t, s));
      }
    }
    function k(n, i, o, r) {
      i = O.apply([], i);
      var e,
        t,
        s,
        a,
        l,
        c,
        u = 0,
        d = n.length,
        h = d - 1,
        p = i[0],
        f = S.isFunction(p);
      if (f || (1 < d && "string" == typeof p && !g.checkClone && ze.test(p)))
        return n.each(function (e) {
          var t = n.eq(e);
          (f && (i[0] = p.call(this, e, t.html())), k(t, i, o, r));
        });
      if (
        d &&
        ((t = (e = pe(i, n[0].ownerDocument, !1, n, r)).firstChild),
        1 === e.childNodes.length && (e = t),
        t || r)
      ) {
        for (a = (s = S.map(w(e, "script"), _e)).length; u < d; u++)
          ((l = e),
            u !== h &&
              ((l = S.clone(l, !0, !0)), a) &&
              S.merge(s, w(l, "script")),
            o.call(n[u], l, u));
        if (a)
          for (
            c = s[s.length - 1].ownerDocument, S.map(s, $e), u = 0;
            u < a;
            u++
          )
            ((l = s[u]),
              ue.test(l.type || "") &&
                !v.access(l, "globalEval") &&
                S.contains(c, l) &&
                (l.src
                  ? S._evalUrl && S._evalUrl(l.src)
                  : S.globalEval(l.textContent.replace(xe, ""))));
      }
      return n;
    }
    function Te(e, t, n) {
      for (var i, o = t ? S.filter(t, e) : e, r = 0; null != (i = o[r]); r++)
        (n || 1 !== i.nodeType || S.cleanData(w(i)),
          i.parentNode &&
            (n && S.contains(i.ownerDocument, i) && de(w(i, "script")),
            i.parentNode.removeChild(i)));
      return e;
    }
    (S.extend({
      htmlPrefilter: function (e) {
        return e.replace(we, "<$1></$2>");
      },
      clone: function (e, t, n) {
        var i,
          o,
          r,
          s,
          a,
          l,
          c,
          u = e.cloneNode(!0),
          d = S.contains(e.ownerDocument, e);
        if (
          !(
            g.noCloneChecked ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            S.isXMLDoc(e)
          )
        )
          for (s = w(u), i = 0, o = (r = w(e)).length; i < o; i++)
            ((a = r[i]),
              (l = s[i]),
              (c = void 0),
              "input" === (c = l.nodeName.toLowerCase()) && le.test(a.type)
                ? (l.checked = a.checked)
                : ("input" !== c && "textarea" !== c) ||
                  (l.defaultValue = a.defaultValue));
        if (t)
          if (n)
            for (r = r || w(e), s = s || w(u), i = 0, o = r.length; i < o; i++)
              Me(r[i], s[i]);
          else Me(e, u);
        return (
          0 < (s = w(u, "script")).length && de(s, !d && w(e, "script")),
          u
        );
      },
      cleanData: function (e) {
        for (
          var t, n, i, o = S.event.special, r = 0;
          void 0 !== (n = e[r]);
          r++
        )
          if (m(n)) {
            if ((t = n[v.expando])) {
              if (t.events)
                for (i in t.events)
                  o[i] ? S.event.remove(n, i) : S.removeEvent(n, i, t.handle);
              n[v.expando] = void 0;
            }
            n[l.expando] && (n[l.expando] = void 0);
          }
      },
    }),
      S.fn.extend({
        domManip: k,
        detach: function (e) {
          return Te(this, e, !0);
        },
        remove: function (e) {
          return Te(this, e);
        },
        text: function (e) {
          return d(
            this,
            function (e) {
              return void 0 === e
                ? S.text(this)
                : this.empty().each(function () {
                    (1 !== this.nodeType &&
                      11 !== this.nodeType &&
                      9 !== this.nodeType) ||
                      (this.textContent = e);
                  });
            },
            null,
            e,
            arguments.length,
          );
        },
        append: function () {
          return k(this, arguments, function (e) {
            (1 !== this.nodeType &&
              11 !== this.nodeType &&
              9 !== this.nodeType) ||
              ke(this, e).appendChild(e);
          });
        },
        prepend: function () {
          return k(this, arguments, function (e) {
            var t;
            (1 !== this.nodeType &&
              11 !== this.nodeType &&
              9 !== this.nodeType) ||
              (t = ke(this, e)).insertBefore(e, t.firstChild);
          });
        },
        before: function () {
          return k(this, arguments, function (e) {
            this.parentNode && this.parentNode.insertBefore(e, this);
          });
        },
        after: function () {
          return k(this, arguments, function (e) {
            this.parentNode &&
              this.parentNode.insertBefore(e, this.nextSibling);
          });
        },
        empty: function () {
          for (var e, t = 0; null != (e = this[t]); t++)
            1 === e.nodeType && (S.cleanData(w(e, !1)), (e.textContent = ""));
          return this;
        },
        clone: function (e, t) {
          return (
            (e = null != e && e),
            (t = null == t ? e : t),
            this.map(function () {
              return S.clone(this, e, t);
            })
          );
        },
        html: function (e) {
          return d(
            this,
            function (e) {
              var t = this[0] || {},
                n = 0,
                i = this.length;
              if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
              if (
                "string" == typeof e &&
                !Ce.test(e) &&
                !b[(ce.exec(e) || ["", ""])[1].toLowerCase()]
              ) {
                e = S.htmlPrefilter(e);
                try {
                  for (; n < i; n++)
                    1 === (t = this[n] || {}).nodeType &&
                      (S.cleanData(w(t, !1)), (t.innerHTML = e));
                  t = 0;
                } catch (e) {}
              }
              t && this.empty().append(e);
            },
            null,
            e,
            arguments.length,
          );
        },
        replaceWith: function () {
          var n = [];
          return k(
            this,
            arguments,
            function (e) {
              var t = this.parentNode;
              S.inArray(this, n) < 0 &&
                (S.cleanData(w(this)), t) &&
                t.replaceChild(e, this);
            },
            n,
          );
        },
      }),
      S.each(
        {
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith",
        },
        function (e, s) {
          S.fn[e] = function (e) {
            for (var t, n = [], i = S(e), o = i.length - 1, r = 0; r <= o; r++)
              ((t = r === o ? this : this.clone(!0)),
                S(i[r])[s](t),
                H.apply(n, t.get()));
            return this.pushStack(n);
          };
        },
      ));
    var Le,
      Ee = {
        HTML: "block",
        BODY: "block",
      };
    function Ae(e, t) {
      ((e = S(t.createElement(e)).appendTo(t.body)),
        (t = S.css(e[0], "display")));
      return (e.detach(), t);
    }
    function qe(e) {
      var t = z,
        n = Ee[e];
      return (
        n ||
          (("none" !== (n = Ae(e, t)) && n) ||
            ((t = (Le = (
              Le || S("<iframe frameborder='0' width='0' height='0'/>")
            ).appendTo(t.documentElement))[0].contentDocument).write(),
            t.close(),
            (n = Ae(e, t)),
            Le.detach()),
          (Ee[e] = n)),
        n
      );
    }
    function De(e) {
      var t = e.ownerDocument.defaultView;
      return (t = t && t.opener ? t : C).getComputedStyle(e);
    }
    function Ne(e, t, n, i) {
      var o,
        r = {};
      for (o in t) ((r[o] = e.style[o]), (e.style[o] = t[o]));
      for (o in ((n = n.apply(e, i || [])), t)) e.style[o] = r[o];
      return n;
    }
    var Ie,
      n,
      Pe,
      Oe,
      r,
      s,
      He = /^margin/,
      je = new RegExp("^(" + e + ")(?!px)[a-z%]+$", "i"),
      p = z.documentElement;
    function Re() {
      ((s.style.cssText =
        "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%"),
        (s.innerHTML = ""),
        p.appendChild(r));
      var e = C.getComputedStyle(s);
      ((Ie = "1%" !== e.top),
        (Oe = "2px" === e.marginLeft),
        (n = "4px" === e.width),
        (s.style.marginRight = "50%"),
        (Pe = "4px" === e.marginRight),
        p.removeChild(r));
    }
    function _(e, t, n) {
      var i,
        o,
        r = e.style;
      return (
        ("" !==
          (o = (n = n || De(e)) ? n.getPropertyValue(t) || n[t] : void 0) &&
          void 0 !== o) ||
          S.contains(e.ownerDocument, e) ||
          (o = S.style(e, t)),
        n &&
          !g.pixelMarginRight() &&
          je.test(o) &&
          He.test(t) &&
          ((e = r.width),
          (t = r.minWidth),
          (i = r.maxWidth),
          (r.minWidth = r.maxWidth = r.width = o),
          (o = n.width),
          (r.width = e),
          (r.minWidth = t),
          (r.maxWidth = i)),
        void 0 !== o ? o + "" : o
      );
    }
    function Be(e, t) {
      return {
        get: function () {
          return e()
            ? void delete this.get
            : (this.get = t).apply(this, arguments);
        },
      };
    }
    ((r = z.createElement("div")),
      (s = z.createElement("div")).style &&
        ((s.style.backgroundClip = "content-box"),
        (s.cloneNode(!0).style.backgroundClip = ""),
        (g.clearCloneStyle = "content-box" === s.style.backgroundClip),
        (r.style.cssText =
          "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute"),
        r.appendChild(s),
        S.extend(g, {
          pixelPosition: function () {
            return (Re(), Ie);
          },
          boxSizingReliable: function () {
            return (null == n && Re(), n);
          },
          pixelMarginRight: function () {
            return (null == n && Re(), Pe);
          },
          reliableMarginLeft: function () {
            return (null == n && Re(), Oe);
          },
          reliableMarginRight: function () {
            var e,
              t = s.appendChild(z.createElement("div"));
            return (
              (t.style.cssText = s.style.cssText =
                "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
              (t.style.marginRight = t.style.width = "0"),
              (s.style.width = "1px"),
              p.appendChild(r),
              (e = !parseFloat(C.getComputedStyle(t).marginRight)),
              p.removeChild(r),
              s.removeChild(t),
              e
            );
          },
        })));
    var Ue = /^(none|table(?!-c[ea]).+)/,
      Fe = {
        position: "absolute",
        visibility: "hidden",
        display: "block",
      },
      We = {
        letterSpacing: "0",
        fontWeight: "400",
      },
      Ze = ["Webkit", "O", "Moz", "ms"],
      Ge = z.createElement("div").style;
    function Ve(e) {
      if (e in Ge) return e;
      for (var t = e[0].toUpperCase() + e.slice(1), n = Ze.length; n--; )
        if ((e = Ze[n] + t) in Ge) return e;
    }
    function Xe(e, t, n) {
      var i = h.exec(t);
      return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t;
    }
    function Ye(e, t, n, i, o) {
      for (
        var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0,
          s = 0;
        r < 4;
        r += 2
      )
        ("margin" === n && (s += S.css(e, n + a[r], !0, o)),
          i
            ? ("content" === n && (s -= S.css(e, "padding" + a[r], !0, o)),
              "margin" !== n &&
                (s -= S.css(e, "border" + a[r] + "Width", !0, o)))
            : ((s += S.css(e, "padding" + a[r], !0, o)),
              "padding" !== n &&
                (s += S.css(e, "border" + a[r] + "Width", !0, o))));
      return s;
    }
    function Je(e, t, n) {
      var i = !0,
        o = "width" === t ? e.offsetWidth : e.offsetHeight,
        r = De(e),
        s = "border-box" === S.css(e, "boxSizing", !1, r);
      if (o <= 0 || null == o) {
        if (
          (((o = _(e, t, r)) < 0 || null == o) && (o = e.style[t]), je.test(o))
        )
          return o;
        ((i = s && (g.boxSizingReliable() || o === e.style[t])),
          (o = parseFloat(o) || 0));
      }
      return o + Ye(e, t, n || (s ? "border" : "content"), i, r) + "px";
    }
    function Ke(e, t) {
      for (var n, i, o, r = [], s = 0, a = e.length; s < a; s++)
        (i = e[s]).style &&
          ((r[s] = v.get(i, "olddisplay")),
          (n = i.style.display),
          t
            ? (r[s] || "none" !== n || (i.style.display = ""),
              "" === i.style.display &&
                y(i) &&
                (r[s] = v.access(i, "olddisplay", qe(i.nodeName))))
            : ((o = y(i)),
              ("none" === n && o) ||
                v.set(i, "olddisplay", o ? n : S.css(i, "display"))));
      for (s = 0; s < a; s++)
        !(i = e[s]).style ||
          (t && "none" !== i.style.display && "" !== i.style.display) ||
          (i.style.display = t ? r[s] || "" : "none");
      return e;
    }
    function $(e, t, n, i, o) {
      return new $.prototype.init(e, t, n, i, o);
    }
    (S.extend({
      cssHooks: {
        opacity: {
          get: function (e, t) {
            if (t) return "" === (t = _(e, "opacity")) ? "1" : t;
          },
        },
      },
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
      },
      cssProps: {
        float: "cssFloat",
      },
      style: function (e, t, n, i) {
        var o, r, s, a, l;
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style)
          return (
            (a = S.camelCase(t)),
            (l = e.style),
            (t = S.cssProps[a] || (S.cssProps[a] = Ve(a) || a)),
            (s = S.cssHooks[t] || S.cssHooks[a]),
            void 0 === n
              ? s && "get" in s && void 0 !== (o = s.get(e, !1, i))
                ? o
                : l[t]
              : ("string" === (r = typeof n) &&
                  (o = h.exec(n)) &&
                  o[1] &&
                  ((n = ae(e, t, o)), (r = "number")),
                void (
                  null != n &&
                  n == n &&
                  ("number" === r &&
                    (n += (o && o[3]) || (S.cssNumber[a] ? "" : "px")),
                  g.clearCloneStyle ||
                    "" !== n ||
                    0 !== t.indexOf("background") ||
                    (l[t] = "inherit"),
                  (s && "set" in s && void 0 === (n = s.set(e, n, i))) ||
                    (l[t] = n))
                ))
          );
      },
      css: function (e, t, n, i) {
        var o,
          r = S.camelCase(t);
        return (
          (t = S.cssProps[r] || (S.cssProps[r] = Ve(r) || r)),
          "normal" ===
            (o =
              void 0 ===
              (o =
                (r = S.cssHooks[t] || S.cssHooks[r]) && "get" in r
                  ? r.get(e, !0, n)
                  : o)
                ? _(e, t, i)
                : o) &&
            t in We &&
            (o = We[t]),
          ("" === n || n) && ((r = parseFloat(o)), !0 === n || isFinite(r))
            ? r || 0
            : o
        );
      },
    }),
      S.each(["height", "width"], function (e, o) {
        S.cssHooks[o] = {
          get: function (e, t, n) {
            return t
              ? Ue.test(S.css(e, "display")) && 0 === e.offsetWidth
                ? Ne(e, Fe, function () {
                    return Je(e, o, n);
                  })
                : Je(e, o, n)
              : void 0;
          },
          set: function (e, t, n) {
            var i = n && De(e),
              n =
                n &&
                Ye(e, o, n, "border-box" === S.css(e, "boxSizing", !1, i), i);
            return (
              n &&
                (i = h.exec(t)) &&
                "px" !== (i[3] || "px") &&
                ((e.style[o] = t), (t = S.css(e, o))),
              Xe(0, t, n)
            );
          },
        };
      }),
      (S.cssHooks.marginLeft = Be(g.reliableMarginLeft, function (e, t) {
        return t
          ? (parseFloat(_(e, "marginLeft")) ||
              e.getBoundingClientRect().left -
                Ne(
                  e,
                  {
                    marginLeft: 0,
                  },
                  function () {
                    return e.getBoundingClientRect().left;
                  },
                )) + "px"
          : void 0;
      })),
      (S.cssHooks.marginRight = Be(g.reliableMarginRight, function (e, t) {
        return t
          ? Ne(
              e,
              {
                display: "inline-block",
              },
              _,
              [e, "marginRight"],
            )
          : void 0;
      })),
      S.each(
        {
          margin: "",
          padding: "",
          border: "Width",
        },
        function (o, r) {
          ((S.cssHooks[o + r] = {
            expand: function (e) {
              for (
                var t = 0,
                  n = {},
                  i = "string" == typeof e ? e.split(" ") : [e];
                t < 4;
                t++
              )
                n[o + a[t] + r] = i[t] || i[t - 2] || i[0];
              return n;
            },
          }),
            He.test(o) || (S.cssHooks[o + r].set = Xe));
        },
      ),
      S.fn.extend({
        css: function (e, t) {
          return d(
            this,
            function (e, t, n) {
              var i,
                o,
                r = {},
                s = 0;
              if (S.isArray(t)) {
                for (i = De(e), o = t.length; s < o; s++)
                  r[t[s]] = S.css(e, t[s], !1, i);
                return r;
              }
              return void 0 !== n ? S.style(e, t, n) : S.css(e, t);
            },
            e,
            t,
            1 < arguments.length,
          );
        },
        show: function () {
          return Ke(this, !0);
        },
        hide: function () {
          return Ke(this);
        },
        toggle: function (e) {
          return "boolean" == typeof e
            ? e
              ? this.show()
              : this.hide()
            : this.each(function () {
                y(this) ? S(this).show() : S(this).hide();
              });
        },
      }),
      (((S.Tween = $).prototype = {
        constructor: $,
        init: function (e, t, n, i, o, r) {
          ((this.elem = e),
            (this.prop = n),
            (this.easing = o || S.easing._default),
            (this.options = t),
            (this.start = this.now = this.cur()),
            (this.end = i),
            (this.unit = r || (S.cssNumber[n] ? "" : "px")));
        },
        cur: function () {
          var e = $.propHooks[this.prop];
          return (e && e.get ? e : $.propHooks._default).get(this);
        },
        run: function (e) {
          var t,
            n = $.propHooks[this.prop];
          return (
            this.options.duration
              ? (this.pos = t =
                  S.easing[this.easing](
                    e,
                    this.options.duration * e,
                    0,
                    1,
                    this.options.duration,
                  ))
              : (this.pos = t = e),
            (this.now = (this.end - this.start) * t + this.start),
            this.options.step &&
              this.options.step.call(this.elem, this.now, this),
            (n && n.set ? n : $.propHooks._default).set(this),
            this
          );
        },
      }).init.prototype = $.prototype),
      (($.propHooks = {
        _default: {
          get: function (e) {
            return 1 !== e.elem.nodeType ||
              (null != e.elem[e.prop] && null == e.elem.style[e.prop])
              ? e.elem[e.prop]
              : (e = S.css(e.elem, e.prop, "")) && "auto" !== e
                ? e
                : 0;
          },
          set: function (e) {
            S.fx.step[e.prop]
              ? S.fx.step[e.prop](e)
              : 1 !== e.elem.nodeType ||
                  (null == e.elem.style[S.cssProps[e.prop]] &&
                    !S.cssHooks[e.prop])
                ? (e.elem[e.prop] = e.now)
                : S.style(e.elem, e.prop, e.now + e.unit);
          },
        },
      }).scrollTop = $.propHooks.scrollLeft =
        {
          set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
          },
        }),
      (S.easing = {
        linear: function (e) {
          return e;
        },
        swing: function (e) {
          return 0.5 - Math.cos(e * Math.PI) / 2;
        },
        _default: "swing",
      }),
      (S.fx = $.prototype.init),
      (S.fx.step = {}));
    var M,
      Qe,
      T,
      L,
      et = /^(?:toggle|show|hide)$/,
      tt = /queueHooks$/;
    function nt() {
      return (
        C.setTimeout(function () {
          M = void 0;
        }),
        (M = S.now())
      );
    }
    function it(e, t) {
      var n,
        i = 0,
        o = {
          height: e,
        };
      for (t = t ? 1 : 0; i < 4; i += 2 - t)
        o["margin" + (n = a[i])] = o["padding" + n] = e;
      return (t && (o.opacity = o.width = e), o);
    }
    function ot(e, t, n) {
      for (
        var i,
          o = (E.tweeners[t] || []).concat(E.tweeners["*"]),
          r = 0,
          s = o.length;
        r < s;
        r++
      )
        if ((i = o[r].call(n, t, e))) return i;
    }
    function E(o, e, t) {
      var n,
        r,
        i,
        s,
        a,
        l,
        c,
        u = 0,
        d = E.prefilters.length,
        h = S.Deferred().always(function () {
          delete p.elem;
        }),
        p = function () {
          if (r) return !1;
          for (
            var e = M || nt(),
              e = Math.max(0, f.startTime + f.duration - e),
              t = 1 - (e / f.duration || 0),
              n = 0,
              i = f.tweens.length;
            n < i;
            n++
          )
            f.tweens[n].run(t);
          return (
            h.notifyWith(o, [f, t, e]),
            t < 1 && i ? e : (h.resolveWith(o, [f]), !1)
          );
        },
        f = h.promise({
          elem: o,
          props: S.extend({}, e),
          opts: S.extend(
            !0,
            {
              specialEasing: {},
              easing: S.easing._default,
            },
            t,
          ),
          originalProperties: e,
          originalOptions: t,
          startTime: M || nt(),
          duration: t.duration,
          tweens: [],
          createTween: function (e, t) {
            t = S.Tween(
              o,
              f.opts,
              e,
              t,
              f.opts.specialEasing[e] || f.opts.easing,
            );
            return (f.tweens.push(t), t);
          },
          stop: function (e) {
            var t = 0,
              n = e ? f.tweens.length : 0;
            if (!r) {
              for (r = !0; t < n; t++) f.tweens[t].run(1);
              e
                ? (h.notifyWith(o, [f, 1, 0]), h.resolveWith(o, [f, e]))
                : h.rejectWith(o, [f, e]);
            }
            return this;
          },
        }),
        g = f.props,
        m = g,
        v = f.opts.specialEasing;
      for (i in m)
        if (
          ((s = S.camelCase(i)),
          (a = v[s]),
          (l = m[i]),
          S.isArray(l) && ((a = l[1]), (l = m[i] = l[0])),
          i !== s && ((m[s] = l), delete m[i]),
          (c = S.cssHooks[s]),
          c && "expand" in c)
        )
          for (i in ((l = c.expand(l)), delete m[s], l))
            i in m || ((m[i] = l[i]), (v[i] = a));
        else v[s] = a;
      for (; u < d; u++)
        if ((n = E.prefilters[u].call(f, o, g, f.opts)))
          return (
            S.isFunction(n.stop) &&
              (S._queueHooks(f.elem, f.opts.queue).stop = S.proxy(n.stop, n)),
            n
          );
      return (
        S.map(g, ot, f),
        S.isFunction(f.opts.start) && f.opts.start.call(o, f),
        S.fx.timer(
          S.extend(p, {
            elem: o,
            anim: f,
            queue: f.opts.queue,
          }),
        ),
        f
          .progress(f.opts.progress)
          .done(f.opts.done, f.opts.complete)
          .fail(f.opts.fail)
          .always(f.opts.always)
      );
    }
    ((S.Animation = S.extend(E, {
      tweeners: {
        "*": [
          function (e, t) {
            var n = this.createTween(e, t);
            return (ae(n.elem, e, h.exec(t), n), n);
          },
        ],
      },
      tweener: function (e, t) {
        for (
          var n,
            i = 0,
            o = (e = S.isFunction(e) ? ((t = e), ["*"]) : e.match(x)).length;
          i < o;
          i++
        )
          ((n = e[i]),
            (E.tweeners[n] = E.tweeners[n] || []),
            E.tweeners[n].unshift(t));
      },
      prefilters: [
        function (t, e, n) {
          var i,
            o,
            r,
            s,
            a,
            l,
            c,
            u = this,
            d = {},
            h = t.style,
            p = t.nodeType && y(t),
            f = v.get(t, "fxshow");
          for (i in (n.queue ||
            (null == (a = S._queueHooks(t, "fx")).unqueued &&
              ((a.unqueued = 0),
              (l = a.empty.fire),
              (a.empty.fire = function () {
                a.unqueued || l();
              })),
            a.unqueued++,
            u.always(function () {
              u.always(function () {
                (a.unqueued--, S.queue(t, "fx").length || a.empty.fire());
              });
            })),
          1 === t.nodeType &&
            ("height" in e || "width" in e) &&
            ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
            "inline" ===
              ("none" === (c = S.css(t, "display"))
                ? v.get(t, "olddisplay") || qe(t.nodeName)
                : c)) &&
            "none" === S.css(t, "float") &&
            (h.display = "inline-block"),
          n.overflow &&
            ((h.overflow = "hidden"),
            u.always(function () {
              ((h.overflow = n.overflow[0]),
                (h.overflowX = n.overflow[1]),
                (h.overflowY = n.overflow[2]));
            })),
          e))
            if (((o = e[i]), et.exec(o))) {
              if (
                (delete e[i],
                (r = r || "toggle" === o),
                o === (p ? "hide" : "show"))
              ) {
                if ("show" !== o || !f || void 0 === f[i]) continue;
                p = !0;
              }
              d[i] = (f && f[i]) || S.style(t, i);
            } else c = void 0;
          if (S.isEmptyObject(d))
            "inline" === ("none" === c ? qe(t.nodeName) : c) && (h.display = c);
          else
            for (i in (f
              ? "hidden" in f && (p = f.hidden)
              : (f = v.access(t, "fxshow", {})),
            r && (f.hidden = !p),
            p
              ? S(t).show()
              : u.done(function () {
                  S(t).hide();
                }),
            u.done(function () {
              for (var e in (v.remove(t, "fxshow"), d)) S.style(t, e, d[e]);
            }),
            d))
              ((s = ot(p ? f[i] : 0, i, u)),
                i in f ||
                  ((f[i] = s.start),
                  p &&
                    ((s.end = s.start),
                    (s.start = "width" === i || "height" === i ? 1 : 0))));
        },
      ],
      prefilter: function (e, t) {
        t ? E.prefilters.unshift(e) : E.prefilters.push(e);
      },
    })),
      (S.speed = function (e, t, n) {
        var i =
          e && "object" == typeof e
            ? S.extend({}, e)
            : {
                complete: n || (!n && t) || (S.isFunction(e) && e),
                duration: e,
                easing: (n && t) || (t && !S.isFunction(t) && t),
              };
        return (
          (i.duration = S.fx.off
            ? 0
            : "number" == typeof i.duration
              ? i.duration
              : i.duration in S.fx.speeds
                ? S.fx.speeds[i.duration]
                : S.fx.speeds._default),
          (null != i.queue && !0 !== i.queue) || (i.queue = "fx"),
          (i.old = i.complete),
          (i.complete = function () {
            (S.isFunction(i.old) && i.old.call(this),
              i.queue && S.dequeue(this, i.queue));
          }),
          i
        );
      }),
      S.fn.extend({
        fadeTo: function (e, t, n, i) {
          return this.filter(y).css("opacity", 0).show().end().animate(
            {
              opacity: t,
            },
            e,
            n,
            i,
          );
        },
        animate: function (t, e, n, i) {
          function o() {
            var e = E(this, S.extend({}, t), s);
            (r || v.get(this, "finish")) && e.stop(!0);
          }
          var r = S.isEmptyObject(t),
            s = S.speed(e, n, i);
          return (
            (o.finish = o),
            r || !1 === s.queue ? this.each(o) : this.queue(s.queue, o)
          );
        },
        stop: function (o, e, r) {
          function s(e) {
            var t = e.stop;
            (delete e.stop, t(r));
          }
          return (
            "string" != typeof o && ((r = e), (e = o), (o = void 0)),
            e && !1 !== o && this.queue(o || "fx", []),
            this.each(function () {
              var e = !0,
                t = null != o && o + "queueHooks",
                n = S.timers,
                i = v.get(this);
              if (t) i[t] && i[t].stop && s(i[t]);
              else for (t in i) i[t] && i[t].stop && tt.test(t) && s(i[t]);
              for (t = n.length; t--; )
                n[t].elem !== this ||
                  (null != o && n[t].queue !== o) ||
                  (n[t].anim.stop(r), (e = !1), n.splice(t, 1));
              (!e && r) || S.dequeue(this, o);
            })
          );
        },
        finish: function (s) {
          return (
            !1 !== s && (s = s || "fx"),
            this.each(function () {
              var e,
                t = v.get(this),
                n = t[s + "queue"],
                i = t[s + "queueHooks"],
                o = S.timers,
                r = n ? n.length : 0;
              for (
                t.finish = !0,
                  S.queue(this, s, []),
                  i && i.stop && i.stop.call(this, !0),
                  e = o.length;
                e--;
              )
                o[e].elem === this &&
                  o[e].queue === s &&
                  (o[e].anim.stop(!0), o.splice(e, 1));
              for (e = 0; e < r; e++)
                n[e] && n[e].finish && n[e].finish.call(this);
              delete t.finish;
            })
          );
        },
      }),
      S.each(["toggle", "show", "hide"], function (e, i) {
        var o = S.fn[i];
        S.fn[i] = function (e, t, n) {
          return null == e || "boolean" == typeof e
            ? o.apply(this, arguments)
            : this.animate(it(i, !0), e, t, n);
        };
      }),
      S.each(
        {
          slideDown: it("show"),
          slideUp: it("hide"),
          slideToggle: it("toggle"),
          fadeIn: {
            opacity: "show",
          },
          fadeOut: {
            opacity: "hide",
          },
          fadeToggle: {
            opacity: "toggle",
          },
        },
        function (e, i) {
          S.fn[e] = function (e, t, n) {
            return this.animate(i, e, t, n);
          };
        },
      ),
      (S.timers = []),
      (S.fx.tick = function () {
        var e,
          t = 0,
          n = S.timers;
        for (M = S.now(); t < n.length; t++)
          (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        (n.length || S.fx.stop(), (M = void 0));
      }),
      (S.fx.timer = function (e) {
        (S.timers.push(e), e() ? S.fx.start() : S.timers.pop());
      }),
      (S.fx.interval = 13),
      (S.fx.start = function () {
        Qe = Qe || C.setInterval(S.fx.tick, S.fx.interval);
      }),
      (S.fx.stop = function () {
        (C.clearInterval(Qe), (Qe = null));
      }),
      (S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400,
      }),
      (S.fn.delay = function (i, e) {
        return (
          (i = (S.fx && S.fx.speeds[i]) || i),
          this.queue((e = e || "fx"), function (e, t) {
            var n = C.setTimeout(e, i);
            t.stop = function () {
              C.clearTimeout(n);
            };
          })
        );
      }),
      (T = z.createElement("input")),
      (L = z.createElement("select")),
      (e = L.appendChild(z.createElement("option"))),
      (T.type = "checkbox"),
      (g.checkOn = "" !== T.value),
      (g.optSelected = e.selected),
      (L.disabled = !0),
      (g.optDisabled = !e.disabled),
      ((T = z.createElement("input")).value = "t"),
      (T.type = "radio"),
      (g.radioValue = "t" === T.value));
    var rt,
      A = S.expr.attrHandle,
      st =
        (S.fn.extend({
          attr: function (e, t) {
            return d(this, S.attr, e, t, 1 < arguments.length);
          },
          removeAttr: function (e) {
            return this.each(function () {
              S.removeAttr(this, e);
            });
          },
        }),
        S.extend({
          attr: function (e, t, n) {
            var i,
              o,
              r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r)
              return void 0 === e.getAttribute
                ? S.prop(e, t, n)
                : ((1 === r && S.isXMLDoc(e)) ||
                    ((t = t.toLowerCase()),
                    (o =
                      S.attrHooks[t] ||
                      (S.expr.match.bool.test(t) ? rt : void 0))),
                  void 0 !== n
                    ? null === n
                      ? void S.removeAttr(e, t)
                      : o && "set" in o && void 0 !== (i = o.set(e, n, t))
                        ? i
                        : (e.setAttribute(t, n + ""), n)
                    : !(o && "get" in o && null !== (i = o.get(e, t))) &&
                        null == (i = S.find.attr(e, t))
                      ? void 0
                      : i);
          },
          attrHooks: {
            type: {
              set: function (e, t) {
                var n;
                if (!g.radioValue && "radio" === t && S.nodeName(e, "input"))
                  return (
                    (n = e.value),
                    e.setAttribute("type", t),
                    n && (e.value = n),
                    t
                  );
              },
            },
          },
          removeAttr: function (e, t) {
            var n,
              i,
              o = 0,
              r = t && t.match(x);
            if (r && 1 === e.nodeType)
              for (; (n = r[o++]); )
                ((i = S.propFix[n] || n),
                  S.expr.match.bool.test(n) && (e[i] = !1),
                  e.removeAttribute(n));
          },
        }),
        (rt = {
          set: function (e, t, n) {
            return (!1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n), n);
          },
        }),
        S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
          var r = A[t] || S.find.attr;
          A[t] = function (e, t, n) {
            var i, o;
            return (
              n ||
                ((o = A[t]),
                (A[t] = i),
                (i = null != r(e, t, n) ? t.toLowerCase() : null),
                (A[t] = o)),
              i
            );
          };
        }),
        /^(?:input|select|textarea|button)$/i),
      at = /^(?:a|area)$/i,
      lt =
        (S.fn.extend({
          prop: function (e, t) {
            return d(this, S.prop, e, t, 1 < arguments.length);
          },
          removeProp: function (e) {
            return this.each(function () {
              delete this[S.propFix[e] || e];
            });
          },
        }),
        S.extend({
          prop: function (e, t, n) {
            var i,
              o,
              r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r)
              return (
                (1 === r && S.isXMLDoc(e)) ||
                  ((t = S.propFix[t] || t), (o = S.propHooks[t])),
                void 0 !== n
                  ? o && "set" in o && void 0 !== (i = o.set(e, n, t))
                    ? i
                    : (e[t] = n)
                  : o && "get" in o && null !== (i = o.get(e, t))
                    ? i
                    : e[t]
              );
          },
          propHooks: {
            tabIndex: {
              get: function (e) {
                var t = S.find.attr(e, "tabindex");
                return t
                  ? parseInt(t, 10)
                  : st.test(e.nodeName) || (at.test(e.nodeName) && e.href)
                    ? 0
                    : -1;
              },
            },
          },
          propFix: {
            for: "htmlFor",
            class: "className",
          },
        }),
        g.optSelected ||
          (S.propHooks.selected = {
            get: function (e) {
              e = e.parentNode;
              return (e && e.parentNode && e.parentNode.selectedIndex, null);
            },
            set: function (e) {
              e = e.parentNode;
              e &&
                (e.selectedIndex, e.parentNode) &&
                e.parentNode.selectedIndex;
            },
          }),
        S.each(
          [
            "tabIndex",
            "readOnly",
            "maxLength",
            "cellSpacing",
            "cellPadding",
            "rowSpan",
            "colSpan",
            "useMap",
            "frameBorder",
            "contentEditable",
          ],
          function () {
            S.propFix[this.toLowerCase()] = this;
          },
        ),
        /[\t\r\n\f]/g);
    function q(e) {
      return (e.getAttribute && e.getAttribute("class")) || "";
    }
    S.fn.extend({
      addClass: function (t) {
        var e,
          n,
          i,
          o,
          r,
          s,
          a = 0;
        if (S.isFunction(t))
          return this.each(function (e) {
            S(this).addClass(t.call(this, e, q(this)));
          });
        if ("string" == typeof t && t)
          for (e = t.match(x) || []; (n = this[a++]); )
            if (
              ((s = q(n)),
              (i = 1 === n.nodeType && (" " + s + " ").replace(lt, " ")))
            ) {
              for (r = 0; (o = e[r++]); )
                i.indexOf(" " + o + " ") < 0 && (i += o + " ");
              s !== (s = S.trim(i)) && n.setAttribute("class", s);
            }
        return this;
      },
      removeClass: function (t) {
        var e,
          n,
          i,
          o,
          r,
          s,
          a = 0;
        if (S.isFunction(t))
          return this.each(function (e) {
            S(this).removeClass(t.call(this, e, q(this)));
          });
        if (!arguments.length) return this.attr("class", "");
        if ("string" == typeof t && t)
          for (e = t.match(x) || []; (n = this[a++]); )
            if (
              ((s = q(n)),
              (i = 1 === n.nodeType && (" " + s + " ").replace(lt, " ")))
            ) {
              for (r = 0; (o = e[r++]); )
                for (; -1 < i.indexOf(" " + o + " "); )
                  i = i.replace(" " + o + " ", " ");
              s !== (s = S.trim(i)) && n.setAttribute("class", s);
            }
        return this;
      },
      toggleClass: function (o, t) {
        var r = typeof o;
        return "boolean" == typeof t && "string" == r
          ? t
            ? this.addClass(o)
            : this.removeClass(o)
          : S.isFunction(o)
            ? this.each(function (e) {
                S(this).toggleClass(o.call(this, e, q(this), t), t);
              })
            : this.each(function () {
                var e, t, n, i;
                if ("string" == r)
                  for (t = 0, n = S(this), i = o.match(x) || []; (e = i[t++]); )
                    n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                  (void 0 !== o && "boolean" != r) ||
                    ((e = q(this)) && v.set(this, "__className__", e),
                    this.setAttribute &&
                      this.setAttribute(
                        "class",
                        (!e && !1 !== o && v.get(this, "__className__")) || "",
                      ));
              });
      },
      hasClass: function (e) {
        for (var t, n = 0, i = " " + e + " "; (t = this[n++]); )
          if (
            1 === t.nodeType &&
            -1 < (" " + q(t) + " ").replace(lt, " ").indexOf(i)
          )
            return !0;
        return !1;
      },
    });
    var ct = /\r/g,
      ut = /[\x20\t\r\n\f]+/g,
      dt =
        (S.fn.extend({
          val: function (t) {
            var n,
              e,
              i,
              o = this[0];
            return arguments.length
              ? ((i = S.isFunction(t)),
                this.each(function (e) {
                  1 === this.nodeType &&
                    (null == (e = i ? t.call(this, e, S(this).val()) : t)
                      ? (e = "")
                      : "number" == typeof e
                        ? (e += "")
                        : S.isArray(e) &&
                          (e = S.map(e, function (e) {
                            return null == e ? "" : e + "";
                          })),
                    ((n =
                      S.valHooks[this.type] ||
                      S.valHooks[this.nodeName.toLowerCase()]) &&
                      "set" in n &&
                      void 0 !== n.set(this, e, "value")) ||
                      (this.value = e));
                }))
              : o
                ? (n =
                    S.valHooks[o.type] ||
                    S.valHooks[o.nodeName.toLowerCase()]) &&
                  "get" in n &&
                  void 0 !== (e = n.get(o, "value"))
                  ? e
                  : "string" == typeof (e = o.value)
                    ? e.replace(ct, "")
                    : null == e
                      ? ""
                      : e
                : void 0;
          },
        }),
        S.extend({
          valHooks: {
            option: {
              get: function (e) {
                var t = S.find.attr(e, "value");
                return null != t ? t : S.trim(S.text(e)).replace(ut, " ");
              },
            },
            select: {
              get: function (e) {
                for (
                  var t,
                    n = e.options,
                    i = e.selectedIndex,
                    o = "select-one" === e.type || i < 0,
                    r = o ? null : [],
                    s = o ? i + 1 : n.length,
                    a = i < 0 ? s : o ? i : 0;
                  a < s;
                  a++
                )
                  if (
                    ((t = n[a]).selected || a === i) &&
                    (g.optDisabled
                      ? !t.disabled
                      : null === t.getAttribute("disabled")) &&
                    (!t.parentNode.disabled ||
                      !S.nodeName(t.parentNode, "optgroup"))
                  ) {
                    if (((t = S(t).val()), o)) return t;
                    r.push(t);
                  }
                return r;
              },
              set: function (e, t) {
                for (
                  var n, i, o = e.options, r = S.makeArray(t), s = o.length;
                  s--;
                )
                  ((i = o[s]).selected =
                    -1 < S.inArray(S.valHooks.option.get(i), r)) && (n = !0);
                return (n || (e.selectedIndex = -1), r);
              },
            },
          },
        }),
        S.each(["radio", "checkbox"], function () {
          ((S.valHooks[this] = {
            set: function (e, t) {
              return S.isArray(t)
                ? (e.checked = -1 < S.inArray(S(e).val(), t))
                : void 0;
            },
          }),
            g.checkOn ||
              (S.valHooks[this].get = function (e) {
                return null === e.getAttribute("value") ? "on" : e.value;
              }));
        }),
        /^(?:focusinfocus|focusoutblur)$/),
      D =
        (S.extend(S.event, {
          trigger: function (e, t, n, i) {
            var o,
              r,
              s,
              a,
              l,
              c,
              u = [n || z],
              d = f.call(e, "type") ? e.type : e,
              h = f.call(e, "namespace") ? e.namespace.split(".") : [],
              p = (r = n = n || z);
            if (
              3 !== n.nodeType &&
              8 !== n.nodeType &&
              !dt.test(d + S.event.triggered) &&
              (-1 < d.indexOf(".") &&
                ((d = (h = d.split(".")).shift()), h.sort()),
              (a = d.indexOf(":") < 0 && "on" + d),
              ((e = e[S.expando]
                ? e
                : new S.Event(d, "object" == typeof e && e)).isTrigger = i
                ? 2
                : 3),
              (e.namespace = h.join(".")),
              (e.rnamespace = e.namespace
                ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)")
                : null),
              (e.result = void 0),
              e.target || (e.target = n),
              (t = null == t ? [e] : S.makeArray(t, [e])),
              (c = S.event.special[d] || {}),
              i || !c.trigger || !1 !== c.trigger.apply(n, t))
            ) {
              if (!i && !c.noBubble && !S.isWindow(n)) {
                for (
                  s = c.delegateType || d, dt.test(s + d) || (p = p.parentNode);
                  p;
                  p = p.parentNode
                )
                  (u.push(p), (r = p));
                r === (n.ownerDocument || z) &&
                  u.push(r.defaultView || r.parentWindow || C);
              }
              for (o = 0; (p = u[o++]) && !e.isPropagationStopped(); )
                ((e.type = 1 < o ? s : c.bindType || d),
                  (l =
                    (v.get(p, "events") || {})[e.type] && v.get(p, "handle")) &&
                    l.apply(p, t),
                  (l = a && p[a]) &&
                    l.apply &&
                    m(p) &&
                    ((e.result = l.apply(p, t)), !1 === e.result) &&
                    e.preventDefault());
              return (
                (e.type = d),
                i ||
                  e.isDefaultPrevented() ||
                  (c._default && !1 !== c._default.apply(u.pop(), t)) ||
                  !m(n) ||
                  (a &&
                    S.isFunction(n[d]) &&
                    !S.isWindow(n) &&
                    ((r = n[a]) && (n[a] = null),
                    n[(S.event.triggered = d)](),
                    (S.event.triggered = void 0),
                    r) &&
                    (n[a] = r)),
                e.result
              );
            }
          },
          simulate: function (e, t, n) {
            n = S.extend(new S.Event(), n, {
              type: e,
              isSimulated: !0,
            });
            S.event.trigger(n, null, t);
          },
        }),
        S.fn.extend({
          trigger: function (e, t) {
            return this.each(function () {
              S.event.trigger(e, t, this);
            });
          },
          triggerHandler: function (e, t) {
            var n = this[0];
            return n ? S.event.trigger(e, t, n, !0) : void 0;
          },
        }),
        S.each(
          "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
            " ",
          ),
          function (e, n) {
            S.fn[n] = function (e, t) {
              return 0 < arguments.length
                ? this.on(n, null, e, t)
                : this.trigger(n);
            };
          },
        ),
        S.fn.extend({
          hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e);
          },
        }),
        (g.focusin = "onfocusin" in C),
        g.focusin ||
          S.each(
            {
              focus: "focusin",
              blur: "focusout",
            },
            function (n, i) {
              function o(e) {
                S.event.simulate(i, e.target, S.event.fix(e));
              }
              S.event.special[i] = {
                setup: function () {
                  var e = this.ownerDocument || this,
                    t = v.access(e, i);
                  (t || e.addEventListener(n, o, !0),
                    v.access(e, i, (t || 0) + 1));
                },
                teardown: function () {
                  var e = this.ownerDocument || this,
                    t = v.access(e, i) - 1;
                  t
                    ? v.access(e, i, t)
                    : (e.removeEventListener(n, o, !0), v.remove(e, i));
                },
              };
            },
          ),
        C.location),
      ht = S.now(),
      pt = /\?/,
      ft =
        ((S.parseJSON = function (e) {
          return JSON.parse(e + "");
        }),
        (S.parseXML = function (e) {
          var t;
          if (!e || "string" != typeof e) return null;
          try {
            t = new C.DOMParser().parseFromString(e, "text/xml");
          } catch (e) {
            t = void 0;
          }
          return (
            (t && !t.getElementsByTagName("parsererror").length) ||
              S.error("Invalid XML: " + e),
            t
          );
        }),
        /#.*$/),
      gt = /([?&])_=[^&]*/,
      mt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      vt = /^(?:GET|HEAD)$/,
      yt = /^\/\//,
      bt = {},
      wt = {},
      Ct = "*/".concat("*"),
      zt = z.createElement("a");
    function St(r) {
      return function (e, t) {
        "string" != typeof e && ((t = e), (e = "*"));
        var n,
          i = 0,
          o = e.toLowerCase().match(x) || [];
        if (S.isFunction(t))
          for (; (n = o[i++]); )
            "+" === n[0]
              ? ((n = n.slice(1) || "*"), (r[n] = r[n] || []).unshift(t))
              : (r[n] = r[n] || []).push(t);
      };
    }
    function xt(t, i, o, r) {
      var s = {},
        a = t === wt;
      function l(e) {
        var n;
        return (
          (s[e] = !0),
          S.each(t[e] || [], function (e, t) {
            t = t(i, o, r);
            return "string" != typeof t || a || s[t]
              ? a
                ? !(n = t)
                : void 0
              : (i.dataTypes.unshift(t), l(t), !1);
          }),
          n
        );
      }
      return l(i.dataTypes[0]) || (!s["*"] && l("*"));
    }
    function kt(e, t) {
      var n,
        i,
        o = S.ajaxSettings.flatOptions || {};
      for (n in t) void 0 !== t[n] && ((o[n] ? e : (i = i || {}))[n] = t[n]);
      return (i && S.extend(!0, e, i), e);
    }
    ((zt.href = D.href),
      S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: D.href,
          type: "GET",
          isLocal:
            /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
              D.protocol,
            ),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          accepts: {
            "*": Ct,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript",
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/,
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON",
          },
          converters: {
            "* text": String,
            "text html": !0,
            "text json": S.parseJSON,
            "text xml": S.parseXML,
          },
          flatOptions: {
            url: !0,
            context: !0,
          },
        },
        ajaxSetup: function (e, t) {
          return t ? kt(kt(e, S.ajaxSettings), t) : kt(S.ajaxSettings, e);
        },
        ajaxPrefilter: St(bt),
        ajaxTransport: St(wt),
        ajax: function (e, t) {
          "object" == typeof e && ((t = e), (e = void 0));
          var l,
            c,
            u,
            n,
            d,
            h,
            i,
            p = S.ajaxSetup({}, (t = t || {})),
            f = p.context || p,
            g = p.context && (f.nodeType || f.jquery) ? S(f) : S.event,
            m = S.Deferred(),
            v = S.Callbacks("once memory"),
            y = p.statusCode || {},
            o = {},
            r = {},
            b = 0,
            s = "canceled",
            w = {
              readyState: 0,
              getResponseHeader: function (e) {
                var t;
                if (2 === b) {
                  if (!n)
                    for (n = {}; (t = mt.exec(u)); )
                      n[t[1].toLowerCase()] = t[2];
                  t = n[e.toLowerCase()];
                }
                return null == t ? null : t;
              },
              getAllResponseHeaders: function () {
                return 2 === b ? u : null;
              },
              setRequestHeader: function (e, t) {
                var n = e.toLowerCase();
                return (b || ((e = r[n] = r[n] || e), (o[e] = t)), this);
              },
              overrideMimeType: function (e) {
                return (b || (p.mimeType = e), this);
              },
              statusCode: function (e) {
                if (e)
                  if (b < 2) for (var t in e) y[t] = [y[t], e[t]];
                  else w.always(e[w.status]);
                return this;
              },
              abort: function (e) {
                e = e || s;
                return (l && l.abort(e), a(0, e), this);
              },
            };
          if (
            ((m.promise(w).complete = v.add),
            (w.success = w.done),
            (w.error = w.fail),
            (p.url = ((e || p.url || D.href) + "")
              .replace(ft, "")
              .replace(yt, D.protocol + "//")),
            (p.type = t.method || t.type || p.method || p.type),
            (p.dataTypes = S.trim(p.dataType || "*")
              .toLowerCase()
              .match(x) || [""]),
            null == p.crossDomain)
          ) {
            e = z.createElement("a");
            try {
              ((e.href = p.url),
                (e.href = e.href),
                (p.crossDomain =
                  zt.protocol + "//" + zt.host != e.protocol + "//" + e.host));
            } catch (e) {
              p.crossDomain = !0;
            }
          }
          if (
            (p.data &&
              p.processData &&
              "string" != typeof p.data &&
              (p.data = S.param(p.data, p.traditional)),
            xt(bt, p, t, w),
            2 !== b)
          ) {
            for (i in ((h = S.event && p.global) &&
              0 == S.active++ &&
              S.event.trigger("ajaxStart"),
            (p.type = p.type.toUpperCase()),
            (p.hasContent = !vt.test(p.type)),
            (c = p.url),
            p.hasContent ||
              (p.data &&
                ((c = p.url += (pt.test(c) ? "&" : "?") + p.data),
                delete p.data),
              !1 === p.cache &&
                (p.url = gt.test(c)
                  ? c.replace(gt, "$1_=" + ht++)
                  : c + (pt.test(c) ? "&" : "?") + "_=" + ht++)),
            p.ifModified &&
              (S.lastModified[c] &&
                w.setRequestHeader("If-Modified-Since", S.lastModified[c]),
              S.etag[c]) &&
              w.setRequestHeader("If-None-Match", S.etag[c]),
            ((p.data && p.hasContent && !1 !== p.contentType) ||
              t.contentType) &&
              w.setRequestHeader("Content-Type", p.contentType),
            w.setRequestHeader(
              "Accept",
              p.dataTypes[0] && p.accepts[p.dataTypes[0]]
                ? p.accepts[p.dataTypes[0]] +
                    ("*" !== p.dataTypes[0] ? ", " + Ct + "; q=0.01" : "")
                : p.accepts["*"],
            ),
            p.headers))
              w.setRequestHeader(i, p.headers[i]);
            if (p.beforeSend && (!1 === p.beforeSend.call(f, w, p) || 2 === b))
              return w.abort();
            for (i in ((s = "abort"),
            {
              success: 1,
              error: 1,
              complete: 1,
            }))
              w[i](p[i]);
            if ((l = xt(wt, p, t, w))) {
              if (
                ((w.readyState = 1),
                h && g.trigger("ajaxSend", [w, p]),
                2 === b)
              )
                return w;
              p.async &&
                0 < p.timeout &&
                (d = C.setTimeout(function () {
                  w.abort("timeout");
                }, p.timeout));
              try {
                ((b = 1), l.send(o, a));
              } catch (e) {
                if (!(b < 2)) throw e;
                a(-1, e);
              }
            } else a(-1, "No Transport");
          }
          return w;
          function a(e, t, n, i) {
            var o,
              r,
              s,
              a = t;
            2 !== b &&
              ((b = 2),
              d && C.clearTimeout(d),
              (l = void 0),
              (u = i || ""),
              (w.readyState = 0 < e ? 4 : 0),
              (i = (200 <= e && e < 300) || 304 === e),
              n &&
                (s = ((e, t, n) => {
                  for (
                    var i, o, r, s, a = e.contents, l = e.dataTypes;
                    "*" === l[0];
                  )
                    (l.shift(),
                      void 0 === i &&
                        (i =
                          e.mimeType || t.getResponseHeader("Content-Type")));
                  if (i)
                    for (o in a)
                      if (a[o] && a[o].test(i)) {
                        l.unshift(o);
                        break;
                      }
                  if (l[0] in n) r = l[0];
                  else {
                    for (o in n) {
                      if (!l[0] || e.converters[o + " " + l[0]]) {
                        r = o;
                        break;
                      }
                      s = s || o;
                    }
                    r = r || s;
                  }
                  return r ? (r !== l[0] && l.unshift(r), n[r]) : void 0;
                })(p, w, n)),
              (s = ((e, t, n, i) => {
                var o,
                  r,
                  s,
                  a,
                  l,
                  c = {},
                  u = e.dataTypes.slice();
                if (u[1])
                  for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
                for (r = u.shift(); r; )
                  if (
                    (e.responseFields[r] && (n[e.responseFields[r]] = t),
                    !l &&
                      i &&
                      e.dataFilter &&
                      (t = e.dataFilter(t, e.dataType)),
                    (l = r),
                    (r = u.shift()))
                  )
                    if ("*" === r) r = l;
                    else if ("*" !== l && l !== r) {
                      if (!(s = c[l + " " + r] || c["* " + r]))
                        for (o in c)
                          if (
                            ((a = o.split(" ")),
                            a[1] === r &&
                              (s = c[l + " " + a[0]] || c["* " + a[0]]))
                          ) {
                            !0 === s
                              ? (s = c[o])
                              : !0 !== c[o] && ((r = a[0]), u.unshift(a[1]));
                            break;
                          }
                      if (!0 !== s)
                        if (s && e.throws) t = s(t);
                        else
                          try {
                            t = s(t);
                          } catch (e) {
                            return {
                              state: "parsererror",
                              error: s
                                ? e
                                : "No conversion from " + l + " to " + r,
                            };
                          }
                    }
                return {
                  state: "success",
                  data: t,
                };
              })(p, s, w, i)),
              i
                ? (p.ifModified &&
                    ((n = w.getResponseHeader("Last-Modified")) &&
                      (S.lastModified[c] = n),
                    (n = w.getResponseHeader("etag"))) &&
                    (S.etag[c] = n),
                  204 === e || "HEAD" === p.type
                    ? (a = "nocontent")
                    : 304 === e
                      ? (a = "notmodified")
                      : ((a = s.state), (o = s.data), (i = !(r = s.error))))
                : ((r = a), (!e && a) || ((a = "error"), e < 0 && (e = 0))),
              (w.status = e),
              (w.statusText = (t || a) + ""),
              i ? m.resolveWith(f, [o, a, w]) : m.rejectWith(f, [w, a, r]),
              w.statusCode(y),
              (y = void 0),
              h &&
                g.trigger(i ? "ajaxSuccess" : "ajaxError", [w, p, i ? o : r]),
              v.fireWith(f, [w, a]),
              h) &&
              (g.trigger("ajaxComplete", [w, p]),
              --S.active || S.event.trigger("ajaxStop"));
          }
        },
        getJSON: function (e, t, n) {
          return S.get(e, t, n, "json");
        },
        getScript: function (e, t) {
          return S.get(e, void 0, t, "script");
        },
      }),
      S.each(["get", "post"], function (e, o) {
        S[o] = function (e, t, n, i) {
          return (
            S.isFunction(t) && ((i = i || n), (n = t), (t = void 0)),
            S.ajax(
              S.extend(
                {
                  url: e,
                  type: o,
                  dataType: i,
                  data: t,
                  success: n,
                },
                S.isPlainObject(e) && e,
              ),
            )
          );
        };
      }),
      (S._evalUrl = function (e) {
        return S.ajax({
          url: e,
          type: "GET",
          dataType: "script",
          async: !1,
          global: !1,
          throws: !0,
        });
      }),
      S.fn.extend({
        wrapAll: function (t) {
          var e;
          return S.isFunction(t)
            ? this.each(function (e) {
                S(this).wrapAll(t.call(this, e));
              })
            : (this[0] &&
                ((e = S(t, this[0].ownerDocument).eq(0).clone(!0)),
                this[0].parentNode && e.insertBefore(this[0]),
                e
                  .map(function () {
                    for (var e = this; e.firstElementChild; )
                      e = e.firstElementChild;
                    return e;
                  })
                  .append(this)),
              this);
        },
        wrapInner: function (n) {
          return S.isFunction(n)
            ? this.each(function (e) {
                S(this).wrapInner(n.call(this, e));
              })
            : this.each(function () {
                var e = S(this),
                  t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n);
              });
        },
        wrap: function (t) {
          var n = S.isFunction(t);
          return this.each(function (e) {
            S(this).wrapAll(n ? t.call(this, e) : t);
          });
        },
        unwrap: function () {
          return this.parent()
            .each(function () {
              S.nodeName(this, "body") || S(this).replaceWith(this.childNodes);
            })
            .end();
        },
      }),
      (S.expr.filters.hidden = function (e) {
        return !S.expr.filters.visible(e);
      }),
      (S.expr.filters.visible = function (e) {
        return (
          0 < e.offsetWidth ||
          0 < e.offsetHeight ||
          0 < e.getClientRects().length
        );
      }));
    var _t = /%20/g,
      $t = /\[\]$/,
      Mt = /\r?\n/g,
      Tt = /^(?:submit|button|image|reset|file)$/i,
      Lt = /^(?:input|select|textarea|keygen)/i;
    ((S.param = function (e, t) {
      function n(e, t) {
        ((t = S.isFunction(t) ? t() : null == t ? "" : t),
          (o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)));
      }
      var i,
        o = [];
      if (
        (void 0 === t && (t = S.ajaxSettings && S.ajaxSettings.traditional),
        S.isArray(e) || (e.jquery && !S.isPlainObject(e)))
      )
        S.each(e, function () {
          n(this.name, this.value);
        });
      else
        for (i in e)
          !(function n(i, e, o, r) {
            if (S.isArray(e))
              S.each(e, function (e, t) {
                o || $t.test(i)
                  ? r(i, t)
                  : n(
                      i +
                        "[" +
                        ("object" == typeof t && null != t ? e : "") +
                        "]",
                      t,
                      o,
                      r,
                    );
              });
            else if (o || "object" !== S.type(e)) r(i, e);
            else for (var t in e) n(i + "[" + t + "]", e[t], o, r);
          })(i, e[i], t, n);
      return o.join("&").replace(_t, "+");
    }),
      S.fn.extend({
        serialize: function () {
          return S.param(this.serializeArray());
        },
        serializeArray: function () {
          return this.map(function () {
            var e = S.prop(this, "elements");
            return e ? S.makeArray(e) : this;
          })
            .filter(function () {
              var e = this.type;
              return (
                this.name &&
                !S(this).is(":disabled") &&
                Lt.test(this.nodeName) &&
                !Tt.test(e) &&
                (this.checked || !le.test(e))
              );
            })
            .map(function (e, t) {
              var n = S(this).val();
              return null == n
                ? null
                : S.isArray(n)
                  ? S.map(n, function (e) {
                      return {
                        name: t.name,
                        value: e.replace(Mt, "\r\n"),
                      };
                    })
                  : {
                      name: t.name,
                      value: n.replace(Mt, "\r\n"),
                    };
            })
            .get();
        },
      }),
      (S.ajaxSettings.xhr = function () {
        try {
          return new C.XMLHttpRequest();
        } catch (e) {}
      }));
    var Et = {
        0: 200,
        1223: 204,
      },
      N = S.ajaxSettings.xhr(),
      At =
        ((g.cors = !!N && "withCredentials" in N),
        (g.ajax = N = !!N),
        S.ajaxTransport(function (o) {
          var r, s;
          return g.cors || (N && !o.crossDomain)
            ? {
                send: function (e, t) {
                  var n,
                    i = o.xhr();
                  if (
                    (i.open(o.type, o.url, o.async, o.username, o.password),
                    o.xhrFields)
                  )
                    for (n in o.xhrFields) i[n] = o.xhrFields[n];
                  for (n in (o.mimeType &&
                    i.overrideMimeType &&
                    i.overrideMimeType(o.mimeType),
                  o.crossDomain ||
                    e["X-Requested-With"] ||
                    (e["X-Requested-With"] = "XMLHttpRequest"),
                  e))
                    i.setRequestHeader(n, e[n]);
                  ((r = function (e) {
                    return function () {
                      r &&
                        ((r =
                          s =
                          i.onload =
                          i.onerror =
                          i.onabort =
                          i.onreadystatechange =
                            null),
                        "abort" === e
                          ? i.abort()
                          : "error" === e
                            ? "number" != typeof i.status
                              ? t(0, "error")
                              : t(i.status, i.statusText)
                            : t(
                                Et[i.status] || i.status,
                                i.statusText,
                                "text" !== (i.responseType || "text") ||
                                  "string" != typeof i.responseText
                                  ? {
                                      binary: i.response,
                                    }
                                  : {
                                      text: i.responseText,
                                    },
                                i.getAllResponseHeaders(),
                              ));
                    };
                  }),
                    (i.onload = r()),
                    (s = i.onerror = r("error")),
                    void 0 !== i.onabort
                      ? (i.onabort = s)
                      : (i.onreadystatechange = function () {
                          4 === i.readyState &&
                            C.setTimeout(function () {
                              r && s();
                            });
                        }),
                    (r = r("abort")));
                  try {
                    i.send((o.hasContent && o.data) || null);
                  } catch (e) {
                    if (r) throw e;
                  }
                },
                abort: function () {
                  r && r();
                },
              }
            : void 0;
        }),
        S.ajaxSetup({
          accepts: {
            script:
              "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
          },
          contents: {
            script: /\b(?:java|ecma)script\b/,
          },
          converters: {
            "text script": function (e) {
              return (S.globalEval(e), e);
            },
          },
        }),
        S.ajaxPrefilter("script", function (e) {
          (void 0 === e.cache && (e.cache = !1),
            e.crossDomain && (e.type = "GET"));
        }),
        S.ajaxTransport("script", function (n) {
          var i, o;
          if (n.crossDomain)
            return {
              send: function (e, t) {
                ((i = S("<script>")
                  .prop({
                    charset: n.scriptCharset,
                    src: n.url,
                  })
                  .on(
                    "load error",
                    (o = function (e) {
                      (i.remove(),
                        (o = null),
                        e && t("error" === e.type ? 404 : 200, e.type));
                    }),
                  )),
                  z.head.appendChild(i[0]));
              },
              abort: function () {
                o && o();
              },
            };
        }),
        []),
      qt = /(=)\?(?=&|$)|\?\?/,
      Dt =
        (S.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function () {
            var e = At.pop() || S.expando + "_" + ht++;
            return ((this[e] = !0), e);
          },
        }),
        S.ajaxPrefilter("json jsonp", function (e, t, n) {
          var i,
            o,
            r,
            s =
              !1 !== e.jsonp &&
              (qt.test(e.url)
                ? "url"
                : "string" == typeof e.data &&
                  0 ===
                    (e.contentType || "").indexOf(
                      "application/x-www-form-urlencoded",
                    ) &&
                  qt.test(e.data) &&
                  "data");
          return s || "jsonp" === e.dataTypes[0]
            ? ((i = e.jsonpCallback =
                S.isFunction(e.jsonpCallback)
                  ? e.jsonpCallback()
                  : e.jsonpCallback),
              s
                ? (e[s] = e[s].replace(qt, "$1" + i))
                : !1 !== e.jsonp &&
                  (e.url += (pt.test(e.url) ? "&" : "?") + e.jsonp + "=" + i),
              (e.converters["script json"] = function () {
                return (r || S.error(i + " was not called"), r[0]);
              }),
              (e.dataTypes[0] = "json"),
              (o = C[i]),
              (C[i] = function () {
                r = arguments;
              }),
              n.always(function () {
                (void 0 === o ? S(C).removeProp(i) : (C[i] = o),
                  e[i] && ((e.jsonpCallback = t.jsonpCallback), At.push(i)),
                  r && S.isFunction(o) && o(r[0]),
                  (r = o = void 0));
              }),
              "script")
            : void 0;
        }),
        (S.parseHTML = function (e, t, n) {
          if (!e || "string" != typeof e) return null;
          ("boolean" == typeof t && ((n = t), (t = !1)), (t = t || z));
          var i = V.exec(e),
            n = !n && [];
          return i
            ? [t.createElement(i[1])]
            : ((i = pe([e], t, n)),
              n && n.length && S(n).remove(),
              S.merge([], i.childNodes));
        }),
        S.fn.load);
    function Nt(e) {
      return S.isWindow(e) ? e : 9 === e.nodeType && e.defaultView;
    }
    ((S.fn.load = function (e, t, n) {
      var i, o, r, s, a;
      return "string" != typeof e && Dt
        ? Dt.apply(this, arguments)
        : ((s = this),
          -1 < (a = e.indexOf(" ")) &&
            ((i = S.trim(e.slice(a))), (e = e.slice(0, a))),
          S.isFunction(t)
            ? ((n = t), (t = void 0))
            : t && "object" == typeof t && (o = "POST"),
          0 < s.length &&
            S.ajax({
              url: e,
              type: o || "GET",
              dataType: "html",
              data: t,
            })
              .done(function (e) {
                ((r = arguments),
                  s.html(i ? S("<div>").append(S.parseHTML(e)).find(i) : e));
              })
              .always(
                n &&
                  function (e, t) {
                    s.each(function () {
                      n.apply(this, r || [e.responseText, t, e]);
                    });
                  },
              ),
          this);
    }),
      S.each(
        [
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend",
        ],
        function (e, t) {
          S.fn[t] = function (e) {
            return this.on(t, e);
          };
        },
      ),
      (S.expr.filters.animated = function (t) {
        return S.grep(S.timers, function (e) {
          return t === e.elem;
        }).length;
      }),
      (S.offset = {
        setOffset: function (e, t, n) {
          var i,
            o,
            r,
            s,
            a = S.css(e, "position"),
            l = S(e),
            c = {};
          ("static" === a && (e.style.position = "relative"),
            (r = l.offset()),
            (i = S.css(e, "top")),
            (s = S.css(e, "left")),
            (a =
              ("absolute" === a || "fixed" === a) &&
              -1 < (i + s).indexOf("auto")
                ? ((o = (a = l.position()).top), a.left)
                : ((o = parseFloat(i) || 0), parseFloat(s) || 0)),
            null !=
              (t = S.isFunction(t) ? t.call(e, n, S.extend({}, r)) : t).top &&
              (c.top = t.top - r.top + o),
            null != t.left && (c.left = t.left - r.left + a),
            "using" in t ? t.using.call(e, c) : l.css(c));
        },
      }),
      S.fn.extend({
        offset: function (t) {
          var e, n, i, o;
          return arguments.length
            ? void 0 === t
              ? this
              : this.each(function (e) {
                  S.offset.setOffset(this, t, e);
                })
            : ((i = {
                top: 0,
                left: 0,
              }),
              (o = (n = this[0]) && n.ownerDocument)
                ? ((e = o.documentElement),
                  S.contains(e, n)
                    ? ((i = n.getBoundingClientRect()),
                      (n = Nt(o)),
                      {
                        top: i.top + n.pageYOffset - e.clientTop,
                        left: i.left + n.pageXOffset - e.clientLeft,
                      })
                    : i)
                : void 0);
        },
        position: function () {
          var e, t, n, i;
          if (this[0])
            return (
              (n = this[0]),
              (i = {
                top: 0,
                left: 0,
              }),
              "fixed" === S.css(n, "position")
                ? (t = n.getBoundingClientRect())
                : ((e = this.offsetParent()),
                  (t = this.offset()),
                  ((i = S.nodeName(e[0], "html") ? i : e.offset()).top += S.css(
                    e[0],
                    "borderTopWidth",
                    !0,
                  )),
                  (i.left += S.css(e[0], "borderLeftWidth", !0))),
              {
                top: t.top - i.top - S.css(n, "marginTop", !0),
                left: t.left - i.left - S.css(n, "marginLeft", !0),
              }
            );
        },
        offsetParent: function () {
          return this.map(function () {
            for (
              var e = this.offsetParent;
              e && "static" === S.css(e, "position");
            )
              e = e.offsetParent;
            return e || p;
          });
        },
      }),
      S.each(
        {
          scrollLeft: "pageXOffset",
          scrollTop: "pageYOffset",
        },
        function (t, o) {
          var r = "pageYOffset" === o;
          S.fn[t] = function (e) {
            return d(
              this,
              function (e, t, n) {
                var i = Nt(e);
                return void 0 === n
                  ? i
                    ? i[o]
                    : e[t]
                  : void (i
                      ? i.scrollTo(r ? i.pageXOffset : n, r ? n : i.pageYOffset)
                      : (e[t] = n));
              },
              t,
              e,
              arguments.length,
            );
          };
        },
      ),
      S.each(["top", "left"], function (e, n) {
        S.cssHooks[n] = Be(g.pixelPosition, function (e, t) {
          return t
            ? ((t = _(e, n)), je.test(t) ? S(e).position()[n] + "px" : t)
            : void 0;
        });
      }),
      S.each(
        {
          Height: "height",
          Width: "width",
        },
        function (r, s) {
          S.each(
            {
              padding: "inner" + r,
              content: s,
              "": "outer" + r,
            },
            function (i, e) {
              S.fn[e] = function (e, t) {
                var n = arguments.length && (i || "boolean" != typeof e),
                  o = i || (!0 === e || !0 === t ? "margin" : "border");
                return d(
                  this,
                  function (e, t, n) {
                    var i;
                    return S.isWindow(e)
                      ? e.document.documentElement["client" + r]
                      : 9 === e.nodeType
                        ? ((i = e.documentElement),
                          Math.max(
                            e.body["scroll" + r],
                            i["scroll" + r],
                            e.body["offset" + r],
                            i["offset" + r],
                            i["client" + r],
                          ))
                        : void 0 === n
                          ? S.css(e, t, o)
                          : S.style(e, t, n, o);
                  },
                  s,
                  n ? e : void 0,
                  n,
                  null,
                );
              };
            },
          );
        },
      ),
      S.fn.extend({
        bind: function (e, t, n) {
          return this.on(e, null, t, n);
        },
        unbind: function (e, t) {
          return this.off(e, null, t);
        },
        delegate: function (e, t, n, i) {
          return this.on(t, e, n, i);
        },
        undelegate: function (e, t, n) {
          return 1 === arguments.length
            ? this.off(e, "**")
            : this.off(t, e || "**", n);
        },
        size: function () {
          return this.length;
        },
      }),
      (S.fn.andSelf = S.fn.addBack),
      "function" == typeof define &&
        define.amd &&
        define("jquery", [], function () {
          return S;
        }));
    var It = C.jQuery,
      Pt = C.$;
    return (
      (S.noConflict = function (e) {
        return (
          C.$ === S && (C.$ = Pt),
          e && C.jQuery === S && (C.jQuery = It),
          S
        );
      }),
      I || (C.jQuery = C.$ = S),
      S
    );
  }));
var Config = {
  paddingTop: 44,
  paddingBottom: 44,
  headerHeight: 44,
  footerHeight: 44,
  scenePaddingBottom: 60,
  bannerHeight: 50,
  sidebarWidth: 50,
  sidebarWidth: 210,
  crosshairWidth: 100,
  panTimeThreshold: 300,
  panPixelThreshold: 3,
  loopLineWidth: 4,
  nonogramsCellSize: 15,
  shikakuSeparatorWidth: 1,
  shikakuRectBorderWidth: 2,
  shikakuClassicSeparatorWidth: 3,
  shikakuClassicRectBorderWidth: 3,
  bridgesSquare: 18,
  bridgesSeparator: 0,
  bridgesSize: 2,
  mainContainerWidth: 750,
  sideBannerWidth: 170,
  wideSideBannerWidth: 304,
  topMenuHeight: 53,
};
function numberWithCommas(e) {
  return void 0 === e ? 0 : e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function sumSolved(e) {
  var t,
    n = 0;
  for (t in e) e.hasOwnProperty(t) && (n += e[t].nsolved);
  return numberWithCommas(n);
}
function sumStars(e) {
  var t,
    n = 0;
  for (t in e)
    e.hasOwnProperty(t) &&
      (n +=
        e[t].solvecons_5 +
        e[t].solvecons_10 +
        e[t].solvecons_20 +
        e[t].solvecons_50 +
        e[t].solvecons_100);
  return numberWithCommas(n);
}
function getPermalink4(e) {
  $.post("/permalink.php", {
    size: Game.plSize,
    state: JSON.stringify(Game.getSaveState()),
    img: e,
  }).done(function (e) {
    var t =
        "https://" +
        window.location.hostname +
        window.location.pathname +
        "?pl=" +
        e,
      e = "https://" + window.location.hostname + "/screenshots/" + e + ".png",
      n =
        "https://" +
        window.location.hostname +
        window.location.pathname +
        "?e=" +
        btoa(Game.plSize + ":" + Game.getSetting("puzzleID")),
      i =
        '<iframe width="' +
        (Game.getBoardWidth() + 130) +
        '" height="' +
        (Game.getBoardHeight() + 300) +
        '" src="' +
        n +
        '" frameborder="0" />';
    ($("#shareLinkInput").val(t),
      $("#shareImgInput").val(e),
      $("#shareEmbedURLInput").val(n),
      $("#shareEmbedInput").val(i),
      $("#shareContainer").show(),
      $("#shareContainerElements").show(),
      $("#shareContainerLoader").hide());
  });
}
function getPermalink3() {
  html2canvas($("#puzzleContainer")[0]).then(function (e) {
    getPermalink4(e.toDataURL("png"));
  });
}
function getPermalink2() {
  "undefined" == typeof html2canvas
    ? $.cachedScript("/js/html2canvas-v1.0.0.min.js").done(function (e, t) {
        getPermalink3();
      })
    : getPermalink3();
}
function getPermalink1() {
  "undefined" == typeof Promise
    ? $.cachedScript("/js/es6-promise-4.1.1.auto.min.js").done(function (e, t) {
        getPermalink2();
      })
    : getPermalink2();
}
((jQuery.cachedScript = function (e, t) {
  return (
    (t = $.extend(t || {}, {
      dataType: "script",
      cache: !0,
      url: e,
    })),
    jQuery.ajax(t)
  );
}),
  $(document).ready(function () {
    $("#btnShare").click(function (e) {
      (e.preventDefault(),
        window.scrollBy(0, 50),
        $("#shareContainer").show(),
        $("#shareContainerElements").hide(),
        $("#shareContainerLoader").show(),
        getPermalink1());
    });
  }));
var Dialog = {
    closeDialogButton: null,
    dialogOverlay: null,
    dialog: null,
    dialogContent: null,
    body: null,
    scrollThreshold: 12,
    lastFocusedElement: null,
    lastLoadedContent: null,
    overlayListener: null,
    closeListener: null,
    keyListener: null,
    scrollListener: null,
    closeOnEsc: !0,
    closeOnOverlay: !0,
    init: function () {
      ((this.closeDialogButton = document.getElementById("closeDialog")),
        (this.dialogOverlay = document.getElementById("dialogOverlay")),
        (this.dialog = document.getElementById("dialog")),
        this.dialog &&
          ((this.dialogContent = this.dialog.querySelector(".dialog-content")),
          (this.body = document.body),
          (this.overlayListener = this.dialogOverlay
            ? this.dialogOverlay.addEventListener("click", (e) => {
                e.target === Dialog.dialogOverlay &&
                  Dialog.closeOnOverlay &&
                  Dialog.close();
              })
            : null),
          (this.closeListener = this.closeDialogButton
            ? this.closeDialogButton.addEventListener("click", () => {
                Dialog.close();
              })
            : null),
          (this.keyListener = document.addEventListener("keydown", (e) => {
            "Escape" === e.key && Dialog.closeOnEsc && Dialog.close();
          })),
          $(document).on("click", "[data-dialog]", function (e) {
            var t = this.getAttribute("data-dialog"),
              n = this.getAttribute("href") || this.getAttribute("data-href");
            n &&
              (e.preventDefault(),
              "iframe" === t
                ? Dialog.open({
                    event: e,
                    type: "iframe",
                    content: n,
                  })
                : Dialog.open({
                    event: e,
                    content: n,
                  }));
          })));
    },
    open: function (t) {
      if ((this.dialog || this.init(), this.dialog)) {
        $t = this;
        var n,
          i = document.activeElement;
        try {
          this.lastFocusedElement =
            i && i.matches && i.matches(":focus-visible") ? i : null;
        } catch (e) {
          this.lastFocusedElement = null;
        }
        (this.body.classList.add("has-dialog-active"),
          this.dialog.setAttribute("tabindex", "-1"),
          this.dialog.classList.remove("dialog--iframe"),
          (this.closeOnEsc = !1 !== t.closeOnEsc),
          (this.closeOnOverlay = !1 !== t.closeOnOverlay),
          this.dialog.classList.toggle(
            "dialog--persistent",
            !this.closeOnEsc && !this.closeOnOverlay,
          ),
          (this.dialogContent.innerHTML = "Loading..."),
          this.dialogContent.classList.remove("dialog-content--is-scrolled"),
          (this.dialogContent.scrollTop = 0),
          this.setTitle(t.title || ""),
          (this.onContentLoaded = t.onContentLoaded || null),
          "iframe" === t.type
            ? (((i = document.createElement("iframe")).src = t.content),
              i.setAttribute("frameborder", "0"),
              i.setAttribute("allowfullscreen", ""),
              i.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              ),
              (this.dialogContent.innerHTML = ""),
              this.dialogContent.appendChild(i),
              this.dialog.classList.add("dialog--iframe"),
              this.onContentLoaded && this.onContentLoaded(this.dialogContent))
            : ((i =
                t.content.startsWith("http") || t.content.startsWith("/")) ||
                ((n = document.querySelector(t.content)) &&
                  ((this.dialogContent.innerHTML = n.innerHTML),
                  this.onContentLoaded &&
                    this.onContentLoaded(this.dialogContent),
                  window.MVVM && MVVM.apply(),
                  this.setupScrollListener())),
              i && this.loadContent(t.content)),
          t.event?.target &&
            t.event.target.setAttribute("aria-expanded", "true"));
        let e = () => {
          (this.dialog.focus(),
            this.dialogOverlay.removeEventListener("transitionend", e));
        };
        this.dialogOverlay.addEventListener("transitionend", e, {
          once: !0,
        });
      }
    },
    loadContent: function (e) {
      var t = this;
      ((this.dialogContent.innerHTML = "Loading..."),
        $.ajax(e).done(function (e) {
          ($(t.dialog).find(".dialog-content").html(e),
            window.assetBase &&
              $(t.dialogContent)
                .find('img[src^="/images/"]')
                .each(function () {
                  this.src = window.assetBase + this.getAttribute("src");
                }),
            t.onContentLoaded && t.onContentLoaded(t.dialogContent),
            window.MVVM && MVVM.apply(),
            t.setupScrollListener());
        }));
    },
    setTitle: function (e) {
      this.dialog.querySelector(".dialog-title").textContent = e;
    },
    setupScrollListener: function () {
      (this.scrollListener &&
        this.dialogContent.removeEventListener("scroll", this.scrollListener),
        (this.scrollListener = () => {
          this.dialogContent.scrollTop > this.scrollThreshold
            ? this.dialogContent.classList.add("dialog-content--is-scrolled")
            : this.dialogContent.classList.remove(
                "dialog-content--is-scrolled",
              );
        }),
        this.dialogContent.addEventListener("scroll", this.scrollListener));
    },
    close: function () {
      this.dialog &&
        this.body.classList.contains("has-dialog-active") &&
        (this.body.classList.remove("has-dialog-active"),
        this.dialog.removeAttribute("tabindex"),
        this.dialog.classList.remove("dialog--iframe"),
        this.dialog.classList.remove("dialog--persistent"),
        (this.closeOnEsc = !0),
        (this.closeOnOverlay = !0),
        (this.dialogContent.innerHTML = ""),
        this.scrollListener &&
          this.dialogContent &&
          (this.dialogContent.removeEventListener(
            "scroll",
            this.scrollListener,
          ),
          this.dialogContent.classList.remove("dialog-content--is-scrolled"),
          (this.dialogContent.scrollTop = 0)),
        this.lastFocusedElement) &&
        (this.lastFocusedElement.setAttribute("aria-expanded", "false"),
        this.lastFocusedElement.focus());
    },
  },
  lgCounter =
    ($(function () {
      Dialog.init();
    }),
    0);
function lg(e) {
  var t = document.getElementById("lg");
  t.innerHTML = ++lgCounter + e + "<br>" + t.innerHTML;
}
function togglePasswordVisibility(e) {
  (e.preventDefault(),
    (e.target.icon = "eye-closed" === e.target.icon ? "eye" : "eye-closed"));
  e = e.target.closest(".text-field").querySelector("input");
  e && (e.type = "password" === e.type ? "text" : "password");
}
function hideGlobalNotifications() {
  ($(".global-alert-info").removeClass("show").find(".message").html(""),
    $(".global-alert-success").removeClass("show").find(".message").html(""),
    $(".global-alert-error").removeClass("show").find(".message").html(""));
}
function showError(e, t) {
  hideGlobalNotifications();
  var n = $(".global-alert-error").addClass("show");
  (n.find(".message").html(e), n.find(".js-box-close-global").toggle(!t));
}
function showSuccess(e, t) {
  hideGlobalNotifications();
  var n = $(".global-alert-success").addClass("show");
  (n.find(".message").html(e), n.find(".js-box-close-global").toggle(!t));
}
function showInfo(e, t) {
  hideGlobalNotifications();
  var n = $(".global-alert-info").addClass("show");
  (n.find(".message").html(e), n.find(".js-box-close-global").toggle(!t));
}
function createCookie(e, t, n, i) {
  var o,
    r = "",
    s = "";
  (n &&
    ((o = new Date()).setTime(o.getTime() + 24 * n * 60 * 60 * 1e3),
    (r = "; expires=" + o.toUTCString())),
    i && (s = "; domain=." + i),
    (document.cookie = e + "=" + t + r + s + "; path=/"));
}
function readCookie(e) {
  for (
    var t = e + "=", n = document.cookie.split(";"), i = 0;
    i < n.length;
    i++
  ) {
    for (var o = n[i]; " " == o.charAt(0); ) o = o.substring(1, o.length);
    if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
  }
  return null;
}
function eraseCookie(e, t) {
  (createCookie(e, "", -1), createCookie(e, "", -1, t));
}
function init() {
  timer();
}
($(window).on("orientationchange resize", function (e) {
  Layout.setOrientation();
}),
  $(function () {
    ($(document).on("click", ".js-box-close", function () {
      $(this).parent().hide();
    }),
      $(document).on("requestdismiss", "puzzle-banner", function () {
        $(this).hide();
      }),
      $(".js-box-close-global").on("click", function () {
        hideGlobalNotifications();
      }));
  }),
  $.ajaxSetup({
    xhrFields: {
      withCredentials: !0,
    },
    beforeSend: function (e) {
      localStorage.getItem("api_token")
        ? e.setRequestHeader("authorization", localStorage.getItem("api_token"))
        : Get_Cookie("api_token") &&
          e.setRequestHeader("authorization", Get_Cookie("api_token"));
    },
  }),
  $(document).ajaxComplete(function (e, t, n) {
    t.responseJSON &&
      (t.responseJSON.user && User.load(t.responseJSON.user), MVVM) &&
      MVVM.apply();
  }),
  ($.fn.panzoom = function (e) {}));
var browserPrefixes = ["moz", "ms", "o", "webkit"],
  isVisible = !0;
function getHiddenPropertyName(e) {
  return e ? e + "Hidden" : "hidden";
}
function getVisibilityEvent(e) {
  return (e || "") + "visibilitychange";
}
function getBrowserPrefix() {
  for (var e = 0; e < browserPrefixes.length; e++)
    if (getHiddenPropertyName(browserPrefixes[e]) in document)
      return browserPrefixes[e];
  return null;
}
var browserPrefix = getBrowserPrefix(),
  hiddenPropertyName = getHiddenPropertyName(browserPrefix),
  visibilityEventName = getVisibilityEvent(browserPrefix);
function onVisible() {
  isVisible ||
    ((isVisible = !0), "undefined" == typeof Game) ||
    Settings.get("global.hide-timer") ||
    Game.resumeTimer();
}
function onHidden() {
  isVisible &&
    ((isVisible = !1),
    "undefined" == typeof Game ||
      Settings.get("global.hide-timer") ||
      Game.pauseTimer());
}
function handleVisibilityChange(e) {
  return (
    "boolean" == typeof e
      ? e
        ? onVisible
        : onHidden
      : document[hiddenPropertyName]
        ? onHidden
        : onVisible
  )();
}
(document.addEventListener(visibilityEventName, handleVisibilityChange, !1),
  document.addEventListener(
    "focus",
    function () {
      handleVisibilityChange(!0);
    },
    !1,
  ),
  document.addEventListener(
    "blur",
    function () {
      handleVisibilityChange(!1);
    },
    !1,
  ),
  window.addEventListener(
    "focus",
    function () {
      handleVisibilityChange(!0);
    },
    !1,
  ),
  window.addEventListener(
    "blur",
    function () {
      handleVisibilityChange(!1);
    },
    !1,
  ));
var Layout = {
  portrait: !0,
  setOrientation: function () {
    ((this.portrait = window.innerHeight > window.innerWidth),
      $("body")
        .toggleClass("landscape", !this.portrait)
        .toggleClass("portrait", this.portrait)
        .toggleClass("lefthanded", Settings.get("global.left-handed")),
      setZoom(getZoom()));
  },
  init: function () {
    this.setOrientation();
    var e = Get_Cookie("nightMode"),
      t = Settings.get("puzzleSettings.global.night-mode");
    !e && t && switchNightMode(1);
  },
  scrollTop: function () {
    return (
      window.scrollY ||
      (document.documentElement ? document.documentElement.scrollTop : 0)
    );
  },
  scrollLeft: function () {
    return (
      window.scrollX ||
      (document.documentElement ? document.documentElement.scrollLeft : 0)
    );
  },
  clientWidth: function () {
    return document.body.clientWidth;
  },
  clientHeight: function () {
    return window.innerHeight;
  },
  isSubscriber: function () {
    return $("body").hasClass("subscriber");
  },
  toggleHeader: function () {
    ($("body").toggleClass("header-hidden"),
      window.gtag &&
        gtag("event", "layout", {
          name: "Header",
          value: this.hiddenHeader() ? "hide" : "show",
        }));
  },
  hiddenHeader: function () {
    return !0;
  },
  getBottomBannerHeight: function () {
    return $("body").hasClass("subscriber") ? 0 : 50;
  },
  getTopOffset: function () {
    return 0;
  },
  getBottomOffset: function () {
    return 0;
  },
  getLeftOffset: function () {
    return 0;
  },
  getRightOffset: function () {
    return 0;
  },
  isZenMode: function () {
    return !1;
  },
  isNightMode: function () {
    return +Util.getCookie("nightMode");
  },
};
function filterPuzzles(e) {
  var t = e.toLowerCase();
  $("#moreGamesLinks .banner").each(function () {
    var e = $(this);
    -1 === e.text().toLowerCase().indexOf(t) ? e.hide() : e.show();
  });
}
function toggleSearchClear(e) {
  var t = document.getElementById("clearSearch");
  t && t.classList.toggle("text-field__action--hidden", !e.value);
}
function clearGameSearch() {
  var e = document.getElementById("searchGame");
  e && ((e.value = ""), e.focus(), toggleSearchClear(e), filterPuzzles(""));
}
((window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}),
  $(window).on("resize", function () {
    decideAdSize();
  }),
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".banner").forEach(function (e) {
      e.addEventListener("click", function (e) {
        var t;
        User &&
          User.logged &&
          (e.preventDefault(),
          ((e = document.createElement("form")).method = "POST"),
          (e.action = this.href),
          ((t = document.createElement("input")).type = "hidden"),
          (t.name = "api_token"),
          (t.value = User.api_token),
          e.appendChild(t),
          document.body.appendChild(e),
          e.submit());
      });
    });
  }));
var MVVM = {
  apply: function () {
    ($("[mvvm-text]").each(function () {
      var t = $(this);
      try {
        var val = eval(t.attr("mvvm-text"));
        t.text(void 0 === val ? "" : val);
      } catch (e) {
        t.text("");
      }
    }),
      $("[mvvm-show]").each(function () {
        var t = $(this),
          val = eval(t.attr("mvvm-show"));
        t.toggle(void 0 !== val && !!val);
      }),
      $("[mvvm-value]").each(function () {
        var t = $(this),
          val = eval(t.attr("mvvm-value"));
        t.val(void 0 === val ? "" : val);
      }),
      $("[mvvm-checked]").each(function () {
        var t = $(this),
          val = eval(t.attr("mvvm-checked"));
        t.attr("checked", void 0 !== val && !!val);
      }),
      $("[mvvm-selected]").each(function () {
        try {
          var t = $(this),
            val = eval(t.attr("mvvm-selected"));
          t.val(val);
        } catch (e) {}
      }),
      $("[mvvm-class]").each(function () {
        for (
          var t = $(this), attr = t.attr("mvvm-class").split("|"), i = 0;
          i < attr.length;
          i++
        ) {
          var cls = attr[i].split(":");
          try {
            var val = eval(cls[1]);
            t.toggleClass(cls[0], void 0 !== val && !!val);
          } catch (e) {
            t.toggleClass(cls[0], !1);
          }
        }
      }),
      $("[mvvm-css]").each(function () {
        for (
          var t = $(this), attr = t.attr("mvvm-css").split("|"), i = 0;
          i < attr.length;
          i++
        ) {
          var css = attr[i].split(":");
          try {
            2 < css.length && (css[1] = css.splice(1).join(":"));
            var val = eval(css[1]);
            t.css(css[0], void 0 === val ? "auto" : val);
          } catch (e) {}
        }
      }),
      $("[mvvm-attr]").each(function () {
        for (
          var t = $(this), attr = t.attr("mvvm-attr").split("|"), i = 0;
          i < attr.length;
          i++
        ) {
          var parts = attr[i].split(":");
          try {
            var val = eval(parts[1]);
            void 0 !== val && val
              ? t.attr(parts[0], "true")
              : t.removeAttr(parts[0]);
          } catch (e) {
            t.removeAttr(parts[0]);
          }
        }
      }));
  },
};
function removeCheckpoint(e) {
  (Game.removeCheckpoint(e), updateCheckpoints());
}
function updateCheckpoints() {
  if (
    ($("#checkpointsHolder .checkpoints").html("&nbsp;"),
    Game.checkpoints && Game.checkpoints.length)
  )
    for (var e = 0; e < Game.checkpoints.length; e++) {
      var t = $(
        '<div class="checkpoint' +
          (Game.checkpoints[e].current ? " last" : "") +
          '" onmousedown="if(event.which == 3) {removeCheckpoint(' +
          e +
          ");} else {Game.loadCheckpoint(" +
          e +
          ');updateCheckpoints();}">' +
          (e + 1) +
          '<div class="close icon-cancel" onmousedown="if ((event.which == 3) || confirm(labelAreYouSure)) {removeCheckpoint(' +
          e +
          ');}event.stopPropagation()"></div></div>',
      );
      $("#checkpointsHolder .checkpoints").append(t);
    }
}
(String.prototype.repeat ||
  (String.prototype.repeat = function (e) {
    if (null == this)
      throw new TypeError("can't convert " + this + " to object");
    var t = "" + this;
    if ((e = (e = +e) != e ? 0 : e) < 0)
      throw new RangeError("repeat count must be non-negative");
    if (e == 1 / 0)
      throw new RangeError("repeat count must be less than infinity");
    if (((e = Math.floor(e)), 0 == t.length || 0 == e)) return "";
    if (1 << 28 <= t.length * e)
      throw new RangeError(
        "repeat count must not overflow maximum string size",
      );
    for (var n = "", i = 0; i < e; i++) n += t;
    return n;
  }),
  String.prototype.startsWith ||
    (String.prototype.startsWith = function (e, t) {
      return this.substr((t = t || 0), e.length) === e;
    }),
  $(function () {
    var e = document.getElementById("controlsHolderPlace"),
      t = document.getElementById("controlsHolder");
    e &&
      t &&
      new IntersectionObserver(
        function (e) {
          ((e = e[0]), (e = !e.isIntersecting && e.boundingClientRect.top < 0));
          document.body.classList.toggle("fixedScrollControls", e);
        },
        {
          threshold: 0,
        },
      ).observe(e);
  }));
var toggleColorSetting = 0,
  StateSync =
    ((() => {
      ($(function () {
        var i = !1,
          o = {
            left: 0,
            top: 0,
            mouseX: 0,
            mouseY: 0,
          };
        function t() {
          i = !1;
        }
        ($("#game").on("mousedown", function (e) {
          if (1 == e.button)
            return (
              (e = e),
              (t = $("#puzzleContainerOverflowDiv")),
              (i = !0),
              (o.left = t.scrollLeft()),
              (o.top = $(window).scrollTop()),
              (o.mouseX = e.clientX),
              (o.mouseY = e.clientY),
              !1
            );
          var t;
        }),
          $("#game").on("mouseup", function (e) {
            1 == e.button && t();
          }),
          $("#game").on("mouseleave", function (e) {
            t();
          }),
          $("#game").on("mousemove", function (e) {
            if (i)
              return (
                (e = e),
                (t = $("#puzzleContainerOverflowDiv")),
                (n = e.clientX - o.mouseX),
                (e = e.clientY - o.mouseY),
                t.scrollLeft(o.left - n),
                $(window).scrollTop(o.top - e),
                !0
              );
            var t, n;
          }));
      }),
        $(document).ready(function () {
          "undefined" != typeof Game &&
            ($(document).on("keydown", function (e) {
              if (
                (13 == e.which &&
                  (e.preventDefault(), jQuery("#btnReady").focus().click()),
                (187 != e.which && 61 != e.which) ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  (e.preventDefault(), jQuery("#btnNew").focus().click()),
                83 == e.which &&
                  e.ctrlKey &&
                  (e.shiftKey ? Game.addCheckpoint() : Game.saveCheckpoint(),
                  updateCheckpoints(),
                  e.preventDefault(),
                  (Game.inputMode = "mouse"),
                  Game.toggleClass("kbd", !1),
                  Game.cancelMove()),
                $(e.target).is("input"))
              )
                return !0;
              (90 == e.which &&
                (e.shiftKey ? Game.redo() : Game.undo(), e.preventDefault()),
                ((89 == e.which && e.ctrlKey) || 88 == e.which) &&
                  (Game.redo(), e.preventDefault()));
            }),
            $("#game").on("keydown", function (e) {
              0;
            }),
            $(document).on("keyup", function (e) {
              0;
            }),
            $(document).on("keydown", function (e) {
              var t = (e.target.tagName || "").toLowerCase();
              "input" === t ||
                "textarea" === t ||
                "select" === t ||
                e.target.isContentEditable ||
                (48 <= e.which &&
                  e.which <= 57 &&
                  $(".footer-buttons-holder:visible").length &&
                  ((t = e.which - 48), (t = $("[accesskey='" + t + "']"))) &&
                  t.click(),
                221 == e.which &&
                  $("#color-switch").length &&
                  $(".footer-buttons-holder:visible").length &&
                  ("color" == Settings.get(Game.slug + ".draw-style")
                    ? toggleColorSetting &&
                      Settings.set(
                        Game.slug + ".draw-style",
                        toggleColorSetting,
                      )
                    : ((toggleColorSetting = Settings.get(
                        Game.slug + ".draw-style",
                      )),
                      Settings.set(Game.slug + ".draw-style", "color"))));
            }),
            $("#puzzleContainerOverflowDiv").on("scroll", function () {
              "keyboard" != Game.inputMode &&
                (Game.cancelMove(!0), Game.comboHelperTimeout) &&
                window.clearTimeout(Game.comboHelperTimeout);
            }),
            $(document).on("scroll", function () {
              "keyboard" != Game.inputMode &&
                (Game.cancelMove(!0), Game.comboHelperTimeout) &&
                window.clearTimeout(Game.comboHelperTimeout);
            }));
        }),
        $("#btnUndo, #btnRedo").bind("touchend", function (e) {
          (e.preventDefault(), $(this).click());
        }));
      var e = null,
        t = null;
      function n() {
        (e && (clearInterval(e), (e = null)),
          t && (clearInterval(t), (t = null)));
      }
      function i() {
        (Game.undo(), n(), (e = setInterval(i, 150)));
      }
      function o() {
        (Game.redo(), n(), (t = setInterval(o, 150)));
      }
      ($(document).on("mousedown touchstart", "#btnUndo", function () {
        (n(), (e = setInterval(i, 500)));
      }),
        $(document).on("mousedown touchstart", "#btnRedo", function () {
          (n(), (t = setInterval(o, 500)));
        }),
        $(document).on("contextmenu", "#btnUndo, #btnRedo", function (e) {
          e.preventDefault();
        }),
        $(document).on("mouseup touchend touchcancel", n),
        window.history.replaceState &&
          window.history.replaceState(null, null, window.location.href));
    })(),
    (window.puzzle = function (c) {
      ((this.maxColumnNumbers = 0),
        (this.maxRowNumbers = 0),
        (this.task = []),
        (this.currentState = {
          cellStatus: [],
          taskStatus: [],
          lastMove: {},
          index: 0,
          solved: 0,
        }),
        (this.currentMove = {
          cellStatus: 0,
          startPoint: {
            row: 0,
            col: 0,
          },
          endPoint: {
            row: 0,
            col: 0,
          },
          cells: [],
        }),
        (this.states = []),
        (this.dom = {}),
        (this.panTimeThreshold = c.panTimeThreshold || Config.panTimeThreshold),
        (this.zoomingPanning = !1),
        (this.solved = !1),
        (this.drawing = !1),
        (this.mouseDown = !1),
        (this.dragMonitor = {
          decision: "unknown",
          timeStart: 0,
          touchstartX: 0,
          touchstartY: 0,
        }),
        (this.boardWidth = 0),
        (this.boardHeight = 0),
        (this.lastAppliedScale = 1),
        (this.accumulated = 0),
        (this.paused = 0),
        (this.forcePaused = 0),
        (this.lastTrackedTime = window.__pageStartMs || new Date().getTime()),
        (this.inputMode = "mouse"),
        (this.checkpoints = []),
        (this.chessCoordinates = !1),
        (this.statesMap = ["n", "y", "x"]),
        (this.serializers = ["serializeBoardState"]),
        (this.unserializers = ["loadState"]),
        (this.shiftPressed = 0),
        (this.getBoardWidth = function () {}),
        (this.getBoardHeight = function () {}),
        (this.getTransform = function (e) {
          e = e.css("transform").match(/matrix\((.*)\)/);
          return e ? e[1].split(",") : [0, 0, 0, 0, 0, 0];
        }),
        (this.getScale = function () {
          try {
            var e = this.css("transform")
                .match(/matrix\((.*)\)/)[1]
                .split(","),
              t = parseFloat(e[0]);
            parseFloat(this.css("zoom"));
            return (t = t || 1);
          } catch (e) {
            return 1;
          }
        }),
        (this.decodeChar = function (e) {
          return e.charCodeAt(0) - 96;
        }),
        (this.toChar = function (e) {
          return parseInt(e).toString(20).toUpperCase();
        }),
        (this.colName = function (e) {
          for (
            var t = "a".charCodeAt(0), n = "z".charCodeAt(0) - t + 1, i = "";
            0 <= e;
          )
            ((i = String.fromCharCode((e % n) + t) + i),
              (e = Math.floor(e / n) - 1));
          return i;
        }),
        (this.decodeTaskFormat = function (e, t) {
          for (var n = [], i = 0, o = 0; o < e.length; o++)
            if ($.isNumeric(e[o])) {
              for (var r = ""; $.isNumeric(e[o]); ) ((r += "" + e[o]), o++);
              (o--, (n[i] = t ? this.toChar(r) : parseInt(r)), i++);
            } else "_" != e[o] && (i += this.decodeChar(e[o]));
          return n;
        }),
        (this.inside = function (e, t) {
          return (
            0 <= e && 0 <= t && t < this.puzzleWidth && e < this.puzzleHeight
          );
        }),
        (this.rowFromIndex = function (e) {
          return Math.floor(e / c.puzzleWidth);
        }),
        (this.colFromIndex = function (e) {
          return e % c.puzzleWidth;
        }),
        (this.rowColFromIndex = function (e) {
          return {
            row: this.rowFromIndex(e),
            col: this.colFromIndex(e),
          };
        }),
        (this.cellIndex = function (e) {
          return e.row * c.puzzleWidth + e.col;
        }),
        (this.parseTask = function () {}),
        (this.setCellState = function (e, t) {
          (this.DEBUG, (this.currentState.cellStatus[e.row][e.col] = t));
        }),
        (this.applyCurrentMoveToState = function () {
          this.DEBUG;
          for (var e = this.currentMove.cells.length, t = 0; t < e; t++) {
            var n = this.currentMove.cells[t];
            this.setCellState(n, this.currentMove.cellStatus);
          }
          ((this.currentState.lastMove = Util.clone(this.currentMove)),
            this.storeCurrentState());
        }),
        (this.resetCurrentMoveDraw = function () {
          this.DEBUG;
          for (var e = this.currentMove.cells.length, t = 0; t < e; t++) {
            var n = this.currentMove.cells[t];
            this.drawCellStatus(n, this.getCurrentStatus(n));
          }
        }),
        (this.helpersVisualizeMove = function () {}),
        (this.hideMoveHelpers = function () {
          this.dom.helperNumberOfDrawnCells.hide();
        }),
        (this.drawCurrentMove = function () {
          this.DEBUG;
          for (var e = this.currentMove.cells.length, t = 0; t < e; t++) {
            var n = this.currentMove.cells[t];
            this.drawCellStatus(n, this.currentMove.cellStatus);
          }
          this.helpersVisualizeMove();
        }),
        (this.initCurrentMove = function () {
          (this.DEBUG,
            (this.currentMove = {
              cellStatus: 0,
              startPoint: {
                row: 0,
                col: 0,
              },
              endPoint: {
                row: 0,
                col: 0,
              },
              cells: [],
            }));
        }),
        (this.cancelMove = function () {
          (this.DEBUG,
            this.resetCurrentMoveDraw(),
            this.initCurrentMove(),
            this.hideMoveHelpers());
        }),
        (this.getCurrentStatus = function (e) {
          return this.currentState.cellStatus[e.row][e.col];
        }),
        (this.getNextStatus = function (e, t) {
          e = this.getCurrentStatus(e);
          return "rotate" == Settings.get(this.slug + ".draw-style")
            ? (t ? e-- : e++, (e + 3) % 3)
            : "white" == Settings.get(this.slug + ".draw-style")
              ? 0
              : "black" == Settings.get(this.slug + ".draw-style")
                ? t
                  ? 2 == e
                    ? 0
                    : 2
                  : 1 == e
                    ? 0
                    : 1
                : "cross" == Settings.get(this.slug + ".draw-style")
                  ? t
                    ? 1 == e
                      ? 0
                      : 1
                    : 2 == e
                      ? 0
                      : 2
                  : e;
        }),
        (this.helpers = function () {
          this.DEBUG;
        }),
        (this.helpersModifyState = function () {
          this.DEBUG;
        }),
        (this.helpersVisualizeState = function () {
          this.DEBUG;
        }),
        (this.startMove = function (e, t, n) {
          (this.DEBUG,
            this.initCurrentMove(),
            (this.drawing = !0),
            (this.currentMove.invert = void 0 !== t && t),
            (this.currentMove.cellStatus = this.getNextStatus(e, t)),
            (this.currentMove.startPoint = {
              row: e.row,
              col: e.col,
            }),
            (this.currentMove.endPoint = {
              row: e.row,
              col: e.col,
            }),
            this.currentMove.cells.push({
              row: e.row,
              col: e.col,
            }),
            n && this.drawCurrentMove());
        }),
        (this.performMove = function (e) {}),
        (this.onEndMove = function () {
          this.DEBUG;
        }),
        (this.endMove = function () {
          (this.DEBUG,
            this.zoomingPanning ||
              (this.applyCurrentMoveToState(),
              this.helpersModifyState(),
              this.onEndMove(),
              this.drawCurrentState(),
              this.hideMoveHelpers(),
              this.checkFinished()),
            (this.drawing = !1));
        }),
        (this.getNumberOfDrawnCells = function () {
          return "implement me";
        }),
        (this.showHelperNumberOfDrawnCells = function (e, t, n, i, o) {
          ((i = i || this.dom.helperNumberOfDrawnCells.width()),
            (o = o || this.dom.helperNumberOfDrawnCells.height()));
          var r,
            s,
            a = document.documentElement.clientWidth / window.innerWidth,
            t =
              (a < 1 && (a = 1),
              c.relativeTo &&
                ((r = $(c.relativeTo).offset()),
                (e += Layout.scrollLeft() - r.left),
                (t -= r.top)),
              t -
                100 / a -
                o / a +
                (Layout.hiddenHeader() ? Config.headerHeight / a : 0)),
            o = 0,
            l = 0;
          (s < 50 && (o = 17),
            c.relativeTo && ((o = -r.top), (l = -r.left)),
            Settings.get("global.left-handed")
              ? ((s = e + i / a),
                (r = Layout.clientWidth()),
                Layout.portrait || (r -= Config.sidebarWidth),
                c.relativeTo || (r < s + i + 5 && (s = r - i - 5)))
              : (s = e - i / a - 15 / a) < l && (s = l),
            c.relativeTo
              ? (t += Layout.scrollTop()) < Layout.scrollTop() + o &&
                (t = Layout.scrollTop() + o)
              : t < Layout.getTopOffset() && (t = Layout.getTopOffset()),
            this.dom.helperNumberOfDrawnCells
              .show()
              .css({
                top: t + "px",
                left: s + "px",
              })
              .html(n),
            a != this.lastAppliedScale &&
              (1 != a
                ? this.dom.helperNumberOfDrawnCells.css({
                    transform: "scale(" + 1 / a + ")",
                  })
                : this.dom.helperNumberOfDrawnCells.css({
                    transform: "none",
                  }),
              (this.lastAppliedScale = a)));
        }),
        (this.drawHelperNumberOfDrawnCells = function (e, t) {
          var n;
          this.currentMove.cellStatus &&
            (n = this.getNumberOfDrawnCells()) &&
            this.showHelperNumberOfDrawnCells(e, t, n);
        }),
        (this.initNumberOfDrawnCellsHelper = function () {
          0 == $(".helper-nodc").length &&
            ((this.dom.helperNumberOfDrawnCells = $(
              '<div class="helper-nodc">',
            ).css({
              position: "absolute",
              top: "100px",
              left: "100px",
              "z-index": "1000",
            })),
            c.relativeTo
              ? $(c.relativeTo).after(this.dom.helperNumberOfDrawnCells)
              : $("#scene").append(this.dom.helperNumberOfDrawnCells));
        }),
        (this.highlightCell = function (e, t) {
          this.dom.cells[e.row][e.col].addClass(t);
        }),
        (this.drawHelperHighlightMove = function (e) {
          if (
            Settings.get(this.slug + ".highlight-change") &&
            ($(".cell-active").removeClass("cell-active"), e.cells)
          )
            for (var t = 0; t < e.cells.length; t++)
              this.highlightCell(e.cells[t], "cell-active");
        }),
        (this.initCrosshairHelper = function () {
          (0 == $(".helper-crosshair").length &&
            ((this.dom.helperCrosshair = $(
              '<div class="helper-crosshair"><i class="icon icon-cursor"></i><i class="icon icon-move"></i><div class="crosshair-btn"></div></div>',
            )),
            $("#scene").append(this.dom.helperCrosshair)),
            Settings.get(this.slug + ".show-crosshair")
              ? (this.dom.helperCrosshair.show(), this.fitCrosshair())
              : this.dom.helperCrosshair.hide());
        }),
        (this.drawCellStatus = function (e, t) {}),
        (this.drawCurrentStateInternal = function () {
          this.DEBUG;
        }),
        (this.drawCurrentState = function () {
          (this.DEBUG,
            this.drawCurrentStateInternal(),
            this.helpersVisualizeState());
        }),
        (this.draw = function () {}),
        (this.getFitMatrix = function (e) {
          var t = 1,
            n =
              (Settings.get(this.slug + ".saved-scale") &&
                (t = Settings.get(this.slug + ".saved-scale")),
              this.parent()[0].getBoundingClientRect()),
            i =
              n.height -
              Config.headerHeight -
              Config.scenePaddingBottom -
              Layout.getBottomBannerHeight() -
              30,
            o = n.width,
            r =
              (Layout.portrait
                ? (i -= Config.footerHeight)
                : (o -= Config.sidebarWidth),
              this.boardWidth),
            s = this.boardHeight,
            e =
              (e ||
                ((t = o < r * t || i < s * t ? Math.min(o / r, i / s) : t) <
                  c.minScale &&
                  (t = c.minScale)),
              (o - this.boardWidth) / 2),
            r =
              ((t - 1) * this.boardHeight) / 2 +
              (Config.headerHeight - Config.paddingTop);
          return (
            (r += Layout.portrait ? 100 : 75),
            "matrix(" +
              t +
              ", 0, 0, " +
              t +
              ", " +
              e +
              ", " +
              Math.max(
                (n.height - (Layout.portrait ? Config.footerHeight : 0)) / 2 -
                  s / 2 +
                  Config.headerHeight / 2 -
                  20,
                r,
              ) +
              ")"
          );
        }),
        (this.fitCrosshair = function () {
          window.PuzzlePanzoom && window.PuzzlePanzoom.fitCrosshair(this);
        }),
        (this.fit = function (e) {
          window.PuzzlePanzoom && window.PuzzlePanzoom.fit(this, e);
        }),
        (this.repositionHelpers = function () {}),
        (this.getCrosshairTarget = function () {
          var e = this.getTransform(this.dom.helperCrosshair),
            t = +e[4] - 1,
            e =
              (Settings.get("global.left-handed") &&
                (t = +e[4] + +Config.crosshairWidth + 1),
              e[5] - 1),
            n = $(document.elementFromPoint(t, e));
          return (
            (n =
              n.length && n.hasClass("selectable")
                ? n
                : this.findNearestCell(t, e, "selectable")) &&
              ((n.chLeft = t), (n.chTop = e)),
            n
          );
        }),
        (this.highlightCrosshairCell = function (e) {
          ($(".cell-crosshair").removeClass("cell-crosshair"),
            e.length && e.addClass("cell-crosshair"));
        }),
        (this.eventsCrosshairMove = function (e) {}),
        (this.crosshairPan = function () {
          var e = this.getCrosshairTarget();
          (this.highlightCrosshairCell(e),
            e.length && this.eventsCrosshairMove(e));
        }),
        (this.stateChangedBoard = function () {}),
        (this.stateChangedTask = function () {}),
        (this.stateChanged = function () {
          return (
            -1 == this.currentState.index ||
            !!this.stateChangedBoard() ||
            !!this.stateChangedTask()
          );
        }),
        (this.initState = function () {}),
        (this.resetState = function () {
          (this.initState(),
            this.initCurrentMove(),
            this.redraw(),
            c.onStateReset && c.onStateReset());
        }),
        (this.loadState = function (e) {}),
        (this.setState = function (e) {
          (this.DEBUG,
            this.loadState({
              board: e,
            }),
            this.drawCurrentState(),
            this.check());
        }),
        (this.restoreCurrentState = function () {
          ((this.currentState = Util.clone(
            this.states[this.currentState.index],
          )),
            this.drawCurrentState());
        }),
        (this.storeCurrentState = function (e) {
          (this.DEBUG,
            this.stateChanged() &&
              ((!e ||
                (0 < this.currentState.index &&
                  (this.currentState.index--, this.stateChanged()))) &&
                this.currentState.index++,
              (this.states[this.currentState.index] = Util.clone(
                this.currentState,
              )),
              this.states.splice(this.currentState.index + 1),
              this.saveState()));
        }),
        (this.undo = function () {
          var e, t;
          (this.DEBUG,
            this.currentState.index &&
              ((e = Util.clone(
                this.states[this.currentState.index].currentCell,
              )),
              (t = Util.clone(
                this.states[this.currentState.index].currentSelection,
              )),
              (this.drawing = !1),
              (this.currentState = Util.clone(
                this.states[this.currentState.index - 1],
              )),
              (this.currentState.currentCell = e),
              void 0 !== t && (this.currentState.currentSelection = t),
              this.cancelMove(),
              this.drawCurrentState(),
              this.saveState(!0)));
        }),
        (this.redo = function () {
          (this.DEBUG,
            this.states.length > this.currentState.index + 1 &&
              ((this.drawing = !1),
              (this.currentState = Util.clone(
                this.states[this.currentState.index + 1],
              )),
              this.cancelMove(),
              this.drawCurrentState(),
              this.saveState(!0)));
        }),
        (this._setCurrentCheckpoint = function (e) {
          for (var t = 0; t < this.checkpoints.length; t++)
            delete this.checkpoints[t].current;
          0 <= e &&
            e < this.checkpoints.length &&
            (this.checkpoints[e].current = !0);
        }),
        (this.addCheckpoint = function () {
          if (
            (this.checkpoints || (this.checkpoints = []),
            9 < this.checkpoints.length)
          )
            return !1;
          (this.checkpoints.push({
            ss: this.serializeStateCompressed(),
            index: this.currentState.index,
          }),
            this._setCurrentCheckpoint(this.checkpoints.length - 1),
            this.saveState(!0));
        }),
        (this.saveCheckpoint = function () {
          var e;
          (this.checkpoints || (this.checkpoints = []),
            this.checkpoints.length
              ? (-1 ===
                  (e = this.checkpoints.findIndex(function (e) {
                    return e.current;
                  })) && (e = this.checkpoints.length - 1),
                this.saveCheckpointAt(e))
              : this.addCheckpoint());
        }),
        (this.saveCheckpointAt = function (e) {
          !this.checkpoints ||
            e < 0 ||
            e >= this.checkpoints.length ||
            ((this.checkpoints[e] = {
              ss: this.serializeStateCompressed(),
              index: this.currentState.index,
              current: !0,
            }),
            this._setCurrentCheckpoint(e),
            this.saveState(!0));
        }),
        (this.removeCheckpoint = function (e) {
          var t,
            n = this.checkpoints.findIndex(function (e) {
              return e.current;
            });
          (this.checkpoints.splice(e, 1),
            n === e
              ? 0 <= (t = this.checkpoints.length - 1) &&
                this._setCurrentCheckpoint(t)
              : e < n
                ? this._setCurrentCheckpoint(n - 1)
                : this._setCurrentCheckpoint(n),
            this.saveState(!0));
        }),
        (this.loadCheckpoint = function (e) {
          this.DEBUG;
          var t,
            n = this.checkpoints[e];
          (void 0 !== this.states[n.index] &&
          n.ss == this.serializeStateCompressed(this.states[n.index])
            ? (this.unserializeStateCompressed(n.ss),
              (this.currentState.index = n.index))
            : ((t = this.states.length),
              this.unserializeStateCompressed(n.ss),
              (this.currentState.index = t),
              (this.checkpoints[e].index = t),
              (this.states[this.currentState.index] = Util.clone(
                this.currentState,
              ))),
            this._setCurrentCheckpoint(e),
            this.cancelMove(),
            this.drawCurrentState(),
            this.saveState(!0));
        }),
        (this.panzoomAction = function () {
          ((this.zoomingPanning = !0),
            Settings.set(this.slug + ".saved-scale", this.getScale()),
            this.cancelMove(),
            this.repositionHelpers(),
            window.zoomSliderUpdate && window.zoomSliderUpdate());
        }),
        (this.redraw = function () {
          (this.DEBUG,
            this.draw(),
            window.PuzzlePanzoom && window.PuzzlePanzoom.invalidate(this));
        }),
        (this.isCorner = function (e, t, n) {
          return (
            (t = t || c.squareSize),
            (n = n || 33),
            void 0 !== e.offsetX &&
              (e.offsetX + e.offsetY <= (n = (t * n) / 100) ||
                e.offsetX + t - e.offsetY <= n ||
                t - e.offsetX + e.offsetY <= n ||
                t - e.offsetX + t - e.offsetY <= n)
          );
        }),
        (this.findNearestCell = function (e, t, n) {
          for (
            var i = this.getScale() * c.separatorWidth,
              o = ((n = n || "cell"), !1),
              r = -i;
            r <= i;
            r += i
          )
            for (var s = -i; s <= i; s += i) {
              var a = $(document.elementFromPoint(e + r, t + s));
              if (a.hasClass(n)) {
                if (!r || !s || o) return a;
                o = a;
              }
            }
          return o;
        }),
        (this.getChangedTouch = function (e) {
          return "touchstart" == e.type || "touchmove" == e.type
            ? e.originalEvent.changedTouches[0]
            : e.originalEvent;
        }),
        (this.getOffset = function (e) {
          var t,
            n,
            i = this.getChangedTouch(e),
            o = parseFloat(this.css("zoom")) || 1;
          return (
            (e =
              "touchstart" == e.type || "touchmove" == e.type
                ? ((e = e.target.getBoundingClientRect()),
                  (t = this.getScale() * o),
                  (n = (i.pageX - e.left - Layout.scrollLeft()) / t),
                  (i.pageY - e.top - Layout.scrollTop()) / t)
                : ((n = i.offsetX / o), i.offsetY / o)),
            {
              offsetX: n,
              offsetY: e,
            }
          );
        }),
        (this.handleTouchStart = function (e) {}),
        (this.eventsTouchStart = function (e) {
          if ("touchstart" == e.type) {
            var t = e.originalEvent.changedTouches[0];
            if (
              1 < (e.touches || e.originalEvent.touches).length ||
              Settings.get($this.slug + ".show-crosshair") ||
              $this._caughtSlide
            )
              (($this.dragMonitor.decision = "panzoom"), $this.cancelMove());
            else {
              if ("draw" == Settings.get($this.slug + ".touch-mode"))
                $this.dragMonitor.decision = "draw";
              else {
                if ("move" == Settings.get($this.slug + ".touch-mode"))
                  return !($this.dragMonitor.decision = "panzoom");
                (($this.dragMonitor.timeStart = new Date().getTime()),
                  ($this.dragMonitor.touchstartX = t.clientX),
                  ($this.dragMonitor.touchstartY = t.clientY));
              }
              $this.handleTouchStart(e);
            }
          } else if (2 != e.which)
            return "move" == Settings.get($this.slug + ".touch-mode")
              ? !($this.dragMonitor.decision = "panzoom")
              : void $this.handleTouchStart(e);
        }),
        (this.eventsTouchMove = function (e) {}),
        (this.eventsTouchEnd = function (e) {}),
        (this.eventsClick = function (e) {}),
        (this.eventsMove = function (e) {}),
        (this.onMouseWheel = function (e) {
          window.PuzzlePanzoom &&
            (e.originalEvent || (e.originalEvent = e),
            $("body").hasClass("has-dialog-active") ||
              c.relativeTo ||
              (e.preventDefault(),
              window.PuzzlePanzoom.wheel($this, e.originalEvent)));
        }),
        (this.setPixelRatioZoom = function () {}),
        (this.initEventHandlers = function () {
          var e;
          ($this.setPixelRatioZoom(),
            ($this.lastResizeEvent = ""),
            ($this.lastResizeEvent1 = ""),
            $(window)
              .on("orientationchange.puzzle resize.puzzle", function (e) {
                (("orientationchange" != e.type && Util.isTouchDevice()) ||
                  window.setTimeout(function () {
                    ($this.fit(!0),
                      $this.panzoomAction(),
                      $this.setPixelRatioZoom());
                  }, 200),
                  ($this.lastResizeEvent1 = $this.lastResizeEvent),
                  ($this.lastResizeEvent = e.type));
              })
              .on("scroll.puzzle", function () {
                $this.panzoomAction();
              })
              .on(
                "DOMMouseScroll.puzzle MozMousePixelScroll.puzzle",
                this.onMouseWheel,
              ),
            document.addEventListener("mousewheel", this.onMouseWheel, {
              passive: !1,
            }),
            $this.fit(),
            $this.panzoomAction(),
            $this.on("mousedown.puzzle touchstart.puzzle", function (e) {
              c.readonly ||
                (($this.mouseDown = !0),
                ($this.zoomingPanning = !1),
                $this.eventsTouchStart(e));
            }),
            $this.on("dragstart.puzzle", function (e) {
              e.preventDefault();
            }),
            $this.attr("unselectable", "on").on("selectstart.puzzle", !1),
            $(document).on("mouseup.puzzle touchend.puzzle", function (e) {
              $this.eventsClick(e);
            }),
            $(document).on("mouseup.puzzle touchend.puzzle", function (e) {
              (void 0 !== e.buttons && 0 !== e.buttons) ||
                ($this.mouseDown &&
                  (e.preventDefault(),
                  "panzoom" != $this.dragMonitor.decision &&
                    "markTask" != $this.dragMonitor.decision &&
                    $this.endMove(),
                  ($this.mouseDown = !1),
                  ($this.dragMonitor = {
                    decision: "unknown",
                    timeStart: 0,
                    touchstartX: 0,
                    touchstartY: 0,
                  })),
                $this.eventsTouchEnd(e));
            }),
            $this.on(
              "touchmove.puzzle mousemove.puzzle pointerrawupdate.puzzle",
              function (e) {
                var t, n;
                (Util.isTouchDevice() && "pointerrawupdate" == e.type) ||
                  ($this.mouseDown
                    ? ((n = $this.getChangedTouch(e)),
                      (t =
                        "touchmove" == e.type
                          ? e.touches || e.originalEvent.touches
                          : [n]),
                      "unknown" == $this.dragMonitor.decision &&
                        1 == t.length &&
                        ((t =
                          new Date().getTime() - $this.dragMonitor.timeStart),
                        (n = Math.sqrt(
                          ($this.dragMonitor.touchstartX - n.clientX) *
                            ($this.dragMonitor.touchstartX - n.clientX) +
                            ($this.dragMonitor.touchstartY - n.clientY) *
                              ($this.dragMonitor.touchstartY - n.clientY),
                        )),
                        t < $this.panTimeThreshold &&
                        n > Config.panPixelThreshold
                          ? ($this.dragMonitor.decision = "panzoom")
                          : t > $this.panTimeThreshold &&
                            n < Config.panPixelThreshold &&
                            ($this.dragMonitor.decision = "draw")),
                      "panzoom" != $this.dragMonitor.decision &&
                        e.stopPropagation(),
                      "draw" == $this.dragMonitor.decision &&
                        (e.preventDefault(), $this.eventsTouchMove(e)))
                    : $this.eventsMove(e));
              },
            ),
            $this.on("keydown.puzzle", function (e) {
              "Shift" === e.key && ($this.shiftPressed = 1);
            }),
            $this.on("keyup.puzzle", function (e) {
              "Shift" === e.key && ($this.shiftPressed = 0);
            }),
            $this.dom.helperCrosshair
              .on("mousedown.puzzle touchstart.puzzle", function (e) {
                e.preventDefault();
              })
              .contextmenu(function () {
                return !1;
              }),
            $(".crosshair-btn")
              .on("mousedown.puzzle touchstart.puzzle", function (e) {
                var t;
                c.readonly ||
                  (e.preventDefault(),
                  (t = $this.getCrosshairTarget()).length &&
                    (($this.mouseDown = !0),
                    ($this.zoomingPanning = !1),
                    $this.eventsCrosshairMouseDown(e, t)));
              })
              .on("mouseup.puzzle touchend.puzzle", function (e) {
                (e.preventDefault(),
                  $this.endMove(),
                  ($this.mouseDown = !1),
                  ($this.dragMonitor = {
                    decision: "unknown",
                    timeStart: 0,
                    touchstartX: 0,
                    touchstartY: 0,
                  }));
              }),
            c.readonly ||
              (($this.timerInterval = window.setInterval(
                ((e = $this),
                function () {
                  e.loaded && e.tickTimer();
                }),
                500,
              )),
              $this.tickTimer()));
        }),
        (this.removeEventHandlers = function () {
          ($this.off(".puzzle"),
            $(document).off(".puzzle"),
            $(window).off(".puzzle"),
            $this.dom.helperCrosshair.off(".puzzle"),
            $(".crosshair-btn").off(".puzzle"),
            document.removeEventListener("mousewheel", $this.onMouseWheel),
            $this.timerInterval &&
              (clearInterval($this.timerInterval),
              ($this.timerInterval = null)));
        }),
        (this.destroy = function () {
          ($(".helper-nodc").remove(),
            this.removeEventHandlers(),
            window.PuzzlePanzoom && window.PuzzlePanzoom.destroy(this),
            $(".helper-crosshair").remove());
        }),
        (this.storeTimer = function () {
          if (!c.readonly)
            try {
              localStorage.setItem(
                "timer-" + this.getSaveIdent(),
                this.accumulated,
              );
            } catch (e) {}
        }),
        (this.getTimer = function () {
          try {
            return +localStorage.getItem("timer-" + this.getSaveIdent());
          } catch (e) {
            return 0;
          }
        }),
        (this.tickTimer = function () {
          var e;
          c.readonly ||
            this.solved ||
            this.paused ||
            ((e = new Date().getTime()),
            (this.accumulated = this.getTimer()),
            (this.accumulated += e - this.lastTrackedTime),
            (this.lastTrackedTime = e),
            this.storeTimer());
        }),
        (this.pauseTimer = function (e) {
          c.readonly ||
            this.paused ||
            (this.tickTimer(),
            (this.paused = 1),
            e && (this.forcePaused = 1),
            Settings.get("global.non-competitive-timer") &&
              $("body").addClass("paused"));
        }),
        (this.resumeTimer = function (e) {
          c.readonly ||
            !this.paused ||
            (this.forcePaused && !e) ||
            ((this.lastTrackedTime = new Date().getTime()),
            (this.forcePaused = 0),
            (this.paused = 0),
            $("body").removeClass("paused"));
        }),
        (this.resetTimer = function () {
          c.readonly ||
            ((this.accumulated = 0),
            (this.lastTrackedTime = new Date().getTime()),
            this.storeTimer());
        }),
        (this.loadGame = function (e) {
          (((c = $.extend(c, e)).hashedSolution = e.hashedSolution),
            c.tutorial &&
              (c.puzzleHeight && (this.puzzleHeight = c.puzzleHeight),
              c.puzzleWidth) &&
              (this.puzzleWidth = c.puzzleWidth),
            this.parseTask(),
            this.initState(),
            this.initCurrentMove(),
            c.state && this.loadState(c.state),
            (this.currentState.solved = !!c.solved),
            (this.solved = this.currentState.solved),
            (this.currentState.solvedTime = this.currentState.solved
              ? c.solvedTime
              : 0),
            c.serializedState
              ? (this.unserializeStateCompressed(c.serializedState),
                (this.currentState.index = -1),
                (this.checkpoints = c.checkpoints),
                this.storeCurrentState())
              : c.savedState &&
                ((this.currentState = c.savedState),
                (this.currentState.index = -1),
                (this.checkpoints = c.checkpoints),
                this.storeCurrentState()),
            this.saveState(),
            this.redraw(),
            c.onLoaded && c.onLoaded(this, e));
        }),
        (this.cleanForNew = function () {
          ((this.currentState.solved = !1),
            (this.solved = !1),
            (c.solved = !1),
            (c.savedState = !1),
            (c.serializedState = ""),
            (c.checkpoints = []),
            (this.checkpoints = []));
        }),
        (this.loadNew = function (t) {
          var e;
          return !(
            (c.onBeforeLoadNew && !c.onBeforeLoadNew()) ||
            ((e = ""),
            t
              ? (e = "?resume")
              : this.currentState.solved
                ? (e = "?fromSolved&prevID=" + c.puzzleID)
                : c.puzzleID && (e = "?prevID=" + c.puzzleID),
            $.ajax(c.baseUrl + "/get" + e).done(function (e) {
              (c && e && c.task == e.task) ||
                ($this.cleanForNew(),
                t || $this.resetTimer(),
                $this.loadGame(e),
                $this.fit(),
                c.onLoadNew && c.onLoadNew(),
                c.onNewPuzzleLoaded && c.onNewPuzzleLoaded(t || e.resume));
            }),
            0)
          );
        }),
        (this.loadColorState = function (e) {
          for (var t = 0, n = 0; t < this.puzzleHeight; t++)
            for (var i = 0; i < this.puzzleWidth; i++, n++)
              this.currentState.cellColor[t][i] = parseInt(
                e && e[n] ? e[n] : 0,
              );
        }),
        (this.loadTaskState = function (e) {
          e = e ? e.split(",") : [];
          ((this.currentState.taskStatus = []),
            e.forEach(function (e) {
              this.currentState.taskStatus[e] = !0;
            }, this));
        }),
        (this.loadPencilState = function (e) {
          e &&
            e.split(";").forEach(function (e) {
              e = e.split("#");
              ((this.currentState.cellStatus[e[0]][e[1]].pencil = !0),
                (this.currentState.cellStatus[e[0]][e[1]].pencilNumbers = e[2]
                  .split(",")
                  .map(function (e) {
                    return parseInt(e);
                  })));
            }, this);
        }),
        (this.serializeStateCompressed = function (e) {
          e = e || this.currentState;
          e = this.serializeState(e);
          return LZString.compressToBase64(e);
        }),
        (this.serializeState = function (t) {
          t = t || this.currentState;
          var n = [];
          return (
            this.serializers.forEach(function (e) {
              n.push(this[e](t));
            }, this),
            n.join("|")
          );
        }),
        (this.serializeCellState = function (e) {
          return this.statesMap[e] || this.statesMap[0];
        }),
        (this.serializeBoardState = function (e) {
          e = e || this.currentState;
          for (var t = "", n = 0; n < this.puzzleHeight; n++)
            for (var i = 0; i < this.puzzleWidth; i++)
              t += this.serializeCellState(e.cellStatus[n][i]);
          return t;
        }),
        (this.serializeColorState = function (e) {
          e = e || this.currentState;
          for (var t = !1, n = "", i = 0; i < this.puzzleHeight; i++)
            for (var o = 0; o < this.puzzleWidth; o++)
              ((n += e.cellColor[i][o]), e.cellColor[i][o] && (t = !0));
          return t ? n : "";
        }),
        (this.serializeTaskState = function (e) {
          e = e || this.currentState;
          var n = [];
          return (
            e.taskStatus.forEach(function (e, t) {
              e && n.push(t);
            }),
            n.length ? n.join(",") : ""
          );
        }),
        (this.serializePencilState = function (e) {
          e = e || this.currentState;
          for (var t = 0, n = []; t < this.puzzleWH; t++)
            for (var i = 0; i < this.puzzleWH; i++)
              e.cellStatus[t][i].pencil &&
                e.cellStatus[t][i].pencilNumbers.length &&
                n.push(
                  t +
                    "#" +
                    i +
                    "#" +
                    e.cellStatus[t][i].pencilNumbers.join(","),
                );
          return n.join(";");
        }),
        (this.unserializeStateCompressed = function (e) {
          e = LZString.decompressFromBase64(e);
          this.unserializeState(e);
        }),
        (this.applyRemoteState = function (e) {
          this.solved ||
            (this.unserializeStateCompressed(e),
            this.storeCurrentState(),
            this.redraw());
        }),
        (this.unserializeState = function (e) {
          e &&
            e.split("|").forEach(function (e, t) {
              "loadState" == this.unserializers[t]
                ? this[this.unserializers[t]]({
                    board: e,
                  })
                : this[this.unserializers[t]](e);
            }, this);
        }),
        (this.serializeSolution = function () {}),
        (this.getBaseSaveIdent = function () {
          return this.slug + ".save." + c.ident;
        }),
        (this.getSaveIdent = function () {
          var e = "";
          return (
            c.special && (e = "." + c.specialDate),
            this.getBaseSaveIdent() + e
          );
        }),
        (this.getShortSaveIdent = function () {
          return this.getSaveIdent().split(".save.")[1] || "";
        }),
        (this.getZoomSettingName = function () {
          return (
            this.getSaveIdent()
              .replace(".race", "")
              .replace(/\.\d{4}-\d{2}-\d{2}/g, "") + ".saved-zoom"
          );
        }),
        (this.getOldSaveIdent = function () {
          var e;
          return c.oldIdent
            ? ((e = ""),
              c.special && (e = "." + c.specialDate),
              this.slug + ".save." + c.oldIdent + e)
            : null;
        }),
        (this.getSaved = function () {
          var e,
            t = Settings.get(this.getSaveIdent());
          return (
            t ||
            ((e = this.getOldSaveIdent()) && (t = Settings.get(e))
              ? (Settings.set(this.getSaveIdent(), t, !0),
                Settings.remove(e),
                t)
              : null)
          );
        }),
        (this.setSetting = function (e, t) {
          c[e] = t;
        }),
        (this.getSetting = function (e) {
          return c[e];
        }),
        (this.getSettings = function () {
          return c;
        }),
        (this.getSaveState = function () {
          return {
            task: c.task,
            check: c.check,
            token: c.token,
            puzzleID: c.puzzleID,
            localTimer: c.localTimer,
            serializedState: this.serializeStateCompressed(),
            solved: this.currentState.solved,
            solvedTime: this.currentState.solvedTime,
            checkpoints: this.checkpoints,
            hashedSolution: c.hashedSolution,
            nquest: c.nquest,
            savedAt: Date.now(),
          };
        }),
        (this.stateModified = function () {
          return this.currentState.index;
        }),
        (this.saveState = function (e) {
          (this.DEBUG,
            (this.stateModified() || void 0 !== e) &&
              ((e = this.getSaveState()),
              Settings.set(this.getSaveIdent(), e, !0),
              c.onStateSave) &&
              c.onStateSave(e));
        }),
        (this.getErrors = function (e) {
          return !0;
        }),
        (this.check = async function (t, e) {
          var n;
          c.noCheck
            ? c.hashedSolution &&
              this.getHashedSolution() == c.hashedSolution &&
              c.onSolutionSuccess &&
              c.onSolutionSuccess({})
            : this.solved ||
              ("" != c.solution
                ? ((!c.checkState && c.solution == this.serializeSolution()) ||
                    c.solution == this.serializeBoardState()) &&
                  c.onSolutionSuccess &&
                  c.onSolutionSuccess({})
                : c.checkOffline
                  ? this.getErrors(!0) ||
                    (c.onSolutionSuccess && c.onSolutionSuccess({}))
                  : (this.tickTimer(),
                    (n = {
                      token: c.token,
                      solution: this.serializeSolution(),
                      jstimerPersonal: this.getTimer(),
                    }),
                    e && (n.checkProgress = 1),
                    await $.post(c.baseUrl, n).done(function (e) {
                      !(c.readonly = !1) === e.status
                        ? (!$this.currentState.solved &&
                            c.onSolutionSuccess &&
                            c.onSolutionSuccess(e),
                          ($this.solved = !0),
                          ($this.currentState.solved = !0),
                          $this.saveState())
                        : "progress" === e.status
                          ? c.onSolutionProgress && c.onSolutionProgress(e)
                          : (t && void 0 !== t) ||
                            (c.onSolutionError && c.onSolutionError(e));
                    })));
        }),
        (this.giveUp = function () {
          $.post(c.baseUrl + "/giveUp", {
            token: c.token,
          }).done(function (e) {
            e.status
              ? (($this.solved = !0),
                ($this.currentState.solved = !0),
                ($this.readonly = !0),
                $this.saveState(),
                Settings.remove($this.getSaveIdent()),
                $this.setState(e.solution),
                c.onSolutionSuccess && c.onSolutionSuccess(e))
              : c.onSolutionError && c.onSolutionError(e);
          });
        }),
        (this.getMarkedCount = function () {}),
        (this.getHashedSolution = function () {
          return md5(c.task + this.serializeSolution());
        }),
        (this.checkFinished = function () {
          this.solved ||
            this.currentState.solved ||
            !this.loaded ||
            (((!this.blacks && c.checkOffline) ||
              (!c.noCheck &&
                (0 < this.blacks || c.checkState) &&
                this.getMarkedCount() == this.blacks) ||
              (c.hashedSolution &&
                this.getHashedSolution() == c.hashedSolution)) &&
              (c.hashedSolution &&
                Settings.get("global.auto-submit") &&
                this.getHashedSolution() == c.hashedSolution &&
                (this.tickTimer(), (c.readonly = !0)),
              this.check(!0),
              c.hashedSolution) &&
              this.getHashedSolution() == c.hashedSolution &&
              (this.solved = !0));
        }),
        (this.escapeRegExp = function (e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }),
        (this.getFitZoom = function () {
          return 1;
        }),
        (this.safeInvoke = function (e, t) {
          try {
            return t.call(this);
          } catch (e) {
            window.console;
          }
        }),
        (this.decodeEnum = function (e, t, n, i) {
          t = t[e];
          return -1 !== n.indexOf(t) ? t : i;
        }),
        (this.encodeEnum = function (e, t, n) {
          return void 0 !== t[e] ? t[e] : n;
        }),
        (this.setupShiftColorOverride = function () {
          function t() {
            n.invertColor &&
              ((n.invertColor = 0),
              Settings.set(n.slug + ".draw-style", n.savedDrawStyle),
              Settings.set(n.slug + ".saved-draw-style", ""));
          }
          var n = this;
          ($(document).on("keydown.puzzle", function (e) {
            n.mouseDown ||
              ("keyboard" != n.inputMode &&
                e.shiftKey &&
                !n.invertColor &&
                ((n.invertColor = 1),
                (n.savedDrawStyle = Settings.get(n.slug + ".draw-style")),
                Settings.set(n.slug + ".saved-draw-style", n.savedDrawStyle),
                Settings.set(
                  n.slug + ".draw-style",
                  "color" == n.savedDrawStyle ? "black" : "color",
                )));
          }),
            $(document).on("keyup.puzzle", function (e) {
              16 == e.keyCode && t();
            }),
            $(document).on("visibilitychange.puzzle", function () {
              document.hidden && t();
            }),
            $(window).on("blur.puzzle", t));
        }),
        (this.recoverShiftOverride = function () {
          var e = Settings.get(this.slug + ".saved-draw-style");
          e &&
            (Settings.set(this.slug + ".draw-style", e),
            Settings.set(this.slug + ".saved-draw-style", ""));
        }),
        (this.wrapHelpers = function () {
          var i = this;
          [
            "helpersModifyState",
            "helpersVisualizeState",
            "helpersVisualizeMove",
          ].forEach(function (t) {
            var n = i[t];
            "function" == typeof n &&
              (i[t] = function () {
                var e = arguments;
                return i.safeInvoke(t, function () {
                  return n.apply(i, e);
                });
              });
          });
        }),
        (this.initGame = function () {
          ((window.$this = this).wrapHelpers(),
            this.parseTask(),
            this.initState(),
            this.draw());
          try {
            if (c.special && !this.specialsHandled) {
              var e = new RegExp(
                this.escapeRegExp(this.getBaseSaveIdent()) +
                  "\\.(\\d{4}-\\d{2}-\\d{2})$",
              );
              for (k in localStorage)
                (found = k.match(e)) &&
                  new Date(found[1]) < new Date(c.lastValidSpecial) &&
                  localStorage.removeItem(k);
              this.specialsHandled = 1;
            }
          } catch (e) {}
          return (
            window.PuzzlePanzoom && window.PuzzlePanzoom.init(this),
            this
          );
        }));
    }),
    (window.StateSync = (() => {
      var n = null,
        i = !1,
        o = [],
        r = !1,
        s = {
          ident: null,
          state: null,
        },
        e = null,
        a = !1,
        l = null,
        c = 1e3,
        u = 0,
        d = 5;
      function h() {
        window.DEBUG_StateSync &&
          window.console.log.apply(window.console, arguments);
      }
      var t = "wss://www.puzzles-mobile.com/ws",
        p =
          (0 === location.hostname.indexOf("dev") &&
            (t = "wss://dev.puzzles-mobile.com/ws"),
          {}),
        f = "ssClientId",
        g = "ssTabId";
      function m(e) {
        return window.crypto && "function" == typeof crypto.randomUUID
          ? crypto.randomUUID()
          : e + "-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      }
      function v() {
        var e;
        try {
          e = localStorage.getItem(f);
        } catch (e) {}
        if (!e) {
          e = m("cid");
          try {
            localStorage.setItem(f, e);
          } catch (e) {}
        }
        return e;
      }
      function y() {
        return window.STATE_SYNC_FRONTEND || "";
      }
      function b() {
        return "puzzle-loop" === y() ? "desktop-ui" : "mobile-ui";
      }
      function w() {
        return (
          localStorage.getItem("api_token") ||
          (void 0 !== User && User.api_token) ||
          readCookie("api_token")
        );
      }
      function I() {
        return !!w();
      }
      function C(e) {
        n && 1 === n.readyState && i ? n.send(JSON.stringify(e)) : o.push(e);
      }
      function z() {
        if (
          w() &&
          !((n && (0 === n.readyState || 1 === n.readyState)) || d <= u)
        ) {
          if ((u++, (a = !1), n)) {
            try {
              ((n.onopen = n.onmessage = n.onerror = n.onclose = null),
                n.close());
            } catch (e) {}
            n = null;
          }
          h("[StateSync] connecting to", t, "attempt", u);
          try {
            n = new WebSocket(t);
          } catch (e) {
            return;
          }
          ((n.onopen = function () {
            (h("[StateSync] connected, authenticating..."),
              (i = !1),
              n.send(
                JSON.stringify({
                  type: "auth",
                  token: w(),
                  clientId: v(),
                  tabId: (() => {
                    var e;
                    try {
                      e = sessionStorage.getItem(g);
                    } catch (e) {}
                    if (!e) {
                      e = m("tid");
                      try {
                        sessionStorage.setItem(g, e);
                      } catch (e) {}
                    }
                    return e;
                  })(),
                  frontend: y(),
                }),
              ));
          }),
            (n.onmessage = function (e) {
              var t;
              try {
                t = JSON.parse(e.data);
              } catch (e) {
                return;
              }
              if ("auth_ok" === t.type)
                for (
                  h("[StateSync] authenticated, userId=" + t.userId),
                    i = !0,
                    c = 1e3,
                    u = 0;
                  0 < o.length;
                )
                  n.send(JSON.stringify(o.shift()));
              else
                "state" === t.type
                  ? (e = p[t.ident]) && (delete p[t.ident], e(t))
                  : "settings_snapshot" === t.type ||
                      "settings_not_modified" === t.type
                    ? ((L = !1),
                      (e = T),
                      (T = null),
                      e &&
                        ("settings_snapshot" === t.type
                          ? e({
                              modified: !0,
                              serverTs: t.serverTs,
                              settings: t.settings || {},
                            })
                          : e({
                              modified: !1,
                            })))
                    : "settings_set_ok" === t.type
                      ? ((L = !1), "function" == typeof A && A(t.ts))
                      : "state_updated" === t.type
                        ? "function" == typeof q && q(t)
                        : t.type;
            }),
            (n.onclose = function (e) {
              h(
                "[StateSync] closed, code=" +
                  e.code +
                  ", reason=" +
                  e.reason +
                  ", intentional=" +
                  a,
              );
              e = e.target;
              try {
                e.onopen = e.onmessage = e.onerror = e.onclose = null;
              } catch (e) {}
              if ((n === e && ((i = !1), (n = null)), !a)) {
                for (var t in $)
                  $.hasOwnProperty(t) &&
                    o.push({
                      type: "load",
                      ident: t,
                    });
                L &&
                  E &&
                  o.push({
                    type: "settings_load",
                    slug: E.slug,
                    ui: b(),
                    since: E.since,
                  });
              }
              a ||
                !(r || L || 0 < Object.keys(p).length) ||
                a ||
                l ||
                d <= u ||
                ((l = setTimeout(function () {
                  ((l = null), z());
                }, c)),
                (c = Math.min(2 * c, 3e4)));
            }),
            (n.onerror = function () {}),
            P());
        }
      }
      function S() {
        (n && 1 === n.readyState && i) || z();
      }
      function P() {
        e = e || setInterval(O, 300);
      }
      var x = null,
        k = null,
        _ = !1;
      function O() {
        _ &&
          ((_ = !1),
          k && clearTimeout(k),
          (k = setTimeout(function () {
            ((k = null), H());
          }, 2e3)));
      }
      function H() {
        r &&
          x &&
          (r =
            ((s.ident === x.ident && s.state === x.state) ||
              (C({
                type: "save",
                ident: x.ident,
                puzzleID: x.puzzleID,
                state: x.state,
                ts: x.ts,
              }),
              (s = {
                ident: x.ident,
                state: x.state,
              })),
            !1));
      }
      var $ = {};
      function M(i, e) {
        !w() ||
        (h("[StateSync] loadRemote", i), window.Game && window.Game.solved)
          ? e(null)
          : $[i]
            ? (h("[StateSync] loadRemote deduped for", i), $[i].push(e))
            : (($[i] = [e]),
              (p[i] = function (e) {
                var t = $[i] || [];
                delete $[i];
                for (var n = 0; n < t.length; n++) t[n](e);
              }),
              S(),
              C({
                type: "load",
                ident: i,
              }));
      }
      var T = null,
        L = !1,
        E = null,
        A = null,
        q = null;
      function j(e) {
        q = e;
      }
      var D = !1,
        N = document.hasFocus();
      return (
        window.addEventListener("focus", function () {
          N = !0;
        }),
        window.addEventListener("blur", function () {
          N = !1;
        }),
        document.addEventListener("visibilitychange", function () {
          N = !document.hidden;
        }),
        {
          connect: z,
          disconnect: function () {
            (h("[StateSync] disconnect"),
              (a = !0),
              k && (clearTimeout(k), (k = null)),
              H(),
              l && (clearTimeout(l), (l = null)),
              e && (clearInterval(e), (e = null)),
              n && (n.close(), (n = null)),
              (i = !1),
              (c = 1e3),
              (L = !(p = {})),
              (E = T = null));
          },
          saveRemote: function (e, t, n) {
            w() &&
              (h("[StateSync] saveRemote", e, t),
              (x = {
                ident: e,
                puzzleID: String(t),
                state: n,
                ts: Date.now(),
              }),
              (_ = r = !0),
              S(),
              P());
          },
          forceSaveRemote: function (e, t, n) {
            w() &&
              (h("[StateSync] forceSaveRemote", e, t),
              S(),
              C({
                type: "save_forced",
                ident: e,
                puzzleID: String(t),
                state: n || "",
              }),
              (r = !(s = {
                ident: e,
                state: n || "",
              })));
          },
          loadRemote: M,
          onRemoteUpdate: j,
          onFocusReload: function (t, n, i, o) {
            function e() {
              var e;
              !w() ||
                D ||
                (e = Date.now()) - s < 500 ||
                ((s = e),
                h("[StateSync] window gained focus / became visible"),
                (e = t()) &&
                  (h("[StateSync] checking remote state for", e),
                  M(e, function (e) {
                    var t;
                    e &&
                      e.state &&
                      (e.puzzleID && n() && String(e.puzzleID) !== n()
                        ? (h("[StateSync] remote puzzleID mismatch on focus"),
                          o && o())
                        : ((t =
                            ((t = window.Game
                              ? window.Game.getSaved()
                              : null) &&
                              t.savedAt) ||
                            0),
                          e.ts <= t ||
                            (h("[StateSync] applying newer remote state"),
                            i(e))));
                  })));
            }
            function r() {
              document.hidden || e();
            }
            var s = 0;
            return (
              window.addEventListener("focus", e),
              document.addEventListener("visibilitychange", r),
              function () {
                (window.removeEventListener("focus", e),
                  document.removeEventListener("visibilitychange", r));
              }
            );
          },
          handleRemoteUpdate: function (n, i, o) {
            j(function (e) {
              var t;
              D ||
                (w() &&
                  N &&
                  (t = n()) &&
                  e.ident === t &&
                  !(
                    e.puzzleID &&
                    i() &&
                    String(e.puzzleID) === i() &&
                    window.Game &&
                    window.Game.solved
                  ) &&
                  ((t =
                    ((t = window.Game ? window.Game.getSaved() : null) &&
                      t.savedAt) ||
                    0),
                  e.ts && e.ts <= t
                    ? h(
                        "[StateSync] stale state_updated (ts " +
                          e.ts +
                          " <= local " +
                          t +
                          "), skipping",
                      )
                    : e.fromClientId && e.fromClientId === v()
                      ? (h(
                          "[StateSync] same-browser state_updated for " +
                            e.ident +
                            ", loading silently",
                        ),
                        M(e.ident, function (e) {
                          e && e.state && o(e);
                        }))
                      : (h("[StateSync] state_updated received for", e.ident),
                        (D = !0),
                        confirm(
                          "This puzzle was updated on another device/window/tab. Load the latest state?",
                        )
                          ? (setTimeout(function () {
                              D = !1;
                            }, 1e3),
                            M(e.ident, function (e) {
                              e &&
                                e.state &&
                                (h("[StateSync] applying remote update"), o(e));
                            }))
                          : setTimeout(function () {
                              D = !1;
                            }, 1e3))));
            });
          },
          setAppActive: function (e) {
            N = e;
          },
          isConnected: function () {
            return n && 1 === n.readyState && i;
          },
          isLoggedIn: I,
          getUi: b,
          loadSettings: function (e, t, n) {
            w()
              ? ((E = {
                  slug: e || "",
                  since: t || 0,
                }),
                (T = n),
                (L = !0),
                S(),
                C({
                  type: "settings_load",
                  slug: e || "",
                  ui: b(),
                  since: t || 0,
                }))
              : n({
                  modified: !1,
                });
          },
          setSetting: function (e, t, n) {
            w() &&
              ((L = !0),
              S(),
              C({
                type: "settings_set",
                key: e,
                value: t,
                ui: n ? b() : "",
              }));
          },
          onSettingsAck: function (e) {
            A = e;
          },
        }
      );
    })())),
  User = {
    logged: 0,
    patron: 0,
    email: "",
    nick: "",
    xp: 0,
    init: function () {
      ((this.logged = 0),
        (this.patron = 0),
        (this.email = ""),
        (this.nick = ""),
        (this.xp = 0),
        MVVM.apply());
    },
    loadFromStorage: function () {
      var e;
      (null != readCookie("api_token") || localStorage.getItem("api_token")) &&
        (e = JSON.parse(localStorage.getItem("User"))) &&
        this.load(e);
    },
    store: function () {
      try {
        localStorage.setItem("User", JSON.stringify(this));
      } catch (e) {}
    },
    load: function (e) {
      for (k in ((this.logged = 1),
      this.achievements || (this.achievements = []),
      e))
        this[k] = e[k];
      if (
        (this.store(),
        $("#user-logged-badge .progress").animate(
          {
            width: (e.levelXP / e.totalLevelXP) * 100 + "%",
          },
          1e3,
        ),
        "undefined" != typeof puzzleSlug &&
          ($(".quest-" + puzzleSlug).each(function () {
            ($(this).find(".quest-tier").text("1"),
              $(this).find(".progress").css({
                width: "0%",
              }));
          }),
          e.achievements) &&
          e.achievements[puzzleSlug])
      ) {
        var t = e.achievements[puzzleSlug];
        for (size in t)
          $(".quest-" + puzzleSlug + "-" + size).each(function () {
            var e = 100;
            (puzzleSlug + "-" + size == "skyscrapers-4x4-easy" && (e = 3),
              t[size].level > e
                ? ($(this).find(".quest-tier").html("&check;"),
                  $(this).find(".quest-tier-badge").css({
                    color: "#66ff66",
                  }),
                  $(this).find(".progress").animate({
                    width: "100%",
                  }))
                : ($(this).find(".quest-tier").text(t[size].level),
                  $(this)
                    .find(".progress")
                    .animate({
                      width: t[size].progress + "%",
                    })));
          });
      }
      if ((MVVM.apply(), "undefined" != typeof Settings && Settings.reconcile))
        try {
          Settings.reconcile();
        } catch (e) {}
    },
    loadFromAjax: function (n) {
      var i = this;
      ((mobile_host =
        "undefined" == typeof mobile_host
          ? "www.puzzles-mobile.com"
          : mobile_host),
        $.ajax({
          url: "https://" + mobile_host + "/api/profile",
          xhrFields: {
            withCredentials: !0,
          },
          crossDomain: !0,
          success: function (e) {
            (createCookie("api_token", e.api_token, 365, base_domain),
              localStorage.setItem("api_token", e.api_token));
            var t = i.patron ? 1 : 0;
            i.load(e);
            try {
              window.top.location.href;
              t != e.patron && window.location.reload();
            } catch (e) {}
            n || Dialog.close();
          },
          error: function (e) {
            (i.reset(), n && Dialog.close());
          },
        }));
    },
    showLogin: function () {
      return (
        this.init(),
        Dialog.close(),
        Dialog.open({
          content: "/partials/form.login.php",
        }),
        !1
      );
    },
    reset: function () {
      (localStorage.removeItem("api_token"),
        eraseCookie("api_token", base_domain),
        (this.logged = 0),
        (this.patron = 0),
        (this.email = ""),
        (this.achievements = {}),
        (this.nick = ""),
        (this.xp = 0),
        (this.api_token = ""),
        this.store(),
        MVVM.apply());
    },
    logout: function () {
      var t = this;
      ((mobile_host =
        "undefined" == typeof mobile_host
          ? "www.puzzles-mobile.com"
          : mobile_host),
        $.ajax({
          url: "https://" + mobile_host + "/api/logout",
          xhrFields: {
            withCredentials: !0,
          },
        }).done(function (e) {
          (Dialog.close(),
            t.reset(),
            localStorage.removeItem("api_token"),
            eraseCookie("api_token", base_domain),
            void 0 !== StateSync && StateSync.disconnect());
        }));
    },
    update: function (e) {
      ((mobile_host =
        "undefined" == typeof mobile_host
          ? "www.puzzles-mobile.com"
          : mobile_host),
        $.post("https://" + mobile_host + "/api/profile", e)
          .done(function (e) {
            $(".js-registration-success").show();
          })
          .fail(function (e) {
            ((e = e.responseJSON
              ? $.map(e.responseJSON, function (e) {
                  return e;
                }).join("<br>")
              : e.responseText),
              $(".js-login-error").show().html(e));
          })
          .always(function () {
            ($("button .animate-spin").hide(),
              $("puzzle-button .animate-spin").hide());
          }));
    },
    getSubscriptions: function (t) {
      ((mobile_host =
        "undefined" == typeof mobile_host
          ? "www.puzzles-mobile.com"
          : mobile_host),
        $.ajax("https://" + mobile_host + "/api/subscriptions").done(
          function (e) {
            t(e);
          },
        ));
    },
    cancelSubscription: function (e, t) {
      ((mobile_host =
        "undefined" == typeof mobile_host
          ? "www.puzzles-mobile.com"
          : mobile_host),
        $.post("https://" + mobile_host + "/api/cancelSubscription", {
          subscriptionId: e,
        })
          .done(function (e) {
            t(e);
          })
          .fail(function (e) {}));
    },
  };
function loadUser() {
  User.loadFromAjax();
}
function showXPTeaser(e) {
  ($("#effect-xp").text("+" + e),
    $("#effect-xp").removeClass("animate"),
    setTimeout(function () {
      $("#effect-xp").addClass("animate");
    }, 10));
}
function checkLogin() {
  return (
    !!User.logged ||
    (Dialog.open({
      content: "/partials/form.login.php",
    }),
    !1)
  );
}
function tryLogged() {
  readCookie("api_token");
}
(window.addEventListener("message", function (e) {
  (e.origin.startsWith("https://www.puzzles-mobile.com") ||
    e.origin.startsWith("https://dev.puzzles-mobile.com")) &&
    "loadUser" == e.data &&
    loadUser();
}),
  $(".favorite").on("click", function () {
    var n,
      i = this.dataset.slug;
    -1 != User.arrFavorites.indexOf(i)
      ? ((n = $(this)),
        $.post("/api/favorite", {
          removeFavorite: i,
        }).done(function (e) {
          n.closest("li")
            .insertBefore($("#firstTextLi"))
            .find(".favorite")
            .removeClass("on");
          var t = User.arrFavorites.indexOf(i);
          -1 !== t && User.arrFavorites.splice(t, 1);
        }))
      : ((n = $(this)),
        $.post("/api/favorite", {
          addFavorite: i,
        }).done(function (e) {
          (n
            .closest("li")
            .prependTo(n.closest("ul"))
            .find(".favorite")
            .addClass("on"),
            User.arrFavorites.push(i));
        }));
  }),
  $(document).ajaxStart(function () {
    $("#user-cert").addClass("animate-spin");
  }),
  $(document).ajaxStop(function () {
    $("#user-cert").removeClass("animate-spin");
  }),
  $(document).ready(function () {
    var e = localStorage.getItem("api_token"),
      t = Get_Cookie("api_token");
    (e && !t && createCookie("api_token", e, 365, base_domain),
      !e && t && localStorage.setItem("api_token", t),
      (!e && !t) ||
        ((e = JSON.parse(localStorage.getItem("User"))) && e.logged) ||
        User.loadFromAjax());
  }));
var Util = {
    clone: function (e) {
      return $.extend(!0, {}, e);
    },
    isTouchDevice: function () {
      return (
        "ontouchstart" in window ||
        0 < navigator.maxTouchPoints ||
        0 < navigator.msMaxTouchPoints
      );
    },
  },
  CMPInited = !1;
try {
  (() => {
    if (
      ("undefined" == typeof noAds || !noAds) &&
      "sovrn" != ad_manager &&
      ("freestar" != ad_manager ||
        ("?gfc" != window.location.search &&
          "?sng" != window.location.search)) &&
      "snigel" != ad_manager &&
      "playwire" != ad_manager
    ) {
      window.top.location.hostname
        .replace(/^.{1,4}\./, "")
        .replace(/\.test$/, "");
      var e = document.createElement("script"),
        t = document.getElementsByTagName("script")[0],
        n = "https://cmp.inmobi.com".concat(
          "/choice/",
          "vptV-UyUkzTeZ",
          "/",
          "www.puzzle-combined.com",
          "/choice.js?tag_version=V3",
        ),
        i = 0;
      ((e.async = !0),
        (e.type = "text/javascript"),
        (e.src = n),
        t.parentNode.insertBefore(e, t));
      for (var o, r = "__tcfapiLocator", s = [], a = window; a; ) {
        try {
          if (a.frames[r]) {
            o = a;
            break;
          }
        } catch (e) {}
        if (a === window.top) break;
        a = a.parent;
      }
      o ||
        (!(function e() {
          var t,
            n = a.document,
            i = !!a.frames[r];
          return (
            i ||
              (n.body
                ? (((t = n.createElement("iframe")).style.cssText =
                    "display:none"),
                  (t.name = r),
                  n.body.appendChild(t))
                : setTimeout(e, 5)),
            !i
          );
        })(),
        (a.__tcfapi = function () {
          var e,
            t = arguments;
          if (!t.length) return s;
          "setGdprApplies" === t[0]
            ? 3 < t.length &&
              2 === t[2] &&
              "boolean" == typeof t[3] &&
              ((e = t[3]), "function" == typeof t[2]) &&
              t[2]("set", !0)
            : "ping" === t[0]
              ? "function" == typeof t[2] &&
                t[2]({
                  gdprApplies: e,
                  cmpLoaded: !1,
                  cmpStatus: "stub",
                })
              : ("init" === t[0] &&
                  "object" == typeof t[3] &&
                  (t[3] = Object.assign(t[3], {
                    tag_version: "V3",
                  })),
                s.push(t));
        }),
        a.addEventListener(
          "message",
          function (n) {
            var i = "string" == typeof n.data,
              e = {};
            try {
              e = i ? JSON.parse(n.data) : n.data;
            } catch (e) {}
            var o = e.__tcfapiCall;
            o &&
              window.__tcfapi(
                o.command,
                o.version,
                function (e, t) {
                  e = {
                    __tcfapiReturn: {
                      returnValue: e,
                      success: t,
                      callId: o.callId,
                    },
                  };
                  (i && (e = JSON.stringify(e)),
                    n &&
                      n.source &&
                      n.source.postMessage &&
                      n.source.postMessage(e, "*"));
                },
                o.parameter,
              );
          },
          !1,
        ));
      {
        let a = [
          "2:tcfeuv2",
          "6:uspv1",
          "7:usnatv1",
          "8:usca",
          "9:usvav1",
          "10:uscov1",
          "11:usutv1",
          "12:usctv1",
        ];
        ((window.__gpp_addFrame = function (e) {
          var t;
          window.frames[e] ||
            (document.body
              ? (((t = document.createElement("iframe")).style.cssText =
                  "display:none"),
                (t.name = e),
                document.body.appendChild(t))
              : window.setTimeout(window.__gpp_addFrame, 10, e));
        }),
          (window.__gpp_stub = function () {
            var e = arguments;
            if (
              ((__gpp.queue = __gpp.queue || []),
              (__gpp.events = __gpp.events || []),
              !e.length || (1 == e.length && "queue" == e[0]))
            )
              return __gpp.queue;
            if (1 == e.length && "events" == e[0]) return __gpp.events;
            var t = e[0],
              n = 1 < e.length ? e[1] : null,
              i = 2 < e.length ? e[2] : null;
            if ("ping" === t)
              n(
                {
                  gppVersion: "1.1",
                  cmpStatus: "stub",
                  cmpDisplayStatus: "hidden",
                  signalStatus: "not ready",
                  supportedAPIs: a,
                  cmpId: 10,
                  sectionList: [],
                  applicableSections: [-1],
                  gppString: "",
                  parsedSections: {},
                },
                !0,
              );
            else if ("addEventListener" === t) {
              ("lastId" in __gpp || (__gpp.lastId = 0), __gpp.lastId++);
              var o = __gpp.lastId;
              (__gpp.events.push({
                id: o,
                callback: n,
                parameter: i,
              }),
                n(
                  {
                    eventName: "listenerRegistered",
                    listenerId: o,
                    data: !0,
                    pingData: {
                      gppVersion: "1.1",
                      cmpStatus: "stub",
                      cmpDisplayStatus: "hidden",
                      signalStatus: "not ready",
                      supportedAPIs: a,
                      cmpId: 10,
                      sectionList: [],
                      applicableSections: [-1],
                      gppString: "",
                      parsedSections: {},
                    },
                  },
                  !0,
                ));
            } else if ("removeEventListener" === t) {
              for (var r = !1, s = 0; s < __gpp.events.length; s++)
                if (__gpp.events[s].id == i) {
                  (__gpp.events.splice(s, 1), (r = !0));
                  break;
                }
              n(
                {
                  eventName: "listenerRemoved",
                  listenerId: i,
                  data: r,
                  pingData: {
                    gppVersion: "1.1",
                    cmpStatus: "stub",
                    cmpDisplayStatus: "hidden",
                    signalStatus: "not ready",
                    supportedAPIs: a,
                    cmpId: 10,
                    sectionList: [],
                    applicableSections: [-1],
                    gppString: "",
                    parsedSections: {},
                  },
                },
                !0,
              );
            } else
              "hasSection" === t
                ? n(!1, !0)
                : "getSection" === t || "getField" === t
                  ? n(null, !0)
                  : __gpp.queue.push([].slice.apply(e));
          }),
          (window.__gpp_msghandler = function (n) {
            var i,
              o = "string" == typeof n.data;
            try {
              var t = o ? JSON.parse(n.data) : n.data;
            } catch (e) {
              t = null;
            }
            "object" == typeof t &&
              null !== t &&
              "__gppCall" in t &&
              ((i = t.__gppCall),
              window.__gpp(
                i.command,
                function (e, t) {
                  e = {
                    __gppReturn: {
                      returnValue: e,
                      success: t,
                      callId: i.callId,
                    },
                  };
                  n.source.postMessage(o ? JSON.stringify(e) : e, "*");
                },
                "parameter" in i ? i.parameter : null,
                "version" in i ? i.version : "1.1",
              ));
          }),
          ("__gpp" in window && "function" == typeof window.__gpp) ||
            ((window.__gpp = window.__gpp_stub),
            window.addEventListener("message", window.__gpp_msghandler, !1),
            window.__gpp_addFrame("__gppLocator")));
      }
      var l,
        c = function () {
          var e = arguments;
          typeof window.__uspapi !== c &&
            setTimeout(function () {
              void 0 !== window.__uspapi &&
                window.__uspapi.apply(window.__uspapi, e);
            }, 500);
        };
      void 0 === window.__uspapi &&
        ((window.__uspapi = c),
        (l = setInterval(function () {
          (i++, (window.__uspapi === c && i < 3) || clearInterval(l));
        }, 6e3)));
    }
  })();
} catch (e) {}
((e) => {
  function d(e, t) {
    var n = (65535 & e) + (65535 & t);
    return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
  }
  function a(e, t, n, i, o, r) {
    return d(((t = d(d(t, e), d(i, r))) << o) | (t >>> (32 - o)), n);
  }
  function h(e, t, n, i, o, r, s) {
    return a((t & n) | (~t & i), e, t, o, r, s);
  }
  function p(e, t, n, i, o, r, s) {
    return a((t & i) | (n & ~i), e, t, o, r, s);
  }
  function f(e, t, n, i, o, r, s) {
    return a(t ^ n ^ i, e, t, o, r, s);
  }
  function g(e, t, n, i, o, r, s) {
    return a(n ^ (t | ~i), e, t, o, r, s);
  }
  function s(e, t) {
    ((e[t >> 5] |= 128 << (t % 32)), (e[14 + (((t + 64) >>> 9) << 4)] = t));
    for (
      var n,
        i,
        o,
        r,
        s = 1732584193,
        a = -271733879,
        l = -1732584194,
        c = 271733878,
        u = 0;
      u < e.length;
      u += 16
    )
      ((a = g(
        (a = g(
          (a = g(
            (a = g(
              (a = f(
                (a = f(
                  (a = f(
                    (a = f(
                      (a = p(
                        (a = p(
                          (a = p(
                            (a = p(
                              (a = h(
                                (a = h(
                                  (a = h(
                                    (a = h(
                                      (i = a),
                                      (l = h(
                                        (o = l),
                                        (c = h(
                                          (r = c),
                                          (s = h(
                                            (n = s),
                                            a,
                                            l,
                                            c,
                                            e[u],
                                            7,
                                            -680876936,
                                          )),
                                          a,
                                          l,
                                          e[u + 1],
                                          12,
                                          -389564586,
                                        )),
                                        s,
                                        a,
                                        e[u + 2],
                                        17,
                                        606105819,
                                      )),
                                      c,
                                      s,
                                      e[u + 3],
                                      22,
                                      -1044525330,
                                    )),
                                    (l = h(
                                      l,
                                      (c = h(
                                        c,
                                        (s = h(
                                          s,
                                          a,
                                          l,
                                          c,
                                          e[u + 4],
                                          7,
                                          -176418897,
                                        )),
                                        a,
                                        l,
                                        e[u + 5],
                                        12,
                                        1200080426,
                                      )),
                                      s,
                                      a,
                                      e[u + 6],
                                      17,
                                      -1473231341,
                                    )),
                                    c,
                                    s,
                                    e[u + 7],
                                    22,
                                    -45705983,
                                  )),
                                  (l = h(
                                    l,
                                    (c = h(
                                      c,
                                      (s = h(
                                        s,
                                        a,
                                        l,
                                        c,
                                        e[u + 8],
                                        7,
                                        1770035416,
                                      )),
                                      a,
                                      l,
                                      e[u + 9],
                                      12,
                                      -1958414417,
                                    )),
                                    s,
                                    a,
                                    e[u + 10],
                                    17,
                                    -42063,
                                  )),
                                  c,
                                  s,
                                  e[u + 11],
                                  22,
                                  -1990404162,
                                )),
                                (l = h(
                                  l,
                                  (c = h(
                                    c,
                                    (s = h(
                                      s,
                                      a,
                                      l,
                                      c,
                                      e[u + 12],
                                      7,
                                      1804603682,
                                    )),
                                    a,
                                    l,
                                    e[u + 13],
                                    12,
                                    -40341101,
                                  )),
                                  s,
                                  a,
                                  e[u + 14],
                                  17,
                                  -1502002290,
                                )),
                                c,
                                s,
                                e[u + 15],
                                22,
                                1236535329,
                              )),
                              (l = p(
                                l,
                                (c = p(
                                  c,
                                  (s = p(s, a, l, c, e[u + 1], 5, -165796510)),
                                  a,
                                  l,
                                  e[u + 6],
                                  9,
                                  -1069501632,
                                )),
                                s,
                                a,
                                e[u + 11],
                                14,
                                643717713,
                              )),
                              c,
                              s,
                              e[u],
                              20,
                              -373897302,
                            )),
                            (l = p(
                              l,
                              (c = p(
                                c,
                                (s = p(s, a, l, c, e[u + 5], 5, -701558691)),
                                a,
                                l,
                                e[u + 10],
                                9,
                                38016083,
                              )),
                              s,
                              a,
                              e[u + 15],
                              14,
                              -660478335,
                            )),
                            c,
                            s,
                            e[u + 4],
                            20,
                            -405537848,
                          )),
                          (l = p(
                            l,
                            (c = p(
                              c,
                              (s = p(s, a, l, c, e[u + 9], 5, 568446438)),
                              a,
                              l,
                              e[u + 14],
                              9,
                              -1019803690,
                            )),
                            s,
                            a,
                            e[u + 3],
                            14,
                            -187363961,
                          )),
                          c,
                          s,
                          e[u + 8],
                          20,
                          1163531501,
                        )),
                        (l = p(
                          l,
                          (c = p(
                            c,
                            (s = p(s, a, l, c, e[u + 13], 5, -1444681467)),
                            a,
                            l,
                            e[u + 2],
                            9,
                            -51403784,
                          )),
                          s,
                          a,
                          e[u + 7],
                          14,
                          1735328473,
                        )),
                        c,
                        s,
                        e[u + 12],
                        20,
                        -1926607734,
                      )),
                      (l = f(
                        l,
                        (c = f(
                          c,
                          (s = f(s, a, l, c, e[u + 5], 4, -378558)),
                          a,
                          l,
                          e[u + 8],
                          11,
                          -2022574463,
                        )),
                        s,
                        a,
                        e[u + 11],
                        16,
                        1839030562,
                      )),
                      c,
                      s,
                      e[u + 14],
                      23,
                      -35309556,
                    )),
                    (l = f(
                      l,
                      (c = f(
                        c,
                        (s = f(s, a, l, c, e[u + 1], 4, -1530992060)),
                        a,
                        l,
                        e[u + 4],
                        11,
                        1272893353,
                      )),
                      s,
                      a,
                      e[u + 7],
                      16,
                      -155497632,
                    )),
                    c,
                    s,
                    e[u + 10],
                    23,
                    -1094730640,
                  )),
                  (l = f(
                    l,
                    (c = f(
                      c,
                      (s = f(s, a, l, c, e[u + 13], 4, 681279174)),
                      a,
                      l,
                      e[u],
                      11,
                      -358537222,
                    )),
                    s,
                    a,
                    e[u + 3],
                    16,
                    -722521979,
                  )),
                  c,
                  s,
                  e[u + 6],
                  23,
                  76029189,
                )),
                (l = f(
                  l,
                  (c = f(
                    c,
                    (s = f(s, a, l, c, e[u + 9], 4, -640364487)),
                    a,
                    l,
                    e[u + 12],
                    11,
                    -421815835,
                  )),
                  s,
                  a,
                  e[u + 15],
                  16,
                  530742520,
                )),
                c,
                s,
                e[u + 2],
                23,
                -995338651,
              )),
              (l = g(
                l,
                (c = g(
                  c,
                  (s = g(s, a, l, c, e[u], 6, -198630844)),
                  a,
                  l,
                  e[u + 7],
                  10,
                  1126891415,
                )),
                s,
                a,
                e[u + 14],
                15,
                -1416354905,
              )),
              c,
              s,
              e[u + 5],
              21,
              -57434055,
            )),
            (l = g(
              l,
              (c = g(
                c,
                (s = g(s, a, l, c, e[u + 12], 6, 1700485571)),
                a,
                l,
                e[u + 3],
                10,
                -1894986606,
              )),
              s,
              a,
              e[u + 10],
              15,
              -1051523,
            )),
            c,
            s,
            e[u + 1],
            21,
            -2054922799,
          )),
          (l = g(
            l,
            (c = g(
              c,
              (s = g(s, a, l, c, e[u + 8], 6, 1873313359)),
              a,
              l,
              e[u + 15],
              10,
              -30611744,
            )),
            s,
            a,
            e[u + 6],
            15,
            -1560198380,
          )),
          c,
          s,
          e[u + 13],
          21,
          1309151649,
        )),
        (l = g(
          l,
          (c = g(
            c,
            (s = g(s, a, l, c, e[u + 4], 6, -145523070)),
            a,
            l,
            e[u + 11],
            10,
            -1120210379,
          )),
          s,
          a,
          e[u + 2],
          15,
          718787259,
        )),
        c,
        s,
        e[u + 9],
        21,
        -343485551,
      )),
        (s = d(s, n)),
        (a = d(a, i)),
        (l = d(l, o)),
        (c = d(c, r)));
    return [s, a, l, c];
  }
  function l(e) {
    for (var t = "", n = 32 * e.length, i = 0; i < n; i += 8)
      t += String.fromCharCode((e[i >> 5] >>> (i % 32)) & 255);
    return t;
  }
  function c(e) {
    var t = [];
    for (t[(e.length >> 2) - 1] = void 0, i = 0; i < t.length; i += 1) t[i] = 0;
    for (var n = 8 * e.length, i = 0; i < n; i += 8)
      t[i >> 5] |= (255 & e.charCodeAt(i / 8)) << (i % 32);
    return t;
  }
  function i(e) {
    for (var t, n = "", i = 0; i < e.length; i += 1)
      ((t = e.charCodeAt(i)),
        (n +=
          "0123456789abcdef".charAt((t >>> 4) & 15) +
          "0123456789abcdef".charAt(15 & t)));
    return n;
  }
  function u(e) {
    return unescape(encodeURIComponent(e));
  }
  function o(e) {
    return l(s(c((e = u(e))), 8 * e.length));
  }
  function r(e, t) {
    var n,
      e = u(e),
      t = u(t),
      i = c(e),
      o = [],
      r = [];
    for (
      o[15] = r[15] = void 0, 16 < i.length && (i = s(i, 8 * e.length)), n = 0;
      n < 16;
      n += 1
    )
      ((o[n] = 909522486 ^ i[n]), (r[n] = 1549556828 ^ i[n]));
    return (
      (e = s(o.concat(c(t)), 512 + 8 * t.length)),
      l(s(r.concat(e), 640))
    );
  }
  function t(e, t, n) {
    return t ? (n ? r(t, e) : i(r(t, e))) : n ? o(e) : i(o(e));
  }
  "function" == typeof define && define.amd
    ? define(function () {
        return t;
      })
    : "object" == typeof module && module.exports
      ? (module.exports = t)
      : (e.md5 = t);
})(this);
var LZString = (() => {
  function n(e, t) {
    if (!r[e]) {
      r[e] = {};
      for (var n = 0; n < e.length; n++) r[e][e.charAt(n)] = n;
    }
    return r[e][t];
  }
  var v = String.fromCharCode,
    i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
    r = {},
    s = {
      compressToBase64: function (e) {
        if (null == e) return "";
        var t = s._compress(e, 6, function (e) {
          return i.charAt(e);
        });
        switch (t.length % 4) {
          default:
          case 0:
            return t;
          case 1:
            return t + "===";
          case 2:
            return t + "==";
          case 3:
            return t + "=";
        }
      },
      decompressFromBase64: function (t) {
        return null == t
          ? ""
          : "" == t
            ? null
            : s._decompress(t.length, 32, function (e) {
                return n(i, t.charAt(e));
              });
      },
      compressToUTF16: function (e) {
        return null == e
          ? ""
          : s._compress(e, 15, function (e) {
              return v(e + 32);
            }) + " ";
      },
      decompressFromUTF16: function (t) {
        return null == t
          ? ""
          : "" == t
            ? null
            : s._decompress(t.length, 16384, function (e) {
                return t.charCodeAt(e) - 32;
              });
      },
      compressToUint8Array: function (e) {
        for (
          var t = s.compress(e),
            n = new Uint8Array(2 * t.length),
            i = 0,
            o = t.length;
          i < o;
          i++
        ) {
          var r = t.charCodeAt(i);
          ((n[2 * i] = r >>> 8), (n[2 * i + 1] = r % 256));
        }
        return n;
      },
      decompressFromUint8Array: function (e) {
        if (null == e) return s.decompress(e);
        for (var t = new Array(e.length / 2), n = 0, i = t.length; n < i; n++)
          t[n] = 256 * e[2 * n] + e[2 * n + 1];
        var o = [];
        return (
          t.forEach(function (e) {
            o.push(v(e));
          }),
          s.decompress(o.join(""))
        );
      },
      compressToEncodedURIComponent: function (e) {
        return null == e
          ? ""
          : s._compress(e, 6, function (e) {
              return o.charAt(e);
            });
      },
      decompressFromEncodedURIComponent: function (t) {
        return null == t
          ? ""
          : "" == t
            ? null
            : ((t = t.replace(/ /g, "+")),
              s._decompress(t.length, 32, function (e) {
                return n(o, t.charAt(e));
              }));
      },
      compress: function (e) {
        return s._compress(e, 16, function (e) {
          return v(e);
        });
      },
      _compress: function (e, t, n) {
        if (null == e) return "";
        for (
          var i,
            o,
            r,
            s,
            a = {},
            l = {},
            c = "",
            u = 2,
            d = 3,
            h = 2,
            p = [],
            f = 0,
            g = 0,
            m = 0;
          m < e.length;
          m += 1
        )
          if (
            ((r = e.charAt(m)),
            Object.prototype.hasOwnProperty.call(a, r) ||
              ((a[r] = d++), (l[r] = !0)),
            (s = c + r),
            Object.prototype.hasOwnProperty.call(a, s))
          )
            c = s;
          else {
            if (Object.prototype.hasOwnProperty.call(l, c)) {
              if (c.charCodeAt(0) < 256) {
                for (i = 0; i < h; i++)
                  ((f <<= 1),
                    g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++);
                for (o = c.charCodeAt(0), i = 0; i < 8; i++)
                  ((f = (f << 1) | (1 & o)),
                    g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                    (o >>= 1));
              } else {
                for (o = 1, i = 0; i < h; i++)
                  ((f = (f << 1) | o),
                    g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                    (o = 0));
                for (o = c.charCodeAt(0), i = 0; i < 16; i++)
                  ((f = (f << 1) | (1 & o)),
                    g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                    (o >>= 1));
              }
              (0 == --u && ((u = Math.pow(2, h)), h++), delete l[c]);
            } else
              for (o = a[c], i = 0; i < h; i++)
                ((f = (f << 1) | (1 & o)),
                  g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                  (o >>= 1));
            (0 == --u && ((u = Math.pow(2, h)), h++),
              (a[s] = d++),
              (c = String(r)));
          }
        if ("" !== c) {
          if (Object.prototype.hasOwnProperty.call(l, c)) {
            if (c.charCodeAt(0) < 256) {
              for (i = 0; i < h; i++)
                ((f <<= 1),
                  g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++);
              for (o = c.charCodeAt(0), i = 0; i < 8; i++)
                ((f = (f << 1) | (1 & o)),
                  g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                  (o >>= 1));
            } else {
              for (o = 1, i = 0; i < h; i++)
                ((f = (f << 1) | o),
                  g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                  (o = 0));
              for (o = c.charCodeAt(0), i = 0; i < 16; i++)
                ((f = (f << 1) | (1 & o)),
                  g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                  (o >>= 1));
            }
            (0 == --u && ((u = Math.pow(2, h)), h++), delete l[c]);
          } else
            for (o = a[c], i = 0; i < h; i++)
              ((f = (f << 1) | (1 & o)),
                g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
                (o >>= 1));
          0 == --u && ((u = Math.pow(2, h)), h++);
        }
        for (o = 2, i = 0; i < h; i++)
          ((f = (f << 1) | (1 & o)),
            g == t - 1 ? ((g = 0), p.push(n(f)), (f = 0)) : g++,
            (o >>= 1));
        for (;;) {
          if (((f <<= 1), g == t - 1)) {
            p.push(n(f));
            break;
          }
          g++;
        }
        return p.join("");
      },
      decompress: function (t) {
        return null == t
          ? ""
          : "" == t
            ? null
            : s._decompress(t.length, 32768, function (e) {
                return t.charCodeAt(e);
              });
      },
      _decompress: function (e, t, n) {
        for (
          var i,
            o,
            r,
            s,
            a,
            l,
            c = [],
            u = 4,
            d = 4,
            h = 3,
            p = "",
            f = [],
            g = {
              val: n(0),
              position: t,
              index: 1,
            },
            m = 0;
          m < 3;
          m += 1
        )
          c[m] = m;
        for (o = 0, s = Math.pow(2, 2), a = 1; a != s; )
          ((r = g.val & g.position),
            (g.position >>= 1),
            0 == g.position && ((g.position = t), (g.val = n(g.index++))),
            (o |= (0 < r ? 1 : 0) * a),
            (a <<= 1));
        switch (o) {
          case 0:
            for (o = 0, s = Math.pow(2, 8), a = 1; a != s; )
              ((r = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                (o |= (0 < r ? 1 : 0) * a),
                (a <<= 1));
            l = v(o);
            break;
          case 1:
            for (o = 0, s = Math.pow(2, 16), a = 1; a != s; )
              ((r = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                (o |= (0 < r ? 1 : 0) * a),
                (a <<= 1));
            l = v(o);
            break;
          case 2:
            return "";
        }
        for (i = c[3] = l, f.push(l); ; ) {
          if (e < g.index) return "";
          for (o = 0, s = Math.pow(2, h), a = 1; a != s; )
            ((r = g.val & g.position),
              (g.position >>= 1),
              0 == g.position && ((g.position = t), (g.val = n(g.index++))),
              (o |= (0 < r ? 1 : 0) * a),
              (a <<= 1));
          switch ((l = o)) {
            case 0:
              for (o = 0, s = Math.pow(2, 8), a = 1; a != s; )
                ((r = g.val & g.position),
                  (g.position >>= 1),
                  0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                  (o |= (0 < r ? 1 : 0) * a),
                  (a <<= 1));
              ((c[d++] = v(o)), (l = d - 1), u--);
              break;
            case 1:
              for (o = 0, s = Math.pow(2, 16), a = 1; a != s; )
                ((r = g.val & g.position),
                  (g.position >>= 1),
                  0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                  (o |= (0 < r ? 1 : 0) * a),
                  (a <<= 1));
              ((c[d++] = v(o)), (l = d - 1), u--);
              break;
            case 2:
              return f.join("");
          }
          if ((0 == u && ((u = Math.pow(2, h)), h++), c[l])) p = c[l];
          else {
            if (l !== d) return null;
            p = i + i.charAt(0);
          }
          (f.push(p),
            (c[d++] = i + p.charAt(0)),
            (i = p),
            0 == --u && ((u = Math.pow(2, h)), h++));
        }
      },
    };
  return s;
})();
("function" == typeof define && define.amd
  ? define(function () {
      return LZString;
    })
  : "undefined" != typeof module &&
    null != module &&
    (module.exports = LZString),
  ((e, t) => {
    "object" == typeof exports && "undefined" != typeof module
      ? t(exports)
      : "function" == typeof define && define.amd
        ? define(["exports"], t)
        : t(
            ((e =
              "undefined" != typeof globalThis
                ? globalThis
                : e || self).PuzzleDesignSystem = {}),
          );
  })(this, function (e) {
    function t(e, t, n, i) {
      var o,
        r = arguments.length,
        s =
          r < 3
            ? t
            : null === i
              ? (i = Object.getOwnPropertyDescriptor(t, n))
              : i;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(e, t, n, i);
      else
        for (var a = e.length - 1; 0 <= a; a--)
          (o = e[a]) &&
            (s = (r < 3 ? o(s) : 3 < r ? o(t, n, s) : o(t, n)) || s);
      3 < r && s && Object.defineProperty(t, n, s);
    }
    function n(e, t) {
      if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    }
    let o = globalThis,
      I =
        o.ShadowRoot &&
        (void 0 === o.ShadyCSS || o.ShadyCSS.nativeShadow) &&
        "adoptedStyleSheets" in Document.prototype &&
        "replace" in CSSStyleSheet.prototype,
      P = Symbol(),
      O = new WeakMap(),
      H = class {
        constructor(e, t, n) {
          if (((this._$cssResult$ = !0), n !== P))
            throw Error(
              "CSSResult is not constructable. Use `unsafeCSS` or `css` instead.",
            );
          ((this.cssText = e), (this.t = t));
        }
        get styleSheet() {
          let e = this.o;
          var t,
            n = this.t;
          return (
            I &&
              void 0 === e &&
              ((t = void 0 !== n && 1 === n.length),
              void 0 === (e = t ? O.get(n) : e)) &&
              ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
              t) &&
              O.set(n, e),
            e
          );
        }
        toString() {
          return this.cssText;
        }
      },
      i = (i, ...e) => {
        e =
          1 === i.length
            ? i[0]
            : e.reduce(
                (e, t, n) =>
                  e +
                  (() => {
                    if (!0 === t._$cssResult$) return t.cssText;
                    if ("number" == typeof t) return t;
                    throw Error(
                      "Value passed to 'css' function must be a 'css' function result: " +
                        t +
                        ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                    );
                  })() +
                  i[n + 1],
                i[0],
              );
        return new H(e, i, P);
      },
      j = I
        ? (e) => e
        : (t) => {
            if (!(t instanceof CSSStyleSheet)) return t;
            {
              let e = "";
              for (var n of t.cssRules) e += n.cssText;
              return (
                (t = e),
                new H("string" == typeof t ? t : t + "", void 0, P)
              );
            }
          },
      {
        is: R,
        defineProperty: B,
        getOwnPropertyDescriptor: U,
        getOwnPropertyNames: F,
        getOwnPropertySymbols: W,
        getPrototypeOf: Z,
      } = Object,
      r = globalThis,
      G = r.trustedTypes,
      V = G ? G.emptyScript : "",
      X = r.reactiveElementPolyfillSupport,
      s = {
        toAttribute(e, t) {
          switch (t) {
            case Boolean:
              e = e ? V : null;
              break;
            case Object:
            case Array:
              e = null == e ? e : JSON.stringify(e);
          }
          return e;
        },
        fromAttribute(e, t) {
          let n = e;
          switch (t) {
            case Boolean:
              n = null !== e;
              break;
            case Number:
              n = null === e ? null : Number(e);
              break;
            case Object:
            case Array:
              try {
                n = JSON.parse(e);
              } catch (e) {
                n = null;
              }
          }
          return n;
        },
      },
      Y = (e, t) => !R(e, t),
      J = {
        attribute: !0,
        type: String,
        converter: s,
        reflect: !1,
        hasChanged: Y,
      };
    ((Symbol.metadata ??= Symbol("metadata")),
      (r.litPropertyMetadata ??= new WeakMap()));
    var a = class extends HTMLElement {
      static addInitializer(e) {
        (this._$Ei(), (this.l ??= []).push(e));
      }
      static get observedAttributes() {
        return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
      }
      static createProperty(e, t = J) {
        var n;
        (t.state && (t.attribute = !1),
          this._$Ei(),
          this.elementProperties.set(e, t),
          t.noAccessor ||
            ((n = Symbol()),
            void 0 !== (n = this.getPropertyDescriptor(e, n, t)) &&
              B(this.prototype, e, n)));
      }
      static getPropertyDescriptor(n, t, i) {
        let { get: o, set: r } = U(this.prototype, n) ?? {
          get() {
            return this[t];
          },
          set(e) {
            this[t] = e;
          },
        };
        return {
          get() {
            return o?.call(this);
          },
          set(e) {
            var t = o?.call(this);
            (r.call(this, e), this.requestUpdate(n, t, i));
          },
          configurable: !0,
          enumerable: !0,
        };
      }
      static getPropertyOptions(e) {
        return this.elementProperties.get(e) ?? J;
      }
      static _$Ei() {
        var e;
        this.hasOwnProperty("elementProperties") ||
          ((e = Z(this)).finalize(),
          void 0 !== e.l && (this.l = [...e.l]),
          (this.elementProperties = new Map(e.elementProperties)));
      }
      static finalize() {
        if (!this.hasOwnProperty("finalized")) {
          if (
            ((this.finalized = !0),
            this._$Ei(),
            this.hasOwnProperty("properties"))
          ) {
            let e = this.properties,
              t = [...F(e), ...W(e)];
            for (var n of t) this.createProperty(n, e[n]);
          }
          let e = this[Symbol.metadata];
          if (null !== e) {
            var i = litPropertyMetadata.get(e);
            if (void 0 !== i)
              for (let [e, t] of i) this.elementProperties.set(e, t);
          }
          this._$Eh = new Map();
          for (let [e, t] of this.elementProperties) {
            var o = this._$Eu(e, t);
            void 0 !== o && this._$Eh.set(o, e);
          }
          this.elementStyles = this.finalizeStyles(this.styles);
        }
      }
      static finalizeStyles(e) {
        var t = [];
        if (Array.isArray(e)) {
          var n = new Set(e.flat(1 / 0).reverse());
          for (let e of n) t.unshift(j(e));
        } else void 0 !== e && t.push(j(e));
        return t;
      }
      static _$Eu(e, t) {
        t = t.attribute;
        return !1 === t
          ? void 0
          : "string" == typeof t
            ? t
            : "string" == typeof e
              ? e.toLowerCase()
              : void 0;
      }
      constructor() {
        (super(),
          (this._$Ep = void 0),
          (this.isUpdatePending = !1),
          (this.hasUpdated = !1),
          (this._$Em = null),
          this._$Ev());
      }
      _$Ev() {
        ((this._$ES = new Promise((e) => (this.enableUpdating = e))),
          (this._$AL = new Map()),
          this._$E_(),
          this.requestUpdate(),
          this.constructor.l?.forEach((e) => e(this)));
      }
      addController(e) {
        ((this._$EO ??= new Set()).add(e),
          void 0 !== this.renderRoot &&
            this.isConnected &&
            e.hostConnected?.());
      }
      removeController(e) {
        this._$EO?.delete(e);
      }
      _$E_() {
        var e,
          t = new Map();
        for (e of this.constructor.elementProperties.keys())
          this.hasOwnProperty(e) && (t.set(e, this[e]), delete this[e]);
        0 < t.size && (this._$Ep = t);
      }
      createRenderRoot() {
        var e =
            this.shadowRoot ??
            this.attachShadow(this.constructor.shadowRootOptions),
          n = e,
          t = this.constructor.elementStyles;
        if (I)
          n.adoptedStyleSheets = t.map((e) =>
            e instanceof CSSStyleSheet ? e : e.styleSheet,
          );
        else
          for (var i of t) {
            let e = document.createElement("style"),
              t = o.litNonce;
            (void 0 !== t && e.setAttribute("nonce", t),
              (e.textContent = i.cssText),
              n.appendChild(e));
          }
        return e;
      }
      connectedCallback() {
        ((this.renderRoot ??= this.createRenderRoot()),
          this.enableUpdating(!0),
          this._$EO?.forEach((e) => e.hostConnected?.()));
      }
      enableUpdating(e) {}
      disconnectedCallback() {
        this._$EO?.forEach((e) => e.hostDisconnected?.());
      }
      attributeChangedCallback(e, t, n) {
        this._$AK(e, n);
      }
      _$EC(e, t) {
        var n = this.constructor.elementProperties.get(e),
          i = this.constructor._$Eu(e, n);
        void 0 !== i &&
          !0 === n.reflect &&
          ((t = (
            void 0 !== n.converter?.toAttribute ? n.converter : s
          ).toAttribute(t, n.type)),
          (this._$Em = e),
          null == t ? this.removeAttribute(i) : this.setAttribute(i, t),
          (this._$Em = null));
      }
      _$AK(e, n) {
        var i = this.constructor,
          o = i._$Eh.get(e);
        if (void 0 !== o && this._$Em !== o) {
          let e = i.getPropertyOptions(o),
            t =
              "function" == typeof e.converter
                ? {
                    fromAttribute: e.converter,
                  }
                : void 0 !== e.converter?.fromAttribute
                  ? e.converter
                  : s;
          ((this._$Em = o),
            (this[o] = t.fromAttribute(n, e.type)),
            (this._$Em = null));
        }
      }
      requestUpdate(e, t, n) {
        if (void 0 !== e) {
          if (
            !((n ??= this.constructor.getPropertyOptions(e)).hasChanged ?? Y)(
              this[e],
              t,
            )
          )
            return;
          this.P(e, t, n);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$ET());
      }
      P(e, t, n) {
        (this._$AL.has(e) || this._$AL.set(e, t),
          !0 === n.reflect &&
            this._$Em !== e &&
            (this._$Ej ??= new Set()).add(e));
      }
      async _$ET() {
        this.isUpdatePending = !0;
        try {
          await this._$ES;
        } catch (e) {
          Promise.reject(e);
        }
        var e = this.scheduleUpdate();
        return (null != e && (await e), !this.isUpdatePending);
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (this.isUpdatePending) {
          if (!this.hasUpdated) {
            if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
              for (let [e, t] of this._$Ep) this[e] = t;
              this._$Ep = void 0;
            }
            let n = this.constructor.elementProperties;
            if (0 < n.size)
              for (let [e, t] of n)
                !0 !== t.wrapped ||
                  this._$AL.has(e) ||
                  void 0 === this[e] ||
                  this.P(e, this[e], t);
          }
          let t = !1,
            e = this._$AL;
          try {
            (t = this.shouldUpdate(e))
              ? (this.willUpdate(e),
                this._$EO?.forEach((e) => e.hostUpdate?.()),
                this.update(e))
              : this._$EU();
          } catch (e) {
            throw ((t = !1), this._$EU(), e);
          }
          t && this._$AE(e);
        }
      }
      willUpdate(e) {}
      _$AE(e) {
        (this._$EO?.forEach((e) => e.hostUpdated?.()),
          this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
          this.updated(e));
      }
      _$EU() {
        ((this._$AL = new Map()), (this.isUpdatePending = !1));
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$ES;
      }
      shouldUpdate(e) {
        return !0;
      }
      update(e) {
        ((this._$Ej &&= this._$Ej.forEach((e) => this._$EC(e, this[e]))),
          this._$EU());
      }
      updated(e) {}
      firstUpdated(e) {}
    };
    ((a.elementStyles = []),
      (a.shadowRootOptions = {
        mode: "open",
      }),
      (a.elementProperties = new Map()),
      (a.finalized = new Map()),
      X?.({
        ReactiveElement: a,
      }),
      (r.reactiveElementVersions ??= []).push("2.0.4"));
    let K = globalThis,
      u = K.trustedTypes,
      Q = u
        ? u.createPolicy("lit-html", {
            createHTML: (e) => e,
          })
        : void 0,
      h = `lit$${Math.random().toFixed(9).slice(2)}$`,
      ee = "?" + h,
      te = `<${ee}>`,
      l = document,
      d = () => l.createComment(""),
      c = (e) => null === e || ("object" != typeof e && "function" != typeof e),
      ne = Array.isArray,
      ie = "[ \t\n\f\r]",
      p = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
      oe = /-->/g,
      re = />/g,
      f = RegExp(
        `>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\r"'\`<>=]|("|')|))|$)`,
        "g",
      ),
      se = /'/g,
      ae = /"/g,
      le = /^(?:script|style|textarea|title)$/i,
      ce =
        (n) =>
        (e, ...t) => ({
          _$litType$: n,
          strings: e,
          values: t,
        }),
      g = ce(1),
      ue = ce(2),
      m = Symbol.for("lit-noChange"),
      v = Symbol.for("lit-nothing"),
      de = new WeakMap(),
      y = l.createTreeWalker(l, 129);
    function he(e, t) {
      if (ne(e) && e.hasOwnProperty("raw"))
        return void 0 !== Q ? Q.createHTML(t) : t;
      throw Error("invalid template strings array");
    }
    class b {
      constructor({ strings: e, _$litType$: t }, n) {
        var o;
        this.parts = [];
        let r = 0,
          s = 0,
          i = e.length - 1,
          a = this.parts,
          [l, c] = ((s, e) => {
            let t = s.length - 1,
              a = [],
              l,
              c = 2 === e ? "<svg>" : 3 === e ? "<math>" : "",
              u = p;
            for (let r = 0; r < t; r++) {
              let e = s[r],
                t,
                n,
                i = -1,
                o = 0;
              for (
                ;
                o < e.length && ((u.lastIndex = o), null !== (n = u.exec(e)));
              )
                ((o = u.lastIndex),
                  u === p
                    ? "!--" === n[1]
                      ? (u = oe)
                      : void 0 !== n[1]
                        ? (u = re)
                        : void 0 !== n[2]
                          ? (le.test(n[2]) && (l = RegExp("</" + n[2], "g")),
                            (u = f))
                          : void 0 !== n[3] && (u = f)
                    : u === f
                      ? ">" === n[0]
                        ? ((u = l ?? p), (i = -1))
                        : void 0 === n[1]
                          ? (i = -2)
                          : ((i = u.lastIndex - n[2].length),
                            (t = n[1]),
                            (u = void 0 === n[3] ? f : '"' === n[3] ? ae : se))
                      : u === ae || u === se
                        ? (u = f)
                        : u === oe || u === re
                          ? (u = p)
                          : ((u = f), (l = void 0)));
              var d = u === f && s[r + 1].startsWith("/>") ? " " : "";
              c +=
                u === p
                  ? e + te
                  : 0 <= i
                    ? (a.push(t), e.slice(0, i) + "$lit$" + e.slice(i) + h + d)
                    : e + h + (-2 === i ? r : d);
            }
            return [
              he(
                s,
                c +
                  (s[t] || "<?>") +
                  (2 === e ? "</svg>" : 3 === e ? "</math>" : ""),
              ),
              a,
            ];
          })(e, t);
        if (
          ((this.el = b.createElement(l, n)),
          (y.currentNode = this.el.content),
          2 === t || 3 === t)
        ) {
          let e = this.el.content.firstChild;
          e.replaceWith(...e.childNodes);
        }
        for (; null !== (o = y.nextNode()) && a.length < i; ) {
          if (1 === o.nodeType) {
            if (o.hasAttributes())
              for (let i of o.getAttributeNames())
                if (i.endsWith("$lit$")) {
                  let e = c[s++],
                    t = o.getAttribute(i).split(h),
                    n = /([.?@])?(.*)/.exec(e);
                  (a.push({
                    type: 1,
                    index: r,
                    name: n[2],
                    strings: t,
                    ctor:
                      "." === n[1]
                        ? fe
                        : "?" === n[1]
                          ? ge
                          : "@" === n[1]
                            ? me
                            : z,
                  }),
                    o.removeAttribute(i));
                } else
                  i.startsWith(h) &&
                    (a.push({
                      type: 6,
                      index: r,
                    }),
                    o.removeAttribute(i));
            if (le.test(o.tagName)) {
              let t = o.textContent.split(h),
                n = t.length - 1;
              if (0 < n) {
                o.textContent = u ? u.emptyScript : "";
                for (let e = 0; e < n; e++)
                  (o.append(t[e], d()),
                    y.nextNode(),
                    a.push({
                      type: 2,
                      index: ++r,
                    }));
                o.append(t[n], d());
              }
            }
          } else if (8 === o.nodeType)
            if (o.data === ee)
              a.push({
                type: 2,
                index: r,
              });
            else {
              let e = -1;
              for (; -1 !== (e = o.data.indexOf(h, e + 1)); )
                (a.push({
                  type: 7,
                  index: r,
                }),
                  (e += h.length - 1));
            }
          r++;
        }
      }
      static createElement(e, t) {
        var n = l.createElement("template");
        return ((n.innerHTML = e), n);
      }
    }
    function w(t, n, i = t, o) {
      if (n !== m) {
        let e = void 0 !== o ? i._$Co?.[o] : i._$Cl;
        var r = c(n) ? void 0 : n._$litDirective$;
        (e?.constructor !== r &&
          (e?._$AO?.(!1),
          void 0 === r ? (e = void 0) : (e = new r(t))._$AT(t, i, o),
          void 0 !== o ? ((i._$Co ??= [])[o] = e) : (i._$Cl = e)),
          void 0 !== e && (n = w(t, e._$AS(t, n.values), e, o)));
      }
      return n;
    }
    class pe {
      constructor(e, t) {
        ((this._$AV = []),
          (this._$AN = void 0),
          (this._$AD = e),
          (this._$AM = t));
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t) {
        var {
            el: { content: e },
            parts: n,
          } = this._$AD,
          e = (t?.creationScope ?? l).importNode(e, !0);
        y.currentNode = e;
        let i = y.nextNode(),
          o = 0,
          r = 0,
          s = n[0];
        for (; void 0 !== s; ) {
          if (o === s.index) {
            let e;
            (2 === s.type
              ? (e = new C(i, i.nextSibling, this, t))
              : 1 === s.type
                ? (e = new s.ctor(i, s.name, s.strings, this, t))
                : 6 === s.type && (e = new ve(i, this, t)),
              this._$AV.push(e),
              (s = n[++r]));
          }
          o !== s?.index && ((i = y.nextNode()), o++);
        }
        return ((y.currentNode = l), e);
      }
      p(e) {
        let t = 0;
        for (var n of this._$AV)
          (void 0 !== n &&
            (void 0 !== n.strings
              ? (n._$AI(e, n, t), (t += n.strings.length - 2))
              : n._$AI(e[t])),
            t++);
      }
    }
    class C {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(e, t, n, i) {
        ((this.type = 2),
          (this._$AH = v),
          (this._$AN = void 0),
          (this._$AA = e),
          (this._$AB = t),
          (this._$AM = n),
          (this.options = i),
          (this._$Cv = i?.isConnected ?? !0));
      }
      get parentNode() {
        let e = this._$AA.parentNode;
        var t = this._$AM;
        return (e = void 0 !== t && 11 === e?.nodeType ? t.parentNode : e);
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(e, t = this) {
        ((e = w(this, e, t)),
          c(e)
            ? e === v || null == e || "" === e
              ? (this._$AH !== v && this._$AR(), (this._$AH = v))
              : e !== this._$AH && e !== m && this._(e)
            : void 0 !== e._$litType$
              ? this.$(e)
              : void 0 !== e.nodeType
                ? this.T(e)
                : ((t = e),
                  ne(t) || "function" == typeof t?.[Symbol.iterator]
                    ? this.k(e)
                    : this._(e)));
      }
      O(e) {
        return this._$AA.parentNode.insertBefore(e, this._$AB);
      }
      T(e) {
        this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
      }
      _(e) {
        (this._$AH !== v && c(this._$AH)
          ? (this._$AA.nextSibling.data = e)
          : this.T(l.createTextNode(e)),
          (this._$AH = e));
      }
      $(e) {
        let { values: n, _$litType$: t } = e,
          i =
            "number" == typeof t
              ? this._$AC(e)
              : (void 0 === t.el &&
                  (t.el = b.createElement(he(t.h, t.h[0]), this.options)),
                t);
        if (this._$AH?._$AD === i) this._$AH.p(n);
        else {
          let e = new pe(i, this),
            t = e.u(this.options);
          (e.p(n), this.T(t), (this._$AH = e));
        }
      }
      _$AC(e) {
        let t = de.get(e.strings);
        return (void 0 === t && de.set(e.strings, (t = new b(e))), t);
      }
      k(e) {
        ne(this._$AH) || ((this._$AH = []), this._$AR());
        var t,
          n = this._$AH;
        let i,
          o = 0;
        for (t of e)
          (o === n.length
            ? n.push((i = new C(this.O(d()), this.O(d()), this, this.options)))
            : (i = n[o]),
            i._$AI(t),
            o++);
        o < n.length && (this._$AR(i && i._$AB.nextSibling, o), (n.length = o));
      }
      _$AR(t = this._$AA.nextSibling, e) {
        for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
          let e = t.nextSibling;
          (t.remove(), (t = e));
        }
      }
      setConnected(e) {
        void 0 === this._$AM && ((this._$Cv = e), this._$AP?.(e));
      }
    }
    class z {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(e, t, n, i, o) {
        ((this.type = 1),
          (this._$AH = v),
          (this._$AN = void 0),
          (this.element = e),
          (this.name = t),
          (this._$AM = i),
          (this.options = o),
          2 < n.length || "" !== n[0] || "" !== n[1]
            ? ((this._$AH = Array(n.length - 1).fill(new String())),
              (this.strings = n))
            : (this._$AH = v));
      }
      _$AI(i, o = this, r, e) {
        var s = this.strings;
        let a = !1;
        if (void 0 === s)
          ((i = w(this, i, o, 0)),
            (a = !c(i) || (i !== this._$AH && i !== m)) && (this._$AH = i));
        else {
          let e = i,
            t,
            n;
          for (i = s[0], t = 0; t < s.length - 1; t++)
            ((n = w(this, e[r + t], o, t)) === m && (n = this._$AH[t]),
              (a ||= !c(n) || n !== this._$AH[t]),
              n === v ? (i = v) : i !== v && (i += (n ?? "") + s[t + 1]),
              (this._$AH[t] = n));
        }
        a && !e && this.j(i);
      }
      j(e) {
        e === v
          ? this.element.removeAttribute(this.name)
          : this.element.setAttribute(this.name, e ?? "");
      }
    }
    class fe extends z {
      constructor() {
        (super(...arguments), (this.type = 3));
      }
      j(e) {
        this.element[this.name] = e === v ? void 0 : e;
      }
    }
    class ge extends z {
      constructor() {
        (super(...arguments), (this.type = 4));
      }
      j(e) {
        this.element.toggleAttribute(this.name, !!e && e !== v);
      }
    }
    class me extends z {
      constructor(e, t, n, i, o) {
        (super(e, t, n, i, o), (this.type = 5));
      }
      _$AI(e, t = this) {
        var n, i;
        (e = w(this, e, t, 0) ?? v) !== m &&
          ((t = this._$AH),
          (n =
            (e === v && t !== v) ||
            e.capture !== t.capture ||
            e.once !== t.once ||
            e.passive !== t.passive),
          (i = e !== v && (t === v || n)),
          n && this.element.removeEventListener(this.name, this, t),
          i && this.element.addEventListener(this.name, this, e),
          (this._$AH = e));
      }
      handleEvent(e) {
        "function" == typeof this._$AH
          ? this._$AH.call(this.options?.host ?? this.element, e)
          : this._$AH.handleEvent(e);
      }
    }
    class ve {
      constructor(e, t, n) {
        ((this.element = e),
          (this.type = 6),
          (this._$AN = void 0),
          (this._$AM = t),
          (this.options = n));
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(e) {
        w(this, e);
      }
    }
    ((0, K.litHtmlPolyfillSupport)?.(b, C),
      (K.litHtmlVersions ??= []).push("3.2.1"));
    var ye,
      a = class extends a {
        constructor() {
          (super(...arguments),
            (this.renderOptions = {
              host: this,
            }),
            (this._$Do = void 0));
        }
        createRenderRoot() {
          var e = super.createRenderRoot();
          return ((this.renderOptions.renderBefore ??= e.firstChild), e);
        }
        update(e) {
          var t = this.render();
          (this.hasUpdated ||
            (this.renderOptions.isConnected = this.isConnected),
            super.update(e),
            (this._$Do = ((e, t, n) => {
              var i = n?.renderBefore ?? t;
              let o = i._$litPart$;
              if (void 0 === o) {
                let e = n?.renderBefore ?? null;
                i._$litPart$ = o = new C(
                  t.insertBefore(d(), e),
                  e,
                  void 0,
                  n ?? {},
                );
              }
              return (o._$AI(e), o);
            })(t, this.renderRoot, this.renderOptions)));
        }
        connectedCallback() {
          (super.connectedCallback(), this._$Do?.setConnected(!0));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(), this._$Do?.setConnected(!1));
        }
        render() {
          return m;
        }
      };
    ((a._$litElement$ = !0),
      (a.finalized = !0),
      globalThis.litElementHydrateSupport?.({
        LitElement: a,
      }),
      (0, globalThis.litElementPolyfillSupport)?.({
        LitElement: a,
      }),
      (globalThis.litElementVersions ??= []).push("4.1.1"));
    let be = {
      attribute: !0,
      type: String,
      converter: s,
      reflect: !1,
      hasChanged: Y,
    };
    function S(o) {
      return (e, t) => {
        return "object" == typeof t
          ? ((i = be, o, e) => {
              let { kind: t, metadata: n } = e,
                r = globalThis.litPropertyMetadata.get(n);
              if (
                (void 0 === r &&
                  globalThis.litPropertyMetadata.set(n, (r = new Map())),
                r.set(e.name, i),
                "accessor" === t)
              ) {
                let n = e.name;
                return {
                  set(e) {
                    var t = o.get.call(this);
                    (o.set.call(this, e), this.requestUpdate(n, t, i));
                  },
                  init(e) {
                    return (void 0 !== e && this.P(n, void 0, i), e);
                  },
                };
              }
              if ("setter" !== t)
                throw Error("Unsupported decorator location: " + t);
              {
                let n = e.name;
                return function (e) {
                  var t = this[n];
                  (o.call(this, e), this.requestUpdate(n, t, i));
                };
              }
            })(o, e, t)
          : ((n = o),
            (t = t),
            (i = (e = e).hasOwnProperty(t)),
            e.constructor.createProperty(
              t,
              i
                ? {
                    ...n,
                    wrapped: !0,
                  }
                : n,
            ),
            i ? Object.getOwnPropertyDescriptor(e, t) : void 0);
        var n, i;
      };
    }
    function we(e) {
      return S({
        ...e,
        state: !0,
        attribute: !1,
      });
    }
    function x(o) {
      return (e, t, n) => {
        return (
          (e = e),
          (t = t),
          (i = {
            get() {
              return this.renderRoot?.querySelector(o) ?? null;
            },
            configurable: !0,
            enumerable: !0,
          }),
          Reflect.decorate &&
            "object" != typeof t &&
            Object.defineProperty(e, t, i),
          i
        );
        var i;
      };
    }
    let Ce = (e) => "string" == typeof e || Array.isArray(e),
      ze = (e) =>
        e
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()
          .trim(),
      k = (u) => (a, l) => {
        {
          var c = u;
          let e = ze(c),
            t = Ce(a) ? [].concat(a) : [],
            n = (Ce(a) ? l : a) || {},
            i = t.reduce((e, t) => {
              t = ze(t);
              return t ? e.concat(t) : e;
            }, []),
            o = Object.entries(n).reduce((e, [t, n]) => {
              t = ze(t);
              return t && n ? e.concat(t) : e;
            }, []),
            r = "" + e + (i.length ? "__" + i.join("__") : ""),
            s = o.map((e) => r + "--" + e);
          return [r].concat(s).join(" ");
        }
      },
      _ = i`
  /**
   * Applies to children of host, so that they cannot be overridden
   */
  :host > * {
    /**
     * Prevents consumers from overriding styles using rules that are inheritable,
     * and thus pierce the shadow DOM boundary.
     *
     * Rather than setting 'all: initial', which can have unintended consequences,
     * we are explicit about which inheritable properties we do not want to inherit,
     * and provide a sensible default.
     */
    -webkit-font-smoothing: antialiased;
    font-size-adjust: none;
    font-style: normal;
    font-stretch: normal;
    font-synthesis: none;
    text-align: start;
    text-align-last: auto;
    text-indent: 0;
    text-justify: auto;
    text-shadow: none;
    text-transform: none;
    text-underline-position: auto;
    white-space: normal;
    word-spacing: normal;
    word-break: normal;
    line-break: auto;
    caret-color: currentColor;
    font-optical-sizing: auto;
    hyphens: "manual";
    orphans: 2;
    widows: 2;
  }

  :host,
  *,
  ::slotted(*),
  *::before,
  ::slotted(*)::before,
  *::after,
  ::slotted(*)::after {
    box-sizing: border-box;
  }

  :host {
    display: block;
  }

  p,
  ::slotted(p),
  ol,
  ::slotted(ol),
  ul,
  ::slotted(ul),
  li,
  ::slotted(li),
  dl,
  ::slotted(dl),
  dt,
  ::slotted(dt),
  dd,
  ::slotted(dd),
  blockquote,
  ::slotted(blockquote),
  figure,
  ::slotted(figure),
  fieldset,
  ::slotted(fieldset),
  legend,
  ::slotted(legend),
  button,
  ::slotted(button),
  input,
  ::slotted(input),
  textarea,
  ::slotted(textarea),
  select,
  ::slotted(select),
  pre,
  ::slotted(pre),
  iframe,
  ::slotted(iframe),
  dialog,
  ::slotted(dialog),
  hr,
  ::slotted(hr),
  h1,
  ::slotted(h1),
  h2,
  ::slotted(h2),
  h3,
  ::slotted(h3),
  h4,
  ::slotted(h4),
  h5,
  ::slotted(h5),
  h6,
  ::slotted(h6) {
    margin: 0;
    border: 0;
    padding: 0;
    outline: 0;
  }

  h1,
  ::slotted(h1),
  h2,
  ::slotted(h2),
  h3,
  ::slotted(h3),
  h4,
  ::slotted(h4),
  h5,
  ::slotted(h5),
  h6,
  ::slotted(h6) {
    font-size: inherit;
    font-weight: inherit;
  }

  ul,
  ::slotted(ul) {
    list-style: none;
  }

  label,
  ::slotted(label) {
    display: block;
  }

  button,
  ::slotted(button),
  input,
  ::slotted(input),
  textarea,
  ::slotted(textarea),
  select,
  ::slotted(select) {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
    background-color: transparent;
    appearance: none;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  a,
  ::slotted(a) {
    color: inherit;
    text-decoration: inherit;
    outline: 0;
  }

  img,
  ::slotted(img),
  video,
  ::slotted(video) {
    display: block;
    block-size: auto;
    max-inline-size: 100%;
  }

  iframe,
  ::slotted(iframe) {
    border: 0;
  }

  table,
  ::slotted(table) {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  ::slotted(td),
  th,
  ::slotted(th) {
    padding: 0;
  }
`,
      $ = i`
  :host {
    --puzzle--dimension--space: 4px;

    --puzzle--color--content--neutral: rgba(255, 255, 255, 1);
    --puzzle--color--content--neutral--high: rgba(0, 0, 0, 1);
    --puzzle--color--content--neutral--medium: rgba(51, 51, 51, 1);
    --puzzle--color--content--accent--low: rgba(1, 66, 255, 1);

    --puzzle--color--content--disabled: rgba(0, 0, 0, 0.21);

    --puzzle--color--background--inverse--noon: rgba(0, 0, 0, 1);

    --puzzle--color--background--disabled: rgba(0, 0, 0, 0.03);

    --puzzle--color--background--neutral:           rgba(0, 0, 0, 0.07);
    --puzzle--color--background--neutral--strong:   rgba(0, 0, 0, 0.12);
    --puzzle--color--background--neutral--stronger: rgba(0, 0, 0, 0.21);

    --puzzle--color--background--accent--tone:   rgba(67, 124, 255, 0.13);
    --puzzle--color--background--accent--strong: rgba(67, 124, 255, 0.24);

    --puzzle--color--background--accent--noon:      rgba(11, 76, 255, 1);
    --puzzle--color--background--accent--afternoon: rgba(1, 56, 222, 1);
    --puzzle--color--background--accent--evening:   rgba(0, 41, 171, 1);

    --puzzle--border--stroke--thin:        1px;
    --puzzle--border--stroke--extra-light: 2px;

    --puzzle--border--corner--sharp:	   0px;
    --puzzle--border--corner--x-small:	 1px;
    --puzzle--border--corner--small:	   2px;
    --puzzle--border--corner--medium:	   4px;
    --puzzle--border--corner--large:	   8px;
    --puzzle--border--corner--x-large:   16px;
    --puzzle--border--corner--circle:	   100vmax;

    --puzzle--type--weight--thin:        100;
    --puzzle--type--weight--extra-light: 200;
    --puzzle--type--weight--light:       300;
    --puzzle--type--weight--regular:	   400;
    --puzzle--type--weight--medium:	     500;
    --puzzle--type--weight--semi-bold:	 600;
    --puzzle--type--weight--bold:	       700;
  }
`,
      Se = {
        accent: "info-outline",
        guidance: "lightbulb",
        negative: "error",
        warning: "warning",
        positive: "check-circle",
      },
      xe = {
        accent: "status",
        guidance: "status",
        negative: "alert",
        warning: "status",
        positive: "status",
      },
      ke = i`
  :host {
    display: block;
  }

  /**
   * Block
   */
  .banner {
    display: flex;
    align-items: center;
    gap: calc(var(--puzzle--dimension--space) * 2);
    padding: calc(var(--puzzle--dimension--space) * 3);
    border-radius: var(--puzzle--border--corner--medium);
    font-size: 14px;
    line-height: 20px;
  }

  /**
   * Element: content
   */
  .banner__content {
    word-break: break-word;
  }

  /**
   * Element: dismiss-button
   */
  .banner__dismiss-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: baseline;
    margin-inline-start: auto;
    border-radius: var(--puzzle--border--corner--medium);
    color: inherit;
    cursor: pointer;
    transition: background-color 80ms ease-in-out;
  }

  .banner__dismiss-button::before {
    position: absolute;
    z-index: -1;
    content: "";
    display: block;
    width: calc(var(--puzzle--dimension--space) * 7);
    height: calc(var(--puzzle--dimension--space) * 7);
    border-radius: var(--puzzle--border--corner--medium);
    transition: background-color 80ms ease-in-out;
  }

  .banner__dismiss-button:focus-visible::before {
    outline-width: var(--puzzle--border--stroke--extra-light);
    outline-color: var(--puzzle--color--background--inverse--noon);
    outline-style: solid;
    outline-offset: var(--puzzle--border--stroke--extra-light);
  }

  .banner__dismiss-button:hover::before,
  .banner__dismiss-button:focus::before {
    background-color: rgb(52 52 52 / 0.07);
  }

  .banner__dismiss-button:active::before {
    background-color: rgb(52 52 52 / 0.15);
  }

  /**
   * Modifier: variant
   */
  .banner--color-accent {
    background-color: rgb(67 124 255 / 0.13);
    color: rgb(1 66 255 / 1);
  }

  .banner--color-positive {
    background-color: rgb(102 255 102 / 0.13);
    color: rgb(0 128 0 / 1);
  }

  .banner--color-negative {
    background-color: rgb(255 37 37 / 0.1);
    color: rgb(191 0 0 / 1);
  }

  .banner--color-warning {
    background-color: rgb(255 132 45 / 0.18);
    color: rgb(158 66 0 / 1);
  }

  .banner--color-guidance {
    background-color: rgb(179 81 255 / 0.12);
    color: rgb(145 0 219 / 1);
  }

  /**
   * Slotted elements
   * NB: these styles would only work if the link is a
   * direct child of the banner.
   */
  ::slotted(a) {
    color: inherit;
    font-weight: var(--puzzle--type--weight--medium);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  ::slotted(a:hover) {
    color: inherit;
  }

  ::slotted(a:focus-visible) {
    outline: var(--puzzle--border--stroke--extra-light) solid currentColor;
    outline-offset: var(--puzzle--border--stroke--extra-light);
    border-radius: var(--puzzle--border--corner--x-small);
  }
`,
      M = k("banner");
    class T extends a {
      constructor() {
        (super(...arguments),
          (this._variant = "accent"),
          (this.noIcon = !1),
          (this.allowDismiss = !1));
      }
      get variant() {
        return this._variant;
      }
      set variant(e) {
        var t = this._variant;
        ((this._variant = e ?? "accent"),
          t !== this._variant && this.requestUpdate("variant", t));
      }
      onBannerDismiss() {
        var e = new Event("requestdismiss", {
          bubbles: !0,
          composed: !0,
          cancelable: !0,
        });
        this.dispatchEvent(e);
      }
      renderDismissButton() {
        return g`
      <button
        type="button"
        class=${M("dismiss-button")}
        aria-label="Dismiss"
        @click=${this.onBannerDismiss}
      >
        <puzzle-icon name="clear" size="small"></puzzle-icon>
      </button>
    `;
      }
      render() {
        var { variant: e, allowDismiss: t } = this,
          n = Se[e];
        return g`
      <div role=${xe[e]} class=${M({
        ["color-" + e]: !0,
      })}>
        ${
          this.noIcon
            ? v
            : g`
              <puzzle-icon
                class=${M("icon")}
                .name=${n}
                size="small"
              ></puzzle-icon>
            `
        }
        <div class=${M("content")}>
          <slot></slot>
        </div>
        ${t ? this.renderDismissButton() : v}
      </div>
    `;
      }
    }
    ((T.styles = [_, $, ke]),
      t(
        [
          S({
            type: String,
            reflect: !0,
          }),
          n("design:type", String),
          n("design:paramtypes", [String]),
        ],
        T.prototype,
        "variant",
        null,
      ),
      t(
        [
          S({
            type: Boolean,
            attribute: "no-icon",
          }),
          n("design:type", Object),
        ],
        T.prototype,
        "noIcon",
        void 0,
      ),
      t(
        [
          S({
            type: Boolean,
            attribute: "allow-dismiss",
          }),
          n("design:type", Boolean),
        ],
        T.prototype,
        "allowDismiss",
        void 0,
      ),
      customElements.define("puzzle-banner", T));
    let _e = "regular",
      $e = i`
  :host {
    display: inline-flex;
    vertical-align: top;
    max-inline-size: 100%;
    min-inline-size: 0;
    -webkit-tap-highlight-color: transparent;
  }

  /**
   * Block
   */

  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    gap: calc(var(--puzzle--dimension--space) * 1.5);
    line-height: 1.5rem;
    text-decoration: none;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    touch-action: manipulation;
    padding: 0;
    color: var(--puzzle--color--content--neutral--medium);
    background-color: transparent;
    border: 0;
    outline: 0;
    text-align: center;
    font-size: 14px;
    font-weight: var(--puzzle--type--weight--medium);
    border-radius: var(--puzzle--border--corner--medium);
    -webkit-tap-highlight-color: transparent;
    transition: background-color 80ms ease-in-out;
  }

  /**
   * Modifier: size-small
   */

  .button--size-small {
    padding-block: calc(var(--puzzle--dimension--space) * 1);
    padding-inline: calc(var(--puzzle--dimension--space) * 2);
  }

  .button--size-small.button--icon-only {
    padding: calc(var(--puzzle--dimension--space) * 1);
  }

  /*
   * Modifier: size-medium
   */

  .button--size-medium {
    padding-block: calc(var(--puzzle--dimension--space) * 2);
    padding-inline: calc(var(--puzzle--dimension--space) * 3);
  }

  .button--size-medium.button--icon-only {
    padding: calc(var(--puzzle--dimension--space) * 2);
  }

  /**
   * Modifier: with-caption
   *
   * Used to provide additional caption text for icon-only buttons.
   * The maximum available width is 100% of the button width plus 16px.
   * Any wider text than that won't be cut off but it won't be entirely centered on purpose.
   */

  :host([caption]) {
    /**
     * NB: Exposing CSS custom properties to the host element so we can control the caption
     * visibility from outside the component based on media queries or other conditions.
     *
     * Example:
     * <puzzle-button caption="Title" style="--caption-display: none; --caption-margin: 0;"></puzzle-button>
     */
    --caption-display: block;
    --caption-margin: calc(var(--puzzle--dimension--space) * 5);
  }

  .button--with-caption {
    margin-block-end: var(--caption-margin);
  }

  .button--with-caption::after {
    position: absolute;
    top: 100%;
    content: attr(data-caption);
    display: var(--caption-display);
    font-size: 12px;
    line-height: 1.25rem;
    color: rgb(102, 102, 102);
    max-width: calc(100% + calc(var(--puzzle--dimension--space) * 2));
    white-space: nowrap;
  }

  /**
   * Modifier: focus-visible
   */

  .button:not(.button--disabled):focus-visible {
    outline-width: var(--puzzle--border--stroke--extra-light);
    outline-color: var(--puzzle--color--background--inverse--noon);
    outline-style: solid;
    outline-offset: var(--puzzle--border--stroke--extra-light);
  }

  /**
   * Modifier: active
   */

  .button--active:not(.button--disabled) {
    background-color: var(--puzzle--color--background--accent--tone);
    color: var(--puzzle--color--content--accent--low);
  }

  /**
   * Modifier: solid
   */

  .button--solid:not(.button--disabled, .button--active) {
    background-color: var(--puzzle--color--background--neutral);
  }

  @media (hover: hover) {
    .button--solid:not(.button--disabled, .button--active):hover {
      background-color: var(--puzzle--color--background--neutral--strong);
    }
  }

  .button--solid:not(.button--disabled, .button--active):focus-visible {
    background-color: var(--puzzle--color--background--neutral--strong);
  }

  .button--solid:not(.button--disabled, .button--active):active {
    background-color: var(--puzzle--color--background--neutral--stronger);
  }

  /**
   * Modifier: subtle
   */

  @media (hover: hover) {
    .button--subtle:not(.button--disabled, .button--active):hover {
      background-color: var(--puzzle--color--background--neutral--strong);
    }
  }

  .button--subtle:not(.button--disabled, .button--active):focus-visible {
    background-color: var(--puzzle--color--background--neutral--strong);
  }

  .button--subtle:not(.button--disabled, .button--active):active {
    background-color: var(--puzzle--color--background--neutral--stronger);
  }

  /**
   * Modifier: disabled
   */

  .button--disabled {
    cursor: not-allowed;
  }

  .button--disabled,
  .button--disabled:is(:hover, :active, :visited) {
    color: var(--puzzle--color--content--disabled);
  }

  .button--disabled.button--solid {
    background-color: var(--puzzle--color--background--disabled);
  }

  /**
   * Modifier: color-accent
   */

  .button--color-accent.button--solid:not(.button--disabled) {
    color: var(--puzzle--color--content--neutral);
  }

  .button--color-accent.button--solid:not(.button--disabled) {
    background-color: var(--puzzle--color--background--accent--noon);
  }

  @media (hover: hover) {
    .button--color-accent.button--solid:not(
        .button--disabled,
        .button--active
      ):hover {
      background-color: var(--puzzle--color--background--accent--afternoon);
    }
  }

  .button--color-accent.button--solid:not(
      .button--disabled,
      .button--active
    ):focus-visible {
    background-color: var(--puzzle--color--background--accent--afternoon);
  }

  .button--color-accent.button--solid:not(
      .button--disabled,
      .button--active
    ):active {
    background-color: var(--puzzle--color--background--accent--evening);
  }

  .button--color-accent.button--subtle:not(.button--disabled) {
    color: var(--puzzle--color--content--accent--low);
  }

  @media (hover: hover) {
    .button--color-accent.button--subtle:not(
        .button--disabled,
        .button--active
      ):hover {
      background-color: var(--puzzle--color--background--accent--tone);
    }
  }

  .button--color-accent.button--subtle:not(
      .button--disabled,
      .button--active
    ):focus-visible {
    background-color: var(--puzzle--color--background--accent--tone);
  }

  .button--color-accent.button--subtle:not(
      .button--disabled,
      .button--active
    ):active {
    background-color: var(--puzzle--color--background--accent--strong);
  }
`,
      Me = k("button");
    class L extends a {
      constructor() {
        (super(),
          (this.type = "button"),
          (this._variant = _e),
          (this._size = "medium"),
          (this.active = !1),
          (this.disabled = !1),
          "ElementInternals" in window &&
            "attachInternals" in HTMLElement.prototype &&
            (this._internals = this.attachInternals()),
          this.addEventListener("click", this._handleSubmit.bind(this)));
      }
      _handleSubmit(e) {
        !this.disabled &&
          "submit" === this.type &&
          this._internals?.form &&
          setTimeout(() => {
            if (!e.defaultPrevented) {
              var t = this._internals?.form;
              if (t)
                if (this.name) {
                  let e = document.createElement("input");
                  ((e.type = "hidden"),
                    (e.name = this.name),
                    (e.value = this.value ?? ""),
                    t.appendChild(e),
                    t.requestSubmit(),
                    e.remove());
                } else t.requestSubmit();
            }
          }, 0);
      }
      get variant() {
        return this._variant;
      }
      set variant(e) {
        var t = this._variant;
        ((this._variant = e ?? _e),
          t !== this._variant && this.requestUpdate("variant", t));
      }
      get size() {
        return this._size;
      }
      set size(e) {
        var t = this._size;
        ((this._size = e ?? "medium"),
          t !== this._size && this.requestUpdate("size", t));
      }
      checkSlotContent() {
        var e = this.slotElement.assignedNodes();
        this.hasSlotContent = e.some(
          (e) =>
            (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) ||
            e.nodeType === Node.ELEMENT_NODE,
        );
      }
      _onClick(e) {
        this.disabled && (e.preventDefault(), e.stopPropagation());
      }
      renderIcon() {
        var { icon: e, iconSize: t } = this;
        return g`
      <puzzle-icon
        class=${Me("icon")}
        .name=${e}
        .size=${t}
      ></puzzle-icon>
    `;
      }
      renderContent() {
        var e = this.icon;
        return g`
      ${e ? this.renderIcon() : v}
      <slot class=${Me("label")} @slotchange=${this.checkSlotContent}></slot>
    `;
      }
      render() {
        var {
            variant: e,
            size: t,
            active: n,
            disabled: i,
            href: o,
            target: r,
            rel: s,
            assistLabel: a,
            caption: l,
            icon: c,
          } = this,
          u = e.replace("-subtle", ""),
          e = e.endsWith("-subtle"),
          d = !e,
          c = c && !this.hasSlotContent,
          u = Me({
            ["color-" + u]: !0,
            ["size-" + t]: !0,
            solid: d,
            subtle: e,
            iconOnly: c,
            "with-caption": !!l,
            active: n,
            disabled: i,
          });
        return o
          ? g`
        <a
          class=${u}
          href=${o}
          target=${r || v}
          rel=${s || v}
          aria-label=${a || l || v}
          data-caption=${l || v}
          aria-disabled=${i ? "true" : "false"}
          tabindex=${i ? -1 : v}
          @click=${this._onClick}
        >
          ${this.renderContent()}
        </a>
      `
          : g`
      <button
        type="button"
        class=${u}
        aria-label=${a || l || v}
        data-caption=${l || v}
        aria-disabled=${i ? "true" : "false"}
        tabindex=${i ? -1 : v}
        @click=${this._onClick}
      >
      ${this.renderContent()}
    </button>
  `;
      }
    }
    ((L.styles = [_, $, $e]),
      (L.formAssociated = !0),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        L.prototype,
        "type",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        L.prototype,
        "name",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        L.prototype,
        "value",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
          n("design:paramtypes", [String]),
        ],
        L.prototype,
        "variant",
        null,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
          n("design:paramtypes", [String]),
        ],
        L.prototype,
        "size",
        null,
      ),
      t(
        [
          S({
            type: Boolean,
            reflect: !0,
          }),
          n("design:type", Object),
        ],
        L.prototype,
        "active",
        void 0,
      ),
      t(
        [
          S({
            type: Boolean,
            reflect: !0,
          }),
          n("design:type", Object),
        ],
        L.prototype,
        "disabled",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", Object),
        ],
        L.prototype,
        "href",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", Object),
        ],
        L.prototype,
        "target",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", Object),
        ],
        L.prototype,
        "rel",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "assist-label",
          }),
          n("design:type", String),
        ],
        L.prototype,
        "assistLabel",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            reflect: !0,
          }),
          n("design:type", String),
        ],
        L.prototype,
        "caption",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        L.prototype,
        "icon",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "icon-size",
          }),
          n("design:type", String),
        ],
        L.prototype,
        "iconSize",
        void 0,
      ),
      t(
        [we(), n("design:type", Boolean)],
        L.prototype,
        "hasSlotContent",
        void 0,
      ),
      t(
        [x("slot"), n("design:type", HTMLSlotElement)],
        L.prototype,
        "slotElement",
        void 0,
      ),
      customElements.define("puzzle-button", L));
    class Te extends class {
      constructor(e) {}
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AT(e, t, n) {
        ((this._$Ct = e), (this._$AM = t), (this._$Ci = n));
      }
      _$AS(e, t) {
        return this.update(e, t);
      }
      update(e, t) {
        return this.render(...t);
      }
    } {
      constructor(e) {
        if ((super(e), (this.it = v), 2 !== e.type))
          throw Error(
            this.constructor.directiveName +
              "() can only be used in child bindings",
          );
      }
      render(e) {
        if (e === v || null == e) return ((this._t = void 0), (this.it = e));
        if (e === m) return e;
        if ("string" != typeof e)
          throw Error(
            this.constructor.directiveName +
              "() called with a non-string value",
          );
        return e === this.it
          ? this._t
          : ((e = [(this.it = e)]),
            (this._t = {
              _$litType$: this.constructor.resultType,
              strings: (e.raw = e),
              values: [],
            }));
      }
    }
    ((Te.directiveName = "unsafeHTML"), (Te.resultType = 1));
    class Le extends Te {}
    ((Le.directiveName = "unsafeSVG"), (Le.resultType = 2));
    ye = Le;
    let Ee = (...e) => ({
        _$litDirective$: ye,
        values: e,
      }),
      Ae = {
        account:
          '<path d="M5.85 17.1q1.275-0.975 2.85-1.538t3.3-0.563 3.3 0.563 2.85 1.538q0.875-1.025 1.362-2.325t0.487-2.775q0-3.325-2.337-5.663t-5.663-2.337-5.662 2.337-2.337 5.663q0 1.475 0.488 2.775t1.362 2.325zM12 13q-1.475 0-2.487-1.013t-1.012-2.487 1.012-2.487 2.487-1.013 2.487 1.013 1.013 2.487-1.013 2.487-2.487 1.013zM12 22q-2.075 0-3.9-0.788t-3.175-2.138-2.137-3.175-0.788-3.9 0.787-3.9 2.137-3.175 3.175-2.137 3.9-0.788 3.9 0.787 3.175 2.137 2.138 3.175 0.788 3.9-0.788 3.9-2.138 3.175-3.175 2.138-3.9 0.788zM12 20q1.325 0 2.5-0.387t2.15-1.113q-0.975-0.725-2.15-1.113t-2.5-0.387-2.5 0.387-2.15 1.113q0.975 0.725 2.15 1.113t2.5 0.387zM12 11q0.65 0 1.075-0.425t0.425-1.075-0.425-1.075-1.075-0.425-1.075 0.425-0.425 1.075 0.425 1.075 1.075 0.425z"></path>',
        add: '<path d="M12 19C11.7167 19 11.4793 18.904 11.288 18.712C11.096 18.5207 11 18.2833 11 18V13H6C5.71667 13 5.479 12.904 5.287 12.712C5.09567 12.5207 5 12.2833 5 12C5 11.7167 5.09567 11.479 5.287 11.287C5.479 11.0957 5.71667 11 6 11H11V6C11 5.71667 11.096 5.479 11.288 5.287C11.4793 5.09567 11.7167 5 12 5C12.2833 5 12.521 5.09567 12.713 5.287C12.9043 5.479 13 5.71667 13 6V11H18C18.2833 11 18.5207 11.0957 18.712 11.287C18.904 11.479 19 11.7167 19 12C19 12.2833 18.904 12.5207 18.712 12.712C18.5207 12.904 18.2833 13 18 13H13V18C13 18.2833 12.9043 18.5207 12.713 18.712C12.521 18.904 12.2833 19 12 19Z" />',
        alarm:
          '<path d="M13 12.6V9a.967.967 0 0 0-.287-.713A.967.967 0 0 0 12 8a.968.968 0 0 0-.713.287A.968.968 0 0 0 11 9v3.975a1.033 1.033 0 0 0 .3.725l2.8 2.8a.949.949 0 0 0 .7.275.948.948 0 0 0 .7-.275.948.948 0 0 0 .275-.7.948.948 0 0 0-.275-.7L13 12.6ZM12 22c-1.25 0-2.42-.238-3.512-.713a9.149 9.149 0 0 1-2.85-1.925 9.147 9.147 0 0 1-1.925-2.85A8.707 8.707 0 0 1 3 13c0-1.25.238-2.42.713-3.513a9.148 9.148 0 0 1 1.925-2.85 9.148 9.148 0 0 1 2.85-1.925A8.707 8.707 0 0 1 12 4c1.25 0 2.42.237 3.512.712a9.147 9.147 0 0 1 2.85 1.925 9.147 9.147 0 0 1 1.926 2.85A8.707 8.707 0 0 1 21 13c0 1.25-.238 2.42-.712 3.512a9.146 9.146 0 0 1-1.925 2.85 9.148 9.148 0 0 1-2.85 1.925A8.707 8.707 0 0 1 12 22ZM2.05 7.3a.948.948 0 0 1-.275-.7.95.95 0 0 1 .275-.7L4.9 3.05a.948.948 0 0 1 .7-.275.95.95 0 0 1 .7.275.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7L3.45 7.3a.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275Zm19.9 0a.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275L17.7 4.45a.948.948 0 0 1-.275-.7.95.95 0 0 1 .275-.7.948.948 0 0 1 .7-.275.95.95 0 0 1 .7.275l2.85 2.85a.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7ZM12 20c1.95 0 3.604-.68 4.962-2.038C18.322 16.604 19 14.95 19 13c0-1.95-.68-3.604-2.038-4.963C15.604 6.68 13.95 6 12 6c-1.95 0-3.604.68-4.962 2.037C5.679 9.396 5 11.05 5 13c0 1.95.68 3.604 2.038 4.962C8.396 19.321 10.05 20 12 20Z"/>',
        "alternate-email":
          '<path d="M12 15q1.219 0 2.109-0.891t0.891-2.109-0.891-2.109-2.109-0.891-2.109 0.891-0.891 2.109 0.891 2.109 2.109 0.891zM12 2.016q4.125 0 7.055 2.93t2.93 7.055v1.453q0 1.5-1.008 2.531t-2.461 1.031q-1.828 0-2.953-1.5-1.5 1.5-3.563 1.5t-3.539-1.477-1.477-3.539 1.477-3.539 3.539-1.477 3.539 1.477 1.477 3.539v1.453q0 0.609 0.445 1.078t1.055 0.469 1.055-0.469 0.445-1.078v-1.453q0-3.281-2.367-5.648t-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367h5.016v1.969h-5.016q-4.125 0-7.055-2.93t-2.93-7.055 2.93-7.055 7.055-2.93z"></path>',
        "arrow-back":
          '<path d="M20.016 11.016v1.969h-12.188l5.578 5.625-1.406 1.406-8.016-8.016 8.016-8.016 1.406 1.406-5.578 5.625h12.188z"></path>',
        "arrow-down":
          '<path d="M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z"></path>',
        autorenew:
          '<path d="M18.75 7.734q1.266 1.922 1.266 4.266 0 3.281-2.367 5.648t-5.648 2.367v3l-3.984-4.031 3.984-3.984v3q2.484 0 4.242-1.758t1.758-4.242q0-1.406-0.703-2.813zM12 6q-2.484 0-4.242 1.758t-1.758 4.242q0 1.5 0.703 2.813l-1.453 1.453q-1.266-1.922-1.266-4.266 0-3.281 2.367-5.648t5.648-2.367v-3l3.984 4.031-3.984 3.984v-3z"></path>',
        avatar:
          '<path d="M12 12c-1.1 0-2.042-.392-2.825-1.175C8.392 10.042 8 9.1 8 8s.392-2.042 1.175-2.825C9.958 4.392 10.9 4 12 4s2.042.392 2.825 1.175C15.608 5.958 16 6.9 16 8s-.392 2.042-1.175 2.825C14.042 11.608 13.1 12 12 12Zm-8 6v-.8c0-.567.146-1.087.438-1.563A2.911 2.911 0 0 1 5.6 14.55a14.843 14.843 0 0 1 3.15-1.163A13.76 13.76 0 0 1 12 13c1.1 0 2.183.13 3.25.387 1.067.259 2.117.646 3.15 1.163.483.25.87.612 1.163 1.087.291.476.437.996.437 1.563v.8c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 20H6c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 4 18Z"/>',
        battleship:
          '<circle style="stroke: rgb(0, 0, 0);" cx="6" cy="12" r="4"></circle><circle style="stroke: rgb(0, 0, 0);" cx="18" cy="12" r="4"></circle><rect x="6.2" y="8" width="4.8" height="8" style="stroke: rgb(0, 0, 0);"></rect><rect x="13" y="8" width="4.8" height="8" style="stroke: rgb(0, 0, 0);"></rect>',
        cancel:
          '<path d="M17.016 15.609l-3.609-3.609 3.609-3.609-1.406-1.406-3.609 3.609-3.609-3.609-1.406 1.406 3.609 3.609-3.609 3.609 1.406 1.406 3.609-3.609 3.609 3.609zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>',
        "check-circle":
          '<path d="M10.6 16.6l7.050-7.050-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4 4.25 4.25zM12 22q-2.075 0-3.9-0.788t-3.175-2.138-2.137-3.175-0.788-3.9 0.787-3.9 2.137-3.175 3.175-2.137 3.9-0.788 3.9 0.787 3.175 2.137 2.138 3.175 0.788 3.9-0.788 3.9-2.138 3.175-3.175 2.138-3.9 0.788zM12 20q3.35 0 5.675-2.325t2.325-5.675-2.325-5.675-5.675-2.325-5.675 2.325-2.325 5.675 2.325 5.675 5.675 2.325z"></path>',
        "circle-black":
          '<circle style="stroke: rgb(255, 255, 255); fill: rgb(0, 0, 0);" cx="12" cy="12" r="9"></circle>',
        "circle-white":
          '<circle style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);" cx="12" cy="12" r="9"></circle>',
        "cleaning-services":
          '<path d="M15.984 11.016h-0.984v-8.016q0-0.844-0.586-1.43t-1.43-0.586h-1.969q-0.844 0-1.43 0.586t-0.586 1.43v8.016h-0.984q-1.406 0-2.531 0.656t-1.805 1.805-0.68 2.508v7.031h18v-7.031q0-1.359-0.68-2.508t-1.805-1.805-2.531-0.656zM18.984 21h-1.969v-3q0-0.422-0.305-0.703t-0.727-0.281q-0.375 0-0.68 0.281t-0.305 0.703v3h-2.016v-3q0-0.422-0.281-0.703t-0.703-0.281-0.703 0.281-0.281 0.703v3h-2.016v-3q0-0.422-0.305-0.703t-0.68-0.281q-0.422 0-0.727 0.281t-0.305 0.703v3h-1.969v-5.016q0-0.797 0.398-1.477t1.078-1.102 1.523-0.422h7.969q0.844 0 1.523 0.422t1.078 1.102 0.398 1.477v5.016z"></path>',
        clear:
          '<path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>',
        colors:
          '<path d="M8.65 20.5l-6.15-6.15q-0.25-0.25-0.375-0.55t-0.125-0.625 0.125-0.625 0.375-0.55l5.75-5.725-2.65-2.65 1.55-1.625 10 10q0.25 0.25 0.363 0.55t0.112 0.625-0.112 0.625-0.363 0.55l-6.15 6.15q-0.25 0.25-0.55 0.375t-0.625 0.125-0.625-0.125-0.55-0.375zM9.825 7.85l-5.35 5.35h10.7l-5.35-5.35zM19.8 21q-0.9 0-1.525-0.638t-0.625-1.563q0-0.675 0.337-1.275t0.762-1.175l1.050-1.35 1.1 1.35q0.4 0.575 0.75 1.175t0.35 1.275q0 0.925-0.65 1.563t-1.55 0.638z"></path>',
        create:
          '<path d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828q0.281-0.281 0.703-0.281t0.703 0.281l2.344 2.344q0.281 0.281 0.281 0.703t-0.281 0.703zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path>',
        cycle:
          '<rect x="5.38" y="10.813" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.571" y="2.568" width="10.485" height="10.309" style="stroke: rgb(255, 255, 255);"></rect><rect x="12.736" y="5.708" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.059" y1="13.041" x2="19.628" y2="8.869"></line><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.048" y1="8.859" x2="19.638" y2="13.051"></line>',
        "cycle-aquarium":
          '<rect x="5.38" y="10.813" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.571" y="2.568" width="10.485" height="10.309" style="fill: rgb(153, 204, 255); stroke: rgb(0, 0, 0);"></rect><rect x="12.736" y="5.708" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.059" y1="13.041" x2="19.628" y2="8.869"></line><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.048" y1="8.859" x2="19.638" y2="13.051"></line>',
        "cycle-battleships":
          '<rect x="5.38" y="10.813" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="12.736" y="5.708" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(153, 204, 255);"></rect><ellipse style="stroke: rgb(255, 255, 255);" cx="6.109" cy="8.308" rx="5.202" ry="5.202"></ellipse>',
        "cycle-binairo":
          '<rect x="5.38" y="10.813" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><circle style="stroke: rgb(0, 0, 0);" cx="6.304" cy="8.068" r="5.016"></circle><circle style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);" cx="17.585" cy="10.886" r="5.016"></circle>',
        "cycle-common":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(255, 255, 255);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.589" y1="12.454" x2="20.158" y2="8.282"></line><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.578" y1="8.272" x2="20.168" y2="12.464"></line>',
        "cycle-heyawake":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(204, 204, 204);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(102, 102, 102);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect>',
        "cycle-hitori":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(204, 204, 204);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(0, 0, 0);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect>',
        "cycle-light-up":
          '<rect x="5.65" y="10.722" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.841" y="2.477" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 153);"></rect><rect x="13.006" y="5.617" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.329" y1="12.95" x2="19.898" y2="8.778"></line><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.318" y1="8.768" x2="19.908" y2="12.96"></line><path style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);" d="M 5.165 9.285 L 6.881 9.318 L 7.281 8.102 L 8.031 7.151 L 8.264 5.919 L 7.615 4.902 L 6.615 4.352 L 5.365 4.319 L 4.398 4.868 L 3.832 5.702 L 3.899 6.885 L 4.582 7.901 L 5.199 9.285"></path><path d="M 7.042 6.13 C 7.042 6.177 7.024 6.215 6.989 6.244 C 6.954 6.273 6.919 6.289 6.883 6.289 C 6.849 6.289 6.811 6.273 6.77 6.244 C 6.729 6.215 6.714 6.177 6.726 6.13 C 6.726 5.984 6.637 5.87 6.462 5.788 C 6.287 5.705 6.114 5.664 5.943 5.664 C 5.903 5.664 5.864 5.65 5.829 5.621 C 5.793 5.591 5.78 5.553 5.786 5.507 C 5.79 5.459 5.806 5.422 5.829 5.392 C 5.852 5.363 5.89 5.348 5.943 5.348 C 6.108 5.348 6.269 5.374 6.426 5.428 C 6.584 5.481 6.729 5.567 6.858 5.691 C 6.986 5.814 7.047 5.961 7.042 6.13 Z M 7.823 6.13 C 7.823 5.896 7.767 5.678 7.657 5.481 C 7.545 5.281 7.399 5.113 7.216 4.979 C 7.036 4.845 6.834 4.742 6.611 4.671 C 6.388 4.602 6.166 4.567 5.943 4.567 C 5.721 4.567 5.498 4.602 5.276 4.671 C 5.053 4.742 4.851 4.845 4.67 4.979 C 4.488 5.113 4.342 5.281 4.231 5.481 C 4.12 5.678 4.06 5.896 4.055 6.13 C 4.055 6.464 4.166 6.761 4.389 7.017 C 4.424 7.053 4.473 7.105 4.539 7.176 C 4.603 7.246 4.652 7.302 4.687 7.343 C 5.109 7.84 5.34 8.326 5.381 8.801 L 6.497 8.801 C 6.545 8.326 6.775 7.84 7.19 7.343 C 7.226 7.307 7.276 7.251 7.34 7.176 C 7.405 7.099 7.454 7.047 7.49 7.017 C 7.713 6.761 7.823 6.464 7.823 6.13 Z M 8.448 6.13 C 8.448 6.64 8.281 7.079 7.946 7.449 C 7.8 7.606 7.678 7.747 7.577 7.869 C 7.478 7.993 7.381 8.151 7.287 8.344 C 7.194 8.537 7.139 8.713 7.12 8.871 C 7.273 8.959 7.349 9.094 7.349 9.275 C 7.349 9.391 7.311 9.495 7.235 9.583 C 7.311 9.671 7.349 9.776 7.349 9.899 C 7.349 10.069 7.276 10.201 7.129 10.295 C 7.176 10.37 7.2 10.447 7.2 10.523 C 7.2 10.675 7.147 10.792 7.042 10.874 C 6.937 10.957 6.811 10.997 6.664 10.997 C 6.6 11.143 6.5 11.258 6.365 11.339 C 6.231 11.422 6.09 11.466 5.943 11.471 C 5.796 11.478 5.654 11.432 5.514 11.339 C 5.373 11.247 5.276 11.132 5.223 10.997 C 5.072 10.997 4.942 10.957 4.837 10.874 C 4.731 10.792 4.682 10.675 4.687 10.523 C 4.687 10.447 4.707 10.37 4.749 10.295 C 4.603 10.201 4.529 10.069 4.529 9.899 C 4.529 9.776 4.57 9.671 4.652 9.583 C 4.57 9.495 4.529 9.391 4.529 9.275 C 4.529 9.094 4.605 8.959 4.757 8.871 C 4.746 8.708 4.69 8.531 4.59 8.344 C 4.491 8.157 4.396 7.998 4.301 7.869 C 4.207 7.741 4.087 7.599 3.941 7.449 C 3.601 7.079 3.431 6.64 3.431 6.13 C 3.431 5.808 3.504 5.507 3.651 5.224 C 3.797 4.945 3.987 4.713 4.221 4.531 C 4.455 4.349 4.725 4.207 5.029 4.101 C 5.335 3.995 5.64 3.94 5.943 3.934 C 6.248 3.927 6.552 3.983 6.858 4.101 C 7.161 4.217 7.428 4.362 7.657 4.531 C 7.885 4.701 8.078 4.932 8.237 5.224 C 8.395 5.519 8.465 5.82 8.448 6.13 Z" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-width: 0.05px;"></path>',
        "cycle-lits":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(153, 153, 153);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.589" y1="12.454" x2="20.158" y2="8.282"></line><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.578" y1="8.272" x2="20.168" y2="12.464"></line>',
        "cycle-lollipops":
          '<rect x="5.673" y="10.904" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"></rect><rect x="0.864" y="2.659" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"></rect><rect x="13.029" y="5.799" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0); stroke-width: 1;"></rect><circle style="stroke: rgb(0, 0, 0); stroke-width: 1;" cx="10.726" cy="16.123" r="0.782"></circle><circle style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);" cx="6.107" cy="7.813" r="2.632"></circle><line style="fill: none; stroke: rgb(0, 0, 0);" x1="18.066" y1="8.018" x2="18.099" y2="14.018"></line>',
        "cycle-hatch":
          '<rect x="5.65" y="10.722" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.841" y="2.477" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(204, 204, 255);"></rect><rect x="13.057" y="5.53" width="10.064" height="10.656" style="fill: rgb(255, 255, 255);"></rect><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204);" x1="13.101" y1="15.93" x2="22.993" y2="5.7"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204);" x1="18.238" y1="5.469" x2="23.057" y2="10.415"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204); " x1="13.017" y1="10.878" x2="17.836" y2="15.824"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204);" x1="13.144" y1="11.111" x2="18.343" y2="5.912"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204);" x1="13.228" y1="5.912" x2="22.824" y2="15.761"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(255, 204, 204);" x1="17.857" y1="15.782" x2="23.056" y2="10.583"></line><rect x="13.006" y="5.617" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: none;"></rect>',
        "cycle-nurikabe":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><circle style="stroke: rgb(0, 0, 0);" cx="18.23" cy="10.446" r="0.782"></circle>',
        "cycle-shakashaka":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><circle style="stroke: rgb(0, 0, 0);" cx="18.23" cy="10.446" r="0.782"></circle><polygon style="stroke: rgb(0, 0, 0);" points="1.294 11.558 10.61 2.193 1.294 2.193"></polygon>',
        "cycle-slant":
          '<rect x="5.91" y="10.226" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"></rect><rect x="1.101" y="1.981" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"></rect><rect x="13.266" y="5.121" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" x1="1.441" y1="11.901" x2="11.198" y2="2.438"></line><line style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" x1="22.966" y1="15.137" x2="13.65" y2="5.576"></line>',
        "cycle-star-battle":
          '<rect x="6.146" y="11.441" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"/><rect x="1.337" y="3.196" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"/><rect x="13.502" y="6.336" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"/><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.825" y1="13.669" x2="20.394" y2="9.497"/><line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(189, 25, 28);" x1="16.814" y1="9.487" x2="20.404" y2="13.679"/><path d="M 9.973 7.54 C 9.973 7.597 9.937 7.662 9.865 7.735 L 8.403 9.159 L 8.752 11.178 C 8.752 11.198 8.752 11.227 8.752 11.265 C 8.752 11.318 8.737 11.364 8.708 11.403 C 8.678 11.441 8.638 11.462 8.585 11.467 C 8.536 11.467 8.484 11.45 8.425 11.417 L 6.609 10.462 L 4.801 11.417 C 4.743 11.45 4.688 11.467 4.634 11.467 C 4.582 11.467 4.541 11.446 4.512 11.403 C 4.483 11.36 4.468 11.312 4.468 11.265 C 4.468 11.246 4.471 11.217 4.476 11.178 L 4.823 9.159 L 3.354 7.735 C 3.287 7.662 3.253 7.597 3.253 7.54 C 3.253 7.439 3.327 7.375 3.476 7.351 L 5.504 7.062 L 6.414 5.225 C 6.467 5.114 6.532 5.058 6.609 5.058 C 6.687 5.058 6.755 5.114 6.813 5.225 L 7.717 7.062 L 9.741 7.351 C 9.896 7.375 9.973 7.439 9.973 7.54 Z" style="fill:rgb(0,0,0)"/>',
        "cycle-tents":
          '<rect x="5.65" y="10.722" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.841" y="2.477" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(153, 255, 153);"></rect><rect x="13.006" y="5.617" width="10.107" height="10.438" style="stroke: rgb(0, 0, 0); fill: rgb(153, 255, 153);"></rect><path style="fill: rgb(0,0,0)" d="M 7.042 3.996 C 7.11 4.037 7.154 4.097 7.175 4.175 C 7.196 4.252 7.186 4.326 7.144 4.394 L 6.255 5.609 L 9.287 10.45 L 9.482 10.45 C 9.57 10.45 9.649 10.492 9.717 10.574 C 9.784 10.658 9.815 10.744 9.81 10.832 L 9.81 11.105 L 2.015 11.105 L 2.015 10.832 C 2.015 10.738 2.048 10.653 2.117 10.574 C 2.184 10.497 2.259 10.455 2.342 10.45 L 2.537 10.45 L 5.577 5.609 L 4.696 4.416 C 4.655 4.349 4.644 4.276 4.665 4.199 C 4.686 4.12 4.73 4.059 4.797 4.012 C 4.865 3.965 4.938 3.954 5.016 3.98 C 5.094 4.006 5.153 4.05 5.195 4.113 L 5.92 5.072 L 6.644 4.097 C 6.686 4.03 6.747 3.986 6.825 3.965 C 6.902 3.944 6.975 3.954 7.042 3.996 Z M 5.913 10.45 L 8.36 10.45 L 7.183 9.724 L 5.913 6.257 L 5.913 10.45 Z" style=""></path>',
        "cycle-thermometers":
          '<rect x="5.38" y="10.813" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><rect x="0.571" y="2.568" width="10.485" height="10.309" style="stroke: rgb(0, 0, 0); fill: rgb(153, 0, 0);"></rect><rect x="12.736" y="5.708" width="10.107" height="10.438" style="fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></rect><line style="stroke-linecap: round; stroke: rgb(0, 0, 0);" x1="16.059" y1="13.041" x2="19.628" y2="8.869"></line><line style="stroke-linecap: round; stroke: rgb(0, 0, 0);" x1="16.048" y1="8.859" x2="19.638" y2="13.051"></line>',
        "dark-mode":
          '<path d="M12 21q-3.75 0-6.375-2.625t-2.625-6.375 2.625-6.375 6.375-2.625q0.35 0 0.687 0.025t0.663 0.075q-1.025 0.725-1.638 1.887t-0.612 2.512q0 2.25 1.575 3.825t3.825 1.575q1.375 0 2.525-0.612t1.875-1.638q0.050 0.325 0.075 0.663t0.025 0.687q0 3.75-2.625 6.375t-6.375 2.625zM12 19q2.2 0 3.95-1.212t2.55-3.162q-0.5 0.125-1 0.2t-1 0.075q-3.075 0-5.238-2.163t-2.163-5.238q0-0.5 0.075-1t0.2-1q-1.95 0.8-3.162 2.55t-1.212 3.95q0 2.9 2.050 4.95t4.95 2.050z"></path>',
        dice: '<path d="M7.5 18q0.625 0 1.062-0.438t0.438-1.062-0.438-1.062-1.062-0.438-1.062 0.438-0.438 1.062 0.438 1.062 1.062 0.438zM7.5 9q0.625 0 1.062-0.438t0.438-1.062-0.438-1.062-1.062-0.438-1.062 0.438-0.438 1.062 0.438 1.062 1.062 0.438zM12 13.5q0.625 0 1.062-0.438t0.438-1.062-0.438-1.062-1.062-0.438-1.062 0.438-0.438 1.062 0.438 1.062 1.062 0.438zM16.5 18q0.625 0 1.062-0.438t0.438-1.062-0.438-1.062-1.062-0.438-1.062 0.438-0.438 1.062 0.438 1.062 1.062 0.438zM16.5 9q0.625 0 1.062-0.438t0.438-1.062-0.438-1.062-1.062-0.438-1.062 0.438-0.438 1.062 0.438 1.062 1.062 0.438zM5 21q-0.825 0-1.413-0.588t-0.588-1.413v-14q0-0.825 0.588-1.413t1.413-0.588h14q0.825 0 1.413 0.588t0.588 1.413v14q0 0.825-0.588 1.413t-1.413 0.588h-14zM5 19h14v-14h-14v14zM5 5v0z"></path>',
        domino:
          '<rect x="7.5" y="2" width="9" height="20" style="stroke: rgb(0, 0, 0); stroke-linejoin: round; stroke-width: 2px;"></rect><line style="fill: rgb(255, 255, 255); stroke: rgb(255, 255, 255); stroke-width: 1px; stroke-linecap: round;" x1="7.919" y1="12" x2="16.081" y2="12"></line><circle style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);" cx="12" cy="6.5" r="1"></circle><circle style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);" cx="14.5" cy="15" r="1"></circle><circle style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);" cx="12" cy="17.5" r="1"></circle><circle style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(255, 255, 255);" cx="9.5" cy="20" r="1"></circle>',
        "domino-border":
          '<line style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke: rgb(204, 0, 0); stroke-width: 2px;" x1="12" y1="2.5" x2="12" y2="21.5"></line>',
        done: '<path d="M9 16.219l10.594-10.641 1.406 1.406-12 12-5.578-5.578 1.359-1.406z"></path>',
        download:
          '<path id="path1" d="M 11.411 8.414 C 11.411 13.294 11.408 13.508 11.35 13.647 C 11.246 13.897 11.097 13.836 10.874 13.61 C 10.815 13.553 9.036 11.806 8.918 11.725 C 8.82 11.656 8.77 11.684 8.742 11.703 C 8.697 11.736 8.248 12.091 8.203 12.158 C 8.15 12.237 8.164 12.298 8.207 12.342 C 8.726 12.879 11.667 15.892 11.753 15.973 C 11.81 16.027 11.921 16.06 11.999 16.056 C 12.085 16.051 12.182 16.033 12.245 15.973 C 12.359 15.859 15.699 12.451 15.789 12.349 C 15.829 12.305 15.848 12.215 15.808 12.172 C 15.699 12.057 15.326 11.754 15.25 11.703 C 15.205 11.674 15.14 11.663 15.068 11.722 C 14.984 11.796 13.18 13.552 13.118 13.618 C 12.934 13.822 12.808 13.893 12.681 13.702 C 12.597 13.574 12.599 13.789 12.594 8.53 L 12.588 3.586 L 12 3.586 L 11.411 3.586 L 11.411 8.414 M 3.586 20.042 C 3.586 20.187 3.586 20.414 3.945 20.414 C 4.377 20.414 19.32 20.414 19.32 20.414 C 19.32 20.414 19.773 20.414 20.039 20.414 C 20.164 20.414 20.414 20.287 20.414 20.012 C 20.414 19.77 20.414 16.328 20.414 16.328 L 19.154 16.328 C 19.154 16.328 19.171 18.52 19.154 18.893 C 19.148 19.009 19.062 19.106 18.924 19.11 C 18.592 19.12 5.076 19.11 5.076 19.11 C 5.076 19.11 4.841 19.098 4.841 18.848 C 4.842 18.458 4.841 16.328 4.841 16.328 L 3.586 16.328"></path>',
        eye: '<path d="M12 16.822c-3.716 0-6.848-1.899-8.823-4.822 1.976-2.924 5.107-4.822 8.823-4.822s6.848 1.899 8.823 4.822c-1.976 2.924-5.107 4.822-8.823 4.822zM12 5.8c-4.398 0-8.052 2.35-10.229 5.835-0.066 0.104-0.105 0.23-0.105 0.365s0.039 0.261 0.106 0.368l-0.002-0.003c2.177 3.484 5.831 5.835 10.229 5.835s8.052-2.35 10.229-5.835c0.066-0.104 0.105-0.23 0.105-0.365s-0.039-0.261-0.106-0.368l0.002 0.003c-2.177-3.484-5.831-5.835-10.229-5.835zM12 14.756c1.522 0 2.756-1.234 2.756-2.756s-1.234-2.756-2.756-2.756v0c-1.522 0-2.756 1.234-2.756 2.756s1.234 2.756 2.756 2.756v0z"></path>',
        "eye-closed":
          '<path d="M21.536 10.131c0.186 0.118 0.308 0.323 0.308 0.557 0 0.129-0.037 0.249-0.101 0.351l0.002-0.003c-0.594 0.946-1.268 1.763-2.034 2.485l-0.006 0.006 1.576 1.576c0.114 0.118 0.184 0.279 0.184 0.456 0 0.362-0.294 0.656-0.656 0.656-0.177 0-0.338-0.070-0.456-0.184l0 0-1.658-1.658c-0.998 0.756-2.162 1.358-3.422 1.742l-0.079 0.021 0.589 2.201c0.012 0.048 0.019 0.102 0.019 0.159 0 0.362-0.294 0.656-0.656 0.656-0.298 0-0.55-0.199-0.63-0.472l-0.001-0.005-0.601-2.243c-0.576 0.103-1.238 0.162-1.915 0.162s-1.339-0.059-1.983-0.172l0.068 0.010-0.601 2.244c-0.078 0.282-0.332 0.486-0.634 0.486-0.363 0-0.657-0.294-0.657-0.657 0-0.061 0.008-0.119 0.024-0.175l-0.001 0.005 0.591-2.2c-1.339-0.405-2.504-1.007-3.53-1.783l0.028 0.020-1.658 1.658c-0.118 0.114-0.279 0.184-0.456 0.184-0.362 0-0.656-0.294-0.656-0.656 0-0.177 0.070-0.338 0.184-0.456l-0 0 1.575-1.576c-0.77-0.728-1.444-1.545-2.007-2.439l-0.030-0.052c-0.063-0.099-0.1-0.219-0.1-0.348 0-0.362 0.294-0.656 0.656-0.656 0.234 0 0.439 0.122 0.555 0.306l0.002 0.003c0.646 1.031 1.417 1.912 2.306 2.655l0.017 0.014c1.686 1.413 3.878 2.271 6.271 2.271 0.013 0 0.025-0 0.038-0h-0.002c3.686 0 6.767-1.96 8.631-4.94 0.118-0.186 0.323-0.308 0.557-0.308 0.129 0 0.249 0.037 0.351 0.101l-0.003-0.002z"></path>',
        error:
          '<path d="M1 21l11-19 11 19h-22zM4.45 19h15.1l-7.55-13-7.55 13zM12 18q0.425 0 0.712-0.288t0.288-0.712-0.288-0.712-0.712-0.288-0.712 0.288-0.288 0.712 0.288 0.712 0.712 0.288zM11 15h2v-5h-2v5z"></path>',
        home: '<path d="M6 19h3v-6h6v6h3v-9l-6-4.5-6 4.5v9zM4 21v-12l8-6 8 6v12h-7v-6h-2v6h-7z"></path>',
        "edit-square":
          '<path d="M5 21q-0.825 0-1.413-0.588t-0.588-1.413v-14q0-0.825 0.588-1.413t1.413-0.588h8.925l-2 2h-6.925v14h14v-6.95l2-2v8.95q0 0.825-0.588 1.413t-1.413 0.588h-14zM9 15v-4.25l9.175-9.175q0.3-0.3 0.675-0.45t0.75-0.15q0.4 0 0.762 0.15t0.663 0.45l1.4 1.425q0.275 0.3 0.425 0.663t0.15 0.738-0.138 0.738-0.438 0.663l-9.175 9.2h-4.25zM21.025 4.4v0zM11 13h1.4l5.8-5.8-0.7-0.7-0.725-0.7-5.775 5.775v1.425zM17.5 6.5v0 0z"></path>',
        fullscreen:
          '<path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>',
        "fullscreen-exit":
          '<path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>',
        "outlined-flag":
          '<path d="M18 14.016v-6h-5.016l-0.984-2.016h-5.016v6h6l1.031 2.016h3.984zM14.016 6h6v9.984h-7.031l-0.984-1.969h-5.016v6.984h-1.969v-17.016h7.969z"></path>',
        "help-outline":
          '<path d="M12 6q1.641 0 2.813 1.172t1.172 2.813q0 1.266-1.5 2.602t-1.5 2.414h-1.969q0-1.078 0.469-1.852t1.031-1.125 1.031-0.867 0.469-1.172q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383h-1.969q0-1.641 1.172-2.813t2.813-1.172zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 18v-2.016h1.969v2.016h-1.969z"></path>',
        "info-outline":
          '<path d="M11.016 9v-2.016h1.969v2.016h-1.969zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 17.016v-6h1.969v6h-1.969z"></path>',
        "palette-fill":
          '<path d="M17.484 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM14.484 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM9.516 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM6.516 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM12 3q3.703 0 6.352 2.344t2.648 5.672q0 2.063-1.477 3.516t-3.539 1.453h-1.734q-0.656 0-1.078 0.445t-0.422 1.055q0 0.516 0.375 0.984t0.375 1.031q0 0.656-0.422 1.078t-1.078 0.422q-3.75 0-6.375-2.625t-2.625-6.375 2.625-6.375 6.375-2.625z"></path>',
        puzzle:
          '<path d="M20.484 11.016q1.031 0 1.781 0.727t0.75 1.758-0.75 1.758-1.781 0.727h-1.5v4.031q0 0.797-0.586 1.383t-1.383 0.586h-3.797v-1.5q0-1.125-0.797-1.898t-1.922-0.773-1.922 0.773-0.797 1.898v1.5h-3.797q-0.797 0-1.383-0.586t-0.586-1.383v-3.797h1.5q1.125 0 1.898-0.797t0.773-1.922-0.773-1.922-1.898-0.797h-1.5v-3.797q0-0.797 0.586-1.383t1.383-0.586h4.031v-1.5q0-1.031 0.727-1.781t1.758-0.75 1.758 0.75 0.727 1.781v1.5h4.031q0.797 0 1.383 0.586t0.586 1.383v4.031h1.5z"></path>',
        remove:
          '<path d="M 18 13 L 6 13 C 5.717 13 5.479 12.904 5.287 12.712 C 5.096 12.521 5 12.284 5 12 C 5 11.717 5.096 11.479 5.287 11.287 C 5.479 11.096 5.717 11 6 11 L 18 11 C 18.283 11 18.521 11.096 18.712 11.287 C 18.904 11.479 19 11.717 19 12 C 19 12.284 18.904 12.521 18.712 12.712 C 18.521 12.904 18.283 13 18 13 Z" style="stroke-width: 1;"></path>',
        favorite:
          '<path d="M12 21.328l-1.453-1.313q-2.484-2.25-3.609-3.328t-2.508-2.672-1.898-2.883-0.516-2.648q0-2.297 1.57-3.891t3.914-1.594q2.719 0 4.5 2.109 1.781-2.109 4.5-2.109 2.344 0 3.914 1.594t1.57 3.891q0 1.828-1.219 3.797t-2.648 3.422-4.664 4.359z"></path>',
        "ink-eraser":
          '<path d="M17.25 18h4.75v2h-6.75l2-2zM4.75 20l-2.125-2.125q-0.575-0.575-0.588-1.425t0.563-1.45l11-11.4q0.575-0.6 1.413-0.6t1.413 0.575l4.975 4.975q0.575 0.575 0.575 1.425t-0.575 1.425l-8.4 8.6h-8.25zM12.15 18l7.85-8.050-4.95-4.95-11.050 11.4 1.6 1.6h6.55z"></path>',
        launch:
          '<path d="M14.016 3h6.984v6.984h-2.016v-3.563l-9.797 9.797-1.406-1.406 9.797-9.797h-3.563v-2.016zM18.984 18.984v-6.984h2.016v6.984q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h6.984v2.016h-6.984v13.969h13.969z"></path>',
        "light-bulb":
          '<path style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);" d="M 9.606 16.326 L 14.597 16.423 L 15.76 12.886 L 17.94 10.124 L 18.618 6.539 L 16.729 3.583 L 13.822 1.984 L 10.188 1.887 L 7.378 3.486 L 5.73 5.909 L 5.924 9.349 L 7.911 12.304 L 9.704 16.326"></path><path d="M 15.398 7.356 C 15.398 7.496 15.343 7.611 15.239 7.699 C 15.132 7.786 15.028 7.83 14.921 7.83 C 14.817 7.83 14.703 7.786 14.58 7.699 C 14.457 7.611 14.413 7.496 14.448 7.356 C 14.448 6.917 14.183 6.574 13.658 6.329 C 13.13 6.082 12.611 5.959 12.102 5.959 C 11.979 5.959 11.864 5.916 11.76 5.828 C 11.653 5.74 11.61 5.626 11.628 5.486 C 11.645 5.343 11.689 5.232 11.76 5.141 C 11.828 5.054 11.943 5.01 12.102 5.01 C 12.594 5.01 13.078 5.089 13.551 5.248 C 14.024 5.407 14.457 5.669 14.842 6.038 C 15.23 6.408 15.413 6.848 15.398 7.356 Z M 17.741 7.356 C 17.741 6.654 17.575 6.003 17.241 5.407 C 16.908 4.808 16.47 4.307 15.922 3.905 C 15.378 3.5 14.774 3.191 14.104 2.981 C 13.436 2.77 12.769 2.666 12.102 2.666 C 11.434 2.666 10.767 2.77 10.1 2.981 C 9.432 3.191 8.825 3.5 8.281 3.905 C 7.736 4.307 7.297 4.808 6.963 5.407 C 6.629 6.003 6.451 6.654 6.435 7.356 C 6.435 8.358 6.768 9.246 7.436 10.018 C 7.542 10.125 7.69 10.283 7.885 10.494 C 8.079 10.705 8.226 10.871 8.333 10.994 C 9.597 12.488 10.291 13.945 10.414 15.37 L 13.762 15.37 C 13.905 13.945 14.596 12.488 15.843 10.994 C 15.95 10.888 16.101 10.721 16.292 10.494 C 16.486 10.264 16.633 10.106 16.74 10.018 C 17.408 9.246 17.741 8.358 17.741 7.356 Z M 19.614 7.356 C 19.614 8.886 19.112 10.204 18.111 11.312 C 17.673 11.785 17.304 12.206 17.003 12.575 C 16.705 12.944 16.414 13.418 16.133 13.998 C 15.854 14.577 15.688 15.105 15.632 15.581 C 16.09 15.843 16.319 16.248 16.319 16.793 C 16.319 17.142 16.205 17.451 15.977 17.715 C 16.205 17.98 16.319 18.294 16.319 18.663 C 16.319 19.172 16.101 19.569 15.66 19.85 C 15.8 20.077 15.871 20.307 15.871 20.535 C 15.871 20.991 15.712 21.343 15.398 21.59 C 15.08 21.837 14.703 21.959 14.262 21.959 C 14.071 22.397 13.77 22.741 13.368 22.985 C 12.963 23.231 12.542 23.365 12.102 23.381 C 11.661 23.398 11.232 23.266 10.811 22.985 C 10.39 22.706 10.1 22.361 9.941 21.959 C 9.485 21.959 9.096 21.837 8.782 21.59 C 8.464 21.343 8.316 20.991 8.333 20.535 C 8.333 20.307 8.393 20.077 8.516 19.85 C 8.079 19.569 7.86 19.172 7.86 18.663 C 7.86 18.294 7.98 17.98 8.226 17.715 C 7.98 17.451 7.86 17.142 7.86 16.793 C 7.86 16.248 8.087 15.843 8.543 15.581 C 8.508 15.089 8.341 14.561 8.043 13.998 C 7.745 13.437 7.455 12.961 7.173 12.575 C 6.892 12.19 6.53 11.765 6.093 11.312 C 5.073 10.204 4.564 8.886 4.564 7.356 C 4.564 6.391 4.783 5.486 5.223 4.64 C 5.663 3.799 6.232 3.104 6.935 2.559 C 7.638 2.015 8.448 1.586 9.361 1.268 C 10.275 0.951 11.189 0.784 12.102 0.768 C 13.015 0.749 13.928 0.916 14.842 1.268 C 15.756 1.619 16.557 2.05 17.241 2.559 C 17.927 3.068 18.508 3.763 18.981 4.64 C 19.456 5.522 19.667 6.427 19.614 7.356 Z" style=""></path>',
        lightbulb:
          '<path d="M12 22q-0.825 0-1.413-0.588t-0.588-1.413h4q0 0.825-0.588 1.413t-1.413 0.588zM8 19v-2h8v2h-8zM8.25 16q-1.725-1.025-2.738-2.75t-1.012-3.75q0-3.125 2.187-5.313t5.313-2.187 5.313 2.187 2.187 5.313q0 2.025-1.013 3.75t-2.737 2.75h-7.5zM8.85 14h6.3q1.125-0.8 1.737-1.975t0.612-2.525q0-2.3-1.6-3.9t-3.9-1.6-3.9 1.6-1.6 3.9q0 1.35 0.612 2.525t1.737 1.975z"></path>',
        "light-mode":
          '<path d="M12 15q1.25 0 2.125-0.875t0.875-2.125-0.875-2.125-2.125-0.875-2.125 0.875-0.875 2.125 0.875 2.125 2.125 0.875zM12 17q-2.075 0-3.537-1.462t-1.462-3.537 1.462-3.537 3.537-1.462 3.537 1.462 1.462 3.537-1.462 3.537-3.537 1.462zM5 13h-4v-2h4v2zM23 13h-4v-2h4v2zM11 5v-4h2v4h-2zM11 23v-4h2v4h-2zM6.4 7.75l-2.525-2.425 1.425-1.475 2.4 2.5-1.3 1.4zM18.7 20.15l-2.425-2.525 1.325-1.375 2.525 2.425-1.425 1.475zM16.25 6.4l2.425-2.525 1.475 1.425-2.5 2.4-1.4-1.3zM3.85 18.7l2.525-2.425 1.375 1.325-2.425 2.525-1.475-1.425z"></path>',
        lock: '<path d="M15.094 8.016v-2.016q0-1.266-0.914-2.18t-2.18-0.914-2.18 0.914-0.914 2.18v2.016h6.188zM12 17.016q0.797 0 1.406-0.609t0.609-1.406-0.609-1.406-1.406-0.609-1.406 0.609-0.609 1.406 0.609 1.406 1.406 0.609zM18 8.016q0.797 0 1.406 0.586t0.609 1.383v10.031q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383v-10.031q0-0.797 0.609-1.383t1.406-0.586h0.984v-2.016q0-2.063 1.477-3.539t3.539-1.477 3.539 1.477 1.477 3.539v2.016h0.984z"></path>',
        "lock-outline":
          '<path d="M18 20.016v-10.031h-12v10.031h12zM8.906 6v2.016h6.188v-2.016q0-1.266-0.914-2.18t-2.18-0.914-2.18 0.914-0.914 2.18zM18 8.016q0.797 0 1.406 0.586t0.609 1.383v10.031q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383v-10.031q0-0.797 0.609-1.383t1.406-0.586h0.984v-2.016q0-2.063 1.477-3.539t3.539-1.477 3.539 1.477 1.477 3.539v2.016h0.984zM12 17.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z"></path>',
        "mail-outline":
          '<path d="M12 11.016l8.016-5.016h-16.031zM20.016 18v-9.984l-8.016 4.969-8.016-4.969v9.984h16.031zM20.016 3.984q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h16.031z"></path>',
        menu: '<path d="M3 6h18v2.016h-18v-2.016zM3 12.984v-1.969h18v1.969h-18zM3 18v-2.016h18v2.016h-18z"></path>',
        "more-horiz":
          '<path d="M12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM18 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM6 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609z"></path>',
        "more-vert":
          '<path d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z"></path>',
        "nonograms-line":
          '<rect x="2" y="9" width="6" height="6"></rect><rect x="9" y="9" width="6" height="6"></rect><rect x="16" y="9" width="6" height="6"></rect>',
        "nonograms-rect":
          '<rect x="2" y="6" width="6" height="6"></rect><rect x="9" y="6" width="6" height="6"></rect><rect x="16" y="6" width="6" height="6"></rect><rect x="2" y="13" width="6" height="6"></rect><rect x="9" y="13" width="6" height="6"></rect><rect x="16" y="13" width="6" height="6"></rect>',
        "nonograms-free":
          '<rect x="2" y="6" width="6" height="6"></rect><rect x="9" y="6" width="6" height="6"></rect><rect x="9" y="13" width="6" height="6"></rect><rect x="16" y="13" width="6" height="6"></rect>',
        "open-with":
          '<path d="M14.016 15v3h3l-5.016 5.016-5.016-5.016h3v-3h4.031zM23.016 12l-5.016 5.016v-3h-3v-4.031h3v-3zM9 9.984v4.031h-3v3l-5.016-5.016 5.016-5.016v3h3zM9.984 9v-3h-3l5.016-5.016 5.016 5.016h-3v3h-4.031z"></path>',
        "open-with-create":
          '<path d="M15.953 16.724v2.349h2.349l-3.927 3.927-3.927-3.927h2.349v-2.349h3.156zM23 14.375l-3.927 3.927v-2.349h-2.349v-3.156h2.349v-2.349l3.927 3.927zM12.026 12.797v3.156h-2.349v2.349l-3.927-3.927 3.927-3.927v2.349h2.349zM12.797 12.026v-2.349h-2.349l3.927-3.927 3.927 3.927h-2.349v2.349h-3.156z"></path><path d="M13.797 3.911l-1.32 1.32-2.708-2.708 1.32-1.32c0.135-0.135 0.305-0.203 0.508-0.203s0.372 0.068 0.508 0.203l1.693 1.693c0.135 0.135 0.203 0.305 0.203 0.508s-0.068 0.372-0.203 0.508zM1 11.292l7.99-7.99 2.708 2.708-7.99 7.99h-2.708v-2.708z"></path>',
        palette:
          '<path d="M12 22q-2.050 0-3.875-0.788t-3.188-2.15-2.15-3.188-0.788-3.875q0-2.075 0.813-3.9t2.2-3.175 3.237-2.137 3.95-0.788q2 0 3.775 0.687t3.113 1.9 2.125 2.875 0.788 3.588q0 2.875-1.75 4.413t-4.25 1.538h-1.85q-0.225 0-0.312 0.125t-0.087 0.275q0 0.3 0.375 0.862t0.375 1.287q0 1.25-0.687 1.85t-1.812 0.6zM6.5 13q0.65 0 1.075-0.425t0.425-1.075-0.425-1.075-1.075-0.425-1.075 0.425-0.425 1.075 0.425 1.075 1.075 0.425zM9.5 9q0.65 0 1.075-0.425t0.425-1.075-0.425-1.075-1.075-0.425-1.075 0.425-0.425 1.075 0.425 1.075 1.075 0.425zM14.5 9q0.65 0 1.075-0.425t0.425-1.075-0.425-1.075-1.075-0.425-1.075 0.425-0.425 1.075 0.425 1.075 1.075 0.425zM17.5 13q0.65 0 1.075-0.425t0.425-1.075-0.425-1.075-1.075-0.425-1.075 0.425-0.425 1.075 0.425 1.075 1.075 0.425zM12 20q0.225 0 0.363-0.125t0.138-0.325q0-0.35-0.375-0.825t-0.375-1.425q0-1.050 0.725-1.675t1.775-0.625h1.75q1.65 0 2.825-0.963t1.175-2.988q0-3.025-2.313-5.037t-5.487-2.013q-3.4 0-5.8 2.325t-2.4 5.675q0 3.325 2.337 5.663t5.663 2.337z"></path>',
        pin: '<path d="M 21.036 7.541 L 16.478 2.959 C 15.62 2.097 14.126 2.087 13.252 2.953 C 13.028 3.175 12.852 3.448 12.775 3.67 C 12.03 5.221 11.231 6.194 10.205 6.779 L 9.957 6.897 C 8.854 7.45 7.352 8.013 4.578 8.013 C 4.275 8.013 3.984 8.072 3.705 8.187 C 3.154 8.417 2.702 8.865 2.47 9.423 C 2.245 9.974 2.245 10.61 2.47 11.161 C 2.589 11.444 2.756 11.698 2.968 11.904 L 6.655 15.591 L 2.298 21.693 L 8.4 17.336 L 12.077 21.016 C 12.289 21.232 12.541 21.402 12.826 21.519 C 13.108 21.636 13.399 21.693 13.7 21.693 C 13.999 21.693 14.29 21.634 14.572 21.519 C 15.138 21.285 15.578 20.843 15.802 20.288 C 15.921 20.013 15.978 19.712 15.978 19.415 C 15.978 16.637 16.543 15.137 17.094 14.032 C 17.66 12.901 18.655 12.039 20.234 11.28 C 20.543 11.161 20.814 10.989 21.044 10.759 C 21.924 9.867 21.92 8.421 21.036 7.541 Z M 15.053 13.015 C 14.118 14.888 13.698 16.857 13.69 19.403 L 4.578 10.293 C 7.017 10.293 8.925 9.913 10.73 9.059 L 10.998 8.938 C 12.592 8.142 13.811 6.781 14.859 4.568 L 19.333 9.186 C 17.209 10.204 15.85 11.421 15.053 13.015 Z" style=""></path>',
        plus: '<path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>',
        redo: '<path d="M9.9 19q-2.425 0-4.162-1.575t-1.737-3.925 1.737-3.925 4.162-1.575h6.3l-2.6-2.6 1.4-1.4 5 5-5 5-1.4-1.4 2.6-2.6h-6.3q-1.575 0-2.737 1t-1.163 2.5 1.163 2.5 2.737 1h7.1v2h-7.1z"></path>',
        save: '<path d="M19 22c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-11c0-0.256-0.098-0.512-0.293-0.707l-5-5c-0.181-0.181-0.431-0.293-0.707-0.293h-11c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879zM8 20v-6h8v6zM6 4v4c0 0.552 0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-7v-3h7.586l4.414 4.414v10.586c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-1v-7c0-0.552-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v7h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z"></path>',
        search:
          '<path d="M9.516 14.016q1.875 0 3.188-1.313t1.313-3.188-1.313-3.188-3.188-1.313-3.188 1.313-1.313 3.188 1.313 3.188 3.188 1.313zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281q-1.781 1.547-4.219 1.547-2.719 0-4.617-1.875t-1.898-4.594 1.898-4.617 4.617-1.898 4.594 1.898 1.875 4.617q0 0.984-0.469 2.227t-1.078 1.992l0.281 0.281h0.797z"></path>',
        settings:
          '<path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z"></path>',
        share:
          '<path d="M15.984 5.016l-1.406 1.406-1.594-1.594v11.156h-1.969v-11.156l-1.594 1.594-1.406-1.406 3.984-4.031zM20.016 9.984v11.016q0 0.844-0.586 1.43t-1.43 0.586h-12q-0.844 0-1.43-0.586t-0.586-1.43v-11.016q0-0.797 0.586-1.383t1.43-0.586h3v1.969h-3v11.016h12v-11.016h-3v-1.969h3q0.844 0 1.43 0.586t0.586 1.383z"></path>',
        star: '<path d="M12 17.25l-6.188 3.75 1.641-7.031-5.438-4.734 7.172-0.609 2.813-6.609 2.813 6.609 7.172 0.609-5.438 4.734 1.641 7.031z"></path>',
        "star-outline":
          '<path d="M12 15.422l3.75 2.25-0.984-4.266 3.328-2.906-4.406-0.375-1.688-4.031-1.688 4.031-4.406 0.375 3.328 2.906-0.984 4.266zM21.984 9.234l-5.438 4.734 1.641 7.031-6.188-3.75-6.188 3.75 1.641-7.031-5.438-4.734 7.172-0.609 2.813-6.609 2.813 6.609z"></path>',
        tent: '<path d="M 14.95 2.777 C 15.126 2.884 15.241 3.041 15.295 3.244 C 15.35 3.448 15.323 3.638 15.213 3.814 L 12.894 6.988 L 20.809 19.624 L 21.318 19.624 C 21.549 19.624 21.753 19.733 21.928 19.949 C 22.105 20.167 22.187 20.391 22.173 20.621 L 22.173 21.332 L 1.826 21.332 L 1.826 20.621 C 1.826 20.377 1.914 20.153 2.091 19.949 C 2.267 19.746 2.464 19.637 2.68 19.624 L 3.19 19.624 L 11.125 6.988 L 8.826 3.875 C 8.717 3.699 8.689 3.509 8.744 3.306 C 8.798 3.102 8.913 2.939 9.09 2.817 C 9.266 2.695 9.455 2.668 9.659 2.736 C 9.863 2.804 10.02 2.919 10.127 3.082 L 12.02 5.585 L 13.912 3.041 C 14.021 2.865 14.176 2.75 14.38 2.695 C 14.583 2.641 14.773 2.668 14.95 2.777 Z M 11.999 19.624 L 18.389 19.624 L 15.316 17.731 L 11.999 8.677 L 11.999 19.624 Z" style=""></path>',
        trash:
          '<path style="stroke-width: 0px;" d="M 5.007 8.501 L 5.007 7.414 C 5.028 7.019 5.183 6.684 5.471 6.407 C 5.758 6.13 6.104 5.997 6.509 6.007 L 8.012 6.007 L 8.012 5.512 C 8.012 5.097 8.156 4.739 8.443 4.441 C 8.731 4.143 9.083 3.999 9.498 4.009 L 14.5 4.009 C 14.916 4.009 15.268 4.153 15.555 4.441 C 15.843 4.729 15.992 5.086 16.003 5.512 L 16.003 6.007 L 17.489 6.007 C 17.884 6.007 18.23 6.14 18.528 6.407 C 18.827 6.673 18.981 7.009 18.992 7.414 L 18.992 8.501 C 18.992 8.778 18.891 9.012 18.688 9.204 C 18.486 9.396 18.251 9.497 17.985 9.507 L 17.985 17.994 C 17.985 18.559 17.793 19.033 17.409 19.416 C 17.026 19.8 16.557 19.992 16.003 19.992 L 8.012 19.992 C 7.447 19.992 6.973 19.8 6.589 19.416 C 6.206 19.033 6.014 18.559 6.014 17.994 L 6.014 9.507 C 5.737 9.507 5.502 9.406 5.311 9.204 C 5.119 9.001 5.018 8.767 5.007 8.501 Z M 6.014 8.501 L 17.985 8.501 L 17.985 7.51 C 17.985 7.361 17.942 7.238 17.857 7.142 C 17.772 7.046 17.649 7.004 17.489 7.014 L 6.509 7.014 C 6.36 7.014 6.238 7.057 6.142 7.142 C 6.046 7.227 6.003 7.35 6.014 7.51 L 6.014 8.501 Z M 7.005 17.994 C 7.005 18.261 7.106 18.495 7.308 18.698 C 7.511 18.9 7.745 19.001 8.012 19.001 L 16.003 19.001 C 16.27 19.001 16.498 18.9 16.69 18.698 C 16.882 18.495 16.983 18.261 16.994 17.994 L 16.994 9.507 L 7.005 9.507 L 7.005 17.994 Z M 8.012 17.499 L 8.012 10.994 C 8.012 10.856 8.055 10.738 8.139 10.642 C 8.225 10.546 8.347 10.499 8.507 10.499 L 9.498 10.499 C 9.647 10.499 9.77 10.546 9.866 10.642 C 9.962 10.738 10.01 10.856 10.01 10.994 L 10.01 17.499 C 10.01 17.637 9.962 17.754 9.866 17.85 C 9.77 17.946 9.647 17.994 9.498 17.994 L 8.507 17.994 C 8.358 17.994 8.236 17.946 8.139 17.85 C 8.043 17.754 8.001 17.637 8.012 17.499 Z M 8.507 17.499 L 9.498 17.499 L 9.498 10.994 L 8.507 10.994 L 8.507 17.499 Z M 9.003 6.007 L 14.996 6.007 L 14.996 5.512 C 14.996 5.363 14.948 5.24 14.852 5.144 C 14.756 5.049 14.639 5.006 14.5 5.017 L 9.498 5.017 C 9.36 5.017 9.242 5.059 9.146 5.144 C 9.05 5.23 9.003 5.352 9.003 5.512 L 9.003 6.007 Z M 11 17.499 L 11 10.994 C 11 10.856 11.049 10.738 11.144 10.642 C 11.24 10.546 11.357 10.499 11.496 10.499 L 12.503 10.499 C 12.641 10.499 12.759 10.546 12.855 10.642 C 12.95 10.738 12.998 10.856 12.998 10.994 L 12.998 17.499 C 12.998 17.637 12.95 17.754 12.855 17.85 C 12.759 17.946 12.641 17.994 12.503 17.994 L 11.496 17.994 C 11.357 17.994 11.24 17.946 11.144 17.85 C 11.049 17.754 11 17.637 11 17.499 Z M 11.496 17.499 L 12.503 17.499 L 12.503 10.994 L 11.496 10.994 L 11.496 17.499 Z M 14.005 17.499 L 14.005 10.994 C 14.005 10.856 14.048 10.738 14.133 10.642 C 14.218 10.546 14.341 10.499 14.5 10.499 L 15.491 10.499 C 15.641 10.499 15.763 10.546 15.859 10.642 C 15.955 10.738 16.003 10.856 16.003 10.994 L 16.003 17.499 C 16.003 17.637 15.955 17.754 15.859 17.85 C 15.763 17.946 15.641 17.994 15.491 17.994 L 14.5 17.994 C 14.351 17.994 14.229 17.946 14.133 17.85 C 14.037 17.754 13.994 17.637 14.005 17.499 Z M 14.5 17.499 L 15.491 17.499 L 15.491 10.994 L 14.5 10.994 L 14.5 17.499 Z"></path>',
        undo: '<path d="M7 19v-2h7.1q1.575 0 2.738-1t1.162-2.5-1.162-2.5-2.738-1h-6.3l2.6 2.6-1.4 1.4-5-5 5-5 1.4 1.4-2.6 2.6h6.3q2.425 0 4.163 1.575t1.737 3.925-1.737 3.925-4.163 1.575h-7.1z"></path>',
        user: '<path d="M12 12c-1.1 0-2.042-.392-2.825-1.175C8.392 10.042 8 9.1 8 8s.392-2.042 1.175-2.825C9.958 4.392 10.9 4 12 4s2.042.392 2.825 1.175C15.608 5.958 16 6.9 16 8s-.392 2.042-1.175 2.825C14.042 11.608 13.1 12 12 12Zm-8 6v-.8c0-.567.146-1.087.438-1.563A2.911 2.911 0 0 1 5.6 14.55a14.843 14.843 0 0 1 3.15-1.163A13.76 13.76 0 0 1 12 13c1.1 0 2.183.13 3.25.387 1.067.259 2.117.646 3.15 1.163.483.25.87.612 1.163 1.087.291.476.437.996.437 1.563v.8c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 20H6c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 4 18Zm2 0h12v-.8a.973.973 0 0 0-.5-.85c-.9-.45-1.808-.787-2.725-1.012a11.6 11.6 0 0 0-5.55 0c-.917.225-1.825.562-2.725 1.012a.973.973 0 0 0-.5.85v.8Zm6-8c.55 0 1.02-.196 1.412-.588C13.804 9.021 14 8.55 14 8c0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 12 6c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 10 8c0 .55.196 1.02.588 1.412.391.392.862.588 1.412.588Z" />',
        "verified-fill":
          '<path d="M8.291 24l-2.073-3.657-3.927-0.914 0.382-4.229-2.673-3.2 2.673-3.2-0.382-4.229 3.927-0.914 2.073-3.657 3.709 1.657 3.709-1.657 2.073 3.657 3.927 0.914-0.382 4.229 2.673 3.2-2.673 3.2 0.382 4.229-3.927 0.914-2.073 3.657-3.709-1.657-3.709 1.657z"></path>',
        visibility:
          '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
        "visibility-off":
          '<path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.03-.39-1.42 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.65.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z"/>',
        warning:
          '<path d="M12 13a.968.968 0 0 0 .713-.288A.967.967 0 0 0 13 12V7.975a.928.928 0 0 0-.287-.7A.993.993 0 0 0 12 7a.967.967 0 0 0-.712.287A.968.968 0 0 0 11 8v4.025c0 .283.096.517.288.7A.99.99 0 0 0 12 13Zm0 4a.968.968 0 0 0 .713-.288A.967.967 0 0 0 13 16a.97.97 0 0 0-.287-.713A.97.97 0 0 0 12 15a.967.967 0 0 0-.712.287A.968.968 0 0 0 11 16c0 .283.096.52.288.712A.965.965 0 0 0 12 17Zm0 5a9.733 9.733 0 0 1-3.9-.788 10.092 10.092 0 0 1-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.733 9.733 0 0 1 2 12a9.74 9.74 0 0 1 .788-3.9 10.092 10.092 0 0 1 2.137-3.175c.9-.9 1.958-1.613 3.175-2.138A9.743 9.743 0 0 1 12 2a9.74 9.74 0 0 1 3.9.787 10.105 10.105 0 0 1 3.175 2.138c.9.9 1.612 1.958 2.137 3.175A9.733 9.733 0 0 1 22 12a9.733 9.733 0 0 1-.788 3.9 10.092 10.092 0 0 1-2.137 3.175c-.9.9-1.958 1.612-3.175 2.137A9.733 9.733 0 0 1 12 22Zm0-2c2.217 0 4.104-.779 5.663-2.337C19.221 16.104 20 14.217 20 12c0-2.217-.779-4.104-2.337-5.663C16.104 4.779 14.217 4 12 4c-2.217 0-4.104.779-5.662 2.337C4.779 7.896 4 9.783 4 12c0 2.217.78 4.104 2.338 5.663C7.896 19.221 9.783 20 12 20Z"/>',
        wn: '<path stroke-width="0.6" stroke="#000" d="M 11.185 3.773 C 11.185 3.773 11.185 3.773 11.185 3.773 C 11.185 3.608 11.158 3.279 11.13 2.978 C 11.103 2.813 11.048 2.676 11.021 2.539 C 10.253 3.088 9.951 3.992 9.951 3.992 L 9.842 4.294 L 8.033 4.294 L 7.896 4.047 C 7.896 4.047 7.621 3.553 7.265 3.115 C 7.128 2.978 6.827 2.704 6.799 2.676 L 6.882 3.444 L 6.909 3.471 C 6.936 3.608 7.019 3.745 7.156 3.855 L 7.265 3.964 L 7.238 4.157 C 7.101 5.28 6.141 6.294 5.922 6.541 C 5.621 7.034 2.331 12.462 2.358 13.559 C 2.358 14.271 2.441 14.71 2.605 15.039 C 2.742 15.313 2.879 15.423 3.071 15.505 C 3.482 15.697 3.839 15.587 4.195 15.56 C 4.195 15.532 4.195 15.56 4.223 15.477 C 4.25 15.423 4.25 15.368 4.223 15.258 C 4.223 15.121 4.195 14.929 4.277 14.765 C 4.305 14.655 4.442 14.491 4.551 14.408 C 4.661 14.354 4.825 14.326 4.935 14.326 C 5.1 14.326 5.346 14.381 5.456 14.491 C 5.593 14.6 5.675 14.875 5.675 15.012 C 5.675 15.231 5.538 15.477 5.456 15.669 C 5.346 15.861 5.264 16.026 5.264 16.163 C 5.237 16.19 5.237 16.19 5.237 16.19 C 5.346 16.19 5.346 16.19 5.484 16.108 C 5.648 16.026 5.758 15.889 5.922 15.642 C 6.278 15.176 6.772 14.463 7.731 13.805 C 8.471 13.312 9.732 12.407 10.747 11.393 C 11.212 10.954 11.651 10.516 11.953 10.105 C 12.145 9.968 12.556 8.35 12.556 8.35 C 12.638 8.296 12.72 8.268 12.802 8.241 C 13.049 8.214 13.296 8.378 13.323 8.625 C 13.351 9.118 13.186 9.666 12.857 10.242 C 12.885 10.708 12.885 11.174 12.857 11.585 C 12.802 12.435 12.665 13.175 12.446 13.805 C 12.008 15.066 11.295 15.944 10.61 16.656 C 9.211 18.109 7.923 18.822 7.841 21.042 L 20.944 21.042 C 21.053 14.929 20.286 11.01 18.641 8.323 C 17.024 5.692 14.721 4.568 11.596 4.266 C 11.596 4.266 11.596 4.266 11.596 4.266 C 11.432 4.266 11.267 4.129 11.212 3.964 C 11.185 3.91 11.185 3.855 11.185 3.773 Z M 19.436 7.857 C 21.136 10.653 22.013 15.066 21.848 21.508 L 21.848 21.947 L 6.909 21.947 L 6.936 21.481 C 7.046 18.548 8.608 17.396 9.951 16.026 C 10.61 15.34 11.212 14.628 11.569 13.504 C 11.761 12.928 11.898 12.325 11.953 11.53 C 11.953 11.503 11.953 11.503 11.953 11.475 C 11.761 11.695 11.596 11.887 11.404 12.051 C 10.308 13.093 8.992 14.052 8.252 14.546 C 7.402 15.094 7.019 15.724 6.635 16.218 C 6.47 16.464 6.223 16.711 5.977 16.875 C 5.703 17.04 5.292 17.122 4.88 17.067 L 4.716 17.04 L 4.634 16.958 C 4.524 16.821 4.442 16.629 4.387 16.464 L 4.332 16.464 C 4.086 16.464 3.373 16.629 2.715 16.355 C 2.386 16.218 2.002 15.889 1.783 15.423 C 1.591 15.012 1.454 14.381 1.454 13.559 C 1.481 12.243 5.154 6.021 5.154 6.021 L 5.209 5.966 L 5.237 5.938 C 5.237 5.938 6.196 5.034 6.306 4.239 C 5.949 3.499 6.032 2.868 6.004 2.292 L 6.004 2.101 L 6.141 1.991 C 6.306 1.854 6.553 1.744 6.717 1.744 C 6.882 1.744 7.101 1.799 7.238 1.881 C 7.484 2.018 7.759 2.292 7.978 2.539 C 8.362 3.033 8.417 3.17 8.554 3.361 L 9.239 3.361 C 9.486 2.923 9.677 2.32 10.801 1.607 L 10.938 1.525 L 11.048 1.552 C 11.349 1.607 11.678 1.854 11.788 2.073 C 11.898 2.292 11.98 2.594 12.035 2.841 C 12.062 3.06 12.09 3.252 12.09 3.416 C 15.187 3.8 17.764 5.116 19.436 7.857 Z M 4.497 13.257 C 4.497 13.504 4.277 13.833 4.113 13.915 C 3.921 14.025 3.565 14.052 3.345 13.915 C 3.154 13.805 2.962 13.477 2.962 13.257 C 2.962 13.01 3.181 12.709 3.345 12.599 C 3.537 12.517 3.894 12.489 4.113 12.599 C 4.305 12.709 4.497 13.038 4.497 13.257 Z M 7.731 7.555 C 7.539 7.912 7.265 8.214 7.046 8.323 C 6.909 8.405 6.58 8.46 6.415 8.378 C 6.251 8.296 6.086 7.967 6.086 7.775 C 6.086 7.528 6.223 7.117 6.415 6.788 C 6.635 6.432 6.909 6.13 7.128 6.021 C 7.265 5.938 7.567 5.884 7.731 5.966 C 7.923 6.048 8.06 6.377 8.06 6.569 C 8.06 6.815 7.923 7.227 7.731 7.555 Z" style=""></path>',
        zoom: '<path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414zM8 12h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>',
        "external-apple":
          '<path fill="#000" d="M 17.4 12.621 C 17.377 10.115 19.446 8.914 19.537 8.852 C 18.375 7.152 16.565 6.917 15.921 6.892 C 14.38 6.734 12.91 7.801 12.133 7.801 C 11.349 7.801 10.145 6.917 8.867 6.936 C 7.187 6.964 5.635 7.916 4.771 9.419 C 3.028 12.449 4.324 16.933 6.024 19.392 C 6.855 20.592 7.849 21.942 9.15 21.894 C 10.404 21.846 10.875 21.082 12.391 21.082 C 13.905 21.082 14.332 21.894 15.657 21.87 C 17.006 21.846 17.861 20.645 18.688 19.44 C 19.643 18.043 20.036 16.693 20.056 16.621 C 20.027 16.612 17.429 15.613 17.4 12.621 Z M 14.908 5.264 C 15.599 4.429 16.065 3.267 15.941 2.105 C 14.947 2.148 13.741 2.768 13.025 3.603 C 12.387 4.347 11.825 5.529 11.974 6.667 C 13.084 6.753 14.217 6.1 14.908 5.264 Z" style="stroke-width: 1;"></path>',
        "external-facebook":
          '<path d="M22 12.06c0-5.522-4.477-10-10-10s-10 4.478-10 10c0 4.992 3.657 9.13 8.438 9.88v-6.99h-2.54v-2.89h2.54V9.858c0-2.507 1.492-3.891 3.777-3.891 1.093 0 2.238.195 2.238.195v2.461h-1.26c-1.243 0-1.63.771-1.63 1.563v1.875h2.773l-.443 2.89h-2.33v6.988c4.78-.75 8.437-4.887 8.437-9.878Z" />',
        "external-facebook-messenger":
          '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 11.7C2 6.126 6.367 2 12 2s10 4.126 10 9.7c0 5.574-4.367 9.7-10 9.7-1.012 0-1.983-.134-2.895-.384a.798.798 0 0 0-.534.039l-1.985.876a.8.8 0 0 1-1.122-.707l-.055-1.78a.799.799 0 0 0-.268-.57C3.195 17.135 2 14.616 2 11.7Zm6.933-1.824-2.938 4.66c-.282.448.268.952.689.632l3.155-2.394a.6.6 0 0 1 .723-.002l2.337 1.752a1.5 1.5 0 0 0 2.169-.4l2.937-4.66c.282-.448-.268-.952-.69-.632l-3.154 2.394a.6.6 0 0 1-.723.002L11.1 9.476a1.5 1.5 0 0 0-2.168.4Z" />',
        "external-google":
          '<path fill-rule="evenodd" clip-rule="evenodd" d="M16.033 7.457a5.434 5.434 0 0 0-3.836-1.5c-2.609 0-4.824 1.76-5.614 4.13a5.99 5.99 0 0 0 0 3.83h.004c.793 2.366 3.005 4.126 5.614 4.126 1.347 0 2.503-.345 3.399-.953v-.003a4.628 4.628 0 0 0 1.999-3.038h-5.402v-3.85h9.432c.118.668.173 1.351.173 2.03 0 3.042-1.087 5.614-2.978 7.355l.002.002C17.169 21.114 14.894 22 12.197 22c-3.78 0-7.238-2.131-8.936-5.508a10.008 10.008 0 0 1 0-8.98 9.998 9.998 0 0 1 8.936-5.511 9.61 9.61 0 0 1 6.691 2.601l-2.855 2.855Z" />',
        "external-instagram":
          '<path d="M12.006 3.801c2.672 0 2.989.012 4.04.059.977.043 1.504.207 1.855.344a3.1 3.1 0 0 1 1.15.746c.35.351.566.684.745 1.148.137.352.301.883.344 1.856.047 1.055.059 1.372.059 4.04 0 2.672-.012 2.989-.059 4.04-.043.977-.207 1.504-.344 1.856-.18.465-.398.8-.746 1.148a3.076 3.076 0 0 1-1.149.747c-.351.137-.882.3-1.855.343-1.055.047-1.372.06-4.04.06-2.673 0-2.989-.013-4.04-.06-.977-.042-1.504-.206-1.856-.343-.465-.18-.8-.399-1.148-.747a3.076 3.076 0 0 1-.747-1.148c-.136-.352-.3-.883-.344-1.856-.046-1.055-.058-1.371-.058-4.04 0-2.672.012-2.989.058-4.04.043-.976.208-1.504.344-1.856.18-.464.399-.8.747-1.148a3.076 3.076 0 0 1 1.148-.746c.352-.137.883-.301 1.856-.344 1.051-.047 1.367-.059 4.04-.059Zm0-1.801c-2.716 0-3.055.012-4.122.059-1.063.046-1.793.218-2.426.465A4.882 4.882 0 0 0 3.684 3.68a4.9 4.9 0 0 0-1.157 1.77c-.246.637-.418 1.363-.464 2.426-.047 1.07-.06 1.41-.06 4.126 0 2.715.013 3.055.06 4.122.046 1.063.218 1.793.464 2.426.258.66.598 1.22 1.157 1.774a4.89 4.89 0 0 0 1.77 1.152c.637.247 1.363.419 2.426.465 1.067.047 1.407.059 4.122.059s3.055-.012 4.122-.059c1.063-.046 1.793-.218 2.426-.464a4.89 4.89 0 0 0 1.77-1.153 4.89 4.89 0 0 0 1.153-1.77c.246-.637.418-1.363.465-2.426.046-1.067.058-1.407.058-4.122 0-2.716-.012-3.055-.058-4.122-.047-1.063-.22-1.793-.465-2.426a4.686 4.686 0 0 0-1.145-1.778 4.889 4.889 0 0 0-1.77-1.153c-.637-.246-1.364-.418-2.426-.464-1.07-.051-1.41-.063-4.126-.063Z" /><path d="M12.006 6.864a5.139 5.139 0 0 0-5.138 5.138 5.139 5.139 0 0 0 5.138 5.138 5.139 5.139 0 0 0 0-10.275Zm0 8.47a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.667Zm6.54-8.673a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />',
        "external-discord":
          '<path d="M19.066 2.063c1.208 0 2.183 0.977 2.24 2.127v18.498l-2.3-1.953-1.263-1.15-1.379-1.201 0.576 1.895h-12.064c-1.205 0-2.183-0.915-2.183-2.128v-13.956c0-1.15 0.98-2.129 2.187-2.129h14.18zM13.809 6.946h-0.026l-0.174 0.172c1.781 0.516 2.643 1.321 2.643 1.321-1.148-0.574-2.183-0.861-3.217-0.977-0.748-0.116-1.495-0.055-2.127 0h-0.172c-0.404 0-1.263 0.172-2.415 0.632-0.401 0.175-0.632 0.289-0.632 0.289s0.861-0.861 2.759-1.321l-0.116-0.116c0 0-1.437-0.055-2.988 1.091 0 0-1.551 2.702-1.551 6.033 0 0 0.859 1.495 3.217 1.552 0 0 0.344-0.458 0.692-0.861-1.323-0.402-1.839-1.207-1.839-1.207s0.115 0.057 0.288 0.172h0.052c0.026 0 0.038 0.013 0.052 0.026v0.005c0.014 0.014 0.026 0.026 0.052 0.026 0.284 0.117 0.567 0.232 0.799 0.344 0.4 0.174 0.915 0.346 1.547 0.461 0.799 0.116 1.715 0.172 2.759 0 0.516-0.116 1.031-0.229 1.547-0.46 0.335-0.172 0.748-0.344 1.201-0.633 0 0-0.516 0.804-1.895 1.207 0.284 0.4 0.683 0.859 0.683 0.859 2.358-0.052 3.274-1.547 3.326-1.483 0-3.326-1.56-6.033-1.56-6.033-1.405-1.043-2.72-1.083-2.952-1.083zM13.953 10.739c0.604 0 1.091 0.516 1.091 1.147 0 0.636-0.49 1.152-1.091 1.152s-1.091-0.516-1.091-1.146c0.002-0.636 0.492-1.15 1.091-1.152zM10.049 10.739c0.601 0 1.088 0.516 1.088 1.147 0 0.636-0.49 1.152-1.091 1.152s-1.091-0.516-1.091-1.146c0-0.636 0.49-1.15 1.095-1.152z"></path>',
        "external-linkedin":
          '<path d="M20.52 2H3.477C2.66 2 2 2.645 2 3.441v17.114C2 21.352 2.66 22 3.477 22H20.52c.816 0 1.48-.648 1.48-1.441V3.44C22 2.645 21.336 2 20.52 2ZM7.934 19.043h-2.97V9.496h2.97v9.547ZM6.449 8.195a1.72 1.72 0 1 1-.006-3.439 1.72 1.72 0 0 1 .006 3.44Zm12.594 10.848h-2.965v-4.64c0-1.106-.02-2.532-1.543-2.532-1.543 0-1.777 1.207-1.777 2.453v4.719H9.797V9.496h2.844v1.305h.039c.394-.75 1.363-1.543 2.804-1.543 3.004 0 3.559 1.976 3.559 4.547v5.238Z" />',
        "external-reddit":
          '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-4.795-1.462c.807 0 1.462.655 1.462 1.462 0 .597-.363 1.111-.842 1.345.023.14.035.28.035.433 0 2.245-2.608 4.058-5.837 4.058-3.228 0-5.836-1.813-5.836-4.058 0-.152.012-.304.035-.445a1.463 1.463 0 0 1 .596-2.795c.387 0 .75.164 1.007.41 1.005-.738 2.397-1.194 3.953-1.24l.737-3.486a.285.285 0 0 1 .117-.164.291.291 0 0 1 .198-.035l2.421.515c.164-.35.515-.585.924-.585.573 0 1.041.468 1.041 1.041s-.468 1.041-1.04 1.041a1.042 1.042 0 0 1-1.041-.994l-2.164-.456-.667 3.123c1.52.058 2.9.526 3.895 1.24a1.4 1.4 0 0 1 1.006-.41ZM9.708 12c-.573 0-1.041.468-1.041 1.04 0 .574.468 1.042 1.04 1.042.574 0 1.041-.468 1.041-1.041S10.281 12 9.709 12Zm2.304 4.55c.397 0 1.754-.047 2.467-.76a.3.3 0 0 0 .024-.386.275.275 0 0 0-.386 0c-.456.444-1.404.608-2.094.608s-1.649-.164-2.093-.609a.275.275 0 0 0-.386 0 .275.275 0 0 0 0 .386c.702.702 2.07.76 2.468.76Zm1.24-3.51c0 .574.467 1.042 1.04 1.042.574 0 1.041-.468 1.041-1.041S14.866 12 14.293 12c-.574 0-1.041.468-1.041 1.04Z" />',
        "external-tumblr":
          '<path d="M14.333 22c-3 0-5.25-1.542-5.25-5.25v-5.917h-2.75V7.625c3-.792 4.25-3.375 4.417-5.625h3.125v5.083H17.5v3.75h-3.625V16c0 1.542.792 2.083 2.042 2.083h1.75V22h-3.334Z" />',
        "external-twitter":
          '<path d="M13.647 10.469 20.932 2h-1.726L12.88 9.353 7.827 2H2l7.64 11.12L2 22h1.726l6.68-7.765L15.743 22h5.828l-7.924-11.531Zm-2.365 2.748-.774-1.107-6.16-8.81H7l4.971 7.11.774 1.107 6.462 9.242h-2.652l-5.273-7.541Z" />',
        "external-whatsapp":
          '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.053 4.906A9.846 9.846 0 0 0 12.042 2c-5.465 0-9.908 4.446-9.91 9.91a9.892 9.892 0 0 0 1.322 4.954L2.048 22l5.254-1.378a9.903 9.903 0 0 0 4.735 1.206h.004c5.463 0 9.909-4.446 9.91-9.91a9.851 9.851 0 0 0-2.898-7.012Zm-7.011 15.248h-.005a8.225 8.225 0 0 1-4.192-1.148l-.301-.178-3.118.817.832-3.041-.196-.312a8.22 8.22 0 0 1-1.258-4.38c0-4.542 3.697-8.237 8.241-8.237a8.239 8.239 0 0 1 8.234 8.242c-.002 4.542-3.697 8.237-8.237 8.237Zm4.518-6.169c-.247-.124-1.465-.723-1.692-.808-.227-.084-.392-.123-.557.124-.165.248-.64.808-.784.971-.144.163-.289.187-.536.063-.248-.125-1.046-.386-1.992-1.23-.736-.656-1.233-1.467-1.378-1.715-.145-.248-.015-.38.109-.506.11-.11.247-.289.37-.433.124-.145.166-.248.248-.413.083-.165.042-.31-.02-.434s-.557-1.343-.764-1.84c-.2-.482-.405-.416-.557-.424a9.946 9.946 0 0 0-.475-.01.91.91 0 0 0-.66.311c-.227.248-.867.847-.867 2.066 0 1.219.888 2.396 1.011 2.562.124.165 1.746 2.666 4.23 3.739.46.199.932.373 1.411.522.594.19 1.134.162 1.56.098.475-.07 1.465-.599 1.672-1.177.206-.578.206-1.074.142-1.178-.063-.103-.223-.164-.47-.288Z" />',
        "external-tiktok":
          '<path d="M16.822 5.134A4.75 4.75 0 0 1 15.648 2h-.919a4.763 4.763 0 0 0 2.093 3.134Zm-8.5 6.771a2.89 2.89 0 0 0-2.886 2.888c0 1.11.63 2.076 1.55 2.559a2.859 2.859 0 0 1-.548-1.686 2.89 2.89 0 0 1 2.886-2.888c.297 0 .585.05.854.134v-3.51a6.419 6.419 0 0 0-.854-.06c-.051 0-.097.004-.149.004v2.693a2.905 2.905 0 0 0-.853-.134Z" /><path d="M19.424 6.676v2.67a8.172 8.172 0 0 1-4.778-1.537v6.989c0 3.487-2.835 6.329-6.324 6.329a6.296 6.296 0 0 1-3.624-1.147A6.312 6.312 0 0 0 9.324 22c3.484 0 6.324-2.837 6.324-6.33V8.683a8.172 8.172 0 0 0 4.779 1.537V6.783a4.7 4.7 0 0 1-1.003-.107Z"  /><path d="M14.646 14.798V7.809a8.172 8.172 0 0 0 4.778 1.537v-2.67a4.773 4.773 0 0 1-2.602-1.542A4.802 4.802 0 0 1 14.725 2H12.21l-.005 13.777a2.89 2.89 0 0 1-2.881 2.782 2.898 2.898 0 0 1-2.343-1.203 2.899 2.899 0 0 1-1.55-2.558 2.89 2.89 0 0 1 2.886-2.889c.297 0 .585.051.854.135V9.351C5.756 9.425 3 12.23 3 15.67a6.31 6.31 0 0 0 1.698 4.309 6.296 6.296 0 0 0 3.624 1.147c3.484 0 6.324-2.842 6.324-6.33Z" />',
        "external-threads":
          '<path d="M11.928 22h-.006c-2.984-.02-5.278-1.004-6.82-2.924-1.37-1.71-2.078-4.088-2.102-7.068v-.014c.024-2.982.732-5.358 2.104-7.068C6.644 3.004 8.94 2.02 11.922 2h.012c2.288.016 4.202.604 5.688 1.748 1.398 1.076 2.382 2.608 2.924 4.556l-1.7.474c-.92-3.3-3.248-4.986-6.92-5.012-2.424.018-4.258.78-5.45 2.264C5.362 7.42 4.786 9.428 4.764 12c.022 2.572.598 4.58 1.714 5.97 1.192 1.486 3.026 2.248 5.45 2.264 2.186-.016 3.632-.526 4.834-1.704 1.372-1.344 1.348-2.994.908-3.998-.258-.592-.728-1.084-1.362-1.458-.16 1.126-.518 2.038-1.07 2.726-.738.918-1.784 1.42-3.108 1.492-1.002.054-1.968-.182-2.716-.668-.886-.574-1.404-1.45-1.46-2.47-.054-.992.34-1.904 1.108-2.568.734-.634 1.766-1.006 2.986-1.076.898-.05 1.74-.01 2.516.118-.104-.618-.312-1.11-.624-1.464-.428-.488-1.09-.736-1.966-.742h-.024c-.704 0-1.66.194-2.268 1.1L8.218 8.54c.816-1.212 2.14-1.88 3.732-1.88h.036c2.662.016 4.248 1.646 4.406 4.49.09.038.18.078.268.118 1.242.584 2.15 1.468 2.628 2.558.664 1.518.726 3.992-1.29 5.966-1.542 1.508-3.412 2.19-6.064 2.208h-.006Zm.836-9.742c-.202 0-.406.006-.616.018-1.53.086-2.484.788-2.43 1.786.056 1.046 1.21 1.532 2.32 1.472 1.02-.054 2.348-.452 2.572-3.092a8.75 8.75 0 0 0-1.846-.184Z"/>',
      },
      qe = i`
  :host {
    display: inline-flex;
    vertical-align: top;
    min-inline-size: min-content;
  }

  :host > * {
    color: inherit;
  }

  /**
   * Block
   */

  .icon {
    display: block;
    block-size: 24px;
    block-size: 1lh;
    line-height: inherit;
    color: inherit;
    shape-rendering: geometricprecision;
    aspect-ratio: 1 / 1;
    /**
     * No need for pointer events, and stops SVG from interfering with events
     */
    pointer-events: none;
  }

  .icon path:not([fill]) {
    fill: currentColor;
  }

  /**
   * Modifier: size-x-small
   */

  .icon--size-x-small {
    block-size: calc(var(--puzzle--dimension--space) * 4);
  }

  /**
   * Modifier: size-small
   */

  .icon--size-small {
    block-size: calc(var(--puzzle--dimension--space) * 5);
  }

  /**
   * Modifier: size-medium
   */

  .icon--size-medium {
    block-size: calc(var(--puzzle--dimension--space) * 6);
  }

  /**
   * Modifier: size-large
   */

  .icon--size-large {
    block-size: calc(var(--puzzle--dimension--space) * 7);
  }

  /**
   * Modifier: size-x-large
   */

  .icon--size-x-large {
    block-size: calc(var(--puzzle--dimension--space) * 8);
  }

  /**
   * Modifier: size-fill
   */
  .icon--size-fill {
    block-size: 1em;
  }
`,
      De = k("icon");
    class E extends a {
      constructor() {
        (super(...arguments), (this.size = "medium"));
      }
      render() {
        var { name: e, size: t } = this;
        return g`
      <svg
        role="presentation"
        class=${De({
          ["size-" + t]: !0,
        })}
        viewBox="0 0 24 24"
      >
        ${ue`${Ee(Ae[e])}`}
      </svg>
    `;
      }
    }
    ((E.styles = [_, $, qe]),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        E.prototype,
        "name",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        E.prototype,
        "size",
        void 0,
      ),
      customElements.define("puzzle-icon", E));
    let Ne = i`
  :host {
    display: inline-flex;
    vertical-align: top;
    max-inline-size: 100%;
    min-inline-size: 0;
    -webkit-tap-highlight-color: transparent;
  }

  /**
   * CSS custom properties
   * 
   * NB: Defaults to medium switch size
   */

  .switch {
    --switch-animation-duration: 120ms;
    --switch-inline-size: calc(var(--puzzle--dimension--space) * 13);
    --switch-block-size: calc(var(--puzzle--dimension--space) * 7);
    --switch-handle-size: calc(var(--puzzle--dimension--space) * 5);
    --switch-handle-offset: calc(var(--puzzle--dimension--space) * 1);
    --switch-icon-size: calc(var(--puzzle--dimension--space) * 5);
    --switch-icon-offset: calc(var(--puzzle--dimension--space) * 1.5);
  }

  /**
   * Block
   */

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    inline-size: 100%;
    gap: calc(var(--puzzle--dimension--space) * 3);
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    outline: 0;
  }

  /**
   * Element: track
   */

  .switch__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    border-radius: calc(var(--switch-block-size) / 2);
    block-size: var(--switch-block-size);
    inline-size: var(--switch-inline-size);
    background-color: var(--switch-off-bgcolor, rgb(36 46 66 / 42%));
    color: var(--switch-off-textcolor, inherit);
    transition: background-color var(--switch-animation-duration) ease-in-out;
  }

  /**
   * Element: handle
   */

  .switch__handle {
    content: "";
    position: absolute;
    inset-inline-start: var(--switch-handle-offset);
    display: flex;
    align-items: center;
    block-size: var(--switch-handle-size);
    inline-size: var(--switch-handle-size);
    border-radius: 50%;
    background-color: var(--puzzle--color--content--neutral);
    transition: transform var(--switch-animation-duration) ease-in-out;
  }

  /**
   * Element: input
   */

  .switch__input {
    position: absolute;
    block-size: var(--switch-block-size);
    inline-size: var(--switch-inline-size);
    border-radius: calc(var(--switch-block-size) / 2);
    appearance: none;
    cursor: pointer;
    z-index: 1;
  }

  /**
   * Element: label
   */

  .switch__label {
    color: var(--puzzle--color--content--neutral--high);
    font-size: 1rem;
    line-height: 1.25rem;
  }

  /**
   * Element: icon
   */

  .switch__icon {
    display: block;
    inline-size: var(--switch-icon-size);
    block-size: var(--switch-icon-size);
    fill: currentColor;
    color: var(--puzzle--color--content--neutral);
  }

  .switch__icon--on {
    margin-inline-start: var(--switch-icon-offset);
  }

  .switch__icon--off {
    margin-inline-end: var(--switch-icon-offset);
  }

  puzzle-icon.switch__icon--on,
  puzzle-icon.switch__icon--off {
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--switch-icon-size);
    block-size: var(--switch-icon-size);
  }

  /**
   * Focus-visible
   */

  .switch__input:focus-visible {
    outline-width: var(--puzzle--border--stroke--extra-light);
    outline-color: var(--puzzle--color--background--inverse--noon);
    outline-style: solid;
    outline-offset: var(--puzzle--border--stroke--extra-light);
  }

  /**
   * Modifier: slot-empty
   * 
   * NB: Hides the label so the gap is not applied to the switch layout
   */

  .switch--slot-empty .switch__label {
    display: none;
  }

  /**
   * Modifier: checked (on)
   */

  .switch--on .switch__track {
    background-color: var(--switch-on-bgcolor, rgb(0, 156, 90));
    color: var(--switch-on-textcolor, inherit);
  }

  .switch--on .switch__handle {
    transform: translateX(calc(var(--switch-inline-size) - var(--switch-handle-size) - var(--switch-handle-offset) * 2));
  }

  /**
   * Modifier: disabled
   */
  .switch--disabled {
    cursor: not-allowed;
  }

  .switch--disabled .switch__input {
    cursor: not-allowed;
  }

  .switch--disabled .switch__track {
    background-color: var(--puzzle--color--background--disabled);
  }

  .switch--disabled .switch__handle {
    background-color: rgb(201 201 201);
  }

  .switch--disabled .switch__label {
    color: var(--puzzle--color--content--disabled);
  }

  .switch--disabled .switch__icon {
    color: var(--puzzle--color--content--disabled);
  }

  /**
   * Modifier: size-small
   */

  .switch--size-small {
    --switch-animation-duration: 100ms;
    --switch-inline-size: calc(var(--puzzle--dimension--space) * 11);
    --switch-block-size: calc(var(--puzzle--dimension--space) * 6);
    --switch-handle-size: calc(var(--puzzle--dimension--space) * 4.5);
    --switch-handle-offset: calc(var(--puzzle--dimension--space) * 0.75);
    --switch-icon-size: calc(var(--puzzle--dimension--space) * 4);
    --switch-icon-offset: calc(var(--puzzle--dimension--space) * 1.25);
  }

  .switch--size-small .switch__label {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /**
   * Modifier: label-start
   *
   * Reverses the order of the label and track
   */

  :host([label-start]) .switch__label {
    flex-grow: 1;
    order: -1;
  }
`,
      A = k("switch");
    class q extends a {
      constructor() {
        (super(...arguments),
          (this.size = "medium"),
          (this._onHostKeydown = (e) => {
            this.disabled ||
              ("Enter" !== e.key && " " !== e.key) ||
              (e.preventDefault(),
              (this.checked = !this.checked),
              this.dispatchEvent(
                new Event("change", {
                  bubbles: !0,
                }),
              ));
          }));
      }
      connectedCallback() {
        (super.connectedCallback(),
          this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"),
          this.addEventListener("keydown", this._onHostKeydown));
      }
      disconnectedCallback() {
        (super.disconnectedCallback(),
          this.removeEventListener("keydown", this._onHostKeydown));
      }
      checkSlotContent() {
        var e = this.slotElement.assignedNodes();
        this.hasSlotContent = e.some(
          (e) =>
            (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) ||
            e.nodeType === Node.ELEMENT_NODE,
        );
      }
      _onChange(e) {
        this.dispatchEvent(
          new InputEvent("change", {
            ...e,
          }),
        );
      }
      _onInput(e) {
        this.checked = e.target.checked;
      }
      renderLabel() {
        return g`
      <span class=${A("label")}>
        <slot @slotchange=${this.checkSlotContent}></slot>
      </span>
    `;
      }
      renderIcon(e, t) {
        return g`<puzzle-icon class=${A("icon", {
          [t]: !0,
        })} name=${e} size="fill"></puzzle-icon>`;
      }
      renderDefaultOnIcon() {
        return g`
      <svg class=${A("icon", {
        on: !0,
      })} role="presentation" viewBox="0 0 24 24">
        <path d="M9.55 17.575c-.133 0-.258-.021-.375-.063a.871.871 0 0 1-.325-.212L4.55 13c-.183-.183-.271-.421-.263-.713.009-.291.105-.529.288-.712a.948.948 0 0 1 .7-.275.95.95 0 0 1 .7.275L9.55 15.15l8.475-8.475c.183-.183.421-.275.713-.275.291 0 .529.092.712.275.183.183.275.42.275.712s-.092.53-.275.713l-9.2 9.2c-.1.1-.208.17-.325.212a1.099 1.099 0 0 1-.375.063Z"></path>
      </svg>`;
      }
      renderDefaultOffIcon() {
        return g`
      <svg class=${A("icon", {
        off: !0,
      })} role="presentation" viewBox="0 0 24 24">
        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
      </svg>`;
      }
      render() {
        var { checked: e, disabled: t, size: n, assistLabel: i } = this,
          n = A({
            on: e,
            off: !e,
            disabled: t,
            ["size-" + n]: !0,
            slotEmpty: !this.hasSlotContent,
          });
        return g`
      <label class=${n} for="switch">
        <div class=${A("track")}>
          <input
            switch
            id="switch"
            type="checkbox"
            role="switch"
            tabindex="-1"
            class=${A("input")}
            ?checked=${e}
            ?disabled=${t}
            aria-label=${i || v}
            aria-checked=${e ? "true" : "false"}
            aria-disabled=${t ? "true" : "false"}
            @input=${this._onInput}
            @change=${this._onChange}
          />
          <span class=${A("handle")}></span>
          ${this.onIcon ? this.renderIcon(this.onIcon, "on") : this.renderDefaultOnIcon()}
          ${this.offIcon ? this.renderIcon(this.offIcon, "off") : this.renderDefaultOffIcon()}
        </div>
        ${this.renderLabel()}
      </label>
    `;
      }
    }
    ((q.styles = [_, $, Ne]),
      t(
        [
          S({
            type: Boolean,
            reflect: !0,
          }),
          n("design:type", Boolean),
        ],
        q.prototype,
        "checked",
        void 0,
      ),
      t(
        [
          S({
            type: Boolean,
            reflect: !0,
          }),
          n("design:type", Boolean),
        ],
        q.prototype,
        "disabled",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        q.prototype,
        "size",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "assist-label",
          }),
          n("design:type", String),
        ],
        q.prototype,
        "assistLabel",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "on-icon",
          }),
          n("design:type", String),
        ],
        q.prototype,
        "onIcon",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "off-icon",
          }),
          n("design:type", String),
        ],
        q.prototype,
        "offIcon",
        void 0,
      ),
      t(
        [we(), n("design:type", Boolean)],
        q.prototype,
        "hasSlotContent",
        void 0,
      ),
      t(
        [x("slot"), n("design:type", HTMLSlotElement)],
        q.prototype,
        "slotElement",
        void 0,
      ),
      customElements.define("puzzle-switch", q));
    let Ie = "Toggle options",
      Pe = i`
  :host {
    display: inline-flex;
    vertical-align: top;
  }

  /**
   * Block
   */

  .toggle {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    border-radius: 999px;
    width: fit-content;
    cursor: pointer;
    background-color: rgb(237 237 237);
    /* box-shadow: 0 0 0 2px rgb(203 203 203); */
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /**
   * Element: option
   */

  .toggle__option {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: calc(var(--puzzle--dimension--space) * 2);
    padding-inline: calc(var(--puzzle--dimension--space) * 2);
    border-radius: 999px;
    font-size: 14px;
    line-height: 24px;
    font-weight: var(--puzzle--type--weight--medium);
    white-space: nowrap;
    pointer-events: none;
    transition: color 120ms ease-in-out;
  }

  /**
   * Element: slot
   */

  slot {
    pointer-events: none;
  }

  /**
   * Element: handle
   */

  .toggle__handle {
    position: absolute;
    block-size: 100%;
    inline-size: auto;
    border-radius: 999px;
    background-color: #cbdaff;
    opacity: 0;
    transition: left 120ms ease-in-out, inline-size 120ms ease-in-out,
      opacity 120ms ease-in-out;
  }

  /**
   * Element: description
   * NB: Visually hidden but visible to screen readers.
   */

  .toggle__description {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /**
   * State: 1
   */

  .toggle--state-1 .toggle__handle {
    opacity: 1;
  }

  .toggle--state-1 .toggle__option--start {
    color: var(--puzzle--color--content--accent--low);
  }

  /**
   * State: 2
   */

  .toggle--state-2 .toggle__handle {
    opacity: 1;
  }

  .toggle--state-2 .toggle__option--end {
    color: var(--puzzle--color--content--accent--low);
  }

  /**
   * Modifier: size
   */

  .toggle--size-fill {
    grid-auto-columns: minmax(0, 1fr);
    inline-size: 100%;
  }

  /**
   * Modifier: disabled
   */

  .toggle--disabled {
    cursor: not-allowed;
    background-color: var(--puzzle--color--background--disabled);
  }

  .toggle--disabled .toggle__handle {
    background-color: rgb(201 201 201);
  }

  .toggle--disabled .toggle__option {
    /* NB: We don't have much control over the slotted content, so we need to use opacity */
    opacity: 0.5;
  }

  /**
   * Modifier: focus-visible
   */

  .toggle:not(.toggle--disabled):focus-visible {
    outline-width: var(--puzzle--border--stroke--extra-light);
    outline-color: var(--puzzle--color--background--inverse--noon);
    outline-style: solid;
    outline-offset: var(--puzzle--border--stroke--extra-light);
  }
`,
      D = k("toggle");
    class N extends a {
      constructor() {
        (super(...arguments), (this.state = 0), (this.assistLabel = Ie));
      }
      _onClick(e) {
        this.disabled && (e.preventDefault(), e.stopPropagation());
      }
      renderIcon(e) {
        return g`
      <puzzle-icon class=${D("icon")} .name=${e}></puzzle-icon>
    `;
      }
      getA11yDescription() {
        return {
          0: "No option selected",
          1: this.assistLabelStart || "Option one",
          2: this.assistLabelEnd || "Option two",
        }[this.state];
      }
      firstUpdated() {
        (requestAnimationFrame(() => {
          this.requestUpdate();
        }),
          "fonts" in document &&
            document.fonts.ready.then(() => {
              this.requestUpdate();
            }));
      }
      getHandlePosition() {
        var { optionStart: e, optionEnd: t } = this;
        return e && t
          ? ((e = e.getBoundingClientRect().width),
            (t = t.getBoundingClientRect().width),
            1 === this.state
              ? `inline-size: ${e}px; left: 0;`
              : 2 === this.state
                ? `inline-size: ${t}px; left: ${e}px;`
                : "inline-size: auto; left: auto;")
          : "inline-size: auto; left: auto";
      }
      render() {
        var { state: e, size: t, disabled: n } = this,
          e = D({
            ["state-" + e]: !0,
            ["size-" + t]: t,
            disabled: n,
          });
        return g`
      <button
        class=${e}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        aria-label=${this.assistLabel || Ie}
        aria-describedby=${D("description")}
        @click=${this._onClick}
      >
        <span class=${D("handle")} style=${this.getHandlePosition()}></span>
        <span id="option-start" class=${D("option", {
          start: !0,
        })}>
          ${this.iconStart ? this.renderIcon(this.iconStart) : g`<slot name="start"></slot>`}
        </span>
        <span id="option-end" class=${D("option", {
          end: !0,
        })}>
          ${this.iconEnd ? this.renderIcon(this.iconEnd) : g`<slot name="end"></slot>`}
        </span>
      </button>
      <span
        id=${D("description")}
        class=${D("description")}
        aria-live="polite"
      >
        ${this.getA11yDescription()}
      </span>
    `;
      }
    }
    ((N.styles = [_, $, Pe]),
      t(
        [
          S({
            type: Number,
            reflect: !0,
          }),
          n("design:type", Number),
        ],
        N.prototype,
        "state",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "icon-start",
          }),
          n("design:type", String),
        ],
        N.prototype,
        "iconStart",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "icon-end",
          }),
          n("design:type", String),
        ],
        N.prototype,
        "iconEnd",
        void 0,
      ),
      t(
        [
          S({
            type: Boolean,
            reflect: !0,
          }),
          n("design:type", Boolean),
        ],
        N.prototype,
        "disabled",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "assist-label",
          }),
          n("design:type", String),
        ],
        N.prototype,
        "assistLabel",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "assist-label-start",
          }),
          n("design:type", String),
        ],
        N.prototype,
        "assistLabelStart",
        void 0,
      ),
      t(
        [
          S({
            type: String,
            attribute: "assist-label-end",
          }),
          n("design:type", String),
        ],
        N.prototype,
        "assistLabelEnd",
        void 0,
      ),
      t(
        [
          S({
            type: String,
          }),
          n("design:type", String),
        ],
        N.prototype,
        "size",
        void 0,
      ),
      t(
        [x("#option-start"), n("design:type", HTMLElement)],
        N.prototype,
        "optionStart",
        void 0,
      ),
      t(
        [x("#option-end"), n("design:type", HTMLElement)],
        N.prototype,
        "optionEnd",
        void 0,
      ),
      customElements.define("puzzle-toggle", N),
      (e.Banner = T),
      (e.Button = L),
      (e.Icon = E),
      (e.Switch = q),
      (e.Toggle = N));
  }));
function is_touch_device() {
  if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) return !0;
  try {
    var t,
      e = " -webkit- -moz- -o- -ms- ".split(" ");
    return "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
      ? !0
      : ((t = ["(", e.join("touch-enabled),("), "heartz", ")"].join("")),
        window.matchMedia(t).matches);
  } catch (t) {}
  return !1;
}
var defaultSettings = {
    "global.pin-toolbar": !0,
    "global.pinned-controls-top": !1,
    "global.auto-submit": !0,
    "global.show-checkpoints": !1,
    "global.show-coordinates": !1,
    "global.hide-timer": !1,
    "global.non-competitive-timer": !1,
    "global.left-handed": !1,
    "global.color-blind": !1,
    "global.animate-transitions": !1,
    "global.sync-settings": !0,
  },
  dontSync = {
    "global.sync-settings": 1,
  },
  uiSpecific = {
    "global.pin-toolbar": 1,
    "global.pinned-controls-top": 1,
    "global.auto-submit": 1,
    "global.hide-timer": 1,
  },
  defaultSettings = $.extend(!0, defaultSettings, puzzleSettings),
  Settings = {
    prefix: "puzzleSettings",
    bag: {},
    defaultBag: getDefaultSettingsBag(),
    onChange: {},
    saving: !1,
    store: function (t) {
      MVVM && !t && MVVM.apply();
      try {
        return !0;
      } catch (t) {
        return !1;
      }
    },
    get: function (e) {
      var t;
      if (!(e in this.bag))
        if (
          null === (t = localStorage.getItem(this.prefix + "." + e)) ||
          t.jsonObject
        )
          e in this.defaultBag && this.set(e, this.defaultBag[e], !0);
        else {
          var i;
          try {
            ((i = JSON.parse(t)), this.set(e, i, !0));
          } catch (t) {
            this.set(e, null, !0);
          }
        }
      return this.bag[e];
    },
    set: function (t, e, i) {
      if (null === (this.bag[t] = e))
        (delete this.bag[t], localStorage.removeItem(this.prefix + "." + t));
      else {
        for (var r = JSON.stringify(e); this.saving; );
        ((this.saving = !0),
          localStorage.setItem(this.prefix + "." + t, r),
          (this.saving = !1));
      }
      if (!i && !this.applyingRemote && isSyncableSettingKey(t))
        if (this.syncEnabled && this.syncEnabled())
          (_pendingAckSlugs.push(_currentPuzzleSlug()),
            StateSync.setSetting(
              t,
              null === e ? null : JSON.stringify(e),
              uiForKey(t),
            ));
        else if ("undefined" == typeof StateSync || !StateSync.isLoggedIn())
          try {
            localStorage.removeItem("puzzleSettingsSrvTs");
          } catch (t) {}
      return (
        t in this.onChange && this.onchange[t](e),
        MVVM && !i && MVVM.apply(),
        !0
      );
    },
    remove: function (t) {
      this.set(t, null);
    },
    resetDefault: function () {
      for (var t = Object.keys(localStorage), e = t.length; e--; )
        t[e].includes(this.prefix) &&
          t[e].includes(".save.") &&
          !t[e].includes("saved-zoom") &&
          localStorage.removeItem(t[e]);
      this.bag = {};
    },
    stringify: function () {
      for (var t = Object.keys(localStorage), e = t.length, i = []; e--; )
        t[e].includes(this.prefix) &&
          i.push('"' + t[e] + '":' + localStorage.getItem(t[e]));
      return "{" + i.join(",") + "}";
    },
  };
function getDefaultSettingsBag() {
  try {
    var t = localStorage.getItem("puzzleSettings"),
      e = null;
    if (t) {
      localStorage.removeItem("puzzleSettings");
      for (
        var e = getCurrentLocalStoragePuzzleSettings(),
          i = JSON.parse(t),
          r = Object.keys(i),
          s = r.length;
        s--;
      )
        null === localStorage.getItem("puzzleSettings." + r[s]) &&
          localStorage.setItem(
            "puzzleSettings." + r[s],
            JSON.stringify(i[r[s]]),
          );
    } else e = $.extend(!0, {}, defaultSettings);
    if (t || 0.95 < Math.random()) {
      var l,
        o = new Date(),
        n = (o.setMonth(o.getMonth() - 6), o.toISOString().split("T")[0]);
      for (l in localStorage) {
        var h = l.match(/\d{4}-\d{2}-\d{2}/);
        ((h && h[0] < n) || -1 < l.indexOf("puzzleSettings.puzzleSettings")) &&
          localStorage.removeItem(l);
      }
      window.setTimeout(function () {
        var t,
          e = 0;
        for (t in localStorage) {
          var i = (2 * localStorage[t].length) / 1024 / 1024;
          !isNaN(i) && localStorage.hasOwnProperty(t) && (e += i);
        }
        9.9 < e &&
          confirm(
            "Local Storage Full! It is recommended that you clear your cache. Do you want to proceed?",
          ) &&
          Settings.resetDefault();
      }, 100);
    }
    return e;
  } catch (t) {
    return void 0 !== Settings
      ? Settings.bag
      : $.extend(!0, {}, defaultSettings);
  }
}
function getCurrentLocalStoragePuzzleSettings() {
  try {
    return $.extend(
      $.extend(!0, {}, defaultSettings),
      JSON.parse(localStorage.getItem("puzzleSettings")),
    );
  } catch (t) {
    return $.extend(!0, {}, defaultSettings);
  }
}
function settingsApply() {
  (Game.redraw(), MVVM.apply(), setZoom(getZoom()));
}
function _setSrvTs(t, e) {
  var i;
  try {
    i = JSON.parse(localStorage.getItem("puzzleSettingsSrvTs")) || {};
  } catch (t) {
    i = {};
  }
  if (e > (i[t || ""] || 0)) {
    i[t || ""] = e;
    try {
      localStorage.setItem("puzzleSettingsSrvTs", JSON.stringify(i));
    } catch (t) {}
  }
}
function _getSrvTs(t) {
  try {
    return (
      (JSON.parse(localStorage.getItem("puzzleSettingsSrvTs")) || {})[
        t || ""
      ] || 0
    );
  } catch (t) {
    return 0;
  }
}
function isSyncableSettingKey(t) {
  return t in defaultSettings && !(t in dontSync);
}
function uiForKey(t) {
  return t in uiSpecific;
}
function _currentPuzzleSlug() {
  for (var t in defaultSettings) {
    t = t.split(".")[0];
    if ("global" !== t) return t;
  }
  return "";
}
Settings.applyingRemote = !1;
var _pendingAckSlugs = [];
((Settings.syncEnabled = function () {
  return "undefined" != typeof StateSync && StateSync.isLoggedIn();
}),
  (Settings.applyServerKey = function (t, e) {
    if (isSyncableSettingKey(t)) {
      this.applyingRemote = !0;
      try {
        this.set(t, null === e ? null : JSON.parse(e), !0);
      } catch (t) {
      } finally {
        this.applyingRemote = !1;
      }
    }
  }),
  (Settings._uploadLocalUnsynced = function (t) {
    for (
      var e,
        i,
        r = this.prefix + ".",
        s = Object.keys(localStorage),
        l = s.length;
      l--;
    )
      0 === s[l].indexOf(r) &&
        isSyncableSettingKey((e = s[l].slice(r.length))) &&
        !t[e] &&
        (i = localStorage.getItem(s[l])) !==
          (e in defaultSettings
            ? JSON.stringify(defaultSettings[e])
            : void 0) &&
        (_pendingAckSlugs.push(_currentPuzzleSlug()),
        StateSync.setSetting(e, i, uiForKey(e)));
  }),
  (Settings._reconcileAt = {}),
  (Settings.reconcile = function (r) {
    var t, s, l;
    this.syncEnabled() &&
      ((r = r || _currentPuzzleSlug()),
      (t = Date.now()),
      (this._reconcileAt[r] && t - this._reconcileAt[r] < 1500) ||
        ((this._reconcileAt[r] = t),
        (s = this),
        (l = 0 === _getSrvTs(r)),
        StateSync.loadSettings(r, _getSrvTs(r), function (t) {
          var e,
            i = t && t.modified && t.settings ? t.settings : {};
          if (t && t.modified) {
            for (e in (_setSrvTs(r, t.serverTs), i))
              i.hasOwnProperty(e) && s.applyServerKey(e, i[e].value);
            "undefined" != typeof MVVM && MVVM.apply && MVVM.apply();
          }
          l && s._uploadLocalUnsynced(i);
        })));
  }),
  (function t(e) {
    "undefined" == typeof StateSync
      ? e < 20 &&
        window.setTimeout(function () {
          t(e + 1);
        }, 150)
      : (StateSync.onSettingsAck &&
          StateSync.onSettingsAck(function (t) {
            var e = _pendingAckSlugs.shift();
            void 0 !== e && _setSrvTs(e, t);
          }),
        Settings.syncEnabled() && Settings.reconcile(_currentPuzzleSlug()));
  })(0),
  ((c) => {
    c.fn.hitori = function (t) {
      this.slug = "hitori";
      var e = Settings.get(this.slug + ".saved-draw-style"),
        g =
          (e &&
            (Settings.set(this.slug + ".draw-style", e),
            Settings.set(this.slug + ".saved-draw-style", "")),
          c.extend(
            {
              separatorWidth: 2,
              gutter: 5,
              puzzleWidth: 9,
              puzzleHeight: 9,
              squareSize: 30,
              task: "",
              solution: "",
              state: {},
              stateStack: [],
              checkState: 0,
              stars: 0,
            },
            t,
          ));
      return (
        (this.currentState = {
          currentCell: !1,
          cellStatus: [],
          cellColor: [],
          autoX: [],
          lastMove: {},
          index: 0,
        }),
        (this.currentMove = {
          cellStatus: 0,
          cellColor: 0,
          startPoint: {
            row: -1,
            col: -1,
          },
          endPoint: {
            row: -1,
            col: -1,
          },
          cells: [],
        }),
        (this.dom = {
          cells: [],
          bottomButtons: {},
          leftButtons: {},
          rightButtons: {},
        }),
        (this.buttonPressed = !1),
        (this.currentDomCell = {}),
        (this.puzzleWH = g.puzzleWidth),
        (this.task = []),
        (this.serializers = ["serializeBoardState", "serializeColorState"]),
        (this.unserializers = ["loadState", "loadColorState"]),
        !g.minScale && 30 <= g.puzzleWidth && (g.minScale = 0.2),
        !g.minScale && 20 <= g.puzzleWidth && (g.minScale = 0.3),
        !g.minScale && 15 <= g.puzzleWidth && (g.minScale = 0.6),
        !g.minScale && 10 <= g.puzzleWidth && (g.minScale = 0.8),
        !g.minScale && 5 <= g.puzzleWidth && (g.minScale = 1),
        (this.jigsaw = !1),
        (this.currentNumber = 0),
        (this.dr = [-1, 0, 1, 0]),
        (this.dc = [0, 1, 0, -1]),
        (this.puzzleWidth = g.puzzleWidth),
        (this.puzzleHeight = g.puzzleHeight),
        (this.getCellsSize = function (t) {
          return (
            t * (g.squareSize + 1) +
            (Settings.get(this.slug + ".thicker-lines") ? 5 : 1) +
            2 * g.separatorWidth
          );
        }),
        (this.getBoardWidth = function () {
          return 2 * g.gutter + this.getCellsSize(g.puzzleWidth);
        }),
        (this.getBoardHeight = function () {
          return 2 * g.gutter + this.getCellsSize(g.puzzleHeight);
        }),
        (this.parseTask = function () {
          if (g.task) {
            this.loaded = !0;
            for (
              var t = g.task.split(""), e = 0, i = 0;
              i < g.puzzleHeight;
              i++
            ) {
              this.task[i] = [];
              for (var r = 0; r < g.puzzleWidth; r++, e++)
                "." == t[e]
                  ? (this.task[i][r] = -1)
                  : (this.task[i][r] =
                      "0" < t[e] && t[e] <= "9"
                        ? parseInt(t[e])
                        : t[e].charCodeAt(0) - 87);
            }
          } else this.loaded = !1;
          (g.check || g.checkState) && (this.blacks = g.check);
        }),
        (this.initColorState = function () {
          this.currentState.cellColor = [];
          for (var t = 0; t < g.puzzleHeight; t++) {
            this.currentState.cellColor[t] = [];
            for (var e = 0; e < g.puzzleWidth; e++)
              this.currentState.cellColor[t][e] = 0;
          }
        }),
        (this.initState = function () {
          if (this.task.length) {
            for (var t = 0; t < g.puzzleHeight; t++) {
              this.currentState.cellStatus[t] = [];
              for (var e = 0; e < g.puzzleWidth; e++)
                this.currentState.cellStatus[t][e] = 0;
            }
            (this.initColorState(),
              (this.currentState.lastMove = []),
              (this.currentState.index = 0),
              (this.currentState.solved = !1),
              (this.solved = !1),
              (this.states = [Util.clone(this.currentState)]));
          }
        }),
        (this.helpersVisualizeMove = function () {
          this.drawCurrentCellHelper(this.currentState.currentCell);
        }),
        (this.highlightCurrencCell = function (t) {
          (c(".cell.active").removeClass("active"),
            this.dom.cells[t.row][t.col].addClass("active"));
        }),
        (this.highlightCurrentAreas = function (t) {
          if (
            (c(".cell.highlighted").removeClass("highlighted"),
            Settings.get(this.slug + ".highlight-current-row-col"))
          )
            for (var e = 0; e < this.puzzleWH; e++)
              (this.dom.cells[t.row][e].addClass("highlighted"),
                this.dom.cells[e][t.col].addClass("highlighted"));
        }),
        (this.getNeighbours = function (t, e) {
          for (var i = [], r = 0; r < 4; r++) {
            var s = t + this.dr[r],
              l = e + this.dc[r];
            0 <= s &&
              0 <= l &&
              s < g.puzzleHeight &&
              l < g.puzzleWidth &&
              i.push({
                row: s,
                col: l,
              });
          }
          return i;
        }),
        (this.autoCross = function () {
          var t = 0,
            e = [];
          void 0 === this.currentState.autoX && (this.currentState.autoX = []);
          for (var i = 0; i < g.puzzleHeight; i++)
            void 0 === this.currentState.autoX[i] &&
              (this.currentState.autoX[i] = []);
          for (i = 0; i < g.puzzleHeight; i++)
            for (var r = 0; r < g.puzzleWidth; r++) {
              var s = {
                row: i,
                col: r,
              };
              if (1 === this.getCurrentStatus(s))
                for (var l = this.getNeighbours(i, r), o = 0; o < l.length; o++)
                  0 === this.getCurrentStatus(l[o]) &&
                    ((l[o].status = 2),
                    e.push(l[o]),
                    (this.currentState.autoX[l[o].row][l[o].col] = 1),
                    t++);
              else if (this.currentState.autoX[i][r]) {
                for (
                  var n = this.getNeighbours(i, r), h = !1, o = 0;
                  o < n.length;
                  o++
                )
                  if (1 === this.getCurrentStatus(n[o])) {
                    h = !0;
                    break;
                  }
                h ||
                  ((this.currentState.autoX[i][r] = 0),
                  2 === this.getCurrentStatus(s) &&
                    (e.push({
                      row: i,
                      col: r,
                      status: 0,
                    }),
                    t++));
              }
            }
          if (t)
            for (var a = 0; a < e.length; a++)
              this.setCellState(e[a], e[a].status);
          this.storeCurrentState(!0);
        }),
        (this._getBlackPossibleCount = function (t, e, i) {
          for (
            var r = 1, s = (g.puzzleWidth, this.getNeighbours(t, e)), l = 0;
            l < s.length;
            l++
          ) {
            var o = s[l].row * g.puzzleWidth + s[l].col;
            1 != this.currentState.cellStatus[s[l].row][s[l].col] &&
              void 0 === this.scratch[o] &&
              ((this.scratch[o] = i),
              (r += this._getBlackPossibleCount(s[l].row, s[l].col, i)));
          }
          return r;
        }),
        (this.getBlackPossibleCount = function (t, e) {
          var i = t * g.puzzleWidth + e;
          return (
            (this.scratch[i] = !0),
            this._getBlackPossibleCount(t, e, !0)
          );
        }),
        (this.getErrors = function (t) {
          for (
            var e = {
                cellErrors: [],
              },
              i = 0;
            i < g.puzzleHeight;
            i++
          )
            for (var r = 0; r < g.puzzleWidth; r++)
              if (1 == this.currentState.cellStatus[i][r]) {
                for (var s = 0; s < 4; s++) {
                  var l = i + this.dr[s],
                    o = r + this.dc[s];
                  0 <= l &&
                    0 <= o &&
                    l < g.puzzleHeight &&
                    o < g.puzzleWidth &&
                    1 == this.currentState.cellStatus[l][o] &&
                    (e.cellErrors.push([i, r]), e.cellErrors.push([l, o]));
                }
                if (t && e.cellErrors.length)
                  return ((e.code = "proximate"), e);
              }
          for (i = 0; i < g.puzzleHeight; i++)
            for (r = 0; r < g.puzzleWidth; r++)
              if (
                2 == this.currentState.cellStatus[i][r] ||
                (t && 0 == this.currentState.cellStatus[i][r])
              ) {
                var n = this.task[i][r];
                if (-1 != n) {
                  for (l = 0; l < g.puzzleHeight; l++)
                    i != l &&
                      (2 == this.currentState.cellStatus[l][r] ||
                        (t && 0 == this.currentState.cellStatus[l][r])) &&
                      this.task[l][r] == n &&
                      (e.cellErrors.push([i, r]), e.cellErrors.push([l, r]));
                  if (t && e.cellErrors.length)
                    return ((e.code = "colDuplicate"), e);
                  for (o = 0; o < g.puzzleWidth; o++)
                    r != o &&
                      (2 == this.currentState.cellStatus[i][o] ||
                        (t && 0 == this.currentState.cellStatus[i][o])) &&
                      this.task[i][o] == n &&
                      (e.cellErrors.push([i, r]), e.cellErrors.push([i, o]));
                  if (t && e.cellErrors.length)
                    return ((e.code = "rowDuplicate"), e);
                }
              }
          var h = [],
            a = -1,
            c = 0;
          this.scratch = [];
          for (i = 0; i < g.puzzleHeight; i++)
            for (r = 0; r < g.puzzleWidth; r++) {
              var u = i * g.puzzleWidth + r;
              void 0 === this.scratch[u] &&
                1 != this.currentState.cellStatus[i][r] &&
                ((this.scratch[u] = u),
                h.push({
                  r: i,
                  c: r,
                  size: this._getBlackPossibleCount(i, r, u),
                }));
            }
          if (h.length && 1 < h.length) {
            for (s = 0; s < h.length; s++)
              h[s].size > c &&
                ((c = h[s].size), (a = h[s].r * g.puzzleWidth + h[s].c));
            for (s = 0; s < g.puzzleWidth * g.puzzleHeight; s++)
              void 0 !== this.scratch[s] &&
                this.scratch[s] != a &&
                ((i = Math.floor(s / g.puzzleWidth)),
                (r = s % g.puzzleWidth),
                e.cellErrors.push([i, r]));
            if (t && e.cellErrors.length) return ((e.code = "isolated"), e);
          }
          return 0 < e.cellErrors.length && e;
        }),
        (this.highlightErrors = function () {
          if (Settings.get(this.slug + ".highlight-errors")) {
            c(".cell.err").removeClass("err");
            var t = this.getErrors();
            if (t)
              for (var e = 0; e < t.cellErrors.length; e++) {
                var i = t.cellErrors[e][0],
                  r = t.cellErrors[e][1];
                this.dom.cells[i][r].addClass("err");
              }
          }
        }),
        (this.drawHelperHighlightMove = function (t) {
          if (
            Settings.get(this.slug + ".highlight-change") &&
            (c(".active").removeClass("active"), t.cells)
          )
            for (var e = 0; e < t.cells.length; e++)
              this.highlightCell(t.cells[e], "active");
        }),
        (this.drawCurrentCellHelper = function (t) {
          t &&
            void 0 !== t.row &&
            void 0 !== t.col &&
            this.highlightCurrentAreas(t);
        }),
        (this.calcOffset = function (t, e) {
          return (
            (Settings.get(this.slug + ".thicker-lines") ? 3 : 1) +
            (g.squareSize + 1) * t +
            g.separatorWidth
          );
        }),
        (this.draw = function () {
          if (
            ((this.boardWidth = this.getBoardWidth()),
            (this.boardHeight = this.getBoardHeight()),
            this.initCrosshairHelper(),
            this.initNumberOfDrawnCellsHelper(),
            this.loaded)
          ) {
           
            for (
              var t = document.createDocumentFragment(),
                e = 0,
                i = 0,
                r =
                  (Settings.get("global.show-coordinates") &&
                    ((e = i = g.squareSize),
                    (this.boardWidth += 2 * i),
                    (this.boardHeight += 2 * e)),
                  this.css({
                    width: this.boardWidth,
                    height: this.boardHeight,
                  }),
                  (e += g.gutter),
                  (i += g.gutter),
              l++
            ) {
              this.dom.cells[l] = [];
              for (var o = 0; o < g.puzzleWidth; o++) {
                var n = this.calcOffset(l, g.puzzleWidth),
                  h = this.calcOffset(o, g.puzzleHeight),
                  a = c('<div tabindex="-1" class="cell selectable">').css({
                    top: n + "px",
                    left: h + "px",
                    width: g.squareSize - 2 + "px",
                    height: g.squareSize - 2 + "px",
                  });
                ((a[0].row = l),
                  (a[0].col = o),
                  (a.numberDiv = c('<div class="number">')
                    .css({
                      position: "absolute",
                      top: "1px",
                      left: "1px",
                    })
                    .text(-1 != this.task[l][o] ? this.task[l][o] : "")),
                  a[0].appendChild(a.numberDiv[0]),
                  (this.dom.cells[l][o] = a),
                  r[0].appendChild(a[0]));
              }
            }
            if (Settings.get("global.show-coordinates")) {
              for (l = 0; l < g.puzzleWidth; l++) {
                ((h = i + this.calcOffset(l, g.puzzleWidth)),
                  (n = e + this.calcOffset(l, g.puzzleHeight)),
                  (a = c('<div class="coordinate-sign t">')
                    .css({
                      top: "0px",
                      left: h + "px",
                      width: g.squareSize + "px",
                      height: g.squareSize + "px",
                    })
                    .text(this.colName(l))));
                (t.appendChild(a[0]),
                  (a = c('<div class="coordinate-sign bt">')
                    .css({
                      bottom: "0px",
                      left: h + "px",
                      width: g.squareSize + "px",
                      height: g.squareSize + "px",
                    })
                    .text(this.colName(l))),
                  t.appendChild(a[0]));
              }
              for (l = 0; l < g.puzzleHeight; l++) {
                ((h = i + this.calcOffset(l, g.puzzleWidth)),
                  (n = e + this.calcOffset(l, g.puzzleHeight)));
                ((a = c('<div class="coordinate-sign l">')
                  .css({
                    top: n + "px",
                    left: "0px",
                    width: g.squareSize + "px",
                    height: g.squareSize + "px",
                  })
                  .text(this.chessCoordinates ? g.puzzleHeight - l : l + 1)),
                  t.appendChild(a[0]),
                  (a = c('<div class="coordinate-sign r">')
                    .css({
                      top: n + "px",
                      right: "0px",
                      width: g.squareSize + "px",
                      height: g.squareSize + "px",
                    })
                    .text(this.chessCoordinates ? g.puzzleHeight - l : l + 1)),
                  t.appendChild(a[0]));
              }
            }
            (t.appendChild(r[0]),
              this[0].appendChild(t),
              this.helpersModifyState(),
              this.drawCurrentState());
          } else this.css("visibility", "hidden");
        }),
        (this.setCellState = function (t, e) {
          -1 != e && (this.currentState.cellStatus[t.row][t.col] = e);
        }),
        (this.setCellColor = function (t, e) {
          -1 != e && (this.currentState.cellColor[t.row][t.col] = e);
        }),
        (this.applyCurrentMoveToState = function () {
          for (var t = this.currentMove.cells.length, e = 0; e < t; e++) {
            var i = this.currentMove.cells[e];
            (this.setCellState(i, this.currentMove.cellStatus),
              this.setCellColor(i, this.currentMove.cellColor));
          }
          ((this.currentState.lastMove = Util.clone(this.currentMove)),
            this.storeCurrentState());
        }),
        (this.drawCellStatus = function (t, e) {
          -1 != e &&
            this.dom.cells[t.row][t.col]
              .toggleClass("cell-off", 0 == e)
              .toggleClass("cell-on", 1 == e)
              .toggleClass("cell-x", 2 == e);
        }),
        (this.drawCellColor = function (t, e) {
          -1 != e &&
            this.dom.cells[t.row][t.col]
              .toggleClass("color-1", 1 == e)
              .toggleClass("color-2", 2 == e)
              .toggleClass("color-3", 3 == e)
              .toggleClass("color-4", 4 == e)
              .toggleClass("color-5", 5 == e)
              .toggleClass("color-6", 6 == e)
              .toggleClass("color-7", 7 == e)
              .toggleClass("color-8", 8 == e)
              .toggleClass("color-9", 9 == e);
        }),
        (this.drawCurrentStateInternal = function () {
          if (this.currentState.cellStatus.length) {
            void 0 === this.currentState.cellColor && this.initColorState();
            for (var t = 0; t < g.puzzleHeight; t++)
              for (var e = 0; e < g.puzzleWidth; e++)
                (this.drawCellStatus(
                  {
                    row: t,
                    col: e,
                  },
                  this.currentState.cellStatus[t][e],
                ),
                  this.drawCellColor(
                    {
                      row: t,
                      col: e,
                    },
                    this.currentState.cellColor[t][e],
                  ));
          }
        }),
        (this.helpersModifyState = function () {
          Settings.get(this.slug + ".auto-x") && this.autoCross();
        }),
        (this.helpersVisualizeState = function () {
          (this.drawHelperHighlightMove(this.currentState.lastMove),
            this.drawCurrentCellHelper(this.currentCell),
            this.highlightErrors());
        }),
        (this.drawCurrentMove = function () {
          for (var t = this.currentMove.cells.length, e = 0; e < t; e++) {
            var i = this.currentMove.cells[e];
            (this.drawCellStatus(i, this.currentMove.cellStatus),
              this.drawCellColor(i, this.currentMove.cellColor));
          }
          this.helpersVisualizeMove();
        }),
        (this.repositionHelpers = function () {}),
        (this.performMove = function (t) {
          !this.drawing ||
            (this.currentMove.endPoint.row == t.row &&
              this.currentMove.endPoint.col == t.col) ||
            (this.resetCurrentMoveDraw(),
            1 == this.currentMove.cellStatus &&
            Math.abs(this.currentMove.endPoint.row - t.row) +
              Math.abs(this.currentMove.endPoint.col - t.col) ==
              1
              ? ((this.currentMove.startPoint = {
                  row: t.row,
                  col: t.col,
                }),
                (this.currentMove.endPoint = {
                  row: t.row,
                  col: t.col,
                }),
                (this.currentMove.cells[this.currentMove.cells.length - 1] = {
                  row: t.row,
                  col: t.col,
                }))
              : ((this.currentMove.endPoint = {
                  row: t.row,
                  col: t.col,
                }),
                this.currentMove.cells.push({
                  row: t.row,
                  col: t.col,
                })),
            this.drawCurrentMove());
        }),
        (this.stateChangedBoard = function () {
          for (var t = 0; t < g.puzzleHeight; t++)
            for (var e = 0; e < g.puzzleWidth; e++) {
              if (
                this.currentState.cellStatus[t][e] !=
                this.states[this.currentState.index].cellStatus[t][e]
              )
                return !0;
              if (
                void 0 !== this.states[this.currentState.index].cellColor &&
                this.currentState.cellColor[t][e] !=
                  this.states[this.currentState.index].cellColor[t][e]
              )
                return !0;
            }
          return !1;
        }),
        (this.loadState = function (t) {
          if (t.board)
            for (
              var e = 0,
                i = {
                  n: 0,
                  y: 1,
                  x: 2,
                },
                r = [0, 1, 2],
                s = 0;
              s < g.puzzleHeight;
              s++
            )
              for (var l = 0; l < g.puzzleWidth; l++)
                ((this.currentState.cellStatus[s][l] = this.decodeEnum(
                  t.board[e],
                  i,
                  r,
                  0,
                )),
                  e++);
        }),
        (this.serializeSolution = function () {
          for (var t = "", e = 0; e < g.puzzleHeight; e++)
            for (var i = 0; i < g.puzzleWidth; i++)
              t += 1 == this.currentState.cellStatus[e][i] ? "y" : "n";
          return t;
        }),
        (this.getMarkedCount = function () {
          for (var t = 0, e = 0; e < g.puzzleHeight; e++)
            for (var i = 0; i < g.puzzleWidth; i++)
              1 == this.currentState.cellStatus[e][i] && t++;
          return t;
        }),
        (this.startMove = function (t, e, i, r) {
          (this.initCurrentMove(),
            (this.drawing = !0),
            "color" == Settings.get(this.slug + ".draw-style")
              ? ((this.currentMove.cellColor =
                  e || this.currentState.cellColor[t.row][t.col]
                    ? 0
                    : Settings.get(this.slug + ".color")),
                (this.currentMove.cellStatus = -1))
              : ((this.currentMove.cellColor = -1),
                "rotate" == Settings.get(this.slug + ".draw-style") && (e = !e),
                (this.currentMove.cellStatus =
                  void 0 !== r ? r : this.getNextStatus(t, e))),
            (this.currentMove.startPoint = {
              row: t.row,
              col: t.col,
            }),
            (this.currentMove.endPoint = {
              row: t.row,
              col: t.col,
            }),
            this.currentMove.cells.push({
              row: t.row,
              col: t.col,
            }),
            i && this.drawCurrentMove());
        }),
        (this.onEndMove = function () {
          this.setCurrentCell(this.currentMove.endPoint, !0);
        }),
        (this.setCurrentCell = function (t, e) {
          t &&
            void 0 !== t.row &&
            void 0 !== t.col &&
            this.dom.cells[t.row] &&
            this.dom.cells[t.row][t.col] &&
            ((this.currentCell = {
              row: t.row,
              col: t.col,
            }),
            (this.currentDomCell = this.dom.cells[t.row][t.col]),
            e || this.currentDomCell.focus());
        }),
        (this.focus = function () {
          void 0 === this.currentCell ||
          void 0 === this.currentCell.row ||
          void 0 === this.currentCell.col
            ? this[0].focus()
            : void 0 !== this.dom.cells[this.currentCell.row] &&
              this.dom.cells[this.currentCell.row][
                this.currentCell.col
              ].focus();
        }),
        (this.keyboardSetState = function (t) {
          var e = this.getCurrentStatus(this.currentCell);
          ((this.keyMove = !0),
            this.startMove(this.currentDomCell[0], !1, !0, e == t ? 0 : t),
            this.drawing &&
              ((this.zoomingPanning = !1),
              this.endMove(),
              this.setCurrentCell({
                row: this.currentCell.row,
                col: this.currentCell.col,
              })));
        }),
        (this.getTarget = function (t) {
          var e = this.getChangedTouch(t),
            i = !1,
            r = !1,
            s = this.getScale(),
            t =
              ("touchstart" != t.type &&
                "touchmove" != t.type &&
                ((r =
                  3 == t.which || (1 == t.which && (t.ctrlKey || t.metaKey))),
                (i = !0)),
              c(document.elementFromPoint(e.clientX, e.clientY)));
          return {
            target: (t = t.hasClass("hitori-cell-back")
              ? this.findNearestCell(e.clientX, e.clientY)
              : t),
            draw: i,
            scale: s,
            inverse: r,
            changedTouch: e,
          };
        }),
        (this.handleTouchStart = function (t) {
          var t = this.getTarget(t),
            e = t.target;
          if (((this.inputMode = "mouse"), this.toggleClass("kbd", !1), !e))
            return !1;
          if (!e.hasClass("cell"))
            if (e.parent().hasClass("cell")) e = e.parent();
            else {
              if (!e.parent().parent().hasClass("cell")) return !1;
              e = e.parent().parent();
            }
          (this.startMove(e[0], t.inverse, t.draw),
            t.draw &&
              (c(".active").removeClass("active"),
              (this.dragMonitor.decision = "draw")));
        }),
        (this.eventsTouchMove = function (t) {
          var t = $this.getTarget(t),
            e = t.target,
            t = t.changedTouch;
          return (
            !(
              !e ||
              !e.hasClass("cell") ||
              ((e[0].row == this.currentMove.endPoint.row ||
                e[0].col == this.currentMove.endPoint.col) &&
                this.isCorner(t))
            ) && void $this.performMove(e[0])
          );
        }),
        (this.initEventHandlers = function () {
          (this.super.initEventHandlers(),
            this.attr("tabindex", g.isMobile ? 0 : -1),
            this.setupShiftColorOverride(),
            this.on("keydown.puzzle", function (t) {
              if (-1 != [37, 38, 39, 40, 65, 68, 83, 87].indexOf(t.keyCode)) {
                if (
                  (t.preventDefault(),
                  $this.currentCell &&
                    void 0 !== $this.currentCell.row &&
                    void 0 !== $this.currentCell.col)
                ) {
                  switch (t.keyCode) {
                    case 65:
                    case 37:
                      0 < $this.currentCell.col &&
                        $this.setCurrentCell({
                          row: $this.currentCell.row,
                          col: $this.currentCell.col - 1,
                        });
                      break;
                    case 87:
                    case 38:
                      0 < $this.currentCell.row &&
                        $this.setCurrentCell({
                          row: $this.currentCell.row - 1,
                          col: $this.currentCell.col,
                        });
                      break;
                    case 68:
                    case 39:
                      $this.currentCell.col < g.puzzleWidth - 1 &&
                        $this.setCurrentCell({
                          row: $this.currentCell.row,
                          col: $this.currentCell.col + 1,
                        });
                      break;
                    case 83:
                    case 40:
                      $this.currentCell.row < g.puzzleHeight - 1 &&
                        $this.setCurrentCell({
                          row: $this.currentCell.row + 1,
                          col: $this.currentCell.col,
                        });
                  }
                  (t.ctrlKey || t.shiftKey) &&
                    ($this.performMove($this.currentDomCell[0]),
                    ($this.keyMove = !0));
                } else
                  $this.setCurrentCell({
                    row: 0,
                    col: 0,
                  });
                $this.inputMode = "keyboard";
              } else
                (32 == t.keyCode || (g.isMobile && "Enter" == t.key)) &&
                "keyboard" == $this.inputMode
                  ? (t.preventDefault(), $this.keyboardSetState())
                  : 17 == t.keyCode && "keyboard" == $this.inputMode
                    ? (($this.keyMove = !0),
                      $this.startMove($this.currentDomCell[0], !1, !1))
                    : 16 == t.keyCode && "keyboard" == $this.inputMode
                      ? (($this.keyMove = !0),
                        $this.startMove($this.currentDomCell[0], !0, !1))
                      : 27 == t.keyCode
                        ? (($this.inputMode = "mouse"), $this.focus())
                        : $this.cancelMove();
              $this.toggleClass("kbd", "keyboard" == $this.inputMode);
            }),
            this.on("keyup.puzzle", function (t) {
              -1 != [16, 17].indexOf(t.keyCode) &&
                $this.keyMove &&
                $this.drawing &&
                (($this.zoomingPanning = !1),
                $this.endMove(),
                $this.setCurrentCell({
                  row: $this.currentCell.row,
                  col: $this.currentCell.col,
                }));
            }),
            g.isMobile || this.focus());
        }),
        (this.super = new puzzle(g)),
        c.extend(Util.clone(this.super), this)
      );
    };
  })(jQuery));
