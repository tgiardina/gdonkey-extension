import React, { useState } from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { FormButtonsRow, FormInputRow, Header } from "../components";
import { logIn, register, StatusCode } from "../persistence";

export function Login({ setIsAuth, setUsername, username }) {
  const UsernameError = {
    Empty: <span>Please provide your username.</span>,
    Incorrect: <span>The username you provided is incorrect.</span>,
    Taken: <span>The username you provided is already taken.</span>,
    Unavailable: (
      <span>
        Please confirm your username{" "}
        <a
          href="http://www.gpokr.com/discussion/topics/45167590"
          rel="noopener noreferrer"
          target="_blank"
        >
          here
        </a>
        .
      </span>
    ),
  };
  const PasswordError = {
    Empty: <span>Please provide your password.</span>,
    Incorrect: <span>The password you provided is incorrect.</span>,
    Short: <span>Your password must be 8+ characters.</span>,
  };
  const [isRetry, setIsRetry] = useState(false);
  const [errors, setErrors] = useState({});
  const [clicked, setClicked] = useState(null);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const _errors =
      validateInput(username, password) ||
      (await validateResponse(username, password));
    if (isEmpty(_errors)) {
      setIsAuth(true);
      setUsername(username);
    } else {
      setErrors(_errors);
      setIsRetry(true);
    }
  };

  const validateInput = (username, password) => {
    let _errors = {};
    if (username === "") _errors.username = UsernameError.Empty;
    if (password === "") {
      _errors.password = PasswordError.Empty;
    } else if (password.length < 8) {
      _errors.password = PasswordError.Short;
    }
    return isEmpty(_errors) ? null : _errors;
  };

  const validateResponse = async (username, password) => {
    const errorCode =
      clicked === "LOG_IN"
        ? await logIn(username, password)
        : await register(username, password);
    switch (errorCode) {
      case StatusCode.DuplicateUsername:
        return { username: UsernameError.Taken };
      case StatusCode.IncorrectPassword:
        return { password: PasswordError.Incorrect };
      case StatusCode.IncorrectUsername:
        return { username: UsernameError.Incorrect };
      case StatusCode.UnavailableUsername:
        return { username: UsernameError.Unavailable };
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <Form onSubmit={handleLoginSubmit}>
        <FormInputRow
          error={errors.username}
          isRetry={isRetry}
          name="username"
          type="text"
          value={username}
        />
        <FormInputRow
          error={errors.password}
          isRetry={isRetry}
          name="password"
          type="password"
        />
        <FormButtonsRow>
          <FormButtonsRow.Button
            onClick={() => setClicked("LOG_IN")}
            type="submit"
            variant="primary"
          >
            Log In
          </FormButtonsRow.Button>
          <FormButtonsRow.Button
            onClick={() => setClicked("REGISTER")}
            type="submit"
            variant="success"
          >
            Register
          </FormButtonsRow.Button>
        </FormButtonsRow>
      </Form>
    </div>
  );
}

Login.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default Login;
