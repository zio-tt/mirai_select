class Guest::CharactersController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    if condition_params == "all"
      characters = Character.select_attribute.map do |character|
        avatar_url = character.avatar.attached? ? url_for(character.avatar) : nil
        character.attributes.merge(avatar: avatar_url)
      end
    elsif condition_params == "decision"
      # decision_id_paramsからdecision_idを取得
      # 必要なデータを取得するためのクエリ
      raw_characters = Character
      .joins(user_characters: { user: { decisions: :user } })
      .where(decisions: { id: decision_id_params })

      characters = raw_characters.map do |character|
        character_attributes = character.slice(:id, :name, :character1_welcome, :character2_welcome)
        # avatarのURLを取得し、属性に追加する
        avatar_url = url_for(character.avatar) if character.avatar.attached?
        character_attributes.merge(avatar: avatar_url)
      end
    end

    render json: { characters: characters }
  end
end
