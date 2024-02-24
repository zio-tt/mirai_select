class Api::DecisionCharactersController < ApplicationController
  before_action :set_decision, only: [:index, :create]

  def index
    decision_characters = @decision.decision_characters.map do |decision_character|
      @character = Character.find(decision_character.character_id)
      character = @character.attributes.merge(avatar: rails_blob_url(@character.avatar)) if @character.avatar.attached?
    end

    render json: { decision_characters: @decision.decision_characters, characterData: decision_characters }
  end

  def create
    user_characters_params.each do |user_character|
      @decision.decision_characters.create(character_id: user_character["character_id"], role: user_character["role"])
    end

    # 作成した@decisionのdecision_charactersの各character_idとidが一致するCharacterの配列を返す
    decision_characters = @decision.decision_characters.map do |decision_character|
      @character = Character.find(decision_character.character_id)
      character = @character.attributes.merge(avatar: rails_blob_url(@character.avatar)) if @character.avatar.attached?
    end

    render json: { decision_characters: decision_characters }
  end

  private

  def set_decision
    @decision = Decision.find(decision_id_params)
  end

  def decision_id_params
    params.require(:decision_id)
  end

  def user_characters_params
    params.require(:user_characters)
  end
end
