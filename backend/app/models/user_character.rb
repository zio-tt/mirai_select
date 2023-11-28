class UserCharacter < ApplicationRecord
  belongs_to :user
  belongs_to :character

  enum role: { character1: 1, character2: 2 }

  after_create :assign_default_characters

  private

  def assign_default_characters
    # 天使と悪魔のキャラクターIDを取得（ここでは仮に1と2とする）
    angel = Character.find_by(name: '天使').id
    demon = Character.find_by(name: '悪魔').id

    # UserCharacter.create(user_id: self.user_id, character_id: angel, role: :character1)
    # UserCharacter.create(user_id: self.user_id, character_id: demon, role: :character2)
  end
end
