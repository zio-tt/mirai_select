# 天使のデータ
Character.create(
  name: '天使',
  mbti_type: 0,
  tone: 0,
  first_person: '私',
  expression: 0,
  values: '信仰',
  dialogue_style: 0,
)

# 悪魔のデータ
Character.create(
  name: '悪魔',
  mbti_type: 10,
  tone: 1,
  first_person: 'オレ様',
  expression: 1,
  values: 'イタズラ好き',
  dialogue_style: 1
)

# ユーザーの作成
user = User.create(
  uid: '110699395209413308809',
  provider: 'google',
  name: '寺尾友宏',
  email: 'zio.tt.dev@gmail.com',
  avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIVi6TfTXwVuAp0tIsTPJrysfMcX-eX9HukxJ1Z4uuQzQ=s96-c',
  token: 1000
)

# 既存のキャラクター（天使と悪魔）を取得
angel = Character.find_by(name: '天使')
demon = Character.find_by(name: '悪魔')

# 作成したユーザーに対して天使と悪魔のキャラクターを追加
UserCharacter.create(user_id: user.id, character_id: angel.id, role: :character1)
UserCharacter.create(user_id: user.id, character_id: demon.id, role: :character2)
