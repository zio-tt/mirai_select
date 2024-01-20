# 全てのConversationに対して、必ず2つのCharacterResponseを作成する
# 2つのCharacterResponseはそれぞれ"悪魔"と"天使"の反応を表す
characters = ["悪魔", "天使"]

Conversation.all.each do |conversation|
  characters.each do |character|
    CharacterResponse.create(
      conversation_id: conversation.id,
      character_id: Character.find_by(name: character).id,
      response: Faker::Lorem.sentence
    )
  end
end