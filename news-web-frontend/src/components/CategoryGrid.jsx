import React from 'react'
import CategoryCard from './CategoryCard'

export default function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((c) => (
        <CategoryCard key={c.id} category={c} />
      ))}
    </div>
  )
}
