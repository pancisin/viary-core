FROM node:lts-alpine

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && npn publish