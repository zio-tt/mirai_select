class CreateDecisionTags < ActiveRecord::Migration[7.0]
  def change
    create_table :decision_tags do |t|
      t.references :decision, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
