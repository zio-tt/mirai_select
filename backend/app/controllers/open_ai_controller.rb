class OpenAiController < ApplicationController
  include ErrorHandler
  before_action :set_key, :set_characters, only: [:callback]

  def callback
    decision_id        = fetchParams["decisionId"]
    decision           = Decision.find(decision_id)

    query_text         = fetchParams["queryText"]
    conversation_count = fetchParams["conversationCount"]

    if decision
      assistant_message = decision.assistant_message(@character1, @character2)
      case conversation_count
      when 1 then
        system_message    = decision.system_message(@character1, @character2)
        user_message      = query_text

        response = OpenAiService.new(@api_key).call(system_message, user_message, assistant_message)
        # process_response(decision, query_text, response, @character1, @character2)
      when 2 then
        before_query_text = fetchParams["beforeQueryText"]
        user_decision     = fetchParams["userDecision"]

        system_message    = decision.second_system_message(@character1, @character2)
        user_message      = decision.second_message(query_text, before_query_text, user_decision)

        # @conversation = decision.conversations.first
        # @conversation.update!(user_decision: @user_decision)
        response = OpenAiService.new(@api_key).call(system_message, user_message, assistant_message)
        # process_response(decision, query_text, response, @character1, @character2)
      end

      render json: { response: response }
    else
      render json: { error: "Happend some error." }, status: :unprocessable_entity
    end
  end

  private

  def set_key
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
  end

  def set_characters
    @character1 = current_user.user_characters.find_by(role: :character1).character
    @character2 = current_user.user_characters.find_by(role: :character2).character
  end

  def fetchParams
    params.require(:fetchData).permit(:queryText, :decisionId, :conversationCount, :beforeQueryText, :userDecision)
  end
end
