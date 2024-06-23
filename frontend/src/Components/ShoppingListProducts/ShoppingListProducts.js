import React from "react";
import "./shoppinglistproducts_styles.css";

const ShoppingListProducts = ({ product, handleRemoveProduct }) => {
  return (
    <div className="product-items">
      <p>
        <img
          src={product.productImage}
          className="product-image"
          alt="productimage"
        />
      </p>
      <h3>{product.productName}</h3>
      <p>{product.productDescription}</p>
      <p>Price: ${product.productPrice}</p>
      <p>Quantity: {product.productQuantity}</p>

      <button
        onClick={() => handleRemoveProduct(product.productId)}
        className="btn btn-primary btn-half remove-button"
      >
        Remove
      </button>
    </div>
  );
};

export default ShoppingListProducts;
