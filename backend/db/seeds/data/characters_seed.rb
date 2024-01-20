characters = [
  {
    name:          '天使',
    avatar:        'public/top/angel.png',
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
    avatar:        'public/top/devil.png',
    mbti_type:     :ENTP,
    tone:          :casual,
    first_person:  'オレ様',
    second_person: 'オマエ',
    expression:    :irresponsible,
    values:        'イタズラ好き',
    empathy:       :low
  }
]

characters.each do |character_data|
  character = Character.create(
    name: character_data[:name],
    mbti_type: character_data[:mbti_type],
    tone: character_data[:tone],
    first_person: character_data[:first_person],
    second_person: character_data[:second_person],
    expression: character_data[:expression],
    values: character_data[:values],
    empathy: character_data[:empathy]
  )

  # アバター画像をアタッチ
  avatar_path = character_data[:avatar]
  filename = File.basename(avatar_path)
  character.avatar.attach(io: File.open(avatar_path), filename: filename)
end