import { Button, Box, HStack, Input, Text, VStack,
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
  const [purpose, setPurpose] = useState("");
  const [purposeInput, setPurposeInput] = useState("");
  const [yourReadContract, setYourReadContract] = useState<SupplyChainTracking>();
  const [yourWriteContract, setYourWriteContract] = useState<SupplyChainTracking>();

      async function send()  {
      if (yourWriteContract) {
        console.log(yourWriteContract);
         const transaction = await yourWriteContract.batchInQueue(1,1);
        // await transaction.wait();d
         //await readPurpose();
         console.log(transaction)
      }
    }

  useEffect(() => {
    if (chainId && contracts) {
      setPurpose("");
      setPurposeInput("");
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
  const handlePurposeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPurposeInput(e.target.value);
  }
  return (
    <VStack
      bg="spacelightalpha"
      p="8"
      h="lg"
      borderRadius="base"
      spacing="4"
      align="start"
      {...others}
    >
      <Box
        alignItems='center'
        justifyContent='center'
        display='flex'
        flexDirection='column'
        textAlign='center'
      >
        <TableContainer>
        <Table >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Input1</Th>
              <Th>Input2</Th>
              <Th>Input3</Th>
             
            </Tr>
          </Thead>
          <Tbody>
            {abi &&
              abi.map((el: Block) => {
                if (el.type === "function" && el.inputs?.length !== 0) {
                  return (
                    <Tr key={el.name} >
                      <td  >{el.name}</td>
                      {el.inputs?.map((input, i) => {
                        //@ts-ignore
                        if(input && input.name != '' && input.name){
                        return (
                          <td key = {i} >
                             {  
                             //@ts-ignore
                             input && input.name != '' && input.name
                             } 
                           
                            
                            </td>
                        )}
                      })}
                    </Tr>
                  );
                }
                /*if (el.type === "function" && el.outputs?.length !== 0) {
                  return (
                    <Text key={el.name}>{el.name}</Text>
                  );
                }*/
              })}
          </Tbody>
        </Table>
        </TableContainer>
        <Button m='3' onClick={() => console.log(abi)}>Check ABI in the console</Button>
     
      </Box>
    </VStack>
  );
}
export default ContractFields;
