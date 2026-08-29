import { Link } from "react-router-dom";
import { formatGHS } from "../config/site";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.[0]?.url;
  const outOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-image-wrap">
        {image ? (
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">No Image</div>
        )}
        {outOfStock && <span className="product-card-oos">Out of Stock</span>}
        {product.isFeatured && !outOfStock && (
          <span className="product-card-featured">Featured</span>
        )}
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-footer">
          <span className="product-card-price">{formatGHS(product.price)}</span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={outOfStock}
            onClick={() => addItem(product, 1)}
          >
            {outOfStock ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
