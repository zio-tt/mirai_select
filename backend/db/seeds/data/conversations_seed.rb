# 1つのdecisionにつき、1つか2つのconversationを作成する
Decision.all.each do |decision|
  (rand(1..2)).times do
    Conversation.create(
      decision_id: decision.id,
      user_decision: rand(0..1),
      query_text: Faker::Lorem.sentence
    )
  end
end