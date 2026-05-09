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
  // Handled purely by CSS (input:checked ~ label + flex-row-reverse).
  // No JS needed — the CSS sibling combinator pattern works correctly.

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

  // ────────────────────────────────────────────────────────────
  //  AI FEATURE 1 – Product Explanation
  // ────────────────────────────────────────────────────────────
  const explainBtn = document.getElementById('aiExplainBtn');
  if (explainBtn) {
    explainBtn.addEventListener('click', async function () {
      const productId = this.dataset.productId;
      const resultBox = document.getElementById('aiExplainResult');
      const contentEl = document.getElementById('aiExplainContent');
      const scrollPanel = resultBox.querySelector('.ai-result-scroll');

      // Show loading
      resultBox.style.display = 'block';
      contentEl.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div>Analyzing product with AI...</div>';
      this.disabled = true;
      this.querySelector('span').innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Generating...';

      // Scroll the panel into view
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      try {
        const resp = await fetch('/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId })
        });
        const data = await resp.json();
        if (data.success) {
          contentEl.innerHTML = markdownToHtml(data.explanation);
        } else {
          contentEl.innerHTML = '<p style="color:var(--neon-pink);">' + (data.error || 'Something went wrong.') + '</p>';
        }
      } catch (err) {
        contentEl.innerHTML = '<p style="color:var(--neon-pink);">Failed to reach the AI service. Please try again.</p>';
      }

      // Scroll panel to top and into view after content loads
      if (scrollPanel) {
        scrollPanel.scrollTop = 0;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        trapScroll(scrollPanel);
      }

      this.disabled = false;
      this.querySelector('span').innerHTML = '<i class="bi bi-robot me-2"></i>Explain this product';
    });
  }

  // ────────────────────────────────────────────────────────────
  //  AI FEATURE 2 – Product Comparison
  // ────────────────────────────────────────────────────────────
  const compareBar    = document.getElementById('compareBar');
  const compareNowBtn = document.getElementById('compareNowBtn');
  const compareClear  = document.getElementById('compareClearBtn');
  const compareModal  = document.getElementById('compareModal');
  const compareClose  = document.getElementById('compareModalClose');
  const checkboxes    = document.querySelectorAll('.compare-check');

  if (compareBar && checkboxes.length > 0) {
    let selected = [];

    function updateCompareBar() {
      if (selected.length > 0) {
        compareBar.classList.add('visible');
      } else {
        compareBar.classList.remove('visible');
      }
      const barText = document.getElementById('compareBarText');
      if (selected.length === 0) {
        barText.textContent = 'Select 2 products to compare';
        compareNowBtn.disabled = true;
      } else if (selected.length === 1) {
        barText.textContent = selected[0].name + ' selected — pick one more';
        compareNowBtn.disabled = true;
      } else {
        barText.textContent = selected[0].name + ' vs ' + selected[1].name;
        compareNowBtn.disabled = false;
      }
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', function () {
        const id   = this.dataset.productId;
        const name = this.dataset.productName;

        if (this.checked) {
          if (selected.length >= 2) {
            this.checked = false;
            return;
          }
          selected.push({ id, name });
        } else {
          selected = selected.filter(s => s.id !== id);
        }
        updateCompareBar();
      });
    });

    if (compareClear) {
      compareClear.addEventListener('click', function () {
        selected = [];
        checkboxes.forEach(cb => cb.checked = false);
        updateCompareBar();
      });
    }

    if (compareNowBtn) {
      compareNowBtn.addEventListener('click', async function () {
        if (selected.length !== 2) return;

        const resultEl = document.getElementById('compareResultContent');
        resultEl.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div>Generating AI comparison...</div>';

        // Open modal and lock body scroll
        compareModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        try {
          const resp = await fetch('/ai/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id_1: selected[0].id, product_id_2: selected[1].id })
          });
          const data = await resp.json();

          if (data.success) {
            // Fill product header cards
            document.getElementById('compareP1Name').textContent  = data.product1.name;
            document.getElementById('compareP1Price').textContent = '$' + Number(data.product1.price).toFixed(2);
            document.getElementById('compareP1Cat').textContent   = data.product1.category;
            document.getElementById('compareP2Name').textContent  = data.product2.name;
            document.getElementById('compareP2Price').textContent = '$' + Number(data.product2.price).toFixed(2);
            document.getElementById('compareP2Cat').textContent   = data.product2.category;

            resultEl.innerHTML = markdownToHtml(data.comparison);
          } else {
            resultEl.innerHTML = '<p style="color:var(--neon-pink);">' + (data.error || 'Comparison failed.') + '</p>';
          }
        } catch (err) {
          resultEl.innerHTML = '<p style="color:var(--neon-pink);">Failed to reach the AI service. Please try again.</p>';
        }

        // Trap scroll inside the modal result panel
        const modalScrollPanel = compareModal.querySelector('.ai-result-scroll');
        if (modalScrollPanel) {
          modalScrollPanel.scrollTop = 0;
          trapScroll(modalScrollPanel);
        }
      });
    }

    // Close modal helpers — restore body scroll
    function closeCompareModal() {
      compareModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (compareClose) {
      compareClose.addEventListener('click', closeCompareModal);
    }
    if (compareModal) {
      compareModal.addEventListener('click', function (e) {
        if (e.target === this) closeCompareModal();
      });
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Simple Markdown → HTML converter (for AI responses)
  // ────────────────────────────────────────────────────────────
  function markdownToHtml(md) {
    if (!md) return '';
    let html = md
      // Headings
      .replace(/^### (.+)$/gm, '<h5 style="color:var(--neon-cyan);font-family:var(--font-ui);margin:1rem 0 0.5rem;">$1</h5>')
      .replace(/^## (.+)$/gm, '<h4 style="color:var(--neon-cyan);font-family:var(--font-display);letter-spacing:1px;margin:1.2rem 0 0.5rem;">$1</h4>')
      .replace(/^# (.+)$/gm, '<h3 style="color:var(--neon-green);font-family:var(--font-display);letter-spacing:2px;margin:1.2rem 0 0.5rem;">$1</h3>')
      // Bold & italic
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--neon-cyan);">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Unordered list items
      .replace(/^[-*] (.+)$/gm, '<li style="margin-left:1rem;margin-bottom:0.3rem;list-style:none;"><span style="color:var(--neon-green);margin-right:6px;">▸</span>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return html;
  }

  // ────────────────────────────────────────────────────────────
  //  Trap scroll inside a scrollable element (prevent chaining)
  // ────────────────────────────────────────────────────────────
  function trapScroll(el) {
    if (!el || el._scrollTrapped) return;
    el._scrollTrapped = true;
    el.addEventListener('wheel', function (e) {
      const maxScroll = this.scrollHeight - this.clientHeight;
      // Only trap if the element actually has overflow
      if (maxScroll <= 0) return;
      const delta = e.deltaY;
      const atTop = this.scrollTop <= 0 && delta < 0;
      const atBottom = this.scrollTop >= maxScroll && delta > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    }, { passive: false });
  }

});
