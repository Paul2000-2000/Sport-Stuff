package com.example.backend.repository;

import com.example.backend.model.FeedBackProduct;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedBackProductRepository extends JpaRepository<FeedBackProduct, Long> {




    List<FeedBackProduct> findByProductFeedbackProductId(Long productId);
}
