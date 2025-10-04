FROM node:20-alpine AS base
WORKDIR /app

# --- dev (hot reload) ---\
FROM base AS dev
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
# dev server with auto-reload\
RUN npm install -D ts-node-dev
EXPOSE 4000
CMD ["npm", "run", "dev"]
