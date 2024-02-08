class CreateDecisionCharacters < ActiveRecord::Migration[7.0]
  def change
    create_table :decision_characters do |t|
      t.references :decision, null: false, foreign_key: true
      t.references :character, null: false, foreign_key: true
      t.integer :role

      t.timestamps
    end
  end
end
