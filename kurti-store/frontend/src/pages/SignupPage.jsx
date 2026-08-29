import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold mb-6 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="border rounded px-3 py-2" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border rounded px-3 py-2" required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border rounded px-3 py-2" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-brand text-white font-semibold py-2 rounded-full">Sign Up</button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-brand font-medium">Login</Link>
      </p>
    </div>
  );
}
