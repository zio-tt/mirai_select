class DecisionCharacter < ApplicationRecord
  belongs_to :decision
  belongs_to :character

  enum role: { character1: 1, character2: 2 }
end
