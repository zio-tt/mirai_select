# 50個作成するdecisionのdecision_tagsをtags_seed.rbで作成したタグからランダムに3つ選び、そのidをtag_idに代入
50.times do
  DecisionTag.create(
    decision_id: Decision.all.sample.id,
    tag_id: Tag.all.sample.id
  )
end