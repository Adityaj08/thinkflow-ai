import { Link } from 'react-router-dom';
import Squares from '../assets/Background/Squares/Squares';
import BlurText from '../components/animations/BlurText';
import FadeContent from '../components/animations/FadeContent';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Background */}
      <div className="relative min-h-screen bg-gray-950">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <Squares />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />

          <main className="h-screen flex flex-col justify-center items-center px-4 sm:px-6">
            <div className="text-center w-full max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                <BlurText
                  text="Visualize Your Ideas with Ease"
                  delay={150}
                  direction="bottom"
                  className="font-bold"
                  animateBy="words"
                />
              </h2>
              <FadeContent delay={800} duration={1200} blur={true}>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto px-4">
                  Create beautiful, interactive diagrams in seconds with our AI-powered flow chart generator. Perfect for brainstorming, project planning, and more.
                </p>
              </FadeContent>
              <FadeContent delay={1000} duration={1200} blur={true}>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 px-4">
                  <Link
                    to="/app"
                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 text-base sm:text-lg md:text-xl"
                  >
                    Get Started
                  </Link>
                  <a
                    href="#features"
                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-200 text-base sm:text-lg md:text-xl backdrop-blur-sm"
                  >
                    Learn More
                  </a>
                </div>
              </FadeContent>
            </div>
          </main>
        </div>
      </div>

      {/* Other Sections with Black Background */}
      <div className="bg-black">
        <Features />
        <Testimonials />
        <CTA />
      </div>
    </div>
  );
} 