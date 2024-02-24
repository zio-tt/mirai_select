class Api::CustomCharactersController < ApplicationController
  def index
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
    render json: { custom_characters: custom_characters }
  end
end
