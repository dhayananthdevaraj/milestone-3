import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearInfo } from "../userSlice";
import { useQuery } from "react-query"; // Import useQuery
import axios from "axios";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [maxRecords, setMaxRecords] = useState(1);
  const username = useSelector((state) => state.user.userName);

  const totalPages = Math.ceil(maxRecords / limit);

  // Define availableLoans state and function to update it
  const [availableLoans, setAvailableLoans] = useState([]);
  const updateAvailableLoans = (newLoans) => {
    console.log("came",newLoans);
    setAvailableLoans(newLoans);
  };

  const toggleSort = (order) => {
    setSortValue(order);

    if (order !== 0) {
      const sortedLoans = [...availableLoans];
      sortedLoans.sort((a, b) => {
        if (order === 1) {
          return a.interestRate - b.interestRate;
        } else if (order === -1) {
          return b.interestRate - a.interestRate;
        }
        return 0;
      });

      updateAvailableLoans(sortedLoans);
      setMaxRecords(sortedLoans.length);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteClick = (loan) => {
    setLoanToDelete(loan);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (loanToDelete) {
        const response = await axios.delete(
          "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/deleteLoan/" +
            loanToDelete
        );
        if (response.status === 200) {
          refetch();
          // You may want to remove the deleted loan from availableLoans here.
        }
        closeDeletePopup();
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  const closeDeletePopup = () => {
    setLoanToDelete(null);
    setShowDeletePopup(false);
  };

  // Define the fetchAvailableLoans function
  const fetchAvailableLoans = async () => {
    const res = await axios.get(
      "https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loan/getAllLoans"
    );
    console.log("hey",res)
    return res.data;
  };

  // Use useQuery to fetch available loans
  const { data, status, refetch } = useQuery(
    "availableLoans",
    fetchAvailableLoans
  );

  // When data changes, update availableLoans
  React.useEffect(() => {
    if (data) {
      updateAvailableLoans(data);
      setMaxRecords(data.length);
    }
  }, [data]);

  const filterLoans = (loans, search) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "") return loans;
    return loans.filter(
      (loan) =>
        loan.loanType.toLowerCase().includes(searchLower) ||
        loan.description.toLowerCase().includes(searchLower)
    );
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  };

  return (
    <div>
      <button id="logoutbutton" onClick={() => navigate("/user/login")}>
        Logout
      </button>
      <div id="loanHomeBody" className={showDeletePopup ? "blur" : ""}>
        <h1>Vechile Loans</h1>
        <button id="req_button" onClick={() => navigate("/loanrequest")}>
          Loans Requested
        </button>
        <button id="new_button" onClick={() => navigate("/newloan")}>
          Create New
        </button>

        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <table className="loan-table">
          <thead>
            <tr>
              <th>LoanType</th>
              <th>Maximum Amount</th>
              <th>
                <div id="interestrate">Interest Rate</div>
                <div>
                  <button className="sortButtons" onClick={() => toggleSort(1)}>
                    ⬆️
                  </button>
                  <button
                    className="sortButtons"
                    onClick={() => toggleSort(-1)}
                  >
                    ⬇️
                  </button>
                </div>
              </th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          {status === "loading" && (
            <tbody>
              <tr>
                <td>Loading...</td>
              </tr>
            </tbody>
          )}
          {status === "error" && (
            <tbody>
              <tr>
                <td>Error loading data</td>
              </tr>
            </tbody>
          )}
          {console.log(
            "filterLoans(availableLoans, searchValue).length",
            filterLoans(availableLoans, searchValue)
          )}
          {status === "success" &&
          filterLoans(availableLoans, searchValue).length ? (
            <tbody>
              {filterLoans(availableLoans, searchValue)
                .slice((page - 1) * limit, page * limit)
                .map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.loanType}</td>
                    <td>${loan.maximumAmount}</td>
                    <td>{loan.interestRate}%</td>
                    <td>{loan.description}</td>
                    <td>
                      <button onClick={() => navigate("/newloan/" + loan._id)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(loan._id)}
                        data-testid={`delete-button-${loan.loanID}`}
                      >
                        Delete
                      </button>
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
       {(filterLoans(availableLoans, searchValue).length>0)&&<div>
          <button
            onClick={() => handlePagination(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePagination(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>}
      </div>

      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={closeDeletePopup}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
