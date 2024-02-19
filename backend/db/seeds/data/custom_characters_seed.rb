# CustomCharacterのレコードを一括で作成するための配列を初期化
custom_characters_data = Character.all.map do |character|
  {
    user_id: nil,
    character_id: character.id,
    role: CustomCharacter.roles[:admin],
    public: true,
    created_at: Time.current,
    updated_at: Time.current
  }
end

# CustomCharacterのレコードをバルクインサート
CustomCharacter.insert_all(custom_characters_data)
