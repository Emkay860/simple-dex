// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {

    /// @notice - To make the contract as simple as possible, we assume a 1 : 1 
    /// token conversion i.e 1 amount of token A swaps for 1 amount of token B

    address[] public tokens;

    event AddTokenToPool(address token, uint256 amount);
    event SwapToETH(address token, uint256 amount);
    event SwapETH(address token, uint256 amount);
    event Swap(address tokenA, address tokenB, uint256 amount);

    constructor(){
    }

    modifier nonZeroValue(uint256 amount){
        require(amount > 0, "DEX: amount cannot be zero");
        _;
    }

    /// @dev - Call this function to add amount of token to the contract liquidity
    /// @notice - we assume our dex contract is the liquidity pool
    /// @param token - address of token to add as liquiidity
    /// @param amount - number of tokens to add as liquidity
    function addTokenToPool(address token, uint256 amount) public nonZeroValue(amount){
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokens.push(token);

        emit AddTokenToPool(token, amount);
    }

    /// @dev - Allow user to exchange a speficied token for ETH
    /// @param amount - an integer that represents the number of tokens to swap
    /// @param token - address of token to swap from
    function swapToETH(uint256 amount, address token) public nonZeroValue(amount) {
        IERC20 _token = IERC20(token);
        uint256 allowance = _token.allowance(msg.sender, address(this));
        uint256 contractETHBalance = address(this).balance;

        require(allowance >= amount, "DEX: Insufficient allowance");
        require(contractETHBalance >= amount, "DEX: Insufficient pool balance");

        // transfer token from sender to the contract
        _token.transferFrom(msg.sender, address(this), amount);
        // send ETH to the user
        payable(msg.sender).transfer(amount);

        emit SwapToETH(token, amount);
    }

    /// @dev - Allows user to swap ETH for a specified token
    /// @param token - address of token to swap to
    function swapETH(address token) public payable nonZeroValue(msg.value) {
        IERC20 _token = IERC20(token);
        uint256 amount = msg.value;
        uint256 contractBalance = _token.balanceOf(address(this));

        require(contractBalance >= amount, "DEX: Insufficient pool balance");

        _token.transfer(msg.sender, amount);

        emit SwapETH(token, amount);
    }

    /// @dev - Allows user swap between two tokens
    /// @param tokenA - address of token to swap from
    /// @param tokenB - address of token to swap to
    /// @param amount - amount of tokenA to swap to tokenB
    function swapTokens(address tokenA, address tokenB, uint256 amount) public nonZeroValue(amount) {
        // check user allowance of tokenA
        IERC20 _tokenA = IERC20(tokenA);
        IERC20 _tokenB = IERC20(tokenB);
        // get user allowance for token A
        uint256 allowance = _tokenA.allowance(msg.sender, address(this));
        // get the contract balance for token B
        uint256 contractBalance = _tokenB.balanceOf(address(this));
        
        require(allowance >= amount, "DEX: Insufficient allowance");
        require(contractBalance >= amount, "DEX: Insufficient pool balance");

        // transfer token A from user to the contract
        _tokenA.transferFrom(msg.sender, address(this), amount);

        // send token B to user
        _tokenB.transfer(msg.sender, amount);

        emit Swap(tokenA, tokenB, amount);
    }

    receive() external payable{

    }

}