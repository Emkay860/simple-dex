// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const { ethers } = require('hardhat');

async function main() {
	const Token1 = await ethers.getContractFactory('Token1');
	const token1 = await Token1.deploy();

	await token1.deployed();

	// Deploy token2 contract
	const Token2 = await ethers.getContractFactory('Token2');
	const token2 = await Token2.deploy();

	await token2.deployed();

	// Deploy token3 contract
	const Token3 = await ethers.getContractFactory('Token3');
	const token3 = await Token3.deploy();

	await token3.deployed();

	console.log('Token1 deloyed at address:', token1.address);
	console.log('Token2 deloyed at address:', token2.address);
	console.log('Token3 deloyed at address:', token3.address);

	// Deploy Dex contract
	const Dex = await ethers.getContractFactory('Dex');
	const dexContract = await Dex.deploy();

	await dexContract.deployed();

	console.log('DEX deployed at address:', dexContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
