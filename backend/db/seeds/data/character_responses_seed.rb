# "悪魔"と"天使"のキャラクターIDを事前に取得
character_ids = Character.where(name: ["悪魔", "天使"]).pluck(:name, :id).to_h

# CharacterResponseデータを一括作成するための配列
character_responses_data = []

Conversation.find_each do |conversation|
  ["悪魔", "天使"].each do |character_name|
    character_responses_data << {
      conversation_id: conversation.id,
      character_id: character_ids[character_name],
      response: Faker::Lorem.sentence,
      created_at: Time.current,
      updated_at: Time.current
    }
  end
end

# CharacterResponseのレコードをバルクインサート
CharacterResponse.insert_all(character_responses_data)
