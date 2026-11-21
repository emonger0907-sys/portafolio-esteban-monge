/* Esteban Monge Rojas · Portafolio — interacción */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Idioma (ES / EN) ---------- */
  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    try { var s = localStorage.getItem("lang"); if (s) return s; } catch (e) {}
    return (navigator.language || "es").toLowerCase().indexOf("en") === 0 ? "en" : "es";
  }
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    try { localStorage.setItem("lang", l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.set === l ? "true" : "false");
    });
    var t = root.getAttribute("data-title-" + l);
    if (t) document.title = t;
    document.querySelectorAll("[data-alt-es]").forEach(function (el) {
      el.setAttribute("alt", el.getAttribute("data-alt-" + l));
    });
    document.querySelectorAll("[data-aria-es]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-aria-" + l));
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  }
  setLang(getLang());
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.set); });
  });
  function L() { return root.getAttribute("data-lang"); }

  /* ---------- Navegación ---------- */
  var nav = document.querySelector(".nav");
  var onScroll = function () { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var mb = document.querySelector(".menu-btn"), menu = document.querySelector(".nav ul");
  if (mb && menu) {
    mb.addEventListener("click", function () {
      var o = menu.classList.toggle("open"); mb.setAttribute("aria-expanded", o ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); });
    });
  }
  var links = document.querySelectorAll('.nav ul a[href^="#"]');
  if (links.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---------- Riel de progreso (la página como línea de producción) ---------- */
  var rail = document.querySelector(".rail"), bar = document.querySelector(".topbar i"), hero = document.querySelector(".hero");
  if (rail) {
    var stLinks = Array.prototype.slice.call(rail.querySelectorAll("a[data-st]"));
    var secs = stLinks.map(function (a) { return document.getElementById(a.dataset.st); });
    var fill = rail.querySelector(".rail-fill");
    var tick = false;
    var update = function () {
      tick = false;
      var vh = window.innerHeight, y = window.scrollY;
      rail.classList.toggle("on", y > (hero ? hero.offsetHeight * 0.55 : 200));
      var cur = -1;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.42) cur = i; });
      if (y + vh >= document.documentElement.scrollHeight - 4) cur = secs.length - 1;
      stLinks.forEach(function (a, i) {
        a.classList.toggle("done", i < cur); a.classList.toggle("now", i === cur);
        if (i === cur) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
      });
      rail.classList.toggle("dark", cur >= 0 && secs[cur] && secs[cur].id === "ia");
      var max = document.documentElement.scrollHeight - vh, p = max > 0 ? y / max : 0;
      if (fill) fill.style.height = (cur < 0 ? 0 : (cur / (secs.length - 1)) * 100) + "%";
      if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update); update();
  }

  /* ---------- Correo (se arma en el navegador para evitar bots) ---------- */
  document.querySelectorAll("[data-mail]").forEach(function (a) {
    var u = a.getAttribute("data-user"), d = a.getAttribute("data-domain");
    a.setAttribute("href", "mailto:" + u + "@" + d);
  });

  /* ---------- Aparición suave ---------- */
  var rv = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) rv.forEach(function (e) { e.classList.add("in"); });
  else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: .15 });
    rv.forEach(function (e) { ro.observe(e); });
  }

  /* ---------- Gráfico de control del hero ---------- */
  var spc = document.getElementById("spc");
  if (spc) {
    var narrow = spc.clientWidth < 700; var W = narrow ? 620 : 1100, H = narrow ? 380 : 300, pad = { l: 46, r: 64, t: 18, b: 34 };
    var n1 = 26, n2 = 26, N = n1 + n2;
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function gauss() { var u = rnd() || 1e-6, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    var pts = [];
    for (var i = 0; i < N; i++) {
      var y;
      if (i < n1) { y = 6 + gauss() * 1.55 + (i % 9 === 4 ? 2.6 : 0) - (i === 17 ? 2.2 : 0); }
      else { y = 3 + gauss() * 0.42; }
      pts.push(Math.max(.4, Math.min(10.6, y)));
    }
    var yMax = 12;
    var X = function (i) { return pad.l + i * (W - pad.l - pad.r) / (N - 1); };
    var Y = function (v) { return pad.t + (1 - v / yMax) * (H - pad.t - pad.b); };
    var ucl1 = 8.6, lcl1 = 3.4, ucl2 = 4.3, lcl2 = 1.7, split = X(n1 - .5);
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    var el = function (tag, a, parent) { var e = document.createElementNS(ns, tag); for (var k in a) e.setAttribute(k, a[k]); (parent || svg).appendChild(e); return e; };
    el("rect", { x: split, y: pad.t, width: W - pad.r - split, height: H - pad.t - pad.b, fill: "#DDF0EC", opacity: .55 });
    [[pad.l, split, ucl1, lcl1], [split, W - pad.r, ucl2, lcl2]].forEach(function (s, k) {
      [s[2], s[3]].forEach(function (v) {
        el("line", { x1: s[0], x2: s[1], y1: Y(v), y2: Y(v), stroke: k ? "#0E8577" : "#D7263D", "stroke-width": 1.5, "stroke-dasharray": "6 5" });
      });
    });
    el("line", { x1: pad.l, x2: W - pad.r, y1: Y(0), y2: Y(0), stroke: "#C5D0D9" });
    el("line", { x1: split, x2: split, y1: pad.t - 6, y2: H - pad.b, stroke: "#10243E", "stroke-width": 1.5 });
    var lab = function (x, y, txt, fill, anchor, w) {
      var t = el("text", { x: x, y: y, fill: fill, "font-size": 14, "font-weight": w || 700, "text-anchor": anchor || "start", "font-family": "Archivo, sans-serif" });
      t.textContent = txt; return t;
    };
    var tB = lab(pad.l + 4, H - pad.b - 10, "", "#5D6F84", "start", 600);
    var tA = lab(split + 10, pad.t + 14, "", "#0E8577", "start", 700);
    var tLim = lab(W - pad.r + 8, Y(ucl2) + 4, "", "#0E8577", "start", 600);
    var tLim2 = lab(W - pad.r + 8, Y(lcl2) + 4, "", "#0E8577", "start", 600);
    var d = pts.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
    var path = el("path", { d: d, fill: "none", stroke: "#10243E", "stroke-width": 2, "stroke-linejoin": "round" });
    var dots = pts.map(function (v, i) {
      var out = i < n1 ? (v > ucl1 || v < lcl1) : false;
      return el("circle", { cx: X(i), cy: Y(v), r: out ? 6 : 4.2, fill: out ? "#D7263D" : (i < n1 ? "#10243E" : "#0E8577"), stroke: "#fff", "stroke-width": 1.5, "data-i": i, tabindex: -1 });
    });
    spc.appendChild(svg);
    function labels() {
      var en = L() === "en";
      tB.textContent = en ? "Before: unstable process" : "Antes: proceso inestable";
      tA.textContent = en ? "After: standard method" : "Después: método estándar";
      tLim.textContent = en ? "UCL" : "LCS"; tLim2.textContent = en ? "LCL" : "LCI";
      svg.setAttribute("aria-label", en
        ? "Illustrative control chart: before the improvement many points fall outside the limits; after it, the process stays inside narrower limits."
        : "Gráfico de control ilustrativo: antes de la mejora varios puntos caen fuera de los límites; después, el proceso se mantiene dentro de límites más estrechos.");
    }
    labels(); document.addEventListener("langchange", labels);
    if (!reduce) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      dots.forEach(function (c) { c.style.opacity = 0; });
      requestAnimationFrame(function () {
        path.style.transition = "stroke-dashoffset 2.2s cubic-bezier(.4,.1,.2,1)";
        path.style.strokeDashoffset = 0;
        dots.forEach(function (c, i) { c.style.transition = "opacity .3s " + (0.1 + i * 2.1 / N).toFixed(2) + "s"; c.style.opacity = 1; });
      });
    }
    var tip = document.createElement("div"); tip.className = "tip"; spc.appendChild(tip);
    svg.addEventListener("mousemove", function (ev) {
      var r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) * W / r.width;
      var i = Math.round((x - pad.l) / ((W - pad.l - pad.r) / (N - 1)));
      if (i < 0 || i >= N) { tip.classList.remove("on"); return; }
      var v = pts[i], en = L() === "en", out = i < n1 && (v > ucl1 || v < lcl1);
      var state = i < n1 ? (out ? (en ? "out of control" : "fuera de control") : (en ? "high variation" : "variación alta")) : (en ? "in control" : "bajo control");
      tip.textContent = (en ? "Sample " : "Muestra ") + (i + 1) + ": " + state;
      var sr = spc.getBoundingClientRect();
      tip.style.left = (r.left - sr.left + X(i) * r.width / W) + "px";
      tip.style.top = (r.top - sr.top + Y(v) * r.height / H) + "px";
      tip.classList.add("on");
    });
    svg.addEventListener("mouseleave", function () { tip.classList.remove("on"); });
  }

  /* ---------- Ranking interactivo ---------- */
  var rank = document.getElementById("ranking-box");
  if (rank) {
    var data = JSON.parse(rank.querySelector("[data-scores]").getAttribute("data-scores"));
    var defaults = data.criteria.map(function (c) { return c.w; });
    var sliders = rank.querySelectorAll("input[type=range]");
    var list = rank.querySelector(".bars");
    var items = data.projects.map(function (p, k) {
      var li = list.querySelector('[data-k="' + k + '"]'); return { p: p, li: li };
    });
    function compute() {
      var ws = Array.prototype.map.call(sliders, function (s) { return +s.value; });
      var sum = ws.reduce(function (a, b) { return a + b; }, 0) || 1;
      Array.prototype.forEach.call(sliders, function (s, i) {
        s.parentNode.querySelector("output").textContent = Math.round(ws[i] / sum * 100) + " %";
      });
      items.forEach(function (it) {
        it.total = it.p.s.reduce(function (a, v, i) { return a + v * ws[i]; }, 0) / sum;
      });
      var sorted = items.slice().sort(function (a, b) { return b.total - a.total; });
      sorted.forEach(function (it, pos) {
        it.li.style.transform = "translateY(" + pos * 86 + "px)";
        it.li.setAttribute("data-pos", pos + 1);
        it.li.querySelector(".pos").textContent = pos + 1;
        it.li.querySelector(".score").textContent = it.total.toFixed(1).replace(".", L() === "es" ? "," : ".");
        it.li.querySelector(".fill").style.width = ((it.total - 6) / 4 * 100).toFixed(1) + "%";
      });
      list.style.height = items.length * 86 + "px";
      var live = rank.querySelector("[aria-live]");
      if (live) live.textContent = (L() === "en" ? "First place: " : "Primer lugar: ") + sorted[0].li.querySelector(".name").textContent.trim();
    }
    sliders.forEach(function (s) { s.addEventListener("input", compute); });
    rank.querySelector(".reset").addEventListener("click", function () {
      sliders.forEach(function (s, i) { s.value = defaults[i]; }); compute();
    });
    document.addEventListener("langchange", compute);
    compute();
  }

  /* ---------- Etapas de la visión de IA (pestañas) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = box.querySelectorAll("[role=tab]"), panels = box.querySelectorAll("[role=tabpanel]");
    function show(i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); show((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); show((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    show(0);
  });
})();
