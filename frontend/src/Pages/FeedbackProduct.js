import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FeedbackProduct = () => {

    const [error, setError] = useState(null);
    const [feedBackRatingError , setFeedBackRatingError] = useState(null);
    const [feedBackMessageError , setFeedBackMessageError] = useState(null);
    const [userId, setUserId] = useState(() => {
      // Retrieve userId from localStorage if it exists
      return localStorage.getItem("userId") || null;
    });
    const [feedback, setFeedBack] = useState({
        productFeedbackRating:"",
        productFeedbackMessage:"",
        productFeedbackProductId:"",
        productName: "", 
        productDescription: "", 
        productPrice: "", 
        productQuantity: "", 
    });
    const [product, setProduct] = useState({
        productName: "",
        productDescription: "",
        productPrice: "",
        productQuantity: "",
        productCategory:"",
        productCategoryTShirtSize:"",
        productCategoryAdidasSize:"",
        productCategoryPantsSize:"",
        imageFile: null,
      });
      const { productId } = useParams();
      const { orderId } = useParams();
       const navigate = useNavigate();

      console.log("productId from userParam",productId);

      useEffect(() => {
        const fetchUserID = async () => {
          try {
            const authToken = localStorage.getItem("token");
            console.log(authToken);
            const response = await axios.get(
              "http://localhost:8080/getUser",
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
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
        const fetchProduct = async () => {

          const authToken = localStorage.getItem("token");
          console.log(authToken);
          if (!authToken) {
            navigate("/login");
            return;
          }

          try {
            const response = await axios.get(
              `http://localhost:8080/productCheckout/${productId}`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`
                 
                }
              }
            );
            const data = response.data;
            console.log("Data:",data);
            console.log("ProdutId: ",productId);
    
            // Assuming your API returns a single product
            setProduct({
              productName: data.productName || "",
              productCategory: data.productCategory || "",
              productCategoryTShirtSize:data.productCategoryTShirtSize ||"",
              productCategoryAdidasSize:data.productCategoryAdidasSize ||"",
              productCategoryPantsSize:data.productCategoryPantsSize || "",
              productDescription: data.productDescription || "",
              productPrice: data.productPrice || "",
              productQuantity: data.productQuantity || "",
              productImage: data.productImage || null,
            });

           
    
            console.log(data.productCategory);
            console.log(data.productName);
            console.log(data.productDescription);
            console.log(data.productImage);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        };
    
        fetchProduct();
      }, [productId]);


      const {
        productName,
        productCategory,
        productCategoryTShirtSize,
        productCategoryAdidasSize,
        productCategoryPantsSize,
        productDescription,
        productPrice,
        productQuantity,
        productImage,
      } = product;

      const {
        productFeedbackRating,
        productFeedbackMessage
    
      } = feedback;

      const onInputChange = (e) => {
        setFeedBack((prevFeedback) => ({
          ...prevFeedback,
          [e.target.name]: e.target.value,
        }));
    
        if (e.target.name === "productFeedbackRating" && e.target.value.trim() !== "") {
          setFeedBackRatingError("");
        }
        if (e.target.name === "productFeedbackMessage" && e.target.value.trim() !== "") {
          setFeedBackRatingError("");
        }
        
      };

      const onSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const authToken = localStorage.getItem("token");
          console.log(authToken);
          if (!authToken) {
            navigate("/login");
            return;
          }

          if (feedback.productFeedbackRating.length === 0)
            {
              setFeedBackRatingError("This field can't be null");
              return;
            }

            if (feedback.productFeedbackRating< 0 || feedback.productFeedbackRating >5) 
            {
              setFeedBackRatingError("This field must be between 0 and 5");
              return;
            } 

            if (feedback.productFeedbackMessage.length === 0)
            {
              setFeedBackMessageError("This field can't be null");
              return;
            }

          
          const payload = {
            productFeedbackRating,
            productFeedbackMessage,
            productFeedbackProductId: productId,
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productImage
          };


          console.log(payload);
          console.log(payload.productDescription);
          console.log(payload.productName);
          console.log(payload.productImage);
      
          await axios.post("http://localhost:8080/productFeedBack", payload, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });


          navigate(`/afterlogin/${userId}`);
        } catch (error) {
          console.error("Error giving feedback for product:", error);
    
          if (error.response && error.response.status === 400) {
            
            console.log("Server error response:", error.response.data);
    
            if (error.response.data === "Authentication error") {
              setError("Authentication error. Please log in.");
            } else {
              setError("Can't set feedback");
            }
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        }
      };
    
      const backtoAdmin = () => {
        navigate(`/shoppinghistoryclient/${userId}`);
      };

      return (
        <div>
          <h2 className="my-5 text-center"> Feedback for product! </h2>
          <div className="">
            <form
              onSubmit={(e) => onSubmit(e)}
              className="d-flex flex-column w-50 mx-auto"
              style={{border:"solid 2px black" , borderRadius:"15px" , width:"55%" , boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)"}}
            >
    
    
              <div style={{display:"flex"}}>
              <div style={{width:"50%",paddingLeft:"30px" , marginTop:"15px"}}>
    
              <img
                src={productImage}
                alt="Product"
                style={{ height: "100%%", width: "100%" }}
              />
              </div>
              <div style={{display:"flex" , flexDirection:'column' , alignItems:"flex-start" ,justifyContent:"center", width:"50%" , marginLeft:"100px"}}>
                <div style={{display:"flex"}}>
              <label htmlFor="productName" className="mb-1 fs-5">
                Name:
              </label>
              <div className="mb-4 form-control w-15"  style={{marginLeft:"15px"}}>{productName}</div>
              </div>
              <div style={{display:"flex"}}>
              <label htmlFor="productDescription" className="mb-1 fs-5">
                Description:
              </label>
              <div className="mb-4 form-control w-15" style={{marginLeft:"15px"}}>{productDescription}</div>
              </div>
              <div style={{display:"flex"}}>
              <label htmlFor="productPrice" className="mb-1 fs-5">
                Price:
              </label>
              <div className="mb-4 form-control w-15"  style={{marginLeft:"15px"}}>{productPrice}</div>
              </div>
              <div style={{display:"flex"}}>
              <label htmlFor="productQuantity" className="mb-1 fs-5">
                Quantity:
              </label>
              <div className="mb-4 form-control w-15"  style={{marginLeft:"15px"}}>{productQuantity}</div>
              </div>
              </div>
              </div>
              
              {error && (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
              )}
              <div>
                <h2 style={{textAlign:"center", marginTop:"25px", marginBottom:"25px"}}>Give us your feedback!</h2>
                <label htmlFor="feedbackproductRating" className="mb-1 fs-5">
                    Rating:
                </label>
                <input
            type="number"
            className="mb-4 form-control w-15"
            placeholder="Rating X/5"
            name="productFeedbackRating"
            style={{marginLeft:"15px" , width: "90%"}}
            pattern="[0-5]+(\.[0-9]{1,2})?"
            value={feedback.productFeedbackRating}
            onChange={(e) => onInputChange(e)}
          />
             {feedBackRatingError && (
            <div className="text-danger">{feedBackRatingError}</div>
          )}


                <label htmlFor="feedbackproductMessage" className="mb-1 fs-5">
                    Message:
                </label>
                <textarea
        className="mb-4 form-control"
        placeholder="Enter your message here..."
        name="productFeedbackMessage"
        style={{marginLeft:"15px", width: "90%", minHeight: "100px"}}
        value={feedback.productFeedbackMessage}
        onChange={(e) => onInputChange(e)}
    ></textarea>
    {feedBackMessageError && (
            <div className="text-danger">{feedBackMessageError}</div>
          )}
              </div>
              <div style={{display:"flex" ,marginBottom:"35px"}}>
              <button
                onClick={backtoAdmin}
                className="btn btn-primary btn-half mx-auto d-block"
                style={{width:"30%"}}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-half mx-auto d-block"
                style={{width:"30%"}}
              >
                Give feedback!
              </button>
              
              </div>
            </form>
          </div>
        </div>
      );
}

export default FeedbackProduct
