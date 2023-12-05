const Loan = require('../models/loanModel');

// const getAllLoans = async (req, res) => {
//   try {
//     const loans = await Loan.find({});
//     res.status(200).json(loans);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const getAllLoans = async (req, res) => {
//   try {
//     // Extract the search query from the request parameters
//     const searchValue = req.body.searchValue;

//     // Create a regular expression with the "i" option for case insensitivity
//     const searchRegex = new RegExp(searchValue, 'i');

//     const query = searchValue
//       ? { loanType: { $regex: searchRegex, $options: 'i' } }
//       : {};

//     const loans = await Loan.find(query);
//     res.status(200).json(loans);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };
// const getAllLoans = async (req, res) => {
//   try {
//     // Extract the search query, sort value, and pagination parameters from the request
//     const searchValue = req.body.searchValue;
//     const sortValue = req.body.sortValue;
//     const page = req.body.page || 1; // Current page, default to 1
//     const limit = req.body.limit || 2; // Items per page, default to 10

//     const query = searchValue
//       ? { loanType: { $regex: new RegExp(searchValue, 'i') } }
//       : {};

//     // Create a sort object based on the sortValue
//     const sort = {};
//     if (sortValue === 1) {
//       sort.interestRate = 1; // Ascending
//     } else if (sortValue === -1) {
//       sort.interestRate = -1; // Descending
//     }

//     const skip = (page - 1) * limit;

//     let loans=[]
//     loans[0] = sortValue !== 0
//       ? await Loan.find(query).sort(sort).skip(skip).limit(limit)
//       : await Loan.find(query).skip(skip).limit(limit);
//     loans[1]= await Loan.find(query)
//     res.status(200).json(loans);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllLoans = async (req, res) => {
  try {
    console.log("getAllLoans");
    const loans = await Loan.find({});
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("came")
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLoan = async (req, res) => {
  try {
    console.log("req.body",req.body);
    await Loan.create(req.body);
    res.status(200).json({"message":"Loan added Successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoan = async (req, res) => {
  try {
    console.log("id in update",req)

    const { id } = req.params;
    console.log("id in update",id)
    const loan = await Loan.findByIdAndUpdate(id, req.body);
    if (!loan) {
      return res.status(404).json({ message: `Cannot find any loan` });
    }
    res.status(200).json({"message":"Loan updated successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByIdAndDelete(id);
    if (!loan) {
      return res.status(404).json({ message: `Cannot find any loan` });
    }
    res.status(200).json({ message:"Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  addLoan,
  updateLoan,
  deleteLoan,
};
