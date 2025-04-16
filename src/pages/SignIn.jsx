import React from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

const SignIn = () => {
  const { loginWithRedirect, user } = useAuth0();

  const handleSocialLogin = (connection) => {
    loginWithRedirect({
      authorizationParams: {
        connection,
        screen_hint: 'login'
      }
    });
  };

  const handleEmailLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      }
    });
  };

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-1/2 bg-[#121212] flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center">
                <span className="text-xl text-emerald-400">✦</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to continue to your account</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleSocialLogin('google-oauth2')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white rounded-lg py-2.5 hover:bg-[#222] transition-colors"
            >
              <FaGoogle className="text-lg" />
              <span>Continue with Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white rounded-lg py-2.5 hover:bg-[#222] transition-colors"
            >
              <FaGithub className="text-lg" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <button
            onClick={handleEmailLogin}
            className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity"
          >
            Continue with Email →
          </button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Design Grid (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 bg-[#1a1a1a]">
        <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full p-2">
          {/* Top row */}
          <div className="rounded-lg bg-black p-4 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-1">Innovative Design</h3>
            <p className="text-white/90 text-xs">Harness the power of AI for cutting-edge diagram creations</p>
          </div>
          <div className="rounded-lg overflow-hidden bg-[#222222]">
            <img src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className="w-full h-full object-cover opacity-90" />
          </div>
          
          {/* Middle row */}
          <div className="rounded-lg overflow-hidden bg-[#222222]">
            <img src="https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="rounded-lg bg-gray-800 p-4 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-1">User-Friendly Interface</h3>
            <p className="text-white text-xs">Easily create and customize with our intuitive platform</p>
          </div>
          
          {/* Bottom row */}
          <div className="rounded-lg overflow-hidden bg-[#222222]">
            <img src="https://images.pexels.com/photos/2569997/pexels-photo-2569997.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="rounded-lg overflow-hidden bg-[#222222]">
            <img src="https://images.pexels.com/photos/10874582/pexels-photo-10874582.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className="w-full h-full object-cover opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 