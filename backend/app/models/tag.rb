class Tag < ApplicationRecord
  has_many :template_tags, dependent: :destroy
  has_many :decision_tags, dependent: :destroy
end
