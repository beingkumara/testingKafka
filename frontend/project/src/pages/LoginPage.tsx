import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Failed to log in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden">
      {/* Full-bleed F1 race start background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578255321055-d2c70c27ed6d?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      {/* Dark gradient overlay — left side darker for card readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-800/80 to-transparent" />

      {/* Speed lines accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary-500 via-primary-400 to-transparent opacity-80" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 md:ml-16 md:mr-auto md:max-w-sm">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card — outer radius xl (12px) wraps inner content with p-8 (32px) */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              background: 'rgba(10, 10, 14, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(225,6,0,0.15)',
            }}
          >
            {/* Red accent top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-600 via-primary-500 to-transparent" />

            {/* Angular corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-primary-600/10"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
            />

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-primary-500 uppercase tracking-[0.3em]">Paddock Access</span>
                </div>
                <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-sans normal-case tracking-normal">
                  Log in to access your Formula 1 dashboard
                </p>
              </div>

              {/* Error message */}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-600/10 border border-primary-600/40 text-primary-400 p-3 rounded-md mb-6 text-sm font-mono"
                >
                  {formError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="login-email" className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="f1-input"
                    placeholder="your.email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="login-password" className="block text-xs font-mono text-gray-500 uppercase tracking-widest">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary-500 hover:text-primary-400 font-mono"
                      style={{ transition: 'color 200ms ease-out' }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="f1-input pr-12"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    {/* Show/hide button — 44px hit area */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-gray-500 hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-r-md"
                      onClick={() => {
                        const cursor = passwordInputRef.current?.selectionStart || 0;
                        setShowPassword(!showPassword);
                        setTimeout(() => {
                          if (passwordInputRef.current) {
                            passwordInputRef.current.focus();
                            passwordInputRef.current.setSelectionRange(cursor, cursor);
                          }
                        }, 0);
                      }}
                      style={{ transition: 'color 150ms ease-out' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm mt-6 text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-primary-500 hover:text-primary-400 font-medium"
                    style={{ transition: 'color 200ms ease-out' }}
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side — decorative text (desktop only) */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-end pointer-events-none select-none">
        <div
          className="text-[8rem] font-heading font-black leading-none text-white/5 tracking-tighter"
        >
          F1
        </div>
        <div className="text-xs font-mono text-white/20 tracking-[0.4em] uppercase mt-2">
          {new Date().getFullYear()} Season
        </div>
      </div>
    </div>
  );
};

export default LoginPage;