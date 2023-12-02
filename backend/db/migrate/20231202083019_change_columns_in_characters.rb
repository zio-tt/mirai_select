class ChangeColumnsInCharacters < ActiveRecord::Migration[7.0]
  def change
    # toneとかぶっているのでdialogue_styleを削除
    remove_column :characters, :dialogue_style, :integer
    # キャラクター設定としてempathyを追加
    add_column :characters, :empathy, :integer, null: false, default: 0

    # 各項目をnull: false, default: 0に変更
    change_column :characters, :name, :string, null: false, default: "名無し"
    change_column :characters, :mbti_type, :integer, null: false, default: 0
    change_column :characters, :expression, :integer, null: false, default: 0
    change_column :characters, :tone, :integer, null: false, default: 0
    change_column :characters, :first_person, :string, null: false, default: "私"
    change_column :characters, :second_person, :string, null: false, default: "あなた"
  end
end
