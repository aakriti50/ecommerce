const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// @route GET /api/products  (list with filters, search, sort, pagination)
router.get("/", async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };
    if (keyword) query.$text = { $search: keyword };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) query["variants.size"] = size;
    if (color) query["variants.color"] = color;

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { avgRating: -1 };

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Product.countDocuments(query);

    res.json({ products, page: Number(page), pages: Math.ceil(count / limit), total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "reviews.user",
      "name"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/products  (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route PUT /api/products/:id  (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route DELETE /api/products/:id  (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Product deactivated" });
});

// @route POST /api/products/:id/reviews
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    product.reviews.push({ user: req.user._id, rating, comment });
    product.numReviews = product.reviews.length;
    product.avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
