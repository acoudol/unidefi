const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const decimals = 10**18;
describe('Test Unidefi Contract', () => {

    async function contractDeployedFixture() {
        const [owner,user1,user2,user3, user4, user5, user6] = await ethers.getSigners();

        const Udfi = await ethers.getContractFactory('Udfi');
        const udfi = await Udfi.deploy(owner.address, 999999);

        const Usdc = await ethers.getContractFactory('Usdc');
        const usdc = await Usdc.deploy(owner.address, 999999);        

        const Unidefi = await ethers.getContractFactory('Unidefi');
        const unidefi = await Unidefi.deploy(udfi.getAddress(), usdc.getAddress());
        
        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    async function deployWith6UsersAndAllowanceFixture() {
        const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await contractDeployedFixture();
        // transfer usdc to users
        await usdc.connect(owner).transfer(user1.address,ethers.parseEther("2000"));
        await usdc.connect(owner).transfer(user2.address,ethers.parseEther("2000"));
        await usdc.connect(owner).transfer(user3.address,ethers.parseEther("1000"));
        await usdc.connect(owner).transfer(user4.address,ethers.parseEther("2000"));
        await usdc.connect(owner).transfer(user6.address,ethers.parseEther("2000"));
        // transfer udfi to users
        await udfi.connect(owner).transfer(user1.address,ethers.parseEther("2000"));
        await udfi.connect(owner).transfer(user2.address,ethers.parseEther("2000"));
        await udfi.connect(owner).transfer(user3.address,ethers.parseEther("1000"));
        await udfi.connect(owner).transfer(user5.address,ethers.parseEther("2000"));
        await udfi.connect(owner).transfer(user6.address,ethers.parseEther("2000"));

        // allowance owner
        await usdc.connect(owner).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        await udfi.connect(owner).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        // allowance user1
        await usdc.connect(user1).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        await udfi.connect(user1).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        // allowance user2
        await usdc.connect(user2).approve(unidefi.getAddress(),ethers.parseEther("1000"));
        await udfi.connect(user2).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        // allowance user3
        await usdc.connect(user3).approve(unidefi.getAddress(),ethers.parseEther("2000")); // more allowance than balance for tests
        await udfi.connect(user3).approve(unidefi.getAddress(),ethers.parseEther("2000")); // more allowance than balance for tests
        // allowance user4
        await usdc.connect(user4).approve(unidefi.getAddress(),ethers.parseEther("1000"));
        // allowance user5
        await udfi.connect(user5).approve(unidefi.getAddress(),ethers.parseEther("1000"));
        // allowance user6
        await usdc.connect(user6).approve(unidefi.getAddress(),ethers.parseEther("2000"));
        await udfi.connect(user6).approve(unidefi.getAddress(),ethers.parseEther("1000"));

        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    async function deployWith3LiquidityProvidersFixture() {
        const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await deployWith6UsersAndAllowanceFixture();
        await unidefi.connect(owner).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"));
        await unidefi.connect(user1).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"));
        await unidefi.connect(user2).addLiquidity(ethers.parseEther("1000"),ethers.parseEther("1000"));

        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    async function deployWithLiquidityAndSwapFixture() {
        const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await deployWith3LiquidityProvidersFixture();

        await unidefi.connect(user4).swapUSDCForUDFI(ethers.parseEther("100"));

        return {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6};
    }

    describe('Deployment', () => {
        it('should deploy the smart contracts', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.owner()).to.be.equal(owner);
        });
        it('Owner should have 999999 $UDFI', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            const balanceUdfiOwner = await udfi.balanceOf(owner.address);
            expect(Number(balanceUdfiOwner)/(10**18)).to.be.equal(999999);
        })
        it('Owner should have 999999 $USDC', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            const balanceUsdcOwner = await usdc.balanceOf(owner.address);
            expect(Number(balanceUsdcOwner)/(10**18)).to.be.equal(999999);
        })
    })
    describe('Allowance', () => {
        it('A user should approve a 2000 $USDC allowance to the contract, and the allowance should be exactly 2000', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            await usdc.connect(owner).approve(unidefi.getAddress(),ethers.parseEther("2000"));
            expect(await usdc.connect(owner).allowance(owner.address,unidefi.getAddress())/BigInt(decimals)).to.be.equal(2000);
        })
        it('A user should approve a 2000 $UDFI allowance to the contract, and the allowance should be exactly 2000', async () => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            await udfi.connect(owner).approve(unidefi.getAddress(),ethers.parseEther("2000"));
            expect(await udfi.connect(owner).allowance(owner.address,unidefi.getAddress())/BigInt(decimals)).to.be.equal('2000');
        })
        it('revert if a user who approved an allowance of 1000$USDC and 2000$UDFI tries to add 1001 $USDC in liquidity pool', async() =>{ 
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user2).addLiquidity(ethers.parseEther("1001"),ethers.parseEther("1001"))).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
        it('revert if a user who approved an allowance of 2000$USDC and 1000$UDFI tries to add 1001 $UDFI in liquidity pool', async() =>{ 
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5, user6} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user6).addLiquidity(ethers.parseEther("1001"),ethers.parseEther("1001"))).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
    })
    describe('Add liquidity', () => {
        it('before adding liquidity, claimable USDC should be 0', async()=>{
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            let [usdcPreview, udfiPreview] = await unidefi.connect(owner).getUserPreviewInfos();
            expect(usdcPreview).to.be.equal('0');
        })
        it('before adding liquidity, claimable UDFI should be 0', async()=>{
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            let [usdcPreview, udfiPreview] = await unidefi.connect(owner).getUserPreviewInfos();
            expect(udfiPreview).to.be.equal('0');
        })
        it('initial pool ratio to respect should be 1/1', async() => {
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.connect(owner).getRatioPoolx1000()).to.be.equal('1000');
        })
        it('with an empty pool, starting value for $UDFI should be 1$', async() =>{
            const {udfi, usdc, unidefi, owner} = await loadFixture(contractDeployedFixture);
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('1000');
        })
        it('should revert if trying to add 1900 $USDC and 2000 $UDFI, because of pool ratio to respect', async() => {
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(owner).addLiquidity(ethers.parseEther("1900"),ethers.parseEther("2000"))).to.be.revertedWithCustomError(unidefi, "PoolBalanceNotRespected");
        })
        it('should revert if trying to add 2000 $USDC and 1900 $UDFI, because of pool ratio to respect', async() => {
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(owner).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("1900"))).to.be.revertedWithCustomError(unidefi, "PoolBalanceNotRespected");
        })
        it('should revert if trying to add 0 amounts of liquidity', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await expect(unidefi.connect(owner).addLiquidity('0','0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to add more $USDC than his own balance', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user5).addLiquidity(ethers.parseEther("1000"),ethers.parseEther("1000"))).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to add more $UDFI than his own balance', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith6UsersAndAllowanceFixture();
            expect(unidefi.connect(user4).addLiquidity(ethers.parseEther("1000"),ethers.parseEther("1000"))).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should emit a specific event when adding liquidity to the pool', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            expect(await unidefi.connect(owner).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"))).to.emit(unidefi, 'LiquidityAdded').withArgs(owner, '2000', '2000', '4000');
        })
        it('A 1st user should add 2000 $USDC and 2000 $UDFI to the pool and get 4000 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith6UsersAndAllowanceFixture();
            await unidefi.connect(owner).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"));
            expect(await unidefi.connect(owner).getMyLP()).to.be.equal('4000');
        })
        it('A 2nd user adding same amounts should also get 4000 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner, user1} = await deployWith6UsersAndAllowanceFixture();
            await unidefi.connect(owner).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"));
            await unidefi.connect(user1).addLiquidity(ethers.parseEther("2000"),ethers.parseEther("2000"));
            expect(await unidefi.connect(user1).getMyLP()).to.be.equal('4000');
        })
        it('A 3rd user adding 1000 $USDC and 1000 $UDFI should get 2000 LP in return', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(user2).getMyLP()).to.be.equal('2000');
        })
        it('At this state, total LP tokens should be exactly 10000', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(user2).getLPTotalSupply()).to.be.equal('10000');
        })
        it('At this state, with a 1/1 ratio of USDC/UDFI in the pool, $UDFI value should be 1$', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('1000');
        })
        it('At this state, pool reserve of $USDC should be exactly 5000', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProvidersFixture();
            let [usdcReserve, udfiReserve] = await unidefi.connect(owner).getPoolInfos();
            expect(usdcReserve/BigInt(decimals)).to.be.equal('5000');
        })
        it('At this state, pool reserve of $UDFI should be exactly 5000', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProvidersFixture();
            let [usdcReserve, udfiReserve] = await unidefi.connect(owner).getPoolInfos();
            expect(udfiReserve/BigInt(decimals)).to.be.equal('5000');
        })
    })
    describe('Remove liquidity', () => {
        it('should emit a specific event when removing liquidity from the pool', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(owner).removeAllLiquidity()).to.emit(unidefi, 'LiquidityRemoved').withArgs(owner, '2000', '2000', '4000');
        })
        it('A user should remove his position, and the LP tokens should be burnt', async() => {
            const {udfi, usdc, unidefi, owner, user1} = await deployWith3LiquidityProvidersFixture();
            await unidefi.connect(user1).removeAllLiquidity();
            expect(await unidefi.connect(user1).getMyLP()).to.be.equal('0');
        })
        it('should revert if a user with no pool share tries to remove liquidity', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user3).removeAllLiquidity()).to.be.revertedWithCustomError(unidefi, "NoPoolShare");
        })
    })
    describe('Swap', () => {
        it('should emit a specific event when a user swap usdc for udfi', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(user4).swapUSDCForUDFI(ethers.parseEther("1000"))).to.emit(unidefi, 'UsdcSwap').withArgs(user4, '1000');
        })
        it('should emit a specific event when a user swap udfi for usdc', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProvidersFixture();
            expect(await unidefi.connect(user5).swapUDFIForUSDC(ethers.parseEther("1000"))).to.emit(unidefi, 'UdfiSwap').withArgs(user5, '1000');
        })
        it('should revert if a user tries to swap 0 $USDC', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user4).swapUSDCForUDFI('0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if a user tries to swap 0 $UDFI', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user4).swapUDFIForUSDC('0')).to.be.revertedWithCustomError(unidefi, "IncorrectAmount");
        })
        it('should revert if trying to swap more than than actual liquidity reserve', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith6UsersAndAllowanceFixture(); // no liquidity in the pool
            await expect(unidefi.connect(user4).swapUSDCForUDFI(ethers.parseEther("1000"))).to.be.revertedWithCustomError(unidefi, "InsufficientLiquidity");
        })
        it('should revert if trying to swap more $USDC amount than the user actual balance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user5).swapUSDCForUDFI(ethers.parseEther("1000"))).to.be.revertedWithCustomError(unidefi, "InsufficientBalance");
        })
        it('should revert if trying to swap more $USDC amount than the user actual balance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user4).swapUDFIForUSDC(ethers.parseEther("1000"))).to.be.revertedWithCustomError(unidefi, "InsufficientBalance");
        })
        it('should revert if trying to swap more $USDC than the approved allowance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user4).swapUSDCForUDFI(ethers.parseEther("1001"))).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
        it('should revert if trying to swap more $UDFI than the approved allowance', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4, user5} = await deployWith3LiquidityProvidersFixture();
            await expect(unidefi.connect(user5).swapUDFIForUSDC(ethers.parseEther("1001"))).to.be.revertedWithCustomError(unidefi, "InsufficientAllowance");
        })
    })
    describe('Tests after liquidity provided and pool unbalanced by swaps', () => {
        it('A user who swapped 100 USDC in a 5000/5000 pool should have received 97 UDFI (unbalancing the pool impacts the amount received)', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2, user3, user4} = await deployWithLiquidityAndSwapFixture();
            expect(await udfi.connect(user4).balanceOf(user4.address)/BigInt(decimals)).to.be.equal('97');
        })
        it('The $UDFI value should should be impacted by the pool ratio and should now be 1.04$', async() =>{
            const {udfi, usdc, unidefi, owner} = await deployWithLiquidityAndSwapFixture();
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('1040');
        })
        it('The 3rd provider can estimate its pool share before removing liquidity, and see 1020 usdc ', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            let [usdcPreview, udfiPreview] = await unidefi.connect(user2).getUserPreviewInfos();
            expect(usdcPreview/BigInt(decimals)).to.be.equal('1020');
        })
        it('The 3rd provider can estimate its pool share before removing liquidity, and see 980 udfi ', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            let [usdcPreview, udfiPreview] = await unidefi.connect(user2).getUserPreviewInfos();
            expect(udfiPreview/BigInt(decimals)).to.be.equal('980');
        })        
        it('The 3rd provider should remove its position should get back exactly 1020 $USDC', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            expect(await usdc.balanceOf(user2.address)/BigInt(decimals)).to.be.equal('2020'); // This user previously had 1000 USDC balance left in its wallet
        })
        it('... and 980 $UDFI', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            expect(await udfi.balanceOf(user2)/BigInt(decimals)).to.be.equal('1980'); // This user previously had 1000 UDFI balance left in its wallet
        })
        it('Before removing its liquidity, its LP balance should now be exactly 2000', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            expect(await unidefi.connect(user2).getMyLP()).to.be.equal('2000');
        })
        it('After removing its liquidity, its LP balance should now be exactly 0', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            expect(await unidefi.connect(user2).getMyLP()).to.be.equal('0');
        })
        it('Pool infos should now display a reserve of 4080 $USDC', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            let [usdcReserve, udfiReserve] = await unidefi.getPoolInfos();
            expect(usdcReserve/BigInt(decimals)).to.be.equal('4080');
        })
        it('Pool infos should now display a reserve of 3921 $UDFI', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            let [usdcReserve, udfiReserve] = await unidefi.getPoolInfos();
            expect(udfiReserve/BigInt(decimals)).to.be.equal('3921');
        })
        it('USDC/UDFI pool ratio should now be 1.04', async() => {
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            expect(await unidefi.connect(owner).getRatioPoolx1000()).to.be.equal('1040');
        })
        it('The value of 1$UDFI should be 1.04$', async() =>{
            const {udfi, usdc, unidefi, owner, user1, user2} = await deployWithLiquidityAndSwapFixture();
            await unidefi.connect(user2).removeAllLiquidity();
            expect(await unidefi.connect(owner).getValueUdfiX1000()).to.be.equal('1040');
        })
    })
})