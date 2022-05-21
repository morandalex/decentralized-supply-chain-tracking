import { RepeatIcon } from "@chakra-ui/icons";
import { Heading, Image, Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";

import { useWeb3React } from '@web3-react/core';
import ContractFields from "components/custom/ContractFields";
import React, { useContext, useEffect, useState } from "react";
import Faucet from "../components/custom/Faucet";
import { Web3Context } from "../contexts/Web3Provider";
import { hexToString } from "../core/helpers";


const Home = () => {
  const { account } = useContext(Web3Context);
  const { library } = useWeb3React();

  const [yourBalance, setYourBalance] = useState("");

  const getEthBalance = async () => {
    if (library && account) {
      const res = await library?.getBalance(account);
      const balance = hexToString(res);
      setYourBalance(balance);
      // console.log(`balance`, balance);
    }
  };

  useEffect(() => {
    getEthBalance();
  }, [account, library]);

  return (
    <VStack>
      <Heading as="h1">
        Decentralized Supply Chain Tracking
      </Heading>

      {
        /*<Box
           color='black'
           textAlign='center'
         >
           <Image height='300px' src='https://user-images.githubusercontent.com/9484568/169488729-0d627062-8e9f-4697-8204-8dea2ef03c29.png'></Image>
         </Box>
        */
      }
      <Box>

        <ContractFields />


      </Box>

    </VStack>
  );
};

export default Home;
