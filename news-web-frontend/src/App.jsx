import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import NewsDetailPage from './pages/NewsDetailPage'
import { AdminAuthProvider } from './admin/AuthContext'
import AdminRoute from './admin/AdminRoute'
import AdminDashboard from './admin/AdminDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/news/:newsId" element={<NewsDetailPage />} />
        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </AdminAuthProvider>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
