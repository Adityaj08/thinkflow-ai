import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import Terms from './pages/Terms.jsx'
import Pricing from './pages/Pricing.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import ComingSoon from './pages/ComingSoon'

// Add smooth scrolling to the HTML element
document.documentElement.style.scrollBehavior = 'smooth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<ComingSoon />} />
            <Route path="/changelog" element={<ComingSoon />} />
            <Route path="/about" element={<ComingSoon />} />
            <Route path="/blog" element={<ComingSoon />} />
            <Route path="/careers" element={<ComingSoon />} />
            <Route path="/contact" element={<ComingSoon />} />
            <Route path="/privacy" element={<ComingSoon />} />
            <Route path="/cookies" element={<ComingSoon />} />
            <Route path="/gdpr" element={<ComingSoon />} />
            <Route path="/community" element={<ComingSoon />} />
            <Route path="/help" element={<ComingSoon />} />
            <Route path="/status" element={<ComingSoon />} />
            <Route path="/api" element={<ComingSoon />} />
          </Route>
          <Route path="/app" element={<App />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
)
