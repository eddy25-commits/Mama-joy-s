import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SITE } from "../config/site";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Mama Joy's Cosmetics and Collections" className="navbar-logo-mark" />
          <span className="navbar-logo-text">
            <span className="navbar-logo-mj">MJ</span>
            <span className="navbar-logo-sub">Cosmetics &amp; Collections</span>
          </span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `navbar-link ${isActive ? "is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <a className="navbar-link navbar-link-phone" href={SITE.phoneHref}>
            {SITE.phone}
          </a>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-cart"
            onClick={() => setIsOpen(true)}
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 5H17M17 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {itemCount > 0 && <span className="navbar-cart-count">{itemCount}</span>}
          </button>
          <button
            type="button"
            className="navbar-burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
