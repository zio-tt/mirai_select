class User < ApplicationRecord
  has_many :decisions, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :user_characters, dependent: :destroy
  has_many :characters, through: :user_characters

  has_many :decision_bookmarks, through: :decision, source: :bookmarks
  has_many :decision_comments, through: :decision, source: :comments

  after_create :create_default_user_characters

  private

  def create_default_user_characters
    @character1 = Character.find_by(name: "天使")
    @character2 = Character.find_by(name: "悪魔")

    UserCharacter.create(user_id: self.id, character_id: @character1.id, role: :character1)
    UserCharacter.create(user_id: self.id, character_id: @character2.id, role: :character2)
  end
end
