// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ERC20 {

    function balanceOf(address account) external view virtual returns (uint256);

    function approve(address spender, uint256 amount) external virtual returns (bool);

    function transfer(address recipient, uint256 amount) external virtual returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external virtual returns (bool);

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool);

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool);

}