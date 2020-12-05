import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

export function FormButtonCol({ children, onClick, type = "button", variant }) {
  return (
    <Button className="w-100" type={type} variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}

FormButtonCol.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit"]),
  variant: PropTypes.oneOf(["danger", "outline-primary", "primary", "success"])
    .isRequired,
};

export default FormButtonCol;
