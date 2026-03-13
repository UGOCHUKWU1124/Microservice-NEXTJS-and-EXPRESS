/**
 * Minimal backend setup for development purposes.
 * Not intended for production use.
 */

import express, { Application } from 'express'; // Framework for building web applications and APIs, providing routing and middleware support.
import cors from 'cors'; // Middleware to enable Cross-Origin Resource Sharing, allowing requests from specified origins.
import proxy from 'express-http-proxy'; // Middleware for proxying HTTP requests to another server, enabling API gateway functionality.
import morgan from 'morgan'; // HTTP request logger middleware for development, logging incoming requests.
import rateLimit, { ipKeyGenerator } from 'express-rate-limit'; // Middleware to limit request rates per IP, preventing abuse.
//import swaggerUi from 'swagger-ui-express'; // Middleware for serving Swagger UI to document and test APIs.
//import axios from 'axios'; // Promise-based HTTP client for making requests to external services.
import cookieParser from 'cookie-parser'; // Middleware to parse cookies from incoming requests.

// Initialize Express application instance.
const app:Application = express();

// Configure CORS middleware to allow requests from the frontend client.
// Restricts origins, methods, headers, and enables credentials for secure cross-origin interactions.
app.use(
  cors({
    origin: ['http://localhost:3000'], // Allow only the specified frontend origin to prevent unauthorized access.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitted HTTP methods for cross-origin requests.
    allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers in requests.
    credentials: true, // Enable sending cookies and authentication headers.
  }),
);

// Enable Morgan logger in development mode to log HTTP requests for debugging.
app.use(morgan('dev'));

// Middleware to parse incoming JSON payloads, with a size limit to prevent large request attacks.
app.use(express.json({ limit: '100mb' }));

// Middleware to parse URL-encoded data, with extended support and size limit.
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware to parse cookies from requests, making them available in req.cookies.
app.use(cookieParser());

// Trust the first proxy in the chain (e.g., for accurate IP detection behind a load balancer).
app.set('trust proxy', 1);

// Configure rate limiting to prevent abuse.
// Limits requests to 100 per 15-minute window per IP, with custom key generation for IPv4/IPv6 handling.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window for rate limiting (15 minutes).
  max: 100, // Maximum requests allowed per window.
  message: 'Too many requests from this IP, please try again later.', // Error message when limit exceeded.
  keyGenerator: (req: any) => {
    // Generate a unique key based on client IP, handling both IPv4 and IPv6.
    return ipKeyGenerator(req.ip);
  },
  standardHeaders: true, // Include rate limit info in standard headers.
  legacyHeaders: false, // Disable deprecated legacy headers.
});

// Apply rate limiting middleware to all routes.
app.use(limiter);

// Health check endpoint to verify the API gateway is running.
app.get('/api/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

// Proxy api requests to the auth service
app.use('/api', proxy('http://localhost:6001'));

// Determine the port from environment variable or default to 8080.
const port = process.env.PORT;

// Start the server and listen on the specified port.
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

// Handle server errors by logging them.
server.on('error', console.error);

// Proxying benefits:
// - Abstracts complexity of multiple backend services from clients.
// - Centralizes routing, security, and rate limiting.
// - Provides a single entry point for all services, simplifying client interactions.