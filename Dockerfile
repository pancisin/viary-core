FROM node:12-alpine AS build

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm publish