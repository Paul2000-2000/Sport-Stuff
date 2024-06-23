import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BuyProduct = () => {
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productCategoryTShirtSize: "",
    productCategoryAdidasSize: "",
    productCategoryPantsSize: "",
    productCategoryBikeSize: "",
    imageFile: null,
  });
  const { productId } = useParams();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
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
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/product/${productId}`
        );
        const data = await response.json();

        // Assuming your API returns a single product
        setProduct({
          productName: data.productName || "",
          productCategory: data.productCategory || "",
          productCategoryTShirtSize: data.productCategoryTShirtSize || "",
          productCategoryAdidasSize: data.productCategoryAdidasSize || "",
          productCategoryPantsSize: data.productCategoryPantsSize || "",
          productCategoryBikeSize: data.productCategoryBikeSize || "",
          productDescription: data.productDescription || "",
          productPrice: data.productPrice || "",
          productQuantity: data.productQuantity || "",
          imageFile: data.productImage || null,
        });

        console.log(data);
        console.log(product.imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const {
    productName,
    productCategory,
    productCategoryTShirtSize,
    productCategoryAdidasSize,
    productCategoryPantsSize,
    productDescription,
    productPrice,
    productQuantity,
    imageFile,
  } = product;

  const [productQuantityError, setProductQuantityError] = useState(null);
  const [error, setError] = useState(null);

  const onInputChange = (e) => {
    setProduct((prevProd) => ({
      ...prevProd,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "productQuantity" && e.target.value.trim() !== "") {
      setProductQuantityError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        navigate("/login");
        return;
      }
      if (product.productQuantity <= 0) {
        setProductQuantityError("Quantity muust be greater than zero");

        return;
      } else {
        product.productQuantity = selectedQuantity;
      }

      await axios.post("http://localhost:8080/productBuy", product, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      navigate(`/afterlogin/${userId}`);
    } catch (error) {
      console.error("Error buying product:", error);

      if (error.response && error.response.status === 400) {
        console.log("Server error response:", error.response.data);

        if (error.response.data === "Authentication error") {
          setError("Authentication error. Please log in.");
        } else {
          setError("Quantity is greater than available stock");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const backtoAdmin = () => {
    navigate(`/afterlogin/${userId}`);
  };

  return (
    <div>
      <h2 className="my-5 text-center"> Buy the product! </h2>
      <div className="">
        <form
          onSubmit={(e) => onSubmit(e)}
          className="d-flex flex-column w-50 mx-auto"
          style={{
            borderRadius: "15px",
            width: "55%",
            boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)",
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{ width: "50%", paddingLeft: "30px", marginTop: "20px" }}
            >
              <img
                src={imageFile}
                alt="Product"
                style={{ height: "100%%", width: "100%" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                width: "50%",
                marginLeft: "100px",
              }}
            >
              <div style={{ display: "flex" }}>
                <label htmlFor="productName" className="mb-1 fs-5">
                  Name:
                </label>
                <div
                  className="mb-4 form-control w-15"
                  style={{ marginLeft: "15px" }}
                >
                  {productName}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label htmlFor="productDescription" className="mb-1 fs-5">
                  Description:
                </label>
                <div
                  className="mb-4 form-control w-15"
                  style={{ marginLeft: "15px" }}
                >
                  {productDescription}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label htmlFor="productPrice" className="mb-1 fs-5">
                  Price:
                </label>
                <div
                  className="mb-4 form-control w-15"
                  style={{ marginLeft: "15px" }}
                >
                  {productPrice}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label htmlFor="productQuantity" className="mb-1 fs-5">
                  Quantity:
                </label>
                <input
                  type="number"
                  className="mb-4 form-control w-15"
                  placeholder="Enter the product quantity"
                  name="productQuantity"
                  style={{ marginLeft: "15px" }}
                  value={selectedQuantity}
                  onChange={(e) => {
                    onInputChange(e);
                    setSelectedQuantity(e.target.value);
                  }}
                />
              </div>

              {/* TO DO  : BUY SET TO 1*/}

              {productQuantityError && (
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {productQuantityError}
                </p>
              )}
            </div>
          </div>
          <div
            style={{ display: "flex", marginBottom: "35px", marginTop: "35px" }}
          >
            <button
              onClick={backtoAdmin}
              className="btn btn-primary btn-half mx-auto d-block"
              style={{ width: "30%" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-half mx-auto d-block"
              style={{ width: "30%" }}
            >
              Buy
            </button>
          </div>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default BuyProduct;
