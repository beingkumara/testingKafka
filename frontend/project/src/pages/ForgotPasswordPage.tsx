import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { requestPasswordReset, verifyOtp } from '../services/auth/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const navigate = useNavigate();
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const handleSendOtp = async (e: React.FormEvent) => {
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
      setSuccessMessage(response.message || 'OTP has been sent to your email.');
      setShowOtpField(true);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setFormError('');
    setSuccessMessage('');
    
    // Validate OTP format (6 digits)
    if (!otp || !/^\d{6}$/.test(otp)) {
      setFormError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Verifying OTP...');
      const response = await verifyOtp(otp);
      console.log('OTP verification response:', response);
      
      // If OAuth is required, the verifyOtp function will handle the redirect
      if (response.requiresOAuth) {
        setSuccessMessage('Redirecting to OAuth provider...');
        return;
      }
      
      if (response.token) {
        // If we get a token in the response, use it for password reset
        navigate(`/reset-password?token=${encodeURIComponent(response.token)}`);
      } else {
        // If no token in response, use the OTP as the token (fallback)
        navigate(`/reset-password?token=${encodeURIComponent(otp)}`);
      }
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'Failed to verify OTP. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (errorMessage.toLowerCase().includes('expired')) {
        errorMessage = 'This OTP has expired. Please request a new one.';
      } else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('incorrect')) {
        errorMessage = 'The OTP you entered is incorrect. Please try again.';
      }
      
      setFormError(errorMessage);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setFormError('');
      }, 5000);
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
              
              <form onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp}>
                {!showOtpField ? (
                  <>
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
                          setIsEmailValid(true);
                        }}
                        className={`input ${email && !isEmailValid ? 'border-error-500' : ''}`}
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
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
                            Sending OTP...
                          </span>
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <label 
                        htmlFor="otp" 
                        className="block text-sm font-medium mb-1"
                      >
                        Enter OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="input"
                        placeholder="Enter the 6-digit OTP"
                        required
                        disabled={isSubmitting}
                      />
                      <p className="mt-2 text-xs text-secondary-500">
                        We've sent a 6-digit OTP to {email}
                      </p>
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
                            Verifying...
                          </span>
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                    </div>
                    
                    <div className="text-center mb-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpField(false);
                          setFormError('');
                          setSuccessMessage('');
                        }}
                        className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                      >
                        Change Email
                      </button>
                    </div>
                  </>
                )}
                
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