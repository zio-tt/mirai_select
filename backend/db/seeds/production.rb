# # 既に存在しているCharacterを新規作成するキャラクターに置き換える作業
# # character_idを利用しているテーブル
#   # has_many :character_responses, dependent: :destroy
#   # has_many :user_characters, dependent: :destroy
#   # has_many :custom_characters, dependent: :destroy
#   # has_many :decision_characters, dependent: :destroy
# # これらのテーブルのcharacter_idを新しいキャラクターに置き換える
# # ただし、現在存在しているキャラクターは"天使","悪魔"の名前を持つキャラクターがそれぞれ複数いる
# # これらのキャラクターを新しく作成する"天使","悪魔"に置き換える
# # つまり、最新の天使(Character.where(name: "天使").last)と悪魔(Character.where(name: "悪魔").last)に現在のデータを置き換えるということ

# # 既に存在している"天使","悪魔"のcharacter_idリストを取得
# old_angels = Character.where(name: "天使").pluck(:id)
# old_devils = Character.where(name: "悪魔").pluck(:id)

# # キャラクターを追加・作成
# load Rails.root.join('db/seeds/data/characters_seed.rb')

# # まず、最新の天使、悪魔を取得
# angel = Character.where(name: "天使").last
# devil = Character.where(name: "悪魔").last

# # それぞれのcharacter_idを持つテーブルのcharacter_idを新しい天使、悪魔に置き換える
# CharacterResponse.where(character_id: old_angels).update_all(character_id: angel.id)
# CharacterResponse.where(character_id: old_devils).update_all(character_id: devil.id)
# UserCharacter.where(character_id: old_angels).update_all(character_id: angel.id)
# UserCharacter.where(character_id: old_devils).update_all(character_id: devil.id)
# CustomCharacter.where(character_id: old_angels).update_all(character_id: angel.id)
# CustomCharacter.where(character_id: old_devils).update_all(character_id: devil.id)
# DecisionCharacter.where(character_id: old_angels).update_all(character_id: angel.id)
# DecisionCharacter.where(character_id: old_devils).update_all(character_id: devil.id)

# # 古い天使、悪魔を削除
# Character.where(id: old_angels).destroy_all
# Character.where(id: old_devils).destroy_all

# # DecisionCharacterが存在していないDecisionが存在する場合、
# # DecisionCharacterを作成する
# # その際、role: :character1はangel, role: :character2はdevilになるように作成する
# Decision.find_each do |decision|
#   if DecisionCharacter.where(decision_id: decision.id).empty?
#     DecisionCharacter.create(decision_id: decision.id, character_id: angel.id, role: :character1)
#     DecisionCharacter.create(decision_id: decision.id, character_id: devil.id, role: :character2)
#   end
# end

# load Rails.root.join('db/seeds/data/custom_characters_seed.rb')