import { Link } from 'react-router-dom';
import Squares from '../assets/Background/Squares/Squares';
import { LINKS } from '../constants/links';

export default function Pricing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <Squares />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-white/5">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="flex items-center space-x-2">
                  <img src="/ThinkFlowLogo.png" alt="ThinkFlow" className="h-12" />
                  <span className="text-2xl font-bold text-white">ThinkFlow</span>
                  </Link>
                  <div className="hidden md:flex items-center space-x-6">
                    <Link to="/#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
                    <Link to="/pricing" className="text-white hover:text-white/90 transition-colors">Pricing</Link>
                    <Link to="/#docs" className="text-white/80 hover:text-white transition-colors">Docs</Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href={LINKS.GITHUB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={LINKS.TWITTER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <Link
                    to={LINKS.APP}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Try for Free
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="pt-32 sm:pt-40 pb-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Pricing</h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                ThinkFlow is currently in beta and completely free to use. Get early access now!
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-indigo-500/30 relative overflow-hidden h-full">
                  <div className="absolute -rotate-45 top-5 -right-10 bg-indigo-600 text-white px-10 py-1 text-sm font-medium">
                    BETA
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-white">$0</span>
                    <span className="text-xl text-white/70 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Unlimited diagram generation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">AI-powered improvements</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Export to multiple formats</span>
                    </li>
                  </ul>
                  <Link
                    to="/app"
                    className="block mt-20 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </div>

                {/* Pro Plan (Coming Soon) */}
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-white/10 h-full relative">
                  <div className="absolute top-4 right-4 bg-gray-700 text-white px-3 py-1 text-xs rounded-full">
                    Coming Soon
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-white">$12</span>
                    <span className="text-xl text-white/70 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Everything in Free</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Advanced customization options</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Collaborative editing</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Priority support</span>
                    </li>
                  </ul>
                  <button
                    disabled
                    className="block mt-[39px] w-full py-3 px-4 bg-gray-700 text-white/70 rounded-lg font-medium text-center cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Enterprise Plan (Coming Soon) */}
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-white/10 h-full relative">
                  <div className="absolute top-4 right-4 bg-gray-700 text-white px-3 py-1 text-xs rounded-full">
                    Coming Soon
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-white">$29</span>
                    <span className="text-xl text-white/70 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Team management</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Advanced security features</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Custom branding</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-white">Dedicated support</span>
                    </li>
                  </ul>
                  <button
                    disabled
                    className="block -mt-[8px] w-full py-3 px-4 bg-gray-700 text-white/70 rounded-lg font-medium text-center cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-white/5 max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-white mb-4">Need a custom solution?</h3>
                  <p className="text-white/80 mb-6">
                    We're working on custom solutions for larger teams and specific industry needs. Contact us to discuss how ThinkFlow can help your organization.
                  </p>
                  <a
                    href="mailto:contact@thinkflow.ai"
                    className="inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 