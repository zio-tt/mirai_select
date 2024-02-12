class Guest::ConversationsController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    render json: { conversations: Conversation.all, character_responses: CharacterResponse.all }
  end
end
