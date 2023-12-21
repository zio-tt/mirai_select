Rails.application.routes.draw do
  # ユーザーの作成
  post 'auth/:provider/callback', to: 'users#create'

  # OpenAI APIのコールバック
  post 'api/openai/v1/callback', to: 'open_ai#callback'

  # 一覧画面へのルーティング
  post 'api/index', to: 'decisions#index'
end
