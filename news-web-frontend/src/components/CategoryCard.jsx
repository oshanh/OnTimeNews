import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link key={category.id} to={`/category/${category.id}`} className="category-card">
      <span className="category-label">{category.name}</span>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span className="category-action">View headlines</span>
    </Link>
  )
}
