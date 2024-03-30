// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Unidefi is Ownable{

    IERC20 udfi;
    IERC20 usdc;

    mapping(address => uint) private balanceLP;
    uint private lpTotalSupply;

    event UsdcSwap(address userAddress, uint amountUsdc);
    event UdfiSwap(address userAddress, uint amountUdfi);

    error PoolBalanceNotRespected();
    error InsufficientAllowance();
    error InsufficientBalance();
    error IncorrectAmount();
    error InsufficientLiquidity();
    error NoPoolShare();

    constructor(address _udfiAddress, address _usdcAddress) Ownable(msg.sender){
        udfi = IERC20(_udfiAddress);
        usdc = IERC20(_usdcAddress);
    }

    function getPoolInfos() public view returns(uint amountUsdc, uint amountUdfi){
        return(usdc.balanceOf(address(this)), udfi.balanceOf(address(this)));
    }

    // function getLPFrom(address _from) public view returns(uint){
    //     return(balanceLP[_from]);
    // }

    function getMyLP() public view returns(uint){
        return(balanceLP[msg.sender]);
    }

    function getLPTotalSupply() public view returns(uint){
        return(lpTotalSupply);
    }

    function getValueUdfiX1000() public view returns(uint){
        // Qa.Va = Qb.Vb    =>    Vb = Qa.Va / Qb (avec Va = 1$)
        uint value1000Udfi;
        if(udfi.balanceOf(address(this)) == 0){
            value1000Udfi = 0;
        }else{
            value1000Udfi = (usdc.balanceOf(address(this)) * (1000) / udfi.balanceOf(address(this)));
        }
        return value1000Udfi;
    }

    // ratio pool (usdc / udfi)x1000
    function getRatioPoolx1000() public view returns(uint){
        uint ratiox1000;
        if(udfi.balanceOf(address(this))==0){
            ratiox1000 = 1000; // 1 pour 1 au démarrage de la pool
        }else{
            ratiox1000 = usdc.balanceOf(address(this)) * (1000) / (udfi.balanceOf(address(this)));
        }
        return ratiox1000;
    }

    // 
    function addLiquidity(uint _amountUsdc, uint _amountUdfi) public{
        if( _amountUsdc > usdc.balanceOf(msg.sender) 
            || _amountUdfi == 0 
            || _amountUdfi > udfi.balanceOf(msg.sender)){
            revert IncorrectAmount();
        }

        if(_amountUsdc < ((_amountUdfi * getRatioPoolx1000()) / 1000)){
            revert PoolBalanceNotRespected();
        }

        if(usdc.allowance(msg.sender, address(this)) < _amountUsdc || udfi.allowance(msg.sender, address(this)) < _amountUdfi){
            revert InsufficientAllowance();
        }

        _mintLP(_amountUsdc, _amountUdfi);

        usdc.transferFrom(msg.sender, address(this), _amountUsdc);
        udfi.transferFrom(msg.sender, address(this), _amountUdfi);
    }

    function removeAllLiquidity() public{
        if(balanceLP[msg.sender] == 0){
            revert NoPoolShare();
        }

        uint usdcToRetrieve = usdc.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;
        uint udfiToRetrieve = udfi.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;

        usdc.transfer(msg.sender, usdcToRetrieve);
        udfi.transfer(msg.sender, udfiToRetrieve);

        _burnAllUserLP();
    }

    function swapUSDCForUDFI(uint256 _amountUSDC) public {
        if(_amountUSDC > usdc.balanceOf(msg.sender)){
            revert InsufficientBalance();
        }
        if(_amountUSDC > usdc.allowance(msg.sender, address(this))){
            revert InsufficientAllowance();
        }
        uint amountUdfiOut = getAmountOut(_amountUSDC, usdc.balanceOf(address(this)), udfi.balanceOf(address(this)));

        usdc.transferFrom(msg.sender, address(this), _amountUSDC);
        udfi.transfer(msg.sender, amountUdfiOut);

        emit UsdcSwap(msg.sender, _amountUSDC);
    }

    function swapUDFIForUSDC(uint256 _amountUDFI) public {
        if(_amountUDFI > udfi.balanceOf(msg.sender)){
            revert InsufficientBalance();
        }
        if(_amountUDFI > udfi.allowance(msg.sender, address(this))){
            revert InsufficientAllowance();
        }
        uint amountUsdcOut = getAmountOut(_amountUDFI, udfi.balanceOf(address(this)), usdc.balanceOf(address(this)));

        udfi.transferFrom(msg.sender, address(this), _amountUDFI);
        usdc.transfer(msg.sender, amountUsdcOut);

        emit UdfiSwap(msg.sender, _amountUDFI);
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        //require(amountIn > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        if(amountIn == 0){
            revert IncorrectAmount();
        }
        //require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        if(reserveOut == 0){
            revert InsufficientLiquidity();
        }
        uint amountInWithFee = amountIn * (997);   // 0.3% fee, benefiting the pool (so the liquidity providers)
        uint numerator = amountInWithFee * (reserveOut);
        uint denominator = reserveIn * (1000) + (amountInWithFee);
        amountOut = numerator / denominator;
    }

    function _mintLP(uint _amountA, uint _amountB) private{
        uint lp;
        if (lpTotalSupply==0){
            lp = _amountA + _amountB;
        } else{
            lp = (_amountA + _amountB) * lpTotalSupply / (usdc.balanceOf(address(this)) + udfi.balanceOf(address(this))) ;
        }
        
        balanceLP[msg.sender] += lp;
        lpTotalSupply += lp;
    }
    function _burnAllUserLP() private{
        lpTotalSupply -= balanceLP[msg.sender];
        balanceLP[msg.sender] = 0;
        //_burn(msg.sender,_amount);
    }

}