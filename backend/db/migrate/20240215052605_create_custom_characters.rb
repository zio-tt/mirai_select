class CreateCustomCharacters < ActiveRecord::Migration[7.0]
  def change
    create_table :custom_characters do |t|
      t.references :user, null: true, foreign_key: true
      t.references :character, null: false, foreign_key: true
      t.integer :role
      t.boolean :public

      t.timestamps
    end

    add_index :custom_characters, [:character_id, :user_id], unique: true
  end
end
