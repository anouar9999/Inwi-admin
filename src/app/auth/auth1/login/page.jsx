'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingLabelInput from '@/app/components/input/input';
import { Mail, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminSetup, setIsAdminSetup] = useState(true);
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
    console.log('Submitting:', { username, password, email });
    try {
      const url = isAdminSetup
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login.php`;
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

      if (data.success || data.message === 'Admin created successfully') {
        console.log(data.message);
        if (!isAdminSetup) {
          localStorage.setItem('adminSessionToken', data.session_token);
          localStorage.setItem('adminId', data.admin_id);
          localStorage.setItem('adminUsername', data.username);
        }
        router.push('/'); // Redirect to admin dashboard
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
    <div className="relative min-h-screen flex flex-col md:flex-row">
    {/* Full screen background image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/freepik__a-gaming-character-with-a-sitting-at-a-violet-desk__75317.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
        className="select-none"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-bl from-gray-900/95 via-gray-900/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-gray-900/95 via-gray-900/80 to-transparent"></div>
    </div>

    {/* Left side content - hidden on mobile */}
    <div className="relative z-10 w-full md:w-1/2 p-12 hidden md:flex flex-col justify-center">
      <div className="space-y-4 max-w-xl">
        <div className="mb-6 w-56">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
            alt="Travelzo"
            width={220}
            height={40}
            className="w-full h-auto"
          />
        </div>
        
        <h1 className="font-custom tracking-widest text-5xl font-bold text-white leading-tight">
          Unleash the traveler
          <br />
          <span className="text-primary">inside you</span>, Enjoy your
          <br />
          Dream Vacation
        </h1>

        <p className="text-gray-300 text-sm max-w-md">
          Get started with the easiest and most secure website to buy travel tickets
        </p>
      </div>
    </div>

    {/* Right side - Login Form */}
    <div className="relative z-10 w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center px-6 py-8">
      {/* Logo container - centered on mobile */}
      <div className="md:hidden w-48 mb-12">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
          alt="Travelzo"
          width={220}
          height={40}
          className="w-full h-auto"
        />
      </div>

      <div className="w-full max-w-md">
        <div className="space-y-3 mb-8 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
            Log in to <br />
            admin panel<span className="text-primary">.</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-sm">
            Get started with the easiest and most secure website to buy travel tickets
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabelInput
            label="Username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {isAdminSetup && (
            <FloatingLabelInput
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <FloatingLabelInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-primary text-base sm:text-[12pt] text-white py-3 font-custom tracking-widest rounded-full hover:bg-primary/60 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isAdminSetup ? 'Create Admin' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}
