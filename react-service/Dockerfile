# Stage 1: Build the React application
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using a simple HTTP server
FROM node:14

# Install serve - a static file serving and directory listing server
RUN npm install -g serve

# Set the working directory in the container
WORKDIR /app

# Copy the built app from the build stage
COPY --from=build /app/dist /app

# Expose the port the app runs on
EXPOSE 5174

# Serve the app on port 3000
CMD ["serve", "-s", ".", "-l", "5174"]
