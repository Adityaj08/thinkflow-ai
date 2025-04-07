import { Link } from 'react-router-dom';
import FadeContent from './animations/FadeContent';
import { LINKS } from '../constants/links';

export default function CTA() {
  return (
    <section className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeContent delay={200} duration={1000}>
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10 py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Join thousands of professionals who are already using ThinkFlow to create beautiful diagrams and streamline their work.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to={LINKS.APP}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-white/90 transition-all duration-200 text-lg"
                  >
                    Get Started for Free
                  </Link>
                  <Link
                    to={LINKS.PRICING}
                    className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-lg"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
} 