import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "./Components/Login";
import axios from "axios";
import { BrowserRouter , useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@testing-library/jest-dom"; // Import the extended matchers
import Signup from "./Components/Signup";
import { act } from "react-dom/test-utils";
import UserHomePage from "./UserComponents/UserHomePage";
import HomePage from "./AdminComponents/Home";
import LoanForm from "./AdminComponents/LoanForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AppliedLoansPage from "./UserComponents/AppliedLoans";
import LoanApplicationForm from "./UserComponents/LoanApplicationForm";
import MockAdapter from "axios-mock-adapter";
import LoanRequests from "./AdminComponents/LoanRequest";

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

