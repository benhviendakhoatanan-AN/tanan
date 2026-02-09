/**
 * Language Switcher - Dynamic multilingual support
 * Supports: Vietnamese (vi), English (en), Khmer (km)
 */

(function () {
    'use strict';

    const SUPPORTED_LANGS = ['vi', 'en', 'km'];
    const DEFAULT_LANG = 'vi';
    const STORAGE_KEY = 'preferred_language';

    // Comprehensive Translations
    const TRANSLATIONS = {
        vi: {
            common: {
                emergency: "CẤP CỨU",
                hotline: "HOTLINE",
                booking: "ĐẶT LỊCH",
                hospitalName: "BỆNH VIỆN ĐA KHOA QUỐC TẾ TÂN AN",
                workingHours: "Giờ làm việc: Thứ 2 - Chủ Nhật: 7:30 - 17:00",
                workingHoursCompact: "7:30 - 17:00 (T2 - CN)",
                address: "Số 136C Tỉnh lộ 827, Phường Tân An, Tây Ninh (Long An cũ)",
                viewAll: "XEM TẤT CẢ",
                viewAllServices: "XEM TẤT CẢ DỊCH VỤ",
                viewDetails: "XEM CHI TIẾT",
                contactNow: "LIÊN HỆ NGAY",
                needAdvice: "BẠN CẦN TƯ VẤN?",
                contactSupport: "Liên hệ để được hỗ trợ"
            },
            nav: {
                home: "TRANG CHỦ",
                about: "GIỚI THIỆU CHUNG",
                endoscopy: "NỘI SOI TIÊU HOÁ",
                services: "DỊCH VỤ Y KHOA",
                news: "TIN TỨC",
                contact: "LIÊN HỆ"
            },
            lang: {
                vietnamese: "TIẾNG VIỆT",
                english: "ENGLISH",
                khmer: "KHMER"
            },
            dropdown: {
                emergency: "Cấp Cứu 24/7",
                checkup: "Khám Tổng Quát",
                endoscopy: "Nội Soi Tiêu Hóa",
                obgyn: "Khoa Sản - Phụ Khoa",
                pediatric: "Khoa Nhi",
                cardiology: "Tim Mạch",
                orthopedic: "Cơ Xương Khớp",
                imaging: "Chẩn Đoán Hình Ảnh"
            },
            hero: {
                slide1Title: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN",
                slide1Text: "Bệnh viện Đa khoa Quốc tế Tân An cam kết mang đến dịch vụ y tế chuẩn mực quốc tế với sự tận tâm và chuyên nghiệp hàng đầu.",
                slide1Btn: "GÓI KHÁM SỨC KHỎE",
                slide2Title: "NỘI SOI TIÊU HÓA KHÔNG ĐAU",
                slide2Text: "Công nghệ NBI phóng đại hiện đại, phát hiện sớm ung thư thực quản, dạ dày, đại tràng.",
                slide2Btn: "TÌM HIỂU NGAY",
                slide3Title: "SIÊU ÂM TIM THAI CHUYÊN SÂU",
                slide3Text: "Tầm soát dị tật tim bẩm sinh cho bé yêu ngay từ trong bụng mẹ với chuyên gia tim mạch hàng đầu.",
                slide3Btn: "ĐĂNG KÝ TƯ VẤN"
            },
            about: {
                heroTitle: "KIẾN TẠO NỀN Y TẾ CHẤT LƯỢNG CAO",
                heroText: "Bệnh viện Đa khoa Quốc tế Tân An - Tiên phong mô hình xã hội hóa y tế, mang dịch vụ chuẩn mực quốc tế đến với cộng đồng.",
                title: "VỀ CHÚNG TÔI",
                desc1: "Khởi nguồn từ Tập đoàn TWG, Bệnh viện Đa khoa Quốc tế Tân An là minh chứng cho sứ mệnh \"Con đường đi đến thành công bằng sự tử tế\". Chúng tôi tự hào là đơn vị tiên phong thực hiện Nghị quyết số 23 của Chính phủ về xã hội hóa y tế.",
                desc2: "Với tiền thân là sự hợp tác công tư tại chuyên khoa Sản - Nhi, đến nay chúng tôi đã chuyển mình mạnh mẽ trở thành Bệnh viện Đa khoa hiện đại, cung cấp dịch vụ y tế toàn diện với chi phí hợp lý cho người dân Long An và các tỉnh lân cận.",
                statBeds: "Giường bệnh",
                statYears: "Năm hình thành",
                statVisits: "Lượt khám/năm",
                visionTitle: "TẦM NHÌN & GIÁ TRỊ CỐT LÕI",
                visionSub: "Tầm Nhìn",
                visionText: "Trở thành hệ thống y tế đa khoa kỹ thuật cao, uy tín hàng đầu, mang lại nền tảng sức khỏe bền vững cho cộng đồng.",
                missionSub: "Sứ Mệnh",
                missionText: "Thiết lập chuẩn mực chất lượng mới, kết hợp y đức và công nghệ để phục vụ đại đa số người dân Việt Nam.",
                philosophySub: "Triết Lý",
                philosophyText: "\"Con đường đi đến thành công bằng sự tử tế\" - Đặt lợi ích và sức khỏe của người bệnh lên trên hết.",
                historyTitle: "HÀNH TRÌNH PHÁT TRIỂN",
                achievementsTitle: "DẤU ẤN NỔI BẬT"
            },
            quickActions: {
                findDoctor: "TÌM BÁC SĨ",
                findDoctorDesc: "Đội ngũ chuyên gia",
                bookAppt: "ĐẶT HẸN KHÁM",
                bookApptDesc: "Nhanh chóng & Tiện lợi",
                medicalServices: "DỊCH VỤ Y KHOA",
                medicalServicesDesc: "Đa khoa toàn diện",
                healthPackages: "GÓI KHÁM SỨC KHỎE",
                healthPackagesDesc: "Cá nhân & Doanh nghiệp",
                insurance: "BẢO HIỂM Y TẾ",
                insuranceDesc: "Thanh toán trực tiếp"
            },
            featured: {
                title: "CÁC DỊCH VỤ NỔI BẬT"
            },
            resources: {
                title: "Tài Liệu Chăm Sóc Sức Khỏe",
                desc: "Nguồn thông tin tham khảo về các bệnh lý và hướng dẫn chăm sóc sức khỏe đáng tin cậy do các chuyên gia biên soạn"
            },
            services: {
                title: "DỊCH VỤ Y KHOA",
                digestive: "Nội - Ngoại Tiêu Hóa",
                cardiology: "Tim Mạch",
                stroke: "Tầm Soát Đột Quỵ",
                cancer: "Tầm Soát Ung Thư",
                endoscopy: "Nội Soi Tiêu Hóa",
                obgyn: "Sản - Phụ Khoa",
                pediatrics: "Nội Ngoại Nhi",
                imaging: "Chẩn Đoán Hình Ảnh"
            },
            specialties: {
                internal: {
                    title: "Các Chuyên Khoa Nội",
                    obgyn: "Khoa Sản phụ khoa",
                    pediatrics: "Khoa Nội Nhi và Nhi sơ sinh",
                    internalMed: "Khoa Nội",
                    respiratory: "Khoa Nội Hô hấp & Phổi",
                    endocrine: "Khoa Nội Tiết & Tiểu Đường",
                    orthopedics: "Khoa Nôi Cơ Xương Khớp",
                    nephrology: "Khoa Nội Thận",
                    general: "Khoa Nội Tổng Quát",
                    cardiology: "Khoa Nội Tim mạch",
                    digestive: "Khoa Nội Tiêu hoá",
                    digestiveHepatology: "Chuyên Khoa Tiêu Hóa & Gan Mật",
                    traditionalMed: "Khoa Y Học Cổ Truyền",
                    anesthesiology: "Khoa Gây Mê Hồi Sức"
                },
                surgical: {
                    title: "Các Chuyên Khoa Ngoại",
                    generalSurg: "Khoa Ngoại Tổng Quát",
                    orthopedicsSurg: "Khoa Chấn Thương Chỉnh Hình",
                    urology: "Khoa Tiết Niệu",
                    ent: "Khoa Tai Mũi Họng",
                    ophthalmology: "Khoa Mắt và Phẫu thuật khúc xạ",
                    dental: "Khoa Răng Hàm Mặt"
                },
                support: {
                    title: "Các Khoa CLS & Hỗ Trợ",
                    imaging: "Khoa Chẩn Đoán Hình Ảnh",
                    laboratory: "Khoa Xét Nghiệm & Ngân Hàng Máu",
                    physiotherapy: "Khoa Vật Lý Trị Liệu Và Phục Hồi Chức Năng"
                },
                centers: {
                    title: "Trung Tâm & Dịch Vụ Khác",
                    vaccination: "Trung tâm Tiêm chủng",
                    healthCheckProg: "Chương Trình Kiểm Tra Sức Khỏe",
                    screeningProg: "Chương Trình Tầm Soát",
                    sportsHealth: "Đánh giá sức khỏe trước khi tham gia thể thao",
                    corpCheckup: "Khám sức khoẻ Doanh nghiệp",
                    schoolCheckup: "Khám sức khoẻ học đường, bổ sung hồ sơ việc làm",
                    occupationalHealth: "Khám sức khoẻ lái xe, bệnh nghề nghiệp"
                }
            },
            equipment: {
                title: "TRANG THIẾT BỊ Y TẾ HIỆN ĐẠI",
                subtitle: "Công nghệ chẩn đoán hình ảnh tiên tiến",
                description: "Bệnh viện Đa khoa Tân An trang bị hệ thống máy móc hiện đại bậc nhất, ứng dụng trí tuệ nhân tạo (AI) trong chẩn đoán và điều trị.",
                mriTitle: "Hệ thống MRI 1.5 Tesla",
                mriDesc: "Hình ảnh sắc nét, giảm tiếng ồn, thời gian chụp nhanh.",
                ctTitle: "CT Scanner 128 lát cắt",
                ctDesc: "Tầm soát ung thư và bệnh lý tim mạch với độ chính xác cao.",
                aiTitle: "Ứng dụng AI (Trí tuệ nhân tạo)",
                aiDesc: "Phân tích dữ liệu hình ảnh, hỗ trợ bác sĩ chẩn đoán chính xác đến 99%.",
                nbiTitle: "Nội soi NBI phóng đại",
                nbiDesc: "Phát hiện ung thư đường tiêu hóa ở giai đoạn rất sớm.",
                slideNBICaption: "Hệ thống Nội soi NBI hiện đại",
                slideAICaption: "Trung tâm Chẩn đoán AI",
                slideMRICaption: "Hệ thống MRI 1.5 Tesla từ Philips tích hợp AI trong chẩn đoán hình ảnh",
                slideLabCaption: "Hệ thống Xét nghiệm Tự động Hóa",
                slideLabIntlCaption: "Trung tâm Xét nghiệm Tiêu chuẩn Quốc tế",
                slideRobotCaption: "Hệ thống Robot Vận chuyển Mẫu Tự động",
                slideFetalCaption: "Máy siêu âm tim bào thai hiện đại nhất của GE",
                slide5DCaption: "Hệ thống siêu âm 5D chẩn đoán dị tật thai nhi tích hợp AI"
            },
            packages: {
                title: "GÓI KHÁM SỨC KHỎE",
                badgeRecommended: "KHUYÊN DÙNG",
                badgePopular: "PHỔ BIẾN",
                badgeMale: "DÀNH CHO NAM",
                badgeFemale: "DÀNH CHO NỮ",
                endoscopyGastricTitle: "NỘI SOI DẠ DÀY",
                endoscopyGastricDesc: "Người đau bụng, ợ chua, khó tiêu",
                endoscopyColonTitle: "NỘI SOI ĐẠI TRÀNG",
                endoscopyColonDesc: "Người ≥45 tuổi, rối loạn tiêu hóa",
                screeningGastricTitle: "TẦM SOÁT UNG THƯ DẠ DÀY",
                screeningGastricDesc: "Người ≥45 tuổi, tiền sử gia đình",
                vipTitle: "GÓI TẦM SOÁT VIP",
                vipDesc: "Chăm sóc đẳng cấp 5 sao",
                basicTitle: "GÓI CƠ BẢN",
                basicDesc: "Dành cho người dưới 40 tuổi",
                advancedTitle: "GÓI NÂNG CAO",
                advancedDesc: "Cho người trên 40 tuổi",
                maleTitle: "TẦM SOÁT CHUYÊN SÂU NAM",
                maleDesc: "Toàn diện dành cho Nam giới",
                femaleTitle: "TẦM SOÁT CHUYÊN SÂU NỮ",
                femaleDesc: "Toàn diện dành cho Phụ nữ",
                featureConsult: "Khám với bác sĩ chuyên khoa",
                featureConsultExpert: "Khám và tư vấn chuyên khoa",
                featureNBI: "Nội soi NBI phóng đại",
                featureHP: "Test vi khuẩn HP",
                featureResult: "Trả kết quả & tư vấn",
                featureEntireColon: "Nội soi toàn bộ đại trực tràng",
                featurePolypScreening: "Tầm soát Polyp & Ung thư",
                featureCleanBowel: "Thuốc làm sạch ruột",
                featureGeneralInternal: "Khám Nội tổng quát",
                featureBloodTest: "Xét nghiệm máu (15 chỉ số)",
                featureAbdominalUltrasound: "Siêu âm ổ bụng tổng quát",
                featureChestECG: "X-Quang ngực + Điện tim ECG",
                featureBasicPlus: "Tất cả danh mục gói cơ bản",
                featureBiopsy: "Sinh thiết tế bào (nếu có tổn thương)",
                featurePathology: "Giải phẫu bệnh chuyên sâu",
                featureCancerMarkers: "Tầm soát dấu ấn ung thư",
                featureGastricEndoscopyAnes: "Nội soi Dạ dày (gây mê)",
                featureThyroidUltrasound: "Siêu âm tuyến giáp + tim",
                featureBloodUrine: "Xét nghiệm máu + Nước tiểu",
                featureFullUltrasound: "Siêu âm ổ bụng + Tim + Tuyến giáp",
                featureBothEndoscopy: "Nội soi Dạ dày + Đại tràng",
                featureWomensUltrasound: "Siêu âm vú + Phụ khoa",
                featurePapSmear: "Xét nghiệm Pap smear",
                featureAdvancedPlus: "Gói Nâng cao đầy đủ",
                featureColonoscopy: "Nội soi đại tràng (gây mê)",
                featureMRI: "Chụp MRI Não / Cột sống",
                featureVIPCare: "Chăm sóc VIP riêng biệt"
            },
            endoscopy: {
                heroTitle: "NỘI SOI TIÊU HÓA KHÔNG ĐAU",
                heroText: "Hệ thống nội soi Olympus CV-190 tích hợp công nghệ NBI phóng đại, giúp phát hiện sớm ung thư đường tiêu hóa dù là nhỏ nhất.",
                whyTitle: "TẠI SAO CHỌN NỘI SOI TẠI BV TÂN AN?",
                featurePainless: "Nội soi không đau (gây mê an toàn)",
                featurePainlessDesc: "Giúp người bệnh ngủ nhẹ nhàng, không có cảm giác khó chịu hay ám ảnh.",
                featureNBI: "Công nghệ NBI phóng đại",
                featureNBIDesc: "Nhuộm màu mô ảo, phát hiện sớm các tổn thương tiền ung thư.",
                featureExpert: "Đội ngũ chuyên gia giàu kinh nghiệm",
                featureExpertDesc: "Bác sĩ tu nghiệp tại các bệnh viện lớn, thao tác chính xác, nhẹ nhàng.",
                featureSterile: "Quy trình tiệt khuẩn chuẩn quốc tế",
                featureSterileDesc: "Đảm bảo an toàn tuyệt đối, phòng tránh lây nhiễm chéo.",
                procedureTitle: "QUY TRÌNH NỘI SOI AN TOÀN",
                packageTitle: "CÁC GÓI NỘI SOI TIÊU BIỂU",
                pricingTitle: "CHI PHÍ MINH BẠCH",
                statSatisfied: "Khách hàng hài lòng",
                statPainless: "Không đau - Êm ái",
                statDetection: "Phát hiện bệnh lý",
                statSupport: "Hỗ trợ y tế",
                teamTitle: "ĐỘI NGŨ BÁC SĨ GIÀU KINH NGHIỆM - TẬN TÂM VỚI NGHỀ",
                commitmentTitle: "BỆNH VIỆN TÂN AN CAM KẾT"
            },
            news: {
                title: "TIN TỨC & SỰ KIỆN",
                subtitle: "Cập nhật tin tức y khoa và hoạt động tại Bệnh viện Tân An",
                latestTitle: "TIN MỚI NHẤT",
                card1Title: "Từ 01.01.2026: Bệnh viện Đa khoa Quốc tế Tân An mở rộng khu khám VIP",
                card1Desc: "Nâng cao trải nghiệm khách hàng với không gian sang trọng và quy trình khép kín...",
                card2Title: "Hội thảo: Tầm soát ung thư đường tiêu hóa bằng công nghệ nội soi NBI",
                card2Desc: "Cập nhật những tiến bộ y khoa mới nhất giúp phát hiện sớm ung thư dạ dày...",
                card3Title: "Chương trình khám bệnh miễn phí cho người cao tuổi tại Tân An",
                card3Desc: "Hơn 200 suất khám và quà tặng đã được trao tận tay những hoàn cảnh khó khăn..."
            },
            testimonials: {
                title: "GÓC TRI ÂN",
                filterAll: "Tất cả",
                filterGastric: "Nội soi Dạ dày",
                filterColon: "Nội soi Đại tràng",
                filterService: "Dịch vụ & Bác sĩ",
                loadMore: "Xem thêm đánh giá"
            },
            contact: {
                subtitle: "Bệnh viện Đa khoa Quốc tế Tân An luôn sẵn sàng lắng nghe và hỗ trợ bạn",
                addressTitle: "Địa Chỉ",
                phoneTitle: "Điện Thoại",
                emailTitle: "Email"
            },
            footer: {
                consultTitle: "ĐĂNG KÝ TƯ VẤN",
                consultDesc: "Để lại thông tin để được đội ngũ chuyên gia của chúng tôi tư vấn chi tiết.",
                usefulLinks: "LIÊN KẾT HỮU ÍCH",
                qa: "Hỏi Đáp Y Khoa",
                careerOpp: "Cơ Hội Nghề Nghiệp",
                systemTitle: "HỆ THỐNG",
                career: "Tuyển dụng",
                mapTitle: "VỊ TRÍ BỆNH VIỆN",
                formTitle: "ĐĂNG KÝ TƯ VẤN NHANH",
                formName: "Họ và tên *",
                formPhone: "Số điện thoại *",
                formEmail: "Email (nếu có)",
                formSelect: "-- Chọn Dịch vụ đăng ký --",
                formHealthConsult: "Tư vấn sức khỏe",
                formOther: "Khác",
                formSubmit: "GỬI YÊU CẦU"
            },
            faq: {
                title: "CÂU HỎI THƯỜNG GẶP"
            },
            tooltip: {
                zalo: "Chat Zalo",
                messenger: "Chat Messenger",
                emergency: "Gọi Cấp Cứu",
                booking: "Đăng ký khám ngay",
                top: "Lên đầu trang"
            }
        },
        en: {
            common: {
                emergency: "EMERGENCY",
                hotline: "HOTLINE",
                booking: "BOOKING",
                hospitalName: "TAN AN INTERNATIONAL GENERAL HOSPITAL",
                workingHours: "Hours: Mon - Sun: 7:30 - 17:00",
                workingHoursCompact: "7:30 - 17:00 (Mon - Sun)",
                address: "No. 136C Provincial Road 827, Tan An Ward, Tan An City",
                viewAll: "VIEW ALL",
                viewAllServices: "VIEW ALL SERVICES",
                viewDetails: "VIEW DETAILS",
                contactNow: "CONTACT NOW",
                needAdvice: "NEED ADVICE?",
                contactSupport: "Contact us for support"
            },
            nav: {
                home: "HOME",
                about: "ABOUT US",
                endoscopy: "ENDOSCOPY",
                services: "MEDICAL SERVICES",
                news: "NEWS",
                contact: "CONTACT"
            },
            lang: {
                vietnamese: "VIETNAMESE",
                english: "ENGLISH",
                khmer: "KHMER"
            },
            dropdown: {
                emergency: "Emergency 24/7",
                checkup: "General Checkup",
                endoscopy: "Endoscopy",
                obgyn: "Obstetrics & Gynecology",
                pediatric: "Pediatrics",
                cardiology: "Cardiology",
                orthopedic: "Orthopedics",
                imaging: "Diagnostic Imaging"
            },
            hero: {
                slide1Title: "COMPREHENSIVE HEALTHCARE",
                slide1Text: "Tan An International General Hospital is committed to providing world-class medical services with dedication and professionalism.",
                slide1Btn: "HEALTH PACKAGES",
                slide2Title: "PAINLESS ENDOSCOPY",
                slide2Text: "Advanced NBI magnification technology for early detection of esophageal, gastric, and colorectal cancer.",
                slide2Btn: "LEARN MORE",
                slide3Title: "FETAL ECHOCARDIOGRAPHY",
                slide3Text: "Screen for congenital heart defects in your baby with leading cardiology specialists.",
                slide3Btn: "BOOK CONSULTATION"
            },
            about: {
                heroTitle: "CREATING HIGH-QUALITY HEALTHCARE",
                heroText: "Tan An International General Hospital - Pioneering the healthcare socialization model, bringing world-class services to the community.",
                title: "ABOUT US",
                desc1: "Originating from TWG Group, Tan An International General Hospital is a testament to the mission \"The path to success through kindness\". We are proud to be a pioneer in implementing the Government's Resolution No. 23 on healthcare socialization.",
                desc2: "With its predecessor being a public-private partnership in Obstetrics and Pediatrics, we have now transformed into a modern General Hospital, providing comprehensive medical services at reasonable costs.",
                statBeds: "Inpatient beds",
                statYears: "Years of formation",
                statVisits: "Visits per year",
                visionTitle: "VISION & CORE VALUES",
                visionSub: "Vision",
                visionText: "To become a leading, high-tech general medical system, providing a sustainable health foundation for the community.",
                missionSub: "Mission",
                missionText: "Establishing new quality standards, combining medical ethics and technology to serve the vast majority of Vietnamese people.",
                philosophySub: "Philosophy",
                philosophyText: "\"The path to success through kindness\" - Putting the interests and health of patients first.",
                historyTitle: "DEVELOPMENT JOURNEY",
                achievementsTitle: "OUTSTANDING ACHIEVEMENTS"
            },
            quickActions: {
                findDoctor: "FIND DOCTOR",
                findDoctorDesc: "Expert team",
                bookAppt: "BOOK APPOINTMENT",
                bookApptDesc: "Fast & Convenient",
                medicalServices: "MEDICAL SERVICES",
                medicalServicesDesc: "Comprehensive care",
                healthPackages: "HEALTH PACKAGES",
                healthPackagesDesc: "Individual & Business",
                insurance: "HEALTH INSURANCE",
                insuranceDesc: "Direct payment"
            },
            featured: {
                title: "FEATURED SERVICES"
            },
            resources: {
                title: "HEALTHCARE RESOURCES",
                desc: "Reliable reference information on pathologies and healthcare guidelines compiled by experts"
            },
            services: {
                title: "MEDICAL SERVICES",
                digestive: "Digestive Internal/Surgery",
                cardiology: "Cardiology",
                stroke: "Stroke Screening",
                cancer: "Cancer Screening",
                endoscopy: "Gastrointestinal Endoscopy",
                obgyn: "Obstetrics & Gynecology",
                pediatrics: "Pediatrics",
                imaging: "Diagnostic Imaging"
            },
            specialties: {
                internal: {
                    title: "Internal Medicine",
                    obgyn: "Obstetrics & Gynecology",
                    pediatrics: "Pediatrics & Neonatology",
                    internalMed: "Internal Medicine",
                    respiratory: "Respiratory & Lung",
                    endocrine: "Endocrine & Diabetes",
                    orthopedics: "Internal Orthopedics",
                    nephrology: "Nephrology",
                    general: "General Internal",
                    cardiology: "Cardiology",
                    digestive: "Gastroenterology",
                    digestiveHepatology: "Gastroenterology & Hepatology",
                    traditionalMed: "Traditional Medicine",
                    anesthesiology: "Anesthesiology & Resuscitation"
                },
                surgical: {
                    title: "Surgical Specialties",
                    generalSurg: "General Surgery",
                    orthopedicsSurg: "Orthopedic Surgery",
                    urology: "Urology",
                    ent: "E.N.T (Ear-Nose-Throat)",
                    ophthalmology: "Ophthalmology & Refractive Surgery",
                    dental: "Dental & Maxillofacial"
                },
                support: {
                    title: "Diagnostics & Support",
                    imaging: "Diagnostic Imaging",
                    laboratory: "Laboratory & Blood Bank",
                    physiotherapy: "Physiotherapy & Rehabilitation"
                },
                centers: {
                    title: "Centers & Other Services",
                    vaccination: "Vaccination Center",
                    healthCheckProg: "Health Checkup Programs",
                    screeningProg: "Screening Programs",
                    sportsHealth: "Sports Health Assessment",
                    corpCheckup: "Corporate Health Checkup",
                    schoolCheckup: "School & Employment Health Check",
                    occupationalHealth: "Occupational & Driver Checkup"
                }
            },
            equipment: {
                title: "MODERN MEDICAL EQUIPMENT",
                subtitle: "Advanced diagnostic imaging technology",
                description: "Tan An International General Hospital is equipped with state-of-the-art machinery, applying AI in diagnosis and treatment.",
                mriTitle: "1.5 Tesla MRI System",
                mriDesc: "Sharp images, noise reduction, fast scanning time.",
                ctTitle: "128-slice CT Scanner",
                ctDesc: "Screen for cancer and cardiovascular diseases with high accuracy.",
                aiTitle: "AI Application",
                aiDesc: "Analyze image data, supporting doctors for up to 99% accuracy.",
                nbiTitle: "Magnifying NBI Endoscopy",
                nbiDesc: "Detect gastrointestinal cancer at very early stages.",
                slideNBICaption: "Modern NBI Endoscopy System",
                slideAICaption: "AI Diagnostic Center",
                slideMRICaption: "1.5 Tesla Philips MRI System with AI integration",
                slideLabCaption: "Automated Laboratory System",
                slideLabIntlCaption: "International Standard Laboratory Center",
                slideRobotCaption: "Automated Sample Transport Robot",
                slideFetalCaption: "Advanced GE Fetal Cardiology Machine",
                slide5DCaption: "AI-integrated 5D Ultrasound for Fetal Screening"
            },
            packages: {
                title: "HEALTH PACKAGES",
                badgeRecommended: "RECOMMENDED",
                badgePopular: "POPULAR",
                badgeMale: "FOR MEN",
                badgeFemale: "FOR WOMEN",
                endoscopyGastricTitle: "GASTRIC ENDOSCOPY",
                endoscopyGastricDesc: "Abdominal pain, heartburn, indigestion",
                endoscopyColonTitle: "COLONOSCOPY",
                endoscopyColonDesc: "Age ≥45, digestive disorders",
                screeningGastricTitle: "GASTRIC CANCER SCREENING",
                screeningGastricDesc: "Age ≥45, family history",
                vipTitle: "VIP COMPREHENSIVE PACKAGE",
                vipDesc: "5-star class care",
                basicTitle: "BASIC PACKAGE",
                basicDesc: "For under 40 years old",
                advancedTitle: "ADVANCED PACKAGE",
                advancedDesc: "For over 40 years old",
                maleTitle: "ADVANCED MALE SCREENING",
                maleDesc: "Comprehensive for Men",
                femaleTitle: "ADVANCED FEMALE SCREENING",
                femaleDesc: "Comprehensive for Women",
                featureConsult: "Consult with specialists",
                featureConsultExpert: "Expert consultation",
                featureNBI: "Magnifying NBI Endoscopy",
                featureHP: "HP Bacteria Test",
                featureResult: "Results & Consultation",
                featureEntireColon: "Full colonoscopy",
                featurePolypScreening: "Polyp & Cancer screening",
                featureCleanBowel: "Bowel prep medication",
                featureGeneralInternal: "General internal exam",
                featureBloodTest: "Blood test (15 indicators)",
                featureAbdominalUltrasound: "General abdominal ultrasound",
                featureChestECG: "Chest X-ray + ECG",
                featureBasicPlus: "All basic package items",
                featureBiopsy: "Cell biopsy (if lesions found)",
                featurePathology: "In-depth pathology",
                featureCancerMarkers: "Cancer markers screening",
                featureGastricEndoscopyAnes: "Gastric Endoscopy (anesthesia)",
                featureThyroidUltrasound: "Thyroid + Heart ultrasound",
                featureBloodUrine: "Blood + Urine tests",
                featureFullUltrasound: "Abdomen + Heart + Thyroid ultrasound",
                featureBothEndoscopy: "Gastric + Colon endoscopy",
                featureWomensUltrasound: "Breast + OBGYN ultrasound",
                featurePapSmear: "Pap smear test",
                featureAdvancedPlus: "Full Advanced Package",
                featureColonoscopy: "Colonoscopy (anesthesia)",
                featureMRI: "Brain / Spinal MRI",
                featureVIPCare: "Exclusive VIP care"
            },
            endoscopy: {
                heroTitle: "PAINLESS GASTROINTESTINAL ENDOSCOPY",
                heroText: "Olympus CV-190 endoscopy system with NBI magnification technology helps detect even the smallest gastrointestinal cancers early.",
                whyTitle: "WHY CHOOSE ENDOSCOPY AT TAN AN HOSPITAL?",
                featurePainless: "Painless Endoscopy (Safe Anesthesia)",
                featurePainlessDesc: "Helps patients sleep gently, without discomfort or obsession.",
                featureNBI: "NBI Magnification Technology",
                featureNBIDesc: "Virtual tissue staining, early detection of precancerous lesions.",
                featureExpert: "Experienced Expert Team",
                featureExpertDesc: "Doctors trained in major hospitals, with precise and gentle procedures.",
                featureSterile: "International Standard Sterilization",
                featureSterileDesc: "Ensuring absolute safety, preventing cross-infection.",
                procedureTitle: "SAFE ENDOSCOPY PROCEDURE",
                packageTitle: "FEATURED ENDOSCOPY PACKAGES",
                pricingTitle: "TRANSPARENT PRICING",
                statSatisfied: "Satisfied Customers",
                statPainless: "Painless - Comfortable",
                statDetection: "Pathology Detection",
                statSupport: "Medical Support",
                teamTitle: "EXPERIENCED & DEDICATED DOCTORS",
                commitmentTitle: "TAN AN HOSPITAL COMMITMENT"
            },
            news: {
                title: "NEWS & EVENTS",
                subtitle: "Update medical news and activities at Tan An Hospital",
                latestTitle: "LATEST NEWS",
                card1Title: "From Jan 1, 2026: Tan An International General Hospital Expands VIP Examination Area",
                card1Desc: "Enhancing customer experience with luxurious spaces and comprehensive procedures...",
                card2Title: "Workshop: Gastrointestinal Cancer Screening Using Magnifying NBI Technology",
                card2Desc: "Updating the latest medical advancements for early detection of gastric cancer...",
                card3Title: "Free Health Examination Program for the Elderly in Tan An",
                card3Desc: "Over 200 examinations and gifts were handed over to those in difficult circumstances..."
            },
            testimonials: {
                title: "TESTIMONIALS",
                filterAll: "All",
                filterGastric: "Gastric Endoscopy",
                filterColon: "Colonoscopy",
                filterService: "Service & Doctors",
                loadMore: "Load More Reviews"
            },
            contact: {
                subtitle: "Tan An International General Hospital is always ready to listen and support you",
                addressTitle: "Address",
                phoneTitle: "Phone",
                emailTitle: "Email"
            },
            footer: {
                consultTitle: "CONSULTATION REGISTRATION",
                consultDesc: "Leave your information to receive detailed advice from our team of experts.",
                usefulLinks: "USEFUL LINKS",
                qa: "Medical Q&A",
                careerOpp: "Career Opportunities",
                systemTitle: "SYSTEM",
                career: "Career",
                mapTitle: "HOSPITAL LOCATION",
                formTitle: "QUICK CONSULTATION",
                formName: "Full Name *",
                formPhone: "Phone Number *",
                formEmail: "Email (if any)",
                formSelect: "-- Select Service --",
                formHealthConsult: "Health Consulting",
                formOther: "Other",
                formSubmit: "SUBMIT REQUEST"
            },
            faq: {
                title: "FREQUENTLY ASKED QUESTIONS"
            },
            tooltip: {
                zalo: "Chat Zalo",
                messenger: "Chat Messenger",
                emergency: "Call Emergency",
                booking: "Book Now",
                top: "Back to top"
            }
        },
        km: {
            common: {
                emergency: "សង្គ្រោះបន្ទាន់",
                hotline: "ខ្សែទូរស័ព្ទបន្ទាន់",
                booking: "ការកក់ទុក",
                hospitalName: "មន្ទីរពេទ្យពហុវិទ្យាអន្តរជាតិតានអាន",
                workingHours: "ម៉ោងធ្វើការ៖ ច័ន្ទ - អាទិត្យ៖ ៧:៣០ - ១៧:០០",
                workingHoursCompact: "៧:៣០ - ១៧:០០ (ច័ន្ទ - អាទិត្យ)",
                address: "លេខ ១៣៦C ផ្លូវខេត្ត ៨២៧ សង្កាត់តានអាន ក្រុងតៃនិញ",
                viewAll: "មើលទាំងអស់",
                viewAllServices: "មើលសេវាកម្មទាំងអស់",
                viewDetails: "មើលលម្អិត",
                contactNow: "ទាក់ទងឥឡូវនេះ",
                needAdvice: "តើអ្នកត្រូវការការប្រឹក្សាដែរឬទេ?",
                contactSupport: "ទាក់ទងមកយើងខ្ញុំសម្រាប់ការគាំទ្រ"
            },
            nav: {
                home: "ទំព័រដើម",
                about: "អំពីយើង",
                endoscopy: "ពិនិត្យពោះវៀន",
                services: "សេវាវេជ្ជសាស្រ្ត",
                news: "ព័ត៌មាន",
                contact: "ទំនាក់ទំនង"
            },
            lang: {
                vietnamese: "ភាសាវៀតណាម",
                english: "ភាសាអង់គ្លេស",
                khmer: "ភាសាខ្មែរ"
            },
            dropdown: {
                emergency: "សង្គ្រោះបន្ទាន់ 24/7",
                checkup: "ពិនិត្យសុខភាពទូទៅ",
                endoscopy: "ពិនិត្យពោះវៀន",
                obgyn: "សម្ភព និង រោគស្ត្រី",
                pediatric: "ពេទ្យកុមារ",
                cardiology: "ពេទ្យបេះដូង",
                orthopedic: "ពេទ្យឆ្អឹង",
                imaging: "រោគវិនិច្ឆ័យរូបភាព"
            },
            hero: {
                slide1Title: "ការថែទាំសុខភាពទូលំទូលាយ",
                slide1Text: "មន្ទីរពេទ្យពហុវិទ្យាអន្តរជាតិតានអាន ប្តេជ្ញាផ្តល់សេវាវេជ្ជសាស្រ្តកម្រិតពិភពលោក។",
                slide1Btn: "កញ្ចប់សុខភាព",
                slide2Title: "ពិនិត្យពោះវៀនគ្មានការឈឺចាប់",
                slide2Text: "បច្ចេកវិទ្យា NBI ទំនើបសម្រាប់រកឃើញមហារីកបំពង់ក ក្រពះ និងពោះវៀនធំ។",
                slide2Btn: "ស្វែងយល់បន្ថែម",
                slide3Title: "ពិនិត្យបេះដូងទារក",
                slide3Text: "ពិនិត្យរកមើលពិការភាពបេះដូងកើតមកជាមួយអ្នកឯកទេសបេះដូងឈានមុខ។",
                slide3Btn: "ធ្វើការណាត់ជួប"
            },
            about: {
                heroTitle: "ការរៀបចំប្រព័ន្ធថែទាំសុខភាពគុណភាពខ្ពស់",
                heroText: "មន្ទីរពេទ្យពហុវិទ្យាអន្តរជាតិតានអាន - នាំមុខគេក្នុងគំរូសង្គមភាូបនីយកម្មសុខាភិបាល។",
                title: "អំពីយើង",
                desc1: "មានប្រភពចេញពីក្រុមហ៊ុន TWG Group មន្ទីរពេទ្យពហុវិទ្យាអន្តរជាតិតានអាន គឺជាសក្ខីភាពនៃបេសកកម្ម \"ផ្លូវទៅកាន់ភាពជោគជ័យតាមរយៈសេចក្តីសប្បុរស\"។",
                desc2: "ពីមុនជាកិច្ចសហប្រតិបត្តិការសាធារណៈនិងឯកជនផ្នែកសម្ភពនិងកុមារ ឥឡូវនេះយើងបានក្លាយជាមន្ទីរពេទ្យពហុវិទ្យាទំនើប។",
                statBeds: "គ្រែអ្នកជំងឺ",
                statYears: "ឆ្នាំនៃការបង្កើត",
                statVisits: "ចំនួនអ្នកមកពិនិត្យ/ឆ្នាំ",
                visionTitle: "ចក្ខុវិស័យ និងគុណតម្លៃស្នូល",
                visionSub: "ចក្ខុវិស័យ",
                visionText: "ក្លាយជាប្រព័ន្ធវេជ្ជសាស្ត្រពហុវិទ្យាបច្ចេកទេសខ្ពស់ឈានមុខគេ។",
                missionSub: "បេសកកម្ម",
                missionText: "បង្កើតស្តង់ដារគុណភាពថ្មី បញ្ចូលគ្នានូវសីលធម៌វេជ្ជសាស្ត្រ និងបច្ចេកវិទ្យា។",
                philosophySub: "ទស្សនវិជ្ជា",
                philosophyText: "\"ផ្លូវទៅកាន់ភាពជោគជ័យតាមរយៈសេចក្តីសប្បុរស\" - ដាក់ផលប្រយោជន៍ និងសុខភាពអ្នកជំងឺជាចម្បង។",
                historyTitle: "ដំណើរនៃការអភិវឌ្ឍន៍",
                achievementsTitle: "សមិទ្ធផលលេចធ្លោ"
            },
            quickActions: {
                findDoctor: "ស្វែងរកវេជ្ជបណ្ឌិត",
                findDoctorDesc: "ក្រុមអ្នកឯកទេស",
                bookAppt: "កក់ការណាត់ជួប",
                bookApptDesc: "លឿន និងងាយស្រួល",
                medicalServices: "សេវាវេជ្ជសាស្រ្ត",
                medicalServicesDesc: "ការថែទាំទូលំទូលាយ",
                healthPackages: "កញ្ចប់សុខភាព",
                healthPackagesDesc: "បុគ្គល និងអាជីវកម្ម",
                insurance: "ធានារ៉ាប់រងសុខភាព",
                insuranceDesc: "ការទូទាត់ផ្ទាល់"
            },
            featured: {
                title: "សេវាកម្មលេចធ្លោ"
            },
            resources: {
                title: "ធនធានថែទាំសុខភាព",
                desc: "ព័ត៌មានយោងដែលអាចទុកចិត្តបានអំពីរោគសាស្ត្រ និងការណែនាំអំពីការថែទាំសុខភាពដែលចងក្រងដោយអ្នកជំនាញ"
            },
            services: {
                title: "សេវាវេជ្ជសាស្រ្ត",
                digestive: "អាយុរកាយ-វះកាត់រំលាយអាហារ",
                cardiology: "ពេទ្យបេះដូង",
                stroke: "ពិនិត្យជំងឺដាច់សរសៃឈាមខួរក្បាល",
                cancer: "ពិនិត្យមហារីក",
                endoscopy: "ពិនិត្យពោះវៀន",
                obgyn: "សម្ភព និង រោគស្ត្រី",
                pediatrics: "ពេទ្យកុមារ",
                imaging: "រោគវិនិច្ឆ័យរូបភាព"
            },
            specialties: {
                internal: {
                    title: "ផ្នែកវិជ្ជសាស្ត្រទូទៅ",
                    obgyn: "ផ្នែកសម្ភព និង រោគស្ត្រី",
                    pediatrics: "ផ្នែកកុមារ និង ទារក",
                    internalMed: "ផ្នែកវិជ្ជសាស្ត្រទូទៅ",
                    respiratory: "ផ្នែកផ្លូវដង្ហើម និង សួត",
                    endocrine: "ផ្នែកអរម៉ូន និង ជំងឺទឹកនោមផ្អែម",
                    orthopedics: "ផ្នែកឆ្អឹង និង សន្លាក់",
                    nephrology: "ផ្នែកតម្រងនោម",
                    general: "ផ្នែកវិជ្ជសាស្ត្រទូទៅ",
                    cardiology: "ផ្នែកបេះដូង",
                    digestive: "ផ្នែកក្រពះពោះវៀន",
                    digestiveHepatology: "ផ្នែកក្រពះពោះវៀន និង ថ្លើម",
                    traditionalMed: "ផ្នែកវេជ្ជសាស្ត្របុរាណ",
                    anesthesiology: "ផ្នែកថ្នាំសន្លប់ និង ការសង្គ្រោះ"
                },
                surgical: {
                    title: "ផ្នែកវះកាត់",
                    generalSurg: "ផ្នែកវះកាត់ទូទៅ",
                    orthopedicsSurg: "ផ្នែកវះកាត់ឆ្អឹង",
                    urology: "ផ្នែកប្រព័ន្ធទឹកនោម",
                    ent: "ផ្នែកត្រចៀក ច្រមុះ បំពង់ក",
                    ophthalmology: "ផ្នែកភ្នែក និង ការវះកាត់ភ្នែក",
                    dental: "ផ្នែកធ្មេញ និង មាត់"
                },
                support: {
                    title: "ផ្នែករោគវិនិច្ឆ័យ និង គាំទ្រ",
                    imaging: "ផ្នែករោគវិនិច្ឆ័យរូបភាព",
                    laboratory: "ផ្នែកពិសោធន៍ និង ធនាគារឈាម",
                    physiotherapy: "ផ្នែករូបវិទ្យាព្យាបាល និង ការស្តារនីតិសម្បទា"
                },
                centers: {
                    title: "មជ្ឈមណ្ឌល និង សេវាកម្មផ្សេងៗ",
                    vaccination: "មជ្ឈមណ្ឌលចាក់វ៉ាក់សាំង",
                    healthCheckProg: "កម្មវិធីពិនិត្យសុខភាព",
                    screeningProg: "កម្មវិធីពិនិត្យជំងឺ",
                    sportsHealth: "ការវាយតម្លៃសុខភាពកីឡា",
                    corpCheckup: "ការពិនិត្យសុខភាពសម្រាប់ក្រុមហ៊ុន",
                    schoolCheckup: "ការពិនិត្យសុខភាពសាលារៀន",
                    occupationalHealth: "ការពិនិត្យសុខភាពការងារ"
                }
            },
            equipment: {
                title: "ឧបករណ៍វេជ្ជសាស្ត្រទំនើប",
                subtitle: "បច្ចេកវិទ្យារោគវិនិច្ឆ័យរូបភាពកម្រិតខ្ពស់",
                description: "មន្ទីរពេទ្យតានអានបំពាក់ដោយគ្រឿងម៉ាស៊ីនទំនើបបំផុត ដោយប្រើប្រាស់ AI ក្នុងការធ្វើរោគវិនិច្ឆ័យ។",
                mriTitle: "ប្រព័ន្ធ MRI 1.5 Tesla",
                mriDesc: "រូបភាពច្បាស់ កាត់បន្ថយសំឡេង រយៈពេលថតលឿន។",
                ctTitle: "CT Scanner 128 slices",
                ctDesc: "ពិនិត្យរកមហារីក និងជំងឺបេះដូងដោយភាពត្រឹមត្រូវខ្ពស់។",
                aiTitle: "ការប្រើប្រាស់ AI",
                aiDesc: "វិភាគទិន្នន័យរូបភាព ជួយគ្រូពេទ្យធ្វើរោគវិនិច្ឆ័យត្រឹមត្រូវដល់ 99%។",
                nbiTitle: "ពិនិត្យពោះវៀន NBI",
                nbiDesc: "រកឃើញមហារីកបំពង់អាហារ ក្រពះ នៅដំណាក់កាលដំបូងបំផុត។",
                slideNBICaption: "ប្រព័ន្ធពិនិត្យពោះវៀន NBI ទំនើប",
                slideAICaption: "មជ្ឈមណ្ឌលរោគវិនិច្ឆ័យ AI",
                slideMRICaption: "ប្រព័ន្ធ MRI 1.5 Tesla ជាមួយ AI",
                slideLabCaption: "ប្រព័ន្ធពិសោធន៍ស្វ័យប្រវត្តិ",
                slideLabIntlCaption: "មជ្ឈមណ្ឌលពិសោធន៍ស្តង់ដារអន្តរជាតិ",
                slideRobotCaption: "រ៉ូបូតដឹកជញ្ជូនគំរូស្វ័យប្រវត្តិ",
                slideFetalCaption: "ម៉ាស៊ីនពិនិត្យបេះដូងទារកទំនើប",
                slide5DCaption: "ម៉ាស៊ីនអេកូ 5D ជាមួយ AI"
            },
            packages: {
                title: "កញ្ចប់ពិនិត្យសុខភាព",
                badgeRecommended: "ណែនាំ",
                badgePopular: "ពេញនិយម",
                badgeMale: "សម្រាប់បុរស",
                badgeFemale: "សម្រាប់ស្ត្រី",
                endoscopyGastricTitle: "ពិនិត្យក្រពះ",
                endoscopyGastricDesc: "ឈឺពោះ ឆ្អល់ក្តៅក្រពះ",
                endoscopyColonTitle: "ពិនិត្យពោះវៀនធំ",
                endoscopyColonDesc: "អាយុ ≥45 ឆ្នាំ ជំងឺរំលាយអាហារ",
                screeningGastricTitle: "ពិនិត្យមហារីកក្រពះ",
                screeningGastricDesc: "អាយុ ≥45 ឆ្នាំ ប្រវត្តិគ្រួសារ",
                vipTitle: "កញ្ចប់ VIP",
                vipDesc: "ការថែទាំលំដាប់ផ្កាយ ៥",
                basicTitle: "កញ្ចប់មូលដ្ឋាន",
                basicDesc: "សម្រាប់អាយុក្រោម ៤០ ឆ្នាំ",
                advancedTitle: "កញ្ចប់កម្រិតខ្ពស់",
                advancedDesc: "សម្រាប់អាយុលើស ៤០ ឆ្នាំ",
                maleTitle: "ការពិនិត្យស៊ីជម្រៅសម្រាប់បុរស",
                maleDesc: "ទូលំទូលាយសម្រាប់បុរស",
                femaleTitle: "ការពិនិត្យស៊ីជម្រៅសម្រាប់ស្ត្រី",
                femaleDesc: "ទូលំទូលាយសម្រាប់ស្ត្រី",
                featureConsult: "ពិភាក្សាជាមួយគ្រូពេទ្យឯកទេស",
                featureConsultExpert: "ការពិគ្រោះយោបល់ជាមួយអ្នកជំនាញ",
                featureNBI: "ពិនិត្យពោះវៀន NBI",
                featureHP: "ពិនិត្យបាក់តេរី HP",
                featureResult: "លទ្ធផល និងការផ្តល់មតិ",
                featureEntireColon: "ពិនិត្យពោះវៀនធំទាំងមូល",
                featurePolypScreening: "ពិនិត្យរក Polyp និង មហារីក",
                featureCleanBowel: "ថ្នាំសម្អាតពោះវៀន",
                featureGeneralInternal: "ពិនិត្យសុខភាពទូទៅ",
                featureBloodTest: "ពិនិត្យឈាម (១៥ សុចនាករ)",
                featureAbdominalUltrasound: "អេកូពោះទូទៅ",
                featureChestECG: "ថតកាំរស្មីអ៊ិចទ្រូង + ECG",
                featureBasicPlus: "គ្រប់មុខទាំងអស់នៃកញ្ចប់មូលដ្ឋាន",
                featureBiopsy: "យកសាច់កោសិកា (បើមានដំបៅ)",
                featurePathology: "រោគវិនិច្ឆ័យស៊ីជម្រៅ",
                featureCancerMarkers: "ពិនិត្យរកមើលសញ្ញមហារីក",
                featureGastricEndoscopyAnes: "ពិនិត្យក្រពះ (ដាក់ថ្នាំសន្លប់)",
                featureThyroidUltrasound: "អេកូក្រពេញទីរ៉ូអ៊ីត + បេះដូង",
                featureBloodUrine: "ពិនិត្យឈាម + ទឹកនោម",
                featureFullUltrasound: "អេកូពោះ + បេះដូង + ទីរ៉ូអ៊ីត",
                featureBothEndoscopy: "ពិនិត្យក្រពះ + ពោះវៀនធំ",
                featureWomensUltrasound: "អេកូដោះ + ផ្នែកស្ត្រី",
                featurePapSmear: "ការពិនិត្យ Pap smear",
                featureAdvancedPlus: "កញ្ចប់កម្រិតខ្ពស់ពេញលេញ",
                featureColonoscopy: "ពិនិត្យពោះវៀនធំ (ដាក់ថ្នាំសន្លប់)",
                featureMRI: "MRI ខួរក្បាល / ឆ្អឹងខ្នង",
                featureVIPCare: "ការថែទាំ VIP ផ្តាច់មុខ"
            },
            endoscopy: {
                heroTitle: "ការពិនិត្យពោះវៀនគ្មានការឈឺចាប់",
                heroText: "ប្រព័ន្ធ Olympus CV-190 ជាមួយបច្ចេកវិទ្យา NBI ជួយរកឃើញមហារីកបំពង់អាហារ និងក្រពះ ទោះបីជាតូចបំផុតក៏ដោយ។",
                whyTitle: "ហេតុអ្វីត្រូវជ្រើសរើសការពិនិត្យពោះវៀននៅមន្ទីរពេទ្យតានអាន?",
                featurePainless: "ពិនិត្យដោយមិនឈឺ (ការដាក់ថ្នាំសន្លប់មានសុវត្ថិភាព)",
                featurePainlessDesc: "ជួយឱ្យអ្នកជំងឺគេងលក់ស្រួល គ្មានអារម្មណ៍មិនល្អ។",
                featureNBI: "បច្ចេកវិទ្យา NBI ពង្រីក",
                featureNBIDesc: "ការជ្រលក់ពណ៌ជាលិកានិម្មិត រកឃើញដំបៅមហារីកដំណាក់កាលដំបូង។",
                featureExpert: "ក្រុមអ្នកឯកទេសមានបទពិសោធន៍",
                featureExpertDesc: "វេជ្ជបណ្ឌិតដែលបានបណ្តុះបណ្តាលនៅមន្ទីរពេទ្យធំៗ។",
                featureSterile: "ដំណើរការសម្លាប់មេរោគស្តង់ដារអន្តរជាតិ",
                featureSterileDesc: "ធានាសុវត្ថិភាពដាច់ខាត បង្ការការឆ្លងមេរោគ។",
                procedureTitle: "ដំណើរការពិនិត្យពោះវៀនប្រកបដោយសុវត្ថិភាព",
                packageTitle: "កញ្ចប់ពិនិត្យពោះវៀនលេចធ្លោ",
                pricingTitle: "តម្លៃថ្លៃថ្នូរ",
                statSatisfied: "អតិថិជនពេញចិត្ត",
                statPainless: "គ្មានការឈឺចាប់",
                statDetection: "រកឃើញជំងឺ",
                statSupport: "គាំទ្រវេជ្ជសាស្ត្រ",
                teamTitle: "ក្រុមគ្រូពេទ្យមានបទពិសោធន៍ និងការយកចិត្តទុកដាក់",
                commitmentTitle: "ការប្តេជ្ញាចិត្តរបស់មន្ទីរពេទ្យតានអាន"
            },
            news: {
                title: "ព័ត៌មាន និង ព្រឹត្តិការណ៍",
                subtitle: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានវេជ្ជសាស្ត្រ និងសកម្មភាពនៅមន្ទីរពេទ្យតានអាន",
                latestTitle: "ព័ត៌មានចុងក្រោយ",
                card1Title: "ចាប់ពីថ្ងៃទី ០១.០១.២០២៦៖ មន្ទីរពេទ្យពហុវិទ្យាអន្តរជាតិតានអាន ពង្រីកតំបន់ពិនិត្យ VIP",
                card1Desc: "លើកកម្ពស់បទពិសោធន៍អតិថិជនជាមួយលំហដ៏ប្រណិត និងនីតិវិធីទូលំទូលាយ...",
                card2Title: "សិក្ខាសាលា៖ ការពិនិត្យមហារីកផ្លូវរំលាយអាហារ ដោយប្រើបច្ចេកវិទ្យា NBI",
                card2Desc: "ធ្វើបច្ចុប្បន្នភាពការជឿនលឿនផ្នែកវេជ្ជសាស្ត្រចុងក្រោយបំផុត ដើម្បីរកឃើញមហារីកក្រពះ...",
                card3Title: "កម្មវិធីពិនិត្យសុខភាពដោយឥតគិតថ្លៃសម្រាប់មនុស្សចាស់នៅតានអាន",
                card3Desc: "ការពិនិត្យ និងកាដូជាង ២០០ ត្រូវបានប្រគល់ជូនដល់អ្នកដែលមានជីវភាពខ្វះខាត..."
            },
            testimonials: {
                title: "មតិកែលម្អ",
                filterAll: "ទាំងអស់",
                filterGastric: "ពិនិត្យក្រពះ",
                filterColon: "ពិនិត្យពោះវៀនធំ",
                filterService: "សេវាកម្ម និង គ្រូពេទ្យ",
                loadMore: "មើលមតិបន្ថែម"
            },
            contact: {
                subtitle: "មន្ទីរពេទ្យទូទៅអន្តរជាតិតានអាន តែងតែត្រៀមខ្លួនជាស្រេចដើម្បីស្តាប់ និងគាំទ្រអ្នក",
                addressTitle: "អាសយដ្ឋាន",
                phoneTitle: "ទូរស័ព្ទ",
                emailTitle: "អ៊ីមែល"
            },
            footer: {
                consultTitle: "ការចុះឈ្មោះពិគ្រោះយោបល់",
                consultDesc: "ទុកព័ត៌មានរបស់អ្នក ដើម្បីទទួលបានដំបូន្មានលម្អិតពីក្រុមអ្នកជំនាញរបស់យើង។",
                usefulLinks: "តំណភ្ជាប់មានប្រយោជន៍",
                qa: "សំណួរ និង ចម្លើយ",
                careerOpp: "ឱកាសការងារ",
                systemTitle: "ប្រព័ន្ធ",
                career: "ជ្រើសរើសបុគ្គលិក",
                mapTitle: "ទីតាំងមន្ទីរពេទ្យ",
                formTitle: "ចុះឈ្មោះពិគ្រោះយោបល់រហ័ស",
                formName: "ឈ្មោះពេញ *",
                formPhone: "លេខទូរស័ព្ទ *",
                formEmail: "អ៊ីមែល (បើមាន)",
                formSelect: "-- ជ្រើសរើសសេវាកម្ម --",
                formHealthConsult: "ការពិគ្រោះយោបល់សុខភាព",
                formOther: "ផ្សេងៗ",
                formSubmit: "ផ្ញើសំណើ"
            },
            faq: {
                title: "សំណួរដែលសួរញឹកញាប់"
            },
            tooltip: {
                zalo: "ឆាត Zalo",
                messenger: "ឆាត Messenger",
                emergency: "ហៅសង្គ្រោះបន្ទាន់",
                booking: "ចុះឈ្មោះឥឡូវនេះ",
                top: "ត្រឡប់ទៅខាងលើ"
            }
        }
    };

    let translations = TRANSLATIONS.vi;
    let currentLang = DEFAULT_LANG;

    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => (o || {})[k], obj);
    }

    function applyTranslations() {
        // Standard Text Content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            if (value) {
                if (el.children.length === 0) {
                    el.textContent = value;
                } else {
                    let textNodeFound = false;
                    Array.from(el.childNodes).forEach(node => {
                        if (node.nodeType === 3 && node.textContent.trim().length > 0 && !textNodeFound) {
                            node.textContent = value;
                            textNodeFound = true;
                        }
                    });
                }
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = getNestedValue(translations, key);
            if (value) el.placeholder = value;
        });

        // Tooltips
        document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
            const key = el.getAttribute('data-i18n-tooltip');
            const value = getNestedValue(translations, key);
            if (value) el.setAttribute('data-tooltip', value);
        });

        document.documentElement.lang = currentLang;
    }

    function updateActiveState() {
        const links = document.querySelectorAll('.lang-switch a');
        links.forEach(link => {
            link.classList.remove('active');
            const key = link.getAttribute('data-i18n');
            if (currentLang === 'vi' && key === 'lang.vietnamese') link.classList.add('active');
            if (currentLang === 'en' && key === 'lang.english') link.classList.add('active');
            if (currentLang === 'km' && key === 'lang.khmer') link.classList.add('active');
        });
    }

    function switchLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        translations = TRANSLATIONS[lang] || TRANSLATIONS.vi;
        applyTranslations();
        updateActiveState();
        console.log('[LangSwitcher] Switched to:', lang);
    }

    function setupEventListeners() {
        document.querySelectorAll('.lang-switch a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const key = link.getAttribute('data-i18n');
                let lang = 'vi';
                if (key === 'lang.english') lang = 'en';
                else if (key === 'lang.khmer') lang = 'km';
                switchLanguage(lang);
            });
        });
    }

    function init() {
        currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        translations = TRANSLATIONS[currentLang] || TRANSLATIONS.vi;

        // Initial application
        applyTranslations();
        setupEventListeners();
        updateActiveState();

        console.log('[LangSwitcher] Init complete. Lang:', currentLang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
