import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = React.useRef<HTMLInputElement>(null);

  const { signup } = useAuth();
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

  // Update password strength when password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);

    if (strength === 0) {
      setPasswordFeedback('');
    } else if (strength < 40) {
      setPasswordFeedback('Weak');
    } else if (strength < 70) {
      setPasswordFeedback('Moderate');
    } else {
      setPasswordFeedback('Strong');
    }
  }, [password]);

  // Validate email when it changes
  useEffect(() => {
    if (email) {
      setIsEmailValid(validateEmail(email));
    } else {
      setIsEmailValid(true); // Don't show error when field is empty
    }
  }, [email]);

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
                <h1 className="text-3xl font-bold">Create Your Account</h1>
                <p className="text-secondary-600 dark:text-secondary-300 mt-2">
                  Join F1nity and elevate your Formula 1 experience
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
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="f1-input"
                    placeholder="John Doe"
                    required
                  />
                </div>

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
                    className={`f1-input ${email && !isEmailValid ? 'border-error-500' : ''}`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {email && !isEmailValid && (
                    <p className="mt-1 text-xs text-error-500">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="f1-input pr-10"
                      placeholder="Enter your password"
                      required
                      aria-describedby="password-requirements"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-secondary-500 hover:text-secondary-700 focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        // Store current cursor position
                        const cursorPosition = passwordInputRef.current?.selectionStart || 0;
                        setShowPassword(!showPassword);
                        // Return focus to the password f1-input and restore cursor position
                        setTimeout(() => {
                          if (passwordInputRef.current) {
                            passwordInputRef.current.focus();
                            passwordInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                          }
                        }, 0);
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1} // Prevent tab focus on the button
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                          <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                          <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {password && (
                    <>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Password Strength:</span>
                          <span className={`text-xs font-medium ${passwordStrength < 40 ? 'text-error-500' :
                            passwordStrength < 70 ? 'text-warning-500' :
                              'text-success-500'
                            }`}>
                            {passwordFeedback}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength < 40 ? 'bg-error-500' :
                              passwordStrength < 70 ? 'bg-warning-500' :
                                'bg-success-500'
                              }`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                      <div id="password-requirements" className="mt-2 text-xs text-secondary-600 dark:text-secondary-400">
                        <p>Password must:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          <li className={password.length >= 8 ? 'text-success-500' : ''}>
                            Be at least 8 characters long
                          </li>
                          <li className={/[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? 'text-success-500' : ''}>
                            Contain both letters and numbers
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      ref={confirmPasswordInputRef}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="f1-input pr-10"
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-secondary-500 hover:text-secondary-700 focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        // Store current cursor position
                        const cursorPosition = confirmPasswordInputRef.current?.selectionStart || 0;
                        setShowConfirmPassword(!showConfirmPassword);
                        // Return focus to the confirm password input and restore cursor position
                        setTimeout(() => {
                          if (confirmPasswordInputRef.current) {
                            confirmPasswordInputRef.current.focus();
                            confirmPasswordInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                          }
                        }, 0);
                      }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      tabIndex={-1} // Prevent tab focus on the button
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                          <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                          <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="loader h-5 w-5 mr-2"></div>
                        Creating account...
                      </span>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </div>

                <div className="text-center text-sm">
                  <span className="text-secondary-600 dark:text-secondary-300">
                    Already have an account?{' '}
                  </span>
                  <Link
                    to="/login"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </div>

            <div className="racing-line h-2 w-full"></div>
          </motion.div>

          {/* Decorative F1 UI elements */}
          <div className="absolute -z-10 -top-6 -right-6 h-24 w-24 rounded-full border-8 border-dashed border-secondary-200 dark:border-secondary-700"></div>
          <div className="absolute -z-10 -bottom-4 -left-4 h-16 w-16 bg-primary-500/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;