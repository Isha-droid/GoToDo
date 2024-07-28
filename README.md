# My First Go Project

Welcome to my first Go project! This project was created with guidance from Free Code Camp and showcases the basics of the Go programming language. Below you will find a comprehensive overview of the project, including its features, how to get started, and how to contribute.

## Features

- **Efficient and Scalable**: Built with Go, known for its efficiency and scalability in handling concurrent tasks.
- **RESTful API**: Implements a RESTful API for easy interaction and integration.
- **CRUD Operations**: Supports Create, Read, Update, and Delete operations for managing data.
- **Error Handling**: Robust error handling to ensure smooth operation and debugging.
- **Lightweight and Fast**: Minimalistic design for high performance.
- **Modular Code**: Well-organized code structure to facilitate future enhancements and maintenance.
- **Frontend with Chakra UI**: The frontend is built with Chakra UI for a modern and responsive design.
- **Theme Changing**: Includes light and dark theme modes for better user experience.

## Getting Started

### Prerequisites

Make sure you have Go installed on your system. You can download it from the [official Go website](https://golang.org/dl/).

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-go-project.git
    cd your-go-project
    ```

2. Install dependencies (if any):
    ```bash
    go mod tidy
    ```

### Running the Project

1. Start the server:
    ```bash
    go run main.go
    ```

2. The server should now be running on `http://localhost:4000`. You can use tools like Postman or your browser to interact with the API.

### API Endpoints

- **GET /api/todos**: Fetch all todos.
- **POST /api/todos**: Create a new todo.
- **DELETE /api/todos/:id**: Delete a todo by ID.
- **PATCH /api/todos/:id**: Update a todo by ID.

## Usage

Here are some examples of how to interact with the API using `curl`:

- Fetch all todos:
    ```bash
    curl http://localhost:4000/api/todos
    ```

- Create a new todo:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"body": "New Task"}' http://localhost:4000/api/todos
    ```

- Delete a todo:
    ```bash
    curl -X DELETE http://localhost:4000/api/todos/your-todo-id
    ```

- Update a todo:
    ```bash
    curl -X PATCH -H "Content-Type: application/json" -d '{"body": "Updated Task"}' http://localhost:4000/api/todos/your-todo-id
    ```

## Frontend

The frontend of this project is built using React and Chakra UI. Chakra UI is a simple, modular, and accessible component library that gives you the building blocks to build your React applications. 

### Theme Changing

This project includes theme changing capabilities to switch between light and dark modes. The theme can be toggled using the UI switch provided in the application.


