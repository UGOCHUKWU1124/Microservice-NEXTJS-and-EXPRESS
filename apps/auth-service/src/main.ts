import swaggerUi from 'swagger-ui-express';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerDocument from './swagger-output.json';
import { errorHandler } from 'packages/error-handler/error-middleware';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); //cookies are used for storing access token and refresh token
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req: Request, res: Response) => {
    res.json(swaggerDocument);
});


app.use(router); // Normal routes
app.use("/api", router); //for backend testing


// Root route
app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'Welcome to my world' });
});

app.use(errorHandler);

// Start server
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Auth service is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

server.on('error', (error) => {
    console.log("Server Error:", error);
});