package com.example.backend.repository;

import com.example.backend.model.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
}
