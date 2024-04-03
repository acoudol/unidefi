"use client"
import {createContext, useEffect, useState} from "react";
import {useAccount, useReadContract} from "wagmi";
import {abi, contractAddress, udfiAbi, udfiAddress, usdcAbi, usdcAddress} from "@/constants/index.js";


export const UserContext = createContext(null);

const initialUser = {
    balanceUsdc:0,
    balanceUdfi:0,
    lpTokens: 0,
    lpPercent: 0,
    pooledUsdc: 0,
    pooledUdfi: 0,
    address: undefined
}

const UserProvider = ({children}) => {

    const {address: userAddress, isConnected} = useAccount();
    const [user, setUser] = useState(initialUser);

    const {data: balanceUsdc, isFetched: balanceUsdcIsFetched, error: balanceUsdcError, refetch:balanceUsdcRefetch, isRefetching:balanceUsdcIsRefetching, fetchStatus:balanceUsdcFetchStatus} = useReadContract({
        abi: usdcAbi,
        address: usdcAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        account: userAddress
    });

    const {data: balanceUdfi, isFetched: balanceUdfiIsFetched, error: balanceUdfiError, refetch:balanceUdfiRefetch, isRefetching:balanceUdfiIsRefetching, fetchStatus:balanceUdfiFetchStatus} = useReadContract({
        abi: udfiAbi,
        address: udfiAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        account: userAddress
    });

    const {data: myLp, isFetched: myLpIsFetched, error: myLpError, refetch:MyLpRefetch, isRefetching:MyLpIsRefetching, fetchStatus:MyLpFetchStatus} = useReadContract({
        abi: abi,
        address: contractAddress,
        functionName: 'getMyLP',
        account: userAddress
    });

    const {data: lpTotalSupply, isFetched: lpTotalSupplyIsFetched, error: lpTotalSupplyError, refetch:lpTotalSupplyRefetch, isRefetching:lpTotalSupplyIsRefetching, fetchStatus:lpTotalSupplyFetchStatus} = useReadContract({
        abi: abi,
        address: contractAddress,
        functionName: 'getLPTotalSupply',
        account: userAddress
    });

    const {data: previewInfos, isFetched: userPreviewIsFetched, error: userPreviewError, refetch:userPreviewRefetch, isRefetching:userPreviewIsRefetching, fetchStatus:userPreviewFetchStatus} = useReadContract({
        abi: abi,
        address: contractAddress,
        functionName: 'getUserPreviewInfos',
        account: userAddress
    });

    

    useEffect(() => {
        if (isConnected) {
            setUser({
                balanceUsdc:balanceUsdc?balanceUsdc:0,
                balanceUdfi:balanceUdfi?balanceUdfi:0,
                lpTokens: myLp?myLp:0,
                lpPercent: myLp?(Number(myLp) * '100' / Number(lpTotalSupply)):0,
                pooledUsdc: previewInfos?previewInfos[0]:0,
                pooledUdfi: previewInfos?previewInfos[1]:0,
                address: userAddress
            });
        } else {
            setUser(initialUser);
        }
    }, [isConnected, balanceUsdcIsFetched,balanceUsdcIsRefetching, balanceUdfiIsFetched, balanceUdfiIsRefetching, MyLpIsRefetching, userPreviewIsFetched, userPreviewIsRefetching]);

    const updateUser = () => {
        //refetch();
        balanceUsdcRefetch();
        balanceUdfiRefetch();
        MyLpRefetch();
        lpTotalSupplyRefetch();
        userPreviewRefetch();
    }


    return (
        <UserContext.Provider value={{user, updateUser}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider