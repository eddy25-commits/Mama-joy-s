import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatGHS } from "../config/site";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-label="Shopping bag">
        <div className="cart-drawer-header">
          <h2>Your Bag ({items.length})</h2>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your bag is empty.</p>
            <Link to="/shop" className="btn btn-gold" onClick={() => setIsOpen(false)}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div className="cart-item" key={item.productId}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder" />
                    )}
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">{formatGHS(item.price)}</span>
                    <div className="cart-item-qty">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>{formatGHS(subtotal)}</span>
              </div>
              <p className="cart-note">Delivery fee is calculated at checkout.</p>
              <Link to="/checkout" className="btn btn-primary btn-block" onClick={() => setIsOpen(false)}>
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
