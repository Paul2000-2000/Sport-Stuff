import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const [products, setProducts] = useState([]);
  const [productsMessage, setProductsMessage] = useState();
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
          "http://localhost:8080/WishListForOneUser",
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
        `http://localhost:8080/productRemoveWishList?productId=${productId}`,
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

  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">
        {" "}
        Here are your products from WishList!{" "}
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
              <li
                key={product.productId}
                className="flex-basis-25 mb-4"
                style={{
                  width: "22%",

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
                    style={{
                      width: "175px",
                      height: "175px",
                      marginTop: "25px",
                    }}
                    alt="productimage"
                  />
                </p>
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ${product.productPrice}</p>

                <button
                  onClick={() => handleRemoveProduct(product.productId)}
                  className="btn btn-primary btn-half mx-auto d-block"
                  style={{ marginBottom: "20px" }}
                >
                  Remove
                </button>
              </li>
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
        </div>
      </div>
    </div>
  );
};

export default WishList;
