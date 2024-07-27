package main

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// Todo struct to define the structure of a todo item
type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

var todos []Todo

func main() {
	app := fiber.New()

	// Initialize a list of todos
	todos = append(todos, Todo{ID: 1, Completed: false, Body: "Learn Go"})
	todos = append(todos, Todo{ID: 2, Completed: true, Body: "Build a Fiber API"})

	// Route to return a simple greeting message
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, Fiber!")
	})

	// Route to get the list of todos
	app.Get("/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	// Route to create a new todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		var newTodo Todo

		if err := c.BodyParser(&newTodo); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse request body",
			})
		}

		if newTodo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
		}
		newTodo.ID = len(todos) + 1

		todos = append(todos, newTodo)
		return c.Status(fiber.StatusCreated).JSON(newTodo)
	})

	// Route to update a todo by ID using PUT (full update)
	app.Put("/api/todos/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid todo ID",
			})
		}

		var updateTodo Todo
		if err := c.BodyParser(&updateTodo); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse request body",
			})
		}

		for i, t := range todos {
			if t.ID == id {
				todos[i] = updateTodo
				todos[i].ID = id // ensure the ID remains the same
				return c.JSON(todos[i])
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	// Route to update a todo by ID using PATCH (partial update)
	app.Patch("/api/todos/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid todo ID",
			})
		}

		var updateTodo Todo
		if err := c.BodyParser(&updateTodo); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse request body",
			})
		}

		for i, t := range todos {
			if t.ID == id {
				if updateTodo.Body != "" {
					todos[i].Body = updateTodo.Body
				}
				todos[i].Completed = updateTodo.Completed
				return c.JSON(todos[i])
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	// Start the server on port 4000
	log.Fatal(app.Listen(":4000"))
}
