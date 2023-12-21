class DeleteAvatarColumn < ActiveRecord::Migration[7.0]
  def up
    remove_column :characters, :avatar
  end
  def down
    add_column :characters, :avatar, :string
  end
end
