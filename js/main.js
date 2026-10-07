/* =========================================================
   STRATEGIX — GLOBAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   LOAD NAVBAR & FOOTER
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    await Promise.all([
        loadComponent("navbar", "components/navbar.html"),
        loadComponent("footer", "components/footer.html")
    ]);

    initializeGlobalComponents();

});


async function loadComponent(elementId, filePath) {

    const container = document.getElementById(elementId);

    if (!container) return;

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Unable to load ${filePath}`);
        }

        container.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   GLOBAL COMPONENT INITIALIZATION
   ========================================================= */

function initializeGlobalComponents() {

    initializeTheme();
    initializeDirection();
    initializeMobileMenu();
    initializeProfileDropdown();
    initializeActiveNavigation();
    initializeScrollAnimations();

}

/* =========================================================
   SCROLL ANIMATIONS
   ========================================================= */

function initializeScrollAnimations() {
    // Select entire sections to animate them together like Framer Motion
    const selectors = [
        'section:not(.hero):not(.pd-hero)'
    ];

    const elementsToAnimate = document.querySelectorAll(selectors.join(', '));

    // Add base class to elements
    elementsToAnimate.forEach((el) => {
        // We add the reveal class to the container inside the section, or the section itself
        const container = el.querySelector('.container') || el;
        if (!container.classList.contains('scroll-reveal')) {
            container.classList.add('scroll-reveal');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    animatedElements.forEach(el => observer.observe(el));
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function initializeTheme() {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("strategix-theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        updateThemeIcon(true);
    } else {
        document.documentElement.removeAttribute("data-theme");
        updateThemeIcon(false);
    }


    themeToggle.addEventListener("click", () => {

        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {

            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("strategix-theme", "light");

            updateThemeIcon(false);

        } else {

            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("strategix-theme", "dark");

            updateThemeIcon(true);

        }

    });

}


function updateThemeIcon(isDark) {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    const icon = themeToggle.querySelector("i");

    if (!icon) return;

    if (isDark) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

}


/* =========================================================
   RTL / LTR
   ========================================================= */

function initializeDirection() {

    const directionToggle =
        document.getElementById("directionToggle");

    if (!directionToggle) return;


    const savedDirection =
        localStorage.getItem("strategix-direction");


    if (savedDirection === "rtl") {

        document.documentElement.setAttribute("dir", "rtl");

    } else {

        document.documentElement.setAttribute("dir", "ltr");

    }


    directionToggle.addEventListener("click", () => {

        const currentDirection =
            document.documentElement.getAttribute("dir");

        if (currentDirection === "rtl") {

            document.documentElement.setAttribute("dir", "ltr");

            localStorage.setItem(
                "strategix-direction",
                "ltr"
            );

        } else {

            document.documentElement.setAttribute("dir", "rtl");

            localStorage.setItem(
                "strategix-direction",
                "rtl"
            );

        }

    });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuToggle =
        document.getElementById("mobileMenuToggle");

    const navbarLinks =
        document.getElementById("navbarLinks");


    if (!menuToggle || !navbarLinks) return;


    menuToggle.addEventListener("click", () => {

        const isOpen =
            navbarLinks.classList.toggle("show");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );


        const icon = menuToggle.querySelector("i");

        if (!icon) return;


        if (isOpen) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });


    /* Close menu when a link is clicked */

    navbarLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navbarLinks.classList.remove("show");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    });

}


/* =========================================================
   PROFILE DROPDOWN
   ========================================================= */

function initializeProfileDropdown() {

    const profileToggle =
        document.getElementById("profileToggle");

    const profileDropdown =
        document.getElementById("profileDropdown");


    if (!profileToggle || !profileDropdown) return;


    profileToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen =
            profileDropdown.classList.toggle("show");

        profileToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    document.addEventListener("click", (event) => {

        if (
            !profileDropdown.contains(event.target) &&
            !profileToggle.contains(event.target)
        ) {

            profileDropdown.classList.remove("show");

            profileToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initializeActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            const linkPage =
                link.getAttribute("href");

            if (linkPage === currentPage) {

                link.classList.add("active");

            }

        });

}