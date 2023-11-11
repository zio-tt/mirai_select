class CharactersResponse < ApplicationRecord
  belongs_to :conversation
  belongs_to :character
end
