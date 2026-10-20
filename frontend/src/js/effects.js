(function () {
  // 1. Navbar changes style after scrolling
  const nav = document.getElementById('navbar');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Reveal elements as they scroll into view
  const SELECTOR = '.event-card, .card-box, .table-wrap, .category-row, .stat, main > h1, main > h2';
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  function prepare(el, index) {
    if (el.dataset.reveal) return;
    el.dataset.reveal = '1';
    el.classList.add('reveal');
    el.style.animationDelay = (index % 6) * 90 + 'ms';
    if (io) io.observe(el);
    else el.classList.add('visible');
  }

  function scan(root) {
    const found = [];
    if (root.matches && root.matches(SELECTOR)) found.push(root);
    if (root.querySelectorAll) root.querySelectorAll(SELECTOR).forEach((n) => found.push(n));
    found.forEach(prepare);
  }

  scan(document.body);

  // Event cards and table rows are added later by the API calls, so watch for them
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach((node) => {
      if (node.nodeType === 1) scan(node);
    }));
  }).observe(document.body, { childList: true, subtree: true });

  // 3. Live counters on the home page
  function countUp(el, target) {
    if (!el) return;
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  async function loadStats() {
    if (!document.getElementById('stat-events') || typeof apiRequest !== 'function') return;
    try {
      const events = await apiRequest('/events');
      const seats = events.reduce((sum, e) => sum + Math.max(0, e.available_seats), 0);
      const categories = new Set(events.map((e) => e.category)).size;
      countUp(document.getElementById('stat-events'), events.length);
      countUp(document.getElementById('stat-seats'), seats);
      countUp(document.getElementById('stat-categories'), categories);
    } catch (err) {
      // If the API is not reachable, the numbers simply stay at 0
    }
  }
  loadStats();
})();