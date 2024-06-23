import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, password } = user;
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      setUsernameError("");
    }
    if (e.target.name === "password") {
      setPasswordError("");
    }
  };

    const handleRegister = () =>{
      navigate('/')
    }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); 

      if (username.length === 0) {
        setUsernameError("Username field can not be empty.");
        return;
      } else if (password.length === 0) {
        setPasswordError("Password field can not be empty.");
        return;
      }

      const exists = await checkUsernameExists(username);

      if (!exists) {
        setUsernameExists(true);
        setLoginError("Username does not exist. Please check your username.");
        return; 
      }

      const isPasswordCorrect = await checkPassword(username, password);

      if (!isPasswordCorrect) {
        setLoginError("Incorrect password. Please try again.");
        return; 
      }
      console.log("password right");

      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });

      const token = response.data.token;
      console.log("token value is : ", token);

      localStorage.setItem("token", token);

      const userId = response.data.userId;

      console.log(userId);

      if (username === "Admin" && password === "Admin") {
        navigate("/loginadmin");
      } else {
        navigate(`/afterlogin/${userId}`);
      }
    } catch (error) {
      console.error("Error during login:", error);

      setLoginError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      // Print ASCII codes of each character in the username
      const trimmedUsername = username.trim().replace(/[\r\n]+/gm, "");
      console.log(trimmedUsername);
      const response = await axios.get(
        "http://localhost:8080/user/check-username/" + trimmedUsername
      );
      console.log(response.data);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const checkPassword = async (username, password) => {
    try {
      console.log(username);
      console.log(password);

      const response = await axios.get(
        `http://localhost:8080/user/check-password?username=${username}&password=${password}`
      );

      console.log(response.data);
      return response.data.isPasswordCorrect;
    } catch (error) {
      console.error("Error checking password:", error);
      
      setLoginError(
        "An error occurred during password check. Please try again later."
      );
      return false;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="my-5"> Login Here!</h2>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="d-flex flex-column justify-content-center align-items-center w-35"
        style={{border:"solid 2px black" , borderRadius:"15px" , width:"25%", boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)"}}
      >
        <label htmlFor="username" className="mb-1 fs-5" style={{marginTop:"20px"}}>
          Username
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your username"
          name="username"
          value={username}
          onChange={(e) => onInputChange(e)}
          style={{width:"65% " }}
        />
        {usernameError && <div className="text-danger">{usernameError}</div>}

        <label htmlFor="password" className="mb-1 fs-5">
          Password
        </label>
        <input
          type="password"
          className="mb-4 form-control w-15"
          placeholder="Enter your password"
          name="password"
          value={password}
          onChange={(e) => onInputChange(e)}
          style={{width:"65% " }}
        />
        {passwordError && <div className="text-danger">{passwordError}</div>}

        <button
          type="submit"
          className="btn btn-primary btn-half mx-auto d-block"
          disabled={loading}
          style={{marginBottom:"30px" , width:"40%"}}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <button onClick={handleRegister}
        className="btn btn-primary btn-half mx-auto d-block"
        style={{marginBottom:"30px" , width:"40%"}}
        >
          Go to Register
        </button>

        {loginError && <div className="text-danger mt-3">{loginError}</div>}
      </form>
    </div>
  );
};

export default Login;
