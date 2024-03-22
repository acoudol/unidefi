// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Unidefi{

    IERC20 udfi;

    constructor(address _udfiAddress){
        udfi = IERC20(_udfiAddress);
    }

    function foo(address _to, uint _amount) external{
        udfi.transfer(_to, _amount);
    }

}