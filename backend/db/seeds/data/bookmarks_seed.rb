# 1つのdecisionに対して、4〜6個のbookmarkを作成する
# user_idはdecision_id以外のuser_idを持つ
Decision.all.each do |decision|
  rand(4..6).times do
    Bookmark.create(
      user_id: User.where.not(id: decision.user_id).sample.id,
      decision_id: decision.id
    )
  end
end