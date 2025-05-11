# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of your application code into the container
COPY . .

# Expose the application port (you can change the port number to match your app's configuration)
EXPOSE 5001

# Run the application
CMD ["yarn", "start"]
