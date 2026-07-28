package org.oshanh.newsweb.repository;

import org.oshanh.newsweb.model.NewsItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NewsItemRepository extends JpaRepository<NewsItem, Long> {

    @Query("select distinct newsItem from NewsItem newsItem join newsItem.categories category where category.id = :categoryId order by newsItem.publishedAt desc")
    List<NewsItem> findNewsByCategoryId(@Param("categoryId") Long categoryId);

    @Override
    @EntityGraph(attributePaths = {"categories"})
    Optional<NewsItem> findById(Long id);
}