class UserCharacter < ApplicationRecord
  belongs_to :user
  belongs_to :character

  enum role: { character1: 1, character2: 2 }
end
