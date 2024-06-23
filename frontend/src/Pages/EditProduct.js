import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [product, setProduct] = useState({
    productName: "",
    productCategory: "",
    productCategoryTShirtSize: "",
    productCategoryAdidasSize: "",
    productCategoryPantsSize: "",
    productCategoryBikeSize: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
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
    productCategoryBikeSize,
    productDescription,
    productPrice,
    productQuantity,
    imageFile,
  } = product;

  const [productNameError, setProductNameError] = useState(null);
  const [productCategoryError, setProductCategoryError] = useState(null);
  const [productCategoryAdidasError, setProductCategoryAdidasError] =
    useState(null);
  const [productCategoryPantsError, setProductCategoryPantsError] =
    useState(null);
  const [productCategoryTShirtError, setProductCategoryTShirtError] =
    useState(null);
  const [productCategoryBikeSizeError, setProductCategoryBikeSizeError] =
    useState(null);
  const [productDescriptionError, setProductDescriptionError] = useState(null);
  const [productQuantityError, setProductQuantityError] = useState(null);
  const [productPriceError, setProductPriceError] = useState(null);

  const generateCombinations = (sizes, length) => {
    const combinations = [];

    const generate = (prefix, remaining) => {
      if (prefix.length === length) {
        combinations.push(prefix);
        return;
      }

      for (let i = 0; i < remaining.length; i++) {
        generate(prefix.concat(remaining[i]), remaining.slice(i + 1));
      }
    };

    generate([], sizes);
    return combinations;
  };

  const generateSizeAdidasOptions = () => {
    const sizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];
    const combinations = [];

    // Generate single sizes
    combinations.push(...sizes.map((size) => [size]));

    // Generate combinations of lengths 2 to 8
    for (let length = 2; length <= 8; length++) {
      combinations.push(...generateCombinations(sizes, length));
    }

    // Map combinations to option elements
    const sizeOptions = combinations.map((combination, index) => (
      <option key={index} value={combination.join(" ")}>
        {combination.join(" ")}
      </option>
    ));

    return sizeOptions;
  };

  const generateSizePantsOptions = () => {
    const sizes = ["36", "38", "40", "42", "44", "46", "48"];
    const combinations = [];

    // Generate single sizes
    combinations.push(...sizes.map((size) => [size]));

    // Generate combinations of lengths 2 to 8
    for (let length = 2; length <= 8; length++) {
      combinations.push(...generateCombinations(sizes, length));
    }

    // Map combinations to option elements
    const sizeOptions = combinations.map((combination, index) => (
      <option key={index} value={combination.join(" ")}>
        {combination.join(" ")}
      </option>
    ));

    return sizeOptions;
  };

  const onInputChange = (e) => {
    setProduct((prevProd) => ({
      ...prevProd,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "productName" && e.target.value.trim() !== "") {
      setProductNameError("");
    }
    if (e.target.name === "productCategory" && e.target.value.trim() !== "") {
      setProductCategoryError("");
    }

    if (
      e.target.name === "productCategoryTShirtSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryTShirtError("");
    }

    if (
      e.target.name === "productCategoryAdidasSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryAdidasError("");
    }

    if (
      e.target.name === "productCategoryPantsSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryPantsError("");
    }
    if (
      e.target.name === "productCategoryBikeSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryBikeSizeError("");
    }
    if (
      e.target.name === "productDescription" &&
      e.target.value.trim() !== ""
    ) {
      setProductDescriptionError("");
    }
    if (e.target.name === "productQuantity" && e.target.value.trim() !== "") {
      setProductQuantityError("");
    }
    if (e.target.name === "productPrice" && e.target.value.trim() !== "") {
      setProductPriceError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (productName.length === 0) {
        setProductNameError("Product Name field can not be empty");
        return;
      }
      if (productCategory.length === 0) {
        setProductCategoryError("Product Name field can not be empty");
        return;
      }
      if (
        productCategory === "adidas" &&
        productCategoryAdidasSize.length === 0
      ) {
        setProductCategoryAdidasError("You must select a size");
        return;
      }
      if (
        productCategory === "pantaloni" &&
        productCategoryPantsSize.length === 0
      ) {
        setProductCategoryPantsError("You must select a size");
        return;
      }
      if (
        productCategory === "tricou" &&
        productCategoryTShirtSize.length === 0
      ) {
        setProductCategoryTShirtError("You must select a size");
        return;
      }

      if (
        productCategory === "bicicleta" &&
        productCategoryBikeSize.length === 0
      ) {
        setProductCategoryBikeSizeError("You must select a size");
        return;
      }
      if (productDescription.length === 0) {
        setProductDescriptionError(
          "Product Description field can not be empty"
        );
        return;
      }
      if (productPrice.length === 0) {
        setProductPriceError("Product Price field can not be empty");
        return;
      }
      if (productPrice <= 0) {
        setProductPriceError("Product Price field can not be less than 1.");
        return;
      }
      if (productQuantity.length === 0) {
        setProductQuantityError("Product Quantity field can not be empty");
        return;
      }
      if (productQuantity <= 0) {
        setProductQuantityError(
          "Product Quantity field can not be less than 1."
        );
        return;
      }

      await axios.post("http://localhost:8080/productEdit", product);
      navigate("/loginadmin");
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const backtoAdmin = () => {
    navigate("/loginadmin");
  };

  return (
    <div>
      <h2 className="my-5 text-center"> Edit the product! </h2>
      <div className="">
        <form
          onSubmit={(e) => onSubmit(e)}
          className="d-flex flex-column w-50 mx-auto"
          style={{
            alignItems: "center",
            border: "solid 2px black",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <label
            htmlFor="productName"
            className="mb-1 fs-5"
            style={{ marginTop: "15px" }}
          >
            Product Name
          </label>
          <input
            style={{ width: "50%" }}
            type="text"
            className="mb-4 form-control w-15"
            placeholder="Enter the product name"
            name="productName"
            value={productName}
            onChange={(e) => onInputChange(e)}
          />
          {productNameError && (
            <div className="text-danger">{productNameError}</div>
          )}
          <label htmlFor="productCategory" className="mb-1 fs-5">
            Product Category
          </label>
          <select
            style={{ width: "50%" }}
            className="mb-4 form-select w-15"
            name="productCategory"
            value={productCategory}
            onChange={(e) => onInputChange(e)}
          >
            <option value="">Select a category</option>
            <option value="tricou">Tricou</option>
            <option value="bicicleta">Bicicleta</option>
            <option value="adidas">Adidas</option>
            <option value="pantaloni">Pantaloni</option>
          </select>
          {productCategoryError && (
            <div className="text-danger">{productCategoryError}</div>
          )}

          {productCategory === "tricou" && (
            <>
              <label htmlFor="productCategoryTShirtSize" className="mb-1 fs-5">
                TShirt Size
              </label>
              <select
                style={{ width: "50%" }}
                className="mb-4 form-select w-15"
                name="productCategoryTShirtSize"
                value={productCategoryTShirtSize}
                onChange={(e) => onInputChange(e)}
              >
                <option value="">Select a size</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="M L">M L</option>
                <option value="M XL">M XL</option>
                <option value="M XXL">M XXL</option>
                <option value="L XL">L XL</option>
                <option value="L XXL">L XXL</option>
                <option value="XL XXL">XL XXL</option>
                <option value="M L XL">M L XL</option>
                <option value="M L XXL">M L XXL</option>
                <option value="M XL XXL">M XL XXL</option>
                <option value="L XL XXL">L XL XXL</option>
                <option value="M L XL XXL">M L XL XXL</option>
              </select>
              {productCategoryTShirtError && (
                <div className="text-danger">{productCategoryTShirtError}</div>
              )}
            </>
          )}

          {productCategory === "bicicleta" && (
            <>
              <label htmlFor="productCategoryBikeSize" className="mb-1 fs-5">
                Bike Size
              </label>
              <select
                style={{ width: "50%" }}
                className="mb-4 form-select w-15"
                name="productCategoryBikeSize"
                value={productCategoryBikeSize}
                onChange={(e) => onInputChange(e)}
              >
                <option value="">Select a size</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="M L">M L</option>
                <option value="M XL">M XL</option>
                <option value="M XXL">M XXL</option>
                <option value="L XL">L XL</option>
                <option value="L XXL">L XXL</option>
                <option value="XL XXL">XL XXL</option>
                <option value="M L XL">M L XL</option>
                <option value="M L XXL">M L XXL</option>
                <option value="M XL XXL">M XL XXL</option>
                <option value="L XL XXL">L XL XXL</option>
                <option value="M L XL XXL">M L XL XXL</option>
              </select>
              {productCategoryBikeSizeError && (
                <div className="text-danger">
                  {productCategoryBikeSizeError}
                </div>
              )}
            </>
          )}

          {productCategory === "adidas" && (
            <>
              <label htmlFor="productCategoryAdidasSize" className="mb-1 fs-5">
                Adidas Size
              </label>
              <select
                style={{ width: "50%" }}
                className="mb-4 form-select w-15"
                name="productCategoryAdidasSize"
                value={productCategoryAdidasSize}
                onChange={(e) => onInputChange(e)}
              >
                <option value="">Select a size</option>
                {generateSizeAdidasOptions()}{" "}
                {/* Dynamically generated size options */}
              </select>
              {productCategoryAdidasError && (
                <div className="text-danger">{productCategoryAdidasError}</div>
              )}
            </>
          )}

          {productCategory === "pantaloni" && (
            <>
              <label htmlFor="productCategoryPantsSize" className="mb-1 fs-5">
                Pants Size
              </label>
              <select
                style={{ width: "50%" }}
                className="mb-4 form-select w-15"
                name="productCategoryPantsSize"
                value={productCategoryPantsSize}
                onChange={(e) => onInputChange(e)}
              >
                <option value="">Select a size</option>
                {generateSizePantsOptions()}{" "}
                {/* Dynamically generated size options */}
              </select>
              {productCategoryPantsError && (
                <div className="text-danger">{productCategoryPantsError}</div>
              )}
            </>
          )}

          <label htmlFor="productDescription" className="mb-1 fs-5">
            Description
          </label>
          <input
            style={{ width: "50%" }}
            type="text"
            className="mb-4 form-control w-15"
            placeholder="Enter the product description"
            name="productDescription"
            value={productDescription}
            onChange={(e) => onInputChange(e)}
          />
          {productDescriptionError && (
            <div className="text-danger">{productDescriptionError}</div>
          )}
          <label htmlFor="productPrice" className="mb-1 fs-5">
            Price
          </label>
          <input
            style={{ width: "50%" }}
            type="number"
            className="mb-4 form-control w-15"
            placeholder="Enter the product price"
            name="productPrice"
            value={productPrice}
            onChange={(e) => onInputChange(e)}
          />
          {productPriceError && (
            <div className="text-danger">{productPriceError}</div>
          )}
          <label htmlFor="productQuantity" className="mb-1 fs-5">
            Quantity
          </label>
          <input
            style={{ width: "50%" }}
            type="number"
            className="mb-4 form-control w-15"
            placeholder="Enter the product quantity"
            name="productQuantity"
            value={productQuantity}
            onChange={(e) => onInputChange(e)}
          />
          {productQuantityError && (
            <div className="text-danger">{productQuantityError}</div>
          )}
          <label htmlFor="currentImage" className="mb-1 fs-5">
            Image for product
          </label>
          <img
            src={imageFile}
            alt="Product"
            style={{
              height: "300px",
              width: "300px",
              marginTop: "15px",
              marginBottom: "35px",
            }}
          />

          <button
            onClick={backtoAdmin}
            className="btn btn-primary btn-half mx-auto d-block"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-half mx-auto d-block"
          >
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
