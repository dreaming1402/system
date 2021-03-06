/*
All of the code within the FancyGrid software is developed and copyrighted by FancyGrid, Inc., and may not be copied,
replicated, or used in any other software or application without prior permission from FancyGrid. All usage must coincide with the
FancyGrid End User License Agreement which can be requested by email at support@fancygrid.com.

Build: 1.6.0
*/

var Fancy = {
    global: this,
    cls: "fancy",
    version: "1.6.0",
    site: "fancygrid.com",
    COLORS: ["#9DB160", "#B26668", "#4091BA", "#8E658E", "#3B8D8B", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"]
};
Fancy.apply = function(a, b) {
    for (var c in b)
        a[c] = b[c]
}
,
Fancy.applyIf = function(a, b) {
    for (var c in b)
        void 0 === a[c] && (a[c] = b[c])
}
,
Fancy.namespace = function() {
    for (var a = 0, b = arguments.length; b > a; a++) {
        var c = arguments[a]
          , d = c.split(".")
          , e = 1
          , f = d.length;
        Fancy.global[d[0]] = Fancy.global[d[0]] || {};
        for (var g = Fancy.global[d[0]]; f > e; e++)
            g[d[e]] = g[d[e]] || {},
            g = g[d[e]]
    }
}
,
Fancy.ns = Fancy.namespace,
Fancy.typeOf = function(a) {
    if (null === a)
        return "null";
    var b = typeof a;
    if ("undefined" === b || "string" === b || "number" === b || "boolean" === b)
        return b;
    var c = Object.prototype.toString
      , d = c.call(a);
    if (void 0 !== a.length && "function" != typeof a)
        return "array";
    switch (d) {
    case "[object Array]":
        return "array";
    case "[object Date]":
        return "date";
    case "[object Boolean]":
        return "boolean";
    case "[object Number]":
        return "number";
    case "[object RegExp]":
        return "regexp"
    }
    return "function" === b ? "function" : "object" === b ? "object" : void 0
}
,
Fancy.isArray = "isArray"in Array ? Array.isArray : function(a) {
    var b = Object.prototype.toString;
    return "[object Array]" === b.call(a)
}
,
Fancy.isObject = function(a) {
    var b = Object.prototype.toString;
    return "[object Object]" === b.call(a)
}
,
Fancy.isFunction = function(a) {
    var b = Object.prototype.toString;
    return "[object Function]" === b.apply(a)
}
,
Fancy.isString = function(a) {
    return "string" == typeof a
}
,
Fancy.isNumber = function(a) {
    return "number" == typeof a && isFinite(a)
}
,
Fancy.isBoolean = function(a) {
    return "boolean" == typeof a
}
,
Fancy.isDate = function(a) {
    return "date" === Fancy.typeOf(a)
}
,
Fancy.each = function(a, b) {
    var c = Fancy.typeOf(a);
    switch (c) {
    case "array":
        for (var d = 0, e = a.length; e > d; d++)
            b(a[d], d, a);
        break;
    case "object":
        for (var f in a)
            b(a[f], f, a)
    }
}
,
Fancy.mixin = function(a, b) {
    var c = 0
      , d = b.length;
    if ("object" === Fancy.typeOf(b[0]))
        for (; d > c; c++)
            for (var e = b[c], f = e._class, g = e.methods, h = 0, i = g.length; i > h; h++) {
                var j = g[h];
                a[j] = f.prototype[j]
            }
    else
        for (; d > c; c++) {
            var e = b[c];
            if (Fancy.isString(e)) {
                var k = Fancy.ClassManager.getMixin(e);
                k ? Fancy.apply(a, k.prototype) : Fancy.ClassManager.waitMixin(e, a)
            } else
                Fancy.apply(a, e.prototype)
        }
}
,
Fancy.Mixin = function(a, b) {
    var c = a.split(".")
      , d = 1
      , e = c.length - 1;
    Fancy.ns(a);
    for (var f = Fancy.global[c[0]]; e > d; d++)
        f = f[c[d]];
    c.length > 1 ? (f[c[c.length - 1]] = function() {}
    ,
    f[c[c.length - 1]].prototype = b) : (Fancy.global[c[0]] = function() {}
    ,
    Fancy.global[c[0]].prototype = b);
    var g = Fancy.ClassManager.waitMixins[a];
    if (g) {
        g = g.waiters;
        for (var d = 0, e = g.length; e > d; d++)
            Fancy.apply(g[d], b)
    }
}
,
Fancy.applyConfig = function(a, b) {
    var c, b = b || {};
    if (a.plugins && b.plugins && (a.plugins = a.plugins.concat(b.plugins),
    delete b.plugins),
    a._isConfigApplied === !0)
        return a;
    for (c in b)
        a[c] = b[c];
    return a._isConfigApplied = !0,
    a
}
,
Fancy.styleToString = function(a) {
    var b = "";
    a = a || {};
    for (var c in a)
        b += c + ": " + a[c] + ";";
    return b
}
,
Fancy.apply(Fancy, {
    prefix: "fancy-gen-",
    idSeed: 0,
    zIndex: 1,
    id: function(a, b) {
        return a ? (a = a.dom || {},
        a.id || (a.id = (b || Fancy.prefix) + ++Fancy.idSeed),
        a.id) : (b || Fancy.prefix) + ++Fancy.idSeed
    }
}),
function() {
    var a = navigator.userAgent.toLowerCase()
      , b = function(b) {
        return b.test(a)
    }
      , c = b(/opera/)
      , d = !c && b(/msie/);
    Fancy.apply(Fancy, {
        isOpera: c,
        isIE: d
    }),
    Fancy.getViewSize = function() {
        var a = [];
        return Fancy.isIE ? (a[0] = document.documentElement.clientHeight,
        a[1] = document.documentElement.clientWidth) : (a[0] = window.innerHeight,
        a[1] = window.innerWidth),
        a
    }
    ,
    Fancy.getScroll = function() {
        var a = document.documentElement
          , b = document.body;
        return a && (a.scrollTop || a.scrollLeft) ? [a.scrollTop, a.scrollLeft] : b ? [b.scrollTop, b.scrollLeft] : [0, 0]
    }
    ,
    Fancy.getMouseWheelEventName = function() {
        return "onmousewheel"in document.body ? "mousewheel" : "DOMMouseScroll"
    }
    ,
    Fancy.getWheelDelta = function(a) {
        var b = 0;
        return a.wheelDelta ? b = a.wheelDelta / 120 : a.detail && (b = -a.detail / 3),
        b
    }
    ,
    Fancy.isTouch = void 0 !== document.ontouchstart,
    Fancy.i18n = {},
    Fancy.currencies = {
        map: {
            EUR: "€",
            USD: "$",
            GBP: "£",
            RUB: "₽",
            CZK: "Kč",
            AUD: "$",
            JPY: "¥",
            PLN: "zł",
            TRY: "₺",
            DKK: "kr",
            KRW: "₩",
            BRL: "R$",
            CNY: "¥",
            SEK: "kr",
            CAD: "$",
            NOK: "kr",
            IDR: "Rp"
        }
    }
}(),
Fancy.modules = {},
function() {
    var a = {};
    Fancy.loadModule = function(b, c) {
        var d = document.getElementsByTagName("body")[0]
          , e = document.createElement("script")
          , f = b
          , g = Fancy.DEBUG ? ".js" : ".min.js"
          , c = c || function() {}
          , h = location.protocol
          , i = Fancy.version.replace(/\./g, "")
          , j = Fancy.MODULESDIR || FancyGrid.MODULESDIR || h + "//code.fancygrid.com/modules/";
        Fancy.MODULELOAD !== !1 && Fancy.MODULESLOAD !== !1 && (b = b.replace(/ /g, "-"),
        g += Fancy.DEBUG ? "?_dc=" + +new Date : "?_v=" + i,
        Fancy.Modules.on("loaded", function(a, d) {
            d === b && (Fancy.modules[f] = !0,
            c(b))
        }),
        a[b] || (a[b] = !0,
        e.src = j + b + g,
        e.charset = "utf-8",
        e.onload = function() {
            Fancy.Modules.fire("loaded", b)
        }
        ,
        e.onerror = function() {
            throw new Error("[FancyGrid error] - module " + b + " was not loaded")
        }
        ,
        d.appendChild(e)))
    }
    ,
    Fancy.loadLang = function(a, b) {
        if (void 0 !== Fancy.i18n[a])
            return !0;
        var c = document.getElementsByTagName("body")[0]
          , d = document.createElement("script")
          , e = ".js"
          , f = location.protocol
          , g = Fancy.MODULESDIR || FancyGrid.MODULESDIR || f + "//code.fancygrid.com/modules/";
        d.src = g + "i18n/" + a + e,
        d.charset = "utf-8",
        d.async = "true",
        d.onload = function() {
            b({
                lang: Fancy.i18n[a]
            })
        }
        ,
        c.appendChild(d)
    }
}(),
Fancy.fullBuilt = !0,
Fancy.themes = {},
Fancy.defineTheme = function(a, b) {
    var c = {};
    b.extend ? Fancy.apply(c, Fancy.getTheme(b.extend).config) : "default" !== a && Fancy.apply(c, Fancy.getTheme("default").config),
    Fancy.apply(c, b.config),
    b.config = c,
    Fancy.themes[a] = b
}
,
Fancy.getTheme = function(a) {
    var b = {
        config: {}
    };
    return Fancy.isObject(a) ? (Fancy.applyIf(b, Fancy.themes[a.name || "default"]),
    Fancy.apply(b.config, Fancy.themes[a.name || "default"].config),
    Fancy.apply(b.config, a.config),
    b) : Fancy.themes[a]
}
,
Fancy.defineTheme("default", {
    config: {
        cellHeaderHeight: 30,
        cellWidth: 70,
        minCellWidth: 40,
        cellHeight: 32,
        titleHeight: 42,
        subTitleHeight: 42,
        barHeight: 38,
        bottomScrollHeight: 12,
        minCenterWidth: 100,
        panelBorderWidth: 2,
        groupRowHeight: 31,
        gridBorders: [1, 1, 1, 1],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 2, 2, 2],
        knobOffSet: 2,
        fieldHeight: 37
    }
}),
Fancy.defineTheme("blue", {
    config: {
        panelBorderWidth: 1,
        gridBorders: [1, 1, 1, 1],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 0, 0, 0]
    }
}),
Fancy.defineTheme("gray", {
    config: {
        panelBorderWidth: 0,
        gridBorders: [0, 0, 1, 0],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 0, 0, 0]
    }
}),
Fancy.defineTheme("dark", {
    config: {
        panelBorderWidth: 1,
        gridBorders: [0, 1, 1, 1],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 0, 0, 0]
    }
}),
Fancy.defineTheme("sand", {
    config: {
        panelBorderWidth: 1,
        gridBorders: [0, 1, 1, 1],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 0, 0, 0]
    }
}),
Fancy.defineTheme("bootstrap", {
    config: {
        panelBorderWidth: 1,
        gridBorders: [1, 1, 1, 1],
        gridWithoutPanelBorders: [1, 1, 1, 1],
        panelBodyBorders: [0, 0, 0, 0]
    }
}),
Fancy.String = {
    format: function(a) {
        var b, c, d;
        if ("array" === Fancy.typeOf(arguments[1]))
            b = arguments[1];
        else
            for (d = arguments.length,
            b = [],
            c = 1; d > c; c++)
                b[c - 1] = arguments[c];
        return a.replace(/\[(\d+)]/g, function(a, c) {
            return b[c]
        })
    },
    upFirstChar: function(a) {
        return a[0].toLocaleUpperCase() + a.substr(1, a.length)
    },
    trim: function(a) {
        return a.replace(/\s/g, "")
    }
},
Fancy.Array = {
    copy: function(a, b) {
        if (!b)
            return a.slice();
        for (var c = [], d = 0, e = a.length; e > d; d++)
            switch (Fancy.typeOf(a[d])) {
            case "object":
                c[d] = Fancy.Object.copy(a[d]);
                break;
            case "array":
                c[d] = Fancy.Array.copy(a[d]);
                break;
            default:
                c = a[d]
            }
        return c
    }
},
Fancy.Object = {
    copy: function(a) {
        var b = {};
        for (var c in a)
            b[c] = a[c];
        return b
    }
},
Fancy.Date = {
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    dayIndexes: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    format: function(a, b, c, d) {
        var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t = "", d = d || "";
        d = d.toLocaleLowerCase(),
        void 0 === c ? c = Fancy.i18n.en : Fancy.isString(c) && (c = Fancy.i18n[c]);
        for (var u = 0, v = b.length; v > u; u++) {
            var w = b[u];
            switch (w) {
            case "i":
                f = a.getMinutes(),
                t += 10 > f ? "0" + f : f;
                break;
            case "s":
                if (f = a.getSeconds(),
                "sql" === d) {
                    if ("ss" !== b.substr(u, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    t += 10 > f ? "0" + f : f,
                    u++
                } else
                    t += 10 > f ? "0" + f : f;
                break;
            case "S":
                if (f = a.getSeconds(),
                "sql" !== d)
                    throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                if ("SS" !== b.substr(u, 2))
                    throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                t += 10 > f ? "0" + f : f,
                u++;
                break;
            case "a":
                e = a.getHours(),
                t += 13 > e ? c.date.am : c.date.pm;
                break;
            case "A":
                e = a.getHours(),
                t += 13 > e ? c.date.AM : c.date.PM;
                break;
            case "n":
                t += a.getMonth();
                break;
            case "j":
                t += a.getDate();
                break;
            case "m":
                if (s = a.getMonth() + 1,
                "sql" === d)
                    if ("mm" === b.substr(u, 2))
                        10 > s && (s = "0" + s),
                        t += s,
                        u++;
                    else {
                        if ("mi" !== b.substr(u, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        f = a.getMinutes(),
                        t += 10 > f ? "0" + f : f,
                        u++
                    }
                else
                    10 > s && (s = "0" + s),
                    t += s;
                break;
            case "d":
                if (r = a.getDate(),
                "sql" === d) {
                    if ("dd" !== b.substr(u, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    10 > r && (r = "0" + r),
                    t += r,
                    u++
                } else
                    10 > r && (r = "0" + r),
                    t += r;
                break;
            case "Y":
                if ("sql" === d)
                    if ("YYYY" === b.substr(u, 4))
                        t += a.getFullYear(),
                        u += 3;
                    else {
                        if ("YY" !== b.substr(0, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        String(a.getFullYear()).substr(2, t.length),
                        u += 1
                    }
                else
                    t += a.getFullYear();
                break;
            case "y":
                if ("sql" === d)
                    if ("yyyy" === b.substr(u, 4))
                        t += a.getFullYear(),
                        u += 3;
                    else {
                        if ("yy" !== b.substr(0, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        String(a.getFullYear()).substr(2, t.length),
                        u += 1
                    }
                else
                    t += String(a.getFullYear()).substr(2, t.length);
                break;
            case "D":
                if (g = a.getDay(),
                "sql" === d) {
                    if ("DD" !== b.substr(u, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    t += c.date.days[g].substr(0, 3),
                    u++
                } else
                    t += c.date.days[g].substr(0, 3);
                break;
            case "l":
                h = a.getDay(),
                t += c.date.days[h];
                break;
            case "N":
                i = a.getDay(),
                0 === i && (i = 7),
                t += i;
                break;
            case "w":
                j = a.getDay(),
                t += j;
                break;
            case "F":
                k = a.getMonth(),
                t += c.date.months[k];
                break;
            case "M":
                if (l = a.getMonth(),
                "sql" === d)
                    if ("MM" === b.substr(u, 2))
                        t += c.date.months[l].substr(0, 3),
                        u += 1;
                    else {
                        if ("MI" !== b.substr(u, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        f = a.getMinutes(),
                        t += 10 > f ? "0" + f : f,
                        u++
                    }
                else
                    t += c.date.months[l].substr(0, 3);
                break;
            case "t":
                "sql" === d ? t += " " : (m = new Date(a.getFullYear(),a.getMonth(),0).getDate(),
                t += m);
                break;
            case "T":
                if ("sql" !== d)
                    throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                t += " ";
                break;
            case "g":
                n = a.getHours() % 12,
                t += n;
                break;
            case "G":
                n = a.getHours(),
                t += n;
                break;
            case "h":
                if (e = a.getHours(),
                "sql" === d) {
                    if ("hh" !== b.substr(u, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    t += e > 12 ? e - 12 : e > 9 && 13 > e ? e : "0" + e,
                    u += 1
                } else
                    t += e > 12 ? e - 12 : e > 9 && 13 > e ? e : "0" + e;
                break;
            case "H":
                if (o = a.getHours(),
                "sql" === d) {
                    if ("HH" !== b.substr(u, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    t += 10 > o ? "0" + o : o,
                    u += 1
                } else
                    t += 10 > o ? "0" + o : o;
                break;
            case "u":
                p = a.getMilliseconds(),
                t += p;
                break;
            case "U":
                q = Number(a) / 1e3,
                t += q;
                break;
            default:
                t += w
            }
        }
        return t
    },
    parse: function(a, b, c) {
        var d, e = new Date, f = e.getFullYear(), g = e.getMonth(), h = e.getDate(), i = 0, j = 0, k = 0, l = 0, c = c || "";
        c = c.toLocaleLowerCase();
        for (var m = 0, n = b.length; n > m; m++) {
            var o, p, q, r = b[m];
            switch (r) {
            case "n":
                var s;
                "0" === a[1] || "1" === a[1] || "2" === a[1] ? (s = a[0] + a[1],
                a = a.substr(2, a.length)) : (s = a[0],
                a = a.substr(1, a.length)),
                g = Number(s);
                break;
            case "j":
                Fancy.isNumber(parseInt(a[1])) ? (o = a[0] + a[1],
                a = a.substr(2, a.length)) : (o = a[0],
                a = a.substr(1, a.length)),
                h = Number(o);
                break;
            case "h":
                if ("sql" === c) {
                    if ("hh" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    var t;
                    isNaN(Number(a[1])) ? (t = a[0],
                    a = a.substr(1, a.length)) : (t = a[0] + a[1],
                    a = a.substr(2, a.length),
                    m += 1),
                    i = Number(t)
                } else {
                    var t;
                    "0" === a[1] || "1" === a[1] || "2" === a[1] ? (t = a[0] + a[1],
                    a = a.substr(2, a.length)) : (t = a[0],
                    a = a.substr(1, a.length)),
                    i = Number(t)
                }
                break;
            case "a":
                "m" === a[1] && (i += 12),
                a = a.substr(2, a.length);
                break;
            case "A":
                "M" === a[1] && (i += 12),
                a = a.substr(2, a.length);
                break;
            case "i":
                j = a[0] + a[1],
                a = a.substr(2, a.length);
                break;
            case "s":
                if ("sql" === c) {
                    if ("ss" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    k = a[0] + a[1],
                    a = a.substr(2, a.length),
                    m++
                } else
                    k = a[0] + a[1],
                    a = a.substr(2, a.length);
                break;
            case "S":
                if ("sql" === c) {
                    if ("SS" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    k = a[0] + a[1],
                    a = a.substr(2, a.length),
                    m++
                } else
                    k = a[0] + a[1],
                    a = a.substr(2, a.length);
                break;
            case "u":
                l = a[0] + a[1] + a[2],
                a = a.substr(3, a.length);
                break;
            case "m":
                if ("sql" === c)
                    if ("mm" === b.substr(m, 2))
                        switch (a[0]) {
                        case "0":
                        case "1":
                        case "2":
                        case "3":
                            isNaN(parseInt(a[1])) ? (g = Number(a[0]) - 1,
                            a = a.substr(1, a.length)) : (g = Number(a[0] + a[1]) - 1,
                            a = a.substr(2, a.length)),
                            m += 1;
                            break;
                        default:
                            g = Number(a[0]) - 1,
                            a = a.substr(1, a.length)
                        }
                    else {
                        if ("mi" !== b.substr(m, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        j = a[0] + a[1],
                        a = a.substr(2, a.length),
                        m++
                    }
                else
                    switch (a[0]) {
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                        isNaN(parseInt(a[1])) ? (g = Number(a[0]) - 1,
                        a = a.substr(1, a.length)) : (g = Number(a[0] + a[1]) - 1,
                        a = a.substr(2, a.length));
                        break;
                    default:
                        g = Number(a[0]) - 1,
                        a = a.substr(1, a.length)
                    }
                break;
            case "d":
                if ("sql" === c) {
                    if ("dd" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    isNaN(parseInt(a[1])) ? (h = Number(a[0]),
                    a = a.substr(1, a.length)) : (h = Number(a[0] + a[1]),
                    a = a.substr(2, a.length)),
                    m++
                } else
                    isNaN(parseInt(a[1])) ? (h = Number(a[0]),
                    a = a.substr(1, a.length)) : (h = Number(a[0] + a[1]),
                    a = a.substr(2, a.length));
                break;
            case "Y":
                if ("sql" === c)
                    if ("YYYY" === b.substr(m, 4))
                        f = Number(a[0] + a[1] + a[2] + a[3]),
                        a = a.substr(4, a.length),
                        m += 3;
                    else {
                        if ("YY" !== b.substr(0, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        f = Number(a[0] + a[1]),
                        a = a.substr(2, a.length),
                        m += 1,
                        f = 51 > f ? Number("20" + f) : Number("19" + f)
                    }
                else
                    f = Number(a[0] + a[1] + a[2] + a[3]),
                    a = a.substr(4, a.length);
                break;
            case "y":
                if ("sql" === c)
                    if ("yyyy" === b.substr(m, 4))
                        f = Number(a[0] + a[1] + a[2] + a[3]),
                        a = a.substr(4, a.length),
                        m += 3;
                    else {
                        if ("yy" !== b.substr(0, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        f = Number(a[0] + a[1]),
                        a = a.substr(2, a.length),
                        m += 1,
                        f = 51 > f ? Number("20" + f) : Number("19" + f)
                    }
                else
                    f = Number(a[0] + a[1]),
                    f = 51 > f ? Number("20" + f) : Number("19" + f),
                    a = a.substr(2, a.length);
                break;
            case "D":
                if ("sql" === c) {
                    if ("DD" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    isNaN(parseInt(a[1])) ? (h = Number(a[0]),
                    a = a.substr(1, a.length)) : (h = Number(a[0] + a[1]),
                    a = a.substr(2, a.length)),
                    m++
                } else
                    a = a.substr(3, a.length);
                break;
            case "l":
                for (q = a[0] + a[1] + a[2],
                o = 0,
                p = 7; p > o; o++) {
                    var u = lang.days[o];
                    if (q === u.substr(0, 3)) {
                        a = a.substr(u.length, a.length);
                        break
                    }
                }
                break;
            case "N":
                a = a.substr(1, a.length);
                break;
            case "w":
                a = a.substr(1, a.length);
                break;
            case "F":
                for (q = a[0] + a[1] + a[2],
                o = 0,
                p = 7; p > o; o++) {
                    var v = lang.months[o];
                    if (q === v.substr(0, 3)) {
                        a = a.substr(v.length, a.length);
                        break
                    }
                }
                break;
            case "M":
                if ("sql" === c)
                    if ("MM" === b.substr(m, 2))
                        switch (a[0]) {
                        case "0":
                        case "1":
                        case "2":
                        case "3":
                            isNaN(parseInt(a[1])) ? (g = Number(a[0]) - 1,
                            a = a.substr(1, a.length)) : (g = Number(a[0] + a[1]) - 1,
                            a = a.substr(2, a.length)),
                            m += 1;
                            break;
                        default:
                            g = Number(a[0]) - 1,
                            a = a.substr(1, a.length)
                        }
                    else {
                        if ("MI" !== b.substr(m, 2))
                            throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                        j = a[0] + a[1],
                        a = a.substr(2, a.length),
                        m++
                    }
                else
                    a = a.substr(3, a.length);
                break;
            case "t":
                a = "sql" === c ? a.substr(1, a.length) : a.substr(2, a.length);
                break;
            case "T":
                if ("sql" !== c)
                    throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                a = a.substr(1, a.length);
                break;
            case "G":
                Fancy.isNumber(parseInt(a[1])) ? (i = Number(a[0] + a[1]),
                a = a.substr(2, a.length)) : (i = Number(a[0]),
                a = a.substr(1, a.length));
                break;
            case "g":
                a = a.substr(1, a.length);
                break;
            case "H":
                if ("sql" === c) {
                    if ("HH" !== b.substr(m, 2))
                        throw new Error("[FancyGrid Error] - Invalid date format: " + b);
                    var t;
                    isNaN(Number(a[1])) ? (t = a[0],
                    a = a.substr(1, a.length)) : (t = a[0] + a[1],
                    a = a.substr(2, a.length),
                    m += 1),
                    i = Number(t)
                } else
                    i = Number(a[0] + a[1]),
                    a = a.substr(2, a.length);
                break;
            default:
                a = a.substr(1, a.length)
            }
        }
        return d = new Date(f,g,h,i,j,k,l)
    },
    getDaysInMonth: function(a) {
        var b = a.getMonth();
        return 1 === b && Fancy.Date.isLeapYear(a) ? 29 : Fancy.Date.daysInMonth[b]
    },
    getFirstDayOfMonth: function(a) {
        var b = (a.getDay() - (a.getDate() - 1)) % 7;
        return 0 > b ? b + 7 : b
    },
    isLeapYear: function(a) {
        var b = a.getFullYear();
        return !(0 !== (3 & b) || !(b % 100 || b % 400 === 0 && b))
    },
    getMonthNumber: function(a, b) {
        return new Date(a,b + 1,0).getDate()
    }
},
Fancy.Number = {
    isFloat: function(a) {
        return Number(a) === a && a % 1 !== 0
    },
    getPrecision: function(a) {
        return (a + "").split(".")[1].length + 1
    },
    correctFloat: function(a) {
        return parseFloat(a.toPrecision(14))
    }
},
Fancy.Collection = function(a) {
    var b = this;
    if (b.items = [],
    b.keys = [],
    b.map = {},
    b.indexMap = {},
    b.length = 0,
    a)
        if (a.length > 0)
            for (var c = 0, d = a.length; d > c; c++)
                b.add(c, a[c]);
        else
            for (var e in a)
                b.add(e, a[e])
}
,
Fancy.Collection.prototype = {
    add: function(a, b) {
        var c = this;
        c.items.push(b),
        c.keys.push(a),
        c.map[a] = b,
        c.indexMap[a] = c.length,
        c.length++
    },
    remove: function(a) {
        var b = this
          , c = b.indexMap[a];
        b.items.splice(c, 1),
        b.keys.splice(c, 1),
        delete b.indexMap[c],
        delete b.map[a],
        b.length--
    },
    removeAll: function() {
        var a = this;
        a.items = [],
        a.keys = [],
        a.indexMap = {},
        a.map = {},
        a.length = 0
    },
    get: function(a) {
        var b = this;
        return b.map[a]
    },
    each: function(a) {
        for (var b = this, c = 0, d = b.length; d > c; c++)
            a(b.keys[c], b.items[c], c, b.length)
    }
},
Fancy.Template = function(a) {
    var b = this;
    Fancy.isArray(a) ? b.tpl = a.join("") : b.tpl = a,
    b.compile()
}
,
Fancy.Template.prototype = {
    re: /\{([\w\-]+)\}/g,
    getHTML: function(a) {
        var b = this;
        return b.compiled(a)
    },
    compile: function() {
        function fn(a, b) {
            return b = "values['" + b + "']",
            "'+(" + b + " === undefined ? '' : " + b + ")+'"
        }
        var me = this
          , sep = "+";
        return eval("me.compiled = function(values){ return '" + me.tpl.replace(me.re, fn) + "';};"),
        me
    }
},
Fancy.key = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    RETURN: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    NUM_ZERO: 96,
    NUM_ONE: 97,
    NUM_TWO: 98,
    NUM_THREE: 99,
    NUM_FOUR: 100,
    NUM_FIVE: 101,
    NUM_SIX: 102,
    NUM_SEVEN: 103,
    NUM_EIGHT: 104,
    NUM_NINE: 105,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    DOT: 190
},
Fancy.Key = {
    isNum: function(a) {
        var b = Fancy.key;
        switch (a) {
        case b.ZERO:
        case b.ONE:
        case b.TWO:
        case b.THREE:
        case b.FOUR:
        case b.FIVE:
        case b.SIX:
        case b.SEVEN:
        case b.EIGHT:
        case b.NINE:
        case b.NUM_ZERO:
        case b.NUM_ONE:
        case b.NUM_TWO:
        case b.NUM_THREE:
        case b.NUM_FOUR:
        case b.NUM_FIVE:
        case b.NUM_SIX:
        case b.NUM_SEVEN:
        case b.NUM_EIGHT:
        case b.NUM_NINE:
            return !0;
        default:
            return !1
        }
    },
    isNumControl: function(a, b) {
        var c = Fancy.key;
        if (Fancy.Key.isNum(a))
            return !0;
        if (b.shiftKey && 187 === a)
            return !0;
        switch (a) {
        case c.NUM_PLUS:
        case 189:
        case c.NUM_MINUS:
        case c.BACKSPACE:
        case c.DELETE:
        case c.TAB:
        case c.ENTER:
        case c.RETURN:
        case c.SHIFT:
        case c.CTRL:
        case c.ALT:
        case c.ESC:
        case c.END:
        case c.HOME:
        case c.LEFT:
        case c.UP:
        case c.RIGHT:
        case c.DOWN:
        case c.INSERT:
        case c.DOT:
            return !0;
        default:
            return !1
        }
    }
},
function() {
    var a = {}
      , b = {}
      , c = function(a, b) {
        for (var c in b.prototype)
            void 0 === a.prototype[c] && (a.prototype[c] = b.prototype[c])
    }
      , d = function() {
        this.waitMixins = {}
    };
    d.prototype = {
        items: new Fancy.Collection,
        add: function(a, b) {
            var c = a.split(".")
              , d = 1
              , e = c.length - 1;
            Fancy.ns(a);
            for (var f = Fancy.global[c[0]]; e > d; d++)
                f = f[c[d]];
            c.length > 1 ? f[c[c.length - 1]] = b : Fancy.global[c[0]] = b,
            this.items.add(a, b)
        },
        get: function(a) {
            return this.items.get(a)
        },
        waitMixin: function(a, b) {
            var c = this;
            c.waitMixins[a] = c.waitMixins[a] || {
                waiters: []
            },
            c.waitMixins[a].waiters.push(b)
        },
        getMixin: function(a) {
            var b = a.split(".")
              , c = 1
              , d = b.length
              , e = Fancy.global[b[0]];
            if (void 0 === e)
                return !1;
            for (; d > c; c++)
                if (e = e[b[c]],
                void 0 === e)
                    return !1;
            return e
        }
    },
    Fancy.ClassManager = new d,
    Fancy.define = function(d, e) {
        var e = e || {}
          , f = [];
        if (Fancy.isArray(d) && (f = d,
        d = f[0]),
        e.constructor === Object && (void 0 === e.extend ? e.constructor = function() {}
        : e.constructor = function() {
            this.Super("constructor", arguments)
        }
        ),
        void 0 === e.extend)
            a[d] = e.constructor;
        else {
            a[d] = e.constructor;
            var g;
            switch (typeof e.extend) {
            case "string":
                g = Fancy.ClassManager.get(e.extend),
                a[d].prototype.$Super = Fancy.ClassManager.get(e.extend);
                break;
            case "function":
                g = e.extend,
                a[d].prototype.$Super = e.extend
            }
            delete e.extend,
            a[d].prototype.Super = function(a, b) {
                var c = this;
                switch (c.$Iam ? c.$Iam = Fancy.ClassManager.get(c.$Iam.prototype.$Super.prototype.$name) : c.$Iam = Fancy.ClassManager.get(c.$Super.prototype.$name),
                a) {
                case "const":
                case "constructor":
                    c.$Iam.apply(c, b);
                    break;
                default:
                    c.$Iam.prototype[a].apply(c, b)
                }
                delete c.$Iam
            }
            ,
            c(a[d], g)
        }
        a[d].prototype.$name = d,
        e.mixins && (Fancy.mixin(a[d].prototype, e.mixins),
        delete a[d].prototype.mixins),
        void 0 !== e.plugins && (void 0 === a[d].prototype.$plugins && (a[d].prototype.$plugins = []),
        a[d].prototype.$plugins = a[d].prototype.$plugins.concat(e.plugins),
        delete a[d].prototype.plugins);
        for (var h in e)
            a[d].prototype[h] = e[h];
        var i = a[d];
        e.singleton === !0 && (delete a[d],
        i = new i(e),
        a[d] = i),
        f.length > 1 ? Fancy.each(f, function(a) {
            Fancy.ClassManager.add(a, i)
        }) : Fancy.ClassManager.add(d, i),
        e.type ? (b[e.type] = i,
        Fancy.addWidgetType(e.type, i)) : e.ptype && (b[e.type] = i,
        Fancy.addPluginByType(e.ptype, i))
    }
    ,
    Fancy.getClassByType = function(a) {
        return b[a]
    }
}(),
Fancy.MixinClass = function() {}
,
Fancy.MixinClass.prototype = {
    initId: function() {
        var a = this
          , b = a.prefix || Fancy.prefix;
        a.id = a.id || Fancy.id(null, b),
        Fancy.addWidget(a.id, a)
    },
    initPlugins: function() {
        var a, b, c, d = this, e = d;
        if (d.plugins = d.plugins || [],
        d._plugins && (d.plugins = d.plugins.concat(d._plugins)),
        void 0 !== d.plugins && (d.$plugins = d.plugins,
        delete d.plugins),
        void 0 !== d.$plugins)
            for (var f, g = 0, h = d.$plugins, i = h.length, j = {}; i > g; g++) {
                c = h[g],
                c.widget = e;
                var k = c.type || c.ptype;
                if (j[k] !== !0) {
                    if (j[k] = !0,
                    a = Fancy.getPluginByType(k),
                    void 0 === a)
                        throw new Error("[FancyGrid Error] - some of module was not loaded. Grid plugin does not exist - " + k);
                    b = new a(c),
                    f = c.inWidgetName || b.inWidgetName,
                    void 0 !== f && (e[f] = b)
                }
            }
    }
},
Fancy.define("Fancy.Data", {
    constructor: function(a) {
        var b = this;
        if (b.map = {},
        a)
            for (var c = 0, d = a.length, e = b.map; d > c; c++)
                e[c] = a[c];
        b.length = 0
    },
    add: function(a, b) {
        var c = this;
        c.map[a] = b,
        c.length++
    },
    get: function(a) {
        return this.map[a]
    }
}),
Fancy.define("Fancy.Model", {
    constructor: function(a) {
        var b = this
          , c = {}
          , d = b.fields || []
          , e = 0
          , f = d.length;
        if (Fancy.isArray(a)) {
            for (; f > e; e++) {
                var g = d[e];
                c[g] = a[e]
            }
            b.data = c
        } else {
            if (a.id ? b.id = a.id : (Fancy.idSeed++,
            b.id = Fancy.idSeed + 1e3),
            void 0 === b.fields) {
                d = [];
                for (var g in a)
                    d.push(g);
                b.fields = d
            }
            for (f = d.length; f > e; e++) {
                var g = d[e];
                void 0 === a[g] ? c[g] = "" : c[g] = a[g]
            }
            b.data = c
        }
    },
    get: function(a) {
        var b = this;
        return void 0 === a ? b.data : b.data[a]
    },
    set: function(a, b) {
        var c = this;
        if (void 0 === b && Fancy.isObject(a))
            for (var d in a)
                c.set(d, a[d]);
        else
            c.data[a] = b
    }
}),
Fancy.define("Fancy.PluginManager", {
    singleton: !0,
    constructor: function() {
        var a = this;
        a.ptypes = new Fancy.Data
    },
    addPlugin: function(a, b) {
        this.ptypes.add(a, b)
    },
    getPlugin: function(a) {
        return this.ptypes.get(a)
    }
}),
Fancy.addPluginByType = function(a, b) {
    Fancy.PluginManager.addPlugin(a, b)
}
,
Fancy.getPluginByType = function(a) {
    return Fancy.PluginManager.getPlugin(a)
}
,
Fancy.define("Fancy.WidgetManager", {
    singleton: !0,
    constructor: function() {
        var a = this;
        a.wtypes = new Fancy.Data,
        a.widgets = new Fancy.Data
    },
    addWidgetType: function(a, b) {
        b.prototype.wtype = a,
        this.wtypes.add(a, b)
    },
    getWidgetClassByType: function(a) {
        return this.wtypes.get(a)
    },
    addWidget: function(a, b) {
        this.widgets.add(a, b)
    },
    getWidget: function(a) {
        return this.widgets.get(a)
    }
}),
Fancy.addWidgetType = function(a, b) {
    Fancy.WidgetManager.addWidgetType(a, b)
}
,
Fancy.getWidgetClassByType = function(a) {
    return Fancy.WidgetManager.getWidgetClassByType(a)
}
,
Fancy.addWidget = function(a, b) {
    Fancy.WidgetManager.addWidget(a, b)
}
,
Fancy.getWidget = function(a) {
    return Fancy.WidgetManager.getWidget(a)
}
,
function() {
    var a = 0
      , b = {};
    Fancy.define(["Fancy.Event", "Fancy.Observable"], {
        mixins: [Fancy.MixinClass],
        constructor: function(a) {
            var b = this;
            if (Fancy.applyConfig(b, a || {}),
            b.$events = {},
            b.listeners || b.events)
                for (var c = b.listeners || b.events, d = 0, e = c.length; e > d; d++) {
                    var f = c[d]
                      , g = null
                      , h = null
                      , i = null
                      , j = [];
                    for (var k in f)
                        "scope" === k ? i = f[k] : "params" === k ? j = f[k] : (g = k,
                        h = f[k]);
                    if (null === g)
                        throw new Error("Event was not set");
                    switch (Fancy.typeOf(h)) {
                    case "string":
                        h = b[h],
                        f.handler = h,
                        void 0 === f.scope && (i = b),
                        f.scope = i;
                        break;
                    case "function":
                        break;
                    default:
                        throw new Error("Handler has wrong type or not defined")
                    }
                    if (Fancy.isArray(j) === !1)
                        throw new Error("params must be array");
                    b.addEvent(g),
                    b.on(g, h, i, j)
                }
        },
        on: function(c, d, e, f) {
            if (void 0 === this.$events[c])
                throw new Error("Event name is not set: " + c);
            if (void 0 === d)
                throw new Error("Handler is undefined. Name of event is " + c + ".");
            d.$fancyFnSeed = a,
            b[a] = d,
            a++,
            this.$events[c].push({
                fn: d,
                scope: e,
                params: f || []
            })
        },
        un: function(a, b) {
            var c = this
              , d = c.$events[a];
            if (!d)
                return !1;
            for (var e = 0, f = d.length; f > e; e++) {
                var g = d[e];
                if (g.fn.$fancyFnSeed === b.$fancyFnSeed)
                    return g.toRemove = !0,
                    !0
            }
            return !1
        },
        once: function(a, b, c) {
            var d = this
              , e = function() {
                b.apply(this, arguments),
                d.un(a, e)
            };
            d.on(a, e, c)
        },
        unAll: function() {
            this.$events = {}
        },
        unAllByType: function(a) {
            this.$events[a] = []
        },
        fire: function(a) {
            var b = this
              , c = b.$events[a];
            if (!c)
                return !1;
            for (var d = 1, e = arguments.length, f = [b]; e > d; d++)
                f.push(arguments[d]);
            for (var d = 0, e = c.length; e > d; d++) {
                var g = c[d]
                  , h = [];
                g.toRemove !== !0 ? (h = h.concat(f),
                g.params && (h = h.concat(g.params)),
                g.fn.apply(g.scope || b, h)) : (c.splice(d, 1),
                d--,
                e = c.length)
            }
        },
        addEvent: function(a) {
            return this.addEvents(a)
        },
        addEvents: function(a) {
            var b = this;
            if (arguments.length > 1) {
                for (var c = [], d = 0, e = arguments.length; e > d; d++)
                    c[d] = arguments[d];
                a = c
            }
            if ("string" === Fancy.typeOf(a))
                b.$events[a] = b.$events[a] || [];
            else if ("array" === Fancy.typeOf(a))
                for (var d = 0, e = a.length; e > d; d++)
                    b.$events[a[d]] = b.$events[a[d]] || []
        },
        has: function(a) {
            var b = this.$events[a];
            return b ? 0 !== b.length : !1
        }
    }),
    Fancy.define("Fancy.Modules", {
        extend: Fancy.Event,
        singleton: !0,
        constructor: function() {
            var a = this;
            a.Super("const", arguments),
            a.init()
        },
        init: function() {
            var a = this;
            a.addEvents("loaded")
        }
    })
}(),
Fancy.Mixin("Fancy.store.mixin.Paging", {
    initPaging: function() {
        var a = this;
        void 0 !== a.paging && (Fancy.isObject(a.paging) && Fancy.apply(a, a.paging),
        a.calcPages(),
        a.changeDataView())
    },
    firstPage: function() {
        var a = this;
        a.calcPages(),
        a.showPage = 0,
        "server" === a.pageType ? a.loadPage() : a.changeDataView()
    },
    prevPage: function() {
        var a = this;
        a.calcPages(),
        a.showPage--,
        a.showPage < 0 && (a.showPage = 0),
        "server" === a.pageType ? a.loadPage() : a.changeDataView()
    },
    nextPage: function() {
        var a = this;
        a.calcPages(),
        a.showPage++,
        a.showPage === a.pages && a.showPage--,
        a.showPage < 0 && (a.showPage = 0),
        "server" === a.pageType ? a.loadPage() : a.changeDataView()
    },
    lastPage: function() {
        var a = this;
        a.calcPages(),
        a.showPage = a.pages - 1,
        a.showPage < 0 && (a.showPage = 0),
        "server" === a.pageType ? a.loadPage() : a.changeDataView()
    },
    calcPages: function() {
        var a = this;
        if ("server" === a.pageType) {
            var b = a.pages;
            if (a.pages = Math.ceil(a.getTotal() / a.pageSize),
            !isNaN(b) && b > a.pages)
                return a.showPage--,
                a.showPage < 0 && (a.showPage = 0),
                "needs reload"
        } else
            a.pages = Math.ceil(a.getTotal() / a.pageSize);
        a.showPage >= a.pages && (a.showPage = a.pages - 1),
        a.showPage < 0 && (a.showPage = 0),
        a.fire("changepages")
    },
    setPage: function(a) {
        var b = this;
        b.showPage = a,
        b.showPage === b.pages && b.showPage--,
        b.showPage < 0 && (b.showPage = 0),
        "server" === b.pageType ? b.loadPage() : b.changeDataView()
    },
    refresh: function() {
        var a = this;
        "server" === a.pageType ? a.loadPage() : a.changeDataView()
    },
    processPagingData: function(a) {
        var b = this;
        void 0 !== a.totalCount && (b.totalCount = a.totalCount),
        b.checkPagingType(a),
        b.setData(a[b.readerRootProperty]),
        b.changeDataView({
            stoppedFilter: !0
        }),
        "needs reload" === b.calcPages() && b.loadPage()
    },
    checkPagingType: function(a) {
        var b = this;
        void 0 !== a.totalCount && a.totalCount !== a[b.readerRootProperty].length && (b.totalCount = a.totalCount,
        b.pageType = "server",
        void 0 === b.remoteSort && (b.remoteSort = !0))
    },
    loadPage: function() {
        var a = this;
        a.loadData()
    },
    setPageSize: function(a) {
        var b = this;
        b.pageSize = a,
        b.calcPages(),
        "server" === b.pageType ? b.loadPage() : b.changeDataView()
    }
}),
Fancy.Mixin("Fancy.store.mixin.Proxy", {
    pageParam: "page",
    startParam: "start",
    limitParam: "limit",
    sortParam: "sort",
    directionParam: "dir",
    keyParam: "key",
    valueParam: "value",
    filterParam: "filter",
    autoLoad: !0,
    autoSave: !0,
    saveOrder: ["create", "update", "destroy"],
    batch: !0,
    filterOperators: {
        "<": "lt",
        ">": "gt",
        "<=": "lteq",
        ">=": "gteq",
        "=": "eq",
        "==": "eq",
        "===": "stricteq",
        "!=": "noteq",
        "!==": "notstricteq",
        "": "like",
        "*": "likeor"
    },
    initProxy: function() {
        var a = this;
        a.proxy = a.data.proxy || {};
        var b = a.proxy;
        void 0 !== b.autoLoad && (a.autoLoad = b.autoLoad),
        void 0 !== b.autoSave && (a.autoSave = b.autoSave),
        void 0 !== b.batch && (a.batch = b.batch),
        a.initReader(),
        a.initWriter(),
        "rest" === a.proxy.type ? a.initRest() : (a.initServerAPI(),
        a.initActionMethods(),
        a.checkProxy()),
        a.autoLoad && a.loadData()
    },
    checkProxy: function() {
        var a = this
          , b = a.proxy;
        if (void 0 === b.api.read)
            throw new Error("[FancyGrid Error] - in data proxy there is not url")
    },
    checkUrl: function() {
        var a = this
          , b = a.proxy;
        if (void 0 === b.url)
            throw new Error("[FancyGrid Error] - in data proxy there is not url")
    },
    initServerAPI: function() {
        var a = this
          , b = a.proxy;
        b.api = b.api || {},
        b.url && (b.api.read = b.url),
        (b.api.update || b.api.read || b.api.create && b.api.destroy) && (a.proxyType = "server")
    },
    initActionMethods: function() {
        var a = this
          , b = a.proxy
          , c = b.methods || {}
          , d = b.method || "GET";
        c.create = c.create || d,
        c.read = c.read || d,
        c.update = c.update || d,
        c.destroy = c.destroy || d,
        b.methods = c
    },
    loadData: function() {
        var a, b = this, c = b.proxy, d = b.params || {}, e = c.headers || {};
        b.fire("beforeload"),
        "server" === b.pageType && (d[b.pageParam] = b.showPage,
        d[b.limitParam] = b.pageSize,
        d[b.startParam] = b.showPage * b.pageSize),
        b.loading = !0,
        Fancy.Ajax({
            url: c.api.read,
            method: c.methods.read,
            params: d,
            dataType: a,
            getJSON: !0,
            headers: e,
            success: function(a) {
                b.loading = !1,
                b.defineModel(a[b.readerRootProperty]),
                b.paging ? b.processPagingData(a) : (b.setData(a[b.readerRootProperty]),
                b.widget.setSidesHeight()),
                b.fire("change"),
                b.fire("load")
            }
        })
    },
    proxyCRUD: function(a, b, c, d) {
        var e = this;
        switch (a) {
        case "UPDATE":
            e.proxyServerUpdate(b, c, d);
            break;
        case "DESTROY":
            e.proxyServerDestroy(b, c);
            break;
        case "CREATE":
            e.proxyServerCreate(b, c)
        }
    },
    proxyServerUpdate: function(a, b, c) {
        var d = this
          , e = d.params || {}
          , f = d.proxy
          , g = "json" === d.writerType || d.autoSave === !1;
        g ? e = Fancy.isArray(a) && void 0 === b && void 0 === c ? a : d.prepareWriterJSONParams(a, b, c) : (e.id = a,
        e[d.keyParam] = b,
        e[d.valueParam] = c,
        e.action = "update"),
        d.loading = !0,
        d.fire("beforeupdate", a, b, c),
        Fancy.Ajax({
            url: f.api.update,
            method: f.methods.update,
            params: e,
            sendJSON: g,
            success: function(e) {
                d.loading = !1,
                d.fire("update", a, b, c)
            }
        })
    },
    proxyServerDestroy: function(a, b) {
        var c = this
          , d = c.params || {}
          , e = c.proxy
          , f = "json" === c.writerType || c.autoSave === !1;
        f && Fancy.isArray(a) ? d = a : b ? d = b : d.id = a,
        c.loading = !0,
        c.fire("beforedestroy"),
        Fancy.Ajax({
            url: e.api.destroy,
            method: e.methods.destroy,
            params: d,
            sendJSON: f,
            success: function(b) {
                c.loading = !1,
                c.fire("destroy", a)
            }
        })
    },
    proxyServerCreate: function(a, b) {
        var c = this
          , d = c.params || {}
          , e = c.proxy
          , f = "json" === c.writerType || c.autoSave === !1;
        f && Fancy.isArray(a) ? d = a : b ? d = b : (d.id = a,
        void 0 === d.id && delete d.id),
        c.loading = !0,
        c.fire("beforecreate"),
        Fancy.Ajax({
            url: e.api.create,
            method: e.methods.create,
            params: d,
            sendJSON: f,
            success: function(b) {
                if (c.loading = !1,
                Fancy.isObject(b.data) && String(a) !== String(b.data.id))
                    c.changeItemId(a, b.data.id);
                else if (Fancy.isArray(b.data))
                    for (var d = 0, e = a.length; e > d; d++)
                        String(a[d].id) !== String(b.data[d].id) && c.changeItemId(String(a[d].id), String(b.data[d].id));
                c.fire("create", b.data)
            }
        })
    },
    save: function() {
        for (var a = this, b = a.removed, c = a.changed, d = a.inserted, e = 0, f = a.saveOrder.length; f > e; e++)
            switch (a.saveOrder[e]) {
            case "create":
                a.saveInsertActions(d);
                break;
            case "update":
                a.saveChangeActions(c);
                break;
            case "destroy":
                a.saveRemoveActions(b)
            }
        a.changed = {
            length: 0
        },
        a.removed = {
            length: 0
        },
        a.inserted = {
            length: 0
        }
    },
    saveChangeActions: function(a) {
        var b = this;
        if (a.length)
            if (b.batch) {
                var c = [];
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , f = {
                            id: d
                        };
                        if (b.writeAllFields)
                            f = b.getById(d).data;
                        else
                            for (var g in e)
                                "length" !== g && (f[g] = e[g].value);
                        c.push(f)
                    }
                1 === c.length ? (c = c[0],
                b.proxyCRUD("UPDATE", c.id, c)) : b.proxyCRUD("UPDATE", c)
            } else
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , c = {};
                        if (b.writeAllFields)
                            c = b.getById(d).data;
                        else
                            for (var g in e)
                                "length" !== g && (c[g] = {
                                    id: e.id
                                });
                        b.proxyCRUD("UPDATE", d, c)
                    }
    },
    saveRemoveActions: function(a) {
        var b = this;
        if (0 !== a.length)
            if (b.batch) {
                var c = [];
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , f = {
                            id: d
                        };
                        if (b.writeAllFields)
                            f = b.getById(d).data;
                        else
                            for (var g in e)
                                "length" !== g && (f = {
                                    id: e.id
                                });
                        c.push(f)
                    }
                1 === c.length ? (c = c[0],
                b.proxyCRUD("DESTROY", c.id, c)) : b.proxyCRUD("DESTROY", c)
            } else
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , c = {};
                        if (b.writeAllFields)
                            c = e;
                        else
                            for (var g in e)
                                "length" !== g && (c[g] = e[g].value);
                        b.proxyCRUD("DESTROY", d, c)
                    }
    },
    saveInsertActions: function(a) {
        var b = this;
        if (0 !== a.length)
            if (b.batch) {
                var c = [];
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , f = {
                            id: d
                        };
                        if (b.writeAllFields)
                            f = b.getById(d).data;
                        else
                            for (var g in e.data)
                                f[g] = e[g];
                        c.push(f)
                    }
                1 === c.length ? (c = c[0],
                b.proxyCRUD("CREATE", c.id, c)) : b.proxyCRUD("CREATE", c)
            } else
                for (var d in a)
                    if ("length" !== d) {
                        var e = a[d]
                          , c = {};
                        if (b.writeAllFields)
                            c = e;
                        else
                            for (var g in e)
                                "length" !== g && (c[g] = e[g].value);
                        b.proxyCRUD("CREATE", d, c)
                    }
    }
}),
Fancy.Mixin("Fancy.store.mixin.Rest", {
    initRest: function() {
        var a = this;
        a.proxyType = "server",
        a.checkUrl(),
        a.initRestServerAPI(),
        a.initRestActionMethods()
    },
    initRestServerAPI: function() {
        var a = this
          , b = a.proxy
          , c = b.url;
        b.api = b.api || {},
        b.api.create = c,
        b.api.read = c,
        b.api.update = c,
        b.api.destroy = c
    },
    initRestActionMethods: function() {
        var a = this
          , b = a.proxy
          , c = b.methods || {};
        c.create = c.create || b.method || "POST",
        c.read = c.read || b.method || "GET",
        c.update = c.update || b.method || "PUT",
        c.destroy = c.destroy || b.method || "DELETE",
        b.methods = c
    }
}),
Fancy.Mixin("Fancy.store.mixin.Reader", {
    readerType: "json",
    readerRootProperty: "data",
    initReader: function() {
        var a = this
          , b = a.proxy;
        b.reader && a.configReader(b.reader)
    },
    configReader: function(a) {
        var b = this;
        switch (Fancy.typeOf(a)) {
        case "string":
            switch (a) {
            case "json":
                b.readerType = a;
                break;
            default:
                throw new Error("[FancyGrid Error] - reader " + a + " does not exist")
            }
            break;
        case "object":
            switch (a.type) {
            case void 0:
                b.readerType = "json";
                break;
            case "json":
                b.readerType = a.type;
                break;
            default:
                throw new Error("[FancyGrid Error] - reader " + a.type + " does not exist")
            }
            a.root && (b.readerRootProperty = a.root)
        }
    }
}),
Fancy.Mixin("Fancy.store.mixin.Writer", {
    writerType: "string",
    writeAllFields: !1,
    initWriter: function() {
        var a = this
          , b = a.proxy;
        b.writer && a.configWriter(b.writer)
    },
    configWriter: function(a) {
        var b = this;
        switch (a.allFields && (b.writeAllFields = a.allFields),
        Fancy.typeOf(a)) {
        case "string":
            switch (a) {
            case "json":
            case "string":
                b.writerType = a;
                break;
            default:
                throw new Error("[FancyGrid Error] - writer " + a.type + " does not exist")
            }
            break;
        case "object":
            switch (a.type) {
            case void 0:
                b.writerType = "string";
                break;
            case "json":
            case "string":
                b.writerType = a.type;
                break;
            default:
                throw new Error("[FancyGrid Error] - writer " + a + " does not exist")
            }
            a.writeFields && (b.writeFields = !0),
            a.root && (b.writerRootProperty = a.root)
        }
    },
    prepareWriterJSONParams: function(a, b, c) {
        var d = this
          , e = d.params || {}
          , f = {};
        return f.id = a,
        d.writeAllFields ? Fancy.applyIf(f, d.getById(a).data) : void 0 === c && Fancy.isObject(b) ? Fancy.applyIf(f, b) : void 0 === c && Fancy.isArray(b) ? f = b : f[b] = c,
        d.rootProperty ? (e[d.rootProperty] = f,
        e) : f
    }
}),
Fancy.Mixin("Fancy.store.mixin.Sort", {
    multiSortLimit: 3,
    sort: function(a, b, c, d) {
        var e, f, g = this;
        switch (g.multiSort && g.multiSortInited !== !0 && g.initMultiSort(),
        b) {
        case "number":
        case "checkbox":
        case "progressdonut":
        case "progressbar":
        case "grossloss":
        case "date":
        case "currency":
            e = "sortNumber",
            f = "number";
            break;
        case "string":
        case "combo":
        case "text":
        case "color":
            e = "sortString",
            f = "string";
            break;
        default:
            throw new Error("[FancyGrid error] - does not exist sort function for type " + b)
        }
        if (g.multiSort && g.addSorter(c, a.toLocaleUpperCase(), f),
        g.remoteSort)
            return void g.serverSort(a, b, c);
        if (d.type = b,
        g[e](a, c, d),
        g.multiSort)
            for (var h = 0, i = g.sorters.length - 1; i > h; h++)
                g.multiSortOrder(h);
        g.changeDataView(),
        g.fire("sort", {
            key: "key",
            action: a
        })
    },
    serverSort: function(a, b, c) {
        var d = this;
        d.params = d.params || {},
        d.multiSort ? d.params.sorters = d.sorters : (d.params[d.sortParam] = c,
        d.params[d.directionParam] = a),
        d.loadData()
    },
    sortNumber: function(a, b, c) {
        var d, e, f, g = this, h = [];
        if (g.grouping) {
            var i = g.getColumnOriginalValuesByGroup(b, g.grouping.by);
            switch (d = [],
            e = 0,
            f = i.length,
            a) {
            case "asc":
                for (; f > e; e++)
                    h = h.concat(i[e].values),
                    d = d.concat(i[e].values.sort(function(a, b) {
                        return a - b
                    }));
                break;
            case "desc":
                for (; f > e; e++)
                    h = h.concat(i[e].values),
                    d = d.concat(i[e].values.sort(function(a, b) {
                        return b - a
                    }))
            }
        } else
            switch (h = g.getColumnOriginalValues(b, c),
            a) {
            case "asc":
                d = Fancy.Array.copy(h).sort(function(a, b) {
                    return a - b
                });
                break;
            case "desc":
                d = Fancy.Array.copy(h).sort(function(a, b) {
                    return b - a
                })
            }
        g.order = g.getOrder(h, d)
    },
    sortString: function(a, b) {
        var c, d, e, f = this, g = [];
        if (f.grouping) {
            var h = f.getColumnOriginalValuesByGroup(b, f.grouping.by);
            switch (c = [],
            d = 0,
            e = h.length,
            a) {
            case "asc":
                for (; e > d; d++)
                    g = g.concat(h[d].values),
                    c = c.concat(h[d].values.sort());
                break;
            case "desc":
                for (; e > d; d++)
                    g = g.concat(h[d].values),
                    c = c.concat(h[d].values.sort().reverse())
            }
        } else
            switch (g = f.getColumnOriginalValues(b),
            a) {
            case "asc":
                c = Fancy.Array.copy(g).sort();
                break;
            case "desc":
                c = Fancy.Array.copy(g).sort(),
                c = c.reverse()
            }
        f.order = f.getOrder(g, c)
    },
    getOrder: function(a, b) {
        for (var c, d = {}, e = 0, f = a.length, g = []; f > e; e++) {
            var h = a[e];
            void 0 === d[h] && (d[h] = []),
            d[h].push(e)
        }
        for (e = 0; f > e; e++)
            h = b[e],
            c = d[h],
            g.push(c[0]),
            c.length > 1 && c.splice(0, 1);
        return g
    },
    changeOrderIndexes: function(a, b) {
        var c = this;
        if (void 0 === b && (b = "-"),
        void 0 !== c.order) {
            var d = 0
              , e = c.order.length;
            if ("-" === b)
                for (; e > d; d++)
                    c.order[d] > a && c.order[d]--;
            else
                for (; e > d; d++)
                    c.order[d] >= a && c.order[d]++
        }
    },
    initMultiSort: function() {
        var a = this;
        a.multiSortInited = !0,
        a.sorters || (a.sorters = [])
    },
    addSorter: function(a, b, c) {
        for (var d = this, e = 0, f = d.sorters.length; f > e; e++)
            if (d.sorters[e].key === a) {
                d.sorters.splice(e, 1);
                break
            }
        d.sorters.push({
            key: a,
            dir: b.toLocaleUpperCase(),
            type: c
        }),
        d.sorters.length > d.multiSortLimit && d.sorters.shift()
    },
    multiSortOrder: function(a) {
        for (var b, c, d, e = this, f = e.widget, g = f.store, h = e.sorters[a], i = e.sorters[a + 1].key, j = h.key, k = 0, l = e.getTotal(), m = [], n = [], o = []; l > k; k++)
            b = g.get(e.order[k], i, !0),
            d = g.get(e.order[k], j, !0),
            b === c ? (m[m.length - 1].push(d),
            n[n.length - 1].push(e.order[k])) : (m.push([d]),
            n.push([e.order[k]])),
            c = b;
        for (k = 0,
        l = n.length; l > k; k++)
            if (1 !== n[k].length) {
                var p;
                if ("number" === h.type)
                    switch (h.dir) {
                    case "ASC":
                        p = Fancy.Array.copy(m[k]).sort(function(a, b) {
                            return a - b
                        });
                        break;
                    case "DESC":
                        p = Fancy.Array.copy(m[k]).sort(function(a, b) {
                            return b - a
                        })
                    }
                else if ("string" === h.type)
                    switch (h.dir) {
                    case "ASC":
                        p = Fancy.Array.copy(m[k]).sort();
                        break;
                    case "DESC":
                        p = Fancy.Array.copy(m[k]).sort().reverse()
                    }
                var q, r = n[k], s = [];
                q = e.getOrder(m[k], p);
                for (var t = 0, u = q.length; u > t; t++)
                    s.push(r[q[t]]);
                o = o.concat(s)
            } else
                o.push(n[k][0]);
        e.order = o
    }
}),
Fancy.Mixin("Fancy.store.mixin.Edit", {
    idSeed: 0,
    remove: function(a) {
        var b, c, d, e = this, f = (e.getTotal(),
        a.id);
        switch (Fancy.typeOf(a)) {
        case "string":
        case "number":
            f = a;
            break;
        default:
            f = a.id || a.data.id
        }
        return "server" === e.proxyType && e.autoSave ? void e.proxyCRUD("DESTROY", f) : (a.rowIndex ? (b = e.dataViewIndexes[a.rowIndex],
        c = a.rowIndex) : (b = e.getDataIndex(f),
        c = e.getRow(f)),
        d = e.data.splice(b, 1)[0],
        e.paging && (c += e.showPage * e.pageSize),
        e.order && e.order.splice(c, 1),
        e.changeOrderIndexes && e.changeOrderIndexes(b),
        e.paging && (0 !== e.showPage && e.showPage * e.pageSize === e.getTotal() && e.showPage--,
        e.calcPages()),
        delete e.map[f],
        e.fire("remove", f, d),
        void e.changeDataView())
    },
    removeAt: function(a) {
        var b = this;
        b.remove({
            rowIndex: a,
            id: b.getId(a)
        })
    },
    add: function(a) {
        var b = this;
        b.model;
        return b.insert(b.getTotal(), a)
    },
    insert: function(a, b) {
        var c = this;
        c.model;
        return c.addIndex = a,
        void 0 === b.id && (c.idSeed++,
        "server" === c.proxyType ? b.id = "Temp-" + c.idSeed : b.id = c.getTotal() + c.idSeed),
        c.getById(b.id) && c.remove(b.id),
        "server" === c.proxyType && c.autoSave ? (c.once("create", c.onCreate, c),
        void c.proxyCRUD("CREATE", b)) : c.insertItem(b, a)
    },
    insertItem: function(a) {
        var b = this
          , c = b.model
          , d = new c(a)
          , e = b.addIndex;
        return delete b.addIndex,
        d.$index = e,
        b.data.splice(e, 0, d),
        b.order && (b.order.splice(e, 0, e),
        b.changeOrderIndexes(e, "+"),
        b.order[e]--),
        b.changeDataView(),
        b.map[a.id] = d,
        b.fire("insert", d),
        d
    },
    onCreate: function(a, b) {
        return this.insertItem(b)
    }
}),
Fancy.Mixin("Fancy.store.mixin.Grouping", {
    expand: function(a, b) {
        var c = this
          , d = c.data
          , e = 0
          , f = d.length
          , g = []
          , h = {}
          , i = {};
        for (c.expanded = c.expanded || {},
        c.expanded[b] = !0; f > e; e++) {
            var j = d[e];
            c.expanded[j.data[a]] && (g.push(j),
            h[j.id] = g.length - 1,
            i[g.length - 1] = e)
        }
        c.dataView = g,
        c.dataViewMap = h,
        c.dataViewIndexes = i
    },
    collapse: function(a, b) {
        var c = this
          , d = c.data
          , e = 0
          , f = d.length
          , g = []
          , h = {}
          , i = {};
        for (c.expanded = c.expanded || {},
        delete c.expanded[b]; f > e; e++) {
            var j = d[e];
            c.expanded[j.data[a]] && (g.push(j),
            h[j.id] = g.length - 1,
            i[g.length - 1] = e)
        }
        c.dataView = g,
        c.dataViewMap = h,
        c.dataViewIndexes = i
    },
    changeOrderByGroups: function(a, b) {
        for (var c, d = this, e = {}, f = 0, g = a.length, h = []; g > f; f++)
            e[a[f]] = [];
        for (f = 0,
        g = d.data.length; g > f; f++) {
            c = d.data[f];
            var i = c.data[b];
            e[i].push(c)
        }
        for (f = 0,
        g = a.length; g > f; f++)
            h = h.concat(e[a[f]]);
        d.grouping = {
            by: b
        },
        d.data = h
    },
    getColumnOriginalValuesByGroup: function(a, b) {
        for (var c = this, d = c.data, e = 0, f = d.length, g = [], h = [], i = d[0].data[b]; f > e; e++)
            d[e].data[b] === i ? h.push(d[e].data[a]) : (g.push({
                values: h,
                groupName: i
            }),
            h = [],
            i = d[e].data[b],
            e--);
        return f > 0 && g.push({
            values: h,
            groupName: i
        }),
        g
    }
}),
Fancy.Mixin("Fancy.store.mixin.Filter", {
    filterCheckItem: function(a) {
        var b = this
          , c = b.filters
          , d = !0
          , e = !1;
        for (var f in c) {
            var g = c[f]
              , h = a.data[f];
            "date" === g.type && (h = Number(Fancy.Date.parse(h, g.format.edit)));
            for (var i in g) {
                switch (i) {
                case "type":
                case "format":
                    continue
                }
                var j = g[i];
                switch (i) {
                case "<":
                    d = Number(h) < j;
                    break;
                case ">":
                    d = Number(h) > j;
                    break;
                case "<=":
                    d = Number(h) <= j;
                    break;
                case ">=":
                    d = Number(h) >= j;
                    break;
                case "=":
                case "==":
                    Fancy.isArray(j) ? (h = String(h),
                    d = -1 !== j.indexOf(h)) : d = h == j;
                    break;
                case "===":
                    Fancy.isArray(j) ? (h = String(h),
                    d = -1 !== j.indexOf(h)) : d = h === j;
                    break;
                case "!==":
                    d = h !== j;
                    break;
                case "!=":
                    d = h != j;
                    break;
                case "":
                    d = new RegExp(String(j).toLocaleLowerCase()).test(String(h).toLocaleLowerCase());
                    break;
                case "*":
                    d = new RegExp(String(j).toLocaleLowerCase()).test(String(h).toLocaleLowerCase()),
                    e = !0
                }
                if (e === !0) {
                    if (d === !0)
                        return !0
                } else if (d === !1)
                    return !1
            }
        }
        return e === !0 && d === !1 ? !1 : !0
    },
    filterData: function() {
        var a = this
          , b = a.data
          , c = []
          , d = 0
          , e = b.length
          , f = []
          , g = [];
        for (a.remoteFilter && a.serverFilter(); e > d; d++)
            a.order ? (f.push(a.order[d]),
            g = b[a.order[d]]) : (f.push(d),
            g = b[d]),
            a.filterCheckItem(g) && c.push(g);
        a.filterOrder = f,
        a.filteredData = c,
        a.paging && a.calcPages(),
        a.fire("filter")
    },
    serverFilter: function() {
        var a = this
          , b = "["
          , c = a.filters || {};
        for (var d in c) {
            var e = c[d];
            for (var f in e) {
                switch (f) {
                case "type":
                case "format":
                    continue
                }
                var g = a.filterOperators[f];
                b += '{"operator":"' + g + '","value":"' + e[f] + '","property":"' + d + '"},'
            }
        }
        b = b.replace(/\,$/, ""),
        b += "]",
        a.params = a.params || {},
        "[]" === b ? (b = "",
        delete a.params[a.filterParam]) : a.params[a.filterParam] = encodeURIComponent(b),
        a.loadData()
    }
}),
Fancy.Mixin("Fancy.store.mixin.Dirty", {
    initTrackDirty: function() {
        var a = this;
        a.changed = {
            length: 0
        },
        a.removed = {
            length: 0
        },
        a.inserted = {
            length: 0
        },
        a.on("remove", a.onDirtyRemove, a),
        a.on("set", a.onDirtySet, a),
        a.on("insert", a.onDirtyInsert, a)
    },
    onDirtySet: function(a, b) {
        var c = this
          , d = b.id;
        "$selected" !== b.key && (void 0 === c.changed[d] ? (c.changed[d] = {
            length: 1
        },
        c.changed.length++) : c.changed[d].length++,
        void 0 === c.changed[d][b.key] && (c.changed[d][b.key] = {
            originValue: b.oldValue
        }),
        c.changed[d][b.key].value = b.value,
        c.changed[d][b.key].value === c.changed[d][b.key].originValue && (delete c.changed[d][b.key],
        c.changed[d].length--),
        0 === c.changed[d].length && (delete c.changed[d],
        c.changed.length--))
    },
    onDirtyRemove: function(a, b, c) {
        var d = this;
        d.removed[b] = c.data,
        d.removed.length++
    },
    onDirtyInsert: function(a, b) {
        var c = this;
        c.inserted[b.id] = b,
        c.inserted.length++
    }
}),
Fancy.define("Fancy.Store", {
    extend: Fancy.Event,
    mixins: ["Fancy.store.mixin.Paging", "Fancy.store.mixin.Proxy", "Fancy.store.mixin.Rest", "Fancy.store.mixin.Reader", "Fancy.store.mixin.Writer", "Fancy.store.mixin.Sort", "Fancy.store.mixin.Edit", "Fancy.store.mixin.Grouping", "Fancy.store.mixin.Filter", "Fancy.store.mixin.Search", "Fancy.store.mixin.Dirty"],
    pageSize: 10,
    showPage: 0,
    pages: 0,
    dirty: !1,
    constructor: function() {
        var a = this;
        a.Super("const", arguments),
        a.init(),
        a.data = a.data || [],
        a.dataView = a.dataView || [],
        a.dataViewMap = a.dataViewMap || {},
        a.map = {},
        a.setModel(),
        a.data && (a.data.proxy ? a.initProxy() : a.setData(a.data))
    },
    init: function() {
        var a = this;
        a.addEvents("add", "change", "changepages", "set", "beforeupdate", "update", "beforeremove", "remove", "beforedestroy", "destroy", "beforecreate", "create", "sort", "beforeload", "load", "filter", "insert"),
        a.initId(),
        a.initPlugins(),
        a.paging && a.initPaging(),
        a.initTrackDirty && a.initTrackDirty()
    },
    setModel: function() {
        var a = this
          , b = a.model;
        if (b = void 0 === b ? Fancy.Model : Fancy.ClassManager.get(a.model),
        a.model = b,
        a.fields = b.prototype.fields,
        void 0 === a.fields)
            throw new Error("needed to set fields in Model of Store")
    },
    setData: function(a) {
        var b, c = this, d = 0, e = a.length, f = c.model;
        if (c.data = [],
        c.dataView = [],
        c.dataViewMap = {},
        c.dataViewIndexes = {},
        c.collapsed)
            for (; e > d; d++)
                b = new f(a[d]),
                b.$index = d,
                c.data[d] = b,
                c.map[b.id] = b;
        else if (c.expanded)
            for (; e > d; d++)
                b = new f(a[d]),
                b.$index = d,
                c.data[d] = b,
                c.map[b.id] = b;
        else if (c.paging)
            for (; e > d; d++)
                b = new f(a[d]),
                b.$index = d,
                c.data[d] = b,
                d < c.pageSize && (c.dataView[d] = b,
                c.dataViewMap[b.id] = d,
                c.dataViewIndexes[d] = d),
                c.map[b.id] = b;
        else
            for (; e > d; d++)
                b = new f(a[d]),
                b.$index = d,
                c.data[d] = b,
                c.dataView[d] = b,
                c.dataViewMap[b.id] = d,
                c.dataViewIndexes[d] = d,
                c.map[b.id] = b
    },
    getItem: function(a) {
        var b = this;
        return b.dataView[a]
    },
    get: function(a, b, c) {
        var d, e = this;
        return void 0 === a ? e.data : void 0 === b ? (d = e.dataView[a].data,
        void 0 === d.id && (d.id = e.dataView[a].id),
        e.dataView[a].data) : "none" === b ? "" : c ? e.data[a].data[b] : e.dataView[a].data[b]
    },
    getId: function(a) {
        return this.dataView[a].id
    },
    getRow: function(a) {
        return this.dataViewMap[a]
    },
    set: function(a, b, c) {
        var d = this
          , e = d.dataView[a]
          , f = e.data.id || e.id
          , g = d.get(a, b);
        g != c && (d.dataView[a].data[b] = c,
        "server" === d.proxyType && d.autoSave && d.proxyCRUD("UPDATE", f, b, c),
        d.fire("set", {
            id: f,
            data: d.dataView[a].data,
            rowIndex: a,
            key: b,
            value: c,
            oldValue: g,
            item: e
        }))
    },
    setItemData: function(a, b) {
        var c = this
          , d = c.get(a);
        for (var e in b)
            d[e] != b[e] && c.set(a, e, b[e])
    },
    getLength: function() {
        return this.dataView.length
    },
    getTotal: function() {
        var a = this;
        return "server" === a.pageType ? a.totalCount : a.filteredData ? a.filteredData.length : a.data.length
    },
    defineModel: function(a) {
        var b = this
          , c = b.store;
        if (!b.model || !b.fields || 0 === b.fields.length) {
            var a = a || b.data || c.data
              , d = b.getFieldsFromData(a)
              , e = "Fancy.model." + Fancy.id();
            Fancy.define(e, {
                extend: Fancy.Model,
                fields: d
            }),
            b.model = e,
            b.fields = d,
            b.setModel()
        }
    },
    getFieldsFromData: function(a) {
        var b = a.items || a;
        if (a.fields)
            return a.fields;
        if (!b)
            throw new Error("not set fields of data");
        var c = b[0]
          , d = [];
        for (var e in c)
            d.push(e);
        return d
    },
    getColumnOriginalValues: function(a, b) {
        var c = this
          , d = c.data
          , e = 0
          , f = d.length
          , g = []
          , b = b || {};
        if (b.smartIndexFn)
            for (; f > e; e++)
                g.push(b.smartIndexFn(d[e].data));
        else if (b.format)
            if ("date" === b.type)
                for (; f > e; e++)
                    g.push(Fancy.Date.parse(d[e].data[a], b.format));
            else
                for (; f > e; e++)
                    g.push(d[e].data[a]);
        else
            for (; f > e; e++)
                g.push(d[e].data[a]);
        return g
    },
    changeDataView: function(a) {
        var b, c = this, a = a || {}, d = [], e = {}, f = 0, g = c.data.length, h = !!c.filters, i = !!c.searches, j = c.data;
        if (h) {
            if (a.stoppedFilter) {
                if (c.paging && "server" === c.pageType)
                    return
            } else
                c.filterData();
            c.remoteFilter || (j = c.filteredData,
            g = j.length)
        }
        i && (c.searchData(),
        j = c.searchedData,
        g = j.length),
        c.dataViewIndexes = {},
        c.dataViewMap = {},
        c.paging && (f = "server" === c.pageType ? 0 : c.showPage * c.pageSize,
        g = f + c.pageSize);
        var k = c.getTotal();
        g > c.data.length && (g = c.data.length),
        h && g > k && (g = k),
        Fancy.isObject(c.data) && (g = 0);
        var l;
        if (c.order)
            if (c.grouping)
                for (b = c.grouping.by; g > f; f++)
                    c.expanded[c.data[c.order[f]].data[b]] && (h === !0 ? (c.dataViewIndexes[d.length] = c.filterOrder[f],
                    l = j[f]) : (c.dataViewIndexes[d.length] = c.order[f],
                    l = j[c.order[f]]),
                    d.push(l),
                    e[l.id] = d.length - 1);
            else
                for (; g > f; f++)
                    h === !0 ? (c.dataViewIndexes[d.length] = c.filterOrder[f],
                    l = j[f]) : (c.dataViewIndexes[d.length] = c.order[f],
                    l = j[c.order[f]]),
                    d.push(l),
                    e[l.id] = d.length - 1;
        else if (c.grouping)
            for (b = c.grouping.by; g > f; f++)
                c.expanded[c.data[f].data[b]] && (c.dataViewIndexes[d.length] = f,
                l = j[f],
                d.push(l),
                e[l.id] = d.length - 1);
        else
            for (; g > f; f++)
                c.dataViewIndexes[d.length] = f,
                l = j[f],
                d.push(j[f]),
                e[l.id] = d.length - 1;
        c.dataView = d,
        c.dataViewMap = e,
        c.fire("change")
    },
    getColumnData: function(a, b) {
        var c = this
          , d = 0
          , e = c.data.length
          , f = [];
        if (b)
            for (; e > d; d++)
                f.push(b(c.data[d].data));
        else
            for (; e > d; d++)
                f.push(c.data[d].data[a]);
        return f
    },
    getData: function() {
        for (var a = this, b = 0, c = a.data.length, d = []; c > b; b++)
            d.push(a.data[b].data);
        return d
    },
    getDataView: function() {
        for (var a = this, b = 0, c = a.dataView.length, d = []; c > b; b++)
            d.push(a.dataView[b].data);
        return d
    },
    getById: function(a) {
        var b = this;
        return b.map[a]
    },
    changeItemId: function(a, b) {
        var c = this
          , d = c.getById(a);
        return d ? (d.id = b,
        void 0 !== d.data.id && (d.data.id = b),
        delete c.map[a],
        c.map[b] = d,
        void c.fire("changeitemid", a, b)) : !1
    },
    find: function(a, b) {
        for (var c, d = this, e = d.dataView, f = 0, g = e.length, h = []; g > f; f++)
            c = e[f],
            c.data[a] === b && h.push(f);
        return h
    },
    findItem: function(a, b) {
        for (var c, d = this, e = d.data, f = 0, g = e.length, h = []; g > f; f++)
            c = e[f],
            c.data[a] === b && h.push(c);
        return h
    },
    getDataIndex: function(a) {
        for (var b, c, d = this, e = d.data, f = 0, g = e.length; g > f; f++)
            b = e[f],
            b.data.id === a && (c = f);
        return c
    },
    each: function(a, b) {
        var c = this
          , d = c.dataView
          , e = 0
          , f = d.length;
        if (b)
            for (; f > e; e++)
                a.apply(this, [d[e]]);
        else
            for (; f > e; e++)
                a(d[e])
    }
}),
Fancy.$ = window.$ || window.jQuery,
void 0 === Fancy.$ ? Fancy.nojQuery = !0 : Fancy.nojQuery = !1,
Fancy.get = function(a) {
    var b = Fancy.typeOf(a);
    switch (b) {
    case "string":
        return new Fancy.Element(Fancy.$("#" + a)[0]);
    case "array":
        return new Fancy.Elements(a);
    default:
        return new Fancy.Element(a)
    }
}
,
Fancy.Element = function(a) {
    var b = this;
    b.dom = a,
    b.$dom = Fancy.$(a),
    b.length = 1
}
,
Fancy.Element.prototype = {
    closest: function(a) {
        return Fancy.get(this.$dom.closest(a)[0])
    },
    destroy: function() {
        this.$dom.remove()
    },
    remove: function() {
        this.$dom.remove()
    },
    prev: function() {
        return this.$dom.prev()
    },
    firstChild: function() {
        return Fancy.get(this.$dom.children()[0])
    },
    on: function(a, b, c, d) {
        var e = this;
        switch (c && (b = Fancy.$.proxy(b, c)),
        d ? e.$dom.on(a, d, b) : e.$dom.on(a, b),
        a) {
        case "mouseenter":
            e.onTouchEnterEvent && e.onTouchEnterEvent(a, b, c, d);
            break;
        case "mouseleave":
            e.onTouchLeaveEvent && e.onTouchLeaveEvent(a, b, c, d);
            break;
        case "mousemove":
            e.onTouchMove && e.onTouchMove("touchmove", b)
        }
    },
    once: function(a, b, c, d) {
        var e = this;
        c && (b = Fancy.$.proxy(b, c)),
        d ? e.$dom.one(a, d, b) : e.$dom.one(a, b)
    },
    prop: function(a) {
        return this.$dom.prop(a)
    },
    un: function(a, b, c, d) {
        var e = this;
        c && (b = Fancy.$.proxy(b, c)),
        d ? e.$dom.off(a, d, b) : e.$dom.off(a, b)
    },
    show: function() {
        this.$dom.show()
    },
    hide: function() {
        this.$dom.hide()
    },
    replaceClass: function(a, b) {
        var c = this;
        c.$dom.removeClass(a),
        c.$dom.addClass(b)
    },
    getByTag: function(a) {
        var b = this;
        return Fancy.get(b.$dom.find(a)[0])
    },
    getByClass: function(a) {
        var b = this;
        return b.$dom.find("." + a)[0]
    },
    addClass: function(a) {
        var b = this;
        b.$dom.addClass(a)
    },
    removeClass: function(a) {
        var b = this;
        b.$dom.removeClass(a)
    },
    hasClass: function(a) {
        var b = this;
        return b.$dom.hasClass(a)
    },
    toggleClass: function(a) {
        var b = this;
        b.$dom.toggleClass(a)
    },
    select: function(a) {
        var b = this
          , c = b.$dom.find(a);
        return 1 === c.length ? Fancy.get(c[0]) : c.length > 1 ? Fancy.get(c) : 0 === c.length ? {
            length: 0,
            dom: void 0,
            addClass: function() {},
            removeClass: function() {},
            destroy: function() {},
            css: function() {}
        } : c
    },
    css: function(a, b) {
        return void 0 === b ? this.$dom.css(a) : this.$dom.css(a, b)
    },
    attr: function(a, b) {
        return void 0 === b ? this.$dom.attr(a) : this.$dom.attr(a, b)
    },
    append: function(a) {
        return Fancy.get(this.$dom.append(a)[0])
    },
    before: function(a) {
        return this.$dom.before(a)[0]
    },
    height: function(a) {
        return a ? (this.$dom.height(a),
        this) : this.$dom.height()
    },
    width: function(a) {
        return a ? (this.$dom.width(a),
        this) : this.$dom.width()
    },
    parent: function(a) {
        return Fancy.get(this.$dom.parent(a)[0])
    },
    update: function(a) {
        this.dom.innerHTML = a
    },
    hover: function(a, b) {
        a && this.$dom.on("mouseenter", a),
        a && this.$dom.on("mouseleave", b)
    },
    position: function() {
        return this.$dom.position()
    },
    offset: function() {
        return this.$dom.offset()
    },
    focus: function() {
        this.$dom.focus()
    },
    blur: function() {
        this.$dom.blur()
    },
    within: function(a) {
        var b, c = this, d = !0, e = !1;
        return a = Fancy.get(a),
        b = a.attr("id"),
        (void 0 === b || "" === b) && (b = Fancy.id(),
        e = !0),
        a.attr("id", b),
        0 === c.select("#" + b).length && (d = !1),
        c.dom.id === a.dom.id && (d = !0),
        e && c.removeAttr(b),
        d
    },
    removeAttr: function(a) {
        this.$dom.removeAttr(a)
    },
    item: function() {
        return this
    },
    animate: function(a, b, c, d) {
        this.$dom.animate(a, b, c, d)
    },
    index: function() {
        return this.$dom.index()
    },
    onTouchEnterEvent: function(a, b, c, d) {
        var e = this
          , f = Fancy.get(document.body)
          , g = function(a, f) {
            var g = Fancy.id()
              , h = "fancy-tempt-attr";
            e.attr(h, g);
            for (var i = a.originalEvent.targetTouches[0], j = [i.pageX, i.pageY], k = Fancy.get(document.elementFromPoint(j[0] - document.body.scrollLeft, j[1] - document.body.scrollTop)), l = !1, m = 10, n = k; m > 0 && n.dom; ) {
                if (n.attr(h) === g) {
                    l = !0;
                    break
                }
                n = n.parent(),
                m--
            }
            if (!l || e.touchIn || d || (a.pageX = i.pageX,
            a.pageY = i.pageY,
            b(a, f),
            e.touchIn = !0),
            l && d) {
                m = 10,
                n = k;
                for (var o = !1, p = k, q = [], r = 0; m > 0 && n.dom; ) {
                    var s = n.select(d);
                    if (0 !== s.length) {
                        o = !0;
                        var t = e.getDelegateTarget(d, s, q, r);
                        t && (a.currentTarget = t,
                        a.delegateTarget = t,
                        a.pageX = i.pageX,
                        a.pageY = i.pageY,
                        e.touchIn = !0,
                        e.touchInDelegate = e.touchInDelegate || {},
                        void 0 === e.touchInDelegate[d] ? e.touchInDelegate[d] = t : e.touchInDelegate[d] !== t && (e.touchInDelegate[d] = [e.touchInDelegate[d], t]),
                        b.apply(c, [a, t]));
                        break
                    }
                    if (n.attr(h) === g)
                        break;
                    q.push(n.dom),
                    p = n,
                    n = n.parent(),
                    m--,
                    r++
                }
            }
            e.removeAttr(h)
        };
        f.on("touchmove", g)
    },
    onTouchLeaveEvent: function(a, b, c, d) {
        var e = this
          , f = Fancy.get(document.body)
          , g = []
          , h = function(a, c) {
            var f = Fancy.id()
              , h = "fancy-tempt-attr";
            if (e.attr(h, f),
            e.touchIn !== !0)
                return void e.removeAttr(h);
            var i = a.originalEvent.targetTouches[0]
              , j = [i.pageX, i.pageY]
              , k = Fancy.get(document.elementFromPoint(j[0] - document.body.scrollLeft, j[1] - document.body.scrollTop));
            if (!d) {
                for (var l = !1, m = 10, n = k; m > 0 && n.dom; ) {
                    if (n.attr(h) === f) {
                        l = !0;
                        break
                    }
                    n = n.parent(),
                    m--
                }
                if (l === !1)
                    return a.pageX = i.pageX,
                    a.pageY = i.pageY,
                    e.touchIn = !1,
                    b(a, c),
                    void e.removeAttr(h)
            }
            if (g.length > 30 && (g = g.slice(g.length - 5, g.length - 1)),
            g.push(k.dom),
            d && e.touchInDelegate[d]) {
                var o, p = Fancy.id();
                o = Fancy.isArray(e.touchInDelegate[d]) ? Fancy.get(e.touchInDelegate[d][0]) : Fancy.get(e.touchInDelegate[d]),
                o.attr(h, p),
                m = 10;
                var q = !1;
                for (n = k; m > 0 && n.dom; ) {
                    if (n.attr(h) === p) {
                        q = !0;
                        break
                    }
                    n = n.parent(),
                    m--
                }
                o.removeAttr(h),
                q || (delete e.touchInDelegate[d],
                e.touchIn = !1,
                a.currentTarget = o.dom,
                a.delegateTarget = o.dom,
                a.pageX = i.pageX,
                a.pageY = i.pageY,
                b(a, o.dom))
            }
            e.removeAttr(h)
        };
        f.on("touchmove", h)
    },
    getDelegateTarget: function(a, b, c, d) {
        for (var e = c[d - a.match(/\./g).length], f = 0, g = b.length; g > f; f++)
            if (b.item(f).dom === e)
                return e;
        return !1
    },
    onTouchMove: function(a, b, c) {
        var d = this
          , e = Fancy.get(document.body)
          , f = function(a, c) {
            var e = Fancy.id()
              , f = "fancy-tempt-attr";
            d.attr(f, e);
            for (var g = a.originalEvent.targetTouches[0], h = [g.pageX, g.pageY], i = !1, j = 10, k = Fancy.get(document.elementFromPoint(h[0] - document.body.scrollLeft, h[1] - document.body.scrollTop)), l = k; j > 0 && l.dom; ) {
                if (l.attr(f) === e) {
                    i = !0;
                    break
                }
                l = l.parent(),
                j--
            }
            d.removeAttr(f),
            i && (a.pageX = g.pageX,
            a.pageY = g.pageY,
            b(a, c))
        };
        e.on("touchmove", f)
    }
},
Fancy.Elements = function(a) {
    var b = this;
    b.dom = a,
    b.$dom = a,
    b.length = a.length
}
,
Fancy.Elements.prototype = {
    addClass: function(a) {
        for (var b = this, c = 0, d = b.length; d > c; c++)
            Fancy.get(b.$dom[c]).addClass(a)
    },
    removeClass: function(a) {
        for (var b = this, c = 0, d = b.length; d > c; c++)
            Fancy.get(b.$dom[c]).removeClass(a)
    },
    hover: function(a) {
        this.$dom.on("mouseenter", a)
    },
    on: Fancy.Element.prototype.on,
    once: Fancy.Element.prototype.once,
    item: function(a) {
        return Fancy.get(this.$dom[a])
    },
    css: function(a, b) {
        for (var c = this, d = 0, e = c.length; e > d; d++)
            Fancy.get(c.$dom[d]).css(a, b)
    },
    toggleClass: function(a) {
        for (var b = this, c = 0, d = b.length; d > c; c++)
            Fancy.get(b.$dom[c]).toggleClass(a)
    },
    destroy: function() {
        for (var a = this, b = 0, c = a.length; c > b; b++)
            Fancy.get(a.$dom[b]).destroy()
    },
    hide: function() {
        for (var a = this, b = 0, c = a.length; c > b; b++)
            Fancy.get(a.$dom[b]).hide()
    },
    show: function() {
        for (var a = this, b = 0, c = a.length; c > b; b++)
            Fancy.get(a.$dom[b]).show()
    },
    index: function() {
        return this.$dom[0].index()
    }
},
Fancy.select = function(a) {
    return Fancy.get(document.body).select(a)
}
,
Fancy.onReady = function(a) {
    $(document).ready(a)
}
,
Fancy.Ajax = function(a) {
    var b = {};
    a.url && (b.url = a.url),
    a.success && (b.success = a.success),
    a.error && (b.error = a.error),
    a.method && (b.type = a.method),
    a.params && (b.data = a.params),
    a.sendJSON && (b.dataType = "json",
    b.contentType = "application/json; charset=utf-8",
    b.data = JSON.stringify(b.data)),
    a.getJSON && (b.dataType = "json",
    b.contentType = "application/json; charset=utf-8"),
    a.headers && (b.headers = a.headers),
    Fancy.$.ajax(b)
}
,
Fancy.nojQuery && (Fancy.$ = function() {
    function a(a) {
        return null == a ? String(a) : W[X.call(a)] || "object"
    }
    function b(b) {
        return "function" == a(b)
    }
    function c(a) {
        return null != a && a == a.window
    }
    function d(a) {
        return null != a && a.nodeType == a.DOCUMENT_NODE
    }
    function e(b) {
        return "object" == a(b)
    }
    function f(a) {
        return e(a) && !c(a) && Object.getPrototypeOf(a) == Object.prototype
    }
    function g(a) {
        return "number" == typeof a.length
    }
    function h(a) {
        return E.call(a, function(a) {
            return null != a
        })
    }
    function i(a) {
        return a.length > 0 ? y.fn.concat.apply([], a) : a
    }
    function j(a) {
        return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }
    function k(a) {
        return a in I ? I[a] : I[a] = new RegExp("(^|\\s)" + a + "(\\s|$)")
    }
    function l(a, b) {
        return "number" != typeof b || J[j(a)] ? b : b + "px"
    }
    function m(a) {
        var b, c;
        return H[a] || (b = G.createElement(a),
        G.body.appendChild(b),
        c = getComputedStyle(b, "").getPropertyValue("display"),
        b.parentNode.removeChild(b),
        "none" == c && (c = "block"),
        H[a] = c),
        H[a]
    }
    function n(a) {
        return "children"in a ? F.call(a.children) : y.map(a.childNodes, function(a) {
            return 1 == a.nodeType ? a : void 0
        })
    }
    function o(a, b) {
        var c, d = a ? a.length : 0;
        for (c = 0; d > c; c++)
            this[c] = a[c];
        this.length = d,
        this.selector = b || ""
    }
    function p(a, b, c) {
        for (x in b)
            c && (f(b[x]) || _(b[x])) ? (f(b[x]) && !f(a[x]) && (a[x] = {}),
            _(b[x]) && !_(a[x]) && (a[x] = []),
            p(a[x], b[x], c)) : b[x] !== w && (a[x] = b[x])
    }
    function q(a, b) {
        return null == b ? y(a) : y(a).filter(b)
    }
    function r(a, c, d, e) {
        return b(c) ? c.call(a, d, e) : c
    }
    function s(a, b, c) {
        null == c ? a.removeAttribute(b) : a.setAttribute(b, c)
    }
    function t(a, b) {
        var c = a.className || ""
          , d = c && c.baseVal !== w;
        return b === w ? d ? c.baseVal : c : void (d ? c.baseVal = b : a.className = b)
    }
    function u(a) {
        try {
            return a ? "true" == a || ("false" == a ? !1 : "null" == a ? null : +a + "" == a ? +a : /^[\[\{]/.test(a) ? y.parseJSON(a) : a) : a
        } catch (b) {
            return a
        }
    }
    function v(a, b) {
        b(a);
        for (var c = 0, d = a.childNodes.length; d > c; c++)
            v(a.childNodes[c], b)
    }
    var w, x, y, z, A, B, C = [], D = C.concat, E = C.filter, F = C.slice, G = window.document, H = {}, I = {}, J = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    }, K = /^\s*<(\w+|!)[^>]*>/, L = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, M = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, N = /^(?:body|html)$/i, O = /([A-Z])/g, P = ["val", "css", "html", "text", "data", "width", "height", "offset"], Q = ["after", "prepend", "before", "append"], R = G.createElement("table"), S = G.createElement("tr"), T = {
        tr: G.createElement("tbody"),
        tbody: R,
        thead: R,
        tfoot: R,
        td: S,
        th: S,
        "*": G.createElement("div")
    }, U = /complete|loaded|interactive/, V = /^[\w-]*$/, W = {}, X = W.toString, Y = {}, Z = G.createElement("div"), $ = {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    }, _ = Array.isArray || function(a) {
        return a instanceof Array
    }
    ;
    return Y.matches = function(a, b) {
        if (!b || !a || 1 !== a.nodeType)
            return !1;
        var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector;
        if (c)
            return c.call(a, b);
        var d, e = a.parentNode, f = !e;
        return f && (e = Z).appendChild(a),
        d = ~Y.qsa(e, b).indexOf(a),
        f && Z.removeChild(a),
        d
    }
    ,
    A = function(a) {
        return a.replace(/-+(.)?/g, function(a, b) {
            return b ? b.toUpperCase() : ""
        })
    }
    ,
    B = function(a) {
        return E.call(a, function(b, c) {
            return a.indexOf(b) == c
        })
    }
    ,
    Y.fragment = function(a, b, c) {
        var d, e, g;
        return L.test(a) && (d = y(G.createElement(RegExp.$1))),
        d || (a.replace && (a = a.replace(M, "<$1></$2>")),
        b === w && (b = K.test(a) && RegExp.$1),
        b in T || (b = "*"),
        g = T[b],
        g.innerHTML = "" + a,
        d = y.each(F.call(g.childNodes), function() {
            g.removeChild(this)
        })),
        f(c) && (e = y(d),
        y.each(c, function(a, b) {
            P.indexOf(a) > -1 ? e[a](b) : e.attr(a, b)
        })),
        d
    }
    ,
    Y.Z = function(a, b) {
        return new o(a,b)
    }
    ,
    Y.isZ = function(a) {
        return a instanceof Y.Z
    }
    ,
    Y.init = function(a, c) {
        var d;
        if (!a)
            return Y.Z();
        if ("string" == typeof a)
            if (a = a.trim(),
            "<" == a[0] && K.test(a))
                d = Y.fragment(a, RegExp.$1, c),
                a = null;
            else {
                if (c !== w)
                    return y(c).find(a);
                d = Y.qsa(G, a)
            }
        else {
            if (b(a))
                return y(G).ready(a);
            if (Y.isZ(a))
                return a;
            if (_(a))
                d = h(a);
            else if (e(a))
                d = [a],
                a = null;
            else if (K.test(a))
                d = Y.fragment(a.trim(), RegExp.$1, c),
                a = null;
            else {
                if (c !== w)
                    return y(c).find(a);
                d = Y.qsa(G, a)
            }
        }
        return Y.Z(d, a)
    }
    ,
    y = function(a, b) {
        return Y.init(a, b)
    }
    ,
    y.extend = function(a) {
        var b, c = F.call(arguments, 1);
        return "boolean" == typeof a && (b = a,
        a = c.shift()),
        c.forEach(function(c) {
            p(a, c, b)
        }),
        a
    }
    ,
    Y.qsa = function(a, b) {
        var c, d = "#" == b[0], e = !d && "." == b[0], f = d || e ? b.slice(1) : b, g = V.test(f);
        return a.getElementById && g && d ? (c = a.getElementById(f)) ? [c] : [] : 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType ? [] : F.call(g && !d && a.getElementsByClassName ? e ? a.getElementsByClassName(f) : a.getElementsByTagName(b) : a.querySelectorAll(b))
    }
    ,
    y.contains = G.documentElement.contains ? function(a, b) {
        return a !== b && a.contains(b)
    }
    : function(a, b) {
        for (; b && (b = b.parentNode); )
            if (b === a)
                return !0;
        return !1
    }
    ,
    y.type = a,
    y.isFunction = b,
    y.isWindow = c,
    y.isArray = _,
    y.isPlainObject = f,
    y.isEmptyObject = function(a) {
        var b;
        for (b in a)
            return !1;
        return !0
    }
    ,
    y.inArray = function(a, b, c) {
        return C.indexOf.call(b, a, c)
    }
    ,
    y.camelCase = A,
    y.trim = function(a) {
        return null == a ? "" : String.prototype.trim.call(a)
    }
    ,
    y.uuid = 0,
    y.support = {},
    y.expr = {},
    y.noop = function() {}
    ,
    y.map = function(a, b) {
        var c, d, e, f = [];
        if (g(a))
            for (d = 0; d < a.length; d++)
                c = b(a[d], d),
                null != c && f.push(c);
        else
            for (e in a)
                c = b(a[e], e),
                null != c && f.push(c);
        return i(f)
    }
    ,
    y.each = function(a, b) {
        var c, d;
        if (g(a)) {
            for (c = 0; c < a.length; c++)
                if (b.call(a[c], c, a[c]) === !1)
                    return a
        } else
            for (d in a)
                if (b.call(a[d], d, a[d]) === !1)
                    return a;
        return a
    }
    ,
    y.grep = function(a, b) {
        return E.call(a, b)
    }
    ,
    window.JSON && (y.parseJSON = JSON.parse),
    y.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
        W["[object " + b + "]"] = b.toLowerCase()
    }),
    y.fn = {
        constructor: Y.Z,
        length: 0,
        forEach: C.forEach,
        reduce: C.reduce,
        push: C.push,
        sort: C.sort,
        splice: C.splice,
        indexOf: C.indexOf,
        concat: function() {
            var a, b, c = [];
            for (a = 0; a < arguments.length; a++)
                b = arguments[a],
                c[a] = Y.isZ(b) ? b.toArray() : b;
            return D.apply(Y.isZ(this) ? this.toArray() : this, c)
        },
        map: function(a) {
            return y(y.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return y(F.apply(this, arguments))
        },
        ready: function(a) {
            return U.test(G.readyState) && G.body ? a(y) : G.addEventListener("DOMContentLoaded", function() {
                a(y)
            }, !1),
            this
        },
        get: function(a) {
            return a === w ? F.call(this) : this[a >= 0 ? a : a + this.length]
        },
        toArray: function() {
            return this.get()
        },
        size: function() {
            return this.length
        },
        remove: function() {
            return this.each(function() {
                null != this.parentNode && this.parentNode.removeChild(this)
            })
        },
        each: function(a) {
            return C.every.call(this, function(b, c) {
                return a.call(b, c, b) !== !1
            }),
            this
        },
        filter: function(a) {
            return b(a) ? this.not(this.not(a)) : y(E.call(this, function(b) {
                return Y.matches(b, a)
            }))
        },
        add: function(a, b) {
            return y(B(this.concat(y(a, b))))
        },
        is: function(a) {
            return this.length > 0 && Y.matches(this[0], a)
        },
        not: function(a) {
            var c = [];
            if (b(a) && a.call !== w)
                this.each(function(b) {
                    a.call(this, b) || c.push(this)
                });
            else {
                var d = "string" == typeof a ? this.filter(a) : g(a) && b(a.item) ? F.call(a) : y(a);
                this.forEach(function(a) {
                    d.indexOf(a) < 0 && c.push(a)
                })
            }
            return y(c)
        },
        has: function(a) {
            return this.filter(function() {
                return e(a) ? y.contains(this, a) : y(this).find(a).size()
            })
        },
        eq: function(a) {
            return -1 === a ? this.slice(a) : this.slice(a, +a + 1)
        },
        first: function() {
            var a = this[0];
            return a && !e(a) ? a : y(a)
        },
        last: function() {
            var a = this[this.length - 1];
            return a && !e(a) ? a : y(a)
        },
        find: function(a) {
            var b, c = this;
            return b = a ? "object" == typeof a ? y(a).filter(function() {
                var a = this;
                return C.some.call(c, function(b) {
                    return y.contains(b, a)
                })
            }) : 1 == this.length ? y(Y.qsa(this[0], a)) : this.map(function() {
                return Y.qsa(this, a)
            }) : y()
        },
        closest: function(a, b) {
            var c = this[0]
              , e = !1;
            for ("object" == typeof a && (e = y(a)); c && !(e ? e.indexOf(c) >= 0 : Y.matches(c, a)); )
                c = c !== b && !d(c) && c.parentNode;
            return y(c)
        },
        parents: function(a) {
            for (var b = [], c = this; c.length > 0; )
                c = y.map(c, function(a) {
                    return (a = a.parentNode) && !d(a) && b.indexOf(a) < 0 ? (b.push(a),
                    a) : void 0
                });
            return q(b, a)
        },
        parent: function(a) {
            return q(B(this.pluck("parentNode")), a)
        },
        children: function(a) {
            return q(this.map(function() {
                return n(this)
            }), a)
        },
        contents: function() {
            return this.map(function() {
                return this.contentDocument || F.call(this.childNodes)
            })
        },
        siblings: function(a) {
            return q(this.map(function(a, b) {
                return E.call(n(b.parentNode), function(a) {
                    return a !== b
                })
            }), a)
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = ""
            })
        },
        pluck: function(a) {
            return y.map(this, function(b) {
                return b[a]
            })
        },
        show: function() {
            return this.each(function() {
                "none" == this.style.display && (this.style.display = ""),
                "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = m(this.nodeName))
            })
        },
        replaceWith: function(a) {
            return this.before(a).remove()
        },
        wrap: function(a) {
            var c = b(a);
            if (this[0] && !c)
                var d = y(a).get(0)
                  , e = d.parentNode || this.length > 1;
            return this.each(function(b) {
                y(this).wrapAll(c ? a.call(this, b) : e ? d.cloneNode(!0) : d)
            })
        },
        wrapAll: function(a) {
            if (this[0]) {
                y(this[0]).before(a = y(a));
                for (var b; (b = a.children()).length; )
                    a = b.first();
                y(a).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            var c = b(a);
            return this.each(function(b) {
                var d = y(this)
                  , e = d.contents()
                  , f = c ? a.call(this, b) : a;
                e.length ? e.wrapAll(f) : d.append(f)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                y(this).replaceWith(y(this).children())
            }),
            this
        },
        clone: function() {
            return this.map(function() {
                return this.cloneNode(!0)
            })
        },
        hide: function() {
            return this.css("display", "none")
        },
        toggle: function(a) {
            return this.each(function() {
                var b = y(this);
                (a === w ? "none" == b.css("display") : a) ? b.show() : b.hide()
            })
        },
        prev: function(a) {
            return y(this.pluck("previousElementSibling")).filter(a || "*")
        },
        next: function(a) {
            return y(this.pluck("nextElementSibling")).filter(a || "*")
        },
        html: function(a) {
            return 0 in arguments ? this.each(function(b) {
                var c = this.innerHTML;
                y(this).empty().append(r(this, a, b, c))
            }) : 0 in this ? this[0].innerHTML : null
        },
        text: function(a) {
            return 0 in arguments ? this.each(function(b) {
                var c = r(this, a, b, this.textContent);
                this.textContent = null == c ? "" : "" + c
            }) : 0 in this ? this.pluck("textContent").join("") : null
        },
        attr: function(a, b) {
            var c;
            return "string" != typeof a || 1 in arguments ? this.each(function(c) {
                if (1 === this.nodeType)
                    if (e(a))
                        for (x in a)
                            s(this, x, a[x]);
                    else
                        s(this, a, r(this, b, c, this.getAttribute(a)))
            }) : this.length && 1 === this[0].nodeType ? !(c = this[0].getAttribute(a)) && a in this[0] ? this[0][a] : c : w
        },
        removeAttr: function(a) {
            return this.each(function() {
                1 === this.nodeType && a.split(" ").forEach(function(a) {
                    s(this, a)
                }, this)
            })
        },
        prop: function(a, b) {
            return a = $[a] || a,
            1 in arguments ? this.each(function(c) {
                this[a] = r(this, b, c, this[a])
            }) : this[0] && this[0][a]
        },
        data: function(a, b) {
            var c = "data-" + a.replace(O, "-$1").toLowerCase()
              , d = 1 in arguments ? this.attr(c, b) : this.attr(c);
            return null !== d ? u(d) : w
        },
        val: function(a) {
            return 0 in arguments ? this.each(function(b) {
                this.value = r(this, a, b, this.value)
            }) : this[0] && (this[0].multiple ? y(this[0]).find("option").filter(function() {
                return this.selected
            }).pluck("value") : this[0].value)
        },
        offset: function(a) {
            if (a)
                return this.each(function(b) {
                    var c = y(this)
                      , d = r(this, a, b, c.offset())
                      , e = c.offsetParent().offset()
                      , f = {
                        top: d.top - e.top,
                        left: d.left - e.left
                    };
                    "static" == c.css("position") && (f.position = "relative"),
                    c.css(f)
                });
            if (!this.length)
                return null;
            if (!y.contains(G.documentElement, this[0]))
                return {
                    top: 0,
                    left: 0
                };
            var b = this[0].getBoundingClientRect();
            return {
                left: b.left + window.pageXOffset,
                top: b.top + window.pageYOffset,
                width: Math.round(b.width),
                height: Math.round(b.height)
            }
        },
        css: function(b, c) {
            if (arguments.length < 2) {
                var d, e = this[0];
                if (!e)
                    return;
                if (d = getComputedStyle(e, ""),
                "string" == typeof b)
                    return e.style[A(b)] || d.getPropertyValue(b);
                if (_(b)) {
                    var f = {};
                    return y.each(b, function(a, b) {
                        f[b] = e.style[A(b)] || d.getPropertyValue(b)
                    }),
                    f
                }
            }
            var g = "";
            if ("string" == a(b))
                c || 0 === c ? g = j(b) + ":" + l(b, c) : this.each(function() {
                    this.style.removeProperty(j(b))
                });
            else
                for (x in b)
                    b[x] || 0 === b[x] ? g += j(x) + ":" + l(x, b[x]) + ";" : this.each(function() {
                        this.style.removeProperty(j(x))
                    });
            return this.each(function() {
                this.style.cssText += ";" + g
            })
        },
        index: function(a) {
            return a ? this.indexOf(y(a)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(a) {
            return a ? C.some.call(this, function(a) {
                return this.test(t(a))
            }, k(a)) : !1
        },
        addClass: function(a) {
            return a ? this.each(function(b) {
                if ("className"in this) {
                    z = [];
                    var c = t(this)
                      , d = r(this, a, b, c);
                    d.split(/\s+/g).forEach(function(a) {
                        y(this).hasClass(a) || z.push(a)
                    }, this),
                    z.length && t(this, c + (c ? " " : "") + z.join(" "))
                }
            }) : this
        },
        removeClass: function(a) {
            return this.each(function(b) {
                if ("className"in this) {
                    if (a === w)
                        return t(this, "");
                    z = t(this),
                    r(this, a, b, z).split(/\s+/g).forEach(function(a) {
                        z = z.replace(k(a), " ")
                    }),
                    t(this, z.trim())
                }
            })
        },
        toggleClass: function(a, b) {
            return a ? this.each(function(c) {
                var d = y(this)
                  , e = r(this, a, c, t(this));
                e.split(/\s+/g).forEach(function(a) {
                    (b === w ? !d.hasClass(a) : b) ? d.addClass(a) : d.removeClass(a)
                })
            }) : this
        },
        scrollTop: function(a) {
            if (this.length) {
                var b = "scrollTop"in this[0];
                return a === w ? b ? this[0].scrollTop : this[0].pageYOffset : this.each(b ? function() {
                    this.scrollTop = a
                }
                : function() {
                    this.scrollTo(this.scrollX, a)
                }
                )
            }
        },
        scrollLeft: function(a) {
            if (this.length) {
                var b = "scrollLeft"in this[0];
                return a === w ? b ? this[0].scrollLeft : this[0].pageXOffset : this.each(b ? function() {
                    this.scrollLeft = a
                }
                : function() {
                    this.scrollTo(a, this.scrollY)
                }
                )
            }
        },
        position: function() {
            if (this.length) {
                var a = this[0]
                  , b = this.offsetParent()
                  , c = this.offset()
                  , d = N.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
                return c.top -= parseFloat(y(a).css("margin-top")) || 0,
                c.left -= parseFloat(y(a).css("margin-left")) || 0,
                d.top += parseFloat(y(b[0]).css("border-top-width")) || 0,
                d.left += parseFloat(y(b[0]).css("border-left-width")) || 0,
                {
                    top: c.top - d.top,
                    left: c.left - d.left
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || G.body; a && !N.test(a.nodeName) && "static" == y(a).css("position"); )
                    a = a.offsetParent;
                return a
            })
        }
    },
    y.fn.detach = y.fn.remove,
    ["width", "height"].forEach(function(a) {
        var b = a.replace(/./, function(a) {
            return a[0].toUpperCase()
        });
        y.fn[a] = function(e) {
            var f, g = this[0];
            return e === w ? c(g) ? g["inner" + b] : d(g) ? g.documentElement["scroll" + b] : (f = this.offset()) && f[a] : this.each(function(b) {
                g = y(this),
                g.css(a, r(this, e, b, g[a]()))
            })
        }
    }),
    Q.forEach(function(b, c) {
        var d = c % 2;
        y.fn[b] = function() {
            var b, e, f = y.map(arguments, function(c) {
                return b = a(c),
                "object" == b || "array" == b || null == c ? c : Y.fragment(c)
            }), g = this.length > 1;
            return f.length < 1 ? this : this.each(function(a, b) {
                e = d ? b : b.parentNode,
                b = 0 == c ? b.nextSibling : 1 == c ? b.firstChild : 2 == c ? b : null;
                var h = y.contains(G.documentElement, e);
                f.forEach(function(a) {
                    if (g)
                        a = a.cloneNode(!0);
                    else if (!e)
                        return y(a).remove();
                    e.insertBefore(a, b),
                    h && v(a, function(a) {
                        null == a.nodeName || "SCRIPT" !== a.nodeName.toUpperCase() || a.type && "text/javascript" !== a.type || a.src || window.eval.call(window, a.innerHTML)
                    })
                })
            })
        }
        ,
        y.fn[d ? b + "To" : "insert" + (c ? "Before" : "After")] = function(a) {
            return y(a)[b](this),
            this
        }
    }),
    Y.Z.prototype = o.prototype = y.fn,
    Y.uniq = B,
    Y.deserializeValue = u,
    y.zepto = Y,
    y
}()),
Fancy.nojQuery && !function(a) {
    function b(a) {
        return a._zid || (a._zid = m++)
    }
    function c(a, c, f, g) {
        if (c = d(c),
        c.ns)
            var h = e(c.ns);
        return (q[b(a)] || []).filter(function(a) {
            return a && (!c.e || a.e == c.e) && (!c.ns || h.test(a.ns)) && (!f || b(a.fn) === b(f)) && (!g || a.sel == g)
        })
    }
    function d(a) {
        var b = ("" + a).split(".");
        return {
            e: b[0],
            ns: b.slice(1).sort().join(" ")
        }
    }
    function e(a) {
        return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)")
    }
    function f(a, b) {
        return a.del && !s && a.e in t || !!b
    }
    function g(a) {
        return u[a] || s && t[a] || a
    }
    function h(c, e, h, i, k, m, n) {
        var o = b(c)
          , p = q[o] || (q[o] = []);
        e.split(/\s/).forEach(function(b) {
            if ("ready" == b)
                return a(document).ready(h);
            var e = d(b);
            e.fn = h,
            e.sel = k,
            e.e in u && (h = function(b) {
                var c = b.relatedTarget;
                return !c || c !== this && !a.contains(this, c) ? e.fn.apply(this, arguments) : void 0
            }
            ),
            e.del = m;
            var o = m || h;
            e.proxy = function(a) {
                if (a = j(a),
                !a.isImmediatePropagationStopped()) {
                    a.data = i;
                    var b = o.apply(c, a._args == l ? [a] : [a].concat(a._args));
                    return b === !1 && (a.preventDefault(),
                    a.stopPropagation()),
                    b
                }
            }
            ,
            e.i = p.length,
            p.push(e),
            "addEventListener"in c && c.addEventListener(g(e.e), e.proxy, f(e, n))
        })
    }
    function i(a, d, e, h, i) {
        var j = b(a);
        (d || "").split(/\s/).forEach(function(b) {
            c(a, b, e, h).forEach(function(b) {
                delete q[j][b.i],
                "removeEventListener"in a && a.removeEventListener(g(b.e), b.proxy, f(b, i))
            })
        })
    }
    function j(b, c) {
        return (c || !b.isDefaultPrevented) && (c || (c = b),
        a.each(y, function(a, d) {
            var e = c[a];
            b[a] = function() {
                return this[d] = v,
                e && e.apply(c, arguments)
            }
            ,
            b[d] = w
        }),
        (c.defaultPrevented !== l ? c.defaultPrevented : "returnValue"in c ? c.returnValue === !1 : c.getPreventDefault && c.getPreventDefault()) && (b.isDefaultPrevented = v)),
        b
    }
    function k(a) {
        var b, c = {
            originalEvent: a
        };
        for (b in a)
            x.test(b) || a[b] === l || (c[b] = a[b]);
        return j(c, a)
    }
    var l, m = 1, n = Array.prototype.slice, o = Fancy.isFunction, p = function(a) {
        return "string" == typeof a
    }, q = {}, r = {}, s = "onfocusin"in window, t = {
        focus: "focusin",
        blur: "focusout"
    }, u = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    r.click = r.mousedown = r.mouseup = r.mousemove = "MouseEvents",
    a.event = {
        add: h,
        remove: i
    },
    a.proxy = function(c, d) {
        var e = 2 in arguments && n.call(arguments, 2);
        if (o(c)) {
            var f = function() {
                return c.apply(d, e ? e.concat(n.call(arguments)) : arguments)
            };
            return f._zid = b(c),
            f
        }
        if (p(d))
            return e ? (e.unshift(c[d], c),
            a.proxy.apply(null, e)) : a.proxy(c[d], c);
        throw new TypeError("expected function")
    }
    ,
    a.fn.bind = function(a, b, c) {
        return this.on(a, b, c)
    }
    ,
    a.fn.unbind = function(a, b) {
        return this.off(a, b)
    }
    ,
    a.fn.one = function(a, b, c, d) {
        return this.on(a, b, c, d, 1)
    }
    ;
    var v = function() {
        return !0
    }
      , w = function() {
        return !1
    }
      , x = /^([A-Z]|returnValue$|layer[XY]$)/
      , y = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
    };
    a.fn.delegate = function(a, b, c) {
        return this.on(b, a, c)
    }
    ,
    a.fn.undelegate = function(a, b, c) {
        return this.off(b, a, c)
    }
    ,
    a.fn.live = function(b, c) {
        return a(document.body).delegate(this.selector, b, c),
        this
    }
    ,
    a.fn.die = function(b, c) {
        return a(document.body).undelegate(this.selector, b, c),
        this
    }
    ,
    a.fn.on = function(b, c, d, e, f) {
        var g, j, m = this;
        return b && !p(b) ? (a.each(b, function(a, b) {
            m.on(a, c, d, b, f)
        }),
        m) : (p(c) || o(e) || e === !1 || (e = d,
        d = c,
        c = l),
        (e === l || d === !1) && (e = d,
        d = l),
        e === !1 && (e = w),
        m.each(function(l, m) {
            f && (g = function(a) {
                return i(m, a.type, e),
                e.apply(this, arguments)
            }
            ),
            c && (j = function(b) {
                var d, f = a(b.target).closest(c, m).get(0);
                return f && f !== m ? (d = a.extend(k(b), {
                    currentTarget: f,
                    liveFired: m
                }),
                (g || e).apply(f, [d].concat(n.call(arguments, 1)))) : void 0
            }
            ),
            h(m, b, e, d, c, j || g)
        }))
    }
    ,
    a.fn.off = function(b, c, d) {
        var e = this;
        return b && !p(b) ? (a.each(b, function(a, b) {
            e.off(a, c, b)
        }),
        e) : (p(c) || o(d) || d === !1 || (d = c,
        c = l),
        d === !1 && (d = w),
        e.each(function() {
            i(this, b, d, c)
        }))
    }
    ,
    a.fn.trigger = function(b, c) {
        return b = p(b) || a.isPlainObject(b) ? a.Event(b) : j(b),
        b._args = c,
        this.each(function() {
            b.type in t && "function" == typeof this[b.type] ? this[b.type]() : "dispatchEvent"in this ? this.dispatchEvent(b) : a(this).triggerHandler(b, c)
        })
    }
    ,
    a.fn.triggerHandler = function(b, d) {
        var e, f;
        return this.each(function(g, h) {
            e = k(p(b) ? a.Event(b) : b),
            e._args = d,
            e.target = h,
            a.each(c(h, b.type || b), function(a, b) {
                return f = b.proxy(e),
                e.isImmediatePropagationStopped() ? !1 : void 0
            })
        }),
        f
    }
    ,
    "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(b) {
        a.fn[b] = function(a) {
            return 0 in arguments ? this.bind(b, a) : this.trigger(b)
        }
    }),
    a.Event = function(a, b) {
        p(a) || (b = a,
        a = b.type);
        var c = document.createEvent(r[a] || "Events")
          , d = !0;
        if (b)
            for (var e in b)
                "bubbles" == e ? d = !!b[e] : c[e] = b[e];
        return c.initEvent(a, d, !0),
        j(c)
    }
}(Fancy.$),
Fancy.nojQuery && !function(a, b) {
    function c(a) {
        return a.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
    }
    function d(a) {
        return e ? e + a : a.toLowerCase()
    }
    var e, f, g, h, i, j, k, l, m, n, o = "", p = {
        Webkit: "webkit",
        Moz: "",
        O: "o"
    }, q = document.createElement("div"), r = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, s = {};
    a.each(p, function(a, c) {
        return q.style[a + "TransitionProperty"] !== b ? (o = "-" + a.toLowerCase() + "-",
        e = c,
        !1) : void 0
    }),
    f = o + "transform",
    s[g = o + "transition-property"] = s[h = o + "transition-duration"] = s[j = o + "transition-delay"] = s[i = o + "transition-timing-function"] = s[k = o + "animation-name"] = s[l = o + "animation-duration"] = s[n = o + "animation-delay"] = s[m = o + "animation-timing-function"] = "",
    a.fx = {
        off: e === b && q.style.transitionProperty === b,
        speeds: {
            _default: 400,
            fast: 200,
            slow: 600
        },
        cssPrefix: o,
        transitionEnd: d("TransitionEnd"),
        animationEnd: d("AnimationEnd")
    },
    a.fn.animate = function(c, d, e, f, g) {
        return a.isFunction(d) && (f = d,
        e = b,
        d = b),
        a.isFunction(e) && (f = e,
        e = b),
        a.isPlainObject(d) && (e = d.easing,
        f = d.complete,
        g = d.delay,
        d = d.duration),
        d && (d = ("number" == typeof d ? d : a.fx.speeds[d] || a.fx.speeds._default) / 1e3),
        g && (g = parseFloat(g) / 1e3),
        this.anim(c, d, e, f, g)
    }
    ,
    a.fn.anim = function(d, e, o, p, q) {
        var t, u, v, w = {}, x = "", y = this, z = a.fx.transitionEnd, A = !1;
        if (e === b && (e = a.fx.speeds._default / 1e3),
        q === b && (q = 0),
        a.fx.off && (e = 0),
        "string" == typeof d)
            w[k] = d,
            w[l] = e + "s",
            w[n] = q + "s",
            w[m] = o || "linear",
            z = a.fx.animationEnd;
        else {
            u = [];
            for (t in d)
                r.test(t) ? x += t + "(" + d[t] + ") " : (w[t] = d[t],
                u.push(c(t)));
            x && (w[f] = x,
            u.push(f)),
            e > 0 && "object" == typeof d && (w[g] = u.join(", "),
            w[h] = e + "s",
            w[j] = q + "s",
            w[i] = o || "linear")
        }
        return v = function(b) {
            if ("undefined" != typeof b) {
                if (b.target !== b.currentTarget)
                    return;
                a(b.target).unbind(z, v)
            } else
                a(this).unbind(z, v);
            A = !0,
            a(this).css(s),
            p && p.call(this)
        }
        ,
        e > 0 && (this.bind(z, v),
        setTimeout(function() {
            A || v.call(y)
        }, 1e3 * (e + q) + 25)),
        this.size() && this.get(0).clientLeft,
        this.css(w),
        0 >= e && setTimeout(function() {
            y.each(function() {
                v.call(this)
            })
        }, 0),
        this
    }
    ,
    q = null
}(Fancy.$),
Fancy.nojQuery && !function(a, b) {
    function c(c, d, e, f, g) {
        "function" != typeof d || g || (g = d,
        d = b);
        var h = {
            opacity: e
        };
        return f && (h.scale = f,
        c.css(a.fx.cssPrefix + "transform-origin", "0 0")),
        c.animate(h, d, null, g)
    }
    function d(b, d, e, f) {
        return c(b, d, 0, e, function() {
            g.call(a(this)),
            f && f.call(this)
        })
    }
    var e = window.document
      , f = (e.documentElement,
    a.fn.show)
      , g = a.fn.hide
      , h = a.fn.toggle;
    a.fn.show = function(a, d) {
        return f.call(this),
        a === b ? a = 0 : this.css("opacity", 0),
        c(this, a, 1, "1,1", d)
    }
    ,
    a.fn.hide = function(a, c) {
        return a === b ? g.call(this) : d(this, a, "0,0", c)
    }
    ,
    a.fn.toggle = function(c, d) {
        return c === b || "boolean" == typeof c ? h.call(this, c) : this.each(function() {
            var b = a(this);
            b["none" == b.css("display") ? "show" : "hide"](c, d)
        })
    }
    ,
    a.fn.fadeTo = function(a, b, d) {
        return c(this, a, b, null, d)
    }
    ,
    a.fn.fadeIn = function(a, b) {
        var c = this.css("opacity");
        return c > 0 ? this.css("opacity", 0) : c = 1,
        f.call(this).fadeTo(a, c, b)
    }
    ,
    a.fn.fadeOut = function(a, b) {
        return d(this, a, null, b)
    }
    ,
    a.fn.fadeToggle = function(b, c) {
        return this.each(function() {
            var d = a(this);
            d[0 == d.css("opacity") || "none" == d.css("display") ? "fadeIn" : "fadeOut"](b, c)
        })
    }
}(Fancy.$),
Fancy.nojQuery && !function(a) {
    function b(b, c, d) {
        var e = a.Event(c);
        return a(b).trigger(e, d),
        !e.isDefaultPrevented()
    }
    function c(a, c, d, e) {
        return a.global ? b(c || s, d, e) : void 0
    }
    function d(b) {
        b.global && 0 === a.active++ && c(b, null, "ajaxStart")
    }
    function e(b) {
        b.global && !--a.active && c(b, null, "ajaxStop")
    }
    function f(a, b) {
        var d = b.context;
        return b.beforeSend.call(d, a, b) === !1 || c(b, d, "ajaxBeforeSend", [a, b]) === !1 ? !1 : void c(b, d, "ajaxSend", [a, b])
    }
    function g(a, b, d, e) {
        var f = d.context
          , g = "success";
        d.success.call(f, a, g, b),
        e && e.resolveWith(f, [a, g, b]),
        c(d, f, "ajaxSuccess", [b, d, a]),
        i(g, b, d)
    }
    function h(a, b, d, e, f) {
        var g = e.context;
        e.error.call(g, d, b, a),
        f && f.rejectWith(g, [d, b, a]),
        c(e, g, "ajaxError", [d, e, a || b]),
        i(b, d, e)
    }
    function i(a, b, d) {
        var f = d.context;
        d.complete.call(f, b, a),
        c(d, f, "ajaxComplete", [b, d]),
        e(d)
    }
    function j() {}
    function k(a) {
        return a && (a = a.split(";", 2)[0]),
        a && (a == x ? "html" : a == w ? "json" : u.test(a) ? "script" : v.test(a) && "xml") || "text"
    }
    function l(a, b) {
        return "" == b ? a : (a + "&" + b).replace(/[&?]{1,2}/, "?")
    }
    function m(b) {
        b.processData && b.data && "string" != a.type(b.data) && (b.data = a.param(b.data, b.traditional)),
        !b.data || b.type && "GET" != b.type.toUpperCase() || (b.url = l(b.url, b.data),
        b.data = void 0)
    }
    function n(b, c, d, e) {
        return a.isFunction(c) && (e = d,
        d = c,
        c = void 0),
        a.isFunction(d) || (e = d,
        d = void 0),
        {
            url: b,
            data: c,
            success: d,
            dataType: e
        }
    }
    function o(b, c, d, e) {
        var f, g = a.isArray(c), h = a.isPlainObject(c);
        a.each(c, function(c, i) {
            f = a.type(i),
            e && (c = d ? e : e + "[" + (h || "object" == f || "array" == f ? c : "") + "]"),
            !e && g ? b.add(i.name, i.value) : "array" == f || !d && "object" == f ? o(b, i, d, c) : b.add(c, i)
        })
    }
    var p, q, r = 0, s = window.document, t = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, u = /^(?:text|application)\/javascript/i, v = /^(?:text|application)\/xml/i, w = "application/json", x = "text/html", y = /^\s*$/, z = s.createElement("a");
    z.href = window.location.href,
    a.active = 0,
    a.ajaxJSONP = function(b, c) {
        if (!("type"in b))
            return a.ajax(b);
        var d, e, i = b.jsonpCallback, j = (a.isFunction(i) ? i() : i) || "jsonp" + ++r, k = s.createElement("script"), l = window[j], m = function(b) {
            a(k).triggerHandler("error", b || "abort")
        }, n = {
            abort: m
        };
        return c && c.promise(n),
        a(k).on("load error", function(f, i) {
            clearTimeout(e),
            a(k).off().remove(),
            "error" != f.type && d ? g(d[0], n, b, c) : h(null, i || "error", n, b, c),
            window[j] = l,
            d && a.isFunction(l) && l(d[0]),
            l = d = void 0
        }),
        f(n, b) === !1 ? (m("abort"),
        n) : (window[j] = function() {
            d = arguments
        }
        ,
        k.src = b.url.replace(/\?(.+)=\?/, "?$1=" + j),
        s.head.appendChild(k),
        b.timeout > 0 && (e = setTimeout(function() {
            m("timeout")
        }, b.timeout)),
        n)
    }
    ,
    a.ajaxSettings = {
        type: "GET",
        beforeSend: j,
        success: j,
        error: j,
        complete: j,
        context: null,
        global: !0,
        xhr: function() {
            return new window.XMLHttpRequest
        },
        accepts: {
            script: "text/javascript, application/javascript, application/x-javascript",
            json: w,
            xml: "application/xml, text/xml",
            html: x,
            text: "text/plain"
        },
        crossDomain: !1,
        timeout: 0,
        processData: !0,
        cache: !0
    },
    a.ajax = function(b) {
        var c, e, i = a.extend({}, b || {}), n = a.Deferred && a.Deferred();
        for (p in a.ajaxSettings)
            void 0 === i[p] && (i[p] = a.ajaxSettings[p]);
        d(i),
        i.crossDomain || (c = s.createElement("a"),
        c.href = i.url,
        c.href = c.href,
        i.crossDomain = z.protocol + "//" + z.host != c.protocol + "//" + c.host),
        i.url || (i.url = window.location.toString()),
        (e = i.url.indexOf("#")) > -1 && (i.url = i.url.slice(0, e)),
        m(i);
        var o = i.dataType
          , r = /\?.+=\?/.test(i.url);
        if (r && (o = "jsonp"),
        i.cache !== !1 && (b && b.cache === !0 || "script" != o && "jsonp" != o) || (i.url = l(i.url, "_=" + Date.now())),
        "jsonp" == o)
            return r || (i.url = l(i.url, i.jsonp ? i.jsonp + "=?" : i.jsonp === !1 ? "" : "callback=?")),
            a.ajaxJSONP(i, n);
        var t, u = i.accepts[o], v = {}, w = function(a, b) {
            v[a.toLowerCase()] = [a, b]
        }, x = /^([\w-]+:)\/\//.test(i.url) ? RegExp.$1 : window.location.protocol, A = i.xhr(), B = A.setRequestHeader;
        if (n && n.promise(A),
        i.crossDomain || w("X-Requested-With", "XMLHttpRequest"),
        w("Accept", u || "*/*"),
        (u = i.mimeType || u) && (u.indexOf(",") > -1 && (u = u.split(",", 2)[0]),
        A.overrideMimeType && A.overrideMimeType(u)),
        (i.contentType || i.contentType !== !1 && i.data && "GET" != i.type.toUpperCase()) && w("Content-Type", i.contentType || "application/x-www-form-urlencoded"),
        i.headers)
            for (q in i.headers)
                w(q, i.headers[q]);
        if (A.setRequestHeader = w,
        A.onreadystatechange = function() {
            if (4 == A.readyState) {
                A.onreadystatechange = j,
                clearTimeout(t);
                var b, c = !1;
                if (A.status >= 200 && A.status < 300 || 304 == A.status || 0 == A.status && "file:" == x) {
                    if (o = o || k(i.mimeType || A.getResponseHeader("content-type")),
                    "arraybuffer" == A.responseType || "blob" == A.responseType)
                        b = A.response;
                    else {
                        b = A.responseText;
                        try {
                            "script" == o ? (1,
                            eval)(b) : "xml" == o ? b = A.responseXML : "json" == o && (b = y.test(b) ? null : a.parseJSON(b))
                        } catch (d) {
                            c = d
                        }
                        if (c)
                            return h(c, "parsererror", A, i, n)
                    }
                    g(b, A, i, n)
                } else
                    h(A.statusText || null, A.status ? "error" : "abort", A, i, n)
            }
        }
        ,
        f(A, i) === !1)
            return A.abort(),
            h(null, "abort", A, i, n),
            A;
        if (i.xhrFields)
            for (q in i.xhrFields)
                A[q] = i.xhrFields[q];
        var C = "async"in i ? i.async : !0;
        A.open(i.type, i.url, C, i.username, i.password);
        for (q in v)
            B.apply(A, v[q]);
        return i.timeout > 0 && (t = setTimeout(function() {
            A.onreadystatechange = j,
            A.abort(),
            h(null, "timeout", A, i, n)
        }, i.timeout)),
        A.send(i.data ? i.data : null),
        A
    }
    ,
    a.get = function() {
        return a.ajax(n.apply(null, arguments))
    }
    ,
    a.post = function() {
        var b = n.apply(null, arguments);
        return b.type = "POST",
        a.ajax(b)
    }
    ,
    a.getJSON = function() {
        var b = n.apply(null, arguments);
        return b.dataType = "json",
        a.ajax(b)
    }
    ,
    a.fn.load = function(b, c, d) {
        if (!this.length)
            return this;
        var e, f = this, g = b.split(/\s/), h = n(b, c, d), i = h.success;
        return g.length > 1 && (h.url = g[0],
        e = g[1]),
        h.success = function(b) {
            f.html(e ? a("<div>").html(b.replace(t, "")).find(e) : b),
            i && i.apply(f, arguments)
        }
        ,
        a.ajax(h),
        this
    }
    ;
    var A = encodeURIComponent;
    a.param = function(b, c) {
        var d = [];
        return d.add = function(b, c) {
            a.isFunction(c) && (c = c()),
            null == c && (c = ""),
            this.push(A(b) + "=" + A(c))
        }
        ,
        o(d, b, c),
        d.join("&").replace(/%20/g, "+")
    }
}(Fancy.$),
Fancy.i18n.en = {
    paging: {
        first: "First Page",
        last: "Last Page",
        prev: "Previous Page",
        next: "Next Page",
        info: "Rows [0] - [1] of [2]",
        page: "Page",
        of: "of [0]"
    },
    loadingText: "Loading...",
    thousandSeparator: ",",
    decimalSeparator: ".",
    currencySign: "$",
    sourceText: "Source",
    date: {
        read: "m/d/Y",
        write: "m/d/Y",
        edit: "m/d/Y",
        today: "Today",
        startDay: 0,
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        am: "am",
        pm: "pm",
        AM: "AM",
        PM: "PM",
        ok: "OK",
        cancel: "Cancel"
    },
    yes: "Yes",
    no: "No",
    dragText: "[0] selected row[1]",
    update: "Update",
    cancel: "Cancel",
    columns: "Columns",
    sortAsc: "Sort ASC",
    sortDesc: "Sort DESC"
},
Fancy.i18n["en-US"] = Fancy.i18n.en,
Fancy.controllers = {},
Fancy.defineController = function(a, b) {
    Fancy.controllers[a] = b
}
,
Fancy.getController = function(a) {
    return Fancy.controllers[a]
}
,
Fancy.define("Fancy.DD", {
    extend: Fancy.Event,
    singleton: !0,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments),
        b.init()
    },
    init: function() {
        var a = this;
        a.addEvents(),
        a.els = {}
    },
    add: function(a) {
        var b = this
          , c = Fancy.id(a.overEl);
        b.els[c] = a,
        a.overEl.on("mousedown", b.onMouseDown, b)
    },
    onMouseDown: function(a) {
        var b = this
          , c = Fancy.get(document)
          , d = Fancy.get(a.currentTarget)
          , e = b.els[d.attr("id")].dragEl;
        a.preventDefault(),
        b.clientX = a.clientX,
        b.clientY = a.clientY,
        b.startX = parseInt(e.css("left")),
        b.startY = parseInt(e.css("top")),
        b.activeId = d.attr("id"),
        c.once("mouseup", b.onMouseUp, b),
        c.on("mousemove", b.onMouseMove, b)
    },
    onMouseUp: function() {
        var a = this
          , b = Fancy.get(document);
        b.un("mousemove", a.onMouseMove, a)
    },
    onMouseMove: function(a) {
        var b = this
          , c = b.els[b.activeId]
          , d = c.dragEl
          , e = a.clientX
          , f = a.clientY
          , g = b.clientX - e
          , h = b.clientY - f;
        d.css({
            left: b.startX - g,
            top: b.startY - h
        })
    }
}),
Fancy.define("Fancy.Widget", {
    extend: Fancy.Event,
    constructor: function(a) {
        var b = this;
        Fancy.applyConfig(b, a || {}),
        b.preInitControls(),
        b.Super("const", arguments),
        b.init(),
        b.initControls()
    },
    init: function() {
        var a = this;
        a.initId(),
        a.addEvents("beforerender", "afterrender", "render", "show", "beforehide", "hide", "destroy"),
        a.initPlugins()
    },
    renderItems: function(a) {
        for (var b = this, c = 0, d = b.items.length; d > c; c++) {
            var e = b.items[c]
              , f = Fancy.getClassByType(e.type);
            e.renderTo = a,
            b.items[c] = new f(e)
        }
    },
    preInitControls: function() {
        var a = this
          , b = a.controller || a.controllers;
        if (b)
            switch (Fancy.typeOf(b)) {
            case "string":
                b = Fancy.getController(b);
                for (var c in b)
                    void 0 === a[c] && (a[c] = b[c]);
                break;
            case "array":
                for (var d = [], e = 0, f = b.length; f > e; e++) {
                    var g = Fancy.getController(b[e]);
                    for (var c in g)
                        "controls" !== c ? void 0 === a[c] && (a[c] = g[c]) : d = d.concat(g.controls)
                }
                a.controls = d
            }
    },
    initControls: function() {
        var a = this;
        if (void 0 !== a.controls)
            for (var b = a.controls, c = 0, d = b.length; d > c; c++) {
                var e = b[c];
                if (void 0 === e.event)
                    throw new Error("[FancyGrid Error]: - not set event name for control");
                if (void 0 === e.handler)
                    throw new Error("[FancyGrid Error]: - not set handler for control");
                var f = e.event
                  , g = e.handler
                  , h = e.scope || a
                  , i = e.selector;
                Fancy.isString(g) && (g = a[g]),
                i ? !function(b, c, d, e) {
                    a.$events[b] ? a.on(b, function(a, b) {
                        var f = b.e.target
                          , g = Fancy.get(f)
                          , h = g.parent()
                          , i = h.select(e);
                        if (1 === i.length && i.within(f))
                            c.apply(d, arguments);
                        else if (i.length > 1)
                            for (var j = 0, k = i.length; k > j; j++)
                                i.item(j).within(f) && c.apply(d, arguments)
                    }, d) : a.on("render", function() {
                        a.el.on(b, c, d, e)
                    })
                }(f, g, h, i) : void 0 === i && void 0 === e.widget && a.on(f, g, h)
            }
    },
    css: function(a, b) {
        var c = this;
        return c.el.css(a, b)
    },
    addClass: function(a) {
        this.el.addClass(a)
    },
    removeClass: function(a) {
        this.el.removeClass(a)
    },
    hasClass: function(a) {
        this.el.hasClass(a)
    },
    toggleClass: function(a) {
        this.el.toggleClass(a)
    },
    destroy: function() {
        var a = this;
        a.el && a.el.destroy()
    }
}),
Fancy.define("Fancy.Plugin", {
    extend: Fancy.Event,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments),
        b.init()
    },
    init: function() {
        var a = this;
        a.initId(),
        a.addEvents("beforerender", "afterrender", "render", "show", "hide", "destroy")
    }
}),
function() {
    var a = {};
    Fancy.define("Fancy.Button", {
        extend: Fancy.Widget,
        minWidth: 30,
        constructor: function(b, c) {
            var d = this;
            b.toggleGroup && (a[b.toggleGroup] = a[b.toggleGroup] || {
                active: !1,
                items: []
            },
            a[b.toggleGroup].items.push(d)),
            d.scope = c,
            d.Super("const", arguments)
        },
        init: function() {
            var a = this;
            a.addEvents("click", "mousedown", "mouseup", "mouseover", "mouseout", "pressedchange"),
            a.Super("init", arguments),
            a.style = a.style || {},
            a.initTpl(),
            a.render(),
            a.setOns()
        },
        setOns: function() {
            var a = this
              , b = a.el;
            b.on("click", a.onClick, a),
            b.on("mousedown", a.onMouseDown, a),
            b.on("mouseup", a.onMouseUp, a),
            b.on("mouseover", a.onMouseOver, a),
            b.on("mouseout", a.onMouseOut, a),
            a.tip && b.on("mousemove", a.onMouseMove, a)
        },
        widgetCls: "fancy-button",
        cls: "",
        disabledCls: "fancy-button-disabled",
        extraCls: "",
        text: "",
        height: 28,
        paddingTextWidth: 5,
        imageWidth: 20,
        pressed: !1,
        tpl: ['<div class="fancy-button-image"></div>', '<a class="fancy-button-text">{text}</a>', '<div class="fancy-button-drop" style="{dropDisplay}"></div>'],
        initTpl: function() {
            var a = this;
            a.tpl = new Fancy.Template(a.tpl)
        },
        render: function() {
            var a, b = this, c = Fancy.get(document.createElement("div")), d = 0;
            if (b.fire("beforerender"),
            b.wrapper && b.renderWrapper(),
            a = Fancy.get(b.renderTo || document.body).dom,
            b.width ? d = b.width : b.text !== !1 && (d += 7 * b.text.length + 14),
            b.imageColor && (b.imageCls = "fancy-button-image-color"),
            d < b.minWidth && (d = b.text && b.text.length > 0 ? b.minWidth : b.minWidth),
            b.imageCls && b.text && (d += b.imageWidth),
            c.addClass(Fancy.cls),
            c.addClass(b.widgetCls),
            c.addClass(b.cls),
            c.addClass(b.extraCls),
            b.disabled && c.addClass(b.disabledCls),
            c.css({
                width: d + "px",
                height: b.height + "px"
            }),
            c.css(b.style || {}),
            c.update(b.tpl.getHTML({
                text: b.text || ""
            })),
            b.imageCls) {
                var e = c.select(".fancy-button-image");
                b.imageColor && e.css("background-color", b.imageColor),
                e.css("display", "block"),
                Fancy.isString(b.imageCls) && e.addClass(b.imageCls)
            }
            b.el = Fancy.get(a.appendChild(c.dom)),
            Fancy.each(b.style, function(a, c) {
                b.el.css(c, a)
            }),
            b.disabled && b.disable(),
            b.pressed && b.setPressed(b.pressed),
            b.initToggle(),
            b.width = d,
            b.fire("afterrender"),
            b.fire("render")
        },
        renderWrapper: function() {
            var a = this
              , b = a.wrapper
              , c = Fancy.get(a.renderTo || document.body).dom
              , d = Fancy.get(document.createElement("div"));
            d.css(b.style || {}),
            d.addClass(b.cls || ""),
            a.wrapper = Fancy.get(c.appendChild(d.dom)),
            a.renderTo = a.wrapper.dom
        },
        initToggle: function() {
            var a = this;
            !a.enableToggle
        },
        setPressed: function(b, c) {
            var d = this;
            if (b) {
                if (d.addClass("fancy-button-pressed"),
                d.pressed = !0,
                d.toggleGroup) {
                    var e = a[d.toggleGroup].active;
                    e && e.setPressed(!1),
                    a[d.toggleGroup].active = d
                }
            } else
                d.removeClass("fancy-button-pressed"),
                d.pressed = !1;
            c !== !1 && d.fire("pressedchange", d.pressed)
        },
        toggle: function() {
            var a = this
              , b = !a.pressed;
            a.setPressed(b),
            a.pressed = b
        },
        onClick: function() {
            var a = this
              , b = a.handler;
            a.fire("click"),
            a.disabled !== !0 && (b && (Fancy.isString(b) && (b = a.getHandler(b)),
            a.scope ? b.apply(a.scope, [a]) : b(a)),
            a.enableToggle && (a.toggleGroup ? a.setPressed(!0) : a.toggle()))
        },
        getHandler: function(a) {
            var b = this
              , c = Fancy.getWidget(b.el.parent().parent().select(".fancy-grid").attr("id"));
            return c[a] || function() {
                throw new Error("[FancyGrid Error] - handler does not exist")
            }
        },
        onMouseDown: function() {
            var a = this;
            a.fire("mousedown")
        },
        onMouseUp: function() {
            var a = this;
            a.fire("mouseup")
        },
        onMouseOver: function(a) {
            var b = this;
            b.fire("mouseover"),
            b.tip && b.renderTip(a)
        },
        renderTip: function(a) {
            var b = this;
            b.tooltip && b.tooltip.destroy(),
            b.tooltip = new Fancy.ToolTip({
                text: b.tip
            }),
            b.tooltip.css("display", "block"),
            b.tooltip.show(a.pageX + 15, a.pageY - 25)
        },
        onMouseOut: function() {
            var a = this;
            a.fire("mouseout"),
            a.tooltip && (a.tooltip.destroy(),
            delete a.tooltip)
        },
        setText: function(a) {
            var b = this
              , c = b.el;
            b.css("width", (parseInt(c.css("font-size")) + 2) * a.length + 2 * parseInt(b.css("padding-right")) + 2),
            c.select(".fancy-button-text").update(a)
        },
        disable: function() {
            var a = this;
            a.disabled = !0,
            a.el.addClass(a.disabledCls)
        },
        enable: function() {
            var a = this;
            a.disabled = !1,
            a.el.removeClass(a.disabledCls)
        },
        onMouseMove: function(a) {
            var b = this;
            b.tip && b.tooltip && b.tooltip.show(a.pageX + 15, a.pageY - 25)
        }
    })
}(),
Fancy.define("Fancy.SegButton", {
    extend: Fancy.Widget,
    constructor: function(a, b) {
        var c = this;
        c.scope = b,
        c.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("toggle"),
        a.Super("init", arguments),
        a.style = a.style || {},
        a.render(),
        a.setOns()
    },
    setOns: function() {
        var a = this;
        a.el
    },
    widgetCls: "fancy-seg-button",
    cls: "",
    extraCls: "",
    text: "",
    render: function() {
        var a, b = this, c = Fancy.get(document.createElement("div"));
        b.fire("beforerender"),
        a = Fancy.get(b.renderTo || document.body).dom,
        c.addClass(Fancy.cls),
        c.addClass(b.widgetCls),
        c.addClass(b.cls),
        c.addClass(b.extraCls),
        b.el = Fancy.get(a.appendChild(c.dom)),
        Fancy.each(b.style, function(a, c) {
            b.el.css(c, a)
        }),
        b.renderButtons(),
        b.fire("afterrender"),
        b.fire("render")
    },
    renderButtons: function() {
        for (var a = this, b = a.items, c = 0, d = b.length, e = Fancy.id(null, "fancy-toggle-group-"); d > c; c++) {
            var f = b[c];
            f.renderTo = a.el.dom,
            a.allowToggle !== !1 && (f.enableToggle = !0,
            a.multiToggle !== !0 && (f.toggleGroup = e)),
            0 === c ? f.style = {
                "border-right-width": 0,
                "border-top-right-radius": 0,
                "border-bottom-right-radius": 0
            } : c > 1 ? f.style = {
                "border-left-width": 0,
                "border-top-left-radius": 0,
                "border-bottom-left-radius": 0
            } : f.style = {
                "border-top-left-radius": 0,
                "border-bottom-left-radius": 0
            },
            b.length > 2 && 0 !== c && c !== d - 1 && Fancy.apply(f.style, {
                "border-top-right-radius": 0,
                "border-bottom-right-radius": 0,
                "border-top-left-radius": 0,
                "border-bottom-left-radius": 0
            }),
            a.items[c] = new Fancy.Button(f),
            a.items[c].on("pressedchange", function(b, c) {
                a.fire("toggle", b, c, a.getValues())
            })
        }
    },
    getValues: function() {
        for (var a = this, b = [], c = a.items, d = 0, e = c.length; e > d; d++)
            b.push(c[d].pressed);
        return b
    },
    clear: function(a) {
        for (var b = this, c = b.items, d = 0, e = c.length; e > d; d++)
            c[d].setPressed(!1, a)
    }
}),
Fancy.define("Fancy.toolbar.Tab", {
    extend: Fancy.Button,
    constructor: function(a, b) {
        var c = this;
        c.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments)
    },
    cls: "fancy fancy-button fancy-toolbar-tab",
    render: function() {
        var a = this;
        a.Super("render", arguments)
    }
}),
function() {
    Fancy.define("Fancy.Menu", {
        extend: Fancy.Widget,
        constructor: function(a, b) {
            var c = this;
            Fancy.applyConfig(c, a || {}),
            c.Super("const", arguments)
        },
        init: function() {
            var a = this;
            a.addEvents("hide"),
            a.Super("init", arguments),
            a.applyDefaults(),
            a.render(),
            a.ons()
        },
        ons: function() {
            var a = this
              , b = a.el;
            b.on("mousedown", a.onItemMouseDown, a, ".fancy-menu-item"),
            b.on("click", a.onItemClick, a, ".fancy-menu-item"),
            b.on("mouseenter", a.onItemEnter, a, ".fancy-menu-item"),
            b.on("mouseleave", a.onItemLeave, a, ".fancy-menu-item")
        },
        widgetCls: "fancy-menu",
        itemCls: "fancy-menu-item",
        itemImageCls: "fancy-menu-item-image",
        itemContainerCls: "fancy-menu-item-text",
        activeItemCls: "fancy-menu-item-active",
        cls: "",
        extraCls: "",
        width: 142,
        itemHeight: 30,
        rendered: !1,
        theme: "default",
        render: function() {
            var a, b = this, c = Fancy.get(document.createElement("div"));
            b.fire("beforerender"),
            "default" !== b.theme && c.addClass("fancy-theme-" + b.theme),
            c.addClass(Fancy.cls),
            c.addClass(b.widgetCls),
            c.addClass(b.cls),
            c.addClass(b.extraCls),
            c.css("width", b.width),
            c.css("height", b.getItemsHeight()),
            a = Fancy.get(b.renderTo || document.body),
            b.el = a.dom.appendChild(c.dom),
            b.el = Fancy.get(b.el),
            b.renderItems(),
            b.fire("afterrender"),
            b.fire("render"),
            b.rendered = !0
        },
        getItemsHeight: function() {
            for (var a = this, b = 0, c = 0, d = a.items.length; d > c; c++)
                b += a.itemHeight;
            return b
        },
        renderItems: function() {
            for (var a, b = this, c = 0, d = b.items.length; d > c; c++) {
                a = b.items[c];
                var e = Fancy.get(document.createElement("div"));
                e.attr("index", c),
                e.addClass(b.itemCls),
                e.css("height", b.itemHeight),
                b.el.dom.appendChild(e.dom),
                a.el = e;
                var f = a.imageCls || "";
                switch (a.cls && e.addClass(a.cls),
                e.update([a.image === !1 ? "" : '<div class="fancy-menu-item-image ' + f + '"></div>', '<div class="fancy-menu-item-text"></div>', '<div class="fancy-menu-item-right-image ' + (a.items ? "fancy-menu-item-expand" : "") + '"></div>'].join("")),
                a.image === !1 && e.addClass("fancy-menu-item-no-image"),
                a.type) {
                case "":
                    break;
                default:
                    e.select(".fancy-menu-item-text").item(0).update(a.text || "")
                }
                void 0 !== a.checked && (b.items[c].checkbox = new Fancy.CheckBox({
                    label: !1,
                    theme: b.theme,
                    padding: "1px 8px 0px",
                    renderTo: e.select(".fancy-menu-item-image").item(0).dom,
                    value: a.checked
                }))
            }
        },
        applyDefaults: function() {
            var a = this
              , b = 0
              , c = a.items.length;
            if (a.defaults)
                for (; c > b; b++)
                    Fancy.applyIf(a.items[b], a.defaults)
        },
        onItemClick: function(a) {
            var b = this
              , c = (b.items.length,
            Fancy.get(a.currentTarget))
              , d = c.attr("index")
              , e = b.items[d]
              , f = [b, e];
            e.handler && (e.scope ? e.handler.apply(e.scope, f) : e.handler(b, e))
        },
        onItemEnter: function(a) {
            var b = this
              , c = Fancy.get(a.currentTarget)
              , d = c.attr("index")
              , e = b.items[d]
              , f = c.offset();
            if (b.shownSubMenu && b.shownSubMenu.hide(),
            b.deActivateItem(),
            b.activateItem(d),
            e.items) {
                if (!e.menu) {
                    var g = b.items[d];
                    Fancy.apply(g, {
                        parentItem: e,
                        parentMenu: b,
                        defaults: e.defaults,
                        items: e.items,
                        theme: b.theme
                    }),
                    b.items[d].menu = new Fancy.Menu(g)
                }
                e.menu.showAt(f.left + parseInt(c.width()), f.top),
                b.shownSubMenu = e.menu
            }
        },
        onItemLeave: function(a) {
            var b = this
              , c = Fancy.get(a.currentTarget)
              , d = c.attr("index");
            b.items[d]
        },
        showAt: function(a, b) {
            var c = this;
            c.css("position", "absolute"),
            c.css("left", a),
            c.css("top", b),
            c.el.show(),
            c.parentMenu || Fancy.MenuManager.add(c)
        },
        hide: function() {
            var a = this;
            a.el.hide(),
            a.deActivateItem(),
            a.shownSubMenu && a.shownSubMenu.hide(),
            a.fire("hide")
        },
        hideAll: function() {
            var a = this;
            a.parentMenu && "none" !== a.parentMenu.el.css("display") && a.parentMenu.hide(),
            a.hide()
        },
        activateItem: function(a) {
            var b = this
              , c = b.items[a];
            b.activeItem = c,
            c.el.addClass(b.activeItemCls)
        },
        deActivateItem: function() {
            var a = this;
            a.activeItem && (a.activeItem.el.removeClass(a.activeItemCls),
            delete a.activeItem)
        },
        onItemMouseDown: function(a) {
            a.preventDefault()
        }
    }),
    Fancy.define("Fancy.MenuManager", {
        singleton: !0,
        inited: !1,
        constructor: function(a) {},
        init: function() {
            var a = this
              , b = Fancy.get(document);
            b.on("click", a.onDocClick, a)
        },
        add: function(a) {
            var b = this;
            b.inited || b.init(),
            b.activeMenu = a
        },
        onDocClick: function(a) {
            var b = this
              , c = Fancy.get(a.target)
              , d = 10
              , e = c;
            if (b.activeMenu) {
                for (; d > 0 && e.dom; ) {
                    if (e.hasClass("fancy-menu"))
                        return;
                    e = e.parent(),
                    d--
                }
                b.activeMenu.hide(),
                delete b.activeMenu
            }
        }
    })
}(),
Fancy.Mixin("Fancy.panel.mixin.PrepareConfig", {
    prepareConfigTheme: function(a, b) {
        var c = a.theme || b.theme
          , d = Fancy.getTheme(c).config;
        return Fancy.isObject(c) && (a.theme = c.name),
        Fancy.applyIf(a, d),
        a
    },
    prepareConfigFooter: function(a) {
        var b = a.footer
          , c = a.lang;
        if (b) {
            var d = [];
            if (Fancy.isString(b.status) && d.push({
                type: "text",
                text: b.status,
                cls: "fancy-footer-status"
            }),
            b.status && b.source && d.push("side"),
            Fancy.isString(b.source))
                d.push({
                    type: "text",
                    text: b.source,
                    cls: "fancy-footer-source"
                });
            else if (Fancy.isObject(b.source)) {
                var e = b.source.text
                  , f = b.source.sourceText || c.sourceText;
                if (b.source.link) {
                    var g = b.source.link;
                    g = g.replace("http://", ""),
                    g = "http://" + g,
                    e = '<span class="fancy-status-source-text">' + f + '</span>: <a class="fancy-status-source-link" href="' + g + '">' + e + "</a>"
                } else
                    e = "<span>" + f + ":</span> " + e;
                d.push({
                    type: "text",
                    text: e,
                    cls: "fancy-footer-source"
                })
            }
            a.footer = d
        }
        return a
    },
    prepareConfigLang: function(a, b) {
        var c = b.i18n || a.i18n
          , d = Fancy.Object.copy(Fancy.i18n[c]);
        if (a.lang) {
            for (var e in a.lang)
                Fancy.isObject(a.lang[e]) === !1 && (d[e] = a.lang[e]);
            d.paging = {},
            a.lang.paging && Fancy.apply(d.paging, a.lang.paging);
            for (var e in a.lang.paging)
                "paging" !== e && (Fancy.isObject(e) || (d[e] = a.lang.paging[e]));
            d.date = {},
            a.lang.date && Fancy.apply(d.date, a.lang.date)
        }
        return a.lang = d,
        a
    }
}),
Fancy.Mixin("Fancy.panel.mixin.methods", {
    setTitle: function(a) {
        var b = this;
        b.panel && b.panel.setTitle(a)
    },
    getTitle: function() {
        var a = this;
        return a.panel ? a.panel.getTitle() : void 0
    },
    setSubTitle: function(a) {
        var b = this;
        b.panel && b.panel.setSubTitle(a)
    },
    getSubTitle: function() {
        var a = this;
        return a.panel ? a.panel.getSubTitle() : void 0
    }
}),
Fancy.Mixin("Fancy.panel.mixin.DD", {
    ddCls: "fancy-panel-draggable",
    initDD: function() {
        var a = this;
        a.widget;
        a.addDDCls(),
        a.addDD()
    },
    addDDCls: function() {
        var a = this;
        a.el.addClass(a.ddCls)
    },
    addDD: function() {
        var a = this;
        Fancy.DD.add({
            dragEl: a.el,
            overEl: a.el.select(".fancy-panel-header").item(0)
        })
    }
}),
Fancy.Mixin("Fancy.panel.mixin.Resize", {
    cornerResizeCls: "fancy-panel-resize-corner",
    resizeMaskCls: "fancy-panel-resize-mask",
    initResize: function() {
        var a = this;
        a.widget;
        a.addEvents("resize"),
        a.activeResizeEl = void 0,
        a.renderResizeEls(),
        a.onsResizeEls()
    },
    renderResizeEls: function() {
        var a = this
          , b = a.el
          , c = Fancy.get(document.createElement("div"));
        c.addClass(a.cornerResizeCls),
        a.cornerResizeEl = Fancy.get(b.dom.appendChild(c.dom))
    },
    onResize: function() {
        var a = this;
        a.tbar && a._tbar.applyScrollChanges(),
        a.subTBar && a._subTBar.applyScrollChanges(),
        a.bbar && a._bbar.applyScrollChanges(),
        a.footer && a._footer.applyScrollChanges(),
        a.buttons && a._buttons.applyScrollChanges()
    },
    onsResizeEls: function(a) {
        var b = this;
        b.cornerResizeEl.on("mousedown", b.onMouseDownResizeEl, b),
        b.on("resize", b.onResize, b)
    },
    onMouseDownResizeEl: function(a) {
        var b = this
          , c = Fancy.get(document);
        a.preventDefault(),
        c.once("mouseup", b.onMouseUpResize, b),
        c.on("mousemove", b.onMouseMoveResize, b),
        b.renderResizeMask(),
        b.startClientX = a.clientX,
        b.startClientY = a.clientY
    },
    onMouseUpResize: function() {
        var a = this
          , b = Fancy.get(document);
        delete a.activeResizeEl,
        a.resizeMaskEl.destroy(),
        delete a.startClientX,
        delete a.startClientY,
        b.un("mousemove", a.onMouseMoveResize, a),
        a.setWidth(a.newResizeWidth),
        a.setHeight(a.newResizeHeight),
        a.fire("resize", {
            width: a.newResizeWidth,
            height: a.newResizeHeight
        })
    },
    onMouseMoveResize: function(a) {
        var b = this
          , c = b.el
          , d = 2
          , e = (parseInt(c.css("width")) - 2 * d,
        parseInt(c.css("height")) - 2 * d,
        a.clientX)
          , f = a.clientY
          , g = b.startClientX - e
          , h = b.startClientY - f
          , i = b.startResizeWidth - g
          , j = b.startResizeHeight - h;
        a.preventDefault(),
        a.stopPropagation(),
        i < b.minWidth && (i = b.minWidth),
        j < b.minHeight && (j = b.minHeight),
        b.newResizeWidth = i,
        b.newResizeHeight = j,
        b.resizeMaskEl.css({
            width: i,
            height: j
        })
    },
    renderResizeMask: function() {
        var a = this
          , b = a.el
          , c = 2
          , d = Fancy.get(document.createElement("div"))
          , e = parseInt(b.css("top"))
          , f = parseInt(b.css("left"))
          , g = parseInt(b.css("width")) - 2 * c
          , h = parseInt(b.css("height")) - 2 * c
          , i = parseInt(b.css("z-index"));
        if (a.startResizeWidth = g,
        a.startResizeHeight = h,
        !a.window && "absolute" !== b.css("position")) {
            var j = b.offset();
            e = j.top,
            f = j.left
        }
        d.addClass(a.resizeMaskCls),
        d.css({
            left: f,
            top: e,
            width: g,
            height: h,
            "z-index": i
        }),
        a.resizeMaskEl = Fancy.get(document.body.appendChild(d.dom))
    }
}),
Fancy.define("Fancy.Panel", {
    extend: Fancy.Widget,
    barScrollEnabled: !0,
    mixins: ["Fancy.panel.mixin.DD", "Fancy.panel.mixin.Resize"],
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("constructor", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.initTpl(),
        a.render(),
        a.draggable && a.initDD(),
        a.resizable && a.initResize(),
        a.window && a.setActiveWindowWatcher()
    },
    cls: "fancy fancy-panel",
    panelSubHeaderCls: "fancy-panel-sub-header-text",
    value: "",
    width: 300,
    height: 200,
    titleHeight: 30,
    subTitleHeight: 30,
    barHeight: 37,
    title: void 0,
    frame: !0,
    shadow: !0,
    draggable: !1,
    minWidth: 200,
    minHeight: 200,
    barContainer: !0,
    theme: "default",
    tpl: ['<div style="height:{titleHeight}px;" class="fancy-panel-header fancy-display-none">', '<div class="fancy-panel-header-text">{title}</div>', '<div class="fancy-panel-header-tools"></div>', "</div>", '<div style="height:{subTitleHeight}px;" class="fancy-panel-sub-header fancy-display-none">', '<div class="fancy-panel-sub-header-text">{subTitle}</div>', "</div>", '<div class="fancy-panel-body">', '<div class="fancy-panel-tbar fancy-display-none" style="height:{barHeight}px;"></div>', '<div class="fancy-panel-sub-tbar fancy-display-none" style="height:{barHeight}px;"></div>', '<div class="fancy-panel-body-inner"></div>', '<div class="fancy-panel-bbar fancy-display-none" style="height:{barHeight}px;"></div>', '<div class="fancy-panel-buttons fancy-display-none" style="height:{barHeight}px;"></div>', '<div class="fancy-panel-footer fancy-display-none" style="height:{barHeight}px;"></div>', "</div>"],
    render: function() {
        var a = this
          , b = Fancy.get(a.renderTo || document.body)
          , c = Fancy.get(document.createElement("div"))
          , d = 0
          , e = a.titleHeight
          , f = a.subTitleHeight
          , g = "fancy-display-none";
        a.window === !0 && c.css({
            display: "none",
            position: "absolute"
        }),
        a.frame === !1 && c.addClass("fancy-panel-noframe"),
        c.addClass(a.cls),
        "default" !== a.theme && c.addClass("fancy-theme-" + a.theme),
        a.shadow && c.addClass("fancy-panel-shadow"),
        c.css({
            width: a.width + "px",
            height: a.height - d + "px"
        }),
        a.style && c.css(a.style);
        var h = ""
          , i = "";
        Fancy.isObject(a.title) ? h = a.title.text : Fancy.isString(a.title) && (h = a.title),
        Fancy.isObject(a.subTitle) ? i = a.subTitle.text : Fancy.isString(a.subTitle) && (i = a.subTitle),
        c.update(a.tpl.getHTML({
            barHeight: a.barHeight,
            titleHeight: e,
            subTitleHeight: f,
            title: h,
            subTitle: i
        })),
        Fancy.isObject(a.title) && (a.title.style && c.select(".fancy-panel-header").css(a.title.style),
        a.title.cls && c.select(".fancy-panel-header").addClass(a.title.cls),
        a.title.tools && (a.tools = a.title.tools)),
        Fancy.isObject(a.subTitle) && (a.subTitle.style && c.select(".fancy-panel-sub-header").css(a.subTitle.style),
        a.subTitle.cls && c.select(".fancy-panel-sub-header").addClass(a.subTitle.cls)),
        a.title ? c.select(".fancy-panel-header").removeClass(g) : c.select(".fancy-panel-body").css("border-top-width", "0px"),
        a.subTitle && (c.select(".fancy-panel-body").css("border-top-width", "0px"),
        c.select(".fancy-panel-sub-header").removeClass(g)),
        a.tbar && c.select(".fancy-panel-tbar").removeClass(g),
        a.subTBar && c.select(".fancy-panel-sub-tbar").removeClass(g),
        a.bbar && c.select(".fancy-panel-bbar").removeClass(g),
        a.buttons && c.select(".fancy-panel-buttons").removeClass(g),
        a.footer && c.select(".fancy-panel-footer").removeClass(g),
        a.el = b.dom.appendChild(c.dom),
        a.el = Fancy.get(a.el),
        a.modal && 0 === Fancy.select("fancy-modal").length && Fancy.get(document.body).append('<div class="fancy-modal" style="display: none;"></div>'),
        a.id && a.el.attr("id", a.id),
        a.renderTools(),
        a.renderBars(),
        a.setHardBordersWidth()
    },
    setHardBordersWidth: function() {
        var a = this
          , b = a.panelBodyBorders;
        a.el.select(".fancy-panel-body").css({
            "border-top-width": b[0],
            "border-right-width": b[1],
            "border-bottom-width": b[2],
            "border-left-width": b[3]
        })
    },
    renderTools: function() {
        var a = this
          , b = a.tools;
        if (void 0 !== b)
            for (var c = 0, d = b.length; d > c; c++)
                a.tools[c].renderTo = a.el.select(".fancy-panel-header-tools").dom,
                a.tools[c] = new Fancy.Tool(a.tools[c],a.scope || a)
    },
    initTpl: function() {
        var a = this;
        a.tpl = new Fancy.Template(a.tpl)
    },
    renderBars: function() {
        var a = this
          , b = !1
          , c = a.theme
          , d = this;
        a.items && a.items[0] && ("grid" === a.items[0].type && (b = !0),
        d = a.items[0]),
        a.bbar && (a._bbar = new Fancy.Bar({
            el: a.el.select(".fancy-panel-bbar"),
            items: a.bbar,
            height: a.barHeight,
            barContainer: a.barContainer,
            barScrollEnabled: a.barScrollEnabled,
            scope: d,
            theme: c
        }),
        a.bbar = a._bbar.items),
        a.buttons && (a._buttons = new Fancy.Bar({
            el: a.el.select(".fancy-panel-buttons"),
            items: a.buttons,
            height: a.barHeight,
            barScrollEnabled: a.barScrollEnabled,
            scope: d,
            theme: c
        }),
        a.buttons = a._buttons.items),
        a.tbar && (a._tbar = new Fancy.Bar({
            el: a.el.select(".fancy-panel-tbar"),
            items: a.tbar,
            height: a.barHeight,
            tabEdit: !a.subTBar && b,
            barScrollEnabled: a.barScrollEnabled,
            scope: d,
            theme: c
        }),
        a.tbar = a._tbar.items),
        a.subTBar && (a._subTBar = new Fancy.Bar({
            el: a.el.select(".fancy-panel-sub-tbar"),
            items: a.subTBar,
            height: a.barHeight,
            tabEdit: b,
            barScrollEnabled: a.barScrollEnabled,
            scope: d,
            theme: c
        }),
        a.subTBar = a._subTBar.items),
        a.footer && (a._footer = new Fancy.Bar({
            disableScroll: !0,
            el: a.el.select(".fancy-panel-footer"),
            items: a.footer,
            height: a.barHeight,
            barScrollEnabled: a.barScrollEnabled,
            scope: d,
            theme: c
        }),
        a.footer = a._footer.items)
    },
    showAt: function(a, b) {
        var c = this;
        c.css({
            left: a + "px",
            display: "",
            "z-index": 1e3 + Fancy.zIndex++
        }),
        void 0 !== b && c.css({
            top: b + "px"
        })
    },
    show: function() {
        var a = this;
        if (a.el.show(),
        a.window === !0) {
            a.buttons && a._buttons.checkScroll(),
            a.tbar && a._tbar.checkScroll(),
            a.bbar && a._bbar.checkScroll(),
            a.subTBar && a._subTBar.checkScroll();
            var b = Fancy.getViewSize()
              , c = a.el.height()
              , d = a.el.width()
              , e = []
              , f = Fancy.getScroll()
              , g = f[0]
              , h = f[1];
            e[0] = (b[1] - d) / 2,
            e[1] = (b[0] - c) / 2,
            e[0] < 10 && (e[0] = 10),
            e[1] < 10 && (e[1] = 10),
            a.css({
                left: e[0] + h + "px",
                top: e[1] + g + "px",
                display: "",
                "z-index": 1e3 + Fancy.zIndex++
            }),
            Fancy.select(".fancy-modal").css("display", "")
        }
    },
    hide: function() {
        var a = this;
        a.css({
            display: "none"
        }),
        Fancy.select(".fancy-modal").css("display", "none");
        for (var b = a.items || [], c = 0, d = b.length; d > c; c++)
            "combo" === a.items[c].type && a.items[c].hideList()
    },
    setTitle: function(a) {
        var b = this;
        b.el.select(".fancy-panel-header-text").update(a)
    },
    getTitle: function(a) {
        var b = this;
        return b.el.select(".fancy-panel-header-text").dom.innerHTML
    },
    setSubTitle: function(a) {
        var b = this;
        b.el.select("." + b.panelSubHeaderCls).update(a)
    },
    getSubTitle: function(a) {
        var b = this;
        return b.el.select("." + b.panelSubHeaderCls).dom.innerHTML
    },
    getHeight: function() {
        var a = this;
        return parseInt(a.css("height"))
    },
    setWidth: function(a) {
        var b = this;
        b.items[0].setWidth(a)
    },
    setHeight: function(a) {
        var b = this;
        b.css("height", a),
        b.items[0].setHeight(a, !1)
    },
    setActiveWindowWatcher: function() {
        var a = this;
        a.el.on("click", function(b) {
            var c = Fancy.get(b.target);
            c.hasClass("fancy-field-picker-button") || 1e3 + Fancy.zIndex - 1 > parseInt(a.css("z-index")) && a.css("z-index", 1e3 + Fancy.zIndex++)
        })
    }
}),
Fancy.define("Fancy.Tool", {
    extend: Fancy.Widget,
    constructor: function(a, b) {
        var c = this;
        c.scope = b,
        c.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("click", "mousedown", "mouseup", "mouseover", "mouseout"),
        a.Super("init", arguments),
        a.style = a.style || {},
        a.render(),
        a.setOns()
    },
    setOns: function() {
        var a = this
          , b = a.el;
        b.on("click", a.onClick, a)
    },
    cls: "fancy fancy-button",
    text: "",
    height: 28,
    paddingTextWidth: 5,
    render: function() {
        var a = this
          , b = Fancy.get(a.renderTo || document.body).dom
          , c = document.createElement("div");
        a.fire("beforerender"),
        c.className = "fancy-tool-button",
        c.innerHTML = a.text,
        a.el = Fancy.get(b.appendChild(c)),
        a.fire("afterrender"),
        a.fire("render")
    },
    onClick: function() {
        var a = this;
        a.fire("click"),
        a.handler && (a.scope ? a.handler.apply(a.scope, [a]) : a.handler(a))
    },
    setText: function(a) {
        var b = this;
        b.el.update(a)
    }
}),
Fancy.define(["Fancy.panel.Tab", "Fancy.Tab", "FancyTab"], {
    extend: Fancy.Panel,
    constructor: function(a, b) {
        var c = this;
        c.prepareConfigTheme(a),
        c.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.prepareTabs(),
        a.Super("init", arguments),
        a.setActiveTab(a.activeTab)
    },
    tabWrapperCls: "fancy-tab-wrapper",
    activeTabWrapperCls: "fancy-active-tab-wrapper",
    activeTabTBarButtonCls: "fancy-toolbar-tab-active",
    activeTab: 0,
    theme: "default",
    render: function() {
        var a = this;
        a.Super("render", arguments),
        a.panelBodyEl = a.el.select(".fancy-panel-body-inner").item(0),
        a.setPanelBodySize(),
        a.renderTabWrappers(),
        a.wrapped || a.el.addClass("fancy-panel-grid-inside"),
        a.el.addClass("fancy-panel-tab"),
        a.rendered = !0
    },
    setPanelBodySize: function() {
        var a = this
          , b = a.height
          , c = a.panelBodyBorders;
        a.title && (b -= a.titleHeight),
        a.subTitle && (b -= a.subTitleHeight,
        b += c[2]),
        a.bbar && (b -= a.barHeight),
        a.tbar && (b -= a.barHeight),
        a.subTBar && (b -= a.barHeight),
        a.buttons && (b -= a.barHeight),
        a.footer && (b -= a.barHeight),
        b -= c[0] + c[2],
        a.panelBodyEl.css({
            height: b
        }),
        a.panelBodyHeight = b,
        a.panelBodyWidth = a.width - c[1] - c[3]
    },
    prepareConfigTheme: function(a) {
        var b = this
          , c = a.theme || b.theme
          , d = Fancy.getTheme(c).config
          , e = b.wrapped || a.wrapped;
        e && (a.panelBodyBorders = [0, 0, 0, 0],
        b.panelBodyBorders = [0, 0, 0, 0]),
        Fancy.applyIf(a, d),
        Fancy.apply(b, a)
    },
    prepareTabs: function() {
        for (var a = this, b = [], c = 0, d = a.items.length; d > c; c++) {
            var e = a.items[c]
              , f = {
                type: "tab"
            };
            e.tabTitle ? f.text = e.tabTitle : e.title && (f.text = e.title,
            delete e.title),
            f.handler = function(b) {
                return function() {
                    a.setActiveTab(b)
                }
            }(c),
            b.push(f)
        }
        a.tbar = b,
        a.tabs = b
    },
    renderTabWrappers: function() {
        for (var a = this, b = 0, c = a.items.length; c > b; b++) {
            var d = Fancy.get(document.createElement("div"));
            d.addClass(a.tabWrapperCls),
            a.items[b].renderTo = a.panelBodyEl.dom.appendChild(d.dom)
        }
    },
    setActiveTab: function(a) {
        var b = this
          , c = b.activeTabWrapperCls
          , d = b.el.select("." + b.tabWrapperCls)
          , e = b.activeTab;
        if (0 !== b.items.length) {
            d.item(b.activeTab).removeClass(c),
            b.activeTab = a,
            d.item(b.activeTab).addClass(c);
            var f = b.items[b.activeTab];
            if (f.theme = b.theme,
            f.wrapped = !0,
            f.width = b.panelBodyWidth,
            f.height = b.panelBodyHeight,
            f.rendered)
                b.setActiveItemWidth(),
                b.setActiveItemHeight();
            else
                switch (f.type) {
                case "grid":
                    b.items[b.activeTab] = new FancyGrid(f);
                    break;
                case "tab":
                    b.items[b.activeTab] = new FancyTab(f)
                }
            b.tabs && (b.tbar[e].removeClass(b.activeTabTBarButtonCls),
            b.tbar[b.activeTab].addClass(b.activeTabTBarButtonCls))
        }
    },
    setWidth: function(a) {
        var b = this;
        b.width = a,
        b.css("width", a),
        b.setPanelBodySize(),
        b.setActiveItemWidth()
    },
    setHeight: function(a) {
        var b = this;
        b.height = a,
        b.css("height", a),
        b.setPanelBodySize(),
        b.setActiveItemHeight()
    },
    setActiveItemWidth: function() {
        var a = this;
        a.items[a.activeTab].setWidth(a.panelBodyWidth)
    },
    setActiveItemHeight: function() {
        var a = this;
        a.items[a.activeTab].setHeight(a.panelBodyHeight, !1)
    }
}),
Fancy.define("Fancy.toolbar.Tab", {
    extend: Fancy.Button,
    constructor: function(a, b) {
        var c = this;
        c.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments)
    },
    cls: "fancy fancy-button fancy-toolbar-tab",
    render: function() {
        var a = this;
        a.Super("render", arguments)
    }
}),
Fancy.define("Fancy.Bar", {
    extend: Fancy.Widget,
    widgetCls: "fancy-bar",
    containerCls: "fancy-bar-container",
    cls: "",
    text: "",
    floating: "left",
    sideRight: 0,
    scrolled: 0,
    tabOffSet: 5,
    barScrollEnabled: !0,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.roles = {},
        a.render(),
        a.barScrollEnabled && (a.initScroll(),
        setTimeout(function() {
            a.checkScroll()
        }, 50))
    },
    render: function() {
        var a = this;
        a.renderEl(),
        a.renderItems(),
        a.initTabEdit()
    },
    renderEl: function() {
        var a = this;
        if (!a.el) {
            var b = Fancy.get(document.createElement("div"));
            b.addClass(a.widgetCls),
            b.addClass(a.cls),
            b.update(a.text),
            a.el = Fancy.get(a.renderTo.appendChild(b.dom)),
            a.style && a.el.css(a.style)
        }
        var c = Fancy.get(document.createElement("div"));
        c.addClass(a.containerCls),
        a.containerEl = Fancy.get(a.el.dom.appendChild(c.dom))
    },
    renderItems: function() {
        for (var a = this, b = (a.el,
        a.containerEl), c = a.items || [], d = 0, e = c.length, f = !1, g = [], h = e - 1; e > d; d++) {
            var i = c[d];
            switch (f && (i = c[h],
            h--),
            i.toggleGroup && (i.enableToggle = !0),
            Fancy.isObject(i) && (i.type = i.type || "button"),
            f && (a.floating = "right"),
            i.renderTo = b.dom,
            i) {
            case "|":
                var j = {
                    "float": a.floating,
                    "margin-right": "5px",
                    "margin-top": "6px",
                    "padding-left": "0px"
                };
                "right" === a.floating && Fancy.applyIf(j, {
                    right: "1px",
                    position: "absolute"
                }),
                g.push(new Fancy.Separator({
                    renderTo: b.dom,
                    style: j
                }));
                continue;
            case "side":
                f = !0;
                continue;
            default:
                f ? g[h] = a.renderItem(i) : g.push(a.renderItem(i))
            }
        }
        a.items = g
    },
    renderItem: function(a) {
        var b, c = this, d = (c.el,
        c.containerEl), e = c.theme;
        switch (a.style = a.style || {},
        a.label = !1,
        a.padding = !1,
        Fancy.applyIf(a.style, {
            "float": c.floating
        }),
        "right" === c.floating && Fancy.applyIf(a.style, {
            right: c.sideRight,
            position: "absolute"
        }),
        !a.scope && c.items && (a.scope = c.items[0]),
        a.type) {
        case "wrapper":
            "fancy-month-picker-action-buttons" === a.cls && (d.destroy(),
            d = c.el);
            for (var f, g = d.append('<div class="' + (a.cls || "") + '"></div>').select("div").item(0), h = 0, i = a.items.length, j = 0; i > h; h++) {
                f = a.items[h],
                Fancy.isObject(f) && (f.type = f.type || "button"),
                f.renderTo = g.dom,
                b = c.renderItem(f);
                var k = b.el;
                h === i - 1 ? k.css("margin-right", "0px") : j += parseInt(k.css("margin-right")),
                Fancy.nojQuery ? (j += parseInt(k.width()),
                j += parseInt(k.css("margin-left"))) : j += parseInt(k.$dom.outerWidth()),
                j += parseInt(k.css("padding-left")),
                j += parseInt(k.css("padding-right"))
            }
            g.css("width", j);
            break;
        case void 0:
        case "button":
            a.extraCls = "fancy-bar-button",
            a.scope = c.scope,
            b = new Fancy.Button(a);
            break;
        case "segbutton":
            a.extraCls = "fancy-bar-seg-button",
            b = new Fancy.SegButton(a);
            break;
        case "tab":
            isTab = !0,
            b = new Fancy.toolbar.Tab(a);
            break;
        case "text":
            Fancy.applyIf(a.style, {
                "margin-right": "10px",
                "padding-left": "0px",
                "padding-top": "11px"
            }),
            Fancy.apply(a, {
                renderTo: d.dom,
                cls: a.cls || ""
            }),
            b = new Fancy.bar.Text(a);
            break;
        case "combo":
            a.inputWidth = 18,
            Fancy.applyIf(a.style, {
                "padding-left": "0px",
                "margin-right": "8px",
                "margin-top": "4px"
            }),
            Fancy.applyIf(a, {
                width: 70
            }),
            b = new Fancy.Combo(a);
            break;
        case "date":
            a.inputWidth = 18,
            Fancy.applyIf(a.style, {
                "padding-left": "0px",
                "margin-right": "8px",
                "margin-top": "4px"
            }),
            Fancy.applyIf(a, {
                width: 100
            }),
            b = new Fancy.DateField(a);
            break;
        case "number":
            a.inputWidth = 18,
            Fancy.applyIf(a.style, {
                "padding-left": "0px",
                "margin-right": "8px",
                "margin-top": "4px"
            }),
            Fancy.applyIf(a, {
                width: 35
            }),
            b = new Fancy.NumberField(a);
            break;
        case "string":
            a.inputWidth = 18,
            Fancy.applyIf(a.style, {
                "padding-left": "0px",
                "margin-right": "8px",
                "margin-top": "4px"
            }),
            Fancy.applyIf(a, {
                width: 100
            }),
            b = new Fancy.StringField(a);
            break;
        case "search":
            a.inputWidth = 18,
            a.events = a.events || [],
            a.events = a.events.concat([{
                enter: function(a, b) {
                    var c = Fancy.getWidget(a.el.parent().parent().parent().parent().select(".fancy-grid").attr("id"));
                    c.search(b)
                }
            }, {
                key: function(a, b) {
                    var c = this
                      , d = Fancy.getWidget(a.el.parent().parent().parent().parent().select(".fancy-grid").attr("id"));
                    c.autoEnterTime || (c.autoEnterTime = new Date),
                    c.intervalAutoEnter && clearInterval(c.intervalAutoEnter),
                    delete c.intervalAutoEnter,
                    c.intervalAutoEnter = setInterval(function() {
                        var e = new Date;
                        e - c.autoEnterTime > 500 && (clearInterval(c.intervalAutoEnter),
                        delete c.intervalAutoEnter,
                        b = a.getValue(),
                        d.search(b))
                    }, 200)
                }
            }, {
                render: function(a) {
                    var b = this
                      , c = !1;
                    a.el.on("mouseenter", function() {
                        c = !0
                    }, null, ".fancy-field-search-params-link"),
                    a.el.on("mousedown", function(a) {
                        a.preventDefault()
                    }, null, ".fancy-field-search-params-link"),
                    a.el.on("click", function(d) {
                        for (var f = !1, g = Fancy.getWidget(a.el.parent().parent().parent().parent().select(".fancy-grid").attr("id")), h = g.columns || [], i = g.leftColumns || [], j = g.rightColumns || [], k = h.concat(i).concat(j), l = [], m = 0, n = k.length, o = 1; n > m; m++) {
                            var p = k[m]
                              , q = p.title;
                            if (void 0 === q && (q = ""),
                            p.searchable !== !1) {
                                switch (p.type) {
                                case "color":
                                case "combo":
                                case "date":
                                case "number":
                                case "string":
                                case "text":
                                case "currency":
                                    break;
                                default:
                                    continue
                                }
                                o += g.fieldHeight,
                                l.push({
                                    inputLabel: " &nbsp;&nbsp;" + q,
                                    value: !0,
                                    name: p.index
                                })
                            }
                        }
                        if (b.list) {
                            if ("none" !== b.list.el.css("display"))
                                return void b.list.el.css("display", "none");
                            f = !0
                        } else
                            b.list = new FancyForm({
                                width: 150,
                                height: o,
                                theme: e,
                                defaults: {
                                    type: "checkbox",
                                    label: !1,
                                    style: {
                                        padding: "8px 16px 0px"
                                    }
                                },
                                items: l,
                                cls: "fancy-field-search-list",
                                events: [{
                                    set: function(a, c) {
                                        g.searching.setKeys(b.list.get())
                                    }
                                }, {
                                    init: function() {
                                        setTimeout(function() {
                                            var e = b.list.el;
                                            e.on("mouseenter", function() {
                                                c = !0
                                            }),
                                            e.on("mouseleave", function() {
                                                c = !1,
                                                setTimeout(function() {
                                                    c === !1 && b.list && e.css("display", "none")
                                                }, 750)
                                            });
                                            var f = Fancy.get(d.target)
                                              , g = f.offset()
                                              , h = parseInt(a.el.css("height"));
                                            e.css({
                                                position: "absolute",
                                                top: g.top + h + 20,
                                                left: g.left
                                            }),
                                            b.list.el.css("display", "block"),
                                            e.animate({
                                                duration: 200,
                                                top: g.top + h - 1
                                            })
                                        }, 50)
                                    }
                                }]
                            });
                        var r = Fancy.get(d.target)
                          , s = r.offset()
                          , t = parseInt(a.el.css("height"));
                        b.list && b.list.el && (b.list.css({
                            position: "absolute",
                            top: s.top + t + 20,
                            left: s.left
                        }),
                        f && b.list.css("display", "block"),
                        b.list.el.animate({
                            duration: 200,
                            top: s.top + t - 1
                        }))
                    }, null, ".fancy-field-search-params-link"),
                    a.el.on("mouseleave", function() {
                        c = !1,
                        setTimeout(function() {
                            c === !1 && b.list && b.list.el.css("display", "none")
                        }, 750)
                    }, null, ".fancy-field-search-params-link")
                }
            }]),
            Fancy.applyIf(a.style, {
                "float": c.floating,
                "padding-left": "0px",
                "margin-right": "8px",
                "margin-top": "4px"
            });
            var l = "fancy-field-search";
            a.paramsMenu && (a.tpl = ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}" value="{value}">', '<div class="fancy-field-search-params-link" style="">' + (a.paramsText || "&nbsp;") + "</div>", "</div>", '<div class="fancy-clearfix"></div>'],
            l += " fancy-field-search-paramed",
            a.paramsText || (l += " fancy-field-search-paramed-empty")),
            Fancy.applyIf(a, {
                padding: !1,
                width: 250,
                cls: l,
                emptyText: "Search"
            }),
            b = new Fancy.StringField(a)
        }
        return "right" === c.floating && (c.sideRight += b.width,
        c.sideRight += 7),
        a.role && (c.roles[a.role] = b),
        b
    },
    initScroll: function() {
        var a = this;
        Fancy.getTheme(a.theme).config.panelBodyBorders;
        a.leftScroller = new Fancy.Button({
            imageCls: !0,
            renderTo: a.el.dom,
            cls: "fancy-bar-left-scroller",
            height: a.height + 2,
            minWidth: 20,
            paddingTextWidth: 0,
            imageWidth: 20,
            width: 0,
            text: !1,
            id: "my",
            style: {
                position: "absolute",
                left: -1,
                top: -1,
                display: "none"
            },
            listeners: [{
                click: a.onPrevScrollClick,
                scope: a
            }]
        }),
        a.rightScroller = new Fancy.Button({
            imageCls: !0,
            renderTo: a.el.dom,
            cls: "fancy-bar-right-scroller",
            height: a.height + 2,
            minWidth: 20,
            paddingTextWidth: 0,
            imageWidth: 20,
            width: 0,
            text: !1,
            style: {
                position: "absolute",
                right: -1,
                top: -1,
                display: "none"
            },
            listeners: [{
                click: a.onNextScrollClick,
                scope: a
            }]
        })
    },
    getBarWidth: function() {
        var a = this;
        return parseInt(a.el.css("width"))
    },
    getItemsWidth: function() {
        for (var a = this, b = 0, c = a.items.length, d = 0; c > b; b++) {
            var e = a.items[b];
            d += e.el.width(),
            d += parseInt(e.el.css("margin-left")),
            d += parseInt(e.el.css("margin-right")),
            d += parseInt(e.el.css("padding-right")),
            d += parseInt(e.el.css("padding-left"))
        }
        return d
    },
    onPrevScrollClick: function() {
        var a = this;
        a.scrolled += 30,
        a.applyScrollChanges()
    },
    onNextScrollClick: function() {
        var a = this;
        a.scrolled -= 30,
        a.applyScrollChanges()
    },
    applyScrollChanges: function() {
        var a = this
          , b = a.getItemsWidth()
          , c = a.getBarWidth() - parseInt(a.leftScroller.el.css("width")) - parseInt(a.rightScroller.el.css("width"))
          , d = b - c;
        return c > b ? (a.scrolled = 0,
        a.leftScroller.el.hide(),
        a.rightScroller.el.hide(),
        void a.containerEl.css("margin-left", "0px")) : (a.scrolled > 0 ? (a.scrolled = 0,
        a.leftScroller.disable(),
        a.rightScroller.enable()) : a.scrolled < -d && (a.scrolled = -d,
        a.leftScroller.enable(),
        a.rightScroller.disable()),
        a.leftScroller.el.show(),
        a.rightScroller.el.show(),
        void a.containerEl.css("margin-left", a.scrolled + a.leftScroller.el.width() + a.tabOffSet + "px"))
    },
    onDocMouseUp: function() {
        var a = this;
        a.scrollInterval && (clearTimeout(a.scrollInterval),
        delete a.scrollInterval)
    },
    checkScroll: function() {
        var a = this
          , b = a.getItemsWidth()
          , c = a.getBarWidth();
        a.disableScroll || (b > c ? a.enableScroll() : (a.leftScroller.el.hide(),
        a.rightScroller.el.hide()))
    },
    enableScroll: function() {
        var a = this;
        a.leftScroller.el.show(),
        a.rightScroller.el.show(),
        0 === a.scrolled && (a.leftScroller.disable(),
        a.containerEl.css("margin-left", a.leftScroller.el.width() + a.tabOffSet + "px"))
    },
    initTabEdit: function() {
        var a = this;
        if (a.tabEdit)
            for (var b = a.items.length - 1; b > -1; b--) {
                var c = a.items[b];
                switch (c.type) {
                case "number":
                case "string":
                case "date":
                    return void c.on("tab", a.onTabLastInput, a)
                }
            }
    },
    onTabLastInput: function(a, b) {
        var c = this
          , d = Fancy.getWidget(c.el.parent().select(".fancy-grid").attr("id"));
        b.preventDefault(),
        d.leftColumns.length ? setTimeout(function() {
            d.leftBody.el.select(".fancy-grid-cell").item(0).dom.click()
        }, 100) : setTimeout(function() {
            d.body.el.select(".fancy-grid-cell").item(0).dom.click()
        }, 100)
    }
}),
Fancy.define("Fancy.Separator", {
    cls: "fancy-separator",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.render()
    },
    render: function() {
        var a = this
          , b = Fancy.get(document.createElement("div"));
        b.addClass(a.cls),
        b.update("<div></div>"),
        a.el = Fancy.get(a.renderTo.appendChild(b.dom)),
        a.style && a.el.css(a.style)
    }
}),
Fancy.define("Fancy.bar.Text", {
    widgetCls: "fancy-bar-text",
    cls: "",
    text: "",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.render()
    },
    render: function() {
        var a = this
          , b = Fancy.get(document.createElement("div"));
        b.addClass(a.widgetCls),
        b.addClass(a.cls),
        b.update(a.text),
        a.el = Fancy.get(a.renderTo.appendChild(b.dom)),
        a.style && a.el.css(a.style)
    }
}),
Fancy.Mixin("Fancy.form.mixin.Form", {
    init: function() {
        var a = this;
        return a.calcFieldSize(),
        a.Super("init", arguments),
        a.addEvents("init", "set"),
        Fancy.fullBuilt !== !0 && Fancy.MODULELOAD !== !1 && a.fullBuilt !== !0 && a.neededModules !== !0 ? void a.loadModules() : (a.fire("beforerender"),
        a.applyDefaults(),
        a.preRender(),
        a.render(),
        a.ons(),
        void a.fire("init"))
    },
    cls: "",
    widgetCls: "fancy fancy-form",
    value: "",
    width: 200,
    height: 300,
    emptyText: "",
    tpl: ['<div class="fancy-form-body">', "</div>"],
    preRender: function() {
        var a = this;
        a.initRenderTo(),
        (a.title || a.tbar || a.bbar || a.buttons) && a.renderPanel()
    },
    renderPanel: function() {
        var a = this
          , b = {
            renderTo: a.renderTo,
            title: a.title,
            subTitle: a.subTitle,
            subTitleHeight: a.subTitleHeight,
            width: a.width,
            height: a.height,
            titleHeight: a.titleHeight,
            barHeight: a.barHeight,
            theme: a.theme,
            shadow: a.shadow,
            style: a.style || {},
            window: a.window,
            modal: a.modal,
            frame: a.frame,
            items: [a],
            tabs: a.tabs,
            draggable: a.draggable,
            minWidth: a.minWidth,
            minHeight: a.minHeight,
            panelBodyBorders: a.panelBodyBorders,
            resizable: a.resizable
        };
        a.tabs && (b.tbar = a.generateTabs(),
        a.height -= a.barHeight),
        a.bbar && (b.bbar = a.bbar,
        a.height -= a.barHeight),
        a.tbar && (b.tbar = a.tbar,
        a.height -= a.barHeight),
        a.buttons && (b.buttons = a.buttons,
        a.height -= a.barHeight,
        b.buttons = a.buttons),
        a.footer && (b.footer = a.footer,
        a.height -= a.barHeight),
        a.panel = new Fancy.Panel(b),
        a.bbar = a.panel.bbar,
        a.tbar = a.panel.tbar,
        a.buttons = a.panel.buttons,
        a.wrapped || a.panel.addClass("fancy-panel-grid-inside"),
        a.title && (a.height -= a.titleHeight),
        a.subTitle && (a.height -= a.subTitleHeight,
        a.height += a.panelBodyBorders[2]),
        a.height -= a.panelBorderWidth,
        a.renderTo = a.panel.el.select(".fancy-panel-body-inner").dom
    },
    initRenderTo: function() {
        var a = this
          , b = a.renderTo || document.body;
        Fancy.isString(b) && (b = document.getElementById(b),
        b || (b = Fancy.select(b).item(0))),
        a.renderTo = b
    },
    render: function() {
        var a = this
          , b = a.renderTo
          , c = Fancy.get(document.createElement("div"));
        c.addClass(a.cls),
        c.addClass(a.widgetCls),
        c.attr("id", a.id),
        c.css({
            width: a.width + "px",
            height: a.height + "px"
        }),
        c.update(a.tpl.join(" ")),
        a.el = Fancy.get(Fancy.get(b).dom.appendChild(c.dom)),
        void 0 === a.panel && (a.shadow && c.addClass("fancy-panel-shadow"),
        "default" !== a.theme && c.addClass("fancy-theme-" + a.theme)),
        a._items = [],
        a.renderItems(),
        a.items = a._items,
        delete a._items,
        (a.tabs || a.tabbed) && a.setActiveTab(),
        a.fire("afterrender"),
        a.fire("render")
    },
    generateTabs: function() {
        var a = this
          , b = [];
        if (a.tabs)
            for (var c = 0, d = a.tabs.length; d > c; c++) {
                var e = {
                    type: "tab"
                };
                Fancy.isString(a.tabs[c]) ? e.text = a.tabs[c] : e = a.tabs[c],
                a.tabs[c] = e,
                void 0 === a.tabs[c].handler && (a.tabs[c].handler = function(b) {
                    return function() {
                        a.setActiveTab(b)
                    }
                }(c)),
                b.push(a.tabs[c])
            }
        return b
    },
    setActiveTab: function(a) {
        var b = this
          , c = b.el.select(".fancy-field-tab")
          , d = b.el.select(".fancy-field-tab-active");
        if (void 0 !== a && (b.activeTab = a),
        void 0 === b.activeTab && (b.activeTab = 0),
        d.removeClass("fancy-field-tab-active"),
        c.item(b.activeTab).addClass("fancy-field-tab-active"),
        b.tabs) {
            var e = b.panel.el.select(".fancy-panel-tbar .fancy-toolbar-tab");
            e.removeClass("fancy-toolbar-tab-active"),
            e.item(b.activeTab).addClass("fancy-toolbar-tab-active")
        }
    },
    renderItems: function(a, b) {
        var c, d = this, e = 0;
        for (b = b || d.items,
        c = b.length,
        a = a || d.el.getByClass("fancy-form-body"); c > e; e++) {
            var f, g = b[e];
            switch (g.theme = d.theme,
            g.type) {
            case "pass":
            case "password":
                f = Fancy.form.field.String,
                g.type = "string",
                g.isPassword = !0;
                break;
            case "hidden":
                f = Fancy.form.field.String,
                g.hidden = !0;
                break;
            case "line":
            case "row":
                f = Fancy.form.field.Line,
                g = d.applyDefaults(g);
                break;
            case "set":
            case "fieldset":
                g.form = d,
                f = Fancy.form.field.Set,
                g = d.applyDefaults(g);
                break;
            case "tab":
                f = Fancy.form.field.Tab,
                g = d.applyDefaults(g);
                break;
            case "string":
                f = Fancy.form.field.String;
                break;
            case "number":
                f = Fancy.form.field.Number;
                break;
            case "textarea":
                f = Fancy.form.field.TextArea;
                break;
            case "checkbox":
                f = Fancy.form.field.CheckBox;
                break;
            case "switcher":
                f = Fancy.form.field.Switcher;
                break;
            case "combo":
                f = Fancy.form.field.Combo;
                break;
            case "html":
                f = Fancy.form.field.HTML;
                break;
            case "radio":
                f = Fancy.form.field.Radio;
                break;
            case "date":
                f = Fancy.form.field.Date;
                break;
            case "recaptcha":
                f = Fancy.form.field.ReCaptcha;
                break;
            case "button":
                f = Fancy.form.field.Button;
                break;
            case "segbutton":
                f = Fancy.form.field.SegButton;
                break;
            default:
                throw new Error("type " + g.type + " is not set")
            }
            g.renderTo = g.renderTo || a;
            var h = new f(g);
            switch (g.type) {
            case "line":
            case "row":
            case "set":
            case "fieldset":
            case "tab":
                d.renderItems(h.el.select(".fancy-field-text").dom, h.items);
                break;
            default:
                d._items.push(h)
            }
        }
    },
    applyDefaults: function(a) {
        var b = this;
        {
            if (void 0 !== a) {
                var c, d;
                if (a.defaults)
                    for (c = 0,
                    d = a.items.length; d > c; c++)
                        Fancy.applyIf(a.items[c], a.defaults);
                return a
            }
            for (var e = b.items, f = 0, g = e.length, h = b.defaults || {}; g > f; f++)
                Fancy.applyIf(e[f], h)
        }
    },
    ons: function() {
        var a = this;
        Fancy.each(a.items, function(b) {
            switch (b.type) {
            case "line":
            case "row":
                break;
            case "set":
            case "fieldset":
                break;
            case "tab":
            case "button":
            case "segbutton":
                break;
            default:
                b.on("change", a.onChange, a)
            }
        })
    },
    onChange: function(a, b, c) {
        var d = this;
        d.fire("set", {
            name: a.name,
            value: b,
            oldValue: c
        })
    },
    get: function(a) {
        var b = this;
        if (a) {
            var c;
            return Fancy.each(b.items, function(b) {
                switch (b.type) {
                case "html":
                case "button":
                    return
                }
                return b.name === a ? (c = b.get(),
                !0) : void 0
            }),
            c
        }
        var d = {};
        return Fancy.each(b.items, function(a) {
            switch (a.type) {
            case "html":
            case "button":
                return
            }
            d[a.name] = a.get()
        }),
        d
    },
    set: function(a, b) {
        var c = this;
        {
            if (!Fancy.isObject(a))
                return a ? (Fancy.each(c.items, function(c) {
                    c.name === a && c.set(b)
                }),
                b) : void 0;
            for (var d in a)
                c.set(d, a[d])
        }
    },
    clear: function(a) {
        var b = this;
        Fancy.each(b.items, function(c) {
            switch (c.type) {
            case "html":
            case "recaptcha":
            case "button":
                return
            }
            a !== !1 && c.clear(),
            b.hasClass("fancy-field-not-valid") && (b.removeClass("fancy-field-not-valid"),
            b.css("height", parseInt(b.css("height")) - 6 + "px")),
            b.hasClass("fancy-field-blank-err") && (b.removeClass("fancy-field-blank-err"),
            b.css("height", parseInt(b.css("height")) - 6 + "px")),
            c.name && b.params && b.params[c.name] && delete b.params[c.name]
        })
    },
    submit: function(a) {
        var b = this
          , a = a || {}
          , c = b.params || {};
        if (b.params = b.params || {},
        Fancy.apply(b, a),
        a.params && (Fancy.apply(c, b.params),
        b.params = c),
        b.clear(!1),
        b.valid() !== !1) {
            var d = b.get();
            return Fancy.apply(b.params, d),
            "wait" === b.params.recaptcha ? void b.submit(a) : void ("" !== b.params.recaptcha && (b.params["g-recaptcha-response"] = b.params.recaptcha,
            delete b.params.recaptcha,
            Fancy.Ajax(b)))
        }
    },
    valid: function() {
        var a = this
          , b = !0;
        return Fancy.each(a.items, function(a) {
            b === !0 ? b = a.onBlur() : a.onBlur()
        }),
        b
    },
    getItem: function(a) {
        var b = this
          , c = !1;
        return Fancy.each(b.items, function(b) {
            return b.name === a ? (c = b,
            !0) : void 0
        }),
        c
    },
    showAt: function() {
        var a = this;
        a.panel && a.panel.showAt.apply(a.panel, arguments)
    },
    show: function() {
        var a = this;
        a.panel ? a.panel.show.apply(a.panel, arguments) : a.el.show()
    },
    hide: function() {
        var a = this;
        a.panel ? a.panel.css({
            display: "none"
        }) : a.css({
            display: "none"
        });
        var b = Fancy.select(".fancy-modal");
        b.dom && b.css("display", "none");
        for (var c = 0, d = a.items.length; d > c; c++)
            "combo" === a.items[c].type && a.items[c].hideList()
    },
    setHeight: function(a) {
        var b = this;
        b.panel && (b.panel.css("height", a),
        b.buttons && (a -= b.barHeight),
        b.bbar && (a -= b.barHeight),
        (b.tbar || b.tabs) && (a -= b.barHeight),
        b.title && (a -= b.titleHeight),
        a -= b.panelBodyBorders[0],
        a -= b.panelBodyBorders[2]),
        b.css("height", a)
    },
    setWidth: function() {},
    getHeight: function() {
        var a = this;
        return a.panel ? a.panel.getHeight() : parseInt(a.css("height"))
    },
    calcFieldSize: function() {
        var a = this
          , b = a.width
          , c = a.defaults || {}
          , d = a.labelWidth
          , e = a.maxLabelNumber;
        c.width = b - 2 * a.panelBorderWidth,
        void 0 === d && (Fancy.each(a.items, function(c) {
            switch (c.type) {
            case "set":
            case "tab":
                "tab" === c.type && (a.tabbed = !0);
                var d = "set" === c.type ? 62 : 20;
                Fancy.each(c.items, function(a) {
                    void 0 === a.width && (a.width = b - d),
                    a.label && a.label.length > e && (e = a.label.length)
                }),
                c.defaults = c.defaults || {},
                c.defaults.labelWidth = c.defaults.labelWidth || 8 * (e + 1);
                break;
            case "line":
                var f = c.items.length
                  , g = !1
                  , h = (b - 8 - 8 - 8) / f;
                Fancy.each(c.items, function(a) {
                    (a.labelWidth || a.inputWidth) && (g = !0)
                }),
                g === !1 && Fancy.each(c.items, function(a) {
                    a.width = h,
                    "top" === a.labelAlign && (a.labelWidth = h)
                }),
                c.defaults = c.defaults || {};
                break;
            default:
                c.label && c.label.length > e && (e = c.label.length)
            }
        }),
        e++,
        d = 8 * e,
        50 > d && (d = 50)),
        c.labelWidth = d,
        a.inputWidth && (c.inputWidth = a.inputWidth),
        a.defaults = c
    },
    destroy: function() {
        var a = this;
        a.el.destroy(),
        a.panel && a.panel.el.destroy()
    },
    each: function(a, b) {
        var c = this
          , d = c.items
          , e = 0
          , f = d.length;
        if (b)
            for (; f > e; e++)
                a.apply(this, [d[e]]);
        else
            for (; f > e; e++)
                a(d[e])
    },
    loadModules: function() {
        var a = this
          , b = Fancy.modules || {}
          , c = {}
          , d = a.items || [];
        Fancy.modules = b,
        Fancy.nojQuery && (c.dom = !0),
        Fancy.isTouch && (c.touch = !0);
        for (var e = 0, f = d.length; f > e; e++) {
            var g = d[e];
            if ("date" === g.type && (c.grid = !0,
            c.selection = !0,
            c.date = !0),
            g.items)
                for (var h = 0, i = g.items.length; i > h; h++) {
                    var j = g.items[h];
                    "date" === j.type && (c.grid = !0,
                    c.selection = !0,
                    c.date = !0)
                }
        }
        a.neededModules = {
            length: 0
        };
        for (var k in c)
            void 0 === Fancy.modules[k] && (a.neededModules[k] = !0,
            a.neededModules.length++);
        if (0 === a.neededModules.length)
            return a.neededModules = !0,
            void a.init();
        var l = function(b) {
            delete a.neededModules[b],
            a.neededModules.length--,
            0 === a.neededModules.length && (a.neededModules = !0,
            a.init())
        };
        for (var k in a.neededModules)
            "length" !== k && Fancy.loadModule(k, l)
    },
    prevTab: function() {
        var a = this;
        a.activeTab--,
        a.activeTab < 0 && (a.activeTab = 0),
        a.setActiveTab()
    },
    nextTab: function() {
        var a = this
          , b = a.el.select(".fancy-field-tab").length;
        a.activeTab++,
        a.activeTab >= b && (a.activeTab = b - 1),
        a.setActiveTab()
    }
}),
Fancy.Mixin("Fancy.form.mixin.PrepareConfig", {
    prepareConfig: function(a, b) {
        var c = this;
        return a = c.prepareConfigTheme(a, b),
        a = c.prepareConfigLang(a, b),
        a = c.prepareConfigDefaults(a),
        a = c.prepareConfigItems(a),
        a = c.prepareConfigFooter(a)
    },
    prepareConfigDefaults: function(a) {
        if (a.defaults)
            for (var b in a.defaults)
                Fancy.each(a.items, function(c) {
                    void 0 === c[b] && (c[b] = a.defaults[b])
                });
        return a
    },
    prepareConfigItems: function(a) {
        var b = this;
        return Fancy.each(a.items, function(a) {
            a.theme = b.theme || "",
            void 0 === a.labelWidth && (a.labelWidth = b.labelWidth),
            void 0 === a.inputWidth && (a.inputWidth = b.inputWidth),
            ("pass" === a.type || "password" === a.type) && (a.type = "string",
            a.isPassword = !0)
        }),
        a
    }
}),
Fancy.define("Fancy.Form", {
    extend: Fancy.Widget,
    mixins: ["Fancy.form.mixin.Form", Fancy.panel.mixin.PrepareConfig, Fancy.panel.mixin.methods, "Fancy.form.mixin.PrepareConfig"],
    type: "form",
    theme: "default",
    i18n: "en",
    maxLabelNumber: 11,
    minWidth: 200,
    minHeight: 200,
    barScrollEnabled: !0,
    constructor: function(a) {
        var b = this
          , a = a || {}
          , c = function(c) {
            c && Fancy.apply(a, c),
            a = b.prepareConfig(a, b),
            Fancy.applyConfig(b, a),
            b.Super("const", arguments)
        }
          , d = function() {
            var d = a.i18n || b.i18n;
            Fancy.loadLang(d, c) === !0 && c({})
        };
        Fancy.modules.form || Fancy.fullBuilt || Fancy.MODULELOAD === !1 ? d() : Fancy.loadModule("form", function() {
            d()
        })
    }
});
var FancyForm = Fancy.Form;
FancyForm.get = function(a) {
    var b = Fancy.get(a).select(".fancy-form").dom.id;
    return Fancy.getWidget(b)
}
,
FancyForm.defineTheme = Fancy.defineTheme,
FancyForm.defineController = Fancy.defineController,
FancyForm.addValid = Fancy.addValid,
!Fancy.nojQuery && Fancy.$ && (Fancy.$.fn.FancyForm = function(a) {
    return a.renderTo = $(this.selector)[0].id,
    new Fancy.Form(a)
}
),
Fancy.ns("Fancy.form.field"),
Fancy.form.field.Mixin = function() {}
,
Fancy.form.field.Mixin.prototype = {
    padding: "8px 8px 0px 8px",
    inputHeight: 29,
    labelHeight: 18,
    failedValidCls: "fancy-field-not-valid",
    cls: "",
    ons: function() {
        var a = this
          , b = a.el
          , c = a.el.getByTag("input");
        if (a.input = c,
        c.on("blur", a.onBlur, a),
        c.on("focus", a.onFocus, a),
        c.on("input", a.onInput, a),
        c.on("keydown", a.onKeyDown, a),
        b.on("mouseenter", a.onMouseOver, a),
        b.on("mouseleave", a.onMouseOut, a),
        a.on("key", a.onKey, a),
        a.tip && b.on("mousemove", a.onMouseMove, a),
        a.format && a.format.inputFn) {
            switch (a.value) {
            case "":
            case void 0:
                break;
            default:
                a.formatValue(a.value)
            }
            a.on("key", a.onKeyInputFn)
        }
        a.stopPropagation && b.on("mousedown", function(a) {
            a.stopPropagation()
        })
    },
    onKeyInputFn: function(a, b, c) {
        var d = c.keyCode
          , e = Fancy.key;
        switch (d) {
        case e.ENTER:
        case e.ESC:
        case e.LEFT:
        case e.RIGHT:
            return
        }
        this.formatValue(b)
    },
    formatValue: function(a) {
        var b = this;
        a = b.format.inputFn(a),
        b.input.dom.value = a
    },
    onMouseOver: function(a) {
        var b = this;
        b.fire("mouseover"),
        b.tip && b.renderTip(a)
    },
    onMouseOut: function(a) {
        var b = this;
        b.fire("mouseout"),
        b.tip && b.tooltip && (b.tooltipToDestroy = !0,
        b.tooltip.destroy(),
        delete b.tooltip)
    },
    render: function() {
        var a = this
          , b = a.renderTo || document.body
          , c = Fancy.get(document.createElement("div"));
        a.style;
        Fancy.isString(b) && (b = document.getElementById(b),
        b || (b = Fancy.select(b).item(0))),
        a.fire("beforerender"),
        c.addClass(a.cls),
        c.addClass(a.fieldCls),
        c.attr("id", a.id);
        var d = ""
          , e = "";
        a.itemsHTML && (e = a.itemsHTML),
        "top" === a.labelAlign && a.label && a.labelWidth < 7 * a.label.length && (a.labelWidth = 7 * (a.label.length + 2)),
        a.labelWidth && (d = "width:" + a.labelWidth + "px;");
        var f = a.label;
        "" === a.label ? f = "&nbsp;" : void 0 === a.label ? f = "&nbsp;" : "right" !== a.labelAlign && (f += ":");
        var g = ""
          , h = ""
          , i = "";
        if (a.label === !1 && (g = "display:none;"),
        a.inputLabel ? i = a.inputLabel : h = "display:none;",
        "recaptcha" === a.type ? c.update(a.tpl.getHTML({
            key: a.key
        })) : c.update(a.tpl.getHTML({
            labelWidth: d,
            label: f,
            labelDisplay: g,
            inputLabelDisplay: h,
            inputLabel: i,
            emptyText: a.emptyText,
            value: a.value,
            height: a.height,
            itemsHTML: e,
            errorTextStyle: "",
            buttonText: a.buttonText
        })),
        a.el = c,
        a.setStyle(),
        a.renderId === !0 && c.attr("id", a.id),
        b.appendChild(c.dom),
        a.el = c,
        "textarea" === a.type ? a.input = a.el.getByTag("textarea") : a.input = a.el.getByTag("input"),
        a.name && (a.input.name = a.name),
        a.setSize(),
        "top" === a.labelAlign)
            a.el.addClass("fancy-field-label-align-top"),
            a.el.select(".fancy-field-text").css("float", "none");
        else if ("right" === a.labelAlign)
            switch (a.el.addClass("fancy-field-label-align-right"),
            a.type) {
            case "radio":
                $(c.dom).find(".fancy-field-label").insertAfter($(c.dom).find(".fancy-field-text:last"));
                break;
            case "textarea":
                $(c.dom).find(".fancy-field-label").insertAfter($(c.dom).find(".fancy-textarea-text"));
                break;
            default:
                $(c.dom).find(".fancy-field-label").insertAfter($(c.dom).find(".fancy-field-text"))
            }
        else
            "radio" !== a.type;
        a.acceptedValue = a.value,
        a.fire("afterrender"),
        a.fire("render"),
        "recaptcha" !== a.type && "chat" !== a.type && setTimeout(function() {
            a.input && a.input.dom && 0 === a.input.dom.value.length && (void 0 === a.prevColor && (a.prevColor = a.input.css("color")),
            a.input.css("color", "grey"))
        }, 1)
    },
    onKeyDown: function(a) {
        var b = this
          , c = a.keyCode
          , d = Fancy.key;
        if ("number" === b.type && Fancy.Key.isNumControl(c, a) === !1)
            return a.preventDefault(),
            void a.stopPropagation();
        switch (c) {
        case d.TAB:
            b.fire("tab", a);
            break;
        case d.ENTER:
            b.fire("enter", b.getValue()),
            "textarea" !== b.type && (a.preventDefault(),
            a.stopPropagation());
            break;
        case d.UP:
            switch (b.type) {
            case "number":
            case "field.number":
                b.spinUp()
            }
            b.fire("up", b.getValue()),
            "textarea" !== b.type && (a.preventDefault(),
            a.stopPropagation());
            break;
        case d.DOWN:
            switch (b.type) {
            case "number":
            case "field.number":
                b.spinDown()
            }
            b.fire("up", b.getValue()),
            "textarea" !== b.type && (a.preventDefault(),
            a.stopPropagation());
            break;
        case d.LEFT:
            break;
        case d.RIGHT:
            a.stopPropagation();
            break;
        default:
            setTimeout(function() {
                b.input && (0 === b.input.dom.value.length ? (void 0 === b.prevColor && (b.prevColor = b.input.css("color")),
                b.input.css("color", "grey")) : b.prevColor ? b.input.css("color", b.prevColor) : b.input.css("color", " "))
            }, 1)
        }
        setTimeout(function() {
            b.fire("key", b.input.dom.value, a)
        }, 1)
    },
    onKey: function(a, b) {
        a.validate(b)
    },
    onBlur: function() {
        var a = this;
        a.fire("blur")
    },
    validate: function(a) {
        var b = this
          , c = b.vtype;
        if (void 0 === c)
            ;
        else {
            var d = Fancy.isValid(c, a);
            d !== !0 ? (b.errorText = new Fancy.Template(d.text).getHTML(d),
            b.failedValid()) : b.successValid()
        }
    },
    isValid: function() {
        var a = this;
        return !a.hasClass(a.failedValidCls)
    },
    onFocus: function() {
        var a = this;
        a.fire("focus")
    },
    onInput: function() {
        var a = this
          , b = (a.input,
        a.getValue())
          , c = a.acceptedValue;
        a.acceptedValue = a.get(),
        a.fire("input", b),
        a.fire("change", b, c)
    },
    get: function() {
        var a = this;
        if (a.format)
            if (Fancy.isString(a.format))
                ;
            else {
                if (!Fancy.isObject(a.format))
                    return a.value;
                if (a.format.inputFn && ("number" === a.type || "field.number" === a.type))
                    return isNaN(parseFloat(a.value)) ? a.value : Number(a.value)
            }
        return a.input.dom.value
    },
    getValue: function() {
        return this.get()
    },
    set: function(a, b) {
        var c = this;
        c.value = a,
        c.format && c.format.inputFn ? c.formatValue(a) : c.input.dom.value = a,
        b !== !1 && c.onInput(),
        c.validate(a)
    },
    setValue: function(a, b) {
        this.set(a, b)
    },
    clear: function() {
        this.set("")
    },
    failedValid: function() {
        var a = this;
        a.hasClass(a.failedValidCls) ? a.tooltip && a.errorText && a.tooltip.update(a.errorText) : (!a.tooltip && a.errorText && (a.showErrorTip(),
        a.el.on("mousemove", a.onMouseMove, a),
        a.input.hover(function(b) {
            a.errorText && (a.showErrorTip(),
            a.tooltip.show(b.pageX + 15, b.pageY - 25))
        }, function() {
            a.hideErrorTip()
        })),
        a.addClass(a.failedValidCls))
    },
    successValid: function() {
        var a = this;
        a.removeClass(a.failedValidCls),
        a.hideErrorTip(),
        delete a.errorText
    },
    showErrorTip: function() {
        var a = this;
        a.tooltip || (a.tooltip = new Fancy.ToolTip({
            text: a.errorText
        }))
    },
    hideErrorTip: function() {
        var a = this;
        a.tooltip && (a.tooltip.destroy(),
        delete a.tooltip)
    },
    setInputSize: function(a) {
        var b = this;
        a.width && b.input.css("width", a.width),
        a.height && b.input.css("height", a.height)
    },
    focus: function() {
        var a = this;
        a.input.focus(),
        setTimeout(function() {
            a.input.dom.selectionStart = a.input.dom.selectionEnd = 1e4
        }, 0)
    },
    hide: function() {
        var a = this;
        a.fire("beforehide"),
        a.css("display", "none"),
        a.fire("hide")
    },
    show: function() {
        var a = this;
        a.css("display", "block")
    },
    setSize: function(a, b) {
        var c = this;
        if ("set" !== c.type) {
            if (void 0 === a && void 0 === b)
                a = c.width,
                b = c.height;
            else if (void 0 === b) {
                var d = a;
                a = d.width ? d.width : c.width,
                b = d.height ? d.height : c.height
            }
            if (c.size)
                return void c.size({
                    width: a,
                    height: b
                });
            void 0 !== a && c.css("width", a),
            "top" === c.labelAlign ? c.css("height", 1.5 * b) : c.css("height", b),
            c.setInputSize({
                width: c.inputWidth,
                height: c.inputHeight
            })
        }
    },
    setStyle: function() {
        var a = this
          , b = a.style || {}
          , c = a.padding;
        c ? (Fancy.isNumber(c) ? c += "px" : Fancy.isString(c),
        void 0 === b.padding && (b.padding = c)) : b.padding = "0px",
        a.css(b)
    },
    preRender: function() {
        var a = this;
        a.tpl && Fancy.isObject(a.tpl) === !1 && (a.tpl = new Fancy.Template(a.tpl)),
        a.calcSize()
    },
    calcSize: function() {
        var a, b, c, d, e = this, f = e.inputWidth, g = e.padding;
        if (Fancy.isString(g))
            switch (g = g.replace(/px/g, ""),
            g = g.split(" "),
            g.length) {
            case 1:
                a = Number(g[0]),
                g = [a, a, a, a];
                break;
            case 2:
                b = Number(g[0]),
                c = Number(g[1]),
                g = [b, c, b, c];
                break;
            case 3:
                b = Number(g[0]),
                c = Number(g[1]),
                d = Number(g[2]),
                g = [b, c, d, b];
                break;
            case 4:
                g = [Number(g[0]), Number(g[1]), Number(g[2]), Number(g[3])]
            }
        else
            Fancy.isNumber(g) ? g = [g, g, g, g] : g === !1 && (g = [0, 0, 0, 0]);
        "top" === e.labelAlign && (e.height *= 1.5),
        f = e.width,
        "top" !== e.labelAlign && e.label && (f -= e.labelWidth),
        e.height === e.inputHeight && e.padding !== !1 && (e.inputHeight -= g[0] + g[2]),
        e.inputWidth = f - g[1] - g[3],
        e.height = e.inputHeight + g[0] + g[2]
    },
    setWidth: function(a) {
        var b = this;
        b.width = a,
        b.calcSize(),
        b.css("width", a),
        b.setInputSize({
            width: b.inputWidth
        })
    },
    onMouseMove: function(a) {
        var b = this;
        delete b.tooltipToDestroy,
        b.tip ? b.renderTip(a) : b.tooltip && b.tooltip.show(a.pageX + 15, a.pageY - 25)
    },
    renderTip: function(a) {
        var b = this
          , c = ""
          , d = new Fancy.Template(b.tip || b.tooltip);
        b.getValue && (c = b.getValue());
        var e = d.getHTML({
            value: c
        });
        b.tooltip ? b.tooltip.update(e) : b.tooltip = new Fancy.ToolTip({
            text: e
        }),
        b.tooltip.show(a.pageX + 15, a.pageY - 25)
    }
},
Fancy.define(["Fancy.form.field.String", "Fancy.StringField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.string",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "enter", "up", "down", "tab", "change", "key"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.ons(),
        a.isPassword && a.input.attr({
            type: "password"
        }),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    fieldCls: "fancy fancy-field",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}" value="{value}">', '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>']
}),
Fancy.define(["Fancy.form.field.Number", "Fancy.NumberField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.number",
    allowBlank: !0,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "enter", "up", "down", "tab", "change", "key"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.ons(),
        a.hidden && a.css("display", "none"),
        a.initSpin()
    },
    fieldCls: "fancy fancy-field",
    value: "",
    width: 100,
    emptyText: "",
    step: 1,
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}" value="{value}">', '<div class="fancy-field-spin">', '<div class="fancy-field-spin-up"></div>', '<div class="fancy-field-spin-down"></div>', "</div>", '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>'],
    onInput: function() {
        var a = this
          , b = a.input
          , c = a.get()
          , d = a.acceptedValue;
        if (a.isValid()) {
            for (var e = b.dom.value, f = "", g = 0, h = e.length; h > g; g++)
                switch (e[g]) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "-":
                case "+":
                case ".":
                    f += e[g]
                }
            f = f,
            isNaN(Number(f)) || (a.value = f,
            c = f)
        }
        a.acceptedValue = Number(a.get()),
        a.fire("input", c),
        a.fire("change", Number(c), Number(d))
    },
    isNumber: function(a) {
        return "" === a || "-" === a ? !0 : Fancy.isNumber(+a)
    },
    checkMinMax: function(a) {
        var b = this;
        return "" === a || "-" === a ? !0 : (a = +a,
        a >= b.min && a <= b.max)
    },
    setMin: function(a) {
        var b = this;
        b.min = a
    },
    setMax: function(a) {
        var b = this;
        b.max = a
    },
    initSpin: function() {
        var a = this;
        a.spin === !0 && (a.el.select(".fancy-field-spin").css("display", "block"),
        a.el.select(".fancy-field-spin-up").on("mousedown", a.onMouseDownSpinUp, a),
        a.el.select(".fancy-field-spin-down").on("mousedown", a.onMouseDownSpinDown, a))
    },
    onMouseDownSpinUp: function(a) {
        var b = this
          , c = Fancy.get(document)
          , d = 700
          , e = new Date;
        a.preventDefault(),
        b.mouseDownSpinUp = !0,
        b.spinUp(),
        b.spinInterval = setInterval(function() {
            b.mouseDownSpinUp = !1,
            new Date - e > d && (700 === d && (d = 150),
            e = new Date,
            b.spinUp(),
            d--,
            20 > d && (d = 20))
        }, 20),
        c.once("mouseup", function() {
            clearInterval(b.spinInterval)
        })
    },
    onMouseDownSpinDown: function(a) {
        var b = this
          , c = Fancy.get(document)
          , d = 700
          , e = new Date;
        a.preventDefault(),
        b.mouseDownSpinDown = !0,
        b.spinDown(),
        b.spinInterval = setInterval(function() {
            b.mouseDownSpinDown = !1,
            new Date - e > d && (700 === d && (d = 150),
            e = new Date,
            b.spinDown(),
            d--,
            20 > d && (d = 20))
        }, 20),
        c.once("mouseup", function() {
            clearInterval(b.spinInterval)
        })
    },
    spinUp: function() {
        var a = this
          , b = +a.get() + a.step;
        Fancy.Number.isFloat(a.step) && (b = Fancy.Number.correctFloat(b)),
        isNaN(b) && (b = a.min || 0),
        void 0 !== a.max && b > a.max ? b = a.max : b < a.min && (b = a.min),
        a.set(b)
    },
    spinDown: function() {
        var a = this
          , b = +a.get() - a.step;
        Fancy.Number.isFloat(a.step) && (b = Fancy.Number.correctFloat(b)),
        isNaN(b) && (b = a.min || 0),
        void 0 !== a.min && b < a.min ? b = a.min : b > a.max && (b = a.max),
        a.set(b)
    }
}),
Fancy.define(["Fancy.form.field.Date", "Fancy.DateField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.date",
    picker: !0,
    i18n: "en",
    theme: "default",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "enter", "up", "down", "tab", "change", "key", "showpicker"),
        a.initFormat(),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.ons(),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style),
        Fancy.isDate(a.value) || a.initDate(),
        a.changeInputValue(),
        a.initPicker()
    },
    initDate: function(a, b) {
        var c = this;
        if (a) {
            if ("date" === Fancy.typeOf(a))
                return void (c.date = a);
            var d;
            if (d = b ? Fancy.Date.parse(a, b, c.format.mode) : Fancy.Date.parse(a, c.format.read, c.format.mode),
            "Invalid Date" === d.toString && (d = Fancy.Date.parse(a, c.format.edit, c.format.mode)),
            "Invalid Date" === d.toString)
                return;
            return void (c.date = d)
        }
        switch (Fancy.typeOf(a)) {
        case "date":
            c.date = c.value;
            break;
        case "undefined":
        case "string":
            if (!c.value)
                return void delete c.date;
            c.date = Fancy.Date.parse(c.value, c.format.read, c.format.mode)
        }
    },
    changeInputValue: function() {
        var a = this;
        if ("date" !== Fancy.typeOf(a.date) || "Invalid Date" === a.date.toString())
            return void (a.input.dom.value = "");
        var b = Fancy.Date.format(a.date, a.format.edit, void 0, a.format.mode);
        a.format && a.format.inputFn && (b = a.format.inputFn(b)),
        void 0 === b && (b = ""),
        a.input.dom.value = b,
        a.fire("change", b)
    },
    initFormat: function() {
        var a = this;
        a.format ? Fancy.isObject(a.format) && Fancy.applyIf(a.format, Fancy.i18n[a.i18n].date) : a.format = Fancy.i18n[a.i18n].date
    },
    formatValue: function(a) {
        var b = this;
        if (!b.value && a ? b.value = a : !a && b.value && (a = b.value),
        b.value)
            if ("date" === Fancy.typeOf(b.value)) {
                if (b.value = Fancy.Date.format(b.value, b.format.read, void 0, b.format.mode),
                void 0 === a) {
                    var c = Fancy.Date.parse(b.value, b.format.edit, b.format.mode);
                    a = Fancy.Date.format(c, b.format.edit, void 0, b.format.mode)
                }
                b.acceptedValue = a
            } else {
                var d = Fancy.Date.parse(b.value, b.format.read, b.format.mode);
                b.value = Fancy.Date.format(d, b.format.edit, void 0, b.format.mode)
            }
        else
            ;b.format && b.format.inputFn && (a = b.format.inputFn(a)),
        void 0 === a && (a = ""),
        b.input.dom.value = a
    },
    fieldCls: "fancy fancy-field",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}" value="{value}">', '<div class="fancy-field-picker-button"></div>', '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>'],
    ons: function() {
        var a = this
          , b = a.el.getByTag("input");
        a.input = b,
        b.on("blur", a.onBlur, a),
        b.on("focus", a.onFocus, a),
        b.on("input", a.onInput, a),
        b.on("keydown", a.onKeyDown, a),
        a.on("key", a.onKey, a),
        a.on("enter", a.onEnter, a),
        a.on("beforehide", a.onBeforeHide, a),
        a.format && a.format.inputFn && a.on("key", a.onKeyInputFn)
    },
    initPicker: function() {
        var a = this;
        a.picker !== !1 && (a.dateImage === !1 ? (a.el.select(".fancy-field-picker-button").css("display", "none"),
        a.input.on("click", a.onInputClick, a)) : (a.pickerButton = a.el.select(".fancy-field-picker-button"),
        a.pickerButton.on("mousedown", a.onPickerButtonMouseDown, a)))
    },
    onInputClick: function(a) {
        var b = this;
        b.el;
        a.preventDefault(),
        b.toggleShowPicker()
    },
    onPickerButtonMouseDown: function(a) {
        var b = this;
        b.el;
        a.preventDefault(),
        b.toggleShowPicker()
    },
    showPicker: function() {
        var a = this
          , b = a.el
          , c = a.input
          , d = Fancy.get(document);
        a.picker === !0 && a.renderPicker();
        var e = c.offset()
          , f = e.left
          , g = e.top + b.select(".fancy-field-text").height()
          , h = a.date || new Date;
        "Invalid Date" === h.toString() && (h = new Date),
        a.picker.setDate(h),
        a.picker.showAt(f, g),
        a.fire("showpicker"),
        a.docSpy || (a.docSpy = !0,
        d.on("click", a.onDocClick, a))
    },
    onDocClick: function(a) {
        var b = this
          , c = b.picker
          , d = c.monthPicker
          , e = a.target;
        b.el.select(".fancy-field-picker-button").item(0);
        "input" === e.tagName.toLocaleLowerCase() || Fancy.get(e).hasClass("fancy-field-picker-button") || c.panel.el.within(e) || d && d.panel.el.within(e) || b.hidePicker()
    },
    hidePicker: function() {
        var a = this;
        if (a.picker !== !1 && a.picker.hide && a.picker.hide(),
        a.docSpy) {
            var b = Fancy.get(document);
            a.docSpy = !1,
            b.un("click", a.onDocClick, a)
        }
    },
    toggleShowPicker: function() {
        var a = this;
        return a.picker === !0 ? void a.showPicker() : void ("none" === a.picker.panel.el.css("display") ? a.showPicker() : a.hidePicker())
    },
    renderPicker: function() {
        var a = this;
        (Fancy.fullBuilt || Fancy.modules.grid || Fancy.MODULELOAD === !1) && (a.picker = new Fancy.DatePicker({
            window: !0,
            date: a.date,
            format: a.format,
            theme: a.theme,
            events: [{
                changedate: a.onPickerChangeDate,
                scope: a
            }]
        }))
    },
    get: function() {
        var a = this;
        return "" === a.input.dom.value ? (delete a.date,
        delete a.value,
        "") : a.date ? Fancy.Date.format(a.date, a.format.write, void 0, a.format.mode) : ""
    },
    getDate: function() {
        return this.date || ""
    },
    onBeforeHide: function() {
        var a = this;
        a.hidePicker()
    },
    onPickerChangeDate: function(a, b, c) {
        var d = this;
        c !== !1 && d.picker.hide(),
        d.initDate(b),
        d.changeInputValue()
    },
    onInput: function() {
        var a = this
          , b = a.input
          , c = b.dom.value
          , d = a.acceptedValue;
        "Invalid Date" !== Fancy.Date.parse(c, a.format.edit, a.format.mode).toString() && (a.initDate(c, a.format.edit),
        a.fire("input", c),
        a.fire("change", c, d))
    },
    isValid: function() {
        var a = this;
        return "Invalid Date" !== Fancy.Date.parse(a.get(), a.format.edit, a.format.mode).toString()
    },
    set: function(a) {
        var b = this;
        switch (a) {
        case "":
        case void 0:
            return delete b.value,
            delete b.date,
            void b.changeInputValue()
        }
        b.initDate(a),
        b.changeInputValue()
    },
    isEqual: function(a) {
        var b = this
          , c = Fancy.Date.parse(a, b.format.read, b.format.mode)
          , d = b.input.dom.value;
        return a = Fancy.Date.format(c, b.format.edit, void 0, b.format.mode),
        a === d
    },
    onEnter: function() {
        var a = this
          , b = a.input
          , c = b.dom.value
          , d = a.acceptedValue;
        "" === c && (a.initDate(),
        a.fire("input", c),
        a.fire("change", c, d))
    }
}),
Fancy.define(["Fancy.form.field.DateRange", "Fancy.DateRangeField"], {
    extend: Fancy.Widget,
    type: "field.daterange",
    picker: !0,
    format: "m/d/Y",
    dateImage: !0,
    theme: "default",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("changedatefrom", "changedateto", "change"),
        a.preRender(),
        a.render(),
        a.initDateFields()
    },
    fieldCls: "fancy fancy-date-range",
    width: 100,
    render: function() {
        var a = this
          , b = a.renderTo || document.body
          , c = Fancy.get(document.createElement("div"));
        c.addClass(a.cls),
        a.el = Fancy.get(Fancy.get(b).dom.appendChild(c.dom))
    },
    preRender: function() {},
    initDateFields: function() {
        var a = this
          , b = a.theme;
        a.dateField1 = new Fancy.DateField({
            renderTo: a.el.dom,
            label: !1,
            dateImage: a.dateImage,
            width: a.width / 2,
            padding: !1,
            theme: b,
            style: {
                position: "absolute",
                bottom: "2px",
                left: "3px"
            },
            format: a.format,
            events: [{
                showpicker: a.onShowPicker1,
                scope: a
            }, {
                change: a.onChangeDate1,
                scope: a
            }, {
                focus: a.onFocus1,
                scope: a
            }, {
                enter: a.onEnter,
                scope: a
            }]
        }),
        a.dateField1.setInputSize({
            width: a.width / 2
        }),
        a.dateField2 = new Fancy.DateField({
            renderTo: a.el.dom,
            label: !1,
            dateImage: a.dateImage,
            width: a.width / 2,
            padding: !1,
            theme: b,
            style: {
                position: "absolute",
                bottom: "2px",
                right: "2px"
            },
            format: a.format,
            events: [{
                showpicker: a.onShowPicker2,
                scope: a
            }, {
                change: a.onChangeDate2,
                scope: a
            }, {
                focus: a.onFocus2,
                scope: a
            }, {
                keydown: a.onEnter,
                scope: a
            }]
        }),
        a.dateField2.setInputSize({
            width: a.width / 2
        })
    },
    onFocus1: function() {
        var a = this;
        a.dateField2.hidePicker()
    },
    onFocus2: function() {
        var a = this;
        a.dateField1.hidePicker()
    },
    onShowPicker1: function() {
        var a = this;
        a.dateField2.hidePicker()
    },
    onShowPicker2: function() {
        var a = this;
        a.dateField1.hidePicker()
    },
    onChangeDate1: function(a, b) {
        var c = this
          , b = Fancy.Date.parse(b, a.format.edit);
        c.fire("changedatefrom", b),
        c.fire("change")
    },
    onChangeDate2: function(a, b) {
        var c = this
          , b = Fancy.Date.parse(b, a.format.edit);
        c.fire("changedateto", b),
        c.fire("change")
    },
    onEnter: function() {
        var a = this;
        a.dateField1.hidePicker(),
        a.dateField2.hidePicker()
    }
}),
Fancy.define(["Fancy.form.field.Text", "Fancy.TextField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.text",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    fieldCls: "fancy fancy-field fancy-field-field-text",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<div class="fancy-field-text-value">{value}</div>', '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>'],
    set: function(a) {
        var b = this;
        b.el.select(".fancy-field-text-value").item(0).update(a)
    }
}),
Fancy.define(["Fancy.form.field.Empty", "Fancy.EmptyField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.empty",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents(),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.style && a.css(a.style)
    },
    ons: function() {},
    fieldCls: "fancy fancy-field fancy-field-empty",
    width: 100,
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>']
}),
Fancy.define(["Fancy.form.field.TextArea", "Fancy.TextArea"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.textarea",
    constructor: function() {
        var a = this;
        a.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("change"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.ons()
    },
    fieldCls: "fancy fancy-field fancy-textarea",
    value: "",
    width: 250,
    height: 100,
    labelWidth: 60,
    inputWidth: 180,
    minHeight: 100,
    maxHeight: 210,
    lineHeight: 12.5,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-textarea-text">', '<textarea autocomplete="off" placeholder="{emptyText}" type="text" class="fancy-textarea-text-input" style="{inputWidth}height:{inputHeight}px;">{value}</textarea>', '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", '<div class="fancy-clearfix"></div>'],
    ons: function() {
        var a = this
          , b = a.el.getByTag("textarea");
        a.input = b,
        b.on("blur", a.onBlur, a),
        b.on("focus", a.onFocus, a),
        b.on("input", a.onInput, a),
        b.on("keydown", a.onKeyDown, a),
        a.autoHeight && b.on("input", a.onChange, a)
    },
    preRender: function() {
        var a = this;
        a.tpl && (a.tpl = new Fancy.Template(a.tpl)),
        a.initHeight(),
        a.calcSize()
    },
    initHeight: function() {
        var a, b = this;
        if (b.height)
            a = b.height,
            b.maxHeight < b.height && (b.maxHeight = b.height,
            setTimeout(function() {
                b.input.css({
                    "overflow-y": "scroll"
                })
            }, 1));
        else if (b.value) {
            var c = b.value.match(/\n/g);
            c = c ? c.length : 1,
            a = c * b.lineHeight
        } else
            a = b.height;
        a < b.minHeight ? a = b.minHeight : a > b.maxHeight && (a = b.maxHeight,
        setTimeout(function() {
            b.input.css({
                "overflow-y": "scroll"
            })
        }, 1)),
        b.height = a,
        b.inputHeight = a
    },
    calcSize: function() {
        var a, b, c, d, e = this, f = e.inputWidth, g = e.padding;
        if (Fancy.isString(g))
            switch (g = g.replace(/px/g, ""),
            g = g.split(" "),
            g.length) {
            case 1:
                a = Number(g[0]),
                g = [a, a, a, a];
                break;
            case 2:
                b = Number(g[0]),
                c = Number(g[1]),
                g = [b, c, b, c];
                break;
            case 3:
                b = Number(g[0]),
                c = Number(g[1]),
                d = Number(g[2]),
                g = [b, c, d, b];
                break;
            case 4:
                g = [Number(g[0]), Number(g[1]), Number(g[2]), Number(g[3])]
            }
        else
            Fancy.isNumber(g) ? g = [g, g, g, g] : g === !1 && (g = [0, 0, 0, 0]);
        "top" === e.labelAlign && (e.inputHeight -= 40),
        f = e.width,
        "top" !== e.labelAlign && e.label && (f -= e.labelWidth),
        e.height === e.inputHeight && e.padding !== !1 && (e.inputHeight -= g[0] + g[2]),
        e.inputWidth = f - g[1] - g[3],
        e.height = e.inputHeight + g[0] + g[2]
    },
    onChange: function() {
        var a = this
          , b = a.input.dom.value
          , c = a.el.getByTag("textarea")
          , d = b.match(/\n/g).length * a.lineHeight;
        d < a.minHeight ? (d = a.minHeight,
        c.css({
            "overflow-y": "hidden"
        })) : d > a.maxHeight ? (d = a.maxHeight,
        c.css({
            "overflow-y": "scroll"
        })) : c.css({
            "overflow-y": "hidden"
        }),
        a.height = d
    }
}),
Fancy.define(["Fancy.form.field.CheckBox", "Fancy.CheckBox"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.checkbox",
    constructor: function(a) {
        var b = this;
        Fancy.applyConfig(b, a || {}),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "up", "down", "beforechange", "change", "key"),
        a.Super("init", arguments),
        a.preRender(),
        a.render({
            labelWidth: a.labelWidth,
            labelDispay: a.labelText ? "" : "none",
            label: a.label
        }),
        a.expander && a.addClass("fancy-checkbox-expander"),
        a.acceptedValue = a.value,
        a.set(a.value, !1),
        a.ons()
    },
    labelText: "",
    labelWidth: 60,
    value: !1,
    editable: !0,
    stopIfCTRL: !1,
    checkedCls: "fancy-checkbox-on",
    fieldCls: "fancy fancy-field fancy-field-checkbox",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<div class="fancy-field-checkbox-input" style=""></div>', "</div>", '<div class="fancy-field-input-label" style="inputLabelDisplay">', "{inputLabel}", "</div>", '<div class="fancy-clearfix"></div>'],
    ons: function() {
        var a = this
          , b = a.el;
        b.on("click", a.onClick, a),
        b.on("mousedown", a.onMouseDown, a)
    },
    onClick: function(a) {
        var b = this
          , c = b.el
          , d = b.checkedCls;
        if (b.fire("beforechange"),
        !(a.ctrlKey && b.stopIfCTRL || b.editable === !1)) {
            if (b.canceledChange === !0)
                return void (b.canceledChange = !0);
            c.toggleClass(d);
            var e = b.value;
            b.value = c.hasClass(d),
            b.fire("change", b.value, e)
        }
    },
    onMouseDown: function(a) {
        a.preventDefault()
    },
    set: function(a, b) {
        var c = this
          , d = c.el
          , e = c.checkedCls;
        if ("" === a && (a = !1),
        a === !0 || 1 === a)
            d.addClass(e),
            a = !0;
        else if (a === !1 || 0 === a)
            d.removeClass(e),
            a = !1;
        else {
            if (void 0 !== a)
                throw new Error("not right value for checkbox " + a);
            a = !1
        }
        c.value = a,
        b !== !1 && c.fire("change", c.value)
    },
    setValue: function(a, b) {
        this.set(a, b)
    },
    getValue: function() {
        var a = this;
        return a.value
    },
    get: function() {
        return this.getValue()
    },
    clear: function() {
        this.set(!1)
    },
    toggle: function() {
        var a = this;
        a.set(!a.value)
    }
}),
Fancy.define(["Fancy.form.field.Switcher", "Fancy.Switcher"], {
    extend: Fancy.CheckBox,
    type: "field.switcher",
    constructor: function(a) {
        var b = this;
        Fancy.applyConfig(b, a || {}),
        b.Super("const", arguments)
    },
    init: function() {
        this.Super("init", arguments)
    },
    checkedCls: "fancy-switcher-on",
    fieldCls: "fancy fancy-field fancy-field-switcher",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', "</div>", '<div class="fancy-field-input-label" style="inputLabelDisplay">', "{inputLabel}", "</div>", '<div class="fancy-clearfix"></div>']
}),
Fancy.define(["Fancy.form.field.Combo", "Fancy.Combo"], {
    type: "field.combo",
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    selectedItemCls: "fancy-combo-item-selected",
    width: 250,
    labelWidth: 60,
    listRowHeight: 25,
    dropButtonWidth: 27,
    emptyText: "",
    editable: !0,
    typeAhead: !0,
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', '<div class="fancy-combo-input-container" style="{inputWidth}{inputHeight}">', '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}{inputHeight}cursor:default;" value="{value}">', '<div class="fancy-combo-dropdown-button">&nbsp;</div>', "</div>", '<div class="fancy-field-error" style="{errorTextStyle}"></div>', '<div class="fancy-clearfix"></div>'],
    constructor: function() {
        var a = this;
        a.tags = a.tags || [],
        a.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "up", "down", "change", "key", "enter", "up", "down", "esc"),
        a.Super("init", arguments),
        a.loadListData(),
        a.preRender(),
        a.render(),
        a.ons(),
        a.applyStyle(),
        a.applyTheme()
    },
    loadListData: function() {
        var a = this;
        if (Fancy.isObject(a.data)) {
            var b = a.data.proxy;
            if (!b || !b.url)
                throw new Error("[FancyGrid Error]: combo data url is not defined");
            Fancy.Ajax({
                url: b.url,
                params: b.params || {},
                method: b.method || "GET",
                getJSON: !0,
                success: function(b) {
                    a.data = a.configData(b.data),
                    a.renderList(),
                    a.onsList()
                }
            })
        }
    },
    configData: function(a) {
        return a
    },
    applyStyle: function() {
        var a = this;
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    applyTheme: function() {
        var a = this;
        a.theme && "default" !== a.theme && (a.addClass("fancy-theme-" + a.theme),
        a.list.addClass("fancy-theme-" + a.theme))
    },
    fieldCls: "fancy fancy-field fancy-combo",
    ons: function() {
        var a = this
          , b = a.el.select(".fancy-combo-dropdown-button");
        a.input = a.el.getByTag("input"),
        a.inputContainer = a.el.select(".fancy-combo-input-container"),
        a.drop = b,
        a.onsList(),
        a.input.on("mousedown", a.onInputMouseDown, a),
        a.input.on("click", a.onInputClick, a),
        b.on("mousedown", a.onDropMouseDown, a),
        b.on("click", a.onDropClick, a),
        a.typeAhead && a.editable && a.input.on("keydown", a.onKeyDown, a),
        a.on("esc", a.onEsc, a),
        a.on("enter", a.onEnter, a),
        a.on("up", a.onUp, a),
        a.on("down", a.onDown, a)
    },
    onKeyDown: function(a) {
        var b = this
          , c = a.keyCode
          , d = Fancy.key;
        switch (c) {
        case d.ESC:
            b.fire("esc", a);
            break;
        case d.ENTER:
            b.fire("enter", a);
            break;
        case d.UP:
            b.fire("up", a);
            break;
        case d.DOWN:
            b.fire("down", a);
            break;
        case d.TAB:
            break;
        default:
            setTimeout(function() {
                return 0 === b.generateAheadData().length ? void b.hideAheadList() : (b.renderAheadList(),
                void b.showAheadList())
            }, 1)
        }
    },
    onInputClick: function(a) {
        var b = this
          , c = b.list;
        b.editable !== !0 && ("none" === c.css("display") ? b.showList() : b.hideList())
    },
    onDropClick: function(a) {
        var b = this
          , c = b.list;
        "none" === c.css("display") ? b.showList() : b.hideList(),
        b.editable === !0 && b.input.focus()
    },
    showList: function() {
        var a = this
          , b = a.list
          , c = a.input.parent().parent()
          , d = c.$dom.offset()
          , e = [d.left, d.top + c.$dom.height()]
          , f = Fancy.get(document)
          , g = a.selectedItemCls;
        if (a.hideAheadList(),
        a.list) {
            b.css({
                display: "",
                left: e[0] + "px",
                top: e[1] + "px",
                width: c.width(),
                "z-index": 2e3 + Fancy.zIndex++
            });
            var h;
            0 === b.select("." + g).length ? (b.select("li").item(0).addClass(g),
            h = 0) : h = b.select("." + g).item(0).index(),
            a.docSpy || (a.docSpy = !0,
            f.on("click", a.onDocClick, a))
        }
    },
    showAheadList: function() {
        var a = this
          , b = a.aheadList
          , c = a.input.parent().parent()
          , d = c.$dom.offset()
          , e = [d.left, d.top + c.$dom.height()]
          , f = Fancy.get(document);
        a.hideList(),
        b && (b.css({
            display: "",
            left: e[0] + "px",
            top: e[1] + "px",
            width: c.width(),
            "z-index": 2e3 + Fancy.zIndex++
        }),
        a.docSpy2 || (a.docSpy2 = !0,
        f.on("click", a.onDocClick, a)))
    },
    onDocClick: function(a) {
        var b = this;
        b.input.parent().parent().within(a.target) === !1 && (b.hideList(),
        b.hideAheadList())
    },
    hideList: function() {
        var a = this;
        if (a.list && (a.list.css("display", "none"),
        a.docSpy)) {
            var b = Fancy.get(document);
            a.docSpy = !1,
            b.un("click", a.onDocClick, a)
        }
    },
    hideAheadList: function() {
        var a = this;
        if (a.aheadList && (a.aheadList.css("display", "none"),
        a.docSpy)) {
            var b = Fancy.get(document);
            a.docSpy = !1,
            b.un("click", a.onDocClick, a)
        }
    },
    onInputMouseDown: function(a) {
        var b = this;
        b.editable === !1 && a.preventDefault()
    },
    onDropMouseDown: function(a) {
        a.preventDefault()
    },
    onsList: function() {
        var a = this;
        a.list.on("click", a.onListItemClick, a, "li")
    },
    onsAheadList: function() {
        var a = this;
        a.aheadList.on("click", a.onListItemClick, a, "li")
    },
    onListItemClick: function(a) {
        var b = this
          , c = Fancy.get(a.currentTarget)
          , d = c.attr("value");
        Fancy.nojQuery && 0 === d && (d = ""),
        b.set(d),
        b.hideList(),
        b.onBlur()
    },
    set: function(a, b) {
        for (var c = this, d = "", e = 0, f = c.data.length, g = !1; f > e; e++)
            if (c.data[e][c.valueKey] == a) {
                c.valueIndex = e,
                d = c.data[e][c.displayKey],
                g = !0;
                break
            }
        c.selectItem(e),
        g === !1 && (-1 !== a && a && a.length > 0 ? (d = a,
        c.value = -1,
        c.valueIndex = -1) : d = ""),
        c.input.dom.value = d,
        c.value = a,
        b !== !1 && c.onInput()
    },
    selectItem: function(a) {
        var b = this;
        b.clearListActive(),
        b.list.select("li").item(a).addClass(b.selectedItemCls)
    },
    render: function() {
        var a = this
          , b = Fancy.get(a.renderTo || document.body).dom
          , c = Fancy.get(document.createElement("div"))
          , d = a.value;
        if (c.attr("id", a.id),
        void 0 === d)
            d = "";
        else {
            for (var e = 0, f = a.data.length, g = !1; f > e; e++)
                if (a.data[e][a.valueKey] === d) {
                    a.valueIndex = e,
                    d = a.data[e][a.displayKey],
                    g = !0;
                    break
                }
            g === !1 && (d = "")
        }
        a.fire("beforerender"),
        c.addClass(a.cls),
        c.addClass(a.fieldCls);
        var h = "";
        a.labelWidth && (h = "width:" + a.labelWidth + "px;");
        var i = a.labelWidth + 8 + 10;
        "top" === a.labelAlign && (i = 8),
        "right" === a.labelAlign && (i = 8);
        var j = a.label;
        "" === a.label ? j = "&nbsp;" : void 0 === a.label ? j = "&nbsp;" : "right" !== a.labelAlign && (j += ":"),
        c.update(a.tpl.getHTML({
            labelWidth: h,
            labelDisplay: a.label === !1 ? "display: none;" : "",
            label: j === !1 ? "" : j,
            emptyText: a.emptyText,
            inputHeight: "height:" + a.inputHeight + "px;",
            value: d
        })),
        a.el = c,
        a.setStyle(),
        a.input = a.el.getByTag("input"),
        a.inputContainer = a.el.select(".fancy-combo-input-container"),
        a.drop = a.el.select(".fancy-combo-dropdown-button"),
        a.setSize(),
        b.appendChild(c.dom),
        "top" === a.labelAlign ? a.el.addClass("fancy-field-label-align-top") : "right" === a.labelAlign && (a.el.addClass("fancy-field-label-align-right"),
        $(c.dom).find(".fancy-field-label").insertAfter($(c.dom).find(".fancy-field-text"))),
        a.valueIndex && (a.acceptedValue = a.value),
        a.editable && a.input.css("cursor", "auto"),
        a.renderList(),
        a.fire("afterrender"),
        a.fire("render")
    },
    renderList: function() {
        var a = this
          , b = Fancy.get(document.createElement("div"))
          , c = ['<ul style="position: relative;">'];
        a.list && a.list.destroy(),
        Fancy.each(a.data, function(b, d) {
            var e = ""
              , f = b[a.displayKey]
              , g = b[a.valueKey];
            if (a.value === g && (e = a.selectedItemCls),
            "" === f || " " === f)
                f = "&nbsp;";
            else if (a.listItemTpl) {
                var h = new Fancy.Template(a.listItemTpl);
                f = h.getHTML(b)
            }
            c.push('<li value="' + g + '" class="' + e + '"><span class="fancy-combo-list-value">' + f + "</span></li>")
        }),
        c.push("</ul>"),
        b.addClass("fancy fancy-combo-result-list"),
        b.update(c.join("")),
        b.css({
            display: "none",
            left: "0px",
            top: "0px",
            width: a.inputWidth + 14
        }),
        a.data.length > 9 && b.css({
            height: 9 * a.listRowHeight + "px",
            overflow: "auto"
        }),
        document.body.appendChild(b.dom),
        a.list = b
    },
    generateAheadData: function() {
        for (var a = this, b = a.input.dom.value.toLocaleLowerCase(), c = a.data, d = [], e = 0, f = c.length; f > e; e++)
            new RegExp("^" + b).test(c[e][a.displayKey].toLocaleLowerCase()) && d.push(c[e]);
        return a.data.length === d.length && (d = []),
        a.aheadData = d,
        d
    },
    renderAheadList: function() {
        var a, b = this, c = ['<ul style="position: relative;">'], d = !1;
        b.aheadList ? (b.aheadList.firstChild().destroy(),
        a = b.aheadList,
        d = !0) : a = Fancy.get(document.createElement("div")),
        Fancy.each(b.aheadData, function(a, d) {
            var e = ""
              , f = a[b.displayKey]
              , g = a[b.valueKey];
            0 === d && (e = b.selectedItemCls),
            ("" === f || " " === f) && (f = "&nbsp;"),
            c.push('<li value="' + g + '" class="' + e + '"><span class="fancy-combo-list-value">' + f + "</span></li>")
        }),
        c.push("</ul>"),
        a.update(c.join("")),
        a.css({
            display: "none",
            left: "0px",
            top: "0px",
            width: b.inputWidth + 14
        }),
        b.aheadData.length > 9 && a.css({
            height: 9 * b.listRowHeight + "px",
            overflow: "auto"
        }),
        d === !1 && (a.addClass("fancy fancy-combo-result-list"),
        document.body.appendChild(a.dom),
        b.aheadList = a,
        b.onsAheadList())
    },
    hide: function() {
        var a = this;
        a.css("display", "none"),
        a.hideList(),
        a.hideAheadList()
    },
    clear: function() {
        var a = this;
        a.set(-1, !1)
    },
    clearListActive: function() {
        var a = this
          , b = a.selectedItemCls;
        a.list.select("." + b).removeClass(b)
    },
    onInput: function() {
        var a = this
          , b = a.getValue()
          , c = a.acceptedValue;
        a.acceptedValue = a.get(),
        a.fire("change", b, c)
    },
    setValue: function(a, b) {
        this.set(a, b)
    },
    getDisplayValue: function(a) {
        for (var b = this, c = 0, d = b.data.length; d > c; c++)
            if (b.data[c][b.valueKey] == a)
                return b.data[c][b.displayKey]
    },
    getValueKey: function(a) {
        for (var b = this, c = 0, d = b.data.length; d > c; c++)
            if (b.data[c][b.displayKey] === a)
                return b.data[c][b.valueKey]
    },
    get: function() {
        return this.getValue()
    },
    getValue: function() {
        var a = this;
        return -1 === a.value || void 0 === a.value ? -1 === a.value && a.input.dom.value ? a.input.dom.value : "" : void 0 !== a.valueKey ? a.value : a.value
    },
    size: function(a) {
        var b = this
          , c = a.width
          , d = a.height
          , e = b.input
          , f = b.inputContainer
          , g = b.drop;
        "top" !== b.labelAlign && (b.inputHeight = d),
        void 0 !== d && (b.height = d),
        void 0 !== c && (b.width = c),
        b.calcSize(),
        "top" === b.labelAlign ? b.css({
            height: 1.5 * b.height,
            width: b.width
        }) : b.css({
            height: b.height,
            width: b.width
        });
        var h = b.inputWidth;
        b.label === !1 && (h = b.width),
        e.css({
            width: h - 2,
            height: b.inputHeight
        }),
        f.css({
            width: h,
            height: b.inputHeight
        }),
        g.css("height", b.inputHeight)
    },
    onEnter: function(a, b) {
        var c = this
          , d = c.getActiveList();
        if (d) {
            var e = d.select("." + c.selectedItemCls).attr("value");
            c.set(e)
        } else
            c.set(c.input.dom.value);
        c.hideList(),
        c.hideAheadList()
    },
    onEsc: function(a, b) {
        var c = this;
        c.hideList(),
        c.hideAheadList()
    },
    onUp: function(a, b) {
        var c = this
          , d = c.getActiveList()
          , e = c.selectedItemCls;
        if (d) {
            b.preventDefault();
            var f = d.select("." + e)
              , g = f.index()
              , h = d.select("li");
            parseInt(d.css("height"));
            0 !== g ? g-- : g = h.length - 1;
            var i = h.item(g)
              , j = i.offset().top;
            g === h.length - 1 ? d.dom.scrollTop = 1e4 : j - parseInt(i.css("height")) < parseInt(i.css("height")) && (d.dom.scrollTop = d.dom.scrollTop - parseInt(f.css("height"))),
            f.removeClass(e),
            i.addClass(e)
        }
    },
    onDown: function(a, b) {
        var c = this
          , d = c.getActiveList()
          , e = c.selectedItemCls;
        if (d) {
            b.preventDefault();
            var f = d.select("." + e)
              , g = f.index()
              , h = d.select("li")
              , i = f.offset().top
              , j = parseInt(d.css("height"));
            g !== h.length - 1 ? g++ : g = 0;
            var k = h.item(g);
            i - j > 0 ? d.dom.scrollTop = 0 : i - j > -parseInt(f.css("height")) && (d.dom.scrollTop = d.dom.scrollTop + (i - j) + parseInt(f.css("height"))),
            f.removeClass(e),
            k.addClass(e)
        } else
            c.showList()
    },
    scrollToListItem: function(a) {
        var b = this
          , c = b.getActiveList()
          , d = c.select("li")
          , e = d.item(a)
          , f = e.offset().top;
        parseInt(c.css("height")),
        c.dom.scrollTop;
        0 === a ? c.dom.scrollTop = 0 : a === d.length - 1 ? c.dom.scrollTop = 1e4 : c.dom.scrollTop = f
    },
    getActiveList: function() {
        var a = this
          , b = !1;
        return a.list && "none" !== a.list.css("display") ? b = a.list : a.aheadList && "none" !== a.aheadList.css("display") && (b = a.aheadList),
        b
    }
}),
Fancy.define(["Fancy.form.field.Button", "Fancy.ButtonField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.button",
    pressed: !1,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("click"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.renderButton(),
        a.ons(),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    fieldCls: "fancy fancy-field fancy-field-button",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', "</div>", '<div class="fancy-clearfix"></div>'],
    renderButton: function() {
        var a = this;
        new Fancy.Button({
            renderTo: a.el.select(".fancy-field-text").item(0).dom,
            text: a.buttonText,
            handler: function() {
                a.handler && a.handler()
            }
        })
    },
    ons: function() {},
    onClick: function() {
        var a = this;
        a.fire("click"),
        a.handler && a.handler()
    }
}),
Fancy.define(["Fancy.form.field.SegButton", "Fancy.SegButtonField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.button",
    allowToggle: !0,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("click", "change"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.renderButton(),
        a.ons(),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    fieldCls: "fancy fancy-field fancy-field-button",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", "</div>", '<div class="fancy-field-text">', "</div>", '<div class="fancy-clearfix"></div>'],
    renderButton: function() {
        var a = this;
        a.button = new Fancy.SegButton({
            renderTo: a.el.select(".fancy-field-text").item(0).dom,
            items: a.items,
            multiToggle: a.multiToggle,
            allowToggle: a.allowToggle
        })
    },
    ons: function() {
        var a = this;
        a.button.on("toggle", function() {
            a.fire("toggle")
        })
    },
    onClick: function() {
        var a = this;
        a.fire("click"),
        a.handler && a.handler()
    },
    get: function() {
        for (var a = this, b = a.items, c = 0, d = b.length, e = []; d > c; c++) {
            var f = b[c];
            f.pressed && (f.value ? e.push(f.value) : e.push(c))
        }
        return e.toString()
    },
    clear: function(a) {
        var b = this
          , c = b.items
          , d = 0
          , e = c.length;
        if (b.allowToggle)
            for (; e > d; d++)
                c[d].setPressed(!1, a)
    }
}),
Fancy.define(["Fancy.form.field.Line", "Fancy.FieldLine"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.line",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents(),
        a.Super("init", arguments);
        for (var b, c = 0, d = a.items.length; d > c; c++) {
            var e = a.items[c];
            e.style = e.style || {},
            "top" === e.labelAlign ? b = !0 : e.style["padding-top"] = "0px",
            0 === c && (e.style["padding-left"] = "0px")
        }
        a.preRender(),
        a.render(),
        b && a.css("height", "48px")
    },
    fieldCls: "fancy fancy-field fancy-field-line",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-text fancy-field-line-items">', "</div>"]
}),
Fancy.define(["Fancy.form.field.Set", "Fancy.SetField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.set",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("beforecollapse", "collapse", "expanded"),
        a.Super("init", arguments);
        for (var b, c = 0, d = a.items.length; d > c; c++) {
            var e = a.items[c];
            "top" === e.labelAlign && (b = !0,
            0 === c && (e.style = {
                "padding-left": "0px"
            }))
        }
        a.preRender(),
        a.render(),
        void 0 !== a.checkbox && a.initCheckBox(),
        a.on("beforecollapse", a.onBeforeCollapsed, a),
        a.on("expanded", a.onExpanded, a)
    },
    fieldCls: "fancy fancy-field-set",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ["<fieldset>", "<legend>", '<div class="fancy-field-checkbox-input" style="float:left;margin-top: 4px;display: none;"></div>', '<div class="fancy-field-set-label" style="float:left;">{label}</div>', '<div class="fancy-clearfix"></div>', "</legend>", '<div class="fancy-field-text fancy-field-set-items">', "</div>", "</fieldset>"],
    initCheckBox: function() {
        var a = this
          , b = a.el.select(".fancy-field-checkbox-input");
        b.css("display", ""),
        a.checkbox === !0 && a.addClass("fancy-checkbox-on");
        var c = a.el.select(".fancy-field-set-items");
        setTimeout(function() {
            a.checkbox === !0 || a.fire("collapse")
        }, 1),
        a.checkbox === !0 ? (c.css("display", ""),
        a.removeClass("fancy-set-collapsed")) : (c.css("display", "none"),
        a.addClass("fancy-set-collapsed")),
        b.on("click", function() {
            a.toggleClass("fancy-checkbox-on");
            var b = a.el.hasClass("fancy-checkbox-on")
              , c = a.el.select(".fancy-field-set-items");
            b ? (a.fire("beforeexpanded"),
            c.css("display", ""),
            a.removeClass("fancy-set-collapsed"),
            a.fire("expanded")) : (a.fire("beforecollapse"),
            c.css("display", "none"),
            a.addClass("fancy-set-collapsed"),
            a.fire("collapse"))
        })
    },
    onBeforeCollapsed: function() {
        var a = this
          , b = a.form
          , c = a.el.select(".fancy-field-set-items")
          , d = parseInt(c.css("height"));
        b.setHeight(b.getHeight() - d)
    },
    onExpanded: function() {
        var a = this
          , b = a.form
          , c = a.el.select(".fancy-field-set-items")
          , d = parseInt(c.css("height"));
        b.setHeight(b.getHeight() + d)
    }
}),
Fancy.define(["Fancy.form.field.Tab", "Fancy.Tab"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.tab",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("collapsed", "expanded"),
        a.Super("init", arguments);
        for (var b, c = 0, d = a.items.length; d > c; c++) {
            var e = a.items[c];
            "top" === e.labelAlign && (b = !0,
            0 === c && (e.style = {
                "padding-left": "0px"
            }))
        }
        a.preRender(),
        a.render()
    },
    fieldCls: "fancy fancy-field-tab",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="fancy-field-text fancy-field-tab-items">', "</div>"]
}),
Fancy.define(["Fancy.form.field.HTML", "Fancy.HTMLField"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.html",
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "enter", "up", "down", "change", "key"),
        a.Super("init", arguments),
        a.preRender(),
        a.render(),
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style)
    },
    fieldCls: "fancy fancy-field-html",
    value: "",
    width: 100,
    emptyText: "",
    tpl: ['<div class="" style="">', "{value}", "</div>"],
    render: function() {
        var a = this
          , b = a.renderTo || document.body
          , c = document.createElement("div");
        a.fire("beforerender"),
        c.innerHTML = a.tpl.getHTML({
            value: a.value,
            height: a.height
        }),
        a.el = b.appendChild(c),
        a.el = Fancy.get(a.el),
        a.el.addClass(a.cls),
        a.el.addClass(a.fieldCls),
        a.acceptedValue = a.value,
        a.fire("afterrender"),
        a.fire("render")
    },
    set: function(a, b) {
        var c = this;
        c.el.firstChild().update(a),
        b !== !1 && c.onInput()
    },
    get: function() {
        var a = this;
        return a.el.firstChild().dom.innerHTML
    }
}),
Fancy.define(["Fancy.form.field.ReCaptcha", "Fancy.ReCaptcha"], {
    type: "field.recaptcha",
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "enter", "up", "down", "change", "key"),
        a.Super("init", arguments),
        a.tpl = new Fancy.Template(a.tpl),
        a.render(),
        a.name = "recaptcha",
        a.hidden && a.css("display", "none"),
        a.style && a.css(a.style);
        var b = document.createElement("script");
        b.type = "text/javascript",
        b.src = "https://www.google.com/recaptcha/api.js",
        Fancy.get(document.head).append(b)
    },
    get: function() {
        var a = this
          , b = a.el.select("form");
        return a.value ? a.value : (a.value = "wait",
        b.one("submit", function(b) {
            b.preventDefault(),
            a.value = $(this).serialize().replace("g-recaptcha-response=", "")
        }),
        b.submit(),
        a.value)
    },
    fieldCls: "fancy fancy-field",
    value: "",
    width: 100,
    tpl: ['<form method="POST">', '<div class="g-recaptcha" data-sitekey="{key}"></div>', "</form>"]
}),
Fancy.define(["Fancy.form.field.Radio", "Fancy.Radio"], {
    mixins: [Fancy.form.field.Mixin],
    extend: Fancy.Widget,
    type: "field.radio",
    constructor: function() {
        var a = this;
        a.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.addEvents("focus", "blur", "input", "up", "down", "change", "key"),
        a.Super("init", arguments);
        var b = ""
          , c = a.items
          , d = 0
          , e = c.length;
        for (a.column && (a.cls += " fancy-field-radio-column",
        b += '<div style="margin-left: ' + a.labelWidth + 'px;">'); e > d; d++) {
            var f = c[d]
              , g = ""
              , h = "fancy-field-text";
            a.column || 0 === d || (g = "margin-left:10px;"),
            f.value === a.value && (h += " fancy-field-radio-on"),
            b += ['<div class="' + h + '" value=' + f.value + ">", '<div class="fancy-field-radio-input" style="float:left;' + g + '"></div>', '<div style="float:left;margin:7px 0px 0px 0px;">' + f.text + "</div>", "</div>"].join("")
        }
        a.column && (b += "</div>"),
        a.itemsHTML = b,
        a.preRender(),
        a.render(),
        a.acceptedValue = a.value,
        a.set(a.value),
        a.ons()
    },
    labelText: "",
    labelWidth: 60,
    value: !1,
    checkedCls: "fancy-field-radio-on",
    fieldCls: "fancy fancy-field fancy-field-radio",
    tpl: ['<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">', "{label}", '<div class="fancy-field-error" style="{errorTextStyle}"></div>', "</div>", "{itemsHTML}", '<div class="fancy-clearfix"></div>'],
    ons: function() {
        var a = this
          , b = a.el;
        b.$dom.delegate(".fancy-field-text", "click", function() {
            a.set(Fancy.get(this).attr("value"))
        }),
        b.on("mousedown", a.onMouseDown, a)
    },
    onClick: function() {
        var a = this
          , b = a.checkedCls;
        a.addClass(b),
        a.toggleClass(b),
        a.value = a.hasClass(b),
        a.fire("change", a.value)
    },
    onMouseDown: function(a) {
        a.preventDefault()
    },
    set: function(a, b) {
        var c = this
          , d = c.el
          , e = c.checkedCls
          , f = d.select(".fancy-field-text");
        f.removeClass(e),
        d.select("[value=" + a + "]").addClass(e),
        c.value = a,
        b !== !1 && c.fire("change", c.value)
    },
    setValue: function(a, b) {
        this.set(a, b)
    },
    getValue: function() {
        var a = this;
        return a.value
    },
    get: function() {
        return this.getValue()
    },
    clear: function() {
        this.set(!1)
    }
}),
function() {
    Fancy.vtypes = {},
    Fancy.addValid = function(a, b) {
        Fancy.vtypes[a] = b
    }
    ,
    Fancy.isValid = function(a, b) {
        var c;
        if (Fancy.isString(a) ? c = Fancy.vtypes[a] : Fancy.isObject(a) && (a.type ? (c = Fancy.vtypes[a.type],
        Fancy.applyIf(a, c)) : c = a),
        c.before) {
            var d = c.before
              , e = [a];
            Fancy.isString(d) ? e.push(d) : Fancy.isArray(d) && (e = e.concat(d)),
            e.reverse();
            for (var f = 0, g = e.length; g > f; f++)
                if (c = Fancy.isObject(e[f]) ? e[f] : Fancy.vtypes[e[f]],
                c.re) {
                    if (c.re.test(b) === !1)
                        return c
                } else if (c.fn && c.fn.apply(c, [b]) === !1)
                    return c
        } else {
            if (c.re && c.re.test(b) === !1)
                return c;
            if (c.fn.apply(c, [b]) === !1)
                return c
        }
        return !0
    }
}(),
Fancy.addValid("notempty", {
    text: "Must be present",
    fn: function(a) {
        return null === a || void 0 === a ? !1 : 0 !== String(a).length
    }
}),
Fancy.addValid("notnan", {
    text: "Must be numeric",
    fn: function(a) {
        return !isNaN(a)
    }
}),
Fancy.addValid("min", {
    before: ["notempty", "notnan"],
    text: "Must be must be at least {param}",
    fn: function(a) {
        return a > this.param
    }
}),
Fancy.addValid("max", {
    before: ["notempty", "notnan"],
    text: "Must be no more than {param}",
    fn: function(a) {
        return a < this.param
    }
}),
Fancy.addValid("range", {
    before: ["notempty", "notnan"],
    text: "Must be between {min} and {max}",
    fn: function(a) {
        return a >= this.min && a <= this.max
    }
}),
Fancy.addValid("email", {
    before: "notempty",
    re: /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
    text: "Is not a valid email address"
}),
Fancy.Mixin("Fancy.grid.mixin.PrepareConfig", {
    prepareConfig: function(a, b) {
        var c = this;
        return a._plugins = a._plugins || [],
        a = c.copyColumns(a, b),
        a = c.prepareConfigData(a, b),
        a = c.prepareConfigTheme(a, b),
        a = c.prepareConfigLang(a, b),
        a = c.prepareConfigSpark(a, b),
        a = c.prepareConfigPaging(a, b),
        a = c.prepareConfigTBar(a),
        a = c.prepareConfigExpander(a),
        a = c.prepareConfigColumnMinMaxWidth(a),
        a = c.prepareConfigGrouping(a),
        a = c.prepareConfigGroupHeader(a),
        a = c.prepareConfigSorting(a),
        a = c.prepareConfigEdit(a),
        a = c.prepareConfigSelection(a),
        a = c.prepareConfigLoadMask(a, b),
        a = c.prepareConfigDefaults(a),
        a = c.prepareConfigFilter(a),
        a = c.prepareConfigSearch(a),
        a = c.prepareConfigSmartIndex(a),
        a = c.prepareConfigActionColumn(a),
        a = c.prepareConfigChart(a, b),
        a = c.prepareConfigCellTip(a),
        a = c.prepareConfigColumnsWidth(a),
        a = c.prepareConfigSize(a, b),
        a = c.prepareConfigColumns(a),
        a = c.prepareConfigColumnsResizer(a),
        a = c.prepareConfigFooter(a),
        a = c.prepareConfigDD(a)
    },
    copyColumns: function(a, b) {
        return a.columns && (a.columns = Fancy.Array.copy(a.columns, !0)),
        b.columns && (b.columns = Fancy.Array.copy(b.columns)),
        a
    },
    prepareConfigSpark: function(a, b) {
        for (var c = this, d = 0, e = a.columns.length; e > d; d++) {
            var f = a.columns[d]
              , g = f.sparkConfig;
            if (g && g.legend)
                switch (g.legend.type) {
                case "tbar":
                case "bbar":
                case "buttons":
                    var h = g.legend.type
                      , i = f.index;
                    a[h] = a[h] || [],
                    a[h] = a[h].concat(c._generateLegendBar(g.title, i, g.legend.style, f))
                }
        }
        return a
    },
    _generateLegendBar: function(a, b, c, d) {
        for (var e = 0, f = a.length, g = [], h = this, i = {
            length: 0
        }, j = function(b) {
            for (var c, e = h, f = 0, g = h.columns.length; g > f; f++)
                d.index === h.columns[f].index && (c = f);
            (b.el.hasClass("fancy-legend-item-disabled") || a.length - 1 !== i.length) && (b.el.toggleClass("fancy-legend-item-disabled"),
            b.el.hasClass("fancy-legend-item-disabled") ? (i[b.index] = !0,
            e.disableLegend(c, b.index),
            i.length++) : (e.enableLegend(c, b.index),
            delete i[b.index],
            i.length--))
        }; f > e; e++) {
            var k = b[e];
            Fancy.isString(d.index) && (k = d.index + "." + e);
            var l = {
                handler: j,
                index: k,
                imageColor: Fancy.COLORS[e],
                text: a[e]
            };
            0 === e && c && (l.style = c),
            g.push(l)
        }
        return g
    },
    prepareConfigData: function(a, b) {
        if (Fancy.isArray(a.data) && 0 === a.data.length && a.columns) {
            for (var c = [], d = 0, e = a.columns.length; e > d; d++) {
                var f = a.columns[d];
                f.index && c.push(f.index || f.key)
            }
            a.data = {
                fields: c,
                items: []
            }
        }
        return a
    },
    prepareConfigLoadMask: function(a) {
        a.data;
        return a._plugins.push({
            type: "grid.loadmask"
        }),
        a
    },
    reConfigStore: function(a) {
        var b = this
          , c = b.store
          , d = b.getFieldsFromData(a)
          , e = "Fancy.model." + Fancy.id();
        Fancy.define(e, {
            extend: Fancy.Model,
            fields: d
        }),
        b.model = e,
        c.model = e,
        b.fields = d,
        c.fields = d,
        c.setModel()
    },
    prepareConfigDefaults: function(a) {
        a.defaults = a.defaults || {},
        void 0 === a.defaults.type && (a.defaults.type = "string");
        for (var b in a.defaults)
            for (var c = 0, d = a.columns.length; d > c; c++) {
                switch (a.columns[c].type) {
                case "select":
                case "order":
                case "expand":
                    continue
                }
                void 0 === a.columns[c][b] && (a.columns[c][b] = a.defaults[b])
            }
        return a
    },
    prepareConfigColumnMinMaxWidth: function(a) {
        for (var b, c = 0, d = a.columns.length; d > c; c++)
            b = a.columns[c],
            void 0 === b.width && b.minWidth && (b.width = b.minWidth);
        return a
    },
    prepareConfigCellTip: function(a) {
        for (var b = a.columns, c = 0, d = b.length; d > c; c++) {
            var e = b[c];
            if (e.cellTip) {
                a._plugins.push({
                    type: "grid.celltip"
                });
                break
            }
        }
        return a
    },
    prepareConfigDD: function(a) {
        if (a.gridToGrid) {
            var b = {
                type: "grid.dragdrop"
            };
            Fancy.apply(b, a.gridToGrid),
            a._plugins.push(b)
        }
        return a
    },
    prepareConfigDateColumn: function(a) {
        for (var b = a.columns, c = 0, d = b.length; d > c; c++) {
            var e = b[c];
            "date" === e.type && void 0 === e.format && (e.format = "date")
        }
        return a
    },
    prepareConfigColumns: function(a) {
        for (var b = a.columns, c = [], d = [], e = 0, f = b.length; f > e; e++) {
            var g = b[e];
            switch (g.type) {
            case "select":
                this.checkboxRowSelection = !0,
                this.multiSelect = !0,
                b[e].index = "$selected",
                b[e].editable = !0;
                break;
            case "order":
                b[e].editable = !1,
                b[e].sortable = !1,
                b[e].cellAlign = "right";
                break;
            case "checkbox":
                void 0 === g.cellAlign && (g.cellAlign = "center");
                break;
            case "currency":
                void 0 === g.format && (g.format = "number")
            }
            g.locked ? (c.push(g),
            b.splice(e, 1),
            e--,
            f--) : g.rightLocked && (d.push(g),
            b.splice(e, 1),
            e--,
            f--)
        }
        return a.leftColumns = c,
        a.rightColumns = d,
        a
    },
    prepareConfigColumnsWidth: function(a) {
        var b, c = a.columns, d = 0, e = c.length, f = a.width, g = [], h = [], i = 100, j = 50, k = i, l = 0, m = !1, n = !1;
        for (void 0 === f && a.renderTo && (f = Fancy.get(a.renderTo).width()),
        a.flexScrollSensitive !== !1 ? (f -= a.bottomScrollHeight,
        f -= 2 * a.panelBorderWidth) : f -= 1; e > d; d++) {
            switch (b = c[d],
            b.type) {
            case "select":
                void 0 === b.width && (b.width = 35);
                break;
            case "order":
                void 0 === b.width && (b.width = 40);
                break;
            case "expand":
                void 0 === b.width && (b.width = 38)
            }
            b.locked && (m = !0),
            b.rightLocked && (n = !0),
            void 0 === b.width ? (b.flex && (l += b.flex,
            h.push(d)),
            g.push(d)) : Fancy.isNumber(b.width) && (f -= b.width)
        }
        m && n && (f -= 2);
        var o = f / g.length;
        j > o && (o = j),
        o > i && (k = i),
        j > o && (k = j),
        d = 0,
        e = g.length;
        for (var p = !1, q = f; e > d; d++)
            b = c[g[d]],
            void 0 === b.flex && (q -= k);
        if (l)
            for (d = 0,
            e = h.length; e > d; d++)
                q -= q / l * b.flex;
        for (0 > q && (p = !0),
        d = 0,
        e = g.length; e > d; d++)
            b = c[g[d]],
            void 0 === b.flex && (b.width = k,
            f -= k);
        if (l)
            for (d = 0,
            e = h.length; e > d; d++)
                b = c[h[d]],
                p ? b.width = k * b.flex : b.width = f / l * b.flex;
        return a
    },
    prepareConfigActionRender: function(a) {
        return function(b) {
            for (var c = a.items || [], d = 0, e = c.length; e > d; d++) {
                var f = c[d]
                  , g = f.text || ""
                  , h = Fancy.styleToString(f.style)
                  , i = f.cls || "";
                b.value += ['<div class="fancy-grid-column-action-item ' + i + '" style="' + h + '">', g, "</div>"].join(" ")
            }
            return b
        }
    },
    prepareConfigSmartIndex: function(a) {
        for (var b = a.columns, c = 0, d = b.length; d > c; c++) {
            var e = b[c];
            if (/\+|\-|\/|\*|\[|\./.test(e.index)) {
                var f = e.index;
                f = f.replace(/(\w+)/g, function(a, a, b, c) {
                    return "." === c[b - 1] ? a : isNaN(Number(a)) ? "data." + a : a
                }),
                f = "return " + f + ";",
                e.smartIndexFn = new Function("data",f)
            }
        }
        return a
    },
    prepareConfigActionColumn: function(a) {
        for (var b = this, c = a.columns, d = 0, e = c.length; e > d; d++) {
            var f = c[d];
            if ("action" === f.type) {
                f.sortable = !1,
                f.editable = !1,
                f.render = b.prepareConfigActionRender(f);
                var g = f.items;
                if (void 0 !== g && 0 !== g.length)
                    for (var h, i = 0, j = g.length; j > i; i++)
                        switch (h = g[i],
                        h.action) {
                        case "remove":
                            void 0 === h.handler && (h.handler = function(a, b) {
                                a.remove(b)
                            }
                            );
                            break;
                        case "dialog":
                            !function(a) {
                                if (void 0 === a.handler) {
                                    for (var d = [], e = 0, f = c.length, g = 87; f > e; e++) {
                                        var h = c[e];
                                        switch (h.type) {
                                        case "action":
                                            continue
                                        }
                                        d.push({
                                            label: h.title || "",
                                            type: h.type,
                                            name: h.index
                                        }),
                                        g += 38
                                    }
                                    a.handler = function(c, e) {
                                        a.dialog ? (a.dialog.show(),
                                        a.dialog.set(e.data)) : a.dialog = new FancyForm({
                                            window: !0,
                                            draggable: !0,
                                            modal: !0,
                                            title: {
                                                text: "Edit",
                                                tools: [{
                                                    text: "Close",
                                                    handler: function() {
                                                        this.hide()
                                                    }
                                                }]
                                            },
                                            width: 300,
                                            height: g,
                                            items: d,
                                            buttons: ["side", {
                                                text: "Clear",
                                                handler: function() {
                                                    this.clear()
                                                }
                                            }, {
                                                text: "Save",
                                                handler: function() {
                                                    var a = this.get();
                                                    a.id && (b.getById(a.id).set(a),
                                                    b.update())
                                                }
                                            }],
                                            events: [{
                                                init: function() {
                                                    this.show(),
                                                    this.set(e.data)
                                                }
                                            }]
                                        })
                                    }
                                }
                            }(h)
                        }
            }
        }
        return a
    },
    prepareConfigSorting: function(a) {
        var b = a.defaults || {};
        if (b.sortable)
            return a._plugins.push({
                type: "grid.sorter"
            }),
            a;
        for (var c = 0, d = a.columns.length; d > c; c++) {
            var e = a.columns[c];
            e.sortable && a._plugins.push({
                type: "grid.sorter"
            })
        }
        return a
    },
    prepareConfigSelection: function(a) {
        var b = !1
          , c = {
            type: "grid.selection"
        };
        return (a.trackOver || a.columnTrackOver || a.cellTrackOver) && (b = !0),
        a.selModel && (b = !0,
        a.selection = a.selection || {},
        a.selection.selModel = a.selModel,
        a.selection[a.selModel] = !0),
        a.selection && (b = !0,
        Fancy.isObject(a.selection) && Fancy.apply(c, a.selection)),
        b === !0 && a._plugins.push(c),
        a
    },
    prepareConfigEdit: function(a) {
        var b = a.defaults || {}
          , c = {
            type: "grid.edit"
        }
          , d = !1;
        a.clicksToEdit && (c.clicksToEdit = a.clicksToEdit),
        (b.editable || a.clicksToEdit || a.data && a.data.proxy) && (d = !0,
        a._plugins.push(c)),
        b.editable && (d || a._plugins.push(c),
        a._plugins.push({
            type: "grid.celledit"
        }),
        d = !0),
        a.rowEdit && a._plugins.push({
            type: "grid.rowedit"
        });
        for (var e = 0, f = a.columns.length; f > e; e++) {
            var g = a.columns[e];
            switch (void 0 === g.index && void 0 === g.key && (g.editable = !1),
            g.type) {
            case "image":
                g.sortable = !1;
                break;
            case "sparklineline":
            case "sparklinebar":
            case "sparklinetristate":
            case "sparklinediscrete":
            case "sparklinebullet":
            case "sparklinepie":
            case "sparklinebox":
                g.editable = !1,
                g.sortable = !1
            }
            g.editable && d === !1 && (a._plugins.push(c),
            a._plugins.push({
                type: "grid.celledit"
            }))
        }
        return a
    },
    prepareConfigExpander: function(a) {
        if (a.expander) {
            var b = a.expander;
            Fancy.apply(b, {
                type: "grid.expander"
            }),
            a.expanded = {},
            a._plugins.push(b)
        }
        return a
    },
    prepareConfigGrouping: function(a) {
        if (a.grouping) {
            var b = a.grouping;
            Fancy.apply(b, {
                type: "grid.grouping"
            }),
            a.expanded = {},
            a._plugins.push(b)
        }
        return a
    },
    prepareConfigFilter: function(a) {
        var b = a.columns
          , c = 0
          , d = b.length
          , e = !1
          , f = !1
          , g = {
            type: "grid.filter"
        };
        for (a.filter && (a.filter === !0 && (e = !0,
        a.filter = {}),
        Fancy.apply(g, a.filter)); d > c; c++) {
            var h = b[c];
            h.filter && (e = !0,
            h.filter.header && (f = !0))
        }
        return g.header = f,
        e && a._plugins.push(g),
        a
    },
    prepareConfigSearch: function(a) {
        var b = {
            type: "grid.search"
        }
          , c = !1;
        return a.searching && (c = !0),
        c && a._plugins.push(b),
        a
    },
    prepareConfigGroupHeader: function(a) {
        for (var b = a.columns, c = 0, d = b.length, e = [], f = !1, g = []; d > c; c++) {
            var h = b[c];
            h.columns && (f = !0,
            e.push(h))
        }
        if (f) {
            c = 0;
            for (; d > c; c++) {
                var h = b[c];
                if (h.columns) {
                    for (var i = 0, j = h.columns.length, k = h.text || "  "; j > i; i++)
                        h.locked && (h.columns[i].locked = !0),
                        h.rightLocked && (h.columns[i].rightLocked = !0),
                        h.columns[i].grouping = k,
                        h.defaults && Fancy.applyIf(h.columns[i], h.defaults);
                    g = g.concat(h.columns),
                    f = !0,
                    e.push(h)
                } else
                    g = g.concat(b.slice(c, c + 1))
            }
            a.columns = g,
            a._plugins.push({
                type: "grid.groupheader",
                groups: e
            }),
            a.isGroupedHeader = !0
        }
        return a
    },
    prepareConfigPaging: function(a, b) {
        var c = this
          , d = a.lang
          , e = a.paging
          , f = "bbar";
        if (!e)
            return a;
        if (void 0 !== e.barType)
            switch (e.barType) {
            case "bbar":
            case "tbar":
            case "both":
                f = e.barType;
                break;
            case !1:
            case "none":
                f = "none";
                break;
            default:
                throw new Error("[FancyGrid Error]: - not supported bar type for paging")
            }
        return a._plugins.push({
            i18n: b.i18n,
            type: "grid.paging",
            barType: f
        }),
        "both" === f ? (a.tbar = c.generatePagingBar(e, d),
        a.bbar = c.generatePagingBar(e, d)) : "none" === f || (a[f] = c.generatePagingBar(e, d)),
        a
    },
    generatePagingBar: function(a, b) {
        var c = this
          , d = []
          , e = "fancy-bar-button-disabled"
          , f = {
            "float": "left",
            "margin-right": "5px",
            "margin-top": "3px"
        };
        if (d.push({
            imageCls: "fancy-paging-first",
            disabledCls: e,
            role: "first",
            handler: function(a) {
                c.paging.firstPage()
            },
            style: {
                "float": "left",
                "margin-left": "5px",
                "margin-right": "5px",
                "margin-top": "3px"
            }
        }),
        d.push({
            imageCls: "fancy-paging-prev",
            disabledCls: e,
            role: "prev",
            handler: function() {
                c.paging.prevPage()
            },
            style: f
        }),
        d.push("|"),
        d.push({
            type: "text",
            text: b.paging.page
        }),
        d.push({
            type: "number",
            label: !1,
            padding: !1,
            style: {
                "float": "left",
                "margin-left": "-1px",
                "margin-right": "8px",
                "margin-top": "4px"
            },
            role: "pagenumber",
            min: 1,
            width: 30,
            listeners: [{
                enter: function(a) {
                    0 === parseInt(a.getValue()) && a.set(1);
                    var b = parseInt(a.getValue()) - 1
                      , d = c.paging.setPage(b);
                    b !== d && a.set(d)
                }
            }]
        }),
        d.push({
            type: "text",
            text: "",
            role: "ofText"
        }),
        d.push("|"),
        d.push({
            imageCls: "fancy-paging-next",
            disabledCls: e,
            role: "next",
            style: f,
            handler: function() {
                c.paging.nextPage()
            }
        }),
        d.push({
            imageCls: "fancy-paging-last",
            disabledCls: e,
            role: "last",
            style: f,
            handler: function() {
                c.paging.lastPage()
            }
        }),
        Fancy.isObject(a) && a.refreshButton === !0 && (d.push("|"),
        d.push({
            imageCls: "fancy-paging-refresh",
            disabledCls: e,
            role: "refresh",
            style: f,
            handler: function() {
                c.paging.refresh()
            }
        })),
        a && Fancy.isArray(a.pageSizeData)) {
            for (var g = a.pageSizeData, h = [], i = 0, j = g.length, k = 0; j > i; i++)
                h.push({
                    index: i,
                    value: g[i]
                }),
                a.pageSize === g[i] && (k = i);
            var l = Fancy.Object.copy(f);
            l["margin-top"] = "4px",
            d.push({
                editable: !1,
                width: 50,
                type: "combo",
                role: "size",
                style: l,
                data: h,
                displayKey: "value",
                valueKey: "index",
                value: k,
                events: [{
                    change: function(a, b) {
                        c.paging.setPageSize(g[b])
                    }
                }]
            })
        }
        return d.push("side"),
        d.push({
            type: "text",
            role: "info",
            text: ""
        }),
        d
    },
    prepareConfigColumnsResizer: function(a) {
        var b = a.defaults || {};
        if (b.resizable)
            return a._plugins.push({
                type: "grid.columnresizer"
            }),
            a;
        for (var c = [].concat(a.columns).concat(a.leftColumns).concat(a.rightColumns), d = 0, e = c.length; e > d; d++) {
            var f = c[d];
            f.resizable && a._plugins.push({
                type: "grid.columnresizer"
            })
        }
        return a
    },
    prepareConfigTBar: function(a) {
        var b = this
          , c = a.tbar;
        if (c)
            for (var d = 0, e = c.length; e > d; d++)
                switch ("search" === c[d].type && (a.searching = !0,
                a.filter = !0),
                c[d].action) {
                case "add":
                    void 0 === c[d].handler && (c[d].handler = function() {
                        b.insert(0, {})
                    }
                    );
                    break;
                case "remove":
                    void 0 === c[d].handler && (c[d].disabled = !0,
                    c[d].handler = function() {
                        for (var a = b.getSelection(), c = 0, d = a.length; d > c; c++) {
                            var e = a[c];
                            b.remove(e)
                        }
                        b.selection.clearSelection()
                    }
                    ,
                    c[d].events = [{
                        render: function() {
                            var a = this;
                            setTimeout(function() {
                                var b = Fancy.getWidget(a.el.parent().parent().parent().select(".fancy-grid").dom.id);
                                b.on("select", function() {
                                    var c = b.getSelection();
                                    0 === c.length ? a.disable() : a.enable()
                                }),
                                b.on("clearselect", function() {
                                    a.disable()
                                })
                            }, 10)
                        }
                    }])
                }
        return a
    },
    prepareConfigChart: function(a) {
        var b = a.data
          , c = b.chart;
        if (Fancy.isObject(c) && (c = [c]),
        b && b.chart) {
            a._plugins.push({
                type: "grid.chartintegration",
                chart: c,
                toChart: b.items ? !0 : b.proxy ? !0 : !1
            });
            for (var d = 0, e = c.length; e > d; d++) {
                var f = c[d]
                  , g = f.type;
                switch (g) {
                case "highchart":
                case "highcharts":
                    a._plugins.push({
                        type: "grid.highchart"
                    });
                    break;
                case void 0:
                    throw new Error("[FancyGrid Error] - type of chart is undefined");
                default:
                    throw new Error("[FancyGrid Error] - type of chart " + g + " does not exist")
                }
            }
        }
        return a
    },
    prepareConfigSize: function(a, b) {
        var c, d = a.renderTo, e = !!(a.title || a.subTitle || a.tbar || a.bbar || a.buttons || a.panel), f = a.panelBodyBorders, g = a.gridBorders;
        if (void 0 === a.width)
            d && (a.responsive = !0,
            c = Fancy.get(d),
            a.width = parseInt(c.width()));
        else if ("fit" === a.width) {
            for (var h = a.columns, i = 0, j = h.length, k = 0, l = !1; j > i; i++)
                k += h[i].width,
                h[i].locked && (l = !0);
            k += a.title || a.subTitle ? f[1] + f[3] + g[1] + g[3] : g[1] + g[3],
            l && k--,
            a.width = k
        }
        if ("fit" === a.height) {
            var m = 0;
            Fancy.isArray(a.data) ? m = a.data.length : a.data && Fancy.isArray(a.data.items) && (m = a.data.items.length),
            height = m * a.cellHeight,
            a.title && (height += a.titleHeight),
            (a.tbar || a.tabs) && (height += a.barHeight),
            a.bbar && (height += a.barHeight),
            a.buttons && (height += a.barHeight),
            a.subTBar && (height += a.barHeight),
            a.footer && (height += a.barHeight),
            a.header !== !1 && (height += a.cellHeaderHeight),
            e ? height += f[0] + f[2] + g[0] + g[2] : height += g[0] + g[2],
            a.minHeight && height < a.minHeight && (height = a.minHeight),
            a.heightFit = !0,
            a.height = height
        }
        return a
    }
}),
Fancy.Mixin("Fancy.grid.mixin.ActionColumn", {
    initActionColumnHandler: function() {
        var a = this;
        a.on("cellclick", a.onCellClickColumnAction, a)
    },
    onCellClickColumnAction: function(a, b) {
        var c, d, e = this, f = b.column, g = (Fancy.get(b.cell),
        b.e.target,
        f.items);
        "action" === f.type && (c = e.getActiveActionColumnItem(b),
        g && void 0 !== c && (d = g[c],
        d.handler && d.handler(e, b)))
    },
    getActiveActionColumnItem: function(a) {
        for (var b = Fancy.get(a.cell), c = a.e.target, d = b.select(".fancy-grid-column-action-item"), e = 0, f = d.length; f > e; e++)
            if (d.item(e).within(c))
                return e
    }
}),
Fancy.Mixin("Fancy.grid.mixin.Edit", {
    remove: function(a, b) {
        var c = this
          , d = c.store
          , e = "remove";
        if (!c.store)
            return void setTimeout(function() {
                c.remove(a, b)
            }, 100);
        if (b && (e = "removeAt"),
        Fancy.isArray(a))
            for (var f = 0, g = a.length; g > f; f++)
                d[e](a[f]);
        else
            d[e](a);
        c.setSidesHeight()
    },
    removeAt: function(a) {
        var b = this;
        b.remove(a, !0)
    },
    add: function(a) {
        var b = this;
        if (!b.store)
            return void setTimeout(function() {
                b.add(a)
            }, 100);
        if (Fancy.isArray(a))
            for (var c = 0, d = a.length; d > c; c++)
                b.add(a[c]);
        else
            b.store.add(a),
            b.setSidesHeight()
    },
    insert: function(a, b) {
        var c = this
          , d = c.store;
        if (!c.store)
            return void setTimeout(function() {
                c.insert(a, b)
            }, 100);
        if (Fancy.isArray(b)) {
            for (var e = b.length - 1; -1 !== e; e--)
                c.insert(b[e], a);
            return void c.setSidesHeight()
        }
        if (Fancy.isArray(a)) {
            for (var e = a.length - 1; -1 !== e; e--)
                c.insert(a[e], 0);
            return void c.setSidesHeight()
        }
        if (Fancy.isObject(a) && void 0 === b)
            b = a,
            a = 0;
        else if (Fancy.isObject(a) && Fancy.isNumber(b)) {
            var f = b;
            b = a,
            a = f
        }
        c.paging && "server" !== d.proxyType && (a += d.showPage * d.pageSize),
        d.insert(a, b),
        c.setSidesHeight()
    },
    set: function(a, b, c) {
        var d = this
          , e = d.store;
        return d.store ? void (Fancy.isObject(b) && void 0 === c ? e.setItemData(a, b, c) : e.set(a, b, c)) : void setTimeout(function() {
            d.set(a, b, c)
        }, 100)
    },
    setById: function(a, b, c) {
        var d = this
          , e = d.store
          , f = e.getRow(a);
        if (!d.store)
            return void setTimeout(function() {
                d.set(f, b, c)
            }, 100);
        if (Fancy.isObject(b) && void 0 === c) {
            for (var g in b) {
                var h = d.getColumnByIndex(g);
                if (h && "date" === h.type) {
                    var i = h.format
                      , j = Fancy.Date.parse(b[g], i.read, i.mode)
                      , k = Fancy.Date.parse(e.getById(a).get(g), i.edit, i.mode);
                    +j === +k && delete b[g]
                }
            }
            e.setItemData(f, b, c)
        } else
            e.set(f, b, c)
    }
}),
Fancy.Mixin("Fancy.grid.mixin.Grid", {
    tpl: ['<div class="fancy-grid-left fancy-grid-left-empty"></div>', '<div class="fancy-grid-center"></div>', '<div class="fancy-grid-right fancy-grid-right-empty"></div>', '<div class="fancy-grid-editors"></div>'],
    initStore: function() {
        var a, b, c = this, d = c.getFieldsFromData(c.data), e = "Fancy.model." + Fancy.id(), f = c.data, g = !1, h = c.state;
        c.data.items && (f = c.data.items),
        a = c.data.remoteSort,
        b = c.data.remoteFilter,
        Fancy.define(e, {
            extend: Fancy.Model,
            fields: d
        }),
        c.grouping && void 0 !== c.grouping.collapsed && (g = c.grouping.collapsed);
        var i = {
            widget: c,
            model: e,
            data: f,
            paging: c.paging,
            remoteSort: a,
            remoteFilter: b,
            collapsed: g,
            multiSort: c.multiSort
        };
        h && h.filters && (i.filters = h.filters),
        f.pageSize && (i.pageSize = f.pageSize),
        c.store = new Fancy.Store(i),
        c.model = e,
        c.fields = d,
        c.store.filters && setTimeout(function() {
            c.filter.filters = c.store.filters,
            c.filter.updateStoreFilters()
        }, 1)
    },
    initTouch: function() {
        var a = this;
        Fancy.isTouch && window.FastClick && (a.panel ? (FastClick.attach(a.panel.el.dom),
        a.panel.addClass("fancy-touch")) : (FastClick.attach(a.el.dom),
        a.addClass("fancy-touch")))
    },
    initElements: function() {
        var a = this;
        a.header !== !1 && (a.leftHeader = new Fancy.grid.Header({
            widget: a,
            side: "left"
        }),
        a.header = new Fancy.grid.Header({
            widget: a,
            side: "center"
        }),
        a.rightHeader = new Fancy.grid.Header({
            widget: a,
            side: "right"
        })),
        a.leftBody = new Fancy.grid.Body({
            widget: a,
            side: "left"
        }),
        a.body = new Fancy.grid.Body({
            widget: a,
            side: "center"
        }),
        a.rightBody = new Fancy.grid.Body({
            widget: a,
            side: "right"
        }),
        a.leftEl = a.el.select(".fancy-grid-left"),
        a.centerEl = a.el.select(".fancy-grid-center"),
        a.rightEl = a.el.select(".fancy-grid-right")
    },
    getFieldsFromData: function(a) {
        var b = a.items || a;
        if (a.fields)
            return a.fields;
        if (!b)
            throw new Error("not set fields of data");
        var c = b[0]
          , d = [];
        for (var e in c)
            d.push(e);
        return d
    },
    render: function() {
        var a = this
          , b = a.renderTo || document.body
          , c = Fancy.get(document.createElement("div"))
          , d = a.panelBodyBorders;
        c.addClass(Fancy.cls),
        c.addClass(a.widgetCls),
        c.addClass(a.cls),
        c.attr("id", a.id),
        void 0 === a.panel && a.shadow && c.addClass("fancy-panel-shadow"),
        a.columnLines === !1 && c.addClass("fancy-grid-disable-column-lines"),
        "default" === a.theme || a.panel || c.addClass("fancy-theme-" + a.theme);
        var e = 0
          , f = 0;
        a.panel && (e = d[1] + d[3]),
        c.css({
            width: a.width - e + "px",
            height: a.height - f + "px"
        }),
        c.update(a.tpl.join(" ")),
        a.el = Fancy.get(Fancy.get(b).dom.appendChild(c.dom)),
        a.setHardBordersWidth(),
        a.rendered = !0
    },
    setHardBordersWidth: function() {
        var a = this
          , b = (a.gridBorders,
        a.gridWithoutPanelBorders,
        a.panel ? a.gridBorders : a.gridWithoutPanelBorders);
        a.wrapped && (b = a.gridBorders),
        a.css({
            "border-top-width": b[0],
            "border-right-width": b[1],
            "border-bottom-width": b[2],
            "border-left-width": b[3]
        })
    },
    update: function() {
        var a = this
          , b = a.store;
        b.loading || (a.updater.update(),
        a.fire("update"),
        a.heightFit && a.fitHeight())
    },
    setSides: function() {
        var a = this
          , b = a.leftColumns
          , c = a.columns
          , d = a.rightColumns
          , e = 0
          , f = b.length
          , g = 0
          , h = 0
          , i = 0
          , j = 0
          , k = (a.borders,
        a.gridBorders)
          , l = a.panelBodyBorders
          , m = a.gridWithoutPanelBorders;
        a.wrapped;
        for (a.panel && (j = a.panelBorderWidth),
        b.length > 0 && a.leftEl.removeClass("fancy-grid-left-empty"),
        d.length > 0 && a.rightEl.removeClass("fancy-grid-right-empty"); f > e; e++)
            g += b[e].width;
        for (e = 0,
        f = c.length; f > e; e++)
            h += c[e].width;
        for (e = 0,
        f = d.length; f > e; e++)
            i += d[e].width;
        h = a.wrapped ? a.width - k[1] - k[3] : a.panel ? a.width - k[1] - k[3] - l[1] - l[3] : a.width - m[1] - m[3],
        0 === g && 0 === i || (h -= 0 === i ? g : 0 === g ? i : a.width > g + h + i ? g : g + i),
        a.leftEl.css({
            width: g + "px"
        }),
        a.centerEl.css({
            left: g + "px",
            width: h + "px"
        }),
        a.header && (a.el.select(".fancy-grid-left .fancy-grid-header").css({
            width: g + "px"
        }),
        a.el.select(".fancy-grid-center .fancy-grid-header").css({
            width: h + "px"
        })),
        a.el.select(".fancy-grid-center .fancy-grid-body").css({
            width: h + "px"
        }),
        a.width > g + h + i ? a.rightEl.css({
            right: "0px"
        }) : a.rightEl.css({
            left: "",
            right: "0px"
        }),
        a.rightEl.css({
            width: i
        }),
        a.header && a.el.select(".fancy-grid-right .fancy-grid-header").css({
            width: i + "px"
        })
    },
    setColumnsPosition: function() {
        var a = this;
        a.body.setColumnsPosition(),
        a.leftBody.setColumnsPosition(),
        a.rightBody.setColumnsPosition()
    },
    setSidesHeight: function() {
        var a = this
          , b = a.store
          , c = 1;
        a.header !== !1 && (c += a.cellHeaderHeight,
        a.filter && a.filter.header && (c += a.cellHeaderHeight),
        a.groupheader && (c += a.cellHeaderHeight)),
        a.grouping && (c += a.grouping.groups.length * a.groupRowHeight),
        a.expander && (c += a.expander.plusHeight),
        c += b.getLength() * a.cellHeight - 1,
        a.leftEl.css({
            height: c + "px"
        }),
        a.centerEl.css({
            height: c + "px"
        }),
        a.rightEl.css({
            height: c + "px"
        })
    },
    preRender: function() {
        var a = this;
        (a.title || a.subTitle || a.tbar || a.bbar || a.buttons || a.panel) && a.renderPanel()
    },
    renderPanel: function() {
        var a = this
          , b = {
            renderTo: a.renderTo,
            title: a.title,
            subTitle: a.subTitle,
            width: a.width,
            height: a.height,
            titleHeight: a.titleHeight,
            subTitleHeight: a.subTitleHeight,
            barHeight: a.barHeight,
            theme: a.theme,
            shadow: a.shadow,
            style: a.style || {},
            window: a.window,
            modal: a.modal,
            frame: a.frame,
            items: [a],
            draggable: a.draggable,
            resizable: a.resizable,
            minWidth: a.minWidth,
            minHeight: a.minHeight,
            panelBodyBorders: a.panelBodyBorders,
            barContainer: a.barContainer,
            barScrollEnabled: a.barScrollEnabled
        }
          , c = a.panelBodyBorders;
        a.bbar && (b.bbar = a.bbar,
        a.height -= a.barHeight),
        a.tbar && (b.tbar = a.tbar,
        a.height -= a.barHeight),
        a.subTBar && (b.subTBar = a.subTBar,
        a.height -= a.barHeight),
        a.buttons && (b.buttons = a.buttons,
        a.height -= a.barHeight),
        a.footer && (b.footer = a.footer,
        a.height -= a.barHeight),
        a.panel = new Fancy.Panel(b),
        a.bbar = a.panel.bbar,
        a.tbar = a.panel.tbar,
        a.subTBar = a.panel.subTBar,
        a.buttons = a.panel.buttons,
        a.wrapped || a.panel.addClass("fancy-panel-grid-inside"),
        a.title && (a.height -= a.titleHeight),
        a.subTitle && (a.height -= a.subTitleHeight,
        a.height += c[2]),
        a.height -= c[0] + c[2],
        0 === a.panelBorderWidth,
        a.renderTo = a.panel.el.select(".fancy-panel-body-inner").dom
    },
    getBodyHeight: function() {
        var a = this
          , b = a.height
          , c = 1
          , d = a.gridBorders
          , e = a.gridWithoutPanelBorders;
        return a.groupheader && (c = 2),
        a.filter && a.filter.header && c++,
        a.header !== !1 && (b -= a.cellHeaderHeight * c),
        b -= a.panel ? d[0] + d[2] : e[0] + e[2]
    },
    ons: function() {
        var a = this
          , b = a.store
          , c = Fancy.get(document);
        b.on("change", a.onChangeStore, a),
        b.on("set", a.onSetStore, a),
        b.on("remove", a.onRemoveStore, a),
        b.on("sort", a.onSortStore, a),
        b.on("beforeload", a.onBeforeLoadStore, a),
        b.on("load", a.onLoadStore, a),
        c.on("mouseup", a.onDocMouseUp, a),
        c.on("click", a.onDocClick, a),
        c.on("mousemove", a.onDocMove, a),
        a.responsive && Fancy.$(window).bind("resize", function() {
            a.onWindowResize()
        }),
        a.on("activate", a.onActivate, a),
        a.on("deactivate", a.onDeActivate, a)
    },
    onChangeStore: function() {
        var a = this;
        a.update()
    },
    onBeforeLoadStore: function(a) {
        var b = this;
        b.fire("beforeload")
    },
    onRemoveStore: function(a, b, c) {
        var d = this;
        d.fire("remove", b, c)
    },
    onLoadStore: function(a) {
        var b = this;
        b.fire("load")
    },
    onSetStore: function(a, b) {
        var c = this;
        c.fire("set", b)
    },
    onSortStore: function(a, b) {
        var c = this;
        c.fire("sort", b)
    },
    getCellsViewHeight: function() {
        var a = this
          , b = a.store
          , c = 0
          , d = 0;
        return a.grouping && (c = a.grouping.plusScroll),
        a.expander && (c = a.expander.plusScroll),
        !a.scroller.scrollBottomEl || a.scroller.scrollBottomEl.hasClass("fancy-display-none") || (d = a.scroller.cornerSize),
        a.cellHeight * b.dataView.length + d + c
    },
    onDocMouseUp: function() {
        var a = this;
        a.fire("docmouseup")
    },
    onDocClick: function(a) {
        var b = this;
        b.fire("docclick", a)
    },
    onDocMove: function(a) {
        var b = this;
        b.fire("docmove", a)
    },
    getCenterViewWidth: function() {
        for (var a = this, b = a.centerEl.width(), c = 0, d = a.columns, e = 0, f = d.length; f > e; e++)
            c += d[e].width;
        return 0 === b ? c : b
    },
    getCenterFullWidth: function() {
        for (var a = this, b = 0, c = a.columns, d = 0, e = c.length; e > d; d++)
            b += c[d].width;
        return b
    },
    getLeftFullWidth: function() {
        for (var a = this, b = 0, c = a.leftColumns, d = 0, e = c.length; e > d; d++)
            b += c[d].width;
        return b
    },
    getRightFullWidth: function() {
        for (var a = this, b = 0, c = a.rightColumns, d = 0, e = c.length; e > d; d++)
            b += c[d].width;
        return b
    },
    getColumns: function(a) {
        var b, c = this;
        switch (a) {
        case "left":
            b = c.leftColumns;
            break;
        case "center":
            b = c.columns;
            break;
        case "right":
            b = c.rightColumns
        }
        return b
    },
    getBody: function(a) {
        var b, c = this;
        switch (a) {
        case "left":
            b = c.leftBody;
            break;
        case "center":
            b = c.body;
            break;
        case "right":
            b = c.rightBody
        }
        return b
    },
    getHeader: function(a) {
        var b, c = this;
        switch (a) {
        case "left":
            b = c.leftHeader;
            break;
        case "center":
            b = c.header;
            break;
        case "right":
            b = c.rightHeader
        }
        return b
    },
    getDomRow: function(a) {
        for (var b = this, c = b.leftBody, d = b.body, e = b.rightBody, f = b.leftColumns, g = b.columns, h = b.rightColumns, i = 0, j = f.length, k = []; j > i; i++)
            k.push(c.getDomCell(a, i));
        for (i = 0,
        j = g.length; j > i; i++)
            k.push(d.getDomCell(a, i));
        for (i = 0,
        j = h.length; j > i; i++)
            k.push(e.getDomCell(a, i));
        return k
    },
    initTextSelection: function() {
        var a = this
          , b = a.body
          , c = a.leftBody
          , d = a.rightBody;
        a.textSelection === !1 && (a.addClass("fancy-grid-unselectable"),
        b.el.on("mousedown", function(a) {
            a.preventDefault()
        }),
        c.el.on("mousedown", function(a) {
            a.preventDefault()
        }),
        d.el.on("mousedown", function(a) {
            a.preventDefault()
        }))
    },
    setTrackOver: function(a, b) {
        var c = this;
        switch (a) {
        case "cell":
            c.cellTrackOver = b;
            break;
        case "column":
            c.columnTrackOver = b;
            break;
        case "row":
            c.trackOver = b
        }
    },
    setSelModel: function(a) {
        var b = this
          , c = b.selection;
        c.cell = !1,
        c.cells = !1,
        c.row = !1,
        c.rows = !1,
        c.column = !1,
        c.columns = !1,
        c[a] = !0,
        c.clearSelection()
    },
    getSelection: function(a) {
        var b = this;
        return b.selection.getSelection(a)
    },
    clearSelection: function() {
        var a = this
          , b = a.selection;
        b.clearSelection()
    },
    destroy: function() {
        var a = this
          , b = Fancy.get(document);
        b.un("mouseup", a.onDocMouseUp, a),
        b.un("click", a.onDocClick, a),
        b.un("mousemove", a.onDocMove, a),
        a.body.destroy(),
        a.leftBody.destroy(),
        a.rightBody.destroy(),
        a.header.destroy(),
        a.leftHeader.destroy(),
        a.rightHeader.destroy(),
        a.scroller.destroy(),
        a.el.destroy(),
        a.panel && a.panel.el.destroy()
    },
    showAt: function() {
        var a = this;
        a.panel && a.panel.showAt.apply(a.panel, arguments)
    },
    show: function() {
        var a = this;
        a.panel ? a.panel.show.apply(a.panel, arguments) : a.el.show()
    },
    hide: function() {
        var a = this;
        a.panel ? a.panel.hide.apply(a.panel, arguments) : a.el.hide()
    },
    initDateColumn: function() {
        var a = this
          , b = function(b) {
            for (var c = 0, d = b.length; d > c; c++) {
                var e = b[c];
                if ("date" === e.type) {
                    e.format = e.format || {};
                    var f = {
                        type: "date"
                    };
                    Fancy.applyIf(f, a.lang.date),
                    Fancy.applyIf(e.format, f)
                }
            }
            return b
        };
        a.columns = b(a.columns),
        a.leftColumns = b(a.leftColumns),
        a.rightColumns = b(a.rightColumns)
    },
    stopEditor: function() {
        var a = this;
        a.edit.stopEditor()
    },
    getById: function(a) {
        var b = this;
        return b.store.getById(a)
    },
    get: function(a, b) {
        var c = this
          , d = c.store;
        return void 0 !== b ? d.get(a, b) : void 0 === a ? d.get() : d.getItem(a)
    },
    getTotal: function() {
        return this.store.getTotal()
    },
    getViewTotal: function() {
        return this.store.getLength()
    },
    getDataView: function() {
        return this.store.getDataView()
    },
    getData: function() {
        return this.store.getData()
    },
    selectRow: function(a) {
        var b = this;
        b.selection.selectRow(a)
    },
    selectColumn: function(a) {
        var b, c, d = this, e = d.leftColumns || [], f = d.columns || [], g = d.rightColumns || [], h = function(b) {
            for (var d = 0, e = b.length; e > d; d++) {
                var f = b[d];
                if (f.index === a || f.key === a)
                    return c = d,
                    !0
            }
            return !1
        };
        h(e) ? b = "left" : h(f) ? b = "center" : h(g) && (b = "right"),
        b && d.selection.selectColumns(c, c, b)
    },
    getColumnByIndex: function(a) {
        for (var b = this, c = b.leftColumns || [], d = b.columns || [], e = b.rightColumns || [], f = c.concat(d).concat(e), g = 0, h = f.length; h > g; g++) {
            var i = f[g];
            if (i.index === a || i.key === a)
                return i
        }
    },
    load: function() {
        var a = this;
        a.store.loadData()
    },
    save: function() {
        var a = this;
        a.store.save()
    },
    onWindowResize: function() {
        var a, b = this, c = b.renderTo;
        b.panel && (c = b.panel.renderTo,
        a = Fancy.get(c),
        b.setWidth(parseInt(a.width())))
    },
    setWidth: function(a) {
        var b, c = this, d = c.el, e = c.gridBorders, f = (c.gridWithoutPanelBorders,
        c.panelBodyBorders), g = c.body, h = (c.leftBody,
        c.rightBody,
        c.header), i = (c.leftHeader,
        c.rightHeader,
        function(a) {
            for (var b = 0, c = a.length, d = 0; c > b; b++)
                d += a[b].width;
            return d
        }
        ), j = (i(c.columns),
        i(c.leftColumns)), k = i(c.rightColumns), l = a - j - k - f[1] - f[3];
        c.wrapped ? (b = a,
        l = a - j - k,
        l -= e[1] + e[3],
        c.css({
            width: b
        })) : c.panel ? (d = c.panel.el,
        l = a - j - k - f[1] - f[3],
        c.panel.el.width(a),
        d = c.el,
        l -= e[1] + e[3],
        b = a - f[1] - f[3],
        c.css({
            width: b
        })) : (l = a - j - k - f[1] - f[3],
        l -= 2 * c.panelBorderWidth,
        d.width(a)),
        100 > l && (l = 100),
        d.select(".fancy-grid-center").css("width", l),
        !Fancy.nojQuery,
        h.css("width", l),
        g.css("width", l),
        c.scroller.setScrollBars()
    },
    setHeight: function(a, b) {
        var c = this
          , d = c.gridBorders
          , e = c.panelBodyBorders;
        c.panel && b !== !1 && c.panel.setHeight(a),
        c.title && (a -= c.titleHeight),
        c.subTitle && (a -= c.subTitleHeight),
        c.footer && (a -= c.barHeight),
        c.bbar && (a -= c.barHeight),
        c.tbar && (a -= c.barHeight),
        c.subTBar && (a -= c.barHeight),
        c.buttons && (a -= c.barHeight);
        var f = a;
        c.header && (f -= c.cellHeaderHeight,
        c.groupheader && (f -= c.cellHeaderHeight)),
        c.panel && (f -= e[0] + e[2]),
        f -= d[0] + d[2],
        c.body && c.body.css("height", f),
        c.leftBody && c.leftBody.css("height", f),
        c.rightBody && c.rightBody.css("height", f),
        c.el.css("height", a),
        c.height = a,
        c.scroller.update()
    },
    find: function(a, b) {
        return this.store.find(a, b)
    },
    findItem: function(a, b) {
        return this.store.findItem(a, b)
    },
    each: function(a, b) {
        this.store.each(a, b)
    },
    onActivate: function() {
        var a = this
          , b = Fancy.get(document);
        setTimeout(function() {
            b.on("click", a.onDeactivateClick, a)
        }, 100)
    },
    onDeActivate: function() {
        var a = this
          , b = Fancy.get(document);
        a.activated = !1,
        b.un("click", a.onDeactivateClick, a)
    },
    onDeactivateClick: function(a) {
        for (var b = this, c = 0, d = 20, e = Fancy.get(a.target); d > c; c++) {
            if (!e.dom)
                return;
            if (!e.dom.tagName || "body" === e.dom.tagName.toLocaleLowerCase())
                return void b.fire("deactivate");
            if (e.hasClass(b.widgetCls))
                return;
            e = e.parent()
        }
    },
    search: function(a, b) {
        var c = this;
        c.searching.search(a, b)
    },
    stopSelection: function() {
        var a = this;
        a.selection && a.selection.stopSelection()
    },
    enableSelection: function(a) {
        var b = this;
        b.selection && b.selection.enableSelection(a)
    },
    hideColumn: function(a, b) {
        for (var c, d, e = this, f = e.getBody(a), g = e.getHeader(a), h = e.getColumns(a), i = 0, j = h.length, k = e.centerEl, l = e.leftEl, m = e.leftHeader, n = e.rightEl, o = e.rightHeader; j > i; i++)
            if (d = h[i],
            d.index === b) {
                c = i,
                d.hidden = !0;
                break
            }
        switch (g.hideCell(c),
        f.hideColumn(c),
        a) {
        case "left":
            l.css("width", parseInt(l.css("width")) - d.width),
            m.css("width", parseInt(m.css("width")) - d.width),
            k.css("left", parseInt(k.css("left")) - d.width),
            k.css("width", parseInt(k.css("width")) + d.width),
            e.body.css("width", parseInt(e.body.css("width")) + d.width),
            e.header.css("width", parseInt(e.header.css("width")) + d.width);
            break;
        case "right":
            n.css("width", parseInt(n.css("width")) - d.width),
            o.css("width", parseInt(o.css("width")) - d.width),
            k.css("width", parseInt(k.css("width")) + d.width),
            e.body.css("width", parseInt(e.body.css("width")) + d.width),
            e.header.css("width", parseInt(e.header.css("width")) + d.width)
        }
    },
    showColumn: function(a, b) {
        for (var c, d, e = this, f = e.getBody(a), g = e.getHeader(a), h = e.getColumns(a), i = 0, j = h.length, k = e.centerEl, l = e.leftEl, m = e.leftHeader, n = e.rightEl, o = e.rightHeader; j > i; i++)
            if (d = h[i],
            d.index === b) {
                c = i,
                d.hidden = !1;
                break
            }
        switch (g.showCell(c),
        f.showColumn(c),
        a) {
        case "left":
            l.css("width", parseInt(l.css("width")) + d.width),
            m.css("width", parseInt(m.css("width")) + d.width),
            k.css("left", parseInt(k.css("left")) + d.width),
            k.css("width", parseInt(k.css("width")) - d.width),
            e.body.css("width", parseInt(e.body.css("width")) - d.width),
            e.header.css("width", parseInt(e.header.css("width")) - d.width);
            break;
        case "right":
            n.css("width", parseInt(n.css("width")) + d.width),
            o.css("width", parseInt(o.css("width")) + d.width),
            k.css("width", parseInt(k.css("width")) - d.width),
            e.body.css("width", parseInt(e.body.css("width")) - d.width),
            e.header.css("width", parseInt(e.header.css("width")) - d.width)
        }
    },
    removeColumn: function(a, b) {
        var c, d = this, e = d.leftEl, f = d.leftHeader, g = d.leftBody, h = d.centerEl, i = d.body, j = d.header, k = d.rightEl, l = d.rightBody, m = d.rightHeader;
        switch (b) {
        case "left":
            c = d.leftColumns[a],
            d.leftColumns.splice(a, 1),
            f.removeCell(a),
            g.removeColumn(a),
            e.css("width", parseInt(e.css("width")) - c.width),
            h.css("margin-left", parseInt(h.css("margin-left")) - c.width),
            h.css("width", parseInt(h.css("width")) + c.width),
            i.css("width", parseInt(i.css("width")) + c.width),
            j.css("width", parseInt(j.css("width")) + c.width);
            break;
        case "center":
            c = d.columns[a],
            d.columns.splice(a, 1),
            j.removeCell(a),
            i.removeColumn(a);
            break;
        case "right":
            c = d.rightColumns[a],
            d.rightColumns.splice(a, 1),
            m.removeCell(a),
            l.removeColumn(a),
            k.css("right", parseInt(k.css("right")) - c.width),
            h.css("width", parseInt(h.css("width")) + c.width),
            j.css("width", parseInt(j.css("width")) + c.width),
            i.css("width", parseInt(i.css("width")) + c.width)
        }
        return c
    },
    insertColumn: function(a, b, c) {
        var d = this
          , e = d.leftEl
          , f = d.leftBody
          , g = d.leftHeader
          , h = d.centerEl
          , i = d.body
          , j = d.header
          , k = d.rightEl
          , l = d.rightBody
          , m = d.rightHeader;
        switch (c = c || "center") {
        case "center":
            d.columns.splice(b, 0, a),
            j.insertCell(b, a),
            i.insertColumn(b, a);
            break;
        case "left":
            d.leftColumns.splice(b, 0, a),
            g.insertCell(b, a),
            f.insertColumn(b, a),
            e.css("width", parseInt(e.css("width")) + a.width),
            h.css("width", parseInt(h.css("width")) - a.width),
            h.css("margin-left", parseInt(h.css("margin-left")) + a.width);
            break;
        case "right":
            d.rightColumns.splice(b, 0, a),
            m.insertCell(b, a),
            l.insertColumn(b, a),
            k.css("width", parseInt(k.css("width")) + a.width),
            h.css("width", parseInt(h.css("width")) - a.width),
            i.css("width", parseInt(i.css("width")) - a.width),
            j.css("width", parseInt(j.css("width")) - a.width)
        }
        a.menu && (a.menu = !0)
    },
    disableLegend: function(a, b) {
        var c = this;
        c.columns[a].disabled = c.columns[a].disabled || {},
        c.columns[a].disabled[b] = !0,
        c.body.updateRows(void 0, a)
    },
    enableLegend: function(a, b) {
        var c = this;
        c.columns[a].disabled = c.columns[a].disabled || {},
        delete c.columns[a].disabled[b],
        c.body.updateRows(void 0, a)
    },
    fitHeight: function() {
        var a = this
          , b = a.store
          , c = a.panelBodyBorders
          , d = a.gridBorders
          , e = b.getLength() * a.cellHeight;
        a.title && (e += a.titleHeight),
        a.tbar && (e += a.barHeight),
        a.bbar && (e += a.barHeight),
        a.buttons && (e += a.barHeight),
        a.subTBar && (e += a.barHeight),
        a.footer && (e += a.barHeight),
        a.header !== !1 && (e += a.cellHeaderHeight,
        a.filter && a.filter.header && (e += a.cellHeaderHeight)),
        e += a.panel ? c[0] + c[2] + d[0] + d[2] : d[0] + d[2],
        a.setHeight(e)
    },
    addFilter: function(a, b, c) {
        var d = this
          , e = d.filter.filters[a]
          , c = c || "";
        void 0 === e && (e = {}),
        "" === b ? delete e[c] : e[c] = b,
        d.filter.filters[a] = e,
        d.filter.updateStoreFilters()
    },
    clearFilter: function(a, b) {
        var c = this
          , d = c.store;
        void 0 === a ? (c.filter.filters = {},
        d.filters = {}) : void 0 === b ? (c.filter.filters[a] = {},
        d.filters[a] = {}) : c.filter && c.filter.filters && c.filter.filters[a] && c.filter.filters[a][b] && (delete c.filter.filters[a][b],
        delete d.filters[a][b]),
        d.changeDataView(),
        c.update()
    },
    showLoadMask: function(a) {
        this.loadmask.showLoadMask(a)
    },
    hideLoadMask: function() {
        this.loadmask.hideLoadMask()
    },
    prevPage: function() {
        this.paging.prevPage()
    },
    nextPage: function() {
        this.paging.nextPage()
    },
    setPage: function(a) {
        a--,
        0 > a && (a = 0),
        this.paging.setPage(a)
    },
    firstPage: function() {
        this.paging.firstPage()
    },
    lastPage: function() {
        this.paging.lastPage()
    },
    setPageSize: function(a) {
        this.paging.setPageSize(a)
    },
    getPage: function() {
        return this.store.showPage + 1
    },
    getPageSize: function() {
        return this.store.pageSize
    },
    refresh: function() {
        this.paging.refresh()
    },
    scroll: function(a, b) {
        var c = this
          , d = c.scroller;
        d.scroll(a, b),
        d.scrollBottomKnob(),
        d.scrollRightKnob()
    }
}),
Fancy.define("Fancy.Grid", {
    extend: Fancy.Widget,
    mixins: ["Fancy.grid.mixin.Grid", Fancy.panel.mixin.PrepareConfig, Fancy.panel.mixin.methods, "Fancy.grid.mixin.PrepareConfig", "Fancy.grid.mixin.ActionColumn", Fancy.grid.mixin.Edit],
    plugins: [{
        type: "grid.updater"
    }, {
        type: "grid.scroller"
    }, {
        type: "grid.licence"
    }],
    type: "grid",
    theme: "default",
    i18n: "en",
    emptyText: "",
    prefix: "fancy-grid-",
    cls: "",
    widgetCls: "fancy-grid",
    cellCls: "fancy-grid-cell",
    pseudoCellCls: "fancy-grid-pseudo-cell",
    cellInnerCls: "fancy-grid-cell-inner",
    cellEvenCls: "fancy-grid-cell-even",
    clsASC: "fancy-grid-column-sort-ASC",
    clsDESC: "fancy-grid-column-sort-DESC",
    clsSparkColumn: "fancy-grid-column-sparkline",
    clsSparkColumnBullet: "fancy-grid-column-sparkline-bullet",
    clsSparkColumnCircle: "fancy-grid-column-chart-circle",
    clsSparkColumnDonutProgress: "fancy-grid-column-spark-progress-donut",
    clsColumnGrossLoss: "fancy-grid-column-grossloss",
    clsColumnProgress: "fancy-grid-column-progress",
    clsGroupRow: "fancy-grid-group-row",
    clsCollapsedRow: "fancy-grid-group-row-collapsed",
    rowOverCls: "fancy-grid-cell-over",
    expandRowOverCls: "fancy-grid-expand-row-over",
    cellOverCls: "fancy-grid-cell-over",
    cellSelectedCls: "fancy-grid-cell-selected",
    expandRowSelectedCls: "fancy-grid-expand-row-selected",
    columnOverCls: "fancy-grid-column-over",
    columnSelectedCls: "fancy-grid-column-selected",
    filterHeaderCellCls: "fancy-grid-header-filter-cell",
    cellHeaderDoubleSize: "fancy-grid-header-cell-double-size",
    rowEditCls: "fancy-grid-row-edit",
    rowEditButtonCls: "fancy-grid-row-edit-buttons",
    clsSparkColumnHBar: "fancy-grid-column-h-bar",
    header: !0,
    shadow: !0,
    striped: !0,
    columnLines: !0,
    textSelection: !1,
    width: 200,
    height: 200,
    minWidth: 200,
    minHeight: 200,
    emptyValue: "&nbsp;",
    frame: !0,
    keyNavigation: !1,
    draggable: !1,
    activated: !1,
    multiSort: !1,
    tabEdit: !0,
    dirtyEnabled: !0,
    barScrollEnabled: !0,
    constructor: function(a) {
        var b = this
          , a = a || {}
          , c = function(c) {
            c && Fancy.apply(a, c),
            a = b.prepareConfig(a, b),
            Fancy.applyConfig(b, a),
            b.Super("const", arguments)
        }
          , d = function() {
            var d = a.i18n || b.i18n;
            if (Fancy.loadLang(d, c) === !0) {
                a.lang;
                c({})
            }
        };
        Fancy.modules.grid || Fancy.fullBuilt || Fancy.MODULELOAD === !1 ? d() : Fancy.loadModule("grid", function() {
            d()
        })
    },
    init: function() {
        var a = this;
        return a.initId(),
        a.addEvents("beforerender", "afterrender", "render", "show", "hide", "destroy"),
        a.addEvents("headercellclick", "headercellmousemove", "headercellmousedown", "docmouseup", "docclick", "docmove", "init", "columnresize", "columnclick", "columndblclick", "columnenter", "columnleave", "columnmousedown", "cellclick", "celldblclick", "cellenter", "cellleave", "cellmousedown", "beforecellmousedown", "rowclick", "rowdblclick", "rowenter", "rowleave", "rowtrackenter", "rowtrackleave", "scroll", "remove", "set", "update", "sort", "beforeload", "load", "select", "clearselect", "activate", "deactivate", "beforeedit", "startedit", "changepage", "dropitems", "collapse", "expand", "filter"),
        Fancy.fullBuilt !== !0 && Fancy.MODULELOAD !== !1 && a.fullBuilt !== !0 && a.neededModules !== !0 && "datepicker" !== a.wtype && "monthpicker" !== a.wtype ? void a.loadModules() : (a.initStore(),
        a.initPlugins(),
        a.ons(),
        a.initDateColumn(),
        a.fire("beforerender"),
        a.preRender(),
        a.render(),
        a.initElements(),
        a.initActionColumnHandler(),
        a.fire("render"),
        a.fire("afterrender"),
        a.setSides(),
        a.setSidesHeight(),
        a.setColumnsPosition(),
        a.update(),
        a.initTextSelection(),
        a.initTouch(),
        void setTimeout(function() {
            a.inited = !0,
            a.fire("init")
        }, 1))
    },
    loadModules: function() {
        var a = this
          , b = {}
          , c = a.columns || []
          , d = a.leftColumns || []
          , e = a.rightColumns || [];
        Fancy.modules = Fancy.modules || {},
        Fancy.nojQuery && (b.dom = !0),
        Fancy.isTouch && (b.touch = !0),
        a.paging && (b.paging = !0),
        (a.filter || a.searching) && (b.filter = !0),
        a.data && a.data.proxy && (b.edit = !0),
        a.clicksToEdit && (b.edit = !0),
        Fancy.isObject(a.data) && (a.data.proxy && (b["server-data"] = !0,
        Fancy.nojQuery && (b.ajax = !0)),
        a.data.chart && (b["chart-integration"] = !0)),
        a.expander && (b.expander = !0),
        a.isGroupedHeader && (b["grouped-header"] = !0),
        a.grouping && (b.grouping = !0),
        (a.trackOver || a.columnTrackOver || a.cellTrackOver || a.selection) && (b.selection = !0);
        for (var f = c.concat(d).concat(e), g = 0, h = f.length; h > g; g++) {
            var i = f[g];
            switch (i.sortable === !0 && (b.sort = !0),
            i.editable === !0 && (b.edit = !0),
            i.menu === !0 && (b.menu = !0),
            i.filter && (b.filter = !0),
            i.type) {
            case "select":
                a.checkboxRowSelection = !0,
                b.selection = !0;
                break;
            case "combo":
                i.data && i.data.proxy && (b.ajax = !0);
                break;
            case "progressbar":
            case "progressdonut":
            case "grossloss":
            case "hbar":
                b.spark = !0;
                break;
            case "date":
                b.date = !0,
                b.selection = !0
            }
        }
        if (Fancy.isArray(a.tbar))
            for (var g = 0, h = a.tbar.length; h > g; g++)
                switch (a.tbar[g].action) {
                case "add":
                case "remove":
                    b.edit = !0
                }
        a.gridToGrid && (b.dd = !0),
        a.neededModules = {
            length: 0
        };
        for (var j in b)
            void 0 === Fancy.modules[j] && (a.neededModules[j] = !0,
            a.neededModules.length++);
        if (0 === a.neededModules.length)
            return a.neededModules = !0,
            void a.init();
        var k = function(b) {
            delete a.neededModules[b],
            a.neededModules.length--,
            0 === a.neededModules.length && (a.neededModules = !0,
            a.init())
        };
        for (var j in a.neededModules)
            "length" !== j && Fancy.loadModule(j, k)
    },
    lockColumn: function(a, b) {
        var c = this
          , d = c.removeColumn(a, b);
        c.insertColumn(d, c.leftColumns.length, "left")
    },
    rightLockColumn: function(a, b) {
        var c = this
          , d = c.removeColumn(a, b);
        c.insertColumn(d, 0, "right")
    },
    unLockColumn: function(a, b) {
        var c, d = this;
        switch (b) {
        case "left":
            c = d.removeColumn(a, b),
            d.insertColumn(c, 0, "center");
            break;
        case "right":
            c = d.removeColumn(a, b),
            d.insertColumn(c, d.columns.length, "center")
        }
    }
});
var FancyGrid = Fancy.Grid;
FancyGrid.get = function(a) {
    var b = Fancy.get(a).select(".fancy-grid").dom.id;
    return Fancy.getWidget(b)
}
,
FancyGrid.defineTheme = Fancy.defineTheme,
FancyGrid.defineController = Fancy.defineController,
FancyGrid.addValid = Fancy.addValid,
!Fancy.nojQuery && Fancy.$ && (Fancy.$.fn.FancyGrid = function(a) {
    return a.renderTo = $(this.selector)[0].id,
    new Fancy.Grid(a)
}
),
Fancy.define("Fancy.grid.plugin.Updater", {
    extend: Fancy.Plugin,
    ptype: "grid.updater",
    inWidgetName: "updater",
    constructor: function(a) {
        var b = this;
        Fancy.applyConfig(b, a),
        b.Super("const", arguments)
    },
    init: function() {},
    update: function() {
        var a = this
          , b = a.widget;
        b.leftBody.update(),
        b.body.update(),
        b.rightBody.update()
    },
    updateRow: function(a) {
        var b = this
          , c = b.widget;
        c.leftBody.updateRows(a),
        c.body.updateRows(a),
        c.rightBody.updateRows(a)
    }
}),
Fancy.define("Fancy.grid.plugin.Scroller", {
    extend: Fancy.Plugin,
    ptype: "grid.scroller",
    inWidgetName: "scroller",
    rightScrollCls: "fancy-scroll-right",
    bottomScrollCls: "fancy-scroll-bottom",
    rightKnobDown: !1,
    bottomKnobDown: !1,
    minRightKnobHeight: 35,
    minBottomKnobWidth: 35,
    cornerSize: 12,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = Fancy.getMouseWheelEventName();
        b.once("render", function() {
            a.render(),
            b.leftBody.el.on(c, a.onMouseWheel, a),
            b.nativeScroller && (b.leftBody.el.on(c, a.onMouseWheelLeft, a),
            b.rightBody.el.on(c, a.onMouseWheelRight, a)),
            b.body.el.on(c, a.onMouseWheel, a),
            b.rightBody.el.on(c, a.onMouseWheel, a),
            b.once("init", a.onGridInit, a),
            b.nativeScroller && b.body.el.on("scroll", a.onNativeScrollBody, a)
        }),
        a.on("render", a.onRender, a),
        b.store.on("change", a.onChangeStore, a)
    },
    destroy: function() {
        var a = this
          , b = a.widget
          , c = b.leftBody
          , d = b.body
          , e = b.rightBody
          , f = Fancy.get(document)
          , g = Fancy.getMouseWheelEventName();
        f.un("mouseup", a.onMouseUpDoc, a),
        f.un("mousemove", a.onMouseMoveDoc, a),
        c.el.un(g, a.onMouseWheel, a),
        d.el.un(g, a.onMouseWheel, a),
        e.el.un(g, a.onMouseWheel, a),
        a.scrollBottomEl.un("mousedown", a.onMouseDownBottomSpin, a),
        a.scrollRightEl.un("mousedown", a.onMouseDownRightSpin, a),
        Fancy.isTouch && (c.el.un("touchstart", a.onBodyTouchStart, a),
        c.el.un("touchmove", a.onBodyTouchMove, a),
        d.el.un("touchstart", a.onBodyTouchStart, a),
        d.el.un("touchmove", a.onBodyTouchMove, a),
        e.el.un("touchstart", a.onBodyTouchStart, a),
        e.el.un("touchmove", a.onBodyTouchMove, a),
        f.un("touchend", a.onMouseUpDoc, a))
    },
    onGridInit: function() {
        var a = this
          , b = a.widget
          , c = Fancy.get(document);
        a.setScrollBars(),
        c.on("mouseup", a.onMouseUpDoc, a),
        c.on("mousemove", a.onMouseMoveDoc, a),
        b.on("columnresize", a.onColumnResize, a)
    },
    render: function() {
        var a = this
          , b = a.widget
          , c = b.body
          , d = Fancy.get(document.createElement("div"))
          , e = Fancy.get(document.createElement("div"));
        b.nativeScroller ? b.el.addClass("fancy-grid-native-scroller") : (d.addClass(a.rightScrollCls),
        e.addClass(a.bottomScrollCls),
        e.addClass("fancy-display-none"),
        d.update(['<div class="fancy-scroll-right-inner"></div>'].join(" ")),
        d.select(".fancy-scroll-right-inner").css("margin-top", b.knobOffSet),
        e.update(['<div class="fancy-scroll-bottom-inner"></div>'].join(" ")),
        Fancy.get(c.el.append(d.dom)),
        a.scrollRightEl = c.el.select(".fancy-scroll-right"),
        Fancy.get(c.el.append(e.dom)),
        a.scrollBottomEl = c.el.select(".fancy-scroll-bottom")),
        a.fire("render")
    },
    onMouseWheel: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.getWheelDelta(a.originalEvent || a);
        0 != b.isRightScrollable() && (c.stopProp && a.stopPropagation(),
        c.nativeScroller || (a.preventDefault(),
        b.scrollDelta(d),
        b.scrollRightKnob()))
    },
    onRender: function() {
        var a = this
          , b = a.widget;
        b.nativeScroller !== !0 && (a.scrollRightEl.hover(function() {
            a.bottomKnobDown !== !0 && a.scrollRightEl.addClass("fancy-scroll-right-hover")
        }, function() {
            a.scrollRightEl.removeClass("fancy-scroll-right-hover")
        }),
        a.scrollBottomEl.hover(function() {
            a.rightKnobDown !== !0 && a.scrollBottomEl.addClass("fancy-scroll-bottom-hover")
        }, function() {
            a.scrollBottomEl.removeClass("fancy-scroll-bottom-hover")
        }),
        a.initRightScroll(),
        a.initBottomScroll()),
        Fancy.isTouch && a.initTouch()
    },
    initTouch: function() {
        var a = this
          , b = a.widget
          , c = b.leftBody
          , d = b.body
          , e = b.rightBody
          , f = Fancy.get(document);
        c.el.on("touchstart", a.onBodyTouchStart, a),
        c.el.on("touchmove", a.onBodyTouchMove, a),
        d.el.on("touchstart", a.onBodyTouchStart, a),
        d.el.on("touchmove", a.onBodyTouchMove, a),
        e.el.on("touchstart", a.onBodyTouchStart, a),
        e.el.on("touchmove", a.onBodyTouchMove, a),
        f.on("touchend", a.onMouseUpDoc, a)
    },
    onBodyTouchStart: function(a) {
        var b = this
          , a = a.originalEvent || a
          , c = a.changedTouches[0];
        b.rightKnobDown = !0,
        b.bottomKnobDown = !0,
        b.mouseDownXY = {
            x: c.pageX,
            y: c.pageY
        },
        b.rightKnobTop = parseInt(b.rightKnob.css("margin-top")),
        b.scrollRightEl.addClass("fancy-scroll-right-active"),
        b.bottomKnobLeft = parseInt(b.bottomKnob.css("margin-left")),
        b.scrollBottomEl.addClass("fancy-scroll-bottom-active")
    },
    onBodyTouchEnd: function() {
        var a = this;
        a.onMouseUpDoc()
    },
    onBodyTouchMove: function(a) {
        var b = this
          , a = a.originalEvent
          , c = a.changedTouches[0];
        b.rightKnobDown === !0 && a.preventDefault(),
        b.bottomKnobDown === !0 && a.preventDefault(),
        b.onMouseMoveDoc({
            pageX: c.pageX,
            pageY: c.pageY
        })
    },
    initRightScroll: function() {
        var a = this;
        a.widget,
        Fancy.get(document);
        a.rightKnob = a.scrollRightEl.select(".fancy-scroll-right-inner"),
        a.scrollRightEl.on("mousedown", a.onMouseDownRightSpin, a)
    },
    initBottomScroll: function() {
        var a = this;
        a.widget,
        Fancy.get(document);
        a.bottomKnob = a.scrollBottomEl.select(".fancy-scroll-bottom-inner"),
        a.scrollBottomEl.on("mousedown", a.onMouseDownBottomSpin, a)
    },
    onMouseDownRightSpin: function(a) {
        var b = this;
        Fancy.isTouch || (a.preventDefault(),
        b.rightKnobDown = !0,
        b.mouseDownXY = {
            x: a.pageX,
            y: a.pageY
        },
        b.rightKnobTop = parseInt(b.rightKnob.css("margin-top")),
        b.scrollRightEl.addClass("fancy-scroll-right-active"))
    },
    onMouseDownBottomSpin: function(a) {
        var b = this;
        a.preventDefault(),
        b.bottomKnobDown = !0,
        b.mouseDownXY = {
            x: a.pageX,
            y: a.pageY
        },
        b.bottomKnobLeft = parseInt(b.bottomKnob.css("margin-left")),
        b.scrollBottomEl.addClass("fancy-scroll-bottom-active")
    },
    onMouseUpDoc: function() {
        var a = this;
        (a.rightKnobDown !== !1 || a.bottomKnobDown !== !1) && (a.scrollRightEl.removeClass("fancy-scroll-right-active"),
        a.scrollBottomEl.removeClass("fancy-scroll-bottom-active"),
        a.rightKnobDown = !1,
        a.bottomKnobDown = !1)
    },
    onMouseMoveDoc: function(a) {
        var b, c, d, e, f = this, g = f.widget, h = !1, i = !1, j = g.knobOffSet, k = a.pageX, l = a.pageY;
        f.rightKnobDown && (Fancy.isTouch ? (c = f.mouseDownXY.y - l,
        d = c + f.rightKnobTop) : (c = l - f.mouseDownXY.y,
        d = c + f.rightKnobTop),
        d < f.knobOffSet && (d = f.knobOffSet),
        f.bodyViewHeight < d + f.rightKnobHeight && (d = f.bodyViewHeight - f.rightKnobHeight),
        d < f.rightScrollScale && (d = 0),
        f.rightKnob.css("margin-top", d + j + "px"),
        h = f.rightScrollScale * d,
        f.scroll(h)),
        f.bottomKnobDown && (Fancy.isTouch ? (b = f.mouseDownXY.x - k,
        c = f.mouseDownXY.y - l,
        e = b + f.bottomKnobLeft) : (b = k - f.mouseDownXY.x,
        c = l - f.mouseDownXY.y,
        e = b + f.bottomKnobLeft),
        1 > e && (e = 1),
        f.bodyViewWidth - 2 < e + f.bottomKnobWidth && (e = f.bodyViewWidth - f.bottomKnobWidth - 2),
        f.bottomScrollScale < 0 && 0 > e && (e = 0,
        f.bottomScrollScale = 0),
        f.bottomKnob.css("margin-left", e + "px"),
        i = f.bottomScrollScale * (e - 1),
        f.scroll(!1, i))
    },
    setScrollBars: function() {
        var a = this
          , b = a.widget;
        a.checkRightScroll(),
        a.checkBottomScroll() || b.scroll(!1, 0),
        b.nativeScroller || (a.checkCorner(),
        a.setRightKnobSize(),
        a.setBottomKnobSize())
    },
    checkRightScroll: function() {
        var a = this
          , b = a.widget
          , c = b.body
          , d = b.gridBorders
          , e = b.getBodyHeight()
          , f = b.getCellsViewHeight() - d[0] - d[2];
        b.nativeScroller ? e >= f ? c.el.css("overflow-y", "hidden") : c.el.css("overflow-y", "scroll") : e >= f ? a.scrollRightEl.addClass("fancy-display-none") : a.scrollRightEl.removeClass("fancy-display-none")
    },
    isRightScrollable: function() {
        var a = this
          , b = a.widget;
        return b.nativeScroller ? "scroll" === b.body.el.css("overflow-y") : !a.scrollRightEl.hasClass("fancy-display-none")
    },
    setRightKnobSize: function() {
        var a = this
          , b = a.widget
          , c = b.getBodyHeight() - (a.corner ? a.cornerSize : 0) - 2
          , d = b.getCellsViewHeight() - (a.corner ? a.cornerSize : 0)
          , e = d - c
          , f = 100 - e / (c / 100)
          , g = c * (f / 100)
          , h = b.knobOffSet;
        g < a.minRightKnobHeight && (g = a.minRightKnobHeight),
        a.corner === !1 && (c -= h),
        a.rightKnob.css("height", g + "px"),
        a.rightKnobHeight = g,
        a.bodyViewHeight = c,
        a.rightScrollScale = (d - c) / (c - g)
    },
    checkBottomScroll: function() {
        var a, b = this, c = b.widget, d = c.body, e = c.getCenterViewWidth(), f = c.getCenterFullWidth() - 2;
        return c.nativeScroller ? e > f ? (a = !1,
        d.el.css("overflow-x", "hidden")) : (a = !0,
        d.el.css("overflow-x", "scroll")) : e > f ? (a = !1,
        b.scrollBottomEl.addClass("fancy-display-none")) : (a = !0,
        b.scrollBottomEl.removeClass("fancy-display-none")),
        a
    },
    checkCorner: function() {
        var a = this;
        a.corner = !a.scrollRightEl.hasClass("fancy-display-none") && !a.scrollBottomEl.hasClass("fancy-display-none")
    },
    setBottomKnobSize: function() {
        var a = this
          , b = a.widget
          , c = b.getCenterViewWidth() - (a.corner ? a.cornerSize : 0)
          , d = b.getCenterFullWidth() - (a.corner ? a.cornerSize : 0)
          , e = d - c
          , f = 100 - e / (d / 100)
          , g = c * (f / 100) - 2;
        g < a.minBottomKnobWidth && (g = a.minBottomKnobWidth),
        a.bottomKnob.css("width", g + "px"),
        a.bottomKnobWidth = g,
        a.bodyViewWidth = c,
        a.bottomScrollScale = (c - d) / (c - g - 2 - 1)
    },
    scroll: function(a, b) {
        var c, d = this, e = d.widget;
        return e.nativeScroller ? (null !== a && (e.body.el.dom.scrollTop = a),
        void 0 !== b && (e.body.el.dom.scrollLeft = b,
        e.header && e.header.scroll(b)),
        void e.fire("scroll")) : (e.leftBody.scroll(a),
        c = e.body.scroll(a, b),
        e.rightBody.scroll(a),
        void 0 !== c.scrollTop && (d.scrollTop = Math.abs(c.scrollTop)),
        void 0 !== c.scrollLeft && (d.scrollLeft = Math.abs(c.scrollLeft)),
        void e.fire("scroll"))
    },
    scrollDelta: function(a) {
        var b, c = this, d = c.widget;
        d.leftBody.wheelScroll(a),
        b = d.body.wheelScroll(a),
        d.rightBody.wheelScroll(a),
        c.scrollTop = Math.abs(b.newScroll),
        c.scrollLeft = Math.abs(b.scrollLeft),
        d.fire("scroll")
    },
    scrollRightKnob: function() {
        var a = this
          , b = a.widget
          , c = a.getScroll()
          , d = c / a.rightScrollScale + b.knobOffSet;
        a.rightKnob && a.rightKnob.css("margin-top", d + "px")
    },
    scrollBottomKnob: function() {
        var a = this
          , b = a.widget
          , c = a.getBottomScroll()
          , d = c / a.bottomScrollScale + b.knobOffSet;
        0 === c && (d = -1),
        a.bottomKnob && a.bottomKnob.css("margin-left", -d + "px")
    },
    getScroll: function() {
        var a = this
          , b = a.widget;
        return Math.abs(parseInt(b.body.el.select(".fancy-grid-column").item(0).css("top")))
    },
    getBottomScroll: function() {
        var a = this
          , b = a.widget;
        return Math.abs(parseInt(b.body.el.select(".fancy-grid-column").item(0).css("left")))
    },
    update: function() {
        var a = this;
        a.widget;
        a.setScrollBars(),
        a.checkScroll()
    },
    onChangeStore: function() {
        var a = this;
        a.setScrollBars(),
        a.checkScroll()
    },
    onColumnResize: function() {
        var a = this;
        a.setScrollBars()
    },
    checkScroll: function() {
        var a = this
          , b = a.widget
          , c = a.getScroll()
          , d = b.getBodyHeight() - (a.corner ? a.cornerSize : 0)
          , e = b.getCellsViewHeight() - (a.corner ? a.cornerSize : 0);
        c && d > e && (a.scroll(0),
        b.nativeScroller || a.scrollRightKnob())
    },
    scrollToCell: function(a) {
        var b = this
          , c = b.widget
          , d = c.cellHeight
          , e = Fancy.get(a)
          , f = e.parent()
          , g = Number(e.attr("index"))
          , h = Number(f.attr("index"))
          , i = b.getScroll()
          , j = d * (g + 1)
          , k = c.getBodyHeight()
          , l = b.getBottomScroll()
          , m = parseInt(c.body.el.css("width"))
          , n = 0
          , o = f.parent().parent().hasClass("fancy-grid-center");
        if (0 === g && 0 === h)
            return b.scroll(0, 0),
            b.scrollBottomKnob(),
            void b.scrollRightKnob();
        if (j - i > k && (i += d,
        b.scroll(i)),
        o) {
            var p = c.columns
              , q = 0;
            for (p.length; h >= q; q++)
                n += p[q].width;
            n - l > m ? p[q] ? b.scroll(i, -(l + p[q - 1].width)) : b.scroll(i, -(n - l - m)) : 0 !== l && 0 === h && b.scroll(i, 0),
            b.scrollBottomKnob()
        }
        b.scrollRightKnob()
    },
    onNativeScrollBody: function() {
        var a = this
          , b = a.widget
          , c = b.body.el.dom.scrollTop
          , d = b.body.el.dom.scrollLeft;
        b.header && b.header.scroll(-d),
        b.leftBody && (b.leftBody.el.dom.scrollTop = c),
        b.rightBody && (b.rightBody.el.dom.scrollTop = c)
    },
    onMouseWheelLeft: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.getWheelDelta(a.originalEvent || a)
          , e = d * c.cellHeight;
        c.leftBody.el.dom.scrollTop -= e,
        c.body.el.dom.scrollTop -= e,
        c.rightBody.el.dom.scrollTop -= e
    },
    onMouseWheelRight: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.getWheelDelta(a.originalEvent || a)
          , e = d * c.cellHeight;
        c.leftBody.el.dom.scrollTop -= e,
        c.body.el.dom.scrollTop -= e,
        c.rightBody.el.dom.scrollTop -= e
    }
}),
Fancy.define("Fancy.grid.plugin.Sorter", {
    extend: Fancy.Plugin,
    ptype: "grid.sorter",
    inWidgetName: "sorter",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.once("render", function() {
            a.onsHeaders()
        })
    },
    onsHeaders: function() {
        var a = this
          , b = a.widget;
        b.on("headercellclick", a.onHeaderCellClick, a)
    },
    onHeaderCellClick: function(a, b) {
        var c, d, e, f, g = this, h = g.widget, i = (h.store,
        Fancy.get(b.cell)), j = b.side, k = b.index, l = h.clsASC, m = h.clsDESC, n = b.e, o = n.target;
        if ("input" !== o.tagName.toLocaleLowerCase()) {
            var p = i.select(".fancy-field");
            p.length > 0 && p.item(0).within(o) === !0 || i.hasClass("fancy-grid-column-resizer") || h.startResizing || (d = h.getColumns(j),
            c = i.hasClass(l) ? "desc" : (i.hasClass(m),
            "asc"),
            e = d[k],
            f = e.index || e.key,
            g.sort(c, f, j, e, i))
        }
    },
    sort: function(a, b, c, d, e) {
        var f, g = this, h = g.widget, i = h.store, j = h.clsASC, k = h.clsDESC, l = h.getColumns(c), m = 0, n = l.length, o = h.getHeader(c);
        if (!d || !e)
            for (; n > m; m++)
                if (l[m].index === b) {
                    d = l[m],
                    e = o.getCell(m);
                    break
                }
        if (d.sortable === !0) {
            switch (h.multiSort ? g.clearHeaderMultiSortCls(a, e) : g.clearHeaderSortCls(),
            a) {
            case "asc":
                e.addClass(j);
                break;
            case "desc":
                e.addClass(k)
            }
            f = d.type;
            var p;
            if (d.format)
                if (Fancy.isString(d.format))
                    switch (d.format) {
                    case "date":
                        p = h.lang.date.read
                    }
                else
                    switch (d.type) {
                    case "date":
                        p = d.format.read
                    }
            i.sort(a, f, b, {
                smartIndexFn: d.smartIndexFn,
                format: p
            })
        }
    },
    clearHeaderMultiSortCls: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = f.clsASC, i = f.clsDESC;
        switch (a.toLocaleUpperCase()) {
        case "ASC":
            b.removeClass(i);
            break;
        case "DESC":
            b.removeClass(h)
        }
        if (c = f.el.select("." + h),
        d = f.el.select("." + i),
        !(c.length + d.length < 3)) {
            for (var j, k = 0, l = c.length; l > k; k++) {
                var m, n, o, p = c.item(k), q = p.parent().parent(), r = p.attr("index");
                q.hasClass("fancy-grid-center") ? m = "center" : q.hasClass("fancy-grid-left") ? m = "left" : q.hasClass("fancy-grid-right") && (m = "right"),
                n = f.getColumns(m),
                o = n[r].index;
                var s = (g.sorters.length,
                g.sorters[0]);
                s.key === o && (j = p)
            }
            for (var k = 0, l = d.length; l > k; k++) {
                var m, n, o, p = d.item(k), q = p.parent().parent(), r = p.attr("index");
                q.hasClass("fancy-grid-center") ? m = "center" : q.hasClass("fancy-grid-left") ? m = "left" : q.hasClass("fancy-grid-right") && (m = "right"),
                n = f.getColumns(m),
                o = n[r].index;
                var s = (g.sorters.length,
                g.sorters[0]);
                s.key === o && (j = p)
            }
            j.removeClass(h),
            j.removeClass(i)
        }
    },
    clearHeaderSortCls: function() {
        var a = this
          , b = a.widget
          , c = b.clsASC
          , d = b.clsDESC;
        b.el.select("." + c).removeClass(c),
        b.el.select("." + d).removeClass(d)
    }
}),
Fancy.define("Fancy.grid.plugin.Paging", {
    extend: Fancy.Plugin,
    ptype: "grid.paging",
    inWidgetName: "paging",
    barType: "bbar",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.on("change", a.onChangeStore, a),
        c.on("remove", a.onChangeStore, a),
        c.on("filter", a.onChangeStore, a),
        b.on("render", a.onRenderGrid, a)
    },
    setPageSize: function(a) {
        var b = this
          , c = b.widget
          , d = c.store;
        d.setPageSize(a)
    },
    nextPage: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.nextPage()
    },
    lastPage: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.lastPage()
    },
    prevPage: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.prevPage()
    },
    firstPage: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.firstPage()
    },
    onChangeStore: function(a) {
        var b, c = this, d = c.widget, e = d.store, f = d.panel;
        switch (c.barType) {
        case "both":
            b = f._bbar.roles.pagenumber,
            b.setValue(e.showPage + 1),
            b = f._tbar.roles.pagenumber,
            b.setValue(e.showPage + 1),
            c.updateBar("tbar"),
            c.updateBar("bbar");
            break;
        case "none":
        case !1:
            break;
        default:
            b = f["_" + c.barType].roles.pagenumber,
            b.setValue(e.showPage + 1),
            c.updateBar()
        }
        d.setSidesHeight(),
        d.fire("changepage")
    },
    setPage: function(a) {
        var b = this
          , c = b.widget
          , d = c.store;
        return 0 > a ? a = 0 : a > d.pages && (a = d.pages),
        d.setPage(a),
        a
    },
    refresh: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        b.showLoadMask(),
        setTimeout(function() {
            c.refresh(),
            "server" !== c.pageType && b.hideLoadMask()
        }, 200)
    },
    updateBar: function(a) {
        var b = this
          , c = b.widget
          , d = c.store
          , e = d.showPage
          , f = d.pageSize
          , g = d.pages
          , h = c.panel
          , a = a || b.barType
          , i = h["_" + a].roles
          , j = i.pagenumber
          , k = i.ofText
          , l = i.info
          , m = i.first
          , n = i.prev
          , o = i.next
          , p = i.last
          , q = e * f + 1
          , r = q + f
          , s = d.getTotal() || 0
          , t = c.lang;
        r > s && (r = s),
        0 === r && (q = 0),
        j.setValue(d.showPage + 1),
        k.el.update(Fancy.String.format(t.paging.of, [g || 1])),
        l.el.update(Fancy.String.format(t.paging.info, [q, r, s])),
        0 === e ? (m.disable(),
        n.disable()) : (m.enable(),
        n.enable()),
        g - 1 === e || 0 === g ? (p.disable(),
        o.disable()) : (p.enable(),
        o.enable())
    },
    onRenderGrid: function() {
        var a = this;
        switch (a.barType) {
        case "both":
            a.updateBar("tbar"),
            a.updateBar("bbar");
            break;
        case "none":
        case !1:
            break;
        default:
            a.updateBar()
        }
    }
}),
Fancy.define("Fancy.grid.plugin.LoadMask", {
    extend: Fancy.Plugin,
    ptype: "grid.loadmask",
    inWidgetName: "loadmask",
    cls: "fancy-loadmask",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        b.once("render", function() {
            a.render(),
            c.loading && a.onBeforeLoad(),
            b.on("beforeload", a.onBeforeLoad, a),
            b.on("load", a.onLoad, a)
        })
    },
    render: function() {
        var a, b, c = this, d = c.widget, e = d.el, f = e, g = Fancy.get(document.createElement("div")), h = d.lang;
        d.panel && (f = d.panel.el),
        a = f.width(),
        b = f.height(),
        g.addClass(c.cls),
        "default" !== d.theme && g.addClass("fancy-theme-" + d.theme),
        g.css({
            width: a,
            height: b,
            opacity: 0
        }),
        g.update(['<div class="fancy-loadmask-inner"><div class="fancy-loadmask-image"></div><div class="fancy-loadmask-text">' + h.loadingText + "</div></div>"].join(" ")),
        c.el = Fancy.get(f.dom.appendChild(g.dom)),
        c.innerEl = c.el.select(".fancy-loadmask-inner"),
        c.textEl = c.el.select(".fancy-loadmask-text");
        var i = c.innerEl.width()
          , j = c.innerEl.height();
        c.innerEl.css({
            left: a / 2 - i / 2,
            top: b / 2 - j / 2
        }),
        d.store.loading !== !0 ? g.css("display", "none") : (g.css("display", "block"),
        c.showLoadMask()),
        g.css("opacity", 1)
    },
    onBeforeLoad: function() {
        var a = this;
        a.showLoadMask()
    },
    onLoad: function() {
        var a = this;
        a.hideLoadMask()
    },
    showLoadMask: function(a) {
        var b = this
          , c = b.widget
          , d = c.lang;
        return a ? (b.textEl.update(a),
        void b.el.css("display", "block")) : (b.loaded = !1,
        void setTimeout(function() {
            b.loaded !== !0 && (b.textEl.update(d.loadingText),
            b.el.css("display", "block"))
        }, 50))
    },
    hideLoadMask: function() {
        var a = this;
        a.loaded = !0,
        a.el.css("display", "none")
    }
}),
Fancy.define("Fancy.grid.plugin.ColumnResizer", {
    extend: Fancy.Plugin,
    ptype: "grid.columnresizer",
    inWidgetName: "columnresizer",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this
          , b = a.widget;
        a.Super("init", arguments),
        b.on("render", function() {
            a.render(),
            a.ons()
        })
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.on("headercellmousemove", a.onCellMouseMove, a),
        b.on("headercellmousedown", a.onHeaderCellMouseDown, a),
        b.on("docclick", a.onDocClick, a),
        b.on("docmove", a.onDocMove, a),
        b.on("docmouseup", a.onDocMouseUp, a)
    },
    onCellMouseMove: function(a, b) {
        var c = this
          , d = c.widget
          , e = b.e
          , f = Fancy.get(b.cell)
          , g = e.offsetX
          , h = f.width()
          , i = Fancy.get(e.target)
          , j = i.hasClass("fancy-grid-header-cell-trigger")
          , k = i.hasClass("fancy-grid-header-cell-trigger-image")
          , l = f.select(".fancy-grid-header-cell-trigger").item(0)
          , m = f.select(".fancy-grid-header-cell-trigger-image").item(0)
          , n = Fancy.get(e.target).closest(".fancy-field").hasClass("fancy-field")
          , o = parseInt(l.css("width"))
          , p = parseInt(m.css("width"))
          , q = h
          , r = 7;
        if (j && (q = o),
        k && (q = p),
        !d.startResizing)
            if ("left" === b.side && b.index === d.leftColumns.length - 1 && r + 2 > q - g && (r += 2),
            !j && !k && "right" === b.side && 0 === b.index && r > g)
                c.isColumnResizable(b) && (n || c.addCellResizeCls(b.cell));
            else if (!j && !k && r > g && "center" === b.side && 0 === b.index && d.leftColumns.length)
                b.side = "left",
                b.index = d.leftColumns.length - 1,
                c.isColumnResizable(b) && (n || c.addCellResizeCls(b.cell));
            else if (j || k || !(r > q - g || r > g) || 0 === b.index)
                r > q - g ? k ? p - g > 2 ? c.removeCellResizeCls(b.cell) : c.addCellResizeCls(b.cell) : c.isColumnResizable(b) && c.addCellResizeCls(b.cell) : c.removeCellResizeCls(b.cell);
            else {
                var s = r > g;
                c.isColumnResizable(b, s) && (n || c.addCellResizeCls(b.cell))
            }
    },
    addCellResizeCls: function(a) {
        Fancy.get(a).addClass("fancy-grid-column-resizer"),
        Fancy.get(a).select(".fancy-grid-header-cell-trigger").addClass("fancy-grid-column-resizer")
    },
    removeCellResizeCls: function(a) {
        Fancy.get(a).removeClass("fancy-grid-column-resizer"),
        Fancy.get(a).select(".fancy-grid-header-cell-trigger").item(0).removeClass("fancy-grid-column-resizer")
    },
    onHeaderCellMouseDown: function(a, b) {
        var c = this
          , d = c.widget
          , a = b.e
          , e = Fancy.get(a.target)
          , f = Fancy.get(b.cell)
          , g = a.offsetX
          , h = f.width()
          , i = f.select(".fancy-field")
          , j = e.hasClass("fancy-grid-header-cell-trigger")
          , k = e.hasClass("fancy-grid-header-cell-trigger-image")
          , l = f.select(".fancy-grid-header-cell-trigger").item(0)
          , m = f.select(".fancy-grid-header-cell-trigger-image").item(0)
          , n = parseInt(l.css("width"))
          , o = parseInt(m.css("width"))
          , p = h
          , q = 7;
        j && (p = n),
        k && (p = o),
        i.length > 0 && i.item(0).within(e.dom) || ("left" === b.side && b.index === d.leftColumns.length - 1 && q + 2 > p - g && (q += 2),
        !j && !k && "right" === b.side && 0 === b.index && q > g ? (d.startResizing = !0,
        c.cell = b.cell,
        c.activeSide = b.side,
        c.clientX = a.clientX,
        c.columnIndex = b.index,
        c.moveLeftResizer = !0) : 7 > g && "center" === b.side && 0 === b.index && d.leftColumns.length ? (d.startResizing = !0,
        b.side = "left",
        b.index = d.leftColumns.length - 1,
        c.cell = c.getCell(b),
        c.activeSide = b.side,
        c.clientX = a.clientX,
        c.columnIndex = b.index) : !j && !k && q > g && 0 !== b.index ? (d.startResizing = !0,
        c.cell = c.getPrevCell(b),
        c.activeSide = b.side,
        c.clientX = a.clientX,
        c.columnIndex = b.index - 1) : q > p - g && (d.startResizing = !0,
        c.cell = b.cell,
        c.activeSide = b.side,
        c.clientX = a.clientX,
        c.columnIndex = b.index),
        d.startResizing && c.isColumnResizable())
    },
    isColumnResizable: function(a, b) {
        var c, d, e, f = this, g = f.widget;
        if (a) {
            if (c = g.getColumns(a.side),
            e = a.index,
            b && e--,
            isNaN(e))
                return;
            return d = c[e],
            d.resizable === !0
        }
        c = g.getColumns(f.activeSide),
        c[f.columnIndex].resizable !== !0 && (g.startResizing = !1,
        delete f.cell,
        delete f.activeSide,
        delete f.clientX,
        delete f.columnIndex)
    },
    getMinColumnWidth: function() {
        var a, b, c = this, d = c.widget, e = d.minCellWidth;
        return void 0 === c.columnIndex ? e : (a = d.getColumns(c.activeSide),
        b = a[c.columnIndex],
        b.minWidth ? b.minWidth : e)
    },
    getMaxColumnWidth: function() {
        var a, b, c = this, d = c.widget;
        return void 0 === c.columnIndex ? !1 : (a = d.getColumns(c.activeSide),
        b = a[c.columnIndex],
        b.maxWidth ? b.maxWidth : !1)
    },
    onDocClick: function() {
        var a = this
          , b = a.widget;
        b.startResizing = !1
    },
    onDocMove: function(a, b) {
        var c = this
          , d = c.widget;
        d.startResizing && c.moveResizeEls(b)
    },
    render: function() {
        var a = this
          , b = a.widget
          , c = Fancy.get(document.createElement("div"))
          , d = Fancy.get(document.createElement("div"));
        c.addClass("fancy-grid-resizer-left"),
        d.addClass("fancy-grid-resizer-right"),
        a.leftEl = Fancy.get(b.el.dom.appendChild(c.dom)),
        a.rightEl = Fancy.get(b.el.dom.appendChild(d.dom))
    },
    moveResizeEls: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.get(b.cell)
          , e = parseInt(d.css("left"))
          , f = b.getMinColumnWidth()
          , g = b.getMaxColumnWidth();
        switch (b.activeSide) {
        case "left":
            break;
        case "center":
            e += parseInt(c.leftEl.css("width"));
            break;
        case "right":
            e += parseInt(c.leftEl.css("width")),
            e += parseInt(c.centerEl.css("width"))
        }
        var h = a.clientX
          , i = h - b.clientX
          , j = d.width() + i;
        f > j && (j = f),
        g && j > g && (j = g),
        b.deltaWidth = d.width() - j,
        b.moveLeftResizer ? (i = h - b.clientX,
        j = d.width() - i,
        f > j && (j = f),
        b.deltaWidth = d.width() - j,
        b.leftEl.css({
            display: "block",
            left: e + i + "px"
        }),
        b.rightEl.css({
            display: "block",
            left: e + d.width() - 1 + "px"
        })) : (b.leftEl.css({
            display: "block",
            left: e + "px"
        }),
        b.rightEl.css({
            display: "block",
            left: e + j + "px"
        })),
        b.cellWidth = j
    },
    onDocMouseUp: function() {
        var a = this
          , b = a.widget;
        b.startResizing !== !1 && (a.leftEl.css({
            display: "none"
        }),
        a.rightEl.css({
            display: "none"
        }),
        a.resizeColumn(),
        b.startResizing = !1,
        a.moveLeftResizer = !1,
        delete a.cellWidth)
    },
    resizeColumn: function() {
        var a, b, c, d = this, e = d.widget, f = d.cellWidth, g = d.columnIndex, h = d.deltaWidth, i = e.leftEl, j = e.centerEl, k = e.rightEl, l = e.leftHeader.el, m = e.header.el, n = e.rightHeader.el, o = e.body.el, p = {}, q = {};
        if (void 0 !== f) {
            var r = 1;
            switch (Fancy.nojQuery && (r = 0),
            d.activeSide) {
            case "left":
                var s = parseInt(j.css("width")) + h + r;
                if (s < e.minCenterWidth)
                    return;
                c = e.leftColumns[g],
                e.leftColumns[d.columnIndex].width = f,
                a = e.leftBody.el.select(".fancy-grid-column"),
                b = e.leftHeader.el.select(".fancy-grid-header-cell"),
                a.item(g).css("width", f + "px");
                for (var t = d.columnIndex + 1, u = b.length, v = 0, w = t; w > v; v++) {
                    var x = b.item(v)
                      , y = x.attr("group-index");
                    y && (q[y] = !0)
                }
                for (; u > t; t++) {
                    var z = a.item(t)
                      , x = b.item(t);
                    z.css("left", parseInt(z.css("left")) - h - r),
                    x.hasClass("fancy-grid-header-cell-group-level-2") && q[x.attr("index")] || x.css("left", parseInt(x.css("left")) - h - r)
                }
                i.css("width", parseInt(i.css("width")) - h - r),
                l.css("width", parseInt(l.css("width")) - h - r + "px"),
                e.columns.length && (j.css("left", parseInt(j.css("left")) - h - r),
                j.css("width", s),
                m.css("width", parseInt(m.css("width")) + h + r),
                o.css("width", parseInt(o.css("width")) + h + r));
                break;
            case "center":
                c = e.columns[g],
                e.columns[d.columnIndex].width = f,
                a = e.body.el.select(".fancy-grid-column"),
                b = e.header.el.select(".fancy-grid-header-cell"),
                a.item(g).css("width", f + "px");
                for (var t = d.columnIndex + 1, u = b.length, v = 0, w = t; w > v; v++) {
                    var x = b.item(v)
                      , y = x.attr("group-index");
                    y && (q[y] = !0)
                }
                for (; u > t; t++) {
                    var z = a.item(t)
                      , x = b.item(t)
                      , A = parseInt(z.css("left")) - h - r
                      , B = parseInt(x.css("left")) - h - r;
                    x.attr("group-index") && (p[x.attr("group-index")] = {}),
                    z.css("left", A),
                    x.hasClass("fancy-grid-header-cell-group-level-2") && q[x.attr("index")] || x.css("left", B)
                }
                break;
            case "right":
                var s = parseInt(j.css("width")) + h + r;
                if (s < e.minCenterWidth)
                    return;
                c = e.rightColumns[g],
                e.rightColumns[d.columnIndex].width = f,
                a = e.rightBody.el.select(".fancy-grid-column"),
                b = e.rightHeader.el.select(".fancy-grid-header-cell"),
                a.item(g).css("width", f + "px");
                for (var t = d.columnIndex + 1, u = b.length, v = 0, w = t; w > v; v++) {
                    var x = b.item(v)
                      , y = x.attr("group-index");
                    y && (q[y] = !0)
                }
                for (; u > t; t++) {
                    var z = a.item(t)
                      , x = b.item(t);
                    z.css("left", parseInt(z.css("left")) - h - r),
                    x.hasClass("fancy-grid-header-cell-group-level-2") && q[x.attr("index")] || x.css("left", parseInt(x.css("left")) - h - r)
                }
                k.css("width", parseInt(k.css("width")) - h - r),
                n.css("width", parseInt(n.css("width")) - h - r + "px"),
                e.columns.length && (j.css("width", s),
                m.css("width", parseInt(m.css("width")) + h + r),
                o.css("width", parseInt(o.css("width")) + h + r))
            }
            var C, D = Fancy.get(d.cell), E = D.attr("group-index");
            if (D.css("width", f + "px"),
            E)
                C = e.el.select("[index='" + E + "']"),
                C.css("width", parseInt(C.css("width")) - h - r);
            else
                for (var F in p)
                    C = e.el.select("[index='" + F + "']"),
                    C.css("left", parseInt(C.css("left")) - p[F].delta - r);
            if (e.fire("columnresize", {
                cell: D.dom,
                width: f
            }),
            /sparkline/.test(c.type))
                switch (d.activeSide) {
                case "left":
                    e.leftBody.updateRows(void 0, g);
                    break;
                case "center":
                    e.body.updateRows(void 0, g);
                    break;
                case "right":
                    e.rightBody.updateRows(void 0, g)
                }
        }
    },
    getPrevCell: function(a) {
        var b, c = this, d = c.widget;
        switch (a.side) {
        case "left":
            b = d.leftHeader;
            break;
        case "center":
            b = d.header;
            break;
        case "right":
            b = d.rightHeader
        }
        return b.el.select(".fancy-grid-header-cell").item(a.index - 1).dom
    },
    getCell: function(a) {
        var b, c = this, d = c.widget;
        switch (a.side) {
        case "left":
            b = d.leftHeader;
            break;
        case "center":
            b = d.header;
            break;
        case "right":
            b = d.rightHeader
        }
        return b.el.select(".fancy-grid-header-cell").item(a.index).dom
    }
}),
Fancy.define("Fancy.grid.plugin.ChartIntegration", {
    extend: Fancy.Plugin,
    ptype: "grid.chartintegration",
    inWidgetName: "chartintegration",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.initKeys(),
        a.initBind(),
        a.ons()
    },
    initKeys: function() {
        for (var a = this, b = a.chart, c = 0, d = b.length; d > c; c++) {
            var e, f = b[c], g = f.fields, h = 0, i = {};
            if (Fancy.isString(g))
                i = g;
            else
                for (e = g.length; e > h; h++)
                    i[g[h]] = !0;
            b[c].keys = i
        }
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        b.once("render", function() {
            a.toChart ? a.renderToChart() : a.readDataFromChart(),
            c.on("set", a.onSet, a),
            c.on("sort", a.onSort, a)
        })
    },
    renderToChart: function() {
        for (var a = this, b = a.widget, c = a.chart, d = 0, e = c.length; e > d; d++) {
            var f = c[d]
              , g = f.type;
            switch (g) {
            case "highchart":
            case "highcharts":
                b.highchart.setData(f)
            }
        }
    },
    onSet: function(a, b) {
        for (var c = this, d = c.widget, e = c.chart, f = 0, g = e.length, h = b.key; g > f; f++) {
            var i = e[f]
              , j = i.type;
            if (i.keys[h] === !0)
                switch (j) {
                case "highchart":
                case "highcharts":
                    d.highchart.set(i, b)
                }
        }
    },
    onSort: function(a, b) {
        for (var c = this, d = c.widget, e = c.chart, f = 0, g = e.length; g > f; f++) {
            var h = e[f]
              , i = h.type;
            switch (i) {
            case "highchart":
            case "highcharts":
                if (h.sortBind !== !1) {
                    var j = d.highchart.sort(h, b);
                    e[f].categories = j.original
                }
            }
        }
    },
    readDataFromChart: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = a.chart
          , e = d[0]
          , f = e.type;
        switch (f) {
        case "highchart":
        case "highcharts":
            var g = b.highchart.getData(e)
        }
        b.reConfigStore(g),
        c.setData(g)
    },
    initBind: function() {
        for (var a, b = this, c = b.chart, d = 0, e = c.length; e > d; d++)
            a = c[d],
            a.bind && b.chartBind(a)
    },
    chartBind: function(a) {
        var b = this
          , c = b.widget
          , d = a.bind;
        c.on(d.event, b.onBindEvent, {
            chart: a
        })
    },
    onBindEvent: function(a, b) {
        var c = this
          , d = a
          , e = c.chart
          , f = e.bind
          , g = f.series
          , h = b.data
          , i = e.id;
        switch (f.action) {
        case "add":
            var j = d.highchart.doesSeriesExist(i, h[g.name])
              , k = d.highchart.getNumberSeries(i);
            if (j !== !1 && 1 !== k)
                return void d.highchart.removeSeries(i, j);
            e.maxToShow && e.maxToShow <= k && d.highchart.removeLastSeries(i),
            d.highchart.isTreeMap(i) ? d.highchart.setSeriesData(i, {
                data: h[g.data]
            }) : d.highchart.addSeries(i, {
                name: h[g.name],
                data: h[g.data]
            })
        }
    }
}),
Fancy.define("Fancy.grid.plugin.HighChart", {
    extend: Fancy.Plugin,
    ptype: "grid.highchart",
    inWidgetName: "highchart",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store
    },
    setData: function(a) {
        var b = this
          , c = b.widget
          , d = c.store
          , e = d.getDataView()
          , f = a.fields
          , g = 0
          , h = e.length
          , i = 0
          , j = f.length
          , k = b.getChart(a.id)
          , l = k.series
          , m = a.read;
        if (m && void 0 !== m.rowIndex && (e = [e[m.rowIndex]],
        j = 1),
        Fancy.isString(f))
            for (; j > i; i++) {
                var n = e[i][f]
                  , o = l[i]
                  , p = []
                  , g = 0
                  , h = n.length;
                if (a.names)
                    for (; h > g; g++) {
                        var q = {
                            name: a.names[g],
                            value: n[g]
                        };
                        p.push(q)
                    }
                else
                    for (; h > g; g++)
                        p.push(n[g]);
                if (!o)
                    break;
                o.setData(p),
                a.name && o.update({
                    name: e[i][a.name]
                })
            }
        else
            for (; j > i; i++) {
                var r = f[i]
                  , o = l[i]
                  , p = [];
                for (g = 0; h > g; g++)
                    p.push(e[g][r]);
                o.setData(p)
            }
    },
    setSeriesData: function(a, b) {
        var c = this
          , d = c.getChart(chartConfig.id)
          , e = (d.series,
        d.series[0]);
        e.setData(b.data)
    },
    set: function(a, b) {
        var c, d = this, e = d.widget, f = (e.store,
        d.getFieldsMap(a)), g = d.getChart(a.id), h = g.series;
        c = h[f[b.key]],
        c.data[b.rowIndex].update(Number(b.value))
    },
    sort: function(a) {
        for (var b = this, c = b.widget, d = c.store, e = b.getChart(a.id), f = a.categories ? a.categories : e.xAxis[0].categories, g = d.order, h = [], i = 0, j = g.length; j > i; i++)
            h.push(f[g[i]]);
        return e.xAxis[0].update({
            categories: h
        }, !0),
        b.update(a),
        {
            original: f,
            newCategories: h
        }
    },
    update: function(a) {
        for (var b = this, c = b.widget, d = c.store, e = d.getDataView(), f = a.fields, g = 0, h = e.length, i = 0, j = f.length, k = b.getChart(a.id), l = k.series, m = [], n = 0, o = f.length; o > n; n++) {
            var p = f[n];
            g = 0;
            for (var q = []; h > g; g++)
                q.push(e[g][p]);
            m.push(q)
        }
        for (j = l.length; j > i; i++) {
            var r = l[i];
            r.setData(m[i], !1)
        }
        k.redraw()
    },
    getData: function(a) {
        for (var b = this, c = b.widget, d = (c.store,
        b.getChart(a.id)), e = e = a.fields, f = 0, g = e.length, h = d.series, i = h[0].data.length, j = []; g > f; f++)
            for (var k = e[f], l = 0, m = h[f]; i > l; l++)
                void 0 === j[l] && (j[l] = {}),
                j[l][k] = m.data[l].y;
        var n = b.getColumnsChartIndexes();
        for (f = 0,
        g = n.length; g > f; f++) {
            var o = n[f]
              , p = o.split(".")
              , q = d[p[0]][0][p[1]];
            for (l = 0,
            i = q.length; i > l; l++)
                j[l][o] = q[l]
        }
        return j
    },
    getColumnsChartIndexes: function() {
        for (var a = this, b = a.widget, c = [], d = b.columns, e = 0, f = d.length; f > e; e++) {
            var g = d[e].index;
            /xAxis\../.test(g) && c.push(g)
        }
        return c
    },
    getFieldsMap: function(a) {
        for (var b = this, c = b.widget, d = (c.store,
        {}), e = a.fields, f = 0, g = e.length; g > f; f++)
            d[e[f]] = f;
        return d
    },
    addSeries: function(a, b) {
        var c = this
          , d = c.getChart(a);
        d.addSeries(b)
    },
    getNumberSeries: function(a) {
        var b = this
          , c = b.getChart(a);
        return c.series.length
    },
    removeLastSeries: function(a) {
        var b = this
          , c = b.getChart(a);
        c.series[c.series.length - 1].remove()
    },
    removeSeries: function(a, b) {
        var c = this
          , d = c.getChart(a);
        d.series[b].remove()
    },
    doesSeriesExist: function(a, b) {
        for (var c = this, d = c.getChart(a), e = 0, f = d.series.length; f > e; e++)
            if (d.series[e].name === b)
                return e;
        return !1
    },
    isTreeMap: function(a) {
        var b = this
          , c = b.getChart(a);
        return void 0 === c.series[0] ? !1 : "treemap" === c.series[0].type
    },
    getChart: function(a) {
        var b, c = Highcharts.charts;
        return c.forEach(function(c, d) {
            c.renderTo.id === a && (b = c)
        }),
        b
    }
}),
Fancy.define("Fancy.grid.plugin.Edit", {
    extend: Fancy.Plugin,
    ptype: "grid.edit",
    inWidgetName: "edit",
    clicksToEdit: 2,
    tabColumnsSupport: {
        date: !0,
        combo: !0,
        image: !0,
        number: !0,
        string: !0,
        text: !0
    },
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        a.addEvents("tab"),
        a.Super("init", arguments),
        b.once("render", function() {
            a.ons(),
            c.on("beforeupdate", a.onStoreCRUDBeforeUpdate, a),
            c.on("update", a.onStoreCRUDUpdate, a),
            c.on("beforedestroy", a.onStoreCRUDBeforeDestroy, a),
            c.on("destroy", a.onStoreCRUDDestroy, a),
            c.on("create", a.onCreate, a)
        })
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = "cell" + a.getClickEventName();
        b.on("cellclick", a.onClickCell, a),
        c.on("set", a.onStoreSet, a),
        a.on("tab", a.onTab, a),
        b.once("init", function() {
            b.on(d, a.onClickCellToEdit, a)
        }),
        b.on("activate", a.onGridActivate, a),
        b.on("deactivate", a.onGridDeActivate, a)
    },
    onGridActivate: function() {
        var a = this
          , b = Fancy.get(document);
        b.on("keydown", a.onKeyDown, a)
    },
    onGridDeActivate: function() {
        var a = this
          , b = Fancy.get(document);
        b.un("keydown", a.onKeyDown, a)
    },
    onKeyDown: function(a) {
        var b = this
          , c = a.keyCode
          , d = Fancy.key;
        switch (c) {
        case d.TAB:
            b.fire("tab", a)
        }
    },
    onTab: function(a, b) {
        var a = this
          , c = a.widget
          , d = a.activeCellEditParams;
        if (d) {
            b.preventDefault();
            var e = a.getNextCellEditParam();
            c.celledit && (c.celledit.hideEditor(),
            c.tabEdit !== !1 && setTimeout(function() {
                c.celledit.edit(e)
            }, 100))
        }
    },
    getNextCellEditParam: function() {
        for (var a, b, c, d = this, e = d.widget, f = e.store, g = d.activeCellEditParams, h = (e.rightColumns,
        e.leftColumns), i = g.columnIndex, j = g.rowIndex, k = g.side, l = e.getBody(k), m = e.getColumns(k), n = m[i + 1], o = 0, p = 20; p > o; o++) {
            var q = d.getNextCellInfo({
                side: k,
                columnIndex: i,
                rowIndex: j
            });
            if (k = q.side,
            i = q.columnIndex,
            j = q.rowIndex,
            m = e.getColumns(k),
            n = m[q.columnIndex],
            d.tabColumnsSupport[n.type] && n.editable === !0)
                break
        }
        return l = e.getBody(k),
        a = l.getCell(j, i).dom,
        a || (k = "center",
        h.length && (k = "left"),
        j = 0,
        i = 0,
        l = e.getBody(k),
        a = l.getCell(j, i).dom),
        b = n.index || n.key,
        c = f.getId(j),
        {
            id: f.getId(j),
            side: k,
            column: n,
            cell: a,
            columnIndex: i,
            rowIndex: j,
            value: f.get(j, b),
            data: f.get(j),
            item: f.getById(c)
        }
    },
    getNextCellInfo: function(a) {
        var b = this
          , c = b.widget
          , d = a.side
          , e = c.getColumns(d)
          , f = a.columnIndex
          , g = a.rowIndex
          , h = e[f + 1]
          , i = c.rightColumns
          , j = c.leftColumns;
        if (h)
            f++;
        else
            switch (d) {
            case "left":
                d = "center",
                f = 0;
                break;
            case "center":
                i.length ? (d = "right",
                f = 0) : j.length ? (d = "left",
                f = 0,
                g++) : (f = 0,
                g++);
                break;
            case "right":
                j.length ? (d = "left",
                f = 0,
                g++) : (d = "center",
                f = 0,
                g++)
            }
        return {
            side: d,
            rowIndex: g,
            columnIndex: f
        }
    },
    getClickEventName: function() {
        var a = this;
        return 1 === a.clicksToEdit ? "click" : 2 === a.clicksToEdit ? "dblclick" : void 0
    },
    stopEditor: function() {
        var a = this;
        a.stopped = !0
    },
    onClickCell: function(a, b) {
        var c = this
          , d = c.widget
          , e = b.column;
        e.type;
        e.editable && "checkbox" === e.type && d.celledit && d.celledit.onCheckBoxChange(b)
    },
    onClickCellToEdit: function(a, b) {
        var c = this
          , d = c.widget
          , e = b.column;
        e.type;
        return d.rowedit || d.celledit && d.celledit.hideEditor(),
        c.fire("beforedit"),
        c.stopped === !0 ? void (c.stopped = !1) : void (d.rowedit ? d.rowedit.edit(b) : e.editable && "checkbox" !== e.type && d.celledit && d.celledit.edit(b))
    },
    onStoreSet: function(a, b) {
        var c = this
          , d = c.widget;
        d.updater.updateRow(b.rowIndex)
    },
    onStoreCRUDBeforeUpdate: function() {
        var a, b = this, c = b.widget, d = b.activeCellEditParams;
        d && (a = Fancy.get(d.cell),
        c.updater.updateRow(d.rowIndex))
    },
    onStoreCRUDUpdate: function(a, b, c, d) {
        var e, f = this, g = (f.widget,
        f.activeCellEditParams);
        g && (e = Fancy.get(g.cell)),
        delete a.changed[b],
        f.clearDirty()
    },
    onStoreCRUDBeforeDestroy: function() {},
    onStoreCRUDDestroy: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.loadData(),
        a.clearDirty()
    },
    clearDirty: function() {
        var a = this
          , b = a.widget;
        b.store;
        setTimeout(function() {
            b.leftBody.clearDirty(),
            b.body.clearDirty(),
            b.rightBody.clearDirty()
        }, 500)
    },
    onCreate: function(a, b) {
        var c = this
          , d = c.widget;
        d.store;
        d.updater.update(),
        c.clearDirty()
    }
}),
Fancy.define("Fancy.grid.plugin.CellEdit", {
    extend: Fancy.Plugin,
    ptype: "grid.celledit",
    inWidgetName: "celledit",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.once("render", function() {
            a.initEditorContainer(),
            b.on("scroll", a.onScroll, a),
            b.on("docclick", a.onDocClick, a),
            b.on("headercellmousedown", a.onHeaderCellMouseDown, a)
        })
    },
    onDocClick: function(a, b) {
        var c = this
          , d = c.activeCellEditParams
          , e = c.activeEditor
          , f = !0;
        if (void 0 !== e && "combo" === d.column.type) {
            var g = b.target;
            e.el.within(g) === !1 && e.list.within(g) === !1 && c.comboClick !== !0 && (f = !1),
            f === !1 && e.hide(),
            c.comboClick = !1
        }
    },
    initEditorContainer: function() {
        var a = this
          , b = a.widget;
        a.editorsContainer = b.el.select(".fancy-grid-editors")
    },
    edit: function(a) {
        var b = this
          , c = b.widget
          , d = a.column;
        d.type;
        "$selected" !== d.index && (b.activeCellEditParams = a,
        c.edit.activeCellEditParams = a,
        d.editor = b.generateEditor(d),
        c.scroller.scrollToCell(a.cell),
        b.showEditor(a))
    },
    generateEditor: function(a) {
        var b, c, d = this, e = d.widget, f = {
            position: "absolute",
            left: "0px",
            top: "0px",
            display: "none",
            padding: "0px"
        }, g = a.type, h = a.vtype, i = e.theme;
        if (a.editor)
            return a.editor;
        c = d.editorsContainer.dom;
        var j = {
            renderTo: c,
            label: !1,
            style: f
        };
        switch (g) {
        case "combo":
            var k, l = "valueText", m = "valueText";
            void 0 !== a.displayKey && (l = a.displayKey,
            m = l),
            k = Fancy.isObject(a.data) || Fancy.isObject(a.data[0]) ? a.data : d.configComboData(a.data),
            "default" === i && (i = void 0),
            b = new Fancy.Combo({
                theme: i,
                renderTo: c,
                label: !1,
                style: f,
                data: k,
                displayKey: l,
                valueKey: m,
                value: 0,
                padding: !1,
                vtype: h,
                events: [{
                    change: d.onComboChange,
                    scope: d
                }]
            });
            break;
        case "text":
            b = new Fancy.TextArea({
                renderTo: c,
                label: !1,
                style: f,
                vtype: h,
                events: [{
                    enter: d.onEditorEnter,
                    scope: d
                }, {
                    beforehide: d.onEditorBeforeHide,
                    scope: d
                }, {
                    blur: d.onBlur,
                    scope: d
                }]
            });
            break;
        case "image":
        case "string":
            b = new Fancy.StringField({
                renderTo: c,
                label: !1,
                style: f,
                vtype: h,
                format: a.format,
                events: [{
                    enter: d.onEditorEnter,
                    scope: d
                }, {
                    beforehide: d.onEditorBeforeHide,
                    scope: d
                }, {
                    blur: d.onBlur,
                    scope: d
                }]
            });
            break;
        case "number":
        case "currency":
            Fancy.apply(j, {
                vtype: h,
                format: a.format,
                events: [{
                    enter: d.onEditorEnter,
                    scope: d
                }, {
                    beforehide: d.onEditorBeforeHide,
                    scope: d
                }, {
                    blur: d.onBlur,
                    scope: d
                }]
            }),
            void 0 !== a.spin && (j.spin = a.spin),
            void 0 !== a.step && (j.step = a.step),
            void 0 !== a.min && (j.min = a.min),
            void 0 !== a.max && (j.max = a.max),
            b = new Fancy.NumberField(j);
            break;
        case "date":
            b = new Fancy.DateField({
                renderTo: c,
                label: !1,
                style: f,
                format: a.format,
                lang: e.lang,
                vtype: h,
                theme: i,
                events: [{
                    enter: d.onEditorEnter,
                    scope: d
                }, {
                    beforehide: d.onEditorBeforeHide,
                    scope: d
                }, {
                    blur: d.onBlur,
                    scope: d
                }]
            });
            break;
        default:
            throw new Error("[FancyGrid error] - type " + g + " editor does not exit")
        }
        return b
    },
    configComboData: function(a) {
        var b = 0
          , c = a.length
          , d = [];
        if (Fancy.isObject(a))
            return a;
        for (; c > b; b++)
            d.push({
                index: b,
                valueText: a[b]
            });
        return d
    },
    showEditor: function(a) {
        var b = this
          , c = b.widget
          , d = a.column
          , e = d.type
          , f = d.editor
          , g = a.cell
          , h = b.getCellPosition(g)
          , i = b.getCellSize(g);
        "combo" === e && (b.comboClick = !0),
        b.activeEditor = f,
        b.setEditorValue(a),
        b.setEditorSize(i),
        f.show(),
        f.el.css(h),
        f.focus(),
        c.fire("startedit", a)
    },
    setEditorSize: function(a) {
        var b = this;
        "field.combo" === b.activeEditor.wtype ? b.activeEditor.size(a) : b.activeEditor.setInputSize({
            width: a.width,
            height: a.height
        })
    },
    hideEditor: function() {
        var a, b, c, d = this, e = d.widget, f = e.store, g = d.activeCellEditParams, h = d.activeEditor;
        h && (c = g.column,
        b = h.get(),
        "server" === f.proxyType && "combo" !== c.type && (a = d.getActiveColumnKey(),
        b = d.prepareValue(b),
        f.set(g.rowIndex, a, b)),
        h.hide(),
        h.hideErrorTip()),
        delete d.activeEditor
    },
    getCellPosition: function(a) {
        var b = this
          , c = b.widget
          , d = c.gridBorders
          , e = Fancy.get(a)
          , f = e.offset()
          , g = c.el.offset()
          , h = {
            left: parseInt(f.left) - parseInt(g.left) - 2 + "px",
            top: parseInt(f.top) - parseInt(g.top) - (d[0] + d[2]) + "px"
        };
        return h
    },
    getCellSize: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.get(a)
          , e = d.width()
          , f = d.height()
          , g = 2;
        return Fancy.nojQuery && 2 === c.panelBorderWidth && (g = 1),
        e += parseInt(d.css("border-right-width")) * g,
        f += parseInt(d.css("border-bottom-width")) * g,
        {
            width: e,
            height: f
        }
    },
    setEditorValue: function(a) {
        var b = this
          , c = b.widget
          , d = (c.lang,
        b.activeEditor);
        switch (a.column.type) {
        case "combo":
            -1 !== d.valueIndex && d.set(d.getValueKey(a.value), !1);
            break;
        case "date":
            var e = a.column.format
              , f = Fancy.Date.parse(a.value, e.read, e.mode);
            d.set(f);
            break;
        default:
            d.set(a.value)
        }
    },
    onEditorEnter: function(a, b) {
        var c = this;
        c.hideEditor()
    },
    onHeaderCellMouseDown: function() {
        var a = this;
        a.hideEditor()
    },
    onKey: function(a, b) {},
    setValue: function(a) {
        var b, c = this, d = c.widget, e = d.store, f = c.activeCellEditParams, g = c.activeEditor;
        void 0 !== g && g.isValid() !== !1 && "server" !== e.proxyType && (b = c.getActiveColumnKey(),
        a = c.prepareValue(a),
        "field.date" === g.type && g.isEqual(e.get(f.rowIndex, b)) || e.set(f.rowIndex, b, a))
    },
    onEditorBeforeHide: function(a) {
        var b = this;
        b.setValue(a.getValue())
    },
    onScroll: function() {
        var a = this;
        a.hideEditor()
    },
    onBlur: function(a) {
        var b = this;
        if (!b.activeEditor || a.id === b.activeEditor.id) {
            if (a.mouseDownSpinUp === !0 || a.mouseDownSpinDown)
                return;
            b.hideEditor()
        }
    },
    prepareValue: function(a) {
        var b = this
          , c = b.getActiveColumnType()
          , d = b.activeCellEditParams
          , e = d.column
          , f = e.format;
        switch (c) {
        case "number":
        case "currency":
            if (f && f.inputFn) {
                var g = ""
                  , h = 0
                  , i = a.length;
                if (Fancy.isNumber(a))
                    return a;
                for (; i > h; h++)
                    isNaN(Number(a[h])) || (g += a[h]);
                a = g
            } else
                "" !== a && (a = Number(a));
            break;
        case "date":
            if (e.format && e.format.read) {
                var j = e.editor.getDate();
                a = Fancy.Date.format(j, e.format.read, void 0, e.format.mode)
            }
        }
        return a
    },
    getActiveColumnType: function() {
        var a = this
          , b = a.activeCellEditParams
          , c = b.column;
        return c.type
    },
    getActiveColumnKey: function() {
        var a = this
          , b = a.activeCellEditParams
          , c = b.column
          , d = c.key || c.index;
        return d
    },
    onCheckBoxChange: function(a) {
        var b = this
          , c = b.widget
          , d = a.column
          , e = d.key || d.index
          , f = c.store
          , g = b.checkBoxChangedValue;
        b.activeEditor && b.hideEditor(),
        void 0 !== b.checkBoxChangedValue && (delete b.checkBoxChangedValue,
        b.activeCellEditParams = a,
        c.edit.activeCellEditParams = a,
        f.set(a.rowIndex, e, g))
    },
    onComboChange: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.store
          , f = c.activeEditor
          , g = c.activeCellEditParams
          , h = c.getActiveColumnKey()
          , i = f.getDisplayValue(b);
        -1 !== a.valueIndex && (b = i),
        e.set(g.rowIndex, h, b),
        c.hideEditor()
    }
}),
Fancy.define("Fancy.grid.plugin.RowEdit", {
    extend: Fancy.Plugin,
    ptype: "grid.rowedit",
    inWidgetName: "rowedit",
    rendered: !1,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.on("scroll", a.onScroll, a),
        b.on("columnresize", a.onColumnResize, a),
        b.grouping && (b.on("collapse", a.onCollapse, a),
        b.on("expand", a.onExpand, a))
    },
    onCollapse: function() {
        var a = this;
        a.hide()
    },
    onExpand: function() {
        var a = this;
        a.hide()
    },
    edit: function(a) {
        var b = this
          , c = b.widget
          , d = (c.store,
        a.column);
        d.type;
        "$selected" !== d.index && (c.scroller.scrollToCell(a.cell),
        b.showEditor(a))
    },
    showEditor: function(a) {
        var b = this;
        if (b.changed = {},
        b.rendered) {
            var c = "none" === b.el.css("display");
            b.show(),
            b.changePosition(a.rowIndex, !c)
        } else
            b.render(),
            b.changePosition(a.rowIndex, !1);
        b.setValues(a),
        b.setSizes()
    },
    render: function() {
        var a = this
          , b = a.widget;
        b.leftColumns && (a.leftEl = a.renderTo(b.leftBody.el, b.leftColumns)),
        b.columns && (a.el = a.renderTo(b.body.el, b.columns)),
        b.rightColumns && (a.rightEl = a.renderTo(b.rightBody.el, b.rightColumns)),
        a.renderButtons(),
        a.rendered = !0
    },
    renderTo: function(a, b) {
        var c, d, e = this, f = e.widget, g = Fancy.get(document.createElement("div")), h = 0, i = b.length, j = f.theme, k = {
            "float": "left",
            margin: "0px",
            padding: "0px"
        };
        for (g.addClass(f.rowEditCls),
        c = Fancy.get(a.dom.appendChild(g.dom)); i > h; h++) {
            d = b[h];
            var l, m = d.width, n = {
                index: d.index,
                renderTo: c.dom,
                label: !1,
                style: k,
                width: m,
                vtype: d.vtype,
                format: d.format,
                stopPropagation: !0,
                theme: j,
                events: [{
                    change: e.onFieldChange,
                    scope: e
                }, {
                    enter: e.onFieldEnter,
                    scope: e
                }]
            };
            if (d.editable === !1)
                switch (Fancy.apply(n, {}),
                d.type) {
                case "string":
                case "number":
                    l = new Fancy.TextField(n);
                    break;
                default:
                    l = new Fancy.EmptyField(n)
                }
            else
                switch (d.type) {
                case "date":
                    Fancy.apply(n, {}),
                    d.format && (n.format = d.format),
                    l = new Fancy.DateField(n);
                    break;
                case "image":
                case "string":
                case "color":
                    Fancy.apply(n, {}),
                    l = new Fancy.StringField(n);
                    break;
                case "number":
                    Fancy.apply(n, {}),
                    d.spin && (n.spin = d.spin),
                    d.step && (n.step = d.step),
                    d.min && (n.min = d.min),
                    d.max && (n.max = d.max),
                    l = new Fancy.NumberField(n);
                    break;
                case "combo":
                    Fancy.apply(n, {
                        data: e.configComboData(d.data),
                        displayKey: "valueText",
                        valueKey: "index",
                        value: 0,
                        padding: !1
                    }),
                    l = new Fancy.Combo(n);
                    break;
                case "checkbox":
                    var o;
                    switch (d.cellAlign) {
                    case "left":
                        o = 7;
                        break;
                    case "center":
                        o = (d.width - 20 - 2) / 2;
                        break;
                    case "right":
                        o = (d.width - 20) / 2 + 11
                    }
                    Fancy.apply(n, {
                        renderId: !0,
                        value: !1,
                        style: {
                            padding: "0px",
                            display: "inline-block",
                            "padding-left": o,
                            "float": "left",
                            margin: "0px"
                        }
                    }),
                    l = new Fancy.CheckBox(n);
                    break;
                default:
                    l = new Fancy.EmptyField(n)
                }
            d.rowEditor = l
        }
        return c
    },
    renderButtons: function() {
        var a, b = this, c = b.widget, d = Fancy.get(document.createElement("div"));
        d.addClass(c.rowEditButtonCls),
        a = Fancy.get(c.body.el.dom.appendChild(d.dom)),
        b.buttonsEl = a,
        b.buttonUpdate = new Fancy.Button({
            cls: "fancy-edit-row-button-update",
            renderTo: a.dom,
            text: "Update",
            events: [{
                click: b.onClickUpdate,
                scope: b
            }]
        }),
        b.buttonCancel = new Fancy.Button({
            cls: "fancy-edit-row-button-cancel",
            renderTo: a.dom,
            text: "Cancel",
            events: [{
                click: b.onClickCancel,
                scope: b
            }]
        })
    },
    setSizes: function() {
        var a = this
          , b = a.widget;
        b.leftColumns && a._setSizes(b.leftBody.el.select('.fancy-grid-cell[index="0"]'), b.leftColumns, "left"),
        b.columns && a._setSizes(b.body.el.select('.fancy-grid-cell[index="0"]'), b.columns),
        b.rightColumns && a._setSizes(b.rightBody.el.select('.fancy-grid-cell[index="0"]'), b.rightColumns, "right"),
        a.setElSize()
    },
    setElSize: function() {
        var a = this
          , b = a.widget
          , c = b.getCenterViewWidth()
          , d = b.getCenterFullWidth();
        d > c && a.el.css("width", d)
    },
    _setSizes: function(a, b, c) {
        for (var d, e, f, g, h, i = this, j = 0, k = b.length, l = 1, m = 2; k > j; j++)
            d = b[j],
            f = a.item(j).dom,
            g = Fancy.get(f),
            e = i.getCellSize(f),
            h = d.rowEditor,
            h && ("left" !== c && "right" !== c || j !== k - 1 || e.width--,
            e.height -= 2,
            j === k - 1 ? h.el.css("width", e.width - 2) : h.el.css("width", e.width - 1),
            h.el.css("height", e.height),
            e.width -= 2 * l,
            e.width -= 2 * m,
            e.height -= 2 * m,
            i.setEditorSize(h, e))
    },
    getCellSize: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.get(a)
          , e = d.width()
          , f = d.height()
          , g = 2;
        return Fancy.nojQuery && 2 === c.panelBorderWidth && (g = 1),
        e += parseInt(d.css("border-right-width")) * g,
        f += parseInt(d.css("border-bottom-width")) * g,
        {
            width: e,
            height: f
        }
    },
    setEditorSize: function(a, b) {
        "field.combo" === a.wtype ? (a.size(b),
        a.el.css("width", b.width + 5)) : a.setInputSize({
            width: b.width,
            height: b.height
        })
    },
    changePosition: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.scroller.getScroll()
          , f = d.scroller.getBottomScroll()
          , g = d.cellHeight * a - 1 - e
          , h = 100
          , i = 0;
        d.grouping && (i += d.grouping.getOffsetForRow(a),
        g += i),
        c.leftEl && (b !== !1 ? c.leftEl.animate({
            duration: h,
            top: g
        }) : c.leftEl.css("top", g)),
        c.el && (b !== !1 ? c.el.animate({
            duration: h,
            top: g
        }) : c.el.css("top", g)),
        c.rightEl && (b !== !1 ? c.rightEl.animate({
            duration: h,
            top: g
        }) : c.rightEl.css("top", g));
        var j = d.getViewTotal() - 3 < a
          , k = g;
        3 > a && (j = !1),
        j ? d.grouping ? d.getViewTotal() - 3 < a - d.grouping.getSpecialRowsUnder(a) ? k = g - parseInt(c.buttonsEl.css("height")) + 1 : (k = g + d.cellHeight,
        j = !1) : k = g - parseInt(c.buttonsEl.css("height")) + 1 : k = g + d.cellHeight,
        b !== !1 ? c.buttonsEl.animate({
            duration: h,
            top: k
        }) : c.buttonsEl.css("top", k),
        c.el.css("left", -f),
        c.changeButtonsLeftPos(),
        c.activeRowIndex = a
    },
    changeButtonsLeftPos: function() {
        var a = this
          , b = a.widget
          , c = b.getCenterViewWidth()
          , d = parseInt(a.buttonsEl.css("width"));
        a.buttonsEl.css("left", (c - d) / 2)
    },
    setValues: function(a) {
        var b = this
          , c = b.widget;
        c.leftColumns && b._setValues(a.data, c.leftColumns),
        c.columns && b._setValues(a.data, c.columns),
        c.rightColumns && b._setValues(a.data, c.rightColumns),
        b.activeId = a.id
    },
    _setValues: function(a, b) {
        for (var c, d, e = 0, f = b.length; f > e; e++)
            if (c = b[e],
            d = c.rowEditor)
                switch (c.type) {
                case "action":
                case "button":
                case "order":
                case "select":
                    break;
                default:
                    d.set(a[c.index], !1)
                }
    },
    onScroll: function() {
        var a = this;
        a.widget;
        a.rendered !== !1 && void 0 !== a.activeRowIndex && a.changePosition(a.activeRowIndex, !1)
    },
    onColumnResize: function() {
        var a = this;
        a.widget;
        a.rendered !== !1 && a.setSizes()
    },
    onClickUpdate: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = a.prepareChanged()
          , e = c.getRow(a.activeId);
        c.setItemData(e, d),
        b.update(),
        a.hide()
    },
    prepareChanged: function() {
        var a = this
          , b = a.widget
          , c = a.changed;
        for (var d in c) {
            var e = b.getColumnByIndex(d);
            switch (e.type) {
            case "date":
                var f = Fancy.Date.parse(c[d], e.format.edit)
                  , g = Fancy.Date.format(f, e.format.read);
                c[d] = g
            }
        }
        return c
    },
    onClickCancel: function() {
        var a = this;
        a.hide()
    },
    hide: function() {
        var a = this;
        a.el && (a.leftEl && a.leftEl.hide(),
        a.el.hide(),
        a.rightEl && a.rightEl.hide(),
        a.buttonsEl.hide())
    },
    show: function() {
        var a = this;
        a.leftEl && a.leftEl.show(),
        a.el.show(),
        a.rightEl && a.rightEl.show(),
        a.buttonsEl.show()
    },
    onFieldChange: function(a, b, c) {
        var d = this;
        d.changed[a.index] = b
    },
    configComboData: function(a) {
        var b = 0
          , c = a.length
          , d = [];
        if (Fancy.isObject(a))
            return a;
        for (; c > b; b++)
            d.push({
                index: a[b],
                valueText: a[b]
            });
        return d
    },
    onFieldEnter: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = c.getRow(a.activeId);
        c.setItemData(d, a.changed),
        b.update(),
        a.hide()
    }
}),
Fancy.define("Fancy.grid.plugin.Selection", {
    extend: Fancy.Plugin,
    ptype: "grid.selection",
    inWidgetName: "selection",
    mixins: ["Fancy.grid.selection.mixin.Navigation"],
    enabled: !0,
    checkboxRow: !1,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.once("render", function() {
            a.initTrackOver(),
            a.initColumnTrackOver(),
            a.initCellTrackOver(),
            a.initCellSelection(),
            a.initRowSelection(),
            a.initColumnSelection(),
            b.keyNavigation && a.initNavigation(),
            b.on("changepage", a.onChangePage, a)
        }),
        b.on("sort", a.onSort, a)
    },
    initTrackOver: function() {
        var a = this
          , b = a.widget;
        b.on("rowenter", a.onRowEnter, a),
        b.on("rowleave", a.onRowLeave, a)
    },
    initCellTrackOver: function() {
        var a = this
          , b = a.widget;
        b.on("cellenter", a.onCellEnter, a),
        b.on("cellleave", a.onCellLeave, a)
    },
    initColumnTrackOver: function() {
        var a = this
          , b = a.widget;
        b.on("columnenter", a.onColumnEnter, a),
        b.on("columnleave", a.onColumnLeave, a)
    },
    onCellEnter: function(a, b) {
        var c = this
          , d = c.widget;
        if (d.cellTrackOver) {
            var e = Fancy.get(b.cell);
            e.addClass(d.cellOverCls)
        }
    },
    onCellLeave: function(a, b) {
        var c = this
          , d = c.widget;
        if (d.cellTrackOver) {
            var e = Fancy.get(b.cell);
            e.removeClass(d.cellOverCls)
        }
    },
    onColumnEnter: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.scroller;
        if (d.columnTrackOver && !e.bottomKnobDown && !e.rightKnobDown && b.column.trackOver !== !1) {
            var f = Fancy.get(b.columnDom);
            f.addClass(d.columnOverCls)
        }
    },
    onColumnLeave: function(a, b) {
        var c = this
          , d = c.widget;
        if (d.columnTrackOver) {
            var e = Fancy.get(b.columnDom);
            e.removeClass(d.columnOverCls)
        }
    },
    onRowEnter: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.scroller;
        if (c.enabled !== !1 && d.trackOver && !e.bottomKnobDown && !e.rightKnobDown) {
            for (var f = d.getDomRow(b.rowIndex), g = 0, h = f.length; h > g; g++)
                Fancy.get(f[g]).addClass(d.rowOverCls);
            d.fire("rowtrackenter", b)
        }
    },
    onRowLeave: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.enabled !== !1 && d.trackOver) {
            for (var e = d.getDomRow(b.rowIndex), f = 0, g = e.length; g > f; f++)
                Fancy.get(e[f]).removeClass(d.rowOverCls);
            d.fire("rowtrackleave", b)
        }
    },
    onChangePage: function() {
        this.clearSelection()
    },
    initCellSelection: function() {
        var a = this
          , b = a.widget;
        b.on("cellclick", a.onCellClick, a),
        b.on("cellmousedown", a.onCellMouseDownCells, a),
        b.on("cellenter", a.onCellEnterSelection, a)
    },
    initRowSelection: function() {
        var a = this
          , b = a.widget;
        b.checkboxRowSelection && (a.checkboxRow = !0,
        setTimeout(function() {
            a.renderHeaderCheckBox()
        })),
        b.on("rowclick", a.onRowClick, a),
        b.on("cellmousedown", a.onCellMouseDownRows, a),
        b.on("cellclick", a.onCellClickRows, a),
        b.on("rowenter", a.onRowEnterSelection, a)
    },
    onCellMouseDownRows: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.rows && c.enabled) {
            var e = b.e
              , f = e.target
              , g = e.ctrlKey
              , h = b.rowIndex
              , i = d.getDomRow(h);
            i.length;
            if (g && d.multiSelect)
                Fancy.get(i[0]).hasClass(d.cellSelectedCls) ? (c.domDeSelectRow(h),
                c.checkboxRow && c.deSelectCheckBox(h)) : (c.domSelectRow(h),
                c.checkboxRow && c.selectCheckBox(h));
            else if ("$selected" === b.column.index) {
                var j = Fancy.getWidget(Fancy.get(b.cell).select(".fancy-field-checkbox").attr("id"));
                j.el.within(f) ? (c.domSelectRow(h),
                j.get() === !0 ? c.domDeSelectRow(h) : c.domSelectRow(h)) : (c.clearSelection(),
                c.domSelectRow(h),
                c.checkboxRow && c.selectCheckBox(h))
            } else
                c.clearSelection(),
                c.domSelectRow(h),
                c.checkboxRow && c.selectCheckBox(h);
            c.isMouseDown = !0,
            c.startRowSelection = h,
            Fancy.$(document).one("mouseup", function() {
                delete c.isMouseDown,
                delete c.startCellSelection
            }),
            d.fire("select")
        }
    },
    onCellClickRows: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.rows && c.enabled) {
            var e = b.e
              , f = e.ctrlKey
              , g = b.rowIndex
              , h = d.getDomRow(g);
            h.length;
            if (f && d.multiSelect)
                ;
            else if ("$selected" === b.column.index) {
                var i = Fancy.getWidget(Fancy.get(b.cell).select(".fancy-field-checkbox").attr("id"));
                i.get() === !0 ? c.selectCheckBox(g) : c.deSelectCheckBox(g)
            }
        }
    },
    selectCheckBox: function(a) {
        for (var b = this, c = b.widget, d = c.el.select('.fancy-grid-cell-select .fancy-grid-cell[index="' + a + '"] .fancy-field-checkbox'), e = 0, f = d.length; f > e; e++) {
            var g = Fancy.getWidget(d.item(e).attr("id"));
            g.set(!0)
        }
        b.clearHeaderCheckBox()
    },
    deSelectCheckBox: function(a) {
        for (var b = this, c = b.widget, d = c.el.select('.fancy-grid-cell-select .fancy-grid-cell[index="' + a + '"] .fancy-field-checkbox'), e = 0, f = d.length; f > e; e++) {
            var g = Fancy.getWidget(d.item(e).attr("id"));
            g.set(!1)
        }
        b.clearHeaderCheckBox()
    },
    domSelectRow: function(a) {
        for (var b = this, c = b.widget, d = c.getDomRow(a), e = 0, f = d.length; f > e; e++)
            Fancy.get(d[e]).addClass(c.cellSelectedCls)
    },
    domDeSelectRow: function(a) {
        for (var b = this, c = b.widget, d = c.getDomRow(a), e = 0, f = d.length; f > e; e++)
            Fancy.get(d[e]).removeClass(c.cellSelectedCls)
    },
    onColumnEnterSelection: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.columns && c.isMouseDown === !0) {
            var e = {
                columnIndex: c.startColumnColumnIndex,
                side: c.startColumnSide
            }
              , f = {
                columnIndex: b.columnIndex,
                side: b.side
            };
            if (e.side === f.side) {
                switch (e.side) {
                case "center":
                    c.clearSelection("right"),
                    c.clearSelection("left");
                    break;
                case "left":
                    c.clearSelection("center"),
                    c.clearSelection("right");
                    break;
                case "right":
                    c.clearSelection("center"),
                    c.clearSelection("left")
                }
                c.selectColumns(e.columnIndex, f.columnIndex, e.side)
            } else
                "center" === e.side && "right" === f.side ? (c.selectColumns(e.columnIndex, d.columns.length, "center"),
                c.selectColumns(0, f.columnIndex, "right")) : "center" === e.side && "left" === f.side ? (c.selectColumns(0, e.columnIndex, "center"),
                c.selectColumns(f.columnIndex, d.leftColumns.length, "left")) : "left" === e.side && "center" === f.side ? (c.clearSelection("right"),
                c.selectColumns(e.columnIndex, d.leftColumns.length, "left"),
                c.selectColumns(0, f.columnIndex, "center")) : "left" === e.side && "right" === f.side ? (c.selectColumns(e.columnIndex, d.leftColumns.length, "left"),
                c.selectColumns(0, d.columns.length, "center"),
                c.selectColumns(0, f.columnIndex, "right")) : "right" === e.side && "center" === f.side ? (c.clearSelection("left"),
                c.selectColumns(0, e.columnIndex, "right"),
                c.selectColumns(f.columnIndex, d.columns.length, "center")) : "right" === e.side && "left" === f.side && (c.selectColumns(0, e.columnIndex, "right"),
                c.selectColumns(0, d.columns.length, "center"),
                c.selectColumns(f.columnIndex, d.leftColumns.length, "left"))
        }
    },
    onRowEnterSelection: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.enabled !== !1 && c.rows && c.isMouseDown === !0) {
            var e = d.getDomRow(b.rowIndex)
              , f = (e.length,
            c.startRowSelection)
              , g = b.rowIndex
              , h = {};
            f > g && (f = b.rowIndex,
            g = c.startRowSelection);
            for (var i = f, j = g + 1; j > i; i++)
                h[i] = !0;
            var k = c.getSelectedRowByColumn(b.columnIndex, b.side)
              , l = {}
              , m = {};
            for (var n in h)
                k[n] !== !0 && (l[n] = !0);
            for (var n in k)
                h[n] !== !0 && (m[n] = !0);
            for (var n in l)
                c.domSelectRow(n),
                c.checkboxRow && c.selectCheckBox(n);
            for (var n in m)
                c.domDeSelectRow(n),
                c.checkboxRow && c.deSelectCheckBox(n);
            d.fire("select")
        }
    },
    getSelectedRowByColumn: function(a, b) {
        var c, d = this, e = d.widget;
        switch (b) {
        case "left":
            c = e.leftBody;
            break;
        case "center":
            c = e.body;
            break;
        case "right":
            c = e.rightBody
        }
        for (var f = c.el.select('.fancy-grid-column[index="' + a + '"][grid="' + e.id + '"]'), g = f.select("." + e.cellSelectedCls), h = {}, i = 0, j = g.length; j > i; i++)
            h[Number(g.item(i).attr("index"))] = !0;
        return h
    },
    getSelectedRow: function() {
        var a = this
          , b = a.widget
          , c = b.body
          , d = c.el.select("." + b.cellSelectedCls);
        return 0 === d.length ? -1 : Number(d.item(0).attr("index"))
    },
    getSelectedRows: function() {
        for (var a = this, b = a.widget, c = b.body, d = c.el.select('.fancy-grid-column[index="0"][grid="' + b.id + '"]'), e = d.select("." + b.cellSelectedCls), f = [], g = 0, h = e.length; h > g; g++)
            f.push(Number(e.item(g).attr("index")));
        return f
    },
    initColumnSelection: function() {
        var a = this
          , b = a.widget;
        a.selectedColumns = [],
        b.on("columnclick", a.onColumnClick, a),
        b.on("columnmousedown", a.onColumnMouseDown, a),
        b.on("columnenter", a.onColumnEnterSelection, a)
    },
    onColumnClick: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.column && b.column.selectable !== !1) {
            var e = Fancy.get(b.columnDom);
            c.column && (c.selectedColumns[0] = b),
            c.clearSelection(),
            e.addClass(d.columnSelectedCls)
        }
    },
    onRowClick: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.row && b !== !1) {
            var e = b.column
              , f = !0;
            if ("action" === e.type && e.items)
                for (var g = 0, h = e.items.length; h > g; g++)
                    "remove" === e.items[g].action && (f = !1);
            var i = d.getDomRow(b.rowIndex)
              , j = 0
              , k = i.length;
            if (c.clearSelection(),
            f) {
                for (; k > j; j++)
                    Fancy.get(i[j]).addClass(d.cellSelectedCls);
                d.fire("select")
            }
        }
    },
    selectRow: function(a) {
        var b = this
          , c = b.widget;
        if (!b.row && !b.rows)
            throw new Error("[FancyGrid Error] - row selection was not enabled");
        b.clearSelection();
        for (var d = c.getDomRow(a), e = 0, f = d.length; f > e; e++)
            Fancy.get(d[e]).addClass(c.cellSelectedCls);
        c.fire("select")
    },
    onCellClick: function(a, b) {
        var c = this
          , d = c.widget;
        c.cell && (c.clearSelection(),
        Fancy.get(b.cell).addClass(d.cellSelectedCls),
        d.fire("select"))
    },
    clearSelection: function(a) {
        var b = this
          , c = b.widget;
        if (b.checkboxRow)
            for (var d = c.body.el.select('.fancy-grid-column[index="0"] .' + c.cellSelectedCls), e = 0, f = d.length; f > e; e++) {
                var g = d.item(e).attr("index");
                b.deSelectCheckBox(g)
            }
        if (a)
            switch (a) {
            case "left":
                c.leftBody.el.select("." + c.cellSelectedCls).removeClass(c.cellSelectedCls),
                c.leftBody.el.select("." + c.columnSelectedCls).removeClass(c.columnSelectedCls),
                c.leftBody.el.select("." + c.cellOverCls).removeClass(c.cellOverCls);
                break;
            case "center":
                c.body.el.select("." + c.cellSelectedCls).removeClass(c.cellSelectedCls),
                c.body.el.select("." + c.columnSelectedCls).removeClass(c.columnSelectedCls),
                c.body.el.select("." + c.cellOverCls).removeClass(c.cellOverCls);
                break;
            case "right":
                c.rightBody.el.select("." + c.cellSelectedCls).removeClass(c.cellSelectedCls),
                c.rightBody.el.select("." + c.columnSelectedCls).removeClass(c.columnSelectedCls),
                c.rightBody.el.select("." + c.cellOverCls).removeClass(c.cellOverCls)
            }
        else
            c.el.select("." + c.cellSelectedCls).removeClass(c.cellSelectedCls),
            c.el.select("." + c.columnSelectedCls).removeClass(c.columnSelectedCls),
            c.el.select("." + c.cellOverCls).removeClass(c.cellOverCls);
        c.fire("clearselect")
    },
    onSort: function() {
        var a = this;
        a.widget;
        a.clearSelection()
    },
    onCellEnterSelection: function(a, b) {
        var c = this
          , d = c.widget
          , e = 0;
        if (c.cells && c.isMouseDown === !0) {
            c.prevCellsSelection = b.cell,
            c.prevCellRowIndex = b.rowIndex,
            c.prevCellColumnIndex = b.columnIndex,
            c.prevCellSide = b.side;
            var f = {
                rowIndex: c.startCellRowIndex,
                columnIndex: c.startCellColumnIndex,
                side: c.startCellSide
            }
              , g = {
                rowIndex: b.rowIndex,
                columnIndex: b.columnIndex,
                side: b.side
            };
            b.rowIndex < c.startCellRowIndex && (f.rowIndex = b.rowIndex,
            g.rowIndex = c.startCellRowIndex),
            c.startCellSide === b.side ? (b.columnIndex < c.startCellColumnIndex && (f.columnIndex = b.columnIndex,
            g.columnIndex = c.startCellColumnIndex),
            e = c.selectCells(f, g, f.side),
            "left" === c.startCellSide ? (c.clearSelection("center"),
            c.clearSelection("right")) : "center" === c.startCellSide ? (c.clearSelection("left"),
            c.clearSelection("right")) : "right" === c.startCellSide && (c.clearSelection("left"),
            c.clearSelection("center"))) : "left" === c.startCellSide ? (e = c.selectCells(f, {
                rowIndex: b.rowIndex,
                columnIndex: d.leftColumns.length - 1
            }, "left"),
            "center" === b.side ? (e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, g, "center"),
            c.clearSelection("right")) : "right" === b.side && (e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, {
                columnIndex: d.columns.length - 1,
                rowIndex: g.rowIndex
            }, "center"),
            e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, g, "right"))) : "center" === c.startCellSide ? "left" === b.side ? (e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, {
                rowIndex: g.rowIndex,
                columnIndex: f.columnIndex
            }, "center"),
            e += c.selectCells({
                columnIndex: g.columnIndex,
                rowIndex: f.rowIndex
            }, {
                rowIndex: g.rowIndex,
                columnIndex: d.leftColumns.length - 1
            }, "left")) : "right" === b.side && (e += c.selectCells({
                columnIndex: f.columnIndex,
                rowIndex: f.rowIndex
            }, {
                columnIndex: d.columns.length - 1,
                rowIndex: g.rowIndex
            }, "center"),
            e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, {
                columnIndex: g.columnIndex,
                rowIndex: g.rowIndex
            }, "right")) : "right" === c.startCellSide && (e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, {
                columnIndex: f.columnIndex,
                rowIndex: g.rowIndex
            }, "right"),
            "center" === b.side ? (e += c.selectCells({
                columnIndex: g.columnIndex,
                rowIndex: f.rowIndex
            }, {
                columnIndex: d.columns.length - 1,
                rowIndex: g.rowIndex
            }, "center"),
            c.clearSelection("left")) : "left" === b.side && (e += c.selectCells({
                columnIndex: 0,
                rowIndex: f.rowIndex
            }, {
                columnIndex: d.columns.length - 1,
                rowIndex: g.rowIndex
            }, "center"),
            e += c.selectCells({
                columnIndex: g.columnIndex,
                rowIndex: f.rowIndex
            }, {
                columnIndex: d.leftColumns.length - 1,
                rowIndex: g.rowIndex
            }, "left"))),
            c.endCellRowIndex = g.rowIndex,
            d.fire("select")
        }
    },
    onColumnMouseDown: function(a, b) {
        var c = this
          , d = c.widget;
        if (c.columns && b.column.selectable !== !1 && c.enabled) {
            var e = Fancy.get(b.columnDom);
            c.isMouseDown = !0,
            c.startColumnColumnIndex = b.columnIndex,
            c.startColumnSide = b.side,
            c.clearSelection(),
            e.addClass(d.columnSelectedCls),
            Fancy.$(document).one("mouseup", function() {
                delete c.isMouseDown
            }),
            d.fire("select")
        }
    },
    onCellMouseDownCells: function(a, b) {
        var c = this
          , d = c.widget;
        if (d.celledit && d.celledit.hideEditor(),
        c.cells && c.enabled) {
            var e = Fancy.get(b.cell);
            c.clearSelection(),
            e.addClass(d.cellSelectedCls),
            c.isMouseDown = !0,
            c.startCellSelection = b.cell,
            c.startCellRowIndex = b.rowIndex,
            c.startCellColumnIndex = b.columnIndex,
            c.startCellSide = b.side,
            Fancy.$(document).one("mouseup", function() {
                delete c.isMouseDown,
                delete c.startCellSelection
            }),
            d.fire("select")
        }
    },
    selectCells: function(a, b, c) {
        var d, e, f, g = this, h = g.widget, i = h.body, j = h.leftBody, k = h.rightBody, l = a.rowIndex, m = b.rowIndex + 1, n = g.getSelectedCells(c || "center"), o = {}, p = {}, q = {};
        for (l = a.rowIndex,
        m = b.rowIndex + 1; m > l; l++)
            for (o[l] = o[l] || {},
            e = a.columnIndex,
            f = b.columnIndex + 1; f > e; e++)
                o[l][e] = !0;
        for (var r in o)
            if (void 0 === n[r])
                p[r] = o[r];
            else
                for (var s in o[r])
                    n[r][s] !== !0 && (p[r] = p[r] || {},
                    p[r][s] = !0);
        for (var r in n)
            if (void 0 === o[r])
                q[r] = n[r];
            else
                for (var s in n[r])
                    o[r][s] !== !0 && (q[r] = q[r] || {},
                    q[r][s] = !0);
        switch (c) {
        case "left":
            d = j;
            break;
        case "center":
            d = i;
            break;
        case "right":
            d = k;
            break;
        default:
            d = i
        }
        for (var r in p)
            for (var s in p[r]) {
                var t = d.getCell(r, s);
                t.addClass(h.cellSelectedCls)
            }
        for (var r in q)
            for (var s in q[r]) {
                var t = d.getCell(r, s);
                t.removeClass(h.cellSelectedCls)
            }
    },
    getSelectedCells: function(a) {
        for (var b = this, c = b.widget, d = c.getBody(a || "center"), e = d.el.select("." + c.cellSelectedCls), f = {}, g = 0, h = e.length; h > g; g++) {
            var i = e.item(g)
              , j = Number(i.parent().attr("index"))
              , k = Number(i.attr("index"));
            f[k] = f[k] || {},
            f[k][j] = !0
        }
        return f
    },
    getNumberSelectedCells: function() {
        var a = this
          , b = a.widget;
        return b.el.select("." + b.cellSelectedCls).length
    },
    getSelectedColumns: function(a) {
        for (var b = this, c = b.widget, d = c.getBody(a), e = {}, f = d.el.select("." + c.columnSelectedCls), g = 0, h = f.length; h > g; g++)
            e[f.item(g).attr("index")] = !0;
        return e
    },
    selectColumns: function(a, b, c) {
        var d = this
          , e = (d.widget,
        d.getSelectedColumns(c || "center"))
          , f = {}
          , g = {}
          , h = {}
          , i = a
          , j = b;
        for (i > j && (i = b,
        j = a),
        j++; j > i; i++)
            f[i] = !0;
        for (var k in f)
            e[k] !== !0 && (g[k] = !0);
        for (var k in e)
            f[k] !== !0 && (h[k] = !0);
        for (var k in g)
            d.selectColumn(k, c);
        for (var k in h)
            d.deselectColumn(k, c)
    },
    selectColumn: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.getBody(b || "center")
          , f = Fancy.get(e.getDomColumn(a));
        f.addClass(d.columnSelectedCls)
    },
    deselectColumn: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.getBody(b || "center")
          , f = Fancy.get(e.getDomColumn(a));
        f.removeClass(d.columnSelectedCls)
    },
    getSelection: function(a) {
        var b = this
          , c = b.widget
          , d = c.store
          , e = {};
        switch (b.selModel) {
        case "row":
            e.row = b.getSelectedRow(),
            -1 !== e.row ? (e.items = [d.get(e.row)],
            e.rows = [e.row]) : (e.items = [],
            e.rows = []);
            break;
        case "rows":
            e.rows = b.getSelectedRows(),
            e.items = [];
            for (var f = 0, g = e.rows.length; g > f; f++)
                e.items.push(d.get(e.rows[f]));
            break;
        case "cells":
            break;
        case "cell":
            break;
        case "column":
            break;
        case "columns":
        }
        return a ? e : e.items
    },
    renderHeaderCheckBox: function() {
        var a = this
          , b = a.widget;
        a._renderHeaderCheckBox(b.leftHeader, b.leftColumns),
        a._renderHeaderCheckBox(b.header, b.columns),
        a._renderHeaderCheckBox(b.rightHeader, b.rightColumns)
    },
    _renderHeaderCheckBox: function(a, b) {
        for (var c, d = this, e = 0, f = b.length; f > e; e++)
            if (c = b[e],
            "$selected" === c.index) {
                var g = a.getCell(e).firstChild();
                c.headerCheckBox = new Fancy.CheckBox({
                    renderTo: g.dom,
                    renderId: !0,
                    value: !1,
                    label: !1,
                    style: {
                        padding: "0px",
                        display: "inline-block"
                    },
                    events: [{
                        change: function(a, b) {
                            b ? d.selectAll() : d.deSelectAll()
                        }
                    }]
                })
            }
    },
    selectAll: function() {
        for (var a = this, b = a.widget, c = b.el.select(".fancy-grid-cell-select .fancy-field-checkbox"), d = b.el.select(".fancy-grid-header-cell-select .fancy-field-checkbox"), e = 0, f = c.length; f > e; e++) {
            var g = Fancy.getWidget(c.item(e).attr("id"));
            g.setValue(!0),
            a.domSelectRow(e)
        }
        for (e = 0,
        f = d.length; f > e; e++) {
            var g = Fancy.getWidget(d.item(e).attr("id"));
            g.setValue(!0, !1)
        }
    },
    deSelectAll: function() {
        for (var a = this, b = a.widget, c = b.el.select(".fancy-grid-cell-select .fancy-field-checkbox"), d = (b.el.select(".fancy-grid-header-cell-select .fancy-field-checkbox"),
        0), e = c.length; e > d; d++) {
            var f = Fancy.getWidget(c.item(d).attr("id"));
            f.setValue(!1),
            a.domDeSelectRow(d)
        }
        a.clearHeaderCheckBox()
    },
    clearHeaderCheckBox: function() {
        for (var a = this, b = a.widget, c = b.el.select(".fancy-grid-header-cell-select .fancy-field-checkbox"), d = 0, e = c.length; e > d; d++) {
            var f = Fancy.getWidget(c.item(d).attr("id"));
            f.setValue(!1, !1)
        }
    },
    stopSelection: function() {
        this.enabled = !1
    },
    enableSelection: function(a) {
        var b = this;
        return void 0 !== a ? void (b.enabled = a) : void (b.enabled = !0)
    }
}),
Fancy.define("Fancy.grid.plugin.Expander", {
    extend: Fancy.Plugin,
    ptype: "grid.expander",
    inWidgetName: "expander",
    plusScroll: 0,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a._expanded = {},
        a._expandedIds = {},
        a.initTpl(),
        a.ons()
    },
    initTpl: function() {
        var a = this;
        a.tpl && (a.tpl = new Fancy.Template(a.tpl))
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.on("scroll", a.onScroll, a),
        b.on("sort", a.onSort, a),
        b.on("columnresize", a.onColumnReSize, a),
        b.on("rowdblclick", a.onRowDBlClick, a),
        b.on("rowtrackenter", a.onRowTrackOver, a),
        b.on("rowtrackleave", a.onRowTrackLeave, a),
        b.on("render", function() {
            b.el.on("mouseenter", a.onExpandRowMouseEnter, a, "div.fancy-grid-expand-row"),
            b.el.on("mouseleave", a.onExpandRowMouseLeave, a, "div.fancy-grid-expand-row")
        }),
        b.on("select", a.onSelect, a),
        b.on("clearselect", a.onClearSelect, a)
    },
    expand: function(a) {
        var b = this
          , c = b.widget
          , d = c.get(a).id;
        void 0 === b._expandedIds[d] ? (b._expandedIds[d] = {},
        b.expandRow(Number(a), d),
        b.addMargin(Number(a) + 1, d)) : b.showRow(Number(a), d),
        delete b._expandedIds[d].hidden,
        b.reSetTop(),
        b.reSetPlusScroll();
        for (var e = c.el.select('.fancy-grid-column[grid="' + c.id + '"] .fancy-grid-cell[index="' + a + '"] .fancy-checkbox-expander'), f = 0, g = e.length; g > f; f++) {
            var h = Fancy.getWidget(e.item(f).attr("id"));
            h.get() === !1 && h.set(!0, !1)
        }
        b.changeSidesSize(),
        b.onSelect()
    },
    collapse: function(a) {
        var b = this
          , c = b.widget
          , d = c.scroller
          , e = c.get(a).id;
        b.collapseRow(Number(a), e),
        b.clearMargin(Number(a) + 1, e),
        b.reSetTop(),
        b.reSetPlusScroll(),
        b.changeSidesSize(),
        d.scrollDelta(1),
        d.scrollRightKnob()
    },
    collapseRow: function(a, b) {
        var c = this
          , d = c.widget
          , e = c._expandedIds[b];
        e.el.hide(),
        e.hidden = !0,
        d.leftColumns && e.leftEl.hide(),
        d.rightColumns && e.rightEl.hide();
        for (var f = d.el.select('.fancy-grid-column[grid="' + d.id + '"] .fancy-grid-cell[index="' + a + '"] .fancy-checkbox-expander'), g = 0, h = f.length; h > g; g++) {
            var i = Fancy.getWidget(f.item(g).attr("id"));
            i.get() === !0 && i.set(!1, !1)
        }
    },
    expandRow: function(a, b) {
        var c, d, e = this, f = e.widget, g = Fancy.get(document.createElement("div")), h = f.getById(b), i = e.prepareData(h), j = -f.scroller.scrollLeft || 0, k = f.getCenterFullWidth();
        e.tpl && (c = e.tpl.getHTML(i),
        g.update(c)),
        g.addClass("fancy-grid-expand-row"),
        g.css("left", j + "px"),
        g.css("width", k + "px"),
        g.attr("index", a);
        f.body.el.dom.appendChild(g.dom);
        if (e.render && e.render(g.dom, i, f.getCenterFullWidth()),
        d = parseInt(g.css("height")),
        e._expandedIds[b].rowIndex = a,
        e._expandedIds[b].el = g,
        e._expandedIds[b].height = d,
        e._expandedIds[b].width = k,
        f.leftColumns) {
            var l = Fancy.get(document.createElement("div"));
            l.css("left", "0px"),
            l.css("height", d),
            l.css("width", f.getLeftFullWidth()),
            l.attr("index", a),
            l.addClass("fancy-grid-expand-row"),
            f.leftBody.el.dom.appendChild(l.dom),
            e._expandedIds[b].leftEl = l
        }
        if (f.rightColumns) {
            var m = Fancy.get(document.createElement("div"));
            m.css("left", "0px"),
            m.css("height", d),
            m.css("width", f.getLeftFullWidth()),
            m.attr("index", a),
            m.addClass("fancy-grid-expand-row"),
            f.rightBody.el.dom.appendChild(m.dom),
            e._expandedIds[b].rightEl = m
        }
    },
    addMargin: function(a, b) {
        var c = this
          , d = c.widget
          , e = c._expandedIds[b].height
          , f = d.el.select('.fancy-grid-column[grid="' + d.id + '"] .fancy-grid-cell[index="' + a + '"]');
        f.css("margin-top", e)
    },
    clearMargin: function(a, b) {
        var c = this
          , d = c.widget;
        c._expandedIds[b].height;
        d.el.select('.fancy-grid-column[grid="' + d.id + '"] .fancy-grid-cell[index="' + a + '"]').css("margin-top", "0")
    },
    onScroll: function() {
        var a = this
          , b = a.widget
          , c = -b.scroller.scrollTop || 0
          , d = -b.scroller.scrollLeft || 0
          , e = b.cellHeight;
        for (var f in a._expandedIds) {
            var g = a._expandedIds[f]
              , h = a.getBeforeHeight(g.rowIndex)
              , i = c + (g.rowIndex + 1) * e + h;
            g.el.css("top", i),
            b.leftColumns && g.leftEl.css("top", i),
            b.rightColumns && g.rightEl.css("top", i),
            g.el.css("left", d)
        }
    },
    onSort: function() {
        var a = this;
        a.widget;
        for (var b in a._expandedIds) {
            var c = a._expandedIds[b];
            c.el.destroy(),
            a.clearMargin(Number(c.rowIndex) + 1, b)
        }
        a._expandedIds = {}
    },
    showRow: function(a, b) {
        var c = this
          , d = c.widget
          , e = c._expandedIds[b];
        e.el.show(),
        d.leftColumns && e.leftEl.show(),
        d.rightColumns && e.rightEl.show(),
        c.addMargin(a + 1, b)
    },
    getBeforeHeight: function(a) {
        var b = this
          , c = 0;
        for (var d in b._expandedIds) {
            var e = b._expandedIds[d];
            e.rowIndex < a && !e.hidden && (c += e.height)
        }
        return c
    },
    reSetTop: function() {
        var a = this
          , b = a.widget
          , c = b.cellHeight
          , d = -b.scroller.scrollTop || 0
          , e = -b.scroller.scrollLeft || 0;
        for (var f in a._expandedIds) {
            var g = a._expandedIds[f]
              , h = a.getBeforeHeight(g.rowIndex)
              , i = d + (g.rowIndex + 1) * c + h;
            g.el.css("top", i),
            g.el.css("left", e),
            b.leftColumns && g.leftEl.css("top", i),
            b.rightColumns && g.rightEl.css("top", i)
        }
    },
    reSetPlusScroll: function() {
        var a = this
          , b = a.widget;
        a.plusScroll = a.getPlusHeight(),
        b.scroller.setRightKnobSize()
    },
    getPlusHeight: function() {
        var a = this
          , b = (a.widget,
        0);
        for (var c in a._expandedIds) {
            var d = a._expandedIds[c];
            d.hidden || (b += d.height)
        }
        return a.plusHeight = b,
        a.plusHeight
    },
    onColumnReSize: function() {
        var a = this
          , b = a.widget;
        for (var c in a._expandedIds) {
            var d = a._expandedIds[c]
              , e = b.getCenterFullWidth();
            d.el.css("width", e)
        }
    },
    prepareData: function(a) {
        var b = this
          , c = b.widget
          , d = a.data;
        return b.dataFn && (d = b.dataFn(c, d)),
        d
    },
    changeSidesSize: function() {
        var a = this
          , b = a.widget;
        b.scroller;
        b.setSidesHeight(),
        b.scroller.checkRightScroll()
    },
    onRowDBlClick: function(a, b) {
        var c = this
          , d = c.widget
          , e = Number(b.rowIndex)
          , f = b.id
          , g = c._expandedIds[f];
        return d.edit ? void d.un("rowdblclick", c.onRowDBlClick, c) : void (void 0 === g ? c.expand(e) : g.hidden === !0 ? c.expand(e) : c.collapse(e))
    },
    onRowTrackOver: function(a, b) {
        var c = this
          , d = c.widget
          , e = c._expandedIds[b.id];
        e && (e.el.addClass(d.expandRowOverCls),
        d.leftColumns && e.leftEl.addClass(d.expandRowOverCls),
        d.rightColumns && e.rightEl.addClass(d.expandRowOverCls))
    },
    onRowTrackLeave: function(a, b) {
        var c = this
          , d = c.widget
          , e = c._expandedIds[b.id];
        e && (e.el.removeClass(d.expandRowOverCls),
        d.leftColumns && e.leftEl.removeClass(d.expandRowOverCls),
        d.rightColumns && e.rightEl.removeClass(d.expandRowOverCls))
    },
    onExpandRowMouseEnter: function(a) {
        var b = this
          , c = b.widget
          , d = c.scroller
          , e = Fancy.get(a.currentTarget)
          , f = e.attr("index");
        c.el.select('.fancy-grid-expand-row[index="' + f + '"]').addClass(c.expandRowOverCls),
        !c.trackOver || d.bottomKnobDown || d.rightKnobDown || c.el.select('.fancy-grid-column[grid="' + c.id + '"] .fancy-grid-cell[index="' + f + '"]').addClass(c.rowOverCls)
    },
    onExpandRowMouseLeave: function(a) {
        var b = this
          , c = b.widget
          , d = c.scroller
          , e = Fancy.get(a.currentTarget)
          , f = e.attr("index");
        c.el.select('.fancy-grid-expand-row[index="' + f + '"]').removeClass(c.expandRowOverCls),
        !c.trackOver || d.bottomKnobDown || d.rightKnobDown || c.el.select('.fancy-grid-column[grid="' + c.id + '"] .fancy-grid-cell[index="' + f + '"]').removeClass(c.rowOverCls)
    },
    onSelect: function() {
        var a = this
          , b = a.widget
          , c = b.selection;
        if (c.row || c.rows) {
            a.onClearSelect(),
            c = b.getSelection(!0);
            for (var d = c.rows, e = 0, f = d.length; f > e; e++) {
                var g = d[e];
                b.el.select('.fancy-grid-expand-row[index="' + g + '"]').addClass(b.expandRowSelectedCls)
            }
        }
    },
    onClearSelect: function() {
        var a = this
          , b = a.widget
          , c = b.selection;
        if (c.row || c.rows) {
            c = b.getSelection(!0);
            for (var d = {}, e = c.rows, f = 0, g = e.length; g > f; f++)
                d[e[f]] = !0;
            for (var h = b.el.select(".fancy-grid-expand-row-selected"), f = 0, g = h.length; g > f; f++) {
                var i = h.item(f).attr("index");
                d[i] || b.el.select('.fancy-grid-expand-row[index="' + i + '"]').removeClass(b.expandRowSelectedCls)
            }
        }
    }
}),
Fancy.define("Fancy.grid.plugin.GroupHeader", {
    extend: Fancy.Plugin,
    ptype: "grid.groupheader",
    inWidgetName: "groupheader",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.once("render", function() {})
    }
}),
Fancy.define("Fancy.grid.plugin.Grouping", {
    extend: Fancy.Plugin,
    ptype: "grid.grouping",
    inWidgetName: "grouping",
    tpl: "{text}:{number}",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a._expanded = {},
        a.groupRows = [],
        a.initTpl(),
        a.initGroups(),
        a.initOrder(),
        a.calcPlusScroll(),
        a.configParams(),
        a.ons()
    },
    initTpl: function() {
        var a = this;
        a.tpl && (a.tpl = new Fancy.Template(a.tpl))
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.once("render", function() {
            a.renderGroupedRows(),
            a.update(),
            b.el.on("click", a.onClick, a, "div." + b.clsGroupRow),
            b.el.on("mousedown", a.onMouseDown, a, "div." + b.clsGroupRow),
            b.on("scroll", a.onScroll, a),
            b.on("columnresize", a.onColumnResize, a)
        })
    },
    initGroups: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        if (!a.by)
            throw new Error("[FancyGrid Error] - not set by param in grouping");
        for (var d = c.getColumnOriginalValues(a.by), e = {}, f = 0, g = d.length; g > f; f++)
            void 0 === e[d[f]] && (e[d[f]] = 0),
            e[d[f]]++;
        var h = [];
        for (var i in e)
            h.push(i);
        a.groups = h,
        a.groupsCounts = e
    },
    initOrder: function() {
        var a, b, c = this, d = c.widget, e = d.store, f = [], g = {}, h = [];
        if (c.order && 0 !== c.order.length)
            switch (Fancy.typeOf(c.order)) {
            case "string":
                break;
            case "array":
                f = c.groups
            }
        else {
            for (f = c.groups,
            a = 0,
            b = f.length; b > a; a++) {
                var i = f[a].toLocaleUpperCase();
                g[i] = f[a],
                h.push(i)
            }
            for (h = h.sort(),
            a = 0; b > a; a++)
                f[a] = g[h[a]]
        }
        c.groups = f,
        e.changeOrderByGroups(f, c.by)
    },
    calcPlusScroll: function() {
        var a = this
          , b = a.widget;
        a.plusScroll = a.groups.length * b.groupRowHeight
    },
    configParams: function() {
        var a, b, c = this, d = c.widget, e = d.store;
        if (c.expanded = c.expanded || {},
        e.expanded = e.expanded || {},
        c.collapsed)
            e.collapsed = !0;
        else
            for (a = 0,
            b = c.groups.length; b > a; a++)
                void 0 === c.expanded[c.groups[a]] && (e.expanded[c.groups[a]] = !0,
                c.expanded[c.groups[a]] = !0,
                c._expanded[c.groups[a]] = !0)
    },
    renderGroupedRows: function() {
        var a, b, c = this, d = c.widget, e = d.columns, f = d.leftColumns, g = d.rightColumns, h = (d.store,
        d.body), i = d.leftBody, j = d.rightBody, k = 0, l = 0, m = 0, n = 0;
        for (a = e.length; a > k; k++)
            l += e[k].width;
        for (k = 0,
        a = f.length; a > k; k++)
            m += f[k].width;
        for (k = 0,
        a = g.length; a > k; k++)
            n += g[k].width;
        k = 0,
        a = c.groups.length;
        for (var o = 0; a > k; k++) {
            var p = c.groups[k]
              , q = c.groupsCounts[p];
            m ? (b = c.generateGroupRow(p, q, !0, o),
            b.css("width", m),
            i.el.dom.appendChild(b.dom),
            b = c.generateGroupRow(p, q, !1, o),
            b.css("width", l),
            h.el.dom.appendChild(b.dom)) : (b = c.generateGroupRow(p, q, !0, o),
            b.css("width", l),
            h.el.dom.appendChild(b.dom)),
            n && (b = c.generateGroupRow(p, q, !1, o),
            b.css("width", n),
            j.el.dom.appendChild(b.dom)),
            c.collapsed && (o += d.groupRowHeight),
            c.groupRows.push(b)
        }
    },
    generateGroupRow: function(a, b, c, d) {
        var e = this
          , f = e.widget
          , g = f.clsGroupRow
          , h = Fancy.get(document.createElement("div"));
        if (h.addClass(g),
        h.attr("group", a),
        c) {
            var i = e.tpl.getHTML({
                text: a,
                number: b
            });
            h.update('<div class="fancy-grid-group-row-inner"> ' + i + "</div>")
        }
        return e.collapsed ? (h.css("top", d + "px"),
        h.addClass(f.clsCollapsedRow)) : h.css("top", "0px"),
        h
    },
    onClick: function(a) {
        var b, c = this, d = c.widget, e = d.clsCollapsedRow, f = Fancy.get(a.currentTarget), g = f.attr("group");
        d.el.select("." + d.clsGroupRow + '[group="' + g + '"]').toggleClass(e),
        b = f.hasClass(e),
        b ? c.collapse(c.by, g) : c.expand(c.by, g),
        c.update()
    },
    fastCollapse: function() {},
    onMouseDown: function(a) {
        a.preventDefault()
    },
    onScroll: function() {
        var a = this;
        a.widget;
        a.setPositions()
    },
    collapse: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.store;
        e.collapse(a, b),
        delete c._expanded[b],
        delete c.expanded[b],
        d.fire("collapse", a, b)
    },
    expand: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.store;
        e.expand(a, b),
        c._expanded[b] = !0,
        c.expanded[b] = !0,
        d.fire("expand", a, b)
    },
    setPositions: function() {
        for (var a = this, b = a.widget, c = 0, d = a.groups.length, e = -b.scroller.scrollTop || 0, f = (b.clsGroupRow,
        b.leftBody.el.select("." + b.clsGroupRow)), g = b.body.el.select("." + b.clsGroupRow), h = b.rightBody.el.select("." + b.clsGroupRow); d > c; c++) {
            var i = a.groups[c];
            f.length && f.item(c).css("top", e + "px"),
            g.length && g.item(c).css("top", e + "px"),
            h.length && h.item(c).css("top", e + "px"),
            e += b.groupRowHeight,
            a._expanded[i] === !0 && (e += a.groupsCounts[i] * b.cellHeight)
        }
    },
    setCellsPosition: function() {
        var a, b, c = this, d = c.widget, e = 0, f = c.groups.length, g = 0, h = d.body, i = d.leftBody, j = d.rightBody, k = 0, l = d.groupRowHeight, m = [];
        for (c.clearMargins(); f > e; e++) {
            var n = c.groups[e];
            if (c._expanded[n] === !0) {
                for (m.push(k),
                g = 0,
                a = d.columns.length; a > g; g++)
                    b = h.getCell(k, g),
                    b.css("margin-top", l + "px");
                for (g = 0,
                a = d.leftColumns.length; a > g; g++)
                    b = i.getCell(k, g),
                    b.css("margin-top", l + "px");
                for (g = 0,
                a = d.rightColumns.length; a > g; g++)
                    b = j.getCell(k, g),
                    b.css("margin-top", l + "px");
                k += c.groupsCounts[n],
                l = d.groupRowHeight
            } else
                l += d.groupRowHeight
        }
        c.prevRows = m
    },
    clearMargins: function() {
        var a = this;
        if (void 0 !== a.prevRows)
            for (var b, c, d, e = a.widget, f = e.body, g = e.leftBody, h = e.rightBody, i = 0, j = 0, k = a.prevRows.length; k > i; i++) {
                for (c = a.prevRows[i],
                j = 0,
                b = e.columns.length; b > j && (d = f.getCell(c, j),
                void 0 !== d.css); j++)
                    d.css("margin-top", "0px");
                for (j = 0,
                b = e.leftColumns.length; b > j && (d = g.getCell(c, j),
                void 0 !== d.css); j++)
                    d.css("margin-top", "0px");
                for (j = 0,
                b = e.rightColumns.length; b > j && (d = h.getCell(c, j),
                void 0 !== d.css); j++)
                    d.css("margin-top", "0px")
            }
    },
    onColumnResize: function() {
        var a, b = this, c = b.widget, d = c.leftColumns, e = c.columns, f = c.rightColumns, g = c.body, h = c.leftBody, i = c.rightBody, j = 0, k = 0;
        for (a = e.length; a > j; j++)
            k += e[j].width;
        for (g.el.select(".fancy-grid-group-row").css("width", k + "px"),
        j = 0,
        k = 0,
        a = d.length; a > j; j++)
            k += d[j].width;
        for (a && h.el.select(".fancy-grid-group-row").css("width", k + "px"),
        j = 0,
        k = 0,
        a = f.length; a > j; j++)
            k += f[j].width;
        a && i.el.select(".fancy-grid-group-row").css("width", k + "px")
    },
    update: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        if (c.loading === !0 || c.autoLoad === !1)
            return void c.once("load", function() {
                a.initGroups(),
                a.initOrder(),
                a.calcPlusScroll(),
                a.configParams(),
                c.changeDataView(),
                a.renderGroupedRows(),
                a.setCellsPosition(),
                b.setSidesHeight(),
                a.update()
            }, a);
        a.setPositions(),
        b.update(),
        b.scroller.update(),
        a.setCellsPosition(),
        b.setSidesHeight(),
        c.changeDataView();
        new Date
    },
    getOffsetForRow: function(a) {
        for (var b = this, c = b.widget, d = 0, e = b.groups.length, f = 0, g = 0; e > d; d++) {
            var h = b.groups[d];
            if (f += c.groupRowHeight,
            b._expanded[h] === !0 && (g += b.groupsCounts[h]),
            g > a)
                break
        }
        return f
    },
    getSpecialRowsUnder: function(a) {
        for (var b = this, c = b.widget, d = 0, e = b.groups.length, f = 0, g = 0, h = 0; e > d; d++) {
            var i = b.groups[d];
            g > a && h++,
            f += c.groupRowHeight,
            b._expanded[i] === !0 && (g += b.groupsCounts[i])
        }
        return h
    }
}),
Fancy.define("Fancy.grid.plugin.CellTip", {
    extend: Fancy.Plugin,
    ptype: "grid.celltip",
    inWidgetName: "celltip",
    cellTip: "{value}",
    stopped: !0,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = (b.store,
        Fancy.get(document));
        b.on("cellenter", a.onCellEnter, a),
        b.on("cellleave", a.onCellLeave, a),
        c.on("touchend", a.onTouchEnd, a),
        c.on("mousemove", a.onDocMove, a)
    },
    onCellEnter: function(a, b) {
        var c = this
          , d = b.column
          , e = c.cellTip
          , f = b.e;
        if (d.cellTip) {
            if (Fancy.isString(d.cellTip))
                e = d.cellTip;
            else if (Fancy.isFunction(d.cellTip) && (e = d.cellTip(b),
            e === !1))
                return;
            var g = new Fancy.Template(e)
              , h = {
                title: d.title,
                value: b.value,
                columnIndex: 0,
                rowIndex: 0
            };
            c.stopped = !1,
            Fancy.apply(h, b.data),
            Fancy.tip.update(g.getHTML(h)),
            Fancy.tip.show(f.pageX + 15, f.pageY - 25)
        }
    },
    onCellLeave: function(a, b) {
        var c = this;
        c.stopped = !0,
        Fancy.tip.hide(1e3)
    },
    onTouchEnd: function(a, b) {
        var c = this;
        c.stopped = !0,
        Fancy.tip.hide(1e3)
    },
    onDocMove: function(a) {
        var b = this;
        b.stopped !== !0 && Fancy.tip.show(a.pageX + 15, a.pageY - 25)
    }
}),
Fancy.define("Fancy.grid.plugin.Filter", {
    extend: Fancy.Plugin,
    ptype: "grid.filter",
    inWidgetName: "filter",
    autoEnterDelay: 500,
    constructor: function(a) {
        var b = this;
        b.filters = {},
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.once("render", function() {
            a.render()
        }),
        b.on("columnresize", a.onColumnResize, a),
        b.on("filter", a.onFilter, a)
    },
    render: function() {
        for (var a, b, c = this, d = c.widget, e = d.header, f = d.leftHeader, g = d.rightHeader, h = d.columns, i = d.leftColumns, j = d.rightColumns, k = 0, l = h.length; l > k; k++)
            a = h[k],
            b = e.getCell(k),
            a.filter && a.filter.header ? (c.renderFilter(a.type, a, b),
            b.addClass(d.filterHeaderCellCls)) : c.header && b.addClass(d.cellHeaderDoubleSize);
        for (k = 0,
        l = i.length; l > k; k++)
            a = i[k],
            b = f.getCell(k),
            a.filter && a.filter.header ? (c.renderFilter(a.type, a, b),
            b.addClass(d.filterHeaderCellCls)) : c.header && b.addClass(d.cellHeaderDoubleSize);
        for (k = 0,
        l = j.length; l > k; k++)
            a = j[k],
            b = g.getCell(k),
            a.filter && a.filter.header ? (c.renderFilter(a.type, a, b),
            b.addClass(d.filterHeaderCellCls)) : c.header && b.addClass(d.cellHeaderDoubleSize)
    },
    renderFilter: function(a, b, c) {
        var d, e = this, f = e.widget, g = {
            position: "absolute",
            bottom: "3px"
        }, h = b.filter, i = f.theme, j = h.tip;
        switch (a) {
        case "date":
            var k = [];
            k.push({
                change: e.onDateChange,
                scope: e
            });
            var l;
            if (Fancy.isString(b.format))
                switch (b.format) {
                case "date":
                    l = b.format
                }
            d = new Fancy.DateRangeField({
                renderTo: c.dom,
                value: new Date,
                format: b.format,
                label: !1,
                padding: !1,
                style: g,
                events: k,
                width: b.width - 8,
                emptyText: h.emptyText,
                dateImage: !1,
                theme: i
            });
            break;
        case "string":
            var k = [{
                enter: e.onEnter,
                scope: e
            }];
            e.autoEnterDelay !== !1 && k.push({
                key: e.onKey,
                scope: e
            }),
            d = new Fancy.StringField({
                renderTo: c.dom,
                label: !1,
                padding: !1,
                style: g,
                events: k,
                emptyText: h.emptyText,
                tip: j
            });
            break;
        case "number":
        case "grossloss":
        case "progressbar":
        case "progressdonut":
            var k = [{
                enter: e.onEnter,
                scope: e
            }];
            e.autoEnterDelay !== !1 && k.push({
                key: e.onKey,
                scope: e
            }),
            d = new Fancy.NumberField({
                renderTo: c.dom,
                label: !1,
                padding: !1,
                style: g,
                emptyText: h.emptyText,
                events: k,
                tip: j
            });
            break;
        case "combo1":
            for (var m = [], n = 0, o = b.data.length; o > n; n++) {
                var p = b.data[n];
                m.push({
                    index: p,
                    valueText: p
                })
            }
            d = new Fancy.TagField({
                renderTo: c.dom,
                label: !1,
                style: g,
                displayKey: "valueText",
                valueKey: "index",
                value: "",
                itemCheckBox: !0,
                theme: i,
                events: [{
                    change: e.onEnter,
                    scope: e
                }],
                data: m
            }),
            d.size({
                width: b.width - 26,
                height: 26
            });
            break;
        case "combo":
            var m, q = "valueText", r = "valueText";
            void 0 !== b.displayKey && (q = b.displayKey,
            r = q),
            m = Fancy.isObject(b.data) || Fancy.isObject(b.data[0]) ? b.data : e.configComboData(b.data),
            d = new Fancy.Combo({
                renderTo: c.dom,
                label: !1,
                padding: !1,
                style: g,
                width: b.width - 8,
                displayKey: q,
                valueKey: r,
                value: "",
                itemCheckBox: !0,
                height: 28,
                emptyText: h.emptyText,
                theme: i,
                tip: j,
                events: [{
                    change: e.onEnter,
                    scope: e
                }],
                data: m
            });
            break;
        case "checkbox":
            d = new Fancy.Combo({
                renderTo: c.dom,
                label: !1,
                padding: !1,
                style: g,
                displayKey: "valueText",
                valueKey: "index",
                width: b.width - 8,
                emptyText: h.emptyText,
                value: "",
                editable: !1,
                events: [{
                    change: e.onEnter,
                    scope: e
                }],
                data: [{
                    index: "",
                    valueText: ""
                }, {
                    index: "false",
                    valueText: f.lang.no
                }, {
                    index: "true",
                    valueText: f.lang.yes
                }]
            });
            break;
        default:
            var k = [{
                enter: e.onEnter,
                scope: e
            }];
            e.autoEnterDelay !== !1 && k.push({
                key: e.onKey,
                scope: e
            }),
            d = new Fancy.StringField({
                renderTo: c.dom,
                label: !1,
                style: g,
                padding: !1,
                emptyText: h.emptyText,
                events: k
            })
        }
        switch (d.filterIndex = b.index,
        d.column = b,
        "date" !== a && (d.el.css("padding-left", "4px"),
        d.el.css("padding-top", "0px")),
        a) {
        case "checkbox":
        case "combo":
        case "date":
            break;
        default:
            d.setInputSize({
                width: b.width - 8
            })
        }
    },
    onEnter: function(a, b, c) {
        var d = this
          , e = a.filterIndex;
        if (c = c || {},
        d.intervalAutoEnter && (clearInterval(d.intervalAutoEnter),
        d.intervalAutoEnter = !1),
        delete d.intervalAutoEnter,
        0 === b.length)
            return d.filters[a.filterIndex] = {},
            void d.updateStoreFilters();
        var f = d.processFilterValue(b, a.column.type)
          , g = 0
          , h = f.length;
        for (d.filters[e] = {}; h > g; g++) {
            var i = f[g];
            d.filters[e][i.operator] = i.value,
            Fancy.apply(d.filters[e], c)
        }
        d.updateStoreFilters()
    },
    processFilterValue: function(a, b) {
        for (var c, d, e = {
            "<": !0,
            ">": !0,
            "!": !0,
            "=": !0
        }, f = 0, g = 3, h = [], i = a.split(","), j = 0, k = i.length; k > j; j++) {
            for (f = 0,
            c = "",
            d = i[j]; g > f; f++)
                e[d[f]] && (c += d[f]);
            d = d.replace(new RegExp("^" + c), ""),
            d.length < 1 || ("number" === b && (d = Number(d)),
            h.push({
                operator: c,
                value: d
            }))
        }
        return h
    },
    updateStoreFilters: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.filters = a.filters,
        c.changeDataView(),
        b.update(),
        b.fire("filter", a.filters)
    },
    onColumnResize: function(a, b) {
        var c, d = this, e = (d.widget,
        Fancy.get(b.cell)), f = b.width, g = e.select(".fancy-field");
        0 === g.length || (2 === g.length ? (c = Fancy.getWidget(g.item(0).dom.id),
        c.setWidth((f - 8) / 2),
        c = Fancy.getWidget(g.item(1).dom.id),
        c.setWidth((f - 8) / 2)) : (c = Fancy.getWidget(g.dom.id),
        "field.combo" === c.wtype ? (c.size({
            width: f - 8
        }),
        c.el.css("width", f - 8 + 5)) : c.setInputSize({
            width: f - 8
        })))
    },
    onKey: function(a, b, c) {
        var d = this;
        d.autoEnterTime || +new Date;
        c.keyCode !== Fancy.key.ENTER && (d.autoEnterTime = +new Date,
        d.intervalAutoEnter || (d.intervalAutoEnter = setInterval(function() {
            var c = new Date;
            d.intervalAutoEnter && c - d.autoEnterTime > d.autoEnterDelay && (clearInterval(d.intervalAutoEnter),
            delete d.intervalAutoEnter,
            b = a.getValue(),
            d.onEnter(a, b))
        }, 200)))
    },
    onDateChange: function(a, b) {
        var c, d, e, f = this, g = f.widget, h = a.format, i = g.store, j = a.dateField1.getDate(), k = a.dateField2.getDate(), l = "Invalid Date" !== j.toString() && Fancy.isDate(j), m = "Invalid Date" !== k.toString() && Fancy.isDate(k), n = i.remoteFilter;
        l && (j = new Date(j.getFullYear(),j.getMonth(),j.getDate())),
        m && (k = new Date(k.getFullYear(),k.getMonth(),k.getDate())),
        l && m ? (n !== !0 ? (d = Number(j),
        e = Number(k)) : (d = Fancy.Date.format(j, h.edit),
        e = Fancy.Date.format(k, h.edit)),
        c = ">=" + d + ",<=" + e) : l ? (c = n !== !0 ? ">=" + Number(j) : ">=" + Fancy.Date.format(j, h.edit),
        f.clearFilter(a.filterIndex, "<=", !1)) : m ? (c = n !== !0 ? "<=" + Number(k) : "<=" + Fancy.Date.format(j, h.edit),
        f.clearFilter(a.filterIndex, ">=", !1)) : f.clearFilter(a.filterIndex),
        c && f.onEnter(a, c, {
            type: "date",
            format: a.format
        })
    },
    clearFilter: function(a, b, c) {
        var d = this;
        void 0 === b ? delete d.filters[a] : d.filters[a] && delete d.filters[a][b],
        c !== !1 && d.updateStoreFilters()
    },
    onFilter: function() {
        var a = this
          , b = a.widget;
        b.scroll(0, 0)
    },
    configComboData: function(a) {
        var b = 0
          , c = a.length
          , d = [];
        if (Fancy.isObject(a))
            return a;
        for (; c > b; b++)
            d.push({
                index: b,
                valueText: a[b]
            });
        return d
    }
}),
Fancy.define("Fancy.grid.plugin.Search", {
    extend: Fancy.Plugin,
    ptype: "grid.search",
    inWidgetName: "searching",
    autoEnterDelay: 500,
    constructor: function(a) {
        var b = this;
        b.searches = {},
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store;
        b.once("init", function() {
            a.generateKeys()
        })
    },
    search: function(a, b) {
        var c = this;
        return c.searches = {},
        a || b ? (Fancy.isArray(a) !== !1 || b || (c.searches = a),
        c.setFilters(),
        void c.updateStoreSearches()) : (c.clear(),
        void c.updateStoreSearches())
    },
    updateStoreSearches: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        c.changeDataView(),
        b.update()
    },
    setKeys: function(a) {
        var b = this;
        b.keys = a,
        b.setFilters(),
        b.updateStoreSearches()
    },
    generateKeys: function() {
        var a = this
          , b = a.widget;
        b.store;
        if (!a.keys) {
            a.keys = {};
            var c = [];
            b.columns && (c = c.concat(b.columns)),
            b.leftColumns && (c = c.concat(b.leftColumns)),
            b.rightColumns && (c = c.concat(b.rightColumns));
            for (var d = [], e = 0, f = c.length; f > e; e++) {
                var g = c[e]
                  , h = g.index || g.key;
                if (g.searchable !== !1) {
                    switch (g.type) {
                    case "color":
                    case "combo":
                    case "date":
                    case "number":
                    case "string":
                    case "text":
                    case "currency":
                        break;
                    default:
                        continue
                    }
                    h && d.push(h)
                }
            }
            for (e = 0,
            f = d.length; f > e; e++)
                "$selected" !== d[e] && (a.keys[d[e]] = !0)
        }
        return a.keys
    },
    setFilters: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = c.filters || {};
        if (void 0 === a.searches || Fancy.isObject(a.searches))
            return void a.clear();
        for (var e in a.keys)
            a.keys[e] !== !1 ? (d[e] = d[e] || {},
            d[e]["*"] = a.searches) : d[e] && delete d[e]["*"];
        a.filters = d,
        c.filters = d
    },
    clear: function() {
        var a = this
          , b = a.widget
          , c = b.store
          , d = c.filters || {};
        for (var e in a.keys)
            void 0 !== d[e] && delete d[e]["*"];
        a.filters = d,
        c.filters = d,
        delete a.searches
    }
}),
Fancy.define("Fancy.grid.plugin.GridToGrid", {
    extend: Fancy.Plugin,
    ptype: "grid.dragdrop",
    inWidgetName: "dragdrop",
    dropOK: !1,
    cellMaskCls: "fancy-drop-cell-mask",
    dropZoneCls: "fancy-drop-zone-active",
    dropOkCls: "fancy-drop-ok",
    dropNotOkCls: "fancy-drop-not-ok",
    dropHeaderMaskCls: "fancy-drop-header-mask",
    droppable: !0,
    dropZoneOverClass: "fancy-grid-body",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.widget;
        a.addEvents("drop"),
        a.Super("init", arguments),
        a.initDropCls(),
        a.initEnterLeave(),
        a.ons()
    },
    initDropCls: function() {
        var a = this
          , b = "." + a.dropGroup;
        b += " ." + a.dropZoneOverClass,
        a.dropCls = b
    },
    addDragDropCls: function() {
        var a = this
          , b = a.widget;
        b.el.addClass(a.dragGroup)
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.store,
        Fancy.get(document);
        b.on("render", function() {
            a.addDragDropCls()
        }),
        a.dropGroup && (b.on("beforecellmousedown", a.onBeforeCellMouseDown, a),
        b.on("cellmousedown", a.onCellMouseDown, a),
        b.on("cellleave", a.onCellLeave, a),
        b.on("cellenter", a.onCellEnter, a)),
        a.on("drop", a.onDropItems, a)
    },
    onDropItems: function(a, b) {
        var c = this
          , d = c.widget
          , e = c.dropGrid
          , f = void 0 === e.activeRowEnterIndex ? e.getViewTotal() : e.activeRowEnterIndex;
        d.fire("dropitems", b, f),
        c.onDrop && c.onDrop.apply(d, [b, f])
    },
    onBeforeCellMouseDown: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.lang
          , f = Fancy.get(document)
          , g = d.getSelection()
          , h = b.e
          , i = h.ctrlKey;
        if ((!i || d.multiSelect !== !0) && g.length > 1) {
            for (var j = 0, k = g.length, l = !1; k > j; j++)
                if (g[j].id === b.id) {
                    l = !0;
                    break
                }
            if (l === !1)
                return;
            d.stopSelection(),
            f.once("mouseup", c.onDocMouseUp, c),
            f.on("mousemove", c.onDocMouseMove, c),
            f.once("mouseup", function() {
                d.enableSelection()
            }, c),
            g = d.getSelection();
            var m = Fancy.String.format(e.dragText, [g.length, g.length > 1 ? "s" : ""]);
            c.initTip(m),
            c.dragItems = d.getSelection(),
            c.cellMouseDown = !0
        }
    },
    onCellMouseDown: function(a, b) {
        var c = this
          , d = c.widget
          , e = Fancy.get(document);
        d.getSelection();
        if (d.selection.enabled !== !1) {
            var f = b.e
              , g = f.ctrlKey;
            g && d.multiSelect === !0 || ("$selected" === b.column.index || d.clearSelection(),
            e.once("mouseup", c.onDocMouseUp, c),
            e.on("mousemove", c.onDocMouseMove, c),
            c.cellMouseDown = !0,
            c.activeRowIndex = b.rowIndex)
        }
    },
    initEnterLeave: function() {
        var a = this
          , b = Fancy.select(a.dropCls);
        return 0 === b.length ? void setTimeout(function() {
            a.initEnterLeave()
        }, 500) : (b.on("mouseenter", a.onMouseEnterDropGroup, a),
        void b.on("mouseleave", a.onMouseLeaveDropGroup, a))
    },
    onMouseEnterDropGroup: function(a) {
        var b = this;
        if (b.cellMouseDown) {
            var c = Fancy.get(a.currentTarget);
            if (b.dropGrid = Fancy.getWidget(c.closest(".fancy-grid").attr("id")),
            b.dropGrid && b.dropGrid.dragdrop && b.dropGrid.dragdrop.droppable === !1)
                return b.dropOK = !1,
                void (b.tip && b.tip.el.replaceClass(b.dropOkCls, b.dropNotOkCls));
            b.setDropGridCellsMask(),
            b.dropGridEventInited || b.onsDropGrid(),
            c.addClass(b.dropZoneCls),
            b.dropOK = !0,
            b.tip && b.tip.el.replaceClass(b.dropNotOkCls, b.dropOkCls)
        }
    },
    onMouseLeaveDropGroup: function(a) {
        var b = this;
        b.cellMouseDown && (Fancy.get(a.currentTarget).removeClass(b.dropZoneCls),
        b.dropOK = !1,
        b.tip.el.replaceClass(b.dropOkCls, b.dropNotOkCls),
        b.clearCellsMask())
    },
    setDropGridCellsMask: function() {
        var a, b = this, c = b.dropGrid;
        c && b.cellMouseDown && (a = c.getTotal(),
        0 === a ? c.el.addClass(b.dropHeaderMaskCls) : c.el.select('.fancy-grid-cell[index="' + (a - 1) + '"]').addClass(b.cellMaskCls))
    },
    onsDropGrid: function() {
        var a = this;
        a.dropGrid.on("rowenter", a.onDropGridRowEnter, a),
        a.dropGrid.on("rowleave", a.onDropGridRowLeave, a),
        a.dropGridEventInited = !0
    },
    onDropGridRowEnter: function(a, b) {
        var c = this;
        c.cellMouseDown === !1 && (c.dropGrid.un("rowenter", c.onDropGridRowEnter),
        c.dropGrid.un("rowleave", c.onDropGridRowLeave)),
        c.clearCellsMask(),
        0 === b.rowIndex ? a.el.addClass(c.dropHeaderMaskCls) : a.el.select('.fancy-grid-cell[index="' + (b.rowIndex - 1) + '"]').addClass(c.cellMaskCls),
        c.cellMouseDown === !1 && c.clearCellsMask(),
        c.dropGrid && (c.dropGrid.activeRowEnterIndex = b.rowIndex)
    },
    onDropGridRowLeave: function(a, b) {
        var c = this;
        c.clearCellsMask(),
        c.setDropGridCellsMask(),
        c.dropGrid && delete c.dropGrid.activeRowEnterIndex
    },
    clearCellsMask: function() {
        var a = this
          , b = a.cellMaskCls;
        a.dropGrid && (a.dropGrid.el.removeClass(a.dropHeaderMaskCls),
        a.dropGrid.el.select("." + b).removeClass(b))
    },
    onDocMouseUp: function(a) {
        var b = this
          , c = b.widget
          , d = Fancy.get(document);
        b.cellMouseDown = !1,
        b.tip && b.tip.hide(),
        c.enableSelection(),
        d.un("mousemove", b.onDocMouseMove),
        b.dropOK === !0 && (c.clearSelection(),
        b.dropGrid.clearSelection(),
        b.fire("drop", b.dragItems)),
        delete b.dragItems,
        b.dropOK = !1,
        Fancy.select("." + b.dropZoneCls).removeClass(b.dropZoneCls),
        b.clearCellsMask(),
        b.dropGrid && (b.dropGrid.un("rowenter", b.onDropGridRowEnter),
        b.dropGrid.un("rowleave", b.onDropGridRowLeave)),
        delete b.dropGridEventInited
    },
    onDocMouseMove: function(a) {
        var b = this;
        b.widget;
        b.dragItems && b.tip.show(a.pageX + 20, a.pageY + 20)
    },
    onCellLeave: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.lang;
        setTimeout(function() {
            if (c.onceStopDrag)
                return void (c.onceStopDrag = !1);
            if (c.cellMouseDown === !0 && !c.dragItems) {
                var a = d.getSelection()
                  , f = Fancy.String.format(e.dragText, [a.length, a.length > 1 ? "s" : ""]);
                d.stopSelection(),
                c.initTip(f, b.e),
                c.tip.show(),
                c.tip.el.css("display", "block"),
                c.dragItems = a
            }
        }, 1)
    },
    onCellEnter: function(a, b) {
        var c = this;
        c.cellMouseDown !== !0 || c.dragItems || b.rowIndex !== c.activeRowIndex && (c.onceStopDrag = !0,
        c.activeRowIndex = b.rowIndex)
    },
    initTip: function(a, b) {
        var c = this
          , d = c.dropNotOkCls;
        c.tip || (c.tip = new Fancy.ToolTip({
            cls: d,
            text: a
        })),
        b && c.tip.show(b.pageX + 20, b.pageY + 20),
        c.tip.update(a),
        c.tip.el.replaceClass(c.dropOkCls, d)
    }
}),
Fancy.define("Fancy.grid.plugin.Licence", {
    extend: Fancy.Plugin,
    ptype: "grid.licence",
    inWidgetName: "licence",
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.ons()
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.once("render", function() {
            a.render()
        })
    },
    render: function() {
        var a = this
          , b = a.widget
          , c = b.body
          , d = Fancy.get(document.createElement("div"));
        location.host.replace(/^www\./, "");
        (!/fancygrid/.test(location.host) || b.watermark) && (a.checkLicence() !== !0 || b.watermark) && (d.css({
            position: "absolute",
            "z-index": 2,
            width: "30px",
            height: "30px"
        }),
        b.nativeScroller ? d.css({
            top: "2px",
            left: "2px"
        }) : d.css({
            right: "4px",
            bottom: "0px"
        }),
        d.update('<a href="http://www.fancygrid.com" title="JavaScript Grid - FancyGrid" style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAPklEQVR42mNgGLGAo+/4f1IwTN+i8y/+k4JHLR61eNTiUYuHgcUjD5AbZORG0ajFoxaPWjxq8RC2eBQMWwAAuxzh7E9tdUsAAAAASUVORK5CYII=);color: #60B3E2;font-size: 25px;line-height: 30px;text-decoration: none;">&nbsp;&nbsp;&nbsp;&nbsp;</a>'),
        Fancy.get(c.el.append(d.dom)),
        a.licenceEl = d,
        b.watermark && a.configWatermark())
    },
    configWatermark: function() {
        var a = this
          , b = a.widget
          , c = b.watermark;
        if (c.text) {
            var d = a.licenceEl.firstChild();
            d.css("background-image", "none"),
            d.css("font-size", "11px"),
            d.update(c.text),
            a.licenceEl.css("width", "initial")
        }
        c.style && a.licenceEl.css(c.style)
    },
    checkLicence: function() {
        var a = this
          , b = "FancyGrid";
        if (!Fancy.LICENSE && !FancyGrid.LICENSE)
            return !1;
        var c, d, e, f = String(a.md5(location.host.replace(/^www\./, ""), b)), g = Fancy.LICENSE || FancyGrid.LICENSE || [], h = a.md5("UNIVERSAL", b), i = a.md5("SAAS", b), j = a.md5("INTERNAL", b), k = a.md5("OEM", b), l = a.md5("ENTERPRISE", b);
        for (c = 0,
        d = g.length; d > c; c++)
            switch (e = String(g[c])) {
            case f:
            case h:
            case i:
            case j:
            case k:
            case l:
                return !0
            }
        return !1
    },
    md5: function(a, b, c) {
        var d = function(a, b) {
            var c = (65535 & a) + (65535 & b)
              , d = (a >> 16) + (b >> 16) + (c >> 16);
            return d << 16 | 65535 & c
        }
          , e = function(a, b) {
            return a << b | a >>> 32 - b
        }
          , f = function(a, b, c, f, g, h) {
            return d(e(d(d(b, a), d(f, h)), g), c)
        }
          , g = function(a, b, c, d, e, g, h) {
            return f(b & c | ~b & d, a, b, e, g, h)
        }
          , h = function(a, b, c, d, e, g, h) {
            return f(b & d | c & ~d, a, b, e, g, h)
        }
          , i = function(a, b, c, d, e, g, h) {
            return f(b ^ c ^ d, a, b, e, g, h)
        }
          , j = function(a, b, c, d, e, g, h) {
            return f(c ^ (b | ~d), a, b, e, g, h)
        }
          , k = function(a, b) {
            a[b >> 5] |= 128 << b % 32,
            a[(b + 64 >>> 9 << 4) + 14] = b;
            var c, e, f, k, l, m = 1732584193, n = -271733879, o = -1732584194, p = 271733878;
            for (c = 0; c < a.length; c += 16)
                e = m,
                f = n,
                k = o,
                l = p,
                m = g(m, n, o, p, a[c], 7, -680876936),
                p = g(p, m, n, o, a[c + 1], 12, -389564586),
                o = g(o, p, m, n, a[c + 2], 17, 606105819),
                n = g(n, o, p, m, a[c + 3], 22, -1044525330),
                m = g(m, n, o, p, a[c + 4], 7, -176418897),
                p = g(p, m, n, o, a[c + 5], 12, 1200080426),
                o = g(o, p, m, n, a[c + 6], 17, -1473231341),
                n = g(n, o, p, m, a[c + 7], 22, -45705983),
                m = g(m, n, o, p, a[c + 8], 7, 1770035416),
                p = g(p, m, n, o, a[c + 9], 12, -1958414417),
                o = g(o, p, m, n, a[c + 10], 17, -42063),
                n = g(n, o, p, m, a[c + 11], 22, -1990404162),
                m = g(m, n, o, p, a[c + 12], 7, 1804603682),
                p = g(p, m, n, o, a[c + 13], 12, -40341101),
                o = g(o, p, m, n, a[c + 14], 17, -1502002290),
                n = g(n, o, p, m, a[c + 15], 22, 1236535329),
                m = h(m, n, o, p, a[c + 1], 5, -165796510),
                p = h(p, m, n, o, a[c + 6], 9, -1069501632),
                o = h(o, p, m, n, a[c + 11], 14, 643717713),
                n = h(n, o, p, m, a[c], 20, -373897302),
                m = h(m, n, o, p, a[c + 5], 5, -701558691),
                p = h(p, m, n, o, a[c + 10], 9, 38016083),
                o = h(o, p, m, n, a[c + 15], 14, -660478335),
                n = h(n, o, p, m, a[c + 4], 20, -405537848),
                m = h(m, n, o, p, a[c + 9], 5, 568446438),
                p = h(p, m, n, o, a[c + 14], 9, -1019803690),
                o = h(o, p, m, n, a[c + 3], 14, -187363961),
                n = h(n, o, p, m, a[c + 8], 20, 1163531501),
                m = h(m, n, o, p, a[c + 13], 5, -1444681467),
                p = h(p, m, n, o, a[c + 2], 9, -51403784),
                o = h(o, p, m, n, a[c + 7], 14, 1735328473),
                n = h(n, o, p, m, a[c + 12], 20, -1926607734),
                m = i(m, n, o, p, a[c + 5], 4, -378558),
                p = i(p, m, n, o, a[c + 8], 11, -2022574463),
                o = i(o, p, m, n, a[c + 11], 16, 1839030562),
                n = i(n, o, p, m, a[c + 14], 23, -35309556),
                m = i(m, n, o, p, a[c + 1], 4, -1530992060),
                p = i(p, m, n, o, a[c + 4], 11, 1272893353),
                o = i(o, p, m, n, a[c + 7], 16, -155497632),
                n = i(n, o, p, m, a[c + 10], 23, -1094730640),
                m = i(m, n, o, p, a[c + 13], 4, 681279174),
                p = i(p, m, n, o, a[c], 11, -358537222),
                o = i(o, p, m, n, a[c + 3], 16, -722521979),
                n = i(n, o, p, m, a[c + 6], 23, 76029189),
                m = i(m, n, o, p, a[c + 9], 4, -640364487),
                p = i(p, m, n, o, a[c + 12], 11, -421815835),
                o = i(o, p, m, n, a[c + 15], 16, 530742520),
                n = i(n, o, p, m, a[c + 2], 23, -995338651),
                m = j(m, n, o, p, a[c], 6, -198630844),
                p = j(p, m, n, o, a[c + 7], 10, 1126891415),
                o = j(o, p, m, n, a[c + 14], 15, -1416354905),
                n = j(n, o, p, m, a[c + 5], 21, -57434055),
                m = j(m, n, o, p, a[c + 12], 6, 1700485571),
                p = j(p, m, n, o, a[c + 3], 10, -1894986606),
                o = j(o, p, m, n, a[c + 10], 15, -1051523),
                n = j(n, o, p, m, a[c + 1], 21, -2054922799),
                m = j(m, n, o, p, a[c + 8], 6, 1873313359),
                p = j(p, m, n, o, a[c + 15], 10, -30611744),
                o = j(o, p, m, n, a[c + 6], 15, -1560198380),
                n = j(n, o, p, m, a[c + 13], 21, 1309151649),
                m = j(m, n, o, p, a[c + 4], 6, -145523070),
                p = j(p, m, n, o, a[c + 11], 10, -1120210379),
                o = j(o, p, m, n, a[c + 2], 15, 718787259),
                n = j(n, o, p, m, a[c + 9], 21, -343485551),
                m = d(m, e),
                n = d(n, f),
                o = d(o, k),
                p = d(p, l);
            return [m, n, o, p]
        }
          , l = function(a) {
            var b, c = "";
            for (b = 0; b < 32 * a.length; b += 8)
                c += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
            return c
        }
          , m = function(a) {
            var b, c = [];
            for (c[(a.length >> 2) - 1] = void 0,
            b = 0; b < c.length; b += 1)
                c[b] = 0;
            for (b = 0; b < 8 * a.length; b += 8)
                c[b >> 5] |= (255 & a.charCodeAt(b / 8)) << b % 32;
            return c
        }
          , n = function(a) {
            return l(k(m(a), 8 * a.length))
        }
          , o = function(a, b) {
            var c, d, e = m(a), f = [], g = [];
            for (f[15] = g[15] = void 0,
            e.length > 16 && (e = k(e, 8 * a.length)),
            c = 0; 16 > c; c += 1)
                f[c] = 909522486 ^ e[c],
                g[c] = 1549556828 ^ e[c];
            return d = k(f.concat(m(b)), 512 + 8 * b.length),
            l(k(g.concat(d), 640))
        }
          , p = function(a) {
            var b, c, d = "0123456789abcdef", e = "";
            for (c = 0; c < a.length; c += 1)
                b = a.charCodeAt(c),
                e += d.charAt(b >>> 4 & 15) + d.charAt(15 & b);
            return e
        }
          , q = function(a) {
            return unescape(encodeURIComponent(a))
        }
          , r = function(a) {
            return n(q(a))
        }
          , s = function(a) {
            return p(r(a))
        }
          , t = function(a, b) {
            return o(q(a), q(b))
        }
          , u = function(a, b) {
            return p(t(a, b))
        }
          , v = function(a, b, c) {
            return b ? c ? t(b, a) : u(b, a) : c ? r(a) : s(a)
        };
        return v(a, b, c)
    }
}),
Fancy.ns("Fancy.grid.body.mixin"),
Fancy.grid.body.mixin.Updater = function() {}
,
Fancy.grid.body.mixin.Updater.prototype = {
    update: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        a.checkDomColumns(),
        c.loading || (a.checkDomCells(),
        a.updateRows(),
        a.showEmptyText())
    },
    checkDomColumns: function() {
        var a = this
          , b = a.widget
          , c = a.el.select(".fancy-grid-column").length
          , d = a.getColumns()
          , e = 0
          , f = d.length;
        if (!(c >= f)) {
            for (; f > e; e++) {
                var g = d[e]
                  , h = g.width
                  , i = Fancy.get(document.createElement("div"));
                if (i.addClass("fancy-grid-column"),
                i.attr("grid", b.id),
                "$selected" === g.index)
                    i.addClass("fancy-grid-cell-select");
                else
                    switch (g.type) {
                    case "order":
                        i.addClass("fancy-grid-cell-order")
                    }
                if (g.cls && i.addClass(g.cls),
                "text" === g.type && i.addClass("fancy-grid-column-text"),
                i.css({
                    width: h + "px"
                }),
                i.attr("index", e),
                g.cellAlign && i.css("text-align", g.cellAlign),
                g.ellipsis === !0)
                    switch (g.type) {
                    case "string":
                    case "text":
                    case "number":
                        i.addClass("fancy-grid-column-ellipsis")
                    }
                a.el.dom.appendChild(i.dom)
            }
            a.fire("adddomcolumns")
        }
    },
    checkDomCells: function(a) {
        var b, c, d, e = this, f = e.widget, g = f.store, h = 0, i = g.dataView.length, j = 0;
        switch (e.side) {
        case "left":
            c = f.leftColumns;
            break;
        case "center":
            c = f.columns;
            break;
        case "right":
            c = f.rightColumns
        }
        b = c.length;
        var k = e.el.select(".fancy-grid-column")
          , l = g.getLength()
          , m = e.cellTpl;
        for (f.cellWrapper && (m = e.cellWrapperTpl),
        void 0 !== a && (j = a,
        b = a); b > j; j++) {
            d = c[j];
            var n = k.item(j);
            h = 0;
            var o = l - n.select(".fancy-grid-cell").length;
            for (h = i - o; i > h; h++) {
                var p = m.getHTML({})
                  , q = Fancy.get(document.createElement("div"));
                q.css({
                    height: f.cellHeight + "px"
                }),
                q.addClass(e.cellCls),
                q.attr("index", h),
                h % 2 !== 0 && f.striped && q.addClass(f.cellEvenCls),
                q.update(p),
                n.dom.appendChild(q.dom)
            }
            if (f.nativeScroller && ("left" === e.side || "right" === e.side)) {
                n.select("." + e.pseudoCellCls).destroy();
                var p = m.getHTML({
                    cellValue: "&nbsp;"
                })
                  , q = Fancy.get(document.createElement("div"));
                q.css({
                    height: f.cellHeight + "px"
                }),
                q.addClass(e.pseudoCellCls),
                q.update(p),
                n.dom.appendChild(q.dom)
            }
        }
    },
    updateRows: function(a, b) {
        var c, d, e = this, f = e.widget, g = (f.store,
        0);
        switch (void 0 === a ? e.clearDirty() : e.clearDirty(a),
        e.side) {
        case "left":
            c = f.leftColumns;
            break;
        case "center":
            c = f.columns;
            break;
        case "right":
            c = f.rightColumns
        }
        for (d = c.length,
        void 0 !== b && (g = b,
        d = b + 1); d > g; g++) {
            var h = c[g];
            switch (h.type) {
            case "string":
            case "number":
            case "combo":
            case "action":
            case "text":
            case "date":
            case "currency":
                e.renderUniversal(g, a);
                break;
            case "order":
                e.renderOrder(g, a);
                break;
            case "expand":
                e.renderExpand(g, a);
                break;
            case "select":
                e.renderSelect(g, a);
                break;
            case "color":
                e.renderColor(g, a);
                break;
            case "checkbox":
                e.renderCheckbox(g, a);
                break;
            case "image":
                e.renderImage(g, a);
                break;
            case "sparklineline":
                e.renderSparkLine(g, a, "line");
                break;
            case "sparklinebar":
                e.renderSparkLine(g, a, "bar");
                break;
            case "sparklinetristate":
                e.renderSparkLine(g, a, "tristate");
                break;
            case "sparklinediscrete":
                e.renderSparkLine(g, a, "discrete");
                break;
            case "sparklinebullet":
                e.renderSparkLine(g, a, "bullet");
                break;
            case "sparklinepie":
                e.renderSparkLine(g, a, "pie");
                break;
            case "sparklinebox":
                e.renderSparkLine(g, a, "box");
                break;
            case "circle":
                e.renderCircle(g, a);
                break;
            case "progressdonut":
                e.renderProgressDonut(g, a);
                break;
            case "progressbar":
                e.renderProgressBar(g, a);
                break;
            case "hbar":
                e.renderHBar(g, a);
                break;
            case "grossloss":
                e.renderGrossLoss(g, a);
                break;
            default:
                throw new Error("[FancyGrid error] - not existed column type " + h.type)
            }
        }
        e.removeNotUsedCells()
    },
    renderUniversal: function(a, b) {
        var c, d, e, f = this, g = f.widget, h = g.lang, i = g.emptyValue, j = g.store, k = f.getColumns(), l = k[a], m = f.el.select(".fancy-grid-column"), n = m.item(a), o = n.select("." + g.cellCls), p = n.select("." + g.cellCls + " ." + g.cellInnerCls), q = h.currencySign;
        for (c = void 0 !== l.key ? l.key : void 0 !== l.index ? l.index : "action" === l.type ? "none" : void 0,
        void 0 !== b ? (d = b,
        e = b + 1) : (d = 0,
        e = j.getLength()); e > d; d++) {
            var r, s = j.get(d), t = j.getId(d), u = {
                rowIndex: d,
                data: s,
                style: {},
                column: l,
                id: t,
                item: j.getItem(d)
            }, v = !1;
            switch (j.changed[u.id] && j.changed[u.id][l.index] && (v = !0),
            r = l.smartIndexFn ? l.smartIndexFn(s) : j.get(d, c),
            u.value = r,
            l.format && (u.value = f.format(u.value, l.format),
            r = u.value),
            l.type) {
            case "currency":
                "" !== r && (r = q + r),
                u.value = r
            }
            switch (l.render && (u = l.render(u),
            r = u.value),
            r) {
            case "":
            case void 0:
                r = i
            }
            var w = o.item(d);
            g.cellStylingCls && f.clearCls(w),
            u.cls && w.addClass(u.cls),
            v && g.dirtyEnabled && f.enableCellDirty(w),
            w.css(u.style),
            p.item(d).update(r)
        }
    },
    renderOrder: function(a, b) {
        var c = this
          , d = c.widget
          , e = d.lang
          , f = (d.emptyValue,
        d.store)
          , g = c.getColumns()
          , h = g[a]
          , i = c.el.select(".fancy-grid-column")
          , j = i.item(a)
          , k = j.select("." + d.cellCls)
          , l = j.select("." + d.cellCls + " ." + d.cellInnerCls)
          , m = 0
          , n = f.getLength()
          , o = (e.currencySign,
        0);
        for (d.paging && (o += f.showPage * f.pageSize); n > m; m++) {
            var p = f.get(m)
              , q = f.getId(m)
              , r = {
                rowIndex: m,
                data: p,
                style: {},
                column: h,
                id: q,
                item: f.getItem(m)
            }
              , s = m + 1 + o;
            r.value = s,
            h.render && (r = h.render(r),
            s = r.value);
            var t = k.item(m);
            d.cellStylingCls && c.clearCls(t),
            r.cls && t.addClass(r.cls),
            t.css(r.style),
            l.item(m).update(s)
        }
    },
    renderExpand: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = (i.key || i.index,
        e.el.select(".fancy-grid-column")), k = j.item(a), l = (k.select("." + f.cellCls),
        k.select("." + f.cellCls + " ." + f.cellInnerCls));
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var m, n = g.get(c), o = l.item(c), p = o.select(".fancy-field-checkbox"), q = 0 !== p.length, r = g.getId(c);
            ({
                rowIndex: c,
                data: n,
                style: {},
                column: i,
                id: r,
                item: g.getItem(c)
            });
            q === !1 ? new Fancy.CheckBox({
                renderTo: l.item(c).dom,
                renderId: !0,
                value: !1,
                label: !1,
                expander: !0,
                style: {
                    padding: "0px",
                    display: "inline-block"
                },
                events: [{
                    beforechange: function(a) {}
                }, {
                    change: function(a, c) {
                        b = a.el.parent().parent().attr("index"),
                        c ? f.expander.expand(b) : f.expander.collapse(b)
                    }
                }]
            }) : (m = p.dom.id,
            p = Fancy.getWidget(m),
            p.set(!1, !1))
        }
    },
    clearCls: function(a) {
        for (var b = this, c = b.widget, d = c.cellStylingCls, e = 0, f = d.length; f > e; e++)
            a.removeClass(d[e])
    },
    renderColor: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var o, p = g.get(c), q = {
                rowIndex: c,
                data: p,
                style: {},
                column: i
            };
            o = i.smartIndexFn ? i.smartIndexFn(p) : g.get(c, j),
            i.render && (q = i.render(q),
            o = q.value),
            q.value = o,
            m.item(c).css(q.style);
            n.item(c).update('<div style="background-color:' + o + ';" class="fancy-grid-color-cell"></div>')
        }
    },
    renderCombo: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var o = g.get(c, j)
              , p = {
                rowIndex: c,
                value: o,
                style: {}
            };
            i.render && (p = i.render(p),
            o = p.value),
            m.item(c).css(p.style),
            n.item(c).update(o)
        }
    },
    renderCheckbox: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var o, p = g.get(c), q = g.get(c, j), r = n.item(c), s = r.select(".fancy-field-checkbox"), t = 0 !== s.length, u = !1, v = g.getId(c), w = {
                rowIndex: c,
                data: p,
                style: {},
                column: i,
                id: v,
                item: g.getItem(c),
                value: q
            };
            if (g.changed[w.id] && g.changed[w.id][i.index] && (u = !0),
            i.render && (w = i.render(w),
            q = w.value),
            t === !1)
                if (w.stopped)
                    n.item(c).update(q);
                else {
                    var x = !0;
                    f.rowEdit && (x = !1),
                    n.item(c).update(""),
                    new Fancy.CheckBox({
                        renderTo: n.item(c).dom,
                        renderId: !0,
                        value: q,
                        label: !1,
                        editable: x,
                        style: {
                            padding: "0px",
                            display: "inline-block"
                        },
                        events: [{
                            beforechange: function(a) {
                                "$selected" !== i.index && i.editable !== !0 && (a.canceledChange = !0)
                            }
                        }, {
                            change: function(a, b) {
                                "$selected" !== i.index && (f.celledit.checkBoxChangedValue = b)
                            }
                        }]
                    })
                }
            else
                o = s.dom.id,
                s = Fancy.getWidget(o),
                w.stopped ? (s.destroy(),
                n.item(c).update(q)) : s.set(q, !1);
            if (u) {
                var y = m.item(c);
                e.enableCellDirty(y)
            }
        }
    },
    renderSelect: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = (l.select("." + f.cellCls),
        l.select("." + f.cellCls + " ." + f.cellInnerCls));
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var n, o = g.get(c), p = g.get(c, j), q = m.item(c), r = q.select(".fancy-field-checkbox"), s = 0 !== r.length, t = g.getId(c);
            ({
                rowIndex: c,
                data: o,
                style: {},
                column: i,
                id: t,
                item: g.getItem(c)
            });
            s === !1 ? new Fancy.CheckBox({
                renderTo: m.item(c).dom,
                renderId: !0,
                value: p,
                label: !1,
                stopIfCTRL: !0,
                style: {
                    padding: "0px",
                    display: "inline-block"
                }
            }) : (n = r.dom.id,
            r = Fancy.getWidget(n),
            r.set(p, !1))
        }
    },
    renderImage: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        for (void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var o = g.get(c, j)
              , p = g.get(c)
              , q = {
                rowIndex: c,
                value: o,
                data: p,
                style: {}
            }
              , r = "";
            if (i.render && (q = i.render(q),
            o = q.value),
            q.attr)
                for (var s in q.attr)
                    r += s + '="' + q.attr[s] + '"';
            o = "<img " + r + ' src="' + q.value + '">',
            m.item(c).css(q.style),
            n.item(c).update(o)
        }
    },
    renderSparkLine: function(a, b, c) {
        var d, e, f = this, g = f.widget, h = g.cellHeight, i = g.store, j = f.getColumns(), k = j[a], l = k.width, m = k.key || k.index, n = f.el.select(".fancy-grid-column"), o = n.item(a), p = o.select("." + g.cellCls), q = o.select("." + g.cellCls + " ." + g.cellInnerCls), r = k.sparkConfig || {};
        o.addClass(g.clsSparkColumn),
        void 0 !== b ? (d = b,
        e = b + 1) : (d = 0,
        e = i.getLength());
        var s, t = h - 1, u = l - 20;
        switch (c) {
        case "line":
        case "pie":
        case "box":
            s = "width";
            break;
        case "bullet":
            s = "width",
            t -= 11,
            o.addClass(g.clsSparkColumnBullet);
            break;
        case "discrete":
            s = "width",
            u = l,
            t -= 2;
            break;
        case "bar":
        case "tristate":
            s = "barWidth"
        }
        for (; e > d; d++) {
            var v = i.get(d, m)
              , w = i.get(d)
              , x = {
                rowIndex: d,
                value: v,
                data: w,
                style: {}
            };
            if (k.render && (x = k.render(x),
            v = x.value),
            Fancy.isArray(k.values)) {
                var y = 0
                  , z = k.values.length;
                for (v = []; z > y; y++)
                    v.push(i.get(d, k.values[y]))
            }
            p.item(d).css(x.style);
            var A = q.item(d).dom
              , B = {
                type: c,
                fillColor: "transparent",
                height: t
            };
            if (Fancy.apply(B, r),
            ("bar" === c || "tristate" === c) && (u = l - 20,
            u /= v.length),
            B[s] = u,
            Fancy.nojQuery)
                Fancy.$(A).sparkline(v, B);
            else {
                window.jQuery || window.$;
                Fancy.$(A).sparkline(v, B)
            }
        }
    },
    renderProgressDonut: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        for (l.addClass(f.clsSparkColumnDonutProgress),
        void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var o, p = g.get(c), q = {
                rowIndex: c,
                data: p,
                style: {},
                column: i
            };
            o = i.smartIndexFn ? i.smartIndexFn(p) : g.get(c, j),
            q.value = o,
            i.format && (q.value = e.format(q.value, i.format),
            o = q.value),
            i.render && (q = i.render(q),
            o = q.value),
            m.item(c).css(q.style);
            var r = i.sparkConfig || {}
              , s = n.item(c).dom;
            Fancy.apply(r, {
                renderTo: s,
                value: o
            }),
            r.size || r.height || r.width || (r.size = f.cellHeaderHeight - 6),
            Fancy.get(s).update(""),
            new Fancy.spark.ProgressDonut(r)
        }
    },
    renderGrossLoss: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls);
        l.addClass(f.clsColumnGrossLoss),
        void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength());
        var o = i.sparkConfig || {};
        for (o.showOnMax && (o.maxValue = Math.max.apply(Math, g.getColumnData(j, i.smartIndexFn))); d > c; c++) {
            var p, q = g.get(c), r = {
                rowIndex: c,
                data: q,
                style: {},
                column: i
            };
            p = i.smartIndexFn ? i.smartIndexFn(q) : g.get(c, j),
            r.value = p,
            i.format && (r.value = e.format(r.value, i.format),
            p = r.value),
            i.render && (r = i.render(r),
            p = r.value),
            m.item(c).css(r.style),
            Fancy.apply(o, {
                renderTo: n.item(c).dom,
                value: p,
                column: i
            }),
            new Fancy.spark.GrossLoss(o)
        }
    },
    renderProgressBar: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls), o = 100;
        l.addClass(f.clsColumnProgress),
        void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength());
        var p = i.sparkConfig || {};
        for (p.percents === !1 && (o = Math.max.apply(Math, g.getColumnData(j))); d > c; c++) {
            var q, r = g.get(c), s = {
                rowIndex: c,
                data: r,
                style: {},
                column: i
            };
            q = i.smartIndexFn ? i.smartIndexFn(r) : g.get(c, j),
            s.value = q,
            i.format && (s.value = e.format(s.value, i.format),
            q = s.value),
            i.render && (s = i.render(s),
            q = s.value),
            m.item(c).css(s.style);
            var t = Fancy.get(n.item(c).dom);
            if (t.select(".fancy-grid-column-progress-bar").length) {
                var u = Fancy.getWidget(t.select(".fancy-grid-column-progress-bar").item(0).attr("id"));
                u.value = q,
                u.maxValue = o,
                u.update()
            } else
                Fancy.apply(p, {
                    renderTo: n.item(c).dom,
                    value: q,
                    column: i,
                    maxValue: o
                }),
                new Fancy.spark.ProgressBar(p)
        }
    },
    renderHBar: function(a, b) {
        var c, d, e = this, f = e.widget, g = f.store, h = e.getColumns(), i = h[a], j = i.key || i.index, k = e.el.select(".fancy-grid-column"), l = k.item(a), m = l.select("." + f.cellCls), n = l.select("." + f.cellCls + " ." + f.cellInnerCls), o = 100, p = i.sparkConfig || {}, q = i.disabled || {};
        l.addClass(f.clsSparkColumnHBar);
        var r, s, t = {}, a = 0, u = Number.MIN_VALUE;
        if (Fancy.isArray(i.index))
            for (r = i.index.length; r > a; a++) {
                var v = i.index[a];
                if (!q[v]) {
                    t[v] = g.getColumnData(v);
                    var w = Math.max.apply(Math, t[v]);
                    w > u && (u = w),
                    s = t[v].length
                }
            }
        else {
            var x = g.getColumnData(i.index)
              , y = [];
            for (r = x.length; r > a; a++)
                for (var z = 0, A = x[a].length; A > z; z++)
                    q[z] || (t[z] = t[z] || [],
                    t[z].push(x[a][z]));
            for (var B in t) {
                var w = Math.max.apply(Math, t[B]);
                y.push(B),
                w > u && (u = w),
                s = t[B].length
            }
            i.fields || (i.fields = y)
        }
        for (var C = [], D = 0; s > D; D++) {
            C[D] = 0;
            for (var B in t)
                i.fields && q[i.index + "." + B] || q[B] || (C[D] += t[B][D])
        }
        for (o = Math.max.apply(Math, C),
        p.maxItemValue = u,
        void 0 !== b ? (c = b,
        d = b + 1) : (c = 0,
        d = g.getLength()); d > c; c++) {
            var E, x = g.get(c), F = {
                rowIndex: c,
                data: x,
                style: {},
                column: i
            };
            E = i.smartIndexFn ? i.smartIndexFn(x) : g.get(c, j),
            F.value = E,
            i.format && (F.value = e.format(F.value, i.format),
            E = F.value),
            i.render && (F = i.render(F),
            E = F.value),
            m.item(c).css(F.style);
            var G = Fancy.get(n.item(c).dom);
            if (G.select(".fancy-spark-hbar").length) {
                var H = Fancy.getWidget(G.select(".fancy-spark-hbar").item(0).attr("id"));
                H.maxValue = o,
                H.maxItemValue = u,
                H.update(x)
            } else
                Fancy.apply(p, {
                    renderTo: n.item(c).dom,
                    value: E,
                    data: x,
                    column: i,
                    maxValue: o,
                    height: f.cellHeight - 1
                }),
                new Fancy.spark.HBar(p)
        }
    },
    renderCircle: function(a, b) {
        function c(a, b) {
            var c = "http://www.w3.org/2000/svg"
              , d = document.createElementNS(c, "svg:svg");
            d.setAttribute("width", b),
            d.setAttribute("height", b),
            d.setAttribute("viewBox", "0 0 " + b + " " + b);
            var e = document.createElementNS(c, "circle");
            e.setAttributeNS(null, "cx", b / 2),
            e.setAttributeNS(null, "cy", b / 2),
            e.setAttributeNS(null, "r", b / 2);
            var f = "#F0F0F0";
            b > 50 && (f = "F0F0F0"),
            0 > a && (f = "#F9DDE0"),
            e.setAttributeNS(null, "fill", f),
            d.appendChild(e);
            var g = document.createElementNS(c, "path")
              , h = 2 * Math.PI / 100
              , i = 0
              , j = a * h - .001
              , k = b / 2 + b / 2 * Math.sin(i)
              , l = b / 2 - b / 2 * Math.cos(i)
              , m = b / 2 + b / 2 * Math.sin(j)
              , n = b / 2 - b / 2 * Math.cos(j)
              , o = 0;
            j - i > Math.PI && (o = 1);
            var p = "M " + b / 2 + "," + b / 2 + " L " + k + "," + l + " A " + b / 2 + "," + b / 2 + " 0 " + o + " 1 " + m + "," + n + " Z";
            g.setAttribute("d", p),
            0 > a ? g.setAttribute("fill", "#EA7369") : g.setAttribute("fill", "#44A4D3"),
            d.appendChild(g);
            var q = document.createElementNS(c, "circle");
            return q.setAttributeNS(null, "cx", b / 2),
            q.setAttributeNS(null, "cy", b / 2),
            q.setAttributeNS(null, "r", .25 * b),
            q.setAttributeNS(null, "fill", "#fff"),
            d.appendChild(q),
            d
        }
        var d, e, f = this, g = f.widget, h = g.store, i = f.getColumns(), j = i[a], k = j.key || j.index, l = f.el.select(".fancy-grid-column"), m = l.item(a), n = (m.select("." + g.cellCls),
        m.select("." + g.cellCls + " ." + g.cellInnerCls)), o = g.cellHeight - 4;
        j.width;
        for (m.addClass(g.clsSparkColumnCircle),
        void 0 !== b ? (d = b,
        e = b + 1) : (d = 0,
        e = h.getLength()); e > d; d++) {
            var p, q = h.get(d), r = {
                rowIndex: d,
                data: q,
                style: {}
            };
            p = j.smartIndexFn ? j.smartIndexFn(q) : h.get(d, k),
            r.value = p,
            j.render && (r = j.render(r),
            p = r.value);
            var s = n.item(d).dom;
            "" === s.innerHTML && s.appendChild(c(p, o))
        }
    },
    removeNotUsedCells: function() {
        for (var a = this, b = a.widget, c = b.store, d = a.el.select(".fancy-grid-column"), e = 0, f = d.length; f > e; e++)
            for (var g = d.item(e), h = g.select(".fancy-grid-cell"), i = c.getLength(), j = h.length; j > i; i++)
                h.item(i).remove()
    },
    getFormat: function(a) {
        var b = this
          , c = b.widget
          , d = c.lang;
        switch (a) {
        case "number":
            return function(a) {
                return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, d.thousandSeparator)
            }
            ;
        case "date":
            return function(a) {
                var b = Fancy.Date.parse(a, d.date.read);
                return a = Fancy.Date.format(b, d.date.write)
            }
        }
        switch (a.type) {
        case "date":
            return function(b) {
                if (0 === b.length)
                    return "";
                var c = Fancy.Date.parse(b, a.read, a.mode);
                return b = Fancy.Date.format(c, a.write, void 0, a.mode)
            }
        }
        return a.inputFn ? a.inputFn : void 0
    },
    format: function(a, b) {
        switch (Fancy.typeOf(b)) {
        case "string":
            a = this.getFormat(b)(a);
            break;
        case "function":
            a = b(a);
            break;
        case "object":
            a = b.inputFn ? b.inputFn(a) : this.getFormat(b)(a)
        }
        return a
    },
    enableCellDirty: function(a) {
        a.hasClass("fancy-grid-cell-dirty") || (a.addClass("fancy-grid-cell-dirty"),
        a.append('<div class="fancy-grid-cell-dirty-el"></div>'))
    },
    clearDirty: function(a) {
        var b = this;
        return void 0 !== a ? (b.el.select('.fancy-grid-cell[index="' + a + '"] .fancy-grid-cell-dirty-el').destroy(),
        void b.el.select('.fancy-grid-cell-dirty[index="' + a + '"]').removeClass("fancy-grid-cell-dirty")) : (b.el.select(".fancy-grid-cell-dirty-el").destroy(),
        void b.el.select(".fancy-grid-cell-dirty").removeClass("fancy-grid-cell-dirty"))
    },
    showEmptyText: function() {
        var a = this
          , b = a.widget
          , c = b.store;
        if ("center" === a.side && (a.emptyTextEl && (a.emptyTextEl.destroy(),
        delete a.emptyTextEl),
        0 === c.dataView.length)) {
            var d = Fancy.get(document.createElement("div"));
            d.addClass("fancy-grid-empty-text"),
            d.update(b.emptyText),
            a.emptyTextEl = Fancy.get(a.el.dom.appendChild(d.dom))
        }
    }
},
Fancy.define("Fancy.grid.Body", {
    extend: Fancy.Widget,
    mixins: [Fancy.grid.body.mixin.Updater],
    cls: "fancy-grid-body",
    cellCls: "fancy-grid-cell",
    pseudoCellCls: "fancy-grid-pseudo-cell",
    cellTpl: ['<div class="fancy-grid-cell-inner">{cellValue}</div>'],
    cellWrapperTpl: ['<div class="fancy-grid-cell-wrapper">', '<div class="fancy-grid-cell-inner">{cellValue}</div>', "</div>"],
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.addEvents("adddomcolumns"),
        a.initTpl(),
        a.render(),
        a.ons()
    },
    initTpl: function() {
        var a = this;
        a.cellTpl = new Fancy.Template(a.cellTpl),
        a.cellWrapperTpl = new Fancy.Template(a.cellWrapperTpl)
    },
    ons: function() {
        var a = this
          , b = a.widget
          , c = b.id;
        b.on("afterrender", a.onAfterRender, a),
        a.el.on("click", a.onCellClick, a, '.fancy-grid-column[grid="' + c + '"] div.fancy-grid-cell'),
        a.el.on("dblclick", a.onCellDblClick, a, '.fancy-grid-column[grid="' + c + '"] div.fancy-grid-cell'),
        a.el.on("mouseenter", a.onCellMouseEnter, a, '.fancy-grid-column[grid="' + c + '"] div.fancy-grid-cell'),
        a.el.on("mouseleave", a.onCellMouseLeave, a, '.fancy-grid-column[grid="' + c + '"] div.fancy-grid-cell'),
        a.el.on("mousedown", a.onCellMouseDown, a, '.fancy-grid-column[grid="' + c + '"] div.fancy-grid-cell'),
        a.el.on("mouseenter", a.onColumnMouseEnter, a, '.fancy-grid-column[grid="' + c + '"]'),
        a.el.on("mouseleave", a.onColumnMouseLeave, a, '.fancy-grid-column[grid="' + c + '"]')
    },
    render: function() {
        var a, b = this, c = b.widget, d = Fancy.get(document.createElement("div"));
        d.addClass(b.cls),
        a = c.el.select(".fancy-grid-" + b.side).dom,
        b.el = Fancy.get(a.appendChild(d.dom))
    },
    onAfterRender: function() {
        var a = this
          , b = a.widget;
        b.store;
        a.update(),
        a.setHeight()
    },
    setColumnsPosition: function(a) {
        var b = this
          , c = b.widget
          , d = b.getColumns()
          , e = 0
          , f = d.length
          , g = 0
          , h = b.el.select('.fancy-grid-column[grid="' + c.id + '"]')
          , a = a || b.scrollLeft || 0;
        for (g += a; f > e; e++) {
            var i = d[e]
              , j = h.item(e);
            j.css({
                left: g + "px"
            }),
            g += i.width
        }
    },
    wheelScroll: function(a) {
        var b = this
          , c = b.widget
          , d = c.knobOffSet
          , e = b.el.select('.fancy-grid-column[grid="' + c.id + '"]');
        if (0 !== e.length) {
            for (var f = 0, g = e.length, h = c.getBodyHeight(), i = c.getCellsViewHeight(), j = i - h + d, k = {
                oldScroll: parseInt(e.item(0).css("top")),
                newScroll: parseInt(e.item(0).css("top")) + 30 * a,
                deltaScroll: 30 * a
            }; g > f; f++) {
                var l = e.item(f)
                  , m = parseInt(l.css("top")) + 30 * a;
                m > 0 ? (m = 0,
                k.newScroll = 0) : Math.abs(m) > j && (m = -j - d,
                k.newScroll = m),
                l.css("top", m + "px")
            }
            return k
        }
    },
    scroll: function(a, b) {
        var c = this
          , d = c.widget
          , e = c.el.select('.fancy-grid-column[grid="' + d.id + '"]')
          , f = 0
          , g = e.length
          , h = {};
        if (a !== !1)
            for (h.scrollTop = a; g > f; f++) {
                var i = e.item(f);
                i.css("top", -a + "px")
            }
        return void 0 !== b && (h.scrollLeft = b,
        d.header && d.header.scroll(b),
        c.scrollLeft = b,
        d.body.setColumnsPosition(b)),
        h
    },
    setHeight: function() {
        var a = this
          , b = a.widget
          , c = b.getBodyHeight();
        a.css("height", c + "px")
    },
    onCellClick: function(a) {
        var b = this
          , c = b.widget;
        c.fire("cellclick", b.getEventParams(a)),
        c.fire("rowclick", b.getEventParams(a)),
        c.fire("columnclick", b.getColumnEventParams(a)),
        c.activated === !1 && (c.activated = !0,
        c.fire("activate"))
    },
    onCellDblClick: function(a) {
        var b = this
          , c = b.widget;
        c.fire("celldblclick", b.getEventParams(a)),
        c.fire("rowdblclick", b.getEventParams(a)),
        c.fire("columndblclick", b.getColumnEventParams(a))
    },
    getEventParams: function(a) {
        var b = this
          , c = b.widget
          , d = c.store
          , e = b.getColumns()
          , f = a.currentTarget
          , g = Fancy.get(a.currentTarget)
          , h = g.parent();
        if (void 0 === g.parent().dom)
            return !1;
        if (0 === d.getLength())
            return !1;
        var i = parseInt(h.attr("index"))
          , j = parseInt(g.attr("index"))
          , k = e[i]
          , l = k.index || k.key
          , m = d.get(j, l)
          , n = d.getId(j)
          , o = d.get(j)
          , p = d.getById(n);
        return k.smartIndexFn && (m = k.smartIndexFn(o)),
        {
            e: a,
            id: n,
            side: b.side,
            cell: f,
            column: k,
            rowIndex: j,
            columnIndex: i,
            value: m,
            data: o,
            item: p
        }
    },
    getColumnEventParams: function(a) {
        var b = this
          , c = b.widget
          , d = c.store
          , e = (a.currentTarget,
        Fancy.get(a.currentTarget))
          , f = e.parent()
          , g = parseInt(f.attr("index"))
          , h = b.getColumns()
          , i = h[g]
          , j = {
            e: a,
            side: b.side,
            columnIndex: g,
            column: i,
            columnDom: f.dom
        };
        return c.columnClickData && (j.data = d.getColumnData(i.index, i.smartIndexFn)),
        j
    },
    getColumnHoverEventParams: function(a) {
        var b = this
          , c = b.widget
          , d = (c.store,
        Fancy.get(a.currentTarget))
          , e = parseInt(d.attr("index"))
          , f = b.getColumns()
          , g = f[e];
        return {
            e: a,
            side: b.side,
            columnIndex: e,
            column: g,
            columnDom: d.dom
        }
    },
    getColumns: function() {
        var a = this
          , b = a.widget;
        return b.getColumns(a.side)
    },
    onCellMouseEnter: function(a) {
        var b = this
          , c = b.widget
          , d = b.getEventParams(a)
          , e = b.prevCellOver;
        Fancy.nojQuery && e && b.fixZeptoBug && (d.rowIndex !== e.rowIndex || d.columnIndex !== e.columnIndex || d.side !== e.side) && (c.fire("cellleave", e),
        d.rowIndex !== e.rowIndex && c.fire("rowleave", e)),
        e ? d.rowIndex !== b.prevCellOver.rowIndex && c.fire("rowenter", d) : c.fire("rowenter", d),
        c.fire("cellenter", d),
        b.prevCellOver = d
    },
    onCellMouseDown: function(a) {
        var b = this
          , c = b.widget
          , d = b.getEventParams(a)
          , e = {
            e: d.e,
            side: d.side,
            columnDom: Fancy.get(d.cell).parent().dom,
            column: d.column,
            columnIndex: d.columnIndex
        };
        c.fire("beforecellmousedown", d),
        c.fire("cellmousedown", d),
        c.fire("columnmousedown", e)
    },
    onCellMouseLeave: function(a) {
        var b = this
          , c = b.widget
          , d = b.getEventParams(a)
          , e = b.prevCellOver;
        if (Fancy.nojQuery) {
            if (void 0 === e)
                return;
            return void (b.fixZeptoBug = d)
        }
        c.fire("rowleave", e),
        c.fire("cellleave", e),
        delete b.prevCellOver
    },
    onColumnMouseEnter: function(a) {
        var b = this
          , c = b.widget
          , d = b.getColumnHoverEventParams(a)
          , e = b.prevColumnOver;
        e ? b.prevCellOver && d.rowIndex !== b.prevCellOver.rowIndex && c.fire("rowenter", d) : c.fire("columnenter", d),
        b.prevColumnOver = d
    },
    onColumnMouseLeave: function(a) {
        var b = this
          , c = b.widget;
        c.fire("columnleave", b.prevColumnOver),
        delete b.prevColumnOver
    },
    getCell: function(a, b) {
        var c = this;
        return c.el.select('.fancy-grid-column[index="' + b + '"] .fancy-grid-cell[index="' + a + '"]')
    },
    getDomCell: function(a, b) {
        var c = this
          , d = c.widget;
        return c.el.select('.fancy-grid-column[index="' + b + '"][grid="' + d.id + '"] .fancy-grid-cell[index="' + a + '"]').dom
    },
    getDomColumn: function(a) {
        var b = this
          , c = b.widget;
        return b.el.select('.fancy-grid-column[index="' + a + '"][grid="' + c.id + '"]').dom
    },
    destroy: function() {
        var a = this;
        a.el.un("click", a.onCellClick, a, "div.fancy-grid-cell"),
        a.el.un("dblclick", a.onCellDblClick, a, "div.fancy-grid-cell"),
        a.el.un("mouseenter", a.onCellMouseEnter, a, "div.fancy-grid-cell"),
        a.el.un("mouseleave", a.onCellMouseLeave, a, "div.fancy-grid-cell"),
        a.el.un("mousedown", a.onCellMouseDown, a, "div.fancy-grid-cell"),
        a.el.un("mouseenter", a.onColumnMouseEnter, a, "div.fancy-grid-column"),
        a.el.un("mouseleave", a.onColumnMouseLeave, a, "div.fancy-grid-column")
    },
    hideColumn: function(a) {
        var b = this
          , c = b.el.select(".fancy-grid-column")
          , d = c.item(a)
          , e = parseInt(d.css("width"))
          , f = a + 1
          , g = c.length;
        for (d.hide(); g > f; f++) {
            var h = c.item(f)
              , i = parseInt(h.css("left")) - e;
            h.css("left", i)
        }
    },
    showColumn: function(a) {
        var b, c = this, d = c.el.select(".fancy-grid-column"), e = d.item(a), f = a + 1, g = d.length;
        for (e.show(),
        b = parseInt(e.css("width")); g > f; f++) {
            var h = d.item(f)
              , i = parseInt(h.css("left")) + b;
            h.css("left", i)
        }
    },
    removeColumn: function(a) {
        var b = this
          , c = b.el.select(".fancy-grid-column")
          , d = c.item(a)
          , e = parseInt(d.css("width"))
          , f = a + 1
          , g = c.length;
        for (d.destroy(); g > f; f++) {
            var h = c.item(f)
              , i = parseInt(h.css("left")) - e;
            h.attr("index", f - 1),
            h.css("left", i)
        }
    },
    insertColumn: function(a, b) {
        for (var c = this, d = c.widget, e = c.getColumns(), f = c.el.select(".fancy-grid-column"), g = b.width, h = Fancy.get(document.createElement("div")), i = a, j = f.length, k = 0, l = 0, m = a; m > l; l++)
            k += e[l].width;
        for (; j > i; i++) {
            var n = f.item(i);
            n.css("left", parseInt(n.css("left")) + b.width),
            n.attr("index", i + 1)
        }
        if (h.addClass("fancy-grid-column"),
        h.attr("grid", d.id),
        "$selected" === b.index)
            h.addClass("fancy-grid-cell-select");
        else
            switch (b.type) {
            case "order":
                h.addClass("fancy-grid-cell-order")
            }
        if (b.cls && h.addClass(b.cls),
        "text" === b.type && h.addClass("fancy-grid-column-text"),
        h.css({
            width: g + "px"
        }),
        h.attr("index", a),
        b.cellAlign && h.css("text-align", b.cellAlign),
        b.ellipsis === !0)
            switch (b.type) {
            case "string":
            case "text":
            case "number":
                h.addClass("fancy-grid-column-ellipsis")
            }
        0 === a && f.length ? (h.css("left", "0px"),
        c.el.dom.insertBefore(h.dom, f.item(a).dom)) : 0 !== a && f.length && (h.css("left", k + "px"),
        c.el.dom.appendChild(h.dom)),
        c.checkDomCells(),
        c.updateRows(void 0, a)
    }
}),
Fancy.Mixin("Fancy.grid.header.mixin.Menu", {
    triggeredColumnCls: "fancy-grid-header-column-triggered",
    showMenu: function(a, b, c, d) {
        var e = this
          , f = e.widget
          , g = a.offset();
        e.hideMenu(),
        a.addClass(e.triggeredColumnCls),
        c.menu.rendered ? e.updateColumnsMenu(c, d) : (c.menu = e.generateMenu(c, d),
        c.menu = new Fancy.Menu({
            column: c,
            items: c.menu,
            theme: f.theme,
            events: [{
                hide: e.onMenuHide,
                scope: e
            }]
        })),
        c.menu.showAt(g.left + parseInt(a.css("width")) - 26, g.top + parseInt(a.css("height")) - 1),
        e.activeMenu = c.menu,
        e.activeCell = a
    },
    hideMenu: function() {
        var a = this
          , b = a.widget;
        switch (a.side) {
        case "left":
            b.header.activeMenu && (b.header.activeMenu.hide(),
            b.header.activeCell.removeClass(a.triggeredColumnCls),
            delete b.header.activeMenu,
            delete b.header.activeCell),
            b.rightHeader.activeMenu && (b.rightHeader.activeMenu.hide(),
            b.rightHeader.activeCell.removeClass(a.triggeredColumnCls),
            delete b.rightHeader.activeMenu,
            delete b.rightHeader.activeCell);
            break;
        case "center":
            b.leftHeader.activeMenu && (b.leftHeader.activeMenu.hide(),
            b.leftHeader.activeCell.removeClass(a.triggeredColumnCls),
            delete b.leftHeader.activeMenu,
            delete b.leftHeader.activeCell),
            b.rightHeader.activeMenu && (b.rightHeader.activeMenu.hide(),
            b.rightHeader.activeCell.removeClass(a.triggeredColumnCls),
            delete b.rightHeader.activeMenu,
            delete b.rightHeader.activeCell);
            break;
        case "right":
            b.leftHeader.activeMenu && (b.leftHeader.activeMenu.hide(),
            b.leftHeader.activeCell.removeClass(a.triggeredColumnCls),
            delete b.leftHeader.activeMenu,
            delete b.leftHeader.activeCell),
            b.header.activeMenu && (b.header.activeMenu.hide(),
            b.header.activeCell.removeClass(a.triggeredColumnCls),
            delete b.header.activeMenu,
            delete b.header.activeCell)
        }
        a.activeMenu && (a.activeMenu.hide(),
        a.activeCell.removeClass(a.triggeredColumnCls)),
        delete a.activeMenu,
        delete a.activeCell
    },
    generateMenu: function(a, b) {
        for (var c, d = this, e = d.widget, f = e.lang, g = (e.theme,
        []), h = "", i = 0, j = b.length; j > i; i++)
            if (a.index === b[i].index) {
                c = i;
                break
            }
        switch (a.sortable === !1 && (h = "fancy-menu-item-disabled"),
        g.push({
            text: f.sortAsc,
            cls: h,
            imageCls: "fancy-grid-header-cell-trigger-up",
            handler: function() {
                e.sorter.sort("asc", a.index, d.side),
                a.menu.hide()
            }
        }),
        g.push({
            text: f.sortDesc,
            cls: h,
            imageCls: "fancy-grid-header-cell-trigger-down",
            handler: function() {
                e.sorter.sort("desc", a.index, d.side),
                a.menu.hide()
            }
        }),
        g.push({
            text: f.columns,
            index: "columns",
            items: d.prepareColumns(b)
        }),
        d.side) {
        case "left":
        case "right":
            g.push({
                text: "Unlock",
                handler: function() {
                    a.menu.hide(),
                    e.unLockColumn(c, d.side)
                }
            });
            break;
        case "center":
            e.leftColumns.length && a.lockable !== !1 && g.push({
                text: "Lock",
                handler: function() {
                    a.menu.hide(),
                    e.lockColumn(c, d.side)
                }
            }),
            e.rightColumns.length && a.lockable !== !1 && g.push({
                text: "Right Lock",
                handler: function() {
                    a.menu.hide(),
                    e.rightLockColumn(c, d.side)
                }
            })
        }
        return g
    },
    prepareColumns: function(a) {
        for (var b, c = this, d = c.widget, e = [], f = 0, g = a.length, h = []; g > f; f++) {
            var i = !0
              , j = a[f];
            j.hidden && (i = !1);
            var k = {
                text: j.title,
                checked: i,
                index: j.index,
                handler: function(a, b) {
                    var e = !b.checked;
                    return b.checked !== !0 || b.checkbox.get() || (e = !0,
                    b.checkbox.set(!0)),
                    b.checked && 1 === a.el.select(".fancy-checkbox-on").length ? (e = !0,
                    void b.checkbox.set(!0)) : (b.checked = !b.checked,
                    b.checkbox.set(b.checked),
                    void (b.checked ? d.showColumn(c.side, b.index) : d.hideColumn(c.side, b.index)))
                }
            };
            j.grouping ? (h = h || [],
            h.push(k),
            b = j.grouping) : (h.length && (b = void 0,
            e.push({
                text: j.title,
                items: h
            }),
            h = []),
            e.push(k))
        }
        return e
    },
    onMenuHide: function() {
        var a = this
          , b = "fancy-grid-header-column-triggered";
        a.el.select("." + b).removeClass(b)
    },
    updateColumnsMenu: function(a, b, c) {
        for (var d, e, f = this, g = a.menu, h = 0, i = g.items.length; i > h; h++)
            if (e = g.items[h],
            "columns" === e.index) {
                d = e;
                break
            }
        h = 0,
        i = d.items.length;
        for (var j = !1; i > h; h++) {
            e = d.items[h];
            var k = b[h];
            e.checkbox && (e.checkbox.set(!k.hidden, !1),
            j = !0)
        }
        j || c || (d.items = f.prepareColumns(b))
    }
}),
Fancy.define("Fancy.grid.Header", {
    extend: Fancy.Widget,
    cls: "fancy-grid-header",
    mixins: ["Fancy.grid.header.mixin.Menu"],
    cellTpl: ['<div class="fancy-grid-header-cell {cls}" style="width:{columnWidth}px;height: {height};left: {left};" {groupIndex} index="{index}">', '<div class="fancy-grid-header-cell-container" style="height: {height};">', '<span class="fancy-grid-header-cell-text">{columnName}</span>', '<span class="fancy-grid-header-cell-trigger">', '<div class="fancy-grid-header-cell-trigger-image"></div>', "</span>", "</div>", "</div>"],
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.initTpl(),
        a.render(),
        a.renderHeaderCheckBox(),
        a.setAlign(),
        a.setCellsPosition(),
        a.ons()
    },
    initTpl: function() {
        var a = this;
        a.cellTpl = new Fancy.Template(a.cellTpl)
    },
    ons: function() {
        var a = this
          , b = a.widget;
        b.on("render", a.onAfterRender, a),
        a.el.on("click", a.onTriggerClick, a, "span.fancy-grid-header-cell-trigger"),
        a.el.on("click", a.onCellClick, a, "div.fancy-grid-header-cell"),
        a.el.on("mousemove", a.onCellMouseMove, a, "div.fancy-grid-header-cell"),
        a.el.on("mousedown", a.onCellMouseDown, a, "div.fancy-grid-header-cell"),
        a.el.on("mousedown", a.onMouseDown, a)
    },
    render: function() {
        var a, b = this, c = b.widget, d = b.getColumns(), e = Fancy.get(document.createElement("div")), f = "", g = 0, h = d.length, i = 1, j = {}, k = 0;
        for (c.groupheader && (i = 2),
        c.filter && c.filter.header && i++; h > g; g++) {
            var l = d[g]
              , m = (l.key || l.index,
            l.title || l.header)
              , n = c.cellHeaderHeight
              , o = ""
              , p = "";
            1 !== i && (l.grouping ? (j[l.grouping] || (j[l.grouping] = {
                width: 0,
                text: l.grouping,
                left: k
            }),
            n = c.cellHeaderHeight + "px",
            j[l.grouping].width += l.width,
            p = 'group-index="' + l.grouping + '"',
            o = "fancy-grid-header-cell-group-level-1") : n = i * c.cellHeaderHeight + "px"),
            k += l.width,
            "$selected" === l.index && (o += " fancy-grid-header-cell-select"),
            l.menu || (o += " fancy-grid-header-cell-trigger-disabled");
            var q = b.cellTpl.getHTML({
                cls: o,
                columnName: m,
                columnWidth: l.width,
                index: g,
                height: n,
                left: "initial",
                groupIndex: p
            });
            f += q
        }
        e.css({
            height: c.cellHeaderHeight * i + "px",
            width: b.getColumnsWidth()
        }),
        e.addClass(b.cls),
        c.groupheader && (e.addClass("fancy-grid-header-grouped"),
        f += b.getGroupingCellsHTML(j)),
        e.update(f),
        a = c.el.select(".fancy-grid-" + b.side).dom,
        b.el = Fancy.get(a.appendChild(e.dom))
    },
    insertCell: function(a, b) {
        var c, d = this, e = d.widget, f = d.el.select(".fancy-grid-header-cell:not(.fancy-grid-header-cell-group-level-2)"), g = d.getColumns(), h = "", i = b.title || b.header, j = e.cellHeaderHeight, k = "", l = 0;
        "$selected" === b.index && (h += " fancy-grid-header-cell-select"),
        b.menu || (h += " fancy-grid-header-cell-trigger-disabled");
        for (var m = 0, n = a; n > m; m++)
            l += g[m].width;
        for (var o = a, p = g.length; p > o; o++) {
            var q = f.item(o);
            q.css("left", parseInt(q.css("left")) + b.width)
        }
        var r = d.cellTpl.getHTML({
            cls: h,
            columnName: i,
            columnWidth: b.width,
            index: a,
            height: j,
            left: String(l) + "px",
            groupIndex: k
        });
        0 === a && f.length ? c = Fancy.get(f.item(0).before(r)) : 0 !== a && f.length && (c = d.el.append(r)),
        d.css("width", parseInt(d.css("width")) + b.width)
    },
    setAlign: function() {
        for (var a = this, b = (a.widget,
        a.getColumns()), c = 0, d = b.length; d > c; c++) {
            var e = b[c];
            e.align && a.getDomCell(c).css("text-align", e.align)
        }
    },
    onAfterRender: function() {},
    setCellsPosition: function() {
        var a = this
          , b = a.widget
          , c = a.getColumns()
          , d = 0
          , e = 0
          , f = c.length
          , g = a.el.select(".fancy-grid-header-cell")
          , h = 1;
        for (d += a.scrollLeft || 0,
        e = 0; f > e; e++) {
            var i = c[e]
              , j = g.item(e)
              , k = "0px";
            i.grouping && (k = b.cellHeaderHeight + "px"),
            j.css({
                top: k,
                left: d + "px"
            }),
            d += i.width
        }
        if (b.groupheader) {
            h = 2;
            var l = a.el.select(".fancy-grid-header-cell-group-level-2")
              , m = 0
              , n = l.length;
            if (void 0 !== a.scrollLeft)
                for (; n > m; m++) {
                    var o = l.item(m)
                      , p = o.attr("index")
                      , q = a.el.select('[group-index="' + p + '"]').item(0).css("left");
                    o.css("left", q)
                }
        }
    },
    getColumnsWidth: function() {
        for (var a = this, b = (a.widget,
        a.getColumns()), c = 0, d = 0, e = b.length; e > d; d++) {
            var f = b[d];
            c += f.width
        }
        return c
    },
    getColumns: function() {
        var a, b = this, c = b.widget;
        switch (b.side) {
        case "left":
            a = c.leftColumns;
            break;
        case "center":
            a = c.columns;
            break;
        case "right":
            a = c.rightColumns
        }
        return a
    },
    getDomCell: function(a) {
        var b = this;
        return b.el.select(".fancy-grid-header-cell").item(a)
    },
    onCellClick: function(a) {
        var b = this
          , c = b.widget
          , d = a.currentTarget
          , e = Fancy.get(a.target)
          , f = parseInt(Fancy.get(d).attr("index"));
        e.hasClass("fancy-grid-header-cell-trigger") || e.hasClass("fancy-grid-header-cell-trigger-image") || Fancy.get(d).hasClass("fancy-grid-header-cell-group-level-2") || c.fire("headercellclick", {
            e: a,
            side: b.side,
            cell: d,
            index: f
        })
    },
    onCellMouseMove: function(a) {
        var b = this
          , c = b.widget
          , d = a.currentTarget
          , e = Fancy.get(d)
          , f = e.hasClass("fancy-grid-header-cell-group-level-2")
          , g = parseInt(Fancy.get(d).attr("index"));
        f || c.fire("headercellmousemove", {
            e: a,
            side: b.side,
            cell: d,
            index: g
        })
    },
    onMouseDown: function(a) {
        var b = Fancy.get(a.target);
        "INPUT" === b.prop("tagName") || a.preventDefault()
    },
    onCellMouseDown: function(a) {
        var b = this
          , c = b.widget
          , d = a.currentTarget
          , e = parseInt(Fancy.get(d).attr("index"));
        c.fire("headercellmousedown", {
            e: a,
            side: b.side,
            cell: d,
            index: e
        })
    },
    scroll: function(a) {
        var b = this;
        b.scrollLeft = a,
        b.setCellsPosition()
    },
    getGroupingCellsHTML: function(a) {
        var b = this
          , c = b.widget
          , d = "";
        for (var e in a) {
            var f = a[e];
            d += b.cellTpl.getHTML({
                cls: "fancy-grid-header-cell-group-level-2",
                columnName: f.text,
                columnWidth: f.width,
                index: e,
                height: c.cellHeaderHeight + "px",
                left: f.left + "px",
                groupIndex: ""
            })
        }
        return d
    },
    destroy: function() {
        var a = this;
        a.el.un("click", a.onCellClick, a, "div.fancy-grid-header-cell"),
        a.el.un("mousemove", a.onCellMouseMove, a, "div.fancy-grid-header-cell"),
        a.el.un("mousedown", a.onCellMouseDown, a, "div.fancy-grid-header-cell"),
        a.el.un("mousedown", a.onMouseDown, a)
    },
    getCell: function(a) {
        var b = this;
        return b.el.select('.fancy-grid-header-cell[index="' + a + '"]')
    },
    onTriggerClick: function(a) {
        var b = this
          , c = Fancy.get(a.currentTarget)
          , d = c.parent().parent()
          , e = parseInt(d.attr("index"))
          , f = b.getColumns()
          , g = f[e];
        a.stopPropagation(),
        b.showMenu(d, e, g, f)
    },
    hideCell: function(a) {
        var b = this
          , c = b.el.select(".fancy-grid-header-cell:not(.fancy-grid-header-cell-group-level-2)")
          , d = c.item(a)
          , e = parseInt(d.css("width"))
          , f = a + 1
          , g = c.length
          , h = b.getColumns();
        if (d.hasClass("fancy-grid-header-cell-group-level-1")) {
            var i = d.attr("group-index")
              , j = b.el.select('.fancy-grid-header-cell-group-level-2[index="' + i + '"]').item(0)
              , k = parseInt(j.css("width"));
            j.css("width", k - e)
        }
        d.hide();
        for (var l = {}; g > f; f++) {
            var m = c.item(f)
              , n = parseInt(m.css("left")) - e
              , o = h[f];
            o.grouping && h[a].grouping !== o.grouping && (l[o.grouping] = !0),
            m.css("left", n)
        }
        for (var p in l) {
            var j = b.el.select('.fancy-grid-header-cell-group-level-2[index="' + p + '"]').item(0);
            j.css("left", parseInt(j.css("left")) - e)
        }
    },
    showCell: function(a) {
        var b, c = this, d = c.el.select(".fancy-grid-header-cell:not(.fancy-grid-header-cell-group-level-2)"), e = d.item(a), f = a + 1, g = d.length, h = c.getColumns();
        if (e.show(),
        b = parseInt(e.css("width")),
        e.hasClass("fancy-grid-header-cell-group-level-1")) {
            var i = e.attr("group-index")
              , j = c.el.select('.fancy-grid-header-cell-group-level-2[index="' + i + '"]').item(0)
              , k = parseInt(j.css("width"));
            j.css("width", k + b)
        }
        for (var l = {}; g > f; f++) {
            var m = d.item(f)
              , n = parseInt(m.css("left")) + b
              , o = h[f];
            o.grouping && h[a].grouping !== o.grouping && (l[o.grouping] = !0),
            m.css("left", n)
        }
        for (var p in l) {
            var j = c.el.select('.fancy-grid-header-cell-group-level-2[index="' + p + '"]').item(0);
            j.css("left", parseInt(j.css("left")) + b)
        }
    },
    removeCell: function(a) {
        var b = this
          , c = b.el.select(".fancy-grid-header-cell:not(.fancy-grid-header-cell-group-level-2)")
          , d = c.item(a)
          , e = parseInt(d.css("width"))
          , f = a + 1
          , g = c.length;
        for (d.destroy(); g > f; f++) {
            var h = c.item(f)
              , i = parseInt(h.css("left")) - e;
            h.attr("index", f - 1),
            h.css("left", i)
        }
        "center" !== b.side && b.css("width", parseInt(b.css("width")) - e)
    },
    renderHeaderCheckBox: function() {
        for (var a = this, b = a.widget, c = a.getColumns(), d = 0, e = c.length, f = a.el.select(".fancy-grid-header-cell:not(.fancy-grid-header-cell-group-level-2)"); e > d; d++) {
            var g = c[d];
            if (g.headerCheckBox === !0) {
                var h = f.item(d)
                  , i = h.firstChild()
                  , j = h.select(".fancy-grid-header-cell-text")
                  , k = j.dom.innerHTML
                  , l = k ? k : !1
                  , m = 0;
                h.addClass("fancy-grid-header-cell-checkbox"),
                j.update(""),
                l.length && (m = 15 * l.width),
                g.headerCheckBox = new Fancy.CheckBox({
                    renderTo: i.dom,
                    renderId: !0,
                    labelWidth: m,
                    value: !1,
                    label: l,
                    labelAlign: "right",
                    style: {
                        padding: "0px",
                        display: "inline-block"
                    },
                    events: [{
                        change: function(a, c) {
                            for (var d = 0, e = b.getViewTotal(); e > d; d++) {
                                b.get(d, g.index);
                                b.set(d, g.index, c)
                            }
                        }
                    }]
                })
            }
        }
    }
}),
Fancy.define(["Fancy.picker.Date", "Fancy.DatePicker"], {
    extend: Fancy.Grid,
    type: "datepicker",
    mixins: ["Fancy.grid.mixin.Grid", Fancy.panel.mixin.PrepareConfig, Fancy.panel.mixin.methods, "Fancy.grid.mixin.PrepareConfig", "Fancy.grid.mixin.ActionColumn", "Fancy.grid.mixin.Edit"],
    width: 308,
    height: 299,
    frame: !1,
    i18n: "en",
    cellTrackOver: !0,
    cellStylingCls: ["fancy-date-picker-cell-out-range", "fancy-date-picker-cell-today", "fancy-date-picker-cell-active"],
    activeCellCls: "fancy-date-picker-cell-active",
    todayCellCls: "fancy-date-picker-cell-today",
    outRangeCellCls: "fancy-date-picker-cell-out-range",
    defaults: {
        type: "string",
        width: 44,
        align: "center",
        cellAlign: "center"
    },
    gridBorders: [1, 0, 1, 1],
    panelBodyBorders: [0, 0, 0, 0],
    barScrollEnabled: !1,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.initFormat(),
        b.initColumns(),
        b.initDate(),
        b.initData(),
        b.initBars(),
        b.Super("constructor", [b])
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.onUpdate(),
        a.addEvents("changedate"),
        a.on("update", a.onUpdate, a),
        a.on("cellclick", a.onCellClick, a),
        a.addClass("fancy-date-picker"),
        a.el.on("mousewheel", a.onMouseWheel, a),
        a.panel.el.on("mousedown", a.onMouseDown, a)
    },
    initFormat: function() {
        var a = this;
        a.format || (a.format = Fancy.i18n[a.i18n].date)
    },
    initMonthPicker: function() {
        var a = this;
        (Fancy.fullBuilt || Fancy.MODULELOAD === !1 || !a.monthPicker && Fancy.modules.grid) && (a.monthPicker = new Fancy.MonthPicker({
            date: a.date,
            renderTo: a.panel.el.dom,
            style: {
                position: "absolute",
                top: "-" + a.panel.el.height() + "px",
                left: "0px"
            },
            events: [{
                cancelclick: a.onMonthCancelClick,
                scope: a
            }, {
                okclick: a.onMonthOkClick,
                scope: a
            }]
        }))
    },
    initData: function() {
        var a = this;
        a.data = a.setData()
    },
    initDate: function() {
        var a = this;
        void 0 === a.date && (a.date = new Date),
        a.showDate = a.date
    },
    initColumns: function() {
        for (var a = this, b = a.format, c = b.days, d = b.startDay, e = d, f = c.length, g = Fancy.Date.dayIndexes, h = [], i = new Date, j = function(b) {
            switch (b.cls = "",
            b.rowIndex) {
            case 0:
                Number(b.value) > 20 && (b.cls += " fancy-date-picker-cell-out-range");
                break;
            case 4:
            case 5:
                Number(b.value) < 15 && (b.cls += " fancy-date-picker-cell-out-range")
            }
            var c = a.date
              , d = a.showDate;
            return i.getMonth() === d.getMonth() && i.getFullYear() === d.getFullYear() && b.value === i.getDate() && (0 === b.rowIndex ? b.value < 20 && (b.cls += " " + a.todayCellCls) : 4 === b.rowIndex || 5 === b.rowIndex ? b.value > 20 && (b.cls += " " + a.todayCellCls) : b.cls += " " + a.todayCellCls),
            c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear() && b.value === c.getDate() && (0 === b.rowIndex ? b.value < 20 && (b.cls += " " + a.activeCellCls) : 4 === b.rowIndex || 5 === b.rowIndex ? b.value > 20 && (b.cls += " " + a.activeCellCls) : b.cls += " " + a.activeCellCls),
            b
        }; f > e; e++)
            h.push({
                index: g[e],
                title: c[e][0].toLocaleUpperCase(),
                render: j
            });
        for (e = 0,
        f = d; f > e; e++)
            h.push({
                index: g[e],
                title: c[e][0].toLocaleUpperCase(),
                render: j
            });
        a.columns = h
    },
    getDataFields: function() {
        for (var a = this, b = [], c = a.format, d = c.days, e = c.startDay, f = e, g = d.length, h = Fancy.Date.dayIndexes; g > f; f++)
            b.push(h[f]);
        for (f = 0,
        g = e; g > f; f++)
            b.push(h[f]);
        return b
    },
    setData: function() {
        for (var a = this, b = a.format, c = b.startDay, d = a.showDate, e = Fancy.Date.getDaysInMonth(d), f = Fancy.Date.getFirstDayOfMonth(d), g = [], h = a.getDataFields(), i = 0, j = e, k = 0; j > i; i++) {
            var l = i + f - c + k;
            0 > l && (l = 7 - c,
            k = l + 1),
            0 === l && (l = 7,
            k = l),
            g[l] = i + 1
        }
        var m = d.getMonth()
          , n = d.getFullYear()
          , o = d.getDate()
          , p = d.getHours()
          , q = d.getMinutes()
          , r = d.getSeconds()
          , s = d.getMilliseconds();
        0 === m ? (m = 11,
        n--) : m--;
        var t = new Date(n,m,o,p,q,r,s)
          , u = Fancy.Date.getDaysInMonth(t);
        for (i = 7; i--; )
            void 0 === g[i] && (g[i] = u,
            u--);
        for (var i = 28, j = 42, v = 1; j > i; i++)
            void 0 === g[i] && (g[i] = v,
            v++);
        for (var w = [], i = 0, j = 6; j > i; i++)
            w[i] = g.splice(0, 7);
        return {
            fields: h,
            items: w
        }
    },
    initBars: function() {
        var a = this;
        a.initTBar(),
        a.initBBar()
    },
    initTBar: function() {
        var a = this
          , b = [];
        b.push({
            cls: "fancy-picker-button-back",
            handler: a.onBackClick,
            scope: a,
            style: {}
        }),
        b.push({
            cls: "fancy-picker-button-date",
            wrapper: {
                cls: "fancy-picker-button-date-wrapper"
            },
            handler: a.onDateClick,
            scope: a,
            text: "                       "
        }),
        b.push("side"),
        b.push({
            cls: "fancy-picker-button-next",
            handler: a.onNextClick,
            scope: a
        }),
        a.tbar = b
    },
    initBBar: function() {
        var a = this
          , b = [];
        b.push({
            text: a.format.today,
            cls: "fancy-picker-button-today",
            wrapper: {
                cls: "fancy-picker-button-today-wrapper"
            },
            handler: a.onClickToday,
            scope: a
        }),
        a.bbar = b
    },
    onBackClick: function() {
        var a = this
          , b = a.showDate
          , c = b.getMonth()
          , d = b.getFullYear()
          , e = b.getDate()
          , f = b.getHours()
          , g = b.getMinutes()
          , h = b.getSeconds()
          , i = b.getMilliseconds();
        0 === c ? (c = 11,
        d--) : c--,
        a.showDate = new Date(d,c,e,f,g,h,i);
        var j = a.setData();
        a.store.setData(j.items),
        a.update()
    },
    onNextClick: function() {
        var a = this
          , b = a.showDate
          , c = b.getMonth()
          , d = b.getFullYear()
          , e = b.getDate()
          , f = b.getHours()
          , g = b.getMinutes()
          , h = b.getSeconds()
          , i = b.getMilliseconds();
        11 === c ? (c = 0,
        d++) : c++,
        a.showDate = new Date(d,c,e,f,g,h,i);
        var j = a.setData();
        a.store.setData(j.items),
        a.update()
    },
    onUpdate: function() {
        var a = this
          , b = Fancy.Date.format(a.showDate, "F Y", {
            date: a.format
        });
        a.tbar[1].setText(b)
    },
    onClickToday: function() {
        var a = this
          , b = new Date;
        a.showDate = b,
        a.date = b;
        var c = a.setData();
        a.store.setData(c.items),
        a.update()
    },
    onCellClick: function(a, b) {
        var c, d = this, e = d.showDate, f = e.getFullYear(), g = e.getMonth(), h = e.getHours(), i = e.getMinutes(), j = e.getSeconds(), k = e.getMilliseconds(), l = d.activeCellCls, m = Fancy.get(b.cell);
        if (d.date = new Date(f,g,Number(b.value),h,i,j,k),
        d.el.select("." + l).removeClass(l),
        m.addClass(l),
        d.fire("changedate", d.date),
        m.hasClass(d.outRangeCellCls)) {
            c = Number(b.value),
            b.rowIndex < 3 ? 0 === g ? (f--,
            g = 11) : g-- : 11 === g ? (f++,
            g = 11) : g++,
            d.date = new Date(f,g,c,h,i,j,k),
            d.showDate = d.date;
            var n = d.setData();
            d.store.setData(n.items),
            d.update()
        }
    },
    onMouseWheel: function(a) {
        var b = this
          , c = Fancy.getWheelDelta(a.originalEvent || a);
        0 > c ? b.onBackClick() : b.onNextClick()
    },
    onDateClick: function() {
        var a = this;
        a.initMonthPicker(),
        a.monthPicker.panel.css("display", "block"),
        Fancy.$.fn.animate ? a.monthPicker.panel.el.animate({
            top: "0px"
        }) : a.monthPicker.panel.css({
            top: "0px"
        })
    },
    onMonthCancelClick: function() {
        var a = this;
        a.hideMonthPicker()
    },
    onMonthOkClick: function() {
        var a = this
          , b = a.monthPicker.date
          , c = b.getMonth()
          , d = b.getFullYear()
          , e = a.date.getDate()
          , f = a.date.getHours()
          , g = a.date.getMinutes()
          , h = a.date.getSeconds()
          , i = a.date.getMilliseconds();
        a.hideMonthPicker(),
        a.date = new Date(d,c,e,f,g,h,i),
        a.showDate = a.date;
        var j = a.setData();
        a.store.setData(j.items),
        a.update(),
        a.fire("changedate", a.date, !1)
    },
    hideMonthPicker: function() {
        var a = this
          , b = a.monthPicker.panel.el;
        Fancy.$.fn.animate ? b.animate({
            top: "-" + b.css("height")
        }, {
            complete: function() {
                b.css("display", "none")
            }
        }) : b.css("display", "none")
    },
    onMouseDown: function(a) {
        a.preventDefault()
    },
    setDate: function(a) {
        var b = this;
        b.date = a,
        b.showDate = a,
        b.store.setData(b.setData().items),
        b.update()
    }
}),
Fancy.define(["Fancy.picker.Month", "Fancy.MonthPicker"], {
    extend: Fancy.Grid,
    type: "monthpicker",
    mixins: ["Fancy.grid.mixin.Grid", Fancy.panel.mixin.PrepareConfig, Fancy.panel.mixin.methods, "Fancy.grid.mixin.PrepareConfig", "Fancy.grid.mixin.ActionColumn", "Fancy.grid.mixin.Edit"],
    width: 308,
    height: 299,
    frame: !1,
    cellHeight: 37,
    i18n: "en",
    cellTrackOver: !0,
    cellStylingCls: ["fancy-month-picker-cell-active"],
    activeCellCls: "fancy-month-picker-cell-active",
    defaults: {
        type: "string",
        width: 76,
        align: "center",
        cellAlign: "center"
    },
    gridBorders: [1, 0, 1, 1],
    panelBodyBorders: [0, 0, 0, 0],
    header: !1,
    constructor: function(a) {
        var b = this
          , a = a || {};
        Fancy.apply(b, a),
        b.initLang(),
        b.initColumns(),
        b.initDate(),
        b.initData(),
        b.initBars(),
        b.Super("constructor", [b])
    },
    init: function() {
        var a = this;
        a.Super("init", arguments),
        a.addEvents("cancelclick", "okclick"),
        a.addEvents("changedate"),
        a.on("cellclick", a.onCellClick, a),
        a.panel.addClass("fancy-month-picker")
    },
    initData: function() {
        var a = this;
        a.data = a.setData()
    },
    initDate: function() {
        var a = this;
        void 0 === a.date && (a.date = new Date),
        a.showDate = a.date
    },
    initLang: function() {
        var a = this;
        if (!a.lang) {
            var b = a.i18n
              , c = Fancy.Object.copy(Fancy.i18n[b]);
            a.lang = c
        }
    },
    initColumns: function() {
        var a = this
          , b = a.lang.date
          , c = b.days
          , d = (b.startDay,
        c.length,
        Fancy.Date.dayIndexes,
        [])
          , e = (new Date,
        a.activeCellCls)
          , f = function(b) {
            var c = a.date
              , d = c.getMonth();
            return a.lang.date.months[d].substr(0, 3) === b.value && (b.cls = e),
            b
        }
          , g = function(b) {
            var c = a.date
              , d = c.getFullYear();
            return d === Number(b.value) && (b.cls = e),
            b
        };
        d = [{
            index: "month1",
            render: f,
            locked: !0
        }, {
            index: "month2",
            render: f,
            locked: !0,
            width: 77
        }, {
            index: "year1",
            render: g,
            width: 77
        }, {
            index: "year2",
            render: g,
            width: 77
        }],
        a.columns = d
    },
    setData: function() {
        var a, b, c = this, d = c.lang, e = c.showDate, f = e.getFullYear(), g = d.date.months, h = [], i = [];
        for (a = 0,
        b = 12; b > a; a++)
            i.push(f - 5 + a);
        for (a = 0,
        b = 6; b > a; a++)
            h[a] = {},
            h[a].month1 = g[a].substr(0, 3),
            h[a].month2 = g[6 + a].substr(0, 3),
            h[a].year1 = i[a],
            h[a].year2 = i[6 + a];
        return {
            fields: ["month1", "month2", "year1", "year2"],
            items: h
        }
    },
    initBars: function() {
        var a = this;
        a.initTBar(),
        a.initBBar()
    },
    initTBar: function() {
        var a = this
          , b = [];
        b.push("side"),
        b.push({
            cls: "fancy-picker-button-back",
            handler: a.onBackClick,
            scope: a
        }),
        b.push({
            cls: "fancy-picker-button-next",
            handler: a.onNextClick,
            scope: a
        }),
        a.tbar = b
    },
    initBBar: function() {
        var a = this
          , b = []
          , c = a.lang;
        b.push({
            type: "wrapper",
            cls: "fancy-month-picker-action-buttons",
            items: [{
                text: c.date.ok,
                handler: a.onClickOk,
                scope: a
            }, {
                text: c.date.cancel,
                handler: a.onClickCancel,
                scope: a
            }]
        }),
        a.bbar = b
    },
    onBackClick: function() {
        var a = this
          , b = a.showDate
          , c = b.getFullYear()
          , d = b.getMonth()
          , e = b.getDate()
          , f = b.getHours()
          , g = b.getMinutes()
          , h = b.getSeconds()
          , i = b.getMilliseconds();
        c -= 10,
        a.showDate = new Date(c,d,e,f,g,h,i);
        var j = a.setData();
        a.store.setData(j.items),
        a.update()
    },
    onNextClick: function() {
        var a = this
          , b = a.showDate
          , c = b.getFullYear()
          , d = b.getMonth()
          , e = b.getDate()
          , f = b.getHours()
          , g = b.getMinutes()
          , h = b.getSeconds()
          , i = b.getMilliseconds();
        c += 10,
        a.showDate = new Date(c,d,e,f,g,h,i);
        var j = a.setData();
        a.store.setData(j.items),
        a.update()
    },
    onClickOk: function() {
        var a = this;
        a.fire("okclick")
    },
    onClickCancel: function() {
        var a = this;
        a.fire("cancelclick")
    },
    onCellClick: function(a, b) {
        var c, d = this, e = d.date, f = e.getFullYear(), g = e.getMonth(), h = e.getDate(), i = e.getHours(), j = e.getMinutes(), k = e.getSeconds(), l = e.getMilliseconds(), m = d.activeCellCls, n = Fancy.get(b.cell);
        "center" === b.side ? (c = d.body,
        f = Number(b.value)) : (c = d.leftBody,
        g = b.rowIndex + 6 * b.columnIndex),
        c.el.select("." + m).removeClass(m),
        n.addClass(m),
        d.showDate = new Date(f,g,h,i,j,k,l),
        d.date = d.showDate,
        d.fire("changedate", d.date)
    },
    onMouseWheel: function(a) {
        var b = this
          , c = Fancy.getWheelDelta(a.originalEvent || a);
        0 > c ? b.onBackClick() : b.onNextClick()
    },
    onDateClick: function() {
        var a = this;
        a.initMonthPicker()
    }
}),
Fancy.define("Fancy.spark.ProgressDonut", {
    svgns: "http://www.w3.org/2000/svg",
    sum: 100,
    prefix: "fancy-spark-progress-donut-",
    constructor: function(a) {
        var b = this;
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.initId(),
        a.initChart(),
        a.setSize(),
        a.setRadius(),
        a.setInnerRadius(),
        a.setParams(),
        a.iniColors(),
        a.preRender(),
        a.render(),
        a.inited !== !0 && (a.renderTo.appendChild(a.chart),
        a.ons())
    },
    initId: function() {
        var a = this
          , b = a.prefix || Fancy.prefix;
        a.id = a.id || Fancy.id(null, b),
        Fancy.addWidget(a.id, a)
    },
    ons: function() {
        var a = this;
        a.el.on("mouseenter", a.onMouseEnter, a),
        a.el.on("mouseleave", a.onMouseLeave, a),
        a.el.on("mousemove", a.onMouseMove, a)
    },
    onMouseEnter: function() {
        var a = this
          , b = a.el.attr("value");
        if (a.tipTpl) {
            var c = new Fancy.Template(a.tipTpl);
            b = c.getHTML({
                value: b
            })
        }
        a.tooltip = new Fancy.ToolTip({
            text: '<span style="color: ' + a.color + ';">●</span> ' + b
        })
    },
    onMouseLeave: function() {
        var a = this;
        a.tooltip.destroy()
    },
    onMouseMove: function(a) {
        var b = this;
        b.tooltip && (b.tooltip.css("display", "block"),
        b.tooltip.show(a.pageX + 15, a.pageY - 25))
    },
    iniColors: function() {
        var a = this;
        a.value < 0 ? (a.backColor = "#F9DDE0",
        a.color = "#EA7369") : (a.backColor = "#eee",
        a.color = "#44A4D3")
    },
    preRender: function() {
        var a = this
          , b = a.size
          , c = a.chart;
        c.setAttribute("width", b),
        c.setAttribute("height", b),
        c.setAttribute("viewBox", "0 0 " + b + " " + b)
    },
    render: function() {
        var a = this;
        a.renderBack(),
        a.renderProgress()
    },
    renderBack: function() {
        var a = this
          , b = a.radius
          , c = a.innerRadius
          , d = ["M", a.cx, a.y1, "A", b, b, 0, 1, 1, a.x2, a.y1, "L", a.x2, a.y2, "A", c, c, 0, 1, 0, a.cx, a.y2].join(" ")
          , e = document.createElementNS(a.svgns, "path");
        e.setAttribute("d", d),
        e.setAttribute("fill", a.backColor),
        a.chart.appendChild(e)
    },
    renderProgress: function() {
        var a = this
          , b = (a.size,
        a.radius)
          , c = a.innerRadius
          , d = document.createElementNS(a.svgns, "path")
          , e = (2 * Math.PI / 100,
        a.value)
          , f = 0;
        e > 99 && (e = 99.99999),
        -99 > e && (e = 99.99999),
        0 > e && (f = 100 + e,
        e *= -1);
        var g = e / a.sum
          , h = f + e
          , i = ["M"].concat(a.scale(f, b), "A", b, b, 0, g > .5 ? 1 : 0, 1, a.scale(h, b), "L");
        c ? i = i.concat(a.scale(h, c), "A", c, c, 0, g > .5 ? 1 : 0, 0, a.scale(f, c)) : i.push(cx, cy),
        i = i.join(" "),
        d.setAttribute("d", i),
        d.setAttribute("fill", a.color),
        a.chart.appendChild(d)
    },
    initChart: function() {
        var a = this
          , b = Fancy.get(a.renderTo);
        a.renderTo = Fancy.get(a.renderTo).dom,
        0 === b.select("svg").length ? a.chart = document.createElementNS(a.svgns, "svg:svg") : (a.chart = b.select("svg").dom,
        a.chart.innerHTML = "",
        a.inited = !0),
        a.el = Fancy.get(a.chart),
        a.el.attr("id", a.id),
        a.value < 1 && a.value > 0 ? a.el.attr("value", a.value.toFixed(1)) : a.value > -1 && a.value < 0 ? a.el.attr("value", a.value.toFixed(1)) : a.el.attr("value", a.value.toFixed(0))
    },
    scale: function(a, b) {
        var c = this
          , d = Math.PI
          , e = c.sum
          , f = a / e * d * 2 - d / 2;
        return [b * Math.cos(f) + c.cx, b * Math.sin(f) + c.cy]
    },
    radians: function(a) {
        return a * Math.PI / 180
    },
    setSize: function() {
        var a = this;
        a.width = a.width || a.height || a.size || 30,
        a.height = a.height || a.width || a.size || 30,
        a.size = a.size || a.height
    },
    setRadius: function() {
        var a = this;
        a.radius = a.radius || a.height / 2
    },
    setInnerRadius: function() {
        var a = this;
        a.innerRadius = a.innerRadius || a.height / 2 - a.height / 4
    },
    setParams: function() {
        var a = this
          , b = (a.size,
        a.radius)
          , c = a.innerRadius
          , d = a.height
          , e = a.width;
        a.cy = d / 2,
        a.y1 = a.cy - b,
        a.y2 = a.cy - c,
        a.cx = e / 2,
        a.x2 = a.cx - .01
    }
}),
Fancy.define("Fancy.spark.GrossLoss", {
    maxValue: 100,
    tipTpl: '<span style="color: {color};">●</span> {value} {suffix}',
    constructor: function(a) {
        var b = this;
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.preRender(),
        a.render(),
        a.inited !== !0 && a.ons()
    },
    ons: function() {
        var a = this;
        a.el.on("mouseenter", a.onMouseEnter, a),
        a.el.on("mouseleave", a.onMouseLeave, a),
        a.el.on("mousemove", a.onMouseMove, a)
    },
    onMouseEnter: function() {
        var a, b = this, c = b.el.attr("value"), d = b.el.css("background-color"), e = "";
        b.percents && (e = " %");
        var f = new Fancy.Template(b.tipTpl);
        a = f.getHTML({
            value: c,
            color: d,
            suffix: e
        }),
        b.tooltip = new Fancy.ToolTip({
            text: a
        })
    },
    onMouseLeave: function() {
        var a = this;
        a.tooltip.destroy()
    },
    onMouseMove: function(a) {
        var b = this;
        b.tooltip.el.css("display", "block"),
        b.tooltip.show(a.pageX + 15, a.pageY - 25)
    },
    preRender: function() {},
    render: function() {
        var a = this
          , b = a.column
          , c = b.width
          , d = c / a.maxValue
          , e = 0
          , f = 0
          , g = a.value
          , h = "";
        0 > g ? (e = -g * d / 2,
        a.lossColor && (h = "background-color:" + a.lossColor + ";"),
        g = '<div class="fancy-grid-grossloss-loss" style="' + h + "width:" + e + '%">&nbsp;</div>') : (f = g * d / 2,
        a.grossColor && (h = "background-color:" + a.grossColor + ";"),
        g = '<div class="fancy-grid-grossloss-gross" style="' + h + "width:" + f + '%">&nbsp;</div>'),
        a.renderTo.innerHTML = g,
        a.value < 0 ? a.el = Fancy.get(a.renderTo).select(".fancy-grid-grossloss-loss").item(0) : a.el = Fancy.get(a.renderTo).select(".fancy-grid-grossloss-gross").item(0),
        a.el.attr("value", a.value.toFixed(2))
    }
}),
Fancy.define("Fancy.spark.ProgressBar", {
    tipTpl: "{value} {suffix}",
    constructor: function(a) {
        var b = this;
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.initId(),
        a.render(),
        a.inited !== !0 && a.ons()
    },
    initId: function() {
        var a = this
          , b = a.prefix || Fancy.prefix;
        a.id = a.id || Fancy.id(null, b),
        Fancy.addWidget(a.id, a)
    },
    ons: function() {
        var a = this;
        a.tip !== !1 && (a.el.on("mouseenter", a.onMouseEnter, a),
        a.el.on("mouseleave", a.onMouseLeave, a),
        a.el.on("mousemove", a.onMouseMove, a))
    },
    onMouseEnter: function() {
        var a = this
          , b = a.el.attr("value")
          , c = "%";
        a.percents === !1 && (c = "");
        var d = new Fancy.Template(a.tipTpl)
          , e = d.getHTML({
            value: b,
            suffix: c
        });
        Fancy.tip.update(e)
    },
    onMouseLeave: function() {
        Fancy.tip.hide(1e3)
    },
    onMouseMove: function(a) {
        Fancy.tip.show(a.pageX + 15, a.pageY - 25)
    },
    render: function() {
        var a, b = this, c = b.column, d = c.width - 18, e = d / b.maxValue, f = b.value * e, g = b.value, h = c.sparkConfig;
        g = b.percents === !1 ? b.value : 1 > g ? b.value.toFixed(1) : b.value.toFixed(0);
        var i = "&nbsp;"
          , j = ""
          , k = "";
        if (h.label)
            switch (h.label.type) {
            case "left":
                i = '<div class="fancy-grid-bar-label" style="float: left;">' + g + "</div>",
                f < 7 * String(g).length && (i = "&nbsp;",
                j = '<div class="fancy-grid-bar-label-out" style="">' + g + "</div>");
                break;
            case "right":
                i = '<div class="fancy-grid-bar-label" style="float: right;">' + g + "</div>",
                f < 7 * String(g).length && (i = "&nbsp;",
                j = "right" === h.align ? '<div class="fancy-grid-bar-label-out-left" style="">' + g + "</div>" : '<div class="fancy-grid-bar-label-out" style="">' + g + "</div>");
                break;
            default:
                i = '<div class="fancy-grid-bar-label" style="float: left;">' + g + "</div>",
                f < 7 * String(g).length && (i = "&nbsp;",
                k = '<div class="fancy-grid-bar-label-out-left" style="">' + g + "</div>")
            }
        var l = "width:" + f + "px;"
          , m = "";
        if (h.align && (m = "float:" + h.align + ";"),
        a = '<div id="' + b.id + '" value="' + g + '" class="fancy-grid-column-progress-bar" style="' + l + m + '">' + i + "</div>" + j + k,
        b.renderTo.innerHTML = a,
        b.el = Fancy.get(b.renderTo).select(".fancy-grid-column-progress-bar").item(0),
        Fancy.isFunction(b.style)) {
            var n = b.style({
                value: b.value,
                column: b.column,
                rowIndex: b.rowIndex,
                data: b.data
            });
            b.el.css(n)
        }
    },
    update: function() {
        var a = this
          , b = a.column
          , c = b.width - 18
          , d = c / a.maxValue
          , e = a.value * d
          , f = b.sparkConfig;
        a.el.css("width", e),
        a.el.attr("value", a.value),
        f.label
    }
}),
Fancy.define("Fancy.spark.HBar", {
    tipTpl: "{value}",
    maxValue: 100,
    stacked: !1,
    fullStack: !1,
    constructor: function(a) {
        var b = this;
        Fancy.apply(b, a),
        b.init()
    },
    init: function() {
        var a = this;
        a.initId(),
        a.render(),
        a.inited !== !0 && a.ons()
    },
    initId: function() {
        var a = this
          , b = a.prefix || Fancy.prefix;
        a.id = a.id || Fancy.id(null, b),
        Fancy.addWidget(a.id, a)
    },
    ons: function() {
        var a = this;
        a.tip !== !1 && (a.el.on("mouseenter", a.onMouseEnter, a, ".fancy-grid-column-h-bar-node"),
        a.el.on("mouseleave", a.onMouseLeave, a, ".fancy-grid-column-h-bar-node"),
        a.el.on("mousemove", a.onMouseMove, a, ".fancy-grid-column-h-bar-node"))
    },
    onMouseEnter: function(a) {
        var b = this
          , c = Fancy.get(a.target)
          , d = c.attr("key")
          , e = c.attr("title")
          , f = Number(c.attr("value"))
          , g = Number(c.attr("percents"));
        if (b.tipFormat) {
            var h = {
                value: f,
                percents: g,
                key: d,
                column: b.column,
                data: b.data,
                title: e
            };
            f = b.tipFormat(h)
        }
        var i = new Fancy.Template(b.tipTpl)
          , j = i.getHTML({
            value: f
        });
        Fancy.tip.update(j)
    },
    onMouseLeave: function() {
        Fancy.tip.hide(1e3)
    },
    onMouseMove: function(a) {
        Fancy.tip.show(a.pageX + 15, a.pageY - 25)
    },
    render: function() {
        var a, b, c = this, d = c.column, e = d.width - 18, f = e / 100, g = d.index, h = 0, i = d.disabled || {}, j = "", k = "", l = 2, m = 0, n = g.length;
        if (d.fields)
            for (n = d.fields.length; n > m; m++) {
                var o = d.index + "." + d.fields[m];
                i[o] || (h += c.data[d.index][o])
            }
        else
            for (; n > m; m++) {
                var o = g[m];
                i[o] || (h += c.data[o])
            }
        c.stacked ? c.fullStack || (h = c.maxValue) : (h = c.maxItemValue,
        j = "line-height:" + ((c.height - 1) / g.length - l) + "px;"),
        a = h / 100,
        m = 0;
        var p = "fancy-spark-hbar";
        for (c.stacked && (p += " fancy-spark-stacked "),
        b = '<div id="' + c.id + '" class="' + p + '">'; n > m; m++) {
            if (d.fields)
                var o = d.fields[m]
                  , q = c.data[d.index][o];
            else
                var o = g[m]
                  , q = c.data[o];
            var r = q / a
              , s = r * f;
            if (!i[o]) {
                0 !== m && s--,
                c.stacked || (k = 0 === m ? "margin-top:" + l + "px;" : "margin-top:" + l + "px;"),
                s > 0 && 1 > s && (s = 2);
                var t = "background: " + Fancy.COLORS[m] + ";"
                  , u = "width:" + s + ";"
                  , v = ""
                  , w = 'title=""';
                0 === s && (v = "display: none;"),
                c.title && (w = 'title="' + c.title[m] + '" ');
                var x = 'key="' + o + '" ';
                q = 'value="' + q + '" ';
                var y = 'percents="' + r + '" ';
                b += "<div " + w + x + q + y + '" class="fancy-grid-column-h-bar-node" style="' + v + u + t + j + k + '">&nbsp;</div>'
            }
        }
        b += "</div>",
        c.renderTo.innerHTML = b,
        c.el = Fancy.get(c.renderTo)
    },
    update: function(a) {
        var b, c, d = this, e = d.column, f = e.width - 18, g = f / 100, h = e.index, i = 0, j = e.disabled || {}, k = 2;
        d.data = a;
        var l = 0
          , m = h.length
          , n = 0;
        if (e.fields)
            for (m = e.fields.length; m > l; l++) {
                var o = e.fields[l];
                j[e.index + "." + o] ? n++ : i += d.data[e.index][o]
            }
        else
            for (; m > l; l++) {
                var o = h[l];
                j[o] ? n++ : i += d.data[o]
            }
        for (d.stacked ? d.fullStack || (i = d.maxValue) : (i = d.maxItemValue,
        c = (d.height - 1) / (h.length - n) - k),
        b = i / 100,
        l = 0; m > l; l++) {
            if (e.fields)
                var o = e.fields[l]
                  , p = d.data[e.index][o];
            else
                var o = h[l]
                  , p = d.data[o];
            var q = p / b
              , r = q * g
              , s = d.el.select('.fancy-grid-column-h-bar-node[key="' + o + '"]');
            e.fields && j[e.index + "." + o] ? (s.css("width", "0px"),
            s.hide()) : j[o] ? (s.css("width", "0px"),
            s.hide()) : (0 !== l && r--,
            d.stacked || (s.css("line-height", c + "px"),
            0 === l ? s.css("margin-top", k + "px") : s.css("margin-top", k + "px")),
            0 === r || -1 === r ? s.css("display", "none") : s.css("display", "block"),
            r > 0 && 2 > r && (r = 2),
            s.animate({
                duration: 2,
                width: r
            }))
        }
    }
}),
Fancy.define("Fancy.ToolTip", {
    extend: Fancy.Widget,
    constructor: function(a) {
        var b = this;
        b.Super("const", arguments)
    },
    init: function() {
        var a = this;
        a.initTpl(),
        a.render()
    },
    tpl: ['<div class="fancy-tooltip-inner">{text}</div>'],
    widgetCls: "fancy-tooltip",
    cls: "",
    extraCls: "",
    initTpl: function() {
        var a = this;
        a.tpl = new Fancy.Template(a.tpl)
    },
    render: function() {
        var a = this
          , b = Fancy.get(a.renderTo || document.body).dom
          , c = Fancy.get(document.createElement("div"));
        c.addClass(Fancy.cls),
        c.addClass(a.widgetCls),
        c.addClass(a.cls),
        c.addClass(a.extraCls),
        c.update(a.tpl.getHTML({
            text: a.text
        })),
        a.el = Fancy.get(b.appendChild(c.dom))
    },
    show: function(a, b) {
        var c = this;
        c.timeout && (clearInterval(c.timeout),
        delete c.timeout),
        "none" === c.css("display") && c.css({
            display: "block"
        }),
        c.css({
            left: a,
            top: b
        })
    },
    hide: function(a) {
        var b = this;
        b.timeout && (clearInterval(b.timeout),
        delete b.timeout),
        a ? b.timeout = setTimeout(function() {
            b.el.hide()
        }, a) : b.el.hide()
    },
    destroy: function() {
        var a = this;
        a.el.destroy()
    },
    update: function(a) {
        this.el.select(".fancy-tooltip-inner").update(a)
    }
}),
Fancy.tip = {
    update: function(a) {
        Fancy.tip = new Fancy.ToolTip({
            text: a
        })
    },
    show: function(a, b) {
        Fancy.tip = new Fancy.ToolTip({
            text: " "
        }),
        Fancy.tip.show(a, b)
    },
    hide: function() {
        Fancy.tip = new Fancy.ToolTip({
            text: " "
        })
    }
},
function() {
    "use strict";
    function a(b, d) {
        function e(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        }
        var f;
        if (d = d || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = d.touchBoundary || 10,
        this.layer = b,
        this.tapDelay = d.tapDelay || 200,
        this.tapTimeout = d.tapTimeout || 700,
        !a.notNeeded(b)) {
            for (var g = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], h = this, i = 0, j = g.length; j > i; i++)
                h[g[i]] = e(h[g[i]], h);
            c && (b.addEventListener("mouseover", this.onMouse, !0),
            b.addEventListener("mousedown", this.onMouse, !0),
            b.addEventListener("mouseup", this.onMouse, !0)),
            b.addEventListener("click", this.onClick, !0),
            b.addEventListener("touchstart", this.onTouchStart, !1),
            b.addEventListener("touchmove", this.onTouchMove, !1),
            b.addEventListener("touchend", this.onTouchEnd, !1),
            b.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (b.removeEventListener = function(a, c, d) {
                var e = Node.prototype.removeEventListener;
                "click" === a ? e.call(b, a, c.hijacked || c, d) : e.call(b, a, c, d)
            }
            ,
            b.addEventListener = function(a, c, d) {
                var e = Node.prototype.addEventListener;
                "click" === a ? e.call(b, a, c.hijacked || (c.hijacked = function(a) {
                    a.propagationStopped || c(a)
                }
                ), d) : e.call(b, a, c, d)
            }
            ),
            "function" == typeof b.onclick && (f = b.onclick,
            b.addEventListener("click", function(a) {
                f(a)
            }, !1),
            b.onclick = null)
        }
    }
    var b = navigator.userAgent.indexOf("Windows Phone") >= 0
      , c = navigator.userAgent.indexOf("Android") > 0 && !b
      , d = /iP(ad|hone|od)/.test(navigator.userAgent) && !b
      , e = d && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , f = d && /OS [6-7]_\d/.test(navigator.userAgent)
      , g = navigator.userAgent.indexOf("BB10") > 0;
    a.prototype.needsClick = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (a.disabled)
                return !0;
            break;
        case "input":
            if (d && "file" === a.type || a.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(a.className)
    }
    ,
    a.prototype.needsFocus = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !c;
        case "input":
            switch (a.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !a.disabled && !a.readOnly;
        default:
            return /\bneedsfocus\b/.test(a.className)
        }
    }
    ,
    a.prototype.sendClick = function(a, b) {
        var c, d;
        document.activeElement && document.activeElement !== a && document.activeElement.blur(),
        d = b.changedTouches[0],
        c = document.createEvent("MouseEvents"),
        c.initMouseEvent(this.determineEventType(a), !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null),
        c.forwardedTouchEvent = !0,
        a.dispatchEvent(c)
    }
    ,
    a.prototype.determineEventType = function(a) {
        return c && "select" === a.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    a.prototype.focus = function(a) {
        var b;
        d && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type && "month" !== a.type ? (b = a.value.length,
        a.setSelectionRange(b, b)) : a.focus()
    }
    ,
    a.prototype.updateScrollParent = function(a) {
        var b, c;
        if (b = a.fastClickScrollParent,
        !b || !b.contains(a)) {
            c = a;
            do {
                if (c.scrollHeight > c.offsetHeight) {
                    b = c,
                    a.fastClickScrollParent = c;
                    break
                }
                c = c.parentElement
            } while (c)
        }
        b && (b.fastClickLastScrollTop = b.scrollTop)
    }
    ,
    a.prototype.getTargetElementFromEventTarget = function(a) {
        return a.nodeType === Node.TEXT_NODE ? a.parentNode : a
    }
    ,
    a.prototype.onTouchStart = function(a) {
        var b, c, f;
        if (a.targetTouches.length > 1)
            return !0;
        if (b = this.getTargetElementFromEventTarget(a.target),
        c = a.targetTouches[0],
        d) {
            if (f = window.getSelection(),
            f.rangeCount && !f.isCollapsed)
                return !0;
            if (!e) {
                if (c.identifier && c.identifier === this.lastTouchIdentifier)
                    return a.preventDefault(),
                    !1;
                this.lastTouchIdentifier = c.identifier,
                this.updateScrollParent(b)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = a.timeStamp,
        this.targetElement = b,
        this.touchStartX = c.pageX,
        this.touchStartY = c.pageY,
        a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault(),
        !0
    }
    ,
    a.prototype.touchHasMoved = function(a) {
        var b = a.changedTouches[0]
          , c = this.touchBoundary;
        return Math.abs(b.pageX - this.touchStartX) > c || Math.abs(b.pageY - this.touchStartY) > c ? !0 : !1
    }
    ,
    a.prototype.onTouchMove = function(a) {
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a)) && (this.trackingClick = !1,
        this.targetElement = null),
        !0) : !0
    }
    ,
    a.prototype.findControl = function(a) {
        return void 0 !== a.control ? a.control : a.htmlFor ? document.getElementById(a.htmlFor) : a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    a.prototype.onTouchEnd = function(a) {
        var b, g, h, i, j, k = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (a.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0,
            !0;
        if (a.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = a.timeStamp,
        g = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        f && (j = a.changedTouches[0],
        k = document.elementFromPoint(j.pageX - window.pageXOffset, j.pageY - window.pageYOffset) || k,
        k.fastClickScrollParent = this.targetElement.fastClickScrollParent),
        h = k.tagName.toLowerCase(),
        "label" === h) {
            if (b = this.findControl(k)) {
                if (this.focus(k),
                c)
                    return !1;
                k = b
            }
        } else if (this.needsFocus(k))
            return a.timeStamp - g > 100 || d && window.top !== window && "input" === h ? (this.targetElement = null,
            !1) : (this.focus(k),
            this.sendClick(k, a),
            d && "select" === h || (this.targetElement = null,
            a.preventDefault()),
            !1);
        return d && !e && (i = k.fastClickScrollParent,
        i && i.fastClickLastScrollTop !== i.scrollTop) ? !0 : (this.needsClick(k) || (a.preventDefault(),
        this.sendClick(k, a)),
        !1)
    }
    ,
    a.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null
    }
    ,
    a.prototype.onMouse = function(a) {
        return this.targetElement ? a.forwardedTouchEvent ? !0 : a.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0,
        a.stopPropagation(),
        a.preventDefault(),
        !1) : !0 : !0
    }
    ,
    a.prototype.onClick = function(a) {
        var b;
        return this.trackingClick ? (this.targetElement = null,
        this.trackingClick = !1,
        !0) : "submit" === a.target.type && 0 === a.detail ? !0 : (b = this.onMouse(a),
        b || (this.targetElement = null),
        b)
    }
    ,
    a.prototype.destroy = function() {
        var a = this.layer;
        c && (a.removeEventListener("mouseover", this.onMouse, !0),
        a.removeEventListener("mousedown", this.onMouse, !0),
        a.removeEventListener("mouseup", this.onMouse, !0)),
        a.removeEventListener("click", this.onClick, !0),
        a.removeEventListener("touchstart", this.onTouchStart, !1),
        a.removeEventListener("touchmove", this.onTouchMove, !1),
        a.removeEventListener("touchend", this.onTouchEnd, !1),
        a.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    a.notNeeded = function(a) {
        var b, d, e, f;
        if ("undefined" == typeof window.ontouchstart)
            return !0;
        if (d = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!c)
                return !0;
            if (b = document.querySelector("meta[name=viewport]")) {
                if (-1 !== b.content.indexOf("user-scalable=no"))
                    return !0;
                if (d > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (g && (e = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
        e[1] >= 10 && e[2] >= 3 && (b = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== b.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === a.style.msTouchAction || "manipulation" === a.style.touchAction ? !0 : (f = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1],
        f >= 27 && (b = document.querySelector("meta[name=viewport]"),
        b && (-1 !== b.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === a.style.touchAction || "manipulation" === a.style.touchAction ? !0 : !1)
    }
    ,
    a.attach = function(b, c) {
        return new a(b,c)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return a
    }) : "undefined" != typeof module && module.exports ? (module.exports = a.attach,
    module.exports.FastClick = a) : window.FastClick = a
}(),
Fancy.enableCompo = function() {
    function a() {
        if (0 !== e)
            for (var a in f) {
                var c, g, h = f[a], i = d.querySelectorAll(a), j = h.appPreSelector ? h.appPreSelector + "-" : "data-", k = h.preSelector ? h.preSelector + "-" : "fancy-", l = 0, m = i.length;
                if (0 === i.length)
                    return;
                for (; m > l; l++) {
                    var n = {}
                      , o = i[l]
                      , p = o.id || "rand-id-" + +new Date
                      , q = o.attributes;
                    for (c = 0,
                    g = q.length; g > c; c++) {
                        var r = q[c]
                          , s = r.name
                          , t = r.value;
                        new RegExp(j).test(s) && (t = b(t),
                        n[s.replace(j, "")] = t)
                    }
                    !function() {
                        var a = o.getElementsByTagName("*");
                        for (c = 0,
                        g = a.length; g > c; c++) {
                            var d, e, f = a[c], h = f.tagName.toLowerCase();
                            new RegExp(k).test(h) && (d = h.replace(k, ""),
                            e = b(f.innerHTML),
                            n[d.replace(j, "")] = e)
                        }
                    }(o, n),
                    o.outerHTML = '<div id="' + p + '"></div>',
                    h.init(d.getElementById(p), n)
                }
            }
    }
    function b(a) {
        return /\[/.test(a) || /\{/.test(a) ? (a = a.replace(/\n/g, ""),
        a = new Function("return " + a + ";")()) : a = isNaN(Number(a)) ? a.replace(/\n/g, "") : Number(a),
        a
    }
    var c, d = document, e = 0, f = {};
    Fancy.Component = function(a, b) {
        e++,
        f[a] = b
    }
    ,
    Fancy.stopWatch = function() {
        clearInterval(c)
    }
    ,
    a(),
    d.addEventListener("DOMContentLoaded", function(b) {
        a()
    }),
    setTimeout(function() {
        a()
    }, 1),
    c = setInterval(function() {
        a()
    }, 250),
    Fancy.Component("fancy-grid", {
        preSelector: "fancy",
        attrPreSelector: "data",
        init: function(a, b) {
            b.renderTo = a,
            window[a.id] = new FancyGrid(b)
        }
    }),
    Fancy.Component("fancy-form", {
        preSelector: "fancy",
        attrPreSelector: "data",
        init: function(a, b) {
            b.renderTo = a,
            window[a.id] = new FancyForm(b)
        }
    }),
    Fancy.Component("fancy-tab", {
        preSelector: "fancy",
        attrPreSelector: "data",
        init: function(a, b) {
            b.renderTo = a,
            window[a.id] = new FancyTab(b)
        }
    })
}
;
