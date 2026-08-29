import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-brand">
          YourBrand
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/products?category=Kurti">Kurtis</Link>
          <Link to="/products?category=Kurti+Set">Sets</Link>
          <Link to="/products?category=Ethnic+Wear">Ethnic Wear</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              {user.role === "admin" && <Link to="/admin/products" className="font-semibold text-brand">Admin</Link>}
              <Link to="/orders">My Orders</Link>
              <button onClick={logout} className="text-gray-500">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium">Login</Link>
          )}
          <Link to="/cart" className="relative">
            🛍️
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
