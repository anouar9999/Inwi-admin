'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ImageIcon,
  FileTextIcon,
} from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Too short')
      .max(50, 'Too long')
      .matches(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Min 8 characters')
      .matches(/[a-z]/, '1 lowercase')
      .matches(/[A-Z]/, '1 uppercase')
      .matches(/[0-9]/, '1 number')
      .matches(/[^a-zA-Z0-9]/, '1 special character')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
    avatar: Yup.mixed(), // Changed from URL to mixed for file upload
    bio: Yup.string().max(500, 'Too long'),
  });



  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerMessage({
          type: 'error',
          message: 'File size should be less than 5MB',
        });
        return;
      }
  
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setServerMessage({
          type: 'error',
          message: 'Please upload a valid image file (JPG, PNG, or GIF)',
        });
        return;
      }
  
      setFieldValue('avatar', file);
  
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const initialValues = isLogin
    ? { email: '', password: '' }
    : {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        bio: '',
        is_verified: 1,
      };

  const inputClasses = `w-full px-4 py-3 bg-gray-900/50 text-white angular-cut 
     transition-all duration-300 placeholder:text-gray-500`;

  const inputWithIconClasses = `pl-11 ${inputClasses}`;

  const FormInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 " />}
      <Field {...props} className={Icon ? inputWithIconClasses : inputClasses} />
    </div>
  );
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    setServerMessage({ type: '', message: '' });

    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_login.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_register.php`;

      let response;

      if (isLogin) {
        // Handle login - simple JSON submission
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
      } else {
        // Handle registration with file upload
        const formData = new FormData();

        // Add all fields except avatar and confirmPassword
        Object.keys(values).forEach((key) => {
          if (key !== 'avatar' && key !== 'confirmPassword') {
            formData.append(key, values[key]);
          }
        });

        // Add avatar file if exists
        if (values.avatar) {
          formData.append('avatar', values.avatar);
        }

        // Add additional metadata
        formData.append('created_at', new Date().toISOString());
        formData.append('is_verified', 1);

        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        if (isLogin) {
          // Store user session data
          console.log(data)
          localStorage.setItem('userSessionToken', data.session_token);
          localStorage.setItem('userId', data.user_id);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userType', data.user_type);
          localStorage.setItem('avatarUrl', data.avatar);



          // Show success message with username
          setServerMessage({
            type: 'success',
            message: `Welcome back, ${data.username}! Redirecting to dashboard...`,
          });

          // Delayed redirect for better UX
          setTimeout(() => {
            router.push('/dashboards/my-tournaments');
          }, 1500);
        } else {
          // Registration success
          setServerMessage({
            type: 'success',
            message: 'Account created successfully! You can now log in.',
          });

          // Delayed switch to login form
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        }
      } else {
        // Handle API-level failures
        setServerMessage({
          type: 'error',
          message: data.message || (isLogin ? 'Login failed' : 'Registration failed'),
        });
      }
    } catch (error) {
      // Handle network or other errors
      setServerMessage({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Message component for better organization
  const ServerMessage = ({ type, message }) => {
    if (!message) return null;

    const styles = {
      success: 'bg-green-500/10 border-green-500/50 text-green-400',
      error: 'bg-red-500/10 border-red-500/50 text-red-400',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`p-4 rounded border ${styles[type]} text-sm flex items-center justify-between`}
      >
        <span>{message}</span>
        <button
          onClick={() => setServerMessage({ type: '', message: '' })}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <motion.div
        className="relative hidden lg:block lg:w-1/2 xl:w-2/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/videoplayback.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/50 via-gray-950/70 to-gray-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.5 }}
        />
      </motion.div>

      <div className="w-full lg:w-1/2 xl:w-2/4 px-6 lg:px-16 xl:px-24 py-4 flex flex-col justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 max-w-lg mx-auto w-full"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png"
            alt="Brand Logo"
            width={120}
            height={32}
            className="mb-16"
          />
          <h1 className="text-5xl font-custom text-white mb-3">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to continue' : 'Get started with your account'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto w-full"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={isLogin ? loginSchema : registerSchema}
              onSubmit={handleSubmit}
            >
  {({ errors, touched, setFieldValue }) => (  // Add setFieldValue here
                <Form className="space-y-8">
                  {serverMessage.message && (
                    <ServerMessage type={serverMessage.type} message={serverMessage.message} />
                  )}

                  {!isLogin && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Username
                        </label>
                        <FormInput
                          icon={UserIcon}
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                        />
                        <ErrorMessage name="username">
                          {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Email address
                    </label>
                    <FormInput
                      icon={MailIcon}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email">
                      {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <FormInput
                          icon={LockIcon}
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Confirm password
                          </label>
                          <FormInput
                            icon={LockIcon}
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                          />
                          <ErrorMessage name="confirmPassword">
                            {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
                          </ErrorMessage>
                        </div>

<div>
  <label className="block text-sm font-medium text-gray-300 mb-1.5">
    Profile Picture <span className="text-gray-500">(optional)</span>
  </label>
  <div className="relative">
    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
    <input
      type="file"
      onChange={(event) => handleFileChange(event, setFieldValue)}
      accept="image/jpeg,image/png,image/gif"
      className={inputWithIconClasses}
    />
  </div>
  {avatarPreview && (
    <div className="mt-2">
      <Image
        src={avatarPreview}
        alt="Avatar preview"
        width={100}
        height={100}
        className="rounded-full object-cover"
      />
    </div>
  )}
  <ErrorMessage name="avatar">
    {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
  </ErrorMessage>
</div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Bio <span className="text-gray-500">(optional)</span>
                          </label>
                          <div className="relative">
                            <FileTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <Field
                              as="textarea"
                              name="bio"
                              placeholder="Tell us about yourself..."
                              className={inputWithIconClasses}
                              rows="3"
                            />
                          </div>
                          <ErrorMessage name="bio">
                            {(msg) => <div className="mt-1 text-red-400 text-xs">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-primary text-white py-3  angular-cut font-medium
                      hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 
                      transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isLoading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-gray-400 max-w-lg mx-auto w-full">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setServerError('');
            }}
            className="ml-2 text-primary hover:underline font-medium transition-colors"
          >
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
