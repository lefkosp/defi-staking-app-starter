// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  address[] public stakers;

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(RWD _rwd,Tether _tether) public {
    rwd = _rwd;
    tether = _tether;
    owner = msg.sender;
  }

  // function for staking
  function depositTokens(uint _amount) public {
    // checking for valid amounts
    require(_amount > 0, 'amount cannot be 0');

    // transfer tether tokens to the contract address for staking
    tether.transferFrom(msg.sender, address(this), _amount);

    // Update staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    // push sender to stakers table
    if(!hasStaked[msg.sender])
      stakers.push(msg.sender);
    
    // Update staking balance
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }

  // unstake tokens
  function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'to unstake put a bigger amount than 0');

    // transfer tokens to the specified contract address from our bank
    tether.transfer(msg.sender, balance);
    
    // remove the amount from the staking balance
    stakingBalance[msg.sender] -= balance;

    // update staking status
    isStaking[msg.sender] = false;
  }

  // issue reward tokens
  function issueTokens() public {
    // require the owner to issue tokens only
    require(msg.sender == owner, 'the caller must be the owner');
    for (uint i=0; i<stakers.length; i++){
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient] / 9;
      if (balance > 0)
        rwd.transfer(recipient, balance);
    }
  }
}