package com.example.backend.controller;

import com.example.backend.model.Products;
import com.example.backend.model.Purchase;
import com.example.backend.model.WishList;
import com.example.backend.repository.ProductsRepository;
import com.example.backend.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class WishListController {

    @Autowired
    private ProductsRepository productRepository;

    @Autowired
    private WishListRepository wishListRepository;


    @PostMapping("productAddToWishList")
    public ResponseEntity<String> productAddToWishList(@RequestBody Products newProduct, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Long userId = extractUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User ID not found in the authentication token");
            }
            String productName = newProduct.getProductName();
            boolean isProductInWishlist = wishListRepository.existsByUserIdAndProductName(userId, productName);
            if (isProductInWishlist) {
                return ResponseEntity.badRequest().body("Product is already in the wishlist");
            }
            Optional<Products> existingProductOptional = productRepository.findByProductName(productName);
            if (existingProductOptional.isPresent()) {
                WishList wishList = new WishList(userId ,newProduct);
                wishListRepository.save(wishList);
                return ResponseEntity.ok("Product sent to Wish List successfully");
                }
            else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }

    }

    @GetMapping("WishListForOneUser")
    public ResponseEntity<List<WishList>> WishListForOneUser(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);


        List<WishList> wishLists = wishListRepository.findPurchasesByUserId(userId);


        return ResponseEntity.ok(wishLists);
    }

    @GetMapping("WishListForOneUserNumber")
    public ResponseEntity<Integer> WishListForOneUserNumber(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);


        List<WishList> wishLists = wishListRepository.findPurchasesByUserId(userId);

        int sizeWishlists = wishLists.size();


        return ResponseEntity.ok(sizeWishlists);
    }

    @DeleteMapping("productRemoveWishList")
    public void removeProductFromWishList(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Long productId) {

        String token = authorizationHeader.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(token);

        WishList WishItemToBeRemoved = wishListRepository.findPurchaseByUserIdAndProductId(userId, productId);


        wishListRepository.delete(WishItemToBeRemoved);


    }

}
