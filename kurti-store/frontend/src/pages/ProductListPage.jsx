import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category, sort, limit: 24 } })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  const updateSort = (val) => {
    const p = new URLSearchParams(searchParams);
    p.set("sort", val);
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{category || "All Products"}</h1>
        <select
          className="border rounded px-3 py-1 text-sm"
          value={sort}
          onChange={(e) => updateSort(e.target.value)}
        >
          <option value="">Sort: Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-gray-400 text-sm">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
