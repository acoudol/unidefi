"use client"
import { Flex, Text, Box, TableContainer,Table, Tbody, Th, Tr, Td, Divider} from '@chakra-ui/react';
import {useContext, useEffect, useState} from "react";
import { PoolContext } from '../contexts/PoolContext.jsx';
import numeral from "numeral"; 

const PoolGlobal = () => {
    
    const decimals = 10**18;

    const {totalPool} = useContext(PoolContext);

    return (
      <Box p={8}  className="globalLiquidity-box" >
      <Flex  direction="column" width="100%">
        <Flex direction="row" justifyContent="space-between">
            <Text color="white" fontSize="1.5em" fontWeight="bold">Pool summary</Text>
            <Text color="white" fontWeight="bold" marginTop="0.7rem">Total LPs: {totalPool.lpTotalSupply.toString()}</Text>
        </Flex>
        <Divider border='solid'  width="100%" color="white" marginTop="0.5rem" marginBottom="1rem"/>
            <table  >
                    <tbody>
                        <tr>
                            <th>
                                <Text>Pool name</Text>
                            </th>
                            <th>
                                <Text textAlign="right">TVL ($)</Text>
                            </th>
                            <th>
                                <Text textAlign="right">Token A</Text>
                            </th>
                            <th>
                                <Text textAlign="right">Token B</Text>
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <Text>USDC/UDFI</Text>
                            </td>
                            <td>
                                <Text textAlign="right" >{numeral(Number(totalPool.TVL)/decimals).format("0.0a")} </Text>
                            </td>
                            <td>
                                <Text textAlign="right">{numeral(Number(totalPool.totalUsdc)/decimals).format("0.0a")} </Text>
                            </td>
                            <td>
                                <Text textAlign="right">{numeral(Number(totalPool.totalUdfi)/decimals).format("0.0a")} </Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
      </Flex>
    </Box>
    )
  }

export default PoolGlobal