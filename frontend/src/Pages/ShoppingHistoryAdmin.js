import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShoppingHistoryAdmin = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [noHistoryMessage, setNoHistoryMessage] = useState();
  const { userId } = useParams();

  console.log(userId);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/CheckoutPurchaseForOneUserFromAdmin/${userId}` // Include userId in the URL
        );
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (orders.length === 0) {
      setNoHistoryMessage("You haven't placed any orders yet.");
    } else {
      setNoHistoryMessage("");
    }
  }, [orders]);

  const handleViewProductsFromOrder = (orderId, userId) => {
    navigate(`/productsfromorder/${orderId}/${userId}`);
  };

  const handleBackToProductPage = () => {
    navigate("/viewclients");
  };

  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">Here are the orders.</h2>

      <div style={{ marginLeft: "20%", marginRight: "20%" }}>
        {orders.length === 0 ? (
          <h1
            className="text-center"
            style={{
              color: "black",
              marginTop: "150px",
              marginBottom: "200px",
            }}
          >
            {noHistoryMessage}
          </h1>
        ) : (
          <div
            className="d-flex flex-wrap align-items-center justify-content-around"
            style={{ gap: "35px" }}
          >
            {orders.map((order, index) => (
              <button
                key={order.orderId || index} // Use orderId if available, otherwise use index
                className="btn btn-primary btn-half mx-auto d-block"
                style={{ marginBottom: "20px", width: "20%" }}
                onClick={() => handleViewProductsFromOrder(index + 1, userId)}
              >
                Order {index + 1}
              </button>
            ))}
          </div>
        )}
        <div className="buttons">
          <button
            onClick={handleBackToProductPage}
            className="btn btn-primary btn-half mx-auto d-block"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingHistoryAdmin;
