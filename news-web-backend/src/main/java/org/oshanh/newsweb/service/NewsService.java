package org.oshanh.newsweb.service;

import org.oshanh.newsweb.dto.CommentDto;
import org.oshanh.newsweb.dto.CreateCommentRequest;
import org.oshanh.newsweb.dto.NewsCategoryDto;
import org.oshanh.newsweb.dto.NewsDetailDto;
import org.oshanh.newsweb.dto.NewsHeadlineDto;
import org.oshanh.newsweb.model.Comment;
import org.oshanh.newsweb.model.NewsCategory;
import org.oshanh.newsweb.model.NewsItem;
import org.oshanh.newsweb.repository.CommentRepository;
import org.oshanh.newsweb.repository.NewsCategoryRepository;
import org.oshanh.newsweb.repository.NewsItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class NewsService {

    private final NewsCategoryRepository categoryRepository;
    private final NewsItemRepository newsItemRepository;
    private final CommentRepository commentRepository;

    public NewsService(
            NewsCategoryRepository categoryRepository,
            NewsItemRepository newsItemRepository,
            CommentRepository commentRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.newsItemRepository = newsItemRepository;
        this.commentRepository = commentRepository;
    }

    public List<NewsCategoryDto> listCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new NewsCategoryDto(category.getId(), category.getName(), category.getDescription()))
                .toList();
    }

    public List<NewsHeadlineDto> listNewsByCategory(Long categoryId) {
        NewsCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        return newsItemRepository.findNewsByCategoryId(category.getId()).stream()
                .map(this::toHeadlineDto)
                .toList();
    }

    public NewsDetailDto getNewsDetail(Long newsId) {
        NewsItem newsItem = newsItemRepository.findById(newsId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News item not found"));
        return toDetailDto(newsItem);
    }

    public List<CommentDto> listComments(Long newsId) {
        verifyNewsExists(newsId);
        return commentRepository.findByNewsItemIdOrderByCreatedAtDesc(newsId).stream()
                .map(this::toCommentDto)
                .toList();
    }

    @Transactional
    public CommentDto addComment(Long newsId, CreateCommentRequest request) {
        NewsItem newsItem = newsItemRepository.findById(newsId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News item not found"));

        Comment comment = new Comment(newsItem, request.authorName().trim(), request.message().trim(), LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);
        newsItem.addComment(savedComment);
        return toCommentDto(savedComment);
    }

    private void verifyNewsExists(Long newsId) {
        if (!newsItemRepository.existsById(newsId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "News item not found");
        }
    }

    private NewsHeadlineDto toHeadlineDto(NewsItem newsItem) {
        return new NewsHeadlineDto(
                newsItem.getId(),
                newsItem.getTitle(),
                newsItem.getSummary(),
                newsItem.getPublishedAt(),
                newsItem.getCategories().stream().map(NewsCategory::getName).toList()
        );
    }

    private NewsDetailDto toDetailDto(NewsItem newsItem) {
        return new NewsDetailDto(
                newsItem.getId(),
                newsItem.getTitle(),
                newsItem.getSummary(),
                newsItem.getContent(),
                newsItem.getImageUrl(),
                newsItem.getPublishedAt(),
                newsItem.getCategories().stream().map(NewsCategory::getName).toList()
        );
    }

    private CommentDto toCommentDto(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getAuthorName(),
                comment.getMessage(),
                comment.getCreatedAt()
        );
    }
}