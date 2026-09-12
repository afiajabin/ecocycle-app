import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/StatusBadge'
import RequestStepTracker from '../../components/RequestStepTracker'
import {
  getDistrictRequests,
  getFacilities,
  acceptRequest,
  collectRequest,
  deliverToFacility,
  completeRequest,
} from '../../services/api'
import { 
  ListOrdered, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Truck, 
  Building, 
  Search, 
  ShieldCheck,
  Scale,
  RefreshCw,
  X
} from 'lucide-react'

export default function CollectorRequests() {
  const { userProfile } = useAuthRole()
  const { addToast } = useToast()

  const assignedDistricts = userProfile.assignedDistricts || [userProfile.district || 'Dhaka']
  const [activeDistrictFilter, setActiveDistrictFilter] = useState('all')
  const [activeStatusTab, setActiveStatusTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [requests, setRequests] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modals state
  const [weightModalReq, setWeightModalReq] = useState(null)
  const [verifiedWeightInput, setVerifiedWeightInput] = useState('')
  const [submittingModal, setSubmittingModal] = useState(false)

  const [deliveryModalReq, setDeliveryModalReq] = useState(null)
  const [selectedFacilityId, setSelectedFacilityId] = useState('')

  const fetchRequestsAndFacilities = async () => {
    try {
      setLoading(true)
      setError('')
      const [reqsRes, facsRes] = await Promise.all([
        getDistrictRequests({
          status: activeStatusTab,
          district: activeDistrictFilter,
          search: searchQuery,
        }),
        getFacilities(),
      ])

      if (reqsRes.success) {
        setRequests(reqsRes.data)
      }
      if (facsRes.success) {
        setFacilities(facsRes.data)
      }
    } catch (err) {
      console.error('Error fetching collector requests:', err)
      setError(err.message || 'Failed to load requests from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequestsAndFacilities()
  }, [activeStatusTab, activeDistrictFilter, searchQuery])

  const tabs = [
    { id: 'all', label: 'All District Requests', count: requests.length },
    { id: 'Pending', label: 'Pending Acceptance', count: requests.filter(r => r.status === 'Pending').length },
    { id: 'Accepted', label: 'Accepted (To Collect)', count: requests.filter(r => r.status === 'Accepted').length },
    { id: 'Collected', label: 'Collected (In Transit)', count: requests.filter(r => r.status === 'Collected').length },
    { id: 'Delivered to Facility', label: 'At Facility', count: requests.filter(r => r.status === 'Delivered to Facility').length },
    { id: 'Completed', label: 'Completed', count: requests.filter(r => r.status === 'Completed').length }
  ]

  // Status progression handlers calling backend
  const handleAcceptRequest = async (req) => {
    try {
      const res = await acceptRequest(req._id || req.requestId)
      if (res.success) {
        addToast(`Accepted pickup request #${req.requestId} in ${req.district}. Citizen notified.`, 'success')
        fetchRequestsAndFacilities()
      }
    } catch (err) {
      addToast(err.message || 'Failed to accept request', 'error')
    }
  }

  const openCollectWeightModal = (req) => {
    setWeightModalReq(req)
    setVerifiedWeightInput(req.estimatedKg ? req.estimatedKg.toString() : '5')
  }

  const handleConfirmCollected = async (e) => {
    e.preventDefault()
    if (!verifiedWeightInput || Number(verifiedWeightInput) <= 0) {
      addToast('Please enter a valid verified weight in kg.', 'warning')
      return
    }

    try {
      setSubmittingModal(true)
      const weightNum = Number(verifiedWeightInput)
      const res = await collectRequest(weightModalReq._id || weightModalReq.requestId, weightNum)

      if (res.success) {
        setWeightModalReq(null)
        addToast(`Marked #${weightModalReq.requestId} as Collected (${weightNum} kg verified). Ready for facility transport.`, 'success')
        fetchRequestsAndFacilities()
      }
    } catch (err) {
      addToast(err.message || 'Failed to update weight', 'error')
    } finally {
      setSubmittingModal(false)
    }
  }

  const openDeliveryModal = (req) => {
    setDeliveryModalReq(req)
    setSelectedFacilityId(facilities[0]?._id || facilities[0]?.id || '')
  }

  const handleConfirmDelivered = async (e) => {
    e.preventDefault()
    if (!selectedFacilityId) {
      addToast('Please select a facility.', 'warning')
      return
    }

    try {
      setSubmittingModal(true)
      const res = await deliverToFacility(deliveryModalReq._id || deliveryModalReq.requestId, selectedFacilityId)

      if (res.success) {
        setDeliveryModalReq(null)
        addToast(`Marked #${deliveryModalReq.requestId} as Delivered to facility!`, 'success')
        fetchRequestsAndFacilities()
      }
    } catch (err) {
      addToast(err.message || 'Failed to deliver to facility', 'error')
    } finally {
      setSubmittingModal(false)
    }
  }

  const handleMarkCompleted = async (req) => {
    try {
      const res = await completeRequest(req._id || req.requestId)
      if (res.success) {
        addToast(`Request #${req.requestId} finalized and confirmed recycled!`, 'success')
        fetchRequestsAndFacilities()
      }
    } catch (err) {
      addToast(err.message || 'Failed to complete request', 'error')
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/collector/dashboard" className="breadcrumb-link">Collector Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">District Pickup Requests</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="section-tag">
              <ListOrdered size={14} /> Assigned District Stream
            </span>
            <span className="badge badge-success">
              Districts: {assignedDistricts.join(', ')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="section-title">District Plastic Pickup Requests</h1>
              <p className="section-desc">
                View, accept, and manage the full collection lifecycle for citizen pickup requests within your assigned territory.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fetchRequestsAndFacilities}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '2rem', padding: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Toolbar: Status Tabs & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          {/* Status Tabs */}
          <div className="filter-chips" style={{ marginBottom: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`filter-chip ${activeStatusTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveStatusTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: activeStatusTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-elevated)',
                  color: activeStatusTab === tab.id ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* District selector + Search */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {assignedDistricts.length > 1 && (
              <select
                className="form-select"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                value={activeDistrictFilter}
                onChange={e => setActiveDistrictFilter(e.target.value)}
              >
                <option value="all">All Assigned Districts</option>
                {assignedDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}

            <div className="lookup-input-box" style={{ maxWidth: '260px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="lookup-input"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading live pickup requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-surface-elevated)' }}>
            <h3>No district requests found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No pickup requests match the current filters in {assignedDistricts.join(', ')}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {requests.map(req => (
              <div key={req._id || req.requestId} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Request #{req.requestId}</h2>
                      <StatusBadge status={req.status} />
                      <span className="badge badge-success">{req.district}</span>
                      {req.collectorName && (
                        <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                          Collector: {req.collectorName}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.88rem', marginTop: '0.75rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Citizen Details</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.userName}</div>
                        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={13} /> {req.userPhone}
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Pickup Location</div>
                        <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} color="var(--primary)" /> {req.address}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      <span className="badge badge-accent">
                        Est: {req.estimatedKg} kg {req.verifiedKg ? `• Scale Verified: ${req.verifiedKg} kg` : ''}
                      </span>
                      {(req.plasticTypes || []).map(p => (
                        <span key={p} className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          {p}
                        </span>
                      ))}
                      {req.facilityName && (
                        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                          Facility: {req.facilityName}
                        </span>
                      )}
                    </div>

                    {req.notes && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Citizen Note:</strong> "{req.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <StatusBadge status={req.status} size="lg" />

                    {/* Dynamic Action Buttons based on status */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {req.status === 'Pending' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAcceptRequest(req)}
                        >
                          <Truck size={14} />
                          <span>Accept Request</span>
                        </button>
                      )}

                      {req.status === 'Accepted' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openCollectWeightModal(req)}
                        >
                          <Scale size={14} />
                          <span>Mark as Collected (Verify Weight)</span>
                        </button>
                      )}

                      {req.status === 'Collected' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ background: 'hsl(280, 70%, 42%)', borderColor: 'hsl(280, 70%, 42%)' }}
                          onClick={() => openDeliveryModal(req)}
                        >
                          <Building size={14} />
                          <span>Deliver to Facility</span>
                        </button>
                      )}

                      {req.status === 'Delivered to Facility' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkCompleted(req)}
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Completed & Recycled</span>
                        </button>
                      )}

                      {req.status === 'Completed' && (
                        <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem' }}>
                          <CheckCircle2 size={14} /> Recycling Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <RequestStepTracker status={req.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Verify Weight on Collection */}
      {weightModalReq && (
        <div className="modal-overlay" onClick={() => !submittingModal && setWeightModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !submittingModal && setWeightModalReq(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Scale size={22} color="var(--primary)" />
              <span>Verify Collected Weight</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Weigh the plastic batch for Request <strong>#{weightModalReq.requestId}</strong> ({weightModalReq.userName}, {weightModalReq.district}) using the hanging digital scale:
            </p>

            <form onSubmit={handleConfirmCollected}>
              <div className="form-group">
                <label className="form-label">Verified Scale Weight (Kilograms) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5000"
                  className="form-input"
                  value={verifiedWeightInput}
                  onChange={e => setVerifiedWeightInput(e.target.value)}
                  required
                  autoFocus
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Citizen estimated: {weightModalReq.estimatedKg} kg
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setWeightModalReq(null)}
                  disabled={submittingModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                  disabled={submittingModal}
                >
                  <CheckCircle2 size={16} />
                  <span>{submittingModal ? 'Saving...' : 'Confirm Collected'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Deliver to Authorized Facility */}
      {deliveryModalReq && (
        <div className="modal-overlay" onClick={() => !submittingModal && setDeliveryModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !submittingModal && setDeliveryModalReq(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building size={22} color="hsl(280, 70%, 42%)" />
              <span>Select Delivery Facility</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Confirm destination facility for Request <strong>#{deliveryModalReq.requestId}</strong> ({deliveryModalReq.verifiedKg || deliveryModalReq.estimatedKg} kg of {(deliveryModalReq.plasticTypes || []).join(', ')}):
            </p>

            <form onSubmit={handleConfirmDelivered}>
              <div className="form-group">
                <label className="form-label">Authorized Recycling / Waste-to-Energy Plant *</label>
                <select
                  className="form-select"
                  value={selectedFacilityId}
                  onChange={e => setSelectedFacilityId(e.target.value)}
                  required
                >
                  {facilities.map(fac => (
                    <option key={fac._id || fac.id} value={fac._id || fac.id}>
                      {fac.name} ({fac.district} - {fac.type})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                margin: '1.25rem 0'
              }}>
                <ShieldCheck size={16} color="var(--primary)" style={{ display: 'inline', marginRight: 4 }} />
                <span>The facility gate will receive this batch into their official processing inventory ledger in MongoDB.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setDeliveryModalReq(null)}
                  disabled={submittingModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5, background: 'hsl(280, 70%, 42%)', borderColor: 'hsl(280, 70%, 42%)' }}
                  disabled={submittingModal}
                >
                  <Building size={16} />
                  <span>{submittingModal ? 'Delivering...' : 'Confirm Plant Delivery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
