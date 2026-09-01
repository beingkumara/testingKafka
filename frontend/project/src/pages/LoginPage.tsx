import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Activity, Zap, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

// Dynamic Telemetry Component for the right side of the screen
const TelemetryDisplay = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate streaming data points for the graph
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newPoints = [...prev, Math.floor(Math.random() * 40) + 60];
        if (newPoints.length > 20) return newPoints.slice(newPoints.length - 20);
        return newPoints;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:flex flex-col justify-center p-16 pointer-events-none z-10">
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-2xl ml-auto space-y-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#e10600] rounded-full animate-pulse shadow-[0_0_8px_#e10600]"></div>
            <span className="text-xs font-mono text-gray-300 tracking-[0.3em] uppercase">Live Telemetry Link</span>
          </div>
          <span className="text-[10px] font-mono text-gray-600 tracking-widest">SECURE CONNECTION</span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Speed / Gear Widget */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e10600]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Current Speed</span>
              <Activity className="w-4 h-4 text-[#e10600]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-display font-black text-white tabular-nums tracking-tighter">
                <motion.span
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  312
                </motion.span>
              </span>
              <span className="text-xs text-[#e10600] font-mono font-bold tracking-widest">KM/H</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#e10600]" 
                animate={{ width: ["80%", "95%", "85%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* RPM Widget */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Engine RPM</span>
              <Zap className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
               <motion.div 
                 className="text-4xl font-display font-bold text-white tabular-nums tracking-wider"
                 animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.02, 1] }}
                 transition={{ duration: 0.8, repeat: Infinity }}
               >
                 11,450
               </motion.div>
               <span className="text-[9px] text-gray-500 font-mono tracking-widest mt-1">REV/MIN</span>
            </div>
          </div>

          {/* Data Graph Widget */}
          <div className="col-span-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 h-48 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">G-Force Distribution</span>
              <BarChart2 className="w-4 h-4 text-blue-500" />
            </div>
            
            <div className="flex items-end h-20 gap-2 w-full justify-between">
              {dataPoints.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full bg-blue-500/30 rounded-t-sm"
                  style={{ opacity: i / 20 }} // fade out older points
                >
                  {i === dataPoints.length - 1 && (
                    <div className="w-full h-1 bg-blue-500 rounded-t-sm animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Subtle animated grid lines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

        </div>

      </motion.div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const { login, googleLogin } = useAuth();
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

      {/* Dynamic Telemetry Display (Desktop Right Side) */}
      <TelemetryDisplay />

      {/* Speed lines accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e10600] via-primary-500 to-transparent opacity-80" />

      {/* Login Card */}
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
                  <span className="text-[10px] font-mono text-[#e10600] uppercase tracking-[0.3em]">System Authentication</span>
                </div>
                <h1 className="text-3xl font-heading font-black text-white tracking-wider uppercase mb-1">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-sm font-sans normal-case tracking-normal font-light">
                  Enter your credentials to access the paddock.
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
                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="login-email" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Email Designation
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="f1-input focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10"
                    placeholder="driver@fanf1x.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label htmlFor="login-password" className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Security Code
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[10px] text-[#e10600] hover:text-[#ff1e18] font-mono tracking-wider transition-colors"
                    >
                      Reset code?
                    </Link>
                  </div>
                  <div className="relative group/input">
                    <input
                      id="login-password"
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="f1-input pr-12 focus:border-[#e10600] focus:shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-all duration-300 w-full bg-black/40 border-white/10"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    {/* Show/hide button */}
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
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="login-submit"
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
                    <span className="relative z-10">Initialize Sequence</span>
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
                            setFormError('Failed to log in with Google. Please try again.');
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

                {/* Sign up link */}
                <div className="text-center mt-8 pt-6 border-t border-white/5">
                  <p className="text-sm text-gray-500 font-light">
                    No clearance codes?{' '}
                    <Link
                      to="/signup"
                      className="text-white hover:text-[#e10600] font-bold tracking-wide transition-colors"
                    >
                      Request Access
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

export default LoginPage;