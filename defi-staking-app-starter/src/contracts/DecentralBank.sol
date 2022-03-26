// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  constructor(RWD _rwd,Tether _tether) public{
    rwd = _rwd;
    tether = _tether;
  }
}