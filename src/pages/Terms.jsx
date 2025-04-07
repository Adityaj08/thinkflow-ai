import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FadeContent from '../components/animations/FadeContent';

export default function Terms() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <FadeContent delay={200} duration={1000}>
          <div className="group relative bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                Terms and Conditions
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
                <p className="text-white/80 mb-6">
                  Welcome to ThinkFlow. By accessing or using our service, you agree to be bound by these Terms and Conditions. Please read them carefully.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Definitions</h2>
                <p className="text-white/80 mb-6">
                  "Service" refers to the ThinkFlow website, application, and all related services. "User," "you," and "your" refer to individuals accessing or using the Service.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Account Registration</h2>
                <p className="text-white/80 mb-6">
                  To use certain features of the Service, you must register for an account. You agree to provide accurate and complete information and to keep your account information updated.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Content</h2>
                <p className="text-white/80 mb-6">
                  You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Prohibited Activities</h2>
                <p className="text-white/80 mb-6">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Intellectual Property</h2>
                <p className="text-white/80 mb-6">
                  The Service and its original content, features, and functionality are owned by ThinkFlow and are protected by international copyright, trademark, and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Limitation of Liability</h2>
                <p className="text-white/80 mb-6">
                  In no event shall ThinkFlow be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Changes to Terms</h2>
                <p className="text-white/80 mb-6">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Contact Us</h2>
                <p className="text-white/80 mb-6">
                  If you have any questions about these Terms, please contact us at support@thinkflow.com.
                </p>
              </div>
            </div>
          </div>
        </FadeContent>
      </main>

      <Footer />
    </div>
  );
} 