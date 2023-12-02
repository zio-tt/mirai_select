# ユーザーデータの作成

users = [
  {
    uid: '000000000000000000001',
    provider: 'google',
    name: 'test1',
    email: 'test1@example.com',
    avatar: '',
  },
  {
    uid: '000000000000000000002',
    provider: 'google',
    name: 'test2',
    email: 'test2@example.com',
    avatar: '',
  },
  {
    uid: '000000000000000000003',
    provider: 'google',
    name: 'test3',
    email: 'test3@example.com',
    avatar: '',
  },
  {
    uid: '000000000000000000004',
    provider: 'google',
    name: 'test4',
    email: 'test4@example.com',
    avatar: '',
  },
]

users.each do |user|
  User.create(user)
end