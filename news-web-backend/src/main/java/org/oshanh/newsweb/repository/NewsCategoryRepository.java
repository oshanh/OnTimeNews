package org.oshanh.newsweb.repository;

import org.oshanh.newsweb.model.NewsCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsCategoryRepository extends JpaRepository<NewsCategory, Long> {

    Optional<NewsCategory> findByNameIgnoreCase(String name);
}