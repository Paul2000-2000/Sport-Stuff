import React from "react";
import "./ProductAdmin_styles.css";

const ProductAdmin = ({
  handleViewProduct,
  handleEdit,
  handleDelete,
  product,
  feedbacks,
}) => {
  return (
    <li
      key={product.productId}
      className="product-itemad"
      onClick={() => handleViewProduct(product.productId)}
    >
      <p>
        <img
          src={product.productImage}
          className="product-image"
          alt="productimage"
        />
      </p>
      <h3 className="product-namead">{product.productName}</h3>

      <p>Price: ${product.productPrice}</p>
      <p>Quantity: {product.productQuantity}</p>
      {feedbacks.some(
        (feedback) => feedback.productFeedbackProductId === product.productId
      ) && (
        <p>
          Rating:{" "}
          {
            feedbacks.find(
              (feedback) =>
                feedback.productFeedbackProductId === product.productId
            ).productFeedbackRating
          }
        </p>
      )}
      <button
        onClick={(event) => handleEdit(event, product.productId)}
        className="btn btn-primary btn-half mx-auto d-block"
      >
        Edit
      </button>
      <button
        onClick={(event) => handleDelete(event, product.productId)}
        className="btn btn-primary btn-half mx-auto d-block"
      >
        Delete
      </button>
    </li>
  );
};

export default ProductAdmin;
