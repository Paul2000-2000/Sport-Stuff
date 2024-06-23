import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";





const ViewClients = () => {



    

    const [users, setUsers]  = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    
        const fetchUsers = async () => {
          try {
            const response = await axios.get("http://localhost:8080/getAllClients");
            console.log("API Response:", response.data); // Log the API response
            setUsers(response.data);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchUsers();
      }, []);


      const handleViewProducts = (userId) => {
        navigate(`/shoppinghistoryadmin/${userId}`);
        console.log(userId);
      };

      const handleBackToProductPage = () => {
        navigate("/loginadmin");
      };

  return (
    
    <div className="d-flex flex-column">
    <h2 className="my-5 text-center"> Here are the Clients! </h2>

    <ul
              className="d-flex flex-wrap align-items-center justify-content-around "
              style={{ height: "100%" }}
            >
              {users.map((user) => (
                <li
                  key={user.userId}
                  className="flex-basis-25 mb-4"
                  style={{
                    width: "22%",
                    border: "solid 2px black",
                    borderRadius: "15px ",
                    marginRight: "2%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>
                    {user.email}
                  </p>
                  <p>{user.firstname}</p>
                  <p>
                    {user.lastname}
                  </p>
                  <p>{user.username}</p>
                  <p>{user.password.length > 10 ? user.password.substring(0, 10) + '...' : user.password}</p>
                  <button
                  className="btn btn-primary btn-half mx-auto d-block"
                  style={{width:"50%", marginBottom:"50px" }}
                  onClick={() => handleViewProducts(user.id)}
                  >
                    View Orders 
                  </button>
               
                </li>
              ))}
            </ul>
            <button
            onClick={handleBackToProductPage}
            className="btn btn-primary btn-half mx-auto d-block"
            style={{width:"30%"}}
          >
            Back
          </button>

    </div>


  )
}

export default ViewClients
