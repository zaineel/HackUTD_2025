import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const vendorId = localStorage.getItem('vendorId')
  const gsUser = JSON.parse(localStorage.getItem('gsUser') || 'null')

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-white bg-gs-navy'
      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
  }

  const handleLogout = () => {
    localStorage.removeItem('vendorId')
    localStorage.removeItem('gsUser')
    navigate('/')
  }

  // Don't show navbar on login page
  if (location.pathname === '/gs/login') {
    return null
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
                Vendor Onboarding Platform
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {/* Public Navigation */}
            {!vendorId && !gsUser && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
                >
                  Home
                </Link>
                <Link
                  to="/vendor/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/vendor/register')}`}
                >
                  Vendor Registration
                </Link>
                <Link
                  to="/gs/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/gs/login')}`}
                >
                  GS Login
                </Link>
              </>
            )}

            {/* Vendor Navigation */}
            {vendorId && !gsUser && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/vendor/dashboard')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/vendor/upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/vendor/upload')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Upload
                </Link>

                <Link
                  to="/vendor/questionnaire"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/vendor/questionnaire')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Questionnaire
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gs-navy/50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {/* GS User Navigation */}
            {gsUser && (
              <>
                <Link
                  to="/gs/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes('/gs/dashboard')
                      ? 'text-white bg-gs-navy'
                      : 'text-gray-300 hover:text-white hover:bg-gs-navy/50'
                  }`}
                >
                  Dashboard
                </Link>

                <div className="px-3 py-2 text-sm font-medium text-gray-300">
                  {gsUser.email}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gs-navy/50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
