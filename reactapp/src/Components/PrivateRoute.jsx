import React from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './Login';
import { useDispatch, useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  // const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // Move it here
// console.log("isAuth",isAuthenticated);
let isAuthenticated=localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/user/login" replace />;;
};

export default PrivateRoute;
