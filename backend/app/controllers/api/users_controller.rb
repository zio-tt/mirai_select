class Api::UsersController < ApplicationController
  include ErrorHandler
  before_action :set_user, only: [:update]

  def index
    add_token(current_user)
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
    @user = { id: @user.id, name: @user.name, avatar: @user.avatar, token: @user.token }

    render json: { user: @user }
  end

  private

  def add_token(user)
    monday_count = count_mondays_since_last_update(user)
  
    # 月曜日ごとに100トークンを付与するが、最大300トークンまで
    if monday_count > 0
      new_token_count = [user.token + monday_count * 100, 300].min
      user.update(token: new_token_count, updated_at: Time.current)
    end
  end

  def count_mondays_since_last_update(user)
    last_reset = user.updated_at.to_date
    today = Date.today
    days_count = (today - last_reset).to_i

    return 0 if last_reset == today
    if days_count >= 7
      return days_count / 7
    else
      return (last_reset..today).count { |date| date.monday? }
    end
  end

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
