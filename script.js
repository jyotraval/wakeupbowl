// Load data and initialize
let data = null;
let currentSlides = {};
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let dragStartX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Theme management
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Add theme transition after initial load
    setTimeout(() => {
        document.body.style.transition = 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 100);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add subtle animation to theme toggle button
    const button = document.getElementById('themeToggle');
    button.style.transform = 'scale(0.9) rotate(180deg)';
    setTimeout(() => {
        button.style.transform = '';
    }, 300);
}

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        renderPage();
        // Add stagger animation to sections
        observeElements();
    } catch (error) {
        console.error('Error loading data:', error);
        document.body.innerHTML = `
            <div style="
                text-align: center; 
                padding: 4rem 2rem;
                max-width: 600px;
                margin: 0 auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #D97757;">Oops!</h2>
                <p style="font-size: 1.1rem; color: #6B6B6B; line-height: 1.6;">
                    Error loading data. Please check if <code style="background: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 4px;">data.json</code> file exists.
                </p>
            </div>
        `;
    }
}

// Intersection Observer for scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.cuisine-section').forEach(section => {
        observer.observe(section);
    });
}

// Render the entire page
function renderPage() {
    if (!data) return;
    
    // Update document title
    document.title = `${data.chef.name} - Portfolio`;
    
    // Update header
    document.getElementById('chefName').textContent = data.chef.name;
    
    // Update hero section
    const heroImage = document.getElementById('chefImage');
    heroImage.src = data.chef.profileImage;
    heroImage.alt = data.chef.name;
    
    // Add loading effect
    heroImage.style.opacity = '0';
    heroImage.onload = () => {
        heroImage.style.transition = 'opacity 0.6s ease';
        heroImage.style.opacity = '1';
    };
    
    document.getElementById('chefNameLarge').textContent = data.chef.name;
    document.getElementById('chefTagline').textContent = data.chef.tagline;
    document.getElementById('chefBio').textContent = data.chef.bio;
    
    // Update contact footer
    document.getElementById('phoneLink').href = `tel:${data.chef.contact.phone}`;
    document.getElementById('phoneText').textContent = data.chef.contact.phone;
    document.getElementById('emailLink').href = `mailto:${data.chef.contact.email}`;
    document.getElementById('emailText').textContent = data.chef.contact.email;
    const whatsappNumber = data.chef.contact.whatsapp.replace(/[^0-9]/g, '');
    document.getElementById('whatsappLink').href = `https://wa.me/${whatsappNumber}`;
    document.getElementById('footerChefName').textContent = data.chef.name;
    
    // Render cuisines
    const container = document.getElementById('cuisinesContainer');
    container.innerHTML = '';
    
    data.cuisines.sort((a, b) => a.order - b.order).forEach((cuisine, index) => {
        currentSlides[cuisine.id] = 0;
        const section = createCuisineSection(cuisine);
        section.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(section);
    });
}

// Create a cuisine section with carousel
function createCuisineSection(cuisine) {
    const section = document.createElement('section');
    section.className = 'cuisine-section';
    section.id = `cuisine-${cuisine.id}`;
    
    const title = document.createElement('h3');
    title.className = 'cuisine-title';
    title.textContent = `${cuisine.name} Cuisine`;
    
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel';
    carouselWrapper.id = `carousel-wrapper-${cuisine.id}`;
    
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    carouselContainer.id = `carousel-${cuisine.id}`;
    
    cuisine.dishes.forEach((dish, index) => {
        const card = createDishCard(dish, index);
        carouselContainer.appendChild(card);
    });
    
    // Touch events for mobile
    carouselWrapper.addEventListener('touchstart', (e) => handleTouchStart(e, cuisine.id), { passive: true });
    carouselWrapper.addEventListener('touchmove', (e) => handleTouchMove(e, cuisine.id), { passive: true });
    carouselWrapper.addEventListener('touchend', (e) => handleTouchEnd(e, cuisine.id));
    
    // Mouse events for desktop dragging
    carouselWrapper.addEventListener('mousedown', (e) => handleMouseDown(e, cuisine.id));
    carouselWrapper.addEventListener('mousemove', (e) => handleMouseMove(e, cuisine.id));
    carouselWrapper.addEventListener('mouseup', (e) => handleMouseUp(e, cuisine.id));
    carouselWrapper.addEventListener('mouseleave', (e) => handleMouseUp(e, cuisine.id));
    
    // Prevent drag on links and images
    carouselWrapper.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-nav-prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    `;
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        changeSlide(cuisine.id, -1);
        addRippleEffect(e, prevBtn);
    };
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-nav-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        changeSlide(cuisine.id, 1);
        addRippleEffect(e, nextBtn);
    };
    
    // Indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    indicators.id = `indicators-${cuisine.id}`;
    indicators.setAttribute('role', 'tablist');
    
    cuisine.dishes.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.onclick = () => goToSlide(cuisine.id, index);
        indicators.appendChild(indicator);
    });
    
    carouselWrapper.appendChild(carouselContainer);
    carouselWrapper.appendChild(prevBtn);
    carouselWrapper.appendChild(nextBtn);
    
    section.appendChild(title);
    section.appendChild(carouselWrapper);
    section.appendChild(indicators);
    
    updateCarousel(cuisine.id);
    
    return section;
}

// Create a dish card with loading animation
function createDishCard(dish, index) {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Prevent click when dragging
    let clickStartTime = 0;
    let clickStartX = 0;
    let clickStartY = 0;
    
    card.addEventListener('mousedown', (e) => {
        clickStartTime = Date.now();
        clickStartX = e.clientX;
        clickStartY = e.clientY;
    });
    
    card.addEventListener('touchstart', (e) => {
        clickStartTime = Date.now();
        clickStartX = e.touches[0].clientX;
        clickStartY = e.touches[0].clientY;
    }, { passive: true });
    
    card.addEventListener('click', (e) => {
        const clickDuration = Date.now() - clickStartTime;
        const moveDistance = Math.sqrt(
            Math.pow(e.clientX - clickStartX, 2) + 
            Math.pow(e.clientY - clickStartY, 2)
        );
        
        // Only open modal if it was a quick click/tap without much movement
        if (clickDuration < 300 && moveDistance < 10) {
            openModal(dish);
        }
    });
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${dish.image}" alt="${dish.name}" class="card-image" loading="lazy">
            <div class="card-image-overlay">
                <h4 class="card-title">${dish.name}</h4>
            </div>
        </div>
        <div class="card-body">
            <p class="card-description">${dish.shortDescription}</p>
            <div class="card-tags">
                ${dish.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Ripple effect for buttons
function addRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Carousel navigation
function changeSlide(cuisineId, direction) {
    const cuisine = data.cuisines.find(c => c.id === cuisineId);
    
    // Calculate visible cards based on screen size
    let visibleCards = 1;
    if (window.innerWidth >= 1280) {
        visibleCards = 4;
    } else if (window.innerWidth >= 1024) {
        visibleCards = 3;
    } else if (window.innerWidth >= 640) {
        visibleCards = 2;
    }
    
    const maxSlide = Math.max(0, cuisine.dishes.length - visibleCards);
    
    currentSlides[cuisineId] += direction;
    
    // Clamp the value between 0 and maxSlide
    if (currentSlides[cuisineId] < 0) {
        currentSlides[cuisineId] = 0;
    } else if (currentSlides[cuisineId] > maxSlide) {
        currentSlides[cuisineId] = maxSlide;
    }
    
    updateCarousel(cuisineId);
}

function goToSlide(cuisineId, index) {
    currentSlides[cuisineId] = index;
    updateCarousel(cuisineId);
}

// Touch event handlers for mobile swipe
function handleTouchStart(e, cuisineId) {
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX;
}

function handleTouchMove(e, cuisineId) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd(e, cuisineId) {
    const swipeThreshold = 75; // Increased threshold for more intentional swipes
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide(cuisineId, 1);
        } else {
            changeSlide(cuisineId, -1);
        }
    }
}

// Mouse drag handlers for desktop
function handleMouseDown(e, cuisineId) {
    dragStartX = e.clientX;
    touchStartX = e.clientX;
    touchEndX = e.clientX;
    const wrapper = document.getElementById(`carousel-wrapper-${cuisineId}`);
    wrapper.style.cursor = 'grabbing';
}

function handleMouseMove(e, cuisineId) {
    if (dragStartX === 0) return;
    touchEndX = e.clientX;
}

function handleMouseUp(e, cuisineId) {
    if (dragStartX === 0) return;
    
    const wrapper = document.getElementById(`carousel-wrapper-${cuisineId}`);
    wrapper.style.cursor = 'grab';
    
    const swipeThreshold = 75; // Increased threshold
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide(cuisineId, 1);
        } else {
            changeSlide(cuisineId, -1);
        }
    }
    
    dragStartX = 0;
}

function updateCarousel(cuisineId) {
    const carousel = document.getElementById(`carousel-${cuisineId}`);
    const indicators = document.getElementById(`indicators-${cuisineId}`);
    const cuisine = data.cuisines.find(c => c.id === cuisineId);
    
    if (!carousel || !indicators) return;
    
    // Calculate how many cards are visible
    const wrapper = carousel.parentElement;
    const wrapperWidth = wrapper.offsetWidth;
    const cards = carousel.querySelectorAll('.carousel-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // 1.5rem gap
    
    // Calculate visible cards based on screen size
    let visibleCards = 1;
    if (window.innerWidth >= 1280) {
        visibleCards = 4;
    } else if (window.innerWidth >= 1024) {
        visibleCards = 3;
    } else if (window.innerWidth >= 640) {
        visibleCards = 2;
    }
    
    // Calculate maximum slide index (don't show empty spaces at the end)
    const maxSlideIndex = Math.max(0, cuisine.dishes.length - visibleCards);
    
    // Ensure current slide doesn't exceed max
    if (currentSlides[cuisineId] > maxSlideIndex) {
        currentSlides[cuisineId] = maxSlideIndex;
    }
    
    const offset = -(currentSlides[cuisineId] * (cardWidth + gap));
    carousel.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    const indicatorElements = indicators.querySelectorAll('.carousel-indicator');
    indicatorElements.forEach((indicator, index) => {
        if (index === currentSlides[cuisineId]) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update button states
    const section = document.getElementById(`cuisine-${cuisineId}`);
    const prevBtn = section.querySelector('.carousel-nav-prev');
    const nextBtn = section.querySelector('.carousel-nav-next');
    
    if (currentSlides[cuisineId] === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }
    
    if (currentSlides[cuisineId] >= maxSlideIndex) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }
}

// Modal functions
function openModal(dish) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTags = document.getElementById('modalTags');
    
    modalImage.src = dish.image;
    modalImage.alt = dish.name;
    modalTitle.textContent = dish.name;
    modalDescription.textContent = dish.fullDescription;
    modalTags.innerHTML = dish.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add loading animation for modal image
    modalImage.style.opacity = '0';
    modalImage.onload = () => {
        modalImage.style.transition = 'opacity 0.4s ease';
        modalImage.style.opacity = '1';
    };
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Modal close
    document.getElementById('modalClose').addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Smooth scroll for anchor links
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
});

// Handle window resize for carousel
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (data && data.cuisines) {
            data.cuisines.forEach(cuisine => {
                updateCarousel(cuisine.id);
            });
        }
    }, 250);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
