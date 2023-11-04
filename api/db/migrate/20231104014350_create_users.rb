class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false, default: "名無し"
      t.string :provider, null: false
      t.string :uid, null: false
      t.integer :tokens, null: false, default: 1000

      t.timestamps
    end

    # ソーシャルログインにおける一意性の確保
    add_index :users, [:provider, :uid], unique: true
  end
end
