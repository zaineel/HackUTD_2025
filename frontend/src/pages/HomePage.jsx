import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gs-navy to-gs-blue">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Unified Vendor Onboarding Platform
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Replacing Ariba and KY3P - One Platform for All Onboarding
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-12">
            AI-driven automation reducing onboarding from 6 months to 2 weeks
          </p>
          
          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vendor Card */}
            <Link to="/vendor/register" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-6xl mb-4">🏢</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">I'm a Vendor</h2>
                <p className="text-gray-600 mb-6">
                  Submit your company information, upload documents, and complete the KY3P questionnaire
                </p>
                <div className="bg-gs-blue text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                  Start Onboarding →
                </div>
              </div>
            </Link>

            {/* Goldman Sachs Card */}
            <Link to="/gs/login" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-6xl mb-4">🏦</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Goldman Sachs Team</h2>
                <p className="text-gray-600 mb-6">
                  Review vendor submissions, documents, and questionnaire responses
                </p>
                <div className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-gray-800 transition-colors">
                  Access Dashboard →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-3">85% Time Reduction</h3>
            <p className="text-blue-100">
              Cut onboarding time from 6 months to just 2 weeks with AI-powered automation
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-3">Bank-Grade Security</h3>
            <p className="text-blue-100">
              Customer-managed encryption keys and isolated VPC infrastructure
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-3">AI-Driven Intelligence</h3>
            <p className="text-blue-100">
              Automated document verification and real-time risk assessment
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Simple 4-Step Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gs-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-lg mb-2">Register</h4>
              <p className="text-gray-600 text-sm">
                Submit your company information and create an account
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gs-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-lg mb-2">Upload Documents</h4>
              <p className="text-gray-600 text-sm">
                AI extracts and verifies your compliance documents
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gs-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-lg mb-2">Risk Assessment</h4>
              <p className="text-gray-600 text-sm">
                Automated scoring across financial, cyber, and ESG dimensions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gs-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-lg mb-2">Track Progress</h4>
              <p className="text-gray-600 text-sm">
                Monitor your onboarding status in real-time
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/register" className="btn-primary inline-block">
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Unified KY3P and SLP platform integration</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AWS Textract for intelligent document processing</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-time compliance and sanctions screening</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Comprehensive audit trail and CloudTrail logging</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Security Highlights</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Customer-managed AWS KMS encryption keys</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>3-tier VPC architecture with isolated subnets</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>IAM least privilege access controls</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Serverless architecture for maximum security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
