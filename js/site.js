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



  /* Actualisation (F5) : toujours en haut de la page, sans ancre dans l'adresse */
  (function () {
    var nav = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || null;
    var isReload = nav ? nav.type === "reload" : (performance.navigation && performance.navigation.type === 1);
    if (!isReload) { return; }
    if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }
    if (location.hash) { history.replaceState(null, "", location.pathname + location.search); }
    var top = function () { window.scrollTo(0, 0); };
    top();
    window.addEventListener("load", function () { top(); setTimeout(top, 60); setTimeout(top, 300); });
    window.addEventListener("pageshow", top);
  })();

  /* Liens d'ancre internes (ex. « Explorer ») : défilement sans laisser l'ancre dans l'adresse */
  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (!id) { return; }
    a.addEventListener("click", function (event) {
      var target = document.getElementById(id);
      if (!target) { return; }
      event.preventDefault();
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (!target.hasAttribute("tabindex")) { target.setAttribute("tabindex", "-1"); }
      try { target.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* Institutionnel : lien optionnel par série (défini dans config.js) */
  $$("[data-inst]").forEach(function (li) {
    var url = String((cfg.instLinks || {})[li.getAttribute("data-inst")] || "").trim();
    if (!/^https?:\/\//i.test(url)) { return; }
    var holder = $(".inst-act, .prod-act", li) || li.lastElementChild;
    var a = document.createElement("a");
    a.className = "btn inst-link";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = lang === "en" ? "View" : "Voir";
    holder.appendChild(a);
  });

  /* Ancre : se replace sur la section visée une fois la page mise en place */
  if (location.hash.length > 1) {
    var goAnchor = function () {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!t) { return; }
      var root = document.documentElement;
      var prev = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      t.scrollIntoView();
      root.style.scrollBehavior = prev;
    };
    window.addEventListener("load", function () { goAnchor(); setTimeout(goAnchor, 350); });
  }

  /* Chiffres d'audience (décompte à l'arrivée à l'écran) */
  $$("#stats").forEach(function (stats) {
    var items = (cfg.stats || []).filter(function (s) { return s && s.value; });
    if (!items.length) { return; }
    var grid = $(".stats-grid", stats);
    var nets = stats.hasAttribute("data-icons") ? $("#stat-nets", stats) : null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function parse(v) {
      var m = String(v).match(/^([\d\s.,]+?)\s*([^\d\s.,].*)?$/);
      if (!m) { return null; }
      var raw = m[1].replace(/\s/g, "");
      var dec = /,\d{1,2}$/.test(raw) ? raw.split(",")[1].length : 0;
      var num = parseFloat(raw.replace(",", "."));
      if (isNaN(num)) { return null; }
      return { num: num, dec: dec, suffix: m[2] ? " " + m[2] : "", space: /\d\s\d/.test(v) };
    }
    function fmt(p, n) {
      var t = n.toFixed(p.dec);
      var parts = t.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, p.space ? " " : "");
      return parts.join(",") + p.suffix;
    }
    var counters = [];
    items.forEach(function (s) {
      var cell = document.createElement("div");
      var value = document.createElement("p");
      value.className = "stat-value";
      value.textContent = s.value;
      var tpl = nets && s.net ? $('[data-net="' + s.net + '"]', nets.content) : null;
      if (tpl) {
        var link = tpl.cloneNode(true);
        link.classList.add("stat-net-row");
        var line = document.createElement("div");
        line.className = "stat-line";
        line.appendChild(link);
        line.appendChild(value);
        cell.appendChild(line);
      } else {
        cell.appendChild(value);
        var label = document.createElement("p");
        label.className = "stat-label";
        label.textContent = s["label_" + lang] || s.label_fr || "";
        cell.appendChild(label);
      }
      grid.appendChild(cell);
      var p = parse(s.value);
      if (p) { counters.push({ el: value, p: p, final: s.value }); }
    });
    stats.hidden = false;
    var st = $("[data-stats-todo]", stats);
    if (st) { st.hidden = true; }
    function run() {
      var t0 = null;
      counters.forEach(function (c) { c.el.textContent = fmt(c.p, 0); });
      function step(ts) {
        if (t0 === null) { t0 = ts; }
        var k = Math.min(1, (ts - t0) / 1700);
        var e = 1 - Math.pow(1 - k, 3);
        counters.forEach(function (c) { c.el.textContent = k >= 1 ? c.final : fmt(c.p, c.p.num * e); });
        if (k < 1) { requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }
    if (reduce || !("IntersectionObserver" in window) || !counters.length) { return; }
    counters.forEach(function (c) { c.el.textContent = fmt(c.p, 0); });
    var seen = false;
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen) { seen = true; obs.disconnect(); run(); }
      });
    }, { threshold: 0.6 }).observe(grid);
  });

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


  /* Témoignages : liste publiée + formulaire d'envoi */
  var tl = $("#testi-list");
  if (tl) {
    var tItems = (cfg.testimonials || []).filter(function (t) { return t && (t.img || t["quote_" + lang] || t.quote_fr); });
    var PAGE = 6, shown = 0;
    var more = $("#testi-more"), moreBtn = $("#testi-more-btn"), count = $("#testi-count");
    var fmtCount = function () { count.textContent = shown + " / " + tItems.length; };
    var addMore = function () {
      tItems.slice(shown, shown + PAGE).forEach(function (t) {
        var fig = document.createElement("figure");
        fig.className = "shot";
        var role = t["role_" + lang] || t.role_fr || t.role || "";
        if (t.img) {
          var im = document.createElement("img");
          im.src = (tl.getAttribute("data-base") || "") + t.img.replace(/^img\//, ""); im.alt = role; im.loading = "lazy";
          fig.appendChild(im);
        } else {
          var q = document.createElement("blockquote");
          q.textContent = t["quote_" + lang] || t.quote_fr;
          fig.appendChild(q);
        }
        var cap = document.createElement("figcaption");
        cap.textContent = t.img ? role : [t.name, role].filter(Boolean).join(" – ");
        fig.appendChild(cap);
        tl.appendChild(fig);
      });
      shown = Math.min(tItems.length, shown + PAGE);
      fmtCount();
      more.hidden = shown >= tItems.length;
    };
    if (tItems.length) {
      tl.hidden = false;
      addMore();
      moreBtn.addEventListener("click", addMore);
    }
  }
  var tf = $("#testi-form");
  if (tf) {
    var TL = {
      fr: { subject: "Témoignage", name: "Nom", role: "Fonction", project: "Projet", ok: "Publication autorisée : oui", missing: "Aperçu : les coordonnées de contact seront ajoutées avant la mise en ligne." },
      en: { subject: "Testimonial", name: "Name", role: "Role", project: "Project", ok: "Publication allowed: yes", missing: "Preview: contact details will be added before launch." }
    }[lang];
    var tNote = $("#testi-note");
    tf.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!tf.reportValidity()) { return; }
      var nm = $("#t-name").value.trim();
      var text = TL.name + " : " + nm + "\n" + TL.role + " : " + $("#t-role").value.trim() + "\n" + TL.project + " : " + $("#t-project").value.trim() + "\n" + TL.ok + "\n\n" + $("#t-msg").value.trim();
      var twa = String(cfg.whatsapp || "").replace(/\D/g, "");
      var tmail = String(cfg.email || "").trim();
      if (tmail) {
        window.location.href = "mailto:" + tmail + "?subject=" + encodeURIComponent(TL.subject + " - " + nm) + "&body=" + encodeURIComponent(text);
      } else if (twa) {
        window.open("https://wa.me/" + twa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      } else { tNote.textContent = TL.missing; tNote.hidden = false; }
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
  Array.prototype.forEach.call(document.querySelectorAll("[data-panel-open-sm]"), function (o) {
    o.addEventListener("click", function (e) {
      if (window.matchMedia && window.matchMedia("(max-width: 520px)").matches) { e.preventDefault(); setOpen(true); }
    });
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

/* Défilement du texte d'accueil (téléphone) : lancé en JS pour rester actif
   même si le téléphone coupe les animations CSS (économie d'énergie, "supprimer les animations"). */
(function () {
  var t = document.querySelector(".bio-track");
  if (!t || !t.animate) return;
  var mq = window.matchMedia("(max-width: 520px)");
  var anim = null;
  function sync() {
    if (mq.matches) {
      if (anim) return;
      t.style.animation = "none";
      anim = t.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
        { duration: 24000, iterations: Infinity, easing: "linear" });
      var box = t.parentNode;
      var pause = function () { if (anim) anim.pause(); };
      var play = function () { if (anim) anim.play(); };
      box.addEventListener("touchstart", pause, { passive: true });
      box.addEventListener("touchend", play, { passive: true });
      box.addEventListener("touchcancel", play, { passive: true });
    } else if (anim) {
      anim.cancel(); anim = null; t.style.animation = "";
    }
  }
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync);
})();
