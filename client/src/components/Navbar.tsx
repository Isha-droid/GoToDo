import React from 'react';
import { Box, Flex, Button, useColorMode, IconButton, Spacer } from '@chakra-ui/react';
import { FaSun, FaMoon, FaHome, FaTasks, FaCheckCircle, FaCog } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      px={4}
      boxShadow="sm"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Button
            variant="ghost"
            leftIcon={<FaHome />}
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            leftIcon={<FaTasks />}
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
          >
            Tasks
          </Button>
          <Button
            variant="ghost"
            leftIcon={<FaCheckCircle />}
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
          >
            Completed
          </Button>
          <Button
            variant="ghost"
            leftIcon={<FaCog />}
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
          >
            Settings
          </Button>
        </Box>

        <Flex alignItems={'center'}>
          <Spacer />
          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="current"
            marginLeft="2"
            icon={<BsThreeDots />}
            aria-label="More options"
          />

          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="current"
            marginLeft="2"
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            aria-label="Toggle theme"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
