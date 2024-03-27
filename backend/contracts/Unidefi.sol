// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Unidefi{
    using SafeMath for uint256;

    IERC20 udfi;
    IERC20 weth;
    IERC20 lpToken;

//    uint256 public liquidityFee;

    // reserveWeth x poolWethValue == reserveUdfi x poolUdfiValue
    uint public reserveWeth;
    uint public reserveUdfi;


//    uint poolWethValue;
//    uint poolUdfiValue;

    mapping(address => uint) balanceLP;

    constructor(address _udfiAddress, address _wethAddress){
        udfi = IERC20(_udfiAddress);
        weth = IERC20(_wethAddress);
        lpToken = IERC20
    }

    function getBalanceWeth(address _address) public returns(uint){
        return weth.balanceOf(_address);
    }
    function getBalanceUdfi(address _address) public returns(uint){
        return udfi.balanceOf(_address);
    }

    function getPoolReserveWeth() public returns(uint){
        return weth.balanceOf(address(this));
    }

    function getPoolReserveUdfi() public{
        return udfi.balanceOf(address(this));
    }

    function addLiquidity(uint _amountA, uint _amountB) public{
        require(_amountA == _amountB, 'same quantities are required');
        require(_amountA > getBalanceWeth(msg.sender), 'insufficient weth in user balance');
        require(_amountB > getBalanceUdfi(msg.sender), 'insufficient udfi in user balance');
        weth.transfer(address(this), _amountA);
        udfi.transfer(address(this), _amountB);
        reserveWeth =+ _amountA;
        reserveUdfi =+ _amountB;

        _mintLP(_amountA);
    }

    function removeLiquidity(uint _amountLP) public{
        require(balanceLP[msg.sender] > 0, 'user has no share in the pool');
        require(_amountLP >= balanceLP(msg.sender), 'insufficient LPtokens balance');
        weth.transferFrom(address(this), msg.sender, _amountLP);
        udfi.transferFrom(address(this), msg.sender, _amountLP);

        burnLP(_amountLP);
    }

    function swapWETHforUDFI(uint256 _amountWETH) public {
        require(_amountWETH > getBalanceWeth(msg.sender), 'insufficient user balance');
        uint amountUdfiOut = getAmountOut(_amountWETH, reserveWeth, reserveUdfi);
          
        weth.transfer(address(this), _amountWETH);
        reserveWeth =+ _amountWETH;
        udfi.transferFrom(address(this), msg.sender, amountUdfiOut);
        reserveUdfi =- amountUdfiOut;
    }

    function swapUDFIForWETH(uint256 _amountUDFI) public {
        require(_amountUDFI > getBalanceUdfi(msg.sender), 'insufficient user balance');
        uint amountWethOut = getAmountOut(_amountUDFI, reserveUdfi, poolWethalance);
          
        udfi.transfer(address(this), _amountUDFI);
        reserveUdfi =+ _amountUDFI;      
        weth.transferFrom(address(this), msg.sender, amountWethOut);
        reserveWeth =- amountWethOut;
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(997);   // 0.3% fee, benefiting the pool (so the liquidity providers)
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function _mintLP(uint _amount) private{
        // Temporairement
        balanceLP[msg.sender] =+ _amount;
    }
    function _burnLP(uint _amount) private{
        // Temporairement
        balanceLP[msg.sender] =- _amount;
    }


    // IERC20 udfi;
    // IERC20 weth;

    // mapping(address => uint256) totalWETH;
    // mapping(address => uint256) totalUDFI;
    // uint256 public liquidityFee;
    // uint256 private reserveWeth;
    // uint256 private reserveUdfi;
    // uint32  private blockTimestampLast;

    // constructor(address _udfiAddress){
    //     udfi = IERC20(_udfiAddress);
    //     weth = IERC20("0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"); // WETH9 sepolia
    //     liquidityFee = 0.0003; // 0.3%
    // }

    // // function foo(address _to, uint _amount) external{
    // //     udfi.transfer(_to, _amount);
    // // }

    // event Swapped(address sender, uint amountWethIn, uint amountUdfiIn, uint amountWethOut, uint amountUdfiOut,); // Emitted each time a swap is made
    // event MintLP(address sender, uint amountWeth, uint amountUdfi); // Emitted each time liquidity tokens are created via mint
    // event BurnLP(address sender, uint amount0, uint amount1, address to); //Emitted each time liquidity tokens are destroyed via burn

    // function getReserves() external view returns(uint256 _reserveWeth, uint256 _reserveUdfi, uint32 blockTimestampLast){
    //     _reserveWeth = reserveWeth;
    //     _reserveUdfi = reserveUdfi;
    //     //_blockTimestampLast = blockTimestampLast;
    // }

    // function _transfer(address _from, address _to, uint256 amount) internal {
    //     require(_from != address(0), 'cant transfer from the zero address');
    //     require(_to != address(0), 'cant transfer to the zero address');

    //     _balances[_from] = _balances[_from].sub(amount, 'transfer amount exceeds balance');
    //     _balances[_to] = _balances[_to].add(amount);
    //     //emit Transfer(_from, _to, amount);
    // }

    // // Creates pool tokens
    // function mintLP(address _to) private returns(uint256 liquidity){

    // }

    // // Destroy pool tokens
    // function burnLP(address _to) external returns (uint amountWeth, uint amountUdfi);{

    // }


    // function addLiquidity(uint256 _amountWETH, uint256 _amountUDFI) public{
    //     // Ensure that the user has approved the transfer


    //     // Transfer the tokens from the caller to the contract
    //     _transfer(msg.sender, address(this), amountWETH);
    //     _transfer(msg.sender, address(this), _amountUDFI);

    //     // Add the tokens to the pool
    //     totalWETH[address(this)] += _amountWETH;
    //     totalUDFI[address(this)] += _amountUDFI;
    // }

    // function removeLiquidity() external{

    // }

    // function swapWETHforUDFI(uint256 amountWETH) external {
    //     weth.withdraw(amountWETH);
    //     uint256 amountUDFI = amountWETH.div(10000).mul(9950).div(9950 + liquidityProviderFee);
    //     balances[msg.sender] = balances[msg.sender].add(amountUDFI);
    //     _transfer(address(this), msg.sender, amountUDFI);
    // }

    // function swapUDFIforWETH(uint256 amountUDFI) external {
    //     uint256 amountWETH = amountUDFI.div(10000).mul(9950).div(9950 + liquidityProviderFee);
    //     balances[msg.sender] = balances[msg.sender].sub(amountUDFI);
    //     _transfer(msg.sender, address(this), amountUDFI);
    //     _transfer(address(this), msg.sender, amountWETH);
    //     weth.deposit{value: amountWETH}();
    // }


}