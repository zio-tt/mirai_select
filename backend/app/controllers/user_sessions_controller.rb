class UserSessionsController < ApplicationController
  skip_before_action :check_xhr_header, only: [:destroy]
  def create
    token =  params[:token]
    decoded_token = decode_token(token)
    user_info = decoded_token[0]
    user = User.find_by(uid: user_info['uid'])

    if user
      session[:current_user] = user
      render json: { message: "Login successful" }, status: :ok
    else
      render json: { message: "Login failed" }, status: :unprocessable_entity
    end
  end

  def destroy
    binding.pry
    session.delete(:current_user)
    @current_user = nil

    if session[:current_user].nil?
      head :ok
    else
      render json: { error: "Can't destroy User." }, status: :unprocessable_entity
    end
  end
end
