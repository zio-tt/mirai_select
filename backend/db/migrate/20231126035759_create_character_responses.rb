class CreateCharacterResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :character_responses do |t|
      t.references :conversation, null: false, foreign_key: true
      t.references :character, null: false, foreign_key: true
      t.text :response

      t.timestamps
    end
  end
end
