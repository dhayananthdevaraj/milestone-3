const userController = require('../controllers/userController');
const User = require('../models/userModel');

const Loan = require('../models/loanModel');
const loanController = require('../controllers/loanController');
const LoanApplication = require('../models/loanApplicationModel');
const loanApplicationController = require('../controllers/loanApplicationController');

 describe('userController', () => {
  describe('getUserByUsernameAndPassword', () => {
   test('should_return_user_when_a_user_with_valid_credentials_is_found_login', async () => {
      const req = {
        body: { username: 'validUser', password: 'validPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      // Mock the User.findOne method to return a specific user object
      const expectedUser = {
        _id: '653d0bdc4800966dd075e359',
        username: 'validUser', // Match the username in req
        role: 'admin',
      };
      User.findOne = jest.fn().mockResolvedValue(expectedUser);
    
      await userController.getUserByUsernameAndPassword(req, res);
    
      expect(User.findOne).toHaveBeenCalledWith({
        username: 'validUser',
        password: 'validPassword',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedUser); // Verify the response matches the expected user object
    });
   test('should_return_an_error_message_when_a_user_with_invalid_credentials_is_not_found_login', async () => {
      const req = {
        body: { username: 'invalidUser', password: 'invalidPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the User.findOne method to return null (no user found)
      User.findOne = jest.fn().mockResolvedValue(null);

      await userController.getUserByUsernameAndPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        username: 'invalidUser',
        password: 'invalidPassword',
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
   test('should_return_a_500_status_and_an_error_message_on_database_error_login', async () => {
      const req = {
        body: { username: 'validUser', password: 'validPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      // Mock the User.findOne method to reject with an error
      const error = new Error('Database error');
      User.findOne = jest.fn().mockRejectedValue(error);
    
      await userController.getUserByUsernameAndPassword(req, res);
    
      expect(User.findOne).toHaveBeenCalledWith({
        username: 'validUser',
        password: 'validPassword',
      });
      expect(res.status).toHaveBeenCalledWith(500); // Verify 500 status for the error
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' }); // Verify the error message
    });
  });
  describe('addUser', () => {
   test('should_add_a_user_and_respond_with_a_200_status_code_and_success_message_adduser', async () => {
      // Test case for successful user addition
      const req = {
        body: { username: 'newUser', password: 'newPassword', role: 'admin' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      // Mock User.create to resolve with a mock user object
      User.create = jest.fn().mockResolvedValue({
        username: 'newUser',
        password:'newPassword',
        role: 'admin',
      });
    
      await userController.addUser(req, res);
    
      expect(User.create).toHaveBeenCalledWith(req.body); // Verify the User.create call
      expect(res.status).toHaveBeenCalledWith(200); // Verify 200 status for success
      expect(res.json).toHaveBeenCalledWith({ message: 'Success' }); // Verify the success message
    });
  test('should_handle_errors_and_respond_with_a_500_status_code_and_error_message_adduser', async () => {
      // Test case for error handling
      const req = {
        body: { username: 'newUser' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock User.create to reject with an error
      const error = new Error('Database error');
      User.create = jest.fn().mockRejectedValue(error);

      await userController.addUser(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body); // Verify the User.create call
      expect(res.status).toHaveBeenCalledWith(500); // Verify 500 status for the error
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' }); // Verify the error message
    });
  });
});

   describe('loanController', () => {
  describe('getAllLoans', () => {
   test('should_return_all_loans_and_respond_with_a_200_status_code_getallloans', async () => {
      const loans = [
        { _id: 'loan1', loanType: 'Type 1', description: 'Description 1', interestRate: 5, maximumAmount: 10000 },
        { _id: 'loan2', loanType: 'Type 2', description: 'Description 2', interestRate: 4, maximumAmount: 15000 },
      ];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.find = jest.fn().mockResolvedValue(loans);

      await loanController.getAllLoans(req, res);

      expect(Loan.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(loans);
    });
   test('should_handle_errors_and_respond_with_a_500_status_code_and_error_message_getallloans', async () => {
      const error = new Error('Database error');
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.find = jest.fn().mockRejectedValue(error);

      await loanController.getAllLoans(req, res);

      expect(Loan.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
  describe('getLoanById', () => {
   test('should_return_a_loan_by_id_and_respond_with_a_200_status_code', async () => {
      const loan = {
        _id: 'loan1',
        loanType: 'Type 1',
        description: 'Description 1',
        interestRate: 5,
        maximumAmount: 10000,
      };
      const req = { params: { id: 'loan1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.findById = jest.fn().mockResolvedValue(loan);

      await loanController.getLoanById(req, res);

      expect(Loan.findById).toHaveBeenCalledWith('loan1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(loan);
    });
   test('should_handle_errors_and_respond_with_a_500_status_code_and_error_message_getloanbyid', async () => {
      const error = new Error('Database error');
      const req = { params: { id: 'loan1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.findById = jest.fn().mockRejectedValue(error);

      await loanController.getLoanById(req, res);

      expect(Loan.findById).toHaveBeenCalledWith('loan1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

   test('should_handle_not_finding_a_loan_and_respond_with_a_404_status_code_getloanbyid', async () => {
      const req = { params: { id: 'nonExistentLoan' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.findById = jest.fn().mockResolvedValue(null);

      await loanController.getLoanById(req, res);

      expect(Loan.findById).toHaveBeenCalledWith('nonExistentLoan');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Loan not found' });
    });
  });
  describe('addLoan', () => {
   test('should_add_a_loan_and_respond_with_a_200_status_code_and_a_success_message_addloan', async () => {
      const req = {
        body: {
          loanType: 'New Loan Type',
          description: 'New Loan Description',
          interestRate: 5.5,
          maximumAmount: 20000,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.create = jest.fn().mockResolvedValue(req.body); // Simulate the created loan

      await loanController.addLoan(req, res);

      expect(Loan.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Loan added Successfully' });
    });

   test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_addloan', async () => {
      const error = new Error('Database error');
      const req = {
        body: {
          loanType: 'New Loan Type',
          description: 'New Loan Description',
          interestRate: 5.5,
          maximumAmount: 20000,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Loan.create = jest.fn().mockRejectedValue(error);

      await loanController.addLoan(req, res);

      expect(Loan.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updateLoan', () => {
   test('should_update_a_loan_and_respond_with_a_200_status_code_and_a_success_message_updateloan', async () => {
      const loanId = 'loan1';
      const req = {
        params: { id: loanId },
        body: {
          loanType: 'Updated Loan Type',
          description: 'Updated Loan Description',
          interestRate: 6.0,
          maximumAmount: 25000,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate finding the loan by ID

      // Simulate updating the loan by ID
      Loan.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

      await loanController.updateLoan(req, res);

      expect(Loan.findByIdAndUpdate).toHaveBeenCalledWith(loanId, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Loan updated successfully' });
    });
   test('should_handle_not_finding_a_loan_and_respond_with_a_404_status_code_updateloan', async () => {
      const loanId = 'nonExistentLoan';
      const req = {
        params: { id: loanId },
        body: {
          loanType: 'Updated Loan Type',
          description: 'Updated Loan Description',
          interestRate: 6.0,
          maximumAmount: 25000,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate not finding the loan by ID (returning null)
      Loan.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await loanController.updateLoan(req, res);

      expect(Loan.findByIdAndUpdate).toHaveBeenCalledWith(loanId, req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: `Cannot find any loan` });
    });

   test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_updateloan', async () => {
      const loanId = 'loan1';
      const error = new Error('Database error');
      const req = {
        params: { id: loanId },
        body: {
          loanType: 'Updated Loan Type',
          description: 'Updated Loan Description',
          interestRate: 6.0,
          maximumAmount: 25000,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate a database error during loan update
      Loan.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await loanController.updateLoan(req, res);

      expect(Loan.findByIdAndUpdate).toHaveBeenCalledWith(loanId, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
 
 
 
   describe('deleteLoan', () => {
   test('should_delete_a_loan_and_respond_with_a_200_status_code_and_a_success_message_deleteloan', async () => {
      const loanId = 'loan1';
      const req = {
        params: { id: loanId },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate deleting the loan by ID
      Loan.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: loanId });

      await loanController.deleteLoan(req, res);

      expect(Loan.findByIdAndDelete).toHaveBeenCalledWith(loanId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Loan deleted successfully' });
    });

   test('should_handle_not_finding_a_loan_and_respond_with_a_404_status_code_and_an_appropriate_message_deleteloan', async () => {
      const loanId = 'nonExistentLoan';
      const req = {
        params: { id: loanId },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate not finding the loan by ID (returning null)
      Loan.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await loanController.deleteLoan(req, res);

      expect(Loan.findByIdAndDelete).toHaveBeenCalledWith(loanId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any loan' });
    });

   test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_deleteloan', async () => {
      const loanId = 'loan1';
      const error = new Error('Database error');
      const req = {
        params: { id: loanId },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate a database error during loan deletion
      Loan.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await loanController.deleteLoan(req, res);

      expect(Loan.findByIdAndDelete).toHaveBeenCalledWith(loanId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

});



describe('loanApplicationController', () => {

    describe('getLoanApplicationByUserId', () => {
       test('should_return_a_loan_application_for_a_valid_userid_and_respond_with_a_200_status_code_getloanapplicationbyuserid', async () => {
          // Sample userId and corresponding loan application
          const userId = 'user123';
          const loanApplicationData = {
            userId: userId,
            userName: 'User 1',
            loanType: 'Personal',
            requestedAmount: 10000,
            submissionDate: new Date(),
            employmentStatus: 'Employed',
            income: 50000,
            creditScore: 700,
            loanStatus: 1,
          };
    
          // Mock the LoanApplication.find method to resolve with the sample loan application
          LoanApplication.find = jest.fn().mockResolvedValue([loanApplicationData]);
    
          // Mock Express request and response objects
          const req = { params: { userId: userId } };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.getLoanApplicationByUserId(req, res);
    
          // Assertions
          expect(LoanApplication.find).toHaveBeenCalledWith({ userId });
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith([loanApplicationData]);
        });

       test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_getloanapplicationbyuserid', async () => {
          // Mock an error to be thrown when calling LoanApplication.find
          const error = new Error('Database error');
    
          // Mock the LoanApplication.find method to reject with an error
          LoanApplication.find = jest.fn().mockRejectedValue(error);
    
          // Mock Express request and response objects
          const req = { params: { userId: 'user123' } };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.getLoanApplicationByUserId(req, res);
    
          // Assertions
          expect(LoanApplication.find).toHaveBeenCalledWith({ userId: 'user123' });
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
      });
      describe('addLoanApplication', () => {
       test('should_add_a_loan_application_and_respond_with_a_200_status_code_and_a_success_message_addloanapplication', async () => {
          // Sample loan application data
          const loanApplicationData = {
            userId: 'user123',
            userName: 'User 1',
            loanType: 'Personal',
            requestedAmount: 10000,
            submissionDate: new Date(),
            employmentStatus: 'Employed',
            income: 50000,
            creditScore: 700,
            loanStatus: 1,
          };
    
          // Mock the LoanApplication.create method to resolve with the sample loan application data
          LoanApplication.create = jest.fn().mockResolvedValue(loanApplicationData);
    
          // Mock Express request and response objects
          const req = { body: loanApplicationData };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.addLoanApplication(req, res);
    
          // Assertions
          expect(LoanApplication.create).toHaveBeenCalledWith(loanApplicationData);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: "Added Successfully" });
        });
    
       test('addloanapplication_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_addloanapplication', async () => {
          // Mock an error to be thrown when calling LoanApplication.create
          const error = new Error('Database error');
    
          // Mock the LoanApplication.create method to reject with an error
          LoanApplication.create = jest.fn().mockRejectedValue(error);
    
          // Mock Express request and response objects
          const req = { body: {} };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.addLoanApplication(req, res);
    
          // Assertions
          expect(LoanApplication.create).toHaveBeenCalledWith(req.body);
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
      });
      describe('updateLoanApplication', () => {
         test('should_update_a_loan_application_and_respond_with_a_200_status_code_and_a_success_message_updateloanapplication', async () => {
            // Sample loan application data
            const loanApplicationData = {
              userId: 'user123',
              userName: 'User 1',
              loanType: 'Personal',
              requestedAmount: 10000,
              submissionDate: new Date(),
              employmentStatus: 'Employed',
              income: 50000,
              creditScore: 700,
              loanStatus: 1,
            };
      
            // Mock Express request and response objects
            const req = {
              params: { id: 'loan123' }, // Assuming 'loan123' is a valid loan application ID
              body: loanApplicationData,
            };
      
            // Mock the LoanApplication.findByIdAndUpdate method to resolve with the updated loan application data
            LoanApplication.findByIdAndUpdate = jest.fn().mockResolvedValue(loanApplicationData);
      
            // Mock the LoanApplication.findById method to resolve with the updated loan application data
            LoanApplication.findById = jest.fn().mockResolvedValue(loanApplicationData);
      
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
      
            // Call the controller function
            await loanApplicationController.updateLoanApplication(req, res);
      
            // Assertions
            expect(LoanApplication.findByIdAndUpdate).toHaveBeenCalledWith('loan123', loanApplicationData);
            expect(LoanApplication.findById).toHaveBeenCalledWith('loan123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Updated Successfully' });
          });
      
         test('should_handle_not_finding_a_loan_application_and_respond_with_a_404_status_code_updateloanapplication', async () => {
            // Mock Express request and response objects
            const req = {
              params: { id: 'nonExistentLoan' }, // Assuming 'nonExistentLoan' is not found
              body: {},
            };
      
            // Mock the LoanApplication.findByIdAndUpdate method to resolve with null (loan application not found)
            LoanApplication.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
      
            // Call the controller function
            await loanApplicationController.updateLoanApplication(req, res);
      
            // Assertions
            expect(LoanApplication.findByIdAndUpdate).toHaveBeenCalledWith('nonExistentLoan', {});
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any loan application' });
          });
      
         test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_updateloanapplication', async () => {
            // Mock an error to be thrown when calling LoanApplication.findByIdAndUpdate
            const error = new Error('Database error');
      
            // Mock Express request and response objects
            const req = {
              params: { id: 'loan123' },
              body: {},
            };
      
            // Mock the LoanApplication.findByIdAndUpdate method to reject with an error
            LoanApplication.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
      
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
      
            // Call the controller function
            await loanApplicationController.updateLoanApplication(req, res);
      
            // Assertions
            expect(LoanApplication.findByIdAndUpdate).toHaveBeenCalledWith('loan123', {});
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
          });
      });
      describe('deleteLoanApplication', () => {
       test('should_delete_a_loan_application_with_success_message_deleteloanapplication', async () => {
          // Mock Express request and response objects
          const req = {
            params: { id: 'loan123' }, // Assuming 'loan123' is a valid loan application ID
          };
    
          // Mock the LoanApplication.findByIdAndDelete method to resolve with the deleted loan application data
          LoanApplication.findByIdAndDelete = jest.fn().mockResolvedValue({
            _id: 'loan123',
            userId: 'user123',
            loanType: 'Personal',
            // Include other fields as needed
          });
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.deleteLoanApplication(req, res);
    
          // Assertions
          expect(LoanApplication.findByIdAndDelete).toHaveBeenCalledWith('loan123');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: 'Deleted Successfully' });
        });
    
       test('should_handle_not_finding_a_loan_application_and_respond_with_a_404_status_code_deleteloanapplication', async () => {
          // Mock Express request and response objects
          const req = {
            params: { id: 'nonExistentLoan' }, // Assuming 'nonExistentLoan' is not found
          };
    
          // Mock the LoanApplication.findByIdAndDelete method to resolve with null (loan application not found)
          LoanApplication.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.deleteLoanApplication(req, res);
    
          // Assertions
          expect(LoanApplication.findByIdAndDelete).toHaveBeenCalledWith('nonExistentLoan');
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any loan application' });
        });
    
       test('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message_deleteloanapplication', async () => {
          // Mock an error to be thrown when calling LoanApplication.findByIdAndDelete
          const error = new Error('Database error');
    
          // Mock Express request and response objects
          const req = {
            params: { id: 'loan123' },
          };
    
          // Mock the LoanApplication.findByIdAndDelete method to reject with an error
          LoanApplication.findByIdAndDelete = jest.fn().mockRejectedValue(error);
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          // Call the controller function
          await loanApplicationController.deleteLoanApplication(req, res);
    
          // Assertions
          expect(LoanApplication.findByIdAndDelete).toHaveBeenCalledWith('loan123');
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
      });
  });