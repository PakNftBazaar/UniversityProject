const { ethers, hre, artifacts } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  
  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory("NFT");
  const MarketPlace = await ethers.getContractFactory("MarketPlace");
  const token = await ethers.getContractFactory("Token");

  // deploy contracts
  const nft = await NFT.deploy();
  const Token = await token.deploy();
  const marketplace = await MarketPlace.deploy("10");

  console.log(
    "NFTContracts",nft.address
  ); 
  
  console.log(
    "Marketplace",marketplace.address
  );
  console.log(
    "Token",Token.address
  );
 
  // for(let i =1;i<2;i++){
  //   await nft.mint("https://ipfs.io/ipfs/QmcJJgMFKeiWdY6z2hahRxXnHkFBM25cREjzVaDE89PFxX","1000");
  // }
  
  // await nft.setApprovalForAll(marketplace.address,true);
  // for(let i =1;i<2;i++){
  //   const price = ethers.utils.parseEther("1")
  // console.log(price.toString())
  //   await marketplace.createAuction(nft.address, i, price.toString(),"4200");
  // }
    


  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(marketplace , "MarketPlace");
  saveFrontendFiles(nft , "NFT");
  saveFrontendFiles(Token , "Token");

}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
