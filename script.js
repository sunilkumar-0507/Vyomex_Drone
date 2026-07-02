function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

function openQuoteModal() {
  const modal = document.getElementById('quoteModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the content
window.addEventListener('click', (event) => {
  const modal = document.getElementById('quoteModal');
  if (event.target === modal) {
    closeQuoteModal();
  }
});

// Close modal on ESC key press
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeQuoteModal();
  }
});

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.remove("active");
}

function sendMail() {
  window.location.href = "mailto:vyomextech@gmail.com";
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("header") && !e.target.closest(".mobile-menu")) {
      mobileMenu.classList.remove("active");
    }
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          closeMobileMenu();
        }
      }
    });
  });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`a[href="#${section.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
});

// ============ FLIP CARD FUNCTIONALITY ============
document.addEventListener('DOMContentLoaded', () => {
  // Flip Card Toggle
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      this.classList.toggle('flipped');
    });
  });

  // ============ CAROUSEL FUNCTIONALITY ============
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselCards = document.querySelectorAll('.carousel-card');
  const carouselDots = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const CARD_GAP = 20; // must match CSS gap on .carousel-track
  let currentIndex = 0;
  const totalCards = carouselCards.length;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  // Set every card's pixel width so they fill the wrapper evenly
  function sizeCards() {
    const cpv = getCardsPerView();
    const wrapperWidth = carouselTrack.parentElement.offsetWidth;
    const cardWidth = Math.floor((wrapperWidth - CARD_GAP * (cpv - 1)) / cpv);
    carouselCards.forEach(card => {
      card.style.width = cardWidth + 'px';
    });
    return cardWidth;
  }

  // Create dots
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    carouselDots.appendChild(dot);
  }

  const dots = document.querySelectorAll('.carousel-dot');

  // Mark the cards currently in view so their content can animate in
  function updateActiveCards() {
    const cpv = getCardsPerView();
    carouselCards.forEach((card, i) => {
      card.classList.toggle('is-active', i >= currentIndex && i < currentIndex + cpv);
    });
  }

  function updateCarousel() {
    const cardWidth = sizeCards();
    const offset = -currentIndex * (cardWidth + CARD_GAP);
    carouselTrack.style.transform = `translateX(${offset}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    updateActiveCards();
  }

  function goToSlide(index) {
    const cpv = getCardsPerView();
    currentIndex = Math.max(0, Math.min(index, totalCards - cpv));
    updateCarousel();
  }

  function nextSlide() {
    const cpv = getCardsPerView();
    currentIndex = currentIndex < totalCards - cpv ? currentIndex + 1 : 0;
    updateCarousel();
  }

  function prevSlide() {
    const cpv = getCardsPerView();
    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - cpv;
    updateCarousel();
  }

  // ----- Autoplay (pauses on interaction / hidden tab / reduced-motion) -----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_MS = 5000;
  let autoplayTimer = null;

  function startAutoplay() {
    stopAutoplay();
    if (reduceMotion || totalCards <= getCardsPerView()) return;
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
  });

  // ----- Touch / swipe support for mobile -----
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    isSwiping = true;
    stopAutoplay();
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    if (Math.abs(touchDeltaX) > 45) {
      if (touchDeltaX < 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  });

  // Pause autoplay while the pointer is over the carousel
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
  }

  // Pause when the tab isn't visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Recalculate card widths on resize (debounced, keeps position in range)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const cpv = getCardsPerView();
      currentIndex = Math.min(currentIndex, Math.max(0, totalCards - cpv));
      updateCarousel();
    }, 120);
  });

  // Create drone animations
  const droneAnimationElements = document.querySelectorAll('.drone-animation');
  droneAnimationElements.forEach((el, index) => {
    el.innerHTML = createDroneSVG(index);
  });

  // Enable the staggered content animation, then lay everything out
  carouselTrack.classList.add('enhanced');
  updateCarousel();
  startAutoplay();

  // ----- Scroll-reveal for headings, underlines & the carousel -----
  const revealTargets = Array.from(document.querySelectorAll('section h2, section .underline'));
  const whyChooseCarousel = document.querySelector('.why-choose .carousel-container');
  if (whyChooseCarousel) revealTargets.push(whyChooseCarousel);

  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }
});

// Create animated 3D drone SVG with SMIL propeller animations
function createDroneSVG(index) {
  const colors = ['#00d4ff', '#9933ff', '#00f0ff', '#0066d9', '#ff6b35', '#00cc88'];
  const color = colors[index % colors.length];
  const speeds = ['0.22s', '0.28s', '0.19s', '0.25s', '0.21s', '0.26s'];
  const speed = speeds[index % speeds.length];
  const glowSpeed = (2.5 + index * 0.3).toFixed(1) + 's';

  return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"
         style="width:100%;height:100%;filter:drop-shadow(0 0 10px ${color}66)">

      <!-- Arms (X-pattern, diagonal) -->
      <line x1="60" y1="60" x2="20" y2="20" stroke="${color}" stroke-width="3"
            stroke-linecap="round" opacity="0.75"/>
      <line x1="60" y1="60" x2="100" y2="20" stroke="${color}" stroke-width="3"
            stroke-linecap="round" opacity="0.75"/>
      <line x1="60" y1="60" x2="20" y2="100" stroke="${color}" stroke-width="3"
            stroke-linecap="round" opacity="0.75"/>
      <line x1="60" y1="60" x2="100" y2="100" stroke="${color}" stroke-width="3"
            stroke-linecap="round" opacity="0.75"/>

      <!-- Motor mounts -->
      <circle cx="20" cy="20" r="5.5" fill="${color}" opacity="0.55"/>
      <circle cx="100" cy="20" r="5.5" fill="${color}" opacity="0.55"/>
      <circle cx="20" cy="100" r="5.5" fill="${color}" opacity="0.55"/>
      <circle cx="100" cy="100" r="5.5" fill="${color}" opacity="0.55"/>

      <!-- Propeller blur halos -->
      <circle cx="20" cy="20" r="15" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.22"/>
      <circle cx="100" cy="20" r="15" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.22"/>
      <circle cx="20" cy="100" r="15" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.22"/>
      <circle cx="100" cy="100" r="15" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.22"/>

      <!-- Spinning propeller – top-left (CCW) -->
      <g>
        <line x1="7" y1="20" x2="33" y2="20" stroke="${color}" stroke-width="2.5"
              stroke-linecap="round" opacity="0.9"/>
        <line x1="20" y1="7" x2="20" y2="33" stroke="${color}" stroke-width="2"
              stroke-linecap="round" opacity="0.7"/>
        <animateTransform attributeName="transform" type="rotate"
          from="0 20 20" to="-360 20 20" dur="${speed}" repeatCount="indefinite"/>
      </g>

      <!-- Spinning propeller – top-right (CW) -->
      <g>
        <line x1="87" y1="20" x2="113" y2="20" stroke="${color}" stroke-width="2.5"
              stroke-linecap="round" opacity="0.9"/>
        <line x1="100" y1="7" x2="100" y2="33" stroke="${color}" stroke-width="2"
              stroke-linecap="round" opacity="0.7"/>
        <animateTransform attributeName="transform" type="rotate"
          from="0 100 20" to="360 100 20" dur="${speed}" repeatCount="indefinite"/>
      </g>

      <!-- Spinning propeller – bottom-left (CW) -->
      <g>
        <line x1="7" y1="100" x2="33" y2="100" stroke="${color}" stroke-width="2.5"
              stroke-linecap="round" opacity="0.9"/>
        <line x1="20" y1="87" x2="20" y2="113" stroke="${color}" stroke-width="2"
              stroke-linecap="round" opacity="0.7"/>
        <animateTransform attributeName="transform" type="rotate"
          from="0 20 100" to="360 20 100" dur="${speed}" repeatCount="indefinite"/>
      </g>

      <!-- Spinning propeller – bottom-right (CCW) -->
      <g>
        <line x1="87" y1="100" x2="113" y2="100" stroke="${color}" stroke-width="2.5"
              stroke-linecap="round" opacity="0.9"/>
        <line x1="100" y1="87" x2="100" y2="113" stroke="${color}" stroke-width="2"
              stroke-linecap="round" opacity="0.7"/>
        <animateTransform attributeName="transform" type="rotate"
          from="0 100 100" to="-360 100 100" dur="${speed}" repeatCount="indefinite"/>
      </g>

      <!-- Body: 3D shadow layer -->
      <rect x="49" y="54" width="26" height="20" rx="5" fill="rgba(0,0,0,0.45)"/>
      <!-- Body: glow halo -->
      <rect x="45" y="45" width="30" height="26" rx="6" fill="${color}" opacity="0.08"/>
      <!-- Body: main face -->
      <rect x="47" y="47" width="26" height="22" rx="5" fill="${color}" opacity="0.92"/>
      <!-- Body: top highlight strip -->
      <rect x="50" y="50" width="14" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
      <!-- Body: dark inset -->
      <rect x="53" y="55" width="8" height="8" rx="2" fill="rgba(0,0,0,0.35)"/>

      <!-- Camera gimbal -->
      <circle cx="60" cy="75" r="6.5" fill="${color}" opacity="0.35"/>
      <circle cx="60" cy="75" r="4.5" fill="${color}" opacity="0.8"/>
      <circle cx="60" cy="75" r="2.2" fill="rgba(0,0,0,0.5)"/>
      <circle cx="58.8" cy="73.8" r="0.8" fill="rgba(255,255,255,0.65)"/>

      <!-- Blinking status LED -->
      <circle cx="60" cy="55" r="2.2" fill="white" opacity="0.95">
        <animate attributeName="opacity" values="0.95;0.1;0.95" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2.2;2.8;2.2" dur="1.2s" repeatCount="indefinite"/>
      </circle>

      <!-- Pulsing glow ring -->
      <circle cx="60" cy="60" r="30" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.12">
        <animate attributeName="r" values="28;34;28" dur="${glowSpeed}" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="${glowSpeed}" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
}

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  const quoteForm = document.getElementById('quoteForm');
  
  function handleFormSubmit(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      
      // Here you can send the data to your backend
      // For now, show a success message
      alert('Thank you for your inquiry! We will get back to you soon.');
      
      // Reset form
      form.reset();
      
      // Close modal if it's the quote form
      if (form === quoteForm) {
        closeQuoteModal();
      }
    });
  }
  
  if (contactForm) {
    handleFormSubmit(contactForm);
  }
  
  if (quoteForm) {
    handleFormSubmit(quoteForm);
  }
});

// ============ 3D DRONE ANIMATION ============
class DroneAnimation {
  constructor() {
    this.container = document.getElementById('drone-container');
    if (!this.container) return;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.drone = null;
    this.particles = [];
    this.time = 0;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null;
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    this.setupLights();
    
    // Create drone
    this.createDrone();
    
    // Create particles
    this.createParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation
    this.animate();
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1.5);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Point light for glow effect
    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);
    
    // Accent light
    const accentLight = new THREE.PointLight(0x9933ff, 0.8, 80);
    accentLight.position.set(-10, 8, 5);
    this.scene.add(accentLight);
  }
  
  createDrone() {
    this.drone = new THREE.Group();
    
    // Create glowing material
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      emissive: 0x0099ff,
      emissiveIntensity: 0.8
    });
    
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x001a4d,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.3
    });
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.3, 1.2);
    const body = new THREE.Mesh(bodyGeometry, darkMaterial);
    body.castShadow = true;
    this.drone.add(body);
    
    // Create arms with rotors
    this.createArm(0.5, 0.4, 0.3);   // Front right
    this.createArm(-0.5, 0.4, 0.3);  // Front left
    this.createArm(0.5, 0.4, -0.3);  // Back right
    this.createArm(-0.5, 0.4, -0.3); // Back left
    
    // Center hub
    const hubGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const hub = new THREE.Mesh(hubGeometry, glowMaterial);
    this.drone.add(hub);
    
    // Camera pod
    const cameraGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const camera = new THREE.Mesh(cameraGeometry, glowMaterial);
    camera.position.y = -0.15;
    this.drone.add(camera);
    
    this.scene.add(this.drone);
  }
  
  createArm(x, y, z) {
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a2f4d,
      metalness: 0.6,
      roughness: 0.4
    });
    
    // Arm
    const armGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.4);
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(x, y, z);
    this.drone.add(arm);
    
    // Rotor (propeller)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(x, y, z);
    
    const rotorGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.1);
    const rotorMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0099ff,
      emissiveIntensity: 0.5
    });
    
    const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
    rotor.name = 'rotor';
    rotor.castShadow = true;
    rotorGroup.add(rotor);
    
    this.drone.add(rotorGroup);
  }
  
  createParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.6
    });
    
    for (let i = 0; i < 30; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 8,
        (Math.random() - 0.5) * 15
      );
      
      particle.velocity = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      };
      
      particle.life = Math.random() * 100;
      particle.maxLife = particle.life;
      
      this.scene.add(particle);
      this.particles.push(particle);
    }
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.time += 0.016;
    
    // Move drone along a smooth path
    const pathX = Math.sin(this.time * 0.5) * 3;
    const pathY = 3 + Math.cos(this.time * 0.3) * 1.5;
    const pathZ = Math.cos(this.time * 0.5) * 4;
    
    this.drone.position.set(pathX, pathY, pathZ);
    
    // Tilt drone based on movement
    const moveAngle = Math.sin(this.time * 0.5);
    this.drone.rotation.z = moveAngle * 0.3;
    this.drone.rotation.x = Math.cos(this.time * 0.3) * 0.2;
    
    // Rotate rotors
    this.drone.traverse((child) => {
      if (child.name === 'rotor') {
        child.parent.rotation.z += 0.5;
      }
    });
    
    // Update particles
    this.particles.forEach((particle) => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;
      
      particle.life--;
      if (particle.life <= 0) {
        particle.position.set(
          (Math.random() - 0.5) * 15,
          Math.random() * 8,
          (Math.random() - 0.5) * 15
        );
        particle.life = particle.maxLife;
      }
      
      particle.material.opacity = (particle.life / particle.maxLife) * 0.6;
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer && this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Initialize drone animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new DroneAnimation();
  }, 100);
});
