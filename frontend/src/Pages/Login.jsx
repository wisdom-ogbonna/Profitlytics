import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-4" aria-label="Login Form">
      <h2 className="text-3xl font-bold text-center">LOG IN</h2>
      <div className="space-y-3">
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email..."
          autoComplete="email"
          required
          className="w-full border border-black rounded-lg p-3 text-base focus:outline-none focus:ring focus:border-blue-500"
        />
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password..."
            autoComplete="current-password"
            required
            className="w-full border border-black rounded-lg p-3 text-base pr-10 focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-black focus:outline-none"
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="text-left flex items-center space-x-2">
        <input
          id="remember"
          type="checkbox"
          className="border border-gray-400 rounded"
        />
        <label htmlFor="remember" className="text-sm">Remember Me</label>
      </div>
      <p className="text-sm hover:underline text-right"><a href="">Forgot Password?</a></p>
      </div>
      <button
        type="submit"
        className="w-full bg-amber-300 hover:bg-amber-400 text-black font-bold rounded-lg p-3 border border-black shadow focus:outline-none focus:ring"
      >
        LOG IN
      </button>
    </form>
  );
}
