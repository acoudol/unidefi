// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @title Contract Unidefi
 * @author Arthur Coudol
 * @notice You can use this contract to for liquidity pool + swap features
 * @dev Unidefi is Ownable to have access to oppenzeppelin's built-in onlyOwner modifier, for further project's fees integration
 */
contract Unidefi is Ownable{

    IERC20 udfi;
    IERC20 usdc;
    uint private decimals=10**18;

    mapping(address => uint) private balanceLP;
    uint private lpTotalSupply;

    /// @dev Emitted when a user is adding liquidity
    event LiquidityAdded(address userAddress, uint amountUsdc, uint amountUdfi, uint lpUserBalanceUpdated);
    /// @dev Emitted when a user is removing liquidity
    event LiquidityRemoved(address userAddress, uint amountUsdc, uint amountUdfi, uint lpUserBalanceUpdated);
    /// @dev Emitted when a user is swapping USDC for UDFI
    event UsdcSwap(address userAddress, uint amountUsdcIn, uint amountUdfiOut);
    /// @dev Emitted when a user is swapping UDFI for USDC
    event UdfiSwap(address userAddress, uint amountUdfiIn, uint amountUsdcOut);

    error PoolBalanceNotRespected();
    error InsufficientAllowance();
    error InsufficientBalance();
    error IncorrectAmount();
    error InsufficientLiquidity();
    error NoPoolShare();

    /**
     * @dev Sets the address provided by the deployer as the owner
     *      Sets the tokens' contract addresses to use in the pool
     */
    constructor(address _udfiAddress, address _usdcAddress) Ownable(msg.sender){
        udfi = IERC20(_udfiAddress);
        usdc = IERC20(_usdcAddress);
    }

    /**
     * @notice returns USDC and UDFI total amounts currently in the pool
     * @dev returns an array of three uint
     */
    function getPoolInfos() public view returns(uint amountUsdc, uint amountUdfi, uint lpTotal){
        return(usdc.balanceOf(address(this)), udfi.balanceOf(address(this)), lpTotalSupply);
    }

    /**
     * @notice returns USDC and UDFI amounts corresponding to user pool share
     * @dev returns an array of two uint
     */
    function getUserPreviewInfos() public view returns(uint amountUsdc, uint amountUdfi){
        uint usdcPreview;
        uint udfiPreview;
        if(lpTotalSupply==0){
            usdcPreview=0;
            udfiPreview=0;
        }else{
            usdcPreview = usdc.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;
            udfiPreview = udfi.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;
        }
        return(usdcPreview, udfiPreview);
    }

    // function getLPFrom(address _from) public view returns(uint){
    //     return(balanceLP[_from]);
    // }

    /**
     * @notice returns the current user LP balance
     * @dev returns an uint
     */
    function getMyLP() public view returns(uint){
        return(balanceLP[msg.sender]);
    }

    /**
     * @notice returns the total LP balance
     * @dev returns an uint
     */
    function getLPTotalSupply() public view returns(uint){
        return(lpTotalSupply);
    }

    /**
     * @notice returns $UDFI current value x1000 (to reduce round problems)
     * @dev returns an uint
     */
    function getValueUdfiX1000() public view returns(uint){
        // Qa.Va = Qb.Vb    =>    Vb = Qa.Va / Qb (avec Va = 1$)
        uint value1000Udfi;
        if(udfi.balanceOf(address(this)) == 0){
            value1000Udfi = 1000;
        }else{
            value1000Udfi = (usdc.balanceOf(address(this)) * (1000) / udfi.balanceOf(address(this)));
        }
        return value1000Udfi;
    }

    /**
     * @notice returns the pool ratio usdc/udfi , multiplied by a 1000 factore to reduce round problems
     * @dev returns an uint
     */
    function getRatioPoolx1000() public view returns(uint){
        uint ratiox1000;
        if(udfi.balanceOf(address(this))==0){
            ratiox1000 = 1000; // 1 pour 1 au démarrage de la pool
        }else{
            ratiox1000 = usdc.balanceOf(address(this)) * (1000) / (udfi.balanceOf(address(this)));
        }
        return ratiox1000;
    }

    /**
     * @notice a user can add usdc + udfi to the pool, and an LP amount is allocated to it 
     * @dev input 2 uint, update the user LP balance, transfer the tokens to the contract, and emit the amounts transfered + updated LP balance
     */
    function addLiquidity(uint _amountUsdc, uint _amountUdfi) public{
        if( _amountUsdc > usdc.balanceOf(msg.sender) 
            || _amountUdfi == 0 
            || _amountUdfi > udfi.balanceOf(msg.sender)){
            revert IncorrectAmount();
        }

        if(_amountUsdc < (_amountUdfi * getValueUdfiX1000() * 99 / (1000*100)) || _amountUsdc > (_amountUdfi * getValueUdfiX1000() * 101 / (1000*100))){ // 1% variance agreed (avoiding round problems)
            revert PoolBalanceNotRespected();
        }

        if(usdc.allowance(msg.sender, address(this)) < _amountUsdc || udfi.allowance(msg.sender, address(this)) < _amountUdfi){
            revert InsufficientAllowance();
        }

        _mintLP(_amountUsdc, _amountUdfi);

        usdc.transferFrom(msg.sender, address(this), _amountUsdc);
        udfi.transferFrom(msg.sender, address(this), _amountUdfi);

        emit LiquidityAdded(msg.sender, _amountUsdc, _amountUdfi, getMyLP());
    }

    /**
     * @notice a user can remove its liquidity pool position, by burning its total LP and get back its corresponding share from the pool 
     * @dev reset the user LP balance, transfer the tokens to the user, and emit the amounts transfered + updated LP balance
     */
    function removeAllLiquidity() public{
        if(balanceLP[msg.sender] == 0){
            revert NoPoolShare();
        }

        uint usdcToRetrieve = usdc.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;
        uint udfiToRetrieve = udfi.balanceOf(address(this)) * balanceLP[msg.sender] / lpTotalSupply;

        _burnAllUserLP();

        usdc.transfer(msg.sender, usdcToRetrieve);
        udfi.transfer(msg.sender, udfiToRetrieve);

        emit LiquidityRemoved(msg.sender, usdcToRetrieve, udfiToRetrieve, getMyLP());
    }

    /**
     * @notice a user can send USDC to get UDFI in return, amount depending on pool ratio, minus a 0.3% fee staying in the pool benefiting the liquidity providers
     * @dev input uint, transfers usdc to the contract address, send back udfi to the user, emit the amounts transfered
     */
    function swapUSDCForUDFI(uint _amountUSDC) public {
        if(_amountUSDC > usdc.balanceOf(msg.sender)){
            revert InsufficientBalance();
        }
        if(_amountUSDC > usdc.allowance(msg.sender, address(this))){
            revert InsufficientAllowance();
        }
        uint amountUdfiOut = getAmountOut(_amountUSDC, usdc.balanceOf(address(this)), udfi.balanceOf(address(this)));

        usdc.transferFrom(msg.sender, address(this), _amountUSDC);
        udfi.transfer(msg.sender, amountUdfiOut);

        emit UsdcSwap(msg.sender, _amountUSDC, amountUdfiOut);
    }

    /**
     * @notice a user can send UDFI to get USDC in return, amount depending on pool ratio, minus a 0.3% fee staying in the pool benefiting the liquidity providers
     * @dev input uint, transfers udfi to the contract address, send back usdc to the user, emit the amounts transfered
     */
    function swapUDFIForUSDC(uint _amountUDFI) public {
        if(_amountUDFI > udfi.balanceOf(msg.sender)){
            revert InsufficientBalance();
        }
        if(_amountUDFI > udfi.allowance(msg.sender, address(this))){
            revert InsufficientAllowance();
        }
        uint amountUsdcOut = getAmountOut(_amountUDFI, udfi.balanceOf(address(this)), usdc.balanceOf(address(this)));

        udfi.transferFrom(msg.sender, address(this), _amountUDFI);
        usdc.transfer(msg.sender, amountUsdcOut);

        emit UdfiSwap(msg.sender, _amountUDFI, amountUsdcOut);
    }

    /**
     * @dev calculate the amountOut (tokenB) for a swap, depending on amountIn (tokenA), reserveIn (tokenA), reserveOut (tokenB)
     *      is used for swap calculation, and swap preview in frontend
     *      returns an uint
    */
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        if(amountIn == 0){
            revert IncorrectAmount();
        }
        if(reserveIn < amountIn){
            revert InsufficientLiquidity();
        }
        uint amountInWithFee = amountIn * (997);   // 0.3% fee, benefiting to the pool
        amountOut = amountInWithFee * (reserveOut) / (reserveIn * (1000) + (amountInWithFee));
        return amountOut;
    }

    /// @dev calculate LP tokens to allocate to the user when adding liquidity, update the user LP balance and the total lp supply
    function _mintLP(uint _amountA, uint _amountB) private{
        uint lp;
        if (lpTotalSupply==0){
            lp = (_amountA + _amountB)/decimals;
        } else{
            lp = (_amountA + (_amountB * getValueUdfiX1000()/1000)) * lpTotalSupply / (usdc.balanceOf(address(this)) + (udfi.balanceOf(address(this)) * getValueUdfiX1000()/1000)) ;
        }
        balanceLP[msg.sender] += lp;
        lpTotalSupply += lp;
    }

    /// @dev reset user LP balance when removing its liquidity position, also update total lp supply
    function _burnAllUserLP() private{
        lpTotalSupply -= balanceLP[msg.sender];
        balanceLP[msg.sender] = 0;
    }

}