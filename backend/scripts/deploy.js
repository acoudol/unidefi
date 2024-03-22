const hre = require("hardhat");
const {ethers} = require("hardhat")

async function main() {
  const [owner, account1] = await ethers.getSigners() // pour test hardhat

  const udfi = await hre.ethers.deployContract("Udfi");
  await udfi.waitForDeployment();
  console.log(
    `UDFI deployed to ${udfi.target}`
  );

  const unidefi = await hre.ethers.deployContract("Unidefi",[udfi.getAddress()]);
  await unidefi.waitForDeployment();
  console.log(
    `Unidefi deployed to ${unidefi.target}`
  );

  // test hardhat - au déploiement, mint de 100 tokens $UDFI sur le contrat Unidefi
  await udfi.faucet(unidefi.getAddress(),100)
  const balance00 = await udfi.balanceOf(unidefi.getAddress())
  console.log("Balance contrat:",balance00.toString())

  // test hardhat - transfert de 100$UDFI de Unidefi à l'address 1 
  await unidefi.foo(account1.address,100)

  const balance0 = await udfi.balanceOf(unidefi.getAddress())
  const balance1 = await udfi.balanceOf(account1.address)

  console.log("Balance contrat:",balance0.toString())
  console.log("Balance compte 1:",balance1.toString())
  
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});