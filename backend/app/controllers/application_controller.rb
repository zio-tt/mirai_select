class ApplicationController < ActionController::API
  def decode_token(token)
    JWT.decode(token, ENV['APP_ACCESS_TOKEN_SECRET'], true, { algorithm: 'HS256' })
  end
end
