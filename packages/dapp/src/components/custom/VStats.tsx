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
    const [selectedMetadata, setSelectedMetadata] = useState({});
    const [selectedProductId, setSelectedProductId] = useState('');
    const [yourReadContract, setYourReadContract] = useState<SupplyChainTracking>();
    const [yourWriteContract, setYourWriteContract] = useState<SupplyChainTracking>();
    const [qList, setQList] = useState([])
    const [qList1, setQList1] = useState([])
    const [qList2, setQList2] = useState([])
    const [qList3, setQList3] = useState([])
    const [batch, setBatch] = useState('');
    async function getProductsInQueueFun(_queue: string) {
        console.log('Product Id: ', _queue);
        if (yourWriteContract) {
            try {
                const tx = await yourWriteContract.getProductsInQueue(_queue);
                let list: any = []
                tx.map((qEl) => {
                    console.log(String(qEl))
                    list.push(qEl)
                })
                setQList(list);
                if (_queue == '1') {
                    setQList1(list);
                } else if (_queue == '2') {
                    setQList2(list);
                } else if (_queue == '3') {
                    setQList3(list);
                }
            } catch (e: any) { alert(e.message) }
        }
    }
    async function getProductsProcessedBatchFun(_productId: any) {
        console.log('Product Id: ', _productId);
        if (yourWriteContract) {
            const tx = await yourWriteContract.getProductsProcessedBatch(_productId);
            console.log(tx)
            setBatch(tx);
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
                description: "Decentralized Supply Chian Tracking",
                //external_url: "https://openseacreatures.io/3", 
                image: "https://user-images.githubusercontent.com/9484568/169488729-0d627062-8e9f-4697-8204-8dea2ef03c29.png",
                name: "Decentralized Supply Chian Tracking",
                tracking: result
            }
            console.log(metadata)
            setSelectedMetadata(metadata)
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
    const handleSelectedProductId = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedProductId(e.target.value)
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
            </Box>
            <Box
            >
                <VStack>
                    <HStack>
                        <Text>Set a queue id  : </Text>
                        <Input onChange={handleSelectedQueue}></Input>
                    </HStack>
                    <HStack>
                        <Text>Set a product id  : </Text>
                        <Input onChange={handleSelectedProductId}></Input>
                    </HStack>
                </VStack>
            </Box>
            <Box>
                <Button onClick={() => getProductsProcessedBatchFun(selectedProductId)}> getProductsProcessedBatch({selectedProductId})</Button>
                <Text>{batch}</Text>
            </Box>
            <Box>
                <Button onClick={() => getProductsProductInfoFun(selectedProductId)}>getProductsProductInfo({selectedProductId})</Button>
            </Box>
            <Text>{JSON.stringify(selectedMetadata)}</Text>
            <HStack>
                <VStack>
                    <Button onClick={() => getProductsInQueueFun('1')}> getProductsInQueue(1)</Button>
                    {qList1.map((item, i) => {
                        return (<Text key={i}>{String(item)}</Text>)
                    })}
                </VStack>
                <VStack>
                    <Button onClick={() => getProductsInQueueFun('2')}> getProductsInQueue(2)</Button>
                    {qList2.map((item, i) => {
                        return (<Text key={i}>{String(item)}</Text>)
                    })}
                </VStack>
                <VStack>
                    <Button onClick={() => getProductsInQueueFun('3')}> getProductsInQueue(3)</Button>
                    {qList3.map((item, i) => {
                        return (<Text key={i}>{String(item)}</Text>)
                    })}
                </VStack>
            </HStack>
        </VStack>
    );
}
export default ContractFields;
