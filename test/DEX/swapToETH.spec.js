const {
	time,
	loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('DEX', () => {
	async function deployAndAddTokensToPoolFixture() {
		const MAX_UINT = ethers.constants.MAX_UINT256;
		const amount = ethers.utils.parseEther('2000');
		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

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

		// approve Dex contract to spend owner tokens (token1)
		const ownerBalance = await token1.balanceOf(owner.address);
		await token1.approve(dexContract.address, ownerBalance);

		// add token1 to the dex pool
		await dexContract.connect(owner).addTokenToPool(token1.address, amount);

		// transfer ETH to dexContract
		tx = {
			to: dexContract.address,
			value: amount,
		};
		await owner.sendTransaction(tx);

		return { token1, token2, token3, dexContract, owner, otherAccount };
	}

	describe('swapToETH', () => {
		it('Should allow user swap token to ETH', async () => {
			const { dexContract, token1, owner } = await loadFixture(
				deployAndAddTokensToPoolFixture
			);
			const amountToSwap = ethers.utils.parseEther('50');

			const dexContractBalance = await token1.balanceOf(dexContract.address);
			const ethBalance = await ethers.provider.getBalance(owner.address);

			const swapToETHTx = await dexContract.swapToETH(
				amountToSwap,
				token1.address
			);

			const newEthBalance = await ethers.provider.getBalance(owner.address);
			const newContractBalance = await token1.balanceOf(dexContract.address);

			expect(newEthBalance).to.be.gt(ethBalance);
			expect(newContractBalance).to.equal(dexContractBalance.add(amountToSwap));
			expect(swapToETHTx).to.emit(dexContract, 'SwapToETH');
		});

		it('Should revert with the right error if amount is zero', async () => {
			const { dexContract, token1, owner } = await loadFixture(
				deployAndAddTokensToPoolFixture
			);

			await expect(dexContract.swapToETH(0, token1.address)).to.be.revertedWith(
				'DEX: amount cannot be zero'
			);
		});

		it('Should revert with the right error if swap amount exceeds pool ETH balance', async () => {
			const amountToSwap = ethers.utils.parseEther('5000');
			const { dexContract, token1, owner } = await loadFixture(
				deployAndAddTokensToPoolFixture
			);

			await expect(
				dexContract.swapToETH(amountToSwap, token1.address)
			).to.be.revertedWith('DEX: Insufficient pool balance');
		});

		it('Should revert with the right error if swap amount exceeds allowance', async () => {
			const amountToSwap = ethers.utils.parseEther('5000000');
			const { dexContract, token1, owner } = await loadFixture(
				deployAndAddTokensToPoolFixture
			);

			await expect(
				dexContract.swapToETH(amountToSwap, token1.address)
			).to.be.revertedWith('DEX: Insufficient allowance');
		});
	});
});
