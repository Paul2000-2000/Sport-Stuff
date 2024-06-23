package com.example.backend.exceptions;


public class UsernameAlreadyExistException extends RuntimeException {
    public UsernameAlreadyExistException() {
        super("Username already exists");
    }
}
