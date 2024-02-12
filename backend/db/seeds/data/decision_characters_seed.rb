# 各decisionに対して、role:1にnameが天使のキャラクター, role:2にnameが悪魔のキャラクターを持たせる
# 存在するdecisino全てに対して繰り返す

Decision.all.each do |decision|
  DecisionCharacter.create!(
    decision_id: decision.id,
    character_id: Character.find_by(name: '天使').id,
    role: 1
  )
  DecisionCharacter.create!(
    decision_id: decision.id,
    character_id: Character.find_by(name: '悪魔').id,
    role: 2
  )
end