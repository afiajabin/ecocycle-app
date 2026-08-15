import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Recycle, ArrowRight, ShieldCheck, Heart, Leaf, Mail } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { addToast } = useToast()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'warning')
      return
    }
    addToast('Subscribed to the EcoCycle Green Newsletter!', 'success')
    setEmail('')
  }

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-main">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="nav-brand">
              <div className="brand-icon-wrapper">
                <Recycle size={20} strokeWidth={2.4} />
              </div>
              <span>EcoCycle</span>
            </Link>
            <p className="footer-bio">
              Empowering individuals, enterprises, and communities to turn waste into valuable circular resources through smart doorstep pickups and verified eco-rewards.
            </p>
            <div className="footer-badges">
              <span className="badge badge-success">
                <Leaf size={12} /> B-Corp Certified
              </span>
              <span className="badge badge-accent">
                <ShieldCheck size={12} /> ISO 14001
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="footer-column-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/services" className="footer-link">Recycling Pickup</Link></li>
              <li><Link to="/services" className="footer-link">Drop-off Kiosks</Link></li>
              <li><Link to="/rewards" className="footer-link">EcoRewards Market</Link></li>
              <li><Link to="/impact" className="footer-link">Carbon Calculator</Link></li>
              <li><Link to="/blog" className="footer-link">Zero-Waste Guides</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">Our Mission</Link></li>
              <li><Link to="/about" className="footer-link">Leadership Team</Link></li>
              <li><Link to="/about" className="footer-link">Partners & NGOs</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
              <li><Link to="/contact" className="footer-link">Enterprise Inquiries</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="newsletter-box">
            <h4 className="footer-column-title">Stay in the Loop</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Get weekly zero-waste tips, circular economy updates, and exclusive double-point pickup days.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Your email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" aria-label="Subscribe to newsletter">
                <Mail size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} EcoCycle Platform. Built for a sustainable circular future.
          </div>
          <div className="footer-bottom-links">
            <Link to="/about" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="/about" className="footer-bottom-link">Terms of Service</Link>
            <Link to="/contact" className="footer-bottom-link">Sustainability Report</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
