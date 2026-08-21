'use strict';


const CONFIG = {
    introLines : ['Apaan nih...'],
    pin : '0426',
    pinHint : 'petunjuk: tanggal ulang tahun kita berdua',
    recipientName : 'My BFF',
    welcomeSubtitle : 'Selamat Ulang Tahun, Indahhh!',
    menuTitle : 'My Best Friend Forever',
    note : {
        text: 'cie udah 20 aja, jadi gak sabar deh ketemu kamu lagi, walaupun belum ada sebulan tapi aku dah kangen bangettttt',
        signature: '— Your bff',
    },
    letter : `Ndahh, aku bersyukur banget kamu pernah hadir di hidupku. Kadang aku mikir, kalau waktu itu kamu gak pernah nyari aku, mungkin aku nggak akan jadi aku yang sekarang. Entah bakal seperti apa hidupku tanpa pernah mengenal kamu dan semua cerita yang udah kita lewatin bareng.

    Aku juga benar-benar senang, bahkan mungkin lebih dari yang bisa aku ungkapin, karena setelah semua hal yang pernah terjadi di antara kita, kamu masih mau bertahan dan tetap menganggap aku sebagai temanmu. Buatku, itu bukan sesuatu yang sederhana. Dan jujur, aku sangat menghargai itu.

    Aku bangga sama kamu, Ndahh. Bangga melihat kamu yang sekarang, yang perlahan tumbuh menjadi seseorang yang lebih dewasa, lebih kuat, dan lebih baik dari sebelumnya. Mungkin kamu sendiri nggak sadar seberapa jauh kamu sudah berkembang, tapi aku bisa melihatnya.

    Kalau boleh jujur, aku berharap kita bisa punya lebih banyak waktu untuk menghabiskan hari bersama. Karena ternyata, semakin jauh waktu berjalan, semakin aku sadar kalau aku kangen banget sama kamu. Kangen ngobrol, kangen bercanda, kangen hal-hal kecil yang dulu mungkin kita anggap biasa, tapi sekarang justru jadi sesuatu yang aku rindukan.

    Dan kalau suatu hari nanti kita sudah sibuk dengan kehidupan masing-masing, aku harap kamu nggak pernah lupa kalau pernah ada seseorang yang benar-benar bersyukur karena pernah mengenal kamu, sayang kamu dan juga cinta kamu.

    Selamat ulang tahun yang ke-20, Ndahh. Terima kasih sudah hadir, terima kasih sudah bertahan, dan terima kasih sudah menjadi salah satu bagian paling berarti dari cerita hidupku. ❤️`,

    musicTitle : 'Perfect - Ed Sheeran',
    bouquetMessage : 'Sekian dari your BFF',
    closingLines : [
        'Semoga panjang umur.',
        'Semoga bahagia selalu.',
        'Terima kasih sudah hadir di hidupku.',
        'And I Love You ❤️.'
    ],
    photos: [
        { src: 'images/photo1.jpg', caption: '' },
        { src: 'images/photo2.jpg', caption: '' },
        { src: 'images/photo3.jpg', caption: '' },
        { src: 'images/photo4.JPG', caption: '' },
        { src: 'images/photo5.JPG', caption: '' },
    ],
};

const introTextEl = document.getElementById('intro-text');
const introCursorEl = document.getElementById('intro-cursor');
const screenTransition = document.getElementById('screen-transition');
let introTransitioning = false;
document.body.classList.add('intro-active');

function showIntroText() {
    introTextEl.textContent = CONFIG.introLines.join('\n');
    introCursorEl.classList.add('hide');
    introTextEl.disabled = false;
    introTextEl.classList.add('show');
}

introTextEl.addEventListener('click', () => {
    if (introTransitioning) return;
    introTransitioning = true;
    introTextEl.disabled = true;
    screenTransition.classList.add('screen-transition--active');
    setTimeout(() => {
        goToScreen('lock');
        document.body.classList.remove('intro-active');
        sakuraRunning = true;
        requestAnimationFrame(animateSakura);
        screenTransition.classList.remove('screen-transition--active');
        setTimeout(() => {
            introTransitioning = false;
        }, 700);
    }, 700);
});

setTimeout(showIntroText, 300);

const MENU_ORDER = ['note', 'voice', 'letter', 'gallery', 'cake', 'bouquet'];
let unlockedIndex = 0;          
let currentOverlayTarget = null; 

function updateMenuLocks() {
    document.querySelectorAll('.menu-card').forEach((card) => {
        const idx = MENU_ORDER.indexOf(card.dataset.target);
        const isLocked = idx > unlockedIndex;
        card.classList.toggle('menu-card--locked', isLocked);
        card.disabled = isLocked;
    });
}

const screens = document.querySelectorAll('.screen');
let previousMenuScroll = 0;

function goToScreen(name) {
    screens.forEach((s) => s.classList.remove('screen--active'));
    const target = document.querySelector(`[data-screen="${name}"]`);
    if (target) target.classList.add('screen--active');
}

function openOverlay(name) {
    goToScreen(name);
    if (name === 'note') startNoteTyping();
    if (name === 'letter') startLetterTyping();
    if (name === 'gallery') refreshCarousel();
}

function closeOverlay() {
    if (typeof voiceAudio !== 'undefined' && !voiceAudio.paused) {
        voiceAudio.pause();
    }
    if (typeof voiceAudio !== 'undefined') {
        voiceAudio.currentTime = 0;
    }
    if (currentOverlayTarget && MENU_ORDER.indexOf(currentOverlayTarget) === unlockedIndex) {
        unlockedIndex = Math.min(unlockedIndex + 1, MENU_ORDER.length - 1);
        updateMenuLocks();
    }
    currentOverlayTarget = null;
    goToScreen('menu');
}

document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', closeOverlay);
});

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
    btn.classList.remove('rippling');
    void btn.offsetWidth;
    btn.classList.add('rippling');
});

const pinDotsEl = document.getElementById('pin-dots');
const pinInput = document.getElementById('pin-input');
const pinSubmit = document.getElementById('pin-submit');
const pinHintEl = document.getElementById('pin-hint');
const lockCard = document.getElementById('lock-card');
let pinValue = '';

function renderPinDots(){
    const dots = pinDotsEl.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => dot.classList.toggle('pin-dot--filled', i < pinValue.length));
}

function addDigit(d) {
    if (pinValue.length >= 4) return;
    pinValue += d;
    renderPinDots();
}

function removeDigit() {
    pinValue = pinValue.slice(0, -1);
    renderPinDots();
}

document.getElementById('pin-keypad').addEventListener('click', (e) => {
    const key = e.target.closest('.pin-key');
    if (!key) return;
    const val = key.dataset.key;
    if (val === 'del') { removeDigit(); return; }
    if (val === 'hint') {
        pinHintEl.textContent = CONFIG.pinHint;
        return;
    }
    addDigit(val);
});

function tryUnlock() {
  if (pinValue === CONFIG.pin) {
    pinHintEl.textContent = '';
    goToScreen('welcome');
    setupWelcomeScreen();
    document.getElementById('music-player').classList.add('music-player--visible');
    bgAudio.play().catch(() => {});
  } else {
    lockCard.classList.remove('lock-card--shake');
    void lockCard.offsetWidth;
    lockCard.classList.add('lock-card--shake');
    pinHintEl.textContent = 'Bukan, indahhh.';
    pinValue = '';
    renderPinDots();
  }
}

pinSubmit.addEventListener('click', tryUnlock);
document.addEventListener('keydown', (e) => {
    if (!document.querySelector('[data-screen="lock"]').classList.contains('screen--active')) return;
    if (e.key >= '0' && e.key <= '9') addDigit(e.key);
    if (e.key === 'Backspace') removeDigit();
    if (e.key === 'Enter') tryUnlock();
});

let welcomeReady = false;
function setupWelcomeScreen() {
    if (welcomeReady) return;
    welcomeReady = true;
    const nameEl = document.getElementById('welcome-name');
    nameEl.textContent = CONFIG.recipientName;
    nameEl.style.setProperty('--type-width', `${CONFIG.recipientName.length + 1}ch`);
    document.getElementById('welcome-sub').textContent = CONFIG.welcomeSubtitle;
}

document.getElementById('open-gift-btn').addEventListener('click', () => {
    document.getElementById('menu-title').textContent = CONFIG.menuTitle;
    goToScreen('menu');
    updateMenuLocks();
});


document.getElementById('menu-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    if (!card) return;
    if (card.classList.contains('menu-card--locked')) return;
    const target = card.dataset.target;
    currentOverlayTarget = target;
    prepareOverlay(target);
    openOverlay(target);
});

const noteTextEl = document.getElementById('note-text');
const noteSignatureEl = document.getElementById('note-signature');
let noteTyped = false;
let noteTypeTimer = null;

function startNoteTyping() {
    if (noteTyped) return;
    noteTyped = true;
    const full = CONFIG.note.text;
    let i = 0;
    noteTextEl.textContent = '';
    noteSignatureEl.style.opacity = '0';
    clearInterval(noteTypeTimer);
    noteTypeTimer = setInterval(() => {
        noteTextEl.textContent = full.slice(0, i);
        i++;
        if (i > full.length) {
            clearInterval(noteTypeTimer);
            noteSignatureEl.style.opacity = '1';
        }
    }, 50);
}

function prepareOverlay(target) {
    if (target === 'note') {
        noteSignatureEl.textContent = CONFIG.note.signature;
    }
    if (target === 'bouquet') {
        document.getElementById('bouquet-message').textContent = CONFIG.bouquetMessage;
    }
}


const voiceAudio = document.getElementById('voice-audio');
const voicePlayBtn = document.getElementById('voice-play');
const voicePlayIcon = document.getElementById('voice-play-icon');
const voiceWave = document.getElementById('voice-wave');
const voiceFill = document.getElementById('voice-progress-fill');
const voiceCurrent = document.getElementById('voice-current');
const voiceDuration = document.getElementById('voice-duration');

for (let i = 0; i< 22; i++) {
    const bar = document.createElement('span');
    voiceWave.appendChild(bar);
}

function formatTime(sec){
    if (!isFinite (sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

let bgVolumeBeforeFade = null;
let fadeTimer = null;

function fadeAudio(audio, targetVolume, duration) {
    clearInterval(fadeTimer);
    const startVolume = audio.volume;
    const startTime = performance.now();
    fadeTimer = setInterval(() => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * t;
        if (t >= 1) {
            clearInterval(fadeTimer);
            if (targetVolume === 0) audio.pause();
        }
    }, 30);
}

function handleVoiceStop() {
    voicePlayIcon.className = 'fa-solid fa-play';
    voiceWave.classList.remove('is-playing');
    voiceWave.querySelectorAll('span').forEach((bar) => {
        bar.style.removeProperty('animation');
        bar.style.removeProperty('animation-delay');
    });
    if (bgVolumeBeforeFade !== null) {
        const target = bgVolumeBeforeFade;
        bgVolumeBeforeFade = null;
        bgAudio.play().catch(() => {});
        fadeAudio(bgAudio, target, 800);
    }
}

voicePlayBtn.addEventListener('click', () => {
    if (voiceAudio.paused) {
        voiceAudio.play().catch(() => {});
    } else {
        voiceAudio.pause();
    }
});
voiceAudio.addEventListener('play', () => {
    voicePlayIcon.className = 'fa-solid fa-pause';
    voiceWave.classList.add('is-playing');
    voiceWave.querySelectorAll('span').forEach((bar, index) => {
        bar.style.setProperty('animation', 'wave-bounce 1s ease-in-out infinite', 'important');
        bar.style.setProperty('animation-delay', `${index * -0.08}s`, 'important');
    });
    if (!bgAudio.paused) {
        bgVolumeBeforeFade = bgAudio.volume;
        fadeAudio(bgAudio, 0, 600);
    }
});
voiceAudio.addEventListener('pause', handleVoiceStop);
voiceAudio.addEventListener('loadedmetadata', () => {
    voiceDuration.textContent = formatTime(voiceAudio.duration);
});
voiceAudio.addEventListener('timeupdate', () => {
    voiceCurrent.textContent = formatTime(voiceAudio.currentTime);
    if (isFinite(voiceAudio.duration)) {voiceFill.style.width = `${(voiceAudio.currentTime / voiceAudio.duration) * 100}%`;}
});
voiceAudio.addEventListener('ended', handleVoiceStop);


const letterTextEl = document.getElementById('letter-text');
const letterCursorEl = document.getElementById('letter-cursor');
let letterTyped = false;
let letterTypeTimer = null;

function startLetterTyping() {
    if (letterTyped) return;
    letterTyped = true;
    const full = CONFIG.letter;
    let i = 0;
    letterTextEl.textContent = '';
    letterCursorEl.classList.remove('hide');
    clearInterval(letterTypeTimer);
    letterTypeTimer = setInterval(() => {
        letterTextEl.textContent = full.slice(0, i);
        i++;
        if (i > full.length) {
            clearInterval(letterTypeTimer);
            letterCursorEl.classList.add('hide');
            
        }
    }, 18);
}


const carouselTrack = document.getElementById('carousel-track');
const carouselDots = document.getElementById('carousel-dots');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
let carouselIndex = 0;
let carouselBuilt = false;

function buildCarousel() {
    if (carouselBuilt) return;
    carouselBuilt = true;
    CONFIG.photos.forEach((photo, i) => {
        const li = document.createElement('li');
        const img =document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption || `Our Photo ${i + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(photo.src));
        li.appendChild(img);
        if (photo.caption) {
            const cap = document.createElement('span');
            cap.className = 'photo-caption';
            cap.textContent = photo.caption;
            li. appendChild(cap);
        }
        carouselTrack.appendChild(li);

        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => { carouselIndex = i; updateCarousel(); });
        carouselDots.appendChild(dot);
    });
}

function updateCarousel() {
    const max = CONFIG.photos.length - 1;
    carouselIndex = Math.max(0, Math.min(max, carouselIndex));
    carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    carouselDots.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('carousel-dot--active', i === carouselIndex);
    });
}

function refreshCarousel() {
    buildCarousel();
    updateCarousel();
}

carouselPrev.addEventListener('click', () => { carouselIndex--; updateCarousel(); });
carouselNext.addEventListener('click', () => { carouselIndex++; updateCarousel(); });


let touchStartX = null;
carouselTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
carouselTrack.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40) carouselIndex--;
    if (dx < -40) carouselIndex++;
    updateCarousel();
    touchStartX = null;
}, { passive: true });

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('lightbox--open');
}
function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });



const flameEl = document.getElementById('flame');
const smokeEl = document.getElementById('smoke');
const cakeCheer = document.getElementById('cake-cheer');
const balloonsWrap = document.getElementById('balloons');
const cakeHint = document.getElementById('cake-hint');
let candleBlown = false;

function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;
    flameEl.classList.add('flame--out');
    smokeEl.classList.add('smoke--rise');
    cakeCheer.classList.add('cake-cheer--show');
    cakeHint.style.opacity = '0';
    spawnBalloons();
    triggerConfetti();
    spawnFloatHearts(18);
}

flameEl.addEventListener('click', blowCandle);
flameEl.addEventListener('touchstart', (e) => { e.preventDefault(); blowCandle();}, { passive: false});

const balloonColors = ['#FFC0CB', '#FADADD', '#F8BBD0', '#E3B978', '#ffffff'];
function spawnBalloons() {
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('div');
        b.className = 'baloon rise';
        b.style.left = `${10 + Math.random() * 80}%`;
        b.style.background = `radial-gradient(circle at 35% 30%, #fff, ${balloonColors[i % balloonColors.length]})`;
        b.style.setProperty('--bx', `${(Math.random() - 0.5) * 120}px`);
        b.style.setProperty('--br', `${(Math.random() - 0.5) * 40}deg`);
        b.style.animationDelay = `${Math.random() * 0.5}s`;
        balloonsWrap.appendChild(b);
        setTimeout(() => b.remove(), 4200);
    }
}


document.getElementById('menu-grid').addEventListener('click', (e) => {
    if (!e.target.closest('[data-target="cake"]')) return;
    candleBlown = false;
    flameEl.classList.remove('flame--out');
    smokeEl.classList.remove('smoke--rise');
    cakeCheer.classList.remove('cake-cheer--show');
    cakeHint.style.opacity = '1';
});



const bouquetBtn = document.getElementById('bouquet-btn');
const bouquetMessageEl = document.getElementById('bouquet-message');
bouquetBtn.addEventListener('click', () => {
    bouquetBtn.classList.add('bouquet--open');
    bouquetMessageEl.classList.add('bouquet-massage--show');
    spawnFloatHearts(12);
    setTimeout(() => {
        goToScreen('closing');
        renderClosing();
    }, 1400);
});




let closingRendered = false;
function renderClosing() {
    if (closingRendered) return;
    closingRendered = true;
    const wrap = document.getElementById('closing-lines');
    CONFIG.closingLines.forEach((line, i) => {
        const span = document.createElement('span');
        span.textContent = line;
        span.style.animationDelay = `${0.3 + i * 0.25}s`;
        wrap.appendChild(span);
        });
        triggerConfetti();
}

document.getElementById('restart-btn').addEventListener('click', () => {
    goToScreen('menu');
});


const bgAudio = document.getElementById('bg-audio');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const musicDisc = document.getElementById('music-disc');
const musicFill = document.getElementById('music-progress-fill');
const musicProgressTrack = document.getElementById('music-progress-track');
const musicVolume = document.getElementById('music-volume');

document.getElementById('music-title').textContent = CONFIG.musicTitle;
bgAudio.volume = parseFloat(musicVolume.value);

musicToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
        if (!voiceAudio.paused) return;
        bgAudio.play().catch(() => {});
    }else {
        bgAudio.pause();
    }
});
bgAudio.addEventListener('play', () => {
    if (!voiceAudio.paused) {
        bgAudio.pause();
        return;
    }
    musicIcon.className = 'fa-solid fa-pause';
    musicDisc.classList.add('music-disc--spin');
});
bgAudio.addEventListener('pause', () => {
    musicIcon.className = 'fa-solid fa-play';
    musicDisc.classList.remove('music-disc--spin');
});
bgAudio.addEventListener('timeupdate', () => {
    const pct = (bgAudio.currentTime / (bgAudio.duration || 1)) * 100;
    musicFill.style.width = `${pct}%`;
});
musicProgressTrack.addEventListener('click', (e) => {
    const rect = musicProgressTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (isFinite(bgAudio.duration)) bgAudio.currentTime = pct * bgAudio.duration;
});
musicVolume.addEventListener('input', () => { bgAudio.volume = parseFloat(musicVolume.value); });



const sakuraCanvas = document.getElementById('sakura-canvas');
const sctx = sakuraCanvas.getContext('2d');
let petals = [];
let sakuraRunning = false;

function resizeCanvas() {
    sakuraCanvas.width = window.innerWidth;
    sakuraCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function makePetal() {
    const z = 0.5 + Math.random() * 0.6;
    return {
        x: Math.random() * sakuraCanvas.width,
        y: -20 - Math.random() * 100,
        size: (4 + Math.random() * 7) * z,
        z,
        speedY: (0.45 + Math.random() * 0.85) * z,
        wind: Math.random() * 0.35 - 0.175,
        opacity: 0.28 + Math.random() * 0.42,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.4,
        rotY: Math.random() * Math.PI * 2,
        rotYSpeed: 0.012 + Math.random() * 0.026,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.012,
        flutter: 0.5 + Math.random() * 1.2,
    };
}

const PETAL_COUNT = window.innerWidth < 700 ? 16 : 26;
for (let i = 0; i < PETAL_COUNT; i++) {
    const p = makePetal();
    p.y = Math.random() * sakuraCanvas.height;
    petals.push(p);
}

function drawPetal(p) {
    sctx.save();
    sctx.translate(p.x, p.y);
    sctx.rotate((p.rot * Math.PI) / 180);
    sctx.globalAlpha = p.opacity;

    const flip = Math.cos(p.rotY);
    const scaleX = Math.max(0.15, Math.abs(flip));
    sctx.scale(scaleX * p.z, p.z);

    const isBack = flip < 0;
    const grad = sctx.createLinearGradient(-p.size / 2, -p.size / 2, p.size / 2, p.size);
    if (isBack) {
        grad.addColorStop(0, 'rgba(196, 106, 138, 0.9)');
        grad.addColorStop(1, 'rgba(230, 150, 175, 0.7)');
    } else {
        grad.addColorStop(0, 'rgba(255, 214, 229, 0.95)');
        grad.addColorStop(1, 'rgba(240, 160, 190, 0.75)');
    }
    sctx.fillStyle = grad;

    sctx.shadowColor = 'rgba(120, 40, 70, 0.12)';
    sctx.shadowBlur = 2 * p.z;
    sctx.shadowOffsetY = 1 * p.z;

    sctx.beginPath();
    sctx.moveTo(0, -p.size / 2);
    sctx.bezierCurveTo(p.size * 0.65, -p.size * 0.35, p.size * 0.4, p.size * 0.7, p.size * 0.05, p.size);
    sctx.bezierCurveTo(-p.size * 0.5, p.size * 0.65, -p.size * 0.55, -p.size * 0.25, 0, -p.size / 2);
    sctx.fill();

    sctx.shadowBlur = 0;
    sctx.strokeStyle = isBack ? 'rgba(160, 90, 115, 0.4)' : 'rgba(255, 255, 255, 0.5)';
    sctx.lineWidth = 0.6;
    sctx.beginPath();
    sctx.moveTo(0, -p.size / 2);
    sctx.lineTo(0, p.size);
    sctx.stroke();

    sctx.restore();
}

function animateSakura() {
    if (!sakuraRunning) return;
    sctx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);
    petals
        .slice()
        .sort((a, b) => a.z - b.z)
        .forEach((p) => {
            p.sway += p.swaySpeed;
            p.y += p.speedY;
            p.x += p.wind + Math.sin(p.sway) * p.flutter;
            p.rot += p.rotSpeed + Math.sin(p.sway * 0.7) * 0.08;
            p.rotY += p.rotYSpeed;
            if (p.y > sakuraCanvas.height + 20) {
                Object.assign(p, makePetal());
                p.y = -20;
            }
            drawPetal(p);
        });
    requestAnimationFrame(animateSakura);
}

requestAnimationFrame(animateSakura);

document.addEventListener('visibilitychange', () => {
    sakuraRunning = !document.hidden && !document.body.classList.contains('intro-active');
    if (sakuraRunning) requestAnimationFrame(animateSakura);
});



const heartsLayer = document.getElementById('hearts-layer');
const sparkleLayer = document.getElementById('sparkle-layer');

function spawnFloatHearts(count = 6) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const h = document.createElement('i');
            h.className = 'fa-solid fa-heart floater-heart';
            h.style.left = `${Math.random() * 100}%`,
            h.style.fontSize = `${10 + Math.random() * 14}px`;
            h.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
            h.style.animationDuration = `${5 + Math.random() * 4}s`;
            heartsLayer.appendChild(h);
            setTimeout(() => h.remove(), 9500);
        }, i * 120);
    }
}

setInterval(() => spawnFloatHearts(1), 3200);

function spawnSparkle() {
    const s = document.createElement('span');
    s.className = 'floater-sparkle';
    s.textContent = '✦';
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.fontSize = `${8 + Math.random() * 8}px`;
    s.style.color = Math.random() > 0.5 ? '#E3B978' : '#F8BBD0';
    s.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
    sparkleLayer.appendChild(s);
    setTimeout(() => s.remove(), 3200);
}
setInterval(spawnSparkle, 700);



const cursorPetal = document.getElementById('cursor-petal');
let lastPetalTime = 0;
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastPetalTime < 90) return;
        lastPetalTime = now;
        const petal = document.createElement('span');
        petal.textContent = '🌸';
        petal.className = 'cursor-petal';
        petal.style.left = `${e.clientX}px`;
        petal.style.top = `${e.clientY}px`;
        petal.style.opacity = '0.8';
        petal.style.transform = 'translate(-50%, -50%) scale(1)';
        petal.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        document.body.appendChild(petal);
        requestAnimationFrame(() => {
            petal.style.transform = 'translate(-50%, 40px) scale(0.4) rotate(60deg)';
            petal.style.opacity = '0';
        });
        setTimeout(() => petal.remove(), 1050);
    });
}



const confettiCanvas = document.getElementById('confetti-canvas');
const cctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiRunning = false;
const confettiColors = ['#FADADD', '#FFC0CB', '#F8BBD0', '#E0668C', '#E3B978', '#FFFFFF'];

function triggerConfetti(amount = 140) {
    for (let i = 0; i < amount; i++) {
        confettiParticles.push({
            x: confettiCanvas.width / 2 + (Math.random() - 0.5)* 200,
            y: confettiCanvas.height * 0.35 + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 9,
            vy: -Math.random() * 10 - 4,
            size: 5 + Math.random() * 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rot: Math.random()* 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            life: 0,
            maxLife: 100 + Math.random() * 60,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
    }
    if (!confettiRunning) {
        confettiRunning = true;
        requestAnimationFrame(animateConfetti);
    }
}

function animateConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p) => {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        cctx.save();
        cctx.globalAlpha = alpha;
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rot * Math.PI) / 180);
        cctx.fillStyle = p.color;
        if (p.shape === 'rect') {
            cctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66); 
        }else {
            cctx.beginPath();
            cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            cctx.fill();
        }
        cctx.restore()
    });
    confettiParticles = confettiParticles.filter((p) => p.life < p.maxLife && p.y < confettiCanvas.height + 40);
    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else{
        confettiRunning = false;
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}





