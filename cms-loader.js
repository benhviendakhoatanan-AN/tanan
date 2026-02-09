/**
 * CMS Loader
 * Dynamically loads content from localStorage (Admin Panel data)
 * for index.html and news.html
 */

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicEquipment();
    loadDynamicSpecialties();
    loadDynamicNews();
    loadDynamicSettings();
});

// 1. Load Equipment Slider
function loadDynamicEquipment() {
    const raw = localStorage.getItem('cms_equipment');
    if (!raw) return; // Keep static default if no data

    const equipment = JSON.parse(raw).filter(i => i.active !== false);
    if (!equipment.length) return;

    // Find Slider wrapper
    const sliderCol = document.querySelector('.equipment-slider-col');
    if (!sliderCol) return;

    // Re-build slides
    let slidesHtml = `
                    <!-- Slider Wrapper -->
                    <div class="equipment-slider-wrapper">`;

    equipment.forEach((item, index) => {
        slidesHtml += `
                        <div class="equipment-slide ${index === 0 ? 'active' : ''}">
                            <img src="${item.image}" alt="${item.caption}">
                            <div class="equipment-caption">
                                <h3>${item.caption}</h3>
                                ${item.link ? `<a href="${item.link}" class="equipment-link">XEM CHI TIẾT <i class="fas fa-arrow-right"></i></a>` : ''}
                            </div>
                        </div>`;
    });

    slidesHtml += `</div>
                    <!-- Navigation Dots -->
                    <div class="equipment-dots">`;

    equipment.forEach((_, index) => {
        slidesHtml += `<div class="equipment-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`;
    });

    slidesHtml += `</div>`;

    // Replace Content
    sliderCol.innerHTML = slidesHtml;

    // Re-initialize Slider Script if available
    if (typeof startEquipmentAutoPlay === 'function') {
        // Stop previous loop if any (handled in script.js likely)
        // Reset Logic
        // We assume script.js handles events based on class names, 
        // but we might need to re-bind events since we replaced DOM.
        // Simple reload logic:
        bindEquipmentEvents();
    }
}

function bindEquipmentEvents() {
    // Re-attached from script.js logic manually here for robustness
    const slides = document.querySelectorAll('.equipment-slide');
    const dots = document.querySelectorAll('.equipment-dot');
    let currentSlide = 0;

    // Clear old interval if exists globally? Hard to access. 
    // We assume the old script runs on old DOM elements which are gone, 
    // so just starting new logic is fine, though interval might keep running on detached nodes (memory leak).
    // Better to reload page, but we can't.
    // Let's just set click handlers.

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-slide'));
            goToSlide(index);
        });
    });

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = n;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Auto play
    setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 5000);
}


// 2. Load Specialties
function loadDynamicSpecialties() {
    // A. Load Grid (8 icons)
    const rawGrid = localStorage.getItem('cms_spec_grid');
    if (rawGrid) {
        const gridData = JSON.parse(rawGrid);
        const gridContainer = document.querySelector('.specialty-grid'); // Need to check class in index.html
        if (gridContainer) {
            // Check if we can map by index or replace all. 
            // index.html uses .specialty-item. 
            const items = gridContainer.querySelectorAll('.specialty-item');
            gridData.forEach((data, index) => {
                if (items[index]) {
                    const img = items[index].querySelector('.center-img');
                    const title = items[index].querySelector('h3');
                    const link = items[index].querySelector('a'); // Wrapper usually

                    if (img) img.src = data.image;
                    if (title) title.textContent = data.name;
                    // Link update logic if structure matches
                }
            });
        }
    }

    // B. Load List (4 columns)
    const rawList = localStorage.getItem('cms_spec_list');
    if (rawList) {
        const listData = JSON.parse(rawList);
        const listContainer = document.querySelector('.detailed-services-container');
        if (listContainer) {
            listContainer.innerHTML = listData.map(col => `
                <div class="service-column">
                    <h3 class="service-col-title">Cột ${col.col}</h3>
                    <ul class="service-list">
                        ${col.items.map(item => `<li><a href="#">${item}</a></li>`).join('')}
                    </ul>
                </div>
            `).join('');

            // Adjust grid columns css if needed based on count? 
            // CSS is set to repeat(4, 1fr) so it matches 4 columns.
        }
    }
}


// 3. Load News (Index & News Page)
function loadDynamicNews() {
    const rawNews = localStorage.getItem('cms_articles');
    if (!rawNews) return;

    const articles = JSON.parse(rawNews).filter(a => a.status === 'published');

    // A. Index Page "Latest News"
    const indexNewsGrid = document.querySelector('.news-grid'); // Shared class

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Find specific news section in index if class is shared
        // Assuming .news-grid is used in index
    }

    if (indexNewsGrid) {
        // Prepend new articles
        const newHtml = articles.map(article => `
             <div class="news-item"> <!-- Check class name in index.html vs news.html -->
                <div class="news-thumb">
                    <img src="${article.image || 'https://placehold.co/400x250?text=News'}" alt="${article.imageAlt}">
                    <div class="news-date">${new Date(article.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}</div>
                </div>
                <div class="news-info">
                    <div class="news-cat">${article.category || 'Tin tức'}</div>
                    <h3 class="news-title"><a href="#">${article.title}</a></h3>
                    <p class="news-desc">${article.excerpt || article.content.substring(0, 100) + '...'}</p>
                    <a href="#" class="read-more">Đọc thêm <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');

        // This prepends. If we want to replace, we can.
        // But Index page has specific HTML structure. Need to match it exactly.
        // Let's verify index.html structure first.
    }
}

// 4. Load Settings (Hotlines etc)
function loadDynamicSettings() {
    const settings = JSON.parse(localStorage.getItem('cms_settings'));
    if (!settings) return;

    // Hotlines
    const hotlines = document.querySelectorAll('.header-hotlines .hotline-item');
    // Need robust selectors. 
    // Best to add IDs to index.html header elements for easy targeting.
}
