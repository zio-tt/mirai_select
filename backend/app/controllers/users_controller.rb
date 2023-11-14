class UsersController < ApplicationController
  def create
    # JWTトークンの受け取りと検証
    token = params[:token]
    decoded_token = decode_token(token)

    # ユーザー情報の取得
    user_info = decoded_token[0]
    user = User.find_or_create_by(
      provider: user_info['provider'],
      uid: user_info['uid'],
      name: user_info['name'],
      email: user_info['email'],
      avatar: user_info['avatar'],
    )

    if user
      head :ok
    else
      render json: { error: "ユーザーの作成に失敗しました" }, status: :unprocessable_entity
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :internal_server_error
  rescue JWT::DecodeError => e
    render json: { error: e.message }, status: :unauthorized
  end
end
