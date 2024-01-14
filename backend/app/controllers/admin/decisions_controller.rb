class Admin::DecisionsController < ApplicationController
  def index
    decisions = Decision.all
    render json: decisions
  end

  def show
    decision = Decision.find(params[:id])
    render json: decision
  end

  def update
    decision = Decision.find(params[:id])
    decision.update!(decision_params)
    render json: decision
  end

  def destroy
    decision = Decision.find(params[:id])
    decision.destroy
    head :no_content
  end

  private

  def decision_params
    params.require(:decision).permit(:id, :user_id, :public)
  end
end