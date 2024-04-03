"use client"
import Header from './Header'
import { Flex } from '@chakra-ui/react'

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      minH="100vh"
      justifyContent="center"
    >
        <Header />
        <Flex
          grow="1"
          direction="column"
          alignItems="center"
        >
            {children}
        </Flex>
    </Flex>
  )
}

export default Layout