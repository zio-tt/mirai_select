class BookmarksController < ApplicationController
  before_action :set_bookmark, only: [:destroy]

  def create
    @bookmark = current_user.bookmarks.build(decision_id: bookmark_params)

    if @bookmark.save
      render json: { bookmarks: Bookmark.all }
    else
      render json: { error: 'Unable to create bookmark.' }
    end
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
    @bookmark = Bookmark.find(params[:id])
  end
end
