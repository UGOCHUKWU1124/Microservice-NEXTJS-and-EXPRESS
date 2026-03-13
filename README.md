# Simple Microservice E-commerce Platform Authentication And Unboarding

A scalable e-commerce platform built with a microservices architecture using **Next.js** for the frontends and **Express.js** for the backend services. The project is managed as a monorepo using **Nx**, enabling seamless code sharing and efficient builds.

## ✨ Features

### 👤 User & Customer Features

- **Authentication**: Secure registration and login using JWT.
- **Profile Management**: Users can manage their profiles and avatars.

### 🏪 Seller & Shop Management

- **Seller Accounts**: Dedicated seller registration with Stripe and Paystack integrations.
- **Shop Creation**: Sellers can create and customize their storefronts (banners, categories, business hours, social links).
- **Dashboard**: A dedicated Next.js Admin UI (`seller-ui`) to manage their shop and monitor reviews/ratings.

### 🌐 API Gateway

- **Centralized Routing**: Acts as the single entry point, bridging the frontends with underlying microservices using `express-http-proxy`.
- **Security & Reliability**: Implements **Express Rate Limiting** to prevent abuse, comprehensive **CORS** configuration, and request size limitations.
- **Observability**: Intercepts requests for centralized logging and cookie parsing before forwarding them to downstream services.

### ⚙️ Core Architecture

- **Microservices**: Decoupled backend architecture with distinct services (`auth-service`, `seller-service`) routed via a central `api-gateway`.
- **Monorepo Structure**: Uses Nx for efficient dependency management and sharing packages between applications.
- **Data Modeling**: Robust MongoDB schema using Prisma ORM.

## 🚀 Technologies Used

### Frontend (User & Seller UIs)

- **Framework**: Next.js 15
- **State Management**: Jotai
- **Styling**: Tailwind CSS, Styled Components
- **Forms & Validation**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend (Microservices)

- **Framework**: Express.js
- **Database ORM**: Prisma
- **Caching**: Redis (ioredis)
- **Authentication**: JWT & bcryptjs
- **Payment Processing**: Stripe
- **Email/Notifications**: Nodemailer
- **API Documentation**: Swagger (swagger-autogen, swagger-ui-express)

### Architecture & Tooling

- **Monorepo**: Nx
- **Validation**: Joi
- **TypeScript**: Strictly typed across the stack
- **Proxy**: express-http-proxy (API Gateway)

## 📁 Project Structure

The repository is structured into `apps` and `packages` to promote modularity and code reuse.

### Apps

- **`api-gateway`**: Centralized gateway that routes client requests to the appropriate underlying microservices.
- **`auth-service`**: Microservice responsible for user registration, login, and JWT-based authentication. Docs available via swagger.
- **`seller-service`**: Microservice handling seller operations, product management, and inventory.
- **`user-ui`**: The storefront application for customers to browse products and make purchases (Next.js).
- **`seller-ui`**: The dashboard application for sellers to manage their store and products (Next.js).

### Packages (Shared Libraries)

- **`components`**: Shared React components used across both UIs.
- **`error-handler`**: Standardized error handling utilities for all Express microservices.
- **`libs`**: Shared utilities, helper functions, and types.
- **`middleware`**: Express middlewares (e.g., authentication, rate limiting) shared among services.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL or Mongodb (for Prisma)
- Redis Server
- Environment variables configured (create `.env` based on services requirements)

### Installation

1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Running the Application

You can use Nx commands to serve the entire stack or individual applications.

**Run all services and UIs concurrently:**

```bash
npm run dev
```

**Run User UI:**

```bash
npm run user-ui
```

**Run Seller UI:**

```bash
npm run seller-ui
```

**View Authentication Service API Docs:**

```bash
npm run auth-docs
```

## 🔐 Environment Variables

Ensure you have a `.env` file in the root directory or configure environment variables for each respective app. Key mappings usually include:

- `DATABASE_URL`: Connection string for PostgreSQL.
- `REDIS_URL`: Connection string for the Redis instance.
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `STRIPE_SECRET_KEY`: Stripe API keys for payment processing.
