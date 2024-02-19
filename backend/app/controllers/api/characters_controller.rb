class Api::CharactersController < ApplicationController
  before_action :set_character, only: [:update, :destroy]

  def index
    if condition_params == "all"
      characters = add_avatar_url(Character.all)
    elsif condition_params == "decision"
      # decision_id_paramsからdecision_idを取得
      # 必要なデータを取得するためのクエリ
      raw_characters = Character
      .joins(user_characters: { user: { decisions: :user } })
      .where(decisions: { id: decision_id_params })

      characters = add_avatar_url(raw_characters)
    end

    render json: { characters: characters }
  end

  def update
    # avatarの更新
    # avatarがnil出ない場合、binaryデータをActiveStorageに保存する
    # @characterにhas_one_attachedで紐づけることで、avatarを更新することができる
    if avatar_params
      @character.avatar.attach(avatar_params)
    end
    # characterの更新
    if @character.update(character_params)
      # 更新に成功した場合、更新したcharacterを返す
      character = @character.attributes.merge(avatar: rails_blob_url(@character.avatar)) if @character.avatar.attached?
      characters = add_avatar_url(Character.all)
      render json: { character: character, characters: characters }
    else
      # 更新に失敗した場合、エラーメッセージを返す
      render json: { error: @character.errors.full_messages }
    end
  end

  private

  def condition_params
    params.require(:condition)
  end

  def decision_id_params
    params.require(:decisionId)
  end

  def set_character
    @character = Character.find(params[:id])
  end

  # Frontendから送られてくるcharacterのデータを取得
  def character_params
    params.require(:character).permit(
      :name,
      :mbti_type,
      :tone,
      :expression,
      :values,
      :empathy,
      :character1_welcome,
      :character2_welcome,
    )
  end

  # Frontendから送られてくるavatarのバイナリデータを取得
  # avatarがない場合はnilを返す
  def avatar_params
    if params[:avatar]
      params.require(:avatar)
    else
      nil
    end
  end

  # Characterの配列にavatarのURLを追加する
  def add_avatar_url(characters)
    characters.map do |character|
      avatar_url = rails_blob_url(character.avatar) if character.avatar.attached?
      character.attributes.merge(avatar: avatar_url)
    end
  end
end
