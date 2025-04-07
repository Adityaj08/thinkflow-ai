import FadeContent from './animations/FadeContent';

export default function Features() {
  const features = [
    {
      title: "Diagram Analysis",
      description: "Get detailed analysis and insights about your diagrams with our AI-powered tools.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      image: "/analyseDiagram.png"
    },
    {
      title: "Export Options",
      description: "Export your diagrams in multiple formats including PNG, JPG, SVG, and PDF.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      image: "/exportImage.png"
    },
    {
      title: "AI Generation",
      description: "Generate beautiful diagrams instantly using our advanced AI technology, switch between API Easily",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      image: "/GenerateImage.png"
    }
  ];

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeContent delay={200} duration={1000}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Powerful Features for Your Workflow
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Everything you need to create, analyze, and share your diagrams effectively.
            </p>
          </div>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {features.map((feature, index) => (
            <FadeContent key={index} delay={300 + index * 200} duration={1000}>
              <div className="group relative bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-indigo-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/80 mb-6">{feature.description}</p>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg shadow-black/20">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
} 