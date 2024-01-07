class OpenAiService
  def initialize(api_key, decision, character1, character2)
    @api_key = api_key
    @decision = decision
    @character1 = character1
    @character2 = character2
  end

  def call(input_text)
    client = OpenAI::Client.new(access_token: @api_key)
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: @decision.system_message(@character1, @character2) },
          { role: "user", content: input_text },
          { role: "assistant", content: @decision.assistant_message(@character1, @character2)}
        ],
        response_format: { type: "json_object" }
      }
    )
    return response
  end

  def create_welcome_text
    client = OpenAI::Client.new(access_token: @api_key)
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: @decision.system_message(@character1, @character2) },
          { role: "user", content: input_text },
          { role: "assistant", content: @decision.assistant_message(@character1, @character2)}
        ],
        response_format: { type: "json_object" }
      }
    )
    return response
  end
end
