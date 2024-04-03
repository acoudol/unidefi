"use client"
import { Box, Flex, FormControl, FormErrorMessage, FormHelperText, Input, Button, Text, Divider, Image, Spinner, useToast} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import {abi, contractAddress, udfiAbi, udfiAddress, usdcAbi, usdcAddress} from '@/constants'
import {useContext, useEffect, useState} from "react";
import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import { UserContext } from '../contexts/UserContext.jsx';
import { PoolContext } from '@/contexts/PoolContext.jsx';

const PoolAdd = () => {

    const decimals = 10**18;

    const {user, updateUser} = useContext(UserContext);
    const {totalPool, updateTotalPool} = useContext(PoolContext);

    const [usdcInput, setUsdcInput] = useState(0);
    const [udfiInput, setUdfiInput] = useState(0);

    const toast = useToast();

    const {data: hash, isPending, writeContract, writeContractAsync} = useWriteContract({
        mutation: {
            // Si ça a marché d'écrire dans le contrat
            onSuccess: () => {
                // toast({
                //     title: "Transaction submitted",
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

    const addLiquidity = async () => {
        writeContractAsync({
            abi: usdcAbi,
            address: usdcAddress,
            functionName: 'approve',
            args: [contractAddress,Number(usdcInput)*decimals],
            account: user.address
        })
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
            functionName: 'addLiquidity',
            args: [Number(usdcInput)*decimals, Number(udfiInput)*decimals],
            account: user.address
        })
    }

    useEffect(() => {
        if (status === 'success') {

            updateUser();
            updateTotalPool();
            setUsdcInput('');
            setUdfiInput('');
            toast({
                title: "Liquidity added successfully",
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

    return (
        <Box p={8}  className="addLiquidity-box" >
            <Flex  direction="column" width="100%" >
            <Flex direction="row" alignContent="left">
                <Text color="white" fontSize="1.5em" fontWeight="bold"> Add liquidity </Text>
            </Flex>
            <Divider border='solid' width="100%" color="white" marginTop="1.2rem" marginBottom="1rem"/>
            <Box padding="0.7em" border="0.2rem solid" borderColor="grey" borderRadius="1em" bgColor="rgb(254,211,255, 0.5)">
                <Flex direction="row" justifyContent="space-between" width="100%">
                    <Flex direction="row" justifyContent="start" width="100%">
                        <Image src="/logo_usdc.png" alt="logo usdc" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                        <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>USDC</Text>
                    </Flex>
                    <Input border="none" 
                    type="number" 
                    position="relative" 
                    textAlign="right" top="0.1em" 
                    placeholder="0" width="100%" 
                    fontSize="2em" 
                    value={usdcInput} 
                    onChange={(e) => {setUsdcInput(e.target.value) ; setUdfiInput(Number(e.target.value) * Number(totalPool.ratioUsdcUdfiX1000) / 1000)}}/>
                </Flex>
                <Flex direction="row"  width="100%">
                    <Text marginLeft="1rem">Balance: {(Number(user.balanceUsdc)/decimals).toFixed(2)}</Text>
                </Flex>
            </Box>
            
            <Flex direction="row" width="100%"  justifyContent="center" marginTop="0.5rem" marginBottom="0.5rem">
                <AddIcon padding="0.3rem"  color="white"  boxSize="40px" backgroundColor= "rgba(255, 255, 255, 0.2)" borderRadius="50%" />
            </Flex>

            <Box padding="0.7em" border="0.2rem solid" borderColor="grey" borderRadius="1em" bgColor="rgb(254,211,255, 0.5)" >
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
                    onChange={(e) => {setUdfiInput(e.target.value) ; setUsdcInput(Number(e.target.value) * 1000 / Number(totalPool.ratioUsdcUdfiX1000))}}/>
                </Flex>
                <Flex direction="row" width="100%">
                    <Text marginLeft="1rem">Balance: {(Number(user.balanceUdfi)/decimals).toFixed(2)}</Text>
                </Flex>
            </Box>
            <Divider border='solid'  width="100%" color="white" marginTop="2rem" marginBottom="0.2rem"/>
            <Box padding="0.7em" borderRadius="1em" >
                    <table  >
                        <tbody>
                            <tr>
                                <td>
                                    <Text>Total Value added</Text>
                                </td>
                                <td>
                                    <Text>{usdcInput * 2} $</Text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text>LP tokens earned</Text>
                                </td>
                                <td>
                                    <Text>{usdcInput * 2}</Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </Box>
            <Divider border='solid'  width="100%" color="white" marginTop="0.9rem" marginBottom="1.7rem"/>
            <Flex direction="column" alignItems="center"  >
                <Button backgroundColor='#6d4158'
                    color='white'
                    fontWeight="bold"
                    _hover={{bg: "#4b384e"}}
                    onClick={addLiquidity}
                    width='10rem'>
                    {isPending ? (<Spinner/>) : ('Add liquidity')}
                </Button>
            </Flex>
            </Flex>
        </Box>
    )
}

export default PoolAdd