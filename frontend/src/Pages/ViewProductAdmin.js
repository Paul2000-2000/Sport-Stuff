import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiAccountPinCircleFill } from "react-icons/ri";

const ViewProductAdmin = () => {
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedBackError, setFeedBackError] = useState(null);
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productCategoryTShirtSize: "",
    productCategoryAdidasSize: "",
    productCategoryPantsSize: "",
    imageFile: null,
  });
  const { productId } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/productFeedBackAll/${productId}`
        );
        setFeedbacks(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Error fetching feedbacks");
      }
    };

    fetchFeedbacks();
  }, [productId]);

  useEffect(() => {
    if (feedbacks.length === 0) {
      setFeedBackError("There are no feedbacks for this product.");
    } else {
      setFeedBackError("");
    }
  }, [feedbacks]);

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

  const backtoAdminPageee = () => {
    navigate("/loginadmin");
  };

  return (
    <div>
      <h2 className="my-5 text-center"> View product! </h2>
      <div className="">
        <div
          className="d-flex flex-column w-50 mx-auto"
          style={{
            border: "solid 2px black",
            borderRadius: "15px",
            width: "55%",
            boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{ width: "50%", paddingLeft: "30px", marginTop: "15px" }}
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

              {productCategory === "adidas" ? (
                <div style={{ display: "flex" }}>
                  <label
                    htmlFor="productCategoryAdidasSize"
                    className="mb-1 fs-5"
                  >
                    Size:
                  </label>
                  <div
                    className="mb-4 form-control w-15"
                    style={{ marginLeft: "15px" }}
                  >
                    {productCategoryAdidasSize}
                  </div>
                </div>
              ) : productCategory === "pantaloni" ? (
                <div style={{ display: "flex" }}>
                  <label
                    htmlFor="productCategoryPantsSize"
                    className="mb-1 fs-5"
                  >
                    Size:
                  </label>
                  <div
                    className="mb-4 form-control w-15"
                    style={{ marginLeft: "15px" }}
                  >
                    {productCategoryPantsSize}
                  </div>
                </div>
              ) : productCategory === "tricou" ? (
                <div style={{ display: "flex" }}>
                  <label
                    htmlFor="productCategoryTShirtSize"
                    className="mb-1 fs-5"
                  >
                    Size:
                  </label>
                  <div
                    className="mb-4 form-control w-15"
                    style={{ marginLeft: "15px" }}
                  >
                    {productCategoryTShirtSize}
                  </div>
                </div>
              ) : null}

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
                <div
                  className="mb-4 form-control w-15"
                  style={{ marginLeft: "15px" }}
                >
                  {productQuantity}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "35px" }}>
            <button
              onClick={backtoAdminPageee}
              className="btn btn-primary btn-half mx-auto d-block"
              style={{ width: "30%" }}
            >
              Cancel
            </button>
          </div>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
        </div>

        <div>
          <h3
            style={{
              textAlign: "center",
              marginTop: "100px",
              marginBottom: "50px",
            }}
          >
            Feedbacks:
          </h3>
          <ul style={{ paddingLeft: "25%", paddingRight: "25%" }}>
            {feedbacks.length > 0
              ? feedbacks.map((feedback, index) => (
                  <li
                    key={index}
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",

                      borderRadius: "5px",
                      boxShadow:
                        " 0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",
                    }}
                  >
                    <div>
                      <p>
                        {" "}
                        <RiAccountPinCircleFill
                          style={{
                            width: "35px",
                            height: "35px",
                            color: "#3264B3",
                          }}
                        />{" "}
                        {feedback.productFeedBackUsername}
                      </p>
                      <p>{feedback.productFeedbackMessage}</p>
                    </div>
                    <p style={{ paddingTop: "15px" }}>
                      Rate: {feedback.productFeedbackRating}
                    </p>
                  </li>
                ))
              : feedBackError && (
                  <h2 style={{ color: "red", textAlign: "center" }}>
                    {feedBackError}
                  </h2>
                )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewProductAdmin;
