const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners()
  const decimals = 10**18;

  const Udfi = await hre.ethers.deployContract("Udfi", [owner, "100000"]);
  await Udfi.waitForDeployment();
  console.log(
    `UDFI deployed to ${Udfi.target}`
  );

  const Usdc = await hre.ethers.deployContract("Usdc", [owner, "100000"]);
  await Usdc.waitForDeployment();
  console.log(
    `USDC deployed to ${Usdc.target}`
  );

  const Unidefi = await hre.ethers.deployContract("Unidefi",[Udfi.getAddress(), Usdc.getAddress()]);
  await Unidefi.waitForDeployment();
  console.log(
    `Unidefi deployed to ${Unidefi.target}`
  );

  console.log("_____________________________________________________________");
  // Interaction avec script backend
  console.log("");
  console.log("                         PREFUND");
  console.log("");
  console.log("Envoi de tokens ERC20");
  // Prefund des comptes utilisateurs hardhat
  await Usdc.connect(owner).transfer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",ethers.parseEther("1000"));
  await Udfi.connect(owner).transfer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",ethers.parseEther("1000"));

  await Usdc.connect(owner).transfer("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",ethers.parseEther("1000"));
  //await Udfi.connect(owner).transfer("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",ethers.parseEther("1000"));

  // Log des balances
  const balanceUsdcOwner = await Usdc.balanceOf(owner.address);
  const balanceUsdcAccount2 = await Usdc.balanceOf("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  const balanceUsdcAccount3 = await Usdc.balanceOf("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");

  const balanceUdfiOwner = await Udfi.balanceOf(owner.address);
  const balanceUdfiAccount2 = await Udfi.balanceOf("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  const balanceUdfiAccount3 = await Udfi.balanceOf("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");

  console.log(`Balance Compte Hardhat 1: ${Number(balanceUsdcOwner)/decimals} USDC et ${Number(balanceUdfiOwner)/decimals} UDFI`);
  console.log(`Balance Compte Hardhat 2: ${Number(balanceUsdcAccount2)/decimals} USDC et ${Number(balanceUdfiAccount2)/decimals} UDFI`);
  console.log(`Balance Compte Hardhat 3: ${Number(balanceUsdcAccount3)/decimals} USDC et ${Number(balanceUdfiAccount3)/decimals} UDFI`);
  console.log("");

  // Gestion allowance owner/contrat Unidefi
  await Usdc.connect(owner).approve(Unidefi.getAddress(),ethers.parseEther("10000"));
  await Udfi.connect(owner).approve(Unidefi.getAddress(),ethers.parseEther("10000"));

  console.log(`Allowance USDC accordée au contrat Unidefi: ${Number(await Usdc.connect(owner).allowance(owner.address,Unidefi.getAddress()))/decimals}`);
  console.log(`Allowance UDFI accordée au contrat Unidefi: ${Number(await Udfi.connect(owner).allowance(owner.address,Unidefi.getAddress()))/decimals}`);
  console.log("");

  // Ajout initial de liquidité dans la pool
  console.log("Compte Hardhat 1 ajoute de la liquidité");
  await Unidefi.connect(owner).addLiquidity(ethers.parseEther("10000"),ethers.parseEther("10000"));

  let [usdcReserve, udfiReserve] = await Unidefi.connect(owner).getPoolInfos();
  console.log(`Etat de la pool de liquidité: ${Number(usdcReserve)/decimals} USDC / ${Number(udfiReserve)/decimals} UDFI`)

}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});