import React from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

const SignUp = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSocialSignup = (connection) => {
    loginWithRedirect({
      authorizationParams: {
        connection,
        screen_hint: 'signup'
      }
    });
  };

  const handleEmailSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  };

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Left Side - Background */}
      <div className="hidden lg:block lg:w-1/2 bg-[#121212] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-8">
              <img 
                src="/ThinkFlowIcon.png" 
                alt="Flow Diagram" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Welcome to ThinkFlow</h2>
            <p className="text-xl text-white/60">Create beautiful diagrams with AI</p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-[#121212] flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center">
                <span className="text-xl text-emerald-400">✦</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
            <p className="text-gray-400 text-sm">Get started with your free account</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleSocialSignup('google-oauth2')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white rounded-lg py-2.5 hover:bg-[#222] transition-colors"
            >
              <FaGoogle className="text-lg" />
              <span>Sign up with Google</span>
            </button>
            <button 
              onClick={() => handleSocialSignup('github')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white rounded-lg py-2.5 hover:bg-[#222] transition-colors"
            >
              <FaGithub className="text-lg" />
              <span>Sign up with GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <button
            onClick={handleEmailSignup}
            className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity"
          >
            Sign up with Email →
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 