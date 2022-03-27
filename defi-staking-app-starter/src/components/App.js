import React, { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

export default function App() {
  const [account, setAccount] = useState("0x0");
  return <Navbar account={account} />;
}
