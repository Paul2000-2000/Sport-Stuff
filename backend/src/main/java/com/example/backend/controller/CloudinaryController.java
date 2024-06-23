package com.example.backend.controller;


import com.example.backend.model.Image;
import com.example.backend.service.CloudinaryService;
import com.example.backend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
@CrossOrigin(origins = "http://localhost:3000")
public class CloudinaryController {


    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    ImageService imageService;

    @GetMapping("/list")
    public ResponseEntity<List<Image>> list() {
        List<Image> list = imageService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/upload")
    @ResponseBody
    public ResponseEntity<String> upload(@RequestParam MultipartFile imageFile) throws IOException {
        BufferedImage bi = ImageIO.read(imageFile.getInputStream());
        if (bi == null) {
            return new ResponseEntity<>("Image is not valid!", HttpStatus.BAD_REQUEST);
        }
        Map result = cloudinaryService.upload(imageFile);
        Image image = new Image((String) result.get("original_filename"),
                (String) result.get("url"),
                (String) result.get("public_id"));
        imageService.save(image);


        return new ResponseEntity<>((String) result.get("url"), HttpStatus.OK);
    }


}