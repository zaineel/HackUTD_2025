import { useState } from 'react'

const KY3PQuestionnaire = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    // Company Information
    business_description: '',
    years_in_business: '',
    number_of_employees: '',
    annual_revenue: '',
    
    // Compliance & Legal
    compliance_certifications: [],
    data_privacy_compliance: '',
    sanctions_screening: '',
    litigation_history: '',
    
    // Cybersecurity
    security_certifications: [],
    incident_response_plan: '',
    data_encryption: '',
    access_controls: '',
    
    // Financial
    financial_health: '',
    insurance_coverage: '',
    backup_procedures: '',
    
    // ESG
    esg_policies: '',
    diversity_initiatives: '',
    environmental_commitments: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => {
        const currentValues = prev[name] || []
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] }
        } else {
          return { ...prev, [name]: currentValues.filter(v => v !== value) }
        }
      })
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-gs-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
          Company Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="business_description"
              value={formData.business_description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe your company's primary business activities..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in Business <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="years_in_business"
                value={formData.years_in_business}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="number_of_employees"
                value={formData.number_of_employees}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Revenue Range <span className="text-red-500">*</span>
            </label>
            <select
              name="annual_revenue"
              value={formData.annual_revenue}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select range...</option>
              <option value="0-1M">Under $1M</option>
              <option value="1M-10M">$1M - $10M</option>
              <option value="10M-50M">$10M - $50M</option>
              <option value="50M-100M">$50M - $100M</option>
              <option value="100M+">Over $100M</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance & Legal Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-gs-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
          Compliance & Legal
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compliance Certifications (select all that apply)
            </label>
            <div className="space-y-2">
              {['ISO 27001', 'SOC 2', 'GDPR Compliant', 'HIPAA', 'PCI DSS'].map(cert => (
                <label key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    name="compliance_certifications"
                    value={cert}
                    checked={formData.compliance_certifications.includes(cert)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Privacy Compliance <span className="text-red-500">*</span>
            </label>
            <textarea
              name="data_privacy_compliance"
              value={formData.data_privacy_compliance}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe your data privacy policies and compliance measures..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sanctions Screening Process <span className="text-red-500">*</span>
            </label>
            <textarea
              name="sanctions_screening"
              value={formData.sanctions_screening}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe your sanctions screening procedures..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Litigation History (past 5 years)
            </label>
            <textarea
              name="litigation_history"
              value={formData.litigation_history}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Disclose any material litigation or regulatory actions..."
            />
          </div>
        </div>
      </div>

      {/* Cybersecurity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-gs-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
          Cybersecurity
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Certifications (select all that apply)
            </label>
            <div className="space-y-2">
              {['ISO 27001', 'SOC 2 Type II', 'NIST Framework', 'CSA STAR'].map(cert => (
                <label key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    name="security_certifications"
                    value={cert}
                    checked={formData.security_certifications.includes(cert)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Response Plan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="incident_response_plan"
              value={formData.incident_response_plan}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe your incident response procedures..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Encryption Standards <span className="text-red-500">*</span>
            </label>
            <textarea
              name="data_encryption"
              value={formData.data_encryption}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe encryption methods for data at rest and in transit..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Controls <span className="text-red-500">*</span>
            </label>
            <textarea
              name="access_controls"
              value={formData.access_controls}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe your access control policies and procedures..."
              required
            />
          </div>
        </div>
      </div>

      {/* Financial Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-gs-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
          Financial & Operations
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Health Assessment <span className="text-red-500">*</span>
            </label>
            <textarea
              name="financial_health"
              value={formData.financial_health}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Provide overview of financial stability, credit rating, etc..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Coverage <span className="text-red-500">*</span>
            </label>
            <textarea
              name="insurance_coverage"
              value={formData.insurance_coverage}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="List insurance policies (liability, cyber, E&O, etc.)..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup & Recovery Procedures <span className="text-red-500">*</span>
            </label>
            <textarea
              name="backup_procedures"
              value={formData.backup_procedures}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe backup frequency, recovery time objectives, etc..."
              required
            />
          </div>
        </div>
      </div>

      {/* ESG Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-gs-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
          ESG & Sustainability
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ESG Policies
            </label>
            <textarea
              name="esg_policies"
              value={formData.esg_policies}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe your ESG framework and policies..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diversity & Inclusion Initiatives
            </label>
            <textarea
              name="diversity_initiatives"
              value={formData.diversity_initiatives}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe diversity programs and metrics..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environmental Commitments
            </label>
            <textarea
              name="environmental_commitments"
              value={formData.environmental_commitments}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe environmental initiatives and sustainability goals..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Questionnaire'
          )}
        </button>
      </div>
    </form>
  )
}

export default KY3PQuestionnaire

