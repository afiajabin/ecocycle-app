import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/StatusBadge'
import RequestStepTracker from '../../components/RequestStepTracker'
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Calendar, 
  MapPin, 
  Truck, 
  Building, 
  XCircle, 
  Info, 
  Layers, 
  Eye, 
  X,
  Sparkles
} from 'lucide-react'

export default function MyRequests() {
  const { userProfile } = useAuthRole()
  const { requests, cancelRequest } = useData()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequestModal, setSelectedRequestModal] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  // Filter requests for current user
  const userRequests = requests.filter(r => r.userId === userProfile.id || r.userName === userProfile.name)

  const tabs = [
    { id: 'all', label: 'All Requests', count: userRequests.length },
    { id: 'Pending', label: 'Pending', count: userRequests.filter(r => r.status === 'Pending').length },
    { id: 'Accepted', label: 'Accepted', count: userRequests.filter(r => r.status === 'Accepted').length },
    { id: 'Collected', label: 'Collected', count: userRequests.filter(r => r.status === 'Collected').length },
    { id: 'Delivered to Facility', label: 'At Facility', count: userRequests.filter(r => r.status === 'Delivered to Facility').length },
    { id: 'Completed', label: 'Completed', count: userRequests.filter(r => r.status === 'Completed').length },
    { id: 'Cancelled', label: 'Cancelled', count: userRequests.filter(r => r.status === 'Cancelled').length }
  ]

  const filteredRequests = userRequests.filter(req => {
    const matchesTab = activeTab === 'all' || req.status === activeTab
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.plasticTypes.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  const handleCancel = (requestId) => {
    cancelRequest(requestId)
    setCancellingId(null)
    if (selectedRequestModal?.id === requestId) {
      setSelectedRequestModal(prev => ({ ...prev, status: 'Cancelled' }))
    }
    addToast(`Request #${requestId} has been cancelled.`, 'info')
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/user/dashboard" className="breadcrumb-link">User Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">My Pickup Requests</span>
        </div>

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-tag">
              <FileText size={14} /> Request History & Tracking
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: '0.5rem' }}>
              My Plastic Pickup Requests
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track your plastic waste journey from doorstep collection to authorized recycling or waste-to-energy delivery.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/user/request-pickup')}
          >
            <PlusCircle size={16} />
            <span>New Pickup Request</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          {/* Tabs */}
          <div className="filter-chips" style={{ marginBottom: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`filter-chip ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-elevated)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="lookup-input-box" style={{ maxWidth: '300px', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="lookup-input"
              placeholder="Search by ID, area, plastic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FileText size={26} />
            </div>
            <h3>No requests found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0.5rem auto 1.5rem auto' }}>
              {activeTab !== 'all' ? `There are currently no requests with "${activeTab}" status.` : 'You haven\'t submitted any pickup requests yet.'}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/user/request-pickup')}
            >
              <PlusCircle size={15} />
              <span>Submit First Request</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredRequests.map(req => (
              <div key={req.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Request #{req.id}</h2>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Created: {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <strong>{req.district}:</strong> {req.address}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color="var(--primary)" />
                        {req.preferredDate} ({req.preferredTime})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Layers size={14} color="var(--primary)" />
                        Estimated: <strong>{req.estimatedKg} kg</strong> {req.verifiedKg ? `(Verified: ${req.verifiedKg} kg)` : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {req.plasticTypes.map(p => (
                        <span key={p} className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <StatusBadge status={req.status} size="lg" />
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedRequestModal(req)}
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>

                      {req.status === 'Pending' && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => setCancellingId(req.id)}
                        >
                          <XCircle size={14} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5-Step Visual Tracker */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <RequestStepTracker status={req.status} />
                </div>

                {/* Live Assignment Summary Strip */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  marginTop: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <strong>Collector:</strong> {req.collectorName ? `${req.collectorName} (${req.district})` : 'Pending dispatch assignment'}
                  </div>
                  <div>
                    <strong>Destination Facility:</strong> {req.facilityName || 'Authorized Upcycling Center'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancellingId && (
        <div className="modal-overlay" onClick={() => setCancellingId(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={22} />
              <span>Cancel Pickup Request?</span>
            </h2>
            <p style={{ margin: '1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to cancel request <strong>#{cancellingId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCancellingId(null)}
              >
                Keep Request
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={() => handleCancel(cancellingId)}
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequestModal && (
        <div className="modal-overlay" onClick={() => setSelectedRequestModal(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRequestModal(null)}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingRight: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Request #{selectedRequestModal.id}</h2>
              <StatusBadge status={selectedRequestModal.status} />
            </div>

            <RequestStepTracker status={selectedRequestModal.status} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Location & District</div>
                <div>District: <strong>{selectedRequestModal.district}</strong></div>
                <div>Address: {selectedRequestModal.address}</div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Plastic Waste Details</div>
                <div>Types: {selectedRequestModal.plasticTypes.join(', ')}</div>
                <div>Estimated Weight: <strong>{selectedRequestModal.estimatedKg} kg</strong></div>
                {selectedRequestModal.verifiedKg && (
                  <div>Verified Weight on Pickup: <strong style={{ color: 'var(--primary)' }}>{selectedRequestModal.verifiedKg} kg</strong></div>
                )}
                {selectedRequestModal.notes && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Notes: "{selectedRequestModal.notes}"
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Chain of Custody & Traceability</div>
                <div>Assigned Collector: <strong>{selectedRequestModal.collectorName || 'Pending assignment'}</strong></div>
                <div>Delivery Plant: <strong>{selectedRequestModal.facilityName || 'Pending collector delivery'}</strong></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Last Updated: {new Date(selectedRequestModal.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedRequestModal(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
