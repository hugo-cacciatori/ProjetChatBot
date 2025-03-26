FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm install --global serve

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["sh","/app/entrypoint.sh"]