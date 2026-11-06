FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i

# COPY  . . 
COPY src ./src
COPY public ./public 
CMD [ "npm", "start" ]


