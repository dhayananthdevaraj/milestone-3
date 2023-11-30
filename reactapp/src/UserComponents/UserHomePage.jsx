import React, { useState, useEffect } from "react";
import "./UserHomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoanInfo } from "../loanSlice";

const UserHomePage = () => {
  const navigate = useNavigate();
  const [availableLoans, setAvailableLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [appliedLoans, setAppliedLoans] = useState([]);
  let userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAppliedLoans();
    fetchData();
  }, []);

  async function fetchAppliedLoans() {
  try{
    const response = await axios.get(
      "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/getLoanApplicationByUserId/" +
        userId
    );
    
    console.log("Applied Loans:", response);

    if (response.status === 200) {
      setAppliedLoans(response.data);
    }

  }catch(error)
  {
     
  }
  }

  async function fetchData() {
    try {
      const response = await axios.get(
           "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/getAllLoans"
      );
      console.log("Available Loans:", response);

      setAvailableLoans(response.data);
      setFilteredLoans(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const totalPages = Math.ceil(filteredLoans.length / limit);

  const filterLoans = (search) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "") return availableLoans;
    return availableLoans.filter((loan) =>
      loan.loanType.toLowerCase().includes(searchLower)
    );
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
    const filteredLoans = filterLoans(inputValue);
    setFilteredLoans(filteredLoans);
  };

  const toggleSort = (order) => {
    setSortValue(order);

    const sortedLoans = [...filteredLoans].sort((a, b) => {
      if (order === 1) {
        return a.interestRate - b.interestRate;
      } else if (order === -1) {
        return b.interestRate - a.interestRate;
      } else {
        return 0;
      }
    });

    setFilteredLoans(sortedLoans);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleApplyClick = (loan) => {
    const isLoanApplied = appliedLoans.some(
      (appliedLoan) => appliedLoan.loanType === loan.loanType
    );

    if (isLoanApplied) {
      alert("Loan is already applied.");
    } else {
      dispatch(
        setLoanInfo({
          loanType: loan.loanType,
        })
      );
      navigate("/loanApplicationForm");
    }
  };

  return (
    <div>
      <button id="logoutbutton" onClick={() => navigate("/user/login")}>
        Logout
      </button>
      <div id="loanHomeBody">
        <h1>Available Vechile Loans</h1>

        <button
          id="appliedloanbutton"
          onClick={() => {
            navigate("/appliedloan");
          }}
        >
          View Applied Loan
        </button>

        {/* Search Box */}
        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        {/* Available Loans Table */}
        <table className="loan-table">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Loan Description</th>
              <th>
                <div id="interestrate">Interest Rate</div>
                <div>
                  <button
                   className="sortButtons" 
                   role="ascending-button"

                   onClick={() => toggleSort(1)}>
                    ⬆️
                  </button>
                  <button
                    className="sortButtons"
                    role="descending-button"
                    onClick={() => toggleSort(-1)}
                  >
                    ⬇️
                  </button>
                </div>
              </th>
              <th>Maximum Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          {filteredLoans.length ? (
            <tbody>
              {filteredLoans
                .slice((page - 1) * limit, page * limit)
                .map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.loanType}</td>
                    <td>{loan.description}</td>
                    <td>{loan.interestRate}%</td>
                    <td>${loan.maximumAmount}</td>
                    <td>
                      {appliedLoans.some(
                        (appliedLoan) => appliedLoan.loanType === loan.loanType
                      ) ? (
                        "Applied Successfully"
                      ) : (
                        <button onClick={() => handleApplyClick(loan)}>
                          Apply
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={5} className="no-records-cell">
                  Oops! No records Found
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {filteredLoans.length > 0 && (
          <div>
            <button
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              {" "}
              Page {page} of {totalPages}{" "}
            </span>
            <button
              onClick={() => handlePagination(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
