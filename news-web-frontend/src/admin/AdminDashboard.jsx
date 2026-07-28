import React, { useEffect, useState } from 'react'
import { useAdminAuth } from './AuthContext'
import { listAllNews, deleteNews, createNews } from '../api/adminApi'
import { getCategories } from '../api/newsApi'

function AdminNewsForm({ onCreate, authHeader, categories }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()
    await createNews(authHeader, { title, summary, content, categoryIds: selectedIds })
    setTitle('')
    setSummary('')
    setContent('')
    onCreate()
  }
  function toggleCategory(id) {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Summary
        <input value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>
      <label>
        Content
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} required />
      </label>
      <div>
        <p className="section-kicker">Categories</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(categories || []).map((c) => (
            <label key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleCategory(c.id)} />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button className="primary-button" type="submit">Create</button>
    </form>
  )
}

export default function AdminDashboard() {
  const { authHeader, logout } = useAdminAuth()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await listAllNews(authHeader)
      setNews(data)
      const cats = await getCategories()
      setCategories(cats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [authHeader])

  async function handleDelete(id) {
    if (!confirm('Delete this news item?')) return
    try {
      await deleteNews(authHeader, id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }


  return (
    <div className="app-shell">
      <div className="topbar">
        <h1>Admin Dashboard</h1>
        <div>
          <button className="back-link" onClick={logout}>Sign out</button>
        </div>
      </div>

      <main className="content-grid">
        <section className="panel sidebar-panel">
          <div className="section-heading">
            <h2>Actions</h2>
          </div>
          <AdminNewsForm onCreate={load} authHeader={authHeader} categories={categories} />
        </section>

        <section className="panel panel-wide">
          <div className="section-heading">
            <h2>All news</h2>
          </div>
          {loading ? <p className="helper-text">Loading...</p> : null}
          {error ? <p className="error-banner">{error}</p> : null}
          <div className="headline-list">
            {news.map((n) => (
              <article key={n.id} className="headline-card">
                <div>
                  <div className="meta-row">
                    <span>{new Date(n.publishedAt).toLocaleString()}</span>
                    <span>{(n.categories || []).join(' · ')}</span>
                  </div>
                  <h3>{n.title}</h3>
                  <p>{n.summary}</p>
                </div>
                <div>
                  <button className="back-link" onClick={() => handleDelete(n.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
