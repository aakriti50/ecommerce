import { useState } from "react";
import api from "../api/client";

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange([...images, data.url]);
    } catch (err) {
      setError(
        "Upload failed — image hosting (Cloudinary) isn't set up yet. Paste an image URL below instead."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const removeImage = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Product Photos</p>

      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="w-20 h-24 object-cover rounded border" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="border rounded px-4 py-2 text-sm cursor-pointer bg-gray-50 hover:bg-gray-100">
          {uploading ? "Uploading..." : "Upload from device"}
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
        <span className="text-xs text-gray-400">or</span>
        <input
          type="text"
          placeholder="Paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <button type="button" onClick={handleAddUrl} className="text-sm font-medium text-brand">
          Add
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
