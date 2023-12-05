Rails.application.routes.draw do
  # ユーザーの作成
  post 'auth/:provider/callback', to: 'users#create'

  # OpenAI APIのコールバック
  post 'helper/api/callback', to: 'decisions#callback'

  # 一覧画面へのルーティング
  post 'api/index', to: 'decisions#index'
end
