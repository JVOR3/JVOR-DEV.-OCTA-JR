/* ============================================================
   TESTIMONIALS UPGRADE JS — JVOR DEV Portfolio v3
   + Firebase Firestore Integration
   ============================================================

   SETUP INSTRUCTIONS:
   1. Pumunta sa https://console.firebase.google.com
   2. Gawa ng project → I-enable ang Firestore Database
   3. I-copy ang iyong Firebase config sa baba (FIREBASE CONFIG section)
   4. Sa Firestore Rules, i-set:
        allow read: if true;
        allow write: if true;  ← pwede mo i-restrict later
   5. I-link ang Firebase SDK sa iyong HTML bago ang script na ito:

      <script type="module" src="testimonials-upgrade.js"></script>

      (KAILANGAN type="module" para gumana ang import)
   ============================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ============================================================
   🔥 FIREBASE CONFIG — I-PALITAN NG SARILI MONG CONFIG
   (makikita sa Firebase Console → Project Settings → Your Apps)
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyC6CN0FDn2lhS6QCflxFWpFFw7AS24WWWs",
  authDomain: "portpolio-jvor.firebaseapp.com",
  databaseURL: "https://portpolio-jvor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portpolio-jvor",
  storageBucket: "portpolio-jvor.firebasestorage.app",
  messagingSenderId: "764831263383",
  appId: "1:764831263383:web:e9103eb423db244f5297d2",
};

/* ── Initialize Firebase ── */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION = 'testimonials'; // Firestore collection name

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function onVisible(el, fn, threshold = 0.25) {
  if (!el) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          fn(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold }
  );
  obs.observe(el);
}

function countUp(el, target, duration = 1800) {
  const start = performance.now();
  const isPercent = el.dataset.suffix === '%';
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + (isPercent ? '%' : '+');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function animateBars() {
  document.querySelectorAll('.tr-bar-f').forEach((bar) => {
    const w = bar.dataset.w || '0';
    setTimeout(() => { bar.style.width = w + '%'; }, 200);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shakeForm(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shakeX 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

function showToast(msg, type = 'success') {
  document.querySelectorAll('.tr-toast').forEach((t) => t.remove());
  const toast = document.createElement('div');
  toast.className = 'tr-toast';
  toast.style.cssText = `
    position:fixed; bottom:2.5rem; right:2.5rem; z-index:99999;
    padding:1.4rem 2.4rem;
    background:${type === 'success'
      ? 'linear-gradient(135deg,#16a34a,#15803d)'
      : 'linear-gradient(135deg,#dc2626,#b91c1c)'};
    color:#fff; font-size:1.5rem; font-weight:600;
    border-radius:1.4rem;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    display:flex; align-items:center; gap:1rem;
    transform:translateY(20px); opacity:0;
    transition:all 0.4s cubic-bezier(0.34,1.2,0.64,1);
    pointer-events:none; font-family:'Poppins',sans-serif;`;

  const icon = type === 'success'
    ? '<i class="bx bx-check-circle" style="font-size:2rem"></i>'
    : '<i class="bx bx-error-circle" style="font-size:2rem"></i>';

  toast.innerHTML = icon + escHtml(msg);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ============================================================
   INJECT REVIEW CARD INTO DOM
   ============================================================ */
function injectReviewCard({ name, category, review, rating, timestamp }, prepend = true) {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;

  const stars = Array(rating).fill('<i class="bx bxs-star"></i>').join('');

  const typeMap = {
    website: { icon: 'bx-globe', label: 'Website' },
    design: { icon: 'bx-palette', label: 'Design' },
    video: { icon: 'bx-video', label: 'Video' },
    other: { icon: 'bx-briefcase', label: 'Project' },
  };
  const { icon, label } = typeMap[category] || typeMap.other;
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  // Format timestamp
  let whenText = 'Just now';
  if (timestamp?.toDate) {
    const d = timestamp.toDate();
    whenText = d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const card = document.createElement('div');
  card.className = 'tr-card';
  card.dataset.category = category;
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px) scale(0.97)';

  card.innerHTML = `
    <div class="tr-card-header">
      <div class="tr-card-avatar-wrap">
        <div class="tr-card-avatar" style="
          background: linear-gradient(135deg,#DF8908,#FF1D15);
          display:flex;align-items:center;justify-content:center;
          font-size:1.8rem;font-weight:800;color:#fff;letter-spacing:0.05em;">
          ${initials}
        </div>
        <span class="tr-card-verified"><i class="bx bxs-badge-check"></i></span>
      </div>
      <div class="tr-card-author-info">
        <h4>${escHtml(name)}</h4>
        <span class="tr-card-position">Verified Client</span>
        <span class="tr-card-company">${whenText}</span>
      </div>
      <div class="tr-card-stars">${stars}</div>
    </div>
    <div class="tr-card-body">
      <span class="tr-card-open-quote">❝</span>
      <p>"${escHtml(review)}"</p>
    </div>
    <div class="tr-card-footer">
      <span class="tr-card-type"><i class="bx ${icon}"></i> ${label}</span>
      <span class="tr-card-when">${whenText}</span>
    </div>`;

  if (prepend) {
    grid.prepend(card);
  } else {
    grid.appendChild(card);
  }

  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.2,0.64,1)';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
  });
}

/* ============================================================
   🔥 LOAD REVIEWS FROM FIRESTORE (on page load)
   ============================================================ */
async function loadReviewsFromFirestore() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;

  try {
    const q = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      injectReviewCard({
        name: data.name || 'Anonymous',
        category: data.category || 'other',
        review: data.review || '',
        rating: data.rating || 5,
        timestamp: data.timestamp || null,
      }, false); // false = append (oldest last, newest first via orderBy desc)
    });

    console.log(`✅ Loaded ${snapshot.size} review(s) from Firestore.`);
  } catch (err) {
    console.error('❌ Failed to load reviews from Firestore:', err);
    // Hindi mag-crash ang page kahit may error sa Firestore
  }
}

/* ============================================================
   🔥 SAVE REVIEW TO FIRESTORE
   ============================================================ */
async function saveReviewToFirestore({ name, email, category, review, rating }) {
  await addDoc(collection(db, COLLECTION), {
    name,
    email,       // stored pero hindi ipinapakita sa card (privacy)
    category,
    review,
    rating,
    timestamp: serverTimestamp(), // auto-set ng Firebase
  });
}

/* ============================================================
   MAIN INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {

  /* --- ShakeX keyframe --- */
  if (!document.getElementById('tr-upgrade-styles')) {
    const style = document.createElement('style');
    style.id = 'tr-upgrade-styles';
    style.textContent = `
      @keyframes shakeX {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-8px)}
        40%{transform:translateX(8px)}
        60%{transform:translateX(-6px)}
        80%{transform:translateX(6px)}
      }
    `;
    document.head.appendChild(style);
  }

  /* --- Metrics count-up --- */
  const section = document.querySelector('.testimonials');
  if (section) {
    onVisible(section, () => {
      animateBars();
      document.querySelectorAll('.tr-metric-n[data-count]').forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        if (!isNaN(target)) countUp(el, target);
      });
    }, 0.15);
  }

  /* --- Load existing reviews from Firestore --- */
  await loadReviewsFromFirestore();

  /* --- Filter tabs --- */
  const trFilters = document.querySelectorAll('.tr-filter');

  if (trFilters.length) {
    trFilters.forEach((tab) => {
      tab.addEventListener('click', () => {
        trFilters.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        let delay = 0;

        // Re-query after dynamic inject
        document.querySelectorAll('.tr-card[data-category]').forEach((card) => {
          const show = cat === 'all' || card.dataset.category === cat;
          if (show) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(28px) scale(0.97)';
            const d = delay;
            setTimeout(() => {
              card.style.transition = 'opacity 0.42s ease, transform 0.42s cubic-bezier(0.34,1.2,0.64,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, d);
            delay += 70;
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px) scale(0.97)';
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            setTimeout(() => card.classList.add('hidden'), 300);
          }
        });
      });
    });
  }

  /* --- Star Rating picker --- */
  const trStarBtns = document.querySelectorAll('.tr-star-btn');
  const ratingInput = document.getElementById('selectedRating');
  const starHintEl = document.getElementById('trStarHint');

  const starHints = {
    1: 'Poor experience',
    2: 'Fair — room to improve',
    3: 'Good work overall',
    4: 'Very good!',
    5: 'Excellent — highly recommend! ⭐',
  };

  let selectedStars = 0;

  function setStarHighlight(upTo) {
    trStarBtns.forEach((b, i) => b.classList.toggle('active', i < upTo));
  }

  if (trStarBtns.length) {
    trStarBtns.forEach((btn, idx) => {
      btn.addEventListener('mouseenter', () => {
        setStarHighlight(idx + 1);
        if (starHintEl) starHintEl.textContent = starHints[idx + 1] || '';
      });
      btn.addEventListener('mouseleave', () => {
        setStarHighlight(selectedStars);
        if (starHintEl)
          starHintEl.textContent = selectedStars
            ? starHints[selectedStars]
            : 'Click to rate your experience';
      });
      btn.addEventListener('click', () => {
        selectedStars = idx + 1;
        if (ratingInput) ratingInput.value = selectedStars;
        setStarHighlight(selectedStars);
        if (starHintEl) starHintEl.textContent = starHints[selectedStars];
      });
    });
  }

  /* --- Review form submit (now with Firebase!) --- */
  const reviewForm = document.getElementById('reviewForm');
  const submitBtn = document.getElementById('trSubmitBtn');
  const submitContent = submitBtn?.querySelector('.tr-submit-content');
  const submitLoading = submitBtn?.querySelector('.tr-submit-loading');

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reviewerName')?.value.trim();
      const email = document.getElementById('reviewerEmail')?.value.trim();
      const review = document.getElementById('reviewText')?.value.trim();
      const rating = document.getElementById('selectedRating')?.value;
      const category = document.getElementById('reviewerCategory')?.value || 'other';

      // Validation
      if (!name || !email || !review) {
        shakeForm(reviewForm);
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      if (!rating || parseInt(rating) === 0) {
        shakeForm(reviewForm);
        showToast('Please select a star rating.', 'error');
        return;
      }

      // Show loading
      if (submitContent) submitContent.style.display = 'none';
      if (submitLoading) submitLoading.style.display = 'flex';
      if (submitBtn) submitBtn.disabled = true;

      try {
        /* 🔥 SAVE TO FIRESTORE */
        await saveReviewToFirestore({ name, email, category, review, rating: parseInt(rating) });

        // Success UI
        if (submitContent) submitContent.style.display = 'none';
        if (submitLoading) submitLoading.style.display = 'none';
        if (submitBtn) {
          submitBtn.innerHTML = `
            <span style="display:flex;align-items:center;justify-content:center;gap:1rem">
              <i class='bx bx-check-circle' style="font-size:2.2rem"></i>
              <span>Review Published!</span>
            </span>`;
          submitBtn.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
          submitBtn.style.boxShadow = '0 8px 32px rgba(22,163,74,0.45)';
        }

        // Inject the new card into the grid immediately (no need to reload page)
        injectReviewCard({ name, category, review, rating: parseInt(rating), timestamp: null }, true);

        showToast('Salamat! Na-publish na ang iyong review.', 'success');
        reviewForm.reset();
        selectedStars = 0;
        setStarHighlight(0);
        if (starHintEl) starHintEl.textContent = 'Click to rate your experience';

      } catch (err) {
        console.error('❌ Firestore save failed:', err);

        // Re-enable button
        if (submitContent) submitContent.style.display = '';
        if (submitLoading) submitLoading.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;

        showToast('Hindi na-save ang review. Subukan ulit.', 'error');
      }
    });
  }

}); // end DOMContentLoaded