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
      render json: { conversation: @conversation }
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

  def user_decision_params
    params.require(:userDecision).permit(:conversation_id, :character_id, :response)
  end
end