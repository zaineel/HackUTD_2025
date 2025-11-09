import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentUpload from '../components/DocumentUpload'
import { uploadDocument } from '../services/api'
import { DOCUMENT_LABELS } from '../utils/constants'

const UploadPage = () => {
  const navigate = useNavigate()
  const [vendorId, setVendorId] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [uploadingType, setUploadingType] = useState(null)

  useEffect(() => {
    // Get vendor ID from localStorage
    const storedVendorId = localStorage.getItem('vendorId')
    if (!storedVendorId) {
      // Redirect to register if no vendor ID found
      navigate('/register')
      return
    }
    setVendorId(storedVendorId)
  }, [navigate])

  const requiredDocuments = [
    { type: 'w9', label: DOCUMENT_LABELS.w9 },
    { type: 'insurance_certificate', label: DOCUMENT_LABELS.insurance_certificate },
    { type: 'business_license', label: DOCUMENT_LABELS.business_license }
  ]

  const handleUploadSuccess = async (documentType, uploadData) => {
    try {
      setUploadingType(documentType)

      // Upload document to backend
      await uploadDocument(vendorId, documentType, uploadData)

      // Mark document as uploaded
      setUploadedDocuments(prev => [...prev, documentType])

    } catch (err) {
      console.error('Document upload error:', err)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploadingType(null)
    }
  }

  const isDocumentUploaded = (docType) => {
    return uploadedDocuments.includes(docType)
  }

  const allDocumentsUploaded = () => {
    return requiredDocuments.every(doc => isDocumentUploaded(doc.type))
  }

  const handleContinue = () => {
    navigate('/dashboard')
  }

  if (!vendorId) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Upload Compliance Documents
            </h1>
            <p className="text-lg text-gray-600">
              Submit required documents for AI-powered verification
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-600">Register</span>
              </div>
              <div className="flex-1 h-1 bg-gs-blue mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gs-blue text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="ml-3 font-semibold text-gray-900">Upload</span>
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

          {/* Document Upload Sections */}
          <div className="space-y-6 mb-8">
            {requiredDocuments.map((doc) => (
              <div key={doc.type} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.label}
                    </h3>
                    {isDocumentUploaded(doc.type) && (
                      <span className="ml-3 badge-success">
                        Uploaded
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-red-500 font-medium">Required</span>
                </div>

                {!isDocumentUploaded(doc.type) ? (
                  <DocumentUpload
                    vendorId={vendorId}
                    documentType={doc.type}
                    onUploadSuccess={(data) => handleUploadSuccess(doc.type, data)}
                  />
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-800 font-medium">Document uploaded successfully</p>
                    <p className="text-green-600 text-sm mt-1">AI verification in progress</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-secondary"
            >
              Back to Registration
            </button>

            <button
              onClick={handleContinue}
              disabled={!allDocumentsUploaded()}
              className={`btn-primary ${!allDocumentsUploaded() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {allDocumentsUploaded() ? 'Continue to Dashboard' : `Upload All Documents (${uploadedDocuments.length}/${requiredDocuments.length})`}
            </button>
          </div>

          {/* Information Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  AI-Powered Document Processing
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• AWS Textract automatically extracts key information from your documents</li>
                  <li>• Compliance checks verify all required fields are present</li>
                  <li>• Sanctions screening runs in real-time using AWS Comprehend</li>
                  <li>• All documents are encrypted with customer-managed KMS keys</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
