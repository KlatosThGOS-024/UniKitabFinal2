# Use the official Node.js LTS image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set environment variable for production
ENV NODE_ENV=production

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Copy package.json and package-lock.json (if available) for installing dependencies
COPY package*.json ./

# Install production dependencies (and move node_modules to the parent directory)
RUN npm install --production --silent && mv node_modules ../

# Copy the rest of the application code (including user code) into the container
COPY . .

# Expose port 3000 (if necessary for web apps)
EXPOSE 3000

# Set ownership of the application directory to the 'node' user (security best practice)
RUN chown -R node /usr/src/app

# Use non-root 'node' user for running the app
USER node

# Command to run TypeScript code (assuming index.ts is the entry point)
CMD ["ts-node", "index.ts"]
