"use client"
import { Flex, Text, Image } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <Flex
        justifyContent="space-between"
        alignItems="center"
        p="2rem"
    >
        <Image src="/logo_unidefi.png" alt="logo unidefi" height="100px" borderRadius="50%"/>
        <Text marginLeft="1.2em" color="white" fontSize="3em">DeFi App</Text>
        <ConnectButton showBalance={false} />
    </Flex>
  )
}

export default Header