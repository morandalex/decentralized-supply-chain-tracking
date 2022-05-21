import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
Image,
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  useDisclosure,
  VStack,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import ConnectButton from "../Buttons/ConnectButton";
import ThemeToggle from "../Buttons/ThemeToggle";
import NetworkSwitch from '../custom/NetworkSwitch';
import ScaffoldIcon from "../Icons/ScaffoldIcon";

const LinkItem = ({ href, children, ...props }: any) => {
  const { pathname } = useRouter();


  let isActive = false;
  if (href === pathname) {
    isActive = true;
  }

  return (
    <NextLink href={href}>
      <Link 
     // color={isActive ? accentColor : ""}
       {...props}>
        {children}
      </Link>
    </NextLink>
  );
};

const LinkItems = () => {
  return (
    <>
   

    <LinkItem href="/admin">Admin</LinkItem>
    <LinkItem href="/supplier">Supplier</LinkItem>
    <LinkItem href="/stats">Stats</LinkItem>
    </>
  );
};

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <Box as="nav" w="100%" top="0" zIndex={1}>
      <Container
        display="flex"
        p={2}
        maxW="7xl"
     //   wrap="wrap"
        alignItems="center"
      >
        <HStack>
        <Image height='40px' src='https://user-images.githubusercontent.com/9484568/169488729-0d627062-8e9f-4697-8204-8dea2ef03c29.png'></Image>
          <NextLink href="/">
            <Link
              display={{ base: "none", md: "flex" }}
              fontWeight="bold"
           
             // textTransform="uppercase"
              size="md"
            >
              DSCT
            </Link>
          </NextLink>
          <HStack px="2" spacing="4" display={{ base: "none", lg: "flex" }}>
            <LinkItems />
          </HStack>
        </HStack>

        <HStack marginLeft="auto">
          <NetworkSwitch />
          <ConnectButton />
        {
        //  <ThemeToggle />
        }
          <IconButton
            size="md"
            px="2"
            mr="2"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ lg: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </HStack>
      </Container>

      {isOpen ? (
        <Drawer  placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg='gray.100'>
            <DrawerCloseButton />
            <DrawerHeader color='gray.100' borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack onClick={onClose} align="start" fontSize="lg" spacing="4" >
                <LinkItems />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </Box>
  );
};

export default Navbar;
