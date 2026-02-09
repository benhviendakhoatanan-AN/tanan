const reviews = [
    { name: "nguyenminh_92", age: 32, loc: "Tp.HCM", content: "Dịch vụ ok, làm nhanh gọn lẹ. vote 5 sao" },
    { name: "Cô Bảy", age: 65, loc: "Chợ Gạo", content: "Bác sĩ mát tay, nội soi ko đau gì hết trơn. Cám ơn mấy cô y tá lo cho tui nha." },
    { name: "thanhha_le", age: 28, loc: "Tân An", content: "bv sạch sẽ, nv nhiệt tình. mình đi khám bhyt dc giảm giá cũng đỡ" },
    { name: "Bác Hùng", age: 58, loc: "Bến Lức", content: "Tôi bị đau dạ dày lâu năm, khám nhiều nơi không bớt. Đến đây bác sĩ cho thuốc uống 1 tuần thấy êm hẳn. Cảm ơn bác sĩ Thống." },
    { name: "bé mun", age: 22, loc: "Tân Trụ", content: "sợ nội soi muốn xỉu mà vô làm êm ru bà rù :))) ngủ 1 giấc dậy là xong" },
    { name: "Trần Văn T.", age: 45, loc: "Đức Hòa", content: "Quy trình khám bệnh khoa học, không phải chờ đợi quá lâu. Bác sĩ tư vấn rất kỹ." },
    { name: "Chị Lan", age: 40, loc: "Long An", content: "khám tổng quát ở đây yên tâm. máy móc xịn, kq có nhanh." },
    { name: "Hoàng Tuấn", age: 35, loc: "Gò Công", content: "Good service! Bệnh viện sạch đẹp như khách sạn." },
    { name: "Mẹ bỉm sữa", age: 29, loc: "Thủ Thừa", content: "đưa mẹ đi nội soi, trộm vía mẹ khen bác sĩ nhẹ nhàng. 10 điểm cho sự tận tâm" },
    { name: "Chú Ba", age: 72, loc: "Vĩnh Long", content: "Tui ở dưới quê lên đây khám, thấy nhân viên hướng dẫn tận tình lắm. Có xe đưa rước nữa nên tiện." },
    { name: "lethu_thuy", age: 33, loc: "Cần Giuộc", content: "giá hơi cao xíu so với bv công nhưng bù lại dịch vụ tốt, ko phải chen chúc. đáng đồng tiền bát gạo" },
    { name: "An An", age: 25, loc: "Tân Hưng", content: "bs đẹp trai, nói chuyện dễ thương xỉu 🥰" },
    { name: "Phạm Hữu Nghĩa", age: 50, loc: "Kiến Tường", content: "Nội soi không đau, tôi rất hài lòng." },
    { name: "cô út", age: 60, loc: "Mộc Hóa", content: "nghe đồn nội soi ghê lắm mà làm xong thấy bình thường. thuốc xổ hơi khó uống chút thôi." },
    { name: "minhkhoi123", age: 27, loc: "Q.7, HCM", content: "review cho ae nào sợ nội soi: nên chọn gói gây mê nha, ngủ bao ngon kkk" },
    { name: "Dì Năm", age: 63, loc: "Cần Đước", content: "Bệnh viện gì mà sạch bóng, đi vệ sinh cũng sạch. Ưng cái bụng." },
    { name: "Thành Đạt", age: 38, loc: "Tây Ninh", content: "Đã tầm soát ung thư tại đây, bác sĩ giải thích cặn kẽ từng chỉ số. Rất chuyên nghiệp." },
    { name: "hương giang", age: 31, loc: "Tân Thạnh", content: "ok lắm mọi người ơi, nên đi khám sớm để yên tâm." },
    { name: "Bác Tư Xebagac", age: 68, loc: "Thạnh Hóa", content: "lần đầu đi khám ở bv tư, mấy cháu bảo vệ dắt xe nhiệt tình. tốt." },
    { name: "Ngọc Hân", age: 26, loc: "Bình Chánh", content: "soi đại tràng phát hiện polyp cắt luôn. may mà đi khám kịp thời. hú hồn chim én" },
    { name: "Anh Nam", age: 42, loc: "Vĩnh Hưng", content: "Chất lượng 5 sao. Sẽ giới thiệu người nhà đến." },
    { name: "user8492xxx", age: 34, loc: "Long An", content: "dv ok" },
    { name: "Cô Chín", age: 55, loc: "Tiền Giang", content: "Bác sĩ nữ khám kỹ, nhẹ nhàng, tế nhị. mình rất ngại đi khám phụ khoa hay nội soi dưới nhưng ở đây thấy thoải mái." },
    { name: "Tuấn 'Còi'", age: 23, loc: "Tân An", content: "Lần sau sẽ ghé tiếp nếu có bệnh kkk" },
    { name: "Phương Thảo", age: 39, loc: "Đức Huệ", content: "Mọi thứ đều tốt, trừ việc máy lạnh hơi lạnh quá :(" },
    { name: "Lê Văn Luyện", age: 47, loc: "Châu Thành", content: "Tôi hài lòng với kết quả điều trị. Bác sĩ kê thuốc chuẩn." },
    { name: "Ut Men", age: 52, loc: "Đồng Tháp", content: "tuần nào cũng chở vợ lên đây tái khám. đường dễ đi, bv to đùng dễ kiếm." },
    { name: "Hạnh Nguyễn", age: 36, loc: "Tân An", content: "mới nội soi sáng nay, trưa về ăn cơm bình thường. công nghệ xịn sò thật" },
    { name: "Cu Bin", age: 20, loc: "Bến Lức", content: "đưa bà nội đi khám, nhân viên hỗ trợ xe lăn chu đáo. thank you bv" },
    { name: "Bác Sáu", age: 75, loc: "Cần Giuộc", content: "già rồi chỉ mong bác sĩ tận tâm, ở đây đáp ứng được điều đó. cảm ơn các bác." },
    { name: "vyvy_cute", age: 24, loc: "TP.HCM", content: "bv đẹp, checkin sống ảo được luôn nha haha" },
    { name: "Trương Minh", age: 41, loc: "Tân Trụ", content: "Thủ tục nhanh gọn, có khám BHYT thông tuyến nên chi phí rất rẻ." },
    { name: "Chị đẹp", age: 37, loc: "Đức Hòa", content: "ưng nhất khoản ko phải xếp hàng bóc số từ sáng sớm như bv công." },
    { name: "Hoivan_09", age: 44, loc: "Thủ Thừa", content: "bac si tu van nhiet tinh. ok." },
    { name: "Cô Mười", age: 66, loc: "Kiến Tường", content: "Sạch sẽ, mát mẻ. Đi khám bệnh mà như đi nghỉ dưỡng." },
    { name: "Quốc Bảo", age: 30, loc: "Tân Hưng", content: "Đã soi 2 lần ở đây. Uy tín." },
    { name: "ngocmai.tran", age: 29, loc: "Tân An", content: "ban đầu sợ nội soi lắm, nhưng làm xong thấy k đáng sợ như mình nghĩ. mn nên đi tầm soát nhé" },
    { name: "Chú Tám", age: 64, loc: "Mộc Hóa", content: "thuốc tốt, uống 3 ngày là thấy đỡ đau bao tử rồi." },
    { name: "Duy Khánh", age: 27, loc: "Vĩnh Hưng", content: "Fast service, good doctors." },
    { name: "Meo Meo", age: 22, loc: "Thạnh Hóa", content: "bs dặn dò kĩ lắm, về ăn uống kiêng khem theo là khỏe re." },
    { name: "Anh Đức", age: 49, loc: "Tân Thạnh", content: "Cám ơn đội ngũ y bác sĩ đã tận tình cứu chữa." },
    { name: "thuytien_90", age: 35, loc: "TP.HCM", content: "từ sài gòn xuống đây khám cũng tiện, có xe trung chuyển." },
    { name: "Cô Ba", age: 59, loc: "Cần Đước", content: "bác sĩ giỏi, mát tay. tôi nội soi cắt polyp xong khỏe re." },
    { name: "Minh Thuận", age: 43, loc: "Đồng Tháp", content: "Dịch vụ chuẩn, không có gì để chê." },
    { name: "hai_lúa_mkt", age: 28, loc: "Đức Huệ", content: "thấy facebook quảng cáo nên ghé thử, ai ngờ ok phết." },
    { name: "Chị Hồng", age: 51, loc: "Châu Thành", content: "Tôi rất tin tưởng bệnh viện này. Cả nhà tôi đều khám ở đây." },
    { name: "nam.nguyen", age: 32, loc: "Tân An", content: "soi dạ dày êm, ko buồn nôn." },
    { name: "Bác Hai Lúa", age: 73, loc: "Long An", content: "cám ơn bác sĩ." },
    { name: "lananh_88", age: 34, loc: "Bến Lức", content: "tuyệt vời ông mặt trời :))" },
    { name: "Thanh Tùng", age: 46, loc: "Tiền Giang", content: "Sẽ ủng hộ bệnh viện dài dài." }
];

// Helper to determine category based on content keywords
function getReviewCategory(content) {
    const text = content.toLowerCase();
    if (text.includes('dạ dày') || text.includes('bao tử') || text.includes('hp')) return 'daday';
    if (text.includes('đại tràng') || text.includes('polyp') || text.includes('thuốc xổ')) return 'daitrang';
    return 'dichvu'; // Default / Service / Doctors
}

// Group reviews
reviews.forEach(r => {
    r.category = getReviewCategory(r.content);
});

let currentFilter = 'all';
let filteredReviews = [];
let slideInterval;
let currentSlide = 0;
const ITEMS_PER_SLIDE = 4; // 4 columns * 1 row

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonial-container');
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    const loadMoreContainer = document.querySelector('.load-more-container');

    if (!container) return;

    // Remove Load More button if exists
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';

    // Initial render
    filterReviews('all');

    // Filter Click Handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter
            const filter = btn.getAttribute('data-filter');
            filterReviews(filter);
        });
    });

    function filterReviews(filter) {
        currentFilter = filter;
        if (filter === 'all') {
            filteredReviews = reviews;
        } else {
            filteredReviews = reviews.filter(r => r.category === filter);
        }

        // Reset slide
        currentSlide = 0;
        renderReviewSlider();
    }

    function renderReviewSlider() {
        // Clear container
        container.innerHTML = '';
        clearInterval(slideInterval);

        // Calculate slides needed
        const totalSlides = Math.ceil(filteredReviews.length / ITEMS_PER_SLIDE);

        // Create Slider Structure
        const slider = document.createElement('div');
        slider.className = 'reasons-slider'; // Reuse styles from 8 Reasons

        const track = document.createElement('div');
        track.className = 'reasons-track';
        track.id = 'reviewsTrack';
        track.style.transition = 'transform 0.5s ease-in-out';

        // create slides
        for (let i = 0; i < totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'reasons-slide';

            const grid = document.createElement('div');
            grid.className = 'review-grid'; // Use review-grid style
            grid.style.margin = '0'; // align inside slide
            // CSS handles the grid layout (4 columns)

            const start = i * ITEMS_PER_SLIDE;
            const end = start + ITEMS_PER_SLIDE;
            const chunk = filteredReviews.slice(start, end);

            chunk.forEach(review => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                const initial = review.name.split(' ').pop().charAt(0);

                card.innerHTML = `
                    <div class="testi-header">
                        <div class="testi-avatar">${initial}</div>
                        <div class="testi-info">
                            <h4>${review.name} (${review.age} tuổi)</h4>
                            <span>${review.loc}</span>
                        </div>
                    </div>
                    <div class="testi-rating">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                    <p class="testi-content">"${review.content}"</p>
                `;
                grid.appendChild(card);
            });

            slide.appendChild(grid);
            track.appendChild(slide);
        }

        slider.appendChild(track);

        // Create Dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'reasons-dots';

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `reason-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => moveReviewSlide(i);
            dotsContainer.appendChild(dot);
        }

        slider.appendChild(dotsContainer);
        container.appendChild(slider);

        // Auto play
        startAutoSlide(totalSlides);
    }

    // Expose function to global scope for onclick or direct call
    window.moveReviewSlide = function (slideIndex) {
        const track = document.getElementById('reviewsTrack');
        const dots = document.querySelectorAll('.reasons-dots .reason-dot:not([onclick*="moveSlide("])'); // avoid selecting reason dots from the other slider if classes overlap, actually here we inserted them into .reasons-dots container which is inside #testimonial-container probably? No, we created a new slider div.
        // Wait, querySelectorAll('.reasons-dots .reason-dot') will select dots from BOTH sliders if we use the same class names globally.
        // We should target dots specific to this slider.
        // The dots are inside the slider we created.
        // But here inside global function, how do we find *this* specific slider's dots?
        // We can look for dots inside the slider that contains 'reviewsTrack'.

        if (!track) return;

        currentSlide = slideIndex;
        track.style.transform = `translateX(-${slideIndex * 100}%)`;

        // Update dots. We need to find the dots that correspond to the review slider.
        // The dot container is a sibling of the track in our generated HTML.
        const sliderContainer = track.parentElement;
        const reviewDots = sliderContainer.querySelectorAll('.reason-dot');

        reviewDots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Reset timer
        clearInterval(slideInterval);
        const totalSlides = Math.ceil(filteredReviews.length / ITEMS_PER_SLIDE);
        startAutoSlide(totalSlides);
    }

    function startAutoSlide(total) {
        if (total <= 1) return;
        slideInterval = setInterval(() => {
            let next = (currentSlide + 1) % total;
            moveReviewSlide(next);
        }, 5000);
    }
});
