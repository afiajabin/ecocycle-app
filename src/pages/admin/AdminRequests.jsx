import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/StatusBadge'
import RequestStepTracker from '../../components/RequestStepTracker'
import { 
  ListOrdered, 
  Search, 
  MapPin, 
  Trash2, 
  UserCheck, 
  Building, 
  Eye, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  XCircle,
  X,
  AlertTriangle
} from 'lucide-react'

export default function AdminRequests() {
  const { requests, collectors, assignCollectorToRequest, deleteRequest, divisions } = useData()
  const { addToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [assignModalReq, setAssignModalReq] = useState(null)
  const [selectedCollectorId, setSelectedCollectorId] = useState('')

  const [deleteModalId, setDeleteModalId] = useState(null)
  const [detailsModalReq, setDetailsModalReq] = useState(null)

  const filteredRequests = requests.filter(req => {
    const matchesDistrict = districtFilter === 'all' || req.district === districtFilter
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.plasticTypes.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDistrict && matchesStatus && matchesSearch
  })

  const openAssignModal = (req) => {
    setAssignModalReq(req)
    // Find a collector already assigned to this district if possible
    const districtCollector = collectors.find(c => c.assignedDistricts.includes(req.district))
    setSelectedCollectorId(districtCollector ? districtCollector.id : collectors[0]?.id || '')
  }

  const handleConfirmAssign = (e) => {
    e.preventDefault()
    assignCollectorToRequest(assignModalReq.id, selectedCollectorId)
    const colObj = collectors.find(c => c.id === selectedCollectorId)
    setAssignModalReq(null)
    addToast(`Assigned Request #${assignModalReq.id} to collector ${colObj?.name || selectedCollectorId}!`, 'success')
  }

  const handleConfirmDelete = (id) => {
    deleteRequest(id)
    setDeleteModalId(null)
    addToast(`Deleted request #${id} from system records.`, 'info')
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/admin/dashboard" className="breadcrumb-link">Admin Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">All Pickup Requests</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <span className="section-tag">
            <ListOrdered size={14} /> Master Logistics Ledger
          </span>
          <h1 className="section-title">All Nationwide Pickup Requests</h1>
          <p className="section-desc">
            Monitor, assign collectors, and manage lifecycle status for all plastic waste collections submitted across Bangladesh.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="lookup-input-box" style={{ maxWidth: '280px', width: '100%' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="lookup-input"
                placeholder="Search ID, citizen, area..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.88rem' }}
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
            >
              <option value="all">All Districts</option>
              {Object.entries(divisions).map(([divName, distList]) => (
                <optgroup key={divName} label={divName}>
                  {distList.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.88rem' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses ({requests.length})</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Collected">Collected</option>
              <option value="Delivered to Facility">Delivered to Facility</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredRequests.length}</strong> of {requests.length} requests
          </div>
        </div>

        {/* Master Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Request ID & Citizen</th>
                  <th style={{ padding: '1rem 1.25rem' }}>District & Address</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Plastic Streams & Weight</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Assigned Collector</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{req.id}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {req.userName} ({req.userPhone})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {req.preferredDate}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-success" style={{ marginBottom: '0.2rem' }}>{req.district}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.address}</div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        ~{req.estimatedKg} kg {req.verifiedKg ? `(Verified: ${req.verifiedKg} kg)` : ''}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {req.plasticTypes.join(', ')}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      {req.collectorName ? (
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <UserCheck size={14} color="var(--primary)" />
                          <span>{req.collectorName}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--warm-accent)', fontWeight: 600 }}>
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDetailsModalReq(req)}
                          title="View audit details"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openAssignModal(req)}
                          title="Assign or reassign collector"
                        >
                          <UserCheck size={14} />
                          <span>Assign</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => setDeleteModalId(req.id)}
                          title="Delete invalid or duplicate request"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal 1: Assign Collector */}
      {assignModalReq && (
        <div className="modal-overlay" onClick={() => setAssignModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAssignModalReq(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={22} color="var(--primary)" />
              <span>Assign Collector: #{assignModalReq.id}</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              District: <strong>{assignModalReq.district}</strong> • Citizen: {assignModalReq.userName} ({assignModalReq.estimatedKg} kg)
            </p>

            <form onSubmit={handleConfirmAssign}>
              <div className="form-group">
                <label className="form-label">Select Registered Collector *</label>
                <select
                  className="form-select"
                  value={selectedCollectorId}
                  onChange={e => setSelectedCollectorId(e.target.value)}
                  required
                >
                  {collectors.map(c => {
                    const isDistrictMatch = c.assignedDistricts.includes(assignModalReq.district)
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.assignedDistricts.join(', ')}) {isDistrictMatch ? '★ District Match' : ''}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setAssignModalReq(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Delete Request Confirmation */}
      {deleteModalId && (
        <div className="modal-overlay" onClick={() => setDeleteModalId(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 size={22} />
              <span>Delete Pickup Record?</span>
            </h2>
            <p style={{ margin: '1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to permanently delete request <strong>#{deleteModalId}</strong>? This removes the record from the nationwide ledger.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteModalId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={() => handleConfirmDelete(deleteModalId)}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Request Audit Details */}
      {detailsModalReq && (
        <div className="modal-overlay" onClick={() => setDetailsModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailsModalReq(null)}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingRight: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Audit: Request #{detailsModalReq.id}</h2>
              <StatusBadge status={detailsModalReq.status} />
            </div>

            <RequestStepTracker status={detailsModalReq.status} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Citizen:</strong> {detailsModalReq.userName} ({detailsModalReq.userPhone})</div>
                <div><strong>District / Location:</strong> {detailsModalReq.district} - {detailsModalReq.address}</div>
                <div><strong>Preferred Schedule:</strong> {detailsModalReq.preferredDate} ({detailsModalReq.preferredTime})</div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Plastic Stream:</strong> {detailsModalReq.plasticTypes.join(', ')}</div>
                <div><strong>Estimated / Verified Weight:</strong> {detailsModalReq.estimatedKg} kg {detailsModalReq.verifiedKg ? `(Verified: ${detailsModalReq.verifiedKg} kg)` : ''}</div>
                {detailsModalReq.notes && <div><strong>Notes:</strong> "{detailsModalReq.notes}"</div>}
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Collector Assigned:</strong> {detailsModalReq.collectorName || 'None'}</div>
                <div><strong>Destination Facility:</strong> {detailsModalReq.facilityName || 'None'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Created: {new Date(detailsModalReq.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setDetailsModalReq(null)}
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
