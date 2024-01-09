class OpenAiController < ApplicationController
  include ErrorHandler
  before_action :set_key, :set_characters, only: [:callback]

  def callback
    input_text = params[:inputText]
    text_length = input_text.length

    @decision = Decision.new(user_id: current_user.id, public: false)

    if @decision.save
      current_user.decrease_token(text_length)
      response = OpenAiService.new(@api_key, @decision, @character1, @character2).call(input_text)
      process_response(@decision, input_text, response, @character1, @character2)
      render json: { response: response, user: current_user, decision: @decision, conversation: @conversation }
    else
      render json: { error: "Decision could not be saved." }, status: :unprocessable_entity
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
end
