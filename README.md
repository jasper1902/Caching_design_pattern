# Caching Design Pattern Project
## Overview
This project implements various caching strategies with Redis and Prisma (MySQL) using Express.js as the server framework. The aim is to explore different caching mechanisms like lazy loading, write-back, and write-through to optimize database performance and reduce latency in handling user data.

## Features
Lazy Loading (v1): Data is fetched from the cache if available, otherwise from the database. The data is then cached for future requests.
Write-Back (v2): Data updates are written to the cache first, with periodic writes to the database.
Write-Through (v3): Every update is written to both the cache and the database simultaneously.
Direct Database Access (v4): Provides endpoints to directly interact with the MySQL database without caching.
Cron Job: A scheduled task that periodically syncs data from Redis (for write-back strategy) to the database.
Redis Client: A centralized Redis client to handle caching across all routes.

## Setup and Installation
Prerequisites
Node.js
Redis server
MySQL server

## Steps

1.Clone the repository
  ```sh
   git clone https://github.com/jasper1902/Caching_design_pattern.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run mysql and phpmyadmin server:
4. Run Prisma migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Running via docker:
   ```sh
   docker compose up -d --build
   ```
   
## Endpoints
Lazy Loading (v1)
  GET /v1/api/user
  Fetches users, using Redis to cache the data.
  
Write-Back (v2)
  GET /v2/api/user
    Fetches users, first from the cache or else from MySQL.
  POST /v2/api/user
    Adds a new user to Redis and then syncs it with MySQL using a cron job.

Write-Through (v3)
  GET /v3/api/user
    Fetches users, using Redis to cache the data.
  PUT /v3/api/user/:id
    Updates user data in both Redis and MySQL simultaneously.

Direct Database Access (v4)
  GET /v4/api/user
  Fetches users directly from MySQL without caching.
  
Caching Strategies Explained
Lazy Loading: Data is fetched only when needed. Cache is populated on the first read and used for subsequent reads.
Write-Back: Changes are written to the cache first and then persisted to the database in the background.
Write-Through: Every update operation is immediately reflected in both the cache and the database.
Cron Job
The cron job runs every 5 seconds and syncs the user data from Redis (write-back cache) to MySQL for consistency. This ensures that any cached updates are eventually persisted in the database.
