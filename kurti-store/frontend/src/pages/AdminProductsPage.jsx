import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", { params: { limit: 100 } })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this product from the store?")) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Admin access only. Login with your admin account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-brand text-white font-semibold px-5 py-2 rounded-full"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No products yet. Add your first one!</p>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 border rounded-lg p-3">
              <img src={p.images?.[0]} className="w-16 h-20 object-cover rounded bg-gray-100" />
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.category} · ₹{p.discountPrice || p.price}
                </p>
              </div>
              <Link
                to={`/admin/products/${p._id}/edit`}
                className="text-sm font-medium text-brand"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-sm font-medium text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
