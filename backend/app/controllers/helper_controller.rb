class HelperController < ApplicationController
  def callback
    @user = current_user
    @user_characters = Character.where(id: @user.user_characters.pluck(:character_id))
    @data = {
      user: @user,
      characters: @user_characters
    }

    render json: {data: @data}
  end
end
