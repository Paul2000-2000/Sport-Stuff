package com.example.backend.controller;


import com.example.backend.model.Products;
import com.example.backend.model.Purchase;
import com.example.backend.repository.ProductsRepository;
import com.example.backend.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class PurchaseController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private ProductsRepository productRepository;

    @GetMapping("PurchasesView")
    public ResponseEntity<List<Purchase>> ViewPurchases() {
        List<Purchase> purchases = purchaseRepository.findAll();

        return ResponseEntity.ok(purchases);
    }

    @DeleteMapping("purchasesDelete/{userId}")
    public ResponseEntity<String> deletePurchasesByUserId(@PathVariable Long userId) {
        List<Purchase> purchases = purchaseRepository.findPurchasesByUserId(userId);
        purchaseRepository.deleteAll(purchases);
        return new ResponseEntity<>("Purchases deleted successfully", HttpStatus.OK);
    }


    @GetMapping("PurchaseForOneUser")
    public ResponseEntity<List<Purchase>> PurchasesForOne(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);


        List<Purchase> purchases = purchaseRepository.findPurchasesByUserId(userId);


        return ResponseEntity.ok(purchases);
    }


    @GetMapping("PurchaseForOneUserNumber")
    public ResponseEntity<Integer> PurchasesForOneNumber(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);

        List<Purchase> purchases = purchaseRepository.findPurchasesByUserId(userId);

        int purchaseCount = purchases.size();
        return ResponseEntity.ok(purchaseCount);
    }

    @DeleteMapping("productRemovePurchase")
    public void removeProductFromPurchase(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Long productId) {

        String token = authorizationHeader.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(token);
        Purchase PurchaseToBeRemoved = purchaseRepository.findPurchaseByUserIdAndProductId(userId, productId);
        Optional<Products> optionalProduct = productRepository.findByProductId(productId);
        if (optionalProduct.isPresent()) {
            Products existingProduct = optionalProduct.get();

            existingProduct.setProductQuantity(existingProduct.getProductQuantity() + PurchaseToBeRemoved.getProductQuantity());
            productRepository.save(existingProduct);
        } else {
            Products newProduct = new Products();
            newProduct.setProductName(PurchaseToBeRemoved.getProductName());
            newProduct.setProductCategory(PurchaseToBeRemoved.getProductCategory());
            newProduct.setProductDescription(PurchaseToBeRemoved.getProductDescription());
            newProduct.setProductPrice(PurchaseToBeRemoved.getProductPrice());
            newProduct.setProductQuantity(PurchaseToBeRemoved.getProductQuantity());
            newProduct.setProductImage(PurchaseToBeRemoved.getProductImage());
            if (Objects.equals(PurchaseToBeRemoved.getProductCategory(), "tricou")) {

                newProduct.setProductCategoryTShirtSize(PurchaseToBeRemoved.getProductCategoryTShirtSize());
                newProduct.setProductCategoryAdidasSize(null);
                newProduct.setProductCategoryPantsSize(null);
                newProduct.setProductCategoryBikeSize(null);
            }
            else  if (Objects.equals(PurchaseToBeRemoved.getProductCategory(), "adidas")) {

                newProduct.setProductCategoryTShirtSize(null);
                newProduct.setProductCategoryAdidasSize(PurchaseToBeRemoved.getProductCategoryAdidasSize());
                newProduct.setProductCategoryPantsSize(null);
                newProduct.setProductCategoryBikeSize(null);
            }
            else  if (Objects.equals(PurchaseToBeRemoved.getProductCategory(), "pantaloni")) {

                newProduct.setProductCategoryTShirtSize(null);
                newProduct.setProductCategoryAdidasSize(null);
                newProduct.setProductCategoryPantsSize(PurchaseToBeRemoved.getProductCategoryPantsSize());
                newProduct.setProductCategoryBikeSize(null);
            }
            else  if (Objects.equals(PurchaseToBeRemoved.getProductCategory(), "bicicleta")) {

                newProduct.setProductCategoryTShirtSize(null);
                newProduct.setProductCategoryAdidasSize(null);
                newProduct.setProductCategoryPantsSize(null);
                newProduct.setProductCategoryBikeSize(PurchaseToBeRemoved.getProductCategoryBikeSize());
            }
            else {
                newProduct.setProductCategoryPantsSize(null);
                newProduct.setProductCategoryTShirtSize(null);
                newProduct.setProductCategoryAdidasSize(null);
                newProduct.setProductCategoryBikeSize(null);
            }

            productRepository.save(newProduct);
        }

        purchaseRepository.delete(PurchaseToBeRemoved);


    }


}
