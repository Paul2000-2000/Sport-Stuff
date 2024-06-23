package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class CloudinaryService {
    Cloudinary cloudinary;

    public CloudinaryService() {
        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("cloud_name", "dbzgwfor2");
        valuesMap.put("api_key", "178687467494927");
        valuesMap.put("api_secret", "ihZfDUoafMceoTMeudM1ML6XNBw");
        cloudinary = new Cloudinary(valuesMap);
    }


    public Map upload(MultipartFile imageFile) throws IOException {
        File file = convert(imageFile);
        Map result = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
        if (!Files.deleteIfExists(file.toPath())) {
            throw new IOException("Failed to delete temporary file: " + file.getAbsolutePath());
        }
        return result;
    }

    public Map delete(String id) throws IOException {
        return cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
    }

    private File convert(MultipartFile imageFile) throws IOException {
        File file = new File(Objects.requireNonNull(imageFile.getOriginalFilename()));
        FileOutputStream fo = new FileOutputStream(file);
        fo.write(imageFile.getBytes());
        fo.close();
        return file;
    }

}