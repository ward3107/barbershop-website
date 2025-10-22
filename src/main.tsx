import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvironment } from './config/validateEnv'

// Validate environment variables before starting the app
try {
  validateEnvironment();
} catch (error) {
  // Show error message to user
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-center;
      min-height: 100vh;
      background: #000;
      color: #fff;
      font-family: monospace;
      padding: 2rem;
    ">
      <div style="
        max-width: 800px;
        background: #1a1a1a;
        border: 2px solid #ff0000;
        border-radius: 1rem;
        padding: 2rem;
      ">
        <h1 style="color: #ff0000; margin-bottom: 1rem;">⚠️ Configuration Error</h1>
        <p style="margin-bottom: 1rem;">The application is not properly configured.</p>
        <p style="color: #888;">Please check the browser console for details.</p>
      </div>
    </div>
  `;
  throw error;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)