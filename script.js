// Netflix-like functionality with YouTube integration
document.addEventListener('DOMContentLoaded', function() {
    // Video background handling
    const heroVideo = document.querySelector('.hero-video');
    const heroFallback = document.querySelector('.hero-bg-fallback');

    if (heroVideo) {
        // Handle video loading
        heroVideo.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback image');
            heroFallback.style.display = 'block';
            heroVideo.style.display = 'none';
        });

        heroVideo.addEventListener('canplay', function() {
            console.log('Video loaded successfully');
            this.style.opacity = '1';
        });

        // Ensure video starts playing
        heroVideo.play().catch(function(error) {
            console.log('Video autoplay failed:', error);
            heroFallback.style.display = 'block';
            heroVideo.style.display = 'none';
        });
    }

    // Movie database with YouTube trailer URLs
    const movieDatabase = {
        'Stranger Things': 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        'The Witcher': 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
        'Wednesday': 'https://www.youtube.com/watch?v=Q73UhUTs6y0',
        'Ozark': 'https://www.youtube.com/watch?v=5hAXVqrljbs',
        'Money Heist': 'https://www.youtube.com/watch?v=_InqQJRqGW4',
        'Dark': 'https://www.youtube.com/watch?v=rrwycJ08PSA',
        'House of Cards': 'https://www.youtube.com/watch?v=ULwUzF1q5w4',
        'The Crown': 'https://www.youtube.com/watch?v=JWtnJjn6ng0',
        'Squid Game': 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
        'Orange is the New Black': 'https://www.youtube.com/watch?v=th3_d0Nw3pU',
        'Lucifer': 'https://www.youtube.com/watch?v=X4bF_quwNtw',
        'The Middle': 'https://www.youtube.com/watch?v=gkJEw2wCMb8',
        'Breaking Bad': 'https://www.youtube.com/watch?v=HhesaQXLuRY',
        'Friends': 'https://www.youtube.com/watch?v=hDNNmeeJs1Q',
        'The Office': 'https://www.youtube.com/watch?v=LHhbdXCzt_A'
    };

    // Create video modal
    function createVideoModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <span class="close-modal">&times;</span>
                <div class="video-container">
                    <iframe id="youtube-player" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="video-info">
                    <h2 id="video-title"></h2>
                    <p id="video-description">Watch the official trailer</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Movie card hover effects
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add slight delay to hover effect
            setTimeout(() => {
                this.style.zIndex = '10';
            }, 300);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Smooth scrolling for movie rows
    const movieRows = document.querySelectorAll('.movie-row');
    
    movieRows.forEach(row => {
        let isDown = false;
        let startX;
        let scrollLeft;

        row.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
            row.style.cursor = 'grabbing';
        });

        row.addEventListener('mouseleave', () => {
            isDown = false;
            row.style.cursor = 'grab';
        });

        row.addEventListener('mouseup', () => {
            isDown = false;
            row.style.cursor = 'grab';
        });

        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 2;
            row.scrollLeft = scrollLeft - walk;
        });
    });    // Hero buttons functionality with YouTube integration
    const playBtn = document.querySelector('.play-btn');
    const infoBtn = document.querySelector('.info-btn');

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            openVideoModal('Stranger Things');
        });
    }

    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            alert('ⓘ More info about Stranger Things:\n\nGenres: Horror, Drama, Fantasy\nThis show: Supernatural, Exciting, Suspenseful\nCreators: The Duffer Brothers\nStarring: Millie Bobby Brown, Finn Wolfhard, Winona Ryder');
        });
    }

    // Video modal functionality
    function openVideoModal(movieTitle) {
        const videoUrl = movieDatabase[movieTitle];
        if (!videoUrl) {
            alert(`Sorry, trailer for "${movieTitle}" is not available.`);
            return;
        }

        let modal = document.querySelector('.video-modal');
        if (!modal) {
            modal = createVideoModal();
        }

        // Convert YouTube URL to embed URL
        const videoId = extractYouTubeId(videoUrl);
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

        // Set video content
        const iframe = modal.querySelector('#youtube-player');
        const title = modal.querySelector('#video-title');
        
        iframe.src = embedUrl;
        title.textContent = movieTitle;

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = closeVideoModal;
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeVideoModal();
            }
        };
    }

    function closeVideoModal() {
        const modal = document.querySelector('.video-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.querySelector('#youtube-player').src = '';
            document.body.style.overflow = 'auto';
        }
    }

    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Navigation click effects
    const navLinks = document.querySelectorAll('.nav-links li');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });    // Movie card click functionality with YouTube integration
    movieCards.forEach(card => {
        card.addEventListener('click', function() {
            const movieTitle = this.querySelector('.movie-info h3').textContent;
            openVideoModal(movieTitle);
        });
    });

    // Search functionality (demo)
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchTerm = prompt('🔍 Search Netflix:');
            if (searchTerm) {
                alert(`Searching for "${searchTerm}"...\n\n(This is a demo - in a real app, this would show search results)`);
            }
        });
    }

    // Notifications functionality (demo)
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', function() {
            alert('🔔 Notifications:\n\n• New episodes of Stranger Things available!\n• The Witcher Season 3 coming soon\n• Your list has been updated\n\n(This is a demo)');
        });
    }

    // Profile functionality (demo)
    const profile = document.querySelector('.profile');
    if (profile) {
        profile.addEventListener('click', function() {
            alert('👤 Profile Menu:\n\n• Manage Profiles\n• Account Settings\n• Help Center\n• Sign out of Netflix\n\n(This is a demo)');
        });
    }

    // Add loading animation effect
    function addLoadingEffect() {
        const movieCards = document.querySelectorAll('.movie-card img');
        
        movieCards.forEach((img, index) => {
            img.style.opacity = '0';
            img.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                img.style.transition = 'all 0.6s ease';
                img.style.opacity = '1';
                img.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Add subtle parallax effect to hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Enhanced image loading with fallbacks
    function handleImageErrors() {
        const images = document.querySelectorAll('.movie-card img');
        
        images.forEach((img, index) => {
            img.addEventListener('error', function() {
                // First fallback: try a different random image
                if (!this.hasAttribute('data-fallback-tried')) {
                    this.setAttribute('data-fallback-tried', 'true');
                    this.src = `https://picsum.photos/250/140?random=${index + 100}`;
                } else if (!this.hasAttribute('data-placeholder-set')) {
                    // Second fallback: use placeholder service
                    this.setAttribute('data-placeholder-set', 'true');
                    const movieName = this.alt.replace(/\s+/g, '+');
                    this.src = `https://via.placeholder.com/250x140/333333/ffffff?text=${movieName}`;
                } else {
                    // Final fallback: create custom placeholder
                    this.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.innerHTML = `
                        <div class="placeholder-content">
                            <span class="placeholder-icon">🎬</span>
                            <span class="placeholder-text">${this.alt}</span>
                        </div>
                    `;
                    this.parentNode.insertBefore(placeholder, this);
                }
            });

            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });

            // Set initial loading state
            img.style.opacity = '0.7';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    // Dynamic Hero Background
    function setHeroBackground() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const backgroundImages = [
                'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop&crop=center', // Dark/mysterious
                'https://images.unsplash.com/photo-1489599511986-c4a9d60915ab?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop&crop=center', // Cinematic
                'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop&crop=center', // Atmospheric
            ];
            
            const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
            
            hero.style.background = `
                linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), 
                url('${randomBg}') center/cover,
                linear-gradient(135deg, #141414, #1a1a1a)
            `;
            
            // Add parallax effect
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.backgroundPosition = `center ${rate}px`;
            });
        }
    }

    // Initialize loading animation
    setTimeout(addLoadingEffect, 100);

    // Initialize image error handling
    handleImageErrors();

    // Initialize hero background
    setHeroBackground();    // Hero video controls
    const heroPlayBtn = document.querySelector('.play-btn');
    const heroVideoElement = document.querySelector('.hero-video');
    
    if (heroPlayBtn && heroVideoElement) {
        heroPlayBtn.addEventListener('click', function() {
            // Create and show trailer modal for Stranger Things
            if (movieDatabase['Stranger Things']) {
                showTrailer('Stranger Things', movieDatabase['Stranger Things']);
            }
        });
    }

    // Add video mute/unmute toggle
    const videoMuteBtn = document.createElement('button');
    videoMuteBtn.className = 'video-mute-btn';
    videoMuteBtn.innerHTML = '🔇';
    videoMuteBtn.title = 'Unmute';
    
    if (heroVideoElement) {
        const heroSection = document.querySelector('.hero');
        heroSection.appendChild(videoMuteBtn);
        
        videoMuteBtn.addEventListener('click', function() {
            if (heroVideoElement.muted) {
                heroVideoElement.muted = false;
                this.innerHTML = '🔊';
                this.title = 'Mute';
            } else {
                heroVideoElement.muted = true;
                this.innerHTML = '🔇';
                this.title = 'Unmute';
            }
        });
    }
});

// Add some Netflix-style keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Space bar to play/pause (demo)
    if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        alert('⏸️ Pause/Play functionality (Demo)\n\nIn a real Netflix app, this would control video playback');
    }
      // Escape key functionality
    if (event.code === 'Escape') {
        // Close video modal if open
        const modal = document.querySelector('.video-modal');
        if (modal && modal.style.display === 'flex') {
            closeVideoModal();
        }
        
        // Remove any active states or close modals
        const activeElements = document.querySelectorAll('.active-hover');
        activeElements.forEach(el => el.classList.remove('active-hover'));
    }
});
