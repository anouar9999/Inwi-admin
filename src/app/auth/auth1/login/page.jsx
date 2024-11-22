"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminSetup();
  }, []);

  const checkAdminSetup = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php`);
      const data = await response.json();
      setIsAdminSetup(data.isEmpty);
    } catch (error) {
      console.error('Error checking admin setup:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = isAdminSetup ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php`: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login.php`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isAdminSetup ? { username, password, email } : { username, password }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success || data.message === "Admin created successfully") {
        console.log(data.message);
        if (!isAdminSetup) {
          localStorage.setItem('adminSessionToken', data.session_token);
          localStorage.setItem('adminId', data.admin_id);
          localStorage.setItem('adminUsername', data.username);
        }
        router.push("/"); // Redirect to admin dashboard
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Background Image */}
      <div className="relative w-full md:w-2/3 h-1/3 md:h-full overflow-hidden">
        <Image
          src="https://img.freepik.com/free-photo/cool-scene-with-futuristic-dragon-creature_23-2151201656.jpg"
          alt="Epic background"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-gray-900"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/3 bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Brand Logo */}
          <div className="mb-6 md:mb-8 flex justify-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
              alt="Brand Logo"
              width={80}
              height={40}
              className="cut-corners"
            />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-custom text-white text-center mb-6 md:mb-8">
            {isAdminSetup ? 'ADMIN SETUP' : 'ADMIN LOGIN'}
          </h1>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="relative">
              <label htmlFor="username" className="text-white mb-2 block">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 md:py-3 bg-gray-800 text-white rounded  focus:ring-1 focus:ring-orange-500 angular-cut"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="text-white mb-2 block">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 md:py-3 bg-gray-800 text-white rounded    focus:ring-1 focus:ring-orange-500 angular-cut"
                required
              />
            </div>
            {isAdminSetup && (
              <div className="relative">
                <label htmlFor="email" className="text-white mb-2 block">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 md:py-3 bg-gray-800 text-white rounded   focus:ring-1 focus:ring-orange-500 cut-corners"
                  required
                />
              </div>
            )}
            <button 
              type="submit" 
              className="w-full bg-primary text-white mt-4 md:mt-6 py-2 md:py-3 rounded hover:bg-primary transition duration-200 angular-cut relative overflow-hidden"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? 'Processing...' : (isAdminSetup ? 'Create Admin' : 'Login')}
              </span>
            </button>
          </form>
        </div>
      </div>
      <style jsx global>{`
        .angular-cut {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut::before,
        .angular-cut::after {
          content: '';
          position: absolute;
          background-color: #374151;
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
        .angular-cut-button {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut-button::before,
        .angular-cut-button::after {
          content: '';
          position: absolute;
          background-color: #78350f;
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 2px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 10px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
}