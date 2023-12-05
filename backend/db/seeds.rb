load Rails.root.join('db/seeds/users_seed.rb')
load Rails.root.join('db/seeds/characters_seed.rb')

users      = User.all
characters = Character.all

# ユーザーに紐づくキャラクターの設定
users.each do |user|
  this_user_characters = characters.sample(2)
  UserCharacter.create(user_id: user.id, character_id: this_user_characters[0].id, role: :character1)
  UserCharacter.create(user_id: user.id, character_id: this_user_characters[1].id, role: :character2)
end

load Rails.root.join('db/seeds/templates_seed.rb')
load Rails.root.join('db/seeds/tags_seed.rb')

# 会話履歴の作成
# Decision
decisions = []
users.each do |user|
  Decision.create(user_id: user.id, public: true)
end

# input
inputs = [
  {
    query_text: "春におすすめの旅行先を教えてください",
    tags: ["春", "旅行"],
    character1_response: "春におすすめの旅行先ですね。私は桜が好きなので、桜の名所を巡るのがおすすめです。",
    character2_response: "春におすすめの旅行先といえば、やっぱり沖縄ですね。"
  },
  {
    query_text: "夏におすすめの旅行先を教えてください",
    tags: ["夏", "旅行"],
    character1_response: "夏におすすめの旅行先ですね。私は海が好きなので、海のある場所を巡るのがおすすめです。",
    character2_response: "夏におすすめの旅行先といえば、やっぱり北海道ですね。"
  },
  {
    query_text: "秋におすすめの旅行先を教えてください",
    tags: ["秋", "旅行"],
    character1_response: "秋におすすめの旅行先ですね。私は紅葉が好きなので、紅葉の名所を巡るのがおすすめです。",
    character2_response: "秋におすすめの旅行先といえば、やっぱり京都ですね。"
  }
]

# Conversation
users.each do |user|
  input = inputs.sample
  decision = Decision.find_by(user_id: user.id)
  conversation = Conversation.create(decision_id: decision.id, query_text: input[:query_text], user_decision: 1)
  input[:tags].each do |tag|
    if !Tag.find_by(name: tag)
      Tag.create(name: tag)
    end
  end
  input[:tags].each do |tag|
    DecisionTag.create(decision_id: decision.id, tag_id: Tag.find_by(name: tag).id)
  end
  CharacterResponse.create(conversation_id: conversation.id, character_id: user.user_characters[0].character_id, response: input[:character1_response])
  CharacterResponse.create(conversation_id: conversation.id, character_id: user.user_characters[1].character_id, response: input[:character2_response])
end