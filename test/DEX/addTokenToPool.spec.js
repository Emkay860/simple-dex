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

	describe('addTokenToPool', () => {
		it('Should add tokens to contract pool', async () => {
			const { dexContract, token1, owner } = await loadFixture(
				deployDexAndTokensFixture
			);

			const amount = ethers.utils.parseEther('1000');

			// approve Dex contract to spend owner tokens
			const ownerBalance = await token1.balanceOf(owner.address);
			await token1.approve(dexContract.address, ownerBalance);

			// add tokens to the dex pool
			const addTokenToPoolTx = await dexContract
				.connect(owner)
				.addTokenToPool(token1.address, amount);

			// get dex contract balance
			const dexContractBalance = await token1.balanceOf(dexContract.address);

			expect(dexContractBalance).to.not.be.equal(0);
			expect(dexContractBalance).to.equal(amount);
			expect(addTokenToPoolTx).to.emit(dexContract, 'AddTokenToPool');
		});

		it('Should revert with the right error if amount is zero', async () => {
			const { dexContract, token1, owner } = await loadFixture(
				deployDexAndTokensFixture
			);

			await expect(
				dexContract.addTokenToPool(token1.address, 0)
			).to.be.revertedWith('DEX: amount cannot be zero');
		});

		it('Should revert with the right error if allowance is Insufficient', async () => {
			const { dexContract, token1, owner } = await loadFixture(
				deployDexAndTokensFixture
			);

			const amount = ethers.utils.parseEther('1000');

			await expect(dexContract.addTokenToPool(token1.address, amount)).to.be
				.reverted;
		});
	});
});
