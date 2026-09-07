/* =========================================================
   Sree Annamalaiya Catering — main.js (vanilla, no deps)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIG: edit these for the client ---------- */
  window.SAC_CONFIG = window.SAC_CONFIG || {
    phone: '+919791590324',
    whatsapp: '919791590324',
    whatsappDefaultMsg: "Hello Sree Annamalaiya Catering, I'd like to enquire about catering for my event.",
    emailjsPublicKey: '71rQoZHY_3NPiXcY3',
    emailjsServiceId: 'SAC_request_form',
    emailjsTemplateId: 'template_osblzad'
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initializeEmailJs();
    setYear();
    wireHeaderScroll();
    wireMobileDrawer();
    markActiveNav();
    wireReveal();
    wireTilt();
    wireTestimonialNav();
    wireGalleryFilter();
    wireLightbox();
    wireFaq();
    wireMenuTabs();
    wireContactForm();
    wireBackToTop();
    wireWhatsappLinks();
    wireSmoothAnchor();
  }

  function initializeEmailJs() {
    var cfg = window.SAC_CONFIG;
    if (!window.emailjs || !cfg || !cfg.emailjsPublicKey) return;
    try {
      emailjs.init(cfg.emailjsPublicKey);
    } catch (e) {
      console.warn('EmailJS init error', e);
    }
  }

  /* ---------- footer year ---------- */
  function setYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- header shadow on scroll ---------- */
  function wireHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  function wireMobileDrawer() {
    var toggle = document.querySelector('.nav-toggle');
    var drawer = document.querySelector('.mobile-drawer');
    var scrim = document.querySelector('.scrim');
    var closeBtn = document.querySelector('.drawer-close');
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.add('open');
      scrim && scrim.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('open');
      scrim && scrim.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function () {
      drawer.classList.contains('open') ? close() : open();
    });
    closeBtn && closeBtn.addEventListener('click', close);
    scrim && scrim.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- active nav link by filename ---------- */
  function markActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-drawer nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  function wireReveal() {
    var items = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3D tilt hover (cards, hero frame) ---------- */
  function wireTilt() {
    var els = document.querySelectorAll('.tilt');
    if (!els.length || window.matchMedia('(pointer: coarse)').matches) return;

    els.forEach(function (el) {
      var inner = el.querySelector('.tilt-inner') || el;
      var maxDeg = 8;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (px - 0.5) * maxDeg * 2;
        var ry = -(py - 0.5) * maxDeg * 2;
        inner.style.setProperty('--rx', rx + 'deg');
        inner.style.setProperty('--ry', ry + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        inner.style.setProperty('--rx', '0deg');
        inner.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- testimonial prev/next ---------- */
  function wireTestimonialNav() {
    var track = document.querySelector('.testimonial-track');
    if (!track) return;
    var prev = document.querySelector('[data-testi-prev]');
    var next = document.querySelector('[data-testi-next]');
    function scrollByCard(dir) {
      var card = track.querySelector('.testimonial-card');
      var gap = 24;
      var amount = card ? card.offsetWidth + gap : 320;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    prev && prev.addEventListener('click', function () { scrollByCard(-1); });
    next && next.addEventListener('click', function () { scrollByCard(1); });
  }

  /* ---------- gallery filter ---------- */
  function wireGalleryFilter() {
    var bar = document.querySelector('.filter-bar');
    var items = document.querySelectorAll('.gallery-item');
    if (!bar || !items.length) return;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      bar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        var match = cat === 'all' || item.getAttribute('data-cat') === cat;
        item.style.display = match ? '' : 'none';
      });
    });
  }

  /* ---------- lightbox ---------- */
  function wireLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var lb = document.querySelector('.lightbox');
    if (!items.length || !lb) return;

    var img = lb.querySelector('img');
    var caption = lb.querySelector('.lightbox-caption');
    var closeBtn = lb.querySelector('.lightbox-close');
    var prevBtn = lb.querySelector('.lightbox-prev');
    var nextBtn = lb.querySelector('.lightbox-next');
    var currentIndex = 0;
    var visible = [];

    function refreshVisible() {
      visible = items.filter(function (it) { return it.style.display !== 'none'; });
    }

    function show(index) {
      refreshVisible();
      if (!visible.length) return;
      currentIndex = (index + visible.length) % visible.length;
      var el = visible[currentIndex];
      var full = el.getAttribute('data-full') || el.querySelector('img').src;
      img.src = full;
      img.alt = el.querySelector('img').alt || '';
      caption.textContent = el.getAttribute('data-caption') || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (el) {
      el.addEventListener('click', function () {
        refreshVisible();
        var idx = visible.indexOf(el);
        show(idx < 0 ? 0 : idx);
      });
    });
    closeBtn && closeBtn.addEventListener('click', close);
    prevBtn && prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    nextBtn && nextBtn.addEventListener('click', function () { show(currentIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(currentIndex + 1);
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  function wireFaq() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    faqItems.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- menu category sticky tabs + scroll-spy ---------- */
  function wireMenuTabs() {
    var tabs = document.querySelectorAll('.menu-tabs button');
    var cats = document.querySelectorAll('.menu-category');
    if (!tabs.length || !cats.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-target');
        var target = document.getElementById(id);
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tabs.forEach(function (t) {
              t.classList.toggle('active', t.getAttribute('data-target') === id);
            });
          }
        });
      }, { rootMargin: '-160px 0px -60% 0px', threshold: 0 });
      cats.forEach(function (c) { io.observe(c); });
    }
  }

  /* ---------- contact form: validate + send via WhatsApp / mailto ---------- */
  function wireContactForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('[required]');
      var valid = true;

      fields.forEach(function (field) {
        var wrap = field.closest('.field');
        var ok = field.value.trim().length > 0;
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (field.type === 'tel' && ok) {
          ok = /^[0-9+\-\s()]{7,}$/.test(field.value.trim());
        }
        wrap && wrap.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        showStatus(false, 'Please fill in the highlighted fields before sending.');
        return;
      }

      var data = Object.fromEntries(new FormData(form).entries());
      var lines = [
        'New enquiry from the website:',
        'Name: ' + (data.name || '-'),
        'Phone: ' + (data.phone || '-'),
        'Event type: ' + (data.eventType || '-'),
        'Event date: ' + (data.eventDate || '-'),
        'Guest count: ' + (data.guests || '-'),
        'Message: ' + (data.message || '-')
      ];
      var text = encodeURIComponent(lines.join('\n'));
      var waNumber = (window.SAC_CONFIG && window.SAC_CONFIG.whatsapp) || '';

      // WhatsApp is the primary destination; EmailJS is used if it cannot be opened.
      var whatsappWindow = window.open('https://wa.me/' + waNumber + '?text=' + text, '_blank');
      if (whatsappWindow) {
        showStatus(true, "Thanks, " + (data.name || '') + "! WhatsApp opened with your enquiry details.");
        form.reset();
        return;
      }

      var templateParams = {
        name: data.name || '',
        phone: data.phone || '',
        event_type: data.eventType || '',
        guest_count: data.guests || '',
        event_date: data.eventDate || '',
        message: data.message || ''
      };

      // Send via EmailJS (if available). Service ID and Template ID are fixed per request.
      try {
        var cfg = window.SAC_CONFIG || {};
        if (window.emailjs && typeof emailjs.send === 'function' && cfg.emailjsServiceId && cfg.emailjsTemplateId) {
          emailjs.send(cfg.emailjsServiceId, cfg.emailjsTemplateId, templateParams)
            .then(function () {
              showStatus(true, 'WhatsApp could not be opened. Your enquiry was sent by email successfully.');
              form.reset();
            }, function (err) {
              console.error('EmailJS error:', err);
              showStatus(false, 'WhatsApp could not be opened and the email could not be sent. Please call us.');
            });
        } else {
          showStatus(false, 'WhatsApp could not be opened and email service is not configured. Please call us.');
        }
      } catch (e) {
        console.error('EmailJS send exception', e);
        showStatus(false, 'WhatsApp could not be opened and email could not be sent. Please call us.');
      }
    });

    function showStatus(ok, msg) {
      status.textContent = msg;
      status.classList.remove('ok', 'bad');
      status.classList.add('show', ok ? 'ok' : 'bad');
    }
  }

  /* ---------- back to top ---------- */
  function wireBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- wire up whatsapp / call links from config ---------- */
  function wireWhatsappLinks() {
    var cfg = window.SAC_CONFIG;
    if (!cfg) return;
    var msg = encodeURIComponent(cfg.whatsappDefaultMsg || '');
    document.querySelectorAll('[data-whatsapp-link]').forEach(function (a) {
      a.href = 'https://wa.me/' + cfg.whatsapp + (msg ? '?text=' + msg : '');
    });
    document.querySelectorAll('[data-call-link]').forEach(function (a) {
      a.href = 'tel:' + cfg.phone;
    });
  }

  /* ---------- smooth-scroll same-page anchors ---------- */
  function wireSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.length < 2) return;
      a.addEventListener('click', function (e) {
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }
})();
