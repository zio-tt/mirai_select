class UpdateCharactersTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :characters, :welcome_text, :text, default: "", null: false
    add_column :characters, :character1_welcome, :text
    add_column :characters, :character2_welcome, :text
  end
end
