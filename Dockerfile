FROM mhart/alpine-node:4
RUN apk add --update git bash

COPY . /src
WORKDIR /src

RUN npm install
RUN npm install -g forever

EXPOSE 3003
CMD ["forever", "server.js"]