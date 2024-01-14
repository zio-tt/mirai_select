class Conversation < ApplicationRecord
  has_many :character_responses, dependent: :destroy
  belongs_to :decision
end
