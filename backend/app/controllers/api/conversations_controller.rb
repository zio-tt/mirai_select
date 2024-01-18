class Api::ConversationsController < ApplicationController
  before_action :set_conversation, only: [:update, :destroy]

  def index
    render json: { conversations: Conversation.all, character_responses: CharacterResponse.all }
  end

  def create
    @conversation= Conversation.new(
      decision_id: decision_id_params,
      query_text:  query_text_params
    )

    if @conversation.save
      parsed_response_params.map do |character_response|
        @conversation.character_responses.create!(
          character_id: character_response["character_id"],
          response:     character_response["response"]
        )
      end

      render json: {
        conversation: @conversation,
        character_responses: @conversation.character_responses
      }
    end
  end

  def update
    user_decision = CharacterResponse.find_by(
      conversation_id: user_decision_params[:conversation_id],
      character_id: user_decision_params[:character_id]
    )
    @conversation.update!(user_decision: user_decision.id)
  end

  private

  def set_conversation
    @conversation = Conversation.find(params[:id])
  end

  def decision_id_params
    params.require(:decisionId)
  end

  def query_text_params
    params.require(:queryText)
  end

  def parsed_response_params
    params.require(:parsedResponse)
  end

  def user_decision_params
    params.require(:userDecision).permit(:conversation_id, :character_id, :response)
  end
end