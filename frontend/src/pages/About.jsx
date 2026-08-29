import { SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./StaticPage.css";

export default function About() {
  usePageMeta(
    "About Us",
    `Learn about Mama Joy's Cosmetics and Collections, a trusted beauty retailer based in ${SITE.location}.`
  );

  return (
    <div className="container static-page">
      <span className="eyebrow">Our Story</span>
      <h1>About Mama Joy&rsquo;s</h1>
      <hr className="gold-rule" />
      <div className="static-page-content">
        <p>
          Mama Joy&rsquo;s Cosmetics and Collections started with a simple belief: every
          woman deserves access to quality beauty products without compromise. Based in{" "}
          {SITE.location}, we have grown into a trusted name for skincare, makeup, hair
          care, and fragrance across Kumasi and beyond.
        </p>
        <p>
          We carefully select every product on our shelves, working only with suppliers
          we trust, so that when you shop with us, you can be confident you&rsquo;re
          getting the real thing.
        </p>
        <p>
          Whether you&rsquo;re shopping for your everyday routine or preparing for a
          special occasion, our team is here to help you find exactly what you need.
        </p>
      </div>
    </div>
  );
}
