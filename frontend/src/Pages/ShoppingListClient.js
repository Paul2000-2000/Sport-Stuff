import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingListProducts from "../Components/ShoppingListProducts/ShoppingListProducts";

const ShoppingListClient = () => {
  const [products, setProducts] = useState([]);
  const [productsMessage, setProductsMessage] = useState();
  const [checkoutMessage, setCheckoutMessage] = useState();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(() => {
    // Retrieve userId from localStorage if it exists
    return localStorage.getItem("userId") || null;
  });

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
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      setProductsMessage("You have no products.");
    } else {
      setProductsMessage("");
    }
  }, [products]);

  const handleRemoveProduct = async (productId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8080/productRemovePurchase?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const backtoProductPage = () => {
    navigate(`/afterlogin/${userId}`);
  };

  const gotoCheckoutPage = () => {
    if (products.length === 0) {
      setCheckoutMessage("You have no products. Can't proceed to checkout.");
      return;
    }

    navigate(`/checkoutpage/${userId}`);
  };

  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">
        {" "}
        Here are your products from shopping cart!{" "}
      </h2>

      <div style={{ marginLeft: "13%", marginRight: "13%" }}>
        {products.length === 0 ? (
          <h1
            className="text-center"
            style={{
              color: "black",
              marginTop: "150px",
              marginBottom: "200px",
            }}
          >
            {productsMessage}
          </h1>
        ) : (
          <ul
            className="d-flex flex-wrap align-items-center justify-content-around"
            style={{ height: "100%" }}
          >
            {products.map((product) => (
              <ShoppingListProducts
                key={product.productId}
                product={product}
                handleRemoveProduct={handleRemoveProduct}
              />
            ))}
          </ul>
        )}
        <div className="buttons">
          <button
            onClick={backtoProductPage}
            className="btn btn-primary btn-half mx-auto d-block"
          >
            Back
          </button>
          <button
            onClick={gotoCheckoutPage}
            className="btn btn-primary btn-half mx-auto d-block"
          >
            Proceed to checkout
          </button>
        </div>
        {products.length === 0 && (
          <p className="text-center" style={{ fontSize: "20px", color: "red" }}>
            {checkoutMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListClient;
