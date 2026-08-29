const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // S, M, L, XL, XXL
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    brand: { type: String, default: "Your Brand" },
    category: { type: String, required: true }, // Kurti, Kurta Set, Ethnic Wear...
    fabric: { type: String },
    occasion: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String, required: true }], // Cloudinary URLs
    variants: [variantSchema],
    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
