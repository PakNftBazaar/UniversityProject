require("@nomiclabs/hardhat-waffle");
//require('hardhat-abi-exporter');
require('dotenv').config({path: __dirname+'/.env'})
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
// require('hardhat-ethernal');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// console.log(process.env.ALCHEMY_API)
// console.log(process.env.privateKey)

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// const ALCHEMY_API_KEY = `

// const privateKey = `669a00a5dcee6b12e70ec23b4a793b14bcb38a0f657ce29ada80b578e14743a7`

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: 225000000000,
    },
    goerli: {
      url:`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      accounts: [`0x${process.env.privateKey}`],
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.14",
  paths: {
    artifacts: "./artifact",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  },
  // ethernal: {
  //   email: process.env.ETHERNAL_EMAIL,
  //   password: process.env.ETHERNAL_PASSWORD,
  //   },
  // contractSizer: {
  //   alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  //   only: [':NFT$',':Marketplace$'],
  // },

  // abiExporter: {
  //   path: '.././Frontend/src/contractsData/',
  //   runOnCompile: true,
  //   clear: true,
  //   only: [':NFT$',':Marketplace$'],
  //   flat: true,
  //   spacing: 2,
  //   pretty: true,
  // },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "GC3A7BY9VEP5R54SDEGT3EQVE9G4AC13PV"
  },
  mocha: {
    timeout: 1000000
  }
};
// npx hardhat verify --constructor-args ./arguments.js --network rinkeby 0x8Eb6B4D40D35243352aBAD59BFDB27a161F3Bdc1
//npx hardhat verify --network rinkeby 0x8Eb6B4D40D35243352aBAD59BFDB27a161F3Bdc1 "0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9" "0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9"
