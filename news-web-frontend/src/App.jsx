import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  createNewsComment,
  getCategories,
  getNewsByCategory,
  getNewsComments,
  getNewsDetail,
} from './api/newsApi'
import './App.css'

function formatDate(value) {
  if (!value) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  useEffect(() => {
    document.title = 'OnTimeNews'
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/news/:newsId" element={<NewsDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const data = await getCategories()
        if (isMounted) {
          setCategories(data)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="app-shell app-shell-home">
      <header className="topbar home-topbar">
        <div>
          <h1>OnTimeNews</h1>
        </div>
      </header>

      <main className="content-grid">
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
            <div className="category-grid">
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.id}`} className="category-card">
                  <span className="category-label">{category.name}</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-action">View headlines</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function CategoryPage() {
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
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
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
      <header className="topbar">
        <button type="button" className="back-link" onClick={() => navigate('/')}>← All categories</button>
        <div>
          <p className="eyebrow">OnTimeNews</p>
          <h1>{activeCategory?.name ?? 'News headlines'}</h1>
        </div>
      </header>

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
                      <span>{formatDate(newsItem.publishedAt)}</span>
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

function NewsDetailPage() {
  const { newsId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categoryId = searchParams.get('categoryId')

  const [newsItem, setNewsItem] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentMessage, setCommentMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadNewsDetail() {
      try {
        const [newsData, commentData] = await Promise.all([
          getNewsDetail(newsId),
          getNewsComments(newsId),
        ])

        if (isMounted) {
          setNewsItem(newsData)
          setComments(commentData)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadNewsDetail()

    return () => {
      isMounted = false
    }
  }, [newsId])

  async function handleCommentSubmit(event) {
    event.preventDefault()
    setCommentError('')
    setSubmitting(true)

    try {
      const savedComment = await createNewsComment(newsId, {
        authorName: commentAuthor,
        message: commentMessage,
      })

      setComments((currentComments) => [savedComment, ...currentComments])
      setCommentAuthor('')
      setCommentMessage('')
    } catch (requestError) {
      setCommentError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const backTarget = categoryId ? `/category/${categoryId}` : '/'

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="back-link" onClick={() => navigate(backTarget)}>← Back</button>
        <div>
          <p className="eyebrow">OnTimeNews</p>
          <h1>{newsItem?.title ?? 'Loading story...'}</h1>
        </div>
      </header>

      <main className="content-grid detail-layout">
        <article className="panel panel-wide article-panel">
          {loading ? (
            <p className="helper-text">Loading article...</p>
          ) : error ? (
            <p className="error-banner">{error}</p>
          ) : (
            <>
              <div className="article-hero">
                <div className="meta-row">
                  <span>{formatDate(newsItem.publishedAt)}</span>
                  <span>{newsItem.categories.join(' · ')}</span>
                </div>
                <h2>{newsItem.title}</h2>
                <p className="article-summary">{newsItem.summary}</p>
              </div>
              {newsItem.imageUrl ? <img className="article-image" src={newsItem.imageUrl} alt={newsItem.title} /> : null}
              <div className="article-body">
                {newsItem.content.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </article>

        <section className="panel sidebar-panel comments-panel">
          <div className="section-heading">
            <p className="section-kicker">Comments</p>
            <h2>Join the discussion</h2>
          </div>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <label>
              Name
              <input
                type="text"
                value={commentAuthor}
                onChange={(event) => setCommentAuthor(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Comment
              <textarea
                value={commentMessage}
                onChange={(event) => setCommentMessage(event.target.value)}
                placeholder="Write your comment"
                rows="5"
                required
              />
            </label>

            {commentError ? <p className="error-banner">{commentError}</p> : null}

            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </form>

          <div className="comment-feed">
            {comments.length === 0 ? (
              <p className="helper-text">No comments yet. Be the first to respond.</p>
            ) : (
              comments.map((comment) => (
                <article key={comment.id} className="comment-card">
                  <div className="comment-meta">
                    <strong>{comment.authorName}</strong>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p>{comment.message}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
