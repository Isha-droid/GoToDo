import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Textarea, useColorMode, useToast } from '@chakra-ui/react';

const TodoForm = () => {
  const { colorMode } = useColorMode();
  const [task, setTask] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.trim() === '') {
      toast({
        title: 'Error',
        description: 'Task cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/todos', {
        completed: false,
        body: task,
      });
      toast({
        title: 'Success',
        description: 'Task added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTask('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      p={6}
      boxShadow="lg"
      borderRadius="lg"
      w="100%"
      maxW="600px"
      mx="auto"
      mt={8}
    >
      <form onSubmit={handleSubmit}>
        <Flex align="center">
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            size="md"
            resize="none"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'black' : 'white'}
            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
            _hover={{
              borderColor: colorMode === 'light' ? 'gray.400' : 'gray.500',
            }}
            _focus={{
              borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300',
              boxShadow: '0 0 0 1px blue.500',
            }}
            flex="1"
            mr={4}
          />
          <Button
            type="submit"
            colorScheme="teal"
            bg={colorMode === 'light' ? 'teal.500' : 'teal.400'}
            _hover={{
              bg: colorMode === 'light' ? 'teal.600' : 'teal.300',
            }}
            height="auto"
            py={2.5} // Adjust the padding to match the Textarea's height
          >
            Add Task
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default TodoForm;
