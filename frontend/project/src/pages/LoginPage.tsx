import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-secondary-600 dark:text-secondary-300 mt-2">
                  Log in to access your Formula 1 dashboard
                </p>
              </div>
              
              {formError && (
                <div className="bg-error-500/10 border border-error-500 text-error-500 p-3 rounded-md mb-6">
                  {formError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <Link 
                      to="#" 
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full py-3 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="loader h-5 w-5 mr-2"></div>
                        Logging in...
                      </span>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-secondary-600 dark:text-secondary-300">
                    Don't have an account?{' '}
                  </span>
                  <Link 
                    to="/signup" 
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
            
            <div className="racing-line h-2 w-full"></div>
          </motion.div>
          
          {/* Decorative F1 UI elements */}
          <div className="absolute -z-10 -top-6 -left-6 h-24 w-24 rounded-full border-8 border-dashed border-secondary-200 dark:border-secondary-700"></div>
          <div className="absolute -z-10 -bottom-4 -right-4 h-16 w-16 bg-primary-500/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;