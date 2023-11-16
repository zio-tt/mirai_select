class UsersController < ApplicationController
  include ErrorHandler

  def create
    token = params[:token]
    decoded_token = decode_token(token)
    user_info = decoded_token[0]

    user = User.find_or_create_by(
      provider: user_info['provider'],
      uid: user_info['uid'],
      name: user_info['name'],
      email: user_info['email'],
      avatar: user_info['avatar']
    )

    if user
      head :ok
    else
      render json: { error: "Can't create User." }, status: :unprocessable_entity
    end
  end
end
