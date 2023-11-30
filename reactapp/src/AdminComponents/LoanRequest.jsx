import React, { useState, useEffect } from 'react';
import './LoanRequest.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoanRequests = () => {
    const [loanRequests, setLoanRequests] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState(0);
    const [statusFilter, setStatusFilter] = useState("-1");
    const [page, setPage] = useState(1);
    const [pagesize, setPagesize] = useState(2);
    const [maxPageLength, setMaxPageLength] = useState(0);
    const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    },[searchValue,statusFilter,page,sortValue,statusFilter]);

    async function fetchData() {
      try {
          const response = await axios.post('https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/getAllLoanApplications',
          {
            searchValue: searchValue,
            statusFilter: statusFilter,
            page: page,
            sortValue:sortValue,
            statusFilter:statusFilter,
            pageSize:pagesize
        }
          );
          console.log("response.data",response.data)
          setLoanRequests(response.data.data);
          setMaxPageLength(Math.ceil(response.data.length/pagesize))
          //   setFilteredRequests(response.data);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }



  const handleSearchChange = (e) => {
      const inputValue = e.target.value;
      setSearchValue(inputValue);
    //   setFilteredRequests(filterRequests(inputValue, loanRequests, statusFilter));
    //   setPage(1);
  };

  const toggleSort = (order) => {
      setSortValue(order);
    //   const sortedRequests = [...filteredRequests].sort((a, b) => {
    //       const dateA = new Date(a.submissionDate);
    //       const dateB = new Date(b.submissionDate);
    //       return order === 1 ? dateA - dateB : dateB - dateA;
    //   });
    //   setFilteredRequests(sortedRequests);
  };

  const handleFilterChange = (e) => {
      const selectedStatus = e.target.value;
      setStatusFilter(selectedStatus);

    //   setFilteredRequests(filterRequests(searchValue, loanRequests, selectedStatus));
    //   setPage(1);
  };

//   const handlePagination = (newPage) => {
//       const totalPages = Math.ceil(filteredRequests.length / limit);
//       if (newPage >= 1 && newPage <= totalPages) {
//           setPage(newPage);
//       }
//   };

  
    async function handleApprove(id, userName, userId) {
      let updatedRequest = {};
      loanRequests.forEach((request) => {
          if (request.loanApplicationID === id) {
              updatedRequest = request;
          }
      });
      let requestObject = {
        "userId": userId,
        "userName": userName,
        "loanType":  updatedRequest.loanType,
        "submissionDate": updatedRequest.submissionDate,
        "income": updatedRequest.income,
        "purchasePrice": updatedRequest.purchasePrice,
        "model": updatedRequest.model,
        "address": updatedRequest.address, // Include the address field
        "loanStatus": 1
      };
      // const requestObject = {
      //     userId: userId,
      //     userName: userName,
      //     loanType: updatedRequest.loanType,
      //     requestedAmount: updatedRequest.requestedAmount,
      //     submissionDate: updatedRequest.submissionDate,
      //     employmentStatus: updatedRequest.employmentStatus,
      //     income: updatedRequest.income,
      //     creditScore: updatedRequest.creditScore,
      //     loanStatus: 1,
      // };

      try {
          const response = await axios.put(
              `https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/updateLoanApplication/${id}`,
              requestObject
          );
          console.log("response", response);
          if (response.status === 200) {
              fetchData();
          }
      } catch (error) {
          console.error("Error approving request:", error);
      }
  }

  async function handleReject(id, userName, userId) {
      let updatedRequest = {};
      loanRequests.forEach((request) => {
          if (request.loanApplicationID === id) {
              updatedRequest = request;
          }
      });

      // const requestObject = {
      //     userId: userId,
      //     userName: userName,
      //     loanType: updatedRequest.loanType,
      //     requestedAmount: updatedRequest.requestedAmount,
      //     submissionDate: updatedRequest.submissionDate,
      //     employmentStatus: updatedRequest.employmentStatus,
      //     income: updatedRequest.income,
      //     creditScore: updatedRequest.creditScore,
      //     loanStatus: 2,
      // };
      let requestObject = {
        "userId": userId,
        "userName": userName,
        "loanType":  updatedRequest.loanType,
        "submissionDate": updatedRequest.submissionDate,
        "income": updatedRequest.income,
        "purchasePrice": updatedRequest.purchasePrice,
        "model": updatedRequest.model,
        "address": updatedRequest.address, // Include the address field
        "loanStatus": 2
      };
      try {
          const response = await axios.put(
              `https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/updateLoanApplication/${id}`,
              requestObject
          );
          if (response.status === 200) {
              fetchData();
          }
      } catch (error) {
          console.error("Error rejecting request:", error);
      }
  }


    const handleRowExpand = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    }


    return (
        <div>
            <button onClick={() => navigate(-1)} id='backButton'>Back</button>
            <h1>Loan Requests for Approval</h1>
            <div>
                <input
                    id='searchBox'
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <label id='filter'>
                    Filter by Status:  
                    <select
                        value={statusFilter}
                        onChange={handleFilterChange}
                    >
                        <option value="-1">All</option>
                        <option value="0">Pending</option>
                        <option value="1">Approved</option>
                        <option value="2">Rejected</option>
                    </select>
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Loan Type</th>
                        <th>Model</th>
                        <th>
                            <div id="submissionDate">
                                Submission Date
                                <div
                                    className="sortButtons"
                                    onClick={() => toggleSort(1)}
                                >
                                    ⬆️
                                </div>
                                <div
                                    className="sortButtons"
                                    onClick={() => toggleSort(-1)}
                                >
                                    ⬇️
                                </div>
                            </div>
                        </th>
                        <th>purchasePrice</th>
                        <th>Income</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
              {loanRequests.length?<tbody>
                    {loanRequests
                        .map((request, index) => (
                            <React.Fragment key={request._id}>
                                <tr>
                                    <td>{request.userName}</td>
                                    <td>{request.loanType}</td>
                                    <td>{new Date(request.model).toLocaleDateString()}</td>
                                    <td>{new Date(request.submissionDate).toLocaleDateString()}</td>
                                    <td>${request.purchasePrice}</td>
                                    <td>${request.income}</td>

                                    <td >
                                        <button
                                            onClick={() => handleRowExpand(index)}
                                        >
                                            {expandedRow === index ? "Hide Address" : "Show Address"}
                                        </button>
                                    </td>
                                    <td>
                                        {request.loanStatus === 0
                                            ? "Pending"
                                            : request.loanStatus === 1
                                            ? "Approved"
                                            : "Rejected"}
                                    </td>
                                    <td>
                                        {(request.loanStatus === 0 || request.loanStatus === 2) && (
                                            <button
                                                onClick={() => handleApprove(request._id, request.userName, request.userId)}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {(request.loanStatus === 0 || request.loanStatus === 1) && (
                                            <button
                                                onClick={() => handleReject(request._id, request.userName, request.userId)}
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="address-details">
                                                Address: {request.address}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                
                            </React.Fragment>
                        ))}

                        
                </tbody>:(
            <tbody>
              <tr>
                
                <td colSpan={9} className="no-records-cell">
                      Oops! No records Found
                </td>
              </tr>
            </tbody>
          )}
            </table>
            {loanRequests.length?<div>
                <button onClick={() => setPage(page - 1)} disabled={page==1?true:false}>
                    Prev
                </button>
                <span>
                    Page {page} of {maxPageLength === 0 ? 1 : maxPageLength}
                </span>
                <button onClick={() => setPage(page + 1)} disabled={page==maxPageLength?true:false} >
                    Next
                </button>
            </div>:""}
        </div>
    );
};

export default LoanRequests;
