import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { requestPasswordReset } from '../services';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validation
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await requestPasswordReset(email);
      setSuccessMessage(response.message || 'Password reset instructions have been sent to your email.');
      setEmail(''); // Clear the form
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Failed to process your request. Please try again.');
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
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-secondary-600 dark:text-secondary-300 mt-2">
                  Enter your email to receive password reset instructions
                </p>
              </div>
              
              {formError && (
                <div className="bg-error-500/10 border border-error-500 text-error-500 p-3 rounded-md mb-6">
                  {formError}
                </div>
              )}
              
              {successMessage && (
                <div className="bg-success-500/10 border border-success-500 text-success-500 p-3 rounded-md mb-6">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailValid(true); // Reset validation on change
                    }}
                    className={`input ${email && !isEmailValid ? 'border-error-500' : ''}`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {email && !isEmailValid && (
                    <p className="mt-1 text-xs text-error-500">
                      Please enter a valid email address
                    </p>
                  )}
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
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-secondary-600 dark:text-secondary-300">
                    Remember your password?{' '}
                  </span>
                  <Link 
                    to="/login" 
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Back to login
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

export default ForgotPasswordPage;