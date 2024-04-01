"use client"
import { Flex, Text, Box, Image, Button, Divider} from '@chakra-ui/react'

const PoolUser = () => {
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
            <Text color="white" fontWeight="bold">Your total pool tokens</Text>
            <Text color="white" fontWeight="bold">0</Text>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">Pooled USDC</Text>
            <Flex direction="row">
                <Text color="white" fontWeight="bold">0</Text>
                <Image src="/logo_usdc.png" alt="logo usdc" height="1.7rem" bg="#796275" borderRadius="50%" padding="0.3em" marginLeft="0.5rem"/>
            </Flex>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">Pooled UDFI</Text>
            <Flex direction="row">
                <Text color="white" fontWeight="bold">0</Text>
                <Image src="/logo_unidefi3bis.png" alt="logo usdc" height="1.7rem" bg="#796275" borderRadius="50%" padding="0.3em" marginLeft="0.5rem"/>
            </Flex>
        </Flex>
        <Flex direction="row"  justifyContent="space-between" marginTop="0.5rem">
            <Text color="white" fontWeight="bold">Your pool share</Text>
            <Text color="white" fontWeight="bold">0 %</Text>
        </Flex>

        <Divider border='solid'  width="100%" color="white" marginTop="2.5rem" marginBottom="2rem"/>

        <Flex direction="column" alignItems="center" >
            <Button backgroundColor='#6d4158'
                color='white'
                fontWeight="bold"
                _hover={{bg: "#4b384e"}}
                width='10rem'>
                Remove liquidity
            </Button>
        </Flex>
      </Flex>
    </Box>
    )
  }

export default PoolUser