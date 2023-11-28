class CharacterResponse < ApplicationRecord
  belongs_to :character
  belongs_to :conversation
end
