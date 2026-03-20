// ============================================================
// public/js/main.js – Client-side helpers
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Language / RTL Toggle ─────────────────────────────────
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.addEventListener('click', function () {
      const lang = this.dataset.lang;
      window.location.href = '/lang/' + lang;
    });
  });

  // ── Auto-dismiss flash messages ───────────────────────────
  setTimeout(() => {
    document.querySelectorAll('.alert-neon').forEach(a => {
      a.style.transition = 'opacity 0.5s';
      a.style.opacity = '0';
      setTimeout(() => a.remove(), 500);
    });
  }, 4000);

  // ── Quantity +/- Buttons ──────────────────────────────────
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.closest('.qty-group').querySelector('.qty-input');
      let val = parseInt(input.value) || 1;
      if (this.dataset.action === 'inc') val++;
      if (this.dataset.action === 'dec' && val > 1) val--;
      input.value = val;
    });
  });

  // ── Star Rating Interaction ───────────────────────────────
  const stars = document.querySelectorAll('.star-rating label');
  stars.forEach((star, idx) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, i) => {
        s.style.color = i <= idx ? '#ffd700' : 'var(--text-muted)';
      });
    });
    star.addEventListener('mouseout', () => {
      const checked = document.querySelector('.star-rating input:checked');
      const checkedIdx = checked ? parseInt(checked.value) - 1 : -1;
      stars.forEach((s, i) => {
        s.style.color = i <= checkedIdx ? '#ffd700' : 'var(--text-muted)';
      });
    });
  });

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.querySelector('.neon-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 30px rgba(0,245,255,0.15)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // ── Product card lazy-load shimmer ────────────────────────
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.animationDelay = (i * 0.07) + 's';
    card.classList.add('animate-fade-up');
  });

  // ── Confirm delete actions ────────────────────────────────
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', function (e) {
      if (!confirm(this.dataset.confirm)) e.preventDefault();
    });
  });

});
