FROM node:10-alpine
RUN apk add --update git bash

COPY . /src
WORKDIR /src

RUN npm install

EXPOSE 3003
CMD ["node", "server.js"]
