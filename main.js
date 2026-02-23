const canvas = document.getElementById("particles");

const transitionLayer = document.createElement("div");
transitionLayer.className = "page-transition-layer";
document.body.appendChild(transitionLayer);
requestAnimationFrame(() => {
    transitionLayer.classList.add("is-ready");
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
if (currentPage !== "contact.html") {
    const quickCta = document.createElement("a");
    quickCta.href = "contact.html";
    quickCta.className = "quick-cta";
    quickCta.textContent = "Contact Me";
    document.body.appendChild(quickCta);
}

const revealTargets = document.querySelectorAll(".glass-card, .section-title, .hero-intro, .hero-badges");
if (revealTargets.length > 0) {
    const showAll = () => revealTargets.forEach((el) => el.classList.add("is-visible"));
    revealTargets.forEach((el) => el.classList.add("reveal-ready"));

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
        );
        revealTargets.forEach((el) => revealObserver.observe(el));
        // Fallback: make sure nothing stays hidden if initial paint is missed.
        setTimeout(showAll, 900);
    } else {
        showAll();
    }
}

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    if (link.hasAttribute("target")) return;
    link.addEventListener("click", (e) => {
        const url = link.getAttribute("href");
        if (!url) return;
        const current = window.location.pathname.split("/").pop() || "index.html";
        if (url === current) return;
        e.preventDefault();
        transitionLayer.classList.remove("is-ready");
        transitionLayer.classList.add("is-leaving");
        setTimeout(() => {
            window.location.href = url;
        }, 280);
    });
});

if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = "#00f5ff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < 100; i++) particles.push(new Particle());
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = dx * dx + dy * dy;
                if (distance < 10000) {
                    ctx.strokeStyle = "rgba(0,245,255,0.1)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    init();
    animate();
}

document.querySelectorAll(".portfolio-item").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0)";
    });
});

const skillLevels = document.querySelectorAll(".skill-level");
if (skillLevels.length > 0) {
    skillLevels.forEach((bar, index) => {
        const targetWidth = bar.style.width || "0%";
        bar.style.width = "0%";
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 180 + index * 140);
    });
}

document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy");
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            const prev = btn.textContent;
            btn.textContent = "Copied";
            setTimeout(() => {
                btn.textContent = prev;
            }, 1200);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    });
});

const projectModal = document.getElementById("project-modal");
if (projectModal) {
    const modalTitle = document.getElementById("project-modal-title");
    const modalDescription = document.getElementById("project-modal-description");
    const modalRole = document.getElementById("project-modal-role");
    const modalTags = document.getElementById("project-modal-tags");

    const closeModal = () => {
        projectModal.classList.remove("show");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    };

    const openProjectModal = (card) => {
        const title = card.querySelector("h3")?.textContent?.trim() || "Project";
        const desc = card.querySelector("p")?.textContent?.trim() || "";
        const role = card.querySelector(".portfolio-role")?.textContent?.trim() || "";
        const tags = Array.from(card.querySelectorAll(".tech-tags span")).map((t) => t.textContent.trim());

        if (modalTitle) modalTitle.textContent = title;
        if (modalDescription) modalDescription.textContent = desc;
        if (modalRole) modalRole.textContent = role;
        if (modalTags) modalTags.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");

        projectModal.classList.add("show");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };

    document.querySelectorAll(".portfolio-item").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest('a[target="_blank"]')) return;
            if (e.target.closest("[data-open-modal]") || !e.target.closest("a")) {
                openProjectModal(card);
            }
        });
    });

    projectModal.querySelectorAll("[data-close-modal]").forEach((el) => {
        el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("show")) {
            closeModal();
        }
    });
}
