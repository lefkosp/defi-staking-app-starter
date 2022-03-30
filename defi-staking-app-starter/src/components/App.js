import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";

export default function App() {
  const [state, setState] = useState({
    account: "0x0",
    tether: {},
    rwd: {},
    decentralBank: {},
    tetherBalance: "0",
    rwdBalance: "0",
    stakingBalance: "0",
    loading: true,
  });

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected! You can check out MetaMask.");
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setState((oldState) => {
      return {
        ...oldState,
        account: account
      };
    });
    const networkId = await web3.eth.net.getId();

    // load tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tetherContract = new web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      console.log(tetherContract);
      let tetherBalanceContract = await tetherContract.methods
        .balanceOf(state.account)
        .call();
      console.log(state.tetherBalanceContract);
      setState((oldState) => {
        return {
          ...oldState,
          tether: tetherContract,
          tetherBalance: tetherBalanceContract.toString(),
        };
      });
      console.log({ balance: state.tetherBalance });
    } else {
      window.alert("Error! Tether contract not deployed - no detected network");
    }
  }

  useEffect(async () => {
    await loadWeb3();
    await loadBlockchainData();
  }, []);

  return <Navbar account={state.account} connectWallet={loadWeb3} />;
}
