import React from "react";
import "./product_styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MdOutlineDifference } from "react-icons/md";

function Product({
  product,
  handleViewProduct,
  handleAddToCompare,
  handleAddToWishList,
  handleBuyProduct,
  feedbacks,
}) {
  return (
    <div
      className="flex-basis-25 mb-4 product-container"
      onClick={() => handleViewProduct(product.productId)}
    >
      <div className="product-content">
        <button
          onClick={(event) => handleAddToCompare(event, product.productId)}
          className="btn btn-primary btn-half mx-auto d-block button-compare"
        >
          <MdOutlineDifference style={{ width: "25px", height: "25px" }} />
        </button>

        <button
          onClick={(event) => handleAddToWishList(event, product.productId)}
          className="btn btn-primary btn-half mx-auto d-block button-wishlist"
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>

      <div className="product-image-container">
        <img
          src={product.productImage}
          className="product-image"
          alt="productimage"
        />
      </div>

      <div className="product-details">
        <h5 className="product-name">{product.productName}</h5>
      </div>

      {feedbacks.some(
        (feedback) => feedback.productFeedbackProductId === product.productId
      ) ? (
        <p>
          Rating:{" "}
          {
            feedbacks.find(
              (feedback) =>
                feedback.productFeedbackProductId === product.productId
            ).productFeedbackRating
          }
        </p>
      ) : (
        <p>This product has no rating yet.</p>
      )}

      <button
        onClick={(event) => handleBuyProduct(event, product.productId)}
        className="btn btn-primary btn-half mx-auto d-block button-buy"
      >
        Buy {product.productPrice}$
      </button>
    </div>
  );
}

export default Product;
