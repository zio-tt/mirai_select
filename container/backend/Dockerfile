
FROM ruby:3.2.2-alpine

ENV ROOT="/app"
ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo

WORKDIR ${ROOT}

COPY backend/Gemfile backend/Gemfile.lock ${ROOT}

# 必要なパッケージのインストール
RUN apk update && \
    apk add \
    alpine-sdk \
    build-base \
    sqlite-dev \
    postgresql-dev \
    tzdata \
    git \
    gcompat


# GemfileとGemfile.lockをコピーし、bundle installを実行
RUN gem install bundler
RUN bundle install

COPY ./container/backend/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["rails", "server", "-e"]
