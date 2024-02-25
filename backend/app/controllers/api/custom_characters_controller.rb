class Api::CustomCharactersController < ApplicationController
  def index
    # Characteの中でis_deletedがfalseのものを取得
    active_characters = Character.active

    # ログイン中のユーザーが利用できるキャラクターのリストを取得
    # 以下の条件を満たす場合、キャラクターを利用できる
    # 1. ログイン中のユーザーが作成したキャラクター
    # 2. publicフラグがtrueのキャラクター
    # 3. roleがadminのキャラクター
    my_characters = current_user.custom_characters
    # 詳細的に他ユーザーのキャラクターを取得するかは検討中
    # public_characters = CustomCharacter.where(public: true)
    admin_characters = CustomCharacter.where(role: :admin)
    custom_characters = (my_characters + admin_characters).flatten.uniq

    # custom_charactersの中で、active_charactersに含まれるものを取得
    # ただし、custom_charactersはCharacterと紐づくCustomCharacterの配列であるため、
    # custom_charactersのchracter_idとactive_charactersのidを比較する

    custom_characters = custom_characters.map do |custom_character|
      custom_character if active_characters.pluck(:id).include?(custom_character.character_id)
    end

    # custom_charactersの中でnilを取り除く
    custom_characters = custom_characters.compact

    render json: { custom_characters: custom_characters }
  end
end
