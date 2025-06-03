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
    
    // Auto-play video when it comes into view
    const videoElement = document.getElementById('liveplan-video');
    const videoContainer = videoElement ? videoElement.closest('.video-container') : null;
    const playButton = document.getElementById('video-play-button');
    
    if (videoElement && videoContainer && playButton) {
        // Flag to ensure the video only plays once
        let hasPlayed = false;
        
        // Função para tentar reproduzir o vídeo com várias tentativas
        const attemptAutoplay = (maxAttempts = 3, currentAttempt = 0) => {
            if (currentAttempt >= maxAttempts || hasPlayed) return;
            
            // Garantir que o vídeo esteja mudo para autoplay
            videoElement.muted = true;
            
            // Tentar reproduzir o vídeo
            videoElement.play()
                .then(() => {
                    console.log('Video playback started successfully');
                    hasPlayed = true;
                    
                    // Add controls back after playback starts
                    videoElement.controls = true;
                    
                    // Update play button visibility
                    updatePlayButtonVisibility(true);
                    
                    // Listen for video end
                    videoElement.addEventListener('ended', () => {
                        console.log('Video playback ended');
                        // Reset to first frame
                        videoElement.currentTime = 0;
                        // Update play button visibility
                        updatePlayButtonVisibility(false);
                    });
                })
                .catch(error => {
                    console.error(`Attempt ${currentAttempt + 1}/${maxAttempts} failed:`, error);
                    
                    // Tentar novamente após um pequeno atraso
                    setTimeout(() => {
                        attemptAutoplay(maxAttempts, currentAttempt + 1);
                    }, 1000);
                    
                    // Se todas as tentativas falharem, mostrar controles
                    if (currentAttempt === maxAttempts - 1) {
                        console.log('All autoplay attempts failed, showing controls');
                        videoElement.controls = true;
                    }
                });
        };
        
        // Detectar se é um dispositivo móvel
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Criar um Intersection Observer com threshold menor para dispositivos móveis
        const threshold = isMobile ? 0.3 : 0.6; // Threshold menor para móveis
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Se o vídeo estiver visível e ainda não foi reproduzido
                if (entry.isIntersecting && !hasPlayed) {
                    // Adicionar um pequeno atraso para garantir uma experiência suave
                    setTimeout(() => {
                        // Iniciar tentativas de reprodução automática
                        attemptAutoplay();
                    }, isMobile ? 100 : 500); // Atraso menor para dispositivos móveis
                } else if (!entry.isIntersecting && !videoElement.paused) {
                    // Pausar o vídeo se ele sair da visualização enquanto estiver sendo reproduzido
                    videoElement.pause();
                    // Update play button visibility
                    updatePlayButtonVisibility(false);
                }
            });
        }, { threshold: threshold });
        
        // Iniciar observação do elemento de vídeo
        videoObserver.observe(videoElement);
        
        // Adicionar evento de clique ao botão de play
        playButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (videoElement.paused) {
                videoElement.play();
                videoContainer.classList.add('playing');
            }
        });
        
        // Adicionar evento de clique diretamente ao elemento de vídeo
        videoElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Video clicked, paused state:', this.paused);
            if (!this.paused) {
                this.pause();
                videoContainer.classList.remove('playing');
            }
        }, true);
        
        // Adicionar evento de clique ao container para pausar o vídeo
        videoContainer.addEventListener('click', function(e) {
            // Ignorar cliques no botão de play
            if (e.target !== playButton && !videoElement.paused) {
                console.log('Container clicked, pausing video');
                videoElement.pause();
                videoContainer.classList.remove('playing');
            }
        });
        
        // Eventos para detectar quando o vídeo começa ou termina de reproduzir
        videoElement.addEventListener('play', function() {
            videoContainer.classList.add('playing');
        });
        
        videoElement.addEventListener('pause', function() {
            videoContainer.classList.remove('playing');
        });
        
        videoElement.addEventListener('ended', function() {
            videoContainer.classList.remove('playing');
        });
        
        // Adicionar evento de toque para dispositivos móveis
        videoElement.addEventListener('touchend', (e) => {
            // Prevenir comportamento padrão para evitar problemas em dispositivos móveis
            e.preventDefault();
            
            if (!videoElement.paused) {
                videoElement.pause();
                updatePlayButtonVisibility(false);
            } else {
                videoElement.play().catch(err => {
                    console.error('Error on video touch play:', err);
                }).then(() => {
                    if (videoElement) {
                        updatePlayButtonVisibility(true);
                    }
                });
            }
        });
        
        // Adicionar evento de toque ao botão de play para dispositivos móveis
        playButton.addEventListener('touchend', (e) => {
            // Prevenir comportamento padrão
            e.preventDefault();
            
            if (videoElement.paused) {
                videoElement.play().catch(err => {
                    console.error('Error on touch play:', err);
                }).then(() => {
                    if (videoElement) { // Verificar se o elemento ainda existe
                        updatePlayButtonVisibility(true);
                    }
                });
            }
        });
        
        // Adicionar evento para atualizar a visibilidade do botão quando o vídeo começa ou pausa
        videoElement.addEventListener('play', () => {
            updatePlayButtonVisibility(true);
        });
        
        videoElement.addEventListener('pause', () => {
            updatePlayButtonVisibility(false);
        });
    }
});
