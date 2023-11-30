import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../userSlice";
import "./Login.css";
import { set } from "react-hook-form";
function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "", // Change the field name to "password"
  });
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const fieldErrors = { ...errors };

    switch (fieldName) {
      case "password":
        // Add password validation rules here if needed
        fieldErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  async function handleLogin() {
    setError("");
    console.log("Login clicked");
    // Simulate a successful login by calling the login function

    // let role = "user"; // Set the default role to 'admin'
    const fieldErrors = { ...errors };

    if (
      formData.username.trim() === "" ||
      formData.password.trim() === "" ||
      fieldErrors.password.trim() !== ""
    ) {
      setErrors({
        username: formData.username.trim() === "" ? "Username is required" : "",
        password:
          formData.password.trim() === ""
            ? "Password is required"
            : fieldErrors.password,
      });
      return;
    } else {
      try {
        // Create the request object with your data
        let requestObject = {
          username: formData.username,
          password: formData.password,
        };

        console.log("requestObject", requestObject);

        const response = await axios.post(
          "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/user/login",
          requestObject
        );
        console.log("response", response);
        // Handle the response herefv
        // If the login is successful, you can navigate to the desired page
        if (response.status == 200) {
          // localStorage.setItem("role",response.data.role)
          // localStorage.setItem("userId",response.data._id)
          // localStorage.setItem("userName",response.data.username)
          localStorage.setItem("isAuthenticated", "true");

          let userData = {
            role: response.data.role,
            userId: response.data._id,
            userName: response.data.username,
            isAuthenticated: true,
          };
          console.log("userData", userData);
          dispatch(setUserInfo(userData));

          if (response.data.role == "admin") {
            navigate("/home");
          } else {
            navigate("/availableloan");
          }
        } else {
          setError("Invalid Email or Password");
        }
      } catch (error) {
        // Handle any errors
        setError("Invalid Email or Password");
      }
    }
    // If no errors, proceed with the Axios call
  }
  return (
    <div className="login-container">
      <div className="login-wrapper">
      <div className="login-right">
          <div id="message">
            <h2>VehicleVault</h2>
            <p>Financial success is a journey, and the first step is applying for the loan</p>
          </div>
        </div>
        <div className="login-left">
          <div className="login-box">
            <h2>Login</h2>
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              {errors.username && <div className="error">{errors.username}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="login-button" onClick={handleLogin}>
              Login
            </button>
            <div className="signup-link">
              Don't have an account? <Link to="/user/register">Signup</Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
  
  }
  


export default Login;
