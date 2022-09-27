FROM node:latest

WORKDIR /app

COPY ./src ./src
COPY package*.json tsconfig.json ./

RUN npm install && npm run build

WORKDIR /app/dist