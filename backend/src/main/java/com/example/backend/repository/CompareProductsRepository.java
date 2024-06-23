package com.example.backend.repository;


import com.example.backend.model.CompareProducts;
import com.example.backend.model.Products;
import com.example.backend.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompareProductsRepository extends JpaRepository<CompareProducts, Long> {
    boolean existsByUserIdAndProductName(Long userId, String productName);



    Optional<CompareProducts> findByUserIdAndNumberCompareProducts(Long userId, long l);


    List<CompareProducts> findCompareByuserId(Long userId);


    CompareProducts findByUserIdAndProductId(Long userId, Long productId);

    List<CompareProducts> findByUserId(Long userId);
}
