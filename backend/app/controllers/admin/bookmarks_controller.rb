class Admin::BookmarksController < ApplicationController
  def index
    bookmarks = Bookmark.all
    render json: bookmarks
  end

  def show
    bookmark = Bookmark.find(params[:id])
    render json: bookmark
  end

  def update
    bookmark = Bookmark.find(params[:id])
    bookmark.update!(bookmark_params)
    render json: bookmark
  end

  def destroy
    bookmark = Bookmark.find(params[:id])
    bookmark.destroy
    head :no_content
  end

  private

  def bookmark_params
    params.require(:bookmark).permit(:id, :user_id, :decision_id)
  end
end