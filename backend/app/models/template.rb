class Template < ApplicationRecord
  has_many :template_tags, dependent: :destroy
end
