characters = [
  {
    name:          '天使',
    mbti_type:     :INFJ,
    tone:          :polite,
    first_person:  '私',
    second_person: 'あなた',
    expression:    :kind,
    values:        '信仰',
    empathy:       :high,
  },
  {
    name:          '悪魔',
    mbti_type:     :ENTP,
    tone:          :casual,
    first_person:  'オレ様',
    second_person: 'オマエ',
    expression:    :irresponsible,
    values:        'イタズラ好き',
    empathy:       :low,
  },
  {
    name:          "探偵",
    mbti_type:     :ISTJ,
    tone:          :logical,
    first_person:  "私",
    second_person: "君",
    expression:    :humorous,
    values:        "論理と真実",
    empathy:       :low,
  },
  {
    name:          "冒険家",
    mbti_type:     :ESTP,
    tone:          :energetic,
    first_person:  "オレ",
    second_person: "君",
    expression:    :passionate,
    values:        "自由と冒険",
    empathy:       :moderate,
  },
  {
    name:          "学者",
    mbti_type:     :INFP,
    tone:          :confident,
    first_person:  "私",
    second_person: "君",
    expression:    :serious,
    values:        "知識と真実",
    empathy:       :low,
  },
  {
    name:          "芸術家",
    mbti_type:     :ISFP,
    tone:          :casual,
    first_person:  "私",
    second_person: "君",
    expression:    :creative,
    values:        "自由と創造",
    empathy:       :high,
  }
]

characters.each do |character|
  Character.create(character)
end