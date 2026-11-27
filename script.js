// BridgePath Hackathon Tracks — interactive front-end
const trackInformation = {
  credential: {
    number: "TRACK 01", title: "Credential Recognition", sdgs: "SDGs 4 & 8", icon: "▤",
    description: "People with qualifications and skills gained in another country can face difficulty proving what they know. This track focuses on making foreign credentials and skills easier to verify and recognise.",
    focus: "Explore practical ways to verify qualifications, communicate skills clearly and help employers understand a person's experience."
  },
  access: {
    number: "TRACK 02", title: "Legal & Financial Access", sdgs: "SDGs 8, 10 & 16", icon: "⚖",
    description: "Work authorisation and payment processes can create barriers for people trying to access decent work and financial services. This track focuses on reducing those points of friction.",
    focus: "Consider clear information, accessible processes and practical tools that can make work authorisation and payments easier to navigate."
  },
  networks: {
    number: "TRACK 03", title: "Local Networks & Experience", sdgs: "SDGs 8, 10 & 17", icon: "◎",
    description: "People can miss opportunities when they do not have access to the right referrals, professional relationships or local experience. This track focuses on strengthening connections.",
    focus: "Explore fellowship pathways, mentorship, community referrals and ways to connect people with relevant local opportunities."
  }
};

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

document.querySelectorAll(".nav-link, .nav-links .btn").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Track detail modal
const modal = document.getElementById("trackModal");
const modalTitle = document.getElementById("modalTitle");
const modalLabel = document.getElementById("modalTrackLabel");
const modalIcon = document.getElementById("modalIcon");
const modalSdgs = document.getElementById("modalSdgs");
const modalDescription = document.getElementById("modalDescription");
const modalFocus = document.getElementById("modalFocus");
let selectedTrack = "";

function openTrack(trackKey) {
  const track = trackInformation[trackKey];
  if (!track) return;
  selectedTrack = trackKey;
  modalLabel.textContent = track.number;
  modalTitle.textContent = track.title;
  modalIcon.textContent = track.icon;
  modalSdgs.textContent = track.sdgs;
  modalDescription.textContent = track.description;
  modalFocus.textContent = track.focus;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeTrack() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-track]").forEach(button => {
  button.addEventListener("click", () => openTrack(button.dataset.openTrack));
});
document.getElementById("modalClose").addEventListener("click", closeTrack);
modal.addEventListener("click", event => {
  if (event.target === modal) closeTrack();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeTrack();
});
document.getElementById("modalApply").addEventListener("click", () => {
  const select = document.getElementById("trackChoice");
  const names = {
    credential: "Credential Recognition",
    access: "Legal & Financial Access",
    networks: "Local Networks & Experience"
  };
  select.value = names[selectedTrack] || "";
  closeTrack();
  document.getElementById("apply").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => document.getElementById("fullName").focus(), 500);
});

// Front-end demo application: save entries in this browser only.
const applicationForm = document.getElementById("applicationForm");
const formFeedback = document.getElementById("formFeedback");

applicationForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;

  const formData = new FormData(applicationForm);
  const entry = {
    fullName: formData.get("fullName").trim(),
    email: formData.get("email").trim(),
    track: formData.get("trackChoice"),
    message: formData.get("message").trim(),
    submittedAt: new Date().toISOString()
  };

  try {
    const existingEntries = JSON.parse(localStorage.getItem("bridgePathApplications") || "[]");
    existingEntries.push(entry);
    localStorage.setItem("bridgePathApplications", JSON.stringify(existingEntries));
    formFeedback.textContent = "Thank you! Your interest has been saved in this browser.";
    formFeedback.className = "form-feedback success";
    applicationForm.reset();
  } catch (error) {
    formFeedback.textContent = "Your browser could not save this entry. Please try again.";
    formFeedback.className = "form-feedback error";
  }
});

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// Update active navigation link while scrolling.
const sections = document.querySelectorAll("main section[id], footer[id]");
const navItems = document.querySelectorAll(".nav-link");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => sectionObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();
