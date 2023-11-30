import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./LoanApplicationForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function LoanApplicationForm() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  const userName = useSelector((state) => state.user.userName);
  const loanType = useSelector((state) => state.loan.loanType);
  const [successPopup, setSuccessPopup] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let requestObject = {
      userId: userId,
      userName: userName,
      loanType: loanType,
      submissionDate: new Date(),
      income: data.income,
      purchasePrice: data.purchasePrice,
      model: data.model,
      address: data.address, // Include the address field
      loanStatus: 0,
    };

    try {
      console.log("requestObject", requestObject);
      const response = await axios.post(
        "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/addLoanApplication",
        requestObject
      );
      console.log("response in application", response);
      if (response.status === 200) {
        setSuccessPopup(true);
      }
      // Handle success
    } catch (error) {
      alert("Something Went wrong");
    }
  };

  function handleSuccessMessage() {
    setSuccessPopup(false);
    navigate("/availableloan");
  }

  return (
    <div>
      <div className={`container ${successPopup ? "blur" : ""}`}>
        <div className="button-container">
          <button onClick={() => navigate(-1)}>Back</button>
          <h2>Loan Application Form</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="income">Income:</label>
            <Controller
              name="income"
              control={control}
              rules={{ required: "Income is required" }}
              render={({ field }) => (
                <div>
                  <input id="income" type="text" {...field} />
                  {errors.income && (
                    <div className="error">{errors.income.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label htmlFor="model">Model:</label>
            <Controller
              name="model"
              control={control}
              rules={{ required: "Model is required" }}
              render={({ field }) => (
                <div>
                  <input id="model" type="date" {...field} />
                  {errors.model && (
                    <div className="error">{errors.model.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label htmlFor="purchasePrice">Purchase Price:</label>
            <Controller
              name="purchasePrice"
              control={control}
              rules={{ required: "Purchase Price is required" }}
              render={({ field }) => (
                <div>
                  <input id="purchasePrice" type="text" {...field} />
                  {errors.purchasePrice && (
                    <div className="error">{errors.purchasePrice.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label htmlFor="address">Address:</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <div>
                  <input id="address" type="text" {...field} />
                  {errors.address && (
                    <div className="error">{errors.address.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
      {successPopup && (
        <div className="success-popup">
          <p>Successfully Added!</p>
          <button onClick={handleSuccessMessage}>Ok</button>
        </div>
      )}
    </div>
  );
}

export default LoanApplicationForm;
