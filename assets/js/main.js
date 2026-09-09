/* ============ AI 视频履历 · 交互 ============ */

/* ---------- nav ---------- */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
document.getElementById('navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- reveal on scroll ---------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

/* ---------- hover 预览：悬停时才挂载静音视频，离开即暂停 ---------- */
document.querySelectorAll('.card, .phone-frame, .canvas-clip').forEach(card => {
  const media = card.querySelector('.media');
  if (!media) return;
  const preview = () => {
    let v = media.querySelector('video');
    if (!v) {
      v = document.createElement('video');
      v.src = card.dataset.video;
      v.muted = true; v.loop = true; v.playsInline = true;
      media.appendChild(v);
    }
    return v;
  };
  card.addEventListener('mouseenter', () => preview().play().catch(() => {}));
  card.addEventListener('mouseleave', () => {
    const v = media.querySelector('video');
    if (v) { v.pause(); v.currentTime = 0; }
  });
});

/* ---------- 灯箱播放器 ---------- */
const lightbox = document.getElementById('lightbox');
const lbVideo = document.getElementById('lbVideo');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbCount = document.getElementById('lbCount');
let playlist = [], idx = 0;

function openLightbox(item) {
  playlist = [...document.querySelectorAll(`[data-group="${item.dataset.group}"]`)];
  idx = Math.max(0, playlist.indexOf(item));
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  loadItem();
}
function loadItem() {
  const it = playlist[idx];
  lbVideo.src = it.dataset.video;
  lbTitle.textContent = it.dataset.title || '';
  lbDesc.textContent = it.dataset.desc || '';
  lbCount.textContent = `${idx + 1} / ${playlist.length}`;
  lbVideo.play().catch(() => {});
}
function closeLightbox() {
  lbVideo.pause(); lbVideo.removeAttribute('src'); lbVideo.load();
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function step(d) {
  if (playlist.length < 2) return;
  idx = (idx + d + playlist.length) % playlist.length;
  loadItem();
}
document.querySelectorAll('[data-video]').forEach(el =>
  el.addEventListener('click', () => openLightbox(el)));
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbBackdrop').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); step(1); });
addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

/* ---------- 分镜台：集数切换 + 胶片滚动 ---------- */
const strips = { ep1: document.getElementById('stripEP1'), ep2: document.getElementById('stripEP2') };
document.querySelectorAll('.sb-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  Object.entries(strips).forEach(([k, el]) => el.classList.toggle('hidden', k !== tab.dataset.ep));
}));
document.getElementById('stripLeft').addEventListener('click',
  () => Object.values(strips).find(s => !s.classList.contains('hidden')).scrollBy({ left: -540 }));
document.getElementById('stripRight').addEventListener('click',
  () => Object.values(strips).find(s => !s.classList.contains('hidden')).scrollBy({ left: 540 }));
