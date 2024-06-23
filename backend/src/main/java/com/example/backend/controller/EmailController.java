package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static com.example.backend.service.AuthenticationService.extractUserIdFromToken;

@RestController
public class EmailController {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping("sendEmailToLoggedInUser")
    public ResponseEntity<String> sendEmail(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestBody Map<String, String> requestData) throws MessagingException
    {

        String token = authorizationHeader.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(token);
        String userEmail = userRepository.findById(userId)
                .map(User::getEmail)
                .orElse(null);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User email not found");
        }

        String emailBody = requestData.get("body");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(userEmail);
        helper.setSubject("Your order details");
        helper.setText(emailBody, true);
        javaMailSender.send(message);
        return ResponseEntity.ok("Email sent successfully");

    }
}