import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GSLoginPage = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual authentication
      // Demo mode: accept any email
      if (credentials.email && credentials.password) {
        localStorage.setItem('gsUser', JSON.stringify({ email: credentials.email }))
        navigate('/gs/dashboard')
      } else {
        setError('Please enter both email and password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen gs-gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-gs-xl p-10 border-2 border-gs-gold/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 bg-gradient-to-br from-gs-navy to-gs-navy-light p-4 rounded-2xl shadow-gs">
              <div className="text-5xl">🏛️</div>
            </div>
            <h2 className="text-4xl font-bold text-gs-navy mb-2 tracking-tight">
              Enterprise
            </h2>
            <p className="text-gs-gray-600 font-medium">
              Vendor Management System
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-gs-blue to-gs-gold mx-auto mt-4"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="input-field"
                placeholder="user@enterprise.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gs-blue focus:ring-gs-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-gs-blue hover:text-blue-700">
                  Forgot password?
                </a>
              </div>
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gs-gray-600">
              For vendor access,{' '}
              <a href="/" className="font-semibold text-gs-blue hover:text-gs-blue-dark transition-colors">
                click here
              </a>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 bg-gradient-to-r from-gs-blue/10 to-gs-gold/10 border-2 border-gs-gold/30 rounded-xl p-4">
            <p className="text-xs text-gs-navy text-center font-medium">
              <strong className="text-gs-gold">🔓 Demo Mode:</strong> Use any email and password to login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GSLoginPage

