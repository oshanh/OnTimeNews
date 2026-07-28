package org.oshanh.newsweb.controller;

import org.oshanh.newsweb.dto.CreateNewsRequest;
import org.oshanh.newsweb.dto.NewsDetailDto;
import org.oshanh.newsweb.dto.NewsHeadlineDto;
import org.oshanh.newsweb.service.NewsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Base64;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final NewsService newsService;

    @Value("${ADMIN_USER:admin}")
    private String adminUser;

    @Value("${ADMIN_PASS:admin}")
    private String adminPass;

    public AdminController(NewsService newsService) {
        this.newsService = newsService;
    }

    private boolean checkAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) return false;
        try {
            String base64 = authHeader.substring(6).trim();
            byte[] decoded = Base64.getDecoder().decode(base64);
            String combo = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = combo.split(":", 2);
            if (parts.length != 2) return false;
            return parts[0].equals(adminUser) && parts[1].equals(adminPass);
        } catch (Exception ex) {
            return false;
        }
    }

    private <T> ResponseEntity<T> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).header("WWW-Authenticate", "Basic realm=\"admin\"").build();
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsHeadlineDto>> listAllNews(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (!checkAuth(auth)) return unauthorized();
        return ResponseEntity.ok(newsService.listAllNews());
    }

    @PostMapping("/news")
    public ResponseEntity<NewsDetailDto> createNews(@RequestHeader(value = "Authorization", required = false) String auth,
                                                    @RequestBody CreateNewsRequest request) {
        if (!checkAuth(auth)) return unauthorized();
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(request));
    }

    @PutMapping("/news/{id}")
    public ResponseEntity<NewsDetailDto> updateNews(@RequestHeader(value = "Authorization", required = false) String auth,
                                                    @PathVariable Long id,
                                                    @RequestBody CreateNewsRequest request) {
        if (!checkAuth(auth)) return unauthorized();
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> deleteNews(@RequestHeader(value = "Authorization", required = false) String auth,
                                           @PathVariable Long id) {
        if (!checkAuth(auth)) return unauthorized();
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@RequestHeader(value = "Authorization", required = false) String auth,
                                              @PathVariable Long id) {
        if (!checkAuth(auth)) return unauthorized();
        newsService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
