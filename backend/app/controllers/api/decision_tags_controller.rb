class Api::DecisionTagsController < ApplicationController
  before_action :set_decision, only: [:create, :update, :destroy]

  def index
    render json: { decision_tags: DecisionTag.all }
  end

  def create
    tags_params.each do |tag|
      decision_tag = Tag.find_or_create_by(name: tag)
      DecisionTag.create(
        decision_id: @decision.id,
        tag_id: decision_tag.id
      )
    end

    render json: { message: 'Success to create decision_tag' }
  end

  def update
    
  end

  def destroy

  end

  private

  def set_decision
    @decision = Decision.find(params[:decisionId])
  end

  def tags_params
    params.require(:tags)
  end
end
