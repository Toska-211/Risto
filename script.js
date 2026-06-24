// ===== MENU MOBILE HAMBURGER =====
function createMobileMenu() {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");

  // Crea il pulsante hamburger
  const hamburger = document.createElement("button");
  hamburger.id = "hamburger";
  hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

  // Inserisci l'hamburger nell'header
  header.appendChild(hamburger);

  // Event listener per il toggle del menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });
}

// ===== SCROLL ANIMATO PER I LINK DI NAVIGAZIONE =====
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Chiudi il menu mobile se aperto
        const nav = document.querySelector("nav");
        const hamburger = document.getElementById("hamburger");
        if (nav && hamburger) {
          nav.classList.remove("active");
          hamburger.classList.remove("active");
        }
      }
    });
  });
}

// ===== ANIMAZIONE CONTATORI =====
function initCounterAnimation() {
  const counters = document.querySelectorAll(".numero");
  const options = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 20);

        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach((counter) => observer.observe(counter));
}

// ===== VALIDAZIONE FORM =====
function initFormValidation() {
  const form = document.getElementById("campi");
  if (!form) return;

  const inputs = form.querySelectorAll('input[type="text"], textarea');
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const submitBtn = form.querySelector("button");

  // Validazione in tempo reale
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearError);
  });

  // Validazione al submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    // Valida tutti i campi obbligatori
    inputs.forEach((input) => {
      if (!validateField({ target: input })) {
        isValid = false;
      }
    });

    // Valida checkbox obbligatori
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        showError(checkbox, "Questo campo è obbligatorio");
        isValid = false;
      }
    });

    if (isValid) {
      // Simula invio form
      showSuccessMessage();
    }
  });

  function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Rimuovi errori precedenti
    clearError({ target: field });

    if (!value) {
      showError(field, "Questo campo è obbligatorio");
      return false;
    }

    // Validazione email
    if (field.id === "mail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, "Inserisci un indirizzo email valido");
        return false;
      }
    }

    // Validazione telefono
    if (field.id === "cell") {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 8) {
        showError(field, "Inserisci un numero di telefono valido");
        return false;
      }
    }

    return true;
  }

  function showError(field, message) {
    field.style.borderColor = "#dc582a";

    // Rimuovi messaggio di errore esistente
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();

    // Crea nuovo messaggio di errore
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
            color: #dc582a;
            font-size: 14px;
            margin-top: 5px;
        `;

    field.parentNode.appendChild(errorDiv);
  }

  function clearError(e) {
    const field = e.target;
    field.style.borderColor = "";

    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
  }

  function showSuccessMessage() {
    // Crea overlay di successo
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

    const successBox = document.createElement("div");
    successBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
        `;

    successBox.innerHTML = `
            <h3 style="color: var(--bg-orange); margin-bottom: 20px;">Messaggio Inviato!</h3>
            <p>Grazie per averci contattato. Ti risponderemo al più presto.</p>
            <button id="closeSuccess" style="
                background: var(--bg-orange);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                margin-top: 20px;
                cursor: pointer;
            ">OK</button>
        `;

    overlay.appendChild(successBox);
    document.body.appendChild(overlay);

    // Chiudi al click
    document.getElementById("closeSuccess").addEventListener("click", () => {
      document.body.removeChild(overlay);
      form.reset();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        form.reset();
      }
    });
  }
}

// ===== ANIMAZIONI AL SCROLL =====
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".mediaTesto, .singoloContainer, .menu"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => {
    el.style.cssText += `
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        `;
    observer.observe(el);
  });
}

// ===== HEADER SCROLL EFFECT RIMOSSO =====
// Funzione rimossa per mantenere l'header originale

// ===== INIZIALIZZAZIONE =====
document.addEventListener("DOMContentLoaded", () => {
  createMobileMenu();
  initSmoothScroll();
  initCounterAnimation();
  initFormValidation();
  initScrollAnimations();
  addServiceTooltips();

  console.log("🍽️ ARMA website loaded successfully!");
});

// ===== FUNZIONALITÀ EXTRA: TOOLTIP PER I SERVIZI =====
function addServiceTooltips() {
  const serviceImages = document.querySelectorAll(
    "#ristorazione summary img:first-child"
  );

  serviceImages.forEach((img) => {
    img.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "service-tooltip";
      tooltip.textContent = "Clicca per saperne di più";
      tooltip.style.cssText = `
                position: absolute;
                background: var(--txt-purple);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;

      document.body.appendChild(tooltip);

      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = rect.top - 30 + "px";
    });

    img.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".service-tooltip");
      if (tooltip) tooltip.remove();
    });
  });
}

