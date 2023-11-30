import React from 'react';
import Login from './Components/Login';
import HomePage from './AdminComponents/Home';
import LoanForm from './AdminComponents/LoanForm';
import SignupForm from './Components/Signup';
import LoanRequest from './AdminComponents/LoanRequest';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from './Components/PrivateRoute'; // Import the PrivateRoute component
import { Navigate } from 'react-router-dom';
import UserHomePage from './UserComponents/UserHomePage';
import AppliedLoans from './UserComponents/AppliedLoans';
import LoanApplicationForm from './UserComponents/LoanApplicationForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="user">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignupForm />} />
        </Route>
        <Route path="/home"  element={  <PrivateRoute>  <HomePage /> </PrivateRoute>}/>   
        <Route path="/newloan/:id?"  element={  <PrivateRoute>  <LoanForm /> </PrivateRoute>}/>   
        <Route path="/loanrequest"  element={  <PrivateRoute>  <LoanRequest /> </PrivateRoute>}/>   
        <Route path="*" element={<Navigate to="/user/login" replace />} />
        <Route path="/availableloan"  element={  <PrivateRoute>  <UserHomePage /> </PrivateRoute>}/>   
        <Route path="/appliedloan"  element={  <PrivateRoute>  <AppliedLoans /> </PrivateRoute>}/>   
        <Route path="/loanApplicationForm"  element={  <PrivateRoute>  <LoanApplicationForm /> </PrivateRoute>}/>   

     </Routes>
    </BrowserRouter>
  );
}

export default App;
