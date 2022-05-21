import { RepeatIcon } from "@chakra-ui/icons";
import {
  Heading,
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useWeb3React } from "@web3-react/core";
import VUser from "./VUser";
import React, { useContext, useEffect, useState } from "react";
import Faucet from "../Faucet";
import { Web3Context } from "../../../contexts/Web3Provider";
import { hexToString } from "../../../core/helpers";

const UserPage = () => {
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
      <Heading as="h1">User Page</Heading>

      <Box color="black" textAlign="center">
        <VUser />
      </Box>
    </VStack>
  );
};

export default UserPage;
