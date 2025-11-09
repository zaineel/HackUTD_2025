import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const vendorId = localStorage.getItem('vendorId')

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-white bg-gs-navy'
      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
  }

  return (
    <nav className="bg-gs-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">
                Goldman Sachs
              </span>
              <span className="ml-2 text-gray-300 text-sm hidden sm:block">
                Vendor Onboarding Hub
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
            >
              Home
            </Link>

            {!vendorId && (
              <Link
                to="/register"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/register')}`}
              >
                Register
              </Link>
            )}

            {vendorId && (
              <>
                <Link
                  to={`/dashboard/${vendorId}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/dashboard')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to={`/upload/${vendorId}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/upload')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Upload
                </Link>

                <Link
                  to={`/risk/${vendorId}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/risk')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Risk Score
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
