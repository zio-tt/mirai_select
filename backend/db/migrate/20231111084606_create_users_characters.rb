class CreateUsersCharacters < ActiveRecord::Migration[7.0]
  def change
    create_table :users_characters do |t|
      t.references :user, null: false, foreign_key: true
      t.references :character, null: false, foreign_key: true
      t.integer :role

      t.timestamps
    end
  end
end
