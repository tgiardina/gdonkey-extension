import React from "react";
import PropTypes from "prop-types";
import { Col, Form } from "react-bootstrap";
import { FormButtonCol } from "./FormButtonCol";

const Context = React.createContext();

export function FormButtonsRow({ children }) {
  if (!Array.isArray(children)) children = [children];
  const length = children.length;
  const last = children[length - 1];
  const rest = children.length ? children.slice(0, length - 1) : [];

  return (
    <Context.Provider>
      <Form.Row className="m-0 w-100">
        {rest.map((button) => (
          <Form.Group
            as={Col}
            className="my-0 mr-2 p-0 w-100"
            key={button.props.children}
          >
            {button}
          </Form.Group>
        ))}
        {
          <Form.Group as={Col} className="p-0 my-0" key={last.props.children}>
            {last}
          </Form.Group>
        }
      </Form.Row>
    </Context.Provider>
  );
}

FormButtonsRow.Button = FormButtonCol;

FormButtonsRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
};

export default FormButtonsRow;
