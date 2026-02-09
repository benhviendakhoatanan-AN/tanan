/**
 * Main JavaScript for BV Tan An Landing Page
 */

// =========================================================================
// Configuration
// =========================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFipVnIIL7D1qZkVw5nsOWUrb15Moo0YohjbFcRuXaawSeOFsHkbcsV-9FtHAIzkYW/exec';

// =========================================================================
// Mobile Menu Toggle
// =========================================================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active'); // Optional: for animation
    });
}

// Close menu when clicking a link (mobile)
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// =========================================================================
// Dropdown Menu Logic (Desktop & Mobile)
// =========================================================================
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');

    // Mobile: Click to toggle
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });

    // Desktop: Hover is handled by CSS, but we can add JS for better touch support if needed
});


// =========================================================================
// Sticky Header
// =========================================================================
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =========================================================================
// Smooth Scrolling for Anchor Links
// =========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();

            // Account for fixed header height
            const headerHeight = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// =========================================================================
// Google Sheets Form Handling
// =========================================================================
const formsToHandle = [
    'consultation-form',    // Home page consultation
    'contact-booking-form', // Contact page booking
    'newsletter-form'       // Footer newsletter
];

function handleFormSubmission(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Button Loading State
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Đang gửi...';
        btn.disabled = true;

        // Check if URL is configured
        if (typeof GOOGLE_SCRIPT_URL === 'undefined' || GOOGLE_SCRIPT_URL === 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE' || GOOGLE_SCRIPT_URL === '') {
            console.warn("Google Script URL chưa được dán vào script.js");
            setTimeout(() => {
                alert('Cảm ơn bạn đã đăng ký! (Chế độ mô phỏng - Chưa kết nối Google Sheet)');
                form.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1000);
            return;
        }

        // Transform FormData
        const data = new URLSearchParams();
        const formData = new FormData(form);

        // Add 'action' for GAS router
        data.append('action', 'submitForm');

        // Add 'form_source' to identify source
        data.append('form_source', formId);

        // Append all fields
        for (const pair of formData) {
            if (pair[0]) {
                data.append(pair[0], pair[1]);
            }
        }

        // Send Data to Google Sheet
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // IMPORTANT: Bypasses CORS errors
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
            .then(() => {
                console.log(`Form ${formId} sent to Google Sheets`);
                alert('Đăng ký thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline.');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
    });
}

// Initialize all forms
formsToHandle.forEach(id => handleFormSubmission(id));

// =========================================================================
// Admin/User Convenience (Optional)
// =========================================================================
// If user has not pasted URL, log instructions
if (GOOGLE_SCRIPT_URL === 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE') {
    console.info('%c SETUP REQUIRED: ', 'background: #222; color: #bada55; font-size: 14px');
    console.info('Vui lòng dán Web App URL vào file script.js tại dòng 7.');
}

/* Hero Slider Logic */
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.slider-dots .slider-dot');
const TOTAL_HERO_SLIDES = 3;
let heroInterval;

function initHeroSlider() {
    if (heroSlides.length === 0) return;

    // Auto play
    startHeroAutoPlay();
}

function goToHeroSlide(index) {
    if (!heroSlides.length) return;

    // Remove active class from current
    heroSlides[currentHeroSlide].classList.remove('active');
    if (heroDots[currentHeroSlide]) heroDots[currentHeroSlide].classList.remove('active');

    // Update index
    currentHeroSlide = index;

    // Add active class to new
    heroSlides[currentHeroSlide].classList.add('active');
    if (heroDots[currentHeroSlide]) heroDots[currentHeroSlide].classList.add('active');

    // Reset timer
    clearInterval(heroInterval);
    startHeroAutoPlay();
}

function startHeroAutoPlay() {
    heroInterval = setInterval(() => {
        let next = (currentHeroSlide + 1) % TOTAL_HERO_SLIDES;
        goToHeroSlide(next);
    }, 5000); // 5 seconds
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initHeroSlider);


// =========================================================================
// Packages Slider
// =========================================================================
let currentPackageSlide = 0;
let packageInterval;

function goToPackageSlide(index) {
    const slides = document.querySelectorAll('.packages-slide');
    const dots = document.querySelectorAll('.package-dot');

    if (slides.length === 0) return;

    currentPackageSlide = index;

    // Update slides
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    // Update dots
    dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    // Reset autoplay
    clearInterval(packageInterval);
    startPackageAutoPlay();
}

function startPackageAutoPlay() {
    const slides = document.querySelectorAll('.packages-slide');
    if (slides.length === 0) return;

    packageInterval = setInterval(() => {
        let next = (currentPackageSlide + 1) % slides.length;
        goToPackageSlide(next);
    }, 5000);
}

// Initialize packages slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.packages-slide');
    if (slides.length > 0) {
        startPackageAutoPlay();
    }
});

// =========================================================================
// Equipment Slider (New)
// =========================================================================
let currentEqSlide = 0;
let eqInterval;

function goToEquipmentSlide(index) {
    const slides = document.querySelectorAll('.equipment-slide');
    const dots = document.querySelectorAll('.eq-dot');

    if (slides.length === 0) return;

    // Wrap around index if out of bounds
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentEqSlide = index;

    // Update Active Slide
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentEqSlide].classList.add('active');

    // Update Active Dot
    dots.forEach((dot, i) => {
        if (i === currentEqSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    // Reset Timer
    clearInterval(eqInterval);
    startEquipmentAutoPlay();
}

function startEquipmentAutoPlay() {
    const slides = document.querySelectorAll('.equipment-slide');
    if (slides.length === 0) return;

    eqInterval = setInterval(() => {
        let next = currentEqSlide + 1;
        goToEquipmentSlide(next);
    }, 4000); // 4 seconds per slide
}

// Init Equipment Slider
document.addEventListener('DOMContentLoaded', () => {
    // Check if equipment slider exists
    if (document.querySelector('.equipment-slider-wrapper')) {
        startEquipmentAutoPlay();
    }
});

// =========================================================================
// Back to Top Button Logic
// =========================================================================
document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.querySelector('.btn-back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// =========================================================================
// Healthcare Resources Slider
// =========================================================================
function initResourceSlider() {
    const slider = document.querySelector('.resources-slider');
    if (!slider) return;

    const cards = document.querySelectorAll('.resource-card');
    const prevBtn = document.querySelector('.res-nav-btn.prev');
    const nextBtn = document.querySelector('.res-nav-btn.next');

    if (!cards.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    // Calculate items per row based on screen width
    function getItemsVisible() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 992) return 3;
        return 4;
    }

    function updateSliderPosition() {
        const itemsVisible = getItemsVisible();

        // Use the card width including gap from computed style/layout
        // Gap is set via margin-right: 20px on .resource-card
        const cardWidthWithGap = cards[0].offsetWidth + 20;

        slider.style.transform = `translateX(-${currentIndex * cardWidthWithGap}px)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalCards - itemsVisible;

        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        const itemsVisible = getItemsVisible();
        if (currentIndex < totalCards - itemsVisible) {
            currentIndex++;
            updateSliderPosition();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });

    // Resize observer to reset or adjust
    window.addEventListener('resize', () => {
        currentIndex = 0; // Reset to start on resize to prevent alignment issues
        updateSliderPosition();
    });

    // Initial call
    updateSliderPosition();
}

// =========================================================================
// Featured Services Slider
// =========================================================================
function initFeaturedSlider() {
    const slider = document.querySelector('.featured-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.featured-slide');
    const prevBtn = document.querySelector('.feat-nav-btn.prev');
    const nextBtn = document.querySelector('.feat-nav-btn.next');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function getItemsVisible() {
        if (window.innerWidth <= 768) return 1;
        return 2;
    }

    function updateSliderPosition() {
        const itemsVisible = getItemsVisible();
        // Use slide width + gap
        const slideWidth = slides[0].offsetWidth + 20; // 20px gap

        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - itemsVisible;
    }

    nextBtn.addEventListener('click', () => {
        const itemsVisible = getItemsVisible();
        if (currentIndex < totalSlides - itemsVisible) {
            currentIndex++;
            updateSliderPosition();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSliderPosition();
    });

    updateSliderPosition();
}

document.addEventListener('DOMContentLoaded', () => {
    initResourceSlider();
    initFeaturedSlider();
});


// =========================================================================
// Service Details Modal Logic
// =========================================================================
const serviceData = {
    "digestive": {
        title: "Nội - Ngoại Tiêu Hóa",
        icon: "fa-procedures",
        description: "Chuyên khoa Tiêu hóa cung cấp dịch vụ thăm khám, chẩn đoán và điều trị các bệnh lý về đường tiêu hóa (thực quản, dạ dày, ruột), gan, mật và tụy. Chúng tôi áp dụng các phương pháp điều trị tiên tiến, phẫu thuật nội soi ít xâm lấn giúp bệnh nhân phục hồi nhanh chóng."
    },
    "cardiology": {
        title: "Tim Mạch",
        icon: "fa-heartbeat",
        description: "Khoa Tim mạch được trang bị hệ thống máy móc hiện đại hỗ trợ tầm soát, chẩn đoán và điều trị các bệnh lý tim mạch như: tăng huyết áp, bệnh mạch vành, rối loạn nhịp tim, suy tim. Đội ngũ bác sĩ giàu kinh nghiệm luôn túc trực để xử lý các tình huống cấp cứu tim mạch kịp thời."
    },
    "stroke": {
        title: "Tầm Soát Đột Quỵ",
        icon: "fa-brain",
        description: "Gói tầm soát đột quỵ giúp phát hiện sớm các yếu tố nguy cơ như hẹp mạch máu não, phình mạch não, rối loạn mỡ máu. Việc tầm soát định kỳ đặc biệt quan trọng với người trung niên, người có tiền sử bệnh nền để phòng ngừa biến chứng nguy hiểm."
    },
    "cancer": {
        title: "Tầm Soát Ung Thư",
        icon: "fa-dna",
        description: "Cung cấp các gói tầm soát ung thư toàn diện và chuyên sâu (ung thư gan, phổi, dạ dày, đại trực tràng, vú, cổ tử cung...). Công nghệ chẩn đoán hình ảnh và xét nghiệm marker ung thư hiện đại giúp phát hiện bệnh ở giai đoạn sớm nhất, tăng tỷ lệ điều trị thành công."
    },
    "endoscopy": {
        title: "Nội Soi Tiêu Hóa",
        icon: "fa-camera-retro",
        description: "Hệ thống nội soi tiêu hóa độ phân giải cao (NBI) giúp phát hiện sớm ung thư thực quản, dạ dày, đại tràng. Quy trình nội soi êm ái, không đau, đảm bảo an toàn và thoải mái tối đa cho người bệnh."
    },
    "obgyn": {
        title: "Sản - Phụ Khoa",
        icon: "fa-baby",
        description: "Khoa Sản - Phụ khoa cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ: khám thai, sinh con trọn gói, điều trị các bệnh phụ khoa. Môi trường sinh nở an toàn, thân thiện cùng đội ngũ hộ sinh tận tâm."
    },
    "pediatrics": {
        title: "Nội Ngoại Nhi",
        icon: "fa-child",
        description: "Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến vị thành niên. Khám và điều trị các bệnh lý hô hấp, tiêu hóa, dinh dưỡng... Khu vực khám bệnh được thiết kế sinh động, giúp trẻ giảm bớt lo lắng khi đi khám."
    },
    "imaging": {
        title: "Chẩn Đoán Hình Ảnh",
        icon: "fa-x-ray",
        description: "Trung tâm chẩn đoán hình ảnh trang bị máy MRI 1.5 Tesla, CT Scanner 128 lát cắt, X-quang kỹ thuật số, siêu âm 4D... Hỗ trợ các bác sĩ lâm sàng chẩn đoán chính xác và đưa ra phác đồ điều trị hiệu quả."
    },
    "laboratory": {
        title: "Xét Nghiệm",
        icon: "fa-flask",
        description: "Trung tâm xét nghiệm đạt chuẩn an toàn sinh học, thực hiện đa dạng các loại xét nghiệm huyết học, sinh hóa, miễn dịch, vi sinh... Kết quả xét nghiệm nhanh chóng, chính xác, được quản lý bằng hệ thống phần mềm hiện đại."
    },
    "vaccination": {
        title: "Trung Tâm Tiêm Chủng",
        icon: "fa-syringe",
        description: "Cung cấp đầy đủ các loại vắc xin cho trẻ em và người lớn. Quy trình tiêm chủng an toàn, khám sàng lọc kỹ càng, theo dõi sau tiêm chặt chẽ. Hệ thống dây chuyền lạnh bảo quản vắc xin đạt chuẩn GSP."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('service-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalIcon = document.getElementById('modal-icon');
    const closeBtn = document.querySelector('.close-modal');
    // Using event delegation or direct selection? Direct selection is fine as items are static.
    const serviceItems = document.querySelectorAll('.center-item');

    // Open Modal
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceId = item.getAttribute('data-service-id');
            const data = serviceData[serviceId];

            if (data) {
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.description;
                // Update icon
                if (data.icon) {
                    modalIcon.className = 'fas ' + data.icon;
                }

                modal.classList.add('show');
                modal.style.display = 'flex';
            }
        });
    });

    // Close Modal Logic
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
