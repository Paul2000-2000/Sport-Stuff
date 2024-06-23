package com.example.backend.controller;

import com.example.backend.model.Checkout;
import com.example.backend.model.CheckoutPurchases;
import com.example.backend.model.Purchase;
import com.example.backend.model.User;
import com.example.backend.repository.CheckoutPurchasesRepository;
import com.example.backend.repository.CheckoutRepository;
import com.example.backend.repository.PurchaseRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;


@RestController
public class CheckoutController {

    @Autowired
    private CheckoutRepository checkoutRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CheckoutPurchasesRepository checkoutPurchasesRepository;

    @Transactional
    @PostMapping("finishCheckout")
    public ResponseEntity<Checkout> finishCheckout(@RequestBody Checkout checkout) {


        List<Purchase> purchases = purchaseRepository.findPurchasesByUserId(checkout.getUserId());


        double totalPrice = 0;
        for (Purchase purchase : purchases) {
            double productPrice = purchase.getProductPrice();
            long productQuantity = purchase.getProductQuantity();
            totalPrice += productPrice * productQuantity;
        }


        Checkout newCheckout = checkoutRepository.save(checkout);

        return ResponseEntity.status(HttpStatus.CREATED).body(newCheckout);

    }


    @PostMapping("finishCheckoutPurchases")
    public ResponseEntity<List<CheckoutPurchases>> finishCheckoutPurchases(@RequestBody Checkout checkout) {

        List<Purchase> purchases = purchaseRepository.findPurchasesByUserId(checkout.getUserId());


        Optional<User> userCheckout = userRepository.findById(checkout.getUserId());

        if (userCheckout.isPresent()) {
            User newUser = userCheckout.get();
            Long orderNumber = newUser.getOrderNumber();
            if (orderNumber == null) {
                newUser.setOrderNumber(1L);
            } else {
                newUser.setOrderNumber(orderNumber + 1);
            }
            userRepository.save(newUser);
        }

        for (Purchase purchase : purchases) {

            Long orderNumber = userCheckout.get().getOrderNumber(); // Assuming userCheckout is your Optional<User>

            CheckoutPurchases newPurchaseCheckout = new CheckoutPurchases(
                    purchase.getUserId(),
                    purchase.getProductId(),
                    purchase.getProductQuantity(),
                    purchase.getProductPrice(),
                    purchase.getProductDescription(),
                    purchase.getProductImage(),
                    purchase.getProductName(),
                    purchase.getProductCategory(),
                    purchase.getProductCategoryAdidasSize(),
                    purchase.getProductCategoryPantsSize(),
                    purchase.getProductCategoryTShirtSize(),
                    purchase.getProductCategoryBikeSize(),
                    orderNumber
            );



            checkoutPurchasesRepository.save(newPurchaseCheckout);


        }

        List<CheckoutPurchases> checkoutPurchases = checkoutPurchasesRepository.findAll();

        return ResponseEntity.status(HttpStatus.CREATED).body(checkoutPurchases);

    }


}
