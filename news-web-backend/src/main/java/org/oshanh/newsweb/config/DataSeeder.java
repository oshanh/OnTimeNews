package org.oshanh.newsweb.config;

import org.oshanh.newsweb.model.Comment;
import org.oshanh.newsweb.model.NewsCategory;
import org.oshanh.newsweb.model.NewsItem;
import org.oshanh.newsweb.repository.CommentRepository;
import org.oshanh.newsweb.repository.NewsCategoryRepository;
import org.oshanh.newsweb.repository.NewsItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedNewsData(
            NewsCategoryRepository categoryRepository,
            NewsItemRepository newsItemRepository,
            CommentRepository commentRepository
    ) {
        return args -> {
            if (categoryRepository.count() > 0) {
                return;
            }

            NewsCategory sports = categoryRepository.save(new NewsCategory("Sports", "Latest updates from cricket, football, and other sports."));
            NewsCategory entertainment = categoryRepository.save(new NewsCategory("Entertainment", "Movies, celebrity stories, and cultural updates."));
            NewsCategory politics = categoryRepository.save(new NewsCategory("Politics", "Government, policy, and election news."));
            NewsCategory business = categoryRepository.save(new NewsCategory("Business", "Market updates, companies, and the economy."));

            NewsItem worldCupStory = new NewsItem(
                    "Sri Lanka lost the cricket world cup",
                    "A hard-fought campaign ended in disappointment after Sri Lanka fell short in the final.",
                    "Sri Lanka's journey through the tournament captured the attention of fans across the island. The squad showed flashes of brilliance, but the final match exposed the pressure of chasing a world title. Analysts say the team still has the talent to rebuild around a younger core and come back stronger in the next cycle.",
                    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
                    LocalDateTime.now().minusDays(1)
            );
            worldCupStory.setCategories(Set.of(sports, entertainment));

            NewsItem electionUpdate = new NewsItem(
                    "Cabinet announces new economic relief plan",
                    "The government has approved a targeted relief package aimed at households and small businesses.",
                    "Officials said the program will focus on fuel costs, food prices, and support for small enterprises. The plan is expected to be rolled out in phases after parliamentary review and could shape the next few months of public debate.",
                    "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=1200&q=80",
                    LocalDateTime.now().minusDays(2)
            );
            electionUpdate.setCategories(Set.of(politics, business));

            NewsItem filmRelease = new NewsItem(
                    "Blockbuster film breaks opening weekend records",
                    "A highly anticipated release drew crowds and strong reviews at cinemas nationwide.",
                    "The movie opened across major cities and quickly became the weekend's biggest conversation online. Critics praised the performances while audiences highlighted the soundtrack and visuals. Producers are already planning a wider international rollout.",
                    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
                    LocalDateTime.now().minusHours(10)
            );
            filmRelease.setCategories(Set.of(entertainment));

            newsItemRepository.saveAll(List.of(worldCupStory, electionUpdate, filmRelease));

            commentRepository.saveAll(List.of(
                    new Comment(worldCupStory, "Nimal", "Painful result, but the team showed heart.", LocalDateTime.now().minusHours(5)),
                    new Comment(worldCupStory, "Maya", "This match had everyone talking at home.", LocalDateTime.now().minusHours(3)),
                    new Comment(filmRelease, "Ruwan", "Best movie I have seen this year.", LocalDateTime.now().minusHours(2))
            ));
        };
    }
}