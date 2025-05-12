# Development stage
FROM node:20-alpine

# Install dependencies required for node-gyp
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Install dependencies globally
RUN npm install -g @angular/cli

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port 4200 for development server
EXPOSE 4200

# Start development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
