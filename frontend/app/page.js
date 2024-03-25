'use client';
import { useAccount } from "wagmi";
import { Flex } from "@chakra-ui/react";
import Swap from '../components/Swap'

export default function Home() {

  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
          <Flex direction="column" width="40%">
            <Swap />
          </Flex>
      ) : (
        <p> Non connecté </p>
      )}
    </>
  );
}