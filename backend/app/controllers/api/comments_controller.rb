class Api::CommentsController < ApplicationController
  before_action :set_comment, only: [:destroy]
  
  def index
    render json: { comments: Comment.all }
  end

  def create
    @comment = Comment.new(
      user_id: current_user.id,
      decision_id: decision_id_params,
      content: content_params
    )
    if @comment.save
      render json: Comment.all
    else
      render json: { error: 'Unable to create comment.' }
    end
  end

  def destroy
    @comment.destroy!
    
    render json: { comments: Comment.all }
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def content_params
    params.require(:content)
  end

  def decision_id_params
    params.require(:decision_id)
  end
end