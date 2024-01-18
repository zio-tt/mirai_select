class Api::UsersController < ApplicationController
  include ErrorHandler
  before_action :set_user, only: [:update]

  def index
    case condition_params
    when 'all'
      render json: { users: User.select_attributes }
    when 'current_user'
      user = { id: current_user.id, name: current_user.name, avatar: current_user.avatar, token: current_user.token }
      render json: { current_user: user }
    else
      render json: { error: 'Invalid condition' }, status: :unprocessable_entity
    end
  end

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

  def update
    @user.update(token: remaining_tokens_params)

    render json: { message: 'Success to update remaining_tokens' }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def remaining_tokens_params
    params.require(:remainingTokens)
  end

  def condition_params
    params.require(:condition)
  end
end
