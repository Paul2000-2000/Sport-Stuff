package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;
    private String email;
    private String password;
    private String firstname;
    private String lastname;
    private Long orderNumber;
    private Long numberCompareProducts;


    @OneToMany(mappedBy = "userId")
    private List<Purchase> purchases;
}
