import React, { useState } from "react";
import axios from "axios";
import { Lock, User, Loader2 } from "lucide-react";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setToken(response.data.token);

      // Animate success message
      const successMessage = document.getElementById("success-message");
      successMessage.classList.remove("opacity-0");
      successMessage.classList.add("opacity-100");

      // Reset form
      setTimeout(() => {
        setUsername("");
        setPassword("");
      }, 1000);
    } catch (error) {
      setError("Invalid credentials. Please try again.");

      // Shake animation for error
      const form = document.getElementById("login-form");
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please sign in to continue</p>
          </div>

          <form id="login-form" onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>

            <div
              id="success-message"
              className="text-green-500 text-sm text-center opacity-0 transition-opacity duration-300"
            >
              Login successful!
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
