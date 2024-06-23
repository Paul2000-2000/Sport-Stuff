import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";
import axios from "axios";

const PaymentForm = () => {
  const elements = useElements();
  const stripe = useStripe();
  const [messages, addMessage] = useMessages();
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(() => {
    // Retrieve userId from localStorage if it exists
    return localStorage.getItem("userId") || null;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state ? location.state.checkoutData : null;

  const cardElementStyle = {
    base: {
      fontSize: "16px",
      color: "#495057",

      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#6c757d",
      },
    },
    invalid: {
      color: "#dc3545",
      ":focus": {
        color: "#dc3545",
      },
    },
  };

  console.log(checkoutData);

  const handleBackToCheckoutPage = () => {
    navigate(`/checkoutpage/${userId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/PurchaseForOneUser",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setProducts(response.data);

        let totalPrice = 0;
        response.data.forEach((product) => {
          totalPrice += product.productPrice * product.productQuantity;
        });
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const authToken = localStorage.getItem("token");
        console.log(authToken);
        const response = await axios.get("http://localhost:8080/getUser", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const newUserId = response.data.id;
        setUserId(newUserId); // Update userId state
        localStorage.setItem("userId", newUserId); // Store userId in localStorage
        console.log("User Id from response data " + newUserId);
        console.log("User Id from set " + userId);
      } catch (error) {
        console.error("Error fetching userID:", error.message);
      }
    };

    fetchUserID();
  }, []);

  const handleBacktoSite = () => {
    navigate(`/afterlogin/${userId}`);
  };

  const handleSubmit = async (e) => {
    const authToken = localStorage.getItem("token");
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/create-payment-intent",
        {
          paymentMethodType: "card",
          currency: "eur",
          totalPrice: checkoutData.totalPrice,
          userId: checkoutData.userId,
        }
      );
      const { clientSecret } = response.data;

      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      await axios.post("http://localhost:8080/finishCheckout", checkoutData);

      await axios.post(
        "http://localhost:8080/finishCheckoutPurchases",
        checkoutData
      );

      await axios.delete(`http://localhost:8080/purchasesDelete/${userId}`);
      let bodyBuilder = "<html><body>";
      bodyBuilder += "<h2>Products:</h2>";
      bodyBuilder += "<ul>";
      products.forEach((product) => {
        bodyBuilder += `<li>
                               <p>Price for Item: $${product.productPrice}</p>
                               <p>Quantity: ${product.productQuantity}</p>
                               <p>Image: <img src="${
                                 product.productImage
                               }" style="width:50px; height:50px;" alt="productimage"/></p>
                               <p>Total Price: $${
                                 product.productPrice * product.productQuantity
                               }</p>
                           </li>`;
      });
      bodyBuilder += "</ul>";
      bodyBuilder += `<h3>Order Price: ${totalPrice}</h3>`;
      bodyBuilder += "</body></html>";
      await axios.post(
        "http://localhost:8080/sendEmailToLoggedInUser",
        { body: bodyBuilder },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (paymentIntent.status === "succeeded") {
        addMessage("Payment succeeded!");
      } else {
        addMessage("Payment failed!");
      }
    } catch (error) {
      console.error("Error creating or confirming payment:", error.message);
      addMessage("Error creating or confirming payment");
    }
  };

  return (
    <>
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <label
          htmlFor="card=element"
          style={{ fontSize: "35px", marginBottom: "10px" }}
        >
          Card
        </label>
        <div
          style={{
            width: "600px",
            height: "75px",
            border: "1px solid #ced4da", // Add a border to show the card element container
            borderRadius: "4px", // Add border radius for styling
            paddingTop: "25px",
            paddingLeft: "10px",
            paddingRight: "10px",
            textAlign: "center",
          }}
        >
          <CardElement
            id="card-element"
            options={{
              style: cardElementStyle,
            }}
          />
        </div>
        <div style={{ width: "50%", display: "flex", padding: "0px 50px" }}>
          <button
            className="btn btn-primary btn-half mx-auto d-block"
            style={{ marginBottom: "20px", width: "20%", marginTop: "30px" }}
          >
            Pay
          </button>
          <button
            className="btn btn-primary btn-half mx-auto d-block"
            style={{
              marginBottom: "20px",
              width: "20%",
              height: "50%",
              marginTop: "30px",
            }}
            onClick={handleBackToCheckoutPage}
          >
            Back
          </button>
        </div>
      </form>
      <StatusMessages
        messages={messages}
        style={{ textAlign: "center", fontSize: "20px", color: "blue" }}
      />

      <button
        className="btn btn-primary btn-half mx-auto d-block"
        onClick={handleBacktoSite}
        style={{ marginBottom: "40px", width: "32%" }}
      >
        Back to the site
      </button>
    </>
  );
};

export default PaymentForm;
