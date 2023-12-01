import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../Components/Login";
import axios from "axios";
import { BrowserRouter , useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@testing-library/jest-dom"; // Import the extended matchers
import Signup from "../Components/Signup";
import { act } from "react-dom/test-utils";
import UserHomePage from "../UserComponents/UserHomePage";
import HomePage from "../AdminComponents/Home";
import LoanForm from "../AdminComponents/LoanForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AppliedLoansPage from "../UserComponents/AppliedLoans";
import LoanApplicationForm from "../UserComponents/LoanApplicationForm";
import MockAdapter from "axios-mock-adapter";
import LoanRequests from "../AdminComponents/LoanRequest";

jest.mock("axios");
jest.mock("react-redux");


describe("Login Component", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("login_renders_the_input_field", () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      // expect(getByText("Login")).toBeInTheDocument();
      const loginButton = screen.getByText("Login", { selector: "button" });
      expect(loginButton).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Username", { selector: "input" })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Password", { selector: "input" })
      ).toBeInTheDocument();
    });
  
    test("login_required_validation_for_input_fields", () => {
      const { getByText } = render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      const loginButton = screen.getByText("Login", { selector: "button" });
      fireEvent.click(loginButton);
      // Write expectations to verify error messages for empty fields
      expect(getByText(/Username is required/i)).toBeInTheDocument();
      expect(getByText(/Password is required/i)).toBeInTheDocument();
    });
  
    test("login_no_required_validation_for_input_fields_with_valid_data", () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      const usernameInput = screen.getByPlaceholderText("Username", {
        selector: "input",
      });
      const passwordInput = screen.getByPlaceholderText("Password", {
        selector: "input",
      });
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      const loginButton = screen.getByText("Login", { selector: "button" });
      fireEvent.click(loginButton);
      // Write expectations to verify error messages for empty fields
      let userNameError = screen.queryByText(/Username is required/i);
      let passwordError = screen.queryByText(/Password is required/i);
  
      expect(userNameError).toBeNull(); // Null means the element was not found
      expect(passwordError).toBeNull();
    });
    test("login_regular_expression_validation_for_input_fields", () => {
      const { getByText } = render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      const usernameInput = screen.getByPlaceholderText("Username", {
        selector: "input",
      });
      const passwordInput = screen.getByPlaceholderText("Password", {
        selector: "input",
      });
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "pa3" } });
      const loginButton = screen.getByText("Login", { selector: "button" });
      fireEvent.click(loginButton);
      // Write expectations to verify error messages for empty fields
      let userNameError = screen.queryByText(/Username is required/i);
      let passwordError = screen.queryByText(/Password is required/i);
      let passwordError2 = screen.queryByText(
        /Password must be at least 6 characters/i
      );
  
      expect(userNameError).toBeNull(); // Null means the element was not found
      expect(passwordError).toBeNull();
  
      expect(passwordError2).toBeInTheDocument();
    });
    test("login_should_make_an_axios_call_to_the_login_endpoint", () => {
      // Mock the Axios post method
      const mockAxiosPost = jest.spyOn(axios, "post");
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
  
      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const loginButton = screen.getByText("Login", { selector: "button" });
  
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
      // Check if Axios was called with a URL that includes the expected endpoint
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining("/user/login"),
        // expect.objectContaining({
        //   username:"testuser" ,
        //   Password:"password123"
        // })
        expect.any(Object)
      );
      // Make sure to clear the mock to avoid affecting other tests
      mockAxiosPost.mockRestore();
    });
  });
  describe("signup_component", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("signup_should_render_the_signup_form_with_fields", () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
  
      // Check if the Signup header is rendered
      const signupHeader = screen.getByText("Signup", { selector: "h2" });
      expect(signupHeader).toBeInTheDocument();
  
      // Check if the user name, password, confirm password, and role input fields are present
      const userNameInput = screen.getByPlaceholderText("UserName");
      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
      const roleSelect = screen.getByLabelText("Role");
      expect(userNameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(roleSelect).toBeInTheDocument();
  
      // Check if the Submit button is present
      const submitButton = screen.getByText("Submit", { selector: "button" });
      expect(submitButton).toBeInTheDocument();
  
      // Check if the Login button is present
      const loginButton = screen.getByText("Already have an Account?");
      expect(loginButton).toBeInTheDocument();
    });
  
    test("signup_should_show_an_error_message_when_attempting_to_submit_the_form_with_empty_fields", () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
  
      const submitButton = screen.getByText("Submit", { selector: "button" });
      fireEvent.click(submitButton);
  
      // Check if error messages for user name, password, confirm password are displayed
      const userNameError = screen.getByText("Username is required");
      const passwordError = screen.getByText("Password is required");
      const confirmPasswordError = screen.getByText(
        "Confirm Password is required"
      );
      expect(userNameError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(confirmPasswordError).toBeInTheDocument();
    });
  
    test("signup_should_validate_password_length_when_entering_a_password", () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
  
      const passwordInput = screen.getByPlaceholderText("Password");
      fireEvent.change(passwordInput, { target: { value: "123" } });
  
      // Check if the error message for password length is displayed
      const passwordError = screen.getByText(
        "Password must be at least 6 characters"
      );
      expect(passwordError).toBeInTheDocument();
    });
  
    test("signup_should_show_an_error_message_when_passwords_do_not_match", () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
  
      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
  
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password456" },
      });
  
      // Check if the error message for password match is displayed
      const confirmPasswordError = screen.getByText("Passwords do not match");
      expect(confirmPasswordError).toBeInTheDocument();
    });
  
    test("signup_make_an_axios_call_to_the_endpoint_with_valid_data", () => {
      const mockAxiosPost = jest.spyOn(axios, "post");
  
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
  
      // Typing in the user name field should clear the error message
      const userNameInput = screen.getByPlaceholderText("UserName");
      fireEvent.change(userNameInput, { target: { value: "testuser" } });
  
      // Typing in the password field should clear the error message
      const passwordInput = screen.getByPlaceholderText("Password");
      fireEvent.change(passwordInput, { target: { value: "password123" } });
  
      // Typing in the confirm password field should clear the error message
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password123" },
      });
  
      const submitButton = screen.getByText("Submit", { selector: "button" });
      fireEvent.click(submitButton);
  
      // Use screen.queryByText to check if the elements are not present
      const userNameError = screen.queryByText("User Name is required");
      const passwordError = screen.queryByText("Password is required");
      const confirmPasswordError = screen.queryByText(
        "Confirm Password is required"
      );
  
      expect(userNameError).toBeNull(); // Null means the element was not found
      expect(passwordError).toBeNull(); // Null means the element was not found
      expect(confirmPasswordError).toBeNull(); // Null means the element was not found
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining("user/signup"),
        expect.any(Object)
      );
  
      // Make sure to clear the mock to avoid affecting other tests
      mockAxiosPost.mockRestore();
    });
  });
  describe("LoanForm Component", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });
      test("loanform_should_render_all_input_fields", async () => {
        await act(async () => {
          render(
            <BrowserRouter>
              <LoanForm />
            </BrowserRouter>
          );
        });
    
        const loanTypeInput = screen.getByPlaceholderText("Loan Type");
        const descriptionInput = screen.getByPlaceholderText("Loan Description");
        const interestRateInput = screen.getByPlaceholderText("Interest Rate");
        const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
        const addLoanButton = screen.getByText("Add Loan");
    
        expect(loanTypeInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
        expect(interestRateInput).toBeInTheDocument();
        expect(maxAmountInput).toBeInTheDocument();
        expect(addLoanButton).toBeInTheDocument();
    
        // You can add more specific assertions for each input field if needed
      });
    
      test("loanform_should_handle_adding_a_new_loan_with_validation", async () => {
        jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
    
        await act(async () => {
          render(
            <BrowserRouter>
              <LoanForm />
            </BrowserRouter>
          );
        });
    
        // Simulate user input for adding a new loan
        const loanTypeInput = screen.getByPlaceholderText("Loan Type");
        fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });
    
        const descriptionInput = screen.getByPlaceholderText("Loan Description");
        fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });
    
        const interestRateInput = screen.getByPlaceholderText("Interest Rate");
        fireEvent.change(interestRateInput, { target: { value: "5" } });
    
        const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
        fireEvent.change(maxAmountInput, { target: { value: "2000" } });
    
        const addLoanButton = screen.getByText("Add Loan");
        fireEvent.click(addLoanButton);
    
        // Your test assertions for adding a new loan with validation
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringMatching("/loan/addLoan"),
          expect.any(Object)
        );
      });
      test("loanform_should_handle_adding_a_new_loan_with_successmessage", async () => {
        jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
    
        await act(async () => {
          render(
            <BrowserRouter>
              <LoanForm />
            </BrowserRouter>
          );
        });
    
        // Simulate user input for adding a new loan
        const loanTypeInput = screen.getByPlaceholderText("Loan Type");
        fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });
    
        const descriptionInput = screen.getByPlaceholderText("Loan Description");
        fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });
    
        const interestRateInput = screen.getByPlaceholderText("Interest Rate");
        fireEvent.change(interestRateInput, { target: { value: "5" } });
    
        const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
        fireEvent.change(maxAmountInput, { target: { value: "2000" } });
    
        const addLoanButton = screen.getByText("Add Loan");
        fireEvent.click(addLoanButton);
    
        // Your test assertions for adding a new loan with validation
       
        const successMessage = await screen.findByText("Successfully Added!");
        expect(successMessage).toBeInTheDocument();
    
      });
      test("loanform_should_handle_validation_errors_when_adding_a_new_loan", async () => {
        // Mock Axios to resolve as an error (status 400) to simulate validation error
    
        await act(async () => {
          render(
            <BrowserRouter>
              <LoanForm />
            </BrowserRouter>
          );
        });
    
        // Simulate user input for adding a new loan with missing fields
        const addLoanButton = screen.getByText("Add Loan");
        fireEvent.click(addLoanButton);
    
        // Your test assertions for handling validation errors
        // For example, you can expect to find error messages on the screen
        const loanTypeError = screen.getByText("Loan Type is required");
        const descriptionError = screen.getByText("Description is required");
        const interestRateError = screen.getByText("Interest Rate is required");
        const maxAmountError = screen.getByText("Maximum Amount is required");
        expect(maxAmountError).toBeInTheDocument();
        expect(interestRateError).toBeInTheDocument();
        expect(descriptionError).toBeInTheDocument();
        expect(loanTypeError).toBeInTheDocument();
      });
    });
describe("LoanForm Component", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("loanform_should_render_all_input_fields", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <LoanForm />
          </BrowserRouter>
        );
      });
  
      const loanTypeInput = screen.getByPlaceholderText("Loan Type");
      const descriptionInput = screen.getByPlaceholderText("Loan Description");
      const interestRateInput = screen.getByPlaceholderText("Interest Rate");
      const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
      const addLoanButton = screen.getByText("Add Loan");
  
      expect(loanTypeInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(interestRateInput).toBeInTheDocument();
      expect(maxAmountInput).toBeInTheDocument();
      expect(addLoanButton).toBeInTheDocument();
  
      // You can add more specific assertions for each input field if needed
    });
  
    test("loanform_should_handle_adding_a_new_loan_with_validation", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <LoanForm />
          </BrowserRouter>
        );
      });
  
      // Simulate user input for adding a new loan
      const loanTypeInput = screen.getByPlaceholderText("Loan Type");
      fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });
  
      const descriptionInput = screen.getByPlaceholderText("Loan Description");
      fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });
  
      const interestRateInput = screen.getByPlaceholderText("Interest Rate");
      fireEvent.change(interestRateInput, { target: { value: "5" } });
  
      const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
      fireEvent.change(maxAmountInput, { target: { value: "2000" } });
  
      const addLoanButton = screen.getByText("Add Loan");
      fireEvent.click(addLoanButton);
  
      // Your test assertions for adding a new loan with validation
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching("/loan/addLoan"),
        expect.any(Object)
      );
    });
    test("loanform_should_handle_adding_a_new_loan_with_successmessage", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <LoanForm />
          </BrowserRouter>
        );
      });
  
      // Simulate user input for adding a new loan
      const loanTypeInput = screen.getByPlaceholderText("Loan Type");
      fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });
  
      const descriptionInput = screen.getByPlaceholderText("Loan Description");
      fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });
  
      const interestRateInput = screen.getByPlaceholderText("Interest Rate");
      fireEvent.change(interestRateInput, { target: { value: "5" } });
  
      const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
      fireEvent.change(maxAmountInput, { target: { value: "2000" } });
  
      const addLoanButton = screen.getByText("Add Loan");
      fireEvent.click(addLoanButton);
  
      // Your test assertions for adding a new loan with validation
     
      const successMessage = await screen.findByText("Successfully Added!");
      expect(successMessage).toBeInTheDocument();
  
    });
    test("loanform_should_handle_validation_errors_when_adding_a_new_loan", async () => {
      // Mock Axios to resolve as an error (status 400) to simulate validation error
  
      await act(async () => {
        render(
          <BrowserRouter>
            <LoanForm />
          </BrowserRouter>
        );
      });
  
      // Simulate user input for adding a new loan with missing fields
      const addLoanButton = screen.getByText("Add Loan");
      fireEvent.click(addLoanButton);
  
      // Your test assertions for handling validation errors
      // For example, you can expect to find error messages on the screen
      const loanTypeError = screen.getByText("Loan Type is required");
      const descriptionError = screen.getByText("Description is required");
      const interestRateError = screen.getByText("Interest Rate is required");
      const maxAmountError = screen.getByText("Maximum Amount is required");
      expect(maxAmountError).toBeInTheDocument();
      expect(interestRateError).toBeInTheDocument();
      expect(descriptionError).toBeInTheDocument();
      expect(loanTypeError).toBeInTheDocument();
    });
  });
  jest.mock("react-router-dom", () => {
    return {
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => jest.fn(),
    };
  });
  describe("AppliedLoansPage Component", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];
  
    beforeAll(() => {
      // Mock the axios.get function for fetching applied loan data
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
    });
  
    afterAll(() => {
      // Restore the original axios.get implementation
      jest.restoreAllMocks();
    });
  
    test("should_render_applied_loans_page_component_with_loan_data", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      expect(screen.getByText("Applied Loans")).toBeInTheDocument();
      expect(screen.getByText("Loan 1")).toBeInTheDocument();
      expect(screen.getByText("Loan 2")).toBeInTheDocument();
      // Additional assertions for other rows
    });
  
    test("should_sort_applied_loans_in_ascending_order", async () => {
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
      ];
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      const ascendingButton = screen.getByText("⬆️");
      fireEvent.click(ascendingButton);
  
      expect(screen.getByText("Loan 1")).toBeInTheDocument();
      expect(screen.queryByText("Loan 6")).toBeNull();
      // Additional assertions for other rows in ascending order
    });
  
    test("should_sort_applied_loans_in_descending_order", async () => {
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 8,
          loanType: "Loan 8",
          submissionDate: "2023-10-12",
          loanStatus: 0,
        },
      ];
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      const descendingButton = screen.getByText("⬇️");
      fireEvent.click(descendingButton);
  
      expect(screen.getByText("Loan 8")).toBeInTheDocument();
      expect(screen.queryByText("Loan 1")).toBeNull();
  
      // Additional assertions for other rows in descending order
    });
  
    test("should_navigate_to_the_next_page_in_pagination", async () => {
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
      ];
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
  
      expect(screen.getByText("Loan 6")).toBeInTheDocument();
      // Additional assertions for other rows on the next page
    });
  
    test("should_navigate_to_the_previous_page_in_pagination", async () => {
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
      ];
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      expect(screen.queryByText("Loan 1")).toBeNull();
  
      const previousButton = screen.getByText("Prev");
      fireEvent.click(previousButton);
  
      expect(screen.getByText("Loan 1")).toBeInTheDocument();
      // Additional assertions for other rows on the previous page
    });
  
    test("should_filter_applied_loans_based_on_search_input", async () => {
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
      ];
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
      });
  
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "Loan 3" } });
  
      expect(screen.getByText("Loan 3")).toBeInTheDocument();
      expect(screen.queryByText("Loan 1")).toBeNull();
      // Additional assertions for other rows
    });
    test("should_handle_applied_loan_deletion", async () => {
      // Mock the axios.get function for fetching loan data
      const mockAppliedLoansData = [
        {
          _id: 1,
          loanType: "Loan 1",
          submissionDate: "2023-10-01",
          loanStatus: 0,
        },
        {
          _id: 2,
          loanType: "Loan 2",
          submissionDate: "2023-10-02",
          loanStatus: 1,
        },
        {
          _id: 3,
          loanType: "Loan 3",
          submissionDate: "2023-10-03",
          loanStatus: 0,
        },
        {
          _id: 4,
          loanType: "Loan 4",
          submissionDate: "2023-10-04",
          loanStatus: 1,
        },
        {
          _id: 5,
          loanType: "Loan 5",
          submissionDate: "2023-10-05",
          loanStatus: 0,
        },
        {
          _id: 6,
          loanType: "Loan 6",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
        {
          _id: 7,
          loanType: "Loan 7",
          submissionDate: "2023-10-09",
          loanStatus: 1,
        },
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  
      // Mock the axios.delete function for deleting a loan
      jest.spyOn(axios, "delete").mockResolvedValue({ status: 200 });
  
      // Create a promise to wait for the state update
      const promise = Promise.resolve();
  
      await act(async () => {
        render(
          <BrowserRouter>
            <AppliedLoansPage />
          </BrowserRouter>
        );
        await promise; // Wait for the promise to resolve
      });
  
      // Simulate clicking the "Delete" button for the first loan
      const deleteButtons = screen.getAllByText("Delete", { exact: false });
      const firstDeleteButton = deleteButtons[0];
      fireEvent.click(firstDeleteButton);
  
      // Check if the delete confirmation popup is displayed
      const deletePopup = screen.getByText("Are you sure you want to delete?");
      expect(deletePopup).toBeInTheDocument();
  
      // Simulate confirming the delete
      const confirmDeleteButton = screen.getByText("Yes, Delete");
      fireEvent.click(confirmDeleteButton);
  
      // Check if the axios.delete function was called with the correct URL
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringMatching(`loanApplication/deleteLoanApplication/`)
      );
    });
  });
  describe("Adminhomepage", () => {
    const queryClient = new QueryClient();
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("admin_home_page_displaying_data_in_the_grid", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      for (const loan of mockLoanRequestsData) {
        expect(screen.getByText(loan.loanType)).toBeInTheDocument();
        expect(screen.getByText("$" + loan.maximumAmount)).toBeInTheDocument();
        expect(screen.getByText(`${loan.interestRate}%`)).toBeInTheDocument();
        expect(screen.getByText(loan.description)).toBeInTheDocument();
      }
    });
    test("admin_home_page_filters_loans_based_on_search_input", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
        {
          _id: "6",
          loanType: "Mortgage Loan",
          maximumAmount: 100000,
          interestRate: 3.5,
          description: "Your dream home awaits.",
        },
        {
          _id: "7",
          loanType: "Credit Card Loan",
          maximumAmount: 5000,
          interestRate: 15,
          description: "Convenient credit card loan.",
        },
        {
          _id: "8",
          loanType: "Emergency Loan",
          maximumAmount: 1000,
          interestRate: 10,
          description: "Get quick financial help.",
        },
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Type 'Car' into the search input
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "Car" } });
  
      // Assert that 'Car Loan' should be displayed, but 'Home Loan' should not
      expect(screen.getByText("Car Loan")).toBeInTheDocument();
      expect(screen.queryByText("Home Loan")).toBeNull();
    });
    test("admin_home_page_displaying_the_required_buttons", async () => {
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Assert that the "Create New" button is present
      const createNewButton = screen.getByText("Create New", {
        selector: "button",
      });
      expect(createNewButton).toBeInTheDocument();
  
      // Assert that the "Loans Requested" button is present
      const loansRequestedButton = screen.getByText("Loans Requested", {
        selector: "button",
      });
      expect(loansRequestedButton).toBeInTheDocument();
  
      // Assert that the "Logout" button is present
      const logoutButton = screen.getByText("Logout", { selector: "button" });
      expect(logoutButton).toBeInTheDocument();
    });
    test("admin_home_page_sort_loans_in_ascending_order", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 13,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 1,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 27,
          description: "Grow your business.",
        },
        // Add more data here...
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Click the ascending sort button
      const ascendingSortButton = screen.getByText("⬆️");
      fireEvent.click(ascendingSortButton);
  
      // Check if the data is sorted in ascending order
      // Check if the data is sorted in ascending order
      const sortedLoanTypes = screen.getAllByRole("cell");
      expect(sortedLoanTypes[0]).toHaveTextContent("Education Loan");
      // Add more assertions for other data fields as needed...
    });
  
    test("admin_home_page_sort_loans_in_descending_order", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 13,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 1,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 27,
          description: "Grow your business.",
        },
        // Add more data here...
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Click the ascending sort button
      const ascendingSortButton = screen.getByText("⬇️");
      fireEvent.click(ascendingSortButton);
  
      // Check if the data is sorted in ascending order
      // Check if the data is sorted in ascending order
      const sortedLoanTypes = screen.getAllByRole("cell");
      expect(sortedLoanTypes[0]).toHaveTextContent("Business Loan");
      // Add more assertions for other data fields as needed...
    });
  
    test("admin_home_page_pagination_next_button", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
        {
          _id: "6",
          loanType: "Mortgage Loan",
          maximumAmount: 100000,
          interestRate: 3.5,
          description: "Your dream home awaits.",
        },
        {
          _id: "7",
          loanType: "Credit Card Loan",
          maximumAmount: 5000,
          interestRate: 15,
          description: "Convenient credit card loan.",
        },
        {
          _id: "8",
          loanType: "Emergency Loan",
          maximumAmount: 1000,
          interestRate: 10,
          description: "Get quick financial help.",
        },
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Type 'Car' into the search input
      expect(screen.getByText("Business Loan")).toBeInTheDocument();
      expect(screen.queryByText("Mortgage Loan")).toBeNull(); // Check for specific data
  
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
  
      expect(screen.getByText("Mortgage Loan")).toBeInTheDocument();
      expect(screen.queryByText("Business Loan")).toBeNull();
    });
  
    test("admin_home_page_pagination_previous_button", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
        {
          _id: "6",
          loanType: "Mortgage Loan",
          maximumAmount: 100000,
          interestRate: 3.5,
          description: "Your dream home awaits.",
        },
        {
          _id: "7",
          loanType: "Credit Card Loan",
          maximumAmount: 5000,
          interestRate: 15,
          description: "Convenient credit card loan.",
        },
        {
          _id: "8",
          loanType: "Emergency Loan",
          maximumAmount: 1000,
          interestRate: 10,
          description: "Get quick financial help.",
        },
      ];
  
      jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Type 'Car' into the search input
      expect(screen.getByText("Business Loan")).toBeInTheDocument();
      expect(screen.queryByText("Mortgage Loan")).toBeNull(); // Check for specific data
  
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
  
      expect(screen.getByText("Mortgage Loan")).toBeInTheDocument();
      expect(screen.queryByText("Business Loan")).toBeNull();
  
      const prevButton = screen.getByText("Prev");
      fireEvent.click(prevButton);
  
      expect(screen.getByText("Business Loan")).toBeInTheDocument();
      expect(screen.queryByText("Mortgage Loan")).toBeNull();
    });
    test("should_trigger_edit_action_when_edit_button_is_clicked", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
        {
          _id: "6",
          loanType: "Mortgage Loan",
          maximumAmount: 100000,
          interestRate: 3.5,
          description: "Your dream home awaits.",
        },
        {
          _id: "7",
          loanType: "Credit Card Loan",
          maximumAmount: 5000,
          interestRate: 15,
          description: "Convenient credit card loan.",
        },
        {
          _id: "8",
          loanType: "Emergency Loan",
          maximumAmount: 1000,
          interestRate: 10,
          description: "Get quick financial help.",
        },
      ];
      const navigate = jest.fn();
  
      axios.get.mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      // Mock the useNavigate function
      jest
        .spyOn(require("react-router-dom"), "useNavigate")
        .mockReturnValue(navigate);
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Click the "Edit" button for the first loan
      const editButtons = screen.getAllByText("Edit");
      fireEvent.click(editButtons[0]);
  
      // Check if it navigated to the correct URL
      expect(navigate).toHaveBeenCalledWith("/newloan/1");
    });
    test("should_trigger_delete_action_when_delete_button_is_clicked", async () => {
      let mockLoanRequestsData = [
        {
          _id: "1",
          loanType: "Car Loan",
          maximumAmount: 10000,
          interestRate: 5,
          description: "Low-interest car loan.",
        },
        {
          _id: "2",
          loanType: "Home Loan",
          maximumAmount: 50000,
          interestRate: 3,
          description: "Affordable home loan.",
        },
        {
          _id: "3",
          loanType: "Personal Loan",
          maximumAmount: 15000,
          interestRate: 6,
          description: "Flexible personal loan.",
        },
        {
          _id: "4",
          loanType: "Education Loan",
          maximumAmount: 25000,
          interestRate: 4,
          description: "Support your education.",
        },
        {
          _id: "5",
          loanType: "Business Loan",
          maximumAmount: 75000,
          interestRate: 7,
          description: "Grow your business.",
        },
        {
          _id: "6",
          loanType: "Mortgage Loan",
          maximumAmount: 100000,
          interestRate: 3.5,
          description: "Your dream home awaits.",
        },
        {
          _id: "7",
          loanType: "Credit Card Loan",
          maximumAmount: 5000,
          interestRate: 15,
          description: "Convenient credit card loan.",
        },
        {
          _id: "8",
          loanType: "Emergency Loan",
          maximumAmount: 1000,
          interestRate: 10,
          description: "Get quick financial help.",
        },
      ];
  
      axios.get.mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  
      // Create a mock function for axios.delete
      const mockDelete = jest.fn();
      axios.delete.mockImplementation(mockDelete);
  
      await act(async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <HomePage />
          </QueryClientProvider>
        );
      });
  
      // Click the "Delete" button for the first loan
      const deleteButtons = screen.getAllByText("Delete");
      fireEvent.click(deleteButtons[0]);
      
      expect(
        screen.getByText("Are you sure you want to delete?")
      ).toBeInTheDocument();
      const deletbutton = screen.getByText("Yes, Delete");
      fireEvent.click(deletbutton);
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringMatching(`loan/deleteLoan`),
      );
    });
  });