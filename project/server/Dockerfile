FROM node:latest

WORKDIR /usr/app

ADD ./package.json .
ADD ./yarn.lock .
RUN yarn

ADD ./src ./src
ADD ./tsconfig.json .

# EXPOSE 3000
ENTRYPOINT yarn serve:dev