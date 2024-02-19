class Guest::DecisionCharactersController < ApplicationController
  def index
    @decision = Decision.find(params[:decisionId])
    @decision_characters = DecisionCharacter.where(decision_id: @decision.id).map do |decision_character|
      character = Character.find(decision_character.character_id)
      avatar_url = rails_blob_url(character.avatar) if character.avatar.attached?
      character.attributes.merge(avatar: avatar_url)
    end

    render json: { decision_characters: @decision_characters }
  end
end
