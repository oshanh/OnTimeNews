import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import CategoryGrid from '../components/CategoryGrid'
import { getCategories } from '../api/newsApi'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'OnTimeNews'

    let isMounted = true

    async function loadCategories() {
      try {
        const data = await getCategories()
        if (isMounted) setCategories(data)
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCategories()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="app-shell app-shell-home">
      <Header title="OnTimeNews" />

      <main className="home-main">
        <section className="panel panel-wide">
          <div className="section-heading">
            <p className="section-kicker">Categories</p>
            <h2>Select a category to start reading</h2>
          </div>

          {loading ? (
            <p className="helper-text">Loading categories...</p>
          ) : error ? (
            <p className="error-banner">{error}</p>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </section>
      </main>
    </div>
  )
}
