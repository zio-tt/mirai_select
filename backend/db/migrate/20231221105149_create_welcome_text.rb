class CreateWelcomeText < ActiveRecord::Migration[7.0]
  def up
    add_column :characters, :welcome_text, :text, null: false, default: ''
  end
  def down
    remove_column :characters, :welcome_text, :text
  end
end
