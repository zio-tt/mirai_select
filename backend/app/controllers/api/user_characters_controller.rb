class Api::UserCharactersController < ApplicationController
  before_action :set_user_character, only: [:update]

  def index
    case condition_params
    when "all"
      render json: { user_characters: UserCharacter.all }
    when "user"
      characters = Character.where(id: current_user.user_characters.pluck(:character_id))
      characters_data = characters.map do |character|
        # 必要な属性を取り出す
        character_attributes = character.slice(:id, :name, :character1_welcome, :character2_welcome)
        # avatarのURLを取得し、属性に追加する
        avatar_url = url_for(character.avatar) if character.avatar.attached?
        character_attributes.merge(avatar: avatar_url)
      end
    end

    render json: {
      user_characters: current_user.user_characters,
      charactersData:  characters_data
    }
  end

  def update
    @user_character.update!(
      role:         role_params,
      character_id: new_character_id_params
    )

    render json: {
      user_characters: current_user.user_characters,
      charactersData:  characters_data
    }
  end

  private

  def set_user_character
    @user_character = UserCharacter.find_by(user_id: current_user.id ,character_id: old_character_id_params)
  end

  def old_character_id_params
    params.require(:oldCharacterId)
  end

  def new_character_id_params
    params.require(:newCharacterId)
  end

  def role_params
    params.require(:role)
  end

  def condition_params
    params.require(:condition)
  end
end
