FROM node:lts-alpine

# RUN apk add --no-cache python2

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && npn publish