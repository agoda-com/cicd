FROM node:13.0.1-stretch-slim

WORKDIR /usr/src/app
COPY . /usr/src/app

# Install dependencies
RUN yarn

EXPOSE 9000
CMD yarn start