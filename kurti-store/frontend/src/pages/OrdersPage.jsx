import { useEffect, useState } from "react";
import api from "../api/client";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, []);

  if (orders.length === 0) {
    return <p className="text-center py-16 text-gray-400">No orders yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="border rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Order #{o._id.slice(-6)}</span>
              <span className="capitalize font-medium text-brand">{o.status}</span>
            </div>
            <div className="mt-2 space-y-1">
              {o.items.map((item, i) => (
                <p key={i} className="text-sm">
                  {item.name} × {item.quantity} ({item.size})
                </p>
              ))}
            </div>
            <p className="mt-2 font-semibold">Total: ₹{o.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
