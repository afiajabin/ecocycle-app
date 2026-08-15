import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { 
  Truck, 
  PlusCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Edit, 
  CheckCircle2, 
  ShieldCheck,
  Search,
  X
} from 'lucide-react'

export default function AdminCollectors() {
  const { collectors, addCollector, updateCollectorDistricts, divisions, allDistricts } = useData()
  const { addToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [reassignCollectorModal, setReassignCollectorModal] = useState(null)
  const [selectedDistrictsForReassign, setSelectedDistrictsForReassign] = useState([])

  // New Collector Form State
  const [newColName, setNewColName] = useState('')
  const [newColEmail, setNewColEmail] = useState('')
  const [newColPhone, setNewColPhone] = useState('+880 ')
  const [newColVehicle, setNewColVehicle] = useState('Electric Waste Van (EV-05)')
  const [newColVehicleNo, setNewColVehicleNo] = useState('Dhaka Metro-DH-')
  const [newColDistricts, setNewColDistricts] = useState(['Dhaka'])

  const filteredCollectors = collectors.filter(col => 
    col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.assignedDistricts.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddCollectorSubmit = (e) => {
    e.preventDefault()
    if (!newColName || !newColEmail || newColDistricts.length === 0) {
      addToast('Please provide all collector details and at least 1 assigned district.', 'warning')
      return
    }

    addCollector({
      name: newColName,
      email: newColEmail,
      phone: newColPhone,
      vehicleType: newColVehicle,
      vehicleNumber: newColVehicleNo,
      assignedDistricts: newColDistricts
    })

    setIsAddModalOpen(false)
    setNewColName('')
    setNewColEmail('')
    setNewColPhone('+880 ')
    addToast(`Collector account created for ${newColName} assigned to ${newColDistricts.join(', ')}!`, 'success')
  }

  const openReassignModal = (col) => {
    setReassignCollectorModal(col)
    setSelectedDistrictsForReassign([...col.assignedDistricts])
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

  const handleSaveDistrictReassign = () => {
    updateCollectorDistricts(reassignCollectorModal.id, selectedDistrictsForReassign)
    setReassignCollectorModal(null)
    addToast(`Updated assigned districts for ${reassignCollectorModal.name} to [${selectedDistrictsForReassign.join(', ')}]`, 'success')
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
              Create collector credentials and assign collectors to specific districts across Bangladesh to handle local plastic pickup routes.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Create New Collector Account</span>
          </button>
        </div>

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
            Active Fleet: <strong>{collectors.length}</strong> collectors across 64 districts
          </div>
        </div>

        {/* Collectors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {filteredCollectors.map(col => (
            <div key={col.id} className="card" style={{ padding: '2rem' }}>
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
                    {col.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{col.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ID: {col.id} • {col.email}</div>
                  </div>
                </div>

                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> {col.status}
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Phone size={14} /> <span>{col.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Truck size={14} /> <span>{col.vehicleType} ({col.vehicleNumber})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Star size={14} fill="#facc15" color="#facc15" /> <span>{col.rating || 4.9} Rating • {col.totalCollections || 0} Collections Completed</span>
                </div>
              </div>

              {/* Assigned Districts */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Assigned District Operations:
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {col.assignedDistricts.map(d => (
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
      </div>

      {/* Modal: Create Collector */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={22} color="var(--primary)" />
              <span>Create Collector Account</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Register a certified district waste worker and assign initial operational territory in Bangladesh.
            </p>

            <form onSubmit={handleAddCollectorSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tariqul Islam"
                    value={newColName}
                    onChange={e => setNewColName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tariqul.collector@ecocycle.bd"
                    value={newColEmail}
                    onChange={e => setNewColEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number (BD) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColPhone}
                    onChange={e => setNewColPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColVehicle}
                    onChange={e => setNewColVehicle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={newColVehicleNo}
                  onChange={e => setNewColVehicleNo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Initial Assigned District(s) *</label>
                <select
                  className="form-select"
                  onChange={e => {
                    const val = e.target.value
                    if (val && !newColDistricts.includes(val)) {
                      setNewColDistricts([...newColDistricts, val])
                    }
                  }}
                >
                  <option value="">+ Add District from 64 BD Districts...</option>
                  {allDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {newColDistricts.map(d => (
                    <span key={d} className="badge badge-success" style={{ padding: '0.3rem 0.6rem' }}>
                      {d}
                      <button
                        type="button"
                        onClick={() => setNewColDistricts(newColDistricts.filter(x => x !== d))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 4, color: 'inherit' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
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
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reassign Districts */}
      {reassignCollectorModal && (
        <div className="modal-overlay" onClick={() => setReassignCollectorModal(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReassignCollectorModal(null)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>
              Assign Districts: {reassignCollectorModal.name}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select all districts this collector should monitor for doorstep plastic waste pickup requests:
            </p>

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {Object.entries(divisions).map(([divName, distList]) => (
                <div key={divName}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {divName}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    {distList.map(d => {
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
                </div>
              ))}
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
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDistrictReassign}
                >
                  Save District Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
