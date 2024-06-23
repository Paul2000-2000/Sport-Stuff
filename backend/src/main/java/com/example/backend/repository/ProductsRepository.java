package com.example.backend.repository;

import com.example.backend.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductsRepository extends JpaRepository<Products, Long> {
    Optional<Products> findByProductName(String productName);

    void deleteByProductName(String productName);

    Optional<Products> findByProductId(long productId);


    // You can add custom query methods if needed
}