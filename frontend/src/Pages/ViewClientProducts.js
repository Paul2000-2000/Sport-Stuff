import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';



const ViewClientProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [noHistoryMessage, setNoHistoryMessage] = useState();
    const { userId } = useParams();

    console.log(userId);
  
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/getClientProducts/${userId}`);
            setProducts(response.data);
          } catch (error) {
            console.error("Error fetching products:", error); // Log the entire error object for more information
            // Handle the error gracefully, e.g., display a friendly error message to the user
          }
        };
      
        fetchProducts();
      }, []);
  
    useEffect(() => {
      if (products.length === 0) {
        setNoHistoryMessage("There are no products bought by this client!");
      } else {
        setNoHistoryMessage("");
      }
    }, [products]);
  
    const backtoProductPage = () => {
      navigate("/viewclients");
    };
  
    return (
      <div className="d-flex flex-column">
        <h2 className="my-5 text-center">
          Here are the products bought!
        </h2>
  
        <div style={{ marginLeft: "13%", marginRight: "13%" }}>
          {products.length === 0 ? (
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
            <ul
              className="d-flex flex-wrap align-items-center justify-content-around "
              style={{ height: "100%" }}
            >
              {products.map((product) => (
                <li
                  key={product.productId}
                  className="flex-basis-25 mb-4"
                  style={{ width: "25%" }}
                >
                  <h3>{product.productName}</h3>
                  <p>{product.productDescription}</p>
                  <p>Price: ${product.productPrice}</p>
                  <p>Quantity: {product.productQuantity}</p>
                  <p>
                    Image:{" "}
                    <img
                      src={product.productImage}
                      style={{ width: "50px", height: "50px" }}
                      alt="productimage"
                    />
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="buttons">
            <button
              onClick={backtoProductPage}
              className="btn btn-primary btn-half mx-auto d-block"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
}

export default ViewClientProducts
