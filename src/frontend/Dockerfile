FROM node:20-alpine

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY public ./public
COPY src ./src
COPY tsconfig.json ./

# Expose port 3000 (react-scripts default)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
