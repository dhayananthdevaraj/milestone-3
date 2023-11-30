import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import "./AppliedLoans.css"
const AppliedLoansPage = () => {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null); // Define these state variables
    const [appliedLoans, setAppliedLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [maxRecords, setMaxRecords] = useState(1);

    let userId = useSelector((state) => state.user.userId);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get("https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/getLoanApplicationByUserId/" + userId);
            if (response.status === 200) {
                setAppliedLoans(response.data);
                setFilteredLoans(response.data);
                setMaxRecords(response.data.length);
            }
        } catch (error) {
            setAppliedLoans([]);
        }
    }

    const totalPages = Math.ceil(maxRecords / limit);

    const filterLoans = (search) => {
        const searchLower = search.toLowerCase();
        if (searchLower === "") return appliedLoans;
        return appliedLoans.filter((loan) =>
            loan.loanType.toLowerCase().includes(searchLower)
        );
    };

    const handleSearchChange = (e) => {
        const inputValue = e.target.value;
        setSearchValue(inputValue);
        const filteredLoans = filterLoans(inputValue);
        setMaxRecords(filteredLoans.length);
        setFilteredLoans(filteredLoans);
    };

    const toggleSort = (order) => {
        setSortValue(order);

        const sortedLoans = [...filteredLoans].sort((a, b) => {
            return order === 1
                ? new Date(a.submissionDate) - new Date(b.submissionDate)
                : order === -1
                ? new Date(b.submissionDate) - new Date(a.submissionDate)
                : 0;
        });

        setFilteredLoans(sortedLoans);
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

    async function handleConfirmDelete() {
        
            const response = await axios.delete(
                'https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/deleteLoanApplication/' + loanToDelete
            );
            if (response.status === 200) {
                fetchData();
            }
            closeDeletePopup();
        
    }

    const closeDeletePopup = () => {
        setLoanToDelete(null);
        setShowDeletePopup(false);
    };

    return (
        <div>

<div className={showDeletePopup ? "page-content blur" : "page-content"}>
            <button id='backButton'
                onClick={() => {
                    navigate("/availableloan");
                }}
            >
                Back
            </button>
            <h1>Applied Loans</h1>

            {/* Search Box */}
            <div>
                <input id='searchBox'
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Loan Name</th>
                        <th>
                            <div id="submissionDate">Submission Date</div>
                            <div>
                                <button
                                    className="sortButtons"
                                    onClick={() => toggleSort(1)}
                                >
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
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {filteredLoans.length ? (
                    <tbody>
                        {filteredLoans
                            .slice((page - 1) * limit, page * limit)
                            .map((loan) => (
                                <tr key={loan._id}>
                                    <td>{loan.loanType}</td>
                                    <td>
                                        {new Date(loan.submissionDate)
                                            .toISOString()
                                            .split('T')[0]}
                                    </td>
                                    <td>
                                        {loan.loanStatus === 0
                                            ? 'Pending'
                                            : loan.loanStatus === 1
                                            ? 'Approved'
                                            : 'Rejected'}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                handleDeleteClick(loan._id);
                                            }}
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
                            <td colSpan="4" className='no-records-cell'>No Records Found</td>
                        </tr>
                    </tbody>
                )}
            </table>

       

          {filteredLoans.length>0 && <div>
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

export default AppliedLoansPage;
