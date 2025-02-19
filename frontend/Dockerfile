FROM node:lts-alpine AS builder

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]