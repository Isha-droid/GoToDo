package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Todo struct to define the structure of a todo item
type Todo struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

// Response struct to define the structure of the response
type Response struct {
	Message string `json:"message"`
	Todo    Todo   `json:"todo"`
}

var collection *mongo.Collection

func main() {
	app := fiber.New()

	// Load environment variables from .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowMethods: "GET,POST,DELETE,PATCH",
	}))

	PORT := os.Getenv("PORT")
	if PORT == "" {
		log.Fatal("PORT environment variable not set")
	}

	MONGO_DB_URI := os.Getenv("MONGO_DB_URI")

	clientOptions := options.Client().ApplyURI(MONGO_DB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB Atlas")
	collection = client.Database("go_todo").Collection("todos")

	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodos)
	app.Delete("/api/todos/:id", deleteTodos)
	app.Patch("/api/todos/:id", updateTodos)

	log.Fatal(app.Listen(":" + PORT))
}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}
	return c.JSON(todos)
}

func createTodos(c *fiber.Ctx) error {
	todo := new(Todo)
	if err := c.BodyParser(todo); err != nil {
		return err
	}
	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body cannot be empty"})
	}

	todo.ID = primitive.NewObjectID()
	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}
	todo.ID = insertResult.InsertedID.(primitive.ObjectID)
	return c.Status(201).JSON(todo)
}

func deleteTodos(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID format"})
	}

	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		return err
	}
	if deleteResult.DeletedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}
	return c.SendStatus(204)
}

func updateTodos(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID format"})
	}

	todo := new(Todo)
	if err := c.BodyParser(todo); err != nil {
		return err
	}

	update := bson.M{}
	if todo.Body != "" {
		update["body"] = todo.Body
	}
	update["completed"] = todo.Completed

	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{"$set": update})
	if err != nil {
		return err
	}
	if updateResult.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	var updatedTodo Todo
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&updatedTodo)
	if err != nil {
		return err
	}

	response := Response{
		Message: "Todo updated successfully",
		Todo:    updatedTodo,
	}

	return c.JSON(response)
}
