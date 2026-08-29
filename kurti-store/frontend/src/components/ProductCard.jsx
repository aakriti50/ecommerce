import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 truncate">{product.brand}</p>
        <p className="text-sm text-gray-500 truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold">₹{price}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
