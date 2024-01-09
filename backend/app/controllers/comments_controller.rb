class CommentsController < ApplicationController
  def create
    decision_id = params[:selectedDecision]["id"]
    user_uid = params[:selectedDecision]["uid"]
    @user = User.find_by(uid: user_uid)
    @decision = Decision.find(decision_id)
    @comments = params[:comments]
    @comments.each do |comment|
      @decision.comments.create(
        user_id: @user.id,
        content: comment["content"]
      )
    end

    render json: { comments: @decision.comments }
  end
end
