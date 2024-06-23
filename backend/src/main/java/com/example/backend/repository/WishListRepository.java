package com.example.backend.repository;


import com.example.backend.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    List<WishList> findPurchasesByUserId(Long userId);

    WishList findPurchaseByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductName(Long userId, String productName);
}
