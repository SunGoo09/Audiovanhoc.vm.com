/**
 * VănHọc12 — Application Logic
 * Trích dẫn toàn bộ bài học SGK, hệ thống phân quyền Admin độc quyền,
 * Mật khẩu Viet09 và Trình phát âm thanh bài giảng tự tải lên (MP3/WAV/M4A)
 */

// App State
let state = {
  works: [],
  notes: [],
  theme: 'dark',
  currentCategory: 'all',
  currentStatus: 'all',
  currentSort: 'popular',
  searchQuery: '',
  activeWorkId: null,
  activeSectionIndex: 0,
  readerTab: 'fulltext', // 'fulltext' hoặc 'outlines'
  readerFontSize: 20,
  readerFontFamily: 'serif',
  readerTheme: 'dark',
  readerLineHeight: 'loose',
  isSpeaking: false,
  
  // Custom Wallpaper State (Hình nền web)
  customBg: '',
  bgOverlay: '70',
  bgBlur: '3',
  hasUserCustomizedBg: false,
  siteDefaultBg: '',
  siteDefaultOverlay: '70',
  siteDefaultBlur: '3',
  
  // Admin & Access Control State
  isAdmin: false,
  adminPassword: "Viet09",
  guestPermissions: { ...DEFAULT_GUEST_PERMISSIONS },

  // Firebase Cloud Sync State (Đồng bộ đám mây trực tuyến)
  cloudSync: {
    enabled: false,
    connected: false,
    db: null,
    listenersAttached: false
  }
};

const WALLPAPER_PRESETS = [
  { id: 'default', title: 'Mặc định (Nebula)', url: '', icon: '🌌' },
  { id: 'library', title: 'Thư viện hoàng hôn', url: 'https://images.unsplash.com/photo-1507842229458-5777dd623351?auto=format&fit=crop&w=1920&q=80', icon: '📚' },
  { id: 'stars', title: 'Đêm ngàn sao', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80', icon: '✨' },
  { id: 'mountains', title: 'Rừng thông sương mù', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80', icon: '🌲' },
  { id: 'ocean', title: 'Biển đêm sóng vỗ', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80', icon: '🌊' },
  { id: 'parchment', title: 'Giấy da mộc cổ điển', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1920&q=80', icon: '📜' }
];

const COVER_GRADIENT_PRESETS = [
  { name: "Tây Bắc Huyền Ảo", gradient: "linear-gradient(135deg, #0f172a 0%, #312e81 60%, #4f46e5 100%)", icon: "🏔️" },
  { name: "Sông Đà Hùng Vĩ", gradient: "linear-gradient(135deg, #091a36 0%, #0369a1 50%, #06b6d4 100%)", icon: "🚣" },
  { name: "Mùa Vàng Lúa Chín", gradient: "linear-gradient(135deg, #451a03 0%, #b45309 50%, #f59e0b 100%)", icon: "🌾" },
  { name: "Biển Sóng Hoàng Hôn", gradient: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #f43f5e 100%)", icon: "🌊" },
  { name: "Ánh Lửa Kháng Chiến", gradient: "linear-gradient(135deg, #4c0519 0%, #be123c 60%, #fb7185 100%)", icon: "🎖️" },
  { name: "Thơ Ca Mộng Mơ", gradient: "linear-gradient(135deg, #3b0764 0%, #6d28d9 60%, #a855f7 100%)", icon: "🌸" },
  { name: "Bóng Đêm Hiện Thực", gradient: "linear-gradient(135deg, #111827 0%, #1f2937 60%, #374151 100%)", icon: "📖" }
];

let currentSpeechUtterance = null;
let uploadedAudioTempData = null;
let uploadedAudioTempName = null;
let editingCoverImage = null;
let editingCoverTheme = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initTheme();
  initBackgroundSystem();
  initAdminState();
  initAudioSystem();
  initEvents();
  initFirebaseCloudSync();
  initCloudEvents();
  renderFeaturedWork();
  renderRandomQuote();
  renderWorks();
  renderNotes();
  updateStats();
  applyGuestPermissionsUI();
});

/* ==========================================================================
   1. Storage & State Initialization
   ========================================================================== */

function initStorage() {
  const savedWorks = localStorage.getItem('vanhoc12_works_v2');
  if (savedWorks) {
    try {
      state.works = JSON.parse(savedWorks);
      state.works.forEach(w => {
        const defaultWork = LITERATURE_WORKS.find(dw => dw.id === w.id);
        if (defaultWork && defaultWork.coverImage && !w.coverImage) {
          w.coverImage = defaultWork.coverImage;
        }
      });
    } catch (e) {
      state.works = [...LITERATURE_WORKS];
    }
  } else {
    state.works = [...LITERATURE_WORKS];
    saveWorks();
  }

  const savedNotes = localStorage.getItem('vanhoc12_notes');
  if (savedNotes) {
    try {
      state.notes = JSON.parse(savedNotes);
    } catch (e) {
      state.notes = [...SAMPLE_STUDENT_NOTES];
    }
  } else {
    state.notes = [...SAMPLE_STUDENT_NOTES];
    saveNotes();
  }

  const savedTheme = localStorage.getItem('vanhoc12_theme') || 'dark';
  state.theme = savedTheme;

  // 1. Tải Cấu hình Hình nền mặc định toàn trang web do Admin thiết lập
  const savedSiteDefaultBg = localStorage.getItem('vanhoc12_site_default_bg');
  state.siteDefaultBg = savedSiteDefaultBg !== null ? savedSiteDefaultBg : (typeof DEFAULT_SITE_BACKGROUND !== 'undefined' ? DEFAULT_SITE_BACKGROUND.customBg : '');

  const savedSiteDefaultOverlay = localStorage.getItem('vanhoc12_site_default_overlay');
  state.siteDefaultOverlay = savedSiteDefaultOverlay || (typeof DEFAULT_SITE_BACKGROUND !== 'undefined' ? DEFAULT_SITE_BACKGROUND.bgOverlay : '70');

  const savedSiteDefaultBlur = localStorage.getItem('vanhoc12_site_default_blur');
  state.siteDefaultBlur = savedSiteDefaultBlur || (typeof DEFAULT_SITE_BACKGROUND !== 'undefined' ? DEFAULT_SITE_BACKGROUND.bgBlur : '3');

  // 2. Kiểm tra xem người dùng/học sinh hiện tại đã từng chỉnh nền riêng chưa
  const userHasCustom = localStorage.getItem('vanhoc12_user_has_custom_bg') === 'true';
  state.hasUserCustomizedBg = userHasCustom;

  if (userHasCustom) {
    const savedBg = localStorage.getItem('vanhoc12_custom_bg');
    state.customBg = savedBg !== null ? savedBg : state.siteDefaultBg;
    state.bgOverlay = localStorage.getItem('vanhoc12_bg_overlay') || state.siteDefaultOverlay;
    state.bgBlur = localStorage.getItem('vanhoc12_bg_blur') || state.siteDefaultBlur;
  } else {
    // Người mới vào web hoặc chưa đổi nền riêng -> Tự động nhận nền mặc định do Admin đặt!
    state.customBg = state.siteDefaultBg;
    state.bgOverlay = state.siteDefaultOverlay;
    state.bgBlur = state.siteDefaultBlur;
  }

  const savedReaderFont = localStorage.getItem('vanhoc12_reader_fontsize');
  if (savedReaderFont) {
    const parsed = parseInt(savedReaderFont, 10);
    state.readerFontSize = parsed >= 16 ? parsed : 20;
  } else {
    state.readerFontSize = 20;
  }

  const savedLineHeight = localStorage.getItem('vanhoc12_reader_lineheight');
  if (savedLineHeight) state.readerLineHeight = savedLineHeight;
}

function initAdminState() {
  state.isAdmin = localStorage.getItem('vanhoc12_is_admin') === 'true';

  // Đảm bảo mật khẩu Admin là Viet09
  let savedPass = localStorage.getItem('vanhoc12_admin_pass');
  if (!savedPass || savedPass === 'admin123') {
    savedPass = 'Viet09';
    localStorage.setItem('vanhoc12_admin_pass', 'Viet09');
  }
  state.adminPassword = savedPass;

  const savedPerms = localStorage.getItem('vanhoc12_guest_perms');
  if (savedPerms) {
    try {
      state.guestPermissions = { ...DEFAULT_GUEST_PERMISSIONS, ...JSON.parse(savedPerms) };
    } catch (e) {
      state.guestPermissions = { ...DEFAULT_GUEST_PERMISSIONS };
    }
  } else {
    state.guestPermissions = { ...DEFAULT_GUEST_PERMISSIONS };
  }

  updateAdminUI();
}

function saveWorks() {
  try {
    localStorage.setItem('vanhoc12_works_v2', JSON.stringify(state.works));
  } catch (e) {
    console.warn("Storage quota exceeded or error saving works:", e);
  }
  if (state.isAdmin && state.cloudSync && state.cloudSync.enabled) {
    syncDataToCloud(false);
  }
}

function saveNotes() {
  localStorage.setItem('vanhoc12_notes', JSON.stringify(state.notes));
}

function savePermissions() {
  localStorage.setItem('vanhoc12_guest_perms', JSON.stringify(state.guestPermissions));
  if (state.isAdmin && state.cloudSync && state.cloudSync.enabled) {
    syncDataToCloud(false);
  }
}

function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

/* ==========================================================================
   1.5 Custom Wallpaper System (Hình Nền Trang Web)
   ========================================================================== */

function saveBackgroundSettings(isUserAction = true) {
  try {
    if (isUserAction && !state.isAdmin) {
      state.hasUserCustomizedBg = true;
      localStorage.setItem('vanhoc12_user_has_custom_bg', 'true');
    }
    localStorage.setItem('vanhoc12_custom_bg', state.customBg || '');
    localStorage.setItem('vanhoc12_bg_overlay', state.bgOverlay || '70');
    localStorage.setItem('vanhoc12_bg_blur', state.bgBlur || '3');
  } catch (e) {
    console.warn("Storage quota exceeded saving background:", e);
  }
}

function applyBackground() {
  const bgLayer = document.getElementById('customSiteBgLayer');
  const bgOverlay = document.getElementById('customSiteBgOverlay');
  const previewBox = document.getElementById('bgPreviewBox');
  const overlaySlider = document.getElementById('bgOverlaySlider');
  const blurSlider = document.getElementById('bgBlurSlider');
  const overlayValText = document.getElementById('bgOverlayValText');
  const blurValText = document.getElementById('bgBlurValText');
  const urlInput = document.getElementById('bgImageUrlInput');

  const overlayOpacity = (parseInt(state.bgOverlay, 10) || 70) / 100;
  const blurVal = parseInt(state.bgBlur, 10) || 0;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const overlayRgb = isLight ? '248, 250, 252' : '9, 13, 22';

  if (bgLayer) {
    if (state.customBg) {
      bgLayer.style.backgroundImage = `url("${state.customBg}")`;
      bgLayer.style.filter = `blur(${blurVal}px)`;
      bgLayer.classList.add('active');
    } else {
      bgLayer.style.backgroundImage = '';
      bgLayer.style.filter = '';
      bgLayer.classList.remove('active');
    }
  }

  if (bgOverlay) {
    if (state.customBg) {
      bgOverlay.style.backgroundColor = `rgba(${overlayRgb}, ${overlayOpacity})`;
      bgOverlay.classList.add('active');
    } else {
      bgOverlay.style.backgroundColor = '';
      bgOverlay.classList.remove('active');
    }
  }

  if (previewBox) {
    if (state.customBg) {
      previewBox.style.backgroundImage = `linear-gradient(rgba(${overlayRgb}, ${overlayOpacity}), rgba(${overlayRgb}, ${overlayOpacity})), url("${state.customBg}")`;
      previewBox.style.backgroundSize = 'cover';
      previewBox.style.backgroundPosition = 'center';
    } else {
      previewBox.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0b0f19 100%)';
    }
  }

  if (overlaySlider) overlaySlider.value = state.bgOverlay;
  if (blurSlider) blurSlider.value = state.bgBlur;
  if (overlayValText) overlayValText.textContent = `${state.bgOverlay}%`;
  if (blurValText) blurValText.textContent = `${state.bgBlur}px`;
  if (urlInput && document.activeElement !== urlInput) {
    urlInput.value = (state.customBg && state.customBg.startsWith('http')) ? state.customBg : '';
  }

  // Cập nhật trạng thái card được chọn trong kho Preset
  document.querySelectorAll('.bg-preset-card').forEach(card => {
    const id = card.getAttribute('data-preset-id');
    const preset = WALLPAPER_PRESETS.find(p => p.id === id);
    if (preset) {
      const isSelected = (!state.customBg && preset.url === '') || (state.customBg === preset.url);
      if (isSelected) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    }
  });
}

function initBackgroundSystem() {
  const openBgBtn = document.getElementById('openBgCustomizerBtn');
  const bgModal = document.getElementById('bgCustomizerModal');
  const closeBgBtn = document.getElementById('closeBgCustomizerModalBtn');
  const finishBgBtn = document.getElementById('finishBgCustomizerBtn');
  const presetsGrid = document.getElementById('bgPresetsGrid');
  const bgFileInput = document.getElementById('bgImageFileInput');
  const bgUrlInput = document.getElementById('bgImageUrlInput');
  const applyUrlBtn = document.getElementById('applyBgUrlBtn');
  const resetBtn = document.getElementById('resetBgToDefaultBtn');
  const overlaySlider = document.getElementById('bgOverlaySlider');
  const blurSlider = document.getElementById('bgBlurSlider');

  // Render các hình nền có sẵn
  if (presetsGrid) {
    presetsGrid.innerHTML = WALLPAPER_PRESETS.map(preset => {
      const bgStyle = preset.url 
        ? `background-image: linear-gradient(rgba(15,23,42,0.35), rgba(15,23,42,0.7)), url('${preset.url}'); background-size: cover; background-position: center;`
        : `background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0b0f19 100%);`;
      return `
        <div class="bg-preset-card" data-preset-id="${preset.id}" style="${bgStyle}" title="${preset.title}">
          <span class="bg-preset-icon">${preset.icon}</span>
          <span class="bg-preset-title">${preset.title}</span>
        </div>
      `;
    }).join('');

    presetsGrid.querySelectorAll('.bg-preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-preset-id');
        const preset = WALLPAPER_PRESETS.find(p => p.id === id);
        if (preset) {
          state.customBg = preset.url;
          saveBackgroundSettings();
          applyBackground();
          showToast(`✨ Đã áp dụng hình nền "${preset.title}"!`, 'success');
        }
      });
    });
  }

  // Mở & Đóng Modal chỉnh hình nền
  openBgBtn?.addEventListener('click', () => {
    applyBackground();
    openModal(bgModal);
  });

  [closeBgBtn, finishBgBtn].forEach(btn => {
    btn?.addEventListener('click', () => closeModal(bgModal));
  });

  // Tải ảnh từ máy tính (FileReader)
  bgFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('⚠️ Dung lượng file quá lớn (>15MB), vui lòng chọn ảnh nhẹ hơn.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      state.customBg = ev.target.result;
      saveBackgroundSettings();
      applyBackground();
      showToast('🖼️ Đã tải lên và áp dụng hình nền từ thiết bị!', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Áp dụng URL ảnh trực tuyến
  const handleApplyUrl = () => {
    const url = bgUrlInput ? bgUrlInput.value.trim() : '';
    if (!url) return;
    state.customBg = url;
    saveBackgroundSettings();
    applyBackground();
    showToast('🖼️ Đã áp dụng hình nền từ liên kết trực tuyến!', 'success');
  };

  applyUrlBtn?.addEventListener('click', handleApplyUrl);
  bgUrlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyUrl();
    }
  });

  // Đặt lại hình nền mặc định (Quay về hình nền do Admin thiết lập cho toàn trang)
  resetBtn?.addEventListener('click', () => {
    state.hasUserCustomizedBg = false;
    localStorage.removeItem('vanhoc12_user_has_custom_bg');

    state.customBg = state.siteDefaultBg;
    state.bgOverlay = state.siteDefaultOverlay;
    state.bgBlur = state.siteDefaultBlur;

    saveBackgroundSettings(false);
    applyBackground();
    showToast('↺ Đã đặt lại về hình nền mặc định của trang web!', 'info');
  });

  // Thiết lập làm hình nền mặc định cho toàn web (Chỉ Admin)
  const setSiteDefaultBtn = document.getElementById('setAsSiteDefaultBgBtn');
  const exportDataJsBtn = document.getElementById('exportDataJsConfigBtn');

  setSiteDefaultBtn?.addEventListener('click', () => {
    if (!state.isAdmin) return;

    state.siteDefaultBg = state.customBg || '';
    state.siteDefaultOverlay = state.bgOverlay || '70';
    state.siteDefaultBlur = state.bgBlur || '3';

    localStorage.setItem('vanhoc12_site_default_bg', state.siteDefaultBg);
    localStorage.setItem('vanhoc12_site_default_overlay', state.siteDefaultOverlay);
    localStorage.setItem('vanhoc12_site_default_blur', state.siteDefaultBlur);

    // Xóa cờ chỉnh nền riêng trên máy này để người xem/học sinh trên máy này thấy ngay nền mặc định mới
    localStorage.removeItem('vanhoc12_user_has_custom_bg');
    state.hasUserCustomizedBg = false;

    if (state.cloudSync && state.cloudSync.enabled) {
      syncDataToCloud(true);
    }

    showToast('⭐ Đã đặt làm Hình Nền Mặc Định! Tất cả học sinh & người mới vào web sẽ tự động thấy nền này.', 'success');
  });

  exportDataJsBtn?.addEventListener('click', () => {
    if (!state.isAdmin) return;
    exportUpdatedDataJs();
  });

  // Điều chỉnh thanh trượt độ mờ và độ nhòe
  overlaySlider?.addEventListener('input', (e) => {
    state.bgOverlay = e.target.value;
    saveBackgroundSettings();
    applyBackground();
  });

  blurSlider?.addEventListener('input', (e) => {
    state.bgBlur = e.target.value;
    saveBackgroundSettings();
    applyBackground();
  });

  // Áp dụng ngay khi mở trang
  applyBackground();
}

function exportUpdatedDataJs() {
  const currentFbCfg = getStoredFirebaseConfig();
  const content = `/**
 * VănHọc12 — Kho Dữ Liệu Tác Phẩm Ngữ Văn Lớp 12 & Luyện Thi THPT Quốc Gia
 * Tự động đồng bộ cấu hình Admin, bìa sách và hình nền mặc định toàn web
 */

const DEFAULT_GUEST_PERMISSIONS = ${JSON.stringify(state.guestPermissions, null, 2)};

// Cấu hình hình nền mặc định toàn trang web do Admin thiết lập
const DEFAULT_SITE_BACKGROUND = {
  customBg: ${JSON.stringify(state.siteDefaultBg || state.customBg || '')},
  bgOverlay: ${JSON.stringify(state.siteDefaultOverlay || state.bgOverlay || '70')},
  bgBlur: ${JSON.stringify(state.siteDefaultBlur || state.bgBlur || '3')}
};

// Mật khẩu Admin mặc định
const DEFAULT_ADMIN_PASSWORD = ${JSON.stringify(state.adminPassword || 'Viet09')};

// Cấu hình Google Firebase Realtime Database mặc định
// (Nếu đã cấu hình, khi tải lên GitHub Pages mọi học sinh mở web sẽ tự động kết nối đám mây)
const DEFAULT_FIREBASE_CONFIG = ${JSON.stringify(currentFbCfg, null, 2)};

const LITERATURE_WORKS = ${JSON.stringify(state.works, null, 2)};

const SAMPLE_STUDENT_NOTES = ${JSON.stringify(state.notes, null, 2)};
`;

  const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('💾 Đã tải file "data.js" cập nhật mới! Bạn có thể lưu vào thư mục web/js/ để mọi học sinh trên các máy khác đều nhận ngay.', 'success');
}

/* ==========================================================================
   2. Admin Control Logic & Access Permissions
   ========================================================================== */

function updateAdminUI() {
  const openLoginBtn = document.getElementById('openAdminLoginBtn');
  const adminBadgeGroup = document.getElementById('adminBadgeGroup');
  const adminStatusDisplay = document.getElementById('adminStatusDisplay');
  const adminEditInReaderBtn = document.getElementById('adminEditCurrentWorkBtn');
  const readerUploadAudioBtn = document.getElementById('readerUploadAudioBtn');
  const removeCustomAudioBtn = document.getElementById('removeCustomAudioBtn');
  const adminBgDefaultBox = document.getElementById('adminBgDefaultBox');

  if (state.isAdmin) {
    if (openLoginBtn) openLoginBtn.style.display = 'none';
    if (adminBadgeGroup) adminBadgeGroup.style.display = 'flex';
    if (adminStatusDisplay) {
      adminStatusDisplay.innerHTML = '👑 <strong>Admin (Toàn quyền)</strong>';
      adminStatusDisplay.style.color = 'var(--accent-amber)';
    }
    if (adminEditInReaderBtn) adminEditInReaderBtn.style.display = 'inline-flex';
    if (readerUploadAudioBtn) readerUploadAudioBtn.style.display = 'inline-flex';
    if (removeCustomAudioBtn) removeCustomAudioBtn.style.display = 'inline-block';
    if (adminBgDefaultBox) adminBgDefaultBox.style.display = 'block';
  } else {
    if (openLoginBtn) openLoginBtn.style.display = 'inline-flex';
    if (adminBadgeGroup) adminBadgeGroup.style.display = 'none';
    if (adminStatusDisplay) {
      adminStatusDisplay.textContent = 'Khách Xem';
      adminStatusDisplay.style.color = '';
    }
    if (adminEditInReaderBtn) adminEditInReaderBtn.style.display = 'none';
    if (readerUploadAudioBtn) readerUploadAudioBtn.style.display = 'none';
    if (removeCustomAudioBtn) removeCustomAudioBtn.style.display = 'none';
    if (adminBgDefaultBox) adminBgDefaultBox.style.display = 'none';
  }
}

function applyGuestPermissionsUI() {
  if (state.isAdmin) {
    document.body.classList.remove('no-selection-allowed');
    return;
  }

  if (!state.guestPermissions.allowTextSelection) {
    document.body.classList.add('no-selection-allowed');
  } else {
    document.body.classList.remove('no-selection-allowed');
  }
}

function checkActionPermission(actionKey, actionDescription) {
  if (state.isAdmin) return true;

  if (!state.guestPermissions[actionKey]) {
    showToast(`⚠️ Quản trị viên đã tạm khóa chức năng "${actionDescription}" đối với người xem.`, 'error');
    return false;
  }
  return true;
}

/* ==========================================================================
   3. Event Listeners
   ========================================================================== */

function initEvents() {
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  // Global Page Scroll Progress Bar & Floating Scroll Controls (Lướt trang thông minh)
  const pageProgressBar = document.getElementById('globalPageProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollToContentBtn = document.getElementById('scrollToContentBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (pageProgressBar) {
      pageProgressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollY > 260) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollToContentBtn?.addEventListener('click', () => {
    const target = document.getElementById('explore') || document.querySelector('.books-section') || document.getElementById('goals');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute('data-nav');
      switchSection(navTarget);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderWorks();
    });

    searchClearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.style.display = 'none';
      renderWorks();
      searchInput.focus();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !isModalOpen()) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape') {
        if (isModalOpen()) {
          closeAllModals();
        } else if (document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    });
  }

  document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.getAttribute('data-category');
      renderWorks();
    });
  });

  document.querySelectorAll('#statusPills .pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#statusPills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.currentStatus = pill.getAttribute('data-status');
      renderWorks();
    });
  });

  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    renderWorks();
  });

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    state.searchQuery = '';
    state.currentCategory = 'all';
    state.currentStatus = 'all';
    if (searchInput) searchInput.value = '';
    document.querySelector('#categoryFilters .filter-btn[data-category="all"]')?.classList.add('active');
    document.querySelector('#statusPills .pill-btn[data-status="all"]')?.classList.add('active');
    renderWorks();
  });

  document.getElementById('refreshQuoteBtn')?.addEventListener('click', renderRandomQuote);

  document.getElementById('featuredReadBtn')?.addEventListener('click', () => {
    const featured = state.works.find(b => b.isFeatured) || state.works[0];
    if (featured) openReaderModal(featured.id);
  });

  document.getElementById('featuredListenBtn')?.addEventListener('click', () => {
    if (!checkActionPermission('canListenAudio', 'Nghe Bình Giảng Audio')) return;
    const featured = state.works.find(b => b.isFeatured) || state.works[0];
    if (featured) {
      openReaderModal(featured.id);
      toggleAudioPlay(featured);
    }
  });

  document.getElementById('featuredBookmarkBtn')?.addEventListener('click', () => {
    if (!checkActionPermission('canBookmarkWorks', 'Lưu Tủ Bài Ôn')) return;
    const featured = state.works.find(b => b.isFeatured) || state.works[0];
    if (featured) toggleBookmark(featured.id);
  });

  initAdminAuthEvents();
  initAdminPermissionsEvents();
  initAdminWorkEditingEvents();
  initReaderControls();
  initNotesEvents();
  initModalBackdropEvents();
}

/* ==========================================================================
   4. Admin Auth & Dialogs
   ========================================================================== */

function initAdminAuthEvents() {
  const openLoginBtn = document.getElementById('openAdminLoginBtn');
  const loginModal = document.getElementById('adminLoginModal');
  const closeLoginBtn = document.getElementById('closeAdminLoginModalBtn');
  const cancelLoginBtn = document.getElementById('cancelAdminLoginBtn');
  const loginForm = document.getElementById('adminLoginForm');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  openLoginBtn?.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('adminPasswordInput')?.focus();
  });

  [closeLoginBtn, cancelLoginBtn].forEach(b => {
    b?.addEventListener('click', () => {
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputPass = document.getElementById('adminPasswordInput').value.trim();

    if (inputPass === state.adminPassword) {
      state.isAdmin = true;
      localStorage.setItem('vanhoc12_is_admin', 'true');
      updateAdminUI();
      applyGuestPermissionsUI();
      renderWorks();
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
      loginForm.reset();
      showToast('👑 Chào mừng Quản trị viên! Bạn có toàn quyền sửa nội dung & tải lên âm thanh.', 'success');
    } else {
      showToast('❌ Mật khẩu Quản trị viên không chính xác! Vui lòng thử lại.', 'error');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    state.isAdmin = false;
    localStorage.setItem('vanhoc12_is_admin', 'false');
    updateAdminUI();
    applyGuestPermissionsUI();
    renderWorks();
    showToast('Đã đăng xuất khỏi chế độ Quản trị viên. Đang ở chế độ khách xem.', 'info');
  });
}

function initAdminPermissionsEvents() {
  const openPermsBtn = document.getElementById('openPermissionsModalBtn');
  const modal = document.getElementById('permissionsModal');
  const closeBtn = document.getElementById('closePermissionsModalBtn');
  const cancelBtn = document.getElementById('cancelPermissionsBtn');
  const form = document.getElementById('permissionsForm');

  openPermsBtn?.addEventListener('click', () => {
    document.getElementById('permCanListenAudio').checked = state.guestPermissions.canListenAudio;
    document.getElementById('permCanCopyNotes').checked = state.guestPermissions.canCopyNotes;
    document.getElementById('permCanBookmarkWorks').checked = state.guestPermissions.canBookmarkWorks;
    document.getElementById('permCanAddPersonalNotes').checked = state.guestPermissions.canAddPersonalNotes;
    document.getElementById('permAllowTextSelection').checked = state.guestPermissions.allowTextSelection;
    openModal(modal);
  });

  [closeBtn, cancelBtn].forEach(b => {
    b?.addEventListener('click', () => closeModal(modal));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.guestPermissions.canListenAudio = document.getElementById('permCanListenAudio').checked;
    state.guestPermissions.canCopyNotes = document.getElementById('permCanCopyNotes').checked;
    state.guestPermissions.canBookmarkWorks = document.getElementById('permCanBookmarkWorks').checked;
    state.guestPermissions.canAddPersonalNotes = document.getElementById('permCanAddPersonalNotes').checked;
    state.guestPermissions.allowTextSelection = document.getElementById('permAllowTextSelection').checked;

    savePermissions();
    applyGuestPermissionsUI();
    closeModal(modal);
    showToast('⚙️ Đã lưu thiết lập phân quyền khách xem thành công!', 'success');
  });
}

/* ==========================================================================
   2.5 Book Cover Exterior Customization (Tùy Chỉnh Hình Vỏ Ngoài Sách)
   ========================================================================== */

function renderCoverGradientOptions() {
  const container = document.getElementById('coverGradientOptions');
  if (!container) return;

  container.innerHTML = COVER_GRADIENT_PRESETS.map((preset, index) => {
    const isActive = editingCoverTheme && editingCoverTheme.gradient === preset.gradient;
    return `
      <button type="button" class="cover-color-pill ${isActive ? 'active' : ''}" 
        style="background: ${preset.gradient};" 
        title="${preset.name}" 
        data-gradient-index="${index}">
        <span>${preset.icon}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.cover-color-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const index = parseInt(pill.getAttribute('data-gradient-index'), 10);
      const preset = COVER_GRADIENT_PRESETS[index];
      if (preset) {
        editingCoverTheme = { ...preset };
        container.querySelectorAll('.cover-color-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        updateCoverPreviewUI();
      }
    });
  });
}

function updateCoverPreviewUI() {
  const preview = document.getElementById('editWorkCoverPreview');
  const previewIcon = document.getElementById('editWorkCoverPreviewIcon');
  const previewTitle = document.getElementById('editWorkCoverPreviewTitle');
  const previewAuthor = document.getElementById('editWorkCoverPreviewAuthor');
  const clearBtn = document.getElementById('clearWorkCoverBtn');
  const urlInput = document.getElementById('editWorkCoverUrlInput');
  const titleInput = document.getElementById('editWorkTitle');
  const authorInput = document.getElementById('editWorkAuthor');

  if (previewTitle) {
    previewTitle.textContent = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : 'Tên Tác Phẩm';
  }
  if (previewAuthor) {
    previewAuthor.textContent = (authorInput && authorInput.value.trim()) ? authorInput.value.trim() : 'Tác giả';
  }
  if (previewIcon && editingCoverTheme) {
    previewIcon.textContent = editingCoverTheme.icon || '📖';
  }

  if (preview) {
    if (editingCoverImage) {
      preview.style.backgroundImage = `linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.88) 100%), url("${editingCoverImage}")`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
      if (clearBtn) clearBtn.style.display = 'inline-block';
    } else {
      const gradient = editingCoverTheme?.gradient || 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)';
      preview.style.backgroundImage = gradient;
      preview.style.backgroundSize = '';
      preview.style.backgroundPosition = '';
      if (clearBtn) clearBtn.style.display = 'none';
    }
  }

  if (urlInput && document.activeElement !== urlInput) {
    urlInput.value = (editingCoverImage && editingCoverImage.startsWith('http')) ? editingCoverImage : '';
  }

  const container = document.getElementById('coverGradientOptions');
  if (container) {
    container.querySelectorAll('.cover-color-pill').forEach(pill => {
      const idx = parseInt(pill.getAttribute('data-gradient-index'), 10);
      const preset = COVER_GRADIENT_PRESETS[idx];
      if (preset && editingCoverTheme && editingCoverTheme.gradient === preset.gradient) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }
}

function initAdminWorkEditingEvents() {
  const openAddBtn = document.getElementById('openAddWorkAdminBtn');
  const modal = document.getElementById('editWorkModal');
  const closeBtn = document.getElementById('closeEditWorkModalBtn');
  const cancelBtn = document.getElementById('cancelEditWorkBtn');
  const form = document.getElementById('editWorkForm');
  const modalTitle = document.getElementById('editWorkModalTitle');
  const adminEditInReaderBtn = document.getElementById('adminEditCurrentWorkBtn');

  // Book Cover Inputs
  const coverFileInput = document.getElementById('editWorkCoverFileInput');
  const clearCoverBtn = document.getElementById('clearWorkCoverBtn');
  const coverUrlInput = document.getElementById('editWorkCoverUrlInput');
  const titleInput = document.getElementById('editWorkTitle');
  const authorInput = document.getElementById('editWorkAuthor');

  // Xử lý nạp ảnh bìa từ máy tính
  coverFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('⚠️ Dung lượng ảnh bìa quá lớn (>15MB), vui lòng chọn ảnh nhẹ hơn.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      editingCoverImage = ev.target.result;
      updateCoverPreviewUI();
      showToast('🖼️ Đã nạp ảnh vỏ sách mới thành công!', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Xử lý link URL ảnh bìa
  coverUrlInput?.addEventListener('input', (e) => {
    editingCoverImage = e.target.value.trim() || null;
    updateCoverPreviewUI();
  });

  // Xóa ảnh bìa riêng
  clearCoverBtn?.addEventListener('click', () => {
    editingCoverImage = null;
    if (coverFileInput) coverFileInput.value = '';
    if (coverUrlInput) coverUrlInput.value = '';
    updateCoverPreviewUI();
    showToast('Đã chuyển về vỏ sách gradient màu nghệ thuật.', 'info');
  });

  // Xem trước tên và tác giả trên bìa sách theo thời gian thực
  titleInput?.addEventListener('input', () => {
    const previewTitle = document.getElementById('editWorkCoverPreviewTitle');
    if (previewTitle) previewTitle.textContent = titleInput.value.trim() || 'Tên Tác Phẩm';
  });

  authorInput?.addEventListener('input', () => {
    const previewAuthor = document.getElementById('editWorkCoverPreviewAuthor');
    if (previewAuthor) previewAuthor.textContent = authorInput.value.trim() || 'Tác giả';
  });

  openAddBtn?.addEventListener('click', () => {
    if (!state.isAdmin) return;
    form.reset();
    document.getElementById('editWorkId').value = '';
    uploadedAudioTempData = null;
    uploadedAudioTempName = null;
    const audioStatus = document.getElementById('editWorkAudioStatus');
    if (audioStatus) audioStatus.style.display = 'none';
    const audioUrlInput = document.getElementById('editWorkAudioUrlInput');
    if (audioUrlInput) audioUrlInput.value = '';

    editingCoverImage = null;
    editingCoverTheme = { ...COVER_GRADIENT_PRESETS[0] };
    renderCoverGradientOptions();
    updateCoverPreviewUI();

    if (modalTitle) modalTitle.textContent = '✨ Thêm Tác Phẩm Mới (Chỉ Admin)';
    openModal(modal);
  });

  adminEditInReaderBtn?.addEventListener('click', () => {
    if (!state.isAdmin || !state.activeWorkId) return;
    openEditWorkModal(state.activeWorkId);
  });

  [closeBtn, cancelBtn].forEach(b => {
    b?.addEventListener('click', () => closeModal(modal));
  });

  form?.addEventListener('submit', handleSaveWork);
}

function openEditWorkModal(workId) {
  if (!state.isAdmin) {
    showToast('Chỉ Quản trị viên mới có quyền chỉnh sửa tác phẩm này.', 'error');
    return;
  }

  const work = state.works.find(w => w.id === workId);
  if (!work) return;

  const modal = document.getElementById('editWorkModal');
  const modalTitle = document.getElementById('editWorkModalTitle');
  if (modalTitle) modalTitle.textContent = `✏️ Chỉnh Sửa Tác Phẩm: ${work.title}`;

  document.getElementById('editWorkId').value = work.id;
  document.getElementById('editWorkTitle').value = work.title;
  document.getElementById('editWorkAuthor').value = work.author;
  document.getElementById('editWorkCategory').value = work.category || 'prose';
  document.getElementById('editWorkPeriod').value = work.period || '';
  document.getElementById('editWorkSummary').value = work.summary || '';
  document.getElementById('editWorkSampleIntro').value = work.sampleIntro || '';

  // Khởi tạo trạng thái vỏ sách của tác phẩm
  editingCoverImage = work.coverImage || null;
  editingCoverTheme = work.theme ? { ...work.theme } : { ...COVER_GRADIENT_PRESETS[0] };
  renderCoverGradientOptions();
  updateCoverPreviewUI();

  // Audio preview & URL in edit form
  uploadedAudioTempData = work.customAudioData || null;
  uploadedAudioTempName = work.customAudioName || null;
  const audioUrlInput = document.getElementById('editWorkAudioUrlInput');
  if (audioUrlInput) {
    audioUrlInput.value = work.customAudioUrl || '';
  }

  const statusBox = document.getElementById('editWorkAudioStatus');
  const nameEl = document.getElementById('editWorkAudioName');
  if (work.customAudioData && statusBox && nameEl) {
    statusBox.style.display = 'block';
    nameEl.textContent = work.customAudioName || 'File audio từ máy';
  } else if (work.customAudioUrl && statusBox && nameEl) {
    statusBox.style.display = 'block';
    nameEl.textContent = 'Link Online: ' + work.customAudioUrl;
  } else if (statusBox) {
    statusBox.style.display = 'none';
  }

  let combinedText = '';
  if (work.fullTextSections && work.fullTextSections.length > 0) {
    combinedText = work.fullTextSections.map(sec => `=== ${sec.sectionTitle} ===\n${sec.content}`).join('\n\n');
  }
  document.getElementById('editWorkFullText').value = combinedText;

  let combinedChapters = '';
  if (work.chapters && work.chapters.length > 0) {
    combinedChapters = work.chapters.map(c => `• ${c.title}: ${c.lead || ''}`).join('\n');
  }
  document.getElementById('editWorkChapters').value = combinedChapters;

  openModal(modal);
}

function handleSaveWork(e) {
  e.preventDefault();
  if (!state.isAdmin) return;

  const workId = document.getElementById('editWorkId').value;
  const title = document.getElementById('editWorkTitle').value.trim();
  const author = document.getElementById('editWorkAuthor').value.trim();
  const category = document.getElementById('editWorkCategory').value;
  const period = document.getElementById('editWorkPeriod').value.trim() || 'Chương trình 12';
  const summary = document.getElementById('editWorkSummary').value.trim();
  const sampleIntro = document.getElementById('editWorkSampleIntro').value.trim();
  const fullTextRaw = document.getElementById('editWorkFullText').value.trim();
  const chaptersRaw = document.getElementById('editWorkChapters').value.trim();
  const audioUrl = document.getElementById('editWorkAudioUrlInput')?.value.trim() || '';

  let fullTextSections = [];
  if (fullTextRaw.includes('===')) {
    const rawParts = fullTextRaw.split(/===\s*(.*?)\s*===/);
    for (let i = 1; i < rawParts.length; i += 2) {
      fullTextSections.push({
        sectionTitle: rawParts[i].trim() || `Phần ${(i + 1) / 2}`,
        content: (rawParts[i + 1] || '').trim()
      });
    }
  } else {
    fullTextSections.push({
      sectionTitle: "Toàn văn tác phẩm trích dẫn SGK",
      content: fullTextRaw
    });
  }

  let chapters = [];
  if (chaptersRaw) {
    const lines = chaptersRaw.split('\n').filter(l => l.trim().length > 0);
    chapters = lines.map((line, idx) => {
      const cleanLine = line.replace(/^[•\-\*]\s*/, '');
      const parts = cleanLine.split(':');
      const chapTitle = parts[0] ? parts[0].trim() : `Luận điểm ${idx + 1}`;
      const chapLead = parts[1] ? parts.slice(1).join(':').trim() : 'Phân tích chi tiết luận điểm và dẫn chứng nghệ thuật.';
      return {
        id: `chap-${idx + 1}`,
        title: chapTitle,
        lead: chapLead,
        paragraphs: [
          `Nội dung trọng tâm của ${chapTitle} cần bám sát văn bản gốc.`,
          "Liên hệ so sánh để làm nổi bật phong cách nghệ thuật độc đáo của tác giả."
        ],
        highlight: {
          title: "Trọng tâm thi 9+:",
          text: `Ghi nhớ dẫn chứng tiêu biểu của ${chapTitle}.`
        }
      };
    });
  }

  const categoryNames = {
    prose: "Truyện Ngắn & Ký Hiện Thực",
    poetry: "Thơ Ca Kháng Chiến & Đất Nước",
    custom: "Tác Phẩm Admin Bổ Sung"
  };

  if (workId) {
    const work = state.works.find(w => w.id === workId);
    if (work) {
      work.title = title;
      work.author = author;
      work.category = category;
      work.categoryName = categoryNames[category] || "Ngữ Văn 12";
      work.period = period;
      work.summary = summary;
      work.sampleIntro = sampleIntro;
      work.fullTextSections = fullTextSections;
      if (chapters.length > 0) work.chapters = chapters;

      // Lưu vỏ sách tác phẩm
      work.coverImage = editingCoverImage || undefined;
      if (editingCoverTheme) {
        work.theme = {
          ...(work.theme || {}),
          gradient: editingCoverTheme.gradient || work.theme?.gradient,
          icon: editingCoverTheme.icon || work.theme?.icon
        };
      }

      // Lưu liên kết âm thanh trực tuyến hoặc file tải lên
      if (audioUrl) {
        work.customAudioUrl = audioUrl;
      } else if (!uploadedAudioTempData && !audioUrl) {
        delete work.customAudioUrl;
      }

      if (uploadedAudioTempData) {
        work.customAudioData = uploadedAudioTempData;
        work.customAudioName = uploadedAudioTempName;
      } else if (uploadedAudioTempData === null && !document.getElementById('editWorkAudioStatus')?.style.display.includes('block') && !audioUrl) {
        delete work.customAudioData;
        delete work.customAudioName;
      }
      showToast(`✅ Đã cập nhật tác phẩm & bìa sách "${title}"!`, 'success');
    }
  } else {
    const newWork = {
      id: `custom-${Date.now()}`,
      title,
      author,
      period,
      category,
      categoryName: categoryNames[category] || "Ngữ Văn 12",
      genre: "Tác phẩm chương trình 12",
      rating: 9.8,
      reviews: 1,
      readTime: "25 phút",
      progress: 0,
      isFavorite: true,
      isFeatured: false,
      badge: "Admin bổ sung",
      coverImage: editingCoverImage || undefined,
      theme: {
        c1: "#1e1b4b",
        c2: "#4338ca",
        accent: "#06b6d4",
        gradient: editingCoverTheme?.gradient || "linear-gradient(135deg, #0f172a 0%, #312e81 60%, #0284c7 100%)",
        icon: editingCoverTheme?.icon || "📖"
      },
      summary,
      sampleIntro,
      audioScript: `Tác phẩm ${title} của tác giả ${author}. ${summary}`,
      fullTextSections,
      customAudioUrl: audioUrl || undefined,
      customAudioData: uploadedAudioTempData || undefined,
      customAudioName: uploadedAudioTempName || undefined,
      chapters: chapters.length > 0 ? chapters : [
        {
          id: "chap-1",
          title: "Luận điểm 1: Khái quát tác giả và tác phẩm",
          lead: summary,
          paragraphs: [
            `Tác phẩm ${title} của tác giả ${author} chứa đựng giá trị hiện thực và nhân đạo sâu sắc.`
          ],
          highlight: {
            title: "Trọng tâm bài thi:",
            text: `Nắm vững dẫn chứng tiêu biểu của ${title}.`
          }
        }
      ]
    };
    state.works.unshift(newWork);
    showToast(`🎉 Đã thêm thành công tác phẩm "${title}" vào kho!`, 'success');
  }

  saveWorks();
  if (state.cloudSync && state.cloudSync.enabled) {
    syncDataToCloud(true);
  }
  closeModal(document.getElementById('editWorkModal'));
  renderWorks();
  renderFeaturedWork();
  renderShelfWorks();
  updateStats();

  if (state.activeWorkId === workId) {
    const updated = state.works.find(w => w.id === workId);
    if (updated) {
      setupWorkAudioPlayer(updated);
      renderReaderContent();
    }
  }
}

function deleteWork(workId) {
  if (!state.isAdmin) {
    showToast('Chỉ Quản trị viên mới có quyền xóa tác phẩm.', 'error');
    return;
  }

  const work = state.works.find(w => w.id === workId);
  if (!work) return;

  if (confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${work.title}" khỏi kho bài học không?`)) {
    state.works = state.works.filter(w => w.id !== workId);
    saveWorks();
    if (state.cloudSync && state.cloudSync.enabled) {
      syncDataToCloud(true);
    }
    renderWorks();
    updateStats();
    showToast(`Đã xóa tác phẩm "${work.title}".`, 'info');
  }
}

/* ==========================================================================
   5. Custom Audio System & Web Speech API
   ========================================================================== */

function initAudioSystem() {
  const customAudioEl = document.getElementById('html5AudioPlayer');
  const seekSlider = document.getElementById('audioSeekSlider');
  const currentTimeLabel = document.getElementById('audioCurrentTime');
  const durationLabel = document.getElementById('audioDuration');
  const resetBtn = document.getElementById('audioResetBtn');
  const removeBtn = document.getElementById('removeCustomAudioBtn');

  if (customAudioEl) {
    customAudioEl.addEventListener('timeupdate', () => {
      if (!customAudioEl.duration) return;
      const pct = (customAudioEl.currentTime / customAudioEl.duration) * 100;
      if (seekSlider) seekSlider.value = pct;
      if (currentTimeLabel) currentTimeLabel.textContent = formatAudioTime(customAudioEl.currentTime);
    });

    customAudioEl.addEventListener('loadedmetadata', () => {
      if (durationLabel) durationLabel.textContent = formatAudioTime(customAudioEl.duration);
    });

    customAudioEl.addEventListener('ended', () => {
      updateAudioBtnUI(false);
      if (seekSlider) seekSlider.value = 0;
    });

    customAudioEl.addEventListener('play', () => {
      updateAudioBtnUI(true);
    });

    customAudioEl.addEventListener('pause', () => {
      updateAudioBtnUI(false);
    });
  }

  if (seekSlider) {
    seekSlider.addEventListener('input', (e) => {
      if (customAudioEl && customAudioEl.duration) {
        customAudioEl.currentTime = (e.target.value / 100) * customAudioEl.duration;
      }
    });
  }

  resetBtn?.addEventListener('click', () => {
    if (customAudioEl) {
      customAudioEl.currentTime = 0;
      if (seekSlider) seekSlider.value = 0;
    }
  });

  removeBtn?.addEventListener('click', () => {
    if (!state.isAdmin || !state.activeWorkId) return;
    const work = state.works.find(w => w.id === state.activeWorkId);
    if (work && confirm(`Bạn có muốn xóa file âm thanh của "${work.title}" không?`)) {
      delete work.customAudioData;
      delete work.customAudioName;
      delete work.customAudioUrl;
      saveWorks();
      if (state.cloudSync && state.cloudSync.enabled) {
        syncDataToCloud(true);
      }
      stopAudioPlayback();
      setupWorkAudioPlayer(work);
      showToast('Đã xóa file âm thanh.', 'info');
    }
  });

  // Reader Audio upload button for Admin
  const readerAudioFileInput = document.getElementById('readerAudioFileInput');
  const readerUploadAudioBtn = document.getElementById('readerUploadAudioBtn');

  readerUploadAudioBtn?.addEventListener('click', () => {
    if (!state.isAdmin) return;
    readerAudioFileInput?.click();
  });

  readerAudioFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !state.activeWorkId) return;

    if (file.size > 30 * 1024 * 1024) {
      showToast('⚠️ Dung lượng file quá lớn (>30MB), vui lòng chọn file nhỏ hơn.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const work = state.works.find(w => w.id === state.activeWorkId);
      if (work) {
        work.customAudioData = event.target.result;
        work.customAudioName = file.name;
        saveWorks();
        if (state.cloudSync && state.cloudSync.enabled) {
          syncDataToCloud(true);
        }
        setupWorkAudioPlayer(work);
        showToast(`🎵 Đã tải lên file âm thanh: "${file.name}" thành công!`, 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Edit work modal audio upload
  const editWorkAudioUpload = document.getElementById('editWorkAudioUpload');
  const clearEditWorkAudioBtn = document.getElementById('clearEditWorkAudioBtn');

  editWorkAudioUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedAudioTempData = event.target.result;
      uploadedAudioTempName = file.name;
      const statusBox = document.getElementById('editWorkAudioStatus');
      const nameEl = document.getElementById('editWorkAudioName');
      if (statusBox && nameEl) {
        statusBox.style.display = 'block';
        nameEl.textContent = file.name;
      }
      showToast(`🎵 Đã sẵn sàng lưu file: ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
  });

  clearEditWorkAudioBtn?.addEventListener('click', () => {
    uploadedAudioTempData = null;
    uploadedAudioTempName = null;
    const statusBox = document.getElementById('editWorkAudioStatus');
    if (statusBox) statusBox.style.display = 'none';
    if (editWorkAudioUpload) editWorkAudioUpload.value = '';
    const audioUrlInput = document.getElementById('editWorkAudioUrlInput');
    if (audioUrlInput) audioUrlInput.value = '';
  });
}

function formatAudioTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setupWorkAudioPlayer(work) {
  const playerBar = document.getElementById('customAudioPlayerBar');
  const badge = document.getElementById('audioSourceBadge');
  const title = document.getElementById('audioTrackTitle');
  const removeBtn = document.getElementById('removeCustomAudioBtn');
  const uploadBtnInReader = document.getElementById('readerUploadAudioBtn');
  const customAudioEl = document.getElementById('html5AudioPlayer');

  if (uploadBtnInReader) {
    uploadBtnInReader.style.display = state.isAdmin ? 'inline-flex' : 'none';
  }

  const audioSource = work ? (work.customAudioUrl || work.customAudioData) : null;

  if (work && audioSource) {
    if (playerBar) playerBar.style.display = 'flex';
    if (badge) badge.textContent = work.customAudioUrl ? '🌐 Audio Trực Tuyến' : '🎵 File Bạn Tải Lên';
    if (title) title.textContent = work.customAudioName || (work.customAudioUrl ? `${work.title} (Audio Online)` : `${work.title} (Audio riêng)`);
    if (removeBtn) removeBtn.style.display = state.isAdmin ? 'inline-block' : 'none';
    if (customAudioEl) {
      customAudioEl.src = audioSource;
      customAudioEl.currentTime = 0;
    }
  } else {
    if (playerBar) playerBar.style.display = 'none';
    if (customAudioEl) customAudioEl.removeAttribute('src');
  }
}

function toggleAudioPlay(work) {
  if (!checkActionPermission('canListenAudio', 'Nghe Bình Giảng Audio')) return;
  const customAudioEl = document.getElementById('html5AudioPlayer');
  const audioSource = work ? (work.customAudioUrl || work.customAudioData) : null;

  if (work && audioSource && customAudioEl) {
    stopSpeechSynthesis();
    if (customAudioEl.paused) {
      customAudioEl.play().catch(e => {
        showToast('Không thể phát file âm thanh này', 'error');
      });
      showToast(`🎵 Đang phát âm thanh: ${work.customAudioName || work.title}`, 'info');
    } else {
      customAudioEl.pause();
    }
  } else {
    stopCustomAudio();
    toggleSpeechSynthesis(work);
  }
}

function stopAudioPlayback() {
  stopCustomAudio();
  stopSpeechSynthesis();
}

function stopCustomAudio() {
  const customAudioEl = document.getElementById('html5AudioPlayer');
  if (customAudioEl && !customAudioEl.paused) {
    customAudioEl.pause();
    customAudioEl.currentTime = 0;
  }
  updateAudioBtnUI(false);
}

function listenToWorkPreview(workId) {
  if (!checkActionPermission('canListenAudio', 'Nghe Bình Giảng Audio')) return;
  openReaderModal(workId);
  const work = state.works.find(b => b.id === workId);
  if (work) toggleAudioPlay(work);
}

function toggleSpeechSynthesis(work) {
  if (!('speechSynthesis' in window)) {
    showToast('Trình duyệt không hỗ trợ phát âm thanh tự động', 'error');
    return;
  }

  if (state.isSpeaking) {
    stopSpeechSynthesis();
  } else {
    startSpeechSynthesis(work);
  }
}

function startSpeechSynthesis(work) {
  window.speechSynthesis.cancel();

  let textToRead = '';
  if (state.readerTab === 'fulltext' && work.fullTextSections && work.fullTextSections[state.activeSectionIndex]) {
    const sec = work.fullTextSections[state.activeSectionIndex];
    textToRead = `${work.title}. ${sec.sectionTitle}. ${sec.content}`;
  } else if (work.chapters && work.chapters[state.activeSectionIndex]) {
    const chap = work.chapters[state.activeSectionIndex];
    textToRead = `${chap.title}. ${chap.lead}. ${chap.paragraphs.join(' ')}`;
  } else {
    textToRead = work.audioScript || work.summary;
  }

  currentSpeechUtterance = new SpeechSynthesisUtterance(textToRead);
  currentSpeechUtterance.rate = 1.0;
  currentSpeechUtterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
  if (viVoice) currentSpeechUtterance.voice = viVoice;

  currentSpeechUtterance.onstart = () => {
    state.isSpeaking = true;
    updateAudioBtnUI(true);
    showToast('Đang phát giọng đọc bài giảng tự động...', 'info');
  };

  currentSpeechUtterance.onend = () => {
    state.isSpeaking = false;
    updateAudioBtnUI(false);
  };

  currentSpeechUtterance.onerror = () => {
    state.isSpeaking = false;
    updateAudioBtnUI(false);
  };

  window.speechSynthesis.speak(currentSpeechUtterance);
}

function stopSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isSpeaking = false;
  updateAudioBtnUI(false);
}

function updateAudioBtnUI(isPlaying) {
  const btn = document.getElementById('audioReaderToggleBtn');
  const btnText = document.getElementById('audioReaderBtnText');
  const playIcon = btn?.querySelector('.play-audio-icon');
  const pauseIcon = btn?.querySelector('.pause-audio-icon');

  if (!btn) return;

  if (isPlaying) {
    btn.classList.add('playing');
    if (btnText) btnText.textContent = 'Dừng Nghe';
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
  } else {
    btn.classList.remove('playing');
    if (btnText) btnText.textContent = 'Nghe Bình Giảng';
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }
}

/* ==========================================================================
   6. Works Rendering & Filtering
   ========================================================================== */

function getFilteredWorks() {
  return state.works.filter(work => {
    if (state.currentCategory !== 'all' && work.category !== state.currentCategory) {
      return false;
    }

    if (state.currentStatus === 'reading' && (work.progress <= 0 || work.progress >= 100)) {
      return false;
    }
    if (state.currentStatus === 'saved' && !work.isFavorite) {
      return false;
    }
    if (state.currentStatus === 'completed' && work.progress < 100) {
      return false;
    }

    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchTitle = work.title.toLowerCase().includes(q);
      const matchAuthor = work.author.toLowerCase().includes(q);
      const matchSummary = work.summary ? work.summary.toLowerCase().includes(q) : false;
      const matchText = work.fullTextSections ? work.fullTextSections.some(s => s.content.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchAuthor && !matchSummary && !matchText) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (state.currentSort === 'rating') return b.rating - a.rating;
    if (state.currentSort === 'title') return a.title.localeCompare(b.title);
    return (b.reviews || 0) - (a.reviews || 0);
  });
}

function renderWorks() {
  const booksGrid = document.getElementById('booksGrid');
  const emptyState = document.getElementById('emptyState');
  const totalCountEl = document.getElementById('totalBooksCount');

  if (totalCountEl) totalCountEl.textContent = state.works.length;

  const filtered = getFilteredWorks();

  if (!booksGrid) return;

  if (filtered.length === 0) {
    booksGrid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  booksGrid.innerHTML = filtered.map(work => createWorkCardHTML(work)).join('');
  attachWorkCardEvents(booksGrid);
}

function createWorkCardHTML(work) {
  const isFavClass = work.isFavorite ? 'active' : '';
  const progressText = work.progress === 100 
    ? 'Đã thuộc bài' 
    : work.progress > 0 
      ? `Đang ôn: ${work.progress}%` 
      : 'Chưa ôn tập';

  const progressFill = work.progress > 0 ? `${work.progress}%` : '0%';
  const gradient = work.theme?.gradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
  const icon = work.theme?.icon || '📖';
  const badgeHTML = work.badge ? `<span class="cover-tag-badge">${work.badge}</span>` : '';
  const customAudioBadge = work.customAudioData ? `<span class="cover-tag-badge" style="background: rgba(6,182,212,0.3); border: 1px solid var(--accent-cyan); margin-left: 4px;">🎵 Audio riêng</span>` : '';

  const adminCardBar = state.isAdmin ? `
    <div class="admin-card-actions">
      <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openEditWorkModal('${work.id}')" title="Sửa nội dung">
        ✏️ Sửa Tác Phẩm
      </button>
      <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); deleteWork('${work.id}')" title="Xóa tác phẩm" style="color: var(--accent-rose);">
        🗑️ Xóa
      </button>
    </div>
  ` : '';

  const coverStyle = work.coverImage 
    ? `background-image: linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%), url('${work.coverImage}'); background-size: cover; background-position: center;`
    : `background: ${gradient};`;
  const customCoverClass = work.coverImage ? 'has-custom-cover' : '';

  return `
    <article class="book-card" data-work-id="${work.id}">
      <div class="card-cover-container" onclick="openReaderModal('${work.id}')">
        <div class="card-cover-art ${customCoverClass}" style="${coverStyle}">
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${badgeHTML}
            ${customAudioBadge}
          </div>
          <div class="cover-center-art">${icon}</div>
          <div class="cover-bottom-meta">
            <h4 class="cover-card-title">${work.title}</h4>
            <p class="cover-card-author">${work.author} (${work.period ? work.period.split(' ')[0] : '12'})</p>
          </div>
        </div>

        <button class="card-fav-btn ${isFavClass}" title="${work.isFavorite ? 'Bỏ lưu' : 'Lưu vào tủ bài ôn'}" data-fav-id="${work.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${work.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="card-info">
        <div class="card-category-row">
          <span class="card-cat-name">${work.categoryName}</span>
          <span class="card-rating">⭐ ${work.rating}/10</span>
        </div>

        <h3 class="card-title" onclick="openReaderModal('${work.id}')">${work.title}</h3>
        <p class="card-author">${work.author} • ${work.readTime || '25 phút'}</p>

        <p class="card-desc-snippet">${work.summary}</p>

        <div class="card-progress-wrap">
          <div class="card-progress-header">
            <span>${progressText}</span>
            <span>${work.progress}%</span>
          </div>
          <div class="card-progress-bar">
            <div class="card-progress-fill" style="width: ${progressFill}; ${work.progress === 100 ? 'background: var(--accent-cyan);' : ''}"></div>
          </div>
        </div>

        <div class="card-actions-row">
          <button class="btn btn-primary btn-sm" onclick="openReaderModal('${work.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Đọc Toàn Văn
          </button>
          <button class="btn btn-secondary btn-sm" onclick="listenToWorkPreview('${work.id}')" title="Nghe Bình Giảng Audio">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            Bình Giảng
          </button>
        </div>

        ${adminCardBar}
      </div>
    </article>
  `;
}

function attachWorkCardEvents(container) {
  const favBtns = container.querySelectorAll('.card-fav-btn');
  favBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!checkActionPermission('canBookmarkWorks', 'Lưu Tủ Bài Ôn')) return;
      const workId = btn.getAttribute('data-fav-id');
      toggleBookmark(workId);
    });
  });
}

function toggleBookmark(workId) {
  const work = state.works.find(b => b.id === workId);
  if (!work) return;

  work.isFavorite = !work.isFavorite;
  saveWorks();

  showToast(work.isFavorite ? `Đã lưu "${work.title}" vào Tủ bài ôn thi!` : `Đã bỏ lưu "${work.title}"`, 'success');
  
  renderWorks();
  renderFeaturedWork();
  renderShelfWorks();
  updateStats();
}

/* ==========================================================================
   7. Interactive Reader Modal
   ========================================================================== */

function openReaderModal(workId) {
  const work = state.works.find(b => b.id === workId);
  if (!work) return;

  state.activeWorkId = workId;
  state.activeSectionIndex = 0;

  const modal = document.getElementById('readerModalOverlay');
  const titleEl = document.getElementById('readerBookTitle');
  const authorEl = document.getElementById('readerBookAuthor');
  const catEl = document.getElementById('readerBookCategory');

  if (titleEl) titleEl.textContent = work.title;
  if (authorEl) authorEl.textContent = `${work.author} • ${work.genre || 'Ngữ văn 12'}`;
  if (catEl) catEl.textContent = work.categoryName;

  setupWorkAudioPlayer(work);
  renderReaderContent();

  openModal(modal);

  applyReaderSettings();
  updateAdminUI();
}

function renderReaderContent() {
  const work = state.works.find(b => b.id === state.activeWorkId);
  if (!work) return;

  const sidebarTitle = document.getElementById('readerSidebarTitle');
  const chapterList = document.getElementById('chapterList');
  const container = document.getElementById('readerPageContainer');
  const currentChapterText = document.getElementById('readerCurrentChapter');
  const pageProgressText = document.getElementById('readerPageProgress');
  const scrollArea = document.getElementById('readerContentScroll');

  if (state.readerTab === 'fulltext') {
    if (sidebarTitle) sidebarTitle.textContent = 'Mục Lục Trích Đoạn';

    const sections = work.fullTextSections || [
      { sectionTitle: "Toàn văn tác phẩm", content: work.summary }
    ];

    if (state.activeSectionIndex >= sections.length) state.activeSectionIndex = 0;
    const currentSection = sections[state.activeSectionIndex];

    if (chapterList) {
      chapterList.innerHTML = sections.map((sec, idx) => `
        <li class="chapter-item ${idx === state.activeSectionIndex ? 'active' : ''}" onclick="switchSectionIndex(${idx})">
          <span>📜</span> ${sec.sectionTitle}
        </li>
      `).join('');
    }

    if (currentChapterText) currentChapterText.textContent = currentSection.sectionTitle;
    if (pageProgressText) pageProgressText.textContent = `Phần ${state.activeSectionIndex + 1} / ${sections.length}`;

    const isPoem = work.category === 'poetry' || currentSection.content.includes('\n\n') && currentSection.content.split('\n').length > 15;
    const bodyClass = isPoem ? 'fulltext-poem-body' : 'fulltext-body';

    const sampleIntroBox = state.activeSectionIndex === 0 && work.sampleIntro ? `
      <div class="reader-highlight-box" style="border-left-color: var(--primary); background: rgba(99, 102, 241, 0.08); margin-bottom: 24px;">
        <h4 style="color: var(--primary-light);">🌟 Gợi Ý Mở Bài Điểm 9+:</h4>
        <p style="font-style: italic;">"${work.sampleIntro}"</p>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="fulltext-section-box">
        <h2 class="fulltext-section-header">📜 ${currentSection.sectionTitle}</h2>
        ${sampleIntroBox}
        <div class="${bodyClass}">${currentSection.content}</div>
      </div>
    `;

  } else {
    if (sidebarTitle) sidebarTitle.textContent = 'Hệ Thống Luận Điểm 9+';

    const chapters = work.chapters || [];
    if (state.activeSectionIndex >= chapters.length) state.activeSectionIndex = 0;
    const currentChap = chapters[state.activeSectionIndex];

    if (chapterList) {
      chapterList.innerHTML = chapters.map((chap, idx) => `
        <li class="chapter-item ${idx === state.activeSectionIndex ? 'active' : ''}" onclick="switchSectionIndex(${idx})">
          <span>🧠</span> ${chap.title.replace(/^Chương \d+:\s*/, '')}
        </li>
      `).join('');
    }

    if (currentChap) {
      if (currentChapterText) currentChapterText.textContent = currentChap.title;
      if (pageProgressText) pageProgressText.textContent = `Luận điểm ${state.activeSectionIndex + 1} / ${chapters.length}`;

      const paragraphsHTML = (currentChap.paragraphs || []).map(p => `<p class="reader-paragraph">${p}</p>`).join('');
      const highlightHTML = currentChap.highlight ? `
        <div class="reader-highlight-box">
          <h4>${currentChap.highlight.title}</h4>
          <p>${currentChap.highlight.text}</p>
        </div>
      ` : '';

      container.innerHTML = `
        <h1 class="reader-chapter-title">${currentChap.title}</h1>
        <p class="reader-chapter-lead">${currentChap.lead}</p>
        ${paragraphsHTML}
        ${highlightHTML}
      `;
    }
  }

  if (scrollArea) scrollArea.scrollTop = 0;
}

function switchSectionIndex(idx) {
  state.activeSectionIndex = idx;
  renderReaderContent();
  stopAudioPlayback();
}

function initReaderControls() {
  const closeBtn = document.getElementById('closeReaderModalBtn');
  const modal = document.getElementById('readerModalOverlay');
  const scrollArea = document.getElementById('readerContentScroll');
  const progressBar = document.getElementById('readerScrollProgressBar');

  const tabFullTextBtn = document.getElementById('tabFullTextBtn');
  const tabOutlinesBtn = document.getElementById('tabOutlinesBtn');

  tabFullTextBtn?.addEventListener('click', () => {
    state.readerTab = 'fulltext';
    tabFullTextBtn.classList.add('active');
    tabOutlinesBtn?.classList.remove('active');
    state.activeSectionIndex = 0;
    renderReaderContent();
  });

  tabOutlinesBtn?.addEventListener('click', () => {
    state.readerTab = 'outlines';
    tabOutlinesBtn.classList.add('active');
    tabFullTextBtn?.classList.remove('active');
    state.activeSectionIndex = 0;
    renderReaderContent();
  });

  closeBtn?.addEventListener('click', () => {
    closeModal(modal);
    stopAudioPlayback();
  });

  if (scrollArea && progressBar) {
    scrollArea.addEventListener('scroll', () => {
      const scrollTop = scrollArea.scrollTop;
      const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    });
  }

  document.getElementById('prevChapterBtn')?.addEventListener('click', () => {
    if (state.activeSectionIndex > 0) {
      switchSectionIndex(state.activeSectionIndex - 1);
    } else {
      showToast('Bạn đang ở mục đầu tiên', 'info');
    }
  });

  document.getElementById('nextChapterBtn')?.addEventListener('click', () => {
    const work = state.works.find(b => b.id === state.activeWorkId);
    if (!work) return;

    const list = state.readerTab === 'fulltext' ? work.fullTextSections : work.chapters;
    if (list && state.activeSectionIndex < list.length - 1) {
      switchSectionIndex(state.activeSectionIndex + 1);
    } else {
      showToast('Chúc mừng bạn đã đọc xong toàn bộ các mục của tác phẩm này! 🎉', 'success');
      work.progress = 100;
      saveWorks();
      renderWorks();
      updateStats();
    }
  });

  document.getElementById('decreaseFontSizeBtn')?.addEventListener('click', () => {
    if (state.readerFontSize > 14) {
      state.readerFontSize -= 2;
      applyReaderSettings();
    }
  });

  document.getElementById('increaseFontSizeBtn')?.addEventListener('click', () => {
    if (state.readerFontSize < 34) {
      state.readerFontSize += 2;
      applyReaderSettings();
    }
  });

  document.getElementById('resetFontSizeBtn')?.addEventListener('click', () => {
    state.readerFontSize = 20;
    applyReaderSettings();
    showToast('Đã đặt lại cỡ chữ chuẩn 20px', 'info');
  });

  document.getElementById('toggleLineHeightBtn')?.addEventListener('click', () => {
    state.readerLineHeight = state.readerLineHeight === 'loose' ? 'normal' : 'loose';
    applyReaderSettings();
    showToast(state.readerLineHeight === 'loose' ? 'Đã đổi sang khoảng cách dòng: Thoáng' : 'Đã đổi sang khoảng cách dòng: Vừa', 'info');
  });

  // Reader Quick Scroll Buttons (Lướt lên đầu bài / Lướt xuống cuối bài)
  const readerScrollTopBtn = document.getElementById('readerScrollTopBtn');
  const readerScrollBottomBtn = document.getElementById('readerScrollBottomBtn');

  readerScrollTopBtn?.addEventListener('click', () => {
    if (scrollArea) {
      scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  readerScrollBottomBtn?.addEventListener('click', () => {
    if (scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
    }
  });

  document.getElementById('toggleFontFamilyBtn')?.addEventListener('click', () => {
    state.readerFontFamily = state.readerFontFamily === 'serif' ? 'sans' : 'serif';
    applyReaderSettings();
  });

  document.querySelectorAll('.theme-pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.theme-pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.readerTheme = pill.getAttribute('data-readertheme');
      applyReaderSettings();
    });
  });

  document.getElementById('audioReaderToggleBtn')?.addEventListener('click', () => {
    const work = state.works.find(b => b.id === state.activeWorkId);
    if (work) toggleAudioPlay(work);
  });
}

function applyReaderSettings() {
  const scrollArea = document.getElementById('readerContentScroll');
  const dialog = document.querySelector('.reader-modal-dialog');
  const indicator = document.getElementById('fontSizeIndicator');
  const fontLabel = document.getElementById('fontFamilyLabel');
  const lineHeightLabel = document.getElementById('lineHeightLabel');

  if (scrollArea) {
    scrollArea.style.fontSize = `${state.readerFontSize}px`;
    scrollArea.classList.toggle('font-serif', state.readerFontFamily === 'serif');
    scrollArea.classList.toggle('font-sans', state.readerFontFamily === 'sans');
    scrollArea.classList.toggle('loose-spacing', state.readerLineHeight === 'loose');
    scrollArea.classList.toggle('normal-spacing', state.readerLineHeight === 'normal');
  }

  if (indicator) indicator.textContent = `${state.readerFontSize}px`;
  if (fontLabel) fontLabel.textContent = state.readerFontFamily === 'serif' ? 'Serif' : 'Sans-serif';
  if (lineHeightLabel) lineHeightLabel.textContent = state.readerLineHeight === 'loose' ? 'Dòng: Thoáng' : 'Dòng: Vừa';

  if (dialog) {
    dialog.classList.remove('reader-theme-dark', 'reader-theme-sepia', 'reader-theme-light');
    dialog.classList.add(`reader-theme-${state.readerTheme}`);
  }

  localStorage.setItem('vanhoc12_reader_fontsize', state.readerFontSize);
  localStorage.setItem('vanhoc12_reader_lineheight', state.readerLineHeight);
}

/* ==========================================================================
   8. Shelf & Notes Logic
   ========================================================================== */

function renderShelfWorks(tab = 'all') {
  const shelfGrid = document.getElementById('shelfGrid');
  const shelfEmptyState = document.getElementById('shelfEmptyState');
  const shelfAllCount = document.getElementById('shelfAllCount');

  if (!shelfGrid) return;

  const savedWorks = state.works.filter(b => b.isFavorite);
  if (shelfAllCount) shelfAllCount.textContent = savedWorks.length;

  let displayWorks = savedWorks;
  if (tab === 'reading') {
    displayWorks = savedWorks.filter(b => b.progress > 0 && b.progress < 100);
  } else if (tab === 'completed') {
    displayWorks = savedWorks.filter(b => b.progress === 100);
  }

  if (displayWorks.length === 0) {
    shelfGrid.innerHTML = '';
    if (shelfEmptyState) shelfEmptyState.style.display = 'block';
    return;
  }

  if (shelfEmptyState) shelfEmptyState.style.display = 'none';
  shelfGrid.innerHTML = displayWorks.map(b => createWorkCardHTML(b)).join('');
  attachWorkCardEvents(shelfGrid);
}

document.querySelectorAll('.shelf-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-shelftab');
    renderShelfWorks(tab);
  });
});

function initNotesEvents() {
  const openModalBtn = document.getElementById('openAddNoteModalBtn');
  const modal = document.getElementById('addNoteModal');
  const closeBtn = document.getElementById('closeAddNoteModalBtn');
  const cancelBtn = document.getElementById('cancelAddNoteBtn');
  const noteForm = document.getElementById('addNoteForm');
  const bookSelect = document.getElementById('noteBookSelect');

  openModalBtn?.addEventListener('click', () => {
    if (!checkActionPermission('canAddPersonalNotes', 'Thêm Ghi Chú Cá Nhân')) return;
    if (bookSelect) {
      bookSelect.innerHTML = state.works.map(b => `<option value="${b.id}">${b.title}</option>`).join('');
    }
    openModal(modal);
  });

  [closeBtn, cancelBtn].forEach(b => {
    b?.addEventListener('click', () => closeModal(modal));
  });

  noteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkActionPermission('canAddPersonalNotes', 'Thêm Ghi Chú Cá Nhân')) return;

    const workId = bookSelect.value;
    const work = state.works.find(b => b.id === workId);
    const content = document.getElementById('noteContent').value.trim();
    const tag = document.getElementById('noteTag').value.trim() || '#DanChungVang';

    if (!content) return;

    const newNote = {
      id: `note-${Date.now()}`,
      workId: workId,
      workTitle: work ? work.title : 'Chung',
      content,
      tag: tag.startsWith('#') ? tag : `#${tag}`,
      date: new Date().toLocaleDateString('vi-VN')
    };

    state.notes.unshift(newNote);
    saveNotes();

    e.target.reset();
    closeModal(modal);
    renderNotes();
    updateStats();
    showToast('📝 Đã lưu dẫn chứng mới vào sổ tay!', 'success');
  });
}

function renderNotes() {
  const notesGrid = document.getElementById('notesGrid');
  const emptyState = document.getElementById('notesEmptyState');
  if (!notesGrid) return;

  if (state.notes.length === 0) {
    notesGrid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  notesGrid.innerHTML = state.notes.map(note => `
    <article class="note-card" data-note-id="${note.id}">
      <div>
        <div class="note-book-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          ${note.workTitle}
        </div>
        <p class="note-body">"${note.content}"</p>
      </div>

      <div class="note-footer">
        <span class="note-tag-chip">${note.tag} • ${note.date}</span>
        <div class="note-actions">
          <button class="note-action-btn" onclick="copyNoteContent('${note.id}')" title="Sao chép dẫn chứng">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <button class="note-action-btn note-delete-btn" onclick="deleteNote('${note.id}')" title="Xóa dẫn chứng">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function copyNoteContent(noteId) {
  if (!checkActionPermission('canCopyNotes', 'Sao chép dẫn chứng')) return;

  const note = state.notes.find(n => n.id === noteId);
  if (!note) return;

  navigator.clipboard.writeText(`"${note.content}" — (${note.workTitle})`).then(() => {
    showToast('Đã sao chép dẫn chứng vào bộ nhớ tạm!', 'success');
  }).catch(() => {
    showToast('Không thể sao chép tự động', 'error');
  });
}

function deleteNote(noteId) {
  state.notes = state.notes.filter(n => n.id !== noteId);
  saveNotes();
  renderNotes();
  updateStats();
  showToast('Đã xóa ghi chú', 'info');
}

/* ==========================================================================
   9. Miscellaneous & Helpers
   ========================================================================== */

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('vanhoc12_theme', state.theme);
  applyBackground();
  showToast(state.theme === 'dark' ? 'Đã bật giao diện Tối hiện đại' : 'Đã bật giao diện Sáng giấy mộc', 'info');
}

function switchSection(sectionId) {
  const exploreSec = document.getElementById('explore');
  const shelfSec = document.getElementById('shelf');
  const goalsSec = document.getElementById('goals');
  const notesSec = document.getElementById('notes');

  if (shelfSec) shelfSec.style.display = 'none';

  if (sectionId === 'shelf') {
    if (shelfSec) {
      shelfSec.style.display = 'block';
      renderShelfWorks();
      shelfSec.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (sectionId === 'explore') {
    exploreSec?.scrollIntoView({ behavior: 'smooth' });
  } else if (sectionId === 'goals') {
    goalsSec?.scrollIntoView({ behavior: 'smooth' });
  } else if (sectionId === 'notes') {
    notesSec?.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderFeaturedWork() {
  const featured = state.works.find(b => b.isFeatured) || state.works[0];
  if (!featured) return;

  const titleEl = document.getElementById('featuredTitle');
  const subEl = document.getElementById('featuredSubtitle');
  const authEl = document.getElementById('featuredAuthor');
  const timeEl = document.getElementById('featuredTime');
  const rateEl = document.getElementById('featuredRating');
  const catEl = document.getElementById('featuredCategory');
  const bkmkText = document.getElementById('featuredBookmarkText');
  const bkmkBtn = document.getElementById('featuredBookmarkBtn');

  if (titleEl) titleEl.textContent = featured.title;
  if (subEl) subEl.textContent = featured.summary;
  if (authEl) authEl.textContent = featured.author;
  if (timeEl) timeEl.textContent = `~ ${featured.readTime || '35 phút'}`;
  if (rateEl) rateEl.textContent = `⭐ ${featured.rating} / 10`;
  if (catEl) catEl.textContent = featured.categoryName;

  if (bkmkText && bkmkBtn) {
    if (featured.isFavorite) {
      bkmkText.textContent = 'Đã Lưu Tủ Bài Ôn';
      bkmkBtn.style.color = 'var(--accent-rose)';
      bkmkBtn.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    } else {
      bkmkText.textContent = 'Lưu Tủ Bài Ôn';
      bkmkBtn.style.color = '';
      bkmkBtn.style.borderColor = '';
    }
  }

  // Cập nhật bìa sách 3D trong phần Hero Spotlight
  const heroBookCard = document.getElementById('featuredBookCard');
  if (heroBookCard) {
    const heroCover = heroBookCard.querySelector('.book-cover-gradient');
    const heroTitle = heroBookCard.querySelector('.cover-main-title');
    const heroAuthor = heroBookCard.querySelector('.cover-author-name');
    if (heroTitle) heroTitle.textContent = featured.title.toUpperCase();
    if (heroAuthor) heroAuthor.textContent = `NHÀ VĂN ${featured.author.toUpperCase()}`;

    if (heroCover) {
      if (featured.coverImage) {
        heroCover.style.backgroundImage = `linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.88) 100%), url('${featured.coverImage}')`;
        heroCover.style.backgroundSize = 'cover';
        heroCover.style.backgroundPosition = 'center';
        heroCover.classList.add('has-custom-cover');
      } else {
        heroCover.style.backgroundImage = featured.theme?.gradient || 'linear-gradient(135deg, #091a36 0%, #1e1b4b 50%, #4338ca 100%)';
        heroCover.style.backgroundSize = '';
        heroCover.style.backgroundPosition = '';
        heroCover.classList.remove('has-custom-cover');
      }
    }
  }
}

function renderRandomQuote() {
  const quoteText = document.getElementById('dailyQuoteText');
  const quoteAuthor = document.getElementById('dailyQuoteAuthor');
  if (!quoteText || !quoteAuthor) return;

  const quotes = typeof LITERARY_QUOTES !== 'undefined' ? LITERARY_QUOTES : [];
  if (quotes.length === 0) return;

  const randIdx = Math.floor(Math.random() * quotes.length);
  const q = quotes[randIdx];

  quoteText.style.opacity = '0';
  setTimeout(() => {
    quoteText.textContent = `"${q.quote}"`;
    quoteAuthor.textContent = `— ${q.author} (${q.context})`;
    quoteText.style.opacity = '1';
  }, 150);
}

function updateStats() {
  const totalNotesCountStat = document.getElementById('totalNotesCountStat');
  if (totalNotesCountStat) totalNotesCountStat.textContent = state.notes.length;

  const shelfCountBadge = document.getElementById('shelfCountBadge');
  const favCount = state.works.filter(b => b.isFavorite).length;
  if (shelfCountBadge) shelfCountBadge.textContent = favCount;
}

function isModalOpen() {
  return document.querySelector('.modal-overlay.active, .reader-modal-overlay.active') !== null;
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  if (!isModalOpen()) {
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active, .reader-modal-overlay.active').forEach(m => {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
  stopAudioPlayback();
}

function initModalBackdropEvents() {
  document.querySelectorAll('.modal-overlay, .reader-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
        if (overlay.id === 'readerModalOverlay') {
          stopAudioPlayback();
        }
      }
    });
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   6. Google Firebase Cloud Sync Module (Đồng Bộ Đám Mây Trực Tuyến)
   ========================================================================== */

function getStoredFirebaseConfig() {
  const saved = localStorage.getItem('vanhoc12_firebase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Lỗi đọc cấu hình Firebase từ localStorage:", e);
    }
  }
  if (typeof DEFAULT_FIREBASE_CONFIG !== 'undefined' && DEFAULT_FIREBASE_CONFIG) {
    return DEFAULT_FIREBASE_CONFIG;
  }
  return null;
}

function updateCloudStatusUI(status, text) {
  const badge = document.getElementById('cloudSyncStatusBadge');
  const badgeText = document.getElementById('cloudSyncStatusText');
  const modalText = document.getElementById('cloudModalStatusText');

  if (badge) {
    badge.className = `cloud-status-badge ${status}`;
  }

  const label = text || (status === 'online' ? 'Đám Mây: Trực Tuyến' : status === 'syncing' ? 'Đám Mây: Đang Đồng Bộ...' : 'Đám Mây: Ngoại Tuyến');

  if (badgeText) badgeText.textContent = label;
  if (modalText) {
    if (status === 'online') {
      modalText.textContent = '🟢 Đã kết nối Đám mây Firebase (Đồng bộ thời gian thực)';
      modalText.style.color = 'var(--accent-emerald)';
    } else if (status === 'syncing') {
      modalText.textContent = '⏳ Đang đồng bộ dữ liệu lên đám mây...';
      modalText.style.color = 'var(--accent-cyan)';
    } else {
      modalText.textContent = '⚪ Ngoại tuyến (Đang dùng dữ liệu trên máy)';
      modalText.style.color = 'var(--text-secondary)';
    }
  }
}

function initFirebaseCloudSync(customConfig = null) {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config) {
    state.cloudSync.enabled = false;
    state.cloudSync.connected = false;
    state.cloudSync.db = null;
    updateCloudStatusUI('offline', 'Đám Mây: Ngoại Tuyến');
    return false;
  }

  if (typeof firebase === 'undefined') {
    console.warn("Thư viện Firebase SDK chưa sẵn sàng.");
    updateCloudStatusUI('offline', 'Chưa tải xong SDK');
    return false;
  }

  try {
    let app;
    if (!firebase.apps.length) {
      app = firebase.initializeApp(config);
    } else {
      app = firebase.app();
    }

    const db = firebase.database();
    state.cloudSync.db = db;
    state.cloudSync.enabled = true;

    // Theo dõi trạng thái kết nối socket thời gian thực với Firebase
    db.ref('.info/connected').on('value', (snap) => {
      const isConnected = snap.val() === true;
      state.cloudSync.connected = isConnected;
      if (isConnected) {
        updateCloudStatusUI('online', 'Đám Mây: Trực Tuyến');
      } else {
        updateCloudStatusUI('offline', 'Đám Mây: Đang Kết Nối...');
      }
    });

    attachFirebaseListeners(db);
    return true;
  } catch (err) {
    console.error("Lỗi khởi tạo Firebase:", err);
    state.cloudSync.enabled = false;
    state.cloudSync.connected = false;
    state.cloudSync.db = null;
    updateCloudStatusUI('offline', 'Lỗi Cấu Hình Đám Mây');
    return false;
  }
}

function attachFirebaseListeners(db) {
  if (state.cloudSync.listenersAttached) return;
  state.cloudSync.listenersAttached = true;

  // 1. Đồng bộ kho tác phẩm (Works)
  db.ref('vanhoc12/works').on('value', (snapshot) => {
    if (snapshot.exists()) {
      let cloudWorks = snapshot.val();
      if (!Array.isArray(cloudWorks) && typeof cloudWorks === 'object') {
        cloudWorks = Object.values(cloudWorks);
      }

      if (Array.isArray(cloudWorks) && cloudWorks.length > 0) {
        // Hợp nhất dữ liệu mới nhất từ đám mây
        state.works = cloudWorks;
        try {
          localStorage.setItem('vanhoc12_works_v2', JSON.stringify(cloudWorks));
        } catch (e) {
          console.warn("Storage quota warning on cloud sync works:", e);
        }
        renderWorks();
        renderFeaturedWork();
        renderShelfWorks();
        updateStats();

        if (state.activeWorkId) {
          const currentWork = state.works.find(w => w.id === state.activeWorkId);
          if (currentWork) {
            setupWorkAudioPlayer(currentWork);
            renderReaderContent();
          }
        }
      }
    } else if (state.isAdmin && state.works && state.works.length > 0) {
      // Nếu là Admin và đám mây còn trống, tự động đẩy kho tác phẩm ban đầu lên
      db.ref('vanhoc12/works').set(JSON.parse(JSON.stringify(state.works))).catch(console.warn);
    }
  });

  // 2. Đồng bộ hình nền mặc định toàn web do Admin đặt (Site Background)
  db.ref('vanhoc12/siteBackground').on('value', (snapshot) => {
    if (snapshot.exists()) {
      const bgData = snapshot.val();
      if (bgData && bgData.customBg !== undefined) {
        state.siteDefaultBg = bgData.customBg;
        state.siteDefaultOverlay = bgData.bgOverlay || '70';
        state.siteDefaultBlur = bgData.bgBlur || '3';

        localStorage.setItem('vanhoc12_site_default_bg', state.siteDefaultBg);
        localStorage.setItem('vanhoc12_site_default_overlay', state.siteDefaultOverlay);
        localStorage.setItem('vanhoc12_site_default_blur', state.siteDefaultBlur);

        // Nếu học sinh chưa tự chỉnh hình nền riêng, hiển thị ngay nền Admin cập nhật
        if (!state.hasUserCustomizedBg) {
          state.customBg = state.siteDefaultBg;
          state.bgOverlay = state.siteDefaultOverlay;
          state.bgBlur = state.siteDefaultBlur;
          applyBackground();
        }
      }
    } else if (state.isAdmin && state.siteDefaultBg) {
      db.ref('vanhoc12/siteBackground').set({
        customBg: state.siteDefaultBg,
        bgOverlay: state.siteDefaultOverlay,
        bgBlur: state.siteDefaultBlur
      }).catch(console.warn);
    }
  });

  // 3. Đồng bộ phân quyền khách xem do Admin đặt (Guest Permissions)
  db.ref('vanhoc12/guestPermissions').on('value', (snapshot) => {
    if (snapshot.exists()) {
      const permData = snapshot.val();
      if (permData && typeof permData === 'object') {
        state.guestPermissions = { ...DEFAULT_GUEST_PERMISSIONS, ...permData };
        localStorage.setItem('vanhoc12_guest_perms', JSON.stringify(state.guestPermissions));
        applyGuestPermissionsUI();
      }
    } else if (state.isAdmin) {
      db.ref('vanhoc12/guestPermissions').set(state.guestPermissions).catch(console.warn);
    }
  });
}

function syncDataToCloud(notify = true) {
  if (!state.cloudSync || !state.cloudSync.db) return Promise.resolve(false);
  if (!state.isAdmin) return Promise.resolve(false); // Chỉ Admin mới có quyền đẩy dữ liệu lên

  const db = state.cloudSync.db;
  updateCloudStatusUI('syncing', 'Đang Đồng Bộ...');

  // Dọn dẹp dữ liệu bài học để loại bỏ các trường undefined trước khi ghi lên RTDB
  const sanitizedWorks = JSON.parse(JSON.stringify(state.works));

  return Promise.all([
    db.ref('vanhoc12/works').set(sanitizedWorks),
    db.ref('vanhoc12/siteBackground').set({
      customBg: state.siteDefaultBg || state.customBg || '',
      bgOverlay: state.siteDefaultOverlay || state.bgOverlay || '70',
      bgBlur: state.siteDefaultBlur || state.bgBlur || '3'
    }),
    db.ref('vanhoc12/guestPermissions').set(state.guestPermissions)
  ]).then(() => {
    updateCloudStatusUI('online', 'Đám Mây: Đã Đồng Bộ');
    if (notify) showToast('☁️ Đã đồng bộ bài học, bìa sách và hình nền lên Đám mây trực tuyến thành công!', 'success');
    return true;
  }).catch(err => {
    console.error("Lỗi đồng bộ Firebase:", err);
    updateCloudStatusUI('offline', 'Lỗi Đồng Bộ');
    if (notify) showToast('⚠️ Không thể đồng bộ lên Firebase: ' + (err.message || 'Lỗi mạng'), 'error');
    return false;
  });
}

function parseFirebaseConfigInput(rawText) {
  if (!rawText || !rawText.trim()) return null;
  const trimmed = rawText.trim();

  // Thử parse dạng JSON chuẩn
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // Thử trích xuất object JS
  }

  try {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const objText = trimmed.substring(firstBrace, lastBrace + 1);
      const fn = new Function('return (' + objText + ')');
      const result = fn();
      if (result && typeof result === 'object' && (result.apiKey || result.databaseURL || result.projectId)) {
        return result;
      }
    }
  } catch (err) {
    console.warn("Không thể parse cấu hình Firebase:", err);
  }
  return null;
}

function initCloudEvents() {
  const modal = document.getElementById('firebaseConfigModal');
  const openBtn = document.getElementById('openCloudConfigBtn');
  const badgeBtn = document.getElementById('cloudSyncStatusBadge');
  const closeBtn = document.getElementById('closeFirebaseConfigModalBtn');
  const cancelBtn = document.getElementById('cancelFirebaseConfigBtn');
  const saveBtn = document.getElementById('saveFirebaseConfigBtn');
  const disconnectBtn = document.getElementById('disconnectCloudBtn');
  const testSyncBtn = document.getElementById('testCloudSyncBtn');
  const configInput = document.getElementById('firebaseConfigInput');

  function openConfigModal() {
    const existing = getStoredFirebaseConfig();
    if (existing && configInput) {
      configInput.value = JSON.stringify(existing, null, 2);
    }
    updateCloudStatusUI(state.cloudSync.connected ? 'online' : state.cloudSync.enabled ? 'syncing' : 'offline');
    openModal(modal);
  }

  openBtn?.addEventListener('click', openConfigModal);
  badgeBtn?.addEventListener('click', openConfigModal);

  [closeBtn, cancelBtn].forEach(b => {
    b?.addEventListener('click', () => closeModal(modal));
  });

  saveBtn?.addEventListener('click', () => {
    const raw = configInput ? configInput.value : '';
    const parsed = parseFirebaseConfigInput(raw);

    if (!parsed) {
      showToast('⚠️ Cấu hình Firebase không hợp lệ! Vui lòng copy đúng đoạn firebaseConfig = { ... }', 'error');
      return;
    }

    if (!parsed.databaseURL && !parsed.projectId) {
      showToast('⚠️ Thiếu databaseURL hoặc projectId trong cấu hình Firebase.', 'error');
      return;
    }

    // Nếu thiếu databaseURL nhưng có projectId, tự suy luận URL mặc định
    if (!parsed.databaseURL && parsed.projectId) {
      parsed.databaseURL = `https://${parsed.projectId}-default-rtdb.firebaseio.com`;
    }

    try {
      localStorage.setItem('vanhoc12_firebase_config', JSON.stringify(parsed));
      const ok = initFirebaseCloudSync(parsed);
      if (ok) {
        showToast('🚀 Đang kết nối tới Google Firebase...', 'info');
        // Nếu là Admin, đẩy toàn bộ dữ liệu hiện tại lên
        setTimeout(() => {
          if (state.isAdmin) {
            syncDataToCloud(true);
          }
        }, 800);
        closeModal(modal);
      } else {
        showToast('⚠️ Không thể kết nối Firebase với cấu hình này.', 'error');
      }
    } catch (e) {
      showToast('Lỗi lưu cấu hình: ' + e.message, 'error');
    }
  });

  disconnectBtn?.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn ngắt kết nối Đám mây Google Firebase không? Web sẽ chuyển về chế độ ngoại tuyến cục bộ.')) {
      localStorage.removeItem('vanhoc12_firebase_config');
      state.cloudSync.enabled = false;
      state.cloudSync.connected = false;
      state.cloudSync.db = null;
      state.cloudSync.listenersAttached = false;
      if (configInput) configInput.value = '';
      updateCloudStatusUI('offline', 'Đám Mây: Ngoại Tuyến');
      showToast('Đã ngắt kết nối Đám mây Firebase.', 'info');
      closeModal(modal);
    }
  });

  testSyncBtn?.addEventListener('click', () => {
    if (!state.cloudSync.enabled) {
      showToast('Chưa bật Đám mây. Vui lòng dán cấu hình Firebase và bấm Lưu.', 'error');
      return;
    }
    if (!state.isAdmin) {
      showToast('Đang nhận dữ liệu tự động từ Đám mây Quản trị viên.', 'info');
      return;
    }
    syncDataToCloud(true);
  });
}

