"use client"
import { Box, Flex, FormControl, Input, Button, Text, Divider, Image, TableContainer, Table, Tbody, Tr, Td} from '@chakra-ui/react'
import { AddIcon } from "@chakra-ui/icons";

const PoolAdd = () => {
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
              <Input border="none" type="number" position="relative" textAlign="right" top="0.1em" placeholder="0" width="100%" fontSize="2em"/>
          </Flex>
          <Flex direction="row"  width="100%">
              <Text marginLeft="1rem">Balance: </Text>
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
              <Input border="none" type="number" position="relative" textAlign="right" top="0.1em" placeholder="0" width="100%" fontSize="2em"/>
          </Flex>
          <Flex direction="row" width="100%">
              <Text marginLeft="1rem">Balance: </Text>
        </Flex>
      </Box>
      <Divider border='solid'  width="100%" color="white" marginTop="2rem" marginBottom="0.2rem"/>
      <Box padding="0.7em" borderRadius="1em" >
            <table  >
                <tbody>
                    <tr>
                        <td>
                            <Text>Total</Text>
                        </td>
                        <td>
                            <Text>0$</Text>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text>LP tokens</Text>
                        </td>
                        <td>
                            <Text>0</Text>
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
              width='10rem'>
              Add liquidity
          </Button>
      </Flex>
    </Flex>
  </Box>
  )
}

export default PoolAdd