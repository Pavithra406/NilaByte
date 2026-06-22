const typingPhrases = [
  "Full Stack Developer",
  "AI/ML Enthusiast",
  "Web Application Builder"
];

const typingElement = document.getElementById("typingText");
const themeToggle = document.getElementById("themeToggle");
const mobileNavToggle = document.getElementById("mobileNavToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const progressBars = document.querySelectorAll(".progress-bar");
const contactForm = document.querySelector(".contact-form");
const activeSection = document.querySelector(".page-section.active");
const pendingLinks = [...document.querySelectorAll(".pending-link")];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingElement) {
    return;
  }

  const currentPhrase = typingPhrases[phraseIndex];
  typingElement.textContent = currentPhrase.slice(0, charIndex);

  if (!deleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 90);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 45);
    return;
  }

  if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 220);
}

function applyTheme(theme) {
  if (!themeToggle) {
    return;
  }

  document.body.classList.toggle("light-mode", theme === "light");
  const icon = themeToggle.querySelector(".theme-icon");
  icon.textContent = theme === "light" ? "D" : "L";
  localStorage.setItem("portfolio-theme", theme);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
  applyTheme(nextTheme);
});

mobileNavToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

function hydrateSection(section) {
  if (!section) {
    return;
  }

  const revealElements = section.querySelectorAll(".reveal");
  revealElements.forEach((element, index) => {
    element.classList.remove("visible");
    setTimeout(() => {
      element.classList.add("visible");
    }, index * 60);
  });

  if (section.id === "skills") {
    progressBars.forEach((bar) => {
      bar.dataset.animated = "";
      bar.style.width = "0";
    });

    setTimeout(() => {
      progressBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.progress}%`;
        bar.dataset.animated = "true";
      });
    }, 160);
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  const originalText = button.textContent;
  button.textContent = "Message Ready";
  button.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    button.textContent = originalText;
    button.disabled = false;
  }, 1800);
});

pendingLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const projectName = link.dataset.project || "This project";
    const originalText = link.textContent;
    link.textContent = "Demo Link Pending";
    link.classList.add("ghost");

    setTimeout(() => {
      link.textContent = originalText;
      link.classList.remove("ghost");
    }, 1800);

    console.info(`Add the Google Drive demo URL for ${projectName}.`);
  });
});

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 32 : 60;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: Math.random() * 2.6 + 0.8,
        velocityX: (Math.random() - 0.5) * 0.45,
        velocityY: (Math.random() - 0.5) * 0.45
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < 0 || particle.x > canvas.offsetWidth) {
        particle.velocityX *= -1;
      }

      if (particle.y < 0 || particle.y > canvas.offsetHeight) {
        particle.velocityY *= -1;
      }

      context.beginPath();
      context.fillStyle = "rgba(124, 226, 255, 0.7)";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

        if (distance < 120) {
          context.beginPath();
          context.strokeStyle = `rgba(124, 226, 255, ${0.14 - distance / 900})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

applyTheme(localStorage.getItem("portfolio-theme") || "dark");
typeLoop();
initParticles();
hydrateSection(activeSection);
