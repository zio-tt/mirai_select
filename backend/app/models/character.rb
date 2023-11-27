class Character < ApplicationRecord
  has_many :character_responses, dependent: :destroy
  has_many :user_characters, dependent: :destroy

  # 性格(MBTI)
  enum mbti_type: {
    "istj": 0, "isfj": 1, "infj": 2, "intj": 3,
    "istp": 4, "isfp": 5, "infp": 6, "intp": 7,
    "estp": 8, "esfp": 9, "enfp": 10, "entp": 11,
    "estj": 12, "esfj": 13, "enfj": 14, "entj": 15
  }
  # 口調
  enum tone: { 敬語: 0, カジュアル: 1, フランク: 2 }
  # 感情表現
  enum expression: { 冷静: 0, 感情豊か: 1, 熱狂的: 2 }
  # 喋り方
  enum dialogue_style: { 語彙豊か: 0, ざっくばらん: 1, 簡潔明瞭: 2 }
end
