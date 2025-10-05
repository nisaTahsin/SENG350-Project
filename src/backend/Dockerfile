# Use Node LTS
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run NestJS in development mode (with nodemon)
CMD ["npm", "run", "start:dev"]
