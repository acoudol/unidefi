"use client"
import { Flex, Text, Image, Button } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <Flex
        justifyContent="space-between"
        alignItems="center"
        p="2rem"
    >
        <Flex>
          <Image src="/logo_unidefi3.png" alt="logo unidefi" height="5rem" />
          <Text color="white" fontSize="2em" marginTop="1rem" marginLeft="1rem">UniDeFi</Text>
        </Flex>
        <Flex>
          <Button borderRadius="0.7rem" marginRight="1rem">University</Button>
          <Button borderRadius="0.7rem" marginRight="1rem" backgroundColor="rgb(254,211,255)">DeFi App</Button>
          <ConnectButton showBalance={false} />
        </Flex>
    </Flex>
  )
}

export default Header