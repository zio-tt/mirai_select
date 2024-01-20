# 1つのdecisionに対して、4〜6個のcommentを作成する
Decision.all.each do |decision|
  (rand(4..6)).times do
    Comment.create(
      user_id: User.all.sample.id,
      decision_id: decision.id,
      content: Faker::Lorem.sentence
    )
  end
end