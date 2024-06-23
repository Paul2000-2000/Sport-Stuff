package com.example.backend.controller;

import com.example.backend.model.Products;
import com.example.backend.model.Purchase;
import com.example.backend.repository.ProductsRepository;
import com.example.backend.repository.PurchaseRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class ProductController {

    @Autowired
    private ProductsRepository productRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("productAdd")
    public ResponseEntity<Products> addProduct(@RequestBody Products newProduct) {

        String productName = newProduct.getProductName();
        Optional<Products> existingProductOptional = productRepository.findByProductName(productName);
        if (existingProductOptional.isPresent()) {
            Products existingProduct = existingProductOptional.get();
            existingProduct.setProductQuantity(existingProduct.getProductQuantity() + newProduct.getProductQuantity());
            productRepository.save(existingProduct);
            return ResponseEntity.ok(existingProduct);
        } else {

            Products savedProduct = productRepository.save(newProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        }
    }




    @GetMapping("productAll")
    public ResponseEntity<List<Products>> getAllProducts() {

        List<Products> products = productRepository.findAll();

        return ResponseEntity.ok(products);
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<Products> getProductById(@PathVariable Long productId) {
        Optional<Products> productOptional = productRepository.findById(productId);
        return productOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("productDelete")
    public void deleteProduct(@RequestParam Long ProductId) {

        productRepository.deleteById(ProductId);

    }


    @PostMapping("productEdit")
    public ResponseEntity<Products> editProduct(@RequestBody Products newProduct) {

        String productName = newProduct.getProductName();

        Optional<Products> existingProductOptional = productRepository.findByProductName(productName);

        if (existingProductOptional.isPresent()) {
            Products existingProduct = existingProductOptional.get();


            if (Objects.equals(newProduct.getProductCategory(), "tricou")) {
                existingProduct.setProductQuantity(newProduct.getProductQuantity());
                existingProduct.setProductDescription(newProduct.getProductDescription());
                existingProduct.setProductPrice(newProduct.getProductPrice());
                existingProduct.setProductName(newProduct.getProductName());
                existingProduct.setProductCategory(newProduct.getProductCategory());
                existingProduct.setProductCategoryTShirtSize(newProduct.getProductCategoryTShirtSize());
                existingProduct.setProductCategoryAdidasSize(null);
                existingProduct.setProductCategoryPantsSize(null);
                existingProduct.setProductCategoryBikeSize(null);
                productRepository.save(existingProduct);

                return ResponseEntity.ok(existingProduct);
            }
            else
            if (Objects.equals(newProduct.getProductCategory(), "adidas")) {
                existingProduct.setProductQuantity(newProduct.getProductQuantity());
                existingProduct.setProductDescription(newProduct.getProductDescription());
                existingProduct.setProductPrice(newProduct.getProductPrice());
                existingProduct.setProductName(newProduct.getProductName());
                existingProduct.setProductCategory(newProduct.getProductCategory());
                existingProduct.setProductCategoryAdidasSize(newProduct.getProductCategoryAdidasSize());
                existingProduct.setProductCategoryTShirtSize(null);
                existingProduct.setProductCategoryPantsSize(null);
                existingProduct.setProductCategoryBikeSize(null);
                productRepository.save(existingProduct);

                return ResponseEntity.ok(existingProduct);
            }
            else
            if (Objects.equals(newProduct.getProductCategory(), "pantaloni")) {
                existingProduct.setProductQuantity(newProduct.getProductQuantity());
                existingProduct.setProductDescription(newProduct.getProductDescription());
                existingProduct.setProductPrice(newProduct.getProductPrice());
                existingProduct.setProductName(newProduct.getProductName());
                existingProduct.setProductCategory(newProduct.getProductCategory());

                existingProduct.setProductCategoryTShirtSize(null);
                existingProduct.setProductCategoryAdidasSize(null);
                existingProduct.setProductCategoryBikeSize(null);
                existingProduct.setProductCategoryPantsSize(newProduct.getProductCategoryPantsSize());
                productRepository.save(existingProduct);

                return ResponseEntity.ok(existingProduct);
            }

            else if (Objects.equals(newProduct.getProductCategory(), "bicicleta")) {
                existingProduct.setProductQuantity(newProduct.getProductQuantity());
                existingProduct.setProductDescription(newProduct.getProductDescription());
                existingProduct.setProductPrice(newProduct.getProductPrice());
                existingProduct.setProductName(newProduct.getProductName());
                existingProduct.setProductCategory(newProduct.getProductCategory());
                existingProduct.setProductCategoryTShirtSize(null);
                existingProduct.setProductCategoryAdidasSize(null);
                existingProduct.setProductCategoryPantsSize(null);
                existingProduct.setProductCategoryBikeSize(newProduct.getProductCategoryBikeSize());
                productRepository.save(existingProduct);

                return ResponseEntity.ok(existingProduct);
            }

            else


            {
                existingProduct.setProductQuantity(newProduct.getProductQuantity());
                existingProduct.setProductDescription(newProduct.getProductDescription());
                existingProduct.setProductPrice(newProduct.getProductPrice());
                existingProduct.setProductName(newProduct.getProductName());
                existingProduct.setProductCategory(newProduct.getProductCategory());
                existingProduct.setProductCategoryTShirtSize(null);
                existingProduct.setProductCategoryAdidasSize(null);
                existingProduct.setProductCategoryPantsSize(null);
                existingProduct.setProductCategoryBikeSize(null);
                productRepository.save(existingProduct);

                return ResponseEntity.ok(existingProduct);
            }



        } else {


            Products savedProduct = productRepository.save(newProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        }
    }

    @Transactional
    @PostMapping("productBuy")
    public ResponseEntity<String> buyProduct(@RequestBody Products newProduct, @RequestHeader("Authorization") String authorizationHeader) {

//
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Long userId = extractUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User ID not found in the authentication token");
            }
            String productName = newProduct.getProductName();
            Optional<Products> existingProductOptional = productRepository.findByProductName(productName);
            if (existingProductOptional.isPresent()) {
                Products existingProduct = existingProductOptional.get();
                if (existingProduct.getProductQuantity() > newProduct.getProductQuantity()) {
                    existingProduct.setProductQuantity(existingProduct.getProductQuantity() - newProduct.getProductQuantity());
                    productRepository.save(existingProduct);
                    newProduct.setProductId(existingProduct.getProductId());
                    newProduct.setProductImage(existingProduct.getProductImage());
                    newProduct.setProductCategory(existingProduct.getProductCategory());
                    if (Objects.equals(existingProduct.getProductCategory(), "tricou")) {
                        newProduct.setProductCategoryTShirtSize(existingProduct.getProductCategoryTShirtSize());
                        newProduct.setProductCategoryAdidasSize(null);
                        newProduct.setProductCategoryPantsSize(null);
                        newProduct.setProductCategoryBikeSize(null);
                    }
                    else if (Objects.equals(existingProduct.getProductCategory(), "adidas"))
                    {
                        newProduct.setProductCategoryAdidasSize(existingProduct.getProductCategoryAdidasSize());
                        newProduct.setProductCategoryTShirtSize(null);
                        newProduct.setProductCategoryPantsSize(null);
                        newProduct.setProductCategoryBikeSize(null);
                    }
                    else if (Objects.equals(existingProduct.getProductCategory(), "pantaloni"))
                    {
                        newProduct.setProductCategoryPantsSize(existingProduct.getProductCategoryPantsSize());
                        newProduct.setProductCategoryAdidasSize(null);
                        newProduct.setProductCategoryTShirtSize(null);
                        newProduct.setProductCategoryBikeSize(null);
                    }
                    else if (Objects.equals(existingProduct.getProductCategory(), "bicicleta"))
                    {

                        newProduct.setProductCategoryPantsSize(null);
                        newProduct.setProductCategoryAdidasSize(null);
                        newProduct.setProductCategoryTShirtSize(null);
                        newProduct.setProductCategoryBikeSize(existingProduct.getProductCategoryBikeSize());

                    }

                    else
                    {
                        newProduct.setProductCategoryPantsSize(null);
                        newProduct.setProductCategoryAdidasSize(null);
                        newProduct.setProductCategoryTShirtSize(null);
                        newProduct.setProductCategoryBikeSize(null);
                    }

                    if (purchaseRepository.existsByUserIdAndProductName(userId, existingProduct.getProductName())) {
                        Purchase existingPurchase = purchaseRepository.findByUserIdAndProductName(userId, existingProduct.getProductName());

                        existingPurchase.setProductQuantity(existingPurchase.getProductQuantity() + newProduct.getProductQuantity());
                        purchaseRepository.save(existingPurchase);
                    } else {
                        Purchase purchase = new Purchase(userId, newProduct);

                        purchaseRepository.save(purchase);
                    }


                } else if (Objects.equals(existingProduct.getProductQuantity(), newProduct.getProductQuantity())) {

                    if (purchaseRepository.existsByUserIdAndProductName(userId, existingProduct.getProductName())) {
                        newProduct.setProductId(existingProduct.getProductId());
                        newProduct.setProductImage(existingProduct.getProductImage());
                        Purchase existingPurchase = purchaseRepository.findByUserIdAndProductName(userId, existingProduct.getProductName());

                        existingPurchase.setProductQuantity(existingPurchase.getProductQuantity() + newProduct.getProductQuantity());
                        purchaseRepository.save(existingPurchase);
                    } else {
                        newProduct.setProductId(existingProduct.getProductId());
                        newProduct.setProductImage(existingProduct.getProductImage());
                        newProduct.setProductPrice(existingProduct.getProductPrice());
                        newProduct.setProductName(existingProduct.getProductName());
                        newProduct.setProductPrice(existingProduct.getProductPrice());
                        newProduct.setProductQuantity(existingProduct.getProductQuantity());
                        newProduct.setProductCategory(existingProduct.getProductCategory());
                        if (Objects.equals(existingProduct.getProductCategory(), "tricou"))
                        {

                            newProduct.setProductCategoryTShirtSize(existingProduct.getProductCategoryTShirtSize());
                            newProduct.setProductCategoryAdidasSize(null);
                            newProduct.setProductCategoryPantsSize(null);
                            newProduct.setProductCategoryBikeSize(null);
                        }
                        else
                        if (Objects.equals(existingProduct.getProductCategory(), "adidas"))
                        {

                            newProduct.setProductCategoryTShirtSize(null);
                            newProduct.setProductCategoryPantsSize(null);
                            newProduct.setProductCategoryAdidasSize(existingProduct.getProductCategoryAdidasSize());
                            newProduct.setProductCategoryBikeSize(null);
                        }
                        else
                        if (Objects.equals(existingProduct.getProductCategory(), "pantaloni"))
                        {

                            newProduct.setProductCategoryTShirtSize(null);
                            newProduct.setProductCategoryPantsSize(existingProduct.getProductCategoryPantsSize());
                            newProduct.setProductCategoryAdidasSize(null);
                            newProduct.setProductCategoryBikeSize(null);
                        }
                        else
                        if (Objects.equals(existingProduct.getProductCategory(), "bicicleta"))
                        {
                           ;
                            newProduct.setProductCategoryTShirtSize(null);
                            newProduct.setProductCategoryPantsSize(null);
                            newProduct.setProductCategoryAdidasSize(null);
                            newProduct.setProductCategoryBikeSize(existingProduct.getProductCategoryBikeSize());

                        }
                        else
                        {

                            newProduct.setProductCategoryPantsSize(null);
                            newProduct.setProductCategoryTShirtSize(null);
                            newProduct.setProductCategoryAdidasSize(null);
                            newProduct.setProductCategoryBikeSize(null);
                        }





                        Purchase purchase = new Purchase(userId, newProduct);



                        purchaseRepository.save(purchase);
                    }


                    productRepository.delete(newProduct);


                } else {
                    return ResponseEntity.badRequest().body("Quantity is greater than available stock");
                }


                return ResponseEntity.ok("Product bought successfully");


            } else {
                return ResponseEntity.badRequest().body("Product not found");
            }


        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }


    }


}
