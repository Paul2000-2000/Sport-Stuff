

import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AfterLogin from "./Pages/AfterLogin";
import LoginAdmin from "./Pages/LoginAdmin";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import BuyProduct from "./Pages/BuyProduct";
import ShoppingListClient from "./Pages/ShoppingListClient";
import CheckoutPage from "./Pages/CheckoutPage";
import ShoppingHistory from "./Pages/ShoppingHistory";
import ShoppingHistoryAdmin from "./Pages/ShoppingHistoryAdmin";
import WishList from "./Pages/WishList"; 
import ViewClients from "./Pages/ViewClients";
import ViewClientProducts from "./Pages/ViewClientProducts";
import FeedbackProduct from "./Pages/FeedbackProduct";
import ViewProduct from "./Pages/ViewProduct";
import ViewProductAdmin from "./Pages/ViewProductAdmin";
import ProductsFromOrder from "./Pages/ProductsFromOrder";
import ProductsFromOrderAdmin from "./Pages/ProductsFromOrderAdmin";
import CompareProducts from "./Pages/CompareProducts";
import PaymentForm from "./Pages/PaymentForm";


function App() {

  

  return (
    <Router>
      <div className="App">
      
      
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/afterlogin/:userId" element={<AfterLogin />} />
        <Route exact path="/loginadmin" element={<LoginAdmin />} />
        <Route exact path="/addproduct" element={<AddProduct />} />
        <Route exact path="/editproduct/:productId" element={<EditProduct />} />
        <Route exact path="/viewproduct/:productId" element={<ViewProduct />}  />
        <Route exact path="/viewproductadmin/:productId" element={<ViewProductAdmin />}  />
        <Route exact path="/buyproduct/:productId" element={<BuyProduct />}  />
        <Route exact path="/shoppinglistclient/:userId" element={<ShoppingListClient/>} />
        <Route exact path="/compareproducts/:userId" element={<CompareProducts />} />
        <Route exact path="/checkoutpage/:userId" element={<CheckoutPage/>} />
        <Route exact path="/shoppinghistoryclient/:userId" element={<ShoppingHistory />} />
        <Route exact path="/shoppinghistoryadmin/:userId" element={<ShoppingHistoryAdmin />} />
        <Route exact path="/wishlist/:userId" element={<WishList />} />
        <Route exact path="/viewclients" element={ <ViewClients />} />
        <Route exact path="/viewclientsproducts/:userId" element={<ViewClientProducts />} />
        <Route exact path="/feedbackProductPage/:productId" element={<FeedbackProduct />} />
        <Route exact path="/productsfromorder/:orderId" element={<ProductsFromOrder />} />
        <Route exact path="/productsfromorder/:orderId/:userId" element={<ProductsFromOrderAdmin />} />
        <Route exact path="/payment/:userId" element={<PaymentForm />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
