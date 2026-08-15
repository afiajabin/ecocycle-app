import { Link } from 'react-router-dom'
import { Recycle, Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '540px' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <Recycle size={36} />
        </div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Lost in the Stream</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you are looking for might have been moved, recycled, or doesn't exist. Let's get you back on track!
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
          <Link to="/services" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
