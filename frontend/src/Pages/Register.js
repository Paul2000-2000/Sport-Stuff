import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const navigate = useNavigate();
  const { username, email, firstname, lastname, password } = user;
  const [usernameExists, setUsernameExists] = useState(false); 
  const [registrationError, setRegistrationError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [firstnameError, setFirstnameError] = useState(null);
  const [lastnameError, setLastnameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onInputChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
    if (e.target.name === "email" && e.target.value.trim() !== "") {
      setEmailError("");
    }
    if (e.target.name === "firstname" && e.target.value.trim() !== "") {
      setFirstnameError("");
    }
    if (e.target.name === "lastname" && e.target.value.trim() !== "") {
      setLastnameError("");
    }
    if (e.target.name === "username" && e.target.value.trim() !== "") {
      setUsernameError("");
    }
  };

    const handleLogin = () =>{
      navigate("/login");
    }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (email.length === 0) {
        setEmailError("Email field can not be empty.");
        return;
      } else if (firstname.length === 0) {
        setFirstnameError("Firstname field can not be empty.");
        return;
      } else if (lastname.length === 0) {
        setLastnameError("Lastname field can not be empty.");
        return;
      } else if (username.length === 0) {
        setUsernameError("Username field can not be empty.");
        return;
      } else if (password.length === 0) {
        setPasswordError("Password field can not be empty.");
        return;
      }

      const exists = await checkUsernameExists(username);
      console.log("Checking username:", username);

      if (exists) {
        setUsernameExists(true);
        setRegistrationError(
          "Username already exists. Please choose a different username."
        );
        return;
      }

      setUsernameExists(false);
      setRegistrationError(null);

      await axios.post("http://localhost:8080/userAdd", user);

      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);

      setRegistrationError(
        "An error occurred during registration. Please try again later."
      );
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      const trimmedUsername = username.trim();
      console.log(trimmedUsername, username);
      const response = await axios.get(
        "http://localhost:8080/user/check-username/" + trimmedUsername
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h2 className="my-5 "> Register Here!</h2>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="d-flex flex-column justify-content-center align-items-center w-35"
        style={{border:"solid 2px black" , borderRadius:"15px" , width:"30%", boxShadow: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)"}}
      >
        <label htmlFor="email" className="mb-1 fs-5" style={{marginTop:"20px"}}>
          Email
        </label>
        <input
          type="email"
          className="mb-4 form-control"
          placeholder="Enter your e-mail"
          name="email"
          value={email}
          onChange={(e) => onInputChange(e)}
          style={{width:"50% " }}
        />

        {emailError && <div className="text-danger">{emailError}</div>}

        <label htmlFor="firstname" className="mb-1 fs-5">
          Firstname
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your firstname"
          name="firstname"
          value={firstname}
          onChange={(e) => onInputChange(e)}
          style={{width:"50% " }}
        />
        {firstnameError && <div className="text-danger">{firstnameError}</div>}
        <label htmlFor="lastname" className="mb-1 fs-5">
          Lastname
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your lastname"
          name="lastname"
          value={lastname}
          onChange={(e) => onInputChange(e)}
          style={{width:"50% " }}
        />
        {lastnameError && <div className="text-danger">{lastnameError}</div>}
        <label htmlFor="username" className="mb-1 fs-5">
          Username
        </label>
        <input
          type="text"
          className="mb-4 form-control w-15"
          placeholder="Enter your username"
          name="username"
          value={username}
          onChange={(e) => onInputChange(e)}
          style={{width:"50% " }}
        />
        {usernameError && <div className="text-danger">{usernameError}</div>}

        {usernameExists && (
          <div className="text-danger">{registrationError}</div>
        )}

        <label htmlFor="password" className="mb-1 fs-5">
          Password
        </label>
        <input
          type="password"
          className="mb-4 form-control w-60 "
          placeholder="Enter your password"
          name="password"
          value={password}
          onChange={(e) => onInputChange(e)}
          style={{width:"50% " }}
        />
        {passwordError && <div className="text-danger">{passwordError}</div>}
        <button
          type="submit"
          className="btn btn-primary btn-half mx-auto d-block"
          style={{marginBottom:"20px" , width:"40%"}}
        >
          Register
        </button>
        <button onClick={handleLogin}
        className="btn btn-primary btn-half mx-auto d-block"
        style={{marginBottom:"20px" , width:"40%"}}>
            Go to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
