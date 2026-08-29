import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import ImageUploader from "../components/ImageUploader";

const CATEGORIES = ["Kurti", "Kurti Set", "Ethnic Wear", "Dresses"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

const emptyVariant = () => ({ size: "", color: "", stock: 5, sku: "" });

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export default function AdminProductFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "YourBrand",
    category: "Kurti",
    fabric: "",
    occasion: "",
    price: "",
    discountPrice: "",
    images: [],
  });
  const [variants, setVariants] = useState([emptyVariant()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    // fetch by id via the list endpoint (product detail route is keyed by slug)
    api.get("/products", { params: { limit: 200 } }).then((res) => {
      const p = res.data.products.find((prod) => prod._id === id);
      if (p) {
        setForm({
          name: p.name,
          description: p.description,
          brand: p.brand,
          category: p.category,
          fabric: p.fabric || "",
          occasion: p.occasion || "",
          price: p.price,
          discountPrice: p.discountPrice || "",
          images: p.images || [],
        });
        setVariants(p.variants?.length ? p.variants : [emptyVariant()]);
      }
    });
  }, [id, isEdit]);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Admin access only. Login with your admin account.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleVariantChange = (idx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariant = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.images.length === 0) return setError("Add at least one product photo.");
    if (variants.some((v) => !v.size || !v.color || !v.sku))
      return setError("Fill in size, color, and SKU for every variant.");

    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: slugify(form.name),
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        variants: variants.map((v) => ({ ...v, stock: Number(v.stock) })),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Floral Anarkali Kurti"
            className="border rounded px-3 py-2 w-full mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Fabric, fit, styling details..."
            className="border rounded px-3 py-2 w-full mt-1"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Fabric</label>
            <input
              name="fabric"
              value={form.fabric}
              onChange={handleChange}
              placeholder="e.g. Cotton"
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="1299"
              className="border rounded px-3 py-2 w-full mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Discount Price (₹, optional)</label>
            <input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={handleChange}
              placeholder="999"
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </div>
        </div>

        <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Sizes, Colors & Stock</label>
            <button type="button" onClick={addVariant} className="text-sm text-brand font-medium">
              + Add variant
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select
                  value={v.size}
                  onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                  className="border rounded px-2 py-2 text-sm"
                >
                  <option value="">Size</option>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                  className="border rounded px-2 py-2 text-sm flex-1"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                  className="border rounded px-2 py-2 text-sm w-20"
                />
                <input
                  placeholder="SKU (unique code)"
                  value={v.sku}
                  onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                  className="border rounded px-2 py-2 text-sm w-32"
                />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 text-sm">×</button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            SKU is just a unique code you make up, e.g. KRT-001-M-BLU
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-white font-semibold py-3 rounded-full disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
