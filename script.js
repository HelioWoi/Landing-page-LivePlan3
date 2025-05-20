document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjusted for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    const bannerImage = document.querySelector('.banner-image');
    
    window.addEventListener('scroll', function() {
        // Header effect
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Banner zoom effect
        if (bannerImage) {
            const scrollPosition = window.scrollY;
            // Apply subtle zoom effect when user starts scrolling
            if (scrollPosition > 10) {
                bannerImage.classList.add('zoom-effect');
            } else {
                bannerImage.classList.remove('zoom-effect');
            }
        }
    });

    // Percentage counter animation
    const percentageElements = document.querySelectorAll('.percentage');
    let animationStarted = false;
    
    // Function to animate counting
    function animateCounters() {
        if (animationStarted) return;
        
        percentageElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const duration = 1500; // Animation duration in milliseconds
            const frameRate = 30; // Number of frames per second
            const increment = target / (duration / 1000 * frameRate);
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    clearInterval(timer);
                    counter.textContent = `${target}%`;
                } else {
                    counter.textContent = `${Math.floor(count)}%`;
                }
            }, 1000 / frameRate);
        });
        
        animationStarted = true;
    }
    
    // Intersection Observer to trigger animation when elements are in view
    const formulaSection = document.querySelector('.formula-cards');
    if (formulaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(formulaSection);
    }
    
    // Dashboard and weekly budget images fade-in animation
    const animatedImages = document.querySelectorAll('.dashboard-animation');
    
    animatedImages.forEach(image => {
        // Initially set opacity to 0
        image.style.opacity = '0';
        image.style.transition = 'opacity 1.2s ease-in-out';
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fade in the image
                    setTimeout(() => {
                        image.style.opacity = '1';
                    }, 300); // Small delay for better effect
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        imageObserver.observe(image);
    });
    
    // Form submission
    const betaForm = document.getElementById('beta-form');
    if (betaForm) {
        betaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }
            
            // Show loading message while saving to Supabase
            betaForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: #fff; margin-bottom: 20px;"></i>
                    <h3>Processing...</h3>
                    <p>Please wait while we save your information.</p>
                </div>
            `;
            
            // Save to Supabase and then redirect
            console.log('Starting form submission process...');
            
            // Prevent any form of automatic redirect
            let redirectAllowed = false;
            
            // Show processing message
            betaForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: #fff; margin-bottom: 20px;"></i>
                    <h3>Processing...</h3>
                    <p>Please wait while we save your information.</p>
                </div>
            `;
            
            try {
                console.log('Calling saveBetaSignup function...');
                const success = await saveBetaSignup(nameInput.value, emailInput.value);
                console.log('saveBetaSignup completed with result:', success);
                
                // Show success message
                betaForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #fff; margin-bottom: 20px;"></i>
                        <h3>Thank you, ${nameInput.value}!</h3>
                        <p>Redirecting to the app...</p>
                    </div>
                `;
                
                // Now allow redirect
                redirectAllowed = true;
                console.log('Form submission complete');
                
                // Show success message with button to proceed to app
                betaForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #fff; margin-bottom: 20px;"></i>
                        <h3>Thank you, ${nameInput.value}!</h3>
                        <p>Your information has been saved successfully.</p>
                        <a href="https://app.liveplan3.com/" class="btn-primary" style="margin-top: 20px;">Continue to LivePlan³ App</a>
                    </div>
                `;
            } catch (error) {
                console.error('Error in form submission:', error);
                
                // Show error message with option to try again or continue
                betaForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #fff; margin-bottom: 20px;"></i>
                        <h3>Thank you, ${nameInput.value}!</h3>
                        <p>We had trouble saving your information, but you can still proceed.</p>
                        <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: center;">
                            <button id="retry-button" class="btn-secondary">Try Again</button>
                            <a href="https://app.liveplan3.com/" class="btn-primary">Continue to LivePlan³ App</a>
                        </div>
                    </div>
                `;
                
                // Add event listener for retry button
                document.getElementById('retry-button').addEventListener('click', function() {
                    // Reset the form to try again
                    betaForm.innerHTML = `
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" placeholder="Enter your name" required value="${nameInput.value}">
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" placeholder="Enter your email" required value="${emailInput.value}">
                        </div>
                        <button type="submit" class="btn-primary">Join Beta</button>
                    `;
                });
            }
        });
    }

    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.formula-card, .feature-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    document.querySelectorAll('.formula-card, .feature-card, .testimonial-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
