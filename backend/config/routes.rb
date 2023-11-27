Rails.application.routes.draw do
  post 'auth/:provider/callback', to: 'users#create'
  post 'helper/api/callback', to: 'decisions#callback'
end
