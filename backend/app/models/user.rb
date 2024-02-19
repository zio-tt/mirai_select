class User < ApplicationRecord
  has_many :decisions, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :user_characters, dependent: :destroy
  has_many :custom_characters, dependent: :destroy
  has_many :characters, through: :user_characters

  has_many :bookmarked_decisions, through: :bookmarks, source: :decision
  has_many :commented_decisions, through: :comments, source: :decision

  after_create :create_default_user_characters

  scope :select_attributes, -> { select(:id, :name, :avatar, :token) }

  def decrease_token(text_length)
    self.token -= text_length
    self.save!
  end

  private

  def create_default_user_characters
    @character1 = Character.find_by(name: "天使")
    @character2 = Character.find_by(name: "悪魔")

    UserCharacter.create(user_id: self.id, character_id: @character1.id, role: :character1)
    UserCharacter.create(user_id: self.id, character_id: @character2.id, role: :character2)
  end
end
