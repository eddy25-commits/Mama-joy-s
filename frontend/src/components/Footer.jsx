import { Link } from "react-router-dom";
import { SITE } from "../config/site";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <img src="/logo.png" alt="" className="footer-logo-mark" />
            <span>
              <span className="footer-logo-mj">MJ</span>
              <span className="footer-logo-sub">Cosmetics &amp; Collections</span>
            </span>
          </div>
          <p className="footer-tagline">
            Quality beauty essentials for the woman who knows her worth.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Visit</div>
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

        <div className="footer-col">
          <div className="footer-heading">Shop</div>
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

        <div className="footer-col">
          <div className="footer-heading">Policies</div>
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
      <div className="footer-bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} Mama Joy&rsquo;s Cosmetics and Collections. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
