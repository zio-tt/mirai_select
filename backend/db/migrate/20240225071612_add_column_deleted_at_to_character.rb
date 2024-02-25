class AddColumnDeletedAtToCharacter < ActiveRecord::Migration[7.0]
  def change
    add_column :characters, :is_deleted, :boolean, default: false
  end
end
