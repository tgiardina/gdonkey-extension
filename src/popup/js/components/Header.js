import React from "react";
import icon from "../../../../assets/images/icon-with-name.png";

export function Header() {
  return (
    <div className="input-group mb-1">
      <a
        href={process.env.REACT_APP_VANITY_SITE_URL}
        rel="noopener noreferrer"
        style={{ margin: "-10px 0 0 0" }}
        target="_blank"
      >
        <img src={icon} height="60" alt="Logo" />
      </a>
    </div>
  );
}

export default Header;
