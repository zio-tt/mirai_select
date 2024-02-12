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

  def authenticate_admin
    encrypted_token = request.headers['Authorization'].to_s.split(' ').last
    decrypted_token = decrypt_token(encrypted_token)
    raise 'Unauthorized' unless decrypted_token == ENV['NEXT_PUBLIC_ENCRYPTION_TOKEN']
  end

  def decrypt_token(encrypted_token)
    cipher = OpenSSL::Cipher.new('AES-128-ECB')
    cipher.decrypt
    cipher.key = ENV['NEXT_PUBLIC_ENCRYPTION_KEY']
    decrypted_token = cipher.update(Base64.decode64(encrypted_token)) + cipher.final
    decrypted_token
  rescue OpenSSL::Cipher::CipherError
    raise 'Unauthorized'
  end
end