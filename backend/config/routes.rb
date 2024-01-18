Rails.application.routes.draw do
  # OpenAI APIのコールバック
  post 'api/openai/v1/callback', to: 'open_ai#callback'

  namespace :api, defaults: { format: :json } do
    resources :bookmarks,           only: [:index, :create, :destroy]
    resources :characters,          only: [:index, :create, :update, :destroy]
    resources :comments,            only: [:index, :create, :update, :destroy]
    resources :conversations,       only: [:index, :create, :update, :destroy]
    resources :character_responses, only: [:index, :create]
    resources :decisions,           only: [:index, :create, :update, :destroy]
    resources :decision_tags,       only: [:index, :create, :update, :destroy]
    resources :tags,                only: [:index, :create, :update, :destroy]
    resources :users,               only: [:index, :update, :destroy]
    resources :user_characters,     only: [:index, :update]
    # users#createは特定のURLを指定する
    post 'auth/:provider/callback', to: 'users#create'
  end

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
