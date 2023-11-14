Rails.application.routes.draw do
  get 'user_sessions/create'
  post 'auth/:provider/callback', to: 'users#create'
  post 'auth/:provider/login', to: 'user_sessions#create'
end
