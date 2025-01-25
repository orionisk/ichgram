# Ichgram

A social media platform built with React, Hono, and MongoDB.

## Features

- 🖼️ Image sharing and posts
- 💬 Real-time chat
- 🔔 Notifications
- 👥 User following system
- 🔍 Explore feed
- 💟 Post likes and comments
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend

- React 19
- TypeScript
- TanStack Query
- Tailwind CSS
- Shadcn/ui
- Vite
- Wouter for routing
- WebSocket for real-time messaging

### Backend

- Hono (TypeScript-first web framework)
- MongoDB with Prisma
- WebSocket support
- OpenAPI documentation
- File uploads via UploadThing

## Project Structure

```plaintext
.
├── apps/
│ ├── client/ # React frontend
│ └── api/ # Hono backend
├── packages/
  └── api-client/ # RPC client
```

## Prerequisites

- Node.js
- PNPM
- MongoDB
- Docker (optional)

## Environment Variables

Create `.env` files in both `apps/api` and `apps/client` directories.

## Development

1. Install dependencies:

    ```bash
    pnpm install
    ```

2. Generate Prisma client:

    ```bash
    pnpm api prisma:generate
    ```

3. Start the development servers:

    ```bash
    pnpm dev
    ```

This will start both the API and client in development mode.

## Docker build

Create `.env` file for docker compose:

```bash
cp .env.example .env
```

Make sure to update the `.env` file with the appropriate values for your environment.

Create `mongo-keyfile`:

```bash
openssl rand -base64 756 > mongo-keyfile
chmod 600 mongo-keyfile
chown 999:999 mongo-keyfile
```

Build and run the application using Docker:

```bash
docker compose up --build
```

This will start the backend in production mode.

## API Documentation

The API documentation is available at:

- OpenAPI Spec: `${BASE_PATH}/doc`
- API Reference UI: `${BASE_PATH}/reference`
