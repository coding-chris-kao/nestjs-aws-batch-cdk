FROM node:latest

WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN npm install -g @nestjs/cli &&\
    npm install

COPY ./src ./src
RUN npm run build

WORKDIR /app/dist