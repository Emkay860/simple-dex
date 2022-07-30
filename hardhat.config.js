require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const INFURA_API_KEY = process.env.INFURA_API_KEY;

const ROPSTEN_PK = process.env.ROPSTEN_PK;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.9',
	networks: {
		ropsten: {
			url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
			accounts: [ROPSTEN_PK],
		},
	},
};
