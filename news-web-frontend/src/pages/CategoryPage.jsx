import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { getCategories, getNewsByCategory } from '../api/newsApi'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCategoryNews() {
      try {
        const [categoryData, newsData] = await Promise.all([
          getCategories(),
          getNewsByCategory(categoryId),
        ])

        if (isMounted) {
          setCategories(categoryData)
          setNewsItems(newsData)
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCategoryNews()
    return () => {
      isMounted = false
    }
  }, [categoryId])

  const activeCategory = categories.find((category) => String(category.id) === String(categoryId))

  return (
    <div className="app-shell">
      <Header backTarget="/" title={activeCategory?.name ?? 'News headlines'} />

      <main className="content-grid">
        <aside className="panel sidebar-panel">
          <div className="section-heading">
            <p className="section-kicker">Browse</p>
            <h2>All categories</h2>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <Link
                key={category.id}
                className={`category-pill ${String(category.id) === String(categoryId) ? 'active' : ''}`}
                to={`/category/${category.id}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </aside>

        <section className="panel panel-wide">
          <div className="section-heading">
            <p className="section-kicker">Headlines</p>
            <h2>{activeCategory?.description ?? 'Latest headlines in this category'}</h2>
          </div>

          {loading ? (
            <p className="helper-text">Loading headlines...</p>
          ) : error ? (
            <p className="error-banner">{error}</p>
          ) : newsItems.length === 0 ? (
            <p className="helper-text">No news items are available for this category.</p>
          ) : (
            <div className="headline-list">
              {newsItems.map((newsItem) => (
                <article key={newsItem.id} className="headline-card">
                  <div>
                    <div className="meta-row">
                      <span>{new Date(newsItem.publishedAt).toLocaleString()}</span>
                      <span>{newsItem.categories.join(' · ')}</span>
                    </div>
                    <h3>{newsItem.title}</h3>
                    <p>{newsItem.summary}</p>
                  </div>
                  <Link className="read-more" to={`/news/${newsItem.id}?categoryId=${categoryId}`}>
                    Read full story
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
