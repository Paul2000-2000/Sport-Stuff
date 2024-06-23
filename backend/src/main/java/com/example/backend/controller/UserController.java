package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;


@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("getAllClients")
    public ResponseEntity<List<User>> getallusers() {
        List<User> allusers = userRepository.findAll();

        List<User> filteredUsers = allusers.stream()
                .filter(user -> !user.getUsername().equals("Admin"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredUsers);
    }

    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Long userId = extractUserIdFromToken(token);

            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/userAdd")
    public ResponseEntity<User> newUser(@RequestBody User newUser) {
        if (usernameAlreadyExists(newUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        User savedUser = userRepository.saveAndFlush(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @GetMapping("/user/check-username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsernameExists(@PathVariable String username) {
        String trimmedUsername = username.trim();

        boolean exists = usernameAlreadyExists(trimmedUsername);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/check-password")
    public ResponseEntity<Map<String, Boolean>> checkPassword(@RequestParam String username, @RequestParam String password) {
        boolean isPasswordCorrect = isPasswordCorrect(username, password);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isPasswordCorrect", isPasswordCorrect);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent() && passwordEncoder.matches(password, optionalUser.get().getPassword())) {
            Long userId = optionalUser.get().getId(); // Use userId as a Long
            String token = AuthenticationService.generateToken(username, userId);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", String.valueOf(userId));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private boolean usernameAlreadyExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    private boolean isPasswordCorrect(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        return passwordEncoder.matches(password, optionalUser.get().getPassword());
    }


}
