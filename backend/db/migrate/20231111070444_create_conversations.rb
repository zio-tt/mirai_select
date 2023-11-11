class CreateConversations < ActiveRecord::Migration[7.0]
  def change
    create_table :conversations do |t|
      t.references :decision, null: false, foreign_key: true
      t.integer :user_decision
      t.text :query_text

      t.timestamps
    end
  end
end
