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
