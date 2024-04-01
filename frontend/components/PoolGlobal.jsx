"use client"
import { Flex, Text, Box, TableContainer,Table, Tbody, Th, Tr, Td, Divider} from '@chakra-ui/react'

const PoolGlobal = () => {
    return (
      <Box p={8}  className="globalLiquidity-box" >
      <Flex  direction="column" width="100%">
        <Text color="white" fontSize="1.5em" fontWeight="bold">Pool summary</Text>
        <Divider border='solid'  width="100%" color="white" marginTop="0.5rem" marginBottom="1rem"/>
            <table  >
                    <tbody>
                        <tr>
                            <th>
                                <Text>Pool name</Text>
                            </th>
                            <th>
                                <Text>TVL</Text>
                            </th>
                            <th>
                                <Text>Token 1</Text>
                            </th>
                            <th>
                                <Text>Token 2</Text>
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <Text>USDC/UDFI</Text>
                            </td>
                            <td>
                                <Text>0</Text>
                            </td>
                            <td>
                                <Text>0 USDC</Text>
                            </td>
                            <td>
                                <Text>0 UDFI</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
      </Flex>
    </Box>
    )
  }

export default PoolGlobal