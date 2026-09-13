import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import { useToast } from '../../context/ToastContext'
import { getMyProfile, updateMyProfile, logoutUser } from '../../services/api'
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  RefreshCw,
  Award,
  Lock,
  Activity
} from 'lucide-react'

export default function AdminProfile() {
  const { userProfile, updateCurrentUserProfile } = useAuthRole()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState(userProfile.name || '')
  const [email, setEmail] = useState(userProfile.email || '')
  const [phone, setPhone] = useState(userProfile.phone || '')
  const [district, setDistrict] = useState(userProfile.district || 'Dhaka Central')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await getMyProfile()
      if (res.success && res.data) {
        const u = res.data
        setName(u.name || '')
        setEmail(u.email || '')
        setPhone(u.phone || '')
        setDistrict(u.district || 'Dhaka Central')
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await updateMyProfile({
        name,
        phone,
        district,
      })

      if (res.success) {
        updateCurrentUserProfile({
          name,
          phone,
          district,
        })
        addToast('Admin security profile updated successfully!', 'success')
      }
    } catch (err) {
      addToast(err.message || 'Failed to update admin profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out from Admin Portal?')) {
      await logoutUser()
      window.location.href = '/login'
    }
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/admin/dashboard" className="breadcrumb-link">Admin Dashboard</Link>
          <span>/</span>
          <span className="breadcrumb-current">Admin Profile</span>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2.5rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">
                <Shield size={14} /> National Administration Authority
              </span>
              <h1 className="section-title">System Administrator Profile</h1>
              <p className="section-desc">
                Review your national command authorization credentials, manage administrative contact details, and view security tier permissions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={fetchProfile}
                disabled={loading}
                title="Refresh profile data"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Authority Banner */}
        <div className="wallet-banner" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800
            }}>
              {name ? name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} /> EcoCycle Bangladesh • Central Administrator
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '1.6rem', marginTop: '0.2rem' }}>{name || 'System Admin'}</h2>
              <div style={{ fontSize: '0.88rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
                <span>HQ / District: <strong>{district}</strong></span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Award size={14} fill="#facc15" color="#facc15" /> Super Admin Tier 1
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Authorization Scope</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
                All 64 Districts
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Security Status</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.15rem', color: '#a7f3d0' }}>
                Verified Root Active
              </div>
            </div>
          </div>
        </div>

        {/* System Authorization Card */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem', background: 'var(--bg-surface-elevated)' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--primary)" />
            <span>Administrative Privileges & Scope</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            As a central administrator, this verified account holds unrestricted operational management rights:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              <ShieldCheck size={14} /> Full 64-District Logistics Command
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              <Activity size={14} /> Collector & User Account Governance
            </span>
            <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              <Award size={14} /> Recycling Facility Authorizations
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Administrator Details</h2>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  disabled
                  style={{ opacity: 0.75, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Direct Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+880 1700-000000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Headquarters / Primary District</label>
                <input
                  type="text"
                  className="form-input"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="e.g. Dhaka Central"
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSignOut}
              >
                <span>Sign Out</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
