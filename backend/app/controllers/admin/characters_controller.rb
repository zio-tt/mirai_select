class Admin::CharactersController < ApplicationController
  # キャラクター一覧
  def index
    characters = Character.all.map { |character| character_attributes(character) }
    render json: characters
  end

  # キャラクターの詳細
  def show
    character = Character.find(params[:id])
    render json: character_attributes(character)
  end

  # キャラクターの更新
  def update
    binding.pry
    character = Character.find(params[:id])
    character.update!(character_params)
    render json: character_attributes(character)
  end

  # キャラクターの削除
  def destroy
    character = Character.find(params[:id])
    character.destroy
    head :no_content
  end

  private

  def character_params
    params.require(:characters).permit(:name, :mbti_type, :tone, :first_person, :second_person, :expression, :values, :empathy, :character1_welcome, :character2_welcome, :avatar)
  end

  def character_attributes(character)
    character.as_json.merge({
      avatar_url: character.avatar.attached? ? url_for(character.avatar) : nil
    })
  end
end
