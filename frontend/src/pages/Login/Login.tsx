import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      navigate("/homelayout");
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`/api/auth/login`, formData);
      const { token, user } = response.data;

      localStorage.setItem("accessToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("userData", JSON.stringify(user));

      toast.success("Successfully logged in!");
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/homelayout"));
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-purple-900">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Welcome Back!</h1>
          <p className="text-sm text-gray-500 mt-1">Access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center">
            <label className="w-32 text-sm font-medium text-gray-600" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="ml-1 text-purple-700 font-medium hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;
