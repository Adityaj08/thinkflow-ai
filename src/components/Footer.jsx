import { Link } from 'react-router-dom';
import FadeContent from './animations/FadeContent';
import { LINKS } from '../constants/links';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: LINKS.FEATURES },
      { name: "Pricing", href: LINKS.PRICING },
      { name: "Documentation", href: LINKS.DOCS },
      { name: "Changelog", href: LINKS.CHANGELOG }
    ],
    company: [
      { name: "About", href: LINKS.ABOUT },
      { name: "Blog", href: LINKS.BLOG },
      { name: "Careers", href: LINKS.CAREERS },
      { name: "Contact", href: LINKS.CONTACT }
    ],
    legal: [
      { name: "Privacy Policy", href: LINKS.PRIVACY },
      { name: "Terms of Service", href: LINKS.TERMS },
      { name: "Cookie Policy", href: LINKS.COOKIES },
      { name: "GDPR", href: LINKS.GDPR }
    ],
    resources: [
      { name: "Community", href: LINKS.COMMUNITY },
      { name: "Help Center", href: LINKS.HELP },
      { name: "Status", href: LINKS.STATUS },
      { name: "API", href: LINKS.API }
    ]
  };

  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {Object.entries(footerLinks).map(([category, links], index) => (
            <FadeContent key={category} delay={200 + index * 100} duration={1000}>
              <div className="group relative bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-white/5 hover:border-indigo-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-4 capitalize">{category}</h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-white/60 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeContent>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link to="/" className="flex items-center space-x-2">
                <img src={LINKS.LOGO} alt="ThinkFlow" className="h-8" />
                <span className="text-xl font-bold text-white">ThinkFlow</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href={LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href={LINKS.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} ThinkFlow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 