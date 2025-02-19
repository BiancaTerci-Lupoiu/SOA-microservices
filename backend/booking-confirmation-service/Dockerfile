FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY booking-confirmation-service ./
COPY utils ./utils

ENTRYPOINT node main.js