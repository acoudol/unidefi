require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const PRIVATE_KEY_HARDHAT = process.env.PRIVATE_KEY_HARDHAT || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",

    defaultNetwork: "localhost",

    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [`0x${PRIVATE_KEY}`],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
            //accounts: [`0x${PRIVATE_KEY_HARDHAT}`]
        },
        hardhat: {
            blockGasLimit: 10000000000000,
            //allowUnlimitedContractSize: true,
          },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    docgen: {},
};