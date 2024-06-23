import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [checkout, setCheckout] = useState({
    billingAddress: "",
    postalCode: "",
    phoneNumber: "",
    totalPrice: 0,
    paymentMethod: "",
  });

  const [userId, setUserId] = useState(() => {
    // Retrieve userId from localStorage if it exists
    return localStorage.getItem("userId") || null;
  });

  const [products, setProducts] = useState([]);
  const { billingAddress, postalCode, phoneNumber, paymentMethod } = checkout;

  const [billingaddressError, setBillingAddressError] = useState(null);
  const [postalcodeError, setPostalCodeError] = useState(null);
  const [paymentMethodError, setPaymentMethodError] = useState(null);
  const [phonenumberError, setPhoneNumberError] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

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

  const onInputChange = (e) => {
    setCheckout((prevChechout) => ({
      ...prevChechout,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "billingaddress" && e.target.value.trim() !== "") {
      setBillingAddressError("");
    }
    if (e.target.name === "postalcode" && e.target.value.trim() !== "") {
      setPostalCodeError("");
    }
    if (e.target.name === "phonenumber" && e.target.value.trim() !== "") {
      setPhoneNumberError("");
    }
    if (e.target.name === "paymentMethod" && e.target.value.trim() !== "") {
      setPaymentMethodError("");
    }
  };

  const handleBackToShoppingPage = () => {
    navigate(`/shoppinglistclient/${userId}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");

    try {
      if (billingAddress.length === 0) {
        setBillingAddressError("Billing Address field can not be empty.");
        return;
      } else if (postalCode.length === 0) {
        setPostalCodeError("Postal Code field can not be empty.");
        return;
      } else if (phoneNumber.length === 0) {
        setPhoneNumberError("Phone number field can not be empty.");
        return;
      } else if (paymentMethod.length === 0) {
        setPaymentMethodError("Please selecet a method.");
        return;
      }
      const userId = products.length > 0 ? products[0].userId : null;
      const checkoutData = {
        billingAddress: billingAddress,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        userId: userId,
      };

      if (paymentMethod == "ramburs") {
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
        navigate(`/afterlogin/${userId}`);
      } else if (paymentMethod == "card" && checkoutData) {
        navigate(`/payment/${userId}`, {
          state: { checkoutData: checkoutData },
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);

      setCheckoutError(
        "An error occurred during checkout. Please try again later."
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="my-5"> Here is the checkout!</h2>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="d-flex flex-column justify-content-center align-items-center w-40"
        style={{
          border: "solid 2px black",
          borderRadius: "15px",
          width: "40%",
          boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)",
        }}
      >
        <label
          htmlFor="billingAddress"
          className="mb-1 fs-5"
          style={{ marginTop: "20px" }}
        >
          Billing Address
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your Billing Address"
          name="billingAddress"
          value={billingAddress}
          onChange={(e) => onInputChange(e)}
          style={{ width: "50% " }}
        />
        {/* Display error message if email field is empty */}
        {billingaddressError && (
          <div className="text-danger">{billingaddressError}</div>
        )}

        <label htmlFor="postalCode" className="mb-1 fs-5">
          Postal Code
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter Postal Code"
          name="postalCode"
          value={postalCode}
          onChange={(e) => onInputChange(e)}
          style={{ width: "50% " }}
        />
        {postalcodeError && (
          <div className="text-danger">{postalcodeError}</div>
        )}
        <label htmlFor="phoneNumber" className="mb-1 fs-5">
          Phone Number
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your phone number"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => onInputChange(e)}
          pattern="0\d{9}"
          style={{ width: "50% " }}
        />
        {phonenumberError && (
          <div className="text-danger">{phonenumberError}</div>
        )}

        <label htmlFor="paymentMethod" className="mb-1 fs-5">
          Payment Method
        </label>
        <select
          className="mb-4 form-select w-15"
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => onInputChange(e)}
          style={{ width: "50% " }}
        >
          <option value="">Select a Method</option>
          <option value="card">Card</option>
          <option value="ramburs">ramburs</option>
        </select>
        {paymentMethodError && (
          <div className="text-danger">{paymentMethodError}</div>
        )}

        <h3
          className=" w-50 mx-auto text-center"
          style={{ marginBottom: "15px" }}
        >
          {" "}
          Here are your products!
        </h3>

        <ul
          className="d-flex flex-wrap align-items-center justify-content-around"
          style={{ width: "100%" }}
        >
          {products.map((product) => (
            <li
              key={product.productId}
              className="flex-basis-25 mb-4"
              style={{
                width: "25%",
                boxShadow:
                  "0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",

                borderRadius: "15px ",
                marginRight: "2%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <img
                  src={product.productImage}
                  style={{ width: "100px", height: "100px", marginTop: "25px" }}
                  alt="productimage"
                />
              </p>
              <p>Price: ${product.productPrice}</p>
              <p>Quantity: {product.productQuantity}</p>

              <p>Price:$ {product.productPrice * product.productQuantity}</p>
            </li>
          ))}
        </ul>

        <h3 className="my-5 w-50 mx-auto text-center">
          {" "}
          Here is the total price!
        </h3>
        <p style={{ textAlign: "center" }}> Total Price: ${totalPrice}</p>

        <button
          type="submit"
          className="btn btn-primary btn-half mx-auto d-block"
          style={{ marginBottom: "20px" }}
        >
          Finish Command
        </button>

        <button
          className="btn btn-primary btn-half mx-auto d-block"
          style={{ marginBottom: "20px" }}
          onClick={handleBackToShoppingPage}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
