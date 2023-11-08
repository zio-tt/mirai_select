FROM node:21.1-alpine3.17

ENV APP_PATH /usr/src/app

# 作業ディレクトリの設定
WORKDIR $APP_PATH

COPY ./frontend ${APP_PATH}

RUN ["npm", "install", "-g", "npm@10.2.3"]