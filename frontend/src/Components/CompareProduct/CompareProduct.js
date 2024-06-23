import React from "react";
import "./compareproduct_styles.css";

const CompareProduct = ({ product, handleRemoveProduct }) => {
  return (
    <li className="product-itemc">
      <p>
        <img
          src={product.productImage}
          className="product-image"
          alt="productimage"
        />
      </p>
      <div className="product-details">
        <h3>{product.productName}</h3>
        <p>{product.productDescription}</p>
        <p>Price: ${product.productPrice}</p>

        {product.productCategory === "adidas" ? (
          <div className="product-size">
            <label htmlFor="productCategoryAdidasSize" className="size-label">
              Size:
            </label>
            <div className="size-value">
              {product.productCategoryAdidasSize}
            </div>
          </div>
        ) : product.productCategory === "pantaloni" ? (
          <div className="product-size">
            <label htmlFor="productCategoryPantsSize" className="size-label">
              Size:
            </label>
            <div className="size-value">{product.productCategoryPantsSize}</div>
          </div>
        ) : product.productCategory === "tricou" ? (
          <div className="product-size">
            <label htmlFor="productCategoryTShirtSize" className="size-label">
              Size:
            </label>
            <div className="size-value">
              {product.productCategoryTShirtSize}
            </div>
          </div>
        ) : null}
      </div>

      <button
        onClick={() => handleRemoveProduct(product.productId)}
        className="btn btn-primary btn-half remove-button"
      >
        Remove
      </button>
    </li>
  );
};

export default CompareProduct;
