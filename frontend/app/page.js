'use client';
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <p> Connecté </p>
      ) : (
        <p> Non connecté </p>
      )}
    </>
  );
}