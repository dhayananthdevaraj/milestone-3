const userController = require('../controllers/userController');
const User = require('../models/userModel');

const Loan = require('../models/loanModel');
const loanController = require('../controllers/loanController');
const LoanApplication = require('../models/loanApplicationModel');
const loanApplicationController = require('../controllers/loanApplicationController');

 describe('userController', () => {
  describe('getUserByUsernameAndPassword', () => {
    it('should return user when a user with valid credentials is found', async () => {
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
    it('should return an error message when a user with invalid credentials is not found', async () => {
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
    it('should return a 500 status and an error message on database error', async () => {
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
    it('should add a user and respond with a 200 status code and success message', async () => {
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
  
  
  
   it('should handle errors and respond with a 500 status code and error message', async () => {
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
    it('should return all loans and respond with a 200 status code', async () => {
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

    it('should handle errors and respond with a 500 status code and error message', async () => {
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
    it('should return a loan by ID and respond with a 200 status code', async () => {
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

    it('should handle errors and respond with a 500 status code and error message', async () => {
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

    it('should handle not finding a loan and respond with a 404 status code', async () => {
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
    it('should add a loan and respond with a 200 status code and a success message', async () => {
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

    it('should handle errors and respond with a 500 status code and an error message', async () => {
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
    it('should update a loan and respond with a 200 status code and a success message', async () => {
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


    it('should handle not finding a loan and respond with a 404 status code', async () => {
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

    it('should handle errors and respond with a 500 status code and an error message', async () => {
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
    it('should delete a loan and respond with a 200 status code and a success message', async () => {
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

    it('should handle not finding a loan and respond with a 404 status code and an appropriate message', async () => {
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

    it('should handle errors and respond with a 500 status code and an error message', async () => {
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
  // describe('getAllLoanApplications', () => {
  //   it('should return paginated loan applications and respond with a 200 status code', async () => {
  //     // Mock request body with pagination parameters
  //     const req = {
  //       data: {
  //         searchValue: 'test',
  //         sortValue: '1',
  //         statusFilter: '1',
  //         page: '1',
  //         pageSize: '10',
  //       },
  //     };
  
  //     // Create sample loan applications for testing
  //     const loanApplications = [
  //       {
  //         userId: 'user1',
  //         userName: 'User 1',
  //         loanType: 'Personal',
  //         requestedAmount: 10000,
  //         submissionDate: new Date(),
  //         employmentStatus: 'Employed',
  //         income: 50000,
  //         creditScore: 700,
  //         loanStatus: 1,
  //       },
  //       {
  //         userId: 'user2',
  //         userName: 'User 2',
  //         loanType: 'Home',
  //         requestedAmount: 200000,
  //         submissionDate: new Date(),
  //         employmentStatus: 'Self-employed',
  //         income: 75000,
  //         creditScore: 680,
  //         loanStatus: 1,
  //       },
  //     ];
  
  //     // Mock the LoanApplication.find method to resolve with the sample loan applications
  //     LoanApplication.find = jest.fn().mockResolvedValue(loanApplications);
  
  //     // Mock Express response object
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     // Call the controller function
  //     await loanApplicationController.getAllLoanApplications(req, res);
  
  //     // Assertions
  //     expect(LoanApplication.find).toHaveBeenCalledWith({
  //       $and: [
  //         {
  //           $or: [
  //             { userName: expect.any(RegExp) },
  //             { loanType: expect.any(RegExp) },
  //           ],
  //         },
  //         { loanStatus: '1' },
  //       ],
  //     });
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       data: loanApplications,
  //       length: loanApplications.length,
  //     });
  //   });
  
  //   it('should handle errors and respond with a 500 status code and error message', async () => {
  //     // Mock an error to be thrown when calling LoanApplication.find
  //     const error = new Error('Database error');
  
  //     // Mock the LoanApplication.find method to reject with an error
  //     LoanApplication.find = jest.fn().mockRejectedValue(error);
  
  //     // Mock Express response object
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  
  //     // Call the controller function
  //     await loanApplicationController.getAllLoanApplications({}, res);
  
  //     // Assertions
  //     expect(LoanApplication.find).toHaveBeenCalledWith({});
  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  //   });
  // });
  // describe('getAllLoanApplications', () => {
  //   it('should return paginated loan applications and respond with a 200 status code', async () => {
  //     // Mock request body with pagination parameters
  //     const req = {
  //       body: {
  //         searchValue: 'test',
  //         sortValue: '1',
  //         statusFilter: '1',
  //         page: '1',
  //         pageSize: '10',
  //         sortBy: 'submissionDate', // Adjusted to match the changes
  //       },
  //     };
    
  //     // Sample loan applications for testing
  //     const loanApplications = [
  //       {
  //         userId: 'user1',
  //         userName: 'User 1',
  //         loanType: 'Personal',
  //         requestedAmount: 10000,
  //         submissionDate: new Date(),
  //         employmentStatus: 'Employed',
  //         income: 50000,
  //         creditScore: 700,
  //         loanStatus: 1,
  //       },
  //       {
  //         userId: 'user2',
  //         userName: 'User 2',
  //         loanType: 'Home',
  //         requestedAmount: 200000,
  //         submissionDate: new Date(),
  //         employmentStatus: 'Self-employed',
  //         income: 75000,
  //         creditScore: 680,
  //         loanStatus: 1,
  //       },
  //     ];
    
  //     // Mock the LoanApplication.find method to resolve with the sample loan applications
  //     LoanApplication.find = jest.fn().mockResolvedValue(loanApplications);
    
  //     // Mock Express response object
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
    
  //     // Call the controller function
  //     await loanApplicationController.getAllLoanApplications(req, res);
    
  //     // Assertions
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       data: loanApplications,
  //       length: loanApplications.length,
  //     });
  //   });
    
    
  
  //   // it('should handle errors and respond with a 500 status code and error message', async () => {
  //   //   // Mock an error to be thrown when calling LoanApplication.find
  //   //   const error = new Error('Database error');
  
  //   //   // Mock the LoanApplication.find method to reject with an error
  //   //   LoanApplication.find = jest.fn().mockRejectedValue(error);
  
  //   //   // Mock Express response object
  //   //   const res = {
  //   //     status: jest.fn().mockReturnThis(),
  //   //     json: jest.fn(),
  //   //   };
  
  //   //   // Call the controller function
  //   //   await loanApplicationController.getAllLoanApplications({}, res);
  
  //   //   // Assertions
  //   //   expect(res.status).toHaveBeenCalledWith(500);
  //   // });
  
  
  
  // });
  
    describe('getLoanApplicationByUserId', () => {
        it('should return a loan application for a valid userId and respond with a 200 status code', async () => {
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
    
   
    
        it('should handle errors and respond with a 500 status code and an error message', async () => {
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
        it('should add a loan application and respond with a 200 status code and a success message', async () => {
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
    
        it('should handle errors and respond with a 500 status code and an error message', async () => {
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
          it('should update a loan application and respond with a 200 status code and a success message', async () => {
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
      
          it('should handle not finding a loan application and respond with a 404 status code', async () => {
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
      
          it('should handle errors and respond with a 500 status code and an error message', async () => {
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
        it('should_delete_a_loan_application_with_success message', async () => {
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
    
        it('should_handle_not_finding_a_loan_application_and_respond_with_a_404_status_code', async () => {
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
    
        it('should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
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