class CharacterResponse < ApplicationRecord
  belongs_to :decision_conversation
  belongs_to :character
end
