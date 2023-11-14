class UserSessionsController < ApplicationController
  def create
    token =  params[:token]
    decoded_token = decode_token(token)
    user_info = decoded_token[0]

    sign_in(user_info)
    head: ok
  end
end
