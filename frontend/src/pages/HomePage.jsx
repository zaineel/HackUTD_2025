import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen gs-gradient-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          {/* Logo/Badge */}
          <div className="inline-block mb-8 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏛️</span>
              <span className="text-xl font-bold text-white">Vendor Onboarding Platform</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Unified Vendor <span className="text-gs-gold">Onboarding</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 font-light">
            Replacing Ariba and KY3P - One Platform for All Onboarding
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-12 font-light">
            AI-driven automation reducing onboarding from 6 months to 2 weeks
          </p>
          
          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vendor Card */}
            <Link to="/vendor/register" className="group">
              <div className="bg-white rounded-2xl p-10 shadow-gs-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 h-[400px] flex flex-col border-2 border-transparent hover:border-gs-blue">
                <div className="text-7xl mb-6">🏢</div>
                <h2 className="text-3xl font-bold text-gs-navy mb-4 tracking-tight">I'm a Vendor</h2>
                <p className="text-gs-gray-600 mb-8 flex-grow leading-relaxed">
                  Submit your company information, upload documents, and complete the KY3P questionnaire
                </p>
                <div className="bg-gs-blue text-white px-6 py-4 rounded-xl font-bold group-hover:bg-gs-blue-dark transition-all text-center shadow-gs group-hover:shadow-gs-lg">
                  Start Onboarding →
                </div>
              </div>
            </Link>

            {/* Enterprise Team Card */}
            <Link to="/gs/login" className="group">
              <div className="bg-white rounded-2xl p-10 shadow-gs-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 h-[400px] flex flex-col border-2 border-transparent hover:border-gs-gold">
                <div className="text-7xl mb-6">🏛️</div>
                <h2 className="text-3xl font-bold text-gs-navy mb-4 tracking-tight">Internal Team</h2>
                <p className="text-gs-gray-600 mb-8 flex-grow leading-relaxed">
                  Review vendor submissions, documents, and questionnaire responses
                </p>
                <div className="bg-gs-navy text-white px-6 py-4 rounded-xl font-bold group-hover:bg-gs-navy-dark transition-all text-center shadow-gs group-hover:shadow-gs-lg border border-gs-gold/20">
                  Access Dashboard →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-gs-gold">85% Time Reduction</h3>
            <p className="text-white/90 leading-relaxed">
              Cut onboarding time from 6 months to just 2 weeks with AI-powered automation
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-5xl mb-6">🔒</div>
            <h3 className="text-2xl font-bold mb-3 text-gs-gold">Bank-Grade Security</h3>
            <p className="text-white/90 leading-relaxed">
              Customer-managed encryption keys and isolated VPC infrastructure
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-5xl mb-6">🤖</div>
            <h3 className="text-2xl font-bold mb-3 text-gs-gold">AI-Driven Intelligence</h3>
            <p className="text-white/90 leading-relaxed">
              Automated document verification and real-time risk assessment
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-3xl shadow-gs-xl p-10 md:p-14 border border-gs-gray-200">
          <h2 className="text-4xl font-bold text-gs-navy text-center mb-4 tracking-tight">
            Simple 4-Step Process
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gs-blue to-gs-gold mx-auto mb-12"></div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-gs-blue to-gs-blue-dark text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-gs group-hover:shadow-gs-lg transition-all group-hover:scale-110">
                1
              </div>
              <h4 className="font-bold text-lg mb-3 text-gs-navy">Register</h4>
              <p className="text-gs-gray-600 text-sm leading-relaxed">
                Submit your company information and create an account
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-gs-blue to-gs-blue-dark text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-gs group-hover:shadow-gs-lg transition-all group-hover:scale-110">
                2
              </div>
              <h4 className="font-bold text-lg mb-3 text-gs-navy">Upload Documents</h4>
              <p className="text-gs-gray-600 text-sm leading-relaxed">
                AI extracts and verifies your compliance documents
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-gs-blue to-gs-blue-dark text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-gs group-hover:shadow-gs-lg transition-all group-hover:scale-110">
                3
              </div>
              <h4 className="font-bold text-lg mb-3 text-gs-navy">Risk Assessment</h4>
              <p className="text-gs-gray-600 text-sm leading-relaxed">
                Automated scoring across financial, cyber, and ESG dimensions
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-gs-blue to-gs-blue-dark text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-gs group-hover:shadow-gs-lg transition-all group-hover:scale-110">
                4
              </div>
              <h4 className="font-bold text-lg mb-3 text-gs-navy">Track Progress</h4>
              <p className="text-gs-gray-600 text-sm leading-relaxed">
                Monitor your onboarding status in real-time
              </p>
            </div>
          </div>

          <div className="text-center mt-14">
            <Link to="/register" className="btn-primary inline-block text-lg px-10 py-4">
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/15 transition-all">
            <h3 className="text-2xl font-bold mb-6 text-gs-gold flex items-center">
              <span className="mr-3">✨</span> Key Features
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">Unified KY3P and SLP platform integration</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">AWS Textract for intelligent document processing</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">Real-time compliance and sanctions screening</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">Comprehensive audit trail and CloudTrail logging</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/15 transition-all">
            <h3 className="text-2xl font-bold mb-6 text-gs-gold flex items-center">
              <span className="mr-3">🔐</span> Security Highlights
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">Customer-managed AWS KMS encryption keys</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">3-tier VPC architecture with isolated subnets</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">IAM least privilege access controls</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gs-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/90 leading-relaxed">Serverless architecture for maximum security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
