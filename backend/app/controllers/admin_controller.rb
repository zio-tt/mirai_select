class AdminController < ApplicationController
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:dont_sreep]
  skip_before_action :check_xhr_header, only: [:dont_sreep]


  require 'openssl'
  require 'base64'

  def dont_sreep
    render json: { message: 'I am awake' }
  end

  private

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
    binding.pry
    decrypted_token
  rescue OpenSSL::Cipher::CipherError
    raise 'Unauthorized'
  end
end
