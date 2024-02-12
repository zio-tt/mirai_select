class Guest::CharacterResponsesController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    # paramsのdecisionIdを元にConversationの配列を新しい順に取得
    # そのConversationに紐づくCharacterResponseを全て取得
    # decisionに紐づくconversationの回数だけ繰り返す
    character_responses = []

    Conversation.where(decision_id: params[:decisionId]).each do |conversation|
      CharacterResponse.where(conversation_id: conversation.id).map do |character_response|
        character_responses.push(character_response.attributes.slice("id", "conversation_id", "character_id", "response"))
      end
    end

    render json: { character_responses: character_responses }
  end
end