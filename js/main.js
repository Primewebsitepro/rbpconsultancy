/* RBP Consultancy — site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* Email address that receives website enquiries.
     TODO: confirm this address with RBP before launch. */
  var CONTACT_EMAIL = "info@rbpconsultancy.com";

  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primaryNav");

  /* ---- Sticky header: solid navy background once the page is scrolled ---- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile navigation ---- */
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1200) setMenu(false);
    });
  }

  /* ---- Restrained scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Contact form: validates, then opens the visitor's email app with the enquiry ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var body = [
        "Name: " + data.get("name"),
        "Company: " + (data.get("company") || "-"),
        "Email: " + data.get("email"),
        "Country: " + (data.get("country") || "-"),
        "",
        "What are you looking to achieve?",
        data.get("message")
      ].join("\n");
      var subject = "Website enquiry from " + data.get("name");
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      if (status) {
        status.textContent = "Thank you. Your email app should now open with your message ready to send.";
      }
    });
  }
})();
