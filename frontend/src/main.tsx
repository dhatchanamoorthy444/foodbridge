import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.onerror = (msg, url, line, col, error) => {
  console.error('[Unhandled error]', msg, url, line, col, error)
  return false
}

window.onunhandledrejection = (event) => {
  console.error('[Unhandled rejection]', event.reason)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)