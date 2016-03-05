FROM mhart/alpine-node:4
RUN apk add --update git bash

COPY . /src
WORKDIR /src

RUN npm install

EXPOSE 3003
CMD ["node", "server"]