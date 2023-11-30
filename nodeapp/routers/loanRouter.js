
const express = require("express");
const loanController = require("../controllers/loanController");
const router = express.Router();

router.get("/getAllLoans", loanController.getAllLoans);
router.get("/getLoanById/:id", loanController.getLoanById);
router.post("/addLoan", loanController.addLoan);
router.put("/updateLoan/:id", loanController.updateLoan);
router.delete("/deleteLoan/:id", loanController.deleteLoan);

module.exports = router;
