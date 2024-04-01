"use client"
import { Flex, Grid, GridItem } from '@chakra-ui/react'
import PoolAdd from './PoolAdd'
import PoolGlobal from './PoolGlobal'
import PoolUser from './PoolUser'

const PoolMain = () => {
  return (
    <Flex>
        <Grid h='200px'
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(2, 1fr)'
  gap={4}>
            <GridItem rowSpan={2} colSpan={1}>
                <PoolAdd />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
                <PoolUser />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
                <PoolGlobal />
            </GridItem>
        </Grid>
    </Flex>
  )
}

export default PoolMain