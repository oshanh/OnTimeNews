package org.oshanh.newsweb.repository;

import org.oshanh.newsweb.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByNewsItemIdOrderByCreatedAtDesc(Long newsItemId);
}