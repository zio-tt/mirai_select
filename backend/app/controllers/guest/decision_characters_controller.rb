class Guest::DecisionCharactersController < ApplicationController
  def index
    @decision = Decision.find(params[:decisionId])
      # decision_characters_listはDecisionCharacterの配列をroleがcharacter1, character2の順番に並べたもの
    decision_characters_list = @decision.decision_characters.order(:role)
    decision_characters = decision_characters_list.map do |decision_character|
      @character = Character.find(decision_character.character_id)
      character = @character.attributes.merge(avatar: rails_blob_url(@character.avatar)) if @character.avatar.attached?
    end

    render json: { decision_characters: decision_characters_list, characterData: decision_characters }
  end
end
