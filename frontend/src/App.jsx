import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import RiskScorePage from './pages/RiskScorePage'
import VendorQuestionnairePage from './pages/VendorQuestionnairePage'
import GSLoginPage from './pages/GSLoginPage'
import GSDashboardPage from './pages/GSDashboardPage'
import GSVendorDetailPage from './pages/GSVendorDetailPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            
            {/* Vendor Routes */}
            <Route path="/vendor/register" element={<RegisterPage />} />
            <Route path="/vendor/upload" element={<UploadPage />} />
            <Route path="/vendor/questionnaire" element={<VendorQuestionnairePage />} />
            <Route path="/vendor/dashboard" element={<DashboardPage />} />
            <Route path="/vendor/risk" element={<RiskScorePage />} />
            
            {/* Legacy routes (redirect to vendor routes) */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/risk" element={<RiskScorePage />} />
            
            {/* Goldman Sachs Routes */}
            <Route path="/gs/login" element={<GSLoginPage />} />
            <Route path="/gs/dashboard" element={<GSDashboardPage />} />
            <Route path="/gs/vendor/:vendorId" element={<GSVendorDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
