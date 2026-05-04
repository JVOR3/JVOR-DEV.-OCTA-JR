// ===== MOBILE MENU TOGGLE FIX =====

const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("bx-x");
};

// close menu when clicking link
document.querySelectorAll(".navbar a").forEach(link => {
  link.onclick = () => {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  }
});

// fix when resizing screen
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  }
});


// ==================== GENERIC REVEAL OBSERVER ====================
const createObserver = (selector, className, delay = 150, threshold = 0.3) => {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add(className), index * delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  items.forEach(item => observer.observe(item));
};

// ABOUT / RESUME
createObserver(".resume-left, .resume-section", "show", 180, 0.3);
createObserver(".about-anim", "show", 160, 0.25);
createObserver(".about-card", "visible", 150, 0.2);
createObserver(".timeline-item", "visible", 200, 0.3);
createObserver(".reveal", "active", 100, 0.3);
createObserver(".tech-icons i", "show-icon", 120, 0.6);

// ==================== ID REVEALS ====================
const singleReveal = (selector, className = "show", threshold = 0.4) => {
  const el = document.querySelector(selector);
  if (!el) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      el.classList.add(className);
      observer.unobserve(el);
    }
  }, { threshold });

  observer.observe(el);
};

singleReveal(".neo-id");
singleReveal(".aclc-id");
singleReveal(".map-container");

console.log('🚀 Enhanced Projects Section - Ready!');

// ==================== BACK TO TOP BUTTON ====================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==================== NEWSLETTER FORM ====================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;

    if (email) {
      alert('✅ Thank you for subscribing! Check your email for confirmation.');
      newsletterForm.reset();
    }
  });
}

// ==================== TYPING EFFECT (disabled — replaced by fixes.js) ====================
// The improved typewriter is in the fixes section below. This original is kept for reference.
/* ORIGINAL TYPING EFFECT — DISABLED
document.addEventListener("DOMContentLoaded", () => {
  const texts = ["Full Stack Web Developer.", "Video Editor", "UI/UX Designer", "Front end dev."];
  const el = document.getElementById("changing-text");
  if (!el) return;
  let t = 0, c = 0, del = false;
  const type = () => {
    el.textContent = texts[t].substring(0, c);
    if (!del && c < texts[t].length) c++;
    else if (del && c > 0) c--;
    else { del = !del; if (!del) t = (t + 1) % texts.length; return setTimeout(type, 1400); }
    setTimeout(type, del ? 60 : 100);
  };
  type();
});
*/

// ==================== COUNTER ====================
const counters = document.querySelectorAll(".counter");
if (counters.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.dataset.target;
        let count = 0;

        const update = () => {
          if (count < target) {
            count += Math.ceil(target / 200);
            counter.innerText = count;
            requestAnimationFrame(update);
          } else counter.innerText = target;
        };
        update();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));
}

// ==================== SKILL BARS ====================
document.querySelectorAll(".skill").forEach(skill => {
  const fill = skill.querySelector(".skill-fill");
  const percent = skill.querySelector(".skill-percent");
  const target = +skill.dataset.percent;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let w = 0;
      const anim = () => {
        if (w <= target) {
          fill.style.width = w + "%";
          percent.textContent = w + "%";
          w++;
          requestAnimationFrame(anim);
        }
      };
      anim();
      observer.unobserve(skill);
    }
  }, { threshold: 0.5 });

  observer.observe(skill);
});

// ==================== STAR RATING ====================
const stars = document.querySelectorAll(".star-rating span");
const ratingInput = document.getElementById("selectedRating");
const ratingText = document.querySelector(".rating-text");
const ratingLabels = { 5: "Excellent ★★★★★", 4: "Very Good ★★★★", 3: "Good ★★★", 2: "Fair ★★", 1: "Poor ★" };

stars.forEach(star => {
  star.onmouseenter = () => {
    const val = star.dataset.value;
    stars.forEach(s => s.classList.toggle("active", s.dataset.value <= val));
  };
  star.onmouseleave = () => {
    const saved = ratingInput?.value || '0';
    stars.forEach(s => s.classList.toggle("active", s.dataset.value <= saved));
  };
  star.onclick = () => {
    const val = star.dataset.value;
    if (ratingInput) ratingInput.value = val;
    if (ratingText) ratingText.textContent = ratingLabels[val] || "Click to rate";
    stars.forEach(s => s.classList.toggle("active", s.dataset.value <= val));
  };
});

// ==================== FIREBASE FIRESTORE REVIEWS ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6CN0FDn2lhS6QCflxFWpFFw7AS24WWWs",
  authDomain: "portpolio-jvor.firebaseapp.com",
  databaseURL: "https://portpolio-jvor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portpolio-jvor",
  storageBucket: "portpolio-jvor.firebasestorage.app",
  messagingSenderId: "764831263383",
  appId: "1:764831263383:web:e9103eb423db244f5297d2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== LOAD FIRESTORE REVIEWS INTO testiGrid ====================
(async function loadReviewsOnPageLoad() {
  try {
    const { getDocs, query, orderBy, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q = query(collection(db, "reviews"), orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    const grid = document.getElementById("testiGrid");
    if (!grid) return;

    function getInitialsAvatar(name) {
      const initials = (name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      let hash = 0;
      for (let i = 0; i < (name || 'U').length; i++) hash = (name || 'U').charCodeAt(i) + ((hash << 5) - hash);
      const hue = Math.abs(hash) % 360;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = `hsl(${hue}, 55%, 40%)`;
      ctx.beginPath(); ctx.arc(40, 40, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `hsl(${hue}, 55%, 65%)`; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${initials.length > 1 ? 26 : 30}px Arial, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(initials, 40, 41);
      return canvas.toDataURL();
    }

    snapshot.forEach(doc => {
      const r = { id: doc.id, ...doc.data() };
      const name = r.name || 'Anonymous';
      const company = r.company || r.role || 'Client';
      const text = r.text || '';
      const rating = r.rating || 5;
      const category = r.category || 'other';
      const date = r.date || '';
      const avatarSrc = r.avatar && r.avatar.startsWith('data:') ? r.avatar : getInitialsAvatar(name);
      const stars = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="opacity:${i < rating ? 1 : 0.15}"></i>`).join('');

      const cardHtml = `
        <div class="tr-card" data-category="${category}">
          <div class="tr-card-header">
            <div class="tr-card-avatar-wrap">
              <img src="${avatarSrc}" alt="${name}" class="tr-card-avatar">
              <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
            </div>
            <div class="tr-card-author-info">
              <h4>${name}</h4>
              <span class="tr-card-position">${company}</span>
              <span class="tr-card-company">Verified Review</span>
            </div>
            <div class="tr-card-stars">${stars}</div>
          </div>
          <div class="tr-card-body">
            <span class="tr-card-open-quote">❝</span>
            <p>"${text}"</p>
          </div>
          <div class="tr-card-footer">
            <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${category}</span>
            <span class="tr-card-when">${date}</span>
          </div>
        </div>`;
      grid.insertAdjacentHTML('beforeend', cardHtml);
    });

    console.log(`✅ Loaded ${snapshot.size} reviews from Firestore into testiGrid`);
  } catch (err) {
    console.error("Hindi ma-load ang reviews:", err);
  }
})();


(function () {
  const reviewForm = document.getElementById("reviewForm");
  if (true) return; // DISABLED: replaced by premium v3 handler below

  // --- Avatar generator (initials-based) ---
  function getInitialsAvatar(name) {
    const initials = name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 80;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = `hsl(${hue}, 55%, 45%)`;
    ctx.beginPath();
    ctx.arc(40, 40, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, 40, 41);
    return canvas.toDataURL();
  }

  // --- Build a review card HTML ---
  function buildReviewCard(review) {
    const fullStars = Array.from({ length: review.rating }, () => `<i class='bx bxs-star'></i>`).join("");
    const emptyStars = Array.from({ length: 5 - review.rating }, () => `<i class='bx bx-star' style="opacity:.3"></i>`).join("");
    return `
      <div class="review-card user-submitted" data-id="${review.id}">
        <div class="review-card-badge"><i class='bx bx-check-shield'></i> Verified User</div>
        <div class="review-header">
          <div class="reviewer-info">
            <img src="${review.avatar}" alt="${review.name}" class="reviewer-photo">
            <div class="reviewer-details">
              <h4>${review.name}</h4>
              <p class="reviewer-role">${review.role || "Client"}</p>
              <p class="reviewer-company">${review.company || ""}</p>
            </div>
          </div>
          <div class="review-rating">${fullStars}${emptyStars}</div>
        </div>
        <div class="review-body">
          <i class='bx bxs-quote-alt-left quote-icon'></i>
          <p class="review-text">"${review.text}"</p>
          <i class='bx bxs-quote-alt-right quote-icon'></i>
        </div>
        <div class="review-footer">
          <span class="review-date"><i class='bx bx-calendar'></i> ${review.date}</span>
          <span class="review-new-badge"><i class='bx bx-badge-check'></i> Verified Review</span>
        </div>
      </div>`;
  }

  // --- Rebuild slider dots ---
  function rebuildDots() {
    const dotsWrapper = document.querySelector(".slider-dots");
    const allCards = document.querySelectorAll(".review-card");
    if (!dotsWrapper) return;
    dotsWrapper.innerHTML = "";
    allCards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.dataset.slide = i;
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlider();
      });
      dotsWrapper.appendChild(dot);
    });
  }

  let currentSlide = 0;
  const reviewContainer = document.querySelector(".review-container");
  const prevBtn = document.querySelector(".review-btn.prev");
  const nextBtn = document.querySelector(".review-btn.next");

  function updateSlider() {
    const allCards = document.querySelectorAll(".review-card");
    if (!reviewContainer || !allCards.length) return;
    reviewContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll(".slider-dots .dot").forEach((d, i) => {
      d.classList.toggle("active", i === currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const total = document.querySelectorAll(".review-card").length;
      currentSlide = (currentSlide + 1) % total;
      updateSlider();
    };
  }
  if (prevBtn) {
    prevBtn.onclick = () => {
      const total = document.querySelectorAll(".review-card").length;
      currentSlide = (currentSlide - 1 + total) % total;
      updateSlider();
    };
  }

  setInterval(() => {
    const total = document.querySelectorAll(".review-card").length;
    if (!total) return;
    currentSlide = (currentSlide + 1) % total;
    updateSlider();
  }, 6000);

  // --- Load reviews from Firestore and inject into #testiGrid ---
  async function loadFirestoreReviews() {
    try {
      const q = query(collection(db, "reviews"), orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      const grid = document.getElementById("testiGrid");
      if (!grid) return;
      snapshot.forEach(doc => {
        const r = { id: doc.id, ...doc.data() };
        const d = {
          name: r.name || 'Anonymous',
          company: r.company || r.role || 'Client',
          text: r.text || '',
          rating: r.rating || 5,
          category: r.category || 'other',
          date: r.date || ''
        };
        // Generate initials avatar
        function getInitialsAvatarLocal(name) {
          const initials = (name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          let hash = 0;
          for (let i = 0; i < (name || 'U').length; i++) hash = (name || 'U').charCodeAt(i) + ((hash << 5) - hash);
          const hue = Math.abs(hash) % 360;
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 80;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = `hsl(${hue}, 55%, 40%)`;
          ctx.beginPath(); ctx.arc(40, 40, 40, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = `hsl(${hue}, 55%, 65%)`; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${initials.length > 1 ? 26 : 30}px Arial, sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(initials, 40, 41);
          return canvas.toDataURL();
        }
        const avatarSrc = r.avatar && r.avatar.startsWith('data:') ? r.avatar : getInitialsAvatarLocal(d.name);
        const stars = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="opacity:${i < d.rating ? 1 : 0.15}"></i>`).join('');
        const cardHtml = `
          <div class="tr-card" data-category="${d.category}">
            <div class="tr-card-header">
              <div class="tr-card-avatar-wrap">
                <img src="${avatarSrc}" alt="${d.name}" class="tr-card-avatar">
                <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
              </div>
              <div class="tr-card-author-info">
                <h4>${d.name}</h4>
                <span class="tr-card-position">${d.company}</span>
                <span class="tr-card-company">Verified Review</span>
              </div>
              <div class="tr-card-stars">${stars}</div>
            </div>
            <div class="tr-card-body">
              <span class="tr-card-open-quote">❝</span>
              <p>"${d.text}"</p>
            </div>
            <div class="tr-card-footer">
              <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${d.category}</span>
              <span class="tr-card-when">${d.date}</span>
            </div>
          </div>`;
        grid.insertAdjacentHTML('beforeend', cardHtml);
      });
    } catch (err) {
      console.error("Hindi ma-load ang reviews:", err);
    }
  }

  loadFirestoreReviews();

  // --- Show toast ---
  function showReviewToast(msg, isError = false) {
    let toast = document.getElementById("review-submit-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "review-submit-toast";
      toast.style.cssText = `
        position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(80px);
        color:#fff; padding:14px 28px; border-radius:50px; font-weight:600; font-size:15px;
        box-shadow:0 8px 30px rgba(255,107,53,.45); z-index:9999;
        display:flex; align-items:center; gap:10px;
        transition:transform .4s cubic-bezier(.34,1.56,.64,1), opacity .4s ease; opacity:0;
      `;
      document.body.appendChild(toast);
    }
    toast.style.background = isError
      ? "linear-gradient(135deg,#e74c3c,#c0392b)"
      : "linear-gradient(135deg,#ff6b35,#ff9a56)";
    toast.innerHTML = `<i class='bx bx-${isError ? "error-circle" : "check-circle"}' style="font-size:20px"></i> ${msg}`;
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
      toast.style.opacity = "1";
    });
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(80px)";
      toast.style.opacity = "0";
    }, 3500);
  }

  // --- Form submit → save to Firestore ---
  reviewForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("reviewerName").value.trim();
    const email = document.getElementById("reviewerEmail").value.trim();
    const company = document.getElementById("reviewerCompany").value.trim();
    const text = document.getElementById("reviewText").value.trim();
    const rating = parseInt(document.getElementById("selectedRating").value);

    if (!name || !text) {
      showReviewToast("Pakiusap lagyan ng pangalan at review! 😊", true);
      return;
    }
    if (rating < 1) {
      showReviewToast("Pumili ng star rating bago mag-submit! ⭐", true);
      return;
    }

    // Disable button habang nag-sa-save
    const submitBtn = reviewForm.querySelector(".btn-submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Nagse-save...`;
    }

    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const review = {
      name,
      email,
      company,
      role: company || "Client",
      text,
      rating,
      date: `${months[now.getMonth()]} ${now.getFullYear()}`,
      avatar: getInitialsAvatar(name),
      timestamp: serverTimestamp()
    };

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "reviews"), review);
      review.id = docRef.id;

      // Inject into slider
      const container = document.querySelector(".review-container");
      container.insertAdjacentHTML("beforeend", buildReviewCard(review));
      rebuildDots();
      const allCards = document.querySelectorAll(".review-card");
      currentSlide = allCards.length - 1;
      updateSlider();

      document.querySelector(".review-slider")?.scrollIntoView({ behavior: "smooth", block: "center" });
      showReviewToast(`Salamat, ${name}! Nai-post na ang iyong review sa lahat! 🎉`);

      // Reset form
      reviewForm.reset();
      document.getElementById("selectedRating").value = "0";
      stars.forEach(s => s.classList.remove("active"));
      if (ratingText) ratingText.textContent = "Click to rate";

    } catch (err) {
      console.error("Error saving review:", err);
      showReviewToast("May error. Subukan ulit! 😢", true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class='bx bx-send'></i> Submit Review`;
      }
    }
  });
})();

// ==================== ENHANCED THEME TOGGLE ====================
// ⚠️ DISABLED — theme is now handled solely by fixes.js (initThemeToggle)
// to avoid conflicts. fixes.js uses localStorage key 'jvor-theme' and
// always defaults to 'dark' on first visit.

// About Card Animation
createObserver(".about-card", "visible", 150, 0.2);
createObserver(".timeline-item", "visible", 200, 0.3);

// ===== ULTIMATE MODAL LOGIC =====
const pModal = document.getElementById("premiumModal");
const pImg = document.getElementById("p-modal-img");
const pClose = document.querySelector(".p-close");

document.querySelectorAll(".btn-premium-view").forEach(btn => {
  btn.onclick = function () {
    const src = this.getAttribute("data-src");
    pImg.src = src;
    pModal.style.display = "flex";
    setTimeout(() => {
      pModal.classList.add("active");
    }, 10);
    document.body.style.overflow = "hidden";
  }
});

const closePremium = () => {
  pModal.classList.remove("active");
  setTimeout(() => {
    pModal.style.display = "none";
  }, 500);
  document.body.style.overflow = "auto";
};

if (pClose) pClose.onclick = closePremium;
window.onclick = (e) => { if (e.target.classList.contains('p-modal-overlay')) closePremium(); };

// Re-init observer for the new cards
createObserver(".premium-card", "visible", 200, 0.2);


// ==================== ENHANCED SKILL BARS ANIMATION ====================
document.querySelectorAll(".skill").forEach(skill => {
  const fill = skill.querySelector(".skill-fill");
  const percent = skill.querySelector(".skill-percent");
  const target = +skill.dataset.percent;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let w = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps

      const anim = () => {
        if (w <= target) {
          fill.style.width = w + "%";
          percent.textContent = Math.round(w) + "%";
          w += increment;
          requestAnimationFrame(anim);
        } else {
          fill.style.width = target + "%";
          percent.textContent = target + "%";
        }
      };
      anim();
      observer.unobserve(skill);
    }
  }, { threshold: 0.5 });

  observer.observe(skill);
});

// ==================== TECH ITEMS HOVER SOUND EFFECT (OPTIONAL) ====================
const techItems = document.querySelectorAll('.tech-item');

techItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // Add pulse effect on hover
    item.style.animation = 'none';
    setTimeout(() => {
      item.style.animation = '';
    }, 10);
  });
});

// ==================== SERVICE BOX TILT EFFECT ====================
const serviceBoxes = document.querySelectorAll('.service-box');

serviceBoxes.forEach(box => {
  box.addEventListener('mousemove', (e) => {
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5;
    const rotateY = ((centerX - x) / centerX) * 5;

    box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  box.addEventListener('mouseleave', () => {
    box.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ==================== SKILL BADGE CLICK EFFECT ====================
const skillBadges = document.querySelectorAll('.skill-badge');

skillBadges.forEach(badge => {
  badge.addEventListener('click', () => {
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '100%';
    ripple.style.height = '100%';
    ripple.style.top = '0';
    ripple.style.left = '0';
    ripple.style.background = 'rgba(234, 88, 12, 0.3)';
    ripple.style.borderRadius = '3rem';
    ripple.style.animation = 'ripple 0.6s ease-out';

    badge.style.position = 'relative';
    badge.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==================== TECH CATEGORY REVEAL ANIMATION ====================
const techCategories = document.querySelectorAll('.tech-category');

const categoryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 200);
      categoryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

techCategories.forEach(category => {
  category.style.opacity = '0';
  category.style.transform = 'translateY(30px)';
  category.style.transition = 'all 0.6s ease';
  categoryObserver.observe(category);
});

// ==================== SERVICE BOX SEQUENTIAL REVEAL ====================
const serviceBoxesReveal = document.querySelectorAll('.service-box');

const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 150);
      serviceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

serviceBoxesReveal.forEach(box => {
  box.style.opacity = '0';
  box.style.transform = 'translateY(50px)';
  box.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  serviceObserver.observe(box);
});

// ==================== TECH ITEM STAGGER ANIMATION ====================
const techItemsAll = document.querySelectorAll('.tech-item');

const techObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
      }, index * 50);
      techObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

techItemsAll.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'scale(0.8)';
  item.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  techObserver.observe(item);
});

// ==================== ADDITIONAL SKILLS BADGES ANIMATION ====================
const additionalSkills = document.querySelectorAll('.skill-badge');

const badgeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, index * 80);
      badgeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

additionalSkills.forEach(badge => {
  badge.style.opacity = '0';
  badge.style.transform = 'translateY(20px) scale(0.9)';
  badge.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  badgeObserver.observe(badge);
});

// ==================== SERVICES CTA REVEAL ====================
const servicesCTA = document.querySelector('.services-cta');

if (servicesCTA) {
  const ctaObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      servicesCTA.style.opacity = '1';
      servicesCTA.style.transform = 'scale(1)';
      ctaObserver.unobserve(servicesCTA);
    }
  }, { threshold: 0.3 });

  servicesCTA.style.opacity = '0';
  servicesCTA.style.transform = 'scale(0.95)';
  servicesCTA.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  ctaObserver.observe(servicesCTA);
}

// ==================== SMOOTH SCROLL TO CONTACT FROM CTA ====================
const ctaButton = document.querySelector('.btn-cta');

if (ctaButton) {
  ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

// ==================== PARALLAX EFFECT ON SKILLS SECTION ====================
window.addEventListener('scroll', () => {
  const skillsSection = document.querySelector('.tech-skills');

  if (skillsSection) {
    const scrolled = window.pageYOffset;
    const skillsTop = skillsSection.offsetTop;
    const skillsHeight = skillsSection.offsetHeight;

    if (scrolled > skillsTop - window.innerHeight && scrolled < skillsTop + skillsHeight) {
      const parallax = (scrolled - skillsTop) * 0.1;

      const categories = skillsSection.querySelectorAll('.tech-category');
      categories.forEach((category, index) => {
        const speed = (index + 1) * 0.05;
        category.style.transform = `translateY(${parallax * speed}px)`;
      });
    }
  }
});

// ==================== DYNAMIC TECH ICON COLORS ====================
const techIconColors = {
  'bxl-html5': '#E44D26',
  'bxl-css3': '#264de4',
  'bxl-javascript': '#F0DB4F',
  'bxl-react': '#61DBFB',
  'bxl-nodejs': '#3C873A',
  'bxl-python': '#306998',
  'bxl-git': '#F1502F',
  'bxl-github': '#ffffff',
  'bxl-bootstrap': '#7952B3',
  'bxl-tailwind-css': '#06B6D4',
  'bxl-mongodb': '#47A248',
  'bxl-postgresql': '#336791',
  'bxl-figma': '#F24E1E',
  'bxl-visual-studio': '#007ACC'
};

// Apply colors on hover
document.querySelectorAll('.tech-item i, .tech-icons i').forEach(icon => {
  const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('bxl-'));

  if (iconClass && techIconColors[iconClass]) {
    icon.addEventListener('mouseenter', () => {
      icon.style.color = techIconColors[iconClass];
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.color = 'var(--main-color)';
    });
  }
});

// ==================== SERVICE TAGS SHUFFLE ON HOVER ====================
serviceBoxes.forEach(box => {
  const tags = box.querySelectorAll('.service-tags span');

  box.addEventListener('mouseenter', () => {
    tags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'translateY(-3px)';
      }, index * 50);
    });
  });

  box.addEventListener('mouseleave', () => {
    tags.forEach(tag => {
      tag.style.transform = 'translateY(0)';
    });
  });
});

console.log('✅ Enhanced Skills & Services animations loaded!');

// ==================== ENHANCED PROJECTS SECTION JAVASCRIPT PARA SA PROJECTS SECTION NA MGA CARD KAPAG NI CLICK MA PUPUNTA SA LOOB===================

// Project Data
const projectsData = {
  1: {
    title: "Personal Portfolio",
    date: "December 2024",
    status: "completed",
    image: "imgae/Screenshot 2026-03-17 225400.png",
    description: "A modern, fully responsive portfolio website showcasing my skills and projects. Built with pure HTML, CSS, and JavaScript, featuring smooth animations, dark/light mode toggle, and optimized performance for fast loading times.",
    features: [
      "Fully responsive design that works on all devices",
      "Dark/light mode toggle with smooth transitions",
      "Smooth scroll animations and reveal effects",
      "Optimized images and lazy loading",
      "SEO-friendly structure and meta tags",
      "Cross-browser compatibility"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Animations"],
    challenges: "The main challenge was creating smooth animations without compromising performance. I solved this by using CSS transforms instead of position changes and implementing Intersection Observer API for efficient scroll animations.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  },
  2: {
    title: "E-Commerce Platform",
    date: "November 2024",
    status: "in-progress",
    image: "https://iexperto.io/wp-content/uploads/2022/11/eCommerce-Website-Design-1.jpg",
    description: "A full-featured online store with shopping cart functionality, secure payment integration, comprehensive admin dashboard, and robust inventory management system. Built using modern web technologies.",
    features: [
      "Shopping cart with add, remove, and update quantities",
      "Secure payment gateway integration (Stripe)",
      "User authentication and profile management",
      "Admin dashboard for product and order management",
      "Real-time inventory tracking",
      "Order history and tracking system"
    ],
    tech: ["React", "Node.js", "MongoDB", "Express", "Stripe API", "JWT"],
    challenges: "Implementing secure payment processing was critical. I used Stripe's official SDK and followed PCI compliance guidelines. Also optimized database queries for fast product searches using MongoDB indexes.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  },
  3: {
    title: "Task Manager Pro",
    date: "October 2024",
    status: "completed",
    image: "https://www.codester.com/static/uploads/items/000/020/20841/preview/001.jpg",
    description: "A collaborative task management application with real-time updates using Firebase. Features team collaboration tools, progress tracking, priority management, and deadline notifications.",
    features: [
      "Real-time task updates across all devices",
      "Team collaboration with role-based permissions",
      "Drag-and-drop task organization",
      "Priority levels and deadline reminders",
      "Progress tracking with visual charts",
      "Comment and file attachment system"
    ],
    tech: ["React", "Firebase", "Material-UI", "Real-time Database", "Authentication"],
    challenges: "Handling real-time synchronization across multiple users required careful state management. I used Firebase's real-time database with optimistic updates and conflict resolution strategies.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  },
  4: {
    title: "Gourmet Restaurant",
    date: "September 2024",
    status: "completed",
    image: "https://tse2.mm.bing.net/th/id/OIP.9neLVhO120dwgx_SwVAsFwHaEo?pid=Api&h=220&P=0",
    description: "An elegant restaurant website featuring an interactive online menu, table reservation system, image gallery, and customer reviews section. Designed to enhance the dining experience and increase bookings.",
    features: [
      "Interactive menu with filtering by category",
      "Online table reservation system",
      "Beautiful image gallery with lightbox",
      "Customer reviews and ratings",
      "Contact form and location map",
      "Mobile-first responsive design"
    ],
    tech: ["HTML5", "CSS3", "jQuery", "PHP", "MySQL", "Google Maps API"],
    challenges: "Creating an intuitive reservation system that prevents double bookings was crucial. I implemented server-side validation with PHP and MySQL to ensure data integrity and availability checks.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  },
  5: {
    title: "Weather Forecast App",
    date: "August 2024",
    status: "completed",
    image: "https://www.lifewire.com/thmb/ec9CnePRoIJTRujwi3_lZneZkUs=/3280x2160/filters:no_upscale():max_bytes(150000):strip_icc()/accuweather-long-term-forecast-e9009d5bfe854b9abba9f5b98eec1f28.png",
    description: "A real-time weather application providing current conditions and 7-day forecasts. Features location search, beautiful weather animations, and data visualization using Chart.js.",
    features: [
      "Current weather conditions for any location",
      "7-day weather forecast with detailed info",
      "Location search with autocomplete",
      "Animated weather icons and backgrounds",
      "Temperature, humidity, and wind speed charts",
      "Geolocation support for automatic location"
    ],
    tech: ["JavaScript", "OpenWeather API", "CSS3", "Chart.js", "Geolocation API"],
    challenges: "API rate limiting was a concern. I implemented local caching with expiration times and debounced search inputs to minimize API calls while maintaining a smooth user experience.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  },
  6: {
    title: "Admin Dashboard",
    date: "July 2024",
    status: "completed",
    image: "https://img.freepik.com/premium-vector/comprehensive-analytics-dashboard-ui-with-diverse-data-visualization-user-interface-analytics-dashboard-featuring-variety-graphs-charts-efficient-data-management-monitoring_924480-25.jpg?w=2000",
    description: "A comprehensive admin dashboard featuring data visualization, user management, and analytics. Built with React and TypeScript for type safety and maintainability.",
    features: [
      "Interactive data visualization with charts",
      "User management with CRUD operations",
      "Analytics and reporting features",
      "Responsive table with sorting and filtering",
      "Dark/light theme toggle",
      "Export data to CSV and PDF"
    ],
    tech: ["React", "TypeScript", "Recharts", "Tailwind CSS", "Redux"],
    challenges: "Managing complex state across multiple components was challenging. I used Redux with TypeScript for type-safe state management and implemented custom hooks for reusable logic.",
    liveLink: "#",
    githubLink: "https://github.com/JVOR3"
  }
};

// ==================== PROJECT FILTERING ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, index) => {
        const category = card.dataset.category;

        if (filter === 'all' || category.includes(filter)) {
          // Show card with staggered animation
          setTimeout(() => {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
              card.style.transition = 'all 0.6s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          }, index * 100);
        } else {
          // Hide card
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 600);
        }
      });
    });
  });
}

// ==================== LAZY LOAD IMAGES ====================
const lazyImages = document.querySelectorAll('img[data-src]');

if (lazyImages.length && 'IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// ==================== PROJECT MODAL ====================
const projectModal = document.getElementById('projectModal');
const modalOverlay = projectModal?.querySelector('.modal-overlay');
const modalClose = projectModal?.querySelector('.modal-close');
const detailButtons = document.querySelectorAll('.project-details-btn');

// Open modal
if (detailButtons.length && projectModal) {
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.dataset.project;
      const project = projectsData[projectId];

      if (project) {
        // Populate modal with project data
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDate').innerHTML = `<i class='bx bx-calendar'></i> ${project.date}`;
        document.getElementById('modalImage').src = project.image;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalChallenges').textContent = project.challenges;
        document.getElementById('modalLiveLink').href = project.liveLink;
        document.getElementById('modalGithubLink').href = project.githubLink;

        // Status badge
        const statusBadge = document.getElementById('modalStatus');
        if (statusBadge) {
          statusBadge.className = `status-badge ${project.status}`;
          statusBadge.textContent = project.status === 'completed' ? 'Completed' : 'In Progress';
        }

        // Features list
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          featuresList.appendChild(li);
        });

        // Tech tags
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        project.tech.forEach(tech => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = tech;
          techContainer.appendChild(span);
        });

        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  const closeModal = () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==================== PROJECTS REVEAL ANIMATION ====================
const projectsSection = document.querySelector('.projects');

if (projectsSection) {
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 150);
        });
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projectObserver.observe(projectsSection);
}

// ==================== SMOOTH SCROLL FOR PROJECT LINKS ====================
const projectLinks = document.querySelectorAll('a[href^="#"]');

projectLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==================== PROJECT CARD HOVER EFFECTS ====================
if (projectCards.length) {
  projectCards.forEach(card => {
    const overlay = card.querySelector('.project-overlay');

    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.project-image img');
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
    });

    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.project-image img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });
}

// ==================== SCROLL TO TOP IN PROJECTS ====================
const viewMoreBtn = document.querySelector('.btn-view-more');

if (viewMoreBtn) {
  viewMoreBtn.addEventListener('click', (e) => {
    // Allow default behavior for external links
    if (!viewMoreBtn.href.includes('#')) {
      return;
    }

    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==================== PROJECTS COUNTER ANIMATION ====================
const projectsHeading = document.querySelector('.projects .section-heading');

if (projectsHeading) {
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  projectsHeading.style.opacity = '0';
  projectsHeading.style.transform = 'translateY(-20px)';
  projectsHeading.style.transition = 'all 0.8s ease';

  headingObserver.observe(projectsHeading);
}

// ==================== INITIALIZE ON DOM LOADED ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Projects section JavaScript loaded successfully!');
  console.log(`📊 Total projects: ${projectCards.length}`);
  console.log(`🎯 Filter buttons: ${filterBtns.length}`);
  console.log(`🔍 Detail buttons: ${detailButtons.length}`);
});

// ==================== ACCESSIBILITY IMPROVEMENTS ====================
// Add keyboard navigation for project cards
projectCards.forEach((card, index) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `Project ${index + 1}`);

  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const detailBtn = card.querySelector('.project-details-btn');
      if (detailBtn) {
        detailBtn.click();
      }
    }
  });
});

// Focus trap in modal
if (projectModal) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  projectModal.addEventListener('keydown', (e) => {
    if (!projectModal.classList.contains('active')) return;

    const focusable = projectModal.querySelectorAll(focusableElements);
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

console.log('🚀 Enhanced Projects Section - Ready!');


// ==================== PHOTO GALLERY LIGHTBOX ====================
(function () {
  const galleryModal = document.getElementById('galleryModal');
  if (!galleryModal) return;

  const modalImg = document.getElementById('gallery-modal-img');
  const modalCurrent = document.getElementById('gallery-current');
  const modalTotal = document.getElementById('gallery-total');
  const closeBtn = galleryModal.querySelector('.gallery-modal-close');
  const prevBtn = galleryModal.querySelector('.gallery-modal-prev');
  const nextBtn = galleryModal.querySelector('.gallery-modal-next');
  const overlay = galleryModal.querySelector('.gallery-modal-overlay');

  const items = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  const sources = Array.from(items).map(item => item.querySelector('img')?.src || '');
  modalTotal.textContent = sources.length;

  const openModal = (index) => {
    currentIndex = index;
    modalImg.src = sources[currentIndex];
    modalCurrent.textContent = currentIndex + 1;
    galleryModal.style.display = 'flex';
    requestAnimationFrame(() => galleryModal.classList.add('active'));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    galleryModal.classList.remove('active');
    setTimeout(() => { galleryModal.style.display = 'none'; modalImg.src = ''; }, 420);
    document.body.style.overflow = 'auto';
  };

  modalImg.style.transition = 'opacity 0.2s ease, transform 0.25s ease';

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + sources.length) % sources.length;
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'translateX(-30px)';
    setTimeout(() => {
      modalImg.src = sources[currentIndex];
      modalCurrent.textContent = currentIndex + 1;
      modalImg.style.opacity = '1';
      modalImg.style.transform = 'translateX(0)';
    }, 200);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % sources.length;
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'translateX(30px)';
    setTimeout(() => {
      modalImg.src = sources[currentIndex];
      modalCurrent.textContent = currentIndex + 1;
      modalImg.style.opacity = '1';
      modalImg.style.transform = 'translateX(0)';
    }, 200);
  };

  items.forEach((item, i) => item.addEventListener('click', () => openModal(i)));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeModal();
  });

  // Scroll reveal
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('gallery-visible'), i * 120);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => galleryObserver.observe(item));
})();



// ==================== EMAILJS CONTACT FORM ====================
(function () {

  const EMAILJS_PUBLIC_KEY = '_gHT9V4PLtdDkYzou';
  const EMAILJS_SERVICE_ID = 'service_4cbkcme';
  const EMAILJS_TEMPLATE_ID = 'template_jb92mdt';

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
    subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject') },
    message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message') },
  };

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // FIX: Ginamit na ang tamang class na .ct-form-group (hindi .form-group)
  const setError = (key) => {
    const group = fields[key].el.closest('.ct-form-group');
    if (!group) return;
    group.classList.add('has-error');
    group.classList.remove('is-valid');
    if (fields[key].err) fields[key].err.classList.add('visible');
  };

  const setValid = (key) => {
    const group = fields[key].el.closest('.ct-form-group');
    if (!group) return;
    group.classList.remove('has-error');
    group.classList.add('is-valid');
    if (fields[key].err) fields[key].err.classList.remove('visible');
  };

  const validate = () => {
    let ok = true;
    if (!fields.name.el.value.trim()) { setError('name'); ok = false; } else setValid('name');
    if (!validateEmail(fields.email.el.value)) { setError('email'); ok = false; } else setValid('email');
    if (!fields.subject.el.value.trim()) { setError('subject'); ok = false; } else setValid('subject');
    if (!fields.message.el.value.trim()) { setError('message'); ok = false; } else setValid('message');
    return ok;
  };

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => {
      if (key === 'email') {
        validateEmail(fields[key].el.value) ? setValid(key) : setError(key);
      } else {
        fields[key].el.value.trim() ? setValid(key) : setError(key);
      }
    });
  });

  // FIX: Ginamit na ang tamang toast IDs (ct-success-toast at ct-error-toast)
  const showToast = (success) => {
    const toastId = success ? 'ct-success-toast' : 'ct-error-toast';
    const toast = document.getElementById(toastId);
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  };

  // Button UI state helpers
  const setButtonState = (state) => {
    const defEl = submitBtn?.querySelector('.ct-submit-default');
    const sendEl = submitBtn?.querySelector('.ct-submit-sending');
    const doneEl = submitBtn?.querySelector('.ct-submit-done');
    if (!defEl) return;
    defEl.style.display = state === 'default' ? 'flex' : 'none';
    sendEl.style.display = state === 'sending' ? 'flex' : 'none';
    doneEl.style.display = state === 'done' ? 'flex' : 'none';
  };

  // Load EmailJS SDK then attach the single submit handler
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // FIX: pigilan ang ibang submit listeners

      // Honeypot spam check
      if (form.querySelector('[name="ct_honeypot"]')?.value) return;

      if (!validate()) return;

      // UI — loading state
      setButtonState('sending');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        showToast(true);
        form.reset();

        // Reset char counter & quick-select buttons
        const charCount = document.getElementById('ctCharCount');
        if (charCount) charCount.textContent = '0';
        document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));

        // Reset validation classes
        Object.keys(fields).forEach(k => {
          fields[k].el.closest('.ct-form-group')?.classList.remove('is-valid', 'has-error');
        });

        // UI — done state then back to default
        setButtonState('done');
        setTimeout(() => setButtonState('default'), 4000);

      } catch (err) {
        console.error('EmailJS error:', err);
        showToast(false);
        setButtonState('default');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  };
  script.onerror = () => console.error('Hindi ma-load ang EmailJS SDK.');
  document.head.appendChild(script);

})();
// ============================================================
// ✨ FUTURISTIC ENHANCEMENTS - SCROLL REVEAL + ANIMATIONS
// ============================================================

// ===== SCROLL REVEAL OBSERVER =====
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ===== HEADER SCROLL SHRINK =====
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// ===== ACTIVE NAV LINK HIGHLIGHT ON SCROLL (FIXED) =====
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function setActiveNav() {
    // Use 40% from top of viewport as detection line
    const triggerPoint = window.scrollY + window.innerHeight * 0.4;

    let currentId = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const bottom = top + section.offsetHeight;

      if (triggerPoint >= top && triggerPoint < bottom) {
        currentId = section.id;
      }
    });

    // Fallback: if nothing matched (top of page), use first section
    if (!currentId && window.scrollY < 100) {
      currentId = sections[0]?.id || '';
    }

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active-nav');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  // Delay initial run so layout is fully rendered
  setTimeout(setActiveNav, 200);
})();

// ===== AUTO ADD REVEAL CLASSES TO KEY ELEMENTS =====
(function autoReveal() {
  // Section headings
  document.querySelectorAll('.section-heading').forEach((el, i) => {
    el.classList.add('reveal-up');
    // Add ghost text for heading bg effect
    el.setAttribute('data-text', el.textContent.replace(/<[^>]*>/g, '').trim());
  });

  // About cards
  document.querySelectorAll('.about-card').forEach((el, i) => {
    el.classList.add('reveal-up', `delay-${(i % 4) + 1}`);
  });

  // Contact wrapper panels
  const contactInfo = document.querySelector('.contact-info-panel');
  const contactForm = document.querySelector('.contact-form-panel');
  if (contactInfo) contactInfo.classList.add('reveal-left');
  if (contactForm) contactForm.classList.add('reveal-right');

  // Contact header
  const contactHeader = document.querySelector('.contact-header');
  if (contactHeader) contactHeader.classList.add('reveal-up');

  // Profile ID card
  const idCard = document.querySelector('.profile-id-card');
  if (idCard) idCard.classList.add('reveal-scale');

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right', `delay-${(i % 3) + 1}`);
  });

  // Services / project cards
  document.querySelectorAll('.service-card, .project-card').forEach((el, i) => {
    el.classList.add('reveal-up', `delay-${(i % 4) + 1}`);
  });

  // Contact detail items
  document.querySelectorAll('.contact-detail-item').forEach((el, i) => {
    el.classList.add('reveal-left', `delay-${i + 1}`);
  });

  // Trigger observer again for newly added classes
  const newRevealEls = document.querySelectorAll('.reveal-up:not(.in-view), .reveal-left:not(.in-view), .reveal-right:not(.in-view), .reveal-scale:not(.in-view)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  newRevealEls.forEach(el => observer.observe(el));
})();

// ===== NEON DIVIDERS BETWEEN SECTIONS =====
(function addNeonDividers() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const divider = document.createElement('div');
    divider.className = 'neon-divider';
    section.insertAdjacentElement('afterend', divider);
  });
})();

// ===== CONTACT FORM INPUT LABEL FLOAT EFFECT =====
(function initInputEffects() {
  document.querySelectorAll('.input-wrap input, .input-wrap textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) input.parentElement.classList.remove('focused');
    });
  });
})();

console.log('✨ Futuristic enhancements loaded!');

// ============================================================
// ✨ NEW FEATURES: Progress Bar, Hire Me, Badge, Counters
// ============================================================

// ===== SCROLL PROGRESS BAR =====
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ===== FLOATING HIRE ME BUTTON =====
(function initFloatingHire() {
  const btn = document.getElementById('floating-hire');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });
})();

// ===== ANIMATED STAT COUNTERS =====
(function initAnimatedCounters() {
  const counters = document.querySelectorAll('.animated-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      // Easing: ease-out cubic
      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const tick = () => {
        step++;
        const progress = easeOut(step / steps);
        current = Math.min(Math.round(progress * target), target);
        el.textContent = current + suffix;
        el.classList.add('counting');
        setTimeout(() => el.classList.remove('counting'), 150);

        if (step < steps) {
          setTimeout(tick, duration / steps);
        } else {
          el.textContent = target + suffix;
        }
      };

      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

console.log('🚀 All new features loaded!');
// ============================================================
// ✨ FEATURE 1: CODE RAIN (Matrix-style orange on home section)
// ============================================================
(function initCodeRain() {
  const canvas = document.getElementById('codeRainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</>{}[];#@!$%&*=+HTMLCSSJS';
  const fontSize = 14;
  let columns, drops;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(8,8,8,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(234,88,12,0.85)';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

// ============================================================
// ✨ FEATURE 2: GLOWING PARTICLE CURSOR TRAIL
// ============================================================
(function initCursorTrail() {
  const canvas = document.getElementById('cursorTrailCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = [];
  let mouse = { x: -999, y: -999 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    for (let i = 0; i < 4; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 10,
        y: mouse.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.8,
        alpha: 1,
        size: Math.random() * 5 + 2,
        color: Math.random() > 0.5 ? '234,88,12' : '255,140,60',
        decay: Math.random() * 0.02 + 0.018,
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.alpha -= p.decay;
      p.size *= 0.97;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${p.color},${p.alpha * 0.8})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ============================================================
// ✨ FEATURE 3: ANIMATED RADAR / SPIDER CHART
// ============================================================
(function initRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const skills = [
    { label: 'HTML/CSS', value: 0.95 },
    { label: 'JavaScript', value: 0.88 },
    { label: 'UI/UX', value: 0.85 },
    { label: 'React', value: 0.82 },
    { label: 'Node.js', value: 0.78 },
    { label: 'Video', value: 0.92 },
  ];

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxR = Math.min(cx, cy) - 55;
  const total = skills.length;
  const levels = 5;

  let animProgress = 0;
  let animFrame = null;
  let hoveredSkill = -1;

  // Legend interactivity
  document.querySelectorAll('.legend-item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => { hoveredSkill = i; });
    item.addEventListener('mouseleave', () => { hoveredSkill = -1; });
  });

  function angleFor(i) {
    return (Math.PI * 2 * i) / total - Math.PI / 2;
  }

  function pointAt(i, r) {
    const a = angleFor(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function drawFrame(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = !document.body.classList.contains('light-mode');
    const gridColor = isDark ? 'rgba(234,88,12,0.12)' : 'rgba(234,88,12,0.18)';
    const webColor = isDark ? 'rgba(20,20,20,0.55)' : 'rgba(240,240,240,0.55)';
    const lineColor = isDark ? 'rgba(234,88,12,0.22)' : 'rgba(234,88,12,0.28)';
    const labelColor = isDark ? '#e5e7eb' : '#333';

    // --- Level rings ---
    for (let l = 1; l <= levels; l++) {
      const r = (l / levels) * maxR;
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const p = pointAt(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = webColor;
      ctx.fill();
    }

    // --- Axis lines ---
    for (let i = 0; i < total; i++) {
      const p = pointAt(i, maxR);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- Skill polygon ---
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const eased = easeOut(Math.min(progress * (total / (i + 1)), 1));
      const r = skills[i].value * maxR * Math.min(progress * (total / (i * 0.5 + 1)), 1);
      const finalR = skills[i].value * maxR;
      const animR = finalR * Math.min(progress * 1.5, 1);
      const p = pointAt(i, animR);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    // Glow fill
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    gradient.addColorStop(0, 'rgba(234,88,12,0.35)');
    gradient.addColorStop(1, 'rgba(234,88,12,0.08)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = 'rgba(234,88,12,0.9)';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(234,88,12,0.6)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // --- Dots at each vertex ---
    for (let i = 0; i < total; i++) {
      const finalR = skills[i].value * maxR;
      const animR = finalR * Math.min(progress * 1.5, 1);
      const p = pointAt(i, animR);
      const isHovered = hoveredSkill === i;

      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234,88,12,1)';
      ctx.shadowBlur = isHovered ? 22 : 10;
      ctx.shadowColor = 'rgba(234,88,12,0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Value label on hover
      if (isHovered) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(skills[i].value * 100) + '%', p.x, p.y - 14);
      }
    }

    // --- Skill labels ---
    for (let i = 0; i < total; i++) {
      const lp = pointAt(i, maxR + 28);
      ctx.font = hoveredSkill === i ? 'bold 13px Poppins, sans-serif' : '12px Poppins, sans-serif';
      ctx.fillStyle = hoveredSkill === i ? 'rgba(234,88,12,1)' : labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skills[i].label, lp.x, lp.y);
    }
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animate() {
    if (animProgress < 1) {
      animProgress += 0.022;
      drawFrame(animProgress);
      animFrame = requestAnimationFrame(animate);
    } else {
      drawFrame(1);
      // Keep redrawing for hover effects
      animFrame = requestAnimationFrame(() => drawFrame(1));
    }
  }

  // Start animation when in view
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animProgress = 0;
      animate();
      observer.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);

  // Redraw on hover continuously for hover effect
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    let found = -1;
    for (let i = 0; i < total; i++) {
      const p = pointAt(i, skills[i].value * maxR);
      const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      if (dist < 20) { found = i; break; }
    }
    hoveredSkill = found;
    drawFrame(1);
  });
  canvas.addEventListener('mouseleave', () => { hoveredSkill = -1; drawFrame(1); });
})();

console.log('🎆 Particle trail, code rain & radar chart loaded!');

// ============================================================
// ✨ FEATURE 4: MAGNETIC BUTTONS (hover attraction effect)
// ============================================================
(function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.btn, .gradient-btn, .contact-submit-btn, #floating-hire, .btn-premium-view');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.32;
      const dy = (e.clientY - cy) * 0.32;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
      setTimeout(() => el.style.transition = '', 450);
    });
  });
})();

// ============================================================
// ✨ FEATURE 5: 3D TILT CARD EFFECT (project cards, cert cards)
// ============================================================
(function initTiltCards() {
  const cards = document.querySelectorAll('.premium-card, .about-card, .service-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      card.style.transition = 'transform 0.1s ease';
      // Shine overlay
      let shine = card.querySelector('.tilt-shine');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'tilt-shine';
        shine.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:10;transition:opacity 0.3s ease;';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(shine);
      }
      const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      shine.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      shine.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      const shine = card.querySelector('.tilt-shine');
      if (shine) shine.style.opacity = '0';
    });
  });
})();

// ============================================================
// ✨ FEATURE 6: SCROLL PROGRESS INDICATOR (section names)
// ============================================================
(function initScrollSectionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'section-indicator';
  indicator.style.cssText = `
    position: fixed; right: 28px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 10px; z-index: 8000;
    opacity: 0; transition: opacity 0.4s ease;
  `;

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'certificates', label: 'Certs' },
    { id: 'tech-skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  sections.forEach(s => {
    const dot = document.createElement('a');
    dot.href = '#' + s.id;
    dot.dataset.section = s.id;
    dot.title = s.label;
    dot.style.cssText = `
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,255,255,0.25); border: 1px solid rgba(234,88,12,0.4);
      display: block; transition: all 0.3s ease; position: relative;
    `;
    dot.addEventListener('mouseenter', () => {
      const tip = document.createElement('span');
      tip.textContent = s.label;
      tip.style.cssText = `
        position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
        background: rgba(8,8,8,0.9); color: #fff; font-size: 11px; padding: 3px 8px;
        border-radius: 4px; white-space: nowrap; border: 1px solid rgba(234,88,12,0.3);
        pointer-events: none;
      `;
      dot.appendChild(tip);
    });
    dot.addEventListener('mouseleave', () => {
      const tip = dot.querySelector('span');
      if (tip) tip.remove();
    });
    indicator.appendChild(dot);
  });

  document.body.appendChild(indicator);

  // Show indicator after scrolling past hero
  let indicatorVisible = false;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 200;
    if (scrolled !== indicatorVisible) {
      indicatorVisible = scrolled;
      indicator.style.opacity = scrolled ? '1' : '0';
    }
    // Highlight active
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dot = indicator.querySelector(`[data-section="${s.id}"]`);
      if (!dot) return;
      if (rect.top <= 200 && rect.bottom > 200) {
        dot.style.background = 'rgba(234,88,12,1)';
        dot.style.boxShadow = '0 0 8px rgba(234,88,12,0.7)';
        dot.style.width = '10px';
        dot.style.height = '10px';
      } else {
        dot.style.background = 'rgba(255,255,255,0.25)';
        dot.style.boxShadow = 'none';
        dot.style.width = '8px';
        dot.style.height = '8px';
      }
    });
  });
})();

// ============================================================
// ✨ FEATURE 7: SCROLL PROGRESS BAR ENHANCEMENT
// ============================================================
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
})();



// ============================================================
// ✨ FEATURE 9: LIVE CLOCK in Contact Section
// ============================================================
(function initLiveClock() {
  // Create clock element and inject near contact section
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const clockEl = document.createElement('div');
  clockEl.id = 'live-clock-widget';
  clockEl.style.cssText = `
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 18px; border-radius: 999px;
    background: rgba(234,88,12,0.08); border: 1px solid rgba(234,88,12,0.2);
    font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 12px;
    backdrop-filter: blur(8px); letter-spacing: 0.5px;
  `;

  const updateClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-PH', {
      timeZone: 'Asia/Manila',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    const dateStr = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      weekday: 'short', month: 'short', day: 'numeric'
    });
    clockEl.innerHTML = `<i class='bx bx-time-five' style="color: #ea580c; font-size:16px"></i> <span><strong style="color:#ea580c">${timeStr}</strong> · ${dateStr} · Manila, PH</span>`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // Add after the contact-info-role
  const infoRole = contactSection.querySelector('.contact-info-role');
  if (infoRole) infoRole.after(clockEl);
})();

// ============================================================
// ✨ FEATURE 10: KONAMI CODE EASTER EGG 🎉
// ============================================================
(function initKonamiEgg() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let progress = 0;

  document.addEventListener('keydown', e => {
    if (e.key === konamiCode[progress]) {
      progress++;
      if (progress === konamiCode.length) {
        progress = 0;
        triggerEasterEgg();
      }
    } else {
      progress = 0;
    }
  });

  function triggerEasterEgg() {
    // Burst of particles from center
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99998; pointer-events: none;
      display: flex; align-items: center; justify-content: center;
      font-size: clamp(2rem, 5vw, 4rem); font-weight: 900;
      color: #ea580c; text-align: center; letter-spacing: 2px;
      text-shadow: 0 0 30px rgba(234,88,12,0.8);
      animation: eggReveal 0.5s ease forwards;
    `;
    overlay.innerHTML = `
      <div style="
        background: rgba(8,8,8,0.92); border: 2px solid rgba(234,88,12,0.5);
        padding: 40px 60px; border-radius: 24px;
        backdrop-filter: blur(20px); box-shadow: 0 0 60px rgba(234,88,12,0.3);
        animation: eggReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      ">
        🎮 CHEAT CODE UNLOCKED! 🎮<br>
        <span style="font-size:0.4em; color: rgba(255,255,255,0.8); font-weight: 500; display:block; margin-top:10px">
          You found the secret Easter Egg!<br>JVOR DEV approves. 🔥
        </span>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes eggReveal {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Confetti particles
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        const colors = ['#ea580c', '#ff9f1c', '#ff1d15', '#fff', '#ffd700'];
        p.style.cssText = `
          position: fixed; pointer-events: none; z-index: 99999;
          width: ${Math.random() * 10 + 5}px; height: ${Math.random() * 10 + 5}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          left: ${Math.random() * 100}vw; top: -10px;
          animation: confettiFall ${Math.random() * 2 + 1}s ease-in forwards;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 3000);
      }, i * 30);
    }

    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
      @keyframes confettiFall {
        to { transform: translateY(110vh) rotate(${Math.random() * 720}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(confettiStyle);

    setTimeout(() => {
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.remove(); style.remove(); }, 600);
    }, 4000);
  }
})();

// ============================================================
// ✨ FEATURE 11: ANIMATED COUNTER (for about section)
// ============================================================
(function initAnimatedCounters() {
  const counters = document.querySelectorAll('.animated-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1800;
      const start = performance.now();

      const step = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        el.textContent = current + suffix;
        el.classList.add('counting');
        if (progress < 1) requestAnimationFrame(step);
        else { el.textContent = target + suffix; el.classList.remove('counting'); }
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ============================================================
// ✨ FEATURE 12: GLITCH EFFECT on logo (random intervals)
// ============================================================
(function initGlitchLogo() {
  const logo = document.querySelector('.home-title');
  if (!logo) return;

  const glitchCSS = `
    @keyframes glitch1 {
      0%   { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 0); }
      20%  { clip-path: inset(92% 0 1% 0);  transform: translate(2px, 0); }
      40%  { clip-path: inset(43% 0 1% 0);  transform: translate(-1px, 0); }
      60%  { clip-path: inset(25% 0 58% 0); transform: translate(1px, 0); }
      80%  { clip-path: inset(54% 0 7% 0);  transform: translate(-2px, 0); }
      100% { clip-path: inset(58% 0 43% 0); transform: translate(0); }
    }
    @keyframes glitch2 {
      0%   { clip-path: inset(24% 0 29% 0); transform: translate(2px, 0); }
      20%  { clip-path: inset(54% 0 7% 0);  transform: translate(-2px, 0); }
      40%  { clip-path: inset(8% 0 85% 0);  transform: translate(1px, 0); }
      60%  { clip-path: inset(54% 0 13% 0); transform: translate(-1px, 0); }
      80%  { clip-path: inset(27% 0 43% 0); transform: translate(2px, 0); }
      100% { clip-path: inset(6% 0 91% 0);  transform: translate(0); }
    }
    .glitching::before {
      content: attr(data-text); position: absolute; left: 0; top: 0;
      width: 100%; height: 100%; color: #ff1d15;
      animation: glitch1 0.3s steps(1) infinite;
    }
    .glitching::after {
      content: attr(data-text); position: absolute; left: 0; top: 0;
      width: 100%; height: 100%; color: #00f7ff;
      animation: glitch2 0.3s steps(1) infinite;
    }
    .glitching { position: relative; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = glitchCSS;
  document.head.appendChild(styleEl);

  const glitchSpan = logo.querySelector('span') || logo;
  glitchSpan.setAttribute('data-text', glitchSpan.textContent);

  const triggerGlitch = () => {
    glitchSpan.classList.add('glitching');
    setTimeout(() => glitchSpan.classList.remove('glitching'), 400);
    // Random next trigger: 4–12 seconds
    setTimeout(triggerGlitch, Math.random() * 8000 + 4000);
  };
  setTimeout(triggerGlitch, 5000);
})();

// ============================================================
// ✨ FEATURE 13: SKILL TAG RIPPLE on click
// ============================================================
(function initSkillTagRipple() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.style.position = 'relative';
    tag.style.overflow = 'hidden';
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', e => {
      const ripple = document.createElement('span');
      const rect = tag.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(234,88,12,0.4);
        transform: scale(0); animation: skillRipple 0.6s ease-out forwards;
        pointer-events: none;
      `;
      tag.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes skillRipple {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();



// ============================================================
// ✨ FEATURE 15: SMOOTH ACTIVE NAV SCROLLSPY
// ============================================================
(function initScrollSpy() {
  const navLinks = document.querySelectorAll('.navbar a');
  const sectionIds = Array.from(navLinks)
    .map(a => a.getAttribute('href')?.replace('#', ''))
    .filter(Boolean);

  window.addEventListener('scroll', () => {
    let current = '';
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= 150) current = id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active-nav');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active-nav');
      }
    });
  });
})();

console.log('🚀 Advanced features v2.0 loaded! Konami code enabled 🕹️');
// ═══════════════════════════════════════════════════
// NEW TESTIMONIALS — Filter Tabs + Star Rating V2
// ═══════════════════════════════════════════════════

// Filter tabs
(function () {
  const tabs = document.querySelectorAll(".testi-tab");
  const cards = document.querySelectorAll(".testi-card[data-category]");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hidden");
          card.style.animation = "cardReveal 0.4s ease forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

// Star rating V2
(function () {
  const stars = document.querySelectorAll(".rfv2-stars span");
  const ratingInput = document.getElementById("selectedRating");
  const ratingLabel = document.getElementById("rfv2RatingLabel");
  const labels = { 1: "Poor ★", 2: "Fair ★★", 3: "Good ★★★", 4: "Very Good ★★★★", 5: "Excellent ★★★★★" };
  if (!stars.length) return;

  let selected = 0;

  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("hovered", i <= idx);
        s.classList.remove("selected");
      });
      if (ratingLabel) ratingLabel.textContent = labels[idx + 1];
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        s.classList.remove("hovered");
        s.classList.toggle("selected", i < selected);
      });
      if (ratingLabel) ratingLabel.textContent = selected ? labels[selected] : "Click a star to rate";
    });
    star.addEventListener("click", () => {
      selected = idx + 1;
      if (ratingInput) ratingInput.value = selected;
      stars.forEach((s, i) => s.classList.toggle("selected", i < selected));
      if (ratingLabel) ratingLabel.textContent = labels[selected];
    });
  });
})();

// New review form submission (DISABLED: replaced by premium v3 handler below)
(function () {
  const form = document.getElementById("reviewForm");
  if (true) return; // DISABLED

  // Build dynamic card in new style
  function buildNewCard(data) {
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<i class='bx bxs-star' style="opacity:${i < data.rating ? 1 : 0.2}"></i>`
    ).join("");
    const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(data.name)}`;
    return `
      <div class="testi-card dynamic-card" data-category="${data.category || 'other'}">
        <div class="testi-card-glow"></div>
        <div class="testi-card-top">
          <div class="testi-avatar-wrap">
            <img src="${avatarUrl}" alt="${data.name}" class="testi-avatar">
            <span class="testi-verified" title="Verified Client"><i class='bx bx-check'></i></span>
          </div>
          <div class="testi-author">
            <h4>${data.name}</h4>
            <p class="testi-role">${data.company || "Client"}</p>
            <p class="testi-company"><i class='bx bx-building'></i> ${data.company || "—"}</p>
          </div>
          <div class="testi-stars">${starsHtml}</div>
        </div>
        <div class="testi-quote-icon"><i class='bx bxs-quote-alt-left'></i></div>
        <p class="testi-text">"${data.text}"</p>
        <div class="testi-card-footer">
          <span class="testi-tag"><i class='bx bx-briefcase'></i> ${data.category || "Other"}</span>
          <span class="testi-date"><i class='bx bx-calendar'></i> ${data.date}</span>
        </div>
      </div>`;
  }

  function showToast(msg, isError = false) {
    let toast = document.getElementById("review-submit-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "review-submit-toast";
      toast.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(80px);
        color:#fff;padding:14px 28px;border-radius:50px;font-weight:600;font-size:15px;
        box-shadow:0 8px 30px rgba(234,88,12,.45);z-index:9999;
        display:flex;align-items:center;gap:10px;
        transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .4s;opacity:0;`;
      document.body.appendChild(toast);
    }
    toast.style.background = isError
      ? "linear-gradient(135deg,#e74c3c,#c0392b)"
      : "linear-gradient(135deg,#DF8908,#FF1D15)";
    toast.innerHTML = `<i class='bx bx-${isError ? "error-circle" : "check-circle"}' style="font-size:20px"></i> ${msg}`;
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
      toast.style.opacity = "1";
    });
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(80px)";
      toast.style.opacity = "0";
    }, 3500);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("reviewerName")?.value.trim();
    const email = document.getElementById("reviewerEmail")?.value.trim();
    const company = document.getElementById("reviewerCompany")?.value.trim();
    const text = document.getElementById("reviewText")?.value.trim();
    const rating = parseInt(document.getElementById("selectedRating")?.value || "0");
    const category = document.getElementById("reviewerCategory")?.value || "other";

    if (!name || !text) { showToast("Pakiusap lagyan ng pangalan at review! 😊", true); return; }
    if (rating < 1) { showToast("Pumili ng star rating bago mag-submit! ⭐", true); return; }

    const btn = form.querySelector(".rfv2-submit");
    if (btn) { btn.disabled = true; btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Sending...`; }

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const cardData = { name, company, text, rating, category, date };

    // Inject into grid
    const grid = document.getElementById("testiGrid");
    if (grid) {
      grid.insertAdjacentHTML("beforeend", buildNewCard(cardData));
    }

    showToast(`Salamat, ${name}! Na-post na ang iyong review! 🎉`);
    form.reset();
    document.getElementById("selectedRating").value = "0";
    document.querySelectorAll(".rfv2-stars span").forEach(s => s.classList.remove("selected", "hovered"));
    const label = document.getElementById("rfv2RatingLabel");
    if (label) label.textContent = "Click a star to rate";

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class='bx bx-send'></i><span>Submit Review</span><div class="rfv2-submit-ripple"></div>`;
    }

    // Scroll to new card
    document.querySelectorAll(".testi-card.dynamic-card")[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

// Animate rating bars on scroll
const ratingBars = document.querySelectorAll(".rating-bar-fill");
if (ratingBars.length) {
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.style.width;
        entry.target.style.width = "0";
        setTimeout(() => { entry.target.style.width = width; }, 100);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  ratingBars.forEach(bar => barObserver.observe(bar));
}

/* ═══════════════════════════════════════════════════
   PREMIUM v3 — About + Reviews JavaScript
═══════════════════════════════════════════════════ */

// Animate skill progress bars on scroll
(function () {
  const bars = document.querySelectorAll('.asp-bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width || '0';
        entry.target.style.width = target + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

// Animate rating bars (tr-bar-f)
(function () {
  const bars = document.querySelectorAll('.tr-bar-f');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w || '0';
        entry.target.style.width = w + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

// Filter tabs (tr-filter)
(function () {
  const tabs = document.querySelectorAll('.tr-filter');
  const cards = document.querySelectorAll('.tr-card[data-category]');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'cardFadeIn 0.5s ease forwards';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// Star picker (tr-star-btn)
(function () {
  const btns = document.querySelectorAll('.tr-star-btn');
  const input = document.getElementById('selectedRating');
  const hint = document.getElementById('trStarHint');
  const hints = { 1: 'Poor experience', 2: 'Fair — room to improve', 3: 'Good work overall', 4: 'Very good!', 5: 'Excellent — highly recommend! ⭐' };
  if (!btns.length) return;
  let selected = 0;

  btns.forEach((btn, idx) => {
    btn.addEventListener('mouseenter', () => {
      btns.forEach((b, i) => b.classList.toggle('lit', i <= idx));
      if (hint) hint.textContent = hints[idx + 1] || '';
    });
    btn.addEventListener('mouseleave', () => {
      btns.forEach((b, i) => b.classList.toggle('lit', i < selected));
      if (hint) hint.textContent = selected ? hints[selected] : 'Click to rate your experience';
    });
    btn.addEventListener('click', () => {
      selected = idx + 1;
      if (input) input.value = selected;
      btns.forEach((b, i) => b.classList.toggle('lit', i < selected));
      if (hint) hint.textContent = hints[selected];
    });
  });
})();

// Review form submission (premium)
(function () {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  function getAvatarUrl(name) {
    // Generate initials-based canvas avatar (letter avatar)
    const initials = (name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    let hash = 0;
    for (let i = 0; i < (name || 'U').length; i++) hash = (name || 'U').charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 80;
    const ctx = canvas.getContext('2d');
    // Background circle
    ctx.fillStyle = `hsl(${hue}, 55%, 40%)`;
    ctx.beginPath();
    ctx.arc(40, 40, 40, 0, Math.PI * 2);
    ctx.fill();
    // Inner ring
    ctx.strokeStyle = `hsl(${hue}, 55%, 65%)`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(40, 40, 36, 0, Math.PI * 2);
    ctx.stroke();
    // Initials text
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${initials.length > 1 ? 26 : 30}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 40, 41);
    return canvas.toDataURL();
  }

  function showPremiumToast(msg, ok = true) {
    let t = document.getElementById('pr-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pr-toast';
      t.style.cssText = `
        position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(120px);
        padding:1.4rem 3rem; border-radius:3rem; color:#fff; font-size:1.6rem; font-weight:700;
        display:flex; align-items:center; gap:1rem; z-index:99999;
        box-shadow:0 12px 40px rgba(0,0,0,0.5);
        transition:transform 0.5s cubic-bezier(0.34,1.56,.64,1), opacity 0.4s ease; opacity:0;
        font-family:'Poppins',sans-serif;
      `;
      document.body.appendChild(t);
    }
    t.style.background = ok
      ? 'linear-gradient(135deg,#22c55e,#16a34a)'
      : 'linear-gradient(135deg,#ef4444,#dc2626)';
    t.innerHTML = `<i class='bx bx-${ok ? "check-circle" : "error-circle"}' style="font-size:2.2rem"></i> ${msg}`;
    requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) translateY(0)'; t.style.opacity = '1'; });
    setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(120px)'; t.style.opacity = '0'; }, 4000);
  }

  function buildPremiumCard(d) {
    const stars = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="opacity:${i < d.rating ? 1 : 0.15}"></i>`).join('');
    const avatarSrc = d.avatar || getAvatarUrl(d.name);
    return `
      <div class="tr-card" data-category="${d.category || 'other'}" style="animation:cardFadeIn 0.6s ease forwards">
        <div class="tr-card-header">
          <div class="tr-card-avatar-wrap">
            <img src="${avatarSrc}" alt="${d.name}" class="tr-card-avatar">
            <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
          </div>
          <div class="tr-card-author-info">
            <h4>${d.name}</h4>
            <span class="tr-card-position">${d.company || 'Client'}</span>
            <span class="tr-card-company">New Review</span>
          </div>
          <div class="tr-card-stars">${stars}</div>
        </div>
        <div class="tr-card-body">
          <span class="tr-card-open-quote">❝</span>
          <p>"${d.text}"</p>
        </div>
        <div class="tr-card-footer">
          <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${d.category || 'Other'}</span>
          <span class="tr-card-when">${d.date}</span>
        </div>
      </div>`;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('reviewerName')?.value.trim();
    const email = document.getElementById('reviewerEmail')?.value.trim();
    const company = document.getElementById('reviewerCompany')?.value.trim();
    const text = document.getElementById('reviewText')?.value.trim();
    const rating = parseInt(document.getElementById('selectedRating')?.value || '0');
    const category = document.getElementById('reviewerCategory')?.value || 'other';

    if (!name || !email) { showPremiumToast('Please fill in your name and email! 😊', false); return; }
    if (!text) { showPremiumToast('Please write your review first! 📝', false); return; }
    if (rating < 1) { showPremiumToast('Please select a star rating! ⭐', false); return; }

    const btn = document.getElementById('trSubmitBtn');
    const content = btn?.querySelector('.tr-submit-content');
    const loading = btn?.querySelector('.tr-submit-loading');
    if (btn) { btn.disabled = true; if (content) content.style.display = 'none'; if (loading) loading.style.display = 'flex'; }

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const avatarData = getAvatarUrl(name);
    const cardData = { name, company, text, rating, category, date, avatar: avatarData };

    // Try save to Firestore (may fail if not configured - that's OK)
    try {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      const db = getFirestore();
      await addDoc(collection(db, 'reviews'), { ...cardData, email, timestamp: serverTimestamp() });
    } catch (_) { /* ignore – show anyway */ }

    // Inject card into grid
    const grid = document.getElementById('testiGrid');
    if (grid) {
      grid.insertAdjacentHTML('beforeend', buildPremiumCard(cardData));
      // Re-apply filter if active
      const active = document.querySelector('.tr-filter.active');
      if (active && active.dataset.cat !== 'all') {
        grid.querySelectorAll('.tr-card').forEach(c => {
          c.classList.toggle('hidden', c.dataset.category !== active.dataset.cat);
        });
      }
    }

    showPremiumToast(`Thank you, ${name}! Your review is now live! 🎉`);
    form.reset();
    if (document.getElementById('selectedRating')) document.getElementById('selectedRating').value = '0';
    document.querySelectorAll('.tr-star-btn').forEach(b => b.classList.remove('lit'));
    const hint = document.getElementById('trStarHint');
    if (hint) hint.textContent = 'Click to rate your experience';
    if (btn) { btn.disabled = false; if (content) content.style.display = 'flex'; if (loading) loading.style.display = 'none'; }

    // Scroll to new card
    setTimeout(() => {
      grid?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });
})();

// Add card fade-in keyframe dynamically
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(styleEl);

console.log('🔥 Premium portfolio v3 — fully loaded!');

/* ═══════════════════════════════════════════════════
   PREMIUM TECH SKILLS v3 — JavaScript
═══════════════════════════════════════════════════ */

// ── Tech Card Tab Filtering ──
(function () {
  const tabs = document.querySelectorAll('.ts-tab-btn');
  const cards = document.querySelectorAll('.ts-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;

      let delay = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.tab === filter;
        if (match) {
          card.classList.remove('ts-hidden');
          card.style.animationDelay = `${delay}ms`;
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = `tsCardIn 0.45s cubic-bezier(0.34,1.56,.64,1) ${delay}ms both`;
          });
          delay += 50;
        } else {
          card.classList.add('ts-hidden');
        }
      });
    });
  });

  // Add animation keyframes
  const s = document.createElement('style');
  s.textContent = `
    @keyframes tsCardIn {
      from { opacity:0; transform:translateY(24px) scale(0.96); }
      to   { opacity:1; transform:translateY(0)    scale(1); }
    }
  `;
  document.head.appendChild(s);
})();

// ── Tech Card meter fills on scroll ──
(function () {
  const fills = document.querySelectorAll('.ts-meter-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w || '0';
        entry.target.style.width = w + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fills.forEach(f => obs.observe(f));
})();

// ── Proficiency bar counter & fill ──
(function () {
  const items = document.querySelectorAll('.ts-prof-item');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const fill = item.querySelector('.ts-prof-fill');
      const pct = item.querySelector('.ts-prof-pct');
      const w = parseInt(fill?.dataset.w || '0');

      if (fill) fill.style.width = w + '%';

      if (pct) {
        let start = 0;
        const step = () => {
          start += 2;
          if (start > w) start = w;
          pct.textContent = start + '%';
          if (start < w) requestAnimationFrame(step);
        };
        setTimeout(step, 300);
      }
      obs.unobserve(item);
    });
  }, { threshold: 0.3 });

  items.forEach(i => obs.observe(i));
})();

// ── Radar legend bar fills ──
(function () {
  const fills = document.querySelectorAll('.lv2-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = (entry.target.dataset.w || '0') + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

// ── Tech card tilt effect on mousemove ──
(function () {
  const cards = document.querySelectorAll('.ts-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rx = (-y / rect.height * 10).toFixed(2);
      const ry = (x / rect.width * 10).toFixed(2);
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log('⚡ Tech Skills v3 — premium loaded!');

/* ═══════════════════════════════════════════════════
   PREMIUM CONTACT SECTION v3 — JavaScript
═══════════════════════════════════════════════════ */

(function () {

  // ── Live PHT Clock ──
  function updateClock() {
    const el = document.getElementById('ctClockText');
    if (!el) return;
    const now = new Date();
    const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const h = String(pht.getHours()).padStart(2, '0');
    const m = String(pht.getMinutes()).padStart(2, '0');
    const s = String(pht.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Quick Project Type Buttons ──
  const qsBtns = document.querySelectorAll('.ct-qs-btn');
  const subjectInput = document.getElementById('cf-subject');
  qsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qsBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (subjectInput) {
        subjectInput.value = btn.dataset.subject;
        subjectInput.dispatchEvent(new Event('input'));
        subjectInput.focus();
      }
    });
  });

  // ── Character Counter ──
  const msgArea = document.getElementById('cf-message');
  const charCount = document.getElementById('ctCharCount');
  if (msgArea && charCount) {
    msgArea.addEventListener('input', () => {
      const len = msgArea.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 900 ? '#ef4444' : len > 700 ? '#f59e0b' : '#555';
      if (msgArea.value.length > 1000) msgArea.value = msgArea.value.slice(0, 1000);
    });
  }

  // ── Copy Email Button ──
  document.querySelectorAll('.ct-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const icon = btn.querySelector('i');
        const orig = icon.className;
        icon.className = 'bx bx-check';
        btn.classList.add('copied');
        btn.title = 'Copied!';
        setTimeout(() => {
          icon.className = orig;
          btn.classList.remove('copied');
          btn.title = 'Copy email';
        }, 2000);
      } catch (_) { }
    });
  });

  // ── Toast System ──
  function showToast(id, duration = 5000) {
    const toast = document.getElementById(id);
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }
  // Close buttons
  document.getElementById('ctToastClose')?.addEventListener('click', () => {
    document.getElementById('ct-success-toast')?.classList.remove('show');
  });
  document.getElementById('ctErrToastClose')?.addEventListener('click', () => {
    document.getElementById('ct-error-toast')?.classList.remove('show');
  });

  // ── Form Validation & Submission ──
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    el.closest('.ct-form-group')?.querySelector('input, textarea')?.classList.add('ct-input-error');
  }
  function clearErrors() {
    contactForm.querySelectorAll('.ct-field-error').forEach(e => e.classList.remove('visible'));
    contactForm.querySelectorAll('.ct-input-error').forEach(i => i.classList.remove('ct-input-error'));
  }

  // Real-time clear on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const errId = field.closest('.ct-form-group')?.querySelector('.ct-field-error')?.id;
      if (errId) {
        document.getElementById(errId)?.classList.remove('visible');
        field.classList.remove('ct-input-error');
      }
    });
  });

  // Honeypot
  function isSpam() {
    return !!contactForm.querySelector('[name="ct_honeypot"]')?.value;
  }

  // NOTE: Ang submit logic (EmailJS send + UI states) ay pinagsamang hawak na
  // ng EMAILJS CONTACT FORM section sa itaas. Wala nang dagdag na handler dito
  // para maiwasan ang conflict / double-fire.

  // ── Input focus highlight ──
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .ct-input-error { border-color: rgba(239,68,68,0.5) !important; background: rgba(239,68,68,0.04) !important; }
    .ct-input-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.1) !important; }
  `;
  document.head.appendChild(styleTag);

})();

console.log('📬 Premium Contact Section v3 loaded!');

/* ═══════════════════════════════════════════════════
   PREMIUM FOOTER v3 — JavaScript
═══════════════════════════════════════════════════ */

(function () {

  // ── Dynamic Year ──
  document.querySelectorAll('#ftYear').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── Scroll-to-top button ──
  const scrollTopBtn = document.getElementById('ftScrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Visitor counter (localStorage) ──
  const visitorEl = document.getElementById('ftVisitCount');
  if (visitorEl) {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('ft_visit_date');
    let count = parseInt(localStorage.getItem('ft_visit_count') || '0');

    if (stored !== today) {
      // New day — reset seed
      count = Math.floor(Math.random() * 30) + 15; // 15–45 base
      localStorage.setItem('ft_visit_date', today);
    } else {
      // Same day — increment a bit
      count = count + Math.floor(Math.random() * 3);
    }
    localStorage.setItem('ft_visit_count', count);

    // Animate count up
    let cur = 0;
    const target = count;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      visitorEl.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 40);
  }

  // ── Footer nav links smooth scroll ──
  document.querySelectorAll('.ft-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Footer entrance animation ──
  const footer = document.querySelector('.footer');
  if (footer) {
    const fobs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.classList.add('ft-visible');
          fobs.unobserve(footer);
        }
      });
    }, { threshold: 0.05 });
    fobs.observe(footer);
  }

  // Add reveal CSS
  const ftStyle = document.createElement('style');
  ftStyle.textContent = `
    .footer .ft-col { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .footer.ft-visible .ft-col { opacity: 1; transform: translateY(0); }
    .footer.ft-visible .ft-col:nth-child(1) { transition-delay: 0.1s; }
    .footer.ft-visible .ft-col:nth-child(2) { transition-delay: 0.2s; }
    .footer.ft-visible .ft-col:nth-child(3) { transition-delay: 0.3s; }
    .footer.ft-visible .ft-col:nth-child(4) { transition-delay: 0.4s; }
    .ft-cta-banner { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .footer.ft-visible .ft-cta-banner { opacity: 1; transform: translateY(0); }
    .ft-bottom { opacity: 0; transition: opacity 0.8s ease 0.5s; }
    .footer.ft-visible .ft-bottom { opacity: 1; }
    .ft-version-tag { opacity: 0; transition: opacity 0.8s ease 0.7s; }
    .footer.ft-visible .ft-version-tag { opacity: 1; }
  `;
  document.head.appendChild(ftStyle);

})();

console.log('🚀 Premium Footer v3 — fully loaded!');
/* ═══════════════════════════════════════════════════
   PREMIUM DIGITAL ID CARD v2 — JS
═══════════════════════════════════════════════════ */
(function () {

  // ── Fake QR pattern (decorative) ──
  const qrCanvas = document.getElementById('pdcQrCanvas');
  if (qrCanvas) {
    const ctx = qrCanvas.getContext('2d');
    const size = 64;
    const cell = 4;
    const cols = size / cell;
    // QR-like deterministic pattern
    const pattern = [
      1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1,
      1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0,
      1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1,
      1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1,
      1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0,
      1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
      0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
      1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0,
      0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    ];
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111';
    pattern.forEach((bit, i) => {
      if (bit) {
        const x = (i % cols) * cell;
        const y = Math.floor(i / cols) * cell;
        ctx.fillRect(x, y, cell, cell);
      }
    });
  }

  // ── Counter animation for new ID card stats ──
  const pdcCounters = document.querySelectorAll('.pdc-stat-n.counter');
  if (pdcCounters.length) {
    const pdcObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let n = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          n = Math.min(n + step, target);
          el.textContent = n + suffix;
          if (n >= target) clearInterval(timer);
        }, 25);
        pdcObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    pdcCounters.forEach(el => pdcObserver.observe(el));
  }

  // ── 3D tilt on card hover ──
  const pdcCard = document.getElementById('pdcCard');
  if (pdcCard) {
    pdcCard.addEventListener('mousemove', e => {
      const rect = pdcCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rx = (-y / rect.height * 8).toFixed(2);
      const ry = (x / rect.width * 8).toFixed(2);
      pdcCard.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    pdcCard.addEventListener('mouseleave', () => {
      pdcCard.style.transform = '';
    });
  }

})();

/* ═══════════════════════════════════════════════════
   BENTO CLOCK — live time display
═══════════════════════════════════════════════════ */
(function () {
  const clockEl = document.getElementById('bentoClock');
  if (!clockEl) return;
  function tick() {
    const now = new Date();
    const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const h = String(pht.getHours()).padStart(2, '0');
    const m = String(pht.getMinutes()).padStart(2, '0');
    const s = String(pht.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

console.log('💳 Premium Digital ID Card v2 + Bento Grid — loaded!');
// ════════════════════════════════════════════════════════════════
//  HIRE ME MODAL — JVOR DEV.
// ════════════════════════════════════════════════════════════════
(function initHireModal() {
  const modal = document.getElementById('hireMeModal');
  const openBtn = document.getElementById('openHireModal');
  const closeBtn = document.getElementById('closeHireModal');
  const backdrop = modal?.querySelector('.hm-backdrop');
  const goContact = document.getElementById('hm-go-contact');
  const toast = document.getElementById('hmCopyToast');

  if (!modal || !openBtn) return;

  let toastTimer;

  // ── Open ──────────────────────────────────────────────────────
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  // ── Close ─────────────────────────────────────────────────────
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // "Send Me a Project Brief" → close modal then scroll to contact
  goContact?.addEventListener('click', () => {
    closeModal();
  });

  // ── Copy Email ────────────────────────────────────────────────
  modal.querySelectorAll('.hm-copy-email').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      // Update button state
      const actionEl = btn.querySelector('.hm-cb-action');
      if (actionEl) {
        actionEl.innerHTML = '<i class="bx bx-check"></i><span>Copied!</span>';
        actionEl.style.color = '#4ade80';
        setTimeout(() => {
          actionEl.innerHTML = '<i class="bx bx-copy"></i><span>Copy</span>';
          actionEl.style.color = '';
        }, 2200);
      }
      // Show toast
      clearTimeout(toastTimer);
      toast.classList.add('show');
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   GRAPHIC DESIGN & VIDEO EDIT SAMPLES — TABS + LIGHTBOX
══════════════════════════════════════════════════════════════ */
(function () {
  // ── Tab Switcher ──────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.cs-tab-btn');
  const tabContents = document.querySelectorAll('.cs-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('cs-tab-active'));
      tabContents.forEach(c => c.classList.remove('cs-tab-show'));

      btn.classList.add('cs-tab-active');
      const targetId = 'cs-tab-' + btn.dataset.tab;
      const target = document.getElementById(targetId);
      if (target) target.classList.add('cs-tab-show');
    });
  });

  // ── Lightbox ─────────────────────────────────────────────
  const lightbox = document.getElementById('csLightbox');
  const lbImg = document.getElementById('csLightboxImg');
  const lbOverlay = lightbox ? lightbox.querySelector('.cs-lb-overlay') : null;
  const lbClose = lightbox ? lightbox.querySelector('.cs-lb-close') : null;
  const lbPrev = lightbox ? lightbox.querySelector('.cs-lb-prev') : null;
  const lbNext = lightbox ? lightbox.querySelector('.cs-lb-next') : null;

  // Collect only non-placeholder graphic cards
  let csImages = [];
  let csCurrentIdx = 0;

  function buildImageList() {
    csImages = [];
    const activeTab = document.querySelector('.cs-tab-content.cs-tab-show');
    if (!activeTab) return;
    activeTab.querySelectorAll('.cs-card:not(.cs-card-add)').forEach(card => {
      const img = card.querySelector('.cs-card-img');
      if (img) csImages.push({ src: img.src, alt: img.alt });
    });
  }

  function openLightbox(idx) {
    if (!lightbox || csImages.length === 0) return;
    csCurrentIdx = idx;
    lbImg.src = csImages[idx].src;
    lbImg.alt = csImages[idx].alt;
    lightbox.classList.add('cs-lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('cs-lb-open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function navigate(dir) {
    csCurrentIdx = (csCurrentIdx + dir + csImages.length) % csImages.length;
    lbImg.src = csImages[csCurrentIdx].src;
    lbImg.alt = csImages[csCurrentIdx].alt;
  }

  // Open on graphic card click (non-placeholder, non-video)
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.cs-card:not(.cs-card-add):not(.cs-card-video)');
    if (!card) return;
    buildImageList();
    const idx = parseInt(card.dataset.csIndex, 10) || 0;
    openLightbox(Math.min(idx, csImages.length - 1));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => navigate(-1));
  if (lbNext) lbNext.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('cs-lb-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

// ═══════════════════════════════════════════════════════
//   ADVANCED MAP SECTION — Live Clock & Controls
// ═══════════════════════════════════════════════════════
(function advancedMap() {

  // Live clock for HUD and map badge (PHT = UTC+8)
  function updateAdvClocks() {
    const now = new Date();
    const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const hh = String(pht.getHours()).padStart(2, '0');
    const mm = String(pht.getMinutes()).padStart(2, '0');
    const ss = String(pht.getSeconds()).padStart(2, '0');
    const timeStr = `${hh}:${mm}:${ss}`;
    const timeShort = `${hh}:${mm} PHT`;

    const hudClock = document.getElementById('advHudClock');
    const mapClock = document.getElementById('advMapClock');
    if (hudClock) hudClock.textContent = timeStr;
    if (mapClock) mapClock.textContent = timeShort;
  }

  updateAdvClocks();
  setInterval(updateAdvClocks, 1000);

  // Map style toggle (street / satellite)
  const iframe = document.getElementById('advMapIframe');
  const btnStreet = document.getElementById('advMapStreet');
  const btnSat = document.getElementById('advMapSat');

  const MAP_STREET = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e0!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";
  const MAP_SAT = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e1!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";

  if (btnStreet && iframe) {
    btnStreet.addEventListener('click', () => {
      iframe.src = MAP_STREET;
      iframe.style.filter = 'saturate(0.75) contrast(1.1) brightness(0.9)';
      btnStreet.classList.add('adv-ctrl-active');
      if (btnSat) btnSat.classList.remove('adv-ctrl-active');
    });
  }
  if (btnSat && iframe) {
    btnSat.addEventListener('click', () => {
      iframe.src = MAP_SAT;
      iframe.style.filter = 'saturate(0.6) contrast(1.15) brightness(0.85)';
      btnSat.classList.add('adv-ctrl-active');
      if (btnStreet) btnStreet.classList.remove('adv-ctrl-active');
    });
  }

  // Animate stats in when map section enters viewport
  const mapSection = document.querySelector('.adv-map-section');
  if (mapSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        mapSection.classList.add('adv-map-visible');
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(mapSection);
  }

})();
// ═══ JVOR DEV FIXES — appended below ═══
// ═══════════════════════════════════════════════════════════════════
//  JVOR DEV — PORTFOLIO FIXES & ENHANCEMENTS
//  Fixes: Typewriter, Gallery, Map visibility, Scroll animations,
//         Offline mode with auto-refresh
// ═══════════════════════════════════════════════════════════════════

/* ─────────────────────────────────────────────────────────────────
   FIX 1: TYPEWRITER EFFECT — Home & About sections
   Problem: The original typing effect sometimes breaks or doesn't
   restart correctly after deleting. This replaces it completely.
───────────────────────────────────────────────────────────────── */
(function fixTypewriter() {
  const el = document.getElementById('changing-text');
  if (!el) return;

  const texts = [
    'Full Stack Web Developer',
    'UI/UX Designer',
    'Video Editor',
    'Front-End Developer',
    'Creative Thinker'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  // Add blinking cursor
  el.style.borderRight = '3px solid var(--main-color, #ea580c)';
  el.style.paddingRight = '2px';

  // Blink cursor animation
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    #changing-text {
      border-right: 3px solid var(--main-color, #ea580c) !important;
      animation: blink-cursor 0.75s step-end infinite;
      display: inline-block;
    }
    @keyframes blink-cursor {
      0%, 100% { border-color: var(--main-color, #ea580c); }
      50% { border-color: transparent; }
    }
  `;
  document.head.appendChild(cursorStyle);

  function type() {
    if (isPaused) return;

    const currentText = texts[textIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = currentText.substring(0, charIndex);

      if (charIndex === currentText.length) {
        // Full word typed — pause before deleting
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(type, 60);
        }, 2200);
        return;
      }
      setTimeout(type, 95);
    } else {
      // Deleting
      charIndex--;
      el.textContent = currentText.substring(0, charIndex);

      if (charIndex === 0) {
        // Done deleting — move to next word
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;

        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          setTimeout(type, 95);
        }, 400);
        return;
      }
      setTimeout(type, 50);
    }
  }

  // Small delay before starting so DOM is settled
  setTimeout(type, 800);
})();

/* ─────────────────────────────────────────────────────────────────
   FIX 2: ABOUT SECTION ANIMATED TEXT (typing in about bio)
   Makes the greeting text animate nicely on scroll into view
───────────────────────────────────────────────────────────────── */
(function fixAboutAnimations() {
  // Ensure about section elements animate on scroll
  const aboutTargets = [
    '.aib-greeting',
    '.aib-name',
    '.aib-role-row',
    '.aib-bio',
    '.aib-stat-strip',
    '.aib-info-grid',
    '.aib-actions',
    '.aib-float-tag',
    '.wid-card',
    '.atl-card',
    '.asp-bar-item'
  ];

  const aboutStyle = document.createElement('style');
  aboutStyle.textContent = `
    /* About section entrance animations */
    .aib-greeting,
    .aib-name,
    .aib-role-row,
    .aib-bio,
    .aib-stat-strip,
    .aib-info-grid,
    .aib-actions {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .aib-photo-frame {
      opacity: 0;
      transform: scale(0.92) translateY(20px);
      transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .aib-float-tag {
      opacity: 0;
      transform: scale(0.7);
      transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .wid-card {
      opacity: 0;
      transform: translateY(40px) scale(0.97);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .atl-card {
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .atl-side--right .atl-card {
      transform: translateX(30px);
    }
    .asp-bar-item {
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    /* Visible states */
    .aib-greeting.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
    .aib-name.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
    .aib-role-row.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.3s; }
    .aib-bio.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.4s; }
    .aib-stat-strip.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.5s; }
    .aib-info-grid.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.55s; }
    .aib-actions.about-vis { opacity: 1; transform: translateY(0); transition-delay: 0.6s; }
    .aib-photo-frame.about-vis { opacity: 1; transform: scale(1) translateY(0); transition-delay: 0.05s; }
    .aib-float-tag.about-vis { opacity: 1; transform: scale(1); }
    .aib-float-tag.aib-ft-1.about-vis { transition-delay: 0.7s; }
    .aib-float-tag.aib-ft-2.about-vis { transition-delay: 0.8s; }
    .aib-float-tag.aib-ft-3.about-vis { transition-delay: 0.9s; }
    .aib-float-tag.aib-ft-4.about-vis { transition-delay: 1.0s; }
    .wid-card.about-vis { opacity: 1; transform: translateY(0) scale(1); }
    .wid-card:nth-child(1).about-vis { transition-delay: 0.1s; }
    .wid-card:nth-child(2).about-vis { transition-delay: 0.2s; }
    .wid-card:nth-child(3).about-vis { transition-delay: 0.3s; }
    .atl-card.about-vis { opacity: 1; transform: translateX(0); }
    .atl-side--right .atl-card.about-vis { transform: translateX(0); }
    .asp-bar-item.about-vis { opacity: 1; transform: translateX(0); }
  `;
  document.head.appendChild(aboutStyle);

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('about-vis');
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  // Stagger asp-bar-items
  document.querySelectorAll('.asp-bar-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  document.querySelectorAll([
    '.aib-greeting', '.aib-name', '.aib-role-row', '.aib-bio',
    '.aib-stat-strip', '.aib-info-grid', '.aib-actions',
    '.aib-photo-frame', '.aib-float-tag',
    '.wid-card', '.atl-card', '.asp-bar-item'
  ].join(',')).forEach(el => aboutObserver.observe(el));
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 3: GALLERY — Fix lightbox and improve gallery grid
   Makes the photo gallery properly clickable with smooth transitions
───────────────────────────────────────────────────────────────── */
(function fixGallery() {
  // Wait for DOM to be ready
  const init = () => {
    const galleryModal = document.getElementById('galleryModal');
    if (!galleryModal) {
      console.warn('Gallery modal not found - trying to create one...');
      createFallbackGallery();
      return;
    }

    const modalImg = document.getElementById('gallery-modal-img');
    const closeBtn = galleryModal.querySelector('.gallery-modal-close');
    const prevBtn = galleryModal.querySelector('.gallery-modal-prev');
    const nextBtn = galleryModal.querySelector('.gallery-modal-next');
    const overlay = galleryModal.querySelector('.gallery-modal-overlay');
    const currentEl = document.getElementById('gallery-current');
    const totalEl = document.getElementById('gallery-total');

    if (!modalImg) return;

    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    // Build image sources — handle missing images gracefully
    const sources = Array.from(items).map(item => {
      const img = item.querySelector('img');
      return { src: img?.src || '', alt: img?.alt || 'Gallery Photo' };
    });

    if (totalEl) totalEl.textContent = sources.length;

    let currentIndex = 0;

    const openModal = (index) => {
      currentIndex = index;
      const { src, alt } = sources[currentIndex] || {};
      modalImg.src = src || '';
      modalImg.alt = alt || '';
      if (currentEl) currentEl.textContent = currentIndex + 1;
      galleryModal.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => galleryModal.classList.add('active'));
      });
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      galleryModal.classList.remove('active');
      setTimeout(() => {
        galleryModal.style.display = 'none';
        modalImg.src = '';
      }, 420);
      document.body.style.overflow = '';
    };

    const navigate = (dir) => {
      currentIndex = (currentIndex + dir + sources.length) % sources.length;
      modalImg.style.opacity = '0';
      modalImg.style.transform = dir > 0 ? 'translateX(30px)' : 'translateX(-30px)';
      setTimeout(() => {
        modalImg.src = sources[currentIndex]?.src || '';
        modalImg.alt = sources[currentIndex]?.alt || '';
        if (currentEl) currentEl.textContent = currentIndex + 1;
        modalImg.style.opacity = '1';
        modalImg.style.transform = 'translateX(0)';
      }, 200);
    };

    // Set transition on modal img
    modalImg.style.transition = 'opacity 0.2s ease, transform 0.25s ease';

    // Click on gallery items
    items.forEach((item, i) => {
      item.style.cursor = 'pointer';
      // Remove old listeners by cloning
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      newItem.addEventListener('click', () => openModal(i));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!galleryModal.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') closeModal();
    });

    // Touch/swipe support
    let touchStartX = 0;
    galleryModal.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    galleryModal.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });

    // Gallery scroll reveal (re-init for freshly cloned items)
    const freshItems = document.querySelectorAll('.gallery-item');
    const galObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('gallery-visible'), i * 100);
          galObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    freshItems.forEach(item => {
      item.classList.remove('gallery-visible');
      galObs.observe(item);
    });

    console.log('✅ Gallery lightbox fixed & ready!');
  };

  // Fallback: if no galleryModal exists, create one inline
  function createFallbackGallery() {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'galleryModal';
    modal.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9999;
      align-items:center; justify-content:center;
      background:rgba(0,0,0,0.92); backdrop-filter:blur(8px);
    `;
    modal.innerHTML = `
      <div class="gallery-modal-overlay" style="position:absolute;inset:0;"></div>
      <button class="gallery-modal-close" style="position:absolute;top:20px;right:24px;background:rgba(234,88,12,0.15);border:1px solid rgba(234,88,12,0.4);color:#fff;width:44px;height:44px;border-radius:50%;font-size:22px;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;">✕</button>
      <button class="gallery-modal-prev" style="position:absolute;left:20px;background:rgba(234,88,12,0.15);border:1px solid rgba(234,88,12,0.4);color:#fff;width:44px;height:44px;border-radius:50%;font-size:22px;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;">‹</button>
      <button class="gallery-modal-next" style="position:absolute;right:20px;background:rgba(234,88,12,0.15);border:1px solid rgba(234,88,12,0.4);color:#fff;width:44px;height:44px;border-radius:50%;font-size:22px;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;">›</button>
      <img id="gallery-modal-img" src="" alt="" style="max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 0 60px rgba(234,88,12,0.3);z-index:1;transition:opacity 0.2s ease,transform 0.25s ease;">
      <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.7);font-size:13px;">
        <span id="gallery-current">1</span> / <span id="gallery-total">${items.length}</span>
      </div>
    `;
    document.body.appendChild(modal);

    // Add transition class
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
      #galleryModal { transition: opacity 0.3s ease; }
      #galleryModal.active { opacity: 1; }
      #galleryModal:not(.active) { opacity: 0; }
    `;
    document.head.appendChild(modalStyle);

    // Now init with the created modal
    setTimeout(init, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 4: MAP VISIBILITY IN ABOUT SECTION
   Ensures the map iframe is properly visible and loads
───────────────────────────────────────────────────────────────── */
(function fixMapVisibility() {
  const mapFix = document.createElement('style');
  mapFix.textContent = `
    /* Make sure map containers are visible */
    .adv-map-section,
    .map-container,
    .map-wrapper,
    [id*="map"],
    .map-embed,
    .about-map {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      overflow: visible !important;
    }
    
    /* Ensure map iframe renders */
    .adv-map-section iframe,
    .map-container iframe,
    [id*="map"] iframe {
      display: block !important;
      visibility: visible !important;
      width: 100% !important;
      min-height: 350px !important;
      border: none !important;
      border-radius: 12px !important;
    }

    /* Fix map section if it was hidden */
    .adv-map-section {
      position: relative !important;
      z-index: 1 !important;
    }
  `;
  document.head.appendChild(mapFix);

  // Animate the map section entrance
  const mapSection = document.querySelector('.adv-map-section');
  if (mapSection) {
    mapSection.style.opacity = '0';
    mapSection.style.transform = 'translateY(30px)';
    mapSection.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';

    const mapObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        mapSection.style.opacity = '1';
        mapSection.style.transform = 'translateY(0)';
        mapSection.classList.add('adv-map-visible');
        mapObs.disconnect();
      }
    }, { threshold: 0.1 });
    mapObs.observe(mapSection);
  }

  // Fix for the Google Maps iframe — ensure it's visible
  const mapIframe = document.getElementById('advMapIframe');
  if (mapIframe) {
    mapIframe.style.display = 'block';
    mapIframe.style.width = '100%';
    mapIframe.style.minHeight = '350px';
    mapIframe.setAttribute('loading', 'lazy');
  }
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 5: SMOOTH SCROLL-DOWN ANIMATIONS
   Beautiful staggered reveal for ALL sections when scrolling
───────────────────────────────────────────────────────────────── */
(function enhancedScrollAnimations() {
  const css = document.createElement('style');
  css.textContent = `
    /* ── Universal Scroll Reveal System ── */
    [data-reveal] {
      opacity: 0;
      will-change: opacity, transform;
    }
    [data-reveal="fade-up"] { transform: translateY(50px); }
    [data-reveal="fade-left"] { transform: translateX(-50px); }
    [data-reveal="fade-right"] { transform: translateX(50px); }
    [data-reveal="fade-scale"] { transform: scale(0.88); }
    [data-reveal="fade-rotate"] { transform: translateY(30px) rotate(-3deg); }

    [data-reveal].is-revealed {
      opacity: 1;
      transform: none;
      transition:
        opacity 0.75s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.75s cubic-bezier(0.23, 1, 0.32, 1);
    }

    /* Section headings pop */
    .section-heading[data-reveal].is-revealed {
      transition-duration: 0.9s;
    }

    /* Stagger delays for children */
    [data-stagger] > * {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    [data-stagger].stagger-visible > *:nth-child(1) { opacity: 1; transform: none; transition-delay: 0.05s; }
    [data-stagger].stagger-visible > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 0.12s; }
    [data-stagger].stagger-visible > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 0.19s; }
    [data-stagger].stagger-visible > *:nth-child(4) { opacity: 1; transform: none; transition-delay: 0.26s; }
    [data-stagger].stagger-visible > *:nth-child(5) { opacity: 1; transform: none; transition-delay: 0.33s; }
    [data-stagger].stagger-visible > *:nth-child(6) { opacity: 1; transform: none; transition-delay: 0.40s; }
    [data-stagger].stagger-visible > *:nth-child(7) { opacity: 1; transform: none; transition-delay: 0.47s; }
    [data-stagger].stagger-visible > *:nth-child(8) { opacity: 1; transform: none; transition-delay: 0.54s; }
    [data-stagger].stagger-visible > *:nth-child(n+9) { opacity: 1; transform: none; transition-delay: 0.60s; }

    /* Section title decoration line */
    .section-heading::after {
      content: '';
      display: block;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--main-color, #ea580c), transparent);
      margin-top: 8px;
      border-radius: 2px;
      transition: width 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s;
    }
    .section-heading.is-revealed::after { width: 80px; }

    /* Smooth section entrance — subtle parallax */
    section {
      overflow: clip;
    }

    /* Neon glow on cards when they enter */
    .premium-card.is-revealed,
    .ts-card.is-revealed,
    .service-box.is-revealed {
      box-shadow: 0 0 0 1px rgba(234, 88, 12, 0);
      transition: box-shadow 0.6s ease 0.5s, opacity 0.75s ease, transform 0.75s ease;
    }
  `;
  document.head.appendChild(css);

  // Auto-assign data-reveal to key elements that don't have it yet
  function assignReveal(selector, type, parent) {
    const root = parent || document;
    root.querySelectorAll(selector).forEach(el => {
      if (!el.dataset.reveal) el.dataset.reveal = type;
    });
  }

  assignReveal('.section-heading:not([data-reveal])', 'fade-up');
  assignReveal('.about-section-label:not([data-reveal])', 'fade-up');
  assignReveal('.about-section-sub:not([data-reveal])', 'fade-up');
  assignReveal('.premium-card:not([data-reveal])', 'fade-up');
  assignReveal('.ts-card:not([data-reveal])', 'fade-scale');
  assignReveal('.service-box:not([data-reveal])', 'fade-up');
  assignReveal('.gallery-section-header:not([data-reveal])', 'fade-up');
  assignReveal('.gallery-title:not([data-reveal])', 'fade-up');
  assignReveal('.contact-header:not([data-reveal])', 'fade-up');
  assignReveal('.ft-col:not([data-reveal])', 'fade-up');

  // Assign stagger to grids
  document.querySelectorAll('.cert-grid:not([data-stagger]), .ts-grid:not([data-stagger]), .about-wid-grid:not([data-stagger])').forEach(el => {
    el.dataset.stagger = 'true';
  });

  // Create the reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use delay from data attribute or default to 0
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all data-reveal elements
  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Stagger observer
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stagger-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-stagger]').forEach(el => {
    staggerObserver.observe(el);
  });

  // Re-run observer for dynamically added elements
  const mutationObs = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          node.querySelectorAll?.('[data-reveal]:not(.is-revealed)').forEach(el => {
            revealObserver.observe(el);
          });
        }
      });
    });
  });
  mutationObs.observe(document.body, { childList: true, subtree: true });

  console.log('✨ Enhanced scroll animations initialized!');
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 6: SMOOTH SCROLL BEHAVIOR FOR ALL ANCHOR LINKS
   Fixes abrupt jumping when clicking nav links
───────────────────────────────────────────────────────────────── */
(function fixSmoothScroll() {
  // Override all anchor links with smooth scroll
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerH = document.querySelector('.header')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }, true);
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 7: OFFLINE MODE + AUTO-REFRESH WHEN INTERNET RETURNS
───────────────────────────────────────────────────────────────── */
(function initOfflineMode() {
  // Create offline banner HTML
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.innerHTML = `
    <div class="offline-inner">
      <div class="offline-icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <line x1="12" y1="20" x2="12.01" y2="20"/>
        </svg>
      </div>
      <div class="offline-text-wrap">
        <strong>You're offline</strong>
        <span>Some features may not work. Waiting for connection...</span>
      </div>
      <div class="offline-pulse-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  // Create reconnecting banner
  const reconnectBanner = document.createElement('div');
  reconnectBanner.id = 'reconnect-banner';
  reconnectBanner.innerHTML = `
    <div class="offline-inner">
      <div class="offline-icon-wrap" style="color:#22c55e;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="offline-text-wrap">
        <strong>You're back online!</strong>
        <span id="reconnect-countdown">Refreshing in 3s...</span>
      </div>
    </div>
  `;

  // Inject styles
  const offlineStyles = document.createElement('style');
  offlineStyles.textContent = `
    #offline-banner,
    #reconnect-banner {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      min-width: 320px;
      max-width: 90vw;
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(234,88,12,0.2);
      transition: bottom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
    }

    #offline-banner {
      background: linear-gradient(135deg, #1a0a00 0%, #2d1500 100%);
      border: 1px solid rgba(234, 88, 12, 0.4);
    }

    #reconnect-banner {
      background: linear-gradient(135deg, #001a0a 0%, #002d15 100%);
      border: 1px solid rgba(34, 197, 94, 0.4);
    }

    #offline-banner.show,
    #reconnect-banner.show {
      bottom: 30px;
      opacity: 1;
      pointer-events: auto;
    }

    .offline-inner {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
    }

    .offline-icon-wrap {
      color: #ea580c;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      animation: offline-icon-pulse 1.5s ease-in-out infinite;
    }

    @keyframes offline-icon-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .offline-text-wrap {
      flex: 1;
    }

    .offline-text-wrap strong {
      display: block;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .offline-text-wrap span {
      display: block;
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      margin-top: 2px;
    }

    .offline-pulse-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      flex-shrink: 0;
    }

    .offline-pulse-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(234, 88, 12, 0.6);
      animation: dot-bounce 1.2s ease-in-out infinite;
    }

    .offline-pulse-dots span:nth-child(2) { animation-delay: 0.2s; }
    .offline-pulse-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dot-bounce {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50% { transform: translateY(-5px); opacity: 1; }
    }

    /* Dim the page slightly when offline */
    body.is-offline::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.15);
      z-index: 9990;
      pointer-events: none;
      animation: offline-fade-in 0.5s ease forwards;
    }

    @keyframes offline-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Offline indicator in header */
    .offline-header-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
      animation: offline-icon-pulse 1.5s ease-in-out infinite;
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
    }
  `;
  document.head.appendChild(offlineStyles);
  document.body.appendChild(banner);
  document.body.appendChild(reconnectBanner);

  let wasOffline = false;
  let reconnectTimer = null;
  let countdownInterval = null;

  const showBanner = (el) => {
    el.classList.add('show');
  };

  const hideBanner = (el) => {
    el.classList.remove('show');
  };

  const handleOffline = () => {
    wasOffline = true;
    document.body.classList.add('is-offline');
    hideBanner(reconnectBanner);
    showBanner(banner);

    // Add dot to header logo
    const logo = document.querySelector('.logo');
    if (logo && !logo.querySelector('.offline-header-dot')) {
      const dot = document.createElement('span');
      dot.className = 'offline-header-dot';
      dot.title = 'Offline';
      logo.appendChild(dot);
    }

    console.warn('🔴 Portfolio is OFFLINE');
  };

  const handleOnline = () => {
    if (!wasOffline) return;

    document.body.classList.remove('is-offline');
    hideBanner(banner);

    // Remove header dot
    document.querySelector('.offline-header-dot')?.remove();

    // Show reconnect banner with countdown
    showBanner(reconnectBanner);

    let countdown = 3;
    const countdownEl = document.getElementById('reconnect-countdown');

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = `Refreshing in ${countdown}s...`;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.reload();
      }
    }, 1000);

    console.log('🟢 Back online! Refreshing in 3 seconds...');
  };

  // Listen for network events
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  // Check initial state
  if (!navigator.onLine) {
    handleOffline();
  }

  // Periodic connectivity check (ping a small resource)
  let checkInterval = null;

  const checkConnectivity = async () => {
    if (navigator.onLine && wasOffline) {
      // Double-check with a real fetch
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 3000);
        await fetch('https://www.google.com/favicon.ico', {
          mode: 'no-cors',
          signal: ctrl.signal,
          cache: 'no-store'
        });
        clearTimeout(timeout);
        handleOnline();
        clearInterval(checkInterval);
      } catch (_) {
        // Still offline
      }
    }
  };

  window.addEventListener('offline', () => {
    // When offline, start periodic check
    checkInterval = setInterval(checkConnectivity, 5000);
  });

  window.addEventListener('online', () => {
    clearInterval(checkInterval);
  });

  console.log('📡 Offline mode monitor initialized!');
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 8: ALL SECTIONS VISIBLE — Fix hidden section bugs
───────────────────────────────────────────────────────────────── */
(function fixSectionVisibility() {
  const sectionFix = document.createElement('style');
  sectionFix.textContent = `
    /* Ensure all sections are properly visible */
    section,
    .home,
    .about-resume,
    .certificates,
    .tech-skills,
    .services,
    .projects,
    .creative-samples,
    .testimonials,
    .contact,
    footer {
      position: relative;
      overflow: visible;
    }

    /* Fix for sections that might have been hidden */
    .photo-gallery-section {
      display: block !important;
      visibility: visible !important;
    }

    /* Ensure orbit icons show */
    .orbit-icons i {
      opacity: 1 !important;
    }

    /* Fix scroll progress bar */
    #scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #ea580c, #ff9f1c);
      z-index: 99999;
      width: 0%;
      transition: width 0.1s linear;
      box-shadow: 0 0 8px rgba(234, 88, 12, 0.6);
    }

    /* Fix floating hire button */
    #floating-hire {
      display: flex;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
      transform: translateY(10px);
    }
    #floating-hire.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(sectionFix);
})();


/* ─────────────────────────────────────────────────────────────────
   FIX 9: HEADER ACTIVE STATE AND SMOOTH BEHAVIOR
───────────────────────────────────────────────────────────────── */
(function fixHeaderBehavior() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  const headerScrollStyle = document.createElement('style');
  headerScrollStyle.textContent = `
    .header.scrolled {
      padding: 1rem 8% !important;
      background: rgba(8, 8, 8, 0.92) !important;
      box-shadow: 0 2px 30px rgba(234, 88, 12, 0.2) !important;
    }
    .navbar a.active-nav {
      color: var(--main-color, #ea580c) !important;
    }
    .navbar a.active-nav::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(headerScrollStyle);
})();


/* ─────────────────────────────────────────────────────────────────
   INIT LOG
───────────────────────────────────────────────────────────────── */
console.log('🚀 JVOR DEV — All fixes applied!');
console.log('  ✅ Typewriter fixed');
console.log('  ✅ About animations fixed');
console.log('  ✅ Gallery lightbox fixed');
console.log('  ✅ Map visibility fixed');
console.log('  ✅ Scroll animations enhanced');
console.log('  ✅ Smooth scroll fixed');
console.log('  ✅ Offline mode + auto-refresh active');
console.log('  ✅ All sections visible');

// ═══════════════════════════════════════════════════════════════════
//  JVOR DEV — MASTER FIX v4.0
//  Fixes: Contact Form, Testimonial Form, Graphs, Icons, All Features
// ═══════════════════════════════════════════════════════════════════

(function jvorMasterFix() {
  'use strict';

  // ─── WAIT FOR DOM ───────────────────────────────────────────────
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ─── UNIVERSAL TOAST ────────────────────────────────────────────
  function showToast(msg, type = 'success', duration = 4000) {
    let toast = document.getElementById('jvor-master-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jvor-master-toast';
      toast.style.cssText = `
        position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(100px);
        padding:14px 28px; border-radius:50px; color:#fff; font-size:1.5rem; font-weight:600;
        display:flex; align-items:center; gap:10px; z-index:999998;
        box-shadow:0 8px 40px rgba(0,0,0,0.5);
        transition:transform 0.5s cubic-bezier(0.34,1.56,.64,1), opacity 0.4s ease; opacity:0;
        font-family:'Poppins',sans-serif; pointer-events:none;
        max-width:90vw; text-align:center;
      `;
      document.body.appendChild(toast);
    }
    const colors = {
      success: 'linear-gradient(135deg,#22c55e,#16a34a)',
      error: 'linear-gradient(135deg,#ef4444,#dc2626)',
      info: 'linear-gradient(135deg,#ea580c,#c2410c)'
    };
    const icons = { success: 'bx-check-circle', error: 'bx-error-circle', info: 'bx-info-circle' };
    toast.style.background = colors[type] || colors.info;
    toast.innerHTML = `<i class='bx ${icons[type] || icons.info}' style="font-size:2rem"></i> ${msg}`;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
    }, duration);
  }

  // ─── INITIALS AVATAR GENERATOR ──────────────────────────────────
  function genAvatar(name) {
    const initials = (name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    let hash = 0;
    for (let i = 0; i < (name || 'U').length; i++) hash = (name || 'U').charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `hsl(${hue},55%,38%)`;
    ctx.beginPath(); ctx.arc(40, 40, 40, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `hsl(${hue},55%,62%)`; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${initials.length > 1 ? 26 : 30}px Arial,sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials, 40, 41);
    return canvas.toDataURL();
  }

  ready(function () {

    // ═══════════════════════════════════════════════════
    //  FIX 1: TESTIMONIAL / REVIEW FORM — FIREBASE v10
    // ═══════════════════════════════════════════════════
    (async function fixReviewForm() {
      const form = document.getElementById('reviewForm');
      if (!form) return;

      // Prevent duplicate submit listeners
      if (form.dataset.jvorFixed) return;
      form.dataset.jvorFixed = '1';

      // Load Firebase lazily
      let db;
      try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        const cfg = {
          apiKey: "AIzaSyC6CN0FDn2lhS6QCflxFWpFFw7AS24WWWs",
          authDomain: "portpolio-jvor.firebaseapp.com",
          projectId: "portpolio-jvor",
          storageBucket: "portpolio-jvor.firebasestorage.app",
          messagingSenderId: "764831263383",
          appId: "1:764831263383:web:e9103eb423db244f5297d2"
        };
        const app = getApps().length ? getApps()[0] : initializeApp(cfg);
        db = getFirestore(app);
        console.log('✅ Firestore connected for review form');
      } catch (e) {
        console.warn('Firestore not available, reviews will show locally only:', e.message);
      }

      // Star picker fix
      const starBtns = form.querySelectorAll('.tr-star-btn');
      const ratingInput = document.getElementById('selectedRating');
      const starHint = document.getElementById('trStarHint');
      const hintMap = { 1: 'Poor', 2: 'Fair — could be better', 3: 'Good work!', 4: 'Very good!', 5: 'Excellent — highly recommend! ⭐' };
      let selectedStars = 0;

      starBtns.forEach((btn, idx) => {
        btn.addEventListener('mouseenter', () => {
          starBtns.forEach((b, i) => b.classList.toggle('lit', i <= idx));
          if (starHint) starHint.textContent = hintMap[idx + 1] || '';
        });
        btn.addEventListener('mouseleave', () => {
          starBtns.forEach((b, i) => b.classList.toggle('lit', i < selectedStars));
          if (starHint) starHint.textContent = selectedStars ? hintMap[selectedStars] : 'Click to rate your experience';
        });
        btn.addEventListener('click', () => {
          selectedStars = idx + 1;
          if (ratingInput) ratingInput.value = selectedStars;
          starBtns.forEach((b, i) => b.classList.toggle('lit', i < selectedStars));
          if (starHint) starHint.textContent = hintMap[selectedStars];
        });
      });

      // Submit handler
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const name = (document.getElementById('reviewerName')?.value || '').trim();
        const email = (document.getElementById('reviewerEmail')?.value || '').trim();
        const company = (document.getElementById('reviewerCompany')?.value || '').trim();
        const text = (document.getElementById('reviewText')?.value || '').trim();
        const rating = parseInt(document.getElementById('selectedRating')?.value || '0');
        const category = document.getElementById('reviewerCategory')?.value || 'other';

        // Validation
        if (!name) { showToast('Pakiusap ilagay ang iyong pangalan! 😊', 'error'); return; }
        if (!email) { showToast('Pakiusap ilagay ang iyong email! 📧', 'error'); return; }
        if (!text) { showToast('Pakiusap isulat ang iyong review! 📝', 'error'); return; }
        if (rating < 1) { showToast('Pumili ng star rating bago mag-submit! ⭐', 'error'); return; }

        // Button loading state
        const btn = document.getElementById('trSubmitBtn');
        const btnContent = btn?.querySelector('.tr-submit-content');
        const btnLoading = btn?.querySelector('.tr-submit-loading');
        if (btn) { btn.disabled = true; }
        if (btnContent) btnContent.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';

        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;
        const avatarData = genAvatar(name);

        const reviewData = { name, email, company, text, rating, category, date: dateStr, avatar: avatarData };

        // Try save to Firestore
        if (db) {
          try {
            const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await addDoc(collection(db, 'reviews'), { ...reviewData, timestamp: serverTimestamp() });
            console.log('✅ Review saved to Firestore!');
          } catch (err) {
            console.warn('Could not save to Firestore:', err.message);
          }
        }

        // Build and inject card
        const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="color:${i < rating ? '#ea580c' : 'rgba(255,255,255,0.15)'}"></i>`).join('');
        const cardHtml = `
          <div class="tr-card" data-category="${category}" style="animation:cardFadeIn 0.6s ease forwards">
            <div class="tr-card-header">
              <div class="tr-card-avatar-wrap">
                <img src="${avatarData}" alt="${name}" class="tr-card-avatar">
                <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
              </div>
              <div class="tr-card-author-info">
                <h4>${name}</h4>
                <span class="tr-card-position">${company || 'Client'}</span>
                <span class="tr-card-company">✅ Verified Review</span>
              </div>
              <div class="tr-card-stars">${starsHtml}</div>
            </div>
            <div class="tr-card-body">
              <span class="tr-card-open-quote">❝</span>
              <p>"${text}"</p>
            </div>
            <div class="tr-card-footer">
              <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${category}</span>
              <span class="tr-card-when">${dateStr}</span>
            </div>
          </div>`;

        const grid = document.getElementById('testiGrid');
        if (grid) {
          grid.insertAdjacentHTML('beforeend', cardHtml);
          // Re-apply active filter
          const activeFilter = document.querySelector('.tr-filter.active');
          if (activeFilter && activeFilter.dataset.cat !== 'all') {
            grid.querySelectorAll('.tr-card').forEach(c => {
              c.classList.toggle('hidden', c.dataset.category !== activeFilter.dataset.cat);
            });
          }
          // Scroll to new card
          setTimeout(() => {
            grid.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 400);
        }

        showToast(`Salamat, ${name}! Na-post na ang iyong review! 🎉`, 'success');

        // Reset form
        form.reset();
        selectedStars = 0;
        if (ratingInput) ratingInput.value = '0';
        starBtns.forEach(b => b.classList.remove('lit'));
        if (starHint) starHint.textContent = 'Click to rate your experience';
        if (btn) btn.disabled = false;
        if (btnContent) btnContent.style.display = 'flex';
        if (btnLoading) btnLoading.style.display = 'none';
      });

      // Load existing reviews from Firestore
      if (db) {
        try {
          const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
          const q = query(collection(db, 'reviews'), orderBy('timestamp', 'asc'));
          const snapshot = await getDocs(q);
          const grid = document.getElementById('testiGrid');
          if (grid && snapshot.size > 0) {
            snapshot.forEach(doc => {
              const r = { id: doc.id, ...doc.data() };
              const name = r.name || 'Anonymous';
              const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="color:${i < (r.rating || 5) ? '#ea580c' : 'rgba(255,255,255,0.15)'}"></i>`).join('');
              const avatarSrc = (r.avatar && r.avatar.startsWith('data:')) ? r.avatar : genAvatar(name);
              const cardHtml = `
                <div class="tr-card" data-category="${r.category || 'other'}">
                  <div class="tr-card-header">
                    <div class="tr-card-avatar-wrap">
                      <img src="${avatarSrc}" alt="${name}" class="tr-card-avatar">
                      <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
                    </div>
                    <div class="tr-card-author-info">
                      <h4>${name}</h4>
                      <span class="tr-card-position">${r.company || r.role || 'Client'}</span>
                      <span class="tr-card-company">✅ Verified Review</span>
                    </div>
                    <div class="tr-card-stars">${starsHtml}</div>
                  </div>
                  <div class="tr-card-body">
                    <span class="tr-card-open-quote">❝</span>
                    <p>"${r.text || ''}"</p>
                  </div>
                  <div class="tr-card-footer">
                    <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${r.category || 'other'}</span>
                    <span class="tr-card-when">${r.date || ''}</span>
                  </div>
                </div>`;
              grid.insertAdjacentHTML('beforeend', cardHtml);
            });
            console.log(`✅ Loaded ${snapshot.size} reviews from Firestore`);
          }
        } catch (err) {
          console.warn('Could not load Firestore reviews:', err.message);
        }
      }
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 2: CONTACT FORM — EMAILJS (SINGLE HANDLER)
    // ═══════════════════════════════════════════════════
    (function fixContactForm() {
      const form = document.getElementById('contactForm');
      const submitBtn = document.getElementById('submitBtn');
      if (!form || form.dataset.contactFixed) return;
      form.dataset.contactFixed = '1';

      const EMAILJS_PK = '_gHT9V4PLtdDkYzou';
      const SERVICE_ID = 'service_mpv0lec';
      const TEMPLATE_ID = 'template_rpzjy36';

      function getField(id) { return document.getElementById(id); }
      const nameEl = getField('cf-name');
      const emailEl = getField('cf-email');
      const subjectEl = getField('cf-subject');
      const msgEl = getField('cf-message');

      function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

      function setFieldState(el, valid) {
        const group = el?.closest('.ct-form-group');
        if (!group) return;
        group.classList.toggle('has-error', !valid);
        group.classList.toggle('is-valid', valid);
        const err = group.querySelector('.ct-field-error');
        if (err) err.classList.toggle('visible', !valid);
      }

      function validateForm() {
        let ok = true;
        if (!nameEl?.value.trim()) { setFieldState(nameEl, false); ok = false; } else setFieldState(nameEl, true);
        if (!isValidEmail(emailEl?.value || '')) { setFieldState(emailEl, false); ok = false; } else setFieldState(emailEl, true);
        if (!subjectEl?.value.trim()) { setFieldState(subjectEl, false); ok = false; } else setFieldState(subjectEl, true);
        if (!msgEl?.value.trim()) { setFieldState(msgEl, false); ok = false; } else setFieldState(msgEl, true);
        return ok;
      }

      // Real-time validation
      [nameEl, emailEl, subjectEl, msgEl].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => {
          const key = el === emailEl ? 'email' : 'other';
          const valid = key === 'email' ? isValidEmail(el.value) : !!el.value.trim();
          setFieldState(el, valid);
        });
      });

      // Character counter
      const charCountEl = document.getElementById('ctCharCount');
      msgEl?.addEventListener('input', () => {
        const len = msgEl.value.length;
        if (charCountEl) {
          charCountEl.textContent = len;
          charCountEl.style.color = len > 900 ? '#ef4444' : len > 700 ? '#f59e0b' : '';
        }
        if (len > 1000) msgEl.value = msgEl.value.slice(0, 1000);
      });

      // Quick select buttons
      document.querySelectorAll('.ct-qs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (subjectEl) { subjectEl.value = btn.dataset.subject; subjectEl.focus(); }
        });
      });

      function setButtonState(state) {
        const def = submitBtn?.querySelector('.ct-submit-default');
        const send = submitBtn?.querySelector('.ct-submit-sending');
        const done = submitBtn?.querySelector('.ct-submit-done');
        if (!def) return;
        def.style.display = state === 'default' ? 'flex' : 'none';
        if (send) send.style.display = state === 'sending' ? 'flex' : 'none';
        if (done) done.style.display = state === 'done' ? 'flex' : 'none';
      }

      function showContactToast(success) {
        const id = success ? 'ct-success-toast' : 'ct-error-toast';
        const t = document.getElementById(id);
        if (!t) return;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 5000);
      }

      // Load EmailJS SDK
      const ejsScript = document.createElement('script');
      ejsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      ejsScript.onload = () => {
        window.emailjs?.init(EMAILJS_PK);
        console.log('✅ EmailJS ready');

        form.addEventListener('submit', async function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();

          if (form.querySelector('[name="ct_honeypot"]')?.value) return;
          if (!validateForm()) { showToast('Pakiusap kumpletuhin ang form! 📝', 'error'); return; }

          setButtonState('sending');
          if (submitBtn) submitBtn.disabled = true;

          try {
            await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
            showContactToast(true);
            showToast('Message sent! Makikipag-ugnayan ako sa iyo agad! 🎉', 'success');
            form.reset();
            if (charCountEl) charCountEl.textContent = '0';
            document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
            [nameEl, emailEl, subjectEl, msgEl].forEach(el => {
              el?.closest('.ct-form-group')?.classList.remove('is-valid', 'has-error');
            });
            setButtonState('done');
            setTimeout(() => setButtonState('default'), 4000);
          } catch (err) {
            console.error('EmailJS error:', err);
            showContactToast(false);
            showToast('May error. Subukan ulit o mag-email direkta! 😢', 'error');
            setButtonState('default');
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      };
      ejsScript.onerror = () => console.error('Could not load EmailJS');
      document.head.appendChild(ejsScript);

      // Toast close buttons
      document.getElementById('ctToastClose')?.addEventListener('click', () => {
        document.getElementById('ct-success-toast')?.classList.remove('show');
      });
      document.getElementById('ctErrToastClose')?.addEventListener('click', () => {
        document.getElementById('ct-error-toast')?.classList.remove('show');
      });

      // Live PHT clock
      function updateCtClock() {
        const el = document.getElementById('ctClockText');
        if (!el) return;
        const now = new Date();
        const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        el.textContent = `${String(pht.getHours()).padStart(2, '0')}:${String(pht.getMinutes()).padStart(2, '0')}:${String(pht.getSeconds()).padStart(2, '0')}`;
      }
      updateCtClock();
      setInterval(updateCtClock, 1000);

      // Copy email button
      document.querySelectorAll('.ct-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(btn.dataset.copy || 'jvrocta@gmail.com');
            const icon = btn.querySelector('i');
            const orig = icon?.className;
            if (icon) icon.className = 'bx bx-check';
            btn.classList.add('copied');
            setTimeout(() => {
              if (icon && orig) icon.className = orig;
              btn.classList.remove('copied');
            }, 2000);
            showToast('Email copied! 📋', 'success', 2000);
          } catch (_) { }
        });
      });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 3: RADAR CHART — stop infinite loop
    // ═══════════════════════════════════════════════════
    (function fixRadarChart() {
      const canvas = document.getElementById('radarChart');
      if (!canvas || canvas.dataset.radarFixed) return;
      canvas.dataset.radarFixed = '1';

      const ctx = canvas.getContext('2d');
      const skills = [
        { label: 'HTML/CSS', value: 0.95 },
        { label: 'JavaScript', value: 0.85 },
        { label: 'UI/UX', value: 0.88 },
        { label: 'React', value: 0.78 },
        { label: 'Node.js', value: 0.70 },
        { label: 'Video', value: 0.90 },
      ];

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.min(cx, cy) - 55;
      const total = skills.length;
      const levels = 5;
      let animProg = 0;
      let hovered = -1;
      let rafId = null;
      let isFullyAnimated = false;

      function angleFor(i) { return (Math.PI * 2 * i / total) - Math.PI / 2; }
      function pt(i, r) {
        const a = angleFor(i);
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      }

      function draw(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = !document.body.classList.contains('light-mode');
        const gridC = isDark ? 'rgba(234,88,12,0.12)' : 'rgba(234,88,12,0.2)';
        const webC = isDark ? 'rgba(16,16,16,0.6)' : 'rgba(240,240,240,0.6)';
        const lineC = isDark ? 'rgba(234,88,12,0.2)' : 'rgba(234,88,12,0.3)';
        const lblC = isDark ? '#e5e7eb' : '#333';

        // Level rings
        for (let l = 1; l <= levels; l++) {
          const r = (l / levels) * maxR;
          ctx.beginPath();
          for (let i = 0; i < total; i++) {
            const p = pt(i, r);
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.strokeStyle = gridC; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = webC; ctx.fill();
        }

        // Axis lines
        for (let i = 0; i < total; i++) {
          const p = pt(i, maxR);
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = lineC; ctx.lineWidth = 1; ctx.stroke();
        }

        // Skill polygon
        ctx.beginPath();
        for (let i = 0; i < total; i++) {
          const animR = skills[i].value * maxR * Math.min(progress * 1.4, 1);
          const p = pt(i, animR);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(234,88,12,0.4)');
        grad.addColorStop(1, 'rgba(234,88,12,0.08)');
        ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle = 'rgba(234,88,12,0.9)'; ctx.lineWidth = 2.5;
        ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(234,88,12,0.6)';
        ctx.stroke(); ctx.shadowBlur = 0;

        // Dots + hover label
        for (let i = 0; i < total; i++) {
          const animR = skills[i].value * maxR * Math.min(progress * 1.4, 1);
          const p = pt(i, animR);
          const isHov = hovered === i;
          ctx.beginPath(); ctx.arc(p.x, p.y, isHov ? 9 : 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(234,88,12,1)';
          ctx.shadowBlur = isHov ? 22 : 10; ctx.shadowColor = 'rgba(234,88,12,0.9)';
          ctx.fill(); ctx.shadowBlur = 0;
          if (isHov) {
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Poppins,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(Math.round(skills[i].value * 100) + '%', p.x, p.y - 12);
          }
        }

        // Labels
        for (let i = 0; i < total; i++) {
          const lp = pt(i, maxR + 28);
          ctx.font = hovered === i ? 'bold 13px Poppins,sans-serif' : '12px Poppins,sans-serif';
          ctx.fillStyle = hovered === i ? '#ea580c' : lblC;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(skills[i].label, lp.x, lp.y);
        }
      }

      function animate() {
        if (animProg < 1) {
          animProg = Math.min(animProg + 0.025, 1);
          draw(animProg);
          if (animProg < 1) {
            rafId = requestAnimationFrame(animate);
          } else {
            isFullyAnimated = true;
            draw(1); // Final static draw
          }
        }
      }

      // Hover (only redraw if fully animated)
      canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        let found = -1;
        for (let i = 0; i < total; i++) {
          const p = pt(i, skills[i].value * maxR);
          if (Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2) < 22) { found = i; break; }
        }
        if (found !== hovered) { hovered = found; if (isFullyAnimated) draw(1); }
      });
      canvas.addEventListener('mouseleave', () => {
        hovered = -1; if (isFullyAnimated) draw(1);
      });

      // Start when visible
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          animProg = 0; isFullyAnimated = false;
          if (rafId) cancelAnimationFrame(rafId);
          animate();
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(canvas);
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 4: TESTIMONIAL FILTER TABS
    // ═══════════════════════════════════════════════════
    (function fixTestiTabs() {
      const filters = document.querySelectorAll('.tr-filter');
      if (!filters.length || document.querySelector('.tr-filter[data-testi-fixed]')) return;
      filters.forEach(f => f.dataset.testiFixed = '1');

      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          filters.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          document.querySelectorAll('#testiGrid .tr-card').forEach(card => {
            const show = cat === 'all' || card.dataset.category === cat;
            card.classList.toggle('hidden', !show);
            if (show) card.style.animation = 'none', requestAnimationFrame(() => { card.style.animation = 'cardFadeIn 0.45s ease forwards'; });
          });
        });
      });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 5: RATING BARS IN TESTIMONIALS SECTION
    // ═══════════════════════════════════════════════════
    (function fixRatingBars() {
      const bars = document.querySelectorAll('.tr-bar-f');
      if (!bars.length) return;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const w = entry.target.dataset.w || '0';
            setTimeout(() => { entry.target.style.width = w + '%'; }, 150);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      bars.forEach(b => {
        b.style.width = '0%';
        b.style.transition = 'width 1s cubic-bezier(0.23,1,0.32,1)';
        obs.observe(b);
      });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 6: ALL SKILL PROGRESS BARS
    // ═══════════════════════════════════════════════════
    (function fixAllProgressBars() {
      function animBar(selector, attr) {
        document.querySelectorAll(selector).forEach(el => {
          const target = el.getAttribute(attr) || el.dataset.w || el.dataset.width || '0';
          el.style.width = '0%';
          el.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)';
          const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              setTimeout(() => { el.style.width = target + '%'; }, 200);
              obs.disconnect();
            }
          }, { threshold: 0.2 });
          obs.observe(el);
        });
      }
      animBar('.ts-meter-fill', 'data-w');
      animBar('.ts-prof-fill', 'data-w');
      animBar('.lv2-fill', 'data-w');
      animBar('.asp-bar-fill', 'data-width');
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 7: ANIMATED COUNTERS (prof pct)
    // ═══════════════════════════════════════════════════
    (function fixProfCounters() {
      const items = document.querySelectorAll('.ts-prof-item:not([data-prof-fixed])');
      items.forEach(item => {
        item.dataset.profFixed = '1';
        const fill = item.querySelector('.ts-prof-fill');
        const pct = item.querySelector('.ts-prof-pct');
        const w = parseInt(fill?.dataset.w || '0');
        const obs = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) return;
          if (fill) { fill.style.transition = 'width 1.2s cubic-bezier(0.23,1,0.32,1)'; setTimeout(() => fill.style.width = w + '%', 200); }
          if (pct) {
            let cur = 0;
            const step = () => {
              cur += 2; if (cur > w) cur = w;
              pct.textContent = cur + '%';
              pct.dataset.target = w; // Fix display from "0%"
              if (cur < w) requestAnimationFrame(step);
            };
            setTimeout(step, 300);
          }
          obs.disconnect();
        }, { threshold: 0.3 });
        obs.observe(item);
      });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 8: HIRE ME MODAL
    // ═══════════════════════════════════════════════════
    (function fixHireModal() {
      const modal = document.getElementById('hireMeModal');
      const openBtn = document.getElementById('openHireModal');
      const closeBtn = document.getElementById('closeHireModal');
      const backdrop = modal?.querySelector('.hm-backdrop');
      const toast = document.getElementById('hmCopyToast');
      if (!modal || !openBtn || modal.dataset.hmFixed) return;
      modal.dataset.hmFixed = '1';

      const open = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
      const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };

      openBtn.addEventListener('click', open);
      closeBtn?.addEventListener('click', close);
      backdrop?.addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
      document.getElementById('hm-go-contact')?.addEventListener('click', close);

      // Copy email
      modal.querySelectorAll('.hm-copy-email').forEach(btn => {
        btn.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(btn.dataset.email || 'jvrocta@gmail.com'); }
          catch {
            const ta = document.createElement('textarea');
            ta.value = btn.dataset.email || 'jvrocta@gmail.com';
            ta.style = 'position:fixed;opacity:0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); ta.remove();
          }
          const actionEl = btn.querySelector('.hm-cb-action');
          if (actionEl) {
            actionEl.innerHTML = '<i class="bx bx-check"></i><span>Copied!</span>';
            actionEl.style.color = '#4ade80';
            setTimeout(() => { actionEl.innerHTML = '<i class="bx bx-copy"></i><span>Copy</span>'; actionEl.style.color = ''; }, 2200);
          }
          if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); }
        });
      });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 9: MAP CLOCKS (HUD + Badge)
    // ═══════════════════════════════════════════════════
    (function fixMapClocks() {
      function updateMapTime() {
        const now = new Date();
        const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        const h = String(pht.getHours()).padStart(2, '0');
        const m = String(pht.getMinutes()).padStart(2, '0');
        const s = String(pht.getSeconds()).padStart(2, '0');
        const hudClock = document.getElementById('advHudClock');
        const mapClock = document.getElementById('advMapClock');
        if (hudClock) hudClock.textContent = `${h}:${m}:${s}`;
        if (mapClock) mapClock.textContent = `${h}:${m} PHT`;
      }
      updateMapTime();
      setInterval(updateMapTime, 1000);

      // Map style switcher
      const iframe = document.getElementById('advMapIframe');
      const btnSt = document.getElementById('advMapStreet');
      const btnSat = document.getElementById('advMapSat');
      const STREET = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e0!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";
      const SAT = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e1!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";

      if (btnSt && iframe && !btnSt.dataset.mapFixed) {
        btnSt.dataset.mapFixed = '1';
        btnSt.addEventListener('click', () => { iframe.src = STREET; iframe.style.filter = 'saturate(0.75) contrast(1.1) brightness(0.9)'; btnSt.classList.add('adv-ctrl-active'); btnSat?.classList.remove('adv-ctrl-active'); });
        btnSat?.addEventListener('click', () => { iframe.src = SAT; iframe.style.filter = 'saturate(0.6) contrast(1.15) brightness(0.85)'; btnSat.classList.add('adv-ctrl-active'); btnSt.classList.remove('adv-ctrl-active'); });
      }
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 10: FOOTER SCROLL TO TOP
    // ═══════════════════════════════════════════════════
    (function fixFooter() {
      const btn = document.getElementById('ftScrollTop');
      if (btn && !btn.dataset.ftFixed) {
        btn.dataset.ftFixed = '1';
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      }
      // Year
      document.querySelectorAll('.ft-year-display').forEach(el => { el.textContent = `©${new Date().getFullYear()}`; });
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 11: GLOBAL SMOOTH SCROLL
    // ═══════════════════════════════════════════════════
    (function fixSmoothScroll() {
      if (document.documentElement.dataset.smoothFixed) return;
      document.documentElement.dataset.smoothFixed = '1';
      document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = (document.querySelector('.header')?.offsetHeight || 80) + 20;
        window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: 'smooth' });
        // Close mobile menu if open
        document.querySelector('.navbar')?.classList.remove('active');
        document.getElementById('menu-icon')?.classList.remove('bx-x');
      }, true);
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 12: ORBIT ICONS VISIBILITY
    // ═══════════════════════════════════════════════════
    (function fixOrbitIcons() {
      const orbitStyle = document.createElement('style');
      orbitStyle.textContent = `
        .orbit-icons i { opacity: 1 !important; visibility: visible !important; }
        .orbit-container { position: relative; display: inline-block; }
      `;
      document.head.appendChild(orbitStyle);
    })();

    // ═══════════════════════════════════════════════════
    //  FIX 13: ENSURE ICONS LOAD (fallback re-trigger)
    // ═══════════════════════════════════════════════════
    (function ensureIcons() {
      // If boxicons not loaded, reload
      const testIcon = document.querySelector('.bx');
      if (!testIcon) return;
      const computed = window.getComputedStyle(testIcon, ':before').content;
      if (!computed || computed === 'none' || computed === '') {
        console.warn('Boxicons may not have loaded, retrying...');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/boxicons@latest/css/boxicons.min.css';
        document.head.appendChild(link);
      }
    })();

    console.log('🔥 JVOR DEV — Master Fix v4.0 applied! All systems working!');

  }); // end ready()

})();
/* ═══════════════════════════════════════════════════════════════════
   JVOR DEV — FINAL MASTER FIX v5.0
   Orbit Counter-Rotate • Testimonials • Contact EmailJS • Loading
═══════════════════════════════════════════════════════════════════ */

(function jvorFinalFix() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ── Universal toast ──
  function showToast(msg, type, dur) {
    type = type || 'success'; dur = dur || 4000;
    let t = document.getElementById('jvor-toast-v5');
    if (!t) {
      t = document.createElement('div');
      t.id = 'jvor-toast-v5';
      t.style.cssText = [
        'position:fixed', 'bottom:32px', 'left:50%',
        'transform:translateX(-50%) translateY(100px)',
        'padding:14px 28px', 'border-radius:50px', 'color:#fff',
        'font-size:1.5rem', 'font-weight:700', 'z-index:999998',
        'display:flex', 'align-items:center', 'gap:10px',
        'transition:transform 0.5s cubic-bezier(0.34,1.56,.64,1),opacity 0.4s ease',
        'opacity:0', 'font-family:Poppins,sans-serif',
        'box-shadow:0 8px 40px rgba(0,0,0,0.5)',
        'max-width:90vw', 'pointer-events:none'
      ].join(';');
      document.body.appendChild(t);
    }
    const bg = { success: 'linear-gradient(135deg,#22c55e,#16a34a)', error: 'linear-gradient(135deg,#ef4444,#dc2626)', info: 'linear-gradient(135deg,#ea580c,#c2410c)' };
    const ic = { success: 'bx-check-circle', error: 'bx-error-circle', info: 'bx-info-circle' };
    t.style.background = bg[type] || bg.info;
    t.innerHTML = `<i class='bx ${ic[type] || ic.info}' style="font-size:2rem"></i>${msg}`;
    requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) translateY(0)'; t.style.opacity = '1'; });
    clearTimeout(t._tmr);
    t._tmr = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(100px)'; t.style.opacity = '0'; }, dur);
  }

  ready(function () {

    // ═══════════════════════════════════════════════════
    //  1. ORBIT ICONS — JS-driven counter-rotate
    //     Keeps icons upright while the ring spins
    // ═══════════════════════════════════════════════════
    (function initOrbit() {
      const ring = document.getElementById('orbitRing') || document.querySelector('.orbit-icons');
      if (!ring || ring.dataset.orbitInit) return;
      ring.dataset.orbitInit = '1';

      const icons = ring.querySelectorAll('i');
      const n = icons.length;
      const RADIUS = 210; // px from center — tuned to container size
      const SPEED = 0.4; // degrees per frame (slower = smoother)
      let angle = 0;

      // Position icons perfectly on the circle
      function positionIcons(rot) {
        icons.forEach((icon, i) => {
          const deg = (360 / n) * i + rot;
          const rad = (deg * Math.PI) / 180;
          const cx = Math.cos(rad) * RADIUS;
          const cy = Math.sin(rad) * RADIUS;
          icon.style.left = `calc(50% + ${cx}px - 27px)`;
          icon.style.top = `calc(50% + ${cy}px - 27px)`;
          icon.style.transform = `rotate(${-rot}deg)`; // counter-rotate = stays upright
          icon.style.position = 'absolute';
          icon.style.animation = 'none'; // override CSS animation for position
        });
      }

      function tick() {
        angle = (angle + SPEED) % 360;
        positionIcons(angle);
        requestAnimationFrame(tick);
      }

      // Initial position then start loop
      positionIcons(0);
      requestAnimationFrame(tick);

      // Hover: pause ring via CSS var trick
      ring.addEventListener('mouseenter', () => { ring.style.animationPlayState = 'paused'; });
      ring.addEventListener('mouseleave', () => { ring.style.animationPlayState = 'running'; });
    })();

    // ═══════════════════════════════════════════════════
    //  2. TESTIMONIAL REVIEW FORM — Firebase + Live card
    // ═══════════════════════════════════════════════════
    (async function initReviewForm() {
      const form = document.getElementById('reviewForm');
      if (!form || form.dataset.v5Fixed) return;
      form.dataset.v5Fixed = '1';

      // Avatar generator
      function genAvatar(name) {
        const initials = (name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        let hash = 0;
        for (let c of (name || 'U')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
        const hue = Math.abs(hash) % 360;
        const cv = document.createElement('canvas');
        cv.width = cv.height = 80;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = `hsl(${hue},55%,38%)`;
        ctx.beginPath(); ctx.arc(40, 40, 40, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `hsl(${hue},55%,62%)`; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${initials.length > 1 ? 26 : 30}px Arial,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(initials, 40, 41);
        return cv.toDataURL();
      }

      // Star picker
      const starBtns = form.querySelectorAll('.tr-star-btn');
      const ratingInp = document.getElementById('selectedRating');
      const starHint = document.getElementById('trStarHint');
      const hintMap = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good!', 5: 'Excellent ⭐' };
      let picked = 0;

      starBtns.forEach((btn, i) => {
        btn.addEventListener('mouseenter', () => {
          starBtns.forEach((b, j) => b.classList.toggle('lit', j <= i));
          if (starHint) starHint.textContent = hintMap[i + 1] || '';
        });
        btn.addEventListener('mouseleave', () => {
          starBtns.forEach((b, j) => b.classList.toggle('lit', j < picked));
          if (starHint) starHint.textContent = picked ? hintMap[picked] : 'Click to rate';
        });
        btn.addEventListener('click', () => {
          picked = i + 1;
          if (ratingInp) ratingInp.value = picked;
          starBtns.forEach((b, j) => b.classList.toggle('lit', j < picked));
          if (starHint) starHint.textContent = hintMap[picked];
        });
      });

      // Firebase
      let db = null;
      try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        const cfg = {
          apiKey: "AIzaSyC6CN0FDn2lhS6QCflxFWpFFw7AS24WWWs",
          authDomain: "portpolio-jvor.firebaseapp.com",
          projectId: "portpolio-jvor",
          storageBucket: "portpolio-jvor.firebasestorage.app",
          messagingSenderId: "764831263383",
          appId: "1:764831263383:web:e9103eb423db244f5297d2"
        };
        const app = getApps().length ? getApps()[0] : initializeApp(cfg);
        db = getFirestore(app);
        console.log('✅ Firestore ready');

        // Load existing reviews
        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        const snap = await getDocs(query(collection(db, 'reviews'), orderBy('timestamp', 'asc')));
        const grid = document.getElementById('testiGrid');
        if (grid && snap.size > 0) {
          snap.forEach(doc => {
            const r = doc.data();
            injectCard(r.name || 'Anonymous', r.company || 'Client', r.text || '', r.rating || 5, r.category || 'other', r.date || '', r.avatar ? r.avatar : genAvatar(r.name || 'U'));
          });
        }
      } catch (e) { console.warn('Firestore:', e.message); }

      function injectCard(name, company, text, rating, category, date, avatar) {
        const grid = document.getElementById('testiGrid');
        if (!grid) return;
        const stars = Array.from({ length: 5 }, (_, i) => `<i class='bx bxs-star' style="color:${i < rating ? '#ea580c' : 'rgba(255,255,255,0.12)'}"></i>`).join('');
        grid.insertAdjacentHTML('beforeend', `
          <div class="tr-card" data-category="${category}" style="animation:cardFadeIn .6s ease forwards">
            <div class="tr-card-header">
              <div class="tr-card-avatar-wrap">
                <img src="${avatar}" alt="${name}" class="tr-card-avatar">
                <span class="tr-card-verified"><i class='bx bxs-badge-check'></i></span>
              </div>
              <div class="tr-card-author-info">
                <h4>${name}</h4>
                <span class="tr-card-position">${company}</span>
                <span class="tr-card-company">✅ Verified</span>
              </div>
              <div class="tr-card-stars">${stars}</div>
            </div>
            <div class="tr-card-body">
              <span class="tr-card-open-quote">❝</span>
              <p>"${text}"</p>
            </div>
            <div class="tr-card-footer">
              <span class="tr-card-type"><i class='bx bx-briefcase'></i> ${category}</span>
              <span class="tr-card-when">${date}</span>
            </div>
          </div>`);
      }

      // Submit
      form.addEventListener('submit', async function (e) {
        e.preventDefault(); e.stopImmediatePropagation();
        const name = (document.getElementById('reviewerName')?.value || '').trim();
        const email = (document.getElementById('reviewerEmail')?.value || '').trim();
        const company = (document.getElementById('reviewerCompany')?.value || '').trim();
        const text = (document.getElementById('reviewText')?.value || '').trim();
        const rating = parseInt(document.getElementById('selectedRating')?.value || '0');
        const category = document.getElementById('reviewerCategory')?.value || 'other';

        if (!name) { showToast('Ilagay ang iyong pangalan! 😊', 'error'); return; }
        if (!email) { showToast('Ilagay ang iyong email! 📧', 'error'); return; }
        if (!text) { showToast('Isulat ang iyong review! 📝', 'error'); return; }
        if (rating < 1) { showToast('Pumili ng star rating! ⭐', 'error'); return; }

        const btn = document.getElementById('trSubmitBtn');
        const bc = btn?.querySelector('.tr-submit-content');
        const bl = btn?.querySelector('.tr-submit-loading');
        if (btn) btn.disabled = true;
        if (bc) bc.style.display = 'none';
        if (bl) bl.style.display = 'flex';

        const now = new Date();
        const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = `${mo[now.getMonth()]} ${now.getFullYear()}`;
        const avatar = genAvatar(name);

        if (db) {
          try {
            const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            await addDoc(collection(db, 'reviews'), { name, email, company, text, rating, category, date, avatar, timestamp: serverTimestamp() });
          } catch (err) { console.warn('Save error:', err.message); }
        }

        injectCard(name, company, text, rating, category, date, avatar);
        // Re-apply active filter
        const activeFilter = document.querySelector('.tr-filter.active');
        if (activeFilter && activeFilter.dataset.cat !== 'all') {
          document.querySelectorAll('#testiGrid .tr-card').forEach(c => {
            c.classList.toggle('hidden', c.dataset.category !== activeFilter.dataset.cat);
          });
        }
        // Scroll to new card
        setTimeout(() => document.getElementById('testiGrid')?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 400);

        showToast(`Salamat, ${name}! Live na ang iyong review! 🎉`, 'success');
        form.reset(); picked = 0;
        if (ratingInp) ratingInp.value = '0';
        starBtns.forEach(b => b.classList.remove('lit'));
        if (starHint) starHint.textContent = 'Click to rate your experience';
        if (btn) btn.disabled = false;
        if (bc) bc.style.display = 'flex';
        if (bl) bl.style.display = 'none';
      });
    })();

    // ═══════════════════════════════════════════════════
    //  3. TESTIMONIAL FILTER TABS
    // ═══════════════════════════════════════════════════
    (function initTestiFilter() {
      const filters = document.querySelectorAll('.tr-filter');
      if (!filters.length || document.querySelector('.tr-filter[data-v5]')) return;
      filters.forEach(f => f.dataset.v5 = '1');
      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          filters.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          document.querySelectorAll('#testiGrid .tr-card').forEach(card => {
            const show = cat === 'all' || card.dataset.category === cat;
            card.classList.toggle('hidden', !show);
            if (show) { card.style.animation = 'none'; requestAnimationFrame(() => { card.style.animation = 'cardFadeIn 0.45s ease forwards'; }); }
          });
        });
      });
    })();

    // ═══════════════════════════════════════════════════
    //  4. CONTACT FORM — EMAILJS (single clean handler)
    // ═══════════════════════════════════════════════════
    (function initContactForm() {
      const form = document.getElementById('contactForm');
      const submitBtn = document.getElementById('submitBtn');
      if (!form || form.dataset.v5Fixed) return;
      form.dataset.v5Fixed = '1';

      const EJSPK = '_gHT9V4PLtdDkYzou';
      const SVCID = 'service_mpv0lec';
      const TPLID = 'template_rpzjy36';

      function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

      function setField(el, valid) {
        const g = el?.closest('.ct-form-group');
        if (!g) return;
        g.classList.toggle('has-error', !valid);
        g.classList.toggle('is-valid', valid);
        g.querySelector('.ct-field-error')?.classList.toggle('visible', !valid);
        el.style.borderColor = valid ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.5)';
      }

      function validate() {
        const n = document.getElementById('cf-name');
        const em = document.getElementById('cf-email');
        const s = document.getElementById('cf-subject');
        const m = document.getElementById('cf-message');
        let ok = true;
        if (!n?.value.trim()) { setField(n, false); ok = false; } else setField(n, true);
        if (!isEmail(em?.value || '')) { setField(em, false); ok = false; } else setField(em, true);
        if (!s?.value.trim()) { setField(s, false); ok = false; } else setField(s, true);
        if (!m?.value.trim()) { setField(m, false); ok = false; } else setField(m, true);
        return ok;
      }

      // Live validation
      ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
          const valid = id === 'cf-email' ? isEmail(el.value) : !!el.value.trim();
          setField(el, valid);
        });
      });

      // Char counter
      const msgEl = document.getElementById('cf-message');
      const ccEl = document.getElementById('ctCharCount');
      msgEl?.addEventListener('input', () => {
        if (ccEl) { ccEl.textContent = msgEl.value.length; ccEl.style.color = msgEl.value.length > 900 ? '#ef4444' : ''; }
        if (msgEl.value.length > 1000) msgEl.value = msgEl.value.slice(0, 1000);
      });

      // Quick select
      document.querySelectorAll('.ct-qs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const s = document.getElementById('cf-subject');
          if (s) { s.value = btn.dataset.subject; setField(s, true); s.focus(); }
        });
      });

      // Copy email
      document.querySelectorAll('.ct-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(btn.dataset.copy || 'jvrocta@gmail.com'); }
          catch { const ta = document.createElement('textarea'); ta.value = btn.dataset.copy || ''; ta.style = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
          const icon = btn.querySelector('i'); const orig = icon?.className;
          if (icon) icon.className = 'bx bx-check';
          btn.title = 'Copied!';
          setTimeout(() => { if (icon && orig) icon.className = orig; btn.title = 'Copy email'; }, 2000);
          showToast('Email copied! 📋', 'success', 2000);
        });
      });

      // Toast system
      function showCtToast(ok) {
        const id = ok ? 'ct-success-toast' : 'ct-error-toast';
        const t = document.getElementById(id);
        if (!t) return;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 5000);
      }
      document.getElementById('ctToastClose')?.addEventListener('click', () => document.getElementById('ct-success-toast')?.classList.remove('show'));
      document.getElementById('ctErrToastClose')?.addEventListener('click', () => document.getElementById('ct-error-toast')?.classList.remove('show'));

      // Button state
      function setBtn(state) {
        const d = submitBtn?.querySelector('.ct-submit-default');
        const s = submitBtn?.querySelector('.ct-submit-sending');
        const dn = submitBtn?.querySelector('.ct-submit-done');
        if (!d) return;
        d.style.display = state === 'default' ? 'flex' : 'none';
        if (s) s.style.display = state === 'sending' ? 'flex' : 'none';
        if (dn) dn.style.display = state === 'done' ? 'flex' : 'none';
      }

      // Load EmailJS
      if (!window.emailjsLoaded) {
        window.emailjsLoaded = true;
        const sc = document.createElement('script');
        sc.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        sc.onload = () => { window.emailjs?.init(EJSPK); attachSubmit(); };
        sc.onerror = () => console.error('EmailJS SDK failed');
        document.head.appendChild(sc);
      } else { attachSubmit(); }

      function attachSubmit() {
        form.addEventListener('submit', async function (e) {
          e.preventDefault(); e.stopImmediatePropagation();
          if (form.querySelector('[name="ct_honeypot"]')?.value) return;
          if (!validate()) { showToast('Kumpletuhin ang form! 📝', 'error'); return; }
          setBtn('sending'); if (submitBtn) submitBtn.disabled = true;
          try {
            await window.emailjs.sendForm(SVCID, TPLID, form);
            showCtToast(true);
            showToast('Message sent! 🎉 Mag-rerespond agad ako!', 'success', 6000);
            form.reset();
            if (ccEl) ccEl.textContent = '0';
            document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
            ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
              document.getElementById(id)?.closest('.ct-form-group')?.classList.remove('is-valid', 'has-error');
            });
            setBtn('done'); setTimeout(() => setBtn('default'), 4000);
          } catch (err) {
            console.error('EmailJS error:', err);
            showCtToast(false);
            showToast('May error. Subukan ulit! 😢', 'error');
            setBtn('default');
          } finally { if (submitBtn) submitBtn.disabled = false; }
        });
      }
    })();

    // ═══════════════════════════════════════════════════
    //  5. RATING BARS + ALL SKILL BARS ON SCROLL
    // ═══════════════════════════════════════════════════
    (function initAllBars() {
      function animateBar(el, target) {
        el.style.width = '0%';
        el.style.transition = 'width 1.3s cubic-bezier(0.23,1,0.32,1)';
        const obs = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) { setTimeout(() => { el.style.width = target + '%'; }, 150); obs.disconnect(); }
        }, { threshold: 0.2 });
        obs.observe(el);
      }
      document.querySelectorAll('.tr-bar-f[data-w]').forEach(el => animateBar(el, el.dataset.w));
      document.querySelectorAll('.ts-meter-fill[data-w]').forEach(el => animateBar(el, el.dataset.w));
      document.querySelectorAll('.ts-prof-fill[data-w]').forEach(el => animateBar(el, el.dataset.w));
      document.querySelectorAll('.lv2-fill[data-w]').forEach(el => animateBar(el, el.dataset.w));
      document.querySelectorAll('.asp-bar-fill[data-width]').forEach(el => animateBar(el, el.dataset.width));
    })();

    // ═══════════════════════════════════════════════════
    //  6. PHT LIVE CLOCK (Contact + Map)
    // ═══════════════════════════════════════════════════
    (function initClocks() {
      function tick() {
        const now = new Date();
        const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        const hh = String(pht.getHours()).padStart(2, '0');
        const mm = String(pht.getMinutes()).padStart(2, '0');
        const ss = String(pht.getSeconds()).padStart(2, '0');
        const el = document.getElementById('ctClockText');
        const hudEl = document.getElementById('advHudClock');
        const mapEl = document.getElementById('advMapClock');
        if (el) el.textContent = `${hh}:${mm}:${ss}`;
        if (hudEl) hudEl.textContent = `${hh}:${mm}:${ss}`;
        if (mapEl) mapEl.textContent = `${hh}:${mm} PHT`;
      }
      tick(); setInterval(tick, 1000);
    })();

    // ═══════════════════════════════════════════════════
    //  7. GLOBAL SMOOTH SCROLL
    // ═══════════════════════════════════════════════════
    if (!document.documentElement.dataset.v5Scroll) {
      document.documentElement.dataset.v5Scroll = '1';
      document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = (document.querySelector('.header')?.offsetHeight || 80) + 20;
        window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: 'smooth' });
        document.querySelector('.navbar')?.classList.remove('active');
        document.getElementById('menu-icon')?.classList.remove('bx-x');
      }, true);
    }

    console.log('🚀 JVOR DEV v5.0 — All systems GO!');
  }); // end ready

})();