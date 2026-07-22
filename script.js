/**
 * ============================================================================
 *  ROMANTIC INTERACTIVE WEBSITE — MAIN SCRIPT
 * ============================================================================
 *
 *  This file handles all interactions, animations, and transitions.
 *  Edit the CONFIG object below to customize everything easily.
 *
 * ============================================================================
 */

// ============================================
// CUSTOMIZATION — Edit these values!
// ============================================
const CONFIG = {
  // CUSTOMIZATION: Change the partner's name
  partnerName: "Lily",

  // CUSTOMIZATION: Change the celebration messages
  celebrationMessages: [
    "Besties for life, no refunds! 🎉",
    "Happy Birthday, Lily 🎂🌸",
  ],

  // CUSTOMIZATION: Path to your background music file
  musicFilePath: "assets/music/romantic.mp3",

  // CUSTOMIZATION: Funny messages when "No" is clicked
  funnyMessages: [
    "Are you sure?? 🥺",
    "Think again bestie! 💛",
    "That's illegal. 😤",
    "Wrong answer! 😤",
    "You clicked the wrong button.",
    "Nope, try again! ✨",
    "Not an option bestie! 🚫",
    "My friendship says no to your no 🫶",
    "The button is running away! 🏃",
    "Almost impossible now! 😏",
  ],

  // Heart emoji pool for floating particles
  heartEmojis: ["❤️", "💕", "💗", "💖", "💝", "🩷"],

  // Lily flower colors (All white per request)
  lilyColors: ["#ffffff"],

  // Timing (milliseconds)
  timings: {
    subtitleDelay: 1200,     // When subtitle appears
    questionDelay: 2400,     // When question appears
    buttonsDelay: 3200,      // When buttons appear
    typingSpeed: 55,         // ms per character
    messageGap: 2000,        // Pause between celebration messages
    lilyDelay: 1500,         // Delay before lily bloom
    celebrationTotal: 14000, // Total time before going to memories
    pageTransition: 800,     // Fade transition duration
  },
};


// ============================================
// GLOBAL STATE
// ============================================
let noClickCount = 0;
let isMobile = window.innerWidth <= 768;
let heartsAnimationId = null;
let sparkleInterval = null;

// Cached DOM references (set on DOMContentLoaded)
let DOM = {};


// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Cache all DOM elements
  DOM = {
    pageQuestion:    document.getElementById("page-question"),
    pageCelebration: document.getElementById("page-celebration"),
    pageLetter:      document.getElementById("page-letter"),
    pageMemories:    document.getElementById("page-memories"),
    pageCake:        document.getElementById("page-cake"),
    btnYes:          document.getElementById("btn-yes"),
    btnNo:           document.getElementById("btn-no"),
    envelopeWrapper: document.getElementById("envelope-wrapper"),
    btnMemoriesBack: document.getElementById("btn-memories-back"),
    btnMemoriesNext: document.getElementById("btn-memories-next"),
    letterParticles: document.getElementById("letter-particles"),
    funnyMessage:    document.getElementById("funny-message"),
    questionText:    document.getElementById("question-text"),
    subtitle:        document.getElementById("subtitle"),
    celebrationText: document.getElementById("celebration-text"),
    heartsContainer: document.getElementById("hearts-container"),
    celebrationHearts: document.getElementById("celebration-hearts"),
    sparklesContainer: document.getElementById("sparkles-container"),
    liliesContainer: document.getElementById("lilies-container"),
    particlesContainer: document.getElementById("particles-container"),
    bgMusic:         document.getElementById("bg-music"),
    polaroids:       document.querySelectorAll(".polaroid"),
    buttonsContainer: document.querySelector(".buttons-container"),
  };

  setupPageQuestion();
  setupEventListeners();
  startFloatingHearts();

  // Handle resize for mobile detection
  window.addEventListener("resize", debounce(() => {
    isMobile = window.innerWidth <= 768;
  }, 300));
});


// ============================================
// PAGE 1 — QUESTION SETUP
// ============================================
function setupPageQuestion() {
  // Staggered text reveal
  setTimeout(() => {
    DOM.subtitle?.classList.add("visible");
  }, CONFIG.timings.subtitleDelay);

  setTimeout(() => {
    DOM.questionText?.classList.add("visible");
  }, CONFIG.timings.questionDelay);

  setTimeout(() => {
    DOM.buttonsContainer?.classList.add("visible");
  }, CONFIG.timings.buttonsDelay);
}


// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Yes button
  DOM.btnYes?.addEventListener("click", handleYesClick);

  // No button — both click and touch
  DOM.btnNo?.addEventListener("click", (e) => {
    e.preventDefault();
    handleNoClick();
  });
  DOM.btnNo?.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleNoClick();
  }, { passive: false });

  // Polaroid hover/touch effects
  DOM.polaroids.forEach((polaroid) => {
    polaroid.addEventListener("mouseenter", () => spawnPolaroidHearts(polaroid));
    polaroid.addEventListener("touchstart", () => {
      polaroid.classList.add("touched");
      spawnPolaroidHearts(polaroid);
      setTimeout(() => polaroid.classList.remove("touched"), 600);
    }, { passive: true });
  });

  // Envelope interactions
  DOM.envelopeWrapper?.addEventListener("click", () => {
    if (DOM.envelopeWrapper.classList.contains("open")) return;
    
    DOM.envelopeWrapper.classList.add("open");
    
    // Tiny confetti burst from envelope
    createHeartBurst(DOM.letterParticles, 25);
    
    const letterPaper = document.getElementById("letter-paper");
    let memoriesRevealed = false;
    
    // Scroll event on the letter to reveal memories below
    letterPaper.addEventListener("scroll", () => {
      // If we scrolled to the bottom of the letter
      if (!memoriesRevealed && letterPaper.scrollTop + letterPaper.clientHeight >= letterPaper.scrollHeight - 60) {
        memoriesRevealed = true;
        
        // Setup continuous scroll flow
        DOM.pageLetter.style.position = "relative";
        DOM.pageLetter.style.height = "auto";
        DOM.pageLetter.style.minHeight = "100vh";
        
        DOM.pageMemories.style.position = "relative";
        DOM.pageMemories.style.opacity = "1";
        DOM.pageMemories.style.visibility = "visible";
        DOM.pageMemories.classList.add("active");
        
        document.body.style.overflowY = "auto";
        
        initMemoryPage();
      }
    });
  });

  // Memories Nav Interactions
  if (DOM.btnMemoriesBack) {
    DOM.btnMemoriesBack.addEventListener("click", () => {
      // Scroll back up to the letter smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (DOM.btnMemoriesNext) {
    DOM.btnMemoriesNext.addEventListener("click", () => {
      // Transition to Cake page
      DOM.pageLetter.style.transition = "opacity 0.8s ease, visibility 0.8s";
      DOM.pageLetter.style.opacity = "0";
      DOM.pageLetter.style.visibility = "hidden";
      
      DOM.pageMemories.style.transition = "opacity 0.8s ease, visibility 0.8s";
      DOM.pageMemories.style.opacity = "0";
      DOM.pageMemories.style.visibility = "hidden";
      
      setTimeout(() => {
        DOM.pageCake.classList.add("active");
        window.scrollTo(0, 0);
        document.body.style.overflowY = "hidden"; // lock scroll on cake
        initCakeConfetti();
      }, 800);
    });
  }
}

// ============================================
// CAKE CONFETTI
// ============================================
function initCakeConfetti() {
  const container = document.getElementById("cake-particles");
  if (!container) return;
  
  const colors = ["#ffc2d1", "#ff85a1", "#ff6b9d", "#f1c40f", "#fff5e4", "#c9a0dc"];
  
  // Spawn sparsely
  setInterval(() => {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Randomize duration and size
    const duration = 4 + Math.random() * 3;
    confetti.style.animationDuration = duration + "s";
    
    const size = 5 + Math.random() * 10;
    confetti.style.width = size + "px";
    confetti.style.height = (size * 1.5) + "px";
    
    container.appendChild(confetti);
    
    // Clean up
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, duration * 1000);
  }, 400); // 400ms interval for sparse effect
}

// ============================================
// NO BUTTON — Playful dodging behavior
// ============================================
function handleNoClick() {
  noClickCount++;

  const noBtn = DOM.btnNo;
  const yesBtn = DOM.btnYes;
  const card = document.querySelector(".question-card");

  // 1) Show funny message
  showFunnyMessage();

  // 2) Shake the card briefly
  card.style.animation = "shake 0.4s ease";
  setTimeout(() => { card.style.animation = ""; }, 400);

  // 3) Move No button to random position
  const cardRect = card.getBoundingClientRect();

  // Use card-relative positioning for better containment
  const maxX = cardRect.width * 0.7;
  const maxY = cardRect.height * 0.5;
  const randX = (Math.random() - 0.5) * maxX;
  const randY = (Math.random() - 0.5) * maxY;

  // 4) Shrink No button, grow Yes button
  const shrink = Math.max(Math.pow(0.82, noClickCount), 0.25);
  const rotation = Math.floor(Math.random() * 50) - 25;

  noBtn.style.position = "relative";
  noBtn.style.transition = "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
  noBtn.style.transform = `translate(${randX}px, ${randY}px) scale(${shrink}) rotate(${rotation}deg)`;

  // Opacity stages
  if (noClickCount >= 5 && noClickCount < 8) {
    noBtn.style.opacity = "0.55";
  } else if (noClickCount >= 8) {
    noBtn.style.opacity = "0.15";
    noBtn.style.pointerEvents = "none"; // Nearly impossible
  }

  // Grow Yes button
  const grow = 1 + noClickCount * 0.08;
  yesBtn.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  yesBtn.style.transform = `scale(${Math.min(grow, 1.8)})`;
  yesBtn.style.animation = "none"; // Stop the pulse to show the scale
}


function showFunnyMessage() {
  const msg = DOM.funnyMessage;
  if (!msg) return;

  const index = (noClickCount - 1) % CONFIG.funnyMessages.length;
  msg.textContent = CONFIG.funnyMessages[index];
  msg.classList.remove("show");

  // Force reflow for re-triggering animation
  void msg.offsetWidth;
  msg.classList.add("show");

  // Hide after 2 seconds
  setTimeout(() => {
    msg.classList.remove("show");
  }, 2500);
}


// ============================================
// YES BUTTON — Trigger celebration!
// ============================================
function handleYesClick() {
  // Try to play music (requires user gesture)
  playMusic();

  // Transition from Question → Celebration
  transitionPages(DOM.pageQuestion, DOM.pageCelebration).then(() => {
    startCelebration();
  });
}


// ============================================
// MUSIC
// ============================================
function playMusic() {
  const audio = DOM.bgMusic;
  if (!audio) return;

  audio.volume = 0.4;
  audio.loop = true;

  // Attempt to play; gracefully handle missing file
  audio.play().catch((err) => {
    console.log("Music playback skipped:", err.message);
  });
}


// ============================================
// CELEBRATION SEQUENCE
// ============================================
function startCelebration() {
  // Immediate effects
  createHeartBurst(DOM.celebrationHearts, isMobile ? 25 : 40);

  const textEl = DOM.celebrationText;
  const { typingSpeed, messageGap, lilyDelay, celebrationTotal } = CONFIG.timings;

  // Phase 1: Type first message
  setTimeout(() => {
    typeText(textEl, CONFIG.celebrationMessages[0], typingSpeed, () => {
      // Phase 2: Fade out, then type second message
      setTimeout(() => {
        fadeElement(textEl, "out", 500, () => {
          fadeElement(textEl, "in", 300);
          typeText(textEl, CONFIG.celebrationMessages[1], typingSpeed, () => {
            // Phase 3: Bloom lilies
            setTimeout(() => {
              lilyExplosion();
            }, lilyDelay);
          });
        });
      }, messageGap);
    });
  }, 800);

  // Auto-transition to Letter Page
  setTimeout(() => {
    transitionPages(DOM.pageCelebration, DOM.pageLetter);
  }, celebrationTotal);
}


// ============================================
// TYPING EFFECT
// ============================================
function typeText(element, text, speed, callback) {
  if (!element) return;

  element.innerHTML = "";

  // Handle emoji correctly with Array.from (handles surrogate pairs)
  const chars = Array.from(text);
  let i = 0;

  // Create cursor
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  element.appendChild(cursor);

  function addNextChar() {
    if (i < chars.length) {
      const charNode = document.createTextNode(chars[i]);
      element.insertBefore(charNode, cursor);
      i++;
      setTimeout(addNextChar, speed);
    } else {
      // Done typing — keep cursor blinking for a moment, then remove
      setTimeout(() => {
        cursor.style.transition = "opacity 0.3s ease";
        cursor.style.opacity = "0";
        setTimeout(() => cursor.remove(), 300);
        if (callback) callback();
      }, 600);
    }
  }

  addNextChar();
}


// ============================================
// FLOATING HEARTS — Page 1 background
// ============================================
function startFloatingHearts() {
  const container = DOM.heartsContainer;
  if (!container) return;

  const maxHearts = isMobile ? 12 : 25;
  const hearts = [];

  function spawnHeart() {
    if (hearts.length >= maxHearts) return;

    const heart = document.createElement("span");
    heart.textContent = CONFIG.heartEmojis[Math.floor(Math.random() * CONFIG.heartEmojis.length)];
    heart.setAttribute("aria-hidden", "true");

    const size = 14 + Math.random() * 22;
    const startX = Math.random() * 100;
    const duration = 5 + Math.random() * 5;
    const swayAmount = 30 + Math.random() * 40;

    Object.assign(heart.style, {
      position: "absolute",
      bottom: "-40px",
      left: `${startX}%`,
      fontSize: `${size}px`,
      opacity: "0",
      transition: "none",
      pointerEvents: "none",
      filter: `blur(${Math.random() > 0.7 ? 1 : 0}px)`, // Some hearts are slightly blurred for depth
    });

    container.appendChild(heart);

    // Track the heart
    const heartData = {
      el: heart,
      y: 0,
      speed: (window.innerHeight + 100) / (duration * 60), // px per frame (~60fps)
      sway: {
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025,
        amp: swayAmount,
      },
    };
    hearts.push(heartData);
  }

  function animate() {
    // Spawn occasionally
    if (Math.random() > 0.92) spawnHeart();

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.speed;
      h.sway.phase += h.sway.speed;

      const swayX = Math.sin(h.sway.phase) * h.sway.amp;
      const progress = h.y / (window.innerHeight + 100);

      // Fade in at start, fade out at end
      let opacity = 1;
      if (progress < 0.1) opacity = progress * 10;
      else if (progress > 0.85) opacity = (1 - progress) / 0.15;

      h.el.style.transform = `translate3d(${swayX}px, -${h.y}px, 0)`;
      h.el.style.opacity = Math.max(0, Math.min(0.7, opacity));

      // Remove when off screen
      if (h.y > window.innerHeight + 80) {
        h.el.remove();
        hearts.splice(i, 1);
      }
    }

    heartsAnimationId = requestAnimationFrame(animate);
  }

  animate();
}


// ============================================
// HEART BURST — Celebration explosion
// ============================================
function createHeartBurst(container, count) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.textContent = CONFIG.heartEmojis[Math.floor(Math.random() * CONFIG.heartEmojis.length)];
    heart.setAttribute("aria-hidden", "true");

    const size = 16 + Math.random() * 24;
    Object.assign(heart.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      fontSize: `${size}px`,
      pointerEvents: "none",
      transition: `transform ${1 + Math.random() * 1.5}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${1.5 + Math.random()}s ease-out`,
      zIndex: "5",
    });

    container.appendChild(heart);

    // Burst in random directions
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 250;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`;
      heart.style.opacity = "0";
    });

    // Clean up
    setTimeout(() => heart.remove(), 3000);
  }
}


// ============================================
// SPARKLE SYSTEM — Twinkling dots
// ============================================
function startSparkles() {
  const container = DOM.sparklesContainer;
  if (!container) return;

  const rate = isMobile ? 150 : 80;

  sparkleInterval = setInterval(() => {
    const sparkle = document.createElement("div");
    const size = 2 + Math.random() * 4;
    const isGold = Math.random() > 0.6;

    Object.assign(sparkle.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      backgroundColor: isGold ? "#ffd700" : "#ffffff",
      boxShadow: `0 0 ${size * 3}px ${size}px ${isGold ? "rgba(255, 215, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      pointerEvents: "none",
      animation: `sparkleFade ${1 + Math.random() * 1}s ease-in-out forwards`,
    });

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2000);
  }, rate);
}

function stopSparkles() {
  if (sparkleInterval) {
    clearInterval(sparkleInterval);
    sparkleInterval = null;
  }
}

// Inject sparkle animation into <head>
const sparkleStyle = document.createElement("style");
sparkleStyle.textContent = `
  @keyframes sparkleFade {
    0%   { opacity: 0; transform: scale(0) rotate(0deg); }
    40%  { opacity: 1; transform: scale(1.2) rotate(90deg); }
    100% { opacity: 0; transform: scale(0) rotate(180deg); }
  }
`;
document.head.appendChild(sparkleStyle);


// ============================================
// LILY FLOWERS — Explosion System
// ============================================
function lilyExplosion() {
  const container = DOM.liliesContainer;
  if (!container) return;
  
  container.style.cssText = 'position: fixed; inset: 0; z-index: 100; pointer-events: none; overflow: visible;';
  
  const count = isMobile ? 105 : 210; // Specific count requested by user
  const lilies = [];
  
  for (let i = 0; i < count; i++) {
    // Create a simple lily element
    const lily = document.createElement('div');
    lily.className = 'explosion-lily';
    
    const size = 38 + Math.random() * 62; // 38-100px (increased by ~25%)
    const color = CONFIG.lilyColors[Math.floor(Math.random() * CONFIG.lilyColors.length)];
    
    // Create optimized flower (8 petals for fullness with much less DOM lag)
    for (let p = 0; p < 8; p++) {
      const petal = document.createElement('div');
      petal.className = 'explosion-petal';
      const angle = p * 45; // 360/8
      const pScale = 0.8 + Math.random() * 0.4; // slight size variation per petal
      petal.style.cssText = `
        position: absolute;
        width: ${size * 0.25}px;
        height: ${size * 0.6}px;
        background: ${color}; /* Solid color instead of gradient removes GPU overdraw */
        opacity: 0.9;
        border-radius: 50% 50% 45% 45% / 70% 70% 30% 30%;
        transform-origin: bottom center;
        bottom: 50%;
        left: calc(50% - ${size * 0.125}px);
        transform: rotate(${angle}deg) scale(${pScale});
      `;
      lily.appendChild(petal);
    }
    
    // Center dot
    const center = document.createElement('div');
    center.style.cssText = `
      position: absolute;
      width: ${size * 0.2}px;
      height: ${size * 0.2}px;
      background: radial-gradient(circle, #fff7a0, #ffdb58);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;
    lily.appendChild(center);
    
    lily.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      left: 50vw;
      top: 50vh;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 100;
      opacity: 1;
      will-change: transform, opacity;
    `;
    
    container.appendChild(lily);
    
    // Physics: Dye in water dissipation (omnidirectional, smooth, high friction)
    const angle = Math.random() * Math.PI * 2; // 0 to 360 degrees
    const speed = 4 + Math.random() * 12; // slower, gentler initial burst velocity
    
    lilies.push({
      el: lily,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      scale: 0.3 + Math.random() * 0.7,
      friction: 0.96 + Math.random() * 0.03, // coasts longer and slower
      driftX: (Math.random() - 0.5) * 0.5, // slight ambient drift
      driftY: (Math.random() - 0.5) * 0.5,
      opacity: 1,
      fadeDelay: 180 + Math.random() * 120, // longer time before fading

      age: 0
    });
  }
  
  let frame = 0;
  const maxFrames = 300; // ~5 seconds at 60fps
  
  function animate() {
    frame++;
    let allDone = true;
    
    for (const l of lilies) {
      l.age++;
      
      // Apply friction to slow down smoothly like dye in water
      l.vx *= l.friction;
      l.vy *= l.friction;
      
      // Add a tiny ambient drift once initial velocity dies down
      l.x += l.vx + l.driftX;
      l.y += l.vy + l.driftY;
      
      // Slowly spin
      l.rotation += l.rotationSpeed * l.friction; 
      
      // Gradually fade out after a certain age
      if (l.age > l.fadeDelay) {
        l.opacity = Math.max(0, l.opacity - 0.015);
      }
      
      if (l.opacity > 0) allDone = false;
      
      l.el.style.transform = `translate3d(${l.x - window.innerWidth/2}px, ${l.y - window.innerHeight/2}px, 0) rotate(${l.rotation}deg) scale(${l.scale})`;
      l.el.style.opacity = l.opacity;
    }
    
    if (!allDone && frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      // Clean up
      lilies.forEach(l => l.el.remove());
    }
  }
  
  requestAnimationFrame(animate);
}


// ============================================
// MEMORY PAGE — Scroll effects & dust
// ============================================
function initMemoryPage() {
  // Scroll-reveal for polaroids
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
          entry.target.style.transform = entry.target.dataset.scatterTransform;
          entry.target.style.opacity = "1";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
  );

  DOM.polaroids.forEach((p, i) => {
    // Generate scattered layout
    const rot = (Math.random() - 0.5) * 30; // -15 to +15 deg
    const scale = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
    const mt = (Math.random() - 0.5) * 60; // Random offset
    const ml = (Math.random() - 0.5) * 60;
    
    p.style.marginTop = `${mt}px`;
    p.style.marginLeft = `${ml}px`;
    p.dataset.scatterTransform = `translateY(0) scale(${scale}) rotate(${rot}deg)`;
    
    // Restore transform when mouse leaves
    p.addEventListener("mouseleave", () => {
      if (p.classList.contains("visible")) {
        p.style.transform = p.dataset.scatterTransform;
      }
    });

    p.style.transitionDelay = `${(i % 3) * 150}ms`; // Stagger rows
    observer.observe(p);
  });

  // Start dust particles
  startDustParticles();

  // Animate closing message
  const closing = document.querySelector(".closing-message");
  if (closing) {
    const closingObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          closing.style.animation = "fadeInUp 1s ease forwards";
          closingObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    closingObs.observe(closing);
  }
}


// ============================================
// DUST PARTICLES — Memory page ambient effect
// ============================================
function startDustParticles() {
  const container = DOM.particlesContainer;
  if (!container) return;

  const count = isMobile ? 25 : 50;
  const particles = [];

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    const size = 1 + Math.random() * 2;
    const isLight = Math.random() > 0.5;

    Object.assign(dot.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      backgroundColor: isLight
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(200, 170, 130, 0.3)",
      pointerEvents: "none",
    });

    container.appendChild(dot);

    particles.push({
      el: dot,
      x: Math.random() * window.innerWidth,
      y: Math.random() * document.documentElement.scrollHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1, // Slight upward drift
    });
  }

  function animateDust() {
    const scrollTop = window.scrollY || 0;
    const viewH = window.innerHeight;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < scrollTop - 50) p.y = scrollTop + viewH + 50;
      if (p.y > scrollTop + viewH + 50) p.y = scrollTop - 50;

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    });

    requestAnimationFrame(animateDust);
  }

  animateDust();
}


// ============================================
// POLAROID HEARTS — On hover/touch
// ============================================
function spawnPolaroidHearts(polaroidEl) {
  const rect = polaroidEl.getBoundingClientRect();
  const count = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.textContent = "❤️";
    heart.setAttribute("aria-hidden", "true");

    Object.assign(heart.style, {
      position: "fixed",
      left: `${rect.left + rect.width * 0.2 + Math.random() * rect.width * 0.6}px`,
      top: `${rect.top + rect.height * 0.3}px`,
      fontSize: `${10 + Math.random() * 6}px`,
      pointerEvents: "none",
      zIndex: "100",
      transition: `transform ${0.8 + Math.random() * 0.6}s ease-out, opacity ${0.8 + Math.random() * 0.4}s ease-out`,
    });

    document.body.appendChild(heart);

    const tx = (Math.random() - 0.5) * 40;
    const ty = -(40 + Math.random() * 50);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${tx}px, ${ty}px) scale(1.5)`;
      heart.style.opacity = "0";
    });

    setTimeout(() => heart.remove(), 1200);
  }
}


// ============================================
// PAGE TRANSITIONS
// ============================================
function transitionPages(fromPage, toPage) {
  return new Promise((resolve) => {
    const duration = CONFIG.timings.pageTransition;

    // Fade out
    fromPage.style.transition = `opacity ${duration}ms ease, visibility ${duration}ms ease`;
    fromPage.classList.remove("active");

    setTimeout(() => {
      fromPage.style.display = "none";

      // Prepare toPage
      toPage.style.display = toPage.id === "page-memories" ? "block" : "flex";
      toPage.style.opacity = "0";
      toPage.style.visibility = "visible";
      toPage.style.pointerEvents = "auto";
      toPage.style.position = toPage.id === "page-memories" ? "relative" : "fixed";

      // Force reflow
      void toPage.offsetWidth;

      // Fade in
      toPage.classList.add("active");
      toPage.style.transition = `opacity ${duration}ms ease`;
      toPage.style.opacity = "1";

      setTimeout(resolve, duration);
    }, duration);
  });
}


// ============================================
// FADE HELPER
// ============================================
function fadeElement(el, direction, duration, callback) {
  if (!el) return;
  el.style.transition = `opacity ${duration}ms ease`;
  el.style.opacity = direction === "out" ? "0" : "1";
  setTimeout(() => {
    if (callback) callback();
  }, duration);
}


// ============================================
// UTILITIES
// ============================================
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
