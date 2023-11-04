class CreateCharacters < ActiveRecord::Migration[7.0]
  def change
    create_table :characters do |t|
      t.string :name
      t.string :image_url
      t.integer :personality
      t.integer :speaking_style
      t.integer :values
      t.integer :optimism
      t.integer :humor

      t.timestamps
    end
  end
end
