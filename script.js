document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('#spisoc li a');
    const contactsTrigger = document.getElementById('contactsTrigger');
    const contactsMenu = document.getElementById('contactsMenu');
    const contactsBackdrop = document.getElementById('contactsMenuBackdrop');
    const galleryReels = Array.from(document.querySelectorAll('.about-reel-gallery'));
    const aboutLightbox = document.getElementById('aboutLightbox');
    const aboutLightboxImage = document.getElementById('aboutLightboxImage');
    const aboutLightboxTitle = document.getElementById('aboutLightboxTitle');
    const aboutLightboxCounter = document.getElementById('aboutLightboxCounter');
    const aboutLightboxClose = document.getElementById('aboutLightboxClose');
    const aboutLightboxPrev = document.getElementById('aboutLightboxPrev');
    const aboutLightboxNext = document.getElementById('aboutLightboxNext');
    let currentGalleryPhotos = [];
    let currentGalleryTitle = '';
    let currentGalleryPhotoIndex = 0;

    function getScrollOffset() {
        return navigation ? navigation.offsetHeight : 70;
    }

    function setContactsMenuState(isOpen) {
        if (!contactsTrigger || !contactsMenu || !contactsBackdrop) {
            return;
        }

        contactsTrigger.classList.toggle('is-open', isOpen);
        contactsMenu.classList.toggle('is-open', isOpen);
        contactsBackdrop.classList.toggle('is-open', isOpen);
        contactsTrigger.setAttribute('aria-expanded', String(isOpen));
        contactsMenu.setAttribute('aria-hidden', String(!isOpen));
        body.classList.toggle('contacts-menu-open', isOpen && window.innerWidth <= 1024);
    }

    function closeContactsMenu() {
        setContactsMenuState(false);
    }

    function setGalleryPhoto(index) {
        if (!currentGalleryPhotos.length || !aboutLightboxImage || !aboutLightboxCounter) {
            return;
        }

        currentGalleryPhotoIndex = (index + currentGalleryPhotos.length) % currentGalleryPhotos.length;

        const image = currentGalleryPhotos[currentGalleryPhotoIndex].querySelector('img');
        if (!image) {
            return;
        }

        aboutLightboxImage.src = image.src;
        aboutLightboxImage.alt = image.alt;
        if (aboutLightboxTitle) {
            aboutLightboxTitle.textContent = currentGalleryTitle;
        }
        aboutLightboxCounter.textContent = (currentGalleryPhotoIndex + 1) + ' / ' + currentGalleryPhotos.length;
    }

    function openGalleryLightbox(photos, title, index) {
        if (!aboutLightbox || !photos.length) {
            return;
        }

        currentGalleryPhotos = photos;
        currentGalleryTitle = title;
        closeContactsMenu();
        setGalleryPhoto(index);
        aboutLightbox.classList.add('is-open');
        aboutLightbox.setAttribute('aria-hidden', 'false');
        body.classList.add('about-lightbox-open');
    }

    function closeGalleryLightbox() {
        if (!aboutLightbox) {
            return;
        }

        aboutLightbox.classList.remove('is-open');
        aboutLightbox.setAttribute('aria-hidden', 'true');
        body.classList.remove('about-lightbox-open');
    }

    function stepGalleryLightbox(step) {
        if (!aboutLightbox || !aboutLightbox.classList.contains('is-open')) {
            return;
        }

        setGalleryPhoto(currentGalleryPhotoIndex + step);
    }

    if (contactsTrigger && contactsMenu && contactsBackdrop) {
        contactsTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            setContactsMenuState(!contactsMenu.classList.contains('is-open'));
        });

        contactsMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        contactsBackdrop.addEventListener('click', closeContactsMenu);

        contactsMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeContactsMenu);
        });
    }

    galleryReels.forEach(reel => {
        const reelTrack = reel.querySelector('.about-reel-track');
        const reelFirstSet = reel.querySelector('.about-reel-set');
        const reelTitle =
            reel.dataset.lightboxTitle ||
            (reel.querySelector('.about-reel-title') ? reel.querySelector('.about-reel-title').textContent.trim() : '');

        if (reelTrack && reelFirstSet && reel.querySelectorAll('.about-reel-set').length === 1) {
            const reelClone = reelFirstSet.cloneNode(true);
            reelClone.setAttribute('aria-hidden', 'true');
            reelTrack.appendChild(reelClone);
        }

        const reelPhotos = Array.from(reel.querySelectorAll('.about-reel-set:first-child .about-photo-btn'));

        reel.querySelectorAll('.about-photo-btn').forEach(button => {
            button.addEventListener('click', function() {
                openGalleryLightbox(reelPhotos, reelTitle, Number(this.dataset.index || 0));
            });
        });
    });

    if (aboutLightbox) {
        aboutLightbox.addEventListener('click', function(e) {
            if (e.target === aboutLightbox) {
                closeGalleryLightbox();
            }
        });
    }

    if (aboutLightboxClose) {
        aboutLightboxClose.addEventListener('click', closeGalleryLightbox);
    }

    if (aboutLightboxPrev) {
        aboutLightboxPrev.addEventListener('click', function() {
            stepGalleryLightbox(-1);
        });
    }

    if (aboutLightboxNext) {
        aboutLightboxNext.addEventListener('click', function() {
            stepGalleryLightbox(1);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            e.preventDefault();
            closeContactsMenu();
            window.scrollTo({
                top: Math.max(targetElement.offsetTop - getScrollOffset(), 0),
                behavior: 'smooth'
            });
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (window.innerWidth > 1024) {
                this.style.transform = 'translateY(-2px)';
            }
        });

        link.addEventListener('mouseleave', function() {
            if (window.innerWidth > 1024) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!contactsTrigger || !contactsMenu || !contactsMenu.classList.contains('is-open')) {
            return;
        }

        if (!contactsTrigger.contains(e.target) && !contactsMenu.contains(e.target)) {
            closeContactsMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (aboutLightbox && aboutLightbox.classList.contains('is-open')) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeGalleryLightbox();
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                stepGalleryLightbox(-1);
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                stepGalleryLightbox(1);
            }

            return;
        }

        if (e.key === 'Escape') {
            closeContactsMenu();
        }
    });

    window.addEventListener('resize', function() {
        closeContactsMenu();
    });
});