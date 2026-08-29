import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => {
      setProduct(res.data);
      setColor(res.data.variants?.[0]?.color || "");
    });
  }, [slug]);

  if (!product) return <p className="text-center py-10 text-gray-400">Loading...</p>;

  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const handleAddToCart = () => {
    if (!size) return alert("Please select a size");
    addToCart(product, size, color);
  };

  const handleBuyNow = () => {
    if (!size) return alert("Please select a size");
    addToCart(product, size, color);
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.images[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2 mt-3">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`w-16 h-20 rounded overflow-hidden border-2 ${
                i === activeImg ? "border-brand" : "border-transparent"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        {product.avgRating > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            ★ {product.avgRating.toFixed(1)} ({product.numReviews} reviews)
          </p>
        )}

        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Select Size</p>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-12 h-12 rounded border font-medium ${
                  size === s ? "border-brand bg-brand text-white" : "border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleAddToCart}
            className="flex-1 border-2 border-brand text-brand font-semibold py-3 rounded-full"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-brand text-white font-semibold py-3 rounded-full"
          >
            Buy Now
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-600 leading-relaxed">
          <h3 className="font-semibold text-gray-800 mb-1">Product Details</h3>
          <p>{product.description}</p>
          {product.fabric && <p className="mt-1">Fabric: {product.fabric}</p>}
          {product.occasion && <p>Occasion: {product.occasion}</p>}
        </div>
      </div>
    </div>
  );
}
