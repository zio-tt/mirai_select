
FROM ruby:3.2.2

# 必要なパッケージのインストール
RUN apt-get update -qq && apt-get install -y nodejs npm postgresql-client build-essential libpq-dev
RUN npm install -g yarn

# 作業ディレクトリの設定
WORKDIR /app

# GemfileとGemfile.lockをコピーし、bundle installを実行
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

# Railsプロジェクトをコピー
COPY . /app

# Pumaのポートを公開
EXPOSE 3000

# サーバーを起動
CMD ["rails", "server", "-b", "0.0.0.0"]
