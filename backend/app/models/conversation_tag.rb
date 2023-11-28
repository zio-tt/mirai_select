class ConversationTag < ApplicationRecord
  belongs_to :conversation
  belongs_to :tag
end
