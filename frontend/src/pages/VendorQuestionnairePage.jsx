import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KY3PQuestionnaire from '../components/KY3PQuestionnaire'

const VendorQuestionnairePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')

    try {
      const vendorId = localStorage.getItem('vendorId')
      
      // TODO: Replace with actual API call
      console.log('Submitting questionnaire:', { vendorId, ...formData })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store completion status
      localStorage.setItem('questionnaireComplete', 'true')
      
      // Navigate to dashboard
      navigate('/vendor/dashboard')
      
    } catch (err) {
      console.error('Questionnaire submission error:', err)
      setError('Failed to submit questionnaire. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              KY3P Questionnaire
            </h1>
            <p className="text-lg text-gray-600">
              Complete this comprehensive assessment for vendor onboarding
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="ml-3 font-semibold text-gray-900">Register</span>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="ml-3 font-semibold text-gray-900">Upload</span>
              </div>
              <div className="flex-1 h-1 bg-gs-blue mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gs-blue text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="ml-3 font-semibold text-gray-900">Questionnaire</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Submission failed</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  KY3P Compliance Assessment
                </h3>
                <p className="text-sm text-blue-700">
                  This questionnaire replaces the traditional KY3P process. All information is required for vendor approval and will be reviewed by Goldman Sachs compliance team.
                </p>
              </div>
            </div>
          </div>

          {/* Questionnaire Form */}
          <KY3PQuestionnaire onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default VendorQuestionnairePage

