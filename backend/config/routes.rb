Rails.application.routes.draw do
  post 'auth/:provider/callback', to: 'users#create'
end
