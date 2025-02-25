// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract RWD {
  string public name = 'Reward Token';
  string public symbol = 'RWD';
  uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
  uint8 public decimals = 18;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint _value
  );

  event Approve(
    address indexed _owner,
    address indexed _spender,
    uint _value
  );

  mapping(address => uint256) public balanceOf;
  
  mapping(address => mapping(address => uint256)) public allowance;

  constructor() public {
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    // require that the value is less or equal than the balance for transfer
    require(balanceOf[msg.sender] >= _value);
    // remove the amount from the sender
    balanceOf[msg.sender] -= _value;
    // add the amount to the receiver
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowance[msg.sender][_spender] = _value;
    emit Approve(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[msg.sender][_from]);
    balanceOf[_to] += _value;
    balanceOf[_from] -= _value;
    allowance[msg.sender][_from] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
  }
}