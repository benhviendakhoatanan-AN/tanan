// ==========================================
// Constants & Data
// ==========================================

const BHUTANI_ZONES = {
    highRisk: [ // 95th percentile
        { hours: 0, bili: 0 }, { hours: 12, bili: 6.5 }, { hours: 24, bili: 10 },
        { hours: 36, bili: 12.5 }, { hours: 48, bili: 14 }, { hours: 60, bili: 15.5 },
        { hours: 72, bili: 16.5 }, { hours: 84, bili: 17.2 }, { hours: 96, bili: 17.5 },
        { hours: 108, bili: 17.7 }, { hours: 120, bili: 17.8 }, { hours: 144, bili: 17.5 }
    ],
    highIntermediate: [ // 75th-95th percentile
        { hours: 0, bili: 0 }, { hours: 12, bili: 5 }, { hours: 24, bili: 8.5 },
        { hours: 36, bili: 10.5 }, { hours: 48, bili: 12 }, { hours: 60, bili: 13 },
        { hours: 72, bili: 14 }, { hours: 84, bili: 14.8 }, { hours: 96, bili: 15.2 },
        { hours: 108, bili: 15.5 }, { hours: 120, bili: 15.6 }, { hours: 144, bili: 15 }
    ],
    lowIntermediate: [ // 40th-75th percentile
        { hours: 0, bili: 0 }, { hours: 12, bili: 4 }, { hours: 24, bili: 7 },
        { hours: 36, bili: 9 }, { hours: 48, bili: 10.5 }, { hours: 60, bili: 11.5 },
        { hours: 72, bili: 12.2 }, { hours: 84, bili: 12.8 }, { hours: 96, bili: 13.2 },
        { hours: 108, bili: 13.4 }, { hours: 120, bili: 13.5 }, { hours: 144, bili: 12.5 }
    ],
    lowRisk: [ // <40th percentile
        { hours: 0, bili: 0 }, { hours: 12, bili: 3 }, { hours: 24, bili: 5.5 },
        { hours: 36, bili: 7 }, { hours: 48, bili: 8.5 }, { hours: 60, bili: 9.5 },
        { hours: 72, bili: 10.2 }, { hours: 84, bili: 10.8 }, { hours: 96, bili: 11 },
        { hours: 108, bili: 11.2 }, { hours: 120, bili: 11.3 }, { hours: 144, bili: 10.5 }
    ]
};

const PHOTOTHERAPY_THRESHOLDS = {
    noRiskFactors: {
        40: { 24: 15, 36: 17.5, 48: 19, 60: 20, 72: 21, 96: 22 },
        39: { 24: 14.5, 36: 17, 48: 18.5, 60: 19.5, 72: 20.5, 96: 21.5 },
        38: { 24: 14, 36: 16.5, 48: 18, 60: 19, 72: 20, 96: 21 },
        37: { 24: 12, 36: 14, 48: 15.5, 60: 16.5, 72: 17.5, 96: 18.5 },
        36: { 24: 10.5, 36: 12.5, 48: 14, 60: 15, 72: 16, 96: 17 },
        35: { 24: 9, 36: 11, 48: 12.5, 60: 13.5, 72: 14.5, 96: 15.5 }
    },
    withRiskFactors: {
        40: { 24: 13, 36: 15.5, 48: 17, 60: 18, 72: 19, 96: 20 },
        39: { 24: 12.5, 36: 15, 48: 16.5, 60: 17.5, 72: 18.5, 96: 19.5 },
        38: { 24: 12, 36: 14.5, 48: 16, 60: 17, 72: 18, 96: 19 },
        37: { 24: 10, 36: 12, 48: 13.5, 60: 14.5, 72: 15.5, 96: 16.5 },
        36: { 24: 8.5, 36: 10.5, 48: 12, 60: 13, 72: 14, 96: 15 },
        35: { 24: 7, 36: 9, 48: 10.5, 60: 11.5, 72: 12.5, 96: 13.5 }
    }
};

const EXCHANGE_THRESHOLDS = {
    noRiskFactors: {
        40: { 24: 21, 48: 23, 72: 24, 96: 25 },
        38: { 24: 20, 48: 22, 72: 23, 96: 24 },
        36: { 24: 17.5, 48: 19.5, 72: 21, 96: 22 },
        35: { 24: 16, 48: 18, 72: 19.5, 96: 21 }
    },
    withRiskFactors: {
        40: { 24: 19, 48: 21, 72: 22, 96: 23 },
        38: { 24: 18, 48: 20, 72: 21, 96: 22 },
        36: { 24: 15.5, 48: 17.5, 72: 19, 96: 20 },
        35: { 24: 14, 48: 16, 72: 17.5, 96: 19 }
    }
};


// ==========================================
// Helper Functions
// ==========================================

function interpolateThreshold(thresholds, hours) {
    const hourPoints = Object.keys(thresholds).map(Number).sort((a, b) => a - b);

    if (hours <= hourPoints[0]) return thresholds[hourPoints[0]];
    if (hours >= hourPoints[hourPoints.length - 1]) return thresholds[hourPoints[hourPoints.length - 1]];

    for (let i = 0; i < hourPoints.length - 1; i++) {
        if (hours >= hourPoints[i] && hours <= hourPoints[i + 1]) {
            const ratio = (hours - hourPoints[i]) / (hourPoints[i + 1] - hourPoints[i]);
            return thresholds[hourPoints[i]] + ratio * (thresholds[hourPoints[i + 1]] - thresholds[hourPoints[i]]);
        }
    }
    return thresholds[hourPoints[hourPoints.length - 1]];
}

function getZoneValue(zoneData, hours) {
    for (let i = 0; i < zoneData.length - 1; i++) {
        if (hours >= zoneData[i].hours && hours <= zoneData[i + 1].hours) {
            const ratio = (hours - zoneData[i].hours) / (zoneData[i + 1].hours - zoneData[i].hours);
            return zoneData[i].bili + ratio * (zoneData[i + 1].bili - zoneData[i].bili);
        }
    }
    return zoneData[zoneData.length - 1].bili;
}

// ==========================================
// State Management
// ==========================================

const AppState = {
    birthDate: '',
    birthTime: '',
    assessmentDate: '',
    assessmentTime: '',
    gestationalAge: 38,
    bilirubin: '',
    bilirubinUnit: 'mgdl',
    birthWeight: '',
    riskFactors: {
        hemolysis: false, g6pd: false, sepsis: false, acidosis: false,
        albumin: false, asphyxia: false, lethargy: false, temperatureInstability: false
    },
    kramerZone: 0,
    calculated: false
};

// ==========================================
// DOM Elements
// ==========================================

function updateUI() {
    // 1. Calculate metrics
    const age = calculateAge();
    const biliMg = getBilirubinMg();
    const hasRisk = checkRiskFactors();

    // Update Age Display
    const ageDisplay = document.getElementById('age-display');
    if (age) {
        ageDisplay.innerHTML = `<span style="color: #93C5FD; font-weight: 500;">📅 Tuổi trẻ: ${age.days} ngày ${age.remainingHours} giờ (${age.hours} giờ tuổi)</span>`;
        ageDisplay.style.display = 'block';
    } else {
        ageDisplay.style.display = 'none';
    }

    // Update Bili Conversion
    const biliDisplay = document.getElementById('bili-conversion');
    if (biliMg !== null) {
        biliDisplay.innerHTML = `<span style="color: #FCD34D;">= ${biliMg.toFixed(1)} mg/dL = ${(biliMg * 17.1).toFixed(0)} µmol/L</span>`;
        biliDisplay.style.display = 'block';
    } else {
        biliDisplay.style.display = 'none';
    }

    // Update Risk Warning
    const riskWarning = document.getElementById('risk-warning');
    if (hasRisk) {
        riskWarning.style.display = 'block';
    } else {
        riskWarning.style.display = 'none';
    }

    // Enable/Disable Calculate Button
    const btn = document.getElementById('btn-calculate');
    btn.disabled = !(age && biliMg);

    // Update Charts
    if (AppState.calculated) {
        renderResults(age, biliMg, hasRisk);
    }

    // Always draw charts with available data (dynamic)
    drawBhutaniChart('bhutani-chart', age ? age.hours : null, biliMg);
    drawBhutaniChart('bhutani-chart-mini', age ? age.hours : null, biliMg);
    drawPhototherapyChart('photo-chart', AppState.gestationalAge, hasRisk, age ? age.hours : null, biliMg);
}

function calculateAge() {
    if (!AppState.birthDate || !AppState.assessmentDate) return null;

    // Default times to 00:00 if not set, but inputs usually handle this
    const bTime = AppState.birthTime || '00:00';
    const aTime = AppState.assessmentTime || '00:00';

    const birth = new Date(`${AppState.birthDate}T${bTime}`);
    const assess = new Date(`${AppState.assessmentDate}T${aTime}`);

    if (isNaN(birth.getTime()) || isNaN(assess.getTime())) return null;

    const diffMs = assess - birth;
    if (diffMs < 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    return { hours: diffHours, days: diffDays, remainingHours };
}

function getBilirubinMg() {
    if (!AppState.bilirubin) return null;
    const value = parseFloat(AppState.bilirubin);
    if (isNaN(value)) return null;
    return AppState.bilirubinUnit === 'umol' ? value / 17.1 : value;
}

function checkRiskFactors() {
    const rf = AppState.riskFactors;
    return rf.hemolysis || rf.g6pd || rf.sepsis || rf.acidosis ||
        rf.albumin || rf.asphyxia || rf.lethargy || rf.temperatureInstability ||
        parseInt(AppState.gestationalAge) < 38;
}

// ==========================================
// Logic & Calculation
// ==========================================

function renderResults(age, biliMg, hasRisk) {
    if (!age || biliMg === null) return;

    const hours = age.hours;
    const ga = Math.min(40, Math.max(35, parseInt(AppState.gestationalAge)));

    // Bhutani Zone
    const highRiskLine = getZoneValue(BHUTANI_ZONES.highRisk, hours);
    const highIntLine = getZoneValue(BHUTANI_ZONES.highIntermediate, hours);
    const lowIntLine = getZoneValue(BHUTANI_ZONES.lowIntermediate, hours);

    let bhutaniZone, riskLevel, riskColor, urgency;
    if (biliMg >= highRiskLine) {
        bhutaniZone = 'Vùng nguy cơ CAO';
        riskLevel = 'critical';
        riskColor = '#DC2626';
    } else if (biliMg >= highIntLine) {
        bhutaniZone = 'Vùng nguy cơ TRUNG BÌNH CAO';
        riskLevel = 'high';
        riskColor = '#EA580C';
    } else if (biliMg >= lowIntLine) {
        bhutaniZone = 'Vùng nguy cơ TRUNG BÌNH THẤP';
        riskLevel = 'medium';
        riskColor = '#CA8A04';
    } else {
        bhutaniZone = 'Vùng nguy cơ THẤP';
        riskLevel = 'low';
        riskColor = '#16A34A';
    }

    // Thresholds
    const thresholdSet = hasRisk ? PHOTOTHERAPY_THRESHOLDS.withRiskFactors : PHOTOTHERAPY_THRESHOLDS.noRiskFactors;
    const gaKey = Object.keys(thresholdSet).map(Number).filter(k => k <= ga).sort((a, b) => b - a)[0] || 35;
    const photoThreshold = interpolateThreshold(thresholdSet[gaKey], hours);

    const exchangeSet = hasRisk ? EXCHANGE_THRESHOLDS.withRiskFactors : EXCHANGE_THRESHOLDS.noRiskFactors;
    const gaKeyEx = Object.keys(exchangeSet).map(Number).filter(k => k <= ga).sort((a, b) => b - a)[0] || 35;
    const exchangeThreshold = interpolateThreshold(exchangeSet[gaKeyEx], hours);

    const distPhoto = biliMg - photoThreshold;
    const distExchange = biliMg - exchangeThreshold;

    // Recommendation
    let recommendation;
    if (biliMg >= exchangeThreshold) {
        recommendation = 'CẦN THAY MÁU KHẨN CẤP';
        urgency = 'emergency';
    } else if (distExchange >= -2) {
        recommendation = 'TĂNG CƯỜNG CHĂM SÓC - GẦN NGƯỠNG THAY MÁU';
        urgency = 'critical';
    } else if (biliMg >= photoThreshold) {
        recommendation = 'CHỈ ĐỊNH CHIẾU ĐÈN';
        urgency = 'treatment';
    } else if (distPhoto >= -2) {
        recommendation = 'CẬN NGƯỠNG CHIẾU ĐÈN - THEO DÕI SÁT';
        urgency = 'warning';
    } else {
        recommendation = 'TIẾP TỤC THEO DÕI';
        urgency = 'monitor';
    }

    // Next Check
    let nextCheckHours;
    if (urgency === 'emergency' || urgency === 'critical') nextCheckHours = 2;
    else if (urgency === 'treatment') nextCheckHours = 4;
    else if (urgency === 'warning' || riskLevel === 'high') nextCheckHours = 6;
    else if (riskLevel === 'medium') nextCheckHours = 12;
    else nextCheckHours = 24;

    // Render DOM
    const resultContainer = document.getElementById('results-content');
    const placeholder = document.getElementById('results-placeholder');

    resultContainer.style.display = 'block';
    placeholder.style.display = 'none';

    // 1. Banner
    const banner = document.getElementById('result-banner');
    banner.className = `result-banner ${urgency} ${urgency === 'emergency' ? 'pulse' : ''}`;
    banner.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 12px;">
            ${getUrgencyIcon(urgency)}
        </div>
        <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: inherit;">${recommendation}</h2>
        <p style="margin: 0; opacity: 0.9;">${bhutaniZone}</p>
    `;

    // 2. Metrics
    document.getElementById('res-bili').textContent = biliMg.toFixed(1);
    document.getElementById('res-bili').style.color = riskColor;

    document.getElementById('res-photo').textContent = photoThreshold.toFixed(1);
    const dpVal = document.getElementById('res-dist-photo');
    dpVal.textContent = (distPhoto >= 0 ? '+' : '') + distPhoto.toFixed(1) + ' mg/dL';
    dpVal.style.color = distPhoto >= 0 ? '#EF4444' : '#22C55E';

    document.getElementById('res-exchange').textContent = exchangeThreshold.toFixed(1);
    const deVal = document.getElementById('res-dist-exchange');
    deVal.textContent = (distExchange >= 0 ? '+' : '') + distExchange.toFixed(1) + ' mg/dL';
    deVal.style.color = distExchange >= 0 ? '#EF4444' : '#22C55E';

    // 3. Action Box
    const actionBox = document.getElementById('action-box');
    actionBox.innerHTML = getActionContent(urgency);

    // 4. Summary
    document.getElementById('sum-ga').textContent = ga + ' tuần';
    document.getElementById('sum-age').textContent = `${hours} giờ (${age.days} ngày ${age.remainingHours} giờ)`;
    document.getElementById('sum-bili').textContent = `${biliMg.toFixed(1)} mg/dL`;
    document.getElementById('sum-risk').textContent = hasRisk ? 'Có' : 'Không';
    document.getElementById('sum-risk').style.color = hasRisk ? '#FCA5A5' : '#86EFAC';

    // 5. Next Check
    document.getElementById('next-check').textContent = `Sau ${nextCheckHours} giờ`;
}

function getUrgencyIcon(u) {
    if (u === 'emergency') return '🚨';
    if (u === 'critical') return '⚠️';
    if (u === 'treatment') return '💡';
    if (u === 'warning') return '👁';
    return '✅';
}

function getActionContent(urgency) {
    if (urgency === 'emergency') return `
        <div style="background: rgba(127, 29, 29, 0.5); border: 1px solid #DC2626; border-radius: 12px; padding: 16px;">
            <h4 style="color: #FCA5A5; margin: 0 0 12px 0;">🚨 THAY MÁU KHẨN CẤP</h4>
            <ul style="color: #FEE2E2; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Chuyển NICU ngay lập tức</li>
                <li>Chiếu đèn tăng cường liên tục trong khi chờ thay máu</li>
                <li>Truyền dịch đường tĩnh mạch</li>
                <li>Chuẩn bị máu thay: 2 lần thể tích tuần hoàn (160-180 mL/kg)</li>
            </ul>
        </div>`;
    if (urgency === 'treatment' || urgency === 'critical') return `
        <div style="background: rgba(146, 64, 14, 0.3); border: 1px solid #F59E0B; border-radius: 12px; padding: 16px;">
            <h4 style="color: #FCD34D; margin: 0 0 12px 0;">💡 CHIẾU ĐÈN QUANG TRỊ LIỆU</h4>
            <ul style="color: #FEF3C7; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Chiếu đèn tăng cường: ≥30 µW/cm²/nm, bước sóng 460-490 nm</li>
                <li>Bộc lộ tối đa diện tích da</li>
                <li>Cung cấp đủ nước, tiếp tục cho bú</li>
                <li>Kiểm tra TSB sau 4-6 giờ</li>
            </ul>
        </div>`;
    if (urgency === 'warning') return `
        <div style="background: rgba(133, 77, 14, 0.3); border: 1px solid #EAB308; border-radius: 12px; padding: 16px;">
            <h4 style="color: #FDE047; margin: 0 0 12px 0;">👁 THEO DÕI SÁT</h4>
            <ul style="color: #FEF9C3; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Kiểm tra TSB sau 6-12 giờ</li>
                <li>Tăng cường cho bú (8-12 lần/ngày)</li>
                <li>Theo dõi tốc độ tăng bilirubin</li>
            </ul>
        </div>`;
    return `
        <div style="background: rgba(22, 101, 52, 0.3); border: 1px solid #22C55E; border-radius: 12px; padding: 16px;">
            <h4 style="color: #86EFAC; margin: 0 0 12px 0;">✅ TIẾP TỤC THEO DÕI THƯỜNG QUY</h4>
            <ul style="color: #DCFCE7; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Duy trì cho bú đầy đủ</li>
                <li>Kiểm tra TSB sau 24 giờ nếu còn vàng da</li>
                <li>Tái khám theo lịch hẹn</li>
            </ul>
        </div>`;
}

// ==========================================
// SVG Chart Functions
// ==========================================

function drawBhutaniChart(containerId, ageHours, biliValue) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 800;
    const height = 450;
    const padding = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const maxHours = 144;
    const maxBili = 25;

    const scaleX = (h) => padding.left + (h / maxHours) * plotWidth;
    const scaleY = (b) => padding.top + plotHeight - (b / maxBili) * plotHeight;

    // Helper to build path string
    const linePath = (data) => {
        return data.map((d, i) => (i === 0 ? 'M' : 'L') + ` ${scaleX(d.hours)} ${scaleY(d.bili)}`).join(' ');
    };

    // Zones
    const zones = [
        { data: BHUTANI_ZONES.highRisk, color: '#DC2626', fill: 'rgba(220, 38, 38, 0.2)' },
        { data: BHUTANI_ZONES.highIntermediate, color: '#F59E0B', fill: 'rgba(245, 158, 11, 0.15)' },
        { data: BHUTANI_ZONES.lowIntermediate, color: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)' },
        { data: BHUTANI_ZONES.lowRisk, color: '#22C55E', fill: 'rgba(34, 197, 94, 0.1)' }
    ];

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="chart-svg">`;

    // Grid X
    [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144].forEach(tick => {
        svg += `<line x1="${scaleX(tick)}" y1="${padding.top}" x2="${scaleX(tick)}" y2="${padding.top + plotHeight}" stroke="rgba(148, 163, 184, 0.1)" stroke-dasharray="4,4"/>`;
        svg += `<text x="${scaleX(tick)}" y="${padding.top + plotHeight + 20}" text-anchor="middle" fill="#94A3B8" font-size="11">${tick}</text>`;
    });

    // Grid Y
    [0, 5, 10, 15, 20, 25].forEach(tick => {
        svg += `<line x1="${padding.left}" y1="${scaleY(tick)}" x2="${padding.left + plotWidth}" y2="${scaleY(tick)}" stroke="rgba(148, 163, 184, 0.15)"/>`;
        svg += `<text x="${padding.left - 12}" y="${scaleY(tick)}" text-anchor="end" dominant-baseline="middle" fill="#94A3B8" font-size="11">${tick}</text>`;
    });

    // Fill Areas (simplified stacking)
    // 1. High Risk fill
    let hrPath = linePath(BHUTANI_ZONES.highRisk);
    hrPath += ` L ${scaleX(maxHours)} ${scaleY(maxBili)} L ${scaleX(0)} ${scaleY(maxBili)} Z`;
    svg += `<path d="${hrPath}" fill="rgba(220, 38, 38, 0.2)" />`;

    // 2. High Int Fill (between High Risk and High Int)
    function getAreaPath(upper, lower) {
        let p = linePath(upper);
        // Reverse lower
        for (let i = lower.length - 1; i >= 0; i--) {
            p += ` L ${scaleX(lower[i].hours)} ${scaleY(lower[i].bili)}`;
        }
        p += " Z";
        return p;
    }

    svg += `<path d="${getAreaPath(BHUTANI_ZONES.highRisk, BHUTANI_ZONES.highIntermediate)}" fill="rgba(245, 158, 11, 0.15)" />`;
    svg += `<path d="${getAreaPath(BHUTANI_ZONES.highIntermediate, BHUTANI_ZONES.lowIntermediate)}" fill="rgba(59, 130, 246, 0.1)" />`;
    svg += `<path d="${getAreaPath(BHUTANI_ZONES.lowIntermediate, BHUTANI_ZONES.lowRisk)}" fill="rgba(34, 197, 94, 0.1)" />`;

    // Lines
    zones.forEach(z => {
        svg += `<path d="${linePath(z.data)}" fill="none" stroke="${z.color}" stroke-width="2.5" />`;
    });

    // Axes Labels
    svg += `<text x="${padding.left + plotWidth / 2}" y="${height - 10}" text-anchor="middle" fill="#CBD5E1" font-size="13">Tuổi sau sinh (giờ)</text>`;
    svg += `<text x="15" y="${padding.top + plotHeight / 2}" text-anchor="middle" fill="#CBD5E1" font-size="13" transform="rotate(-90, 15, ${padding.top + plotHeight / 2})">Bilirubin (mg/dL)</text>`;
    svg += `<text x="${width / 2}" y="20" text-anchor="middle" fill="#F1F5F9" font-size="16" font-weight="bold">BHUTANI NOMOGRAM</text>`;

    // Patient Point
    if (ageHours !== null && biliValue !== null && ageHours <= maxHours) {
        const cx = scaleX(ageHours);
        const cy = scaleY(biliValue);
        svg += `<circle cx="${cx}" cy="${cy}" r="8" fill="#FFF" stroke="#FFF" stroke-width="2" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="12" fill="#FFF" opacity="0.3" />`;
        // Tooltip
        svg += `<rect x="${cx + 10}" y="${cy - 30}" width="90" height="40" rx="4" fill="rgba(15,23,42,0.9)" stroke="#FFF" />`;
        svg += `<text x="${cx + 55}" y="${cy - 12}" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">${biliValue.toFixed(1)} mg/dL</text>`;
        svg += `<text x="${cx + 55}" y="${cy + 4}" text-anchor="middle" fill="#94A3B8" font-size="10">${ageHours}h tuổi</text>`;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
}

function drawPhototherapyChart(containerId, ga, hasRisk, ageHours, biliValue) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const maxHours = 120;
    const maxBili = 25;
    const scaleX = (h) => padding.left + (h / maxHours) * plotWidth;
    const scaleY = (b) => padding.top + plotHeight - (b / maxBili) * plotHeight;

    const gaNum = parseInt(ga);
    const thresholdSet = hasRisk ? PHOTOTHERAPY_THRESHOLDS.withRiskFactors : PHOTOTHERAPY_THRESHOLDS.noRiskFactors;

    // GAs to plot
    const gas = [35, 36, 37, 38, 40];
    const colors = ['#EF4444', '#F59E0B', '#EAB308', '#22C55E', '#3B82F6'];

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="chart-svg">`;

    // Grid
    [0, 24, 48, 72, 96, 120].forEach(tick => {
        svg += `<line x1="${scaleX(tick)}" y1="${padding.top}" x2="${scaleX(tick)}" y2="${padding.top + plotHeight}" stroke="rgba(148, 163, 184, 0.1)" stroke-dasharray="4,4"/>`;
        svg += `<text x="${scaleX(tick)}" y="${padding.top + plotHeight + 20}" text-anchor="middle" fill="#94A3B8" font-size="11">${tick}h</text>`;
    });
    [0, 5, 10, 15, 20, 25].forEach(tick => {
        svg += `<line x1="${padding.left}" y1="${scaleY(tick)}" x2="${padding.left + plotWidth}" y2="${scaleY(tick)}" stroke="rgba(148, 163, 184, 0.15)"/>`;
        svg += `<text x="${padding.left - 12}" y="${scaleY(tick)}" text-anchor="end" dominant-baseline="middle" fill="#94A3B8" font-size="11">${tick}</text>`;
    });

    // Lines
    gas.forEach((g, i) => {
        const t = thresholdSet[g];
        if (!t) return;
        const points = Object.entries(t).map(([h, b]) => ({ h: Number(h), b })).sort((a, b) => a.h - b.h);
        const d = points.map((p, idx) => (idx === 0 ? 'M' : 'L') + ` ${scaleX(p.h)} ${scaleY(p.b)}`).join(' ');

        // Determine style
        const active = (g === gaNum) || (gaNum > 40 && g === 40); // 40 line covers >40
        const opacity = active ? 1 : 0.3;
        const strokeWidth = active ? 4 : 2;

        svg += `<path d="${d}" fill="none" stroke="${colors[i]}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
    });

    // Patient Point
    if (ageHours !== null && biliValue !== null && ageHours <= maxHours) {
        const cx = scaleX(ageHours);
        const cy = scaleY(biliValue);
        svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="#FFF" />`;
    }

    svg += `<text x="${width / 2}" y="20" text-anchor="middle" fill="#F1F5F9" font-size="16" font-weight="bold">NGƯỠNG CHIẾU ĐÈN (AAP 2022)</text>`;
    svg += `</svg>`;
    container.innerHTML = svg;
}

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            // Add active
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');

            // Refresh UI (charts) when tab changes
            updateUI();
        });
    });

    // 2. Input Listeners
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const name = e.target.name;
            const value = e.target.value;
            const type = e.target.type;

            if (name.startsWith('risk_')) {
                const key = name.replace('risk_', '');
                AppState.riskFactors[key] = e.target.checked;
                // Add visual checked state
                e.target.closest('.risk-item').classList.toggle('checked', e.target.checked);
            } else if (e.target.dataset.state) {
                // Direct mapping
                AppState[e.target.dataset.state] = value;
            }

            // Update UI state (like converting units)
            updateUI();
        });
    });

    // 3. Calculate Button
    const btn = document.getElementById('btn-calculate');
    btn.addEventListener('click', () => {
        AppState.calculated = true;
        updateUI();
        // Switch to Results tab
        document.querySelector('[data-tab="results"]').click();

        // Scroll to top
        document.querySelector('.tool-header').scrollIntoView({ behavior: 'smooth' });
    });

    // 4. Kramer Logic
    const kramerItems = document.querySelectorAll('.kramer-item');
    kramerItems.forEach(item => {
        item.addEventListener('click', () => {
            kramerItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const zone = parseInt(item.dataset.zone);

            const msg = document.getElementById('kramer-message');
            msg.style.display = 'block';

            let color, borderColor, bg, text, subtext;
            if (zone >= 4) {
                color = '#FCA5A5';
                borderColor = '#DC2626';
                bg = 'rgba(220, 38, 38, 0.2)';
                text = '⚠️ VÀNG DA NẶNG - CẦN XÉT NGHIỆM VÀ ĐIỀU TRỊ NGAY';
                subtext = 'Đưa trẻ đến cơ sở y tế ngay.';
            } else if (zone >= 3) {
                color = '#FCD34D';
                borderColor = '#F59E0B';
                bg = 'rgba(245, 158, 11, 0.2)';
                text = '⚡ VÀNG DA TRUNG BÌNH - CẦN XÉT NGHIỆM';
                subtext = 'Cần xét nghiệm bilirubin máu.';
            } else {
                color = '#86EFAC';
                borderColor = '#22C55E';
                bg = 'rgba(34, 197, 94, 0.2)';
                text = '✅ VÀNG DA NHẸ';
                subtext = 'Tiếp tục theo dõi.';
            }

            msg.style.backgroundColor = bg;
            msg.style.borderColor = borderColor;
            msg.innerHTML = `<h4 style="margin:0 0 8px 0; color:${color}">${text}</h4><p style="margin:0">${subtext}</p>`;
        });
    });

    // Initial UI
    updateUI();
});
