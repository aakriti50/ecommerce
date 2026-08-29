import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="mb-4">Please login to continue checkout.</p>
        <button onClick={() => navigate("/login")} className="bg-brand text-white px-6 py-2 rounded-full">
          Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.productId,
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.qty,
        price: i.price,
      }));

      const { data } = await api.post("/orders", {
        items: orderItems,
        shippingAddress: address,
        itemsPrice: total,
        shippingPrice: 0,
        totalPrice: total,
        paymentMethod: "razorpay",
      });

      // Demo mode: no real Razorpay keys, so simulate a successful payment
      // instead of opening the real checkout popup.
      if (data.razorpayOrder?.demo) {
        await api.post(`/orders/${data.order._id}/verify-payment`, {
          razorpay_order_id: data.razorpayOrder.id,
          razorpay_payment_id: `demo_pay_${Date.now()}`,
          razorpay_signature: "demo_signature",
        });
        clearCart();
        navigate("/orders");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Check your connection.");
        setPlacing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Your Brand",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          await api.post(`/orders/${data.order._id}/verify-payment`, response);
          clearCart();
          navigate("/orders");
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#d6336c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-3">
        <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="border rounded px-3 py-2" />
        <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} className="border rounded px-3 py-2" />
        <input name="line1" placeholder="Address Line 1" value={address.line1} onChange={handleChange} className="border rounded px-3 py-2" />
        <input name="line2" placeholder="Address Line 2 (optional)" value={address.line2} onChange={handleChange} className="border rounded px-3 py-2" />
        <div className="grid grid-cols-3 gap-3">
          <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <p className="text-lg font-bold">Total: ₹{total}</p>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="bg-brand text-white font-semibold px-8 py-3 rounded-full disabled:opacity-50"
        >
          {placing ? "Processing..." : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}
