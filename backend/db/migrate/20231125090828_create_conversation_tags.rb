class CreateConversationTags < ActiveRecord::Migration[7.0]
  def change
    create_table :conversation_tags do |t|
      t.references :conversation, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
