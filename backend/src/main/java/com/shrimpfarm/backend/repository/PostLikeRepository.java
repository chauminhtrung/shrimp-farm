package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
    int countByPostId(Long postId);
}