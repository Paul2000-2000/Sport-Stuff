package com.example.backend.controller;

import com.example.backend.model.CheckoutPurchases;
import com.example.backend.model.Products;
import com.example.backend.repository.CheckoutPurchasesRepository;
import com.example.backend.repository.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class CheckoutPurchasesController {

    @Autowired
    private CheckoutPurchasesRepository checkoutPurchasesRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @GetMapping("/productCheckout/{productId}")
    public ResponseEntity<CheckoutPurchases> getProductById(@PathVariable Long productId, @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(token);

        System.out.println(productId);


        List<CheckoutPurchases> purchases = checkoutPurchasesRepository.findCheckoutPurchasesByUserId(userId);
        Map<Long, CheckoutPurchases> uniqueProductsMap = new HashMap<>();

        for (CheckoutPurchases purchase : purchases) {
            Long prodductId = purchase.getProductId();
            if (uniqueProductsMap.containsKey(prodductId)) {

                CheckoutPurchases existingPurchase = uniqueProductsMap.get(prodductId);
                existingPurchase.setProductQuantity(existingPurchase.getProductQuantity() + purchase.getProductQuantity());
            } else {

                uniqueProductsMap.put(prodductId, purchase);
            }
        }

        List<CheckoutPurchases> uniquePurchasesList = new ArrayList<>(uniqueProductsMap.values());


        Optional<CheckoutPurchases> checkoutOptional = uniquePurchasesList.stream()
                .filter(purchase -> purchase.getProductId().equals(productId))
                .findFirst();







        System.out.println(checkoutOptional);

        return checkoutOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("CheckoutPurchaseForOneUser")
    public ResponseEntity<List<Long>> checkoutPurchaseForOneUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Long userId = extractUserIdFromToken(token);
            List<CheckoutPurchases> purchases = checkoutPurchasesRepository.findCheckoutPurchasesByUserId(userId);

            Set<Long> uniqueOrderNumbers = new HashSet<>();

            for (CheckoutPurchases purchase : purchases) {
                uniqueOrderNumbers.add(purchase.getNumberOrder());
            }



            List<Long> uniqueOrderNumbersList = new ArrayList<>(uniqueOrderNumbers);

            System.out.println(uniqueOrderNumbersList);


            return ResponseEntity.ok(uniqueOrderNumbersList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    @GetMapping("CheckoutPurchaseForOneUserFromAdmin/{userId}")
    public ResponseEntity<List<Long>> checkoutPurchaseForOneUserFromAdmin(@PathVariable Long userId) {
        try {


            System.out.println(userId);
            List<CheckoutPurchases> purchases = checkoutPurchasesRepository.findCheckoutPurchasesByUserId(userId);

            System.out.println(purchases);

            Set<Long> uniqueOrderNumbers = new HashSet<>();

            for (CheckoutPurchases purchase : purchases) {
                uniqueOrderNumbers.add(purchase.getNumberOrder());
            }



            List<Long> uniqueOrderNumbersList = new ArrayList<>(uniqueOrderNumbers);

            System.out.println(uniqueOrderNumbersList);


            return ResponseEntity.ok(uniqueOrderNumbersList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }




    @GetMapping("/getClientProducts/Order/{orderId}")
    public ResponseEntity<List<CheckoutPurchases>> getClientProducts(@PathVariable Long orderId, @RequestHeader("Authorization") String authorizationHeader) {

        try {
        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);

        List<CheckoutPurchases> purchases = checkoutPurchasesRepository.findCheckoutPurchasesByUserId(userId);

        List<CheckoutPurchases> productsFromOrder = purchases.stream()
                .filter(purchase -> purchase.getNumberOrder().equals(orderId))
                .collect(Collectors.toList());




        return ResponseEntity.ok(productsFromOrder);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }



    }




    @GetMapping("/getClientProducts/Order/{orderId}/{userId}")
    public ResponseEntity<List<CheckoutPurchases>> getClientProducts(@PathVariable Long orderId, @PathVariable Long userId) {

        try {


            List<CheckoutPurchases> purchases = checkoutPurchasesRepository.findCheckoutPurchasesByUserId(userId);

            List<CheckoutPurchases> productsFromOrder = purchases.stream()
                    .filter(purchase -> purchase.getNumberOrder().equals(orderId))
                    .collect(Collectors.toList());




            return ResponseEntity.ok(productsFromOrder);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }



    }



    @GetMapping("CheckoutPurchaseTop5SoldProducts")
    public ResponseEntity<List<Products>> checkoutPurchaseTop5SoldProducts() {


        List<CheckoutPurchases> checkoutPurchases = checkoutPurchasesRepository.findAll();



        Map<Long, Long> productIdQuantities = new HashMap<>();
        for (CheckoutPurchases purchase : checkoutPurchases) {
            long productId = purchase.getProductId();
            long quantity = purchase.getProductQuantity();
            productIdQuantities.put(productId, productIdQuantities.getOrDefault(productId, 0L) + quantity);
        }



        List<Products> productsList = new ArrayList<>();
        for (Map.Entry<Long, Long> entry : productIdQuantities.entrySet()) {
            long productId = entry.getKey();
            long quantity = entry.getValue();

            Products product = productsRepository.findById(productId).orElse(null);

            if (product != null) {

                Products productDetails = new Products();
                productDetails.setProductId(productId);
                productDetails.setProductQuantity(quantity);
                productDetails.setProductPrice(product.getProductPrice());
                productDetails.setProductImage(product.getProductImage());
                productDetails.setProductDescription(product.getProductDescription());
                productDetails.setProductName(product.getProductName());
                productDetails.setProductCategory(product.getProductCategory());
                productDetails.setProductCategoryAdidasSize(product.getProductCategoryAdidasSize());
                productDetails.setProductCategoryPantsSize(product.getProductCategoryPantsSize());
                productDetails.setProductCategoryTShirtSize(product.getProductCategoryTShirtSize());

                productsList.add(productDetails);
            }
        }


        List<Products> top5Products = productsList.stream()
                .sorted(Comparator.comparingLong(Products::getProductQuantity).reversed())
                .limit(5)
                .collect(Collectors.toList());



        for (Products product : top5Products) {
            Long productId = product.getProductId();
            Products productFromRepo = productsRepository.findById(productId).orElse(null);
            if (productFromRepo != null) {
                product.setProductQuantity(productFromRepo.getProductQuantity());
            }
        }


        return ResponseEntity.ok(top5Products);

    }



    @GetMapping("SeeMoreSoldProducts")
    public ResponseEntity<List<Products>> SeeMoreSoldProducts() {


        List<CheckoutPurchases> checkoutPurchases = checkoutPurchasesRepository.findAll();


        Map<Long, Long> productIdQuantities = new HashMap<>();
        for (CheckoutPurchases purchase : checkoutPurchases) {
            long productId = purchase.getProductId();
            long quantity = purchase.getProductQuantity();
            productIdQuantities.put(productId, productIdQuantities.getOrDefault(productId, 0L) + quantity);
        }


        List<Products> productsList = new ArrayList<>();
        for (Map.Entry<Long, Long> entry : productIdQuantities.entrySet()) {
            long productId = entry.getKey();
            long quantity = entry.getValue();

            Products product = productsRepository.findById(productId).orElse(null);

            if (product != null) {

                Products productDetails = new Products();
                productDetails.setProductId(productId);
                productDetails.setProductQuantity(quantity);
                productDetails.setProductPrice(product.getProductPrice());
                productDetails.setProductImage(product.getProductImage());
                productDetails.setProductDescription(product.getProductDescription());
                productDetails.setProductName(product.getProductName());
                productDetails.setProductCategory(product.getProductCategory());
                productDetails.setProductCategoryAdidasSize(product.getProductCategoryAdidasSize());
                productDetails.setProductCategoryPantsSize(product.getProductCategoryPantsSize());
                productDetails.setProductCategoryTShirtSize(product.getProductCategoryTShirtSize());

                productsList.add(productDetails);
            }
        }


        List<Products> sortedProducts = productsList.stream()
                .sorted(Comparator.comparingLong(Products::getProductQuantity).reversed())
                .collect(Collectors.toList());


        List<Products> top5Products = sortedProducts.stream()
                .limit(5)
                .collect(Collectors.toList());


        List<Products> seeMoreProducts = sortedProducts.stream()
                .skip(5)
                .filter(product -> !top5Products.contains(product))
                .limit(10)
                .collect(Collectors.toList());


        for (Products product : top5Products) {
            Long productId = product.getProductId();
            Products productFromRepo = productsRepository.findById(productId).orElse(null);
            if (productFromRepo != null) {
                product.setProductQuantity(productFromRepo.getProductQuantity());
            }
        }

        return ResponseEntity.ok(seeMoreProducts);
    }

}
