import { useState } from "react";
import { supabase } from "../lib/client";
import { FaUtensils, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      console.log("✅ Logged in:", data);
      window.location.href = "/dashboard/index";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3a1f1d] via-[#4b2b2a] to-[#2a1615] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 pointer-events-none" />

      {/* Login card */}
      <form
        onSubmit={handleLogin}
        className="relative bg-[#fffaf7] shadow-2xl rounded-2xl p-8 w-full max-w-sm z-10 border border-rose-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-rose-600 text-white rounded-full p-4 shadow-lg">
            <FaUtensils className="text-3xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-[#6b1e1f] mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Log in to manage your restaurant system
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 focus:border-rose-400 rounded-lg p-3 w-full text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-200 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-300 focus:border-rose-400 rounded-lg p-3 w-full text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-200 outline-none pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-lg w-full transition transform hover:scale-[1.02]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} Your Restaurant Name
        </p>
      </form>
    </div>
  );
}
