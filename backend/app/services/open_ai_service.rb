class OpenAiService
  def initialize(api_key)
    @api_key = api_key
  end

  def call(system_message, user_message, assistant_message)
    client = OpenAI::Client.new(access_token: @api_key)
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo-1106",
        temperature: 0.9,
        messages: [
          { role: "system",    content: system_message},
          { role: "user",      content: user_message },
          { role: "assistant", content: assistant_message}
        ],
        response_format: { type: "json_object" }
      }
    )
    return response
  end
end
