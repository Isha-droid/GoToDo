import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  List,
  ListItem,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { FaCheckCircle, FaEdit, FaTrashAlt, FaTimesCircle } from 'react-icons/fa';

interface Todo {
  id: string;
  completed: boolean;
  body: string;
}

const TodoList: React.FC = () => {
  const { colorMode } = useColorMode();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>('http://localhost:4000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch todos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:4000/api/todos/${id}`);
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTodos();
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to delete task',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const updateTodo = async (id: string, body: string) => {
    try {
      await axios.patch(`http://localhost:4000/api/todos/${id}`, { body });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleCompletion = async (id: string, completed: boolean) => {
    try {
      await axios.patch(`http://localhost:4000/api/todos/${id}`, { completed });
      toast({
        title: 'Success',
        description: `Task marked as ${completed ? 'completed' : 'pending'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTodos();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingBody(todo.body);
  };

  const handleUpdate = (id: string) => {
    if (editingBody.trim() === '') {
      toast({
        title: 'Error',
        description: 'Task body cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    updateTodo(id, editingBody);
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
      <List spacing={3}>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            bgGradient={colorMode === 'light' ? 'linear(to-r, teal.200, blue.200)' : 'linear(to-r, teal.700, blue.700)'}
            p={4}
            borderRadius="md"
            boxShadow="md"
            _hover={{ boxShadow: 'xl' }}
          >
            <Flex align="center" justify="space-between">
              {editingId === todo.id ? (
                <Input
                  value={editingBody}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingBody(e.target.value)}
                  size="sm"
                  mr={4}
                  flex="1"
                  bg="white"
                  borderRadius="md"
                />
              ) : (
                <Text flex="1" mr={4} fontWeight="bold" fontSize="lg" textDecoration={todo.completed ? 'line-through' : 'none'}>
                  {todo.body}
                </Text>
              )}
              <Flex align="center">
                {editingId === todo.id ? (
                  <IconButton
                    icon={<FaCheckCircle />}
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleUpdate(todo.id)}
                    mr={2}
                    aria-label="Confirm edit"
                  />
                ) : (
                  <IconButton
                    icon={<FaEdit />}
                    size="sm"
                    onClick={() => handleEdit(todo)}
                    mr={2}
                    aria-label="Edit task"
                  />
                )}
                <IconButton
                  icon={<FaTrashAlt />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                />
              </Flex>
            </Flex>
            <Flex mt={2} justify="space-between" align="center">
              <Text
                fontSize="sm"
                color={todo.completed ? 'green.500' : 'red.500'}
                fontWeight="semibold"
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </Text>
              <IconButton
                icon={todo.completed ? <FaTimesCircle /> : <FaCheckCircle />}
                size="sm"
                onClick={() => toggleCompletion(todo.id, !todo.completed)}
                colorScheme={todo.completed ? 'red' : 'green'}
                aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
              />
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TodoList;
