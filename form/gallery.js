document.addEventListener('DOMContentLoaded', function() {
    // Gallery data - replace with your actual photos
    const galleryData = [
        { src: "img/galery/tv-install-1.webp", category: "fireplace" },
        { src: "img/galery/tv-install-5.webp", category: "fireplace" },
        { src: "img/galery/tv-install-3.webp", category: "fireplace" },
        { src: "img/galery/tv-install-4.webp", category: "fireplace" },
        { src: "img/galery/tv-install-21.webp", category: "living-room" },
        { src: "img/galery/tv-install-8.webp", category: "bedroom" },
        { src: "img/galery/tv-install-9.webp", category: "bedroom" },
        { src: "img/galery/tv-install-22.webp", category: "living-room" },
        { src: "img/galery/tv-install-10.webp", category: "bedroom" },
        { src: "img/galery/tv-install-23.webp", category: "living-room" },
        { src: "img/galery/tv-install-2.webp", category: "fireplace" },
        { src: "img/galery/tv-install-11.webp", category: "bedroom" },
        { src: "img/galery/tv-install-24.webp", category: "living-room" },
        { src: "img/galery/tv-install-12.webp", category: "bedroom" },
        { src: "img/galery/tv-install-25.webp", category: "living-room" },
        { src: "img/galery/tv-install-6.webp", category: "fireplace" },
        { src: "img/galery/tv-install-13.webp", category: "bedroom" },
        { src: "img/galery/tv-install-26.webp", category: "living-room" },
        { src: "img/galery/tv-install-14.webp", category: "bedroom" },
        { src: "img/galery/tv-install-15.webp", category: "bedroom" },
        { src: "img/galery/tv-install-27.webp", category: "living-room" },
        { src: "img/galery/tv-install-7.webp", category: "fireplace" },
        { src: "img/galery/tv-install-18.webp", category: "bedroom" },
        { src: "img/galery/tv-install-28.webp", category: "living-room" },
        { src: "img/galery/tv-install-19.webp", category: "bedroom" },
        { src: "img/galery/tv-install-30.webp", category: "living-room" },
        { src: "img/galery/tv-install-16.webp", category: "bedroom" },
        { src: "img/galery/tv-install-29.webp", category: "living-room" },
        { src: "img/galery/tv-install-17.webp", category: "bedroom" },
        { src: "img/galery/tv-install-20.webp", category: "living-room" }
        
    ];

    const galleryContainer = document.querySelector('.photo-gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;

    // Initialize gallery
    function initGallery() {
        galleryContainer.innerHTML = '';
        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="TV Installation" class="gallery-img">
            `;
            galleryItem.addEventListener('click', () => openLightbox(index));
            galleryContainer.appendChild(galleryItem);
        });
    }

    // Filter gallery items
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            const items = document.querySelectorAll('.gallery-item');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox functions
    function openLightbox(index) {
        currentImageIndex = index;
        lightbox.classList.add('active');
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function updateLightboxImage() {
        const item = galleryData[currentImageIndex];
        lightboxImg.src = item.src;
    }

    function navigate(direction) {
        currentImageIndex += direction;
        
        // Wrap around if at beginning or end
        if (currentImageIndex < 0) {
            currentImageIndex = galleryData.length - 1;
        } else if (currentImageIndex >= galleryData.length) {
            currentImageIndex = 0;
        }
        
        updateLightboxImage();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigate(-1);
                    break;
                case 'ArrowRight':
                    navigate(1);
                    break;
            }
        }
    });

    // Initialize the gallery
    initGallery();
});