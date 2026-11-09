/* ======================================
   NOVA — INTERACTIVE EXPERIENCE
====================================== */

// ======================================
// EMAILJS
// ======================================

const SERVICE_ID = "service_bov2lt8";
const TEMPLATE_ID = "template_akjyxnx";
const PUBLIC_KEY = "Bar1lgeVmtNYUihyT";

let emailJSReady = false;

if (window.emailjs) {
  emailjs.init({
    publicKey: PUBLIC_KEY
  });
  emailJSReady = true;
}

// ======================================
// INTRO CINEMATOGRÁFICA
// ======================================

const intro = document.getElementById("intro");

document.body.classList.add("intro-active");

function startIntro() {
  setTimeout(() => {
    intro?.classList.add("open");
  }, 500);

  setTimeout(() => {
    intro?.classList.add("done");
    document.body.classList.remove("intro-active");
    startAnimations();
  }, 2700);
}

if (document.readyState === "complete") {
  startIntro();
} else {
  window.addEventListener("load", startIntro, { once: true });
}

// ======================================
// TÍTULOS LETRA POR LETRA
// ======================================

function prepareTitles() {
  const titles = document.querySelectorAll(
    ".hero-title, .section-title, .immersive h2, .final-cta h2"
  );

  titles.forEach((title) => {
    if (title.dataset.prepared === "true") return;

    title.classList.add("letter-title");

    const walker = document.createTreeWalker(
      title,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();

      Array.from(textNode.textContent).forEach((character) => {
        if (character === "\n") {
          fragment.appendChild(document.createTextNode(character));
          return;
        }

        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = character;

        fragment.appendChild(span);
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    title.dataset.prepared = "true";
  });
}

function playTitle(title) {
  if (!title) return;

  title.classList.add("play");

  title.querySelectorAll(".letter").forEach((letter, index) => {
    letter.style.setProperty(
      "--delay",
      `${Math.min(index * 30, 850)}ms`
    );
  });
}

// ======================================
// ANIMACIONES AL DESPLAZARSE
// ======================================

function startAnimations() {
  document.body.classList.add("js-ready");

  prepareTitles();

  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    document.querySelectorAll(".letter-title").forEach(playTitle);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      element.classList.add("visible");

      element.querySelectorAll(".letter-title").forEach(playTitle);

      currentObserver.unobserve(element);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px"
  });

  elements.forEach((element) => observer.observe(element));

  // Animar títulos que no están dentro de un elemento reveal.
  document.querySelectorAll(".hero-title").forEach(playTitle);
}

// ======================================
// PALABRA CAMBIANTE DEL HERO
// ======================================

const changingWord = document.getElementById("changingWord");

const words = [
  "ahora.",
  "contigo.",
  "sin límites.",
  "siempre."
];

let wordIndex = 0;

if (changingWord) {
  setInterval(() => {
    changingWord.classList.add("word-out");

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      changingWord.textContent = words[wordIndex];
      changingWord.classList.remove("word-out");
    }, 350);

  }, 2800);
}

// ======================================
// MENÚ RESPONSIVE
// ======================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const open = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ======================================
// BARRA DE PROGRESO
// ======================================

const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
  if (!scrollProgress) return;

  const total =
    document.documentElement.scrollHeight - window.innerHeight;

  const percentage = total > 0
    ? (window.scrollY / total) * 100
    : 0;

  scrollProgress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateScrollProgress, {
  passive: true
});

updateScrollProgress();

// ======================================
// LUZ QUE SIGUE EL MOUSE
// ======================================

const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

// ======================================
// CONTADORES ANIMADOS
// ======================================

function animateCounter(element) {
  const target = Number(element.dataset.target);

  if (!Number.isFinite(target)) return;

  const duration = 1600;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = Math.floor(target * eased);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

const counters = document.querySelectorAll(".counter");

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.5
  });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

// ======================================
// EFECTO 3D EN TARJETAS
// ======================================

const cards = document.querySelectorAll(".universe-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 900) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform =
      `translateY(-8px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ======================================
// FORMULARIO DE SUSCRIPCIÓN
// ======================================

const subscribeForm = document.getElementById("subscribe-form");
const submitButton = document.getElementById("submit-button");
const message = document.getElementById("message");
const emailInput = document.getElementById("email");

if (subscribeForm) {
  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    message.className = "form-message";

    const email = emailInput.value.trim();
    const honeypot = subscribeForm.querySelector(
      'input[name="website"]'
    );

    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      message.textContent = "Escribe un correo electrónico válido.";
      message.classList.add("error");
      return;
    }

    if (!emailJSReady || !window.emailjs) {
      message.textContent =
        "No se pudo conectar con el servicio de correo. Recarga la página.";
      message.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "CONECTANDO...";

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        subscribeForm
      );

      message.textContent =
        "¡Conexión establecida! Bienvenido a NOVA.";
      message.classList.add("success");

      subscribeForm.reset();

    } catch (error) {
      console.error("Error EmailJS:", error);

      message.textContent =
        "No se pudo enviar el correo. Inténtalo de nuevo.";
      message.classList.add("error");

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'CONECTARME <span>↗</span>';
    }
  });
}

// ======================================
// MÚSICA FUTURISTA
// ======================================

const novaMusic = document.getElementById("novaMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

let musicPlaying = false;

if (novaMusic) {
  novaMusic.volume = 0.25;
}

async function playMusic() {
  try {
    await novaMusic.play();

    musicPlaying = true;
    musicButton.classList.add("playing");
    musicIcon.textContent = "♫";
    musicText.textContent = "MÚSICA ACTIVADA";

  } catch (error) {
    console.error("Error de reproducción:", error);
    musicText.textContent = "INTENTAR DE NUEVO";
  }
}

function pauseMusic() {
  novaMusic.pause();

  musicPlaying = false;
  musicButton.classList.remove("playing");
  musicIcon.textContent = "♫";
  musicText.textContent = "ACTIVAR SONIDO";
}

if (musicButton && novaMusic) {
  musicButton.addEventListener("click", () => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  novaMusic.addEventListener("error", () => {
    musicText.textContent = "AUDIO NO DISPONIBLE";
  });
}

// ======================================
// FOOTER
// ======================================

const copyright = document.getElementById("copyright");

if (copyright) {
  copyright.textContent =
    `© ${new Date().getFullYear()} NOVA. Todos los derechos reservados.`;
}