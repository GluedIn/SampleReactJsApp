"use strict";
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.FFmpegUtil = t() : e.FFmpegUtil = t(); }(self, (() => (() => {
    "use strict";
    var e = { 591: (e, t) => { Object.defineProperty(t, "__esModule", { value: !0 }), t.HeaderContentLength = void 0, t.HeaderContentLength = "Content-Length"; }, 431: (e, t) => { Object.defineProperty(t, "__esModule", { value: !0 }), t.ERROR_INCOMPLETED_DOWNLOAD = t.ERROR_RESPONSE_BODY_READER = void 0, t.ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader"), t.ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download"); }, 915: function (e, t, o) { var r = this && this.__awaiter || function (e, t, o, r) { return new (o || (o = Promise))((function (n, i) { function d(e) { try {
            l(r.next(e));
        }
        catch (e) {
            i(e);
        } } function a(e) { try {
            l(r.throw(e));
        }
        catch (e) {
            i(e);
        } } function l(e) { var t; e.done ? n(e.value) : (t = e.value, t instanceof o ? t : new o((function (e) { e(t); }))).then(d, a); } l((r = r.apply(e, t || [])).next()); })); }; Object.defineProperty(t, "__esModule", { value: !0 }), t.toBlobURL = t.downloadWithProgress = t.importScript = t.fetchFile = void 0; const n = o(431), i = o(591); t.fetchFile = e => r(void 0, void 0, void 0, (function* () { let t; if ("string" == typeof e)
            t = /data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(e) ? atob(e.split(",")[1]).split("").map((e => e.charCodeAt(0))) : yield (yield fetch(e)).arrayBuffer();
        else if (e instanceof URL)
            t = yield (yield fetch(e)).arrayBuffer();
        else {
            if (!(e instanceof File || e instanceof Blob))
                return new Uint8Array;
            t = yield (o = e, new Promise(((e, t) => { const r = new FileReader; r.onload = () => { const { result: t } = r; t instanceof ArrayBuffer ? e(new Uint8Array(t)) : e(new Uint8Array); }, r.onerror = e => { var o, r; t(Error(`File could not be read! Code=${(null === (r = null === (o = null == e ? void 0 : e.target) || void 0 === o ? void 0 : o.error) || void 0 === r ? void 0 : r.code) || -1}`)); }, r.readAsArrayBuffer(o); })));
        } var o; return new Uint8Array(t); })), t.importScript = e => r(void 0, void 0, void 0, (function* () { return new Promise((t => { const o = document.createElement("script"), r = () => { o.removeEventListener("load", r), t(); }; o.src = e, o.type = "text/javascript", o.addEventListener("load", r), document.getElementsByTagName("head")[0].appendChild(o); })); })), t.downloadWithProgress = (e, t) => r(void 0, void 0, void 0, (function* () { var o; const r = yield fetch(e); let d; try {
            const a = parseInt(r.headers.get(i.HeaderContentLength) || "-1"), l = null === (o = r.body) || void 0 === o ? void 0 : o.getReader();
            if (!l)
                throw n.ERROR_RESPONSE_BODY_READER;
            const c = [];
            let s = 0;
            for (;;) {
                const { done: o, value: r } = yield l.read(), i = r ? r.length : 0;
                if (o) {
                    if (-1 != a && a !== s)
                        throw n.ERROR_INCOMPLETED_DOWNLOAD;
                    t && t({ url: e, total: a, received: s, delta: i, done: o });
                    break;
                }
                c.push(r), s += i, t && t({ url: e, total: a, received: s, delta: i, done: o });
            }
            const f = new Uint8Array(s);
            let u = 0;
            for (const e of c)
                f.set(e, u), u += e.length;
            d = f.buffer;
        }
        catch (o) {
            console.log("failed to send download progress event: ", o), d = yield r.arrayBuffer(), t && t({ url: e, total: d.byteLength, received: d.byteLength, delta: 0, done: !0 });
        } return d; })), t.toBlobURL = (e, o, n = !1, i) => r(void 0, void 0, void 0, (function* () { const r = n ? yield (0, t.downloadWithProgress)(e, i) : yield (yield fetch(e)).arrayBuffer(), d = new Blob([r], { type: o }); return URL.createObjectURL(d); })); } }, t = {};
    return function o(r) { var n = t[r]; if (void 0 !== n)
        return n.exports; var i = t[r] = { exports: {} }; return e[r].call(i.exports, i, i.exports, o), i.exports; }(915);
})()));
