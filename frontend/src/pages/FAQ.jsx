import { useState } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import "./StaticPage.css";
import "./FAQ.css";

export default function FAQ() {
  usePageMeta(
    "FAQs",
    "Frequently asked questions about Mama Joy's Cosmetics and Collections"
  );

  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "What products do you offer?",
      answer:
        "We offer a wide range of cosmetics and beauty products including skincare, makeup, hair care, fragrances, and more. Browse our Shop to see our current collection.",
    },
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our Shop, select the products you'd like, add them to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information.",
    },
    {
      question: "What are your delivery times?",
      answer:
        "Delivery times depend on your location. Orders within Kumasi typically arrive within 1-2 business days. For areas outside Kumasi, delivery may take 3-5 business days.",
    },
    {
      question: "Do you ship outside Kumasi?",
      answer:
        "Yes! We deliver to various locations across Ghana. Check our Shipping & Delivery Policy for delivery times and information about delivery fees.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept mobile money payments and card payments through our secure payment gateway. Payment details are encrypted for your safety.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Once an order has been placed, please contact us immediately. We can only cancel or modify orders before they've been prepared for delivery.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept eligible returns and refund requests raised within 2 days of delivery for unused, unopened products in original packaging. Please refer to our Returns Policy for complete details.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Absolutely! We work only with authorized suppliers and guarantee the authenticity of all products sold. Every item is genuine and original.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your order using our Track Order page. You'll need your order number and email address.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "Currently, we don't offer gift wrapping services. However, our products come well-packaged and are suitable for gift-giving.",
    },
    {
      question: "What if I receive a damaged product?",
      answer:
        "If you receive a damaged product, please contact us within 24 hours with photos. We'll arrange for a replacement or refund immediately.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us through our Contact page or email us directly. We typically respond within 24 hours.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container static-page">
      <span className="eyebrow">Got Questions?</span>
      <h1>Frequently Asked Questions</h1>
      <hr className="gold-rule" />

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={expandedIndex === index}
            >
              <span>{faq.question}</span>
              <span className="faq-toggle">
                {expandedIndex === index ? "−" : "+"}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <p>Didn't find what you're looking for?</p>
        <a href="/contact" className="cta-link">
          Get in touch with us →
        </a>
      </div>
    </div>
  );
}
