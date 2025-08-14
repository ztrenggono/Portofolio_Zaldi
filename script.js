// Performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Intersection Observer with better performance
const createIntersectionObserver = (callback, options = {}) => {
    return new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
    });
};

// Typing Text Animation
const typingText = document.querySelector('.typing-text');
const words = ["i'm a Web Developer", "i'm a Mobile Apps Developer", "i'm a Full-Stack Developer", "i'm a student at SMK Wikrama Bogor", "i'm a freelancer"]; // Updated words
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isEnd = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    const shouldDelete = isDeleting && charIndex > 0;
    const shouldWrite = !isDeleting && charIndex < currentWord.length;
    
    if (shouldDelete) {
        charIndex--;
    } else if (shouldWrite) {
        charIndex++;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500; // Pause at word end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 700; // Pause before starting new word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start the typing animation
typeEffect();

// Smooth scrolling for navigation links with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect with debouncing for better performance
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

const handleScroll = debounce(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// Mobile menu toggle with better event handling
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside with event delegation
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('fa-times');
    }
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('fa-times');
    });
});

// Intersection Observer for animations with better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add stagger effect to skill tags
            if (entry.target.classList.contains('skill-tags')) {
                entry.target.querySelectorAll('span').forEach((tag, index) => {
                    setTimeout(() => {
                        tag.classList.add('visible');
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.section-header, .about-text, .skills, .project-card, .contact-form, .skill-tags span, .skill-card').forEach((el, index) => {
    if (el.classList.contains('skill-card')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
    }
    observer.observe(el);
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.appendChild(progressBar);

const updateProgressBar = debounce(() => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
}, 10);

window.addEventListener('scroll', updateProgressBar, { passive: true });

// Social Links Animation and Functionality
const socialLinks = document.querySelectorAll('.social-links a');

socialLinks.forEach(link => {
    // Add hover animation class
    link.addEventListener('mouseenter', () => {
        link.classList.add('animated');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.remove('animated');
    });

    // Handle click events
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        
        // Add click animation
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
            // Open link in new tab
            window.open(url, '_blank');
        }, 200);
    });
});

// Skills Section Interactivity
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach((card, index) => {
    // Initial state for scroll reveal
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(card);

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    // Add click effect
    card.addEventListener('click', () => {
        // Remove active class from all cards
        skillCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked card
        card.classList.add('active');
        
        // Add pulse animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }, 200);

        // Remove active class after animation
        setTimeout(() => {
            card.classList.remove('active');
        }, 2000);
    });
});

// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    
    // Hide loader after page is fully loaded
    window.addEventListener('load', () => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.timeline-item, .cta-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial styles for animation
document.querySelectorAll('.timeline-item, .cta-content').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
animateOnScroll();