"use strict";
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.FFmpegWASM = t() : e.FFmpegWASM = t(); }(self, (() => (() => {
    "use strict";
    const e = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js";
    var t;
    !function (e) { e.LOAD = "LOAD", e.EXEC = "EXEC", e.WRITE_FILE = "WRITE_FILE", e.READ_FILE = "READ_FILE", e.DELETE_FILE = "DELETE_FILE", e.RENAME = "RENAME", e.CREATE_DIR = "CREATE_DIR", e.LIST_DIR = "LIST_DIR", e.DELETE_DIR = "DELETE_DIR", e.ERROR = "ERROR", e.DOWNLOAD = "DOWNLOAD", e.PROGRESS = "PROGRESS", e.LOG = "LOG", e.MOUNT = "MOUNT", e.UNMOUNT = "UNMOUNT"; }(t || (t = {}));
    const r = new Error("unknown message type"), a = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"), s = (new Error("called FFmpeg.terminate()"), new Error("failed to import ffmpeg-core.js"));
    let o;
    return self.onmessage = async ({ data: { id: n, type: E, data: c } }) => { const i = []; let p; try {
        if (E !== t.LOAD && !o)
            throw a;
        switch (E) {
            case t.LOAD:
                p = await (async ({ coreURL: r, wasmURL: a, workerURL: n }) => { const E = !o; try {
                    r || (r = e), importScripts(r);
                }
                catch {
                    if (r || (r = e.replace("/umd/", "/esm/")), self.createFFmpegCore = (await import(r)).default, !self.createFFmpegCore)
                        throw s;
                } const c = r, i = a || r.replace(/.js$/g, ".wasm"), p = n || r.replace(/.js$/g, ".worker.js"); return o = await self.createFFmpegCore({ mainScriptUrlOrBlob: `${c}#${btoa(JSON.stringify({ wasmURL: i, workerURL: p }))}` }), o.setLogger((e => self.postMessage({ type: t.LOG, data: e }))), o.setProgress((e => self.postMessage({ type: t.PROGRESS, data: e }))), E; })(c);
                break;
            case t.EXEC:
                p = (({ args: e, timeout: t = -1 }) => { o.setTimeout(t), o.exec(...e); const r = o.ret; return o.reset(), r; })(c);
                break;
            case t.WRITE_FILE:
                p = (({ path: e, data: t }) => (o.FS.writeFile(e, t), !0))(c);
                break;
            case t.READ_FILE:
                p = (({ path: e, encoding: t }) => o.FS.readFile(e, { encoding: t }))(c);
                break;
            case t.DELETE_FILE:
                p = (({ path: e }) => (o.FS.unlink(e), !0))(c);
                break;
            case t.RENAME:
                p = (({ oldPath: e, newPath: t }) => (o.FS.rename(e, t), !0))(c);
                break;
            case t.CREATE_DIR:
                p = (({ path: e }) => (o.FS.mkdir(e), !0))(c);
                break;
            case t.LIST_DIR:
                p = (({ path: e }) => { const t = o.FS.readdir(e), r = []; for (const a of t) {
                    const t = o.FS.stat(`${e}/${a}`), s = o.FS.isDir(t.mode);
                    r.push({ name: a, isDir: s });
                } return r; })(c);
                break;
            case t.DELETE_DIR:
                p = (({ path: e }) => (o.FS.rmdir(e), !0))(c);
                break;
            case t.MOUNT:
                p = (({ fsType: e, options: t, mountPoint: r }) => { const a = e, s = o.FS.filesystems[a]; return !!s && (o.FS.mount(s, t, r), !0); })(c);
                break;
            case t.UNMOUNT:
                p = (({ mountPoint: e }) => (o.FS.unmount(e), !0))(c);
                break;
            default: throw r;
        }
    }
    catch (e) {
        return void self.postMessage({ id: n, type: t.ERROR, data: e.toString() });
    } p instanceof Uint8Array && i.push(p.buffer), self.postMessage({ id: n, type: E, data: p }, i); }, {};
})()));
//# sourceMappingURL=814.ffmpeg.js.map
