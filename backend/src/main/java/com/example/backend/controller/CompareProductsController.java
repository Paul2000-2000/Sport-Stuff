package com.example.backend.controller;

import com.example.backend.model.CompareProducts;
import com.example.backend.model.Products;
import com.example.backend.model.User;
import com.example.backend.model.WishList;
import com.example.backend.repository.CompareProductsRepository;
import com.example.backend.repository.ProductsRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class CompareProductsController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductsRepository productRepository;
    @Autowired
    private CompareProductsRepository compareProductsRepository;

    @PostMapping("productAddToCompare")
    public ResponseEntity<String> productAddToCompare(@RequestBody Products newProduct, @RequestHeader("Authorization") String authorizationHeader) {
        try {

            String token = authorizationHeader.replace("Bearer ", "");
            System.out.println(token);


            Long userId = extractUserIdFromToken(token);

            System.out.println(userId);




            if (userId == null) {
                return ResponseEntity.badRequest().body("User ID not found in the authentication token");
            }

            Optional<User> userOptional = userRepository.findById(userId);

            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }


            User newUser = userOptional.get();
            Long numberCompareProducts = newUser.getNumberCompareProducts();




            String productName = newProduct.getProductName();

            boolean isProductInCompareList = compareProductsRepository.existsByUserIdAndProductName(userId, productName);

            if (isProductInCompareList) {
                return ResponseEntity.badRequest().body("Product is already in Compare");
            }


            if (numberCompareProducts == null) {

                newUser.setNumberCompareProducts(1L);
            } else if (numberCompareProducts == 3) {

                return ResponseEntity.badRequest().body("Can't be more than 3 products to compare");
            } else {

                newUser.setNumberCompareProducts(numberCompareProducts + 1);
            }

            System.out.println("Urmatorul compare este al "  + newUser.getNumberCompareProducts());




            if (newUser.getNumberCompareProducts() > 1) {

                System.out.println("intrat aici");


                Optional<CompareProducts> compareProductsOptional = compareProductsRepository.findByUserIdAndNumberCompareProducts(userId, 1L);


                if (compareProductsOptional.isPresent()) {

                    System.out.println("intra si aici ca am gasit daa");
                    CompareProducts compareProducts = compareProductsOptional.get();
                    String firstProductCategory = compareProducts.getProductCategory();

                    System.out.println(firstProductCategory);

                    String productCategory = newProduct.getProductCategory();

                    if (!firstProductCategory.equals(productCategory)) {
                        return ResponseEntity.badRequest().body("Second and third products must be in the same category as the first one");

                    }
                } else {
                    return ResponseEntity.notFound().build();
                }
            }

            userRepository.save(newUser);

            Optional<Products> existingProductOptional = productRepository.findByProductName(productName);




            if (existingProductOptional.isPresent()) {

                CompareProducts compareProducts = new CompareProducts( userId,newProduct, newUser.getNumberCompareProducts());

                compareProductsRepository.save( compareProducts) ;

                return ResponseEntity.ok("Product sent to Compare successfully");

            }

            else {
                return ResponseEntity.notFound().build();
            }



        } catch (Exception e) {
            // Handle exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }

    }

    @GetMapping("CompareListForOneUser")
    public ResponseEntity<List<CompareProducts>> CompareListForOneUser(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);


        List<CompareProducts> compareByUserId = compareProductsRepository.findCompareByuserId(userId);


        return ResponseEntity.ok(compareByUserId);
    }

    @GetMapping("CompareListForOneUserNumber")
    public ResponseEntity<Integer> CompareListForOneUserNumber(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        Long userId = extractUserIdFromToken(token);


        List<CompareProducts> compareProducts = compareProductsRepository.findCompareByuserId(userId);

        int sizeCompareLists = compareProducts.size();


        return ResponseEntity.ok(sizeCompareLists);
    }


    @DeleteMapping("productRemoveCompareList")
    public void removeProductFromCompareList(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Long productId) {

        String token = authorizationHeader.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(token);

        CompareProducts CompareItemToBeRemoved = compareProductsRepository.findByUserIdAndProductId(userId, productId);

        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.get();


        compareProductsRepository.delete(CompareItemToBeRemoved);


        if (user.getNumberCompareProducts() == 3) {
            List<CompareProducts> remainingCompareItems = compareProductsRepository.findByUserId(userId);
            int remainingItemsCount = remainingCompareItems.size();
            if (remainingItemsCount == 2) {

                for (int i = 0; i < remainingItemsCount; i++) {
                    remainingCompareItems.get(i).setNumberCompareProducts((long) (i + 1));
                }
            } else if (remainingItemsCount == 1) {

                remainingCompareItems.get(0).setNumberCompareProducts(2L);
            }
            compareProductsRepository.saveAll(remainingCompareItems);
        }


        user.setNumberCompareProducts(user.getNumberCompareProducts() - 1);
        userRepository.save(user);


    }


}
