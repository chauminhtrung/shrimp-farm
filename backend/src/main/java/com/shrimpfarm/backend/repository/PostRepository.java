package com.shrimpfarm.backend.repository;

import com.shrimpfarm.backend.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Lấy tất cả bài viết mới nhất
    List<Post> findAllByOrderByCreatedAtDesc();

    // Lọc theo tag
    List<Post> findByTagOrderByCreatedAtDesc(Post.PostTag tag);

    // Tìm kiếm theo tiêu đề
    List<Post> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}