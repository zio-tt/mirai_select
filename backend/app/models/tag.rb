class Tag < ApplicationRecord
  has_many :decision_tags, dependent: :destroy
end
