import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import StatusCard from '../components/StatusCard'
import { getVendorStatus } from '../services/api'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [vendorId, setVendorId] = useState(null)
  const [vendorData, setVendorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadVendorStatus = async () => {
      // Get vendor ID from localStorage
      const storedVendorId = localStorage.getItem('vendorId')
      if (!storedVendorId) {
        navigate('/vendor/register')
        return
      }

      setVendorId(storedVendorId)

      try {
        const data = await getVendorStatus(storedVendorId)
        setVendorData(data)
      } catch (err) {
        console.error('Failed to load vendor status:', err)
        setError('Failed to load vendor status. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadVendorStatus()

    // Poll for updates every 10 seconds
    const interval = setInterval(loadVendorStatus, 10000)
    return () => clearInterval(interval)
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-gs-blue mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !vendorData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium mb-2">{error}</p>
              <button onClick={() => navigate('/vendor/register')} className="btn-primary mt-4">
                Return to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              {vendorData.company_name}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vendor ID</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {vendorId.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <svg className="w-10 h-10 text-gs-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">KY3P Assessment</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {vendorData.ky3p_assessment_id || 'Pending'}
                  </p>
                </div>
                <svg className="w-10 h-10 text-gs-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SLP Supplier ID</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {vendorData.slp_supplier_id || 'Pending'}
                  </p>
                </div>
                <svg className="w-10 h-10 text-gs-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Status and Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Section */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Onboarding Progress
                </h2>
                <ProgressBar
                  progress={vendorData.onboarding_progress}
                  label="Overall Completion"
                />

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-gs-blue">
                      {vendorData.documents?.filter(d => d.status === 'verified').length || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Documents Verified</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {vendorData.risk_score ? `${vendorData.risk_score}%` : 'Pending'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Risk Score</p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <StatusCard
                status={vendorData.status}
                documents={vendorData.documents || []}
                nextSteps={vendorData.next_steps || []}
              />

              {/* Risk Assessment CTA */}
              {vendorData.risk_score && (
                <div className="card bg-gradient-to-r from-gs-navy to-gs-blue text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Risk Assessment Complete
                      </h3>
                      <p className="text-blue-100 mb-4">
                        View your detailed risk analysis and compliance breakdown
                      </p>
                      <Link to="/vendor/risk" className="inline-block bg-white text-gs-blue px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                        View Risk Report
                      </Link>
                    </div>
                    <svg className="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline and Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/vendor/upload" className="block w-full btn-primary text-center">
                    Upload Documents
                  </Link>
                  <Link to="/vendor/questionnaire" className="block w-full btn-primary text-center">
                    KY3P Questionnaire
                  </Link>
                  {vendorData.risk_score && (
                    <Link to="/vendor/risk" className="block w-full btn-secondary text-center">
                      View Risk Score
                    </Link>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {vendorData.timeline?.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-gs-blue rounded-full mt-2"></div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>

              {/* Support Contact */}
              <div className="card bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    vendor.support@gs.com
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    1-800-GS-VENDOR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
