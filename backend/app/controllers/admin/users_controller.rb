class Admin::UsersController < ApplicationController
  def index
    users = User.all
    render json: users
  end

  # ユーザーの詳細
  def show
    user = User.find(params[:id])
    render json: user
  end

  # ユーザーの更新
  def update
    user = User.find(params[:id])
    user.update!(user_params)
    render json: user
  end

  # ユーザーの削除
  def destroy
    user = User.find(params[:id])
    user.destroy
    head :no_content
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :avatar, :token)
  end
end
