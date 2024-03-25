import { useState } from "react";
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, HStack, NumberInput, Divider, Select, Image } from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";

const Swap = ({ tokenA, tokenB }) => {

  return (
    <Box p={8}  className="swap-box" >
      <Flex  direction="column" width="100%" >
        <Flex direction="row" alignContent="left">
            <Text color="white" fontSize="1.5em" fontWeight="bold"> SWAP </Text>
        </Flex>
        <br />
        <Box padding="0.7em" borderRadius="1em" bgColor="#fed3ff">
            <Flex direction="row" justifyContent="space-between" width="100%">
                <Flex direction="row" justifyContent="start" width="100%">
                    <Image src="/ethereum-2.png" alt="logo unidefi" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                    <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>ETH</Text>
                </Flex>
                <Input border="none" position="relative" textAlign="right" top="0.1em" placeholder="0.0" width="100%" fontSize="2em"/>
            </Flex>
        </Box>
        <Flex direction="row" justifyContent="space-between" width="100%">
                <Text marginLeft="1rem">Balance: </Text>
                <Text marginRight="1rem">- $</Text>
        </Flex>
        <Flex direction="row" width="100%" marginTop="1rem" marginBottom="0.5rem">
            <Divider border='solid'  width="100%" color="white" marginRight="0.5rem"/>
            <ArrowDownIcon padding="0.3rem" position="relative" bottom="1rem" color="white" opacity="60%" boxSize="40px" backgroundColor= "rgba(255, 255, 255, 0.2)" borderRadius="50%" />
            <Divider border='solid' width="100%" color="white" marginLeft="0.5rem" />
        </Flex>
        <Box padding="0.7em" borderRadius="1em" bgColor="#FFD3E1">
            <Flex direction="row" justifyContent="space-between" width="100%">
                <Flex direction="row" justifyContent="left" width="100%">
                    <Image src="/ethereum-2.png" alt="logo unidefi" height="3rem" bg="#796275" borderRadius="50%" padding="0.3em"/>
                    <Text marginLeft="0.2em" color="white" fontSize="2em" textShadow= {"#796275 1px 1px, #796275 -1px 1px, #796275 -1px -1px, #796275 1px -1px"}>UDFI</Text>
                </Flex>
                <Input border="none" position="relative" textAlign="right" top="0.1em" placeholder="0.0" width="100%" fontSize="2em"/>
            </Flex>
        </Box>
        <Flex direction="row" justifyContent="space-between" width="100%">
                <Text marginLeft="1rem">Balance: </Text>
                <Text marginRight="1rem">- $</Text>
        </Flex>

        <Flex direction="column" alignItems="center" marginTop="1em">
            <Button backgroundColor='#6d4158'
                color='white'
                _hover={{bg: "#4b384e"}}
                width='10rem'>
                Confirm SWAP
            </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Swap;