package com.example.backend.repository;

import com.example.backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {


    List<Purchase> findPurchasesByUserId(Long userId);


    boolean existsByUserIdAndProductName(Long userId, String productName);

    Purchase findByUserIdAndProductName(Long userId, String productName);

    Purchase findPurchaseByUserIdAndProductId(Long userId, Long productId);


}
