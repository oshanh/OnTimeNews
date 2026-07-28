import React from 'react'
import { useAdminAuth } from './AuthContext'
import AdminLogin from './AdminLogin'

export default function AdminRoute({ children }) {
  const { authHeader } = useAdminAuth()

  if (!authHeader) {
    return <AdminLogin />
  }

  return children
}
