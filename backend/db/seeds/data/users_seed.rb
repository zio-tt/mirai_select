# ユーザーデータの作成

users = [
  {
    uid: "111111111111111111111",
    provider: "google",
    name: "テスト太郎",
    email: "test@example.com",
    avatar: "",
    token: 300
  },
  {
    uid: "222222222222222222222",
    provider: "google",
    name: "テスト次郎",
    email: "test2@example.com",
    avatar: "",
    token: 300
  },
  {
    uid: "333333333333333333333",
    provider: "google",
    name: "テスト三郎",
    email: "test3@example.com",
    avatar: "",
    token: 300
  }
]

users.each do |user|
  User.create(user)
end