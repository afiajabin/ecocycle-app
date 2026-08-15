import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Recycle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Eye,
  X
} from 'lucide-react'

export default function AdminUsers() {
  const { users, requests, toggleUserStatus, divisions } = useData()
  const { addToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [selectedUserModal, setSelectedUserModal] = useState(null)

  const filteredUsers = users.filter(user => {
    const matchesDistrict = districtFilter === 'all' || user.district === districtFilter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.district.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDistrict && matchesSearch
  })

  const handleToggleStatus = (user) => {
    toggleUserStatus(user.id)
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active'
    addToast(`User ${user.name} status changed to ${newStatus}.`, 'info')
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
          <span className="section-tag">
            <Users size={14} /> Citizen Directory
          </span>
          <h1 className="section-title">Manage Registered Citizens</h1>
          <p className="section-desc">
            Audit citizen accounts across Bangladesh districts, monitor recycling participation, and manage access controls.
          </p>
        </div>

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
              <option value="all">All Districts ({users.length} Citizens)</option>
              {Object.entries(divisions).map(([divName, distList]) => (
                <optgroup key={divName} label={divName}>
                  {distList.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} registered users
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Citizen Name & Email</th>
                  <th style={{ padding: '1rem 1.25rem' }}>District & Address</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Total Requests</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Plastic Recycled</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Account Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const userReqList = requests.filter(r => r.userId === user.id || r.userName === user.name)
                  const totalKg = userReqList
                    .filter(r => r.status !== 'Cancelled')
                    .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0)

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className="badge badge-success" style={{ marginBottom: '0.2rem' }}>{user.district}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.address}</div>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600 }}>
                        {userReqList.length} Pickups
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <strong style={{ color: 'var(--primary)' }}>{totalKg} kg</strong>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {user.status === 'Active' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                          {user.status}
                        </span>
                      </td>

                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedUserModal({ ...user, reqList: userReqList, totalKg })}
                          >
                            <Eye size={14} />
                            <span>Audit</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{
                              color: user.status === 'Active' ? 'var(--danger)' : 'var(--primary)',
                              borderColor: user.status === 'Active' ? 'var(--danger)' : 'var(--primary)'
                            }}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Audit Modal */}
      {selectedUserModal && (
        <div className="modal-overlay" onClick={() => setSelectedUserModal(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUserModal(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Citizen Audit: {selectedUserModal.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Joined: {selectedUserModal.joinedDate || '2026'} • ID: {selectedUserModal.id}
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <strong>Phone:</strong> {selectedUserModal.phone}
              </div>
              <div>
                <strong>District:</strong> {selectedUserModal.district}
              </div>
              <div>
                <strong>Total Plastic Diverted:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedUserModal.totalKg} kg</span>
              </div>
              <div>
                <strong>Account Status:</strong> <span style={{ fontWeight: 600 }}>{selectedUserModal.status}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Pickup Requests History ({selectedUserModal.reqList.length})</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedUserModal.reqList.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  <div>
                    <strong>#{r.id}</strong> ({r.preferredDate}) • {r.plasticTypes.join(', ')}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{r.status}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedUserModal(null)}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
