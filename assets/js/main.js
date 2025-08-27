/**
* Template Name: iPortfolio
* Updated: Nov 17 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  /** Selector helper */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) return [...document.querySelectorAll(el)];
    return document.querySelector(el);
  };

  /** Event helper */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (!selectEl) return;
    if (all) selectEl.forEach(e => e.addEventListener(type, listener));
    else selectEl.addEventListener(type, listener);
  };

  /** On-scroll helper */
  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  /** Navbar links active state on scroll */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(window, navbarlinksActive); // changed: bind to window

  /** Smooth scroll to element */
  const scrollto = (el) => {
    const target = select(el);
    if (!target) return;
    const elementPos = target.offsetTop;
    window.scrollTo({ top: elementPos, behavior: "smooth" });
  };

  /** Back to top button */
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) backtotop.classList.add("active");
      else backtotop.classList.remove("active");
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(window, toggleBacktotop); // changed: bind to window
  }

  /** Mobile nav toggle */
  on("click", ".mobile-nav-toggle", function () {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /** Smooth scroll for .scrollto links */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        const body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          const navbarToggle = select(".mobile-nav-toggle");
          if (navbarToggle) {
            navbarToggle.classList.toggle("bi-list");
            navbarToggle.classList.toggle("bi-x");
          }
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /** Scroll to hash on load */
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /** Hero typing effect */
  const typed = select(".typed");
  if (typed && window.Typed) {
    let typed_strings = typed.getAttribute("data-typed-items") || "";
    typed_strings = typed_strings.split(",").map(s => s.trim()).filter(Boolean);
    if (typed_strings.length) {
      new Typed(".typed", {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
      });
    }
  }

  /** Skills animation */
  const skilsContent = select(".skills-content");
  if (skilsContent && window.Waypoint) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function () {
        const progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /** Portfolio isotope & filter */
  window.addEventListener("load", () => {
    const portfolioContainer = select(".portfolio-container");
    if (portfolioContainer && window.Isotope) {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      const portfolioFilters = select("#portfolio-flters li", true);
      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach((el) => el.classList.remove("filter-active"));
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            if (window.AOS) AOS.refresh();
          });
        },
        true
      );
    }
  });

  /** Portfolio lightbox */
  if (window.GLightbox) {
    GLightbox({ selector: ".portfolio-lightbox" });
  }

  /** Portfolio details slider */
  if (window.Swiper) {
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    });

    // /** Testimonials slider */
    // new Swiper(".testimonials-slider", {
    //   speed: 600,
    //   loop: true,
    //   autoplay: { delay: 5000, disableOnInteraction: false },
    //   slidesPerView: "auto",
    //   pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    //   breakpoints: {
    //     320: { slidesPerView: 1, spaceBetween: 20 },
    //     1200: { slidesPerView: 3, spaceBetween: 20 },
    //   },
    // });
  }

  /** AOS init */
  window.addEventListener("load", () => {
    if (window.AOS) {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  });

  /** Pure Counter */
  if (window.PureCounter) new PureCounter();

  /* ============================================================
   * Resume accordion: Show more / less
   * HTML hooks used:
   *   #pro-exp            (wrapper)
   *   .collapsed-list     (hidden group)
   *   #more-btn           (toggle button)
   *   .is-open            (class to reveal collapsed-list)
   * ============================================================ */
  const proExp = select("#pro-exp");
  const collapsed = proExp ? proExp.querySelector(".collapsed-list") : null;
  const moreBtn = select("#more-btn");

  if (proExp && collapsed && moreBtn) {
    const setState = (open) => {
      proExp.classList.toggle("is-open", open);
      moreBtn.setAttribute("aria-expanded", String(open));
      moreBtn.textContent = open ? "Show less" : "Show more";
      // Optional: ensure the first hidden item is scrolled into view when expanding
      if (open) {
        const firstHidden = collapsed.querySelector("details") || collapsed;
        if (firstHidden) firstHidden.scrollIntoView({ block: "nearest" });
      }
    };

    // Initial: collapsed
    setState(false);

    // Toggle on click
    moreBtn.addEventListener("click", () => {
      setState(!proExp.classList.contains("is-open"));
    });

    // If URL hash points to an element inside the collapsed list, auto-expand
    window.addEventListener("load", () => {
      const { hash } = window.location;
      if (!hash) return;
      const target = select(hash);
      if (target && collapsed.contains(target)) {
        setState(true);
      }
    });
  }
})();
