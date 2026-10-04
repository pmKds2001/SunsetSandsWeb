/**
 * Sunset Sands Hotel - Hikkaduwa
 * Interactive Frontend JavaScript
 * Supports Mobile, iPad 10 (820px), Tablet & Desktop
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initHeroSlider();
  initChillSlider();
  // Leaflet map replaced with Google Maps embed
  // initLeafletMap();
  initStatsCounter();
  initBookingModal();
  initLightbox();
  initRoomDetailsModal();
  initPlaceModal();
  initBlogFilters();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile & Tablet Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  // Ensure backdrop exists
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    navLinks.classList.add('active');
    backdrop.classList.add('active');
    document.body.classList.add('menu-open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  // Close menu when clicking outside or clicking any nav link
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   3. Hero Section Carousel Slider (Multi-Image & Text Slider)
   ========================================================================== */
function initHeroSlider() {
  const heroSlider = document.querySelector('.hero-slider');
  if (!heroSlider) return;

  const slides = heroSlider.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-slider-dots');
  const prevBtn = document.querySelector('.hero-slider-prev');
  const nextBtn = document.querySelector('.hero-slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500;

  // Build dots dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to hero slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    // Dynamically apply data-overlay-color for slide
    const overlayColor = slides[currentSlide].getAttribute('data-overlay-color');
    const overlay = slides[currentSlide].querySelector('.hero-slide-overlay');
    if (overlay && overlayColor) {
      overlay.style.background = `linear-gradient(135deg, ${overlayColor} 0%, rgba(4, 8, 16, 0.85) 100%)`;
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startInterval() {
    stopInterval();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopInterval() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetInterval() {
    stopInterval();
    startInterval();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }

  // Pause on hover
  heroSlider.addEventListener('mouseenter', stopInterval);
  heroSlider.addEventListener('mouseleave', startInterval);

  // Touch Swipe Gesture Support for iPad & Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  heroSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopInterval();
  }, { passive: true });

  heroSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startInterval();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Initialize first slide overlay
  if (slides[0]) {
    const firstOverlayColor = slides[0].getAttribute('data-overlay-color');
    const firstOverlay = slides[0].querySelector('.hero-slide-overlay');
    if (firstOverlay && firstOverlayColor) {
      firstOverlay.style.background = `linear-gradient(135deg, ${firstOverlayColor} 0%, rgba(4, 8, 16, 0.85) 100%)`;
    }
  }

  startInterval();
}

/* ==========================================================================
   4. Chill Section Carousel Slider
   ========================================================================== */
function initChillSlider() {
  const slides = document.querySelectorAll('.chill-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  if (!slides.length || !dotsContainer) return;

  let currentSlide = 0;
  let slideInterval;

  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 4500);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();

  const container = document.querySelector('.chill-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(slideInterval));
    container.addEventListener('mouseleave', () => startInterval());
  }
}

/* ==========================================================================
   5. Leaflet Map (Hikkaduwa, Sri Lanka)
   ========================================================================== */
function initLeafletMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  // Hikkaduwa Beach Coordinates
  const hikkaduwaLat = 6.1395;
  const hikkaduwaLng = 80.1063;

  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([hikkaduwaLat, hikkaduwaLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Custom marker
  const marker = L.marker([hikkaduwaLat, hikkaduwaLng]).addTo(map);
  marker.bindPopup(`
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
      <strong style="color: #0c2340; font-size: 14px;">Sunset Sands Hotel</strong><br/>
      <span style="color: #555; font-size: 12px;">Galle Rd, Hikkaduwa</span><br/>
      <span style="color: #0084ff; font-weight: bold; font-size: 11px;">Beachfront Luxury</span>
    </div>
  `).openPopup();
}

/* ==========================================================================
   6. Number Counter Animation for Stats
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          animateNumber(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

function animateNumber(element, target, suffix) {
  const duration = 1600;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeProgress * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = target + suffix;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ==========================================================================
   7. Booking / Check Availability Modal
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.btn-check-availability, .btn-book-room, .btn-reservation, .btn-book, [href="#bookingModal"]');
  const closeBtn = modal.querySelector('.modal-close-btn');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Gallery Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let imagesList = [];
  let currentIndex = 0;

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      imagesList.push(img.src);
      item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
      });
    }
  });

  function openLightbox() {
    lightboxImg.src = imagesList[currentIndex];
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  }, { passive: true });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   9. Room Details Modal ("More....")
   ========================================================================== */
const roomData = {
  'seaview': {
    title: 'Sea View Rooms',
    subtitle: 'Panoramic ocean vistas & soothing waves of Hikkaduwa',
    img: 'images/room-seaview-1.jpg',
    price: '',
    desc: 'Includes Double Rooms D, H, and J. Includes Triple Room I, which features a sofa for extra comfort. Wake up to direct ocean horizons and gentle sea breezes from your window.',
    features: ['Includes Double Rooms D, H, and J', 'Includes Triple Room I (features sofa for extra comfort)', 'Direct Indian Ocean View', 'Air Conditioning & Ensuite Bathroom', 'Free High-Speed Wi-Fi', 'Daily Fresh Breakfast Available', 'Direct Beach Access', '100% Smoke Free Room']
  },
  'poolview': {
    title: 'Pool View Rooms',
    subtitle: 'Relaxing views overlooking the crystal-clear hotel pool',
    img: 'images/room-poolview-1.jpg',
    price: '',
    desc: 'Includes Triple Rooms F and L. Includes Family Room M, which accommodates 4 people with two double beds. Enjoy sunny terrace views and easy access to poolside relaxation.',
    features: ['Includes Triple Rooms F and L', 'Includes Family Room M (accommodates 4 people with 2 double beds)', 'Direct Poolside & Terrace View', 'Air Conditioning & Ceiling Fan', 'Free High-Speed Wi-Fi', 'Modern Ensuite Bathroom', 'Family-Friendly Amenities', 'Smoke Free Environment']
  },
  'gardenview': {
    title: 'Garden View Rooms',
    subtitle: 'Surrounded by lush tropical greenery & peaceful serenity',
    img: 'images/room-gardenview-1.jpg',
    price: '',
    desc: 'Includes Triple Rooms A and C. Includes Double Room B. Includes Double Rooms E and K, which are specifically noted as having no balcony. A peaceful retreat nestled in tropical garden surroundings.',
    features: ['Includes Triple Rooms A and C', 'Includes Double Room B', 'Includes Double Rooms E and K (specifically noted as having no balcony)', 'Serene Tropical Garden Environment', 'Air Conditioning & Ensuite Bathroom', 'Free High-Speed Wi-Fi', 'Daily Housekeeping', 'Smoke Free Environment']
  },
  'gardenseaview': {
    title: 'Garden & Sea View Rooms',
    subtitle: 'A harmonious blend of lush tropical gardens and coastal ocean horizon',
    img: 'images/room-seaview-2.jpg',
    price: '',
    desc: 'Includes Triple Room G, which offers a combined garden and sea view for the best of both natural greenery and refreshing coastal waves.',
    features: ['Includes Triple Room G', 'Combined Garden and Sea View', 'Spacious Comfortable Layout', 'Air Conditioning & Ceiling Fan', 'Free High-Speed Wi-Fi', 'Ensuite Bathroom with Rain Shower', 'In-room Coffee & Tea Maker', 'Smoke Free Environment']
  },
  'single': {
    title: 'Sea View Rooms',
    subtitle: 'Panoramic ocean vistas & soothing waves of Hikkaduwa',
    img: 'images/room-seaview-1.jpg',
    price: '',
    desc: 'Includes Double Rooms D, H, and J. Includes Triple Room I, which features a sofa for extra comfort.',
    features: ['Double Rooms D, H, and J', 'Triple Room I (with sofa)', 'Direct Sea View', 'Free Wi-Fi']
  },
  'double': {
    title: 'Pool View Rooms',
    subtitle: 'Relaxing views overlooking the crystal-clear hotel pool',
    img: 'images/room-poolview-1.jpg',
    price: '',
    desc: 'Includes Triple Rooms F and L. Includes Family Room M, which accommodates 4 people with two double beds.',
    features: ['Triple Rooms F and L', 'Family Room M (4 guests)', 'Pool View', 'Free Wi-Fi']
  },
  'deluxe': {
    title: 'Garden View Rooms',
    subtitle: 'Surrounded by lush tropical greenery & peaceful serenity',
    img: 'images/room-gardenview-1.jpg',
    price: '',
    desc: 'Includes Triple Rooms A and C, Double Room B, and Double Rooms E and K (no balcony).',
    features: ['Triple Rooms A and C', 'Double Room B', 'Rooms E & K (no balcony)', 'Free Wi-Fi']
  },
  'family': {
    title: 'Garden & Sea View Rooms',
    subtitle: 'Combined garden and sea view',
    img: 'images/room-seaview-2.jpg',
    price: '',
    desc: 'Includes Triple Room G, which offers a combined garden and sea view.',
    features: ['Triple Room G', 'Combined Garden & Sea View', 'Free Wi-Fi']
  }
};

function initRoomDetailsModal() {
  const modal = document.getElementById('roomDetailModal');
  const moreButtons = document.querySelectorAll('.btn-more');
  if (!modal || !moreButtons.length) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const titleEl = document.getElementById('roomDetailTitle');
  const subtitleEl = document.getElementById('roomDetailSubtitle');
  const imgEl = document.getElementById('roomDetailImg');
  const descEl = document.getElementById('roomDetailDesc');
  const priceEl = document.getElementById('roomDetailPrice');
  const amenitiesListEl = document.getElementById('roomDetailAmenities');
  const bookBtn = document.getElementById('roomDetailBookBtn');

  moreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomId = btn.getAttribute('data-room-id');
      const data = roomData[roomId] || roomData['seaview'];

      if (titleEl) titleEl.textContent = data.title;
      if (subtitleEl) subtitleEl.textContent = data.subtitle;
      if (imgEl) imgEl.src = data.img;
      if (descEl) descEl.textContent = data.desc;
      if (priceEl) {
        priceEl.textContent = '';
        priceEl.style.display = 'none';
      }

      if (amenitiesListEl) {
        amenitiesListEl.innerHTML = '';
        data.features.forEach(f => {
          const item = document.createElement('div');
          item.className = 'amenity-item';
          item.innerHTML = `<i class="fa-solid fa-check"></i> <span>${f}</span>`;
          amenitiesListEl.appendChild(item);
        });
      }

      if (bookBtn) {
        bookBtn.onclick = () => {
          modal.classList.remove('active');
          const bookingModal = document.getElementById('bookingModal');
          const roomSelect = document.getElementById('roomType');
          if (roomSelect) {
            roomSelect.value = roomId;
          }
          if (bookingModal) bookingModal.classList.add('active');
        };
      }

      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   10. DownSouth Places Modal ("Best of DownSouth" Popup)
   ========================================================================== */
const downsouthPlacesData = {
  'galle-fort': {
    title: 'Discover the Historic Galle Fort',
    subtitle: 'UNESCO World Heritage Site • Galle, Sri Lanka (approx. 20-25 mins from Sunset Sands)',
    tag: 'Historical Landmark',
    images: [
      {
        src: 'images/galle-fort-lighthouse.jpg',
        caption: 'Iconic Galle Lighthouse & Coastal Pathway'
      },
      {
        src: 'images/galle-fort-aerial.jpg',
        caption: 'Panoramic Aerial View of Galle Fort Peninsula & Historic Ramparts'
      },
      {
        src: 'images/galle-fort-sunset.jpg',
        caption: 'Golden Sunset View Over the Indian Ocean from Fort Walls'
      }
    ],
    sections: [
      {
        heading: 'Discover the Historic Galle Fort',
        content: 'Galle Fort is one of Sri Lanka’s most iconic historical landmarks, located along the beautiful southern coast of the island. Built by the Portuguese in the 16th century and later expanded by the Dutch, the fort is surrounded by massive stone walls that have stood for centuries. Walking through its narrow streets, visitors can discover colonial-era buildings, historic churches, charming cafés, boutique shops, and beautiful views of the Indian Ocean. The unique combination of European architecture and Sri Lankan culture makes Galle Fort a fascinating destination for travelers who want to experience the history and character of the island.'
      },
      {
        heading: 'A Walk Through Galle Fort',
        content: 'A visit to Galle Fort offers more than just a glimpse into Sri Lanka’s colonial past—it is an experience filled with atmosphere, culture, and unforgettable views. Visitors can enjoy a relaxing walk along the fort walls, watch the sunset over the ocean, and explore historic streets filled with traditional architecture and modern cafés. The Old Town within the fort has a peaceful charm that makes it ideal for photography, sightseeing, shopping, and enjoying local and international cuisine. Whether you visit during the day or in the evening, Galle Fort provides a memorable journey through one of Sri Lanka’s most distinctive heritage destinations.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-route', label: 'Distance', val: '20-25 mins from hotel' },
      { icon: 'fa-solid fa-clock', label: 'Best Time', val: 'Early Morning & Sunset' },
      { icon: 'fa-solid fa-camera', label: 'Highlights', val: 'Lighthouse, Ramparts, Cafés' }
    ],
    mapUrl: 'https://maps.google.com/?q=Galle+Fort+Sri+Lanka'
  },
  'turtle-beach': {
    title: 'Hikkaduwa Turtle Beach',
    subtitle: 'Natural Marine Attraction • Just minutes from Sunset Sands Hotel',
    tag: 'Wildlife & Nature',
    images: [
      {
        src: 'images/turtle-beach-shore.jpg',
        caption: 'Up-Close Encounter with Wild Sea Turtles on the Beach'
      },
      {
        src: 'images/turtle-beach-swimming.jpg',
        caption: 'Sea Turtles Swimming in Tropical Turquoise Lagoon'
      },
      {
        src: 'images/turtle-beach-feeding.jpg',
        caption: 'Feeding Gentle Giant Sea Turtles in Clear Waters'
      },
      {
        src: 'images/turtle-beach-close.jpg',
        caption: 'Friendly Sea Turtle Feeding on Natural Seaweed by the Shore'
      }
    ],
    sections: [
      {
        heading: 'Hikkaduwa Turtle Beach',
        content: 'Hikkaduwa Turtle Beach is one of the most popular coastal attractions in southern Sri Lanka, offering visitors a chance to see beautiful sea turtles in their natural environment. Located along the warm waters of Hikkaduwa, the beach is known for its clear shallow waters, golden sand, and frequent turtle sightings close to the shore. Visitors can enjoy watching these gentle marine creatures, swimming, snorkeling, and relaxing by the ocean. A visit to Turtle Beach is a memorable experience for nature lovers and families looking to enjoy the natural beauty of Sri Lanka’s southern coastline.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-location-dot', label: 'Distance', val: 'Minutes from Hotel' },
      { icon: 'fa-solid fa-water', label: 'Activity', val: 'Snorkeling & Feeding' },
      { icon: 'fa-solid fa-shield-heart', label: 'Experience', val: 'Wild & Protected' }
    ],
    mapUrl: 'https://maps.google.com/?q=Hikkaduwa+Turtle+Beach+Sri+Lanka'
  },
  'turtle-hatchery': {
    title: 'Sea Turtle Hatchery & Rescue Center',
    subtitle: 'Marine Conservation & Wildlife Rescue • Hikkaduwa, Sri Lanka',
    tag: 'Conservation & Rescue',
    images: [
      {
        src: 'images/turtle-rescue-pool.jpg',
        caption: 'Rescued Giant Sea Turtles in Conservation Rehabilitation Pool'
      },
      {
        src: 'images/turtle-rescue-hatchlings.jpg',
        caption: 'Newborn Sea Turtle Hatchlings in Protected Nursery Pool'
      },
      {
        src: 'images/turtle-rescue-visitor.jpg',
        caption: 'Up-Close Care & Rehabilitation of Rescued Sea Turtles'
      }
    ],
    sections: [
      {
        heading: 'Sea Turtle Hatchery & Rescue Center',
        content: 'The Sea Turtle Hatchery & Rescue Center in Hikkaduwa is a vital marine conservation project dedicated to protecting vulnerable sea turtle species along Sri Lanka’s southern coast. The center rescues injured and disabled turtles, shields nesting sites from predators and poachers, and cares for newborn hatchlings until they are strong enough to be released into the open ocean.'
      },
      {
        heading: 'An Inspiring Marine Wildlife Encounter',
        content: 'Visitors have the unique privilege to see giant rescued sea turtles up close, watch newborn hatchlings swim in crystal-clear saltwater nursery pools, and learn about the tireless work done by local conservationists. A visit to the rescue center offers a heartwarming and unforgettable experience for nature lovers, couples, and families exploring Hikkaduwa.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-hand-holding-heart', label: 'Mission', val: 'Rescue, Care & Release' },
      { icon: 'fa-solid fa-clock', label: 'Open Hours', val: 'Daily 8:00 AM – 6:00 PM' },
      { icon: 'fa-solid fa-shield-cat', label: 'Highlights', val: 'Baby Hatchlings & Giant Turtles' }
    ],
    mapUrl: 'https://maps.google.com/?q=Sea+Turtle+Hatchery+and+Rescue+Center+Hikkaduwa'
  },
  'hikkaduwa-surf': {
    title: 'Surfing & Coral Reef Snorkeling',
    subtitle: 'Tropical Waters & World-Class Waves • Hikkaduwa, Sri Lanka',
    tag: 'Activities & Adventure',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop',
        caption: 'Surfing the World-Famous Reef Breaks of Hikkaduwa'
      },
      {
        src: 'images/turtle-beach-swimming.jpg',
        caption: 'Snorkeling the Turquoise Coral Reef Lagoons'
      },
      {
        src: 'images/hero-poolside-sun.jpg',
        caption: 'Relaxing Beachside After a Day of Surfing'
      }
    ],
    sections: [
      {
        heading: 'Surfing Capital of the South Coast',
        content: 'Hikkaduwa has been Sri Lanka’s premier surf destination since the 1970s. Famous for its consistent reef and beach breaks, warm Indian Ocean waters, and vibrant beach culture, it offers world-class waves for seasoned surfers as well as gentle whitewash swells for beginners.'
      },
      {
        heading: 'Vibrant Coral Reef Marine Sanctuary',
        content: 'Just offshore lies the Hikkaduwa Coral Sanctuary, home to over 60 species of hard corals and hundreds of colorful tropical fish. Slip on your mask and snorkel to float above butterflyfish, parrotfish, and gentle sea turtles in shallow, crystal-clear lagoons.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-water', label: 'Best Season', val: 'November to April' },
      { icon: 'fa-solid fa-person-swimming', label: 'Activities', val: 'Surfing, Snorkeling, SUP' },
      { icon: 'fa-solid fa-location-dot', label: 'Distance', val: 'Steps from Hotel' }
    ],
    mapUrl: 'https://maps.google.com/?q=Hikkaduwa+Beach+Sri+Lanka'
  },
  'southern-sunsets': {
    title: 'Southern Coast Sunset Spotlights',
    subtitle: 'Golden Hour Splendor • Hikkaduwa & Southern Sri Lanka',
    tag: 'Travel Guide',
    images: [
      {
        src: 'images/galle-fort-sunset.jpg',
        caption: 'Sunset Glow Over the Indian Ocean from Galle Fort Ramparts'
      },
      {
        src: 'images/hero-sunset-balcony.jpg',
        caption: 'Evening Twilight Atmosphere from Sunset Sands Hotel'
      },
      {
        src: 'images/hero-pool-twilight.jpg',
        caption: 'Reflections in the Swimming Pool at Dusk'
      }
    ],
    sections: [
      {
        heading: 'The Magic of Down South Twilight',
        content: 'Evenings in southern Sri Lanka are legendary. As the tropical sun dips toward the horizon, the sky transforms into fiery shades of amber, violet, and deep coral gold. Whether you are walking along the shore or enjoying a chilled drink on our terrace, sunset here is an unmissable daily ritual.'
      },
      {
        heading: 'Best Viewpoints Around Sunset Sands',
        content: 'Top sunset spots include the ancient granite ramparts of Galle Fort, Narigama Beach with its wide open shoreline, and our very own Sunset Sands terrace lounge where warm lanterns glow as twilight descends.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-sun', label: 'Golden Hour', val: '5:45 PM – 6:30 PM' },
      { icon: 'fa-solid fa-camera', label: 'Vibe', val: 'Photography & Romance' },
      { icon: 'fa-solid fa-martini-glass-citrus', label: 'Atmosphere', val: 'Chilled Drinks & Music' }
    ],
    mapUrl: 'https://maps.google.com/?q=Sunset+Sands+Villa+Hikkaduwa'
  },
  'seafood-dining': {
    title: 'Flavors of Down South Seafood & Dining',
    subtitle: 'Authentic Coastal Cuisine • Hikkaduwa, Sri Lanka',
    tag: 'Local Experiences',
    images: [
      {
        src: 'images/banner-dining.jpg',
        caption: 'Fresh Beachfront Ocean Dining at Sunset Sands'
      },
      {
        src: 'images/banner-garden.jpg',
        caption: 'Tropical Garden Ambiance for Evening Dinners'
      },
      {
        src: 'images/hero-entrance-twilight.jpg',
        caption: 'Warm Evening Hospitality and Dining'
      }
    ],
    sections: [
      {
        heading: 'Fresh Catch of the Day',
        content: 'From grilled jumbo prawns and spiced butterfish to authentic southern Sri Lankan fish curry cooked in rich coconut milk and clay pots, Hikkaduwa is a paradise for seafood lovers. Experience fresh local ingredients and fragrant spices sourced daily from local harbors.'
      },
      {
        heading: 'Beachfront Dining Experience',
        content: 'Dine with the sound of ocean waves beneath swaying coconut palms. Enjoy candlelit tables on the beach, tropical cocktails, fresh hoppers for breakfast, and mouthwatering local and international specialties.'
      }
    ],
    facts: [
      { icon: 'fa-solid fa-utensils', label: 'Cuisine', val: 'Fresh Seafood & Curries' },
      { icon: 'fa-solid fa-fish', label: 'Specialties', val: 'Jumbo Prawns, Crab, Fish' },
      { icon: 'fa-solid fa-champagne-glasses', label: 'Setting', val: 'Beachfront & Candlelight' }
    ],
    mapUrl: 'https://maps.google.com/?q=Sunset+Sands+Villa+Hikkaduwa'
  }
};

function initPlaceModal() {
  const modal = document.getElementById('placeModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.modal-close-btn, .btn-place-close');
  const titleEl = document.getElementById('placeModalTitle');
  const subtitleEl = document.getElementById('placeModalSubtitle');
  const tagEl = document.getElementById('placeModalTag');
  const mainImgEl = document.getElementById('placeMainImg');
  const captionEl = document.getElementById('placeImgCaption');
  const thumbnailsContainer = document.getElementById('placeThumbnails');
  const prevBtn = document.getElementById('placeGalleryPrev');
  const nextBtn = document.getElementById('placeGalleryNext');
  const factsContainer = document.getElementById('placeFactsRow');
  const sectionsContainer = document.getElementById('placeSections');
  const directionsBtn = document.getElementById('placeDirectionsBtn');

  let currentImages = [];
  let currentImgIndex = 0;

  function renderGalleryImage(index) {
    if (!currentImages.length) return;
    currentImgIndex = (index + currentImages.length) % currentImages.length;
    const imgData = currentImages[currentImgIndex];
    if (mainImgEl) {
      mainImgEl.style.opacity = '0.35';
      setTimeout(() => {
        mainImgEl.src = imgData.src;
        mainImgEl.alt = imgData.caption;
        mainImgEl.style.opacity = '1';
      }, 120);
    }
    if (captionEl) captionEl.textContent = imgData.caption;

    if (thumbnailsContainer) {
      const thumbs = thumbnailsContainer.querySelectorAll('.place-thumb');
      thumbs.forEach((th, i) => {
        th.classList.toggle('active', i === currentImgIndex);
      });
    }
  }

  function openPlace(placeId) {
    const data = downsouthPlacesData[placeId];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (tagEl) tagEl.innerHTML = `<i class="fa-solid fa-landmark"></i> ${data.tag}`;

    currentImages = data.images || [];
    currentImgIndex = 0;

    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = '';
      currentImages.forEach((img, i) => {
        const thumb = document.createElement('div');
        thumb.className = `place-thumb ${i === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img.src}" alt="${img.caption}">`;
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          renderGalleryImage(i);
        });
        thumbnailsContainer.appendChild(thumb);
      });
    }

    renderGalleryImage(0);

    if (factsContainer) {
      factsContainer.innerHTML = '';
      (data.facts || []).forEach(f => {
        const item = document.createElement('div');
        item.className = 'place-fact-item';
        item.innerHTML = `
          <div class="place-fact-icon"><i class="${f.icon}"></i></div>
          <div>
            <div class="place-fact-label">${f.label}</div>
            <div class="place-fact-val">${f.val}</div>
          </div>
        `;
        factsContainer.appendChild(item);
      });
    }

    if (sectionsContainer) {
      sectionsContainer.innerHTML = '';
      (data.sections || []).forEach(sec => {
        const block = document.createElement('div');
        block.className = 'place-desc-block';
        block.innerHTML = `
          <h4 class="place-desc-heading">${sec.heading}</h4>
          <p class="place-desc-text">${sec.content}</p>
        `;
        sectionsContainer.appendChild(block);
      });
    }

    if (directionsBtn && data.mapUrl) {
      directionsBtn.href = data.mapUrl;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  const closePlaceModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closePlaceModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePlaceModal();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderGalleryImage(currentImgIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderGalleryImage(currentImgIndex + 1);
    });
  }

  // Mobile Touch Swipe for Place Gallery
  const placeImgWrap = modal.querySelector('.place-main-img-wrap');
  if (placeImgWrap) {
    let pTouchStartX = 0;
    let pTouchEndX = 0;
    placeImgWrap.addEventListener('touchstart', (e) => {
      pTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    placeImgWrap.addEventListener('touchend', (e) => {
      pTouchEndX = e.changedTouches[0].screenX;
      const diff = pTouchEndX - pTouchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          renderGalleryImage(currentImgIndex + 1);
        } else {
          renderGalleryImage(currentImgIndex - 1);
        }
      }
    }, { passive: true });
  }

  document.querySelectorAll('[data-place]').forEach(el => {
    el.addEventListener('click', (e) => {
      const placeId = el.getAttribute('data-place');
      if (placeId && downsouthPlacesData[placeId]) {
        e.preventDefault();
        openPlace(placeId);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closePlaceModal();
    if (e.key === 'ArrowRight') renderGalleryImage(currentImgIndex + 1);
    if (e.key === 'ArrowLeft') renderGalleryImage(currentImgIndex - 1);
  });
}

/* ==========================================================================
   Blog Page Category Filter
   ========================================================================== */
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const cards = document.querySelectorAll('.blog-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
