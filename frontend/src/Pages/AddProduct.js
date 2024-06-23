import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
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

  const {
    productName,
    productDescription,
    productPrice,
    productQuantity,
    productCategory,
    productCategoryTShirtSize,
    productCategoryAdidasSize,
    productCategoryPantsSize,
    productCategoryBikeSize,
    imageFile,
  } = product;

  const [productNameError, setProductNameError] = useState(null);
  const [productDescriptionError, setProductDescriptionError] = useState(null);
  const [productQuantityError, setProductQuantityError] = useState(null);
  const [productPriceError, setProductPriceError] = useState(null);
  const [productCategoryError, setProductCategoryError] = useState(null);
  const [productCategoryTShirtSizeError, setProductCategoryTShirtSizeError] =
    useState(null);
  const [productCategoryBikeSizeError, setProductCategoryBikeSizeError] =
    useState(null);
  const [productCategoryAdidasSizeError, setProductCategoryAdidasSizeError] =
    useState(null);
  const [productCategoryPantsSizeError, setProductCategoryPantsSizeError] =
    useState(null);
  const [productImageError, setProductImageError] = useState(null);
  const navigate = useNavigate();

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
      setProductCategoryTShirtSizeError("");
    }
    if (
      e.target.name === "productCategoryAdidasSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryAdidasSizeError("");
    }
    if (
      e.target.name === "productCategoryPantsSize" &&
      e.target.value.trim() !== ""
    ) {
      setProductCategoryPantsSizeError("");
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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (productName.length === 0) {
        setProductNameError("Product Name field can not be empty.");
        return;
      } else if (productCategory.length === 0) {
        setProductCategoryError("Product Category must be selected.");
        return;
      }

      if (
        productCategory === "adidas" &&
        productCategoryAdidasSize.length === 0
      ) {
        setProductCategoryAdidasSizeError("You must select a size");
        return;
      }
      if (
        productCategory === "pantaloni" &&
        productCategoryPantsSize.length === 0
      ) {
        setProductCategoryPantsSizeError("You must select a size");
        return;
      }
      if (
        productCategory === "tricou" &&
        productCategoryTShirtSize.length === 0
      ) {
        setProductCategoryTShirtSizeError("You must select a size");
        return;
      }

      if (
        productCategory === "bicicleta" &&
        productCategoryBikeSize.length === 0
      ) {
        setProductCategoryBikeSizeError("You must select a size");
        return;
      } else if (productDescription.length === 0) {
        setProductDescriptionError(
          "Product Description field can not be empty."
        );
        return;
      } else if (productPrice.length === 0) {
        setProductPriceError("Product Price field can not be empty.");
        return;
      } else if (productPrice <= 0) {
        setProductPriceError("Product Price field can not be less than 1.");
        return;
      } else if (productQuantity.length === 0) {
        setProductQuantityError("Product Quantity field can not be empty.");
        return;
      } else if (productQuantity <= 0) {
        setProductQuantityError(
          "Product Quantity field can not be less than 1."
        );
        return;
      } else if (!product.imageFile) {
        setProductImageError("Please attach an image.");
        return;
      }

      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("productCategory", product.productCategory);
      formData.append(
        "productCategoryTShirtSize",
        product.productCategoryTShirtSize
      );
      formData.append(
        "productCategoryAdidasSize",
        product.productCategoryAdidasSize
      );
      formData.append(
        "productCategoryPantsSize",
        product.productCategoryPantsSize
      );
      formData.append(
        "productCategoryBikeSize",
        product.productCategoryBikeSize
      );
      formData.append("productDescription", product.productDescription);
      formData.append("productPrice", product.productPrice);
      formData.append("productQuantity", product.productQuantity);
      formData.append("imageFile", product.imageFile);

      console.log("Form data before submission:", product);
      console.log("Form data after appending file:", formData);
      console.log(formData.get("productCategoryPantsSize"));

      const cloudinaryResponse = await axios.post(
        "http://localhost:8080/cloudinary/upload",
        formData
      );

      console.log("Post request successful to cloudinary");
      console.log(cloudinaryResponse);
      console.log(cloudinaryResponse.data);

      const productDataWithImage = {
        ...product,
        productImage: cloudinaryResponse.data,
      };

      console.log(productDataWithImage);
      await axios.post(
        "http://localhost:8080/productAdd",
        productDataWithImage
      );

      navigate("/loginadmin");
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageError(null);
      setProduct((prevProd) => ({ ...prevProd, imageFile: file }));
    } else {
      setProductImageError("Please attach an image.");
    }
  };

  const backtoAdmin = () => {
    navigate("/loginadmin");
  };

  return (
    <div>
      <h2 className="my-5 text-center"> Add the product! </h2>
      <div className="">
        <form
          onSubmit={(e) => onSubmit(e)}
          className="d-flex flex-column w-50 mx-auto"
          style={{
            border: "solid 1px black",
            borderRadius: "15px",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <label
            htmlFor="productName"
            className="mb-1 fs-5"
            style={{ marginTop: "25px" }}
          >
            Product Name
          </label>
          <input
            type="text"
            className="mb-4 form-control w-15"
            placeholder="Enter the product name"
            name="productName"
            style={{ width: "50%" }}
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
              {productCategoryTShirtSizeError && (
                <div className="text-danger">
                  {productCategoryTShirtSizeError}
                </div>
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
              {productCategoryAdidasSizeError && (
                <div className="text-danger">
                  {productCategoryAdidasSizeError}
                </div>
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
              {productCategoryPantsSizeError && (
                <div className="text-danger">
                  {productCategoryPantsSizeError}
                </div>
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
          <label htmlFor="imagefile" className="mb-1 fs-5">
            Image
          </label>
          <input
            style={{ width: "50%" }}
            type="file"
            className="mb-4 form-control w-15"
            name="imageFile"
            onChange={(e) => onFileChange(e)}
          />
          {productImageError && (
            <div className="text-danger">{productImageError}</div>
          )}
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
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
