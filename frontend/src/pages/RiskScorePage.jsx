import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RiskGauge from '../components/RiskGauge'
import { getRiskScore } from '../services/api'
import { getRiskLevel, RISK_CONFIG } from '../utils/constants'

const RiskScorePage = () => {
  const navigate = useNavigate()
  const [vendorId, setVendorId] = useState(null)
  const [riskData, setRiskData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRiskScore = async () => {
      const storedVendorId = localStorage.getItem('vendorId')
      if (!storedVendorId) {
        navigate('/register')
        return
      }

      setVendorId(storedVendorId)

      try {
        const data = await getRiskScore(storedVendorId)
        setRiskData(data)
      } catch (err) {
        console.error('Failed to load risk score:', err)
        setError('Failed to load risk assessment. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadRiskScore()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-gs-blue mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading risk assessment...</p>
        </div>
      </div>
    )
  }

  if (error || !riskData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-800 font-medium mb-2">
                Risk assessment not yet available
              </p>
              <p className="text-yellow-700 text-sm mb-4">
                Please upload all required documents to generate your risk score
              </p>
              <button onClick={() => navigate('/upload')} className="btn-primary">
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const riskLevel = getRiskLevel(riskData.overall_score)
  const riskConfig = RISK_CONFIG[riskLevel]

  const categories = [
    {
      name: 'Financial Health',
      score: riskData.financial_score,
      weight: '25%',
      icon: '💰',
      findings: riskData.financial_findings || []
    },
    {
      name: 'Compliance & Legal',
      score: riskData.compliance_score,
      weight: '35%',
      icon: '⚖️',
      findings: riskData.compliance_findings || []
    },
    {
      name: 'Cybersecurity',
      score: riskData.cybersecurity_score,
      weight: '25%',
      icon: '🔒',
      findings: riskData.cybersecurity_findings || []
    },
    {
      name: 'ESG Performance',
      score: riskData.esg_score,
      weight: '15%',
      icon: '🌱',
      findings: riskData.esg_findings || []
    }
  ]

  const getScoreColor = (score) => {
    if (score < 30) return 'text-green-600'
    if (score < 60) return 'text-yellow-600'
    if (score < 80) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score < 30) return 'bg-green-100'
    if (score < 60) return 'bg-yellow-100'
    if (score < 80) return 'bg-orange-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Risk Assessment Report
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered analysis across 4 key risk dimensions
            </p>
          </div>

          {/* Overall Score Section */}
          <div className="card mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <RiskGauge score={riskData.overall_score} size="large" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Overall Risk Assessment
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Risk Level:</span>
                    <span className={`font-bold ${getScoreColor(riskData.overall_score)}`}>
                      {riskConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Assessment Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(riskData.assessed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Next Review:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(riskData.next_review_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This risk score is calculated using AI-powered analysis
                    of your submitted documents and real-time compliance checks. Lower scores indicate lower risk.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {categories.map((category) => (
              <div key={category.name} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">Weight: {category.weight}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${getScoreBgColor(category.score)}`}>
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        category.score < 30 ? 'bg-green-500' :
                        category.score < 60 ? 'bg-yellow-500' :
                        category.score < 80 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </div>

                {/* Findings */}
                {category.findings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase">Key Findings:</p>
                    <ul className="space-y-1">
                      {category.findings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations Section */}
          {riskData.recommendations && riskData.recommendations.length > 0 && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recommendations for Improvement
              </h2>
              <div className="space-y-3">
                {riskData.recommendations.map((recommendation, idx) => (
                  <div key={idx} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-gs-blue mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis Details */}
          <div className="card bg-gradient-to-r from-gs-navy to-gs-blue text-white">
            <h2 className="text-2xl font-bold mb-4">AI-Powered Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Technologies Used:</h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AWS Textract for document analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AWS Comprehend for entity recognition
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time sanctions screening
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Sources:</h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Submitted compliance documents
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Public regulatory databases
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ESG scoring frameworks
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskScorePage
