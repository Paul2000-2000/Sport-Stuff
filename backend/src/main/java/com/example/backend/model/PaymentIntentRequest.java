package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PaymentIntentRequest {


    @Id
    private Long paymentId;

    private String paymentMethodType;
    private String currency;
    private Double totalPrice;
    private Long userId;

    public PaymentIntentRequest( String paymentMethodType , String currency, Double totalPrice , Long userId)
    {
        this.paymentMethodType=paymentMethodType;
        this.currency=currency;
        this.totalPrice=totalPrice;
        this.userId=userId;
    }

    public PaymentIntentRequest(){

    }


}
