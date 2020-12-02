import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

export function FormInputRow({
  error,
  disabled = false,
  isRetry = false,
  name,
  type = "text",
  value,
}) {
  return (
    <Form.Row className="mx-0 mb-2 w-100">
      <Form.Group className="m-0 w-100 " controlId={name}>
        <Form.Control
          aria-label={name}
          className="p-1 text-center w-100"
          defaultValue={value}
          disabled={disabled}
          isInvalid={error}
          isValid={isRetry && !error}
          placeholder={name}
          type={type}
        />
        {error && (
          <Form.Control.Feedback className="m-0" type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Form.Row>
  );
}

FormInputRow.propTypes = {
  error: PropTypes.element,
  disabled: PropTypes.bool,
  isRetry: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default FormInputRow;
