import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { 
  getAdminFacilities, 
  createAdminFacility,
} from '../../services/api'
import { 
  Building, 
  PlusCircle, 
  MapPin, 
  Phone, 
  Recycle, 
  Flame, 
  Search,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react'

export default function AdminFacilities() {
  const { addToast } = useToast()

  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  // Add Facility Form
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('Dhaka')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Mechanical Recycling & Flaking')
  const [dailyCapacityTons, setDailyCapacityTons] = useState(50)
  const [contactPerson, setContactPerson] = useState('')
  const [contactPhone, setContactPhone] = useState('+880 1711-223344')
  const [acceptedTypes, setAcceptedTypes] = useState(['PET Bottles', 'HDPE Containers'])

  const availablePlasticTypes = [
    'PET Bottles',
    'HDPE Containers',
    'LDPE Bags & Films',
    'PP Plastics',
    'Mixed Plastics',
    'Non-recyclable Multilayer Plastics'
  ]

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getAdminFacilities()
      if (res.success) {
        setFacilities(res.data)
      }
    } catch (err) {
      console.error('Failed to load facilities:', err)
      setError(err.message || 'Error loading facilities from server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFacilities()
  }, [])

  const toggleType = (t) => {
    if (acceptedTypes.includes(t)) {
      if (acceptedTypes.length > 1) {
        setAcceptedTypes(prev => prev.filter(x => x !== t))
      }
    } else {
      setAcceptedTypes(prev => [...prev, t])
    }
  }

  const filteredFacilities = facilities.filter(fac => {
    const matchesDistrict = districtFilter === 'all' || fac.district === districtFilter
    const matchesSearch = (fac.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (fac.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (fac.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDistrict && matchesSearch
  })

  const handleAddFacilitySubmit = async (e) => {
    e.preventDefault()
    if (!name || !location) {
      addToast('Please provide name and location.', 'warning')
      return
    }

    try {
      setCreating(true)
      const res = await createAdminFacility({
        name,
        district,
        location,
        type,
        dailyCapacityTons: Number(dailyCapacityTons),
        contactPerson: contactPerson || 'Facility Operations Manager',
        contactPhone,
        acceptedTypes
      })

      if (res.success) {
        setIsAddModalOpen(false)
        setName('')
        setLocation('')
        addToast(`Facility "${name}" in ${district} registered into MongoDB database!`, 'success')
        fetchFacilities()
      }
    } catch (err) {
      addToast(err.message || 'Failed to create facility', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/admin/dashboard" className="breadcrumb-link">Admin Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">Recycling & Energy Facilities</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-tag">
              <Building size={14} /> Industrial Endpoints
            </span>
            <h1 className="section-title">Authorized Recycling & Waste-to-Energy Plants</h1>
            <p className="section-desc">
              Manage accredited mechanical upcycling factories and waste-to-energy conversion plants across Bangladesh.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fetchFacilities}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle size={16} />
              <span>Register New Facility</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '1.5rem', padding: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="lookup-input-box" style={{ maxWidth: '300px', width: '100%' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="lookup-input"
                placeholder="Search facility name, type..."
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
              <option value="all">All Districts ({facilities.length} Plants)</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Gazipur">Gazipur</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Narayanganj">Narayanganj</option>
              <option value="Khulna">Khulna</option>
              <option value="Sylhet">Sylhet</option>
            </select>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredFacilities.length}</strong> facilities
          </div>
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading facilities from MongoDB...</p>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-surface-elevated)' }}>
            <h3>No facilities found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No registered plants match the current search filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredFacilities.map(fac => {
              const isEnergy = (fac.type || '').includes('Energy') || (fac.type || '').includes('RDF')
              return (
                <div key={fac._id || fac.id} className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        background: isEnergy ? 'var(--warm-accent-light, #fef3c7)' : 'var(--primary-light)',
                        color: isEnergy ? 'var(--warm-accent, #d97706)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isEnergy ? <Flame size={24} /> : <Recycle size={24} />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem' }}>{fac.name}</h3>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {fac.type}
                        </div>
                      </div>
                    </div>

                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> {fac.status || 'Operational'}
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} color="var(--primary)" /> <span><strong>{fac.district}:</strong> {fac.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Phone size={14} /> <span>Contact: {fac.contactPerson || 'Ops Manager'} ({fac.contactPhone || '+880 1711-223344'})</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Daily Capacity</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {fac.dailyCapacityTons || 50} Tons / Day
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Received</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>
                        {((fac.totalReceivedKg || 0) / 1000).toFixed(1)} Tons
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Accepted Feedstocks:
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {(fac.acceptedTypes || ['PET Bottles', 'HDPE Containers']).map(t => (
                        <span key={t} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal: Register Facility */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => !creating && setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !creating && setIsAddModalOpen(false)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={22} color="var(--primary)" />
              <span>Register Authorized Plant</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add a certified polymer mechanical recycler or waste-to-energy processing plant in Bangladesh.
            </p>

            <form onSubmit={handleAddFacilitySubmit}>
              <div className="form-group">
                <label className="form-label">Facility Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Gazipur RDF Gasification Plant"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">District *</label>
                  <select
                    className="form-select"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    required
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Gazipur">Gazipur</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Narayanganj">Narayanganj</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Facility Type *</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Mechanical Recycling & Flaking">Mechanical Recycling & Flaking</option>
                    <option value="Chemical & Mechanical Pelletizing">Chemical & Mechanical Pelletizing</option>
                    <option value="Waste-to-Energy & RDF Gasification">Waste-to-Energy & RDF Gasification</option>
                    <option value="High-Density Extrusion">High-Density Extrusion</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specific Location / Industrial Estate *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Plot 14, Kashimpur Industrial Zone, Gazipur"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Daily Capacity (Tons/Day)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={dailyCapacityTons}
                    onChange={e => setDailyCapacityTons(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                  disabled={creating}
                >
                  {creating ? 'Registering...' : 'Register Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
