import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShoppingHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [noHistoryMessage, setNoHistoryMessage] = useState();
  const [userId, setUserId] = useState(() => {
    // Retrieve userId from localStorage if it exists
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const authToken = localStorage.getItem("token");
        console.log(authToken);
        const response = await axios.get("http://localhost:8080/getUser", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const newUserId = response.data.id;
        setUserId(newUserId); // Update userId state
        localStorage.setItem("userId", newUserId); // Store userId in localStorage
        console.log("User Id from response data " + newUserId);
        console.log("User Id from set " + userId);
      } catch (error) {
        console.error("Error fetching userID:", error.message);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/CheckoutPurchaseForOneUser",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) {
      setNoHistoryMessage("You haven't placed any orders yet.");
    } else {
      setNoHistoryMessage("");
    }
  }, [orders]);

  const handleViewProductsFromOrder = (orderId) => {
    navigate(`/productsfromorder/${orderId}`);
  };

  const handleBackToProductPage = () => {
    navigate(`/afterlogin/${userId}`);
  };

  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">Here are your orders.</h2>

      <div style={{ marginLeft: "13%", marginRight: "13%" }}>
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
            style={{ gap: "15px" }}
          >
            {orders.map((order, index) => (
              <button
                key={order.orderId || index} // Use orderId if available, otherwise use index
                className="btn btn-primary btn-half mx-auto d-block"
                style={{ marginBottom: "20px", width: "20%" }}
                onClick={() => handleViewProductsFromOrder(index + 1)}
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

export default ShoppingHistory;
