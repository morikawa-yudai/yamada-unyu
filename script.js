/* ============================================================
   山田運輸有限会社 — script.js
   ============================================================ */

'use strict';

/* ---------- Utility ---------- */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Header: scroll & hamburger ---------- */
(function initHeader() {
  const header    = qs('#header');
  const hamburger = qs('#hamburger');
  if (!header) return;

  // Scroll: add class after 60px
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero image pan on load
  const heroImg = qs('.hero__img');
  if (heroImg) {
    if (heroImg.complete) {
      qs('.hero')?.classList.add('is-loaded');
    } else {
      heroImg.addEventListener('load', () => qs('.hero')?.classList.add('is-loaded'));
    }
  }

  // Mobile nav
  const mobileNav = qs('#mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  qsa('.mobile-nav__list a', mobileNav).forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- Build Mobile Nav from Header ---------- */
(function buildMobileNav() {
  // Insert mobile nav after header if not in HTML
  if (qs('#mobileNav')) return;

  const header = qs('#header');
  if (!header) return;

  const nav = document.createElement('nav');
  nav.id = 'mobileNav';
  nav.className = 'mobile-nav';
  nav.setAttribute('aria-label', 'モバイルナビゲーション');

  const ul = document.createElement('ul');
  ul.className = 'mobile-nav__list';

  const links = [
    { href: '#reason',   label: '選ばれる理由' },
    { href: '#services', label: 'サービス一覧' },
    { href: '#svc-transport', label: '— 首都圏積み合わせ配送', sub: true },
    { href: '#svc-office',    label: '— オフィス移転', sub: true },
    { href: '#svc-waste',     label: '— 産業廃棄物収集運搬', sub: true },
    { href: '#svc-fixture',   label: '— 什器設置', sub: true },
    { href: '#svc-storage',   label: '— 貨物・商品保管', sub: true },
    { href: '#svc-contract',  label: '— 請負業務', sub: true },
    { href: '#safety',   label: '安全への取り組み' },
    { href: '#company',  label: '会社案内' },
    { href: '#recruit',  label: '採用情報' },
    { href: '#contact',  label: 'お問い合わせ' },
  ];

  links.forEach(({ href, label, sub }) => {
    const li = document.createElement('li');
    if (sub) li.className = 'sub';
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    li.appendChild(a);
    ul.appendChild(li);
  });

  // CTA buttons
  const cta = document.createElement('div');
  cta.className = 'mobile-nav__cta';
  cta.innerHTML = `
    <a href="tel:0488789116" class="btn btn--primary btn--md" style="width:100%;">📞 048-878-9116</a>
    <a href="#contact" class="btn btn--outline-white btn--md" style="width:100%;">お問い合わせフォーム</a>
  `;

  nav.appendChild(ul);
  nav.appendChild(cta);
  header.insertAdjacentElement('afterend', nav);
})();

/* ---------- Scroll Fade-in (IntersectionObserver) ---------- */
(function initFadeUp() {
  const elements = qsa('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ---------- Count-up Animation ---------- */
(function initCountUp() {
  const counters = qsa('.stat-count');
  if (!counters.length) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutExpo(progress) * target);
      el.textContent = value.toLocaleString('ja-JP');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('ja-JP');
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();

/* ---------- Smooth Scroll ---------- */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = qs(id);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ---------- Page Top Button ---------- */
(function initPageTop() {
  const btn = qs('#pageTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
})();

/* ---------- Active Nav Highlight ---------- */
(function initActiveNav() {
  const sections = qsa('section[id], div[id]');
  const navLinks = qsa('.header__nav-list a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.style.color = match ? 'var(--white)' : '';
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

/* ---------- FAQ Accessibility ---------- */
(function initFaq() {
  qsa('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      const arrow = qs('.faq__arrow', item);
      if (arrow) {
        arrow.style.transform = item.open ? 'rotate(180deg)' : '';
      }
    });
  });
})();

/* ---------- Contact Form Validation ---------- */
(function initForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const required = qsa('[required]', form);
    let valid = true;

    required.forEach(field => {
      const err = qs('.form-error', field.parentElement);
      if (err) err.remove();

      let msg = '';
      if (field.type === 'checkbox' && !field.checked) {
        msg = 'チェックしてください。';
      } else if (!field.value.trim()) {
        msg = 'この項目は必須です。';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        msg = '正しいメールアドレスを入力してください。';
      }

      if (msg) {
        valid = false;
        field.style.borderColor = '#e53e3e';
        const span = document.createElement('span');
        span.className = 'form-error';
        span.style.cssText = 'display:block;font-size:.75rem;color:#e53e3e;margin-top:.25rem;';
        span.textContent = msg;
        field.insertAdjacentElement('afterend', span);
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Success state
    const btn = qs('[type=submit]', form);
    btn.disabled = true;
    btn.textContent = '送信中...';

    setTimeout(() => {
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 2rem;">
          <div style="width:64px;height:64px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <h3 style="font-size:1.25rem;font-weight:700;color:var(--navy);margin-bottom:.75rem;">送信完了しました</h3>
          <p style="font-size:.9375rem;color:var(--gray-700);line-height:1.8;">お問い合わせありがとうございます。<br>担当者より2営業日以内にご連絡いたします。</p>
        </div>
      `;
    }, 1200);
  });

  // Real-time validation reset
  form.addEventListener('input', e => {
    const field = e.target;
    if (field.style.borderColor === 'rgb(229, 62, 62)') {
      field.style.borderColor = '';
      const err = qs('.form-error', field.parentElement);
      if (err) err.remove();
    }
  });
})();

/* ---------- Ticker pause on hover (accessibility) ---------- */
(function initTicker() {
  const track = qs('.ticker__track');
  if (!track) return;
  track.parentElement?.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.parentElement?.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ---------- Stat items stagger visible class ---------- */
(function initStatItems() {
  const items = qsa('.stat-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // add is-visible for the bottom border animation
        setTimeout(() => entry.target.classList.add('is-visible'), 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  items.forEach(el => observer.observe(el));
})();
