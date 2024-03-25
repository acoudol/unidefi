// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Udfi is ERC20, Ownable{

    constructor(address initialOwner) ERC20('Unidefi', 'UDFI') Ownable(initialOwner){}

     function faucet (address _to, uint _initialSupply) external onlyOwner{
         _mint(_to, _initialSupply * 10 ** decimals()); // 18 decimals
     }

}