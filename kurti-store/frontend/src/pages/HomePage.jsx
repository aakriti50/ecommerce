import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Kurti", "Kurti Set", "Ethnic Wear", "Dresses"];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/products", { params: { limit: 8 } })
      .then((res) => setFeatured(res.data.products))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-brand to-brand-dark text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">New Season, New Kurtis</h1>
        <p className="mb-6 text-lg opacity-90">Handpicked ethnic wear, delivered to your door</p>
        <Link
          to="/products"
          className="inline-block bg-white text-brand px-6 py-2 rounded-full font-semibold"
        >
          Shop Now
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="bg-gray-100 rounded-lg p-6 text-center font-medium hover:bg-gray-200"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {featured.length === 0 && (
            <p className="col-span-full text-gray-400 text-sm">
              No products yet — add some from the admin API.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
