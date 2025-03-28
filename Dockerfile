# Use a lightweight Node.js base image
FROM node:16-alpine

# Create and set app directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port the app runs on (3000 by default)
EXPOSE 3000

# Run the 'start' script from package.json
CMD ["npm", "start"]
