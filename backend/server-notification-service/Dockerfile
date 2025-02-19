FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY server-notification-service ./

ENTRYPOINT node main.js