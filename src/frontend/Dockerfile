FROM node:20-alpine

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install
COPY tsconfig.json public/index.html ./
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]

# Copy config & public
COPY tsconfig.json ./
COPY public ./public

# Copy source code
COPY src ./src

# Expose frontend port
EXPOSE 5173

# Start frontend dev server
CMD ["npm", "run", "dev"]
