package com.example.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
public class StripeService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createPaymentIntent(String paymentMethodType, String currency, Double totalPrice, Long userId) throws StripeException {




        Map<String, Object> params = new HashMap<>();


        List<String> paymentMethodTypes = Collections.singletonList(paymentMethodType);


        params.put("payment_method_types", paymentMethodTypes);
        params.put("amount", (int) (totalPrice * 100));
        params.put("currency", currency);
        params.put("metadata", Map.of("userId", userId));



        PaymentIntent paymentIntent = PaymentIntent.create(params);



        return paymentIntent.getClientSecret();
    }
}
