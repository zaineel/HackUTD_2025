import { useState } from 'react'

const VendorForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    ein: '',
    address: '',
    contact_phone: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required'
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format'
    }

    if (!formData.ein.trim()) {
      newErrors.ein = 'EIN is required'
    } else if (!/^\d{2}-\d{7}$/.test(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className={`input-field ${errors.company_name ? 'border-red-500' : ''}`}
          placeholder="ABC Corporation"
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contact_email"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          className={`input-field ${errors.contact_email ? 'border-red-500' : ''}`}
          placeholder="contact@company.com"
        />
        {errors.contact_email && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
        )}
      </div>

      <div>
        <label htmlFor="ein" className="block text-sm font-medium text-gray-700 mb-2">
          EIN (Tax ID) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ein"
          name="ein"
          value={formData.ein}
          onChange={handleChange}
          className={`input-field ${errors.ein ? 'border-red-500' : ''}`}
          placeholder="12-3456789"
          maxLength={10}
        />
        {errors.ein && (
          <p className="mt-1 text-sm text-red-600">{errors.ein}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Format: XX-XXXXXXX</p>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="input-field"
          placeholder="123 Business St, City, State ZIP"
        />
      </div>

      <div>
        <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="contact_phone"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          className="input-field"
          placeholder="+1-555-123-4567"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Vendor Account'
        )}
      </button>
    </form>
  )
}

export default VendorForm
