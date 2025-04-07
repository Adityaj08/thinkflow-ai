import { useEffect, useRef } from 'react';
import FadeContent from './animations/FadeContent';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechCorp",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300",
    quote: "ThinkFlow has revolutionized how we approach project planning. The AI-powered diagrams are incredible."
  },
  {
    name: "Michael Roberts",
    role: "Senior Developer at InnovateLabs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300",
    quote: "The visualization capabilities are outstanding. It's made our team collaboration so much more efficient."
  },
  {
    name: "Jessica Patel",
    role: "UX Designer at DesignHub",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300",
    quote: "As a designer, I appreciate how ThinkFlow helps me communicate ideas clearly to stakeholders."
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300",
    quote: "This tool has become indispensable for our brainstorming sessions. The AI suggestions are spot on."
  },
  {
    name: "Emily Thompson",
    role: "Project Lead at CreativeFlow",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300",
    quote: "ThinkFlow's intuitive interface and powerful features have transformed our workflow completely."
  },
  {
    name: "Marcus Johnson",
    role: "Tech Lead at CloudScale",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300",
    quote: "The ability to quickly generate and modify diagrams has saved us countless hours in meetings."
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const cards = containerRef.current?.querySelectorAll('.testimonial-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeContent delay={200} duration={1000}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by leaders
            </h2>
            <p className="text-2xl sm:text-3xl text-gray-400 mb-6">
              from various industries
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Learn why professionals trust our solutions to complete their customer journeys.
            </p>
          </div>
        </FadeContent>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="testimonial-card opacity-0 translate-y-8 duration-700 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/80">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <FadeContent delay={100} duration={1000}>
          <div className="mt-12 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-500 text-sm sm:text-base font-medium text-center">
                Note: These testimonials are AI-generated for demonstration purposes only and do not represent real user reviews.
              </p>
            </div>
          </div>
        </FadeContent>
      </div>

      <style jsx>{`
        .testimonial-card.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
} 