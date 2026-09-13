(function () {
  var navLinks = document.querySelectorAll('.nav-link');
  var panels = document.querySelectorAll('.panel');
  var sidebar = document.getElementById('sidebar');
  var menuToggle = document.getElementById('menuToggle');
  var overlay = document.getElementById('overlay');
  var validIds = Array.prototype.map.call(panels, function (p) { return p.id; });

  function closeMenu() {
    sidebar.classList.remove('open');
  }

  function showSection(id, updateHash) {
    var fullId = id || 'about';
    var parts = fullId.split('/');
    var topId = parts[0];

    if (validIds.indexOf(topId) === -1) {
      topId = 'about';
      fullId = 'about';
      parts = ['about'];
    }

    panels.forEach(function (p) {
      p.classList.toggle('active', p.id === topId);
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-target') === topId);
    });

    if (topId === 'hobbies') {
      var hobbiesView = 'main';
      if (parts[1] === 'travel') {
        hobbiesView = parts[2] ? 'travel-detail' : 'travel-list';
      } else if (parts[1] === 'forro') {
        hobbiesView = parts[2] ? 'forro-detail' : 'forro-list';
      }
      document.querySelectorAll('#hobbies .hobbies-view').forEach(function (v) {
        v.classList.toggle('active', v.getAttribute('data-view') === hobbiesView);
      });
    }

    if (updateHash !== false) {
      history.replaceState(null, '', '#' + fullId);
    }
    closeMenu();
    document.getElementById('content').scrollTo(0, 0);
    window.scrollTo(0, 0);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      showSection(link.getAttribute('data-target'));
    });
  });

  document.querySelectorAll('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(el.getAttribute('data-goto'));
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  window.addEventListener('hashchange', function () {
    showSection(location.hash.replace('#', ''), false);
  });

  var initial = (location.hash || '#about').replace('#', '');
  showSection(initial, false);
})();

// ---------- travel gallery lightbox ----------
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn = lightbox.querySelector('.lightbox-prev');
  var nextBtn = lightbox.querySelector('.lightbox-next');

  var currentGroup = [];
  var currentIndex = -1;

  function render() {
    var btn = currentGroup[currentIndex];
    if (!btn) return;
    lightboxImg.src = btn.getAttribute('data-full');
    lightboxImg.alt = btn.querySelector('img').alt || '';
    if (lightboxCaption) { lightboxCaption.textContent = btn.getAttribute('data-caption') || ''; }
  }

  function open(group, index) {
    currentGroup = group;
    currentIndex = index;
    render();
    lightbox.classList.add('open');
  }

  function close() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    if (lightboxCaption) { lightboxCaption.textContent = ''; }
    currentGroup = [];
    currentIndex = -1;
  }

  function showPrev() {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    render();
  }

  function showNext() {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + 1) % currentGroup.length;
    render();
  }

  ['.travel-gallery', '.about-gallery-scroll'].forEach(function (containerSelector) {
    document.querySelectorAll(containerSelector).forEach(function (container) {
      var group = Array.prototype.slice.call(container.querySelectorAll('button'));
      group.forEach(function (btn, index) {
        btn.addEventListener('click', function () {
          open(group, index);
        });
      });
    });
  });

  closeBtn.addEventListener('click', close);
  if (prevBtn) { prevBtn.addEventListener('click', showPrev); }
  if (nextBtn) { nextBtn.addEventListener('click', showNext); }
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();
