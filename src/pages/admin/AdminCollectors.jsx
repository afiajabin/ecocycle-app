import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { 
  getAdminCollectors, 
  assignCollectorJurisdiction,
} from '../../services/api'
import { 
  Truck, 
  MapPin, 
  Phone, 
  Star, 
  Edit, 
  CheckCircle2, 
  Search,
  RefreshCw,
  X
} from 'lucide-react'

export default function AdminCollectors() {
  const { addToast } = useToast()

  const [collectors, setCollectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [reassignCollectorModal, setReassignCollectorModal] = useState(null)
  const [selectedDistrictsForReassign, setSelectedDistrictsForReassign] = useState([])
  const [savingJurisdiction, setSavingJurisdiction] = useState(false)

  const bangladeshDistricts = [
    'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Faridpur',
    'Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Noakhali', 'Brahmanbaria', 'Chandpur',
    'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj',
    'Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore',
    'Khulna', 'Jashore', 'Satkhira', 'Kushtia', 'Bagerhat',
    'Barishal', 'Bhola', 'Patuakhali', 'Pirojpur',
    'Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha',
    'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'
  ]

  const fetchCollectors = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getAdminCollectors()
      if (res.success) {
        setCollectors(res.data)
      }
    } catch (err) {
      console.error('Failed to load collectors:', err)
      setError(err.message || 'Error loading collectors from server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollectors()
  }, [])

  const filteredCollectors = collectors.filter(col => 
    (col.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (col.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (col.assignedDistricts || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const openReassignModal = (col) => {
    setReassignCollectorModal(col)
    setSelectedDistrictsForReassign([...(col.assignedDistricts || [col.district || 'Dhaka'])])
  }

  const toggleDistrictReassign = (districtName) => {
    if (selectedDistrictsForReassign.includes(districtName)) {
      if (selectedDistrictsForReassign.length > 1) {
        setSelectedDistrictsForReassign(prev => prev.filter(d => d !== districtName))
      } else {
        addToast('A collector must be assigned to at least 1 district.', 'warning')
      }
    } else {
      setSelectedDistrictsForReassign(prev => [...prev, districtName])
    }
  }

  const handleSaveDistrictReassign = async () => {
    try {
      setSavingJurisdiction(true)
      const res = await assignCollectorJurisdiction(reassignCollectorModal._id || reassignCollectorModal.id, {
        assignedDistricts: selectedDistrictsForReassign,
      })

      if (res.success) {
        addToast(`Updated assigned districts for ${reassignCollectorModal.name}!`, 'success')
        setReassignCollectorModal(null)
        fetchCollectors()
      }
    } catch (err) {
      addToast(err.message || 'Failed to update districts', 'error')
    } finally {
      setSavingJurisdiction(false)
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/admin/dashboard" className="breadcrumb-link">Admin Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">Collector Accounts & Districts</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-tag">
              <Truck size={14} /> District Workforce Management
            </span>
            <h1 className="section-title">Manage District Waste Collectors</h1>
            <p className="section-desc">
              Monitor collector credentials, vehicle registration, and assign collectors to specific districts across Bangladesh.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={fetchCollectors}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '1.5rem', padding: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Search Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="lookup-input-box" style={{ maxWidth: '320px', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="lookup-input"
              placeholder="Search collectors by name, district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Active Fleet: <strong>{collectors.length}</strong> collectors in MongoDB
          </div>
        </div>

        {/* Collectors Grid */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading collector directory...</p>
          </div>
        ) : filteredCollectors.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-surface-elevated)' }}>
            <h3>No collectors found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No registered collectors match the search criteria.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredCollectors.map(col => (
              <div key={col._id || col.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}>
                      {(col.name || 'CO').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>{col.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{col.email}</div>
                    </div>
                  </div>

                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> {col.status || 'Active'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Phone size={14} /> <span>{col.phone || '+880 1712-345678'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Truck size={14} /> <span>{col.vehicleType || 'Electric Waste Van (EV-04)'} ({col.vehicleNumber || 'Dhaka Metro-DH-11-2045'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Star size={14} fill="#facc15" color="#facc15" /> <span>{col.rating || 4.9} Rating • {col.totalCollections || 0} Collections</span>
                  </div>
                </div>

                {/* Assigned Districts */}
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Assigned District Operations:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {(col.assignedDistricts || [col.district || 'Dhaka']).map(d => (
                      <span key={d} className="badge badge-accent" style={{ fontSize: '0.78rem' }}>
                        <MapPin size={11} /> {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => openReassignModal(col)}
                  >
                    <Edit size={14} />
                    <span>Assign / Reassign Districts</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Reassign Districts */}
      {reassignCollectorModal && (
        <div className="modal-overlay" onClick={() => !savingJurisdiction && setReassignCollectorModal(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !savingJurisdiction && setReassignCollectorModal(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>
              Assign Districts: {reassignCollectorModal.name}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select all districts this collector should monitor for plastic waste pickup requests:
            </p>

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', paddingRight: '0.5rem' }}>
              {bangladeshDistricts.map(d => {
                const isSelected = selectedDistrictsForReassign.includes(d)
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDistrictReassign(d)}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{d}
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Selected: <strong>{selectedDistrictsForReassign.length}</strong> district(s)
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReassignCollectorModal(null)}
                  disabled={savingJurisdiction}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDistrictReassign}
                  disabled={savingJurisdiction}
                >
                  {savingJurisdiction ? 'Saving...' : 'Save District Assignments'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
