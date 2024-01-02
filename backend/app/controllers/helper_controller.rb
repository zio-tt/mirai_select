class HelperController < ApplicationController
  def callback
    @user = current_user
    @user_characters = Character.where(id: @user.user_characters.pluck(:character_id))

    # 各キャラクターに対してavatar URLを取得してマージ
    characters_with_avatar = @user_characters.map do |character|
      character_attributes = character.attributes
      avatar_url = url_for(character.avatar) if character.avatar.attached?
      character_attributes.merge(avatar: avatar_url)
    end

    render json: { 
      user: @user,
      characters: characters_with_avatar
    }
  end
end