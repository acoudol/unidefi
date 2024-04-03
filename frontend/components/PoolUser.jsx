"use client"
import { Flex, Text, Box, Image, Button, Divider, Spinner, useToast} from '@chakra-ui/react'
import {useContext, useEffect, useState} from "react";
import {abi, contractAddress} from '@/constants'
import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import { UserContext } from '../contexts/UserContext.jsx';
import { PoolContext } from '@/contexts/PoolContext.jsx';

const PoolUser = () => {
    
    const decimals = 10**18;

    const {user, updateUser} = useContext(UserContext);
    const {totalPool, updateTotalPool} = useContext(PoolContext);

    const toast = useToast();

    const {data: hash, isPending, writeContract} = useWriteContract({
        mutation: {
            // Si ça a marché d'écrire dans le contrat
            onSuccess: () => {
                toast({
                    title: "Your request is being submitted",
                    status: "info",
                    duration: 6000,
                    isClosable: true,
                });
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

    const removeLiquidity = async () => {
        writeContract({
            abi: abi,
            address: contractAddress,
            functionName: 'removeAllLiquidity',
            account: user.address
        })
    }    

    useEffect(() => {
        if (status === 'success') {

            updateUser();
            updateTotalPool();

            toast({
                title: "Liquidity removed successfully",
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
      <Box p={8}  className="myLiquidity-box" >
      <Flex  direction="column" width="100%" >
        <Flex direction="row"  justifyContent="space-between">
            <Text color="white" fontSize="1.5em" fontWeight="bold">My position</Text>
            <Flex direction="row">
                <Image src="/logo_usdc.png" alt="logo usdc" height="2.5rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                <Image src="/logo_unidefi3bis.png" alt="logo unidefi" height="2.5rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                <Text color="white" fontSize="1.1em" fontWeight="bold" marginLeft="0.5rem" marginTop="0.4rem"> USDC/UDFI </Text>
            </Flex>
        </Flex>

        <Divider border='solid'  width="100%" color="white" marginTop="1rem" marginBottom="2rem"/>
        
        <Flex direction="row"  justifyContent="space-between" >
            <Text color="white" fontWeight="bold">Your pool tokens</Text>
            <Text color="white" fontWeight="bold">{user.lpTokens.toString()} LPs</Text>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">Your pool share</Text>
            <Text color="white" fontWeight="bold">{user.lpPercent.toString()} %</Text>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">USDC to claim</Text>
            <Flex direction="row">
                <Text color="white" fontWeight="bold">{Number(user.pooledUsdc)/ decimals}</Text>
                <Image src="/logo_usdc.png" alt="logo usdc" height="1.7rem" bg="#796275" borderRadius="50%" padding="0.3em" marginLeft="0.5rem"/>
            </Flex>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">UDFI to claim</Text>
            <Flex direction="row">
                <Text color="white" fontWeight="bold">{Number(user.pooledUdfi)/ decimals}</Text>
                <Image src="/logo_unidefi3bis.png" alt="logo usdc" height="1.7rem" bg="#796275" borderRadius="50%" padding="0.3em" marginLeft="0.5rem"/>
            </Flex>
        </Flex>

        <Divider border='solid'  width="100%" color="white" marginTop="2.5rem" marginBottom="2rem"/>

        <Flex direction="column" alignItems="center" >
            <Button backgroundColor='#6d4158'
                color='white'
                fontWeight="bold"
                _hover={{bg: "#4b384e"}}
                onClick={removeLiquidity}
                width='10rem'>
                {isPending ? (<Spinner/>) : ('Remove liquidity')}
            </Button>
        </Flex>
      </Flex>
    </Box>
    )
  }

export default PoolUser