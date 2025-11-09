import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const vendorId = localStorage.getItem('vendorId')
  const gsUser = JSON.parse(localStorage.getItem('gsUser') || 'null')

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-white bg-gs-blue shadow-gs'
      : 'text-white/80 hover:text-white hover:bg-white/10'
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
    <nav className="bg-gradient-to-r from-gs-navy to-gs-navy-light shadow-gs-lg border-b border-gs-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl mr-2 transform group-hover:scale-110 transition-transform">🏛️</span>
              <span className="text-white text-xl font-bold tracking-tight">
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
                  Team Login
                </Link>
              </>
            )}

            {/* Vendor Navigation */}
            {vendorId && !gsUser && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname.includes('/vendor/dashboard')
                      ? 'text-white bg-gs-blue shadow-gs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/vendor/upload"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname.includes('/vendor/upload')
                      ? 'text-white bg-gs-blue shadow-gs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Upload
                </Link>

                <Link
                  to="/vendor/questionnaire"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname.includes('/vendor/questionnaire')
                      ? 'text-white bg-gs-blue shadow-gs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Questionnaire
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-red-500/20 border border-white/20 transition-all ml-2"
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname.includes('/gs/dashboard')
                      ? 'text-white bg-gs-gold shadow-gs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>

                <div className="px-4 py-2 text-sm font-medium text-gs-gold flex items-center">
                  <span className="mr-2">👤</span>
                  {gsUser.email}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-red-500/20 border border-white/20 transition-all ml-2"
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
