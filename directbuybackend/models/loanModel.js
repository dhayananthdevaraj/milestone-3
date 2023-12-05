const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanType: {
    type: String,
    required: true,
    index: 'text', 

  },
  description: {
    type: String,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  maximumAmount: {
    type: Number,
    required: true,
  },
});

const Loan = mongoose.model('loan', loanSchema);

module.exports = Loan;
