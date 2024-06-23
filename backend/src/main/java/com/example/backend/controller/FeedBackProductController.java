package com.example.backend.controller;

import com.example.backend.model.Checkout;
import com.example.backend.model.FeedBackProduct;
import com.example.backend.model.Products;
import com.example.backend.model.User;
import com.example.backend.repository.FeedBackProductRepository;
import com.example.backend.repository.ProductsRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class FeedBackProductController {

    @Autowired
    private FeedBackProductRepository feedBackProductRepository;

    @Autowired
    private UserRepository userRepository;



    @GetMapping("productFeedBackAll/{productId}")
    public ResponseEntity<List<FeedBackProduct>> getAllFeedBackProducts(@PathVariable Long productId) {
        List<FeedBackProduct> feedBackProducts = feedBackProductRepository.findByProductFeedbackProductId(productId);

        return ResponseEntity.ok(feedBackProducts);
    }

    @GetMapping("productFeedBackEachRating")
    public ResponseEntity<List<FeedBackProduct>> getProductFeedBackEachRating() {
        List<FeedBackProduct> feedBackProducts = feedBackProductRepository.findAll();


        Map<Long, List<Float>> ratingsMap = new HashMap<>();
        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            Float productRating = feedback.getProductFeedbackRating();

            ratingsMap.computeIfAbsent(productId, k -> new ArrayList<>()).add(productRating);

        }





        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            List<Float> ratings = ratingsMap.get(productId);



            if (ratings != null && !ratings.isEmpty()) {
                if (ratings.size() == 1) {

                    feedback.setProductFeedbackRating(ratings.get(0));
                } else {

                    float sum = 0;
                    for (Float rating : ratings) {

                        sum += rating;
                    }
                    float averageRating = sum / ratings.size();
                    feedback.setProductFeedbackRating(averageRating);
                }
            }
        }

        return ResponseEntity.ok(feedBackProducts);
    }

    @GetMapping("top5FeedBackProducts")
    public ResponseEntity<List<FeedBackProduct>> top5FeedBackProducts() {
        List<FeedBackProduct> feedBackProducts = feedBackProductRepository.findAll();


        Map<Long, List<Float>> ratingsMap = new HashMap<>();
        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            Float productRating = feedback.getProductFeedbackRating();

            ratingsMap.computeIfAbsent(productId, k -> new ArrayList<>()).add(productRating);

        }





        for (Map.Entry<Long, List<Float>> entry : ratingsMap.entrySet()) {
            Long productId = entry.getKey();
            List<Float> ratings = entry.getValue();


            float sum = 0;
            for (Float rating : ratings) {
                sum += rating;
            }
            float averageRating = sum / ratings.size();


            for (FeedBackProduct feedback : feedBackProducts) {
                if (feedback.getProductFeedbackProductId().equals(productId)) {
                    feedback.setProductFeedbackRating(averageRating);
                }
            }
        }


        Set<Long> addedProductIds = new HashSet<>();
        List<FeedBackProduct> top5Products = new ArrayList<>();
        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            if (!addedProductIds.contains(productId) && top5Products.size() < 5) {
                top5Products.add(feedback);
                addedProductIds.add(productId);
            }
        }




        top5Products.sort(Comparator.comparing(FeedBackProduct::getProductFeedbackRating).reversed());


        System.out.println(top5Products);
        top5Products.forEach(product -> System.out.println("Product ID: " + product.getProductFeedbackProductId()));

        return ResponseEntity.ok(top5Products);
    }


    @GetMapping("SeeMoreFeedBackProducts")
    public ResponseEntity<List<FeedBackProduct>> SeeMoreFeedBackProducts() {
        List<FeedBackProduct> feedBackProducts = feedBackProductRepository.findAll();


        Map<Long, List<Float>> ratingsMap = new HashMap<>();
        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            Float productRating = feedback.getProductFeedbackRating();

            ratingsMap.computeIfAbsent(productId, k -> new ArrayList<>()).add(productRating);
        }


        for (FeedBackProduct feedback : feedBackProducts) {
            Long productId = feedback.getProductFeedbackProductId();
            List<Float> ratings = ratingsMap.get(productId);

            float sum = 0;
            for (Float rating : ratings) {
                sum += rating;
            }
            float averageRating = sum / ratings.size();


            feedback.setProductFeedbackRating(averageRating);
        }


        feedBackProducts.sort(Comparator.comparing(FeedBackProduct::getProductFeedbackRating).reversed());


        Set<Long> seenProductIds = new HashSet<>();
        feedBackProducts.removeIf(product -> !seenProductIds.add(product.getProductFeedbackProductId()));


        List<FeedBackProduct> top5Rate = feedBackProducts.subList(0, Math.min(5, feedBackProducts.size()));


        List<FeedBackProduct> seeMoreProducts = feedBackProducts.subList(5, Math.min(14, feedBackProducts.size()));



        top5Rate.forEach(product -> System.out.println("Product ID: " + product.getProductFeedbackProductId()));

        seeMoreProducts.forEach(product -> System.out.println("Product ID: " + product.getProductFeedbackProductId()));

        return ResponseEntity.ok(seeMoreProducts);
    }


    @PostMapping("productFeedBack")
    public ResponseEntity<String> finishCheckout(@RequestBody FeedBackProduct feedBackProduct, @RequestHeader("Authorization") String authorizationHeader) {

        try {

            String token = authorizationHeader.replace("Bearer ", "");
            System.out.println(token);


            Long userId = extractUserIdFromToken(token);


            assert userId != null;
            User user = userRepository.findById(userId).orElse(null);

            if (user != null) {
                String username = user.getUsername();
                feedBackProduct.setProductFeedBackUsername(username);

            }


            feedBackProductRepository.save(feedBackProduct);


            return ResponseEntity.ok("Feedback added successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }


    }
}
