class Tag < ApplicationRecord
  has_many :template_tags, dependent: :destroy
  has_many :conversation_tags, dependent: :destroy
end
