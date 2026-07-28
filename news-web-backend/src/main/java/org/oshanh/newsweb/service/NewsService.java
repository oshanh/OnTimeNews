package org.oshanh.newsweb.service;

import org.oshanh.newsweb.dto.*;
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

    public List<NewsHeadlineDto> listAllNews() {
        return newsItemRepository.findAll().stream()
                .map(this::toHeadlineDto)
                .toList();
    }

    @Transactional
    public NewsDetailDto createNews(CreateNewsRequest request) {
        var cats = request.categoryIds() == null ? List.<Long>of() : request.categoryIds();
        var categories = categoryRepository.findAllById(cats).stream().collect(java.util.stream.Collectors.toSet());

        java.time.LocalDateTime publishedAt = java.time.LocalDateTime.now();
        if (request.publishedAt() != null && !request.publishedAt().isBlank()) {
            publishedAt = java.time.LocalDateTime.parse(request.publishedAt());
        }

        NewsItem item = new NewsItem(request.title().trim(), request.summary().trim(), request.content().trim(), request.imageUrl(), publishedAt);
        item.setCategories(categories);
        NewsItem saved = newsItemRepository.save(item);
        return toDetailDto(saved);
    }

    @Transactional
    public NewsDetailDto updateNews(Long id, CreateNewsRequest request) {
        NewsItem item = newsItemRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News item not found"));

        if (request.title() != null) item.setTitle(request.title().trim());
        if (request.summary() != null) item.setSummary(request.summary().trim());
        if (request.content() != null) item.setContent(request.content().trim());
        if (request.imageUrl() != null) item.setImageUrl(request.imageUrl());
        if (request.publishedAt() != null && !request.publishedAt().isBlank()) item.setPublishedAt(java.time.LocalDateTime.parse(request.publishedAt()));

        if (request.categoryIds() != null) {
            var categories = categoryRepository.findAllById(request.categoryIds()).stream().collect(java.util.stream.Collectors.toSet());
            item.setCategories(categories);
        }

        NewsItem saved = newsItemRepository.save(item);
        return toDetailDto(saved);
    }

    @Transactional
    public void deleteNews(Long id) {
        if (!newsItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "News item not found");
        }
        newsItemRepository.deleteById(id);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        commentRepository.deleteById(commentId);
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