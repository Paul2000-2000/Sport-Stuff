import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { MdOutlineDifference } from "react-icons/md";
import Modal from "react-modal";

Modal.setAppElement(document.body);

const AccountMenuClient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store the user data
  const [purchaseCount, setPurchaseCount] = useState(0); // State to store the number of purchases
  const [wishlistCount, setWishlistCount] = useState(0); // State to store the number of purchases
  const [comparelistCount, setComparelistCount] = useState(0); // State to store the number of purchases
  const [modalIsOpen, setIsOpen] = useState(false);
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

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleShoppingList = () => {
    navigate(`/shoppinglistclient/${userId}`);
  };

  const handleShoppingHistory = () => {
    navigate(`/shoppinghistoryclient/${userId}`);
  };

  const handleWishList = () => {
    navigate(`/wishlist/${userId}`);
  };

  const handleCompareProducts = () => {
    navigate(`/compareproducts/${userId}`);
  };

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
        setUserId(response.data.id); // Assuming your User model has an id property
        console.log("User Id" + userId);
      } catch (error) {
        console.error("Error fetching userID:", error.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/getUser", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    const fetchPurchaseCount = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/PurchaseForOneUserNumber",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPurchaseCount(response.data);
      } catch (error) {
        console.error("Error fetching purchase count:", error.message);
      }
    };

    const fetchWishlistCount = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/WishListForOneUserNumber",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setWishlistCount(response.data);
      } catch (error) {
        console.error("Error fetching purchase count:", error.message);
      }
    };

    const fetchComparelistCount = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/CompareListForOneUserNumber",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setComparelistCount(response.data);
      } catch (error) {
        console.error("Error fetching purchase count:", error.message);
      }
    };

    fetchUserData();
    fetchPurchaseCount();
    fetchWishlistCount();
    fetchComparelistCount();
    fetchUserID();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {
    //subtitle.style.color = "#f00";
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: "50px",
        marginLeft: "20%",
        marginRight: "20%",
        cursor: "pointer",
      }}
    >
      <div
        style={{ marginRight: "50px", cursor: "pointer" }}
        onClick={handleCompareProducts}
      >
        {" "}
        <MdOutlineDifference style={{ width: "25px", height: "25px" }} /> (
        {comparelistCount})
      </div>

      <div
        style={{ marginRight: "50px", cursor: "pointer" }}
        onClick={handleShoppingList}
      >
        <RiShoppingCartLine style={{ width: "25px", height: "25px" }} /> (
        {purchaseCount})
      </div>
      <div
        style={{ marginRight: "50px", cursor: "pointer" }}
        onClick={handleWishList}
      >
        <MdFavoriteBorder style={{ width: "25px", height: "25px" }} /> (
        {wishlistCount})
      </div>

      <div>
        <div onClick={openModal}>
          <RiAccountPinCircleFill style={{ width: "25px", height: "25px" }} />
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              width: "200px",
              height: "175px",

              borderRadius: "8px",

              top: "50px",
              right: "190px",
              left: "auto",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          contentLabel="Account Modal"
        >
          <div>
            <div
              className="user-account-container"
              style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <div style={{ marginBottom: "10px" }}>
                <RiAccountPinCircleFill
                  style={{ width: "35px", height: "35px", color: "#3264B3" }}
                />
              </div>
              <span style={{ fontSize: "18px", paddingBottom: "4px" }}>
                {user && user.username}
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                style={{
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#3264B3",
                  color: "white",
                }}
                onClick={handleShoppingHistory}
              >
                Shopping History
              </button>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "#3264B3",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  fontSize: "16px",
                  marginTop: "10px",
                }}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>

            {/* <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button onClick={closeModal}>Close</button>
            </div> */}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AccountMenuClient;
