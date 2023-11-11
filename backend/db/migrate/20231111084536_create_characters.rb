class CreateCharacters < ActiveRecord::Migration[7.0]
  def change
    create_table :characters do |t|
      t.string :name
      t.string :avatar
      t.integer :mbti_type
      t.integer :tone
      t.string :first_person
      t.string :second_person
      t.integer :expression
      t.string :values
      t.integer :dialogue_style

      t.timestamps
    end
  end
end
