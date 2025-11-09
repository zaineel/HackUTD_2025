import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockVendors } from '../services/mockData'

const GSDashboardPage = () => {
  const [vendors, setVendors] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Replace with actual API call
    setVendors(mockVendors)
  }, [])

  const filteredVendors = vendors.filter(vendor => {
    const matchesFilter = filter === 'all' || vendor.status === filter
    const matchesSearch = vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: vendors.length,
    pending: vendors.filter(v => v.status === 'pending').length,
    approved: vendors.filter(v => v.status === 'approved').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gs-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-gs p-8 border-l-4 border-gs-gold">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gs-navy mb-2 tracking-tight flex items-center">
                <span className="mr-4 text-5xl">🏛️</span>
                <span className="text-gs-gold">Vendor Dashboard</span>
              </h1>
              <p className="text-lg text-gs-gray-600 ml-16">
                Review and manage vendor onboarding submissions
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-gs p-6 border-l-4 border-gs-blue hover:shadow-gs-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gs-gray-600 mb-1">Total Vendors</p>
                <p className="text-4xl font-bold text-gs-navy">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-gs-blue to-gs-blue-dark rounded-2xl flex items-center justify-center shadow-gs">
                <span className="text-3xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-gs p-6 border-l-4 border-yellow-500 hover:shadow-gs-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gs-gray-600 mb-1">Pending Review</p>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-gs">
                <span className="text-3xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-gs p-6 border-l-4 border-green-500 hover:shadow-gs-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gs-gray-600 mb-1">Approved</p>
                <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-gs">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-gs p-6 border-l-4 border-red-500 hover:shadow-gs-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gs-gray-600 mb-1">Rejected</p>
                <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-gs">
                <span className="text-3xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-gs p-6 mb-6 border border-gs-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="sr-only">Search vendors</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gs-gray-400">🔍</span>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Search by company name or email..."
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                  filter === 'all' ? 'bg-gs-navy text-white shadow-gs' : 'bg-gs-gray-100 text-gs-navy hover:bg-gs-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                  filter === 'pending' ? 'bg-yellow-500 text-white shadow-gs' : 'bg-gs-gray-100 text-gs-navy hover:bg-gs-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                  filter === 'approved' ? 'bg-green-500 text-white shadow-gs' : 'bg-gs-gray-100 text-gs-navy hover:bg-gs-gray-200'
                }`}
              >
                Approved ({stats.approved})
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-xl shadow-gs overflow-hidden border border-gs-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gs-gray-200">
              <thead className="bg-gradient-to-r from-gs-navy to-gs-navy-light">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gs-gray-200">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gs-gray-400">
                        <span className="text-4xl mb-2 block">📋</span>
                        <span className="text-sm font-medium">No vendors found matching your criteria</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gs-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gs-navy">{vendor.company_name}</div>
                        <div className="text-xs text-gs-gray-500 font-mono">{vendor.ein}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gs-navy">{vendor.contact_email}</div>
                        <div className="text-xs text-gs-gray-500">{vendor.contact_phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg ${getStatusColor(vendor.status)}`}>
                          {vendor.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vendor.risk_score ? (
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gs-navy">{vendor.risk_score}</span>
                            <span className="text-xs text-gs-gray-500 ml-1">/100</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gs-gray-400 font-medium">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gs-gray-600">
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <Link
                          to={`/gs/vendor/${vendor.id}`}
                          className="inline-flex items-center text-gs-blue hover:text-gs-blue-dark hover:underline transition-colors"
                        >
                          View Details
                          <span className="ml-1">→</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GSDashboardPage

