// --- DOM Elements ---
const pageContent = document.getElementById('page-content');
const mainHeader = document.getElementById('main-header');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');
const backButton = document.getElementById('back-button');
const modal = document.getElementById('tadabbur-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close');
const prayerAlert = document.getElementById('prayer-alert');

let fullDzikirData = { pagi: dzikirDataPagi, petang: dzikirDataPetang };
let countdownInterval;
let lastPrayerAlertTime = null;
let alertCountdownInterval = null; // Interval for the alert countdown

// --- App Logic ---

function renderLandingPage() {
    mainHeader.style.display = "none";
    backButton.classList.add('hidden');
    pageContent.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[85vh] text-center p-4">
            <!-- Prayer Times Widget -->
            <div id="prayer-widget" class="glass-card w-full max-w-2xl p-6 mb-8 fade-in">
                <p class="text-lg" style="color: var(--light-blue);" id="location-info">Jadwal Sholat untuk Wilayah Bandung</p>
                <p id="live-clock" class="text-4xl md:text-5xl font-bold text-white tracking-wider my-2">00:00:00</p>
                <p id="gregorian-date" class="text-base text-slate-300 mb-4">Memuat tanggal...</p>
                <div class="mb-6 p-4 rounded-2xl bg-black/20">
                    <p class="font-semibold" style="color: var(--highlight-yellow);" id="next-prayer-name">Menuju Sholat Berikutnya</p>
                    <p class="text-3xl md:text-4xl font-bold text-white" id="countdown-timer">Memuat...</p>
                </div>
                <div id="prayer-times-container" class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div class="col-span-full text-slate-400 p-4">Memuat jadwal...</div>
                </div>
                 <div id="gemini-feature" class="mt-6 pt-6 border-t border-white/10">
                    <button id="gemini-feature-btn" class="font-semibold text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300">
                        ✨ Minta Mutiara Hikmah
                    </button>
                    <div id="gemini-response-container" class="text-slate-300">
                        Sentuh tombol untuk mendapatkan inspirasi harian.
                    </div>
                </div>
            </div>
            <div class="w-full max-w-2xl fade-in" style="animation-delay: 0.2s;">
                 <h2 class="text-2xl font-bold text-white mb-4">Pilih Waktu Dzikir</h2>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div id="menu-pagi" class="glass-card menu-card">Dzikir Pagi</div>
                    <div id="menu-petang" class="glass-card menu-card">Dzikir Petang</div>
                </div>
            </div>
        </div>
    `;
    
    initializePrayerWidget();
    document.getElementById('menu-pagi').addEventListener('click', () => renderDzikirPage('pagi'));
    document.getElementById('menu-petang').addEventListener('click', () => renderDzikirPage('petang'));
    document.getElementById('gemini-feature-btn').addEventListener('click', getDailyWisdom);
}

function renderDzikirPage(type) {
    const data = fullDzikirData[type];
    const title = type === 'pagi' ? 'Dzikir Pagi' : 'Dzikir Petang';
    
    mainHeader.style.display = "block";
    headerTitle.textContent = "Al-Ma'tsurat Sugro";
    headerSubtitle.textContent = title;
    backButton.classList.remove('hidden');
    pageContent.innerHTML = `<div class="space-y-6">${data.map(createDzikirCard).join('')}</div>`;

    data.forEach((dzikir) => {
        const card = document.getElementById(`card-${dzikir.id}`);
        const tadabburBtn = document.getElementById(`tadabbur-${dzikir.id}`);

        card.addEventListener('click', (e) => {
            if (e.target.closest('.tadabbur-btn')) return;
            
            const totalTaps = parseInt(card.dataset.totalTaps);
            let currentTaps = parseInt(card.dataset.currentTaps);
            
            if (currentTaps < totalTaps) {
                currentTaps++;
                card.dataset.currentTaps = currentTaps;
                updateCardUI(dzikir.id, currentTaps, totalTaps);
            }
        });

        tadabburBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showTadabburModal(dzikir);
        });
    });
}

function renderAboutPage() {
    mainHeader.style.display = "block";
    headerTitle.textContent = "Tentang Aplikasi";
    headerSubtitle.textContent = "Informasi dan Sumber Data";
    backButton.classList.remove('hidden');
    
    pageContent.innerHTML = `
        <div class="space-y-6 text-left">
            <div class="glass-card p-6 fade-in">
                <h3 class="text-xl font-bold text-white mb-3" style="color:var(--highlight-yellow)">Progressive Web App</h3>
                <p class="text-slate-300 leading-relaxed">
                    Sebagai sebuah karya digital yang inovatif dari <strong>Rachdian Habi Yahya</strong>, aplikasi ini hadir dalam bentuk <strong>Progressive Web App (PWA)</strong> canggih yang dirancang untuk memperkaya pengalaman spiritual harian Anda. Aplikasi ini secara dinamis mengintegrasikan amalan dzikir Al-Ma'tsurat Sugro dengan informasi jadwal shalat yang akurat untuk wilayah Bandung, disajikan melalui antarmuka <em>liquid glass</em> yang modern dan sangat responsif. Tujuannya adalah untuk memberikan pengalaman yang tidak hanya menenangkan, tetapi juga fungsional dan memberdayakan.
                </p>
            </div>
            <div class="glass-card p-6 fade-in" style="animation-delay: 0.1s;">
                <h3 class="text-xl font-bold text-white mb-3" style="color:var(--highlight-yellow)">Open Source & Kontribusi</h3>
                <p class="text-slate-300 leading-relaxed">
                    Terinspirasi dari aliiflam.com, website ini dirancang open source, silahkan berkontribusi aktif, bila ada kesalahan dalam website terutama ayat dan doa mohon untuk melaporkan ke <a href="mailto:rachdiaaan@gmail.com" class="underline" style="color:var(--light-blue)">rachdiaaan@gmail.com</a>. Jika setelah ada balasan email konfirmasi perbaikan namun belum terlihat perubahan, silahkan hapus uninstall website/hapus cache/hard reload website ini, terima kasih.
                </p>
            </div>
            <div class="glass-card p-6 fade-in" style="animation-delay: 0.2s;">
                <h3 class="text-xl font-bold text-white mb-3" style="color:var(--highlight-yellow)">Sumber Data</h3>
                <ul class="list-disc list-inside text-slate-300 space-y-2">
                    <li><a href="https://quran.com" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color:var(--light-blue)">quran.com</a></li>
                    <li><a href="https://almatsurat.net" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color:var(--light-blue)">almatsurat.net</a></li>
                    <li><a href="https://radioadzanfmbandung.com" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color:var(--light-blue)">radioadzanfmbandung.com</a></li>
                </ul>
            </div>
        </div>
    `;
}

function createDzikirCard(dzikir) {
    let contentHtml = '';
    const items = dzikir.verses || dzikir.content;
    items.forEach(item => {
        contentHtml += `
            <div class="mt-4 pt-4 border-t border-white/10 first:border-t-0 first:pt-0 first:mt-2">
                ${item.ayat_number ? `<p class="text-md font-bold mb-2" style="color: var(--light-blue)">Ayat ${item.ayat_number} ${item.title_extra || ''}</p>` : ''}
                <p class="arabic-text mb-4">${item.arabic}</p>
                <p class="text-sm italic mb-2" style="color: var(--light-blue); opacity: 0.8;">${item.latin}</p>
                <p class="text-sm text-slate-300">${item.translation_id}</p>
            </div>`;
    });

    const subtitleHtml = dzikir.subtitle_ar ? `
        <div class="flex items-center justify-between text-slate-400">
            <p class="font-medium">${dzikir.subtitle_en} - ${dzikir.translation}</p>
            <p class="text-lg" dir="rtl">${dzikir.subtitle_ar}</p>
        </div>` : '';

    return `
        <div id="card-${dzikir.id}" class="card glass-card p-6 card-clickable" data-total-taps="${dzikir.total_taps}" data-current-taps="0">
            <div class="flex justify-between items-start">
                <div class="flex-grow pr-4">
                     <h2 class="text-xl font-bold text-white">${dzikir.title}</h2>
                    ${subtitleHtml}
                </div>
                <button id="tadabbur-${dzikir.id}" class="tadabbur-btn bg-white/5 text-sm py-1 px-3 rounded-full ml-2 flex-shrink-0 hover:bg-white/10 transition-colors duration-300 border-0" style="color: var(--highlight-yellow);">✨ Tadabbur</button>
            </div>
            <div class="content-container">${contentHtml}</div>
            <div class="mt-6">
                <div class="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                    <span>Hitungan</span>
                    <span id="tap-count-${dzikir.id}">0 / ${dzikir.total_taps}</span>
                </div>
                <div class="rounded-full overflow-hidden" style="background-color: rgba(0, 0, 0, 0.2)">
                    <div id="progress-bar-${dzikir.id}" class="h-2 rounded-full" style="width: 0%; background-color: var(--highlight-yellow); transition: width 0.3s ease-in-out;"></div>
                </div>
            </div>
        </div>`;
}

function updateCardUI(id, currentTaps, totalTaps) {
    const card = document.getElementById(`card-${id}`);
    const tapCountText = document.getElementById(`tap-count-${id}`);
    const progressBar = document.getElementById(`progress-bar-${id}`);
    const progressPercentage = (currentTaps / totalTaps) * 100;
    
    tapCountText.textContent = `${currentTaps} / ${totalTaps}`;
    progressBar.style.width = `${progressPercentage}%`;

    if (currentTaps === totalTaps) {
        card.classList.add('completed');
    }
}

function initializePrayerWidget() {
    const liveClockEl = document.getElementById('live-clock');
    const gregorianDateEl = document.getElementById('gregorian-date');
    if (!liveClockEl || !gregorianDateEl) return;

    const updateClock = () => {
        const now = new Date();
        liveClockEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':');
        gregorianDateEl.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    
    setInterval(updateClock, 1000);
    updateClock();
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

function getPrayerTimes(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthData = prayerData[String(month)];
    if (!monthData) return null;
    const todayData = monthData.find(d => parseInt(d.tanggal) === day);
    if (!todayData) return null;

    const prayerNameMapping = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };
    const timings = {};
    Object.keys(prayerNameMapping).forEach(key => {
        const [hour, minute] = todayData[key].split(':');
        const prayerDate = new Date(date);
        prayerDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        timings[key] = {
            name: prayerNameMapping[key],
            time: prayerDate
        };
    });
    return timings;
}

function getNextPrayer() {
    const now = new Date();
    let todayTimings = getPrayerTimes(now);
    if (!todayTimings) return null;
    
    const sortedTimings = Object.entries(todayTimings)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => a.time - b.time);

    let nextPrayer = sortedTimings.find(p => p.time > now);

    if (!nextPrayer) {
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowTimings = getPrayerTimes(tomorrow);
        if(tomorrowTimings){
           nextPrayer = Object.entries(tomorrowTimings)
            .map(([key, value]) => ({ key, ...value }))
            .sort((a, b) => a.time - b.time)[0];
        }
    }
    return nextPrayer;
}

function showPrayerTimeAlert(nextPrayer, isManualTrigger = false) {
    const prayerAlert = document.getElementById('prayer-alert');
    const prayerAlertText = document.getElementById('prayer-alert-text');
    const prayerAlertSubtext = document.getElementById('prayer-alert-subtext');
    
    if (!prayerAlert || !prayerAlertText || !prayerAlertSubtext || !nextPrayer) return;

    if (alertCountdownInterval) clearInterval(alertCountdownInterval);

    const now = new Date();
    const diff = nextPrayer.time - now;

    if (isManualTrigger && diff > 0) {
        prayerAlertSubtext.textContent = `Waktu Shalat Selanjutnya`;

        const updateAlertCountdown = () => {
            const currentDiff = nextPrayer.time - new Date();
            if (currentDiff <= 0) {
                prayerAlertText.textContent = `${nextPrayer.name.toUpperCase()} telah tiba.`;
                if(alertCountdownInterval) clearInterval(alertCountdownInterval);
                return;
            }
            const hours = Math.floor(currentDiff / (1000 * 60 * 60));
            const minutes = Math.floor((currentDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((currentDiff % (1000 * 60)) / 1000);
            const countdownString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            prayerAlertText.textContent = `${nextPrayer.name.toUpperCase()} dalam ${countdownString}`;
        };
        updateAlertCountdown();
        alertCountdownInterval = setInterval(updateAlertCountdown, 1000);
    } else {
        prayerAlertSubtext.textContent = `SAATNYA SHALAT`;
        prayerAlertText.textContent = nextPrayer.name.toUpperCase();
    }

    prayerAlert.style.animation = 'none';
    void prayerAlert.offsetWidth;
    prayerAlert.style.animation = 'fadeInAlert 0.5s forwards';

    setTimeout(() => {
        prayerAlert.style.animation = 'fadeOutAlert 0.7s 0.3s forwards';
        if (alertCountdownInterval) clearInterval(alertCountdownInterval);
        setTimeout(() => {
            prayerAlert.style.visibility = 'hidden'; 
        }, 1000);
    }, 5000); 
}

function updateCountdown() {
    const prayerTimesContainer = document.getElementById('prayer-times-container');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const nextPrayerNameEl = document.getElementById('next-prayer-name');
    if (!prayerTimesContainer || !countdownTimerEl || !nextPrayerNameEl) return;
    
    const now = new Date();
    const allTimings = getPrayerTimes(now);
    if (!allTimings) {
        countdownTimerEl.textContent = "-";
        nextPrayerNameEl.textContent = "Jadwal tidak tersedia";
        return;
    }

    // --- Alert Logic (Robust Check) ---
    Object.values(allTimings).forEach(prayer => {
        if (now >= prayer.time && (now - prayer.time) < 5000 && lastPrayerAlertTime !== prayer.time.getTime()) {
            showPrayerTimeAlert(prayer, false);
            lastPrayerAlertTime = prayer.time.getTime();
        }
    });

    // --- Countdown and Display Logic ---
    const nextPrayer = getNextPrayer();
    if (!nextPrayer) {
        countdownTimerEl.textContent = "-";
        nextPrayerNameEl.textContent = "Jadwal hari ini selesai";
        return;
    }

    // Update prayer time cards display
    prayerTimesContainer.innerHTML = '';
    Object.entries(allTimings).forEach(([key, value]) => {
        const card = document.createElement('div');
        card.className = 'prayer-card';
        if (key === nextPrayer.key && (nextPrayer.time > now)) {
            card.classList.add('next-prayer-highlight');
        }
        card.innerHTML = `
            <p class="font-semibold text-base" style="color: var(--light-blue);">${value.name}</p>
            <p class="text-2xl font-bold text-white">${value.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')}</p>
        `;
        prayerTimesContainer.appendChild(card);
    });

    // Update countdown timer text
    const diff = nextPrayer.time - now;
    if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        nextPrayerNameEl.textContent = `Menuju Waktu ${nextPrayer.name}`;
        countdownTimerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
         nextPrayerNameEl.textContent = `Waktu ${nextPrayer.name} telah tiba`;
         countdownTimerEl.textContent = "00:00:00";
    }
}

async function getTadabbur(dzikir) {
    const prayerItems = dzikir.verses || dzikir.content;
    const fullArabicText = prayerItems.map(p => p.arabic).join(" ");
    const fullTranslation = prayerItems.map(p => p.translation_id).join(" ");

    const prompt = `Provide a brief reflection (Tadabbur) in Indonesian, around 50-70 words, on the meaning and wisdom of the following prayer. Focus on its relevance for a Muslim's daily life. Do not repeat the prayer text itself in the response. Here is the prayer:\n\nArabic: ${fullArabicText}\nTranslation: ${fullTranslation}`;
    
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();
        
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Tidak dapat memuat refleksi saat ini. Struktur respons tidak valid.";
        }
    } catch (error) {
        console.error("Error fetching Tadabbur:", error);
        return "Maaf, terjadi kesalahan saat mengambil data refleksi. Silakan coba lagi nanti.";
    }
}

async function getDailyWisdom() {
    const geminiBtn = document.getElementById('gemini-feature-btn');
    const geminiResponseContainer = document.getElementById('gemini-response-container');

    geminiBtn.disabled = true;
    geminiResponseContainer.innerHTML = '<div class="loader" style="width:24px; height:24px; border-width: 3px;"></div>';

    const nextPrayer = getNextPrayer();
    const prompt = `Berikan satu kutipan Islami singkat, atau untaian kata hikmah yang menenangkan hati dan memberikan inspirasi. Saat ini mendekati waktu ${nextPrayer?.name || 'sholat'}. Buatlah jawaban dalam 1-2 kalimat saja, dalam Bahasa Indonesia.`;
    
    try {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
            const text = result.candidates[0].content.parts[0].text;
            geminiResponseContainer.textContent = text;
        } else {
            throw new Error("Respons API tidak valid atau kosong.");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        geminiResponseContainer.textContent = "Maaf, terjadi kesalahan saat meminta hikmah. Silakan coba lagi.";
    } finally {
        geminiBtn.disabled = false;
    }
}

function showTadabburModal(dzikir) {
    modal.classList.add('visible');
    modalTitle.textContent = `Tadabbur: ${dzikir.title}`;
    modalBody.innerHTML = '<div class="loader"></div>';

    getTadabbur(dzikir).then(tadabburText => {
        modalBody.innerHTML = `<p class="text-lg leading-relaxed">${tadabburText.replace(/\n/g, '<br>')}</p>`;
    });
}

function hideTadabburModal() { modal.classList.remove('visible'); }

// --- Initial Setup & Preview Controls ---
document.addEventListener('DOMContentLoaded', () => {
    backButton.addEventListener('click', renderLandingPage);
    modalCloseBtn.addEventListener('click', hideTadabburModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideTadabburModal(); });
    
    function createPreviewControls() {
        if (document.getElementById('preview-controls')) return;

        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'preview-controls';
        controlsContainer.className = 'fixed bottom-4 right-4 z-[9999] bg-black/50 p-2 rounded-lg text-xs space-x-2 flex items-center shadow-lg backdrop-blur-sm';

        const buttons = [
            { text: 'Home', action: () => renderLandingPage(), color: 'bg-blue-500/50 hover:bg-blue-500/70' },
            { text: 'About', action: () => renderAboutPage(), color: 'bg-green-500/50 hover:bg-green-500/70' },
            { 
                text: 'Alert', 
                action: () => {
                    const nextPrayer = getNextPrayer();
                    if (nextPrayer) {
                        showPrayerTimeAlert(nextPrayer, true);
                    } else {
                        modalTitle.textContent = "Informasi";
                        modalBody.innerHTML = `<p>Tidak ada jadwal sholat berikutnya untuk ditampilkan.</p>`;
                        modal.classList.add('visible');
                    }
                }, 
                color: 'bg-red-500/50 hover:bg-red-500/70' 
            },
            {
                text: 'Docs',
                action: () => {
                    window.open('documentation.html', '_blank');
                },
                color: 'bg-purple-500/50 hover:bg-purple-500/70'
            }
        ];

        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.textContent = btnInfo.text;
            button.className = `text-white px-3 py-1.5 rounded-md transition-colors ${btnInfo.color}`;
            button.onclick = btnInfo.action;
            controlsContainer.appendChild(button);
        });

        document.body.appendChild(controlsContainer);
    }
    
    createPreviewControls();
    renderLandingPage();
});
