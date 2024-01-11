class OpenAiController < ApplicationController
  include ErrorHandler
  before_action :set_key, :set_characters, only: [:callback]

  def callback
    # Setting Intial Variables
    input_text         = fetchParams["inputText"]
    conversation_count = fetchParams["conversationCount"]
    remainingTokens    = fetchParams["remainingTokens"]

    # conversationが1の時はDecisionを作成
    # それ以外の時はDecisionを取得
    if conversation_count == 1
      decision = Decision.create!(user_id: current_user.id, public: false)
    else
      decision          = Decision.find(fetchParams["decisionId"])
      before_query_text = fetchParams["beforeQueryText"]
      user_decision     = fetchParams["userDecision"]
    end


    if decision
      assistant_message = decision.assistant_message(@character1, @character2)
      case conversation_count
      when 1 then
        system_message    = decision.system_message(@character1, @character2)
        user_message      = input_text

        response = OpenAiService.new(@api_key).call(system_message, user_message, assistant_message)
        process_response(decision, input_text, response, @character1, @character2)
      when 2 then
        system_message      = decision.second_system_message(@character1, @character2)
        user_message        = decision.second_message(input_text, before_query_text, user_decision)

        @conversation = decision.conversations.first
        @conversation.update!(user_decision: @user_decision)
        response = OpenAiService.new(@api_key).call(system_message, user_message, assistant_message)
        process_response(decision, input_text, response, @character1, @character2)
      end

      # トークンの減算処理
      current_user.token = remainingTokens
      current_user.save!

      user_info = {
        id:    current_user.id,
        name:  current_user.name,
        token: current_user.token
      }

      render json: { response: response, user: user_info, decision: decision, conversation: @conversation }
    else
      render json: { error: "Happend some error." }, status: :unprocessable_entity
    end
  end

  private

  def process_response(decision, input_text, response, character1, character2)
    # OpenAIからの応答を処理
    characters = { character1.name => character1, character2.name => character2 }
    content = response["choices"].first["message"]["content"]
    content_hash = JSON.parse(content)
    
    # Conversationの作成
    @conversation = Conversation.create!(decision_id: decision.id, query_text: input_text)
  
    # キャラクターごとの応答を処理
    content_hash.each do |key, character_info|
      character_name = character_info["#{key}_name"]
      character_response = character_info["#{key}_response"]

      if character = characters[character_name]
        CharacterResponse.create!(
          conversation_id: @conversation.id,
          character_id: character.id,
          response: character_response
        )
      end
    end
  end

  def set_key
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
  end

  def set_characters
    @character1 = current_user.user_characters.find_by(role: :character1).character
    @character2 = current_user.user_characters.find_by(role: :character2).character
  end

  def fetchParams
    params.require(:fetchData).permit(:inputText, :conversationCount, :decisionId, :beforeQueryText, :userDecision, :remainingTokens)
  end
end
