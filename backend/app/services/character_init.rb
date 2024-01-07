class CharacterInit
  def initialize(api_key, character)
    @api_key = api_key
    @character = character
  end

  def create_welcome_text
    client = OpenAI::Client.new(access_token: @api_key)
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: @character.create_welcome_system_message(@character)},
          { role: "assistant", content: @character.create_welcome_assistant_message(@character)}
        ],
        response_format: { type: "json_object" }
      }
    )

    # 'content' を取得し、JSONとしてパース
    content = response["choices"].first["message"]["content"]
    parsed_content = parse_json_content(content)

    # パースされたハッシュからウェルカムメッセージを取得
    character1_welcome = parsed_content["response"]["character1_welcome"]
    character2_welcome = parsed_content["response"]["character2_welcome"]

    { character1_welcome: character1_welcome, character2_welcome: character2_welcome }
  end

  private

  def parse_json_content(content)
    JSON.parse(content)
  rescue JSON::ParserError
    {} # パースに失敗した場合は空のハッシュを返す
  end
end
