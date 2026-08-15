import { useNavigate, Link } from 'react-router-dom'
import { useAuthRole } from '../context/AuthRoleContext'
import { useData } from '../context/DataContext'
import { 
  Recycle, 
  User, 
  Truck, 
  Shield, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  Building, 
  Layers, 
  AlertTriangle 
} from 'lucide-react'

export default function PortalHome() {
  const { switchRole } = useAuthRole()
  const { requests, facilities, collectors, users } = useData()
  const navigate = useNavigate()

  const handlePortalEntry = (role, targetPath) => {
    switchRole(role)
    navigate(targetPath)
  }

  const totalKg = requests
    .filter(r => r.status !== 'Cancelled')
    .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="section" style={{ padding: '4.5rem 0 3.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-tag" style={{ margin: '0 auto 1.25rem auto' }}>
              <Leaf size={14} /> Bangladesh Plastic Recovery System
            </div>
            
            <h1 className="hero-headline" style={{ fontSize: 'clamp(2.2rem, 4vw + 1rem, 3.4rem)' }}>
              EcoCycle: <span style={{ color: 'var(--primary)' }}>A Plastic Waste Collection</span> & Management System
            </h1>

            <p className="hero-subtitle" style={{ margin: '1.25rem auto 2.5rem auto', maxWidth: '720px' }}>
              Connecting citizens, district-based collectors, and authorized recycling facilities across all 64 districts of Bangladesh to prevent urban waterlogging, river pollution, and landfill accumulation.
            </p>

            {/* 3 Portal Role Entry Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
              {/* User Card */}
              <div 
                className="card card-interactive"
                onClick={() => handlePortalEntry('user', '/user/dashboard')}
                style={{ border: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <User size={24} />
                  </div>
                  <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Citizen Portal</span>
                  <h3 style={{ fontSize: '1.25rem' }}>User View</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Submit doorstep plastic pickup requests, select district & address, track 5-step status, and manage profile.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.92rem', marginTop: '1.5rem' }}>
                  <span>Enter as Citizen</span>
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Collector Card */}
              <div 
                className="card card-interactive"
                onClick={() => handlePortalEntry('collector', '/collector/dashboard')}
                style={{ border: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--info-light)',
                    color: 'var(--info)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Truck size={24} />
                  </div>
                  <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Field Operations</span>
                  <h3 style={{ fontSize: '1.25rem' }}>Collector View</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Access assigned district requests (e.g. Dhaka), accept pickups, verify weight, and deliver to authorized plants.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--info)', fontWeight: 700, fontSize: '0.92rem', marginTop: '1.5rem' }}>
                  <span>Enter as Collector</span>
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Admin Card */}
              <div 
                className="card card-interactive"
                onClick={() => handlePortalEntry('admin', '/admin/dashboard')}
                style={{ border: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'hsl(280, 60%, 95%)',
                    color: 'hsl(280, 70%, 42%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Shield size={24} />
                  </div>
                  <span className="badge badge-accent" style={{ marginBottom: '0.5rem', background: 'hsl(280, 60%, 95%)', color: 'hsl(280, 70%, 42%)', borderColor: 'hsla(280, 70%, 42%, 0.3)' }}>
                    System Control
                  </span>
                  <h3 style={{ fontSize: '1.25rem' }}>Admin View</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Manage users, assign collectors across 64 districts, audit nationwide requests, and monitor recycling plants.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'hsl(280, 70%, 42%)', fontWeight: 700, fontSize: '0.92rem', marginTop: '1.5rem' }}>
                  <span>Enter as Admin</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Context from Proposal */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag">
                <AlertTriangle size={14} color="var(--warm-accent)" /> Problem Context
              </span>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem 0' }}>
                Tackling Urban Waterlogging & Plastic Contamination
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
                In cities like Dhaka and Chattogram, plastic waste mixed with regular garbage frequently blocks storm drains and canals during heavy rainfall, triggering severe urban waterlogging, disrupting daily commutes, and threatening public health.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                EcoCycle provides a structured digital platform where citizens request dedicated plastic collections, collectors operate by designated district, and waste is guaranteed delivery to authorized mechanical upcycling or waste-to-energy facilities.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  64
                </div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>Districts Supported</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nationwide coverage</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--info)' }}>
                  {collectors.length}
                </div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>District Collectors</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Electric fleet routes</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'hsl(280, 70%, 42%)' }}>
                  {facilities.length}
                </div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>Authorized Plants</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mechanical & RDF</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {(totalKg / 1000).toFixed(1)} T
                </div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>Plastic Diverted</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Zero landfill policy</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
