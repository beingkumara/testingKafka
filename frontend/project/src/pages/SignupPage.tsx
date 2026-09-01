import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Activity, Trophy, Database, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

// Feature Showcase Component for the right side of the screen
const FeatureShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:flex flex-col justify-center p-16 pointer-events-none z-10">
      <div className="w-full max-w-2xl ml-auto space-y-12">
        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-[#e10600] rounded-full shadow-[0_0_8px_#e10600]"></div>
            <span className="text-xs font-mono text-[#e10600] tracking-[0.3em] uppercase">Paddock Perks</span>
          </div>
          <h2 className="text-4xl font-heading font-black text-white tracking-widest uppercase">
            Initialize Access
          </h2>
        </motion.div>

        {/* Features List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <motion.div variants={itemVariants} className="flex items-start gap-6 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
              <Calendar className="w-6 h-6 text-[#e10600]" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-2">Race Calendar</h3>
              <p className="text-gray-400 font-light text-sm">Stay up to date with the latest race schedules, track information, and upcoming grand prix events.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start gap-6 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
              <Trophy className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-2">Global Standings</h3>
              <p className="text-gray-400 font-light text-sm">Track the constructor and driver championship battles with real-time points updates.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start gap-6 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-2">Follow Favorites</h3>
              <p className="text-gray-400 font-light text-sm">Build your custom profile and follow your favorite drivers and constructors across the grid.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = React.useRef<HTMLInputElement>(null);

  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Check if password meets requirements
  const validatePassword = (pass: string): { isValid: boolean; message: string } => {
    if (pass.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }

    // Check for alphanumeric (at least one letter and one number)
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    if (!hasLetter || !hasNumber) {
      return { isValid: false, message: 'Password must contain both letters and numbers' };
    }

    return { isValid: true, message: '' };
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass: string): number => {
    if (!pass) return 0;

    let strength = 0;

    // Length check
    if (pass.length >= 8) strength += 1;
    if (pass.length >= 12) strength += 1;

    // Complexity checks
    if (/[a-z]/.test(pass)) strength += 1; // lowercase
    if (/[A-Z]/.test(pass)) strength += 1; // uppercase
    if (/[0-9]/.test(pass)) strength += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 1; // special chars

    // Scale to 0-100
    return Math.min(Math.floor((strength / 6) * 100), 100);
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Compute derived state directly during render
  const passwordStrength = calculatePasswordStrength(password);
  let passwordFeedback = '';
  if (passwordStrength > 0) {
    if (passwordStrength < 40) {
      passwordFeedback = 'Weak';
    } else if (passwordStrength < 70) {
      passwordFeedback = 'Moderate';
    } else {
      passwordFeedback = 'Strong';
    }
  }

  const isEmailValid = email ? validateEmail(email) : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Failed to sign up. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center overflow-hidden">
      {/* Full-bleed F1 race start background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578255321055-d2c70c27ed6d?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      {/* Dark gradient overlay — completely opaque on left, fading to right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-800/80 to-transparent" />

      {/* Feature Showcase Display (Desktop Right Side) */}
      <FeatureShowcase />

      {/* Speed lines accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e10600] via-primary-500 to-transparent opacity-80" />

      {/* Signup Card */}
      <div className="relative z-20 w-full max-w-md px-4 lg:ml-[10%]">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, x: -20 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card — outer radius xl (12px) wraps inner content with p-8 (32px) */}
          <div
            className="relative overflow-hidden rounded-2xl group"
            style={{
              background: 'rgba(10, 10, 14, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(225,6,0,0.1) inset',
            }}
          >
            {/* Interactive ambient glow on hover */}
            <div className="absolute -inset-2 bg-gradient-radial from-[#e10600]/20 to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Red accent top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#e10600] via-[#ff1e18] to-transparent" />

            {/* Angular corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-[#e10600]/10"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
            />

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse shadow-[0_0_5px_#e10600]" />
                  <span className="text-[10px] font-mono text-[#e10600] uppercase tracking-[0.3em]">New Authorization</span>
                </div>
                <h1 className="text-3xl font-heading font-black text-white tracking-wider uppercase mb-1">
                  Request Access
                </h1>
                <p className="text-gray-400 text-sm font-sans normal-case tracking-normal font-light">
                  Join fanf1x and elevate your Formula 1 experience.
                </p>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="bg-[#e10600]/10 border border-[#e10600]/40 text-red-400 p-3 rounded-lg mb-6 text-sm font-mono flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e10600]"></div>
                    {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Designation
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="f1-input focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Comms Frequency (Email)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`f1-input focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10 ${email && !isEmailValid ? 'border-red-500/50' : ''}`}
                    placeholder="driver@fanf1x.com"
                    required
                  />
                  {email && !isEmailValid && (
                    <p className="mt-1 text-[10px] font-mono text-red-400 pl-1">
                      Invalid frequency format
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Security Code
                  </label>
                  <div className="relative group/input">
                    <input
                      id="password"
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="f1-input pr-12 focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e10600] rounded-r-lg"
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
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 pl-1 pr-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Strength</span>
                        <span className={`text-[9px] font-mono tracking-widest uppercase ${passwordStrength < 40 ? 'text-red-400' :
                          passwordStrength < 70 ? 'text-yellow-400' :
                            'text-[#e10600]'
                          }`}>
                          {passwordFeedback}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength < 40 ? 'bg-red-500' :
                            passwordStrength < 70 ? 'bg-yellow-500' :
                              'bg-[#e10600]'
                            }`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-8">
                  <label htmlFor="confirmPassword" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Confirm Code
                  </label>
                  <div className="relative group/input">
                    <input
                      id="confirmPassword"
                      ref={confirmPasswordInputRef}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="f1-input pr-12 focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e10600] rounded-r-lg"
                      onClick={() => {
                        const cursor = confirmPasswordInputRef.current?.selectionStart || 0;
                        setShowConfirmPassword(!showConfirmPassword);
                        setTimeout(() => {
                          if (confirmPasswordInputRef.current) {
                            confirmPasswordInputRef.current.focus();
                            confirmPasswordInputRef.current.setSelectionRange(cursor, cursor);
                          }
                        }, 0);
                      }}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-[#e10600] hover:bg-[#ff1e18] text-white rounded-lg font-heading font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:shadow-[0_0_30px_rgba(225,6,0,0.5)] ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">Authenticating...</span>
                    </>
                  ) : (
                    <span className="relative z-10">Request Access</span>
                  )}
                </motion.button>

                {/* Google Sign in */}
                <div className="mt-6 flex flex-col items-center justify-center">
                  <div className="flex items-center w-full mb-6">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-3 text-[10px] font-mono text-gray-500 tracking-widest uppercase">Or</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>
                  
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          setIsSubmitting(true);
                          setFormError('');
                          if (credentialResponse.credential) {
                            await googleLogin(credentialResponse.credential);
                            navigate('/dashboard');
                          }
                        } catch (error) {
                          if (error instanceof Error) {
                            setFormError(error.message);
                          } else {
                            setFormError('Failed to sign up with Google. Please try again.');
                          }
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      onError={() => {
                        console.log('Login Failed');
                        setFormError('Google Sign-In failed.');
                      }}
                      useOneTap
                      theme="filled_black"
                      shape="pill"
                    />
                  </div>
                </div>

                {/* Login link */}
                <div className="text-center mt-8 pt-6 border-t border-white/5">
                  <p className="text-sm text-gray-500 font-light">
                    Already have clearance?{' '}
                    <Link
                      to="/login"
                      className="text-white hover:text-[#e10600] font-bold tracking-wide transition-colors"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default SignupPage;