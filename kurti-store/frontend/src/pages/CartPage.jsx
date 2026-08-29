import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/products" className="text-brand font-semibold">Continue Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 border-b pb-4">
            <img src={item.image} className="w-20 h-24 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Size: {item.size} {item.color && `| Color: ${item.color}`}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.productId, item.size, item.color, Number(e.target.value))
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-bold">Total: ₹{total}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-brand text-white font-semibold px-8 py-3 rounded-full"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
