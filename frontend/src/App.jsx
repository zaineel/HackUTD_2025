import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import RiskScorePage from './pages/RiskScorePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/risk" element={<RiskScorePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
