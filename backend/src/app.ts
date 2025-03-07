import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes"; // Users
import cardRoutes from "./routes/card.routes"; // Cards
import countryRoutes from "./routes/country.routes"; // Countries
import categoryRoutes from "./routes/category.routes"; // Categories
import visitorRoutes from "./routes/visitors.routes"; // Visitors
import statsRoutes from "./routes/stats.routes"; // Stats

// Configure environment variables
dotenv.config();

// Initialize the Express application
const app: Application = express();

// Apply middlewares
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Parse JSON request bodies

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is Running!");
});

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User management routes
app.use("/api/cards", cardRoutes); // Card management routes
app.use("/api/countries", countryRoutes); // Country management routes
app.use("/api/categories", categoryRoutes); // Category management routes
app.use("/api/visitors", visitorRoutes); // Visitor tracking routes
app.use("/api/stats", statsRoutes); // Statistics routes

// Handle 404 errors (if route is not found)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
