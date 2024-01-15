class CommentsController < ApplicationController
  before_action :set_comment, only: [:destroy]
  
  def create
    @comment = Comment.new(
      user_id: comment_params[:user_id],
      decision_id: comment_params[:decision_id],
      content: comment_params[:content]
    )
    if @comment.save
      render json: { comments: Comment.all }
    else
      render json: { error: 'Unable to create comment.' }
    end
  end

  def destroy
    @comment.destroy!
    
    render json: { comments: Comment.all }
  end

  private

  def comment_params
    params.require(:comment).permit(:user_id, :decision_id, :content)
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end