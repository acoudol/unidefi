const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners() // pour test hardhat
  //const decimals=10**6;
  //const toMint= 999999*decimals;

  const Udfi = await hre.ethers.deployContract("Udfi", [owner, "999999"]);
  await Udfi.waitForDeployment();
  console.log(
    `UDFI deployed to ${Udfi.target}`
  );

  const Usdc = await hre.ethers.deployContract("Usdc", [owner, "999999"]);
  await Usdc.waitForDeployment();
  console.log(
    `USDC deployed to ${Usdc.target}`
  );

  const unidefi = await hre.ethers.deployContract("Unidefi",[Udfi.getAddress(), Usdc.getAddress()]);
  await unidefi.waitForDeployment();
  console.log(
    `Unidefi deployed to ${unidefi.target}`
  );

}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});