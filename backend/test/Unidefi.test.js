const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
describe('Test Unidefi Contract', () => {

    async function contractDeployedFixture() {
        const [owner,user1,user2,user3, user4, user5, user6] = await ethers.getSigners();

        const Udfi = await ethers.getContractFactory('Udfi');
        const udfi = await Udfi.deploy(owner.address, "999999");

        const Usdc = await ethers.getContractFactory('Usdc');
        const usdc = await Usdc.deploy(owner.address, "999999");        

        const Unidefi = await ethers.getContractFactory('Unidefi');
        const unidefi = await Unidefi.deploy(udfi.getAddress(), usdc.getAddress());
        
        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    async function deployWith6UsersAndAllowanceFixture() {
        const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await contractDeployedFixture();
        // transfer usdc to users
        await usdc.connect(owner).transfer(user1.address,'200');
        await usdc.connect(owner).transfer(user2.address,'200');
        await usdc.connect(owner).transfer(user3.address,'100');
        await usdc.connect(owner).transfer(user4.address,'200');
        await usdc.connect(owner).transfer(user6.address,'200');
        // transfer udfi to users
        await udfi.connect(owner).transfer(user1.address,'200');
        await udfi.connect(owner).transfer(user2.address,'200');
        await udfi.connect(owner).transfer(user3.address,'100');
        await udfi.connect(owner).transfer(user5.address,'200');
        await udfi.connect(owner).transfer(user6.address,'200');

        // allowance owner
        await usdc.connect(owner).approve(unidefi.getAddress(),'200');
        await udfi.connect(owner).approve(unidefi.getAddress(),'200');
        // allowance user1
        await usdc.connect(user1).approve(unidefi.getAddress(),'200');
        await udfi.connect(user1).approve(unidefi.getAddress(),'200');
        // allowance user2
        await usdc.connect(user2).approve(unidefi.getAddress(),'100');
        await udfi.connect(user2).approve(unidefi.getAddress(),'200');
        // allowance user3
        await usdc.connect(user3).approve(unidefi.getAddress(),'200'); // more allowance than balance for some tests
        await udfi.connect(user3).approve(unidefi.getAddress(),'200');
        // allowance user4
        await usdc.connect(user4).approve(unidefi.getAddress(),'100');
        // allowance user5
        await udfi.connect(user5).approve(unidefi.getAddress(),'100');
        // allowance user6
        await usdc.connect(user6).approve(unidefi.getAddress(),'200');
        await udfi.connect(user6).approve(unidefi.getAddress(),'100');

        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    async function deployWith3LiquidityProviders() {
        const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith6UsersAndAllowanceFixture();
        await unidefi.connect(owner).addLiquidity('200','200');
        await unidefi.connect(user1).addLiquidity('200','200');
        await unidefi.connect(user2).addLiquidity('100','100');

        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5};
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
        it('A user should approve a 200 $UDFI allowance to the contract, and the allowance should be exactly 200', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            await udfi.connect(owner).approve(unidefi.getAddress(),'200');
            expect(await udfi.connect(owner).allowance(owner.address,unidefi.getAddress())).to.be.equal('200');
        })
        it('revert if a user who approved an allowance of 100$USDC and 200$UDFI tries to add 101 $USDC in liquidity pool', async() =>{ 
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user2).addLiquidity('101','101')).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
        it('revert if a user who approved an allowance of 200$USDC and 100$UDFI tries to add 101 $UDFI in liquidity pool', async() =>{ 
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user6).addLiquidity('101','101')).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
    })
    describe('Add liquidity', () => {
        it('initial pool ratio to respect should be 1/1', async() => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.connect(owner).getRatioPoolx1000()).to.be.equal('1000');
        })
        it('with an empty pool, $UDFI value should be 0$', async() =>{
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('0');
        })
        it('should revert if trying to add 199 $USDC and 200 $UDFI, because of pool ratio', async() => {
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(owner).addLiquidity('199','200')).to.be.revertedWithCustomError(unidefi, "PoolBalanceNotRespected");
        })
        it('should revert if trying to add 0 amounts of liquidity', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(owner).addLiquidity('0','0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to add more $USDC than his own balance', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user5).addLiquidity('100','100')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to add more $UDFI than his own balance', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user4).addLiquidity('100','100')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should add 200 $USDC and 200 $UDFI to the pool and get 400 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await unidefi.connect(owner).addLiquidity('200','200');
            expect(await unidefi.connect(owner).getMyLP()).to.be.equal('400');
        })
        it('A second user add same amounts and should also get 400 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner, user1} = await deployWith6UsersAndAllowanceFixture();
            await unidefi.connect(owner).addLiquidity('200','200');
            await unidefi.connect(user1).addLiquidity('200','200');
            expect(await unidefi.connect(user1).getMyLP()).to.be.equal('400');
        })
        it('A third user add 100 each and should get 200 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith3LiquidityProviders();
            expect(await unidefi.connect(user2).getMyLP()).to.be.equal('200');
        })
        it('At this state, total LP tokens should be exactly 1000', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith3LiquidityProviders();
            expect(await unidefi.connect(user2).getLPTotalSupply()).to.be.equal('1000');
        })
        it('At this state, with a 1/1 ratio of USDC/UDFI in the pool, $UDFI value should be 1$', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProviders();
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('1000');
        })
        it('At this state, pool reserve of $USDC should be exactly 500', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProviders();
            let [usdcReserve, udfiReserve] = await unidefi.connect(owner).getPoolInfos();
            expect(usdcReserve).to.be.equal('500');
        })
        it('At this state, pool reserve of $UDFI should be exactly 500', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProviders();
            let [usdcReserve, udfiReserve] = await unidefi.connect(owner).getPoolInfos();
            expect(udfiReserve).to.be.equal('500');
        })
    })
    describe('Remove liquidity', () => {
        it('A user should remove his position, and the LP tokens should be burnt', async() => {
            const {udfi, usdc, unidefi, owner, user1} = await deployWith3LiquidityProviders();
            await unidefi.connect(user1).removeAllLiquidity();
            expect(await unidefi.connect(user1).getMyLP()).to.be.equal('0');
        })
        it('should revert if a user with no pool share tries to remove liquidity', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user3).removeAllLiquidity()).to.be.revertedWithCustomError(unidefi, "NoPoolShare");
        })
    })
    describe('Swap', () => {
        it('a user should swap usdc for udfi', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProviders();
            //console.log(await usdc.connect(user4).balanceOf(user4.address));
            expect(await unidefi.connect(user4).swapUSDCForUDFI('100')).to.emit(unidefi, 'UsdcSwap').withArgs(user4, '100');

        })
        it('a user should swap udfi for usdc', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProviders();
            expect(await unidefi.connect(user5).swapUDFIForUSDC('100')).to.emit(unidefi, 'UdfiSwap')
        })
        it('should revert if a user tries to swap 0 $USDC', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user4).swapUSDCForUDFI('0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to swap 0 $UDFI', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user4).swapUDFIForUSDC('0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if trying to swap but the liquidity pool is empty', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(user4).swapUSDCForUDFI('100')).to.be.revertedWithCustomError(unidefi, "InsufficientLiquidity");
        })
        it('should revert if trying to swap more $USDC amount than the user actual balance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user5).swapUSDCForUDFI('100')).to.be.revertedWithCustomError(unidefi, "InsufficientBalance");
        })
        it('should revert if trying to swap more $USDC amount than the user actual balance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user4).swapUDFIForUSDC('100')).to.be.revertedWithCustomError(unidefi, "InsufficientBalance");
        })
        it('should revert if trying to swap more $USDC than the approved allowance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user4).swapUSDCForUDFI('101')).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
        it('should revert if trying to swap more $UDFI than the approved allowance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProviders();
            await expect(unidefi.connect(user5).swapUDFIForUSDC('101')).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
    })


})