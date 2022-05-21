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
import ABIS from "../hardhat_contracts.json";
//@ts-ignore
import { SupplyChainTracking } from "../generated/contract-types/SupplyChainTracking";
//import { SupplyChainTracking } from "@scaffold-eth/hardhat-ts/generated/contract-types/SupplyChainTracking";
//import ABIS from "@scaffold-eth/hardhat-ts/hardhat_contracts.json";
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { Web3Context } from "../../contexts/Web3Provider";
import NETWORKS from "../../core/networks";
import { useWeb3React } from '@web3-react/core';
import { NFTStorage, File, Blob } from 'nft.storage'
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE_TOKEN
//@ts-ignore
const clientipfsnftstorage = new NFTStorage({ token: NFT_STORAGE_TOKEN })
console.log(clientipfsnftstorage)
function ContractFields({ ...others }: any) {
  const { contracts } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  const [abi, setAbi] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedMetadata, setSelectedMetadata] = useState({});
  const [selectedTokenURI, setSelectedTokenURI] = useState('');
  const [selectedQueueA, setSelectedQueueA] = useState('');
  const [selectedQueueB, setSelectedQueueB] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [yourReadContract, setYourReadContract] = useState<SupplyChainTracking>();
  const [yourWriteContract, setYourWriteContract] = useState<SupplyChainTracking>();
  async function pushBatchInQueueFun(_queueId: string) {
    console.log('QueueId: ', _queueId);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.pushBatchInQueue(_queueId);
        await transaction.wait();
        console.log(transaction)
      } catch (e: any) { alert(e.message) }
    }
  }
  async function transferBatchFromToFun(_queueIdA: string, _queueIdB: string, _id: string) {
    console.log('QueueIdA: ', _queueIdA);
    console.log('QueueIdB: ', _queueIdB);
    console.log('Product Id: ', _id);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.transferBatchFromTo(_queueIdA, _queueIdB, _id);
        await transaction.wait();
        console.log(transaction)
      } catch (e: any) { alert(e.message) }
    }
  }
  async function getProductsProcessedBatchFun(_productId: any) {
    console.log('Product Id: ', _productId);
    if (yourWriteContract) {
      const tx = await yourWriteContract.getProductsProcessedBatch(_productId);
      console.log(tx)
      return tx
    }
  }
  async function getProductsProcessedStepArrayLenghtFun(_productId: any) {
    console.log('Product Id: ', _productId);
    if (yourWriteContract) {
      const tx = await yourWriteContract.getProductsProcessedStepArrayLenght(_productId);
      console.log(tx)
      return tx
    }
  }
  async function getProductsProcessedStepFun(_productId: any, _queue: any) {
    console.log('Product Id: ', _productId);
    console.log('Product Id: ', _queue);
    if (yourWriteContract) {
      const tx = await yourWriteContract.getProductsProcessedStep(_productId, _queue);
      return tx
    }
  }
  async function getProductsProcessedWhatQueuesFun(_productId: any) {
    console.log('Product Id: ', _productId);
    if (yourWriteContract) {
      const tx = await yourWriteContract.getProductsProcessedWhatQueues(_productId);
      return tx
    }
  }
  async function getProductsProductInfoFun(_productId: any) {
    console.log('Product Id: ', _productId);
    if (yourWriteContract) {
      const tx1 = await getProductsProcessedBatchFun(_productId);
      const tx2 = await getProductsProcessedStepArrayLenghtFun(_productId);
      const tx3 = await getProductsProcessedWhatQueuesFun(_productId);
      console.log(tx1)
      console.log(String(tx2))
      let steps = [];
      if (tx3) {
        for (let i = 0; i < parseInt(String(tx2)); i++) {
          const tx4 = await getProductsProcessedStepFun(_productId, tx3[i]);
          let step;
          if (tx4) {
            step = {
              reprocessedCounter: String(tx4.reprocessedCounter),
              supplier: tx4.supplier,
              timetracked: String(tx4.timetracked),
              transferred: tx4.transferred
            }
          }
          steps.push(step)
        }
      }
      let result = {
        batch: tx1,
        numberOfSteps: String(tx2),
        queues: tx3,
        steps: steps
      }
      let metadata = {
        description: "Decentralized Supply Chain Tracking",
        //external_url: "https://openseacreatures.io/3", 
        image: "https://user-images.githubusercontent.com/9484568/169488729-0d627062-8e9f-4697-8204-8dea2ef03c29.png",
        name: "Decentralized Supply Chain Tracking",
        tracking: result
      }
      console.log(metadata)
      setSelectedMetadata(metadata)
    }
  }
  async function getTokenUri() {
    const blobToIpfs = new Blob([JSON.stringify(selectedMetadata)])
    const metadata = await clientipfsnftstorage.storeBlob(blobToIpfs)
    console.log(metadata)
    setSelectedTokenURI(metadata)
  }
  async function mintFun(_tokenURI: string, _productId: string) {
    console.log('tokenuri: ', _tokenURI);
    if (yourWriteContract) {
      try {
        const transaction = await yourWriteContract.mint(_tokenURI, _productId);
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
  const handleSelectedQueueA = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedQueueA(e.target.value)
  }
  const handleSelectedQueueB = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedQueueB(e.target.value)
  }
  const handleSelectedProductId = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedProductId(e.target.value)
  }
  const handleSelectedTokenURI = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedTokenURI(e.target.value)
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
            <Text>Set a product ID : </Text>
            <Input onChange={handleSelectedProductId}></Input>
          </HStack>
          <HStack>
            <Text>Set a queue id A : </Text>
            <Input onChange={handleSelectedQueueA}></Input>
          </HStack>
          <HStack>
            <Text>Set a queue id B : </Text>
            <Input onChange={handleSelectedQueueB}></Input>
          </HStack>
          <HStack>
            <Text>Set a tokenURI: </Text>
            <Input onChange={handleSelectedTokenURI}></Input>
          </HStack>
        </VStack>
        <VStack>
          <Text><b>Data filled</b></Text>
          <Text>{selectedProductId}</Text>
          <Text>{selectedQueueA}</Text>
          <Text>{selectedQueueB}</Text>
          <Text>{selectedTokenURI}</Text>
        </VStack>
      </Box>
      <Box>
        <Button onClick={() => pushBatchInQueueFun(selectedQueueA)}>pushBatchInQueue()</Button>
      </Box>
      <Box>
        <Button onClick={() => transferBatchFromToFun(selectedQueueA, selectedQueueB, selectedProductId)}>transferBatchFromTo()</Button>
      </Box>
      <Box>
        <Button onClick={() => getProductsProductInfoFun(selectedProductId)}>getProductsProductInfo({selectedProductId})</Button>
      </Box>
      <Box>
        <Button onClick={() => getTokenUri()}>create link IPFS</Button>
      </Box>
      <Box>
        <Button onClick={() => mintFun(selectedTokenURI, selectedProductId)}>mint({selectedTokenURI},{selectedProductId})</Button>
      </Box>
    </VStack>
  );
}
export default ContractFields;
