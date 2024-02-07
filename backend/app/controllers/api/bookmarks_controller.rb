class Api::BookmarksController < ApplicationController
  before_action :set_bookmark, only: [:destroy]

  def index
    render json: { bookmarks: Bookmark.all }
  end

  def create
    # decision_id = bookmark_params, user_id = current_user.idの条件を満たすbookmarkが存在するかどうか
    # 存在する場合はそのままrender json: { bookmarks: Bookmark.all }を返す
    # 存在しない場合はBookmark.new(decision_id: bookmark_params, user_id: current_user.id)を作成してsaveする
    @bookmark = Bookmark.find_or_create_by!(decision_id: bookmark_params, user_id: current_user.id)
    render json: { bookmarks: Bookmark.all }
  end

  def destroy
    @bookmark.destroy!
    
    render json: { bookmarks: Bookmark.all }
  end

  private

  def bookmark_params
    params.require(:decisionId)
  end

  def set_bookmark
    @bookmark = Bookmark.find_by(
      decision_id: params[:id],
      user_id: current_user.id
    )
  end
end
