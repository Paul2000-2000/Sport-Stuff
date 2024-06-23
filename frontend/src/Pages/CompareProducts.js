import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompareProduct from "../Components/CompareProduct/CompareProduct";

const CompareProducts = () => {
  const [products, setProducts] = useState([]);
  const [productsMessage, setProductsMessage] = useState();
  const [compare, setCompare] = useState(null);
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
          "http://localhost:8080/CompareListForOneUser",
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
        `http://localhost:8080/productRemoveCompareList?productId=${productId}`,
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

  const handleCompareProdcuts = () => {
    setCompare(!compare);
  };

  const comparePrices = (products) => {
    const sortedProducts = products.sort(
      (a, b) => a.productPrice - b.productPrice
    );
    const highestPrice = sortedProducts[sortedProducts.length - 1].productPrice;
    const lowestPrice = sortedProducts[0].productPrice;
    if (highestPrice === lowestPrice) {
      return "The prices of all products are the same.";
    } else {
      const highestPriceProduct = sortedProducts.find(
        (product) => product.productPrice === highestPrice
      ).productName;
      const lowestPriceProduct = sortedProducts.find(
        (product) => product.productPrice === lowestPrice
      ).productName;
      return `The price of ${lowestPriceProduct} is the lowest, and the price of ${highestPriceProduct} is the highest.`;
    }
  };

  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">
        {" "}
        Here are your products from Compare!{" "}
      </h2>

      <div style={{ marginLeft: "13%", marginRight: "13%", height: "65vh" }}>
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
              <CompareProduct
                key={product.productId}
                handleRemoveProduct={handleRemoveProduct}
                product={product}
              />
            ))}
          </ul>
        )}
        <div className="buttons">
          <button
            onClick={backtoProductPage}
            className="btn btn-primary btn-half mx-auto d-block"
            style={{ width: "30%" }}
          >
            Back
          </button>
          <button
            onClick={handleCompareProdcuts}
            className="btn btn-primary btn-half mx-auto d-block"
            style={{ width: "30%", marginTop: "30px" }}
          >
            Compare
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          {compare && products.length === 1 && (
            <div
              className="alert alert-warning"
              role="alert"
              style={{ width: "30%", textAlign: "center" }}
            >
              You can't compare if there is only one product.
            </div>
          )}

          {compare && products.length >= 2 && (
            <div
              className="alert alert-info"
              role="alert"
              style={{ width: "30%", textAlign: "center" }}
            >
              {comparePrices(products)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
