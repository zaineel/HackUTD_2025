import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockVendors } from '../services/mockData'

const GSVendorDetailPage = () => {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const foundVendor = mockVendors.find(v => v.id === vendorId)
    setVendor(foundVendor)
    setLoading(false)
  }, [vendorId])

  const handleStatusChange = async (newStatus) => {
    // TODO: Implement actual API call
    console.log('Changing status to:', newStatus)
    setVendor({ ...vendor, status: newStatus })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gs-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Vendor not found</p>
          <button onClick={() => navigate('/gs/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/gs/dashboard')}
            className="text-gs-blue hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {vendor.company_name}
              </h1>
              <p className="text-lg text-gray-600">EIN: {vendor.ein}</p>
            </div>
            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
              {vendor.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusChange('approved')}
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              ✓ Approve Vendor
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              className="btn-primary bg-red-600 hover:bg-red-700"
            >
              ✗ Reject Vendor
            </button>
            <button className="btn-primary bg-gray-600 hover:bg-gray-700">
              📧 Request More Info
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-gs-blue text-gs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-gs-blue text-gs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'questionnaire'
                    ? 'border-gs-blue text-gs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                KY3P Questionnaire
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'risk'
                    ? 'border-gs-blue text-gs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Risk Assessment
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                      <p className="text-gray-900">{vendor.company_name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">EIN</label>
                      <p className="text-gray-900">{vendor.ein}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Contact Email</label>
                      <p className="text-gray-900">{vendor.contact_email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <p className="text-gray-900">{vendor.contact_phone || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                      <p className="text-gray-900">{vendor.address || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Submitted Date</label>
                      <p className="text-gray-900">{new Date(vendor.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                      <p className="text-gray-900">{new Date(vendor.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                
                {/* Mock documents list */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">W-9 Form</p>
                        <p className="text-sm text-gray-500">Uploaded on {new Date(vendor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-gs-blue hover:text-blue-700 font-medium">
                      Download
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">Insurance Certificate</p>
                        <p className="text-sm text-gray-500">Uploaded on {new Date(vendor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-gs-blue hover:text-blue-700 font-medium">
                      Download
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">SOC 2 Report</p>
                        <p className="text-sm text-gray-500">Uploaded on {new Date(vendor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-gs-blue hover:text-blue-700 font-medium">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questionnaire Tab */}
            {activeTab === 'questionnaire' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KY3P Questionnaire Responses</h3>
                
                {/* Mock questionnaire responses */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Business Description</h4>
                  <p className="text-gray-700">
                    Leading provider of cloud-based financial services solutions specializing in payment processing and risk management.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Years in Business</h4>
                    <p className="text-gray-700">12 years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Number of Employees</h4>
                    <p className="text-gray-700">250</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Annual Revenue Range</h4>
                  <p className="text-gray-700">$50M - $100M</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Compliance Certifications</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">ISO 27001</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">SOC 2</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">PCI DSS</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Data Privacy Compliance</h4>
                  <p className="text-gray-700">
                    Fully compliant with GDPR, CCPA, and SOX. Regular third-party audits conducted annually. Data residency controls in place.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Cybersecurity Measures</h4>
                  <p className="text-gray-700">
                    24/7 SOC monitoring, end-to-end encryption, multi-factor authentication, regular penetration testing, and incident response team.
                  </p>
                </div>
              </div>
            )}

            {/* Risk Assessment Tab */}
            {activeTab === 'risk' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Overall Risk Score</h4>
                    <span className="text-4xl font-bold text-green-600">{vendor.risk_score || 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full" 
                      style={{ width: `${vendor.risk_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Financial Risk</h5>
                    <div className="text-2xl font-bold text-green-600">Low</div>
                    <p className="text-sm text-gray-600 mt-1">Strong financials, good credit history</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Cyber Risk</h5>
                    <div className="text-2xl font-bold text-green-600">Low</div>
                    <p className="text-sm text-gray-600 mt-1">Strong security certifications</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Compliance Risk</h5>
                    <div className="text-2xl font-bold text-yellow-600">Medium</div>
                    <p className="text-sm text-gray-600 mt-1">Some minor compliance gaps</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">AI Analysis Summary</h5>
                  <p className="text-blue-800 text-sm">
                    Vendor demonstrates strong compliance posture with comprehensive security certifications. 
                    Financial health indicators are positive. Recommend approval with annual review cycle.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GSVendorDetailPage

