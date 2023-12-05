const express = require("express");
const loanApplicationController = require("../controllers/loanApplicationController");
const router = express.Router();

router.post("/getAllLoanApplications", loanApplicationController.getAllLoanApplications);
router.get("/getLoanApplicationById/:id", loanApplicationController.getLoanApplicationById);
router.get("/getLoanApplicationByUserId/:userId", loanApplicationController.getLoanApplicationByUserId);
router.post("/addLoanApplication", loanApplicationController.addLoanApplication);
router.put("/updateLoanApplication/:id", loanApplicationController.updateLoanApplication);
router.delete("/deleteLoanApplication/:id", loanApplicationController.deleteLoanApplication);

module.exports = router;
