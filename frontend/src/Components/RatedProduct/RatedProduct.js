import React from "react";
import "./ratedproduct_styles.css";

const RatedProduct = ({
  product,
  feedbacks,
  handleBuyProduct,
  handleViewProduct,
}) => {
  return (
    <div
      className="flex-basis-25 mb-4 rated-product-container"
      onClick={() => handleViewProduct(product.productFeedbackProductId)}
    >
      <p>
        <img
          src={product.productImage}
          className="product-image"
          alt="productimage"
        />
      </p>
      <h3 className="product-namer">{product.productName}</h3>

      {feedbacks.some(
        (feedback) =>
          feedback.productFeedbackProductId === product.productFeedbackProductId
      ) && (
        <p>
          Rating:{" "}
          {
            feedbacks.find(
              (feedback) =>
                feedback.productFeedbackProductId ===
                product.productFeedbackProductId
            ).productFeedbackRating
          }
        </p>
      )}
      <button
        onClick={(event) =>
          handleBuyProduct(event, product.productFeedbackProductId)
        }
        className="btn btn-primary btn-half mx-auto d-block button-buy"
      >
        Buy {product.productPrice}$
      </button>
    </div>
  );
};

export default RatedProduct;
