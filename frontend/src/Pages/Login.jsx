import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Live validation
        if (value.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (value.length > 30) {
            setError("Password must not exceed 30 characters.");
            return;
        }
        if (!/[A-Z]/.test(value)) {
            setError("Must include an uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(value)) {
            setError("Must include a lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(value)) {
            setError("Must include a number.");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            setError("Must include a special character.");
            return;
        }

        setError(""); // Valid
    };

    return (
        <>
            <form>
                <h2 className="text-4xl mb-3 font-[700]">LOG IN</h2>
                <div className="grid gap-3">
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="email"
                            id="emailInput"
                            className="border-2 border-black rounded-md p-2 text-2xl font-bold"
                            placeholder="Email..."
                            required
                            autoComplete="email"
                        />
                        <div className="relative flex flex-col">
                            <div className="relative flex">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="passwordInput"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    maxLength={30}
                                    className="border-2 border-black rounded-md p-2 text-2xl font-bold w-full"
                                    placeholder="Password..."
                                    required
                                    autoComplete="current-password"
                                />
                                <span
                                    className="absolute top-5 right-5 cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                            {error && (
                                <div className="text-red-600 text-lg mt-1">{error}</div>
                            )}
                        </div>
                        <label
                            htmlFor="rememberme"
                            className="text-left text-xl flex items-center"
                        >
                            <span className="relative flex items-center">
                                <input
                                    id="rememberme"
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => setChecked(!checked)}
                                    className="appearance-none w-5 h-5 border rounded-md border-gray-300 checked:bg-gray-500 checked:border-transparent cursor-pointer"
                                />
                                {checked && (
                                    <span className="absolute left-0 top-0 w-5 h-5 flex items-center justify-center pointer-events-none text-white text-md">
                                        ✔
                                    </span>
                                )}
                            </span>
                            &nbsp; Remember Me
                        </label>
                    </div>
                    <div className="grid">
                        <button className="border-2 bg-amber-200 hover:bg-amber-300 border-black rounded-md p-2 text-2xl font-bold" type="submit">
                            LOG IN
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}