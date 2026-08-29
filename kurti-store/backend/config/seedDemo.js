const User = require("../models/User");
const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Floral Anarkali Kurti",
    slug: "floral-anarkali-kurti",
    description: "Cotton anarkali kurti with floral print, perfect for daily wear.",
    brand: "YourBrand",
    category: "Kurti",
    fabric: "Cotton",
    occasion: "Casual",
    price: 1299,
    discountPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
    ],
    variants: [
      { size: "S", color: "Blue", stock: 5, sku: "KRT-001-S-BLU" },
      { size: "M", color: "Blue", stock: 10, sku: "KRT-001-M-BLU" },
      { size: "L", color: "Blue", stock: 8, sku: "KRT-001-L-BLU" },
    ],
    isFeatured: true,
  },
  {
    name: "Embroidered Straight Kurti",
    slug: "embroidered-straight-kurti",
    description: "Elegant straight-cut kurti with thread embroidery on the yoke.",
    brand: "YourBrand",
    category: "Kurti",
    fabric: "Rayon",
    occasion: "Festive",
    price: 1599,
    discountPrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80",
      "https://images.unsplash.com/photo-1596783074918-c84cb1bd5d3f?w=600&q=80",
    ],
    variants: [
      { size: "M", color: "Maroon", stock: 6, sku: "KRT-002-M-MRN" },
      { size: "L", color: "Maroon", stock: 4, sku: "KRT-002-L-MRN" },
      { size: "XL", color: "Maroon", stock: 3, sku: "KRT-002-XL-MRN" },
    ],
    isFeatured: true,
  },
  {
    name: "Printed Kurti with Palazzo Set",
    slug: "printed-kurti-palazzo-set",
    description: "Two-piece set with printed kurti and matching palazzo pants.",
    brand: "YourBrand",
    category: "Kurti Set",
    fabric: "Cotton Blend",
    occasion: "Casual",
    price: 1899,
    discountPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
    ],
    variants: [
      { size: "S", color: "Green", stock: 7, sku: "SET-001-S-GRN" },
      { size: "M", color: "Green", stock: 9, sku: "SET-001-M-GRN" },
    ],
    isFeatured: true,
  },
  {
    name: "Chikankari Ethnic Kurti",
    slug: "chikankari-ethnic-kurti",
    description: "Traditional Lucknowi chikankari hand embroidery on soft georgette.",
    brand: "YourBrand",
    category: "Ethnic Wear",
    fabric: "Georgette",
    occasion: "Festive",
    price: 2299,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    ],
    variants: [
      { size: "M", color: "White", stock: 5, sku: "ETH-001-M-WHT" },
      { size: "L", color: "White", stock: 5, sku: "ETH-001-L-WHT" },
    ],
    isFeatured: true,
  },
];

async function seedDemoData() {
  const existingAdmin = await User.findOne({ email: "admin@demo.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Demo Admin",
      email: "admin@demo.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Seeded demo admin -> email: admin@demo.com | password: admin123");
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} demo products`);
  }
}

module.exports = seedDemoData;
