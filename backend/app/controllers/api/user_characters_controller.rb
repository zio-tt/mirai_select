class Api::UserCharactersController < ApplicationController
  before_action :set_user_character, only: [:update]

  def index
    case condition_params
    when "all"
      render json: { user_characters: UserCharacter.all }
    when "user"
      # current_userのuser_charactersをroleがcharacter1, character2になるように取得
      # roleはenumで0, 1の値を持つ 0: character1, 1: character2
      charactersList = current_user.user_characters.order(:role)
      characters = charactersList.map do |user_character|
        Character.find(user_character.character_id)
      end
      characters_data = characters.map do |character|
        avatar_url = rails_blob_url(character.avatar) if character.avatar.attached?
        character.attributes.merge(avatar: avatar_url)
      end
    end

    render json: {
      user_characters: current_user.user_characters,
      charactersData:  characters_data
    }
  end

  def update
    if @user_character.update(
      character_id: user_character_params[:character_id],
      role: user_character_params[:role]
    )
      render json: { user_character: @user_character }
    else
      render json: { errors: @user_character.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_user_character
    @user_character = UserCharacter.find(params[:id])
  end

  def user_character_params
    params.require(:user_character)
  end

  def condition_params
    params.require(:condition)
  end
end
