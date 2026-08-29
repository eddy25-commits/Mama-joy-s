import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./Home.css";

export default function Home() {
  usePageMeta(
    null,
    "Shop skincare, makeup, hair care, and beauty essentials in Bantama, Kumasi. Secure Paystack checkout in Ghana cedis, with delivery across Kumasi and beyond."
  );
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", { params: { featured: true } })
      .then((res) => setFeatured(res.data.slice(0, 8)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="eyebrow">Bantama, Kumasi</span>
            <h1 className="hero-title">
              Beauty that <span>speaks</span> for itself
            </h1>
            <hr className="gold-rule" />
            <p className="hero-copy">
              Mama Joy&rsquo;s Cosmetics and Collections brings you trusted skincare, makeup,
              and beauty essentials — sourced with care, delivered with love, right here in
              Kumasi and beyond.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-gold">
                Shop Now
              </Link>
              <a href={SITE.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-outline hero-outline">
                Chat With Us
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-ring" aria-hidden="true" />
            <img
              src="/hero-model.jpg"
              alt="Woman applying Mama Joy's fragrance, holding a pink gift bag"
              className="hero-visual-image"
            />
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <span className="eyebrow">Explore</span>
          <h2>Shop by Category</h2>
          <hr className="gold-rule" />
          <div className="category-grid">
            {SITE.categories.map((cat) => (
              <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} className="category-tile">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <span className="eyebrow">Handpicked</span>
          <h2>Featured Products</h2>
          <hr className="gold-rule" />
          {loading ? (
            <Loader label="Loading products..." />
          ) : featured.length === 0 ? (
            <p className="featured-empty">
              New arrivals coming soon — check back shortly or browse the full shop.
            </p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
          <div className="featured-cta">
            <Link to="/shop" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="promise">
        <div className="container promise-grid">
          <div className="promise-item">
            <h3>Genuine Products</h3>
            <p>Every item is carefully sourced and quality checked before it reaches you.</p>
          </div>
          <div className="promise-item">
            <h3>Fast Local Delivery</h3>
            <p>Same-day delivery within Kumasi, with reliable delivery nationwide.</p>
          </div>
          <div className="promise-item">
            <h3>Secure Payment</h3>
            <p>Pay safely online in Ghana cedis via Paystack — cards, mobile money, and more.</p>
          </div>
        </div>
      </section>
    </div>
  );
}