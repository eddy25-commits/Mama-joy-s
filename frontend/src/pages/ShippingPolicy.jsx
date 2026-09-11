import { Link } from "react-router-dom";
import { SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./StaticPage.css";

export default function ShippingPolicy() {
  usePageMeta(
    "Shipping & Delivery Policy",
    `Shipping and delivery information for orders from ${SITE.businessName}.`
  );

  return (
    <div className="container static-page">
      <span className="eyebrow">Delivery Information</span>
      <h1>Shipping &amp; Delivery Policy</h1>
      <hr className="gold-rule" />

      <div className="static-page-content">
        <p>
          We deliver beauty products from {SITE.businessName} in Bantima,
          Kumasi, to selected locations in Kumasi and across Ghana. The
          available delivery area and fee for your order are shown at checkout
          before you pay.
        </p>

        <h2>Delivery areas and fees</h2>
        <p>
          Select your delivery area at checkout to see the applicable fee. Some
          areas may qualify for free delivery, while other areas have a delivery
          charge based on the location. We only accept orders for delivery areas
          currently available in the checkout list.
        </p>

        <h2>Estimated delivery times</h2>
        <ul className="policy-list">
          <li>Orders within Kumasi are typically delivered within 1-2 business days.</li>
          <li>Orders outside Kumasi may take approximately 3-5 business days.</li>
        </ul>
        <p>
          These are estimates and may vary because of product availability,
          location, traffic, public holidays, weather, or other circumstances
          outside our control. We will contact you using the phone number you
          provide if we need more information or if there is a significant delay.
        </p>

        <h2>Processing and delivery arrangements</h2>
        <p>
          We begin preparing your order after Paystack confirms your payment.
          Please make sure your name, phone number, email address, and selected
          delivery area are correct at checkout. Our team may contact you by
          phone or WhatsApp to arrange delivery details.
        </p>

        <h2>Delivery issues</h2>
        <p>
          If your order arrives damaged, is missing an item, or contains the
          wrong product, contact us immediately on <a href={SITE.phoneHref}>{SITE.phone}</a>
          . Please keep the product and its packaging while we review the issue.
          Our eligibility requirements and available resolutions are set out in
          our <Link to="/returns">Return &amp; Refund Policy</Link>.
        </p>

        <h2>Contact us</h2>
        <p>
          For delivery questions, contact us at <a href={SITE.phoneHref}>{SITE.phone}</a> or
          via <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>.
          You can also visit us at {SITE.fullAddress}.
        </p>

        <p className="policy-note">
          Delivery estimates and available delivery areas may change. The fee
          and area displayed at checkout for your order apply before payment is
          completed.
        </p>
      </div>
    </div>
  );
}