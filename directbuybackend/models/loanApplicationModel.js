const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  loanType: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  model:{
    type: Date,
    required: true,
  },
  purchasePrice:{
    type: Number,
    required: true,
  },
  loanStatus: {
    type: Number,
    required: true,
    default: 1,
  },
  address:{
    type: String,
    required: true,
  }
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;
