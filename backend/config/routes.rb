Rails.application.routes.draw do
  # ユーザーの作成
  post 'auth/:provider/callback', to: 'users#create'

  # OpenAI APIのコールバック
  post 'api/openai/v1/callback', to: 'open_ai#callback'

  post 'helper', to: 'helper#callback'
  # 一覧画面へのルーティング
  post   'api/index', to: 'decisions#index'
  post   'api/create', to: 'decisions#create'
  post   'api/comment', to: 'comments#create'
  delete 'api/comments/:id', to: 'comments#destroy'
  post   'api/bookmark', to: 'bookmarks#create'
  delete 'api/bookmarks/:id', to: 'bookmarks#destroy'

  post '/awake' => 'admin#dont_sreep'

  # adminコントローラのusers,charactersアクションへのルーティング
  # それぞれ"admin/users"と"admin/characters"というURLになる
  namespace :admin do
    resources :users, only: [:index, :show, :update, :destroy]
    resources :characters, only: [:index, :show, :update, :destroy]
    resources :decisions, only: [:index, :show, :update, :destroy]
    resources :conversations, only: [:index, :show, :update, :destroy]
    resources :tags, only: [:index, :show, :update, :destroy]
    resources :comments, only: [:index, :show, :update, :destroy]
    resources :bookmarks, only: [:index, :show, :update, :destroy]
  end
end
