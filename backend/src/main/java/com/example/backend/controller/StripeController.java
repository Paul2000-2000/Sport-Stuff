package com.example.backend.controller;

import com.example.backend.model.PaymentIntentRequest;
import com.example.backend.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class StripeController {

    private final StripeService stripeService;

    @Autowired
    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }


    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> requestData) {
        try {
            Object paymentMethodTypeObj = requestData.get("paymentMethodType");
            String paymentMethodType = paymentMethodTypeObj instanceof String ? (String) paymentMethodTypeObj : null;
            Object currencyObj = requestData.get("currency");
            String currency = currencyObj instanceof String ? (String) currencyObj : null;
            Double totalPrice = null;
            Object totalPriceObj = requestData.get("totalPrice");
            if (totalPriceObj instanceof Integer) {
                totalPrice = ((Integer) totalPriceObj).doubleValue();
            } else if (totalPriceObj instanceof Double) {
                totalPrice = (Double) totalPriceObj;
            }
            Long userId = null;
            Object userIdObj = requestData.get("userId");
            if (userIdObj instanceof Integer) {
                userId = ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                userId = (Long) userIdObj;
            }
            String clientSecret = stripeService.createPaymentIntent(paymentMethodType, currency, totalPrice, userId);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating payment intent");
        }
    }


}
