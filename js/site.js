(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  var lang = document.documentElement.lang === "en" ? "en" : "fr";
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Photos : tant qu'un fichier n'est pas déposé dans /img, l'emplacement coloré reste visible sans icône d'image cassée */
  $$(".ph img").forEach(function (img) {
    var drop = function () { if (img.parentNode) { img.parentNode.removeChild(img); } };
    img.addEventListener("error", drop);
    if (img.complete && img.naturalWidth === 0) { drop(); }
  });

  /* Menu mobile */
  var header = $(".site-header");
  var menuBtn = $(".menu-btn");
  if (header && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? menuBtn.getAttribute("data-close") : menuBtn.getAttribute("data-open");
    });
  }

  /* Showreel */
  var slot = $("#showreel-slot");
  if (slot && cfg.showreel && cfg.showreel.id) {
    var id = encodeURIComponent(cfg.showreel.id);
    var src = cfg.showreel.provider === "vimeo"
      ? "https://player.vimeo.com/video/" + id
      : "https://www.youtube-nocookie.com/embed/" + id;
    var frame = document.createElement("iframe");
    frame.src = src;
    frame.title = "Showreel Bachir Diaw";
    frame.allow = "encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.loading = "lazy";
    slot.className = "reel";
    slot.removeAttribute("data-label");
    slot.removeAttribute("role");
    slot.removeAttribute("aria-label");
    slot.style.aspectRatio = "16 / 9";
    slot.style.position = "relative";
    slot.appendChild(frame);
  }

  /* Réseaux sociaux */
  var names = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", x: "X", snapchat: "Snapchat", threads: "Threads", youtube: "YouTube" };
  var social = cfg.social || {};
  $$("[data-social]").forEach(function (box) {
    var count = 0;
    Object.keys(names).forEach(function (key) {
      if (!social[key]) { return; }
      var a = document.createElement("a");
      a.href = social[key];
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = names[key];
      box.appendChild(a);
      count += 1;
    });
    if (!count) {
      var wrap = box.closest("[data-social-wrap]");
      var empty = wrap && $(".social-empty", wrap);
      if (empty) { empty.hidden = false; } else if (wrap) { wrap.hidden = true; }
    }
  });

  /* Chiffres d'audience */
  var stats = $("#stats");
  if (stats) {
    var items = (cfg.stats || []).filter(function (s) { return s && s.value; });
    if (items.length) {
      var grid = $(".stats-grid", stats);
      items.forEach(function (s) {
        var cell = document.createElement("div");
        var value = document.createElement("p");
        var label = document.createElement("p");
        value.className = "stat-value";
        label.className = "stat-label";
        value.textContent = s.value;
        label.textContent = s["label_" + lang] || s.label_fr || "";
        cell.appendChild(value);
        cell.appendChild(label);
        grid.appendChild(cell);
      });
      stats.hidden = false;
      var st = $("[data-stats-todo]", stats);
      if (st) { st.hidden = true; }
    }
  }

  /* Contact : lignes directes et formulaire */
  var wa = String(cfg.whatsapp || "").replace(/\D/g, "");
  var mail = String(cfg.email || "").trim();

  var direct = $("#direct-contact");
  if (direct && (wa || mail)) {
    if (wa) {
      var w = document.createElement("a");
      w.href = "https://wa.me/" + wa;
      w.target = "_blank";
      w.rel = "noopener";
      w.textContent = "WhatsApp +" + wa;
      direct.appendChild(w);
    }
    if (mail) {
      var m = document.createElement("a");
      m.href = "mailto:" + mail;
      m.textContent = mail;
      direct.appendChild(m);
    }
    direct.hidden = false;
  }

  var form = $("#contact-form");
  if (form) {
    var L = {
      fr: { wa: "Envoyer sur WhatsApp", mail: "Envoyer par email", none: "Envoyer", from: "De", topic: "Objet", missing: "Aperçu : les coordonnées de contact seront ajoutées avant la mise en ligne." },
      en: { wa: "Send on WhatsApp", mail: "Send by email", none: "Send", from: "From", topic: "Subject", missing: "Preview: contact details will be added before launch." }
    }[lang];
    var submit = $("button[type=submit]", form);
    var note = $("#form-note");
    submit.textContent = wa ? L.wa : (mail ? L.mail : L.none);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) { return; }
      var name = $("#f-name").value.trim();
      var email = $("#f-email").value.trim();
      var topicSelect = $("#f-topic");
      var topic = topicSelect.options[topicSelect.selectedIndex].text;
      var message = $("#f-msg").value.trim();
      var text = L.from + " : " + name + " (" + email + ")\n" + L.topic + " : " + topic + "\n\n" + message;
      if (wa) {
        window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      } else if (mail) {
        window.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent(topic + " - " + name) + "&body=" + encodeURIComponent(text);
      } else {
        note.textContent = L.missing;
        note.hidden = false;
      }
    });
  }

  /* Année du pied de page */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();

/* Panneau Contact (menu latéral) */
(function () {
  var panel = document.getElementById("panel");
  if (!panel) { return; }
  var openers = Array.prototype.slice.call(document.querySelectorAll("[data-panel-open]"));
  var closers = Array.prototype.slice.call(panel.querySelectorAll("[data-panel-close]"));
  var last = null;
  function setOpen(open) {
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.documentElement.classList.toggle("panel-lock", open);
    openers.forEach(function (o) { o.setAttribute("aria-expanded", open ? "true" : "false"); });
    if (open) {
      last = document.activeElement;
      var first = panel.querySelector(".panel-close");
      if (first) { first.focus(); }
    } else if (last && last.focus) {
      last.focus();
    }
  }
  openers.forEach(function (o) {
    o.addEventListener("click", function (e) { e.preventDefault(); setOpen(true); });
  });
  closers.forEach(function (c) { c.addEventListener("click", function () { setOpen(false); }); });
  panel.addEventListener("click", function (e) {
    if (e.target.closest(".panel-links a")) { setOpen(false); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("is-open")) { setOpen(false); }
  });

  var cfg = window.SITE_CONFIG || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Kit média : le bouton apparaît quand cfg.mediaKit contient le chemin du PDF */
  var kit = $("[data-media-kit]");
  if (kit && cfg.mediaKit) {
    kit.href = cfg.mediaKit;
    kit.hidden = false;
    var kt = $("[data-kit-todo]");
    if (kt) { kt.hidden = true; }
  }

  /* Diaporama d'accueil */
  var show = $("[data-slides]");
  if (show) {
    var slides = $$(".slide", show);
    var bars = $$("[data-slide-to]", show);
    var num = $("[data-slide-num]", show);
    var tot = $(".hc-tot", show);
    var opt = cfg.slideshow || {};
    var interval = opt.interval || 8000;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = 0, timer = null, held = false;
    show.style.setProperty("--fade", (opt.fade || 1400) + "ms");
    if (tot) { tot.textContent = ("0" + slides.length).slice(-2); }
    var go = function (n) {
      current = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-on", i === current); });
      bars.forEach(function (b, i) { b.setAttribute("aria-current", i === current ? "true" : "false"); });
      show.setAttribute("data-cur", String(current));
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () {
      stop();
      if (reduce || slides.length < 2) { return; }
      timer = setInterval(function () { if (!held && !document.hidden && !(window.matchMedia && window.matchMedia("(min-width: 1280px)").matches)) { go(current + 1); } }, interval);
    };
    bars.forEach(function (b) {
      b.addEventListener("click", function () { go(parseInt(b.getAttribute("data-slide-to"), 10)); start(); });
    });
    if (opt.pauseOnTouch !== false) {
      show.addEventListener("touchstart", function () { held = true; }, { passive: true });
      show.addEventListener("touchend", function () { held = false; }, { passive: true });
      show.addEventListener("touchcancel", function () { held = false; }, { passive: true });
    }
    if (opt.pauseOnHover) {
      show.addEventListener("mouseenter", function () { held = true; });
      show.addEventListener("mouseleave", function () { held = false; });
    }
    go(0);
    start();
  }
})();
