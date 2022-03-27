import React from "react";
import logo from "../bank.png";

export default function Navbar(props) {
  return (
    <nav
      className="navbar navbar-dark fixed-top shadow p-0"
      style={{ backgroundColor: "black", height: "50px" }}
    >
      <a
        style={{ color: "#fff" }}
        className="navbar-brand col-sm-3 col-md-2 mr-0"
      >
        <img src={logo} width="50" className="mr-2 align-top" alt="DAPP logo" />
        DAPP Yield Staking (Decentralized Banking)
      </a>
      <ul className="navbar-nav px-3">
        <li className="text-nowrap d-none nav-item d-sm-none d-sm-block">
          <small style={{ color: "#fff" }}>
            ACCOUNT NUMBER: {props.account}
          </small>
        </li>
      </ul>
    </nav>
  );
}
