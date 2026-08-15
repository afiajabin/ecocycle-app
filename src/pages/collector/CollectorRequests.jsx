import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/StatusBadge'
import RequestStepTracker from '../../components/RequestStepTracker'
import { 
  ListOrdered, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Building, 
  Layers, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Scale,
  X
} from 'lucide-react'

export default function CollectorRequests() {
  const { userProfile } = useAuthRole()
  const { requests, facilities, updateRequestStatus } = useData()
  const { addToast } = useToast()

  const assignedDistricts = userProfile.assignedDistricts || [userProfile.district || 'Dhaka']
  const [activeDistrictFilter, setActiveDistrictFilter] = useState('all')
  const [activeStatusTab, setActiveStatusTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [weightModalReq, setWeightModalReq] = useState(null)
  const [verifiedWeightInput, setVerifiedWeightInput] = useState('')

  const [deliveryModalReq, setDeliveryModalReq] = useState(null)
  const [selectedFacilityId, setSelectedFacilityId] = useState('')

  // Requests in collector's districts
  const districtRequests = requests.filter(r => assignedDistricts.includes(r.district))

  const tabs = [
    { id: 'all', label: 'All District Requests', count: districtRequests.length },
    { id: 'Pending', label: 'Pending Acceptance', count: districtRequests.filter(r => r.status === 'Pending').length },
    { id: 'Accepted', label: 'Accepted (To Collect)', count: districtRequests.filter(r => r.status === 'Accepted').length },
    { id: 'Collected', label: 'Collected (In Transit)', count: districtRequests.filter(r => r.status === 'Collected').length },
    { id: 'Delivered to Facility', label: 'At Facility', count: districtRequests.filter(r => r.status === 'Delivered to Facility').length },
    { id: 'Completed', label: 'Completed', count: districtRequests.filter(r => r.status === 'Completed').length }
  ]

  const filteredRequests = districtRequests.filter(req => {
    const matchesDistrict = activeDistrictFilter === 'all' || req.district === activeDistrictFilter
    const matchesStatus = activeStatusTab === 'all' || req.status === activeStatusTab
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.plasticTypes.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDistrict && matchesStatus && matchesSearch
  })

  // Status progression handlers
  const handleAcceptRequest = (req) => {
    updateRequestStatus(req.id, 'Accepted', {
      collectorId: userProfile.id,
      collectorName: userProfile.name
    })
    addToast(`Accepted pickup request #${req.id} in ${req.district}. Citizen notified.`, 'success')
  }

  const openCollectWeightModal = (req) => {
    setWeightModalReq(req)
    setVerifiedWeightInput(req.estimatedKg.toString())
  }

  const handleConfirmCollected = (e) => {
    e.preventDefault()
    if (!verifiedWeightInput || Number(verifiedWeightInput) <= 0) {
      addToast('Please enter a valid verified weight in kg.', 'warning')
      return
    }

    const weightNum = Number(verifiedWeightInput)
    updateRequestStatus(weightModalReq.id, 'Collected', {
      verifiedKg: weightNum,
      collectorId: userProfile.id,
      collectorName: userProfile.name
    })

    setWeightModalReq(null)
    addToast(`Marked #${weightModalReq.id} as Collected (${weightNum} kg verified). Ready for facility transport.`, 'success')
  }

  const openDeliveryModal = (req) => {
    setDeliveryModalReq(req)
    setSelectedFacilityId(facilities[0]?.id || '')
  }

  const handleConfirmDelivered = (e) => {
    e.preventDefault()
    const targetFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0]
    
    updateRequestStatus(deliveryModalReq.id, 'Delivered to Facility', {
      facilityId: targetFacility.id,
      facilityName: targetFacility.name
    })

    setDeliveryModalReq(null)
    addToast(`Marked #${deliveryModalReq.id} as Delivered to ${targetFacility.name}!`, 'success')
  }

  const handleMarkCompleted = (req) => {
    updateRequestStatus(req.id, 'Completed')
    addToast(`Request #${req.id} finalized and confirmed recycled!`, 'success')
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

          <h1 className="section-title">District Plastic Pickup Requests</h1>
          <p className="section-desc">
            View, accept, and manage the full collection lifecycle for citizen pickup requests within your assigned territory.
          </p>
        </div>

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
        {filteredRequests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-surface-elevated)' }}>
            <h3>No district requests found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No pickup requests match the current filters in {assignedDistricts.join(', ')}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredRequests.map(req => (
              <div key={req.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Request #{req.id}</h2>
                      <span className="badge badge-success">{req.district}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Preferred: {req.preferredDate} ({req.preferredTime})
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem', marginTop: '0.75rem' }}>
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
                        Est: {req.estimatedKg} kg {req.verifiedKg ? `• Verified: ${req.verifiedKg} kg` : ''}
                      </span>
                      {req.plasticTypes.map(p => (
                        <span key={p} className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          {p}
                        </span>
                      ))}
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
                          <CheckCircle2 size={14} /> Order Finalized
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
        <div className="modal-overlay" onClick={() => setWeightModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setWeightModalReq(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Scale size={22} color="var(--primary)" />
              <span>Verify Collected Weight</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Weigh the plastic batch for Request <strong>#{weightModalReq.id}</strong> ({weightModalReq.userName}, {weightModalReq.district}) using the hanging digital scale:
            </p>

            <form onSubmit={handleConfirmCollected}>
              <div className="form-group">
                <label className="form-label">Verified Scale Weight (Kilograms) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="500"
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm Collected</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Deliver to Authorized Facility */}
      {deliveryModalReq && (
        <div className="modal-overlay" onClick={() => setDeliveryModalReq(null)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDeliveryModalReq(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building size={22} color="hsl(280, 70%, 42%)" />
              <span>Select Delivery Facility</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Confirm destination facility for Request <strong>#{deliveryModalReq.id}</strong> ({deliveryModalReq.verifiedKg || deliveryModalReq.estimatedKg} kg of {deliveryModalReq.plasticTypes.join(', ')}):
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
                    <option key={fac.id} value={fac.id}>
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
                <span>The facility gate will receive this batch into their official processing inventory ledger.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setDeliveryModalReq(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5, background: 'hsl(280, 70%, 42%)', borderColor: 'hsl(280, 70%, 42%)' }}
                >
                  <Building size={16} />
                  <span>Confirm Plant Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
