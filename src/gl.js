/* ---------- WebGL sprite layer (off unless the address has gl=1) ----------
   What it is: the background and every cached sprite (penguins, shots, glows, shadows) are drawn by WebGL on a canvas under the game canvas; the canvas on top keeps drawing the vector parts (shapes, gradients, text) exactly as before and starts each frame empty.
   How it works: while one frame is being drawn, ctx.drawImage is swapped for a recorder. A call whose picture is a cache canvas (made once and never redrawn), with no clip and normal or additive blending, is turned into a textured quad with the transform and alpha the 2D canvas had at that moment; everything else is passed to the real drawImage. At the end of the frame all quads are drawn in a few batches.
   Why it exists: on a Pixel 7 Pro the same busy frame drew 4.55 times faster this way than all in canvas 2D (phone tester, 2026-10-19). Order is the one visible difference: sprites now sit under the vectors of the same frame, which the near-match picture gate measures. Without WebGL, or after a lost context, the game draws everything in canvas 2D as before. */
var GLX = { mode: 0, ctxT: null, ctxB: null, cvb: null, rib: false, on: false, act: false, cvs: null, gl: null, prog: null, buf: null, loc: null, data: null, n: 0, bt: [], ba: [], bn: [], nb: 0, texs: [], frame: 0, clipped: 0, stack: [], real: null, err: '', solo: 0, grad: [], stB: 0, stQ: 0, stF: 0 };
var GL_MAXQ = 768;
var GL_DEFAULT = /*{{GL_DEFAULT}}*/0;   /* 1 only in test builds made with PD_GL=1 (a phone cannot add ?gl=1 to a saved file); gl=0 in the address always turns it off */
/* which layout: 0 off, 1 = background and every cached sprite in WebGL under the vector canvas, 2 = three layers that keep the drawing order exact (an opaque canvas for everything before the penguins, WebGL for the penguins, the vector canvas on top) */
function glMode() { try { var q = location.search + location.hash, m;   /* the test launcher page picks the mode before it opens the game */
    if (window.__PD_GL === 0 || window.__PD_GL === 1 || window.__PD_GL === 2) return window.__PD_GL;
    if (/(^|[?&#])gl=0([&#]|$)/.test(q)) return 0;
    m = /(^|[?&#])gl=([12])([&#]|$)/.exec(q); return m ? +m[2] : GL_DEFAULT; } catch (e) { return 0; } }
function glWanted() { return glMode() > 0; }
function glInit() {
  var c, gl, p, vs, fs, sh;
  var mode = glMode();
  if (!mode) return false;
  try {
    c = document.createElement('canvas'); c.id = 'cvg'; c.setAttribute('aria-hidden', 'true');
    gl = c.getContext('webgl', { alpha: mode === 2, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: /(^|[?&#])qa(&|$)/.test(location.hash) });
    if (!gl) return false;
    function mk(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader'); return s; }
    vs = mk(gl.VERTEX_SHADER, 'attribute vec2 p;attribute vec2 u;attribute float a;varying vec2 vu;varying float va;void main(){gl_Position=vec4(p,0.,1.);vu=u;va=a;}');
    fs = mk(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec2 vu;varying float va;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,vu)*va;}');
    p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return false;
    gl.useProgram(p); gl.uniform1i(gl.getUniformLocation(p, 's'), 0);
    GLX.buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, GLX.buf);
    GLX.data = new Float32Array(GL_MAXQ * 30); gl.bufferData(gl.ARRAY_BUFFER, GLX.data.byteLength, gl.DYNAMIC_DRAW);
    GLX.loc = [gl.getAttribLocation(p, 'p'), gl.getAttribLocation(p, 'u'), gl.getAttribLocation(p, 'a')];
    gl.enableVertexAttribArray(GLX.loc[0]); gl.enableVertexAttribArray(GLX.loc[1]); gl.enableVertexAttribArray(GLX.loc[2]);
    gl.vertexAttribPointer(GLX.loc[0], 2, gl.FLOAT, false, 20, 0); gl.vertexAttribPointer(GLX.loc[1], 2, gl.FLOAT, false, 20, 8); gl.vertexAttribPointer(GLX.loc[2], 1, gl.FLOAT, false, 20, 16);
    gl.enable(gl.BLEND); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); if (mode === 2) gl.clearColor(0, 0, 0, 0); else gl.clearColor(0.91, 0.86, 0.72, 1);
    c.addEventListener('webglcontextlost', function (e) { e.preventDefault(); GLX.on = false; GLX.cvs.style.display = 'none'; if (GLX.cvb) GLX.cvb.style.display = 'none'; if (GLX.cvh) GLX.cvh.style.display = 'none'; ctx = GLX.ctxT; });
    GLX.cvs = c; GLX.gl = gl; GLX.prog = p; GLX.on = true; GLX.mode = mode; GLX.ctxT = ctx;
    if (mode === 2) {   /* the bottom canvas: opaque, drawn exactly as the game always drew, up to the penguins */
      GLX.cvb = document.createElement('canvas'); GLX.cvb.id = 'cvb'; GLX.cvb.setAttribute('aria-hidden', 'true');
      GLX.ctxB = GLX.cvb.getContext('2d', { alpha: false }); cv.parentNode.insertBefore(GLX.cvb, cv); GLX.cvb.width = cv.width; GLX.cvb.height = cv.height;
    }
    cv.parentNode.insertBefore(c, cv); c.width = cv.width; c.height = cv.height;
    return true;
  } catch (e) { GLX.on = false; GLX.err = String(e); return false; }
}
function glSize() { if (GLX.cvs) { GLX.cvs.width = cv.width; GLX.cvs.height = cv.height; if (GLX.cvb) { GLX.cvb.width = cv.width; GLX.cvb.height = cv.height; } if (GLX.cvh) { GLX.cvh.width = cv.width; GLX.cvh.height = cv.height; } } }
function glTex(im) {
  var gl = GLX.gl, t = im._t;
  if (t) { im._u = GLX.frame; return t; }
  t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
  im._t = t; im._u = GLX.frame; GLX.texs.push(typeof WeakRef === 'function' ? new WeakRef(im) : { deref: function () { return im; } });
  return t;
}
function glSweep() {   /* textures of pictures not drawn for 900 frames (a stage's old background, a cleared cache) are freed */
  var a = GLX.texs, i, im, out = [];
  for (i = 0; i < a.length; i++) {
    im = a[i].deref();
    if (!im) continue;   /* the canvas was collected; its texture goes with the context at the next loss, and WebGL frees unreferenced textures */
    if (GLX.frame - im._u > 900) { GLX.gl.deleteTexture(im._t); im._t = null; } else out.push(a[i]);
  }
  GLX.texs = out;
}
/* one textured quad: corners in clip space, TL TR BR BL, with their texture coordinates; add = 1 blends by adding (glows) */
function glPush(tx, add, al, ax, ay, au, av, bx, by, bu, bv, ex, ey, eu, ev, dx, dy, du, dv) {
  var X = GLX, d = X.data, o, n;
  if (X.n >= GL_MAXQ) glFlush();
  o = X.n * 30;
  d[o] = ax; d[o + 1] = ay; d[o + 2] = au; d[o + 3] = av; d[o + 4] = al;
  d[o + 5] = bx; d[o + 6] = by; d[o + 7] = bu; d[o + 8] = bv; d[o + 9] = al;
  d[o + 10] = dx; d[o + 11] = dy; d[o + 12] = du; d[o + 13] = dv; d[o + 14] = al;
  d[o + 15] = bx; d[o + 16] = by; d[o + 17] = bu; d[o + 18] = bv; d[o + 19] = al;
  d[o + 20] = ex; d[o + 21] = ey; d[o + 22] = eu; d[o + 23] = ev; d[o + 24] = al;
  d[o + 25] = dx; d[o + 26] = dy; d[o + 27] = du; d[o + 28] = dv; d[o + 29] = al;
  n = X.nb;
  if (n && X.bt[n - 1] === tx && X.ba[n - 1] === add) X.bn[n - 1]++;
  else { X.bt[n] = tx; X.ba[n] = add; X.bn[n] = 1; X.nb = n + 1; }
  X.n++;
}
/* the light overlay (layout 2): a transparent canvas above the vector canvas, blended by adding, made the first time a glow is drawn after the penguins; false where the browser cannot add-blend a layer */
function glHalo() {
  var X = GLX, c;
  if (X.cvh) return true;
  if (X.haloNo) return false;
  try {
    if (!(window.CSS && CSS.supports && CSS.supports('mix-blend-mode', 'plus-lighter'))) { X.haloNo = 1; return false; }
    c = document.createElement('canvas'); c.id = 'cvh'; c.setAttribute('aria-hidden', 'true'); c.style.mixBlendMode = 'plus-lighter'; c.style.pointerEvents = 'none';
    c.width = cv.width; c.height = cv.height; X.ctxH = c.getContext('2d'); cv.parentNode.insertBefore(c, cv.nextSibling); X.cvh = c; return true;
  } catch (e) { X.haloNo = 1; return false; }
}
function glDrawImage(im, x, y, w, h) {
  var g = this, X = GLX, m, a, b, c, e, f, k, cw, ch, add, n = arguments.length;
  k = im._gl;
  if (k === undefined) k = im._gl = (im.nodeName === 'CANVAS' && im !== cv && im !== standC && im.width <= 4096 && im.height <= 4096) ? 1 : 0;   /* every cache canvas the game makes is drawn once and never changed; the stand canvas is redrawn in place and the main canvas is the vector layer, so those two stay in canvas 2D */
  if (!k || X.clipped || (n !== 5 && n !== 3) || !X.on) return X.real.apply(g, arguments);
  add = g.globalCompositeOperation;
  if (add !== 'source-over' && add !== 'lighter') return X.real.apply(g, arguments);
  if (X.solo && add === 'source-over') return X.real.apply(g, arguments);
  if (X.mode === 2 && add === 'lighter') {   /* a glow: a transparent layer cannot add light to the picture under it, so it is added on the opaque bottom canvas */
    if (n !== 5) return X.real.apply(g, arguments);
    if (X.solo && glHalo()) {   /* after the penguins: an overlay canvas on top that adds its light to everything under it */
      k = X.ctxH; k.setTransform(g.getTransform()); k.globalAlpha = g.globalAlpha; k.drawImage(im, x, y, w, h); X.hUsed = 1; return;
    }
    k = X.ctxB; k.setTransform(g.getTransform()); k.globalAlpha = g.globalAlpha; k.globalCompositeOperation = 'lighter'; k.drawImage(im, x, y, w, h); k.globalCompositeOperation = 'source-over'; k.globalAlpha = 1; return;
  }
  add = add === 'lighter' ? 1 : 0;
  if (n === 3) { w = im.width; h = im.height; }
  m = g.getTransform(); a = m.a; b = m.b; c = m.c; e = m.e; f = m.f; k = m.d;
  cw = 2 / cv.width; ch = 2 / cv.height;
  /* corners (x,y) (x+w,y) (x+w,y+h) (x,y+h) mapped by the matrix, then to clip space */
  var ax = a * x + c * y + e, ay = b * x + k * y + f, bx = ax + a * w, by = ay + b * w, dx = ax + c * h, dy = ay + k * h, ex = bx + c * h, ey = by + k * h;
  glPush(glTex(im), add, g.globalAlpha, ax * cw - 1, 1 - ay * ch, 0, 0, bx * cw - 1, 1 - by * ch, 1, 0, ex * cw - 1, 1 - ey * ch, 1, 1, dx * cw - 1, 1 - dy * ch, 0, 1);
}
/* a soft ribbon (the stage 5 aurora): a strip of quads between an upper and a lower edge, colored from a vertical gradient, added to what is under it. gi picks the gradient (0 or 1); y0 and len place that gradient on the screen. */
var GL_AUR = [['rgba(90,255,200,0)', 'rgba(90,255,200,.3)'], ['rgba(90,255,200,0)', 'rgba(140,120,255,.28)']];
function glRibbon(gi, y0, len, x0, dx, top, bot, n) {
  var X = GLX, m = ctx.getTransform(), a = m.a, b = m.b, c = m.c, d = m.d, e = m.e, f = m.f, cw = 2 / cv.width, ch = 2 / cv.height, k, g, q, gr, tx, xa, xb, v0, v1, v2, v3;
  if (!X.grad[gi]) {
    g = document.createElement('canvas'); g.width = 2; g.height = 128; q = g.getContext('2d'); gr = q.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, GL_AUR[gi][0]); gr.addColorStop(0.5, GL_AUR[gi][1]); gr.addColorStop(1, GL_AUR[gi][0]); q.fillStyle = gr; q.fillRect(0, 0, 2, 128); X.grad[gi] = g;
  }
  tx = glTex(X.grad[gi]);
  for (k = 0; k < n - 1; k++) {
    xa = x0 + k * dx; xb = xa + dx;
    v0 = (top[k] - y0) / len; v1 = (top[k + 1] - y0) / len; v2 = (bot[k + 1] - y0) / len; v3 = (bot[k] - y0) / len;
    glPush(tx, 1, 1,
      (a * xa + c * top[k] + e) * cw - 1, 1 - (b * xa + d * top[k] + f) * ch, 0.5, v0,
      (a * xb + c * top[k + 1] + e) * cw - 1, 1 - (b * xb + d * top[k + 1] + f) * ch, 0.5, v1,
      (a * xb + c * bot[k + 1] + e) * cw - 1, 1 - (b * xb + d * bot[k + 1] + f) * ch, 0.5, v2,
      (a * xa + c * bot[k] + e) * cw - 1, 1 - (b * xa + d * bot[k] + f) * ch, 0.5, v3);
  }
}
function glFlush() {
  var X = GLX, gl = X.gl, i, first = 0, add = -1;
  if (!X.n) return;
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, X.data.subarray(0, X.n * 30));
  for (i = 0; i < X.nb; i++) {
    if (X.ba[i] !== add) { add = X.ba[i]; gl.blendFunc(gl.ONE, add ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA); }
    gl.bindTexture(gl.TEXTURE_2D, X.bt[i]); gl.drawArrays(gl.TRIANGLES, first * 6, X.bn[i] * 6); first += X.bn[i];
  }
  X.stB += X.nb; X.stQ += X.n; X.stF++; X.n = 0; X.nb = 0;
}
function glSave() { GLX.stack.push(GLX.clipped); GLX.real_save.call(this); }
function glRestore() { if (GLX.stack.length) GLX.clipped = GLX.stack.pop(); GLX.real_restore.call(this); }
function glClip() { GLX.clipped = 1; return GLX.real_clip.apply(this, arguments); }
/* one frame of the main game. Layout 1: clear the vector canvas and start recording at once; glEnd draws what was recorded. Layout 2: the same clear, but recording starts only at the penguins (glPhase2) and everything before them draws on the bottom canvas (glPhase1). */
function glInstall() { var X = GLX, P = CanvasRenderingContext2D.prototype; X.real = P.drawImage; X.real_save = P.save; X.real_restore = P.restore; X.real_clip = P.clip; X.clipped = 0; X.stack.length = 0; X.act = true; ctx.drawImage = glDrawImage; ctx.save = glSave; ctx.restore = glRestore; ctx.clip = glClip; }
function glBegin() {
  var X = GLX;
  if (!X.on) return;
  ctx = X.ctxT;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  X.solo = 0; X.n = 0; X.nb = 0; X.frame++;
  if (X.hUsed) { X.ctxH.setTransform(1, 0, 0, 1, 0, 0); X.ctxH.clearRect(0, 0, cv.width, cv.height); X.hUsed = 0; }
  X.gl.viewport(0, 0, X.cvs.width, X.cvs.height); X.gl.clear(X.gl.COLOR_BUFFER_BIT);
  if (X.mode === 1) { X.rib = true; glInstall(); }
}
/* layout 2, just after the shake transform is set: everything up to the penguins goes to the bottom canvas */
function glPhase1() { var X = GLX; if (!X.on || X.mode !== 2) return; X.ctxB.setTransform(X.ctxT.getTransform()); X.ctxB.globalAlpha = 1; X.ctxB.globalCompositeOperation = 'source-over'; ctx = X.ctxB; }
/* layout 2, at the penguin list: back to the top canvas, with sprites recorded for WebGL */
function glPhase2(list) {
  var X = GLX, i, pg;
  if (!X.on || X.mode !== 2) return;
  if (!calm) for (i = 0; i < list.length; i++) { pg = list[i]; if (pg.ev > 0 || pg.ice) { X.fb = (X.fb | 0) + 1; return; } }   /* an evolve glow or an ice aura of one penguin lights or tints the penguins behind it, which three layers cannot do: this frame is drawn the old way, all on the bottom canvas (rare and short) */
  ctx = X.ctxT; glInstall();
}
/* layout 2: a vector that sat under a penguin's sprite (feet shadow, danger ring, ice aura) is drawn on the bottom canvas, which is under every penguin */
function glUnder() { var X = GLX; if (!X.act || X.mode !== 2) return; X.ctxB.setTransform(X.ctxT.getTransform()); X.ctxB.globalAlpha = X.ctxT.globalAlpha; ctx = X.ctxB; }
function glOver() { var X = GLX; if (X.act && X.mode === 2) { X.ctxB.globalAlpha = 1; ctx = X.ctxT; } }
function glEnd() {
  var X = GLX;
  if (!X.mode) return;
  ctx = X.ctxT;
  if (!X.act) return;
  X.act = false; X.rib = false; delete ctx.drawImage; delete ctx.save; delete ctx.restore; delete ctx.clip;
  glFlush();
  if (X.frame % 900 === 0) glSweep();
}
/* after the penguins: everything later (stand, shots, effects) draws in canvas 2D on top, in its own order; glows still go to WebGL, which adds them to the real picture underneath */
function glSolo() { GLX.solo = 1; }
/* a still of the whole picture for the picture gate and tests: the WebGL layer and the vector layer together */
function glShot() {
  var c, g;
  if (!GLX.on) return cv;
  c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; g = c.getContext('2d');
  if (GLX.cvb) g.drawImage(GLX.cvb, 0, 0);
  g.drawImage(GLX.cvs, 0, 0); g.drawImage(cv, 0, 0);
  if (GLX.cvh) { g.globalCompositeOperation = 'lighter'; g.drawImage(GLX.cvh, 0, 0); g.globalCompositeOperation = 'source-over'; }
  return c;
}
