# Step 1: Build the React app using a Node.js base image
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json) first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN yarn build

# Step 2: Set up the production environment with Nginx to serve the React app
FROM nginx:alpine

# Copy the build directory from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
