import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { 
  Building, 
  PlusCircle, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Recycle, 
  Flame, 
  Layers, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react'

export default function AdminFacilities() {
  const { facilities, addFacility, divisions, allDistricts } = useData()
  const { addToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add Facility Form
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('Dhaka')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Mechanical Recycling & Flaking')
  const [dailyCapacityTons, setDailyCapacityTons] = useState(50)
  const [contactPerson, setContactPerson] = useState('')
  const [contactPhone, setContactPhone] = useState('+880 ')
  const [acceptedTypes, setAcceptedTypes] = useState(['PET Bottles', 'HDPE Containers'])

  const availablePlasticTypes = [
    'PET Bottles',
    'HDPE Containers',
    'LDPE Bags & Films',
    'PP Plastics',
    'Mixed Plastics',
    'Non-recyclable Multilayer Plastics'
  ]

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
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDistrict && matchesSearch
  })

  const handleAddFacilitySubmit = (e) => {
    e.preventDefault()
    if (!name || !location || !contactPerson) {
      addToast('Please provide all facility details.', 'warning')
      return
    }

    addFacility({
      name,
      district,
      location,
      type,
      dailyCapacityTons: Number(dailyCapacityTons),
      contactPerson,
      contactPhone,
      acceptedTypes
    })

    setIsAddModalOpen(false)
    setName('')
    setLocation('')
    setContactPerson('')
    addToast(`Facility "${name}" in ${district} registered into national database!`, 'success')
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

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Register New Facility</span>
          </button>
        </div>

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
            Showing <strong>{filteredFacilities.length}</strong> active authorized facilities
          </div>
        </div>

        {/* Facilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {filteredFacilities.map(fac => {
            const isEnergy = fac.type.includes('Energy') || fac.type.includes('RDF')
            return (
              <div key={fac.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: isEnergy ? 'var(--warm-accent-light)' : 'var(--primary-light)',
                      color: isEnergy ? 'var(--warm-accent)' : 'var(--primary)',
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
                        ID: {fac.id} • {fac.type}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> {fac.status}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--primary)" /> <span><strong>{fac.district}:</strong> {fac.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Phone size={14} /> <span>Contact: {fac.contactPerson} ({fac.contactPhone})</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Daily Processing Capacity</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      {fac.dailyCapacityTons} Tons / Day
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Received Plastic</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>
                      {((fac.totalReceivedKg || 0) / 1000).toFixed(1)} Tons
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Accepted Waste Feedstocks:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {fac.acceptedTypes.map(t => (
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
      </div>

      {/* Modal: Register Facility */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
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
                    {allDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Daily Capacity (Tons)</label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    className="form-input"
                    value={dailyCapacityTons}
                    onChange={e => setDailyCapacityTons(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Engr. Name"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
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
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Accepted Plastic Feedstock Types</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {availablePlasticTypes.map(t => {
                    const isChecked = acceptedTypes.includes(t)
                    return (
                      <div
                        key={t}
                        onClick={() => toggleType(t)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          background: isChecked ? 'var(--primary-light)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          fontSize: '0.82rem'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                        />
                        <span>{t}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                >
                  <PlusCircle size={16} />
                  <span>Register Facility</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
