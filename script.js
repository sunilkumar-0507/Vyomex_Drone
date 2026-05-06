function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.remove("active");
}

function sendMail() {
  window.location.href = "mailto:vyomexdrone@gmail.com";
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
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Here you can send the data to your backend
      // For now, show a success message
      alert('Thank you for your inquiry! We will get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }
});
