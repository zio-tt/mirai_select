class HelperController < ApplicationController
  def callback
    # 毎週月曜日にトークンを付与
    add_token(current_user)

    # ユーザー情報・キャラクタ情報の取得
    @user = { id: current_user.id, name: current_user.name, token: current_user.token }
    @user_characters = Character.where(id: current_user.user_characters.pluck(:character_id))

    # 各キャラクターに対してavatar URLを取得してマージ
    characters_with_avatar = @user_characters.map do |character|
      character_attributes = character.attributes
      avatar_url = url_for(character.avatar) if character.avatar.attached?
      character_attributes.merge(avatar: avatar_url)
    end

    render json: { 
      user: @user,
      characters: characters_with_avatar
    }
  end

  private

  def add_token(user)
    monday_count = count_mondays_since_last_update(user)
  
    # 月曜日ごとに100トークンを付与するが、最大300トークンまで
    if monday_count > 0
      new_token_count = [user.token + monday_count * 100, 300].min
      user.update(token: new_token_count, updated_at: Time.current)
    end
  end

  def count_mondays_since_last_update(user)
    last_reset = user.updated_at.to_date
    today = Date.today
    days_count = (today - last_reset).to_i

    return 0 if last_reset == today
    if days_count >= 7
      return days_count / 7
    else
      return (last_reset..today).count { |date| date.monday? }
    end
  end
end