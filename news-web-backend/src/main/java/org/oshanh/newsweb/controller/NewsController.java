package org.oshanh.newsweb.controller;

import jakarta.validation.Valid;
import org.oshanh.newsweb.dto.CommentDto;
import org.oshanh.newsweb.dto.CreateCommentRequest;
import org.oshanh.newsweb.dto.NewsCategoryDto;
import org.oshanh.newsweb.dto.NewsDetailDto;
import org.oshanh.newsweb.dto.NewsHeadlineDto;
import org.oshanh.newsweb.service.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/categories")
    public List<NewsCategoryDto> categories() {
        return newsService.listCategories();
    }

    @GetMapping("/categories/{categoryId}/news")
    public List<NewsHeadlineDto> newsByCategory(@PathVariable Long categoryId) {
        return newsService.listNewsByCategory(categoryId);
    }

    @GetMapping("/news/{newsId}")
    public NewsDetailDto newsDetail(@PathVariable Long newsId) {
        return newsService.getNewsDetail(newsId);
    }

    @GetMapping("/news/{newsId}/comments")
    public List<CommentDto> comments(@PathVariable Long newsId) {
        return newsService.listComments(newsId);
    }

    @PostMapping("/news/{newsId}/comments")
    public ResponseEntity<CommentDto> addComment(@PathVariable Long newsId, @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.addComment(newsId, request));
    }
}