class CreateDecisions < ActiveRecord::Migration[7.0]
  def change
    create_table :decisions do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :public

      t.timestamps
    end
  end
end
