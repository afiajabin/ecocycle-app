import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { 
  PlusCircle, 
  MapPin, 
  Layers, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Boxes,
  ShieldCheck
} from 'lucide-react'

export default function RequestPickup() {
  const { userProfile } = useAuthRole()
  const { createRequest, divisions } = useData()
  const { addToast } = useToast()
  const navigate = useNavigate()

  // Form State
  const [district, setDistrict] = useState(userProfile.district || 'Dhaka')
  const [address, setAddress] = useState(userProfile.address || '')
  const [selectedPlastics, setSelectedPlastics] = useState(['PET Bottles'])
  const [estimatedKg, setEstimatedKg] = useState(10)
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [preferredTime, setPreferredTime] = useState('Morning (9:00 AM - 1:00 PM)')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const plasticOptions = [
    { id: 'PET Bottles', label: 'PET Bottles (Water & soft drinks)', code: '#1', desc: 'Transparent beverage bottles, food jars' },
    { id: 'HDPE Containers', label: 'HDPE Containers (Detergent & milk jugs)', code: '#2', desc: 'Rigid shampoo, oil & cleaner containers' },
    { id: 'LDPE Bags & Films', label: 'LDPE Bags & Wrapping Films', code: '#4', desc: 'Shopping bags, grocery liners, bubble wrap' },
    { id: 'PP Plastics', label: 'PP Plastics (Bottle caps & food tubs)', code: '#5', desc: 'Yogurt cups, takeaway food boxes' },
    { id: 'Mixed Plastics', label: 'Mixed / Multilayer Packaging', code: '#7', desc: 'Snack packets, chips wrappers for waste-to-energy' },
  ]

  const handlePlasticToggle = (typeId) => {
    if (selectedPlastics.includes(typeId)) {
      if (selectedPlastics.length > 1) {
        setSelectedPlastics(prev => prev.filter(p => p !== typeId))
      } else {
        addToast('Please select at least one plastic waste stream.', 'warning')
      }
    } else {
      setSelectedPlastics(prev => [...prev, typeId])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!address.trim()) {
      addToast('Please provide a specific street address in ' + district, 'warning')
      return
    }

    setIsSubmitting(true)

    const newReq = createRequest({
      userId: userProfile.id,
      userName: userProfile.name,
      userPhone: userProfile.phone,
      district,
      address,
      plasticTypes: selectedPlastics,
      estimatedKg: Number(estimatedKg),
      preferredDate,
      preferredTime,
      notes
    })

    setTimeout(() => {
      setIsSubmitting(false)
      addToast(`Pickup request #${newReq.id} submitted for ${district}! Assigned district collector notified.`, 'success')
      navigate('/user/my-requests')
    }, 400)
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/user/dashboard" className="breadcrumb-link">User Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">Request Plastic Waste Pickup</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <span className="section-tag">
            <PlusCircle size={14} /> Doorstep Plastic Recovery
          </span>
          <h1 className="section-title">Schedule Plastic Waste Pickup</h1>
          <p className="section-desc">
            Submit your district, location, and plastic types. Our district-based collector will arrive to collect, weigh, and transport your recyclables directly to authorized facilities.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            {/* 1. District & Location */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>1. District & Pickup Location</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">District (All 64 Districts of Bangladesh) *</label>
                  <select
                    className="form-select"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    required
                  >
                    {Object.entries(divisions).map(([divName, distList]) => (
                      <optgroup key={divName} label={divName}>
                        {distList.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address / Area / Landmark *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. House 42, Road 9A, Dhanmondi, Dhaka"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Plastic Types */}
            <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--primary)" />
                <span>2. Plastic Waste Categories</span>
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Select all plastic types included in this batch:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {plasticOptions.map(opt => {
                  const isChecked = selectedPlastics.includes(opt.id)
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handlePlasticToggle(opt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isChecked ? 'var(--primary-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isChecked ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Estimated Quantity (kg) */}
            <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Boxes size={18} color="var(--primary)" />
                  <span>3. Estimated Batch Weight</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {estimatedKg} kg
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Our collector carries portable calibrated digital hanging scales to verify actual weight upon pickup.
              </p>
              <input
                type="range"
                min="2"
                max="100"
                value={estimatedKg}
                onChange={e => setEstimatedKg(Number(e.target.value))}
                className="custom-range"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span>2 kg (1 medium bag)</span>
                <span>25 kg (Household monthly)</span>
                <span>50 kg+ (Commercial / Bulk)</span>
                <span>100 kg</span>
              </div>
            </div>

            {/* 4. Preferred Date & Time */}
            <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="var(--primary)" />
                <span>4. Preferred Date & Schedule</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pickup Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Slot *</label>
                  <select
                    className="form-select"
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                  >
                    <option value="Morning (9:00 AM - 1:00 PM)">Morning (9:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
                    <option value="Evening (6:00 PM - 8:30 PM)">Evening (6:00 PM - 8:30 PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Pickup Notes / Gate Instructions (Optional)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="e.g. Leave bags with building security guard, or call before arrival..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Submission Banner */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={24} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Zero Landfill Guarantee</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Assigned to certified {district} collector and authorized recycling facility.
                  </div>
                </div>
              </div>
              <span className="badge badge-success">Free Citizen Pickup</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Dispatching Request...' : 'Confirm & Dispatch Pickup Request'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/user/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
