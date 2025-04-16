import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import './index.css'
import Home from './pages/Home.jsx'
import Terms from './pages/Terms.jsx'
import Pricing from './pages/Pricing.jsx'
import App from './App'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import ComingSoon from './pages/ComingSoon'

// Add smooth scrolling to the HTML element
document.documentElement.style.scrollBehavior = 'smooth'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// Create root only once
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + '/app',
        audience: 'https://thinkflow.ai/api'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || window.location.pathname
        );
      }}
    >
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
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
