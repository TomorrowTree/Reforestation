// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract TomorrowTreeTestToken3 {

    function mint(address to, uint256 amount) public virtual;

    function balanceOf(address account) external view virtual returns (uint256);

    function approve(address spender, uint256 amount) external virtual returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external virtual returns (bool);

    function burnFrom(address account, uint256 amount) public virtual;

}