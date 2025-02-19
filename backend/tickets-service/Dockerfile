FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY tickets-service ./
COPY utils ./utils
COPY middlewares ./middlewares

ENTRYPOINT node main.js