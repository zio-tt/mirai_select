class CharacterResponse < ApplicationRecord
  belongs_to :character
  belongs_to :conversation

  # フロントエンドの形式に合わせて特定のデータだけを抜き出すscope
  # conversation_id, character_id, responseのみを抜き出す
  scope :select_response, -> { select(:conversation_id, :character_id, :response) }
end
