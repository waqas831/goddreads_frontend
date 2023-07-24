import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../src/pages/user/login";
import { useCallback, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import client from "../apolloClientIntercept";
import styles from "../styles/Register.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { LOGIN_MUTATION } from "../services/query/user";
import toast, { Toaster } from 'react-hot-toast';


test("submitting the login form calls the handleSubmit function", () => {
  const handleSubmit = jest.fn();
  render(<Login />);
  const emailInput = screen.getByLabelText("Email Address");
  const passwordInput = screen.getByLabelText("Password");
  const submitButton = screen.getByText("Login");

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
