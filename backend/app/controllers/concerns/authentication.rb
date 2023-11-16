module Authentication
  def current_user
    @current_user ||= User.find(session[:current_user]) if session[:current_user]
  end

  def logged_in?
    !current_user.nil?
  end

  def decode_token(token)
    JWT.decode(token, ENV['APP_ACCESS_TOKEN_SECRET'], true, { algorithm: 'HS256' })
  end
end