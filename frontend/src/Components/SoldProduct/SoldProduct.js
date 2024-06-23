import React from "react";
import "./soldproduct_styles.css";

const SoldProduct = ({ product, handleViewProduct, handleBuyProduct }) => {
  return (
    <li
      className="flex-basis-25 mb-4 sold-product-container"
      onClick={() => handleViewProduct(product.productId)}
    >
      <p>
        <img
          src={product.productImage}
          className="product-images"
          alt="productimage"
        />
      </p>
      <h3 className="product-namesold ">{product.productName}</h3>

      <button
        onClick={(event) => handleBuyProduct(event, product.productId)}
        className="btn btn-primary btn-half mx-auto d-block button-buy"
      >
        Buy {product.productPrice}$
      </button>
    </li>
  );
};

export default SoldProduct;
