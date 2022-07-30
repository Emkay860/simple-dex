const {
	time,
	loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('DEX', () => {
	async function deployDexAndTokensFixture() {
		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();
		const MAX_UINT = ethers.constants.MAX_UINT256;

		// Deploy token1 contract
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

		const Dex = await ethers.getContractFactory('Dex');
		const dexContract = await Dex.deploy();

		await dexContract.deployed();

		return { token1, token2, token3, dexContract, owner, otherAccount };
	}

	describe('Deployment', () => {
		it('Should deploy correctly', async () => {
			const { dexContract } = await loadFixture(deployDexAndTokensFixture);

			expect(dexContract.address).to.not.be.equal(ethers.constants.AddressZero);
		});
	});
});
