// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract Udfi is ERC20{

    constructor(uint256 initialSupply) public ERC20("UniDeFi token", "UDFI") {
        _mint(msg.sender, initialSupply);
    }

}