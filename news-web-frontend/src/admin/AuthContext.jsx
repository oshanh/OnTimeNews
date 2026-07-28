import React, { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [authHeader, setAuthHeader] = useState(null)

  function login(username, password) {
    const header = 'Basic ' + btoa(`${username}:${password}`)
    setAuthHeader(header)
    return header
  }

  function logout() {
    setAuthHeader(null)
  }

  return (
    <AdminAuthContext.Provider value={{ authHeader, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
