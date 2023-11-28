module Authentication
  def current_user
    token = request.headers['Authorization'].split(' ').last
    decoded_token = decode_token(token)
    User.find_by(uid: decoded_token[0]['sub'])
  end

  def logged_in?
    !current_user.nil?
  end

  def decode_token(token)
    JWT.decode(token, ENV['APP_ACCESS_TOKEN_SECRET'], true, { algorithm: 'HS256' })
  end
end