// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ERC20Burnable {

    function burn(uint256 amount) public virtual;

    function burnFrom(address account, uint256 amount) public virtual;

}