import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api, { getErrorMessage } from "../api/client";
import { formatGHS, SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./Checkout.css";

export default function Checkout() {
  usePageMeta("Checkout");
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Kumasi",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isKumasi = form.city.trim().toLowerCase().includes("kumasi");
  const deliveryFee = isKumasi ? SITE.deliveryFeeKumasi : SITE.deliveryFeeOther;
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your bag is empty. Add some products before checking out.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: form,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
        })),
        deliveryFee,
      };

      const res = await api.post("/payment/initialize", payload);
      // Persist the reference so the callback page can look it up even after
      // Paystack redirects back and the cart/session state has been cleared.
      sessionStorage.setItem("mjc_last_reference", res.data.reference);
      clearCart();
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container checkout-empty">
        <h1>Your Bag is Empty</h1>
        <p>Add a few favorites before checking out.</p>
        <Link to="/shop" className="btn btn-gold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <span className="eyebrow">Almost There</span>
      <h1>Checkout</h1>
      <hr className="gold-rule" />

      <div className="checkout-grid">
        <form className="checkout-form card" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="For your payment receipt"
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 024xxxxxxx"
            />
          </div>

          <div className="field">
            <label htmlFor="city">City / Town</label>
            <input id="city" name="city" required value={form.city} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Street, landmark, house number"
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Order Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special instructions"
            />
          </div>

          <button type="submit" className="btn btn-gold btn-block" disabled={submitting}>
            {submitting ? "Redirecting to Paystack..." : `Pay ${formatGHS(total)} with Paystack`}
          </button>
          <p className="checkout-secure-note">
            You&rsquo;ll be redirected to Paystack&rsquo;s secure page to complete payment by card
            or mobile money.
          </p>
          <p className="checkout-secure-note">
            By placing this order, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/returns">Return &amp; Refund Policy</Link>.
          </p>
        </form>

        <div className="checkout-summary card">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div className="checkout-summary-item" key={item.productId}>
              <span>
                {item.name} &times; {item.quantity}
              </span>
              <span>{formatGHS(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatGHS(subtotal)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Delivery ({isKumasi ? "Kumasi" : "Outside Kumasi"})</span>
            <span>{formatGHS(deliveryFee)}</span>
          </div>
          <div className="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <span>{formatGHS(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}