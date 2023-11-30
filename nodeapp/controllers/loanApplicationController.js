const LoanApplication = require('../models/loanApplicationModel');

const getAllLoanApplications = async (req, res) => {
  try {
    console.log("Received request:", req.body);

    // Pagination parameters
    const page = parseInt(req.body.page) || 1; 
    const pageSize = req.body.pageSize; 
    // Search
    const search = req.body.searchValue;
    const sortValue = req.body.sortValue;
    const searchRegex = new RegExp(search, 'i');
    const statusFilterCondition =
      req.body.statusFilter !== '-1' ? { loanStatus: req.body.statusFilter } : {};
    const searchQuery = {
      $and: [
        {
          $or: [
            { userName: searchRegex },
            { loanType: searchRegex },
            // Add more fields to search if needed
          ],
        },
        // Add status filter condition
        statusFilterCondition,
      ],
    };

    // Sorting
    const sortBy = req.body.sortBy || 'submissionDate'; // Default sorting by submissionDate

    const loanApplications = await LoanApplication.find(searchQuery)
      .sort({ [sortBy]: parseInt(sortValue) })
      .skip((page - 1) * pageSize) 
      .limit(pageSize) 
      .exec();

    const loanApplications1 = await LoanApplication.find(searchQuery);
    console.log("loanApplications1", loanApplications1);
    res.status(200).json({ data: loanApplications, length: loanApplications1.length });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
};
const getLoanApplicationByUserId = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming userId is provided as a parameter
  console.log("userId",userId)
      const loanApplication = await LoanApplication.find({ userId }); // Find by userId
  console.log("loanApplication",loanApplication)
      if (loanApplication) {
        res.status(200).json(loanApplication);
      } else {
        res.status(404).json({ message: 'Loan application not found for the provided userId' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 
const getLoanApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findById(id);
    res.status(200).json(loanApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLoanApplication = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const loanApplication = await LoanApplication.create(req.body);
    res.status(200).json({"message":"Added Successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findByIdAndUpdate(id, req.body);
    if (!loanApplication) {
      return res.status(404).json({ message: `Cannot find any loan application` });
    }
    const updatedLoanApplication = await LoanApplication.findById(id);
    res.status(200).json({"message":"Updated Successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findByIdAndDelete(id);
    if (!loanApplication) {
      return res.status(404).json({ message: `Cannot find any loan application` });
    }
    res.status(200).json({message:"Deleted Successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLoanApplications,
  getLoanApplicationById,
  addLoanApplication,
  updateLoanApplication,
  deleteLoanApplication,
  getLoanApplicationByUserId
};
