import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Overview", end: true },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/products/new", label: "Add Product" },
    { to: "/admin/orders", label: "Orders" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/logo.png" alt="" className="admin-sidebar-mark" />
          <span>Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? "is-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">{admin?.name}</div>
          <button type="button" className="btn btn-outline btn-sm btn-block" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <div className="container admin-content-inner">{children}</div>
      </main>
    </div>
  );
}
