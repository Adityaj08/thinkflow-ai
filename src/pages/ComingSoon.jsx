import { Link } from 'react-router-dom';
import FadeContent from '../components/animations/FadeContent';
import Squares from '../assets/Background/Squares/Squares';

export default function ComingSoon() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <Squares />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="h-screen flex flex-col justify-center items-center px-4">
          <FadeContent delay={200} duration={1000}>
            <div className="group relative bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/5 max-w-2xl mx-auto text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                  Coming Soon
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  We're working hard to bring you something amazing. Stay tuned!
                </p>
                <Link
                  to="/"
                  className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </FadeContent>
        </main>
      </div>
    </div>
  );
} 