const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
describe('Test Unidefi Contract', () => {

    async function contractDeployedFixture() {
        const [
            owner,
            voter1,
            voter2,
            voter3,
            nonVoter
        ] = await ethers.getSigners();

        const Udfi = await ethers.getContractFactory('Udfi');
        const udfi = await Udfi.deploy(owner.address, "999999");

        const Usdc = await ethers.getContractFactory('Usdc');
        const usdc = await Usdc.deploy(owner.address, "999999");        

        const Unidefi = await ethers.getContractFactory('Unidefi');
        const unidefi = await Unidefi.deploy(usdc.getAddress(), udfi.getAddress());
        
        return {udfi, usdc, unidefi, owner, voter1, voter2, voter3, nonVoter};
    }

    describe('Deployment', () => {
        it('should deploy the smart contracts', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.owner()).to.be.equal(owner);
        });
        it('Owner should have 999999 $UDFI', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            const balanceUdfiOwner = await udfi.balanceOf(owner.address);
            expect(balanceUdfiOwner).to.be.equal('999999');
        })
        it('Owner should have 999999 $USDC', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            const balanceUsdcOwner = await usdc.balanceOf(owner.address);
            expect(balanceUsdcOwner).to.be.equal('999999');
        })
    })
    describe('Allowance', () => {
        it('A user should approve a 200 $USDC allowance to the contract, and the allowance should be exactly 200', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            await usdc.connect(owner).approve(unidefi.getAddress(),'200');
            expect(await usdc.connect(owner).allowance(owner.address,unidefi.getAddress())).to.be.equal('200');
        })
        it('A user should approve a 200 $UDDI allowance to the contract, and the allowance should be exactly 200', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            await udfi.connect(owner).approve(unidefi.getAddress(),'200');
            expect(await udfi.connect(owner).allowance(owner.address,unidefi.getAddress())).to.be.equal('200');
        })
    })

})