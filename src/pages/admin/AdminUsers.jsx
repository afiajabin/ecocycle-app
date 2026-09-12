import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { 
  getAdminUsers, 
  updateAdminUser,
} from '../../services/api'
import { 
  Users, 
  Search, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  Eye,
  RefreshCw,
  X
} from 'lucide-react'

export default function AdminUsers() {
  const { addToast } = useToast()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [selectedUserModal, setSelectedUserModal] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getAdminUsers({
        district: districtFilter,
        search: searchQuery,
      })
      if (res.success) {
        setUsers(res.data)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
      setError(err.message || 'Error loading users from server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [districtFilter, searchQuery])

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended'
    try {
      setTogglingId(user._id || user.id)
      const res = await updateAdminUser(user._id || user.id, { status: newStatus })
      if (res.success) {
        addToast(`User ${user.name} status updated to ${newStatus}.`, 'info')
        fetchUsers()
      }
    } catch (err) {
      addToast(err.message || 'Failed to update user status', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/admin/dashboard" className="breadcrumb-link">Admin Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">User Management</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">
                <Users size={14} /> Citizen & Collector Directory
              </span>
              <h1 className="section-title">Manage Registered Users</h1>
              <p className="section-desc">
                Audit citizen and collector accounts across Bangladesh districts in MongoDB.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '1.5rem', padding: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="lookup-input-box" style={{ maxWidth: '320px', width: '100%' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="lookup-input"
                placeholder="Search by name, email, district..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.88rem' }}
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
            >
              <option value="all">All Districts</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Gazipur">Gazipur</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
            </select>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{users.length}</strong> registered users
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>User Name & Email</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '1rem 1.25rem' }}>District & Phone</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Account Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Loading users from database...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id || user.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className={`badge ${user.role === 'admin' ? 'badge-accent' : user.role === 'collector' ? 'badge-info' : 'badge-success'}`}>
                          {user.role}
                        </span>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className="badge badge-success" style={{ marginBottom: '0.2rem' }}>{user.district || 'Dhaka'}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.phone || '+880 1712-345678'}</div>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className={`badge ${user.status !== 'Suspended' ? 'badge-success' : 'badge-warning'}`}>
                          {user.status !== 'Suspended' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                          {user.status || 'Active'}
                        </span>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedUserModal(user)}
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>

                          {user.role !== 'admin' && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{
                                color: user.status !== 'Suspended' ? 'var(--error, #ef4444)' : 'var(--primary)',
                                borderColor: user.status !== 'Suspended' ? 'rgba(239, 68, 68, 0.3)' : 'var(--primary)'
                              }}
                              onClick={() => handleToggleStatus(user)}
                              disabled={togglingId === (user._id || user.id)}
                            >
                              {user.status !== 'Suspended' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUserModal && (
        <div className="modal-overlay" onClick={() => setSelectedUserModal(null)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUserModal(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>User Profile: {selectedUserModal.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Role: <strong>{selectedUserModal.role}</strong> • Joined: {new Date(selectedUserModal.createdAt || Date.now()).toLocaleDateString()}
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <strong>Email:</strong> {selectedUserModal.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedUserModal.phone || '+880 1712-345678'}
              </div>
              <div>
                <strong>District:</strong> {selectedUserModal.district || 'Dhaka'}
              </div>
              <div>
                <strong>Account Status:</strong> <span style={{ fontWeight: 600 }}>{selectedUserModal.status || 'Active'}</span>
              </div>
            </div>

            {selectedUserModal.role === 'collector' && (
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                <div><strong>Vehicle:</strong> {selectedUserModal.vehicleType} ({selectedUserModal.vehicleNumber})</div>
                <div><strong>Districts:</strong> {(selectedUserModal.assignedDistricts || []).join(', ')}</div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedUserModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
