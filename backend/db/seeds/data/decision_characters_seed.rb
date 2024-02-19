# 事前に必要なUserCharacterを一括取得し、ユーザーIDに基づいてグループ化
user_characters_by_user = UserCharacter.where(role: [1, 2]).group_by(&:user_id)

# DecisionCharacterのレコードを一括で作成するための配列を初期化
decision_characters_data = []

Decision.find_each do |decision|
  # メモリ内のデータを使用して関連するUserCharacterを取得
  user_characters = user_characters_by_user[decision.user_id] || []

  user_characters.each do |character|
    decision_characters_data << {
      decision_id: decision.id,
      character_id: character.character_id,
      role: character.role
    }
  end
end

# DecisionCharacterのレコードをバルクインサート
DecisionCharacter.insert_all(decision_characters_data)