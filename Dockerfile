# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Install bash if it's not already present
RUN apk add --no-cache bash

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Serverless globally
RUN npm install -g serverless

# Install dependencies for your NestJS app
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the NestJS port (optional if you want to access the API from the container)
EXPOSE 3001

# Default command to run NestJS app in development mode
CMD ["npm", "run", "start:dev"]
