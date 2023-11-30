import React, { useState,useEffect } from 'react';
import './LoanForm.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LoanForm = () => {
  const navigate = useNavigate();
  var { id } = useParams();

// console.log("id------------",id)


  const [loans, setLoans] = useState([]);
const[successPopup,setSuccessPopup]=useState(false);
  const [formData, setFormData] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maxAmount: '',
  });

  const [errors, setErrors] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maxAmount: '',
  });

  useEffect(()=>{
  
    if(id)
    {
      fun(id)

    }
  
  },[])



  async function fun(id)
  {
    const response = await axios.get(`https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/getLoanById/${id}`);
      console.log("response.data in edit",response.data);
    
    
    setFormData({
      loanType:response.data.loanType,
      description: response.data.description,
      interestRate:response.data.interestRate,
      maxAmount: response.data.maximumAmount,
    })
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleAddLoan() {
    const fieldErrors = {};
  
    if (!formData.loanType) {
      fieldErrors.loanType = 'Loan Type is required';
    } else {
      fieldErrors.loanType = '';
    }
  
    if (!formData.description) {
      fieldErrors.description = 'Description is required';
    } else {
      fieldErrors.description = '';
    }
  
    if (!formData.interestRate) {
      fieldErrors.interestRate = 'Interest Rate is required';
    } else {
      fieldErrors.interestRate = '';
    }
  
    if (!formData.maxAmount) {
      fieldErrors.maxAmount = 'Maximum Amount is required';
    } else {
      fieldErrors.maxAmount = '';
    }
  
    if (Object.values(fieldErrors).some((error) => error !== '')) {
      // Handle errors
      setErrors(fieldErrors);
    } else {
      // If there are no errors, add the loan
   try{
    let requestObject = {
      "loanType": formData.loanType,
      "description": formData.description,
      "interestRate": formData.interestRate,
      "maximumAmount": formData.maxAmount
    }
    if(id)
    {
      const response = await axios.put('https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/updateLoan/'+id,requestObject);
      console.log("response",response)
    if (response.status == 200) {
      setSuccessPopup(true);
    }

    }else{
      const response = await axios.post('https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/addLoan',requestObject);
      console.log("response",response)
    if (response.status == 200) {
      setSuccessPopup(true);
    }

    }
    setFormData({
      loanType: '',
      description: '',
      interestRate: '',
      maxAmount: '',
    });
   }catch{
    
   }
    }
  }
  function handleSuccessMessage()
  {
    setSuccessPopup(false);
    navigate(-1);
  }

  return (
<div>
<div className={`loan-form-container ${successPopup?"blur":""}`} >
      <button type="button" id="backbutton" onClick={() => navigate(-1)}>
        Back
      </button>
      {id==undefined?<h2>Create New Loan</h2>:<h2>Edit Loan</h2>}
      <form>
        <input
          type="text"
          name="loanType"
          value={formData.loanType}
          placeholder="Loan Type"
          onChange={handleChange}
        />
        {errors.loanType && <div className="error">{errors.loanType}</div>}
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Loan Description"
          onChange={handleChange}
        />
        {errors.description && <div className="error">{errors.description}</div>}
        <input
          type="number"
          name="interestRate"
          value={formData.interestRate}
          placeholder="Interest Rate"
          onChange={handleChange}
        />
        {errors.interestRate && <div className="error">{errors.interestRate}</div>}
        <input
          type="number"
          name="maxAmount"
          value={formData.maxAmount}
          placeholder="Maximum Amount"
          onChange={handleChange}
        />
        {errors.maxAmount && <div className="error">{errors.maxAmount}</div>}
        <button type="button" onClick={handleAddLoan}>
           {id==undefined?"Add Loan":"Update Loan"}
        </button>
      </form>
    </div>


{successPopup && (
  <div className="success-popup">
      <p> {!id?"Successfully Added!":"Updated Successfully!"}</p>
      <button onClick={handleSuccessMessage}>Ok</button>
  </div>
)}
</div>
  );
};

export default LoanForm;
