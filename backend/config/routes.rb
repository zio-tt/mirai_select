Rails.application.routes.draw do
  post 'auth/:provider/callback', to: 'users#create'
  post 'auth/:provider/login', to: 'user_sessions#create'
  post 'auth/:provider/logout', to: 'user_sessions#destroy'
end
