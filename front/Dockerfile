FROM node:18.17.1

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとyarn.lockをコピー
COPY package.json package-lock.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY ./ .

# アプリケーションを起動
CMD ["npm", "run", "dev"]
