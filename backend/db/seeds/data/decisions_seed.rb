# users_seed.rbで作成したユーザーを取得
users = User.where("name LIKE ?", "%テスト%")

# Decisionを50個作成する
# usersの中からランダムに1人を選び、そのidをuser_idに代入
# publicは必ずtrueにする
50.times do
  Decision.create(
    user_id: users.sample.id,
    public: true
  )
end