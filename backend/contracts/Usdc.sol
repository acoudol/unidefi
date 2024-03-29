// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract Usdc is ERC20{

    constructor(address _address, uint256 _initialSupply) ERC20("Usdc", "USDC") {
        _mint(_address, _initialSupply);
    }

}