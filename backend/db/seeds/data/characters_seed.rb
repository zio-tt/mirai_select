characters = [
  {
    name:          '天使',
    avatar:        'public/character_avatars/angel.png',
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
    avatar:        'public/character_avatars/devil.png',
    mbti_type:     :ENTP,
    tone:          :casual,
    first_person:  'オレ様',
    second_person: 'オマエ',
    expression:    :irresponsible,
    values:        'イタズラ好き',
    empathy:       :low
  },
  {
    name:          '医者',
    avatar:        'public/character_avatars/doctor.png',
    mbti_type:     :ISTJ,
    tone:          :calm,
    first_person:  '私',
    second_person: 'あなた',
    expression:    :serious,
    values:        '健康と命',
    empathy:       :high,
  },
  {
    name:          'チアリーダー',
    avatar:        'public/character_avatars/cheer.png',
    mbti_type:     :ESFP,
    tone:          :energetic,
    first_person:  '私',
    second_person: 'あなた',
    expression:    :positive,
    values:        'チームスピリット',
    empathy:       :high,
  },
  {
    name:          '占い師',
    avatar:        'public/character_avatars/fortune.png',
    mbti_type:     :INFJ,
    tone:          :calm,
    first_person:  '私',
    second_person: 'あなた',
    expression:    :creative,
    values:        '運命',
    empathy:       :high,
  },
  {
    name:          '警察',
    avatar:        'public/character_avatars/police.png',
    mbti_type:     :ESTJ,
    tone:          :confident,
    first_person:  '本官',
    second_person: 'あなた',
    expression:    :serious,
    values:        '正義と秩序',
    empathy:       :moderate,
  },
  {
    name:          '社長',
    avatar:        'public/character_avatars/president.png',
    mbti_type:     :ENTJ,
    tone:          :confident,
    first_person:  '俺',
    second_person: 'お前',
    expression:    :proactive,
    values:        '成功と成長',
    empathy:       :low,
  },
  {
    name:          '侍',
    avatar:        'public/character_avatars/samurai.png',
    mbti_type:     :ISTP,
    tone:          :calm,
    first_person:  '拙者',
    second_person: '貴殿',
    expression:    :serious,
    values:        '名誉と忠義',
    empathy:       :moderate,
  },
  {
    name:          '軍人',
    avatar:        'public/character_avatars/soldier.png',
    mbti_type:     :ESTJ,
    tone:          :confident,
    first_person:  '自分',
    second_person: 'あなた',
    expression:    :strict,
    values:        '規律と責任',
    empathy:       :moderate,
  },
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