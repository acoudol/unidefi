// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Unidefi is Ownable{

    IERC20 udfi;
    IERC20 usdc;

    mapping(address => uint) balanceLP;
    uint lpTotalSupply;

    constructor(address _udfiAddress, address _usdcAddress) Ownable(msg.sender){
        udfi = IERC20(_udfiAddress);
        usdc = IERC20(_usdcAddress);
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

    function getPoolInfos() public view returns(uint amountUsdc, uint amountUdfi){
        return(usdc.balanceOf(address(this)), udfi.balanceOf(address(this)));
    }

    function getLPfrom(address _from) public view returns(uint){
        return(balanceLP[_from]);
    }

    function getLPTotalSupply() public view returns(uint){
        return(lpTotalSupply);
    }

    function getValue1000Udfi() public view returns(uint){
        // Qa.Va = Qb.Vb    =>    Vb = Qa.Va / Qb (avec Va = 1$)
        //uint value1000Udfi = (usdc.balanceOf(address(this)) * (1000) / ratioPoolx1000) * (1000);
        uint value1000Udfi = (usdc.balanceOf(address(this)) * (1000) / udfi.balanceOf(address(this)));
        return value1000Udfi;
    }

    function addLiquidity(uint _amountA, uint _amountB) public{
        require(_amountA > 0 && _amountA < usdc.balanceOf(msg.sender), 'incorrect usdc amount');
        require(_amountB > 0 && _amountB < udfi.balanceOf(msg.sender), 'incorrect udfi amount');
        //require(_amountB >= (_amountA * (1000) / getRatioPoolx1000()), 'pool ratio not respected');
        
        //usdc.approve(address(this), _amountA); // doit être géré en JS directement sur le contrat usdc
        require(usdc.allowance(msg.sender, address(this)) >= _amountA, 'insufficient usdc allowance');
        //udfi.approve(address(this), _amountB); // doit être géré en JS directement sur le contrat usdc
        require(udfi.allowance(msg.sender, address(this)) >= _amountB, 'insufficient udfi allowance');

        usdc.transferFrom(msg.sender, address(this), _amountA);
        udfi.transferFrom(msg.sender, address(this), _amountB);

        _mintLP(_amountA, _amountB);
    }

    function removeAllLiquidity() public{
        require(balanceLP[msg.sender] > 0, 'user has no share in the pool');
        
        // uint poolSharex100000 = balanceLP[msg.sender]*(100000) / lpTotalSupply;
        // uint usdcToRetrieve = usdc.balanceOf(address(this))*(poolSharex100000) / (lpTotalSupply*(100000));
        // uint udfiToRetrieve = udfi.balanceOf(address(this))*(poolSharex100000) / (lpTotalSupply*(100000));

        uint usdcToRetrieve = usdc.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;
        uint udfiToRetrieve = udfi.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;

        usdc.transfer(msg.sender, usdcToRetrieve);
        udfi.transfer(msg.sender, udfiToRetrieve);

        _burnLP();
    }

    function swapUSDCforUDFI(uint256 _amountUSDC) public {
        require(_amountUSDC < usdc.balanceOf(msg.sender), 'insufficient user balance');
        uint amountUdfiOut = getAmountOut(_amountUSDC, usdc.balanceOf(address(this)), udfi.balanceOf(address(this)));

        require(usdc.allowance(msg.sender, address(this)) >= _amountUSDC, 'insufficient usdc allowance');  
        usdc.transferFrom(msg.sender, address(this), _amountUSDC);
        udfi.transfer(msg.sender, amountUdfiOut);
    }

    function swapUDFIForUSDC(uint256 _amountUDFI) public {
        require(_amountUDFI < udfi.balanceOf(msg.sender), 'insufficient user balance');
        uint amountUsdcOut = getAmountOut(_amountUDFI, udfi.balanceOf(address(this)), usdc.balanceOf(address(this)));

        require(udfi.allowance(msg.sender, address(this)) >= _amountUDFI, 'insufficient udfi allowance');  
        udfi.transferFrom(msg.sender, address(this), _amountUDFI);
        usdc.transfer(msg.sender, amountUsdcOut);
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn * (997);   // 0.3% fee, benefiting the pool (so the liquidity providers)
        uint numerator = amountInWithFee * (reserveOut);
        uint denominator = reserveIn * (1000) + (amountInWithFee);
        amountOut = numerator / denominator;
    }

    function _mintLP(uint _amountA, uint _amountB) private{
        //uint poolSharex1000 = _amount*(1000) / usdc.balanceOf(address(this));
        //balanceLP[msg.sender] += poolSharex1000;
        //lpTotalSupply += poolSharex1000;
        //_mint(msg.sender,poolSharex1000);

        // sachant x * y = constante dans la pool, on peut utiliser _amountA * _amountB pour 
        // définir le nombre de LP à allouer sans se préoccuper du ratio de la pool
        uint lp = _amountA * _amountB;
        balanceLP[msg.sender] += lp;
        lpTotalSupply += lp;
    }
    function _burnLP() private{
        lpTotalSupply -= balanceLP[msg.sender];
        balanceLP[msg.sender] = 0;
        //_burn(msg.sender,_amount);
    }

}