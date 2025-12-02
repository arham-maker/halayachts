'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminRegister() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin created successfully. You can now log in.');
        setTimeout(() => router.push('/admin'), 2000);
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-light tracking-wider">
              Create Admin Account
            </h2>
            <p className="text-base md:text-lg lg:text-xl sm:max-w-5xl mx-auto leading-relaxed tracking-wider font-light">
              Simple one-time setup to access your dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-base md:text-lg leading-relaxed tracking-wider font-light mb-2"
              >
                Name (optional)
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 pl-11 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-[#c8a75c] transition duration-200 bg-gray-50 text-base md:text-lg leading-relaxed tracking-wider font-light"
                  placeholder="Hala Yachts Admin"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base md:text-lg leading-relaxed tracking-wider font-light mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-11 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-[#c8a75c] transition duration-200 bg-gray-50 text-base md:text-lg leading-relaxed tracking-wider font-light"
                  placeholder="admin@halayachts.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base md:text-lg leading-relaxed tracking-wider font-light mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-11 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-[#c8a75c] transition duration-200 bg-gray-50 text-base md:text-lg leading-relaxed tracking-wider font-light"
                  placeholder="At least 8 characters"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-base md:text-lg leading-relaxed tracking-wider font-light mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-11 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-[#c8a75c] transition duration-200 bg-gray-50 text-base md:text-lg leading-relaxed tracking-wider font-light"
                  placeholder="Re-enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-[#c8a75c] text-base p-3 md:text-base font-medium rounded-lg cursor-pointer hover:bg-opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a75c] disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <ImSpinner8 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                    Creating admin...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="text-base leading-relaxed tracking-wider font-light text-gray-600 hover:text-[#c8a75c] cursor-pointer"
          >
            Already have an admin? Go to Login
          </button>
        </div>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
          hideProgressBar
          closeButton={false}
          toastClassName="rounded-xl"
        />
      </div>
    </div>
  );
}


