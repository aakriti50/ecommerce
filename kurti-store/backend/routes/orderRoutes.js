const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Use real Razorpay only if keys are actually filled in — otherwise fall back
// to a simulated payment flow so checkout still works while you set it up.
const hasRazorpayKeys = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const razorpay = hasRazorpayKeys
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// @route POST /api/orders  -> create order in DB + Razorpay order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice, paymentMethod } =
      req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
    });

    if (paymentMethod === "razorpay") {
      let razorpayOrder;
      if (!hasRazorpayKeys) {
        // Mock order object shaped like a real Razorpay order, so the frontend
        // checkout flow works identically without needing real API keys.
        razorpayOrder = {
          id: `demo_order_${order._id}`,
          amount: Math.round(totalPrice * 100),
          currency: "INR",
          demo: true,
        };
      } else {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalPrice * 100), // paise
          currency: "INR",
          receipt: order._id.toString(),
        });
      }
      order.paymentResult = { razorpayOrderId: razorpayOrder.id, status: "created" };
      await order.save();
      return res.status(201).json({ order, razorpayOrder });
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route POST /api/orders/:id/verify-payment
router.post("/:id/verify-payment", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (hasRazorpayKeys) {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

      if (expectedSign !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }
    }
    // In DEMO_MODE we skip signature verification since there's no real
    // Razorpay checkout happening — payment is simulated as successful.

    const order = await Order.findById(req.params.id);
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "confirmed";
    order.paymentResult = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "paid",
    };
    await order.save();
    res.json({ message: "Payment verified", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route GET /api/orders/my
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route GET /api/orders  (admin - all orders)
router.get("/", protect, admin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// @route PUT /api/orders/:id/status  (admin)
router.put("/:id/status", protect, admin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
});

module.exports = router;
