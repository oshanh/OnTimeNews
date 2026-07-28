import React, { useState } from 'react'
import { useAdminAuth } from './AuthContext'
import { listAllNews } from '../api/adminApi'

export default function AdminLogin({ onSuccess }) {
  const { login } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const header = 'Basic ' + btoa(`${username}:${password}`)
    try {
      // verify credentials by calling a protected endpoint
      await listAllNews(header)
      // only store header after successful verification
      login(username, password)
      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="panel panel-wide">
      <div className="section-heading">
        <h2>Admin login</h2>
      </div>
      <form onSubmit={handleSubmit} className="comment-form">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error ? <p className="error-banner">{error}</p> : null}
        <button className="primary-button" type="submit">Sign in</button>
      </form>
    </div>
  )
}
