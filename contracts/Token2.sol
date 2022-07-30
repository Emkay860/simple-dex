// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token2 is ERC20, Ownable {
    constructor() ERC20("Token2", "TK2") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}