FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["sh","/app/entrypoint.sh"]