import { useState, useEffect } from 'react';
import { getLandingPageContent, LandingPageContent } from '@/lib/contentful';
import Head from 'next/head';

declare global {
  interface Window {
    Sequel: {
      init: (companyId: string) => void;
      initializeTracking: () => void;
      checkAndRenderIfRegistered: (params: {
        sequelEventId: string;
        onAlreadyRegistered?: (joinCode: string) => void;
        onNotRegistered?: () => void;
      }) => Promise<boolean>;
      renderEvent: (params: {
        eventId: string;
        joinCode: string;
      }) => void;
      registerUserForEvent: (eventId: string, name: string, email: string) => Promise<{
        joinCode: string;
        authToken: string;
        joinUrl: string;
      }>;
      setSequelJoinCodeCookie: (eventId: string, joinCode: string, days?: number) => void;
      clearSequelJoinCodeCookie: (eventId: string) => void;
    };
  }
}

interface HomeProps {
  content: LandingPageContent;
}

export default function Home({ content }: HomeProps) {
  const [showForm, setShowForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (window.Sequel) {
      // Check if user is already registered
      window.Sequel.checkAndRenderIfRegistered({
        sequelEventId: content.sequelEventId,
        onAlreadyRegistered: (joinCode) => {
          console.log('User already registered:', joinCode);
          setShowAlreadyRegistered(true);
        },
        onNotRegistered: () => {
          console.log('User not registered, showing form');
          setShowForm(true);
        },
      });
    }
  }, [content.sequelEventId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      companyName: formData.get('companyName') as string,
      numberOfEmployees: formData.get('numberOfEmployees') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    try {
      // Submit to backend API
      const response = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          eventId: content.sequelEventId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const result = await response.json();
      const joinCode = result.joinCode;

      // Save to cookies and render Sequel
      window.Sequel.setSequelJoinCodeCookie(content.sequelEventId, joinCode);
      window.Sequel.renderEvent({
        eventId: content.sequelEventId,
        joinCode: joinCode,
      });

      setShowForm(false);
      setShowAlreadyRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const resetRegistration = () => {
    window.Sequel.clearSequelJoinCodeCookie(content.sequelEventId);
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl opacity-90">{content.description}</p>
          </header>

          {/* Sequel Event Container */}
          <div id="sequel_root" className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10"></div>

          {/* Already Registered Message - Now below Sequel component */}
          {showAlreadyRegistered && (
            <div className="flex items-start gap-4 bg-white/20 backdrop-blur-lg p-6 rounded-xl border border-white/30 text-white mb-10">
              <div className="text-5xl text-green-400 flex-shrink-0">✓</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">You are in!</h3>
                <p className="text-base mb-4 opacity-95 leading-relaxed">
                  <strong>What happened:</strong> We detected you have a valid joinCode (from URL parameters or cookies). 
                  The toolkit validated it against the Sequel API and automatically rendered your personalized event view above. 
                  Your registration form was hidden since you're already registered.
                </p>
                <button 
                  onClick={resetRegistration} 
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Reset Demo (Clear Cookies)
                </button>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className={`grid gap-10 ${showForm ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Left side - Info Section */}
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-white border border-white/30">
              <h2 className="text-3xl font-bold mb-4">About This Example</h2>
              <p className="mb-6 opacity-90 leading-relaxed">
                This integration demonstrates how to combine your custom registration form with the Sequel Embed Toolkit. 
                Users can register through your custom form while automatically gaining access to the Sequel event experience.
              </p>
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  <span>Custom registration form</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  <span>Automatic event registration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  <span>Returning user detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  <span>Seamless user experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  <span>Cookie-based persistence</span>
                </li>
              </ul>
            </div>

            {/* Right side - Form */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Register for Event</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
                    />
                  </div>
                  <div>
                    <select 
                      name="numberOfEmployees" 
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800 bg-white"
                    >
                      <option value="">Number of Employees</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-1000">201-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                  >
                    {isRegistering ? 'Registering...' : 'Register Now'}
                  </button>
                </form>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  By registering, you agree to our terms of service and privacy policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const content = await getLandingPageContent();
  return {
    props: {
      content,
    },
    revalidate: 60,
  };
}
