class DecisionsController < ApplicationController
  include ErrorHandler
  before_action :set_key, :set_characters, only: [:callback]

  def callback
    input_text = params[:inputText]
    @decision = Decision.new(user_id: current_user.id, public: false)

    if @decision.save
      # response = OpenAIService.new(@api_key, @decision, @character1, @character2).call(input_text)
      client = OpenAI::Client.new(access_token: @api_key)
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo-1106",
          messages: [
            { role: "system", content: @decision.system_message(@character1, @character2) },
            { role: "user", content: input_text },
            { role: "assistant", content: @decision.assistant_message(@character1, @character2) }
          ],
          response_format: { type: "json_object" }
        }
      )
      render json: { response: response }
    else
      render json: { error: "Decision could not be saved." }, status: :unprocessable_entity
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
end
