class ChangeDefaultTokenInUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_default :users, :token, from: 1000, to: 300
  end
end
