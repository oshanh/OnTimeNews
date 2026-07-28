import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import { createNewsComment, getNewsByCategory, getNewsComments, getNewsDetail } from '../api/newsApi'

function formatDate(value) {
  if (!value) return 'Unknown date'
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function NewsDetailPage() {
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
        const [newsData, commentData] = await Promise.all([getNewsDetail(newsId), getNewsComments(newsId)])
        if (isMounted) {
          setNewsItem(newsData)
          setComments(commentData)
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
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
      const savedComment = await createNewsComment(newsId, { authorName: commentAuthor, message: commentMessage })
      setComments((currentComments) => [savedComment, ...currentComments])
      setCommentAuthor('')
      setCommentMessage('')
    } catch (err) {
      setCommentError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const backTarget = categoryId ? `/category/${categoryId}` : '/'

  return (
    <div className="app-shell">
      <Header backTarget={backTarget} title={newsItem?.title ?? 'Loading story...'} />

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
              <input type="text" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="Your name" required />
            </label>
            <label>
              Comment
              <textarea value={commentMessage} onChange={(e) => setCommentMessage(e.target.value)} placeholder="Write your comment" rows="5" required />
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
