import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ title, backTarget }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      {backTarget ? (
        <button type="button" className="back-link" onClick={() => navigate(backTarget)}>
          ← Back
        </button>
      ) : null}

      <div>
        
        <h1>{title ?? 'OnTimeNews'}</h1>
      </div>
    </header>
  )
}
