import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const validatePassword = (value) => {
    const rules = [];
    if (value.length < 8) rules.push("At least 8 characters.");
    if (value.length > 30) rules.push("No more than 30 characters.");
    if (!/[A-Z]/.test(value)) rules.push("Include an uppercase letter.");
    if (!/[a-z]/.test(value)) rules.push("Include a lowercase letter.");
    if (!/[0-9]/.test(value)) rules.push("Include a number.");
    if (!/[^A-Za-z0-9]/.test(value)) rules.push("Include a special character.");
    return rules;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(validatePassword(value));
  };

  return (
    <form className="space-y-4" aria-label="Signup Form">
      <h2 className="text-3xl font-bold text-center">SIGN UP</h2>
      <div className="space-y-3">
        <label htmlFor="name" className="sr-only">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name..."
          autoComplete="name"
          required
          className="w-full border border-black rounded-lg p-3 text-base focus:outline-none focus:ring focus:border-blue-500"
        />

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
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password..."
            maxLength={30}
            autoComplete="new-password"
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

        {errors.length > 0 && (
          <ul className="text-red-600 text-sm mt-2 space-y-1 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-amber-300 hover:bg-amber-400 text-black font-bold rounded-lg p-3 border border-black shadow focus:outline-none focus:ring"
      >
        SIGN UP
      </button>
    </form>
  );
}
