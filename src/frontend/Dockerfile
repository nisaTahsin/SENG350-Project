FROM node:20-alpine AS base
WORKDIR /app

FROM base AS dev
COPY package*.json ./
RUN npm install
COPY tsconfig.json public/index.html ./
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]

