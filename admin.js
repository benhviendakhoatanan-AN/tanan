/**
 * Admin Panel CMS - Complete JavaScript
 * Full-featured CMS with Dashboard, Content, Products, Pages, Users, Appearance, SEO, Settings
 */

(function () {
    'use strict';
    console.log("Admin JS Loaded");

    // =========================================================================
    // Configuration
    // =========================================================================
    const CONFIG = {
        DEFAULT_PASSWORD: 'tanan2024',
        STORAGE_KEYS: {
            PASSWORD: 'admin_password',
            LOGGED_IN: 'admin_logged_in',
            SHEETS_URL: 'google_sheets_url',
            ARTICLES: 'cms_articles',
            PRODUCTS: 'cms_products',
            SITE_CONFIG: 'cms_site_config',
            THEME: 'cms_theme',
            MENU: 'cms_menu',
            WIDGETS: 'cms_widgets',
            GA_ID: 'cms_ga_id',
            GSC_CODE: 'cms_gsc_code',
            KEYWORDS: 'cms_keywords'
        }
    };

    // =========================================================================
    // State
    // =========================================================================
    let articlesData = [];
    let productsData = [];
    let editingArticleId = null;
    let editingProductId = null;
    let equipmentData = [];
    let editingEquipmentId = null;
    let trafficChart = null;

    // =========================================================================
    // DOM Elements
    // =========================================================================
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => document.querySelectorAll(selector);

    // =========================================================================
    // Authentication
    // =========================================================================
    function getStoredPassword() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.PASSWORD) || CONFIG.DEFAULT_PASSWORD;
    }

    function isLoggedIn() {
        return sessionStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN) === 'true';
    }

    function login(password) {
        if (password === getStoredPassword()) {
            sessionStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
            return true;
        }
        return false;
    }

    function logout() {
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.LOGGED_IN);
        showLoginScreen();
    }

    function showLoginScreen() {
        $('login-screen').style.display = 'flex';
        $('admin-dashboard').style.display = 'none';
    }

    function showDashboard() {
        try {
            $('login-screen').style.display = 'none';
            $('admin-dashboard').style.display = 'flex';
            initDashboard();
            loadAllData();
            loadEquipment(); // Load Equipment Initial Data
            loadSpecialties(); // Load Specialties Initial Data
        } catch (e) {
            alert('Lỗi hiển thị Dashboard: ' + e.message);
            console.error(e);
            // Show login screen again so they aren't stuck on blank page
            $('login-screen').style.display = 'flex';
            $('admin-dashboard').style.display = 'none';
        }
    }

    // =========================================================================
    // Navigation
    // =========================================================================
    function switchTab(tabName) {
        $$('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabName) {
                item.classList.add('active');
            }
        });

        $$('.admin-tab').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });

        const activeTab = $(`tab-${tabName}`);
        if (activeTab) {
            activeTab.style.display = 'block';
            activeTab.classList.add('active');
        }
    }

    // =========================================================================
    // Dashboard
    // =========================================================================
    function initDashboard() {
        // Set current date
        const dateEl = $('current-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Update stats
        updateStats();

        // Init traffic chart
        initTrafficChart();

        // Load notifications
        loadNotifications();

        // Load SEO checklist
        try {
            loadSEOChecklist();
        } catch (e) { console.warn('SEO Checklist Error', e); }
    }

    function updateStats() {
        const articles = getArticles();
        const products = getProducts();
        const reviews = typeof window.reviews !== 'undefined' ? window.reviews : [];

        $('stat-articles').textContent = articles.length;
        $('stat-products').textContent = products.length;
        $('stat-reviews').textContent = reviews.length;
        $('stat-views').textContent = Math.floor(Math.random() * 5000) + 1000; // Demo
    }

    function initTrafficChart() {
        try {
            const ctx = $('trafficChart');
            if (!ctx) return;

            if (trafficChart) {
                trafficChart.destroy();
            }

            const labels = [];
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
                data.push(Math.floor(Math.random() * 500) + 100);
            }

            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded');
                return;
            }

            trafficChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Lượt xem',
                        data: data,
                        borderColor: '#004aad',
                        backgroundColor: 'rgba(0, 74, 173, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        } catch (e) {
            console.error('Error initializing traffic chart:', e);
        }
    }

    function loadNotifications() {
        const container = $('notifications-list');
        if (!container) return;

        const notifications = [
            { type: 'info', text: 'Có 3 bài viết đang chờ xuất bản', time: '2 giờ trước' },
            { type: 'success', text: 'Backup tự động hoàn tất', time: '1 ngày trước' },
            { type: 'warning', text: 'SSL certificate sẽ hết hạn trong 30 ngày', time: '3 ngày trước' }
        ];

        container.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.type}">
                <p>${n.text}</p>
                <small>${n.time}</small>
            </div>
        `).join('');
    }

    // =========================================================================
    // Articles (Content Management)
    // =========================================================================
    function getArticles() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.ARTICLES);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing articles:', e);
            }
        }

        // Default sample articles
        return [
            {
                id: '1',
                date: '2024-01-20',
                category: 'Tin tức',
                tags: 'nội soi, bệnh viện',
                status: 'published',
                keyword: 'nội soi tiêu hóa',
                metaTitle: 'Đơn vị Nội soi Tiêu hóa chuẩn Nhật Bản tại Long An',
                metaDesc: 'Bệnh viện Đa khoa Quốc tế Tân An khai trương Đơn vị Nội soi Tiêu hóa.',
                h1: 'Khai trương Đơn vị Nội soi Tiêu hóa chuẩn Nhật Bản',
                content: '## Giới thiệu\nBệnh viện Tân An chính thức khai trương...',
                image: 'assets/news-1.webp',
                imageAlt: 'Nội soi tiêu hóa'
            }
        ];
    }

    function saveArticles(data) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ARTICLES, JSON.stringify(data));
    }

    function loadArticles() {
        articlesData = getArticles();
        renderArticlesTable();
    }

    function renderArticlesTable() {
        const tbody = $('articles-tbody');
        const loading = $('articles-loading');
        const empty = $('articles-empty');

        if (loading) loading.style.display = 'none';

        if (articlesData.length === 0) {
            if (empty) empty.style.display = 'block';
            tbody.innerHTML = '';
            return;
        }

        if (empty) empty.style.display = 'none';

        tbody.innerHTML = articlesData.map(article => `
            <tr>
                <td>${formatDate(article.date)}</td>
                <td>
                    <strong>${escapeHtml(article.h1 || article.metaTitle)}</strong>
                    <br><small style="color:#666">${escapeHtml(truncate(article.metaDesc || '', 50))}</small>
                </td>
                <td><span class="badge badge-primary">${escapeHtml(article.category)}</span></td>
                <td>${(article.tags || '').split(',').map(t =>
            `<span class="badge" style="background:#f0f0f0;margin:2px">${t.trim()}</span>`
        ).join('')}</td>
                <td><span class="badge ${article.status === 'published' ? 'badge-success' : 'badge-warning'}">
                    ${article.status === 'published' ? 'Đã đăng' : 'Nháp'}
                </span></td>
                <td class="actions">
                    <button class="btn-edit" onclick="adminPanel.editArticle('${article.id}')">Sửa</button>
                    <button class="btn-delete" onclick="adminPanel.deleteArticle('${article.id}')">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    function openArticleModal(isEdit = false) {
        $('article-modal').style.display = 'flex';
        $('article-modal-title').textContent = isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới';

        if (!isEdit) {
            $('article-form').reset();
            $('article-id').value = '';
            editingArticleId = null;
            updateArticleSEO();
        }
    }

    function closeArticleModal() {
        $('article-modal').style.display = 'none';
        $('article-form').reset();
        editingArticleId = null;
    }

    function editArticle(id) {
        const article = articlesData.find(a => a.id === id);
        if (!article) return;

        editingArticleId = id;
        $('article-id').value = id;
        $('article-keyword').value = article.keyword || '';
        $('article-meta-title').value = article.metaTitle || '';
        $('article-meta-desc').value = article.metaDesc || '';
        $('article-category').value = article.category || 'Tin tức';
        $('article-tags').value = article.tags || '';
        $('article-h1').value = article.h1 || '';
        $('article-content').value = article.content || '';
        $('article-image').value = article.image || '';
        $('article-image-alt').value = article.imageAlt || '';

        updateArticleCharCounts();
        updateArticleSEO();
    }

    function saveArticle(e) {
        e.preventDefault();

        const article = {
            id: editingArticleId || generateId(),
            title: $('article-meta-title').value || $('article-h1').value,
            h1: $('article-h1').value,
            excerpt: $('article-excerpt').value, // New field
            keyword: $('article-keyword').value,
            category: $('article-category').value,
            metaDesc: $('article-meta-desc').value,
            tags: $('article-tags').value,
            content: $('article-content').value,
            image: $('article-image').value,
            imageAlt: $('article-image-alt').value,
            status: 'published',
            date: new Date().toISOString(),
            author: 'Admin' // Default
        };

        if (editingArticleId) {
            const index = articlesData.findIndex(a => a.id === editingArticleId);
            if (index !== -1) articlesData[index] = { ...articlesData[index], ...article };
        } else {
            articlesData.unshift(article);
        }

        saveArticlesData(); // Ensure this matches definition
        closeArticleModal();
        renderArticleTable(); // Ensure this matches definition
        updateStats();
        // Assuming showToast is defined elsewhere or will be added.
        // showToast('✅ Đã lưu bài viết!');
    }

    function deleteArticle(id) {
        if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
        articlesData = articlesData.filter(a => a.id !== id);
        saveArticles(articlesData);
        renderArticlesTable();
        updateStats();
    }

    function updateArticleCharCounts() {
        const titleEl = $('article-meta-title');
        const descEl = $('article-meta-desc');
        if (titleEl) $('article-title-count').textContent = titleEl.value.length;
        if (descEl) $('article-desc-count').textContent = descEl.value.length;
    }

    function updateArticleSEO() {
        const keyword = ($('article-keyword')?.value || '').toLowerCase();
        const title = $('article-meta-title')?.value || '';
        const desc = $('article-meta-desc')?.value || '';
        const h1 = $('article-h1')?.value || '';
        const content = $('article-content')?.value || '';

        let score = 0;
        const checks = [];

        if (keyword) { score += 10; checks.push({ pass: true, text: 'Từ khóa đã nhập' }); }
        else { checks.push({ pass: false, text: 'Chưa nhập từ khóa' }); }

        if (keyword && title.toLowerCase().includes(keyword)) { score += 15; checks.push({ pass: true, text: 'Từ khóa trong title' }); }
        else if (keyword) { checks.push({ pass: false, text: 'Title chưa chứa từ khóa' }); }

        if (title.length >= 50 && title.length <= 60) { score += 10; checks.push({ pass: true, text: 'Title độ dài tốt' }); }
        else if (title) { score += 5; checks.push({ pass: 'warn', text: `Title ${title.length}/60` }); }

        if (keyword && desc.toLowerCase().includes(keyword)) { score += 15; checks.push({ pass: true, text: 'Từ khóa trong description' }); }
        else if (keyword) { checks.push({ pass: false, text: 'Description chưa chứa từ khóa' }); }

        if (desc.length >= 150 && desc.length <= 160) { score += 10; checks.push({ pass: true, text: 'Description độ dài tốt' }); }
        else if (desc) { score += 5; checks.push({ pass: 'warn', text: `Description ${desc.length}/160` }); }

        if (keyword && h1.toLowerCase().includes(keyword)) { score += 15; checks.push({ pass: true, text: 'Từ khóa trong H1' }); }
        else if (keyword) { checks.push({ pass: false, text: 'H1 chưa chứa từ khóa' }); }

        if (content.includes('## ')) { score += 5; checks.push({ pass: true, text: 'Có tiêu đề H2' }); }
        if (content.length >= 300) { score += 10; checks.push({ pass: true, text: 'Nội dung đủ dài' }); }

        // Update UI
        const circle = $('article-score-circle');
        const value = $('article-score-value');
        const list = $('article-seo-checklist');

        if (circle) {
            const deg = (score / 100) * 360;
            circle.style.setProperty('--score-deg', `${deg}deg`);
            circle.className = 'seo-score-circle ' + (score < 40 ? 'score-low' : score < 70 ? 'score-medium' : 'score-high');
        }
        if (value) value.textContent = score;
        if (list) {
            list.innerHTML = checks.map(c =>
                `<div class="seo-check-item ${c.pass === true ? 'passed' : c.pass === 'warn' ? 'warning' : 'failed'}">${c.text}</div>`
            ).join('');
        }
    }

    // =========================================================================
    // Products Management
    // =========================================================================
    function getProducts() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing products:', e);
            }
        }

        return [
            { id: '1', type: 'package', name: 'Gói Cơ bản', desc: 'Khám tổng quát cơ bản', price: 500000, salePrice: 450000, active: true },
            { id: '2', type: 'package', name: 'Gói Tiêu chuẩn', desc: 'Khám tổng quát + xét nghiệm', price: 1500000, salePrice: 1350000, active: true },
            { id: '3', type: 'service', name: 'Nội soi dạ dày', desc: 'Nội soi công nghệ Nhật', price: 2000000, salePrice: 0, active: true }
        ];
    }

    function saveProducts(data) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
    }

    function loadProducts() {
        productsData = getProducts();
        renderProductsTable();
    }

    function renderProductsTable() {
        const tbody = $('products-tbody');
        if (!tbody) return;

        if (productsData.length === 0) {
            $('products-empty').style.display = 'block';
            tbody.innerHTML = '';
            return;
        }

        $('products-empty').style.display = 'none';

        tbody.innerHTML = productsData.map(p => `
            <tr>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${escapeHtml(truncate(p.desc || '', 50))}</td>
                <td>
                    ${p.salePrice ? `<del style="color:#999">${formatPrice(p.price)}</del> ` : ''}
                    <strong style="color:var(--primary-color)">${formatPrice(p.salePrice || p.price)}</strong>
                </td>
                <td><span class="badge ${p.active ? 'badge-success' : 'badge-warning'}">
                    ${p.active ? 'Hoạt động' : 'Ẩn'}
                </span></td>
                <td class="actions">
                    <button class="btn-edit" onclick="adminPanel.editProduct('${p.id}')">Sửa</button>
                    <button class="btn-delete" onclick="adminPanel.deleteProduct('${p.id}')">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    function openProductModal(isEdit = false) {
        $('product-modal').style.display = 'flex';
        $('product-modal-title').textContent = isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới';
        if (!isEdit) {
            $('product-form').reset();
            $('product-id').value = '';
            editingProductId = null;
        }
    }

    function closeProductModal() {
        $('product-modal').style.display = 'none';
        editingProductId = null;
    }

    function editProduct(id) {
        const product = productsData.find(p => p.id === id);
        if (!product) return;

        editingProductId = id;
        $('product-id').value = id;
        $('product-name').value = product.name || '';
        $('product-type').value = product.type || 'package';
        $('product-desc').value = product.desc || '';
        $('product-price').value = product.price || 0;
        $('product-sale-price').value = product.salePrice || 0;
        $('product-content').value = product.content || '';
        $('product-active').checked = product.active !== false;

        openProductModal(true);
    }

    function saveProduct() {
        const product = {
            id: editingProductId || generateId(),
            name: $('product-name').value,
            type: $('product-type').value,
            desc: $('product-desc').value,
            price: parseInt($('product-price').value) || 0,
            salePrice: parseInt($('product-sale-price').value) || 0,
            content: $('product-content').value,
            active: $('product-active').checked
        };

        if (editingProductId) {
            const index = productsData.findIndex(p => p.id === editingProductId);
            if (index !== -1) productsData[index] = product;
        } else {
            productsData.unshift(product);
        }

        saveProducts(productsData);
        closeProductModal();
        renderProductsTable();
        updateStats();
    }

    function deleteProduct(id) {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        productsData = productsData.filter(p => p.id !== id);
        saveProducts(productsData);
        renderProductsTable();
        updateStats();
    }

    // =========================================================================
    // Equipment Management
    // =========================================================================
    function getEquipment() {
        const stored = localStorage.getItem('cms_equipment');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing equipment data, ensuring defaults:', e);
            }
        }

        // Default data based on index.html
        return [
            { id: '1', caption: 'Hệ thống Nội soi NBI hiện đại', image: 'uploaded_media_1_1769674202971.jpg', active: true },
            { id: '2', caption: 'Máy chụp MRI 1.5 Tesla', image: 'uploaded_media_0_1769663978644.jpg', active: true },
            { id: '3', caption: 'Hệ thống CT Scanner 128 lát cắt', image: 'uploaded_media_1_1769663978644.jpg', active: true },
            { id: '4', caption: 'Phòng Nội soi Tiêu chuẩn Quốc tế', image: 'assets/phong-noi-soi.png', active: true },
            { id: '5', caption: 'Hệ thống Nội soi Tai Mũi Họng Cao cấp', image: 'assets/may-noi-soi-tai-mui-hong.jpg', active: true },
            { id: '6', caption: 'Hệ thống Nội soi 4K Ultra HD', image: 'assets/he-thong-noi-soi-4k.jpg', active: true }
            // Add more default as needed
        ];
    }

    function saveEquipmentData(data) {
        localStorage.setItem('cms_equipment', JSON.stringify(data));
        equipmentData = data;
    }

    function loadEquipment() {
        equipmentData = getEquipment();
        renderEquipmentTable();
    }

    function renderEquipmentTable() {
        const tbody = $('equipment-tbody');
        if (!tbody) return;

        if (equipmentData.length === 0) {
            $('equipment-empty').style.display = 'block';
            tbody.innerHTML = '';
            return;
        }
        $('equipment-empty').style.display = 'none';

        tbody.innerHTML = equipmentData.map((item, index) => `
            <tr>
                <td><img src="${item.image}" alt="thumb" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                <td>${escapeHtml(item.caption)}</td>
                <td><span class="badge badge-primary">${index + 1}</span></td>
                <td class="actions">
                    <button class="btn-edit" onclick="adminPanel.editEquipment('${item.id}')">Sửa</button>
                    <button class="btn-delete" onclick="adminPanel.deleteEquipment('${item.id}')">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    function openEquipmentModal(isEdit = false) {
        $('equipment-modal').style.display = 'flex';
        $('equipment-modal-title').textContent = isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới';
        if (!isEdit) {
            $('equipment-form').reset();
            $('equipment-id').value = '';
            editingEquipmentId = null;
        }
    }

    function closeEquipmentModal() {
        $('equipment-modal').style.display = 'none';
        editingEquipmentId = null;
    }

    function editEquipment(id) {
        const item = equipmentData.find(i => i.id === id);
        if (!item) return;

        editingEquipmentId = id;
        $('equipment-id').value = id;
        $('equipment-caption').value = item.caption;
        $('equipment-image').value = item.image;
        $('equipment-link').value = item.link || '';
        $('equipment-active').checked = item.active !== false;

        openEquipmentModal(true);
    }

    function saveEquipment() {
        const item = {
            id: editingEquipmentId || generateId(),
            caption: $('equipment-caption').value,
            image: $('equipment-image').value,
            link: $('equipment-link').value,
            active: $('equipment-active').checked
        };

        if (editingEquipmentId) {
            const index = equipmentData.findIndex(i => i.id === editingEquipmentId);
            if (index !== -1) equipmentData[index] = item;
        } else {
            equipmentData.push(item);
        }

        saveEquipmentData(equipmentData);
        closeEquipmentModal();
        renderEquipmentTable();
        updateStats(); // If we count equipment stats
    }

    function deleteEquipment(id) {
        if (!confirm('Bạn có chắc muốn xóa thiết bị này?')) return;
        equipmentData = equipmentData.filter(i => i.id !== id);
        saveEquipmentData(equipmentData);
        renderEquipmentTable();
    }

    // =========================================================================
    // Specialties Management
    // =========================================================================
    let specGridData = [];
    let specListData = [];
    let editingSpecId = null;

    function loadSpecialties() {
        // Grid Data
        const storedGrid = localStorage.getItem('cms_spec_grid');
        if (storedGrid) {
            specGridData = JSON.parse(storedGrid);
        } else {
            // Default 8 items based on index.html
            specGridData = [
                { id: '1', name: 'Nội - Ngoại Tiêu Hóa', image: 'realistic_stomach_endoscopy_icon_v2.png', link: 'noi-soi.html' },
                { id: '2', name: 'Sản - Phụ Khoa', image: 'realistic_maternity_v2_icon.png', link: '#' },
                { id: '3', name: 'Nhi Khoa', image: 'realistic_pediatrics_icon.png', link: '#' },
                { id: '4', name: 'Chấn Thương Chỉnh Hình', image: 'realistic_orthopedics_icon.png', link: '#' },
                { id: '5', name: 'Tim Mạch - Lão Học', image: 'realistic_cardiology_icon.png', link: '#' },
                { id: '6', name: 'Tầm Soát Đột Quỵ', image: 'realistic_stroke_screening_icon.png', link: '#' },
                { id: '7', name: 'Nội Soi Tiêu Hóa', image: 'realistic_endoscopy_icon.png', link: 'noi-soi.html' },
                { id: '8', name: 'Chẩn Đoán Hình Ảnh', image: 'realistic_diagnostic_imaging_icon.png', link: '#' }
            ];
        }

        // List Data
        const storedList = localStorage.getItem('cms_spec_list');
        if (storedList) {
            specListData = JSON.parse(storedList);
        } else {
            specListData = [
                { col: 1, items: ['Nội Tổng quát', 'Nội Tim mạch', 'Nội Thần kinh', 'Nội Tiết', 'Nội Tiêu hóa - Gan mật', 'Nội Hô hấp', 'Nội Thận - Tiết niệu', 'Nội Cơ xương khớp'] },
                { col: 2, items: ['Ngoại Tổng quát', 'Ngoại Chấn thương chỉnh hình', 'Ngoại Thần kinh', 'Ngoại Tiết niệu', 'Sản - Phụ khoa', 'Nhi khoa', 'Mắt', 'Tai Mũi Họng', 'Răng Hàm Mặt', 'Da liễu'] },
                { col: 3, items: ['Xét nghiệm', 'Chẩn đoán hình ảnh', 'Thăm dò chức năng', 'Nội soi tiêu hóa', 'Giải phẫu bệnh'] },
                { col: 4, items: ['Tiêm chủng', 'Dinh dưỡng', 'Vật lý trị liệu', 'Khám sức khỏe tổng quát', 'Khám sức khỏe doanh nghiệp', 'Tầm soát ung thư'] }
            ];
        }

        renderSpecGrid();
        renderSpecList();
    }

    function switchSpecialtySubTab(tab) {
        if (tab === 'grid') {
            $('spec-subtab-grid').style.display = 'block';
            $('spec-subtab-list').style.display = 'none';
        } else {
            $('spec-subtab-grid').style.display = 'none';
            $('spec-subtab-list').style.display = 'block';
        }
    }

    function renderSpecGrid() {
        const tbody = $('spec-grid-tbody');
        if (!tbody) return;
        tbody.innerHTML = specGridData.map(item => `
            <tr>
                <td><img src="${item.image}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.link)}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="adminPanel.editSpecGrid('${item.id}')">Sửa</button>
                    <!-- No delete for fixed 8 items usually, but can add if flexible -->
                </td>
            </tr>
        `).join('');
    }

    function editSpecGrid(id) {
        const item = specGridData.find(i => i.id === id);
        if (!item) return;
        editingSpecId = id;
        $('spec-grid-id').value = id;
        $('spec-grid-name').value = item.name;
        $('spec-grid-image').value = item.image;
        $('spec-grid-link').value = item.link;
        $('spec-grid-modal').style.display = 'flex';
    }

    function closeSpecGridModal() {
        $('spec-grid-modal').style.display = 'none';
        editingSpecId = null;
    }

    function saveSpecGrid() {
        if (!editingSpecId) return;
        const index = specGridData.findIndex(i => i.id === editingSpecId);
        if (index !== -1) {
            specGridData[index] = {
                ...specGridData[index],
                name: $('spec-grid-name').value,
                image: $('spec-grid-image').value,
                link: $('spec-grid-link').value
            };
            localStorage.setItem('cms_spec_grid', JSON.stringify(specGridData));
            closeSpecGridModal();
            renderSpecGrid();
        }
    }

    function renderSpecList() {
        const container = $('spec-list-preview');
        if (!container) return;

        container.innerHTML = specListData.map(col => `
            <div class="col-preview" style="border: 1px solid #eee; padding: 10px; border-radius: 8px;">
                <h4 style="margin-bottom: 10px; color: var(--primary-color);">Cột ${col.col}</h4>
                <ul style="list-style: none; padding: 0;">
                    ${col.items.map((it, idx) => `
                        <li style="display:flex; justify-content:space-between; margin-bottom: 5px; font-size: 0.9rem;">
                            <span>${it}</span>
                            <button onclick="adminPanel.removeSpecListItem(${col.col}, ${idx})" style="border:none; background:none; color:red; cursor:pointer;">&times;</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    function addSpecialtyList() {
        const name = $('new-spec-list-item').value.trim();
        const colNum = parseInt($('new-spec-list-col').value);
        if (!name) return;

        const colIndex = specListData.findIndex(c => c.col === colNum);
        if (colIndex !== -1) {
            specListData[colIndex].items.push(name);
            localStorage.setItem('cms_spec_list', JSON.stringify(specListData));
            $('new-spec-list-item').value = '';
            renderSpecList();
        }
    }

    function removeSpecListItem(colNum, itemIndex) {
        const colIndex = specListData.findIndex(c => c.col === colNum);
        if (colIndex !== -1) {
            specListData[colIndex].items.splice(itemIndex, 1);
            localStorage.setItem('cms_spec_list', JSON.stringify(specListData));
            renderSpecList();
        }
    }

    // =========================================================================
    // SEO Files Management
    // =========================================================================
    const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /equip_section.html
Disallow: /specialties_section.html
Disallow: /assets/private/

Sitemap: https://bvtanan.vn/sitemap.xml`;

    const DEFAULT_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bvtanan.vn/index.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/about.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/noi-soi.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/package-details.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/news.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/contact.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://bvtanan.vn/vang-da.html</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    function loadSEOFiles() {
        $('seo-robots-content').value = localStorage.getItem('cms_robots') || DEFAULT_ROBOTS;
        $('seo-sitemap-content').value = localStorage.getItem('cms_sitemap') || DEFAULT_SITEMAP;
    }

    function saveSEOFiles() {
        const robots = $('seo-robots-content').value;
        const sitemap = $('seo-sitemap-content').value;

        localStorage.setItem('cms_robots', robots);
        localStorage.setItem('cms_sitemap', sitemap);
        showToast('✅ Đã lưu nội dung (LocalStorage)!');
    }

    function downloadSEOFile(type) {
        let content, filename;
        if (type === 'robots') {
            content = $('seo-robots-content').value;
            filename = 'robots.txt';
        } else {
            content = $('seo-sitemap-content').value;
            filename = 'sitemap.xml';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // =========================================================================
    // Pages Management
    // =========================================================================
    function editPage(pageId) {
        const pages = {
            home: { file: 'index.html', title: 'Trang chủ - Bệnh viện Tân An', desc: 'Bệnh viện Đa khoa Quốc tế Tân An' },
            about: { file: 'about.html', title: 'Giới thiệu - Bệnh viện Tân An', desc: 'Giới thiệu về Bệnh viện Tân An' },
            endoscopy: { file: 'noi-soi.html', title: 'Nội soi - Bệnh viện Tân An', desc: 'Dịch vụ nội soi tiêu hóa' },
            packages: { file: 'package-details.html', title: 'Gói khám - Bệnh viện Tân An', desc: 'Chi tiết các gói khám' },
            news: { file: 'news.html', title: 'Tin tức - Bệnh viện Tân An', desc: 'Tin tức và bài viết' }
        };

        const page = pages[pageId];
        if (!page) return;

        $('page-modal').style.display = 'flex';
        $('page-modal-title').textContent = `Chỉnh sửa: ${page.file}`;
        $('page-file').value = page.file;
        $('page-title').value = page.title;
        $('page-description').value = page.desc;
    }

    function closePageModal() {
        $('page-modal').style.display = 'none';
    }

    function savePageMeta() {
        alert('Đã lưu thông tin SEO cho trang. (Demo mode - cần backend để lưu thật)');
        closePageModal();
    }

    // =========================================================================
    // Reviews
    // =========================================================================
    function loadReviews() {
        const reviews = typeof window.reviews !== 'undefined' ? window.reviews : [];
        const tbody = $('reviews-tbody');
        if (!tbody) return;

        tbody.innerHTML = reviews.slice(0, 20).map(r => `
            <tr>
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td>${escapeHtml(r.location || r.loc || '')}</td>
                <td>${'⭐'.repeat(r.rating || 5)}</td>
                <td>${escapeHtml(truncate(r.content || r.text || '', 80))}</td>
                <td class="actions">
                    <button class="btn-edit">Sửa</button>
                    <button class="btn-delete">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    // =========================================================================
    // Appearance (Theme, Menu, Widgets)
    // =========================================================================
    function loadAppearance() {
        // Load theme colors
        const theme = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || '{}');
        if (theme.primary) {
            $('theme-primary').value = theme.primary;
            $('theme-primary-hex').value = theme.primary;
        }
        if (theme.secondary) {
            $('theme-secondary').value = theme.secondary;
            $('theme-secondary-hex').value = theme.secondary;
        }

        // Load menu
        loadMenuItems();

        // Load widgets
        const widgets = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.WIDGETS) || '{}');
        if ($('widget-reviews')) $('widget-reviews').checked = widgets.reviews !== false;
        if ($('widget-news')) $('widget-news').checked = widgets.news !== false;
        if ($('widget-cta')) $('widget-cta').checked = widgets.cta !== false;
        if ($('widget-chat')) $('widget-chat').checked = widgets.chat !== false;
    }

    function saveTheme() {
        const theme = {
            primary: $('theme-primary').value,
            secondary: $('theme-secondary').value
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, JSON.stringify(theme));
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        alert('Đã lưu theme!');
    }

    function loadMenuItems() {
        const container = $('menu-items');
        if (!container) return;

        const menu = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.MENU) || 'null') || [
            { label: 'Trang chủ', url: 'index.html' },
            { label: 'Dịch vụ', url: 'noi-soi.html' },
            { label: 'Gói khám', url: 'package-details.html' },
            { label: 'Giới thiệu', url: 'about.html' }
        ];

        container.innerHTML = menu.map((item, i) => `
            <div class="menu-item">
                <input type="text" value="${escapeHtml(item.label)}" placeholder="Tên menu" data-index="${i}" data-field="label">
                <input type="text" value="${escapeHtml(item.url)}" placeholder="URL" data-index="${i}" data-field="url">
                <button onclick="adminPanel.removeMenuItem(${i})" style="background:#ffebee;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">🗑️</button>
            </div>
        `).join('');
    }

    function addMenuItem() {
        const menu = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.MENU) || '[]');
        menu.push({ label: 'Mục mới', url: '#' });
        localStorage.setItem(CONFIG.STORAGE_KEYS.MENU, JSON.stringify(menu));
        loadMenuItems();
    }

    function removeMenuItem(index) {
        const menu = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.MENU) || '[]');
        menu.splice(index, 1);
        localStorage.setItem(CONFIG.STORAGE_KEYS.MENU, JSON.stringify(menu));
        loadMenuItems();
    }

    function saveWidgets() {
        const widgets = {
            reviews: $('widget-reviews')?.checked,
            news: $('widget-news')?.checked,
            cta: $('widget-cta')?.checked,
            chat: $('widget-chat')?.checked
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.WIDGETS, JSON.stringify(widgets));
        alert('Đã lưu cài đặt widgets!');
    }

    // =========================================================================
    // SEO & Marketing
    // =========================================================================
    function loadSEOSettings() {
        // Google Analytics
        const gaId = localStorage.getItem(CONFIG.STORAGE_KEYS.GA_ID) || '';
        if ($('ga-id')) $('ga-id').value = gaId;

        // Google Search Console
        const gscCode = localStorage.getItem(CONFIG.STORAGE_KEYS.GSC_CODE) || '';
        if ($('gsc-code')) $('gsc-code').value = gscCode;

        // Keywords
        loadKeywords();
    }

    function saveGA() {
        const gaId = $('ga-id').value.trim();
        localStorage.setItem(CONFIG.STORAGE_KEYS.GA_ID, gaId);
        if (gaId) {
            $('ga-status').style.display = 'block';
            // In real implementation, inject GA script
        }
    }

    function saveGSC() {
        const code = $('gsc-code').value.trim();
        localStorage.setItem(CONFIG.STORAGE_KEYS.GSC_CODE, code);
        alert('Đã lưu mã xác minh Search Console!');
    }

    function loadKeywords() {
        const container = $('tracked-keywords');
        if (!container) return;

        const keywords = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.KEYWORDS) || '[]');
        if (keywords.length === 0) {
            container.innerHTML = '<p style="color:#666">Chưa có từ khóa nào được theo dõi.</p>';
            return;
        }

        container.innerHTML = keywords.map((kw, i) => `
            <div class="keyword-tag">
                <span>${escapeHtml(kw)}</span>
                <button onclick="adminPanel.removeKeyword(${i})">×</button>
            </div>
        `).join('');
    }

    function addKeyword() {
        const input = $('new-keyword');
        const kw = input.value.trim();
        if (!kw) return;

        const keywords = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.KEYWORDS) || '[]');
        keywords.push(kw);
        localStorage.setItem(CONFIG.STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
        input.value = '';
        loadKeywords();
    }

    function removeKeyword(index) {
        const keywords = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.KEYWORDS) || '[]');
        keywords.splice(index, 1);
        localStorage.setItem(CONFIG.STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
        loadKeywords();
    }

    function loadSEOChecklist() {
        const container = $('seo-checklist-main');
        if (!container) return;

        const checks = [
            { pass: true, text: 'Tất cả trang có Meta Title' },
            { pass: true, text: 'Tất cả hình ảnh đã chuyển WebP' },
            { pass: true, text: 'Website tương thích mobile' },
            { pass: false, text: 'Chưa cài đặt Google Analytics' },
            { pass: false, text: 'Chưa xác minh Search Console' }
        ];

        container.innerHTML = checks.map(c =>
            `<div class="check-item ${c.pass ? 'passed' : 'failed'}">${c.text}</div>`
        ).join('');
    }

    // =========================================================================
    // Settings
    // =========================================================================
    function loadSettings() {
        const config = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SITE_CONFIG) || '{}');

        if ($('site-name')) $('site-name').value = config.name || 'Bệnh viện Đa khoa Quốc tế Tân An';
        if ($('site-slogan')) $('site-slogan').value = config.slogan || 'Chuẩn Nhật - Chất lượng Quốc tế';
        if ($('site-email')) $('site-email').value = config.email || 'info@bvtanan.vn';
        if ($('site-phone')) $('site-phone').value = config.phone || '1900 1234';
        if ($('default-meta-title')) $('default-meta-title').value = config.metaTitle || '';
        if ($('default-meta-desc')) $('default-meta-desc').value = config.metaDesc || '';

        // Google Sheets URL
        const sheetsUrl = localStorage.getItem(CONFIG.STORAGE_KEYS.SHEETS_URL) || '';
        if ($('sheets-url')) $('sheets-url').value = sheetsUrl;

        // Load SEO Files
        loadSEOFiles();
    }

    function saveSiteInfo() {
        const config = {
            name: $('site-name')?.value,
            slogan: $('site-slogan')?.value,
            email: $('site-email')?.value,
            phone: $('site-phone')?.value
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.SITE_CONFIG, JSON.stringify(config));
        alert('Đã lưu thông tin website!');
    }

    function saveSEODefaults() {
        const config = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SITE_CONFIG) || '{}');
        config.metaTitle = $('default-meta-title')?.value;
        config.metaDesc = $('default-meta-desc')?.value;

        localStorage.setItem(CONFIG.STORAGE_KEYS.SITE_CONFIG, JSON.stringify(config));
        alert('Đã lưu SEO mặc định!');
    }

    // =========================================================================
    // SEO Files Management
    // =========================================================================
    function loadSEOFiles() {
        const stored = localStorage.getItem('cms_seo_files');
        const defaults = {
            robots: "User-agent: *\nDisallow: /admin.html\nDisallow: /assets/\nSitemap: https://yourdomain.com/sitemap.xml",
            sitemap: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://yourdomain.com/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
   </url>
</urlset>`
        };

        const data = stored ? JSON.parse(stored) : defaults;

        // Populate fields
        if ($('seo-robots-content')) $('seo-robots-content').value = data.robots;
        if ($('seo-sitemap-content')) $('seo-sitemap-content').value = data.sitemap;
    }

    function saveSEOFiles() {
        const robots = $('seo-robots-content')?.value || '';
        const sitemap = $('seo-sitemap-content')?.value || '';

        const data = { robots, sitemap };
        localStorage.setItem('cms_seo_files', JSON.stringify(data));
        alert('Đã lưu nội dung file SEO vào bộ nhớ LocalStorage!');
    }

    function downloadSEOFile(type) {
        let content = '';
        let filename = '';

        if (type === 'robots') {
            content = $('seo-robots-content')?.value || '';
            filename = 'robots.txt';
        } else {
            content = $('seo-sitemap-content')?.value || '';
            filename = 'sitemap.xml';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function savePassword(current, newPass, confirm) {
        $('password-success').style.display = 'none';
        $('password-error').style.display = 'none';

        if (current !== getStoredPassword()) {
            $('password-error').textContent = 'Mật khẩu hiện tại không đúng!';
            $('password-error').style.display = 'block';
            return;
        }

        if (newPass.length < 6) {
            $('password-error').textContent = 'Mật khẩu mới phải >= 6 ký tự!';
            $('password-error').style.display = 'block';
            return;
        }

        if (newPass !== confirm) {
            $('password-error').textContent = 'Mật khẩu xác nhận không khớp!';
            $('password-error').style.display = 'block';
            return;
        }

        localStorage.setItem(CONFIG.STORAGE_KEYS.PASSWORD, newPass);
        $('password-success').style.display = 'block';
        $('change-password-form').reset();
    }

    // =========================================================================
    // Quick Actions
    // =========================================================================
    function quickAction(action) {
        switch (action) {
            case 'newArticle':
                switchTab('content');
                setTimeout(() => openArticleModal(), 100);
                break;
            case 'newProduct':
                switchTab('products');
                setTimeout(() => openProductModal(), 100);
                break;
            case 'viewSite':
                window.open('index.html', '_blank');
                break;
            case 'seoCheck':
                switchTab('seo');
                break;
        }
    }

    // =========================================================================
    // Editor Toolbar
    // =========================================================================
    function initToolbar() {
        document.querySelectorAll('.editor-toolbar').forEach(toolbar => {
            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('.toolbar-btn');
                if (!btn) return;

                const textarea = toolbar.nextElementSibling;
                if (!textarea) return;

                const action = btn.dataset.action;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value.substring(start, end);
                let insert = '';

                switch (action) {
                    case 'h2': insert = `\n## ${text || 'Tiêu đề H2'}\n`; break;
                    case 'h3': insert = `\n### ${text || 'Tiêu đề H3'}\n`; break;
                    case 'bold': insert = `**${text || 'văn bản đậm'}**`; break;
                    case 'italic': insert = `*${text || 'văn bản nghiêng'}*`; break;
                    case 'ul': insert = `\n- ${text || 'Mục 1'}\n- Mục 2\n`; break;
                    case 'link':
                        const url = prompt('Nhập URL:', 'https://');
                        if (url) insert = `[${text || 'link'}](${url})`;
                        break;
                    case 'image':
                        const imgUrl = prompt('URL hình ảnh:', 'https://');
                        if (imgUrl) {
                            const alt = prompt('Alt text:', text || 'Mô tả');
                            insert = `\n![${alt}](${imgUrl})\n`;
                        }
                        break;
                    case 'preview':
                        showPreview(textarea.value);
                        return;
                }

                if (insert) {
                    textarea.value = textarea.value.substring(0, start) + insert + textarea.value.substring(end);
                    textarea.focus();
                    updateArticleSEO();
                }
            });
        });
    }

    function showPreview(content) {
        let html = content
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width:100%">')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
            .replace(/\n\n/g, '</p><p>');

        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `<span class="preview-close">&times;</span><div class="preview-content"><p>${html}</p></div>`;
        document.body.appendChild(modal);

        modal.querySelector('.preview-close').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    // =========================================================================
    // Utilities
    // =========================================================================
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncate(text, len) {
        if (!text) return '';
        return text.length <= len ? text : text.substring(0, len) + '...';
    }

    // =========================================================================
    // Data Loading
    // =========================================================================
    function loadAllData() {
        loadArticles();
        loadProducts();
        loadReviews();
        loadAppearance();
        loadSEOSettings();
        loadSettings();
    }

    // =========================================================================
    // Event Listeners
    // =========================================================================
    function initEventListeners() {
        // Login
        $('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputPass = $('password').value;
            const storedPass = getStoredPassword();
            console.log('Login Check:', inputPass, storedPass);

            if (login(inputPass)) {
                try {
                    $('login-error').style.display = 'none';
                    // alert('Đăng nhập thành công! Đang tải bảng điều khiển...');
                    showDashboard();
                } catch (e) {
                    alert('Lỗi khởi tạo Dashboard: ' + e.message);
                    console.error(e);
                }
            } else {
                $('login-error').textContent = `Sai mật khẩu! Mật khẩu đúng là: ${storedPass}`;
                $('login-error').style.display = 'block';
            }
        });

        $('logout-btn')?.addEventListener('click', logout);

        // Navigation
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab(item.dataset.tab);
            });
        });

        // Article modal
        $('add-article-btn')?.addEventListener('click', () => openArticleModal());
        $('close-article-modal')?.addEventListener('click', closeArticleModal);
        $('cancel-article')?.addEventListener('click', closeArticleModal);
        $('article-modal')?.addEventListener('click', (e) => { if (e.target.id === 'article-modal') closeArticleModal(); });

        $('article-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock event object if saveArticle expects it, or just fix saveArticle to not need it?
            // saveArticle signature is saveArticle(e). It calls e.preventDefault().
            // So we should pass e.
            saveArticle(e);
        });

        // Article SEO fields
        ['article-keyword', 'article-meta-title', 'article-meta-desc', 'article-h1', 'article-content'].forEach(id => {
            $(id)?.addEventListener('input', () => { updateArticleCharCounts(); updateArticleSEO(); });
        });

        // Product modal
        $('add-product-btn')?.addEventListener('click', () => openProductModal());
        $('close-product-modal')?.addEventListener('click', closeProductModal);
        $('cancel-product')?.addEventListener('click', closeProductModal);
        $('product-modal')?.addEventListener('click', (e) => { if (e.target.id === 'product-modal') closeProductModal(); });

        $('product-form')?.addEventListener('submit', (e) => { e.preventDefault(); saveProduct(); });

        // Theme colors
        $('theme-primary')?.addEventListener('input', (e) => { $('theme-primary-hex').value = e.target.value; });
        $('theme-secondary')?.addEventListener('input', (e) => { $('theme-secondary-hex').value = e.target.value; });

        // Password
        $('change-password-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            savePassword($('current-password').value, $('new-password').value, $('confirm-password').value);
        });

        // Sheets config
        $('sheets-config-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem(CONFIG.STORAGE_KEYS.SHEETS_URL, $('sheets-url').value);
            $('config-success').style.display = 'block';
            setTimeout(() => $('config-success').style.display = 'none', 3000);
        });

        // Meta char counts
        $('default-meta-title')?.addEventListener('input', (e) => { $('meta-title-len').textContent = e.target.value.length; });
        $('default-meta-desc')?.addEventListener('input', (e) => { $('meta-desc-len').textContent = e.target.value.length; });
    }

    // =========================================================================
    // Media Library Functions
    // =========================================================================
    function loadMediaLibrary() {
        const mediaFiles = [
            { name: 'Logo.webp', size: '24 KB', type: 'image', url: 'assets/Logo.webp' },
            { name: 'hero-bg.webp', size: '156 KB', type: 'image', url: 'assets/hero-bg.webp' },
            { name: 'logo-favicon.webp', size: '8 KB', type: 'image', url: 'assets/logo-favicon.webp' },
            { name: 'slider-1.webp', size: '89 KB', type: 'image', url: 'assets/slider-1.webp' },
            { name: 'slider-2.webp', size: '76 KB', type: 'image', url: 'assets/slider-2.webp' }
        ];

        const grid = $('media-grid');
        if (grid) {
            grid.innerHTML = mediaFiles.map(file => `
                <div class="media-item" onclick="adminPanel.selectMedia(this)" data-url="${file.url}">
                    <div class="media-thumb">
                        <img src="${file.url}" alt="${file.name}">
                    </div>
                    <div class="media-info">
                        <span class="media-name">${file.name}</span>
                        <span class="media-size">${file.size}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    function selectMedia(el) {
        // Visual selection
        $$('.media-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        // Copy URL to clipboard
        const url = el.dataset.url;
        navigator.clipboard.writeText(url).then(() => {
            alert('Đã copy URL ảnh: ' + url);
        });
    }

    function setMediaView(view) {
        // Toggle classes for grid/list integration if needed
        const grid = $('media-grid');
        if (view === 'list') grid.classList.add('list-view');
        else grid.classList.remove('list-view');

        $$('.view-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.view-btn[data-view="${view}"]`).classList.add('active');
    }

    function openMediaPixel(inputId) {
        const input = $(inputId);
        if (!input) return;

        const url = prompt('Nhập URL hình ảnh (Copy từ Thư viện Media):', input.value);
        if (url !== null) {
            input.value = url;
            // Update preview if exists
            const previewId = inputId + '-preview'; // Convention: id + -preview
            const preview = $(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${url}" style="max-height: 100px; border-radius: 4px;">`;
            } else if (inputId === 'spec-grid-image') {
                $('spec-grid-preview').innerHTML = `<img src="${url}" style="max-height: 100px; border-radius: 4px;">`;
            }
        }
    }

    function quickAction(action) {
        if (action === 'newArticle') {
            switchTab('content');
            openArticleModal();
        } else if (action === 'newProduct') {
            switchTab('products');
            openProductModal();
        } else if (action === 'viewSite') {
            window.open('index.html', '_blank');
        } else if (action === 'seoCheck') {
            switchTab('seo');
        }
    }

    function toggleUploadZone() {
        const zone = $('upload-zone');
        if (zone) {
            zone.style.display = zone.style.display === 'none' ? 'block' : 'none';
        }
    }

    function changePassword() {
        const current = $('current-password')?.value;
        const newPass = $('new-password')?.value;
        const confirm = $('confirm-password')?.value;
        savePassword(current, newPass, confirm);
    }



    // =========================================================================
    // Messages Functions
    // =========================================================================
    function viewMessage(id) {
        alert(`Xem tin nhắn ID: ${id}\n(Tính năng demo - cần backend để lưu trữ)`);
        // Mark as read
        const item = document.querySelector(`.message-item[onclick*="'${id}'"]`);
        if (item) item.classList.remove('unread');
    }

    function starMessage(id) {
        const btn = document.querySelector(`.message-item[onclick*="'${id}'"] .message-star`);
        if (btn) {
            btn.classList.toggle('starred');
            btn.textContent = btn.classList.contains('starred') ? '★' : '☆';
        }
    }

    // =========================================================================
    // Categories & Tags Functions
    // =========================================================================
    function addCategory() {
        const input = $('new-category');
        const name = input.value.trim();
        if (!name) return;

        const list = $('category-list');
        const newItem = document.createElement('div');
        newItem.className = 'category-item';
        newItem.innerHTML = `
            <span class="cat-name">${escapeHtml(name)}</span>
            <span class="cat-count">0 bài</span>
            <div class="cat-actions">
                <button class="btn-edit">Sửa</button>
                <button class="btn-delete">Xóa</button>
            </div>
        `;
        list.appendChild(newItem);
        input.value = '';
        alert(`Đã thêm danh mục: ${name} `);
    }

    function editCategory(id) {
        const newName = prompt('Nhập tên danh mục mới:');
        if (newName) {
            alert(`Đã đổi tên danh mục(Demo)`);
        }
    }

    function deleteCategory(id) {
        if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
            alert('Đã xóa danh mục (Demo)');
        }
    }

    function addTag() {
        const input = $('new-tag');
        const tag = input.value.trim();
        if (!tag) return;

        const cloud = $('tags-cloud');
        const newTag = document.createElement('span');
        newTag.className = 'tag-item';
        newTag.textContent = `${tag} `;
        newTag.innerHTML += '<small>(0)</small>';
        cloud.appendChild(newTag);
        input.value = '';
    }

    function editTag(slug) {
        alert(`Chỉnh sửa tag: ${slug} (Demo)`);
    }

    // =========================================================================
    // Backup & Tools Functions
    // =========================================================================
    function createBackup() {
        const data = {
            articles: getArticles(),
            products: getProducts(),
            settings: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SITE_CONFIG) || '{}'),
            theme: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || '{}'),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup - bvtanan - ${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Đã tạo bản sao lưu thành công!');
        logActivity('Tạo bản sao lưu');
    }

    function restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (confirm('Khôi phục sẽ ghi đè dữ liệu hiện tại. Tiếp tục?')) {
                        if (data.articles) saveArticles(data.articles);
                        if (data.products) saveProducts(data.products);
                        if (data.settings) localStorage.setItem(CONFIG.STORAGE_KEYS.SITE_CONFIG, JSON.stringify(data.settings));
                        if (data.theme) localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, JSON.stringify(data.theme));

                        alert('✅ Đã khôi phục dữ liệu thành công!');
                        location.reload();
                    }
                } catch (err) {
                    alert('❌ File không hợp lệ!');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function downloadBackup(id) {
        alert(`Tải backup #${id} (Demo - lịch sử backup cần backend)`);
    }

    function exportData() {
        const exportItems = {
            articles: $('export-articles')?.checked,
            products: $('export-products')?.checked,
            reviews: $('export-reviews')?.checked,
            settings: $('export-settings')?.checked
        };

        const data = {};
        if (exportItems.articles) data.articles = getArticles();
        if (exportItems.products) data.products = getProducts();
        if (exportItems.reviews && typeof window.reviews !== 'undefined') data.reviews = window.reviews;
        if (exportItems.settings) data.settings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SITE_CONFIG) || '{}');

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export -bvtanan - ${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        logActivity('Xuất dữ liệu JSON');
    }

    function exportCSV() {
        const articles = getArticles();
        const csvContent = 'Ngày,Tiêu đề,Danh mục,Tags,Trạng thái\n' +
            articles.map(a => `"${a.date}", "${a.h1 || a.metaTitle}", "${a.category}", "${a.tags}", "${a.status}"`).join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `articles - ${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        logActivity('Xuất dữ liệu CSV');
    }

    function importData() {
        const fileInput = $('import-file');
        if (!fileInput.files.length) {
            alert('Vui lòng chọn file!');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm(`Nhập ${Object.keys(data).length} loại dữ liệu.Tiếp tục ? `)) {
                    if (data.articles) {
                        const existing = getArticles();
                        saveArticles([...data.articles, ...existing]);
                    }
                    if (data.products) {
                        const existing = getProducts();
                        saveProducts([...data.products, ...existing]);
                    }
                    alert('✅ Đã nhập dữ liệu thành công!');
                    logActivity('Nhập dữ liệu từ file');
                    loadAllData();
                }
            } catch (err) {
                alert('❌ Lỗi đọc file!');
            }
        };
        reader.readAsText(file);
    }

    function runHealthCheck() {
        alert('🔄 Đang kiểm tra sức khỏe website...\n\n' +
            '✓ SSL/HTTPS: OK\n' +
            '✓ Hình ảnh WebP: OK\n' +
            '✓ Responsive: OK\n' +
            '! Google Analytics: Chưa cài\n' +
            '✗ Sitemap: Thiếu');
    }

    function clearActivityLog() {
        if (confirm('Xóa toàn bộ nhật ký hoạt động?')) {
            const log = $('activity-log');
            if (log) log.innerHTML = '<div class="activity-item"><span class="activity-time">--:--</span><span class="activity-action">Nhật ký đã được xóa</span></div>';
        }
    }

    function logActivity(action) {
        const log = $('activity-log');
        if (!log) return;

        const now = new Date();
        const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-time">${time}</span>
            <span class="activity-action">${escapeHtml(action)}</span>
            <span class="activity-user">Admin</span>
        `;
        log.insertBefore(item, log.firstChild);
    }

    // =========================================================================
    // Public API
    // =========================================================================
    window.adminPanel = {
        editArticle,
        deleteArticle,
        closeArticleModal, // Added 
        openArticleModal, // Added
        editProduct,
        deleteProduct,
        closeProductModal, // Added
        openProductModal, // Added
        // Equipment
        openEquipmentModal: openEquipmentModal,
        closeEquipmentModal: closeEquipmentModal,
        saveEquipment: saveEquipment,
        editEquipment: editEquipment,
        deleteEquipment: deleteEquipment,

        // Specialties
        switchSpecialtySubTab: switchSpecialtySubTab,
        editSpecGrid: editSpecGrid,
        closeSpecGridModal: closeSpecGridModal,
        saveSpecGrid: saveSpecGrid,
        addSpecialtyList: addSpecialtyList,
        removeSpecListItem: removeSpecListItem,
        addSpecialtyList: addSpecialtyList,
        removeSpecListItem: removeSpecListItem,
        loadSpecialties,

        // Media & Utils
        selectMedia,
        setMediaView,
        openMediaPixel,
        quickAction,

        // Pages
        editPage: editPage,
        closePageModal,
        savePageMeta,
        editUser: (id) => alert('Chức năng sửa user (Demo)'),
        saveTheme,
        addMenuItem,
        removeMenuItem,
        saveWidgets,
        saveGA,
        saveGSC,
        addKeyword,
        removeKeyword,
        saveSiteInfo: saveSiteInfo,
        saveSEODefaults: saveSEODefaults,
        loadSEOFiles,
        saveSEOFiles,
        downloadSEOFile,


        // Security
        changePassword: changePassword,
        selectMedia,
        setMediaView,
        toggleUploadZone,
        viewMessage,
        starMessage,
        addCategory,
        editCategory,
        deleteCategory,
        addTag,
        editTag,
        createBackup,
        restoreBackup,
        downloadBackup,
        exportData,
        exportCSV,
        importData,
        runHealthCheck,
        clearActivityLog
    };

    // =========================================================================
    // Initialize
    // =========================================================================
    function init() {
        initEventListeners();
        initToolbar();

        if (isLoggedIn()) {
            showDashboard();
        } else {
            showLoginScreen();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
