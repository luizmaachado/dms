FROM node:23 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .