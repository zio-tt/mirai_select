class Admin::CommentsController < ApplicationController
  def index
    comments = Comment.all
    render json: comments
  end

  def show
    comment = Comment.find(params[:id])
    render json: comment
  end

  def update
    comment = Comment.find(params[:id])
    comment.update!(comment_params)
    render json: comment
  end

  def destroy
    comment = Comment.find(params[:id])
    comment.destroy
    head :no_content
  end

  private

  def comment_params
    params.require(:comment).permit(:id, :user_id, :decision_id, :content)
  end
end