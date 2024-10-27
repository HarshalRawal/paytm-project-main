# Docker Setup for Backend Services

This repository provides instructions for setting up the backend services using Docker. Follow the steps below to create volumes, run PostgreSQL containers for each service, and configure the database URLs.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Create Docker Volumes](#step-1-create-docker-volumes)
- [Step 2: Run PostgreSQL Containers](#step-2-run-postgresql-containers)
  - [API Gateway](#1-api-gateway)
  - [Top-Up Server](#2-top-up-server)
  - [Bank](#3-bank)
  - [Bank Web Hook Server](#4-bank-web-hook-server)
  - [Payment](#5-payment)
  - [Wallet](#6-wallet)
- [Step 3: Database URLs](#step-3-database-urls)

## Prerequisites

- Ensure you have Docker installed on your machine. If not, you can download and install it from [Docker's official website](https://www.docker.com/products/docker-desktop).

## Step 1: Create Docker Volumes

Create the necessary volumes for the different backend services (this step should only be done once):

```bash
docker volume create user-data
docker volume create api-gateway-data
docker volume create top-up-server-data
docker volume create bank-data
docker volume create bank-web-hook-server-data
docker volume create payment-data
docker volume create wallet-data

<!-- docker commands to create a container  -->

```

## Step 2: Create Docker Containers
Create the necessary Container for the different backend services
```bash

# user Postgres container running on port 6000
docker run -d \
  --name user-db \
  -p 6000:5432 \
  -v user-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=user_password \
  -e POSTGRES_DB=user_db \
  postgres

# api-gateway Postgres container running on port 8000
docker run -d \
  --name api-gateway-db \
  -p 8000:5432 \
  -v api-gateway-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -e POSTGRES_DB=api_gateway_db \
  postgres

# top-up-server Postgres container running on port 3001
docker run -d \
  --name top-up-server-db \
  -p 3001:5432 \
  -v top-up-server-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=topup_user \
  -e POSTGRES_PASSWORD=topup_password \
  -e POSTGRES_DB=top_up_server_db \
  postgres

# bank Postgres container running on port 4002
docker run -d \
  --name bank-db \
  -p 4002:5432 \
  -v bank-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=bank_user \
  -e POSTGRES_PASSWORD=bank_password \
  -e POSTGRES_DB=bank_db \
  postgres

# bank-web-hook-server Postgres container running on port 5001
docker run -d \
  --name bank-web-hook-server-db \
  -p 5001:5432 \
  -v bank-web-hook-server-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=webhook_user \
  -e POSTGRES_PASSWORD=webhook_password \
  -e POSTGRES_DB=bank_web_hook_server_db \
  postgres

# payment Postgres container running on port 3002
docker run -d \
  --name payment-db \
  -p 3002:5432 \
  -v payment-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=payment_user \
  -e POSTGRES_PASSWORD=payment_password \
  -e POSTGRES_DB=payment_db \
  postgres

# wallet Postgres container running on port 8085
docker run -d \
  --name wallet-db \
  -p 8085:5432 \
  -v wallet-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=wallet_user \
  -e POSTGRES_PASSWORD=wallet_password \
  -e POSTGRES_DB=wallet_db \
  postgres

```

## Step 3: Change the DB url

Change the respective DB url in the prisma file or env file
```bash

# user .env
DATABASE_URL=postgresql://user:user_password@localhost:6000/user_db

# api-gateway .env
  <!-- api-gate , bank not needed -->
DATABASE_URL=postgresql://api_user:api_password@localhost:8000/api_gateway_db 

# top-up-server .env
DATABASE_URL=postgresql://topup_user:topup_password@localhost:3001/top_up_server_db

# bank .env
DATABASE_URL=postgresql://bank_user:bank_password@localhost:4002/bank_db

# bank-web-hook-server .env
DATABASE_URL=postgresql://webhook_user:webhook_password@localhost:5001/bank_web_hook_server_db

# payment .env
DATABASE_URL=postgresql://payment_user:payment_password@localhost:3002/payment_db

# wallet .env
DATABASE_URL=postgresql://wallet_user:wallet_password@localhost:8085/wallet_db
```
### How to Use This `README.md`
1. Copy the above content.
2. Create a new file named `README.md` in your project directory.
3. Paste the content into the file and save it.

This organized format will help users understand how to set up the backend services easily, with all necessary commands included for quick reference.

