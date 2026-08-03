/* HOUSE OF PONY — interactions */
(function(){
  "use strict";

  /* ---------- Nav scroll behavior ---------- */
  var nav = document.querySelector('.nav');
  var lastY = window.scrollY;
  function onScroll(){
    var y = window.scrollY;
    if (nav){
      nav.classList.toggle('scrolled', y > 40);
      if (y > lastY && y > 200){ nav.classList.add('hide'); }
      else { nav.classList.remove('hide'); }
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.nav-burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu){
    burger.addEventListener('click', function(){
      var open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold:0.14, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list') && item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(function(o){
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  /* ---------- FAQ category filter ---------- */
  var faqCats = document.querySelectorAll('.faq-cats button');
  if (faqCats.length){
    faqCats.forEach(function(btn){
      btn.addEventListener('click', function(){
        faqCats.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.cat;
        document.querySelectorAll('.faq-item').forEach(function(item){
          var show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  var galFilter = document.querySelectorAll('.gal-filter button');
  if (galFilter.length){
    galFilter.forEach(function(btn){
      btn.addEventListener('click', function(){
        galFilter.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.cat;
        document.querySelectorAll('.masonry-item').forEach(function(item){
          var show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox){
    var items = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));
    var lbMedia = lightbox.querySelector('.lb-media');
    var lbCount = lightbox.querySelector('.lightbox-count');
    var current = 0;

    function renderLB(){
      var el = items[current];
      var mono = el.querySelector('.mono');
      var isLight = el.querySelector('.media-ph').classList.contains('light');
      lbMedia.className = 'media-ph' + (isLight ? ' light' : '');
      lbMedia.innerHTML = '<span class="mono">' + (mono ? mono.textContent : '') + '</span>';
      lbCount.textContent = (current + 1) + ' / ' + items.length;
    }
    function openLB(i){
      current = i;
      renderLB();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLB(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    items.forEach(function(el, i){
      el.addEventListener('click', function(){ openLB(i); });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (closeBtn) closeBtn.addEventListener('click', closeLB);
    if (prevBtn) prevBtn.addEventListener('click', function(){ current = (current - 1 + items.length) % items.length; renderLB(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ current = (current + 1) % items.length; renderLB(); });
    lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', function(e){
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    });
  }

  /* ---------- Testimonials nav ---------- */
  var track = document.querySelector('.testi-track');
  var testiPrev = document.querySelector('.testi-nav .prev');
  var testiNext = document.querySelector('.testi-nav .next');
  if (track && testiPrev && testiNext){
    var scrollAmt = function(){ return track.querySelector('.testi-card').offsetWidth + 1; };
    testiPrev.addEventListener('click', function(){ track.scrollBy({ left:-scrollAmt(), behavior:'smooth' }); });
    testiNext.addEventListener('click', function(){ track.scrollBy({ left:scrollAmt(), behavior:'smooth' }); });
  }

  /* ---------- Booking widget (front-end demo) ---------- */
  var booking = document.querySelector('.booking-widget');
  if (booking){
    var bSteps = Array.prototype.slice.call(booking.querySelectorAll('.bk-step'));
    var bDots = Array.prototype.slice.call(booking.querySelectorAll('.bk-progress span'));
    var bIndex = 0;
    var selection = { service:null, date:null, time:null, servicePrice:null };

    function showStep(i){
      bSteps.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
      bDots.forEach(function(d, idx){
        d.classList.toggle('done', idx < i);
        d.classList.toggle('active', idx === i);
      });
      bIndex = i;
    }
    function setAll(selector, value){
      booking.querySelectorAll(selector).forEach(function(el){ el.textContent = value || '—'; });
    }
    function updateRecap(){
      setAll('.bk-recap-service', selection.service);
      setAll('.bk-recap-date', selection.date);
      setAll('.bk-recap-time', selection.time);
      setAll('.bk-recap-price', selection.servicePrice);
    }
    showStep(0);

    booking.querySelectorAll('[data-bk-service]').forEach(function(card){
      card.addEventListener('click', function(){
        booking.querySelectorAll('[data-bk-service]').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        selection.service = card.dataset.bkService;
        var priceEl = card.querySelector('.svc-price');
        selection.servicePrice = priceEl ? priceEl.textContent : '';
        setTimeout(function(){ showStep(1); }, 280);
      });
    });
    booking.querySelectorAll('[data-bk-date]').forEach(function(cell){
      cell.addEventListener('click', function(){
        if (cell.classList.contains('disabled')) return;
        booking.querySelectorAll('[data-bk-date]').forEach(function(c){ c.classList.remove('selected'); });
        cell.classList.add('selected');
        selection.date = cell.dataset.bkDate;
        setTimeout(function(){ showStep(2); }, 280);
      });
    });
    booking.querySelectorAll('[data-bk-time]').forEach(function(cell){
      cell.addEventListener('click', function(){
        booking.querySelectorAll('[data-bk-time]').forEach(function(c){ c.classList.remove('selected'); });
        cell.classList.add('selected');
        selection.time = cell.dataset.bkTime;
        updateRecap();
        setTimeout(function(){ showStep(3); }, 280);
      });
    });
    booking.querySelectorAll('[data-bk-back]').forEach(function(btn){
      btn.addEventListener('click', function(){ showStep(Math.max(0, bIndex - 1)); });
    });
    var confirmBtn = booking.querySelector('[data-bk-confirm]');
    if (confirmBtn){
      confirmBtn.addEventListener('click', function(){
        showStep(4);
      });
    }
  }

  /* ---------- Contact form (front-end validation, no backend wired) ---------- */
  var form = document.querySelector('.contact-form');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (status){
        status.textContent = 'Merci — votre demande a bien été enregistrée. House Of Pony vous répond sous 24 à 48h.';
        status.classList.add('show');
      }
      form.reset();
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

})();
