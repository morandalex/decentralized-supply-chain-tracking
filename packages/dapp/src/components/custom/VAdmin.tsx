import {
  Button, Box, HStack, Input, Text, VStack,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  Th,
  TableContainer
} from "@chakra-ui/react";
//import ABIS from "../hardhat_contracts.json";
//@ts-ignore
//import { SupplyChainTracking } from "../generated/contract-types/SupplyChainTracking";
import { SupplyChainTracking } from "@scaffold-eth/hardhat-ts/generated/contract-types/SupplyChainTracking";
import ABIS from "@scaffold-eth/hardhat-ts/hardhat_contracts.json";
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { Web3Context } from "../../contexts/Web3Provider";
import NETWORKS from "../../core/networks";
import { useWeb3React } from '@web3-react/core';
type Block = {
  inputs?: Array<Object>;
  outputs?: Array<Object>;
  name?: string;
  stateMutability?: string;
  type: string;
};
function ContractFields({ ...others }: any) {
  const { contracts } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  const [abi, setAbi] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedQueue, setSelectedQueue] = useState('');
  const [yourReadContract, setYourReadContract] = useState<SupplyChainTracking>();
  const [yourWriteContract, setYourWriteContract] = useState<SupplyChainTracking>();
  /*
    givePullAccessToAddressIntoQueue
    givePushAccessToAddressIntoQueue
    addSupplierInWhiteList
  */
  async function addSupplierInWhiteListFun(_address: string) {
    console.log('Address: ', _address);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.addSupplierInWhiteList(_address);
        await transaction.wait();
        console.log(transaction)
      } catch (e) { alert(e.message) }
    }
  }
  async function addSupplierInMintAccessListFun(_address: string) {
    console.log('Address: ', _address);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.addSupplierInMintAccessList(_address);
        await transaction.wait();
        console.log(transaction)
      } catch (e) { alert(e.message) }
    }
  }
  async function givePushAccessToAddressIntoQueueFun(_address: string, _queue: string) {
    console.log('Address: ', _address);
    console.log('Address: ', _queue);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.givePushAccessToAddressIntoQueue(_address, _queue);
        await transaction.wait();
        console.log(transaction)
      } catch (e) { alert(e.message) }
    }
  }
  async function givePullAccessToAddressIntoQueueFun(_address: string, _queue: string) {
    console.log('Address: ', _address);
    console.log('Address: ', _queue);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.givePullAccessToAddressIntoQueue(_address, _queue);
        await transaction.wait();
        console.log(transaction)
      } catch (e) { alert(e.message) }
    }
  }
  async function setStartFun(_queue: string) {
    console.log('Address: ', _queue);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.setStart(_queue);
        await transaction.wait();
        console.log(transaction)
      } catch (e: any) { alert(e.message) }
    }
  }
  async function setEndFun(_queue: string) {
    console.log('Address: ', _queue);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.setEnd(_queue);
        await transaction.wait();
        console.log(transaction)
      } catch (e: any) { alert(e.message) }
    }
  }
  useEffect(() => {
    if (chainId && contracts) {
      const strChainId = chainId.toString() as keyof typeof NETWORKS;
      const network = NETWORKS[strChainId];
      const abis = ABIS as Record<string, any>;
      if (abis[strChainId]) {
        console.log(abis)
        const abi = abis[strChainId][network.name].contracts.SupplyChainTracking.abi;
        setAbi(abi);
        setYourReadContract(contracts.yourReadContract);
        setYourWriteContract(contracts.yourWriteContract);
      }
    }
  }, [chainId, contracts]);
  const handleSelectedAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(e.target.value)
  }
  const handleSelectedQueue = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedQueue(e.target.value)
  }
  return (
    <VStack
      bg="spacelightalpha"
      p="8"
      h="lg"
      borderRadius="base"
      spacing="4"
      align="center"
      {...others}
    >
      <Box
        textAlign='center'
      >
        <Text>
          hardhat test accounts
        </Text>
        <Text>admin : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        </Text>
        <Text>
          supplier 1 :  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
        </Text>
        <Text>
          supplier 2 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        </Text>
        <Text> supplier 3 : 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65</Text>
      </Box>
      <Box
      >
        <VStack>
          <HStack>
            <Text>Set a supplier address : </Text>
            <Input onChange={handleSelectedAddress}></Input>
          </HStack>
          <HStack>
            <Text>Set a queue id : </Text>
            <Input onChange={handleSelectedQueue}></Input>
          </HStack>
        </VStack>
        <VStack>
          <Text><b>Data filled</b></Text>
          <Text>{selectedAddress}</Text>
          <Text>{selectedQueue}</Text>
        </VStack>
      </Box>
      <Box>
        <Button onClick={() => addSupplierInWhiteListFun(selectedAddress)}>addSupplierInWhiteList()</Button>
      </Box>
      <Box>
        <Button onClick={() => givePushAccessToAddressIntoQueueFun(selectedAddress, selectedQueue)}>givePushAccessToAddressIntoQueue()</Button>
      </Box>
      <Box>
        <Button onClick={() => givePullAccessToAddressIntoQueueFun(selectedAddress, selectedQueue)}>givePullAccessToAddressIntoQueue()</Button>
      </Box>
      <Box>
        <Button onClick={() => addSupplierInMintAccessListFun(selectedAddress)}>addSupplierInMintAccessList()</Button>
      </Box>
      <Box>
        <Button onClick={() => setStartFun(selectedQueue)}>setStart()</Button>
      </Box>
      <Box>
        <Button onClick={() => setEndFun(selectedQueue)}>setEnd()</Button>
      </Box>
    </VStack>
  );
}
export default ContractFields;
