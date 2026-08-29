import { useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../config/site";
import "./Footer.css";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-ring">
              <img src="/logo.png" alt="MJ Cosmetics and Collections" className="footer-logo-mark" />
            </span>
            <span className="footer-logo-text">
              <span className="footer-logo-name">MJ</span>
              <span className="footer-logo-sub">Cosmetics &amp; Collections</span>
            </span>
          </div>
          <p className="footer-tagline">
            Quality beauty essentials for the woman who knows her worth.
          </p>
        </div>

        <div className="footer-col footer-accordion">
          <button
            type="button"
            className="footer-heading footer-toggle"
            onClick={() => toggleSection("visit")}
            aria-expanded={openSection === "visit"}
          >
            Visit
            <svg className="footer-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`footer-col-content ${openSection === "visit" ? "is-open" : ""}`}>
            <p>{SITE.fullAddress}</p>
            <p>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </p>
            <p>
              <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </p>
          </div>
        </div>

        <div className="footer-col footer-accordion">
          <button
            type="button"
            className="footer-heading footer-toggle"
            onClick={() => toggleSection("shop")}
            aria-expanded={openSection === "shop"}
          >
            Shop
            <svg className="footer-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`footer-col-content ${openSection === "shop" ? "is-open" : ""}`}>
            <p>
              <Link to="/shop">All Products</Link>
            </p>
            <p>
              <Link to="/about">About Us</Link>
            </p>
            <p>
              <Link to="/contact">Contact</Link>
            </p>
          </div>
        </div>

        <div className="footer-col footer-accordion">
          <button
            type="button"
            className="footer-heading footer-toggle"
            onClick={() => toggleSection("policies")}
            aria-expanded={openSection === "policies"}
          >
            Policies
            <svg className="footer-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`footer-col-content ${openSection === "policies" ? "is-open" : ""}`}>
            <p>
              <Link to="/returns">Return &amp; Refund Policy</Link>
            </p>
            <p>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </p>
            <p>
              <Link to="/terms">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} Mama Joy&rsquo;s Cosmetics and Collections. All rights reserved.
        </div>
      </div>
    </footer>
  );
}