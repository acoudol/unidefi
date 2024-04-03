"use client"
import {useContext, useEffect, useState} from "react";
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, HStack, NumberInput, Divider, Select, Image, Tooltip, Spinner, useToast } from "@chakra-ui/react";
import { abi, contractAddress, udfiAbi, udfiAddress, usdcAbi, usdcAddress } from '@/constants'
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { UserContext } from '../contexts/UserContext.jsx';
import { PoolContext } from '@/contexts/PoolContext.jsx';
import { ArrowDownIcon, RepeatIcon, InfoOutlineIcon } from "@chakra-ui/icons";

const Swap = ({ tokenA, tokenB }) => {
    
    const decimals = 10**18;

    const {user, updateUser} = useContext(UserContext);
    const {totalPool, updateTotalPool} = useContext(PoolContext);

    const [switchSwap, setSwitchSwap] = useState(false);
    const [usdcInput, setUsdcInput] = useState(0);
    const [udfiInput, setUdfiInput] = useState(0);

    const toast = useToast();

    const {data: hash, isPending, writeContract, writeContractAsync} = useWriteContract({
        mutation: {
            // Si ça a marché d'écrire dans le contrat
            onSuccess: () => {
                // toast({
                //     title: "Your request is being submitted",
                //     status: "info",
                //     duration: 6000,
                //     isClosable: true,
                // });
            },
            // Si erreur
            onError: (error) => {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                });
            },
        },
    });

    const {status, failureReason} = useWaitForTransactionReceipt({
        hash,
    })

    const swapUSDCForUDFI = async () => {
        await writeContractAsync({
            abi: usdcAbi,
            address: usdcAddress,
            functionName: 'approve',
            args: [contractAddress,Number(usdcInput)*decimals],
            account: user.address
        })
        writeContract({
            abi: abi,
            address: contractAddress,
            functionName: 'swapUSDCForUDFI',
            args: [Number(usdcInput)*decimals],
            account: user.address
        })
    }    
    const swapUDFIForUSDC = async () => {
        await writeContractAsync({
            abi: udfiAbi,
            address: udfiAddress,
            functionName: 'approve',
            args: [contractAddress,Number(udfiInput)*decimals],
            account: user.address
        })
        writeContract({
            abi: abi,
            address: contractAddress,
            functionName: 'swapUDFIForUSDC',
            args: [Number(udfiInput)*decimals],
            account: user.address
        })
    }    
    useEffect(() => {
        if (status === 'success') {

            updateUser();
            updateTotalPool();

            toast({
                title: "Tokens swapped successfully",
                status: "success",
                duration: 6000,
                isClosable: true,
            });

        } else if (status === 'error') {
            toast({
                title: `An error has occurred : ${failureReason}`,
                status: "error",
                duration: 6000,
                isClosable: true,
            });
        }
    }, [status]);

    useEffect(() => {
        setUsdcInput(0);
        setUdfiInput(0);
    }, [switchSwap])


    return (
        <Box p={8}  className="swap-box" >
        <Flex  direction="column" width="100%" >
            <Flex direction="row" justifyContent="space-between">
                <Flex direction="row" >
                    <Text color="white" fontSize="1.5em" fontWeight="bold"> SWAP </Text>
                    <Text color="white" fontSize="1em" fontWeight="bold" marginTop="0.5rem" marginLeft="1rem"> (fee 0.3%) </Text>
                </Flex>
                <Tooltip hasArrow label='Change swap direction' bg='rgb(109,65,88)' placement='top-start'>
                    <Button alt="Change swap" bgColor="rgb(254,211,255, 0)" borderRadius="50%"  width="1rem">
                        <RepeatIcon boxSize={9} color="white" bgColor="rgb(109,65,88)" borderRadius="50%" padding="0.3rem" onClick={() => setSwitchSwap(!switchSwap)}/>
                    </Button>
                </Tooltip>
            </Flex>
        
            <Box padding="0.7em" borderRadius="1em" bgColor="rgb(254,211,255, 0.5)" marginTop="1rem">
                {switchSwap == false ? (
                    <>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Flex direction="row" justifyContent="start" width="100%">
                                <Image src="/logo_usdc.png" alt="logo usdc" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                                <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>USDC</Text>
                            </Flex>
                            <Input border="none" 
                            type="number" 
                            position="relative" 
                            textAlign="right" 
                            top="0.1em" 
                            placeholder="0" 
                            width="100%" 
                            fontSize="2em"
                            value={usdcInput} 
                            //onChange={(e) => {setUsdcInput(e.target.value) ; setUdfiInput(Number(e.target.value) * Number(totalPool.ratioUsdcUdfiX1000) / 1000)}}
                            onChange={(e) => {setUsdcInput(e.target.value) ; setUdfiInput(Number(e.target.value)*997 * Number(totalPool.totalUdfi) / ((Number(totalPool.totalUsdc)*1000)+(Number(e.target.value)*997)))}}
                            />
                        </Flex>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Text marginLeft="1rem">Balance: {(Number(user.balanceUsdc)/decimals).toFixed(2)}</Text>
                            <Text marginRight="1rem">{usdcInput?Number(usdcInput).toFixed(2):"-"} $</Text>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Flex direction="row" justifyContent="left" width="100%">
                                <Image src="/logo_unidefi3bis.png" alt="logo unidefi" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                                <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>UDFI</Text>
                            </Flex>
                            <Input border="none" 
                            type="number" 
                            position="relative" 
                            textAlign="right" 
                            top="0.1em" 
                            placeholder="0" 
                            width="100%" 
                            fontSize="2em"
                            value={udfiInput} 
                            //onChange={(e) => {setUdfiInput(e.target.value) ; setUsdcInput(Number(e.target.value) * 1000 / Number(totalPool.ratioUsdcUdfiX1000))}}/>
                            onChange={(e) => {setUdfiInput(e.target.value) ; setUsdcInput(Number(e.target.value)*997 * Number(totalPool.totalUsdc) / ((Number(totalPool.totalUdfi)*1000)+(Number(e.target.value)*997)))}}/>
                        </Flex>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Text marginLeft="1rem">Balance: {(Number(user.balanceUdfi)/decimals).toFixed(2)}</Text>
                            <Text marginRight="1rem">{udfiInput?(Number(udfiInput)*0.997 * (Number(totalPool.totalUsdc)-Number(usdcInput)) / (Number(totalPool.totalUdfi)+(Number(udfiInput)*0.997))).toFixed(2):"-"} $</Text>
                        </Flex>
                    </>
                )}
            </Box>
            
            <Flex direction="row" width="100%" marginTop="2.1rem" marginBottom="0.5rem">
                <Divider border='solid'  width="100%" color="white" marginRight="0.5rem"/>
                <ArrowDownIcon padding="0.3rem" position="relative" bottom="1rem" color="white" opacity="60%" boxSize="40px" backgroundColor= "rgba(255, 255, 255, 0.2)" borderRadius="50%" />
                <Divider border='solid' width="100%" color="white" marginLeft="0.5rem" />
            </Flex>

            <Box padding="0.7em" borderRadius="1em" bgColor="rgb(254,211,255, 0.5)">
            {switchSwap == false ? (
                    <>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Flex direction="row" justifyContent="start" width="100%">
                                <Image src="/logo_unidefi3bis.png" alt="logo usdc" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                                <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>UDFI</Text>
                            </Flex>
                            <Input isDisabled={true} 
                            type="number" 
                            border="none" 
                            position="relative" 
                            textAlign="right" 
                            top="0.1em" 
                            placeholder="0" 
                            width="100%" 
                            fontSize="2em"
                            value={(Number(udfiInput)*0.997).toFixed(2)}/>
                        </Flex>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Text marginLeft="1rem">Balance: {(Number(user.balanceUdfi)/decimals).toFixed(2)}</Text>
                            <Text //</Flex>marginRight="1rem">{udfiInput?(Number(udfiInput)*997/Number(totalPool.ratioUsdcUdfiX1000)):"-"} $</Text>
                                    marginRight="1rem">{udfiInput?(Number(udfiInput)*0.997 * (Number(totalPool.totalUsdc)+Number(usdcInput)) / (Number(totalPool.totalUdfi)-(Number(udfiInput)*0.997))).toFixed(2):"-"} $</Text>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Flex direction="row" justifyContent="left" width="100%">
                                <Image src="/logo_usdc.png" alt="logo usdc" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                                <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>USDC</Text>
                            </Flex>
                            <Input isDisabled={true} 
                            type="number" 
                            border="none" 
                            position="relative" 
                            textAlign="right" 
                            top="0.1em" 
                            placeholder="0" 
                            width="100%" 
                            fontSize="2em"
                            value={(Number(usdcInput)*0.997).toFixed(2)} />
                        </Flex>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Text marginLeft="1rem">Balance: {(Number(user.balanceUsdc)/decimals).toFixed(2)}</Text>
                            <Text marginRight="1rem">{usdcInput?(Number(usdcInput)*0.997).toFixed(2) :"-"} $</Text>
                        </Flex>
                    </>
                )}
            </Box>

            <Flex direction="row" alignItems="center" marginTop="2em" marginLeft="11rem">
                <Button backgroundColor='#6d4158'
                        color='white'
                        _hover={{bg: "#4b384e"}}
                        onClick={switchSwap == false ? (swapUSDCForUDFI):(swapUDFIForUSDC)}
                        width='10rem'>
                        {isPending ? (<Spinner/>) : ('Confirm SWAP')}
                </Button>
                <Tooltip hasArrow label='Higher amount leads to higher price impact' bg='rgb(109,65,88)' placement='right-start'>
                    <InfoOutlineIcon boxSize={9} color="white"  borderRadius="50%" padding="0.3rem" marginLeft="1rem"/>
                </Tooltip>
            </Flex>
        </Flex>
        </Box>
    );
};

export default Swap;