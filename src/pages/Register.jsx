import { Link, useNavigate } from 'react-router-dom'
import {
  Recycle,
  User,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // UI demonstration only.
    // Real registration will be connected to the MERN backend later.
    navigate('/login')
  }

  return (
    <div className="section">
      <div className="container">

        <div
          style={{
            minHeight: 'calc(100vh - 220px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '980px',
              display: 'grid',
              gridTemplateColumns: '1fr 1.05fr',
              gap: '1.5rem',
              alignItems: 'stretch',
            }}
          >

            {/* Registration Form */}
            <div
              className="card"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="section-tag">
                  <User size={14} />
                  Citizen Registration
                </span>

                <h1
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    marginTop: '0.75rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  Create your account
                </h1>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Join EcoCycle and start responsibly disposing of your plastic
                  waste.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-name">
                    Full Name
                  </label>

                  <div style={{ position: 'relative' }}>
                    <User
                      size={17}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <input
                      id="register-name"
                      type="text"
                      className="form-input"
                      placeholder="Enter your full name"
                      style={{ paddingLeft: '2.75rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-email">
                    Email Address
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={17}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <input
                      id="register-email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      style={{ paddingLeft: '2.75rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-district">
                    District
                  </label>

                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={17}
                      color="var(--text-muted)"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <select
                      id="register-district"
                      className="form-select"
                      style={{ paddingLeft: '2.75rem' }}
                      defaultValue="Dhaka"
                      required
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Gazipur">Gazipur</option>
                      <option value="Narayanganj">Narayanganj</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <div className="form-group">
                    <label
                      className="form-label"
                      htmlFor="register-password"
                    >
                      Password
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={17}
                        color="var(--text-muted)"
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }}
                      />

                      <input
                        id="register-password"
                        type="password"
                        className="form-input"
                        placeholder="Password"
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label
                      className="form-label"
                      htmlFor="register-confirm-password"
                    >
                      Confirm Password
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={17}
                        color="var(--text-muted)"
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }}
                      />

                      <input
                        id="register-confirm-password"
                        type="password"
                        className="form-input"
                        placeholder="Confirm"
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.7rem',
                  }}
                >
                  <ShieldCheck
                    size={18}
                    color="var(--primary)"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    Your account will be registered as a Citizen and connected
                    to your selected district collection network.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <span>Create Citizen Account</span>
                  <ArrowRight size={17} />
                </button>
              </form>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Already have an account?{' '}

                <Link
                  to="/login"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Right Information Panel */}
            <div
              className="card"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary) 0%, hsl(158, 75%, 18%) 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Recycle size={28} />
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Make your plastic count.
              </div>

              <p
                style={{
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                }}
              >
                EcoCycle connects citizens with district-based collectors who
                collect plastic waste and route it to authorized recycling and
                waste-to-energy facilities.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                  }}
                >
                  What happens next?
                </div>

                <div
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Register → Submit a pickup request → Collector arrives →
                  Plastic reaches an authorized facility.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}