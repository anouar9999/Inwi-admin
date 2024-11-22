"use client"
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
    if (password !== confirmPassword) {
      setError(true);
      return;
    }
    // If registration is successful, redirect to login or home page
    router.push("/login")
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Background Image */}
      <div className="relative w-2/3 overflow-hidden">
        <Image
          src="https://img.freepik.com/free-photo/cool-scene-with-futuristic-dragon-creature_23-2151201656.jpg"
          alt="Epic background"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900"></div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-1/3 bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
        <h1 className="text-7xl font-custom text-white  text-center">GAMIUS</h1>

          <h2 className="text-xl font-semibold text-white text-center pt-12 mb-8">Create Account 🚀</h2>
          {error && (
            <p className="text-red-500 text-sm mb-4">Oops! Passwords dont match!</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cut-corners"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cut-corners"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cut-corners"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#ff4700] text-white py-2 rounded hover:bg-orange-700 transition duration-200 cut-corners relative overflow-hidden">
              <span className="relative z-10">Register</span>
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account? <a href="/auth/auth1/login" className="text-[#ff4700] hover:underline">Login here</a>
          </p>
        </div>
      </div>
      <style jsx global>{`
        .cut-corners {
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        input.cut-corners::before,
        input.cut-corners::after {
          content: '';
          position: absolute;
          background-color: #1f2937; /* Tailwind's gray-800 */
          z-index: 1;
        }
        input.cut-corners::before {
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          transform: translateY(-1px) translateX(1px);
        }
        input.cut-corners::after {
          bottom: 0;
          left: 0;
          width: 12px;
          height: 12px;
          transform: translateY(1px) translateX(-1px);
        }
        button.cut-corners::before,
        button.cut-corners::after {
          content: '';
          position: absolute;
          background-color: #ea580c; /* Tailwind's orange-600 */
          z-index: 1;
        }
        button.cut-corners::before {
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          transform: translateY(-1px) translateX(1px);
        }
        button.cut-corners::after {
          bottom: 0;
          left: 0;
          width: 12px;
          height: 12px;
          transform: translateY(1px) translateX(-1px);
        }
        button.cut-corners:hover::before,
        button.cut-corners:hover::after {
          background-color: #c2410c; /* Tailwind's orange-700 */
        }
      `}</style>
    </div>
  );
}