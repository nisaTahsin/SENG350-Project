# Use Node LTS
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 4000

# Run NestJS in development mode (with nodemon)
CMD ["npm", "run", "start:dev"]
