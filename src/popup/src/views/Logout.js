import React from "react";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { FormButtonsRow, FormInputRow, Header } from "../components";
import { getDb, logOut as persistLogOut } from "../persistence";

export function Logout({ setIsAuth, username }) {
  const download = async () => {
    const db = await getDb();
    saveAs(db, "gdonkey.sql");
  };

  const logOut = async () => {
    persistLogOut();
    setIsAuth(false);
  };

  return (
    <div>
      <Header />
      <Form>
        <FormInputRow disabled name="username" type="text" value={username} />
        <FormInputRow
          disabled
          name="password"
          type="password"
          value="password"
        />
        <FormButtonsRow>
          <FormButtonsRow.Button
            onClick={logOut}
            type="button"
            variant="danger"
          >
            Log Out
          </FormButtonsRow.Button>
          <FormButtonsRow.Button
            onClick={download}
            type="button"
            variant="outline-primary"
          >
            <span
              className="d-inline-block align-middle"
              style={{ fontSize: "0.9em", lineHeight: "100%" }}
            >
              Download DB
            </span>
          </FormButtonsRow.Button>
        </FormButtonsRow>
      </Form>
    </div>
  );
}

Logout.propTypes = {
  setIsAuth: PropTypes.func,
  username: PropTypes.string,
};

export default Logout;
