document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли галерея на странице
    const galleryContainer = document.querySelector('.photo-gallery');
    if (!galleryContainer) return;

    // Данные галереи
    const galleryData = [
        { src: "images/gallery/tv-breack-3.webp", category: "brick" },
        { src: "images/gallery/tv-tile-14.webp", category: "tile" },
        { src: "images/gallery/tv-dry-4.webp", category: "" },
        { src: "images/gallery/tv-frame-1.webp", category: "" },
        { src: "images/gallery/tv-panel-1.webp", category: "" },
        { src: "images/gallery/tv-sound-1.webp", category: "" },
        { src: "images/gallery/tv-sound-4.webp", category: "" },
        { src: "images/gallery/tv-tile-8.webp", category: "tile" },
        { src: "images/gallery/tv-tile-10.webp", category: "tile" },
        { src: "images/gallery/tv-dry-1.webp", category: "" },
        { src: "images/gallery/tv-tile-1.webp", category: "tile" },
        { src: "images/gallery/tv-tile-2.webp", category: "tile" },
        { src: "images/gallery/tv-tile-3.webp", category: "tile" },
        { src: "images/gallery/tv-tile-4.webp", category: "tile" },
        { src: "images/gallery/tv-tile-5.webp", category: "ltile" },
        { src: "images/gallery/tv-tile-6.webp", category: "tile" },
        { src: "images/gallery/tv-tile-7.webp", category: "tile" },
        { src: "images/gallery/tv-tile-9.webp", category: "tile" },
        { src: "images/gallery/tv-tile-11.webp", category: "tile" },
        { src: "images/gallery/tv-tile-12.webp", category: "tile" },
        { src: "images/gallery/tv-tile-13.webp", category: "tile" },
        { src: "images/gallery/tv-dry-3.webp", category: "" },
        { src: "images/gallery/tv-dry-2.webp", category: " " },
        { src: "images/gallery/tv-dry-5.webp", category: " " },
        { src: "images/gallery/tv-dry-7.webp", category: " " },
        { src: "images/gallery/tv-dry-8.webp", category: " " },
        { src: "images/gallery/tv-dry-10.webp", category: " " },
        { src: "images/gallery/tv-dry-11.webp", category: "" },
        { src: "images/gallery/tv-dry-12.webp", category: " "},
        { src: "images/gallery/tv-dry-13.webp", category: "" },
        { src: "images/gallery/tv-dry-14.webp", category: "" },
        { src: "images/gallery/tv-dry-15.webp", category: "l" },
        { src: "images/gallery/tv-dry-16.webp", category: "" },
        { src: "images/gallery/tv-dry-17.webp", category: "" },
        { src: "images/gallery/tv-cable-1.webp", category: "" },
        { src: "images/gallery/tv-breack-1.webp", category: "brick" },
        { src: "images/gallery/tv-breack-2.webp", category: "brick" },
        { src: "images/gallery/tv-breack-4.webp", category: "brick" },
        { src: "images/gallery/tv-breack-5.webp", category: "brick" },
        { src: "images/gallery/tv-slim-1.webp", category: "slim" },
        { src: "images/gallery/tv-slim-2.webp", category: "slim" },
        { src: "images/gallery/tv-concrete-1.webp", category: "concrete" },
        { src: "images/gallery/tv-concrete-2.webp", category: "concrete" },
        { src: "images/gallery/tv-w-1.webp", category: "w" },
        { src: "images/gallery/tv-w-2.webp", category: "w" },
    ];

    // Элементы управления
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const mobileGalleryBtn = document.getElementById('mobileGalleryBtn');

    let currentImageIndex = 0;

    // Инициализация галереи
    function initGallery() {
        galleryContainer.innerHTML = '';
        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.dataset.category = item.category;
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="TV Installation" class="gallery-img">
            `;
            galleryItem.addEventListener('click', () => openLightbox(index));
            galleryContainer.appendChild(galleryItem);
        });
    }

    // Фильтрация изображений
    function filterGallery(filter) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.display = (filter === 'all' || item.dataset.category === filter) 
                ? 'block' 
                : 'none';
        });
    }

    // Лайтбокс
    function openLightbox(index) {
        currentImageIndex = index;
        lightbox.classList.add('active');
        updateLightboxImage();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImg.src = galleryData[currentImageIndex].src;
    }

    function navigate(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryData.length) % galleryData.length;
        updateLightboxImage();
    }

    // Управление мобильной кнопкой галереи
    function handleMobileButton() {
        if (!mobileGalleryBtn) return;
        
        const updateButtonVisibility = () => {
            mobileGalleryBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
        };
        
        updateButtonVisibility();
        window.addEventListener('resize', updateButtonVisibility);
    }

    // Обработчики событий
    function setupEventListeners() {
        // Фильтры
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterGallery(button.dataset.filter);
            });
        });

        // Лайтбокс
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => navigate(-1));
        nextBtn.addEventListener('click', () => navigate(1));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': navigate(-1); break;
                case 'ArrowRight': navigate(1); break;
            }
        });
    }

    // Инициализация
    initGallery();
    setupEventListeners();
    handleMobileButton();
});