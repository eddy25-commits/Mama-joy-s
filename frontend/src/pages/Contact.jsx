import { SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./StaticPage.css";

export default function Contact() {
  usePageMeta(
    "Contact Us",
    `Visit Mama Joy's Cosmetics and Collections at ${SITE.fullAddress}, or reach us by phone or WhatsApp at ${SITE.phone}.`
  );

  return (
    <div className="container static-page">
      <span className="eyebrow">Get In Touch</span>
      <h1>Contact Us</h1>
      <hr className="gold-rule" />
      <div className="contact-grid">
        <div className="contact-item card">
          <h3>Visit Our Shop</h3>
          <p>{SITE.fullAddress}</p>
        </div>
        <div className="contact-item card">
          <h3>Call Us</h3>
          <p>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
          </p>
        </div>
        <div className="contact-item card">
          <h3>WhatsApp</h3>
          <p>
            <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">
              Message us directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
