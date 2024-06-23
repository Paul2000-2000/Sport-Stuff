import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductsFromOrderAdmin = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { orderId , userId } = useParams();
  const navigate = useNavigate();

  console.log(orderId);
  console.log(userId);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await axios.get(
            `http://localhost:8080/getClientProducts/Order/${orderId}/${userId}`
        );
        setProducts(response.data);
        
      } catch (error) {
        setError('Error fetching products');
        
      }
    };

    fetchProducts();
  }, [orderId , userId]);


  const handleBackToOrders = () => {
    navigate(`/shoppinghistoryadmin/${userId}`);
  }


  return (
    <div className="d-flex flex-column">
      <h2 className="my-5 text-center">Products from Order {orderId}</h2>
      <div  style={{ marginLeft: "13%", marginRight: "13%"}}>
      {products.length === 0 ? (
          <h2 className="text-center" style={{color:"red"}}>There are no orders.</h2>
      ) : (
      <ul className="d-flex flex-wrap align-items-center justify-content-around"
            style={{ height: "100%" }}>
        {products.map((product) => (
          <li key={product.productId}
          className="flex-basis-25 mb-4"
                style={{ width: "22%" , border:"solid 2px black" , borderRadius:"15px " , marginRight:"2%" , display:"flex" , flexDirection:"column" , justifyContent:"center" , alignItems:"center"}}>
            
            <p>
                  
                  <img
                    src={product.productImage}
                    style={{ width: "175px", height: "175px" , marginTop:"25px"}}
                    alt="productimage"
                  />
            </p>
            <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ${product.productPrice}</p>
                <p>Quantity: {product.productQuantity}</p>
            
          </li>
        ))}
      </ul>
      )}
            <button
             className="btn btn-primary btn-half mx-auto d-block"
             style={{ marginBottom: "20px" , width:"30%" }}
             onClick={handleBackToOrders}
             >
                Back to Orders
            </button>

      </div>
    </div>
  );
};

export default ProductsFromOrderAdmin;
