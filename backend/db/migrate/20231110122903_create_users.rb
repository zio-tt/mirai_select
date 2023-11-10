class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :uid, null: false
      t.string :provider, null: false
      t.string :name, null: false, default: "名無し"
      t.string :email
      t.string :avatar
      t.integer :token, null: false, default: 1000

      t.timestamps
    end

    add_index :users, [:provider, :uid], unique: true
  end
end
