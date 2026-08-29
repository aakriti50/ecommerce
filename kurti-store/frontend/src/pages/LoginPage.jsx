import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-brand text-white font-semibold py-2 rounded-full">Login</button>
      </form>
      <p className="text-sm text-center mt-4">
        New here? <Link to="/signup" className="text-brand font-medium">Create an account</Link>
      </p>
    </div>
  );
}
