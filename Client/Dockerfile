# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]