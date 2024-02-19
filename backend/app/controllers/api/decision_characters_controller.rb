class Api::DecisionCharactersController < ApplicationController
  before_action :set_decision, only: [:index]

  def index
    render json: { decision_characters: @decision.decision_characters }
  end

  private

  def set_decisio
    @decision = Decision.find(params[:id])
  end
end
