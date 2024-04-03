"use client"
import {createContext, useEffect, useState} from "react";
import {useAccount, useReadContract} from "wagmi";
import {abi, contractAddress} from "@/constants/index.js";


export const PoolContext = createContext(null);

const initialPool = {
    totalUsdc: 0,
    totalUdfi: 0,
    TVL: 0,
    lpTotalSupply: 0,
    ratioUsdcUdfi:1
}

const PoolProvider = ({children}) => {

    const {address: userAddress, isConnected} = useAccount();
    const [totalPool, setTotalPool] = useState(initialPool);

    const {data: poolInfos, isFetched, error: poolInfosError, refetch, isRefetching, fetchStatus} = useReadContract({
        abi: abi,
        address: contractAddress,
        functionName: 'getPoolInfos',
        account: userAddress
    });

    // const {data: lpTotalSupply, error: lpTotalSupplyError, } = useReadContract({
    //     abi: abi,
    //     address: contractAddress,
    //     functionName: 'getLPTotalSupply',
    //     account: userAddress
    // });


    useEffect(() => {
        if (isConnected) {
            setTotalPool({
                totalUsdc: poolInfos?poolInfos[0]:0,
                totalUdfi: poolInfos?poolInfos[1]:0,
                TVL: poolInfos?(poolInfos[0] * BigInt(2)):0,
                lpTotalSupply: poolInfos?poolInfos[2]:0,
                ratioUsdcUdfiX1000:poolInfos?poolInfos[1]!=0?(poolInfos[0] * BigInt(1000) / poolInfos[1]) : 1000: 1000
            });
        } else {
            setTotalPool(initialPool);
        }
    }, [isConnected, isFetched, isRefetching]);


    const updateTotalPool = () => {
        refetch();
    }


    return (
        <PoolContext.Provider value={{totalPool, updateTotalPool}}>
            {children}
        </PoolContext.Provider>
    )
}
export default PoolProvider