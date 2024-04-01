'use client';
import { useAccount } from "wagmi";
import { useState } from "react";
import { Flex, Text, Switch } from "@chakra-ui/react";
import Swap from '@/components/Swap'
import PoolMain from "@/components/PoolMain";

export default function Home() {

  const { isConnected } = useAccount();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {isConnected ? (
          <Flex direction="column">
            <Flex direction="row" marginBottom="2rem" justifyContent="center">
              <Text marginRight="1rem" color="white">SWAP</Text>
              <Switch id="defiSwitch" size="lg" colorScheme="blue" defaultChecked="false" isChecked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
              <Text marginLeft="1rem" color="white">POOL</Text>
            </Flex>
            {isChecked == false ? (<Swap />) : (<PoolMain />)}
          </Flex>
      ) : (
        <p> Non connecté </p>
      )}
    </>
  );
}