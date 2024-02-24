bookmarks_data = []

Decision.find_each do |decision|
  # decisionのuser_idを除外したユーザーIDのリストを取得
  available_user_ids = User.where.not(id: decision.user_id).pluck(:id)

  rand(4..6).times do
    # ランダムにユーザーIDを選択
    user_id = available_user_ids.sample
    bookmarks_data << {
      user_id: user_id,
      decision_id: decision.id,
      created_at: Time.current, # タイムスタンプを設定
      updated_at: Time.current
    }
  end
end

# Bookmarkのレコードをバルクインサート
Bookmark.insert_all(bookmarks_data)
