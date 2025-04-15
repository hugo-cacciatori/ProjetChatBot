FROM node:20-alpine
WORKDIR /app

RUN npm install --global serve

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["sh","/app/entrypoint.sh"]