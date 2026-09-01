/* ==========================================================================
   Abdul Al Rohan — portfolio interactions
   Vanilla JS, no dependencies. Everything degrades gracefully without it.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Social links -------------------------------------------- */
  var SOCIAL = {
    linkedin: "https://www.linkedin.com/in/abdul-al-rohan",
    github: "https://github.com/rohan-jitu",
    facebook: "https://www.facebook.com/roha.jitu",
    instagram: "https://www.instagram.com/rohan_jitu",
    whatsapp: "https://wa.link/y1qhi2",
    calendly: "https://calendly.com/abdul-al-rohan/seo-growth-consultation"
  };
  $$("[data-social]").forEach(function (el) {
    var url = SOCIAL[el.dataset.social];
    if (!url) return;
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  /* ---------- Theme -----------------------------------------------------
     Dark is the brand default; the choice persists per visitor. The initial
     attribute is set by an inline script in <head> so there is no flash.     */
  var root = document.documentElement;
  var themeBtn = $(".theme-toggle");
  var themeMeta = $("[data-theme-color]");
  var THEME_BG = { dark: "#05070a", light: "#f7f8fb" };

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    if (themeMeta) themeMeta.setAttribute("content", THEME_BG[theme] || THEME_BG.dark);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* ---------- Header: stuck state + scroll progress -------------------- */
  var header = $(".site-header");
  var progress = $(".scroll-progress");
  var toTop = $(".to-top");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (progress) progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    if (toTop) toTop.classList.toggle("show", y > window.innerHeight * 0.8);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  window.addEventListener("load", onScroll);

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------------------------------------- */
  var toggle = $(".nav-toggle");
  var links = $(".nav-links");
  function closeNav() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("open");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("open", !open);
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Scroll reveal -------------------------------------------- */
  var revealables = $$(".reveal, [data-draw]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Active section indicator --------------------------------- */
  var navAnchors = $$(".nav-links a[href^='#']:not(.nav-book)");
  var sections = navAnchors
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var bestId = null;
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });
      if (!bestId) return;
      navAnchors.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + bestId);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Count-up statistics -------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    if (reduced) { el.textContent = String(target); return; }
    var duration = 1400;
    var start = null;
    el.textContent = "0";
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduced) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- Pointer spotlight on cards -------------------------------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    var pending = null;
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".card");
      if (!card) return;
      if (pending) return;
      pending = requestAnimationFrame(function () {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
        pending = null;
      });
    }, { passive: true });
  }

  /* ---------- Engagement tabs ------------------------------------------ */
  var tablist = $(".tabs");
  if (tablist) {
    var tabs = $$("[role='tab']", tablist);
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    selectTab(tabs[0]);
    tablist.addEventListener("click", function (e) {
      var tab = e.target.closest("[role='tab']");
      if (tab) selectTab(tab);
    });
    tablist.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
      if (next < 0) return;
      e.preventDefault();
      var tab = tabs[(next + tabs.length) % tabs.length];
      tab.focus();
      selectTab(tab);
    });
  }

  /* ---------- Seamless marquees: duplicate each track's items once -------- */
  if (!reduced) {
    $$("[data-marquee]").forEach(function (track) {
      $$(":scope > *", track).forEach(function (item) {
        var copy = item.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
      track.classList.add("is-looped");
    });
  }

  /* ---------- Footer year ---------------------------------------------- */
  var year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
