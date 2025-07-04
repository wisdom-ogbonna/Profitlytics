import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-400 p-4 overflow-x-hidden">
      <h1 className="text-4xl font-extrabold text-black bg-white/40 backdrop-blur rounded-xl px-6 py-4 mb-6 shadow">
        PROFITLYTICS
      </h1>
      <div className="bg-yellow-50 border border-black rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6">
        {isSignup ? <Signup /> : <Login />}

        <div className="text-center text-sm">
          {isSignup ? (
            <p className="text-lg">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Log In
              </button>
            </p>
          ) : (
            <p className="text-lg">
              Don't have an account?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
