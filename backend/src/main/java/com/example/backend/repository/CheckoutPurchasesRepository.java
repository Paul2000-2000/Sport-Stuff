package com.example.backend.repository;

import com.example.backend.model.CheckoutPurchases;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckoutPurchasesRepository extends JpaRepository<CheckoutPurchases, Long> {

    List<CheckoutPurchases> findCheckoutPurchasesByUserId(Long userId);

    Optional<CheckoutPurchases> findCheckoutPurchasesByproductIdAndUserId(Long productId, Long userId);


}
