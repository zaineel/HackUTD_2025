import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VendorForm from '../components/VendorForm'
import { createVendor } from '../services/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')

    try {
      const response = await createVendor(formData)

      // Store vendor ID in localStorage for future reference
      localStorage.setItem('vendorId', response.id)

      setSuccess(true)

      // Navigate to upload page after brief success message
      setTimeout(() => {
        navigate('/vendor/upload')
      }, 1500)

    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Failed to create vendor account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Vendor Registration
            </h1>
            <p className="text-lg text-gray-600">
              Start your onboarding journey with Goldman Sachs
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gs-blue text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="ml-3 font-semibold text-gray-900">Register</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="ml-3 text-gray-600">Upload</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="ml-3 text-gray-600">Review</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Registration successful!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    Redirecting you to document upload...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="card">
            <VendorForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Information Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload required compliance documents (W-9, Insurance Certificates)</li>
                  <li>• AI-powered document verification and data extraction</li>
                  <li>• Automated risk assessment across multiple dimensions</li>
                  <li>• Real-time status tracking throughout the approval process</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
